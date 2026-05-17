'use client';

import { cn } from '@/shared/lib/utils';
import type { UsageRecord } from '../types/billing.types';

interface UsageMeterProps {
  record: UsageRecord;
  className?: string;
}

const FEATURE_LABELS: Record<string, string> = {
  speaking_sessions: 'Speaking Sessions',
  writing_submissions: 'Writing Submissions',
  ai_analysis: 'AI Analysis',
  mock_tests: 'Mock Tests',
  vocabulary_words: 'Vocabulary (today)',
};

export function UsageMeter({ record, className }: UsageMeterProps) {
  const isUnlimited = record.limit === Infinity || record.limit < 0;
  const percentage = isUnlimited ? 0 : Math.min((record.used / record.limit) * 100, 100);
  const isNearLimit = percentage >= 80;
  const isAtLimit = percentage >= 100;

  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-slate-700 dark:text-slate-300">
          {FEATURE_LABELS[record.feature] ?? record.feature}
        </span>
        <span
          className={cn(
            'text-xs font-semibold tabular-nums',
            isAtLimit
              ? 'text-red-600 dark:text-red-400'
              : isNearLimit
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-slate-500 dark:text-slate-400'
          )}
        >
          {isUnlimited ? `${record.used} / ∞` : `${record.used} / ${record.limit}`}
        </span>
      </div>

      {!isUnlimited && (
        <div className="h-1.5 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500',
              isAtLimit
                ? 'bg-red-500'
                : isNearLimit
                  ? 'bg-amber-500'
                  : 'bg-indigo-500'
            )}
            style={{ width: `${percentage}%` }}
            role="progressbar"
            aria-valuenow={record.used}
            aria-valuemin={0}
            aria-valuemax={record.limit}
          />
        </div>
      )}
    </div>
  );
}
