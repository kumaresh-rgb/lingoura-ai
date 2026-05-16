namespace Lingoura.Common.Extensions;

public static class StringExtensions
{
    public static bool IsNullOrWhiteSpace(this string? value) => string.IsNullOrWhiteSpace(value);

    public static string ToNormalizedEmail(this string email) =>
        email.Trim().ToLowerInvariant();
}
