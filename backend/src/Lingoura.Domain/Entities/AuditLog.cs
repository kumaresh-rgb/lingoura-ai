namespace Lingoura.Domain.Entities;

/// <summary>
/// Immutable append-only event stream. Uses long PK for ordering guarantees.
/// Never update or delete rows in this table.
/// </summary>
public sealed class AuditLog
{
    public long Id { get; init; }
    public Guid? UserId { get; init; }
    public Guid? ActorId { get; init; }                    // admin who performed the action
    public string Action { get; init; } = string.Empty;   // e.g. SUBSCRIPTION_UPGRADED
    public string? ResourceType { get; init; }
    public string? ResourceId { get; init; }
    public string? OldValueJson { get; init; }
    public string? NewValueJson { get; init; }
    public string? IpAddress { get; init; }
    public string? UserAgent { get; init; }
    public string? CorrelationId { get; init; }
    public DateTime CreatedAtUtc { get; init; } = DateTime.UtcNow;
}
