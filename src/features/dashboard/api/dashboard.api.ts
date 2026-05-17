import { get } from '@/shared/api/api-client';
import { API_ENDPOINTS } from '@/shared/api/endpoints';
import type { DashboardStats, CefrSkillScore, ActivityDataPoint, RecentTest } from '../types/dashboard.types';

export const dashboardApi = {
  getStats: (): Promise<DashboardStats> =>
    get<DashboardStats>(API_ENDPOINTS.dashboard.stats),

  getActivity: (period = '7d'): Promise<ActivityDataPoint[]> =>
    get<ActivityDataPoint[]>(API_ENDPOINTS.dashboard.activity, { period }),

  getRecentTests: (): Promise<RecentTest[]> =>
    get<RecentTest[]>(API_ENDPOINTS.dashboard.recentTests),
};
