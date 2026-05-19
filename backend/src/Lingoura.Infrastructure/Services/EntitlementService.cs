using Lingoura.Application.Common.Interfaces;
using Lingoura.Domain.Entities;
using Lingoura.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Lingoura.Infrastructure.Services;

public sealed class EntitlementService(
    IApplicationDbContext db,
    IRedisService redis,
    ILogger<EntitlementService> logger)
    : IEntitlementService
{
    public async Task<EntitlementResult> ConsumeAsync(
        Guid userId, string feature, string idempotencyKey, CancellationToken ct = default)
    {
        // 1. Load subscription
        var sub = await db.Subscriptions
            .Where(s => s.UserId == userId)
            .OrderByDescending(s => s.CreatedAtUtc)
            .FirstOrDefaultAsync(ct);

        if (sub is null || !sub.IsActive)
            return EntitlementResult.Deny("Subscription not active");

        // 2. Get plan limit
        var entitlement = await db.FeatureEntitlements
            .Where(e => e.PlanId == sub.PlanId && e.Feature == feature)
            .FirstOrDefaultAsync(ct);

        if (entitlement is null)
            return EntitlementResult.Deny("Feature not available on current plan");

        // 3. Unlimited
        if (entitlement.LimitValue == -1)
            return EntitlementResult.Allow(int.MaxValue, unlimited: true, GetResetAt(entitlement.ResetPeriod));

        // 4. Idempotency check — prevent double-counting on retry
        var idempKey = $"idem:{userId}:{feature}:{idempotencyKey}";
        if (await redis.ExistsAsync(idempKey))
        {
            logger.LogDebug("Idempotent consume skipped for key {Key}", idempKey);
            return EntitlementResult.Allow(entitlement.LimitValue, resetAt: GetResetAt(entitlement.ResetPeriod));
        }

        // 5. Atomic increment
        var redisKey  = BuildCounterKey(userId, feature, entitlement.ResetPeriod);
        var newCount  = await redis.IncrAsync(redisKey);

        if (newCount == 1)
        {
            // First use this period — set expiry aligned to period boundary
            var ttl = GetTtlToPeriodEnd(entitlement.ResetPeriod);
            await redis.ExpireAsync(redisKey, ttl);
        }

        if (newCount > entitlement.LimitValue)
        {
            // Over limit — undo the increment
            await redis.DecrAsync(redisKey);
            return EntitlementResult.Deny(
                $"Daily/monthly quota exceeded for {feature}",
                GetResetAt(entitlement.ResetPeriod));
        }

        // 6. Mark idempotency key (24 h TTL)
        await redis.SetAsync(idempKey, "1", TimeSpan.FromHours(24));

        // 7. Fire-and-forget DB update (Redis is real-time truth, DB is for audits)
        _ = Task.Run(() => UpdateDbUsageAsync(userId, feature, entitlement, (int)newCount, ct),
            CancellationToken.None);

        return EntitlementResult.Allow(
            entitlement.LimitValue - (int)newCount,
            resetAt: GetResetAt(entitlement.ResetPeriod));
    }

    public async Task<IReadOnlyList<UsageSummaryItem>> GetUsageSummaryAsync(
        Guid userId, CancellationToken ct = default)
    {
        var sub = await db.Subscriptions
            .Where(s => s.UserId == userId)
            .FirstOrDefaultAsync(ct);

        var planId = sub?.PlanId ?? SubscriptionPlan.Plans.Free;

        var entitlements = await db.FeatureEntitlements
            .Where(e => e.PlanId == planId)
            .ToListAsync(ct);

        var result = new List<UsageSummaryItem>();
        foreach (var e in entitlements)
        {
            var key   = BuildCounterKey(userId, e.Feature, e.ResetPeriod);
            var raw   = await redis.GetAsync(key);
            var used  = raw is not null && long.TryParse(raw, out var n) ? (int)n : 0;
            result.Add(new UsageSummaryItem(e.Feature, used, e.LimitValue, GetResetAt(e.ResetPeriod)));
        }
        return result;
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private static string BuildCounterKey(Guid userId, string feature, string period)
    {
        var suffix = period == FeatureEntitlement.Periods.Daily
            ? DateTime.UtcNow.ToString("yyyy-MM-dd")
            : DateTime.UtcNow.ToString("yyyy-MM");
        return $"usage:{userId}:{feature}:{suffix}";
    }

    private static TimeSpan GetTtlToPeriodEnd(string period)
    {
        var now = DateTime.UtcNow;
        return period == FeatureEntitlement.Periods.Daily
            ? new DateTime(now.Year, now.Month, now.Day, 23, 59, 59, DateTimeKind.Utc) - now
            : new DateTime(now.Year, now.Month, DateTime.DaysInMonth(now.Year, now.Month), 23, 59, 59, DateTimeKind.Utc) - now;
    }

    private static string GetResetAt(string period)
    {
        var now = DateTime.UtcNow;
        return (period == FeatureEntitlement.Periods.Daily
            ? new DateTime(now.Year, now.Month, now.Day, 23, 59, 59, DateTimeKind.Utc)
            : new DateTime(now.Year, now.Month, DateTime.DaysInMonth(now.Year, now.Month), 23, 59, 59, DateTimeKind.Utc))
            .ToString("o");
    }

    private async Task UpdateDbUsageAsync(
        Guid userId, string feature, FeatureEntitlement entitlement, int newCount, CancellationToken ct)
    {
        try
        {
            var periodStart = entitlement.ResetPeriod == FeatureEntitlement.Periods.Daily
                ? DateTime.UtcNow.Date
                : new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1, 0, 0, 0, DateTimeKind.Utc);
            var periodEnd = entitlement.ResetPeriod == FeatureEntitlement.Periods.Daily
                ? periodStart.AddDays(1)
                : periodStart.AddMonths(1);

            var record = await db.UsageRecords
                .Where(r => r.UserId == userId && r.Feature == feature && r.PeriodStart == periodStart)
                .FirstOrDefaultAsync(ct);

            if (record is null)
            {
                db.UsageRecords.Add(new UsageRecord
                {
                    UserId         = userId,
                    Feature        = feature,
                    PeriodStart    = periodStart,
                    PeriodEnd      = periodEnd,
                    UsedCount      = newCount,
                    LimitSnapshot  = entitlement.LimitValue,
                });
            }
            else
            {
                record.UsedCount    = newCount;
                record.UpdatedAtUtc = DateTime.UtcNow;
            }
            await db.SaveChangesAsync(ct);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to update DB usage for user {UserId} feature {Feature}", userId, feature);
        }
    }
}
