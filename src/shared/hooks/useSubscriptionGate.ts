'use client';

import { useSubscriptionStore } from '@/features/billing/store/subscription.store';
import type { SubscriptionPlan } from '@/shared/types/auth.types';

export interface SubscriptionGate {
  canAccess: boolean;
  isPremium: boolean;
  isActive: boolean;
  currentPlan: SubscriptionPlan;
  isLoaded: boolean;
}

export function useSubscriptionGate(requiredPlan: SubscriptionPlan = 'PRO'): SubscriptionGate {
  const plan = useSubscriptionStore((s) => s.plan);
  const isLoaded = useSubscriptionStore((s) => s.isLoaded);
  const canAccess = useSubscriptionStore((s) => s.canAccess);
  const isPremium = useSubscriptionStore((s) => s.isPremium);
  const isActive = useSubscriptionStore((s) => s.isActive);

  return {
    canAccess: canAccess(requiredPlan),
    isPremium: isPremium(),
    isActive: isActive(),
    currentPlan: plan,
    isLoaded,
  };
}
