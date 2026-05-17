import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ─── Domain Types ─────────────────────────────────────────────────────────────

export type LearningGoal =
  | 'ielts' | 'fluency' | 'professional' | 'interviews'
  | 'vocabulary' | 'abroad' | 'confidence' | 'daily';

export type LearningStyle =
  | 'video' | 'audio' | 'tests' | 'ai-chat' | 'reading' | 'vocab-drills' | 'speaking';

export type DailyCommitment = '10min' | '20min' | '30min' | '1hr' | '2hr+';

export type IeltsBand = '5.0' | '5.5' | '6.0' | '6.5' | '7.0' | '7.5' | '8.0' | '8.5+';

export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface SkillRatings {
  listening: number;
  reading: number;
  writing: number;
  speaking: number;
  vocabulary: number;
  grammar: number;
}

export interface OnboardingProfile {
  goals: LearningGoal[];
  targetBand: IeltsBand | null;
  cefrLevel: CefrLevel | null;
  confidenceLevel: number;          // 1–10
  fearOfMistakes: boolean;
  hesitation: boolean;
  hardestSkill: string | null;
  skillRatings: SkillRatings;
  dailyCommitment: DailyCommitment | null;
  learningStyle: LearningStyle[];
}

// ─── Store ────────────────────────────────────────────────────────────────────

interface OnboardingState extends OnboardingProfile {
  hasCompletedOnboarding: boolean;
  completedAt: string | null;

  setProfile: (patch: Partial<OnboardingProfile>) => void;
  completeOnboarding: (profile: OnboardingProfile) => void;
  resetOnboarding: () => void;
}

const DEFAULT_SKILL_RATINGS: SkillRatings = {
  listening: 5, reading: 5, writing: 5, speaking: 5, vocabulary: 5, grammar: 5,
};

const DEFAULT_PROFILE: OnboardingProfile = {
  goals: [],
  targetBand: null,
  cefrLevel: null,
  confidenceLevel: 5,
  fearOfMistakes: false,
  hesitation: false,
  hardestSkill: null,
  skillRatings: DEFAULT_SKILL_RATINGS,
  dailyCommitment: null,
  learningStyle: [],
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      ...DEFAULT_PROFILE,
      hasCompletedOnboarding: false,
      completedAt: null,

      setProfile: (patch) => set((s) => ({ ...s, ...patch })),

      completeOnboarding: (profile) =>
        set({ ...profile, hasCompletedOnboarding: true, completedAt: new Date().toISOString() }),

      resetOnboarding: () =>
        set({ ...DEFAULT_PROFILE, hasCompletedOnboarding: false, completedAt: null }),
    }),
    { name: 'lingoura-onboarding' }
  )
);
