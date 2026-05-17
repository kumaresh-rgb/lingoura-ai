'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/shared/lib/utils';
import { PricingCard } from '@/features/billing/components/PricingCard';
import { usePlans } from '@/features/billing/hooks/useSubscription';
import { useSubscriptionStore } from '@/features/billing/store/subscription.store';
import { useAuthStore } from '@/features/auth/store/auth.store';
import type { BillingInterval } from '@/features/billing/types/billing.types';

export default function PricingPage() {
  const [interval, setInterval] = useState<BillingInterval>('monthly');
  const { data: plans, isLoading } = usePlans();
  const currentPlan = useSubscriptionStore((s) => s.plan);
  const isSubscriptionActive = useSubscriptionStore((s) => s.isActive)();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Simple, transparent pricing
          </h1>
          <p className="mt-3 text-lg text-slate-500 dark:text-slate-400">
            Start free. Upgrade when you&apos;re ready.
          </p>

          {/* Interval toggle */}
          <div className="mt-8 inline-flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-white/10">
            {(['monthly', 'annual'] as BillingInterval[]).map((i) => (
              <button
                key={i}
                onClick={() => setInterval(i)}
                className={cn(
                  'px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 capitalize',
                  interval === i
                    ? 'bg-white dark:bg-white/15 text-slate-900 dark:text-slate-100 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                )}
              >
                {i}
                {i === 'annual' && (
                  <span className="ml-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    –20%
                  </span>
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Plans grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-96 rounded-2xl bg-slate-100 dark:bg-white/5 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start"
          >
            {(plans ?? []).map((plan, i) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <PricingCard
                  plan={plan}
                  interval={interval}
                  currentPlan={isAuthenticated ? currentPlan : 'FREE'}
                  isActive={isAuthenticated && isSubscriptionActive}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Footer note */}
        <p className="mt-12 text-center text-sm text-slate-400 dark:text-slate-500">
          All plans include a 14-day money-back guarantee. Prices in USD.
          <br />
          Subscriptions managed securely via Stripe.
        </p>
      </div>
    </div>
  );
}
