import type { SubscriptionPlan } from '@/shared/types/auth.types';

export interface PlanLimits {
  speakingSessionsPerMonth: number;
  writingSubmissionsPerMonth: number;
  aiAnalysisPerMonth: number;
  mockTestsPerMonth: number;
  vocabularyWordsPerDay: number;
  maxTeamMembers: number;
  hasAdvancedAnalytics: boolean;
  hasCustomLearningPath: boolean;
  hasOfflineAccess: boolean;
  hasPrioritySupport: boolean;
}

export const PLAN_LIMITS: Record<SubscriptionPlan, PlanLimits> = {
  FREE: {
    speakingSessionsPerMonth: 3,
    writingSubmissionsPerMonth: 2,
    aiAnalysisPerMonth: 5,
    mockTestsPerMonth: 1,
    vocabularyWordsPerDay: 10,
    maxTeamMembers: 1,
    hasAdvancedAnalytics: false,
    hasCustomLearningPath: false,
    hasOfflineAccess: false,
    hasPrioritySupport: false,
  },
  PRO: {
    speakingSessionsPerMonth: 30,
    writingSubmissionsPerMonth: 20,
    aiAnalysisPerMonth: 100,
    mockTestsPerMonth: 10,
    vocabularyWordsPerDay: 50,
    maxTeamMembers: 1,
    hasAdvancedAnalytics: true,
    hasCustomLearningPath: true,
    hasOfflineAccess: false,
    hasPrioritySupport: false,
  },
  ELITE: {
    speakingSessionsPerMonth: 100,
    writingSubmissionsPerMonth: 100,
    aiAnalysisPerMonth: 300,
    mockTestsPerMonth: 30,
    vocabularyWordsPerDay: Infinity,
    maxTeamMembers: 1,
    hasAdvancedAnalytics: true,
    hasCustomLearningPath: true,
    hasOfflineAccess: true,
    hasPrioritySupport: true,
  },
  TEAM: {
    speakingSessionsPerMonth: 100,
    writingSubmissionsPerMonth: 80,
    aiAnalysisPerMonth: 500,
    mockTestsPerMonth: 30,
    vocabularyWordsPerDay: 200,
    maxTeamMembers: 10,
    hasAdvancedAnalytics: true,
    hasCustomLearningPath: true,
    hasOfflineAccess: true,
    hasPrioritySupport: true,
  },
  ENTERPRISE: {
    speakingSessionsPerMonth: Infinity,
    writingSubmissionsPerMonth: Infinity,
    aiAnalysisPerMonth: Infinity,
    mockTestsPerMonth: Infinity,
    vocabularyWordsPerDay: Infinity,
    maxTeamMembers: Infinity,
    hasAdvancedAnalytics: true,
    hasCustomLearningPath: true,
    hasOfflineAccess: true,
    hasPrioritySupport: true,
  },
};

export const PLAN_DISPLAY_NAMES: Record<SubscriptionPlan, string> = {
  FREE: 'Free',
  PRO: 'Pro',
  ELITE: 'Elite',
  TEAM: 'Team',
  ENTERPRISE: 'Enterprise',
};

export const PLAN_PRICES_USD: Record<SubscriptionPlan, { monthly: number; annual: number }> = {
  FREE: { monthly: 0, annual: 0 },
  PRO: { monthly: 19, annual: 15 },
  ELITE: { monthly: 39, annual: 29 },
  TEAM: { monthly: 49, annual: 39 },
  ENTERPRISE: { monthly: 0, annual: 0 }, // custom pricing
};

export const PREMIUM_PLANS: SubscriptionPlan[] = ['PRO', 'ELITE', 'TEAM', 'ENTERPRISE'];

export function isPremiumPlan(plan: SubscriptionPlan): boolean {
  return PREMIUM_PLANS.includes(plan);
}

export function canUpgradeTo(current: SubscriptionPlan, target: SubscriptionPlan): boolean {
  const order: SubscriptionPlan[] = ['FREE', 'PRO', 'TEAM', 'ENTERPRISE'];
  return order.indexOf(target) > order.indexOf(current);
}
