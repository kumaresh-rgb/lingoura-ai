using Lingoura.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Lingoura.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<RefreshToken> RefreshTokens { get; }
    DbSet<UserExternalLogin> UserExternalLogins { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
