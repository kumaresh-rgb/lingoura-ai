'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useBillingSuccess } from '@/features/billing/hooks/useBillingSuccess';
import { ROUTES } from '@/shared/constants/routes';
import { PLAN_DISPLAY_NAMES } from '@/shared/constants/plan-limits';

export function BillingSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');

  const { isActive, isFailed, isTimedOut, plan } = useBillingSuccess(sessionId);

  useEffect(() => {
    if (!sessionId) {
      router.replace(ROUTES.PRICING);
    }
  }, [sessionId, router]);

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => router.replace(ROUTES.DASHBOARD), 3000);
      return () => clearTimeout(timer);
    }
  }, [isActive, router]);

  if (!sessionId) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-5 text-center max-w-sm px-6"
    >
      {isFailed ? (
        <>
          <XCircle size={56} className="text-red-500" />
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {isTimedOut ? 'Verification timed out' : 'Something went wrong'}
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {isTimedOut
                ? 'Your payment may have been processed. Check your email or contact support.'
                : 'Your payment could not be confirmed. You have not been charged.'}
            </p>
          </div>
          <button
            onClick={() => router.replace(ROUTES.BILLING)}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors"
          >
            Return to Billing
          </button>
        </>
      ) : isActive ? (
        <>
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <CheckCircle2 size={56} className="text-emerald-500" />
          </motion.div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Welcome to {plan ? PLAN_DISPLAY_NAMES[plan] : 'your new plan'}!
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Your subscription is active. Redirecting to your dashboard…
            </p>
          </div>
          <Loader2 size={20} className="animate-spin text-indigo-500" />
        </>
      ) : (
        <>
          <Loader2 size={48} className="animate-spin text-indigo-500" />
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Confirming your subscription…
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              This usually takes a few seconds. Please don&apos;t close this page.
            </p>
          </div>
        </>
      )}
    </motion.div>
  );
}
