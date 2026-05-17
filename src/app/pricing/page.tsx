'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Crown, Users, Building2, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useSubscriptionStore } from '@/features/billing/store/subscription.store';
import { cn } from '@/shared/lib/utils';
import Link from 'next/link';
import { ROUTES } from '@/shared/constants/routes';

// ─── Static Plan Data ────────────────────────────────────────────────────────

type Interval = 'monthly' | 'annual';

interface Plan {
  id: string;
  name: string;
  icon: React.ReactNode;
  desc: string;
  price: { monthly: number; annual: number };
  color: string;
  badgeColor: string;
  isPopular: boolean;
  features: string[];
  cta: string;
  href: string;
}

const PLANS: Plan[] = [
  {
    id: 'FREE',
    name: 'Free',
    icon: <Zap size={18} />,
    desc: 'Start your English journey',
    price: { monthly: 0, annual: 0 },
    color: 'border-white/10',
    badgeColor: 'bg-slate-500/20 text-slate-400',
    isPopular: false,
    features: [
      '5 AI conversations / day',
      '2 speaking sessions / month',
      '1 mock test / month',
      '10 vocabulary words / day',
      'Basic progress dashboard',
      'Community access',
    ],
    cta: 'Get Started Free',
    href: ROUTES.REGISTER,
  },
  {
    id: 'PRO',
    name: 'Pro',
    icon: <Crown size={18} />,
    desc: 'Serious IELTS candidates',
    price: { monthly: 19, annual: 15 },
    color: 'border-indigo-500/50',
    badgeColor: 'bg-indigo-500/20 text-indigo-400',
    isPopular: true,
    features: [
      '100 AI conversations / day',
      '30 speaking sessions / month',
      '10 mock tests / month',
      '20 writing corrections / month',
      '50 vocabulary words / day',
      'Advanced analytics',
      'Personalized learning path',
      'Priority email support',
    ],
    cta: 'Start Pro',
    href: `${ROUTES.REGISTER}?plan=pro`,
  },
  {
    id: 'TEAM',
    name: 'Team',
    icon: <Users size={18} />,
    desc: 'For study groups & coaching',
    price: { monthly: 49, annual: 39 },
    color: 'border-violet-500/40',
    badgeColor: 'bg-violet-500/20 text-violet-400',
    isPopular: false,
    features: [
      'Everything in Pro',
      'Up to 10 members',
      '500 AI conversations / day',
      '100 mock tests / month',
      '80 writing corrections / month',
      'Offline access',
      'Team analytics dashboard',
      'Priority phone support',
    ],
    cta: 'Start Team',
    href: `${ROUTES.REGISTER}?plan=team`,
  },
  {
    id: 'ENTERPRISE',
    name: 'Enterprise',
    icon: <Building2 size={18} />,
    desc: 'Institutions & corporations',
    price: { monthly: 0, annual: 0 },
    color: 'border-amber-500/40',
    badgeColor: 'bg-amber-500/20 text-amber-400',
    isPopular: false,
    features: [
      'Everything in Team',
      'Unlimited members',
      'Unlimited AI usage',
      'Custom learning paths',
      'SSO & LDAP integration',
      'Dedicated account manager',
      'SLA guarantee',
      'Custom branding',
    ],
    cta: 'Contact Sales',
    href: 'mailto:sales@lingoura.ai',
  },
];

const FAQS = [
  { q: 'Can I switch plans anytime?', a: 'Yes, upgrade or downgrade at any time. Prorated credits apply immediately.' },
  { q: 'Is there a free trial for Pro?', a: 'Yes — 14-day free trial on Pro and Team, no credit card required.' },
  { q: 'What payment methods do you accept?', a: 'All major credit/debit cards via Stripe. India users can also pay via Razorpay (UPI, NetBanking).' },
  { q: 'Are limits per day or per month?', a: 'Daily limits reset at midnight UTC. Monthly limits reset on your billing date.' },
];

// ─── Components ──────────────────────────────────────────────────────────────

function PlanCard({ plan, interval, currentPlan, isAuthenticated }: {
  plan: Plan; interval: Interval; currentPlan: string; isAuthenticated: boolean;
}) {
  const price = interval === 'annual' ? plan.price.annual : plan.price.monthly;
  const isCurrent = isAuthenticated && plan.id === currentPlan;
  const isEnterprise = plan.id === 'ENTERPRISE';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'relative flex flex-col rounded-2xl border p-6',
        plan.isPopular
          ? 'bg-indigo-600/10 shadow-xl shadow-indigo-500/10'
          : 'bg-white/[0.03]',
        plan.color,
      )}
    >
      {plan.isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-indigo-600 text-white shadow-lg">
            Most Popular
          </span>
        </div>
      )}

      {/* Header */}
      <div className="mb-5">
        <div className={cn('inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold mb-3', plan.badgeColor)}>
          {plan.icon} {plan.name}
        </div>
        <p className="text-xs text-slate-500 font-medium">{plan.desc}</p>
      </div>

      {/* Price */}
      <div className="mb-6">
        {isEnterprise ? (
          <div>
            <p className="text-3xl font-black text-white">Custom</p>
            <p className="text-xs text-slate-500 mt-1">Volume-based pricing</p>
          </div>
        ) : (
          <div className="flex items-end gap-1">
            <span className="text-slate-500 text-lg font-semibold">$</span>
            <span className="text-4xl font-black text-white leading-none">{price}</span>
            <span className="text-slate-500 text-sm font-medium mb-1">/mo</span>
          </div>
        )}
        {!isEnterprise && interval === 'annual' && price > 0 && (
          <p className="text-xs text-emerald-400 font-semibold mt-1">
            Save ${(plan.price.monthly - plan.price.annual) * 12}/yr with annual billing
          </p>
        )}
      </div>

      {/* CTA */}
      {isCurrent ? (
        <div className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-center text-sm font-bold text-slate-400 mb-5">
          Current Plan
        </div>
      ) : (
        <Link
          href={plan.href}
          className={cn(
            'w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold mb-5 transition-all',
            plan.isPopular
              ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25'
              : plan.id === 'ENTERPRISE'
              ? 'border border-amber-500/40 text-amber-400 hover:bg-amber-500/10'
              : 'border border-white/10 text-slate-300 hover:border-white/25 hover:text-white',
          )}
        >
          {plan.cta} <ArrowRight size={14} />
        </Link>
      )}

      {/* Features */}
      <ul className="space-y-2.5">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5">
            <Check size={14} className={cn('shrink-0 mt-0.5', plan.isPopular ? 'text-indigo-400' : 'text-slate-500')} />
            <span className="text-xs font-medium text-slate-400">{f}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PricingPage() {
  const [interval, setInterval] = useState<Interval>('monthly');
  const { isAuthenticated } = useAuthStore();
  const currentPlan = useSubscriptionStore((s) => s.plan);

  return (
    <div className="min-h-screen bg-[#030712]" style={{ backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,0.15) 0%, transparent 70%)' }}>

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2.5">
          <img src="/logo-icon.png" alt="Lingoura AI" className="h-9 w-auto object-contain" />
          <span className="text-[17px] font-black tracking-tight">
            <span className="text-violet-400">Lingoura</span>
            <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent"> AI</span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <Link href={ROUTES.DASHBOARD} className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
              Dashboard →
            </Link>
          ) : (
            <>
              <Link href={ROUTES.LOGIN} className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">Sign In</Link>
              <Link href={ROUTES.REGISTER} className="text-sm font-bold px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors">Get Started</Link>
            </>
          )}
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 pb-24 pt-12">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Pricing</span>
          <h1 className="mt-3 text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Simple, honest pricing
          </h1>
          <p className="mt-4 text-slate-400 text-lg max-w-xl mx-auto">
            Start free forever. Upgrade when your practice demands it.
          </p>

          {/* Interval toggle */}
          <div className="mt-8 inline-flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/8">
            {(['monthly', 'annual'] as Interval[]).map((i) => (
              <button
                key={i}
                onClick={() => setInterval(i)}
                className={cn(
                  'px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 capitalize',
                  interval === i
                    ? 'bg-white/10 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-300',
                )}
              >
                {i === 'annual' ? 'Annual' : 'Monthly'}
                {i === 'annual' && (
                  <span className="ml-2 text-[10px] font-bold text-emerald-400 bg-emerald-400/15 px-1.5 py-0.5 rounded-full">
                    SAVE 17%
                  </span>
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {PLANS.map((plan, i) => (
            <motion.div key={plan.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <PlanCard plan={plan} interval={interval} currentPlan={currentPlan} isAuthenticated={isAuthenticated} />
            </motion.div>
          ))}
        </div>

        {/* Feature comparison note */}
        <div className="text-center mb-16">
          <p className="text-sm text-slate-500">
            All plans include a <span className="text-slate-300 font-semibold">14-day money-back guarantee</span>. No questions asked.
          </p>
          <p className="text-xs text-slate-600 mt-1">Secure payments via Stripe · Prices in USD · Cancel anytime</p>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-white text-center mb-8">Frequently asked questions</h2>
          <div className="space-y-3">
            {FAQS.map((faq) => (
              <div key={faq.q} className="bg-white/[0.03] border border-white/8 rounded-xl p-5">
                <p className="text-sm font-bold text-slate-200 mb-2">{faq.q}</p>
                <p className="text-sm text-slate-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
