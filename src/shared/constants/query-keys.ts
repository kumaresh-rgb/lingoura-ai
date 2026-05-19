export const queryKeys = {
  auth: {
    me: () => ['auth', 'me'] as const,
  },
  dashboard: {
    stats: () => ['dashboard', 'stats'] as const,
    activity: (period: string) => ['dashboard', 'activity', period] as const,
  },
  speaking: {
    sessions: () => ['speaking', 'sessions'] as const,
    session: (id: string) => ['speaking', 'sessions', id] as const,
  },
  listening: {
    tests: () => ['listening', 'tests'] as const,
    test: (id: string) => ['listening', 'tests', id] as const,
  },
  writing: {
    tasks: () => ['writing', 'tasks'] as const,
    task: (id: string) => ['writing', 'tasks', id] as const,
  },
  vocabulary: {
    feed: () => ['vocabulary', 'feed'] as const,
    packs: () => ['vocabulary', 'packs'] as const,
    pack: (slug: string) => ['vocabulary', 'packs', slug] as const,
  },
  lessons: {
    list: () => ['lessons'] as const,
    lesson: (id: string) => ['lessons', id] as const,
  },
  analytics: {
    overview: () => ['analytics', 'overview'] as const,
    progress: () => ['analytics', 'progress'] as const,
    cefrHistory: () => ['analytics', 'cefr-history'] as const,
  },
  settings: {
    profile: () => ['settings', 'profile'] as const,
  },
  billing: {
    subscription: () => ['billing', 'subscription'] as const,
    usage: () => ['billing', 'usage'] as const,
    plans: () => ['billing', 'plans'] as const,
    session: (id: string) => ['billing', 'session', id] as const,
  },
} as const;
