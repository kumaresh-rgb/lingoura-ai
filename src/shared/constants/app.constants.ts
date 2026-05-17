export const APP_NAME = 'Lingoura AI';
export const APP_DESCRIPTION = 'AI-powered English fluency platform';

export const STORAGE_KEYS = {
  ACCESS_TOKEN:  'lingoura_access_token',
  REFRESH_TOKEN: 'lingoura_refresh_token',
  PREFERENCES:   'lingoura-preferences',
  UI_STATE:      'lingoura-ui',
  SIDEBAR_PINNED: 'lingoura_sidebar_pinned',
} as const;

export const COOKIE_KEYS = {
  SESSION: 'lingoura_session',
  REFRESH_TOKEN: 'lingoura_refresh',
} as const;

export const API_TIMEOUT_MS = 15_000;
export const REFRESH_RETRY_LIMIT = 1;

export const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;
export const IELTS_BAND_MIN = 0;
export const IELTS_BAND_MAX = 9;

export const SKILL_LABELS = {
  speaking: 'Speaking',
  listening: 'Listening',
  writing: 'Writing',
  reading: 'Reading',
  vocabulary: 'Vocabulary',
} as const;
