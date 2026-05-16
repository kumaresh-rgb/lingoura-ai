using System.ComponentModel.DataAnnotations;

namespace Lingoura.Infrastructure.Options;

public sealed class GoogleAuthOptions
{
    public const string SectionName = "GoogleAuth";

    [Required] public string ClientId { get; init; } = string.Empty;
}
