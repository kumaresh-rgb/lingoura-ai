using Lingoura.Domain.Enums;

namespace Lingoura.Domain.Entities;

/// <summary>
/// Logs every checkout initiation for fraud detection.
/// </summary>
public sealed class PaymentAttempt
{
    public Guid Id { get; init; } = Guid.NewGuid();
    public Guid UserId { get; init; }
    public string PlanId { get; init; } = string.Empty;
    public PaymentProvider Provider { get; init; }
    public string? SessionId { get; init; }           // Stripe session or Razorpay order ID
    public string? IpAddress { get; init; }
    public string? UserAgent { get; init; }
    public string Outcome { get; set; } = "INITIATED";
    public string? FailureReason { get; set; }
    public DateTime CreatedAtUtc { get; init; } = DateTime.UtcNow;

    public static class Outcomes
    {
        public const string Initiated  = "INITIATED";
        public const string Success    = "SUCCESS";
        public const string Failed     = "FAILED";
        public const string Abandoned  = "ABANDONED";
    }
}
