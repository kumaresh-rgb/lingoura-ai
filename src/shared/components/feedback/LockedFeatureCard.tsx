'use client';

import { Lock, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/shared/lib/utils';
import { ROUTES } from '@/shared/constants/routes';
import type { SubscriptionPlan } from '@/shared/types/auth.types';
import { PLAN_DISPLAY_NAMES } from '@/shared/constants/plan-limits';

interface LockedFeatureCardProps {
  featureName: string;
  description?: string;
  requiredPlan?: SubscriptionPlan;
  className?: string;
}

export function LockedFeatureCard({
  featureName,
  description = 'Upgrade your plan to unlock this feature.',
  requiredPlan = 'PRO',
  className,
}: LockedFeatureCardProps) {
  const planName = PLAN_DISPLAY_NAMES[requiredPlan];

  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center gap-4 p-8 rounded-2xl',
        'bg-gradient-to-br from-slate-50 to-indigo-50/50 dark:from-slate-900 dark:to-indigo-950/30',
        'border border-indigo-100 dark:border-indigo-500/20',
        'text-center',
        className
      )}
    >
      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-500/15">
        <Lock size={24} className="text-indigo-600 dark:text-indigo-400" />
      </div>

      <div className="space-y-1.5">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
          {featureName} is locked
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto">{description}</p>
      </div>

      <Link
        href={ROUTES.PRICING}
        className={cn(
          'inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold',
          'bg-indigo-600 hover:bg-indigo-700 text-white',
          'transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50'
        )}
      >
        <Sparkles size={14} />
        Upgrade to {planName}
      </Link>
    </div>
  );
}
