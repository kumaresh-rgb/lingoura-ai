namespace Lingoura.Domain.Events;

public sealed record UserRegisteredDomainEvent(Guid UserId, string Email, DateTime OccurredAtUtc);
