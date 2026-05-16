using Lingoura.Application.Authentication.DTOs;
using Lingoura.Application.Common.Interfaces;
using Lingoura.Common.Constants;
using Lingoura.Common.Helpers;
using Lingoura.Common.Results;
using Lingoura.Domain.Entities;
using DomainRefreshToken = Lingoura.Domain.Entities.RefreshToken;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Lingoura.Application.Authentication.Commands.RefreshToken;

public sealed class RefreshTokenCommandHandler(
    UserManager<ApplicationUser> userManager,
    ITokenService tokenService,
    IApplicationDbContext context,
    IDateTimeProvider dateTime,
    ILogger<RefreshTokenCommandHandler> logger)
    : IRequestHandler<RefreshTokenCommand, Result<AuthResponseDto>>
{
    private static readonly Error InvalidToken =
        Error.Unauthorized("Auth.InvalidToken", "Invalid or expired refresh token.");

    public async Task<Result<AuthResponseDto>> Handle(RefreshTokenCommand cmd, CancellationToken ct)
    {
        var hash  = CryptoHelper.HashToken(cmd.RefreshToken);
        var token = await context.RefreshTokens
            .Include(t => t.User)
            .FirstOrDefaultAsync(t => t.TokenHash == hash, ct);

        if (token is null)
        {
            logger.LogWarning("Refresh attempt with unknown token hash");
            return Result.Failure<AuthResponseDto>(InvalidToken);
        }

        if (token.IsRevoked)
        {
            // Reuse detected — revoke the entire token family for this user
            logger.LogWarning("Refresh token reuse detected for user {UserId} — revoking all tokens", token.UserId);
            var allTokens = await context.RefreshTokens
                .Where(t => t.UserId == token.UserId && t.RevokedAtUtc == null)
                .ToListAsync(ct);
            foreach (var t in allTokens) t.Revoke();
            await context.SaveChangesAsync(ct);
            return Result.Failure<AuthResponseDto>(InvalidToken);
        }

        if (token.IsExpired)
        {
            token.Revoke();
            await context.SaveChangesAsync(ct);
            return Result.Failure<AuthResponseDto>(InvalidToken);
        }

        var user = token.User;
        if (user.IsDeleted)
            return Result.Failure<AuthResponseDto>(InvalidToken);

        var roles  = await userManager.GetRolesAsync(user);
        var access = tokenService.GenerateAccessToken(user, roles);
        var (rawRefresh, refreshHash) = tokenService.GenerateRefreshToken();

        token.Revoke(replacedByTokenHash: refreshHash);

        var newToken = new DomainRefreshToken
        {
            UserId       = user.Id,
            TokenHash    = refreshHash,
            ExpiresAtUtc = dateTime.UtcNow.AddDays(AuthConstants.RefreshTokenExpiryDays),
        };

        context.RefreshTokens.Add(newToken);
        await context.SaveChangesAsync(ct);

        logger.LogInformation("Refresh token rotated for user {UserId}", user.Id);

        return Result.Success(new AuthResponseDto(
            AccessToken:  access,
            RefreshToken: rawRefresh,
            ExpiresAt:    dateTime.UtcNow.AddMinutes(AuthConstants.AccessTokenExpiryMinutes),
            User:         new UserDto(user.Id, user.Email!, user.FirstName, user.LastName)));
    }
}
