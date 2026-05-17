'use client';

import { Check, Loader2 } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useCreateCheckout } from '../hooks/useCreateCheckout';
import type { BillingPlan, BillingInterval } from '../types/billing.types';
import type { SubscriptionPlan } from '@/shared/types/auth.types';

interface PricingCardProps {
  plan: BillingPlan;
  interval: BillingInterval;
  currentPlan: SubscriptionPlan;
  isActive: boolean;
}

export function PricingCard({ plan, interval, currentPlan, isActive }: PricingCardProps) {
  const checkout = useCreateCheckout();

  const price = interval === 'annual' ? plan.annualPrice : plan.monthlyPrice;
  const isCurrent = plan.id === currentPlan && isActive;
  const isDowngrade = ['FREE', 'PRO', 'TEAM', 'ENTERPRISE'].indexOf(plan.id) <
    ['FREE', 'PRO', 'TEAM', 'ENTERPRISE'].indexOf(currentPlan);
  const isFree = plan.id === 'FREE';
  const isEnterprise = plan.id === 'ENTERPRISE';

  function handleSelect() {
    if (isCurrent || isFree || checkout.isPending) return;
    if (isEnterprise) {
      window.location.href = 'mailto:sales@lingoura.ai';
      return;
    }
    checkout.mutate({ plan: plan.id, interval });
  }

  let ctaLabel = 'Get started';
  if (isCurrent) ctaLabel = 'Current plan';
  else if (isDowngrade) ctaLabel = 'Downgrade';
  else if (isFree) ctaLabel = 'Free forever';
  else if (isEnterprise) ctaLabel = 'Contact sales';

  return (
    <div
      className={cn(
        'relative flex flex-col rounded-2xl p-6 transition-all duration-200',
        'bg-white dark:bg-white/5 border',
        plan.isPopular
          ? 'border-indigo-500 shadow-lg shadow-indigo-500/10 scale-[1.02]'
          : 'border-slate-200 dark:border-white/10',
        isCurrent && 'ring-2 ring-indigo-500/50'
      )}
    >
      {plan.isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-600 text-white tracking-wide uppercase">
            Most popular
          </span>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{plan.name}</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{plan.description}</p>
      </div>

      <div className="mb-6">
        {isEnterprise ? (
          <span className="text-3xl font-black text-slate-900 dark:text-slate-100">Custom</span>
        ) : isFree ? (
          <span className="text-3xl font-black text-slate-900 dark:text-slate-100">$0</span>
        ) : (
          <div className="flex items-end gap-1">
            <span className="text-3xl font-black text-slate-900 dark:text-slate-100">
              ${price}
            </span>
            <span className="text-sm text-slate-500 dark:text-slate-400 mb-1">/mo</span>
          </div>
        )}
        {interval === 'annual' && !isFree && !isEnterprise && (
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
            Billed annually — save 20%
          </p>
        )}
      </div>

      <ul className="flex-1 space-y-2.5 mb-6">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm">
            <Check size={15} className="mt-0.5 shrink-0 text-indigo-600 dark:text-indigo-400" />
            <span className="text-slate-600 dark:text-slate-300">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={handleSelect}
        disabled={isCurrent || isFree || checkout.isPending}
        className={cn(
          'w-full py-2.5 rounded-xl text-sm font-semibold transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50',
          'disabled:cursor-not-allowed disabled:opacity-60',
          'flex items-center justify-center gap-2',
          plan.isPopular
            ? 'bg-indigo-600 hover:bg-indigo-700 text-white disabled:bg-indigo-600'
            : 'bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-900 dark:text-slate-100'
        )}
      >
        {checkout.isPending ? <Loader2 size={14} className="animate-spin" /> : null}
        {ctaLabel}
      </button>
    </div>
  );
}
