import type { SubscriptionPlan, SubscriptionStatus } from '@/shared/types/auth.types';

export interface Subscription {
  id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
}

export interface UsageRecord {
  feature: UsageFeature;
  used: number;
  limit: number;
  resetAt: string;
}

export type UsageFeature =
  | 'speaking_sessions'
  | 'writing_submissions'
  | 'ai_analysis'
  | 'mock_tests'
  | 'vocabulary_words';

export interface UsageSummary {
  records: UsageRecord[];
  billingPeriodStart: string;
  billingPeriodEnd: string;
}

export interface BillingPlan {
  id: SubscriptionPlan;
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  features: string[];
  isPopular: boolean;
  stripePriceIdMonthly: string | null;
  stripePriceIdAnnual: string | null;
}

export type BillingInterval = 'monthly' | 'annual';

export interface CreateCheckoutRequest {
  plan: SubscriptionPlan;
  interval: BillingInterval;
  successUrl: string;
  cancelUrl: string;
}

export interface CreateCheckoutResponse {
  checkoutUrl: string;
  sessionId: string;
}

export interface CreatePortalResponse {
  portalUrl: string;
}

export interface BillingSessionStatus {
  sessionId: string;
  status: 'PENDING' | 'ACTIVE' | 'FAILED';
  plan: SubscriptionPlan | null;
  message: string | null;
}
