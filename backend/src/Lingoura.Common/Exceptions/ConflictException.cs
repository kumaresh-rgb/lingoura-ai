namespace Lingoura.Common.Exceptions;

public sealed class ConflictException(string message) : DomainException(message);
