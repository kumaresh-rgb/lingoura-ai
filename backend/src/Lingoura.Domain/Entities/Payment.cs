using Lingoura.Domain.Enums;

namespace Lingoura.Domain.Entities;

public sealed class Payment
{
    public Guid Id { get; init; } = Guid.NewGuid();
    public Guid UserId { get; init; }
    public Guid? SubscriptionId { get; init; }
    public PaymentProvider Provider { get; init; }
    public string ProviderPaymentId { get; init; } = string.Empty;
    public string? ProviderOrderId { get; init; }
    public decimal Amount { get; init; }
    public string Currency { get; init; } = "USD";
    public PaymentStatus Status { get; set; } = PaymentStatus.Pending;

    /// <summary>Idempotency key — prevents duplicate payment records. UNIQUE in DB.</summary>
    public string IdempotencyKey { get; init; } = string.Empty;

    public Guid? InvoiceId { get; set; }
    public string? FailureReason { get; set; }
    public DateTime CreatedAtUtc { get; init; } = DateTime.UtcNow;
    public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;

    public ApplicationUser User { get; init; } = null!;
    public Subscription? Subscription { get; init; }
}
