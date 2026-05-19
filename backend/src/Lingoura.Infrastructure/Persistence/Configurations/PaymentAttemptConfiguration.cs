using Lingoura.Domain.Entities;
using Lingoura.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Lingoura.Infrastructure.Persistence.Configurations;

public sealed class PaymentAttemptConfiguration : IEntityTypeConfiguration<PaymentAttempt>
{
    public void Configure(EntityTypeBuilder<PaymentAttempt> b)
    {
        b.ToTable("PaymentAttempts");
        b.HasKey(x => x.Id);

        b.Property(x => x.PlanId).HasMaxLength(20).IsRequired();
        b.Property(x => x.Provider).HasConversion<string>().HasMaxLength(20);
        b.Property(x => x.SessionId).HasMaxLength(200);
        b.Property(x => x.IpAddress).HasMaxLength(50);
        b.Property(x => x.Outcome).HasMaxLength(20);
        b.Property(x => x.FailureReason).HasMaxLength(500);

        b.HasIndex(x => x.UserId);
        b.HasIndex(x => x.IpAddress);
        b.HasIndex(x => x.CreatedAtUtc);
    }
}
