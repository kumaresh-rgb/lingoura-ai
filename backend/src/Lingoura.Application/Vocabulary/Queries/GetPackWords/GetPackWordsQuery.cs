using Lingoura.Application.Vocabulary.DTOs;
using Lingoura.Common.Results;
using MediatR;

namespace Lingoura.Application.Vocabulary.Queries.GetPackWords;

public sealed record GetPackWordsQuery(Guid UserId, string PackSlug) : IRequest<Result<PackWordsDto>>;
