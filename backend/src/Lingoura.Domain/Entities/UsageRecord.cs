namespace Lingoura.Domain.Entities;

/// <summary>
/// PostgreSQL source-of-truth for usage per billing period.
/// Redis is the fast-path counter. This table is updated async.
/// </summary>
public sealed class UsageRecord
{
    public Guid Id { get; init; } = Guid.NewGuid();
    public Guid UserId { get; init; }
    public string Feature { get; init; } = string.Empty;
    public DateTime PeriodStart { get; init; }
    public DateTime PeriodEnd { get; init; }
    public int UsedCount { get; set; }
    public int LimitSnapshot { get; init; }        // plan limit at period start
    public DateTime CreatedAtUtc { get; init; } = DateTime.UtcNow;
    public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;

    public ApplicationUser User { get; init; } = null!;
}
