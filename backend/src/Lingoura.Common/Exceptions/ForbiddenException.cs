namespace Lingoura.Common.Exceptions;

public sealed class ForbiddenException(string message = "Access denied.")
    : DomainException(message);
