namespace Lingoura.Domain.Entities;

public sealed class VocabularyWord
{
    public Guid Id { get; init; } = Guid.NewGuid();

    // Core word data
    public string Word { get; set; } = null!;
    public string Slug { get; set; } = null!;           // url-safe lowercase, e.g. "mitigate"
    public string PartOfSpeech { get; set; } = null!;   // noun | verb | adjective | adverb
    public string? Pronunciation { get; set; }           // phonetic: MIT-uh-gayt
    public string? PhoneticIpa { get; set; }             // /ˈmɪtɪɡeɪt/
    public string? AudioUrl { get; set; }                // MW audio CDN

    // Definitions
    public string? Definition { get; set; }              // primary definition
    public string? ShortDefinition { get; set; }         // one-liner for cards

    // Enriched content (AI-generated, stored as Postgres text arrays)
    public string[] Synonyms { get; set; } = [];
    public string[] Antonyms { get; set; } = [];
    public string[] Collocations { get; set; } = [];
    public string[] Examples { get; set; } = [];         // IELTS-quality example sentences
    public string? Mnemonic { get; set; }
    public string? Etymology { get; set; }
    public string? CommonMistake { get; set; }

    // IELTS classification
    public string CefrLevel { get; set; } = "B2";       // A1 | A2 | B1 | B2 | C1 | C2
    public int IeltsBandMin { get; set; } = 6;           // 5–9 — minimum band this word appears at
    public string Category { get; set; } = "general";   // environment | education | technology | ...
    public bool IsIeltsCore { get; set; }
    public bool IsAcademicWordList { get; set; }         // Coxhead AWL

    // Source tracking
    public string Source { get; set; } = "internal";    // internal | merriam_webster
    public string? MwWordId { get; set; }               // MW API identifier

    public DateTime CreatedAtUtc { get; init; } = DateTime.UtcNow;
    public DateTime? EnrichedAtUtc { get; set; }

    // Navigation
    public ICollection<PackWord> PackWords { get; init; } = [];
    public ICollection<UserWordProgress> UserProgress { get; init; } = [];
    public ICollection<DailyWord> DailyWords { get; init; } = [];
}
