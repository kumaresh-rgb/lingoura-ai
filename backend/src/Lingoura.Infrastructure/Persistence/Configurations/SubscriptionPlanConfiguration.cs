using Lingoura.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Lingoura.Infrastructure.Persistence.Configurations;

public sealed class SubscriptionPlanConfiguration : IEntityTypeConfiguration<SubscriptionPlan>
{
    public void Configure(EntityTypeBuilder<SubscriptionPlan> b)
    {
        b.ToTable("SubscriptionPlans");
        b.HasKey(x => x.Id);
        b.Property(x => x.Id).HasMaxLength(20);
        b.Property(x => x.DisplayName).HasMaxLength(100).IsRequired();
        b.Property(x => x.MonthlyPriceUsd).HasPrecision(10, 2);
        b.Property(x => x.MonthlyPriceInr).HasPrecision(10, 2);
        b.Property(x => x.AnnualPriceUsd).HasPrecision(10, 2);
        b.Property(x => x.AnnualPriceInr).HasPrecision(10, 2);
        b.Property(x => x.StripePriceIdMonthly).HasMaxLength(100);
        b.Property(x => x.StripePriceIdAnnual).HasMaxLength(100);
        b.Property(x => x.RazorpayPlanIdMonthly).HasMaxLength(100);
        b.Property(x => x.RazorpayPlanIdAnnual).HasMaxLength(100);

        b.HasMany(x => x.Entitlements)
         .WithOne(x => x.Plan)
         .HasForeignKey(x => x.PlanId)
         .OnDelete(DeleteBehavior.Cascade);

        // Seed default plans
        b.HasData(
            // INR prices include 18% GST. Formula: USD × ₹96.46 × 1.18, rounded.
            new SubscriptionPlan { Id = "FREE",       DisplayName = "Free",       MonthlyPriceUsd = 0,    AnnualPriceUsd = 0,    MonthlyPriceInr = 0,      AnnualPriceInr = 0,     SortOrder = 0 },
            new SubscriptionPlan { Id = "PRO",        DisplayName = "Pro",        MonthlyPriceUsd = 20m,  AnnualPriceUsd = 15m,  MonthlyPriceInr = 2277m,  AnnualPriceInr = 1708m, SortOrder = 1 },
            new SubscriptionPlan { Id = "ELITE",      DisplayName = "Elite",      MonthlyPriceUsd = 39m,  AnnualPriceUsd = 29m,  MonthlyPriceInr = 4439m,  AnnualPriceInr = 3301m, SortOrder = 2 },
            new SubscriptionPlan { Id = "ENTERPRISE", DisplayName = "Enterprise", MonthlyPriceUsd = 0,    AnnualPriceUsd = 0,    MonthlyPriceInr = 0,      AnnualPriceInr = 0,     SortOrder = 3 }
        );
    }
}
