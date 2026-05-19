using System.ComponentModel.DataAnnotations;

namespace Lingoura.Infrastructure.Options;

public sealed class RazorpayOptions
{
    public const string SectionName = "Razorpay";

    [Required] public string KeyId { get; init; } = string.Empty;
    [Required] public string KeySecret { get; init; } = string.Empty;
    [Required] public string WebhookSecret { get; init; } = string.Empty;
    public RazorpayPlanIds PlanIds { get; init; } = new();
}

public sealed class RazorpayPlanIds
{
    public string ProMonthly   { get; init; } = string.Empty;
    public string ProAnnual    { get; init; } = string.Empty;
    public string EliteMonthly { get; init; } = string.Empty;
    public string EliteAnnual  { get; init; } = string.Empty;
}
