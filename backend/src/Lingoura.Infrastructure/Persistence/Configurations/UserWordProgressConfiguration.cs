using Lingoura.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Lingoura.Infrastructure.Persistence.Configurations;

public sealed class UserWordProgressConfiguration : IEntityTypeConfiguration<UserWordProgress>
{
    public void Configure(EntityTypeBuilder<UserWordProgress> b)
    {
        b.ToTable("UserWordProgress");
        b.HasKey(x => x.Id);

        b.Property(x => x.UserId).IsRequired();
        b.Property(x => x.WordId).IsRequired();
        b.Property(x => x.Status).IsRequired().HasMaxLength(20).HasDefaultValue("new");
        b.Property(x => x.EaseFactor).HasDefaultValue(2.5f);
        b.Property(x => x.IntervalDays).HasDefaultValue(1);

        b.HasIndex(x => new { x.UserId, x.WordId }).IsUnique();
        b.HasIndex(x => new { x.UserId, x.NextReviewAt });
        b.HasIndex(x => new { x.UserId, x.Status });

        b.HasOne(x => x.User)
            .WithMany()
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        b.HasOne(x => x.Word)
            .WithMany(w => w.UserProgress)
            .HasForeignKey(x => x.WordId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
