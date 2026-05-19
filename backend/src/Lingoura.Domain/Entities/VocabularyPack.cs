namespace Lingoura.Domain.Entities;

/// <summary>Curated vocabulary pack — e.g. "IELTS Climate &amp; Environment Band 7".</summary>
public sealed class VocabularyPack
{
    public Guid Id { get; init; } = Guid.NewGuid();
    public string Slug { get; set; } = null!;           // url-safe: "ielts-environment-band-7"
    public string Title { get; set; } = null!;           // "Climate & Environment"
    public string? Description { get; set; }
    public string? Category { get; set; }                // environment | education | business | ...
    public string? IeltsTopicLabel { get; set; }         // Official IELTS topic label
    public int BandTarget { get; set; } = 6;             // recommended band level
    public int WordCount { get; set; }
    public bool IsFeatured { get; set; }
    public string? CoverEmoji { get; set; }
    public string? Color { get; set; }                   // Tailwind color token: "emerald" | "sky" | ...
    public int SortOrder { get; set; }

    public DateTime CreatedAtUtc { get; init; } = DateTime.UtcNow;

    // Navigation
    public ICollection<PackWord> PackWords { get; init; } = [];
}
