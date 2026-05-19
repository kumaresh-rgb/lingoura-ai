using Lingoura.Domain.Enums;

namespace Lingoura.Domain.Entities;

public sealed class Subscription
{
    public Guid Id { get; init; } = Guid.NewGuid();
    public Guid UserId { get; init; }
    public string PlanId { get; set; } = SubscriptionPlan.Plans.Free;
    public SubscriptionStatus Status { get; set; } = SubscriptionStatus.Active;
    public BillingInterval Interval { get; set; } = BillingInterval.Monthly;

    // Provider info
    public PaymentProvider? Provider { get; set; }
    public string? StripeCustomerId { get; set; }
    public string? StripeSubscriptionId { get; set; }
    public string? StripePriceId { get; set; }
    public string? RazorpayCustomerId { get; set; }
    public string? RazorpaySubscriptionId { get; set; }
    public string? RazorpayPlanId { get; set; }

    // Billing period
    public DateTime CurrentPeriodStart { get; set; } = DateTime.UtcNow;
    public DateTime CurrentPeriodEnd { get; set; } = DateTime.UtcNow.AddMonths(1);
    public bool CancelAtPeriodEnd { get; set; }
    public DateTime? CanceledAtUtc { get; set; }
    public DateTime? GracePeriodEndUtc { get; set; }

    public DateTime CreatedAtUtc { get; init; } = DateTime.UtcNow;
    public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;

    public ApplicationUser User { get; init; } = null!;
    public SubscriptionPlan Plan { get; set; } = null!;
    public ICollection<Payment> Payments { get; init; } = [];

    public static Subscription CreateFree(Guid userId) => new()
    {
        UserId            = userId,
        PlanId            = SubscriptionPlan.Plans.Free,
        Status            = SubscriptionStatus.Active,
        CurrentPeriodEnd  = DateTime.UtcNow.AddYears(100), // free never expires
    };

    public bool IsActive => Status is SubscriptionStatus.Active or SubscriptionStatus.Trialing;
    public bool IsPastDue => Status is SubscriptionStatus.PastDue or SubscriptionStatus.GracePeriod;
}
