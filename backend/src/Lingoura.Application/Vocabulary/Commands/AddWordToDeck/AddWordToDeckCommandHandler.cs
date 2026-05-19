using Lingoura.Application.Common.Interfaces;
using Lingoura.Common.Results;
using Lingoura.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Lingoura.Application.Vocabulary.Commands.AddWordToDeck;

public sealed class AddWordToDeckCommandHandler(IApplicationDbContext db)
    : IRequestHandler<AddWordToDeckCommand, Result<bool>>
{
    public async Task<Result<bool>> Handle(
        AddWordToDeckCommand cmd, CancellationToken ct)
    {
        var wordExists = await db.VocabularyWords.AnyAsync(w => w.Id == cmd.WordId, ct);
        if (!wordExists)
            return Result.Failure<bool>(
                Error.NotFound("Vocabulary.WordNotFound", "Word not found."));

        var alreadyInDeck = await db.UserWordProgress
            .AnyAsync(p => p.UserId == cmd.UserId && p.WordId == cmd.WordId, ct);

        if (alreadyInDeck)
            return Result.Success(false); // idempotent — already added

        db.UserWordProgress.Add(new UserWordProgress
        {
            UserId = cmd.UserId,
            WordId = cmd.WordId,
        });

        await db.SaveChangesAsync(ct);
        return Result.Success(true);
    }
}
