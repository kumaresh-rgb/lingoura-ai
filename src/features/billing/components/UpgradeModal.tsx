'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Check, ArrowRight, Sparkles, Mic2, PenLine, Brain, BarChart2 } from 'lucide-react';
import { useUpgradeModalStore } from '../store/upgrade-modal.store';
import { useCreateCheckout } from '../hooks/useCreateCheckout';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { ROUTES } from '@/shared/constants/routes';
import Link from 'next/link';

const PRO_HIGHLIGHTS = [
  { icon: <Mic2 size={15} />, label: '30 speaking sessions / month', sub: 'vs. 2 on Free' },
  { icon: <PenLine size={15} />, label: '20 AI writing corrections', sub: 'IELTS-grade feedback' },
  { icon: <Brain size={15} />, label: '100 AI conversations / day', sub: 'GPT-4.1 + Claude Sonnet' },
  { icon: <BarChart2 size={15} />, label: 'Advanced fluency analytics', sub: '12+ tracked metrics' },
];

export function UpgradeModal() {
  const { isOpen, featureLabel, featureContext, closeModal } = useUpgradeModalStore();
  const { isAuthenticated } = useAuthStore();
  const checkout = useCreateCheckout();

  function handleUpgrade() {
    if (!isAuthenticated) {
      window.location.href = `${ROUTES.REGISTER}?plan=pro`;
      return;
    }
    checkout.mutate({ plan: 'PRO', interval: 'monthly' });
    closeModal();
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeModal}
          />

          {/* Panel */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0d1117] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Glow */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden">
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-64 h-32 bg-indigo-500/20 blur-3xl" />
              </div>

              {/* Dismiss */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors"
              >
                <X size={15} />
              </button>

              <div className="p-7">
                {/* Icon + heading */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center text-indigo-400 shrink-0">
                    <Zap size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-0.5">
                      Upgrade to Pro
                    </p>
                    <h2 className="text-base font-extrabold text-white leading-tight">
                      {featureLabel
                        ? `You've reached your ${featureLabel} limit`
                        : 'Unlock Pro Features'}
                    </h2>
                  </div>
                </div>

                {featureContext && (
                  <p className="text-sm text-slate-400 mb-5 leading-relaxed">{featureContext}</p>
                )}

                {/* Highlights */}
                <div className="space-y-2.5 mb-6">
                  {PRO_HIGHLIGHTS.map((h) => (
                    <div
                      key={h.label}
                      className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/6"
                    >
                      <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
                        {h.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-200 leading-tight">{h.label}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{h.sub}</p>
                      </div>
                      <Check size={13} className="text-indigo-400 shrink-0" />
                    </div>
                  ))}
                </div>

                {/* Price callout */}
                <div className="flex items-baseline gap-1.5 mb-5">
                  <span className="text-3xl font-black text-white">$19</span>
                  <span className="text-sm text-slate-500">/month</span>
                  <span className="ml-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    14-day free trial
                  </span>
                </div>

                {/* CTAs */}
                <button
                  onClick={handleUpgrade}
                  disabled={checkout.isPending}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-colors disabled:opacity-60 mb-3"
                >
                  <Sparkles size={14} />
                  {checkout.isPending ? 'Redirecting…' : 'Start Free Trial — No Card Needed'}
                  <ArrowRight size={14} />
                </button>

                <Link
                  href={ROUTES.PRICING}
                  onClick={closeModal}
                  className="flex items-center justify-center w-full py-2.5 text-xs text-slate-500 hover:text-slate-300 font-medium transition-colors"
                >
                  Compare all plans →
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
