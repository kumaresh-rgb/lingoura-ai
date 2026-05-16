using Lingoura.Application.Authentication.DTOs;
using Lingoura.Application.Common.Interfaces;
using Lingoura.Common.Constants;
using Lingoura.Common.Results;
using Lingoura.Domain.Entities;
using DomainRefreshToken = Lingoura.Domain.Entities.RefreshToken;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace Lingoura.Application.Authentication.Commands.Register;

public sealed class RegisterCommandHandler(
    UserManager<ApplicationUser> userManager,
    ITokenService tokenService,
    IApplicationDbContext context,
    IDateTimeProvider dateTime,
    ILogger<RegisterCommandHandler> logger)
    : IRequestHandler<RegisterCommand, Result<AuthResponseDto>>
{
    public async Task<Result<AuthResponseDto>> Handle(RegisterCommand cmd, CancellationToken ct)
    {
        var exists = await userManager.FindByEmailAsync(cmd.Email);
        if (exists is not null)
        {
            logger.LogWarning("Registration attempted with already-registered email");
            return Result.Failure<AuthResponseDto>(
                Error.Conflict("Auth.EmailInUse", "An account with this email already exists."));
        }

        var user           = ApplicationUser.Create(cmd.Email, cmd.FirstName, cmd.LastName);
        var identityResult = await userManager.CreateAsync(user, cmd.Password);

        if (!identityResult.Succeeded)
        {
            var errors = string.Join("; ", identityResult.Errors.Select(e => e.Description));
            logger.LogWarning("Registration identity failure (details suppressed)");
            return Result.Failure<AuthResponseDto>(
                Error.Failure("Auth.RegistrationFailed", errors));
        }

        await userManager.AddToRoleAsync(user, "Learner");

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

        logger.LogInformation("User {UserId} registered", user.Id);

        return Result.Success(new AuthResponseDto(
            AccessToken:  access,
            RefreshToken: rawRefresh,
            ExpiresAt:    dateTime.UtcNow.AddMinutes(AuthConstants.AccessTokenExpiryMinutes),
            User:         new UserDto(user.Id, user.Email!, user.FirstName, user.LastName)));
    }
}
