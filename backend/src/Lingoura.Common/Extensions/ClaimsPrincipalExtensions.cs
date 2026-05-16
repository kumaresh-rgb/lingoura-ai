using System.Security.Claims;
using Lingoura.Common.Constants;

namespace Lingoura.Common.Extensions;

public static class ClaimsPrincipalExtensions
{
    public static Guid GetUserId(this ClaimsPrincipal principal)
    {
        var value = principal.Claims
            .FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier || c.Type == ClaimTypeNames.UserId)
            ?.Value;

        return Guid.TryParse(value, out var id)
            ? id
            : throw new InvalidOperationException("User ID claim is missing or invalid.");
    }

    public static string GetEmail(this ClaimsPrincipal principal) =>
        principal.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value
            ?? throw new InvalidOperationException("Email claim is missing.");
}
