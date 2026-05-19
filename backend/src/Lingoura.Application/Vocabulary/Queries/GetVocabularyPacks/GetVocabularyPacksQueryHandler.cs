using Lingoura.Application.Common.Interfaces;
using Lingoura.Application.Vocabulary.DTOs;
using Lingoura.Common.Results;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Lingoura.Application.Vocabulary.Queries.GetVocabularyPacks;

public sealed class GetVocabularyPacksQueryHandler(IApplicationDbContext db)
    : IRequestHandler<GetVocabularyPacksQuery, Result<IReadOnlyList<VocabularyPackDto>>>
{
    public async Task<Result<IReadOnlyList<VocabularyPackDto>>> Handle(
        GetVocabularyPacksQuery request, CancellationToken ct)
    {
        var packs = await db.VocabularyPacks
            .OrderBy(p => p.SortOrder)
            .ThenBy(p => p.Title)
            .Select(p => new VocabularyPackDto(
                p.Id, p.Slug, p.Title, p.Description,
                p.Category, p.IeltsTopicLabel, p.BandTarget,
                p.WordCount, p.IsFeatured, p.CoverEmoji, p.Color))
            .ToListAsync(ct);

        return Result.Success<IReadOnlyList<VocabularyPackDto>>(packs);
    }
}
