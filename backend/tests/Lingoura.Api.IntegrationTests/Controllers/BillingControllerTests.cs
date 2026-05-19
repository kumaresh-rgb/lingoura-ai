using FluentAssertions;
using Lingoura.Api.Controllers.V1;
using Lingoura.Application.Billing.Commands.CancelSubscription;
using Lingoura.Application.Billing.Commands.CreateCheckout;
using Lingoura.Application.Billing.DTOs;
using Lingoura.Application.Billing.Queries.GetPlans;
using Lingoura.Application.Billing.Queries.GetSubscription;
using Lingoura.Application.Common.Interfaces;
using Lingoura.Common.Results;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace Lingoura.Api.IntegrationTests.Controllers;

public sealed class BillingControllerTests
{
    // ── Shared fixtures ────────────────────────────────────────────────────

    private readonly Mock<ISender> _mediator = new();
    private readonly Mock<ICurrentUserService> _currentUser = new();
    private readonly Guid _userId = Guid.NewGuid();

    private BillingController CreateSut()
    {
        _currentUser.Setup(c => c.UserId).Returns(_userId);
        var ctrl = new BillingController(_mediator.Object, _currentUser.Object);
        ctrl.ControllerContext = new ControllerContext { HttpContext = new DefaultHttpContext() };
        return ctrl;
    }

    private BillingController CreateUnauthSut()
    {
        var unauth = new Mock<ICurrentUserService>();
        unauth.Setup(c => c.UserId).Returns((Guid?)null);
        var ctrl = new BillingController(_mediator.Object, unauth.Object);
        ctrl.ControllerContext = new ControllerContext { HttpContext = new DefaultHttpContext() };
        return ctrl;
    }

    private static IReadOnlyList<SubscriptionPlanDto> SamplePlans() =>
    [
        new("FREE",  "Free",  0,  0,  0,  0, true, 0),
        new("PRO",   "Pro",   9, 89, 699, 6999, true, 1),
        new("ELITE", "Elite", 29, 279, 2299, 22999, true, 2),
    ];

    private static SubscriptionDto SampleSubscription() => new(
        Guid.NewGuid(), "PRO", "active", "razorpay", "monthly",
        DateTime.UtcNow.AddDays(-10), DateTime.UtcNow.AddDays(20), false, null);

    private static IReadOnlyList<UsageSummaryItem> SampleUsageItems() =>
    [
        new("ai_chats", 5, 50, "2025-06-01"),
        new("transcripts", 2, 10, "2025-06-01"),
    ];

    // ── GetPlans ───────────────────────────────────────────────────────────

    [Fact]
    public async Task GetPlans_Always_Returns200WithPlans()
    {
        _mediator
            .Setup(m => m.Send(It.IsAny<GetPlansQuery>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result.Success<IReadOnlyList<SubscriptionPlanDto>>(SamplePlans()));

        var result = await CreateSut().GetPlans(CancellationToken.None);

        result.Should().BeOfType<OkObjectResult>()
            .Which.StatusCode.Should().Be(StatusCodes.Status200OK);
    }

    [Fact]
    public async Task GetPlans_NoAuthentication_StillReturns200()
    {
        _mediator
            .Setup(m => m.Send(It.IsAny<GetPlansQuery>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result.Success<IReadOnlyList<SubscriptionPlanDto>>(SamplePlans()));

        // Public endpoint — unauthenticated caller should still succeed
        var result = await CreateUnauthSut().GetPlans(CancellationToken.None);

        result.Should().BeOfType<OkObjectResult>();
    }

    // ── GetSubscription ────────────────────────────────────────────────────

    [Fact]
    public async Task GetSubscription_Unauthenticated_Returns401()
    {
        var result = await CreateUnauthSut().GetSubscription(CancellationToken.None);

        result.Should().BeOfType<UnauthorizedObjectResult>();
    }

    [Fact]
    public async Task GetSubscription_SubscriptionExists_Returns200()
    {
        _mediator
            .Setup(m => m.Send(It.IsAny<GetSubscriptionQuery>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result.Success(SampleSubscription()));

        var result = await CreateSut().GetSubscription(CancellationToken.None);

        result.Should().BeOfType<OkObjectResult>()
            .Which.StatusCode.Should().Be(StatusCodes.Status200OK);
    }

    [Fact]
    public async Task GetSubscription_NoSubscription_Returns404()
    {
        _mediator
            .Setup(m => m.Send(It.IsAny<GetSubscriptionQuery>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result.Failure<SubscriptionDto>(
                Error.NotFound("Billing.NoSubscription", "No active subscription found.")));

        var result = await CreateSut().GetSubscription(CancellationToken.None);

        result.Should().BeOfType<NotFoundObjectResult>();
    }

    [Fact]
    public async Task GetSubscription_ForwardsUserIdToMediator()
    {
        _mediator
            .Setup(m => m.Send(It.IsAny<GetSubscriptionQuery>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result.Success(SampleSubscription()));

        await CreateSut().GetSubscription(CancellationToken.None);

        _mediator.Verify(m => m.Send(
            It.Is<GetSubscriptionQuery>(q => q.UserId == _userId),
            It.IsAny<CancellationToken>()), Times.Once);
    }

    // ── GetUsage ───────────────────────────────────────────────────────────

    [Fact]
    public async Task GetUsage_Unauthenticated_Returns401()
    {
        var entitlement = new Mock<IEntitlementService>();
        var result = await CreateUnauthSut().GetUsage(entitlement.Object, CancellationToken.None);

        result.Should().BeOfType<UnauthorizedObjectResult>();
    }

    [Fact]
    public async Task GetUsage_Authenticated_Returns200WithItems()
    {
        var entitlement = new Mock<IEntitlementService>();
        entitlement
            .Setup(e => e.GetUsageSummaryAsync(_userId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(SampleUsageItems());

        var result = await CreateSut().GetUsage(entitlement.Object, CancellationToken.None);

        result.Should().BeOfType<OkObjectResult>()
            .Which.StatusCode.Should().Be(StatusCodes.Status200OK);
    }

    // ── ConsumeUsage ───────────────────────────────────────────────────────

    [Fact]
    public async Task ConsumeUsage_Unauthenticated_Returns401()
    {
        var entitlement = new Mock<IEntitlementService>();
        var result = await CreateUnauthSut().ConsumeUsage(
            new("ai_chats", "idem-key-1", null),
            entitlement.Object,
            CancellationToken.None);

        result.Should().BeOfType<UnauthorizedObjectResult>();
    }

    [Fact]
    public async Task ConsumeUsage_QuotaAvailable_Returns200()
    {
        var entitlement = new Mock<IEntitlementService>();
        entitlement
            .Setup(e => e.ConsumeAsync(_userId, "ai_chats", It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(EntitlementResult.Allow(remaining: 44));

        var result = await CreateSut().ConsumeUsage(
            new("ai_chats", "idem-key-ok", null),
            entitlement.Object,
            CancellationToken.None);

        result.Should().BeOfType<OkObjectResult>();
    }

    [Fact]
    public async Task ConsumeUsage_QuotaExhausted_Returns429()
    {
        var entitlement = new Mock<IEntitlementService>();
        entitlement
            .Setup(e => e.ConsumeAsync(_userId, "ai_chats", It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(EntitlementResult.Deny("Monthly AI chat limit reached."));

        var result = await CreateSut().ConsumeUsage(
            new("ai_chats", "idem-key-exhausted", null),
            entitlement.Object,
            CancellationToken.None);

        var statusResult = result.Should().BeOfType<ObjectResult>().Subject;
        statusResult.StatusCode.Should().Be(StatusCodes.Status429TooManyRequests);
    }

    // ── CreateCheckout ─────────────────────────────────────────────────────

    [Fact]
    public async Task CreateCheckout_Unauthenticated_Returns401()
    {
        var result = await CreateUnauthSut().CreateCheckout(
            new("PRO", "monthly", "http://localhost:3000/success", "http://localhost:3000/cancel", "razorpay"),
            CancellationToken.None);

        result.Should().BeOfType<UnauthorizedObjectResult>();
    }

    [Fact]
    public async Task CreateCheckout_RazorpayProvider_Returns200WithOrderId()
    {
        _mediator
            .Setup(m => m.Send(It.IsAny<CreateCheckoutCommand>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result.Success(new CheckoutResult(
                "razorpay", "sess_abc123",
                null, "order_RZPY123", 69900L, "INR", "rzp_test_key")));

        var result = await CreateSut().CreateCheckout(
            new("PRO", "monthly", "http://localhost:3000/success", "http://localhost:3000/cancel", "razorpay"),
            CancellationToken.None);

        result.Should().BeOfType<OkObjectResult>()
            .Which.StatusCode.Should().Be(StatusCodes.Status200OK);
    }

    [Fact]
    public async Task CreateCheckout_StripeProvider_Returns200WithCheckoutUrl()
    {
        _mediator
            .Setup(m => m.Send(It.IsAny<CreateCheckoutCommand>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result.Success(new CheckoutResult(
                "stripe", "cs_test_abc",
                "https://checkout.stripe.com/c/pay/cs_test_abc",
                null, null, null, null)));

        var result = await CreateSut().CreateCheckout(
            new("PRO", "monthly", "http://localhost:3000/success", "http://localhost:3000/cancel", "stripe"),
            CancellationToken.None);

        result.Should().BeOfType<OkObjectResult>();
    }

    [Fact]
    public async Task CreateCheckout_Failure_Returns400()
    {
        _mediator
            .Setup(m => m.Send(It.IsAny<CreateCheckoutCommand>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result.Failure<CheckoutResult>(
                Error.Failure("Billing.PlanIdsNotConfigured", "Payment provider plan IDs not configured.")));

        var result = await CreateSut().CreateCheckout(
            new("PRO", "monthly", "http://localhost:3000/success", "http://localhost:3000/cancel", null),
            CancellationToken.None);

        result.Should().BeOfType<BadRequestObjectResult>();
    }

    // ── CancelSubscription ─────────────────────────────────────────────────

    [Fact]
    public async Task CancelSubscription_Unauthenticated_Returns401()
    {
        var result = await CreateUnauthSut().CancelSubscription("User requested", CancellationToken.None);

        result.Should().BeOfType<UnauthorizedObjectResult>();
    }

    [Fact]
    public async Task CancelSubscription_ActiveSubscription_Returns200()
    {
        _mediator
            .Setup(m => m.Send(It.IsAny<CancelSubscriptionCommand>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result.Success(Unit.Value));

        var result = await CreateSut().CancelSubscription("Too expensive", CancellationToken.None);

        result.Should().BeOfType<OkObjectResult>();
    }

    [Fact]
    public async Task CancelSubscription_NoSubscription_Returns400()
    {
        _mediator
            .Setup(m => m.Send(It.IsAny<CancelSubscriptionCommand>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result.Failure<Unit>(
                Error.NotFound("Billing.NoSubscription", "No active subscription to cancel.")));

        var result = await CreateSut().CancelSubscription("User requested", CancellationToken.None);

        result.Should().BeOfType<BadRequestObjectResult>();
    }

    [Fact]
    public async Task CancelSubscription_ForwardsUserIdAndReason()
    {
        const string reason = "Not using it anymore";
        _mediator
            .Setup(m => m.Send(It.IsAny<CancelSubscriptionCommand>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result.Success(Unit.Value));

        await CreateSut().CancelSubscription(reason, CancellationToken.None);

        _mediator.Verify(m => m.Send(
            It.Is<CancelSubscriptionCommand>(c => c.UserId == _userId && c.Reason == reason),
            It.IsAny<CancellationToken>()), Times.Once);
    }
}
