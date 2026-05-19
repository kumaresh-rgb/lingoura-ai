namespace Lingoura.Application.Common.Interfaces;

public sealed record EntitlementResult(
    bool Allowed,
    bool IsUnlimited,
    int Remaining,
    string ResetAt,
    string? DenialReason = null)
{
    public static EntitlementResult Allow(int remaining, bool unlimited = false, string resetAt = "")
        => new(true, unlimited, remaining, resetAt);

    public static EntitlementResult Deny(string reason, string resetAt = "")
        => new(false, false, 0, resetAt, reason);
}

public interface IEntitlementService
{
    /// <summary>
    /// Atomically checks and consumes one unit of a feature for the given user.
    /// Returns Denied if subscription is not active or quota is exceeded.
    /// </summary>
    Task<EntitlementResult> ConsumeAsync(
        Guid userId,
        string feature,
        string idempotencyKey,
        CancellationToken ct = default);

    /// <summary>
    /// Returns current usage for all features without consuming.
    /// </summary>
    Task<IReadOnlyList<UsageSummaryItem>> GetUsageSummaryAsync(
        Guid userId,
        CancellationToken ct = default);
}

public sealed record UsageSummaryItem(
    string Feature,
    int Used,
    int Limit,        // -1 = unlimited
    string ResetAt);
