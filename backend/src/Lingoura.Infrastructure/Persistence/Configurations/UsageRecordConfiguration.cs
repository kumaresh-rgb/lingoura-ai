using Lingoura.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Lingoura.Infrastructure.Persistence.Configurations;

public sealed class UsageRecordConfiguration : IEntityTypeConfiguration<UsageRecord>
{
    public void Configure(EntityTypeBuilder<UsageRecord> b)
    {
        b.ToTable("UsageRecords");
        b.HasKey(x => x.Id);

        b.Property(x => x.Feature).HasMaxLength(50).IsRequired();

        b.HasIndex(x => new { x.UserId, x.Feature, x.PeriodStart }).IsUnique();
        b.HasIndex(x => x.PeriodEnd);

        b.HasOne(x => x.User)
         .WithMany()
         .HasForeignKey(x => x.UserId)
         .OnDelete(DeleteBehavior.Cascade);
    }
}
