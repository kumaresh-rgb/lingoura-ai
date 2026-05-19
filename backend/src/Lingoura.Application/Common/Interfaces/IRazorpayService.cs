using Lingoura.Domain.Entities;
using Lingoura.Domain.Enums;

namespace Lingoura.Application.Common.Interfaces;

public sealed record RazorpayOrderResult(
    string OrderId,
    long AmountPaise,
    string Currency,
    string KeyId,
    string IdempotencyKey);

public interface IRazorpayService
{
    Task<RazorpayOrderResult> CreateOrderAsync(
        ApplicationUser user,
        string planId,
        BillingInterval interval,
        string idempotencyKey,
        CancellationToken ct = default);

    /// <summary>
    /// Verifies the HMAC signature of a payment success callback.
    /// Call this as a second check in the webhook processor.
    /// </summary>
    bool VerifyPaymentSignature(string orderId, string paymentId, string signature);

    Task<bool> FetchPaymentStatusAsync(string paymentId, CancellationToken ct = default);
}
