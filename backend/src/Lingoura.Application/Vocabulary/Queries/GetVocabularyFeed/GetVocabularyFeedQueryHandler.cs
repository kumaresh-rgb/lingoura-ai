using Lingoura.Application.Common.Interfaces;
using Lingoura.Application.Vocabulary.DTOs;
using Lingoura.Common.Results;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Lingoura.Application.Vocabulary.Queries.GetVocabularyFeed;

public sealed class GetVocabularyFeedQueryHandler(IApplicationDbContext db)
    : IRequestHandler<GetVocabularyFeedQuery, Result<VocabularyFeedDto>>
{
    public async Task<Result<VocabularyFeedDto>> Handle(
        GetVocabularyFeedQuery request, CancellationToken ct)
    {
        var userId = request.UserId;
        var today  = DateOnly.FromDateTime(DateTime.UtcNow);

        // Word of the day (today's curated word, null if not seeded yet)
        var dailyWord = await db.DailyWords
            .Where(d => d.Date == today)
            .Include(d => d.Word)
            .FirstOrDefaultAsync(ct);

        // User's SRS progress map
        var progressMap = await db.UserWordProgress
            .Where(p => p.UserId == userId)
            .ToDictionaryAsync(p => p.WordId, ct);

        // Due for review — words in user's deck with NextReviewAt <= now
        var now = DateTime.UtcNow;
        var dueIds = progressMap.Values
            .Where(p => p.NextReviewAt <= now && p.Status != "mastered")
            .OrderBy(p => p.NextReviewAt)
            .Take(20)
            .Select(p => p.WordId)
            .ToHashSet();

        var dueWords = await db.VocabularyWords
            .Where(w => dueIds.Contains(w.Id))
            .ToListAsync(ct);

        // Recommended — words not yet in deck, ordered by IELTS band
        var inDeckIds = progressMap.Keys.ToHashSet();
        var recommended = await db.VocabularyWords
            .Where(w => !inDeckIds.Contains(w.Id) && w.IsIeltsCore)
            .OrderBy(w => w.IeltsBandMin)
            .ThenBy(w => w.Word)
            .Take(10)
            .ToListAsync(ct);

        var totalInDeck  = progressMap.Count;
        var dueCount     = dueIds.Count;
        var masteredCount = progressMap.Values.Count(p => p.Status == "mastered");

        VocabularyWordDto? wordOfDayDto = null;
        if (dailyWord is not null)
        {
            progressMap.TryGetValue(dailyWord.WordId, out var wProgress);
            wordOfDayDto = MapWord(dailyWord.Word, wProgress);
        }

        return Result.Success(new VocabularyFeedDto(
            WordOfDay:    wordOfDayDto,
            DueForReview: dueWords.Select(w => MapWord(w, progressMap.GetValueOrDefault(w.Id))).ToList(),
            Recommended:  recommended.Select(w => MapWord(w, null)).ToList(),
            TotalInDeck:  totalInDeck,
            DueCount:     dueCount,
            MasteredCount: masteredCount
        ));
    }

    private static VocabularyWordDto MapWord(
        Lingoura.Domain.Entities.VocabularyWord w,
        Lingoura.Domain.Entities.UserWordProgress? p) =>
        new(
            Id:                w.Id,
            Word:              w.Word,
            Slug:              w.Slug,
            PartOfSpeech:      w.PartOfSpeech,
            Pronunciation:     w.Pronunciation,
            PhoneticIpa:       w.PhoneticIpa,
            AudioUrl:          w.AudioUrl,
            Definition:        w.Definition,
            ShortDefinition:   w.ShortDefinition,
            CefrLevel:         w.CefrLevel,
            IeltsBandMin:      w.IeltsBandMin,
            Category:          w.Category,
            IsIeltsCore:       w.IsIeltsCore,
            IsAcademicWordList: w.IsAcademicWordList,
            Synonyms:          w.Synonyms,
            Antonyms:          w.Antonyms,
            Collocations:      w.Collocations,
            Examples:          w.Examples,
            Mnemonic:          w.Mnemonic,
            Etymology:         w.Etymology,
            CommonMistake:     w.CommonMistake,
            SrsStatus:         p?.Status,
            NextReviewAt:      p?.NextReviewAt,
            IsInDeck:          p is not null
        );
}
