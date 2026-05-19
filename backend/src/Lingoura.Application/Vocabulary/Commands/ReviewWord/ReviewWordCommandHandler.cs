using Lingoura.Application.Common.Interfaces;
using Lingoura.Application.Vocabulary.DTOs;
using Lingoura.Common.Results;
using Lingoura.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Lingoura.Application.Vocabulary.Commands.ReviewWord;

public sealed class ReviewWordCommandHandler(IApplicationDbContext db)
    : IRequestHandler<ReviewWordCommand, Result<ReviewResultDto>>
{
    public async Task<Result<ReviewResultDto>> Handle(
        ReviewWordCommand cmd, CancellationToken ct)
    {
        if (cmd.Quality is < 0 or > 5)
            return Result.Failure<ReviewResultDto>(
                Error.Validation("Vocabulary.InvalidQuality", "Quality must be 0–5."));

        var progress = await db.UserWordProgress
            .FirstOrDefaultAsync(p => p.UserId == cmd.UserId && p.WordId == cmd.WordId, ct);

        if (progress is null)
        {
            // Auto-add to deck on first review
            var wordExists = await db.VocabularyWords.AnyAsync(w => w.Id == cmd.WordId, ct);
            if (!wordExists)
                return Result.Failure<ReviewResultDto>(
                    Error.NotFound("Vocabulary.WordNotFound", "Word not found."));

            progress = new UserWordProgress
            {
                UserId = cmd.UserId,
                WordId = cmd.WordId,
            };
            db.UserWordProgress.Add(progress);
        }

        progress.ApplySM2(cmd.Quality);

        // XP: 5 base + bonus for quality
        var xp = cmd.Quality switch
        {
            5 => 15,
            4 => 10,
            3 => 5,
            _ => 2,
        };

        await db.SaveChangesAsync(ct);

        return Result.Success(new ReviewResultDto(
            WordId:         cmd.WordId,
            NewStatus:      progress.Status,
            NewIntervalDays: progress.IntervalDays,
            NextReviewAt:   progress.NextReviewAt!.Value,
            XpEarned:       xp
        ));
    }
}
