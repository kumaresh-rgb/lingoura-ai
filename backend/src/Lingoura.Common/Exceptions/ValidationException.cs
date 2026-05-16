namespace Lingoura.Common.Exceptions;

public sealed class ValidationException(IReadOnlyDictionary<string, string[]> errors)
    : DomainException("One or more validation errors occurred.")
{
    public IReadOnlyDictionary<string, string[]> Errors { get; } = errors;
}
