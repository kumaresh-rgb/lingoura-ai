namespace Lingoura.Common.Exceptions;

public sealed class NotFoundException(string resource, object key)
    : DomainException($"Resource '{resource}' with key '{key}' was not found.");
