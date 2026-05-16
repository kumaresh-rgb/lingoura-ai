using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Lingoura.Application.Common.Interfaces;
using Lingoura.Common.Constants;
using Lingoura.Common.Helpers;
using Lingoura.Domain.Entities;
using Lingoura.Infrastructure.Options;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Lingoura.Infrastructure.Authentication;

public sealed class JwtTokenService(IOptions<JwtOptions> opts) : ITokenService
{
    private readonly JwtOptions _opts = opts.Value;

    public string GenerateAccessToken(ApplicationUser user, IList<string> roles)
    {
        var key   = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_opts.SecretKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub,   user.Id.ToString()),
            new(JwtRegisteredClaimNames.Email, user.Email!),
            new(JwtRegisteredClaimNames.Jti,   Guid.NewGuid().ToString()),
            new(ClaimTypeNames.FirstName,       user.FirstName),
            new(ClaimTypeNames.LastName,        user.LastName),
        };
        claims.AddRange(roles.Select(r => new Claim(ClaimTypes.Role, r)));

        var token = new JwtSecurityToken(
            issuer:             _opts.Issuer,
            audience:           _opts.Audience,
            claims:             claims,
            notBefore:          DateTime.UtcNow,
            expires:            DateTime.UtcNow.AddMinutes(_opts.AccessTokenExpiryMinutes),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public (string rawToken, string tokenHash) GenerateRefreshToken()
    {
        var raw  = CryptoHelper.GenerateSecureToken(AuthConstants.RefreshTokenByteLength);
        var hash = CryptoHelper.HashToken(raw);
        return (raw, hash);
    }

    public ClaimsPrincipal? GetPrincipalFromExpiredToken(string token)
    {
        var parameters = new TokenValidationParameters
        {
            ValidateIssuer           = true,
            ValidateAudience         = true,
            ValidateLifetime         = false,
            ValidateIssuerSigningKey = true,
            ValidIssuer              = _opts.Issuer,
            ValidAudience            = _opts.Audience,
            IssuerSigningKey         = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_opts.SecretKey)),
            ClockSkew                = TimeSpan.Zero,
        };

        try
        {
            var principal = new JwtSecurityTokenHandler()
                .ValidateToken(token, parameters, out var validated);

            if (validated is not JwtSecurityToken jwt ||
                !jwt.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.OrdinalIgnoreCase))
                return null;

            return principal;
        }
        catch { return null; }
    }
}
