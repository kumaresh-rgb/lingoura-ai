using Google.Apis.Auth;
using Lingoura.Application.Common.Interfaces;
using Lingoura.Application.Common.Models;
using Lingoura.Infrastructure.Options;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Lingoura.Infrastructure.Authentication;

public sealed class GoogleAuthService(
    IOptions<GoogleAuthOptions> opts,
    ILogger<GoogleAuthService> logger) : IGoogleAuthService
{
    private readonly GoogleAuthOptions _opts = opts.Value;

    public async Task<GoogleUserInfo?> ValidateGoogleTokenAsync(string idToken, CancellationToken ct = default)
    {
        try
        {
            var payload = await GoogleJsonWebSignature.ValidateAsync(idToken,
                new GoogleJsonWebSignature.ValidationSettings
                {
                    Audience = [_opts.ClientId],
                });

            return new GoogleUserInfo(
                GoogleUserId: payload.Subject,
                Email:        payload.Email,
                FirstName:    payload.GivenName  ?? string.Empty,
                LastName:     payload.FamilyName ?? string.Empty,
                AvatarUrl:    payload.Picture,
                IsVerified:   payload.EmailVerified);
        }
        catch (InvalidJwtException ex)
        {
            logger.LogWarning(ex, "Invalid Google ID token");
            return null;
        }
    }
}
