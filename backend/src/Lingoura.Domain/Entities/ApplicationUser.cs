using Microsoft.AspNetCore.Identity;

namespace Lingoura.Domain.Entities;

public sealed class ApplicationUser : IdentityUser<Guid>
{
    public string FirstName { get; private set; } = string.Empty;
    public string LastName { get; private set; } = string.Empty;
    public string? AvatarUrl { get; private set; }
    public bool IsEmailVerified { get; private set; }
    public DateTime CreatedAtUtc { get; init; } = DateTime.UtcNow;
    public DateTime UpdatedAtUtc { get; private set; } = DateTime.UtcNow;
    public bool IsDeleted { get; private set; }
    public DateTime? DeletedAtUtc { get; private set; }

    public ICollection<RefreshToken> RefreshTokens { get; init; } = [];
    public ICollection<UserExternalLogin> ExternalLogins { get; init; } = [];

    public static ApplicationUser Create(string email, string firstName, string lastName)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(email);
        ArgumentException.ThrowIfNullOrWhiteSpace(firstName);
        ArgumentException.ThrowIfNullOrWhiteSpace(lastName);
        return new ApplicationUser
        {
            Id        = Guid.NewGuid(),
            Email     = email.Trim().ToLowerInvariant(),
            UserName  = email.Trim().ToLowerInvariant(),
            FirstName = firstName.Trim(),
            LastName  = lastName.Trim(),
        };
    }

    public void TouchUpdatedAt() => UpdatedAtUtc = DateTime.UtcNow;

    public void SoftDelete()
    {
        IsDeleted    = true;
        DeletedAtUtc = DateTime.UtcNow;
    }

    public void MarkEmailVerified() => IsEmailVerified = true;
}
