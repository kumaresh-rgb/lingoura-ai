using Asp.Versioning;
using Lingoura.Application.Billing.Commands.CancelSubscription;
using Lingoura.Application.Billing.Commands.CreateCheckout;
using Lingoura.Application.Billing.DTOs;
using Lingoura.Application.Billing.Queries.GetPlans;
using Lingoura.Application.Billing.Queries.GetSubscription;
using Lingoura.Application.Common.Interfaces;
using Lingoura.Common.Constants;
using Lingoura.Shared.Responses;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace Lingoura.Api.Controllers.V1;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/billing")]
[Authorize]
public sealed class BillingController(ISender mediator, ICurrentUserService currentUser) : ControllerBase
{
    [HttpGet("plans")]
    [AllowAnonymous]
    public async Task<IActionResult> GetPlans(CancellationToken ct)
    {
        var result = await mediator.Send(new GetPlansQuery(), ct);
        return Ok(ApiResponse<IReadOnlyList<SubscriptionPlanDto>>.Ok(result.Value, traceId: HttpContext.TraceIdentifier));
    }

    [HttpGet("subscription")]
    public async Task<IActionResult> GetSubscription(CancellationToken ct)
    {
        if (currentUser.UserId is not { } userId)
            return Unauthorized(ApiResponse.Fail("Not authenticated", traceId: HttpContext.TraceIdentifier));

        var result = await mediator.Send(new GetSubscriptionQuery(userId), ct);
        if (!result.IsSuccess)
            return NotFound(ApiResponse.Fail(result.Error.Message, traceId: HttpContext.TraceIdentifier));

        return Ok(ApiResponse<SubscriptionDto>.Ok(result.Value, traceId: HttpContext.TraceIdentifier));
    }

    [HttpPost("checkout")]
    [EnableRateLimiting("auth")]
    public async Task<IActionResult> CreateCheckout(
        [FromBody] CreateCheckoutRequestDto dto, CancellationToken ct)
    {
        if (currentUser.UserId is not { } userId)
            return Unauthorized(ApiResponse.Fail("Not authenticated", traceId: HttpContext.TraceIdentifier));

        var ip        = HttpContext.Connection.RemoteIpAddress?.ToString();
        var userAgent = HttpContext.Request.Headers.UserAgent.ToString();

        var result = await mediator.Send(new CreateCheckoutCommand(
            userId, dto.Plan, dto.Interval,
            dto.SuccessUrl, dto.CancelUrl, dto.ProviderHint,
            ip, userAgent), ct);

        if (!result.IsSuccess)
            return BadRequest(ApiResponse.Fail(result.Error.Message, traceId: HttpContext.TraceIdentifier));

        var checkout = result.Value;

        if (checkout.Provider == "razorpay")
        {
            var razorpayDto = new RazorpayCheckoutResponseDto(
                checkout.OrderId!, checkout.AmountPaise!.Value,
                checkout.Currency!, checkout.KeyId!,
                checkout.SessionId, "razorpay");
            return Ok(ApiResponse<RazorpayCheckoutResponseDto>.Ok(razorpayDto, traceId: HttpContext.TraceIdentifier));
        }

        var stripeDto = new StripeCheckoutResponseDto(checkout.CheckoutUrl!, checkout.SessionId, "stripe");
        return Ok(ApiResponse<StripeCheckoutResponseDto>.Ok(stripeDto, traceId: HttpContext.TraceIdentifier));
    }

    [HttpDelete("subscription/cancel")]
    [EnableRateLimiting("auth")]
    public async Task<IActionResult> CancelSubscription([FromQuery] string reason, CancellationToken ct)
    {
        if (currentUser.UserId is not { } userId)
            return Unauthorized(ApiResponse.Fail("Not authenticated", traceId: HttpContext.TraceIdentifier));

        var result = await mediator.Send(new CancelSubscriptionCommand(userId, reason ?? "User requested"), ct);
        if (!result.IsSuccess)
            return BadRequest(ApiResponse.Fail(result.Error.Message, traceId: HttpContext.TraceIdentifier));

        return Ok(ApiResponse.Ok("Subscription will cancel at end of billing period.", HttpContext.TraceIdentifier));
    }

    [HttpGet("usage")]
    public async Task<IActionResult> GetUsage(
        [FromServices] IEntitlementService entitlement, CancellationToken ct)
    {
        if (currentUser.UserId is not { } userId)
            return Unauthorized(ApiResponse.Fail("Not authenticated", traceId: HttpContext.TraceIdentifier));

        var items = await entitlement.GetUsageSummaryAsync(userId, ct);
        var dtos  = items.Select(i => new UsageItemDto(i.Feature, i.Used, i.Limit, i.ResetAt)).ToList();

        return Ok(ApiResponse<IReadOnlyList<UsageItemDto>>.Ok(dtos, traceId: HttpContext.TraceIdentifier));
    }

    [HttpPost("usage/consume")]
    public async Task<IActionResult> ConsumeUsage(
        [FromBody] ConsumeUsageRequestDto dto,
        [FromServices] IEntitlementService entitlement,
        CancellationToken ct)
    {
        if (currentUser.UserId is not { } userId)
            return Unauthorized(ApiResponse.Fail("Not authenticated", traceId: HttpContext.TraceIdentifier));

        var result = await entitlement.ConsumeAsync(userId, dto.Feature, dto.IdempotencyKey, ct);

        if (!result.Allowed)
            return StatusCode(StatusCodes.Status429TooManyRequests,
                ApiResponse<ConsumeUsageResponseDto>.Ok(
                    new ConsumeUsageResponseDto(false, 0, result.ResetAt, result.DenialReason),
                    traceId: HttpContext.TraceIdentifier));

        return Ok(ApiResponse<ConsumeUsageResponseDto>.Ok(
            new ConsumeUsageResponseDto(true, result.Remaining, result.ResetAt, null),
            traceId: HttpContext.TraceIdentifier));
    }
}
