using Asp.Versioning;
using Lingoura.Infrastructure.Services;
using Microsoft.AspNetCore.Mvc;

namespace Lingoura.Api.Controllers.V1;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/payments/webhook")]
public sealed class WebhooksController(
    StripeWebhookProcessor stripeProcessor,
    RazorpayWebhookProcessor razorpayProcessor,
    IConfiguration configuration,
    ILogger<WebhooksController> logger) : ControllerBase
{
    [HttpPost("stripe")]
    [Consumes("application/json")]
    public async Task<IActionResult> StripeWebhook(CancellationToken ct)
    {
        if (!IsInternalCall())
            return Unauthorized();

        string rawBody;
        using (var reader = new StreamReader(Request.Body, leaveOpen: true))
            rawBody = await reader.ReadToEndAsync(ct);

        var stripeSignature = Request.Headers["Stripe-Signature"].FirstOrDefault();
        if (string.IsNullOrEmpty(stripeSignature))
        {
            logger.LogWarning("Stripe webhook received without Stripe-Signature header");
            return BadRequest("Missing Stripe-Signature");
        }

        try
        {
            await stripeProcessor.ProcessAsync(rawBody, stripeSignature, ct);
            return Ok();
        }
        catch (InvalidOperationException ex)
        {
            logger.LogWarning(ex, "Stripe webhook rejected: {Message}", ex.Message);
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("razorpay")]
    [Consumes("application/json")]
    public async Task<IActionResult> RazorpayWebhook(CancellationToken ct)
    {
        if (!IsInternalCall())
            return Unauthorized();

        string rawBody;
        using (var reader = new StreamReader(Request.Body, leaveOpen: true))
            rawBody = await reader.ReadToEndAsync(ct);

        var signature = Request.Headers["X-Razorpay-Signature"].FirstOrDefault();
        if (string.IsNullOrEmpty(signature))
        {
            logger.LogWarning("Razorpay webhook received without X-Razorpay-Signature header");
            return BadRequest("Missing X-Razorpay-Signature");
        }

        try
        {
            await razorpayProcessor.ProcessAsync(rawBody, signature, ct);
            return Ok();
        }
        catch (InvalidOperationException ex)
        {
            logger.LogWarning(ex, "Razorpay webhook rejected: {Message}", ex.Message);
            return BadRequest(ex.Message);
        }
    }

    private bool IsInternalCall()
    {
        var secret = configuration["InternalWebhookSecret"];
        if (string.IsNullOrEmpty(secret))
            return true; // not configured — allow (dev mode)

        var provided = Request.Headers["X-Internal-Secret"].FirstOrDefault();
        return !string.IsNullOrEmpty(provided) &&
               CryptographicEquals(secret, provided);
    }

    private static bool CryptographicEquals(string a, string b)
    {
        var aBytes = System.Text.Encoding.UTF8.GetBytes(a);
        var bBytes = System.Text.Encoding.UTF8.GetBytes(b);
        return System.Security.Cryptography.CryptographicOperations.FixedTimeEquals(aBytes, bBytes);
    }
}
