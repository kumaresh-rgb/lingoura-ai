using System.ComponentModel.DataAnnotations;

namespace Lingoura.Infrastructure.Options;

public sealed class JwtOptions
{
    public const string SectionName = "Jwt";

    [Required] public string SecretKey { get; init; } = string.Empty;
    [Required] public string Issuer    { get; init; } = string.Empty;
    [Required] public string Audience  { get; init; } = string.Empty;
    public int AccessTokenExpiryMinutes { get; init; } = 15;
    public int RefreshTokenExpiryDays   { get; init; } = 7;
}
