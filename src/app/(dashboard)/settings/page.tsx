'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, Bell, Shield, Mic2, Globe, CreditCard, LogOut,
  ChevronRight, Zap, Target, Clock, Edit3, Check, Crown, AlertTriangle,
} from 'lucide-react';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useSubscriptionStore } from '@/features/billing/store/subscription.store';
import { useOnboardingStore } from '@/features/onboarding/store/onboarding.store';
import { useLogout } from '@/features/auth/hooks/useLogout';
import { useUsage } from '@/features/billing/hooks/useSubscription';
import { useUpgradeModalStore } from '@/features/billing/store/upgrade-modal.store';
import { PLAN_LIMITS, PLAN_DISPLAY_NAMES } from '@/shared/constants/plan-limits';
import type { UsageFeature } from '@/features/billing/types/billing.types';
import { cn } from '@/shared/lib/utils';
import { ROUTES } from '@/shared/constants/routes';
import Link from 'next/link';

// ─── Usage Meter ─────────────────────────────────────────────────────────────

function UsageMeter({ label, used, total, icon }: {
  label: string; used: number; total: number; icon: string;
}) {
  const isInfinite = !isFinite(total);
  const pct = isInfinite ? 0 : Math.min(100, Math.round((used / total) * 100));
  const isWarning = pct >= 80 && !isInfinite;
  const isDanger = pct >= 95 && !isInfinite;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">{icon}</span>
          <span className="text-sm font-semibold text-slate-200">{label}</span>
        </div>
        <span className={cn(
          'text-xs font-bold',
          isDanger ? 'text-red-400' : isWarning ? 'text-amber-400' : 'text-slate-500',
        )}>
          {isInfinite ? 'Unlimited' : `${used} / ${total}`}
        </span>
      </div>
      {!isInfinite && (
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className={cn(
              'h-full rounded-full',
              isDanger ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-indigo-500',
            )}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      )}
    </div>
  );
}

// ─── Section Card ─────────────────────────────────────────────────────────────

function SectionCard({ title, children, className }: {
  title?: string; children: React.ReactNode; className?: string;
}) {
  return (
    <section className={cn('bg-white/[0.03] border border-white/8 rounded-2xl p-6', className)}>
      {title && <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-5">{title}</h3>}
      {children}
    </section>
  );
}

// ─── Settings Row ─────────────────────────────────────────────────────────────

function SettingsRow({ icon, label, desc, value, onClick }: {
  icon: React.ReactNode; label: string; desc?: string; value?: string; onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between py-3.5 px-1 hover:bg-white/[0.03] rounded-xl transition-colors group text-left"
    >
      <div className="flex items-center gap-4">
        <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-all shrink-0">
          {icon}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-200">{label}</p>
          {desc && <p className="text-xs text-slate-500 mt-0.5">{desc}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {value && <span className="text-xs font-medium text-slate-500">{value}</span>}
        <ChevronRight size={16} className="text-slate-700 group-hover:text-slate-400 transition-colors" />
      </div>
    </button>
  );
}

// ─── Plan Badge ───────────────────────────────────────────────────────────────

const PLAN_COLORS: Record<string, string> = {
  FREE: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  PRO: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  ELITE: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
  TEAM: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  ENTERPRISE: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
};

function PlanBadge({ plan }: { plan: string }) {
  return (
    <span className={cn('text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border', PLAN_COLORS[plan] ?? PLAN_COLORS.FREE)}>
      {PLAN_DISPLAY_NAMES[plan as keyof typeof PLAN_DISPLAY_NAMES] ?? plan}
    </span>
  );
}

// ─── GOAL labels ─────────────────────────────────────────────────────────────

const GOAL_LABELS: Record<string, string> = {
  ielts: 'IELTS Preparation', fluency: 'Speak Fluently', professional: 'Professional English',
  interviews: 'Job Interviews', vocabulary: 'Build Vocabulary', abroad: 'Move Abroad',
  confidence: 'Build Confidence', daily: 'Daily Communication',
};

const STYLE_LABELS: Record<string, string> = {
  video: 'Video Lessons', audio: 'Audio Listening', tests: 'Practice Tests',
  'ai-chat': 'AI Conversations', reading: 'Reading Practice',
  'vocab-drills': 'Vocabulary Drills', speaking: 'Speaking Practice',
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const { user } = useAuthStore();
  const { plan, status, periodEnd } = useSubscriptionStore();
  const onboarding = useOnboardingStore();
  const logout = useLogout();
  const { data: usageData } = useUsage();
  const openUpgradeModal = useUpgradeModalStore((s) => s.openModal);

  const limits = PLAN_LIMITS[plan];
  const isPro = plan !== 'FREE';

  function getUsed(feature: UsageFeature): number {
    return usageData?.find((r) => r.feature === feature)?.used ?? 0;
  }

  const usage = {
    speakingSessions: getUsed('speaking_sessions'),
    writingSubmissions: getUsed('writing_submissions'),
    aiAnalysis: getUsed('ai_analysis'),
    mockTests: getUsed('mock_tests'),
  };

  const [editingName, setEditingName] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName ?? '');

  const firstName = displayName.split(' ')[0] || 'Learner';
  const joinedDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—';
  const periodEndDate = periodEnd ? new Date(periodEnd).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : null;

  const weakestSkill = onboarding.hasCompletedOnboarding
    ? Object.entries(onboarding.skillRatings).sort((a, b) => a[1] - b[1])[0]
    : null;

  return (
    <div className="space-y-6 max-w-3xl">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white">Account Settings</h1>
        <p className="text-slate-500 text-sm mt-1 font-medium">Manage your profile, subscription, and preferences.</p>
      </div>

      {/* ── Profile ─────────────────────────────────────────────────────────── */}
      <SectionCard title="Profile">
        <div className="flex items-center gap-5 mb-6 pb-6 border-b border-white/5">
          {/* Avatar */}
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-2xl font-black shrink-0 select-none">
              {firstName[0]?.toUpperCase() ?? 'L'}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-[#0f172a]" />
          </div>

          {/* Name + email */}
          <div className="flex-1 min-w-0">
            {editingName ? (
              <div className="flex items-center gap-2">
                <input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-sm font-bold text-white outline-none focus:border-indigo-500/50 w-full max-w-[200px]"
                  autoFocus
                />
                <button onClick={() => setEditingName(false)} className="text-indigo-400 hover:text-indigo-300">
                  <Check size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <p className="font-bold text-white text-base truncate">{displayName || 'Your Name'}</p>
                <button onClick={() => setEditingName(true)} className="text-slate-600 hover:text-slate-400 shrink-0">
                  <Edit3 size={13} />
                </button>
              </div>
            )}
            <p className="text-sm text-slate-500 mt-0.5 truncate">{user?.email ?? '—'}</p>
            <div className="flex items-center gap-2 mt-2">
              <PlanBadge plan={plan} />
              {onboarding.cefrLevel && (
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg bg-white/5 border border-white/8 text-slate-400">
                  {onboarding.cefrLevel} Level
                </span>
              )}
              <span className="text-[10px] text-slate-600 font-medium">Joined {joinedDate}</span>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: '🎯', label: 'Primary Goal', value: onboarding.goals[0] ? GOAL_LABELS[onboarding.goals[0]] : 'Not set' },
            { icon: '📊', label: 'IELTS Target', value: onboarding.targetBand ? `Band ${onboarding.targetBand}` : onboarding.cefrLevel ?? 'Not set' },
            { icon: '⏱️', label: 'Daily Practice', value: onboarding.dailyCommitment ?? 'Not set' },
          ].map((s) => (
            <div key={s.label} className="bg-white/[0.03] border border-white/8 rounded-xl p-3">
              <p className="text-base">{s.icon}</p>
              <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-wider mt-1">{s.label}</p>
              <p className="text-xs font-bold text-slate-300 mt-0.5 truncate">{s.value}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* ── Subscription ─────────────────────────────────────────────────────── */}
      <SectionCard title="Subscription">
        <div className="flex items-start justify-between mb-5 pb-5 border-b border-white/5">
          <div>
            <div className="flex items-center gap-3 mb-1">
              {isPro && <Crown size={16} className="text-amber-400" />}
              <span className="text-lg font-black text-white">{PLAN_DISPLAY_NAMES[plan]} Plan</span>
              <PlanBadge plan={plan} />
            </div>
            <p className="text-sm text-slate-500">
              {status === 'ACTIVE' && periodEndDate ? `Renews ${periodEndDate}` :
               status === 'TRIALING' ? 'Trial active' :
               status === 'CANCELED' ? 'Cancelled — access until period end' :
               status === 'PAST_DUE' ? 'Payment failed — update billing' : 'Active'}
            </p>
          </div>
          {!isPro ? (
            <Link href={ROUTES.PRICING}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors shrink-0">
              <Zap size={12} /> Upgrade
            </Link>
          ) : (
            <Link href={ROUTES.PRICING} className="text-xs text-slate-600 hover:text-slate-400 font-medium transition-colors">
              Manage plan →
            </Link>
          )}
        </div>

        {/* Usage meters */}
        <div className="space-y-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">This month's usage</p>
          <UsageMeter label="Speaking Sessions"   icon="🎤" used={usage.speakingSessions}   total={limits.speakingSessionsPerMonth} />
          <UsageMeter label="Writing Submissions" icon="✍️" used={usage.writingSubmissions}  total={limits.writingSubmissionsPerMonth} />
          <UsageMeter label="AI Analysis"         icon="🧠" used={usage.aiAnalysis}         total={limits.aiAnalysisPerMonth} />
          <UsageMeter label="Mock Tests"          icon="📝" used={usage.mockTests}           total={limits.mockTestsPerMonth} />
        </div>

        {!isPro && (
          <div className="mt-5 flex items-center gap-3 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
            <Zap size={16} className="text-indigo-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-indigo-300">Unlock Pro for 10× more practice</p>
              <p className="text-xs text-slate-500 mt-0.5">Unlimited speaking, AI essays, mock tests & advanced analytics.</p>
            </div>
            <Link href={ROUTES.PRICING} className="ml-auto text-xs font-bold text-indigo-400 hover:text-indigo-300 shrink-0 transition-colors">
              See plans →
            </Link>
          </div>
        )}
      </SectionCard>

      {/* ── Learning Profile ─────────────────────────────────────────────────── */}
      {onboarding.hasCompletedOnboarding && (
        <SectionCard title="Learning Profile">
          <div className="space-y-4">
            {/* Goals */}
            <div>
              <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">Your Goals</p>
              <div className="flex flex-wrap gap-2">
                {onboarding.goals.map((g) => (
                  <span key={g} className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/5 border border-white/8 text-slate-300">
                    {GOAL_LABELS[g] ?? g}
                  </span>
                ))}
              </div>
            </div>

            {/* Skill snapshot */}
            <div>
              <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-3">Skill Self-Rating</p>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(onboarding.skillRatings).map(([skill, rating]) => (
                  <div key={skill} className={cn(
                    'flex items-center justify-between px-3 py-2.5 rounded-xl border',
                    weakestSkill?.[0] === skill
                      ? 'bg-amber-500/10 border-amber-500/20'
                      : 'bg-white/[0.03] border-white/8',
                  )}>
                    <span className="text-xs font-semibold text-slate-400 capitalize">{skill}</span>
                    <span className={cn('text-xs font-black', rating <= 4 ? 'text-red-400' : rating <= 6 ? 'text-amber-400' : 'text-green-400')}>
                      {rating}/10
                    </span>
                  </div>
                ))}
              </div>
              {weakestSkill && (
                <p className="text-xs text-amber-400/80 font-medium mt-2.5">
                  ⚠️ Focus area: <strong className="text-amber-300">{weakestSkill[0]}</strong> — your AI coach will prioritize this skill.
                </p>
              )}
            </div>

            {/* Learning styles */}
            {onboarding.learningStyle.length > 0 && (
              <div>
                <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">Preferred Learning Styles</p>
                <div className="flex flex-wrap gap-2">
                  {onboarding.learningStyle.map((s) => (
                    <span key={s} className="text-xs font-semibold px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                      {STYLE_LABELS[s] ?? s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => { useOnboardingStore.getState().resetOnboarding(); window.location.href = ROUTES.ONBOARDING; }}
              className="text-xs text-slate-600 hover:text-slate-400 font-medium transition-colors flex items-center gap-1.5"
            >
              <Edit3 size={12} /> Redo onboarding assessment
            </button>
          </div>
        </SectionCard>
      )}

      {/* ── Preferences ───────────────────────────────────────────────────────── */}
      <SectionCard title="Preferences">
        <div className="divide-y divide-white/5">
          <SettingsRow icon={<Bell size={16} />}   label="Notifications" desc="Daily reminders and streak alerts" />
          <SettingsRow icon={<Mic2 size={16} />}   label="Voice & Microphone" desc="Configure speech recognition settings" />
          <SettingsRow icon={<Globe size={16} />}  label="Language & Region" desc="Interface language and timezone" value="English (US)" />
          <SettingsRow icon={<Target size={16} />} label="Learning Goals" desc="Adjust your IELTS target or daily commitment" />
          <SettingsRow icon={<Clock size={16} />}  label="Study Reminders" desc="Set your preferred practice time" />
        </div>
      </SectionCard>

      {/* ── Security ──────────────────────────────────────────────────────────── */}
      <SectionCard title="Security & Privacy">
        <div className="divide-y divide-white/5">
          <SettingsRow icon={<Shield size={16} />}   label="Change Password" desc="Update your account password" />
          <SettingsRow icon={<User size={16} />}     label="Two-Factor Authentication" desc="Add extra security to your account" />
          <SettingsRow icon={<CreditCard size={16} />} label="Billing History" desc="Download invoices and receipts" />
        </div>
      </SectionCard>

      {/* ── Danger Zone ───────────────────────────────────────────────────────── */}
      <SectionCard>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 shrink-0">
              <AlertTriangle size={16} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200">Sign Out</p>
              <p className="text-xs text-slate-600">You'll need to sign in again to access your account.</p>
            </div>
          </div>
          <button
            onClick={() => logout.mutate()}
            disabled={logout.isPending}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-bold transition-all disabled:opacity-50"
          >
            <LogOut size={14} /> {logout.isPending ? 'Signing out…' : 'Sign Out'}
          </button>
        </div>
      </SectionCard>

    </div>
  );
}
