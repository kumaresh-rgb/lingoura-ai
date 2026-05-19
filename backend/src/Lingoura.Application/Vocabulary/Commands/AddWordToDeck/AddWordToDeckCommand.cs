using Lingoura.Common.Results;
using MediatR;

namespace Lingoura.Application.Vocabulary.Commands.AddWordToDeck;

public sealed record AddWordToDeckCommand(Guid UserId, Guid WordId) : IRequest<Result<bool>>;
