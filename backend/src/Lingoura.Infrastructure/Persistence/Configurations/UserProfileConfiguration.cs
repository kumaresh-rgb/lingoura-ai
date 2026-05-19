using Lingoura.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Lingoura.Infrastructure.Persistence.Configurations;

public sealed class UserProfileConfiguration : IEntityTypeConfiguration<UserProfile>
{
    public void Configure(EntityTypeBuilder<UserProfile> b)
    {
        b.ToTable("UserProfiles");
        b.HasKey(x => x.Id);

        b.Property(x => x.CefrLevel).HasMaxLength(2).IsRequired();
        b.Property(x => x.TargetBand).HasPrecision(3, 1);
        b.Property(x => x.CountryCode).HasMaxLength(2);
        b.Property(x => x.Timezone).HasMaxLength(50);
        b.Property(x => x.PreferredPaymentProvider).HasMaxLength(20);

        b.HasIndex(x => x.UserId).IsUnique();

        b.HasOne(x => x.User)
         .WithMany()
         .HasForeignKey(x => x.UserId)
         .OnDelete(DeleteBehavior.Cascade);
    }
}
