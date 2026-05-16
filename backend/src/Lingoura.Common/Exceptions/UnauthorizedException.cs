namespace Lingoura.Common.Exceptions;

public sealed class UnauthorizedException(string message = "Unauthorized.")
    : DomainException(message);
