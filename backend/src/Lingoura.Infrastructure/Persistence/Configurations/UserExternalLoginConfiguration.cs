using Lingoura.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Lingoura.Infrastructure.Persistence.Configurations;

public sealed class UserExternalLoginConfiguration : IEntityTypeConfiguration<UserExternalLogin>
{
    public void Configure(EntityTypeBuilder<UserExternalLogin> builder)
    {
        builder.HasKey(x => x.Id);
        builder.HasIndex(x => new { x.Provider, x.ProviderUserId }).IsUnique();
        builder.HasIndex(x => x.UserId);

        builder.Property(x => x.ProviderUserId).HasMaxLength(256).IsRequired();
        builder.Property(x => x.ProviderEmail).HasMaxLength(254);

        builder.HasOne(x => x.User)
               .WithMany(u => u.ExternalLogins)
               .HasForeignKey(x => x.UserId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasQueryFilter(x => !x.User.IsDeleted);
    }
}
