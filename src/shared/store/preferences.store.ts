import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';
type Locale = 'en' | 'es' | 'fr' | 'ar' | 'zh';

interface PreferencesState {
  theme: Theme;
  locale: Locale;
  dailyGoalMinutes: number;
  soundEnabled: boolean;

  setTheme: (theme: Theme) => void;
  setLocale: (locale: Locale) => void;
  setDailyGoal: (minutes: number) => void;
  setSoundEnabled: (enabled: boolean) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      theme: 'system',
      locale: 'en',
      dailyGoalMinutes: 30,
      soundEnabled: true,

      setTheme: (theme) => set({ theme }),
      setLocale: (locale) => set({ locale }),
      setDailyGoal: (dailyGoalMinutes) => set({ dailyGoalMinutes }),
      setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
    }),
    { name: 'lingoura-preferences' }
  )
);
