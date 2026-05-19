using Lingoura.Domain.Entities;
using Lingoura.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Lingoura.Infrastructure.Persistence.Configurations;

public sealed class PaymentConfiguration : IEntityTypeConfiguration<Payment>
{
    public void Configure(EntityTypeBuilder<Payment> b)
    {
        b.ToTable("Payments");
        b.HasKey(x => x.Id);

        b.Property(x => x.Provider).HasConversion<string>().HasMaxLength(20);
        b.Property(x => x.Status).HasConversion<string>().HasMaxLength(30);
        b.Property(x => x.ProviderPaymentId).HasMaxLength(200).IsRequired();
        b.Property(x => x.ProviderOrderId).HasMaxLength(200);
        b.Property(x => x.Amount).HasPrecision(12, 2);
        b.Property(x => x.Currency).HasMaxLength(3);
        b.Property(x => x.IdempotencyKey).HasMaxLength(100).IsRequired();
        b.Property(x => x.FailureReason).HasMaxLength(500);

        b.HasIndex(x => x.IdempotencyKey).IsUnique();
        b.HasIndex(x => x.UserId);
        b.HasIndex(x => x.ProviderPaymentId);

        b.HasOne(x => x.User)
         .WithMany()
         .HasForeignKey(x => x.UserId)
         .OnDelete(DeleteBehavior.Restrict);
    }
}
