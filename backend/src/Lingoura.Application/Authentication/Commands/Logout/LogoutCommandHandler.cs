using Lingoura.Application.Common.Interfaces;
using Lingoura.Common.Helpers;
using Lingoura.Common.Results;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Lingoura.Application.Authentication.Commands.Logout;

public sealed class LogoutCommandHandler(
    IApplicationDbContext context,
    ILogger<LogoutCommandHandler> logger)
    : IRequestHandler<LogoutCommand, Result>
{
    public async Task<Result> Handle(LogoutCommand cmd, CancellationToken ct)
    {
        var hash  = CryptoHelper.HashToken(cmd.RefreshToken);
        var token = await context.RefreshTokens
            .FirstOrDefaultAsync(t => t.TokenHash == hash, ct);

        if (token is null || !token.IsActive)
            return Result.Success();

        token.Revoke();
        await context.SaveChangesAsync(ct);

        logger.LogInformation("User {UserId} logged out", token.UserId);
        return Result.Success();
    }
}
