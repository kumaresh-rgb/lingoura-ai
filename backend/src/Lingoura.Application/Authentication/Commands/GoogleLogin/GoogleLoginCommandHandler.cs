using Lingoura.Application.Authentication.DTOs;
using Lingoura.Application.Common.Interfaces;
using Lingoura.Common.Constants;
using Lingoura.Common.Results;
using Lingoura.Domain.Entities;
using DomainRefreshToken = Lingoura.Domain.Entities.RefreshToken;
using Lingoura.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Lingoura.Application.Authentication.Commands.GoogleLogin;

public sealed class GoogleLoginCommandHandler(
    IGoogleAuthService googleAuthService,
    UserManager<ApplicationUser> userManager,
    ITokenService tokenService,
    IApplicationDbContext context,
    IDateTimeProvider dateTime,
    ILogger<GoogleLoginCommandHandler> logger)
    : IRequestHandler<GoogleLoginCommand, Result<AuthResponseDto>>
{
    public async Task<Result<AuthResponseDto>> Handle(GoogleLoginCommand cmd, CancellationToken ct)
    {
        var googleUser = await googleAuthService.ValidateGoogleTokenAsync(cmd.IdToken, ct);
        if (googleUser is null)
        {
            logger.LogWarning("Invalid Google ID token received");
            return Result.Failure<AuthResponseDto>(
                Error.Unauthorized("Auth.InvalidGoogleToken", "Google authentication failed."));
        }

        // 1. Check existing external login record
        var externalLogin = await context.UserExternalLogins
            .Include(e => e.User)
            .FirstOrDefaultAsync(
                e => e.Provider == AuthProvider.Google && e.ProviderUserId == googleUser.GoogleUserId, ct);

        ApplicationUser user;

        if (externalLogin is not null)
        {
            user = externalLogin.User;
        }
        else
        {
            // 2. Try account linking by email
            var existing = await userManager.FindByEmailAsync(googleUser.Email);
            if (existing is not null)
            {
                user = existing;
            }
            else
            {
                // 3. New user — auto-register
                user = ApplicationUser.Create(googleUser.Email, googleUser.FirstName, googleUser.LastName);
                user.MarkEmailVerified();

                var identityResult = await userManager.CreateAsync(user);
                if (!identityResult.Succeeded)
                {
                    var errors = string.Join("; ", identityResult.Errors.Select(e => e.Description));
                    logger.LogWarning("Google auto-registration failed (details suppressed)");
                    return Result.Failure<AuthResponseDto>(
                        Error.Failure("Auth.RegistrationFailed", errors));
                }

                await userManager.AddToRoleAsync(user, "Learner");
                logger.LogInformation("Auto-registered user {UserId} via Google", user.Id);
            }

            var loginRecord = new UserExternalLogin
            {
                UserId         = user.Id,
                Provider       = AuthProvider.Google,
                ProviderUserId = googleUser.GoogleUserId,
                ProviderEmail  = googleUser.Email,
            };
            context.UserExternalLogins.Add(loginRecord);
        }

        if (user.IsDeleted)
            return Result.Failure<AuthResponseDto>(
                Error.Unauthorized("Auth.AccountDeleted", "Account not found."));

        var roles  = await userManager.GetRolesAsync(user);
        var access = tokenService.GenerateAccessToken(user, roles);
        var (rawRefresh, refreshHash) = tokenService.GenerateRefreshToken();

        var refreshToken = new DomainRefreshToken
        {
            UserId       = user.Id,
            TokenHash    = refreshHash,
            ExpiresAtUtc = dateTime.UtcNow.AddDays(AuthConstants.RefreshTokenExpiryDays),
        };

        context.RefreshTokens.Add(refreshToken);
        await context.SaveChangesAsync(ct);

        logger.LogInformation("User {UserId} authenticated via Google", user.Id);

        return Result.Success(new AuthResponseDto(
            AccessToken:  access,
            RefreshToken: rawRefresh,
            ExpiresAt:    dateTime.UtcNow.AddMinutes(AuthConstants.AccessTokenExpiryMinutes),
            User:         new UserDto(user.Id, user.Email!, user.FirstName, user.LastName)));
    }
}
