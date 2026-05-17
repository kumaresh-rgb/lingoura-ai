import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { SubscriptionPlan, SubscriptionStatus } from '@/shared/types/auth.types';
import type { UsageSummary } from '../types/billing.types';
import { isPremiumPlan } from '@/shared/constants/plan-limits';

interface SubscriptionState {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  periodEnd: string | null;
  usage: UsageSummary | null;
  isLoaded: boolean;

  setPlan: (plan: SubscriptionPlan, status: SubscriptionStatus, periodEnd: string | null) => void;
  setUsage: (usage: UsageSummary) => void;
  reset: () => void;

  // Derived selectors (called as methods to keep store self-contained)
  isPremium: () => boolean;
  isActive: () => boolean;
  canAccess: (requiredPlan: SubscriptionPlan) => boolean;
}

const PLAN_ORDER: SubscriptionPlan[] = ['FREE', 'PRO', 'TEAM', 'ENTERPRISE'];

export const useSubscriptionStore = create<SubscriptionState>()(
  devtools(
    (set, get) => ({
      plan: 'FREE',
      status: 'ACTIVE',
      periodEnd: null,
      usage: null,
      isLoaded: false,

      setPlan: (plan, status, periodEnd) => set({ plan, status, periodEnd, isLoaded: true }),

      setUsage: (usage) => set({ usage }),

      reset: () =>
        set({ plan: 'FREE', status: 'ACTIVE', periodEnd: null, usage: null, isLoaded: false }),

      isPremium: () => isPremiumPlan(get().plan) && get().status === 'ACTIVE',

      isActive: () => get().status === 'ACTIVE' || get().status === 'TRIALING',

      canAccess: (requiredPlan) => {
        const { plan, status } = get();
        const activeStatuses: SubscriptionStatus[] = ['ACTIVE', 'TRIALING'];
        if (!activeStatuses.includes(status)) return false;
        return PLAN_ORDER.indexOf(plan) >= PLAN_ORDER.indexOf(requiredPlan);
      },
    }),
    { name: 'subscription-store' }
  )
);
