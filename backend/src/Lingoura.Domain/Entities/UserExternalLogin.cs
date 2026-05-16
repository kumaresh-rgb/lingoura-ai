using Lingoura.Domain.Enums;

namespace Lingoura.Domain.Entities;

public sealed class UserExternalLogin
{
    public Guid Id { get; init; } = Guid.NewGuid();
    public Guid UserId { get; init; }
    public AuthProvider Provider { get; init; }
    public string ProviderUserId { get; init; } = string.Empty;
    public string? ProviderEmail { get; init; }
    public DateTime LinkedAtUtc { get; init; } = DateTime.UtcNow;

    public ApplicationUser User { get; init; } = null!;
}
