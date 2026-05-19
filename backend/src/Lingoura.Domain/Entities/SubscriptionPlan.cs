namespace Lingoura.Domain.Entities;

/// <summary>
/// Configuration table — managed by admins. Each row defines one plan tier.
/// </summary>
public sealed class SubscriptionPlan
{
    public string Id { get; init; } = string.Empty;          // "FREE" | "PRO" | "ELITE" | "ENTERPRISE"
    public string DisplayName { get; set; } = string.Empty;
    public decimal MonthlyPriceUsd { get; set; }
    public decimal MonthlyPriceInr { get; set; }
    public decimal AnnualPriceUsd { get; set; }
    public decimal AnnualPriceInr { get; set; }

    // Stripe
    public string? StripePriceIdMonthly { get; set; }
    public string? StripePriceIdAnnual { get; set; }

    // Razorpay
    public string? RazorpayPlanIdMonthly { get; set; }
    public string? RazorpayPlanIdAnnual { get; set; }

    public bool IsActive { get; set; } = true;
    public int SortOrder { get; set; }
    public DateTime CreatedAtUtc { get; init; } = DateTime.UtcNow;
    public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;

    public ICollection<FeatureEntitlement> Entitlements { get; init; } = [];
    public ICollection<Subscription> Subscriptions { get; init; } = [];

    // Well-known plan IDs
    public static class Plans
    {
        public const string Free       = "FREE";
        public const string Pro        = "PRO";
        public const string Elite      = "ELITE";
        public const string Enterprise = "ENTERPRISE";
    }
}
