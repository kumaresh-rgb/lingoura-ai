'use client';

import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboard.api';
import { queryKeys } from '@/shared/constants/query-keys';

// --- Fallback data used until real API exists ---
const FALLBACK_STATS = {
  overallBand: 7.5,
  studyTimeHours: 42,
  goalBand: 8.5,
  streakDays: 12,
};

const FALLBACK_CEFR = [
  { skill: 'listening' as const, score: 8.0, cefrLevel: 'C1' as const },
  { skill: 'reading' as const, score: 7.5, cefrLevel: 'C1' as const },
  { skill: 'speaking' as const, score: 7.0, cefrLevel: 'B2' as const },
  { skill: 'writing' as const, score: 6.5, cefrLevel: 'B2' as const },
];

const FALLBACK_ACTIVITY = [
  { day: 'Mon', date: '2026-05-11', score: 6.5 },
  { day: 'Tue', date: '2026-05-12', score: 7.0 },
  { day: 'Wed', date: '2026-05-13', score: 7.5 },
  { day: 'Thu', date: '2026-05-14', score: 7.2 },
  { day: 'Fri', date: '2026-05-15', score: 7.8 },
  { day: 'Sat', date: '2026-05-16', score: 8.0 },
  { day: 'Sun', date: '2026-05-17', score: 7.5 },
];

const FALLBACK_TESTS = [
  {
    id: '1',
    type: 'Listening' as const,
    name: 'Section 4: Academic Lecture',
    score: '36/40',
    band: '8.0',
    date: '2 hours ago',
    status: 'completed' as const,
  },
  {
    id: '2',
    type: 'Reading' as const,
    name: 'Section 2: Work Environment',
    score: '32/40',
    band: '7.5',
    date: 'Yesterday',
    status: 'completed' as const,
  },
  {
    id: '3',
    type: 'Writing' as const,
    name: 'Task 2: Global Warming Essay',
    score: 'Pending',
    band: 'N/A',
    date: '2 days ago',
    status: 'review' as const,
  },
];

export function useDashboardStats() {
  return useQuery({
    queryKey: queryKeys.dashboard.stats(),
    queryFn: () => dashboardApi.getStats(),
    staleTime: 60_000,
    placeholderData: FALLBACK_STATS,
  });
}

export function useDashboardActivity(period = '7d') {
  return useQuery({
    queryKey: queryKeys.dashboard.activity(period),
    queryFn: () => dashboardApi.getActivity(period),
    placeholderData: FALLBACK_ACTIVITY,
  });
}

export function useDashboardRecentTests() {
  return useQuery({
    queryKey: ['dashboard', 'recent-tests'],
    queryFn: () => dashboardApi.getRecentTests(),
    placeholderData: FALLBACK_TESTS,
  });
}

// Returns static CEFR data until analytics API is built
export function useCefrScores() {
  return { data: FALLBACK_CEFR, isLoading: false };
}
