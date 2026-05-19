using Lingoura.Domain.Entities;
using Lingoura.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Lingoura.Infrastructure.Persistence.Configurations;

public sealed class SubscriptionConfiguration : IEntityTypeConfiguration<Subscription>
{
    public void Configure(EntityTypeBuilder<Subscription> b)
    {
        b.ToTable("Subscriptions");
        b.HasKey(x => x.Id);

        b.Property(x => x.PlanId).HasMaxLength(20).IsRequired();
        b.Property(x => x.Status).HasConversion<string>().HasMaxLength(20);
        b.Property(x => x.Interval).HasConversion<string>().HasMaxLength(10);
        b.Property(x => x.Provider).HasConversion<string>().HasMaxLength(20);

        b.Property(x => x.StripeCustomerId).HasMaxLength(100);
        b.Property(x => x.StripeSubscriptionId).HasMaxLength(100);
        b.Property(x => x.StripePriceId).HasMaxLength(100);
        b.Property(x => x.RazorpayCustomerId).HasMaxLength(100);
        b.Property(x => x.RazorpaySubscriptionId).HasMaxLength(100);
        b.Property(x => x.RazorpayPlanId).HasMaxLength(100);

        b.HasIndex(x => x.UserId);
        b.HasIndex(x => x.Status);
        b.HasIndex(x => x.StripeSubscriptionId).IsUnique().HasFilter("\"StripeSubscriptionId\" IS NOT NULL");
        b.HasIndex(x => x.RazorpaySubscriptionId).IsUnique().HasFilter("\"RazorpaySubscriptionId\" IS NOT NULL");

        b.HasOne(x => x.User)
         .WithMany()
         .HasForeignKey(x => x.UserId)
         .OnDelete(DeleteBehavior.Cascade);

        b.HasOne(x => x.Plan)
         .WithMany(x => x.Subscriptions)
         .HasForeignKey(x => x.PlanId)
         .OnDelete(DeleteBehavior.Restrict);

        b.HasMany(x => x.Payments)
         .WithOne(x => x.Subscription)
         .HasForeignKey(x => x.SubscriptionId)
         .OnDelete(DeleteBehavior.SetNull);
    }
}
