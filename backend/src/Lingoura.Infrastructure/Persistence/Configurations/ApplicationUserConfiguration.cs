using Lingoura.Common.Constants;
using Lingoura.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Lingoura.Infrastructure.Persistence.Configurations;

public sealed class ApplicationUserConfiguration : IEntityTypeConfiguration<ApplicationUser>
{
    public void Configure(EntityTypeBuilder<ApplicationUser> builder)
    {
        builder.Property(u => u.FirstName).HasMaxLength(AuthConstants.MaxNameLength).IsRequired();
        builder.Property(u => u.LastName).HasMaxLength(AuthConstants.MaxNameLength).IsRequired();
        builder.Property(u => u.AvatarUrl).HasMaxLength(2048);
        builder.Property(u => u.CreatedAtUtc).IsRequired();
        builder.Property(u => u.UpdatedAtUtc).IsRequired();

        builder.HasQueryFilter(u => !u.IsDeleted);
    }
}
