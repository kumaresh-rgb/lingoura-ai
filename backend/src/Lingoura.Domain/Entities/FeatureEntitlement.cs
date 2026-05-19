namespace Lingoura.Domain.Entities;

/// <summary>
/// Per-plan limits for each metered feature.
/// LimitValue = -1 means unlimited.
/// ResetPeriod: "daily" | "monthly" | "never"
/// </summary>
public sealed class FeatureEntitlement
{
    public Guid Id { get; init; } = Guid.NewGuid();
    public string PlanId { get; init; } = string.Empty;
    public string Feature { get; init; } = string.Empty;
    public int LimitValue { get; set; }
    public string ResetPeriod { get; set; } = "monthly";
    public DateTime CreatedAtUtc { get; init; } = DateTime.UtcNow;

    public SubscriptionPlan Plan { get; init; } = null!;

    // Well-known feature keys
    public static class Features
    {
        public const string AiChats            = "ai_chats";
        public const string SpeakingSessions   = "speaking_sessions";
        public const string WritingSubmissions = "writing_submissions";
        public const string MockTests          = "mock_tests";
        public const string VocabularyWords    = "vocabulary_words";
    }

    public static class Periods
    {
        public const string Daily   = "daily";
        public const string Monthly = "monthly";
        public const string Never   = "never";
    }
}
