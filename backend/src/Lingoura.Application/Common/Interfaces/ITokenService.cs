using System.Security.Claims;
using Lingoura.Domain.Entities;

namespace Lingoura.Application.Common.Interfaces;

public interface ITokenService
{
    string GenerateAccessToken(ApplicationUser user, IList<string> roles);
    (string rawToken, string tokenHash) GenerateRefreshToken();
    ClaimsPrincipal? GetPrincipalFromExpiredToken(string token);
}
