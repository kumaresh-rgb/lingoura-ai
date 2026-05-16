using Lingoura.Application.Authentication.DTOs;
using Lingoura.Application.Common.Interfaces;
using Lingoura.Common.Constants;
using Lingoura.Common.Exceptions;
using Lingoura.Common.Results;
using Lingoura.Domain.Entities;
using DomainRefreshToken = Lingoura.Domain.Entities.RefreshToken;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace Lingoura.Application.Authentication.Commands.Login;

public sealed class LoginCommandHandler(
    UserManager<ApplicationUser> userManager,
    ITokenService tokenService,
    IApplicationDbContext context,
    IDateTimeProvider dateTime,
    ILogger<LoginCommandHandler> logger)
    : IRequestHandler<LoginCommand, Result<AuthResponseDto>>
{
    private static readonly Error InvalidCredentials =
        Error.Unauthorized("Auth.InvalidCredentials", "Invalid email or password.");

    public async Task<Result<AuthResponseDto>> Handle(LoginCommand cmd, CancellationToken ct)
    {
        var user = await userManager.FindByEmailAsync(cmd.Email);
        if (user is null || user.IsDeleted)
        {
            logger.LogWarning("Login attempt for unknown or deleted account");
            return Result.Failure<AuthResponseDto>(InvalidCredentials);
        }

        if (await userManager.IsLockedOutAsync(user))
            throw new TooManyRequestsException("Account temporarily locked due to too many failed attempts. Please try again later.");

        var passwordValid = await userManager.CheckPasswordAsync(user, cmd.Password);
        if (!passwordValid)
        {
            await userManager.AccessFailedAsync(user);

            if (await userManager.IsLockedOutAsync(user))
            {
                logger.LogWarning("User {UserId} locked out after failed attempts", user.Id);
                throw new TooManyRequestsException("Account temporarily locked due to too many failed attempts. Please try again later.");
            }

            logger.LogWarning("Failed password attempt for user {UserId}", user.Id);
            return Result.Failure<AuthResponseDto>(InvalidCredentials);
        }

        await userManager.ResetAccessFailedCountAsync(user);

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

        logger.LogInformation("User {UserId} authenticated", user.Id);

        return Result.Success(new AuthResponseDto(
            AccessToken:  access,
            RefreshToken: rawRefresh,
            ExpiresAt:    dateTime.UtcNow.AddMinutes(AuthConstants.AccessTokenExpiryMinutes),
            User:         new UserDto(user.Id, user.Email!, user.FirstName, user.LastName)));
    }
}
