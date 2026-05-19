using Lingoura.Application.Vocabulary.DTOs;
using Lingoura.Common.Results;
using MediatR;

namespace Lingoura.Application.Vocabulary.Queries.GetVocabularyPacks;

public sealed record GetVocabularyPacksQuery : IRequest<Result<IReadOnlyList<VocabularyPackDto>>>;
