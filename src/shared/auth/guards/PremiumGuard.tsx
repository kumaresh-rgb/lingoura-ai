'use client';

import type { SubscriptionPlan } from '@/shared/types/auth.types';
import { useSubscriptionGate } from '@/shared/hooks/useSubscriptionGate';
import { LockedFeatureCard } from '@/shared/components/feedback/LockedFeatureCard';
import { PageSkeleton } from '@/shared/components/feedback/PageSkeleton';

interface PremiumGuardProps {
  children: React.ReactNode;
  requiredPlan?: SubscriptionPlan;
  featureName?: string;
  description?: string;
  fallback?: React.ReactNode;
}

export function PremiumGuard({
  children,
  requiredPlan = 'PRO',
  featureName = 'This feature',
  description,
  fallback,
}: PremiumGuardProps) {
  const { canAccess, isLoaded } = useSubscriptionGate(requiredPlan);

  if (!isLoaded) {
    return <PageSkeleton />;
  }

  if (!canAccess) {
    return (
      <>
        {fallback ?? (
          <LockedFeatureCard
            featureName={featureName}
            description={description}
            requiredPlan={requiredPlan}
          />
        )}
      </>
    );
  }

  return <>{children}</>;
}
