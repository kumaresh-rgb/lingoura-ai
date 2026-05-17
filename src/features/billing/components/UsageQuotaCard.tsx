'use client';

import { motion } from 'framer-motion';
import { Zap, ArrowRight, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useSubscriptionStore } from '../store/subscription.store';
import { useUsage } from '../hooks/useSubscription';
import { PLAN_LIMITS } from '@/shared/constants/plan-limits';
import { ROUTES } from '@/shared/constants/routes';
import { cn } from '@/shared/lib/utils';
import type { UsageFeature } from '../types/billing.types';

const QUOTA_ITEMS: Array<{
  feature: UsageFeature;
  label: string;
  icon: string;
  limitKey: keyof typeof PLAN_LIMITS['FREE'];
}> = [
  { feature: 'speaking_sessions', label: 'Speaking',  icon: '🎤', limitKey: 'speakingSessionsPerMonth' },
  { feature: 'writing_submissions', label: 'Writing',   icon: '✍️', limitKey: 'writingSubmissionsPerMonth' },
  { feature: 'ai_analysis',        label: 'AI',        icon: '🧠', limitKey: 'aiAnalysisPerMonth' },
  { feature: 'mock_tests',         label: 'Mock Tests',icon: '📝', limitKey: 'mockTestsPerMonth' },
];

interface QuotaMeterProps {
  label: string;
  icon: string;
  used: number;
  limit: number;
}

function QuotaMeter({ label, icon, used, limit }: QuotaMeterProps) {
  const isUnlimited = !isFinite(limit) || limit < 0;
  const pct = isUnlimited ? 0 : Math.min(100, Math.round((used / limit) * 100));
  const isWarning = pct >= 75 && !isUnlimited;
  const isDanger = pct >= 95 && !isUnlimited;
  const remaining = isUnlimited ? null : limit - used;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-sm leading-none">{icon}</span>
          <span className="text-xs font-semibold text-slate-400">{label}</span>
        </div>
        <span className={cn(
          'text-[10px] font-bold tabular-nums',
          isDanger ? 'text-red-400' : isWarning ? 'text-amber-400' : 'text-slate-500',
        )}>
          {isUnlimited ? `${used} / ∞` : `${used} / ${limit}`}
        </span>
      </div>

      {!isUnlimited && (
        <div className="h-1 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            className={cn(
              'h-full rounded-full',
              isDanger ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-indigo-500',
            )}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
          />
        </div>
      )}

      {isDanger && remaining !== null && (
        <p className="text-[10px] text-red-400/80 font-medium">
          {remaining === 0 ? 'Limit reached' : `${remaining} remaining`}
        </p>
      )}
    </div>
  );
}

export function UsageQuotaCard() {
  const { plan, isLoaded } = useSubscriptionStore();
  const { data: usage, isLoading } = useUsage();

  const limits = PLAN_LIMITS[plan];
  const isPro = plan !== 'FREE';

  function getUsed(feature: UsageFeature) {
    return usage?.records.find((r) => r.feature === feature)?.used ?? 0;
  }

  const isNearAnyLimit = QUOTA_ITEMS.some(({ feature, limitKey }) => {
    const limit = limits[limitKey] as number;
    if (!isFinite(limit)) return false;
    const pct = (getUsed(feature) / limit) * 100;
    return pct >= 75;
  });

  const resetAt = usage?.billingPeriodEnd
    ? new Date(usage.billingPeriodEnd).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    : null;

  if (!isLoaded) return null;

  return (
    <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Monthly Usage</p>
          {resetAt && (
            <p className="text-[10px] text-slate-600 mt-0.5 flex items-center gap-1">
              <RefreshCw size={9} /> Resets {resetAt}
            </p>
          )}
        </div>
        {!isPro && (
          <Link
            href={ROUTES.PRICING}
            className="flex items-center gap-1 text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Upgrade <ArrowRight size={10} />
          </Link>
        )}
      </div>

      {/* Meters */}
      {isLoading ? (
        <div className="space-y-3">
          {QUOTA_ITEMS.map((item) => (
            <div key={item.feature} className="h-6 rounded-lg bg-white/[0.04] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {QUOTA_ITEMS.map(({ feature, label, icon, limitKey }) => (
            <QuotaMeter
              key={feature}
              label={label}
              icon={icon}
              used={getUsed(feature)}
              limit={limits[limitKey] as number}
            />
          ))}
        </div>
      )}

      {/* Upgrade nudge */}
      {!isPro && isNearAnyLimit && (
        <div className="mt-4 flex items-center gap-2.5 p-3 rounded-xl bg-indigo-500/8 border border-indigo-500/20">
          <Zap size={13} className="text-indigo-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold text-indigo-300 leading-tight">Running low on quota</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Pro gives you 10× more practice.</p>
          </div>
          <Link
            href={ROUTES.PRICING}
            className="shrink-0 text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors whitespace-nowrap"
          >
            See plans →
          </Link>
        </div>
      )}
    </div>
  );
}
