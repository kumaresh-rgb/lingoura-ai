import type { CefrLevel } from '@/shared/types/auth.types';

export interface DashboardStats {
  overallBand: number;
  studyTimeHours: number;
  goalBand: number;
  streakDays: number;
}

export interface CefrSkillScore {
  skill: 'listening' | 'reading' | 'speaking' | 'writing';
  score: number;
  cefrLevel: CefrLevel;
}

export interface ActivityDataPoint {
  day: string;
  date: string;
  score: number;
}

export type TestStatus = 'completed' | 'review' | 'pending';

export interface RecentTest {
  id: string;
  type: 'Listening' | 'Reading' | 'Writing' | 'Speaking';
  name: string;
  score: string;
  band: string;
  date: string;
  status: TestStatus;
}
