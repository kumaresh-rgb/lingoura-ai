using Lingoura.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Lingoura.Infrastructure.Persistence.Configurations;

public sealed class DailyWordConfiguration : IEntityTypeConfiguration<DailyWord>
{
    public void Configure(EntityTypeBuilder<DailyWord> b)
    {
        b.ToTable("DailyWords");
        b.HasKey(x => x.Id);

        b.Property(x => x.Date).IsRequired();
        b.Property(x => x.Source).IsRequired().HasMaxLength(30).HasDefaultValue("internal");
        b.Property(x => x.MwRawJson).HasColumnType("jsonb");

        b.HasIndex(x => x.Date).IsUnique();

        b.HasOne(x => x.Word)
            .WithMany(w => w.DailyWords)
            .HasForeignKey(x => x.WordId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
