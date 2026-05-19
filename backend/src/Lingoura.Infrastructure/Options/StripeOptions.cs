using System.ComponentModel.DataAnnotations;

namespace Lingoura.Infrastructure.Options;

public sealed class StripeOptions
{
    public const string SectionName = "Stripe";

    [Required] public string SecretKey { get; init; } = string.Empty;
    [Required] public string WebhookSecret { get; init; } = string.Empty;
    public StripePriceIds PriceIds { get; init; } = new();
}

public sealed class StripePriceIds
{
    public string ProMonthly        { get; init; } = string.Empty;
    public string ProAnnual         { get; init; } = string.Empty;
    public string EliteMonthly      { get; init; } = string.Empty;
    public string EliteAnnual       { get; init; } = string.Empty;
    public string EnterpriseMonthly { get; init; } = string.Empty;
    public string EnterpriseAnnual  { get; init; } = string.Empty;
}
