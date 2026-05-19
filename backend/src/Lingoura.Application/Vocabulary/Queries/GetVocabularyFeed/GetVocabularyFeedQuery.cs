using Lingoura.Application.Vocabulary.DTOs;
using Lingoura.Common.Results;
using MediatR;

namespace Lingoura.Application.Vocabulary.Queries.GetVocabularyFeed;

public sealed record GetVocabularyFeedQuery(Guid UserId) : IRequest<Result<VocabularyFeedDto>>;
