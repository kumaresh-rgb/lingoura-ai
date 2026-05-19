namespace Lingoura.Domain.Entities;

/// <summary>
/// Tracks the word of the day (sourced from Merriam-Webster or curated internally).
/// One record per calendar date.
/// </summary>
public sealed class DailyWord
{
    public Guid Id { get; init; } = Guid.NewGuid();
    public DateOnly Date { get; init; }
    public Guid WordId { get; init; }
    public string Source { get; set; } = "internal";    // internal | merriam_webster
    public string? MwRawJson { get; set; }              // cached raw MW API response (JSON)
    public DateTime FetchedAtUtc { get; init; } = DateTime.UtcNow;

    // Navigation
    public VocabularyWord Word { get; init; } = null!;
}
