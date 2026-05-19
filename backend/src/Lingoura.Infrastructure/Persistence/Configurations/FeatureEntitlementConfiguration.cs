using Lingoura.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Lingoura.Infrastructure.Persistence.Configurations;

public sealed class FeatureEntitlementConfiguration : IEntityTypeConfiguration<FeatureEntitlement>
{
    public void Configure(EntityTypeBuilder<FeatureEntitlement> b)
    {
        b.ToTable("FeatureEntitlements");
        b.HasKey(x => x.Id);
        b.Property(x => x.PlanId).HasMaxLength(20).IsRequired();
        b.Property(x => x.Feature).HasMaxLength(50).IsRequired();
        b.Property(x => x.ResetPeriod).HasMaxLength(10).IsRequired();

        b.HasIndex(x => new { x.PlanId, x.Feature }).IsUnique();

        b.HasData(
            // FREE
            new FeatureEntitlement { Id = new Guid("10000001-0000-0000-0000-000000000001"), PlanId = "FREE",       Feature = "ai_chats",            LimitValue = 5,    ResetPeriod = "daily"   },
            new FeatureEntitlement { Id = new Guid("10000001-0000-0000-0000-000000000002"), PlanId = "FREE",       Feature = "speaking_sessions",   LimitValue = 2,    ResetPeriod = "monthly" },
            new FeatureEntitlement { Id = new Guid("10000001-0000-0000-0000-000000000003"), PlanId = "FREE",       Feature = "writing_submissions", LimitValue = 2,    ResetPeriod = "monthly" },
            new FeatureEntitlement { Id = new Guid("10000001-0000-0000-0000-000000000004"), PlanId = "FREE",       Feature = "mock_tests",          LimitValue = 1,    ResetPeriod = "monthly" },
            new FeatureEntitlement { Id = new Guid("10000001-0000-0000-0000-000000000005"), PlanId = "FREE",       Feature = "vocabulary_words",    LimitValue = 10,   ResetPeriod = "daily"   },
            // PRO
            new FeatureEntitlement { Id = new Guid("10000002-0000-0000-0000-000000000001"), PlanId = "PRO",        Feature = "ai_chats",            LimitValue = 100,  ResetPeriod = "daily"   },
            new FeatureEntitlement { Id = new Guid("10000002-0000-0000-0000-000000000002"), PlanId = "PRO",        Feature = "speaking_sessions",   LimitValue = 30,   ResetPeriod = "monthly" },
            new FeatureEntitlement { Id = new Guid("10000002-0000-0000-0000-000000000003"), PlanId = "PRO",        Feature = "writing_submissions", LimitValue = 20,   ResetPeriod = "monthly" },
            new FeatureEntitlement { Id = new Guid("10000002-0000-0000-0000-000000000004"), PlanId = "PRO",        Feature = "mock_tests",          LimitValue = 10,   ResetPeriod = "monthly" },
            new FeatureEntitlement { Id = new Guid("10000002-0000-0000-0000-000000000005"), PlanId = "PRO",        Feature = "vocabulary_words",    LimitValue = 50,   ResetPeriod = "daily"   },
            // ELITE
            new FeatureEntitlement { Id = new Guid("10000003-0000-0000-0000-000000000001"), PlanId = "ELITE",      Feature = "ai_chats",            LimitValue = 300,  ResetPeriod = "daily"   },
            new FeatureEntitlement { Id = new Guid("10000003-0000-0000-0000-000000000002"), PlanId = "ELITE",      Feature = "speaking_sessions",   LimitValue = 100,  ResetPeriod = "monthly" },
            new FeatureEntitlement { Id = new Guid("10000003-0000-0000-0000-000000000003"), PlanId = "ELITE",      Feature = "writing_submissions", LimitValue = 100,  ResetPeriod = "monthly" },
            new FeatureEntitlement { Id = new Guid("10000003-0000-0000-0000-000000000004"), PlanId = "ELITE",      Feature = "mock_tests",          LimitValue = 30,   ResetPeriod = "monthly" },
            new FeatureEntitlement { Id = new Guid("10000003-0000-0000-0000-000000000005"), PlanId = "ELITE",      Feature = "vocabulary_words",    LimitValue = -1,   ResetPeriod = "daily"   },
            // ENTERPRISE
            new FeatureEntitlement { Id = new Guid("10000004-0000-0000-0000-000000000001"), PlanId = "ENTERPRISE", Feature = "ai_chats",            LimitValue = -1,   ResetPeriod = "daily"   },
            new FeatureEntitlement { Id = new Guid("10000004-0000-0000-0000-000000000002"), PlanId = "ENTERPRISE", Feature = "speaking_sessions",   LimitValue = -1,   ResetPeriod = "monthly" },
            new FeatureEntitlement { Id = new Guid("10000004-0000-0000-0000-000000000003"), PlanId = "ENTERPRISE", Feature = "writing_submissions", LimitValue = -1,   ResetPeriod = "monthly" },
            new FeatureEntitlement { Id = new Guid("10000004-0000-0000-0000-000000000004"), PlanId = "ENTERPRISE", Feature = "mock_tests",          LimitValue = -1,   ResetPeriod = "monthly" },
            new FeatureEntitlement { Id = new Guid("10000004-0000-0000-0000-000000000005"), PlanId = "ENTERPRISE", Feature = "vocabulary_words",    LimitValue = -1,   ResetPeriod = "daily"   }
        );
    }
}
