using Lingoura.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Lingoura.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    // Auth
    DbSet<RefreshToken> RefreshTokens { get; }
    DbSet<UserExternalLogin> UserExternalLogins { get; }

    // Profile
    DbSet<UserProfile> UserProfiles { get; }

    // Billing
    DbSet<SubscriptionPlan> SubscriptionPlans { get; }
    DbSet<FeatureEntitlement> FeatureEntitlements { get; }
    DbSet<Subscription> Subscriptions { get; }
    DbSet<Payment> Payments { get; }
    DbSet<PaymentAttempt> PaymentAttempts { get; }
    DbSet<WebhookEvent> WebhookEvents { get; }
    DbSet<Invoice> Invoices { get; }

    // Usage & Audit
    DbSet<UsageRecord> UsageRecords { get; }
    DbSet<AuditLog> AuditLogs { get; }

    // Vocabulary
    DbSet<VocabularyWord> VocabularyWords { get; }
    DbSet<VocabularyPack> VocabularyPacks { get; }
    DbSet<PackWord> PackWords { get; }
    DbSet<UserWordProgress> UserWordProgress { get; }
    DbSet<DailyWord> DailyWords { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
