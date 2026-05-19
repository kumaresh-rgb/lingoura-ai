namespace Lingoura.Domain.Entities;

/// <summary>Junction table linking vocabulary packs to words.</summary>
public sealed class PackWord
{
    public Guid PackId { get; init; }
    public Guid WordId { get; init; }
    public int SortOrder { get; set; }

    // Navigation
    public VocabularyPack Pack { get; init; } = null!;
    public VocabularyWord Word { get; init; } = null!;
}
