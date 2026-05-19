namespace Lingoura.Domain.Entities;

/// <summary>
/// Per-user spaced repetition state for a vocabulary word (SM-2 algorithm).
/// </summary>
public sealed class UserWordProgress
{
    public Guid Id { get; init; } = Guid.NewGuid();
    public Guid UserId { get; init; }
    public Guid WordId { get; init; }

    // SM-2 state
    public string Status { get; set; } = "new";        // new | learning | reviewing | mastered
    public float EaseFactor { get; set; } = 2.5f;      // SM-2 ease factor (1.3 – 5.0)
    public int IntervalDays { get; set; } = 1;          // days until next review
    public int Repetitions { get; set; }                // successful repetitions in a row

    // Scheduling
    public DateTime? NextReviewAt { get; set; } = DateTime.UtcNow;
    public DateTime? LastReviewedAt { get; set; }

    // Stats
    public int CorrectStreak { get; set; }
    public int TotalReviews { get; set; }
    public int CorrectReviews { get; set; }
    public DateTime? LearnedAt { get; set; }            // when first moved out of 'new'

    public DateTime CreatedAtUtc { get; init; } = DateTime.UtcNow;
    public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;

    // Navigation
    public ApplicationUser User { get; init; } = null!;
    public VocabularyWord Word { get; init; } = null!;

    /// <summary>Applies SM-2 and returns updated progress. Quality: 0=blank 1=wrong 2=hard 3=ok 4=easy 5=perfect.</summary>
    public void ApplySM2(int quality)
    {
        TotalReviews++;

        if (quality >= 3)
        {
            CorrectReviews++;
            CorrectStreak++;

            IntervalDays = Repetitions switch
            {
                0 => 1,
                1 => 6,
                _ => (int)Math.Round(IntervalDays * EaseFactor),
            };
            Repetitions++;
            LearnedAt ??= DateTime.UtcNow;
        }
        else
        {
            CorrectStreak = 0;
            Repetitions = 0;
            IntervalDays = 1;
        }

        EaseFactor = Math.Max(1.3f,
            EaseFactor + 0.1f - (5 - quality) * (0.08f + (5 - quality) * 0.02f));

        NextReviewAt = DateTime.UtcNow.AddDays(IntervalDays);
        LastReviewedAt = DateTime.UtcNow;
        UpdatedAtUtc = DateTime.UtcNow;

        Status = Repetitions >= 8 && IntervalDays >= 21 ? "mastered"
               : IntervalDays >= 7 ? "reviewing"
               : Repetitions > 0 ? "learning"
               : "new";
    }
}
