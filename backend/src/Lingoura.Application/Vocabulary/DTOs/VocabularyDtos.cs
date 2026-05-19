namespace Lingoura.Application.Vocabulary.DTOs;

public sealed record VocabularyWordDto(
    Guid Id,
    string Word,
    string Slug,
    string PartOfSpeech,
    string? Pronunciation,
    string? PhoneticIpa,
    string? AudioUrl,
    string? Definition,
    string? ShortDefinition,
    string CefrLevel,
    int IeltsBandMin,
    string Category,
    bool IsIeltsCore,
    bool IsAcademicWordList,
    string[] Synonyms,
    string[] Antonyms,
    string[] Collocations,
    string[] Examples,
    string? Mnemonic,
    string? Etymology,
    string? CommonMistake,
    // User-specific SRS state — null if word not in user's deck
    string? SrsStatus,
    DateTime? NextReviewAt,
    bool IsInDeck
);

public sealed record VocabularyFeedDto(
    VocabularyWordDto? WordOfDay,
    IReadOnlyList<VocabularyWordDto> DueForReview,
    IReadOnlyList<VocabularyWordDto> Recommended,
    int TotalInDeck,
    int DueCount,
    int MasteredCount
);

public sealed record ReviewResultDto(
    Guid WordId,
    string NewStatus,
    int NewIntervalDays,
    DateTime NextReviewAt,
    int XpEarned
);

public sealed record VocabularyPackDto(
    Guid Id,
    string Slug,
    string Title,
    string? Description,
    string? Category,
    string? IeltsTopicLabel,
    int BandTarget,
    int WordCount,
    bool IsFeatured,
    string? CoverEmoji,
    string? Color
);

public sealed record PackWordsDto(
    VocabularyPackDto Pack,
    IReadOnlyList<VocabularyWordDto> Words
);
