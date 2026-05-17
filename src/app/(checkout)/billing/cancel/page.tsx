'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { ROUTES } from '@/shared/constants/routes';

export default function BillingCancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-5 text-center max-w-sm px-6"
      >
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/10">
          <MessageCircle size={28} className="text-slate-500 dark:text-slate-400" />
        </div>

        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            No worries — you weren&apos;t charged
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            You can upgrade anytime from the pricing page. Questions? We&apos;re here to help.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => router.replace(ROUTES.DASHBOARD)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors"
          >
            <ArrowLeft size={14} />
            Dashboard
          </button>
          <button
            onClick={() => router.replace(ROUTES.PRICING)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors"
          >
            View plans
          </button>
        </div>
      </motion.div>
    </div>
  );
}
