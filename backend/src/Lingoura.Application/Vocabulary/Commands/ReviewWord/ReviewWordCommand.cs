using Lingoura.Application.Vocabulary.DTOs;
using Lingoura.Common.Results;
using MediatR;

namespace Lingoura.Application.Vocabulary.Commands.ReviewWord;

public sealed record ReviewWordCommand(
    Guid UserId,
    Guid WordId,
    int Quality   // 0=blank 1=wrong 2=hard 3=ok 4=easy 5=perfect
) : IRequest<Result<ReviewResultDto>>;
