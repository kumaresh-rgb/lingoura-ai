namespace Lingoura.Domain.Entities;

public sealed class RefreshToken
{
    public Guid Id { get; init; } = Guid.NewGuid();
    public Guid UserId { get; init; }
    public string TokenHash { get; init; } = string.Empty;
    public string? DeviceInfo { get; init; }
    public string? IpAddress { get; init; }
    public DateTime ExpiresAtUtc { get; init; }
    public DateTime CreatedAtUtc { get; init; } = DateTime.UtcNow;
    public DateTime? RevokedAtUtc { get; private set; }
    public string? ReplacedByTokenHash { get; private set; }

    public bool IsActive  => RevokedAtUtc is null && DateTime.UtcNow < ExpiresAtUtc;
    public bool IsExpired => DateTime.UtcNow >= ExpiresAtUtc;
    public bool IsRevoked => RevokedAtUtc is not null;

    public void Revoke(string? replacedByTokenHash = null)
    {
        RevokedAtUtc        = DateTime.UtcNow;
        ReplacedByTokenHash = replacedByTokenHash;
    }

    public ApplicationUser User { get; init; } = null!;
}
