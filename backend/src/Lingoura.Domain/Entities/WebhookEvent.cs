using Lingoura.Domain.Enums;

namespace Lingoura.Domain.Entities;

/// <summary>
/// Idempotency store for incoming webhooks.
/// UNIQUE(Provider, ProviderEventId) prevents replay attacks.
/// </summary>
public sealed class WebhookEvent
{
    public Guid Id { get; init; } = Guid.NewGuid();
    public PaymentProvider Provider { get; init; }
    public string ProviderEventId { get; init; } = string.Empty;
    public string EventType { get; init; } = string.Empty;
    public string PayloadJson { get; init; } = string.Empty;
    public string ProcessingStatus { get; set; } = "PENDING";
    public string? ErrorMessage { get; set; }
    public int RetryCount { get; set; }
    public DateTime? ProcessedAtUtc { get; set; }
    public DateTime CreatedAtUtc { get; init; } = DateTime.UtcNow;

    public static class Status
    {
        public const string Pending   = "PENDING";
        public const string Processed = "PROCESSED";
        public const string Failed    = "FAILED";
        public const string Skipped   = "SKIPPED";
    }
}
