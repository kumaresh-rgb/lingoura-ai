using Lingoura.Application.Common.Interfaces;
using Lingoura.Application.Vocabulary.DTOs;
using Lingoura.Common.Results;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Lingoura.Application.Vocabulary.Queries.GetPackWords;

public sealed class GetPackWordsQueryHandler(IApplicationDbContext db)
    : IRequestHandler<GetPackWordsQuery, Result<PackWordsDto>>
{
    public async Task<Result<PackWordsDto>> Handle(
        GetPackWordsQuery request, CancellationToken ct)
    {
        var pack = await db.VocabularyPacks
            .FirstOrDefaultAsync(p => p.Slug == request.PackSlug, ct);

        if (pack is null)
            return Result.Failure<PackWordsDto>(
                Error.NotFound("Vocabulary.PackNotFound", $"Pack '{request.PackSlug}' not found."));

        var progressMap = await db.UserWordProgress
            .Where(p => p.UserId == request.UserId)
            .ToDictionaryAsync(p => p.WordId, ct);

        var words = await db.PackWords
            .Where(pw => pw.PackId == pack.Id)
            .Include(pw => pw.Word)
            .OrderBy(pw => pw.SortOrder)
            .Select(pw => pw.Word)
            .ToListAsync(ct);

        var packDto = new VocabularyPackDto(
            pack.Id, pack.Slug, pack.Title, pack.Description,
            pack.Category, pack.IeltsTopicLabel, pack.BandTarget,
            pack.WordCount, pack.IsFeatured, pack.CoverEmoji, pack.Color);

        var wordDtos = words.Select(w =>
        {
            progressMap.TryGetValue(w.Id, out var p);
            return new VocabularyWordDto(
                w.Id, w.Word, w.Slug, w.PartOfSpeech,
                w.Pronunciation, w.PhoneticIpa, w.AudioUrl,
                w.Definition, w.ShortDefinition,
                w.CefrLevel, w.IeltsBandMin, w.Category,
                w.IsIeltsCore, w.IsAcademicWordList,
                w.Synonyms, w.Antonyms, w.Collocations, w.Examples,
                w.Mnemonic, w.Etymology, w.CommonMistake,
                p?.Status, p?.NextReviewAt, p is not null);
        }).ToList();

        return Result.Success(new PackWordsDto(packDto, wordDtos));
    }
}
