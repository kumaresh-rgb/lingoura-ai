namespace Lingoura.Domain.Entities;

public sealed class UserProfile
{
    public Guid Id { get; init; } = Guid.NewGuid();
    public Guid UserId { get; init; }
    public string CefrLevel { get; set; } = "B1";
    public decimal TargetBand { get; set; } = 7.0m;
    public string? CountryCode { get; set; }
    public string? Timezone { get; set; }
    public string? PreferredPaymentProvider { get; set; }
    public bool OnboardingCompleted { get; set; }
    public DateTime CreatedAtUtc { get; init; } = DateTime.UtcNow;
    public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;

    public ApplicationUser User { get; init; } = null!;

    public static UserProfile CreateDefault(Guid userId) => new() { UserId = userId };
}
