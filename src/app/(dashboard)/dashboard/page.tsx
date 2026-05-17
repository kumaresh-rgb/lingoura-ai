'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Mic2, BookOpen, Headphones, PenTool, Target, Zap, TrendingUp,
  ArrowRight, Sparkles, Brain, CheckCircle2, Clock, BarChart3,
  ChevronRight, Award, Calendar, Play, Flame, Trophy, ArrowUpRight,
  Volume2, MessageSquare,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { formatBandScore } from '@/shared/lib/format';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import {
  useDashboardStats,
  useDashboardActivity,
  useDashboardRecentTests,
  useCefrScores,
} from '@/features/dashboard/hooks/useDashboardStats';
import { ProfileShareCard } from '@/components/ProfileShareCard';
import { UsageQuotaCard } from '@/features/billing/components/UsageQuotaCard';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const },
});

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

const SKILL_CONFIG = [
  { skill: 'listening' as const, label: 'Listening', icon: Headphones, color: 'text-sky-500', bg: 'bg-sky-50 dark:bg-sky-500/10', border: 'border-sky-200 dark:border-sky-500/20', bar: 'bg-sky-500', href: '/listening', trend: +0.5 },
  { skill: 'reading'   as const, label: 'Reading',   icon: BookOpen,   color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-500/10', border: 'border-violet-200 dark:border-violet-500/20', bar: 'bg-violet-500', href: '/reading',   trend: +0.5 },
  { skill: 'writing'   as const, label: 'Writing',   icon: PenTool,    color: 'text-amber-500',  bg: 'bg-amber-50 dark:bg-amber-500/10',   border: 'border-amber-200 dark:border-amber-500/20',   bar: 'bg-amber-500',  href: '/writing',   trend: -0.5 },
  { skill: 'speaking'  as const, label: 'Speaking',  icon: Mic2,       color: 'text-emerald-500',bg: 'bg-emerald-50 dark:bg-emerald-500/10',border: 'border-emerald-200 dark:border-emerald-500/20',bar: 'bg-emerald-500',href: '/speaking',  trend: +0.5 },
];

const TODAY_TASKS = [
  { id: 1, label: 'Speaking Part 2 Practice',       detail: 'Cue card: Describe a meaningful place',         duration: '15 min', icon: Mic2,       color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10', done: false, href: '/speaking'   },
  { id: 2, label: 'Writing Task 2 — Essay',          detail: 'Technology & society: Discuss both views',       duration: '40 min', icon: PenTool,    color: 'text-amber-500',   bg: 'bg-amber-50 dark:bg-amber-500/10',     done: false, href: '/writing'    },
  { id: 3, label: 'Listening Section 3',             detail: 'Academic monologue — university lecture',        duration: '12 min', icon: Headphones, color: 'text-sky-500',     bg: 'bg-sky-50 dark:bg-sky-500/10',         done: true,  href: '/listening'  },
  { id: 4, label: 'Vocabulary: Academic Word List',  detail: '10 IELTS words — Environment & Climate',        duration: '8 min',  icon: Brain,      color: 'text-indigo-500',  bg: 'bg-indigo-50 dark:bg-indigo-500/10',   done: false, href: '/vocabulary' },
];

const QUICK_MODULES = [
  { label: 'Speaking',  sub: 'Part 1–3 AI Simulation', icon: Mic2,       colorCls: 'text-emerald-500', bg: 'from-emerald-500/8 to-emerald-500/3', border: 'border-emerald-200 dark:border-emerald-500/20', href: '/speaking'  },
  { label: 'Writing',   sub: 'Task 1 & Task 2 Lab',    icon: PenTool,    colorCls: 'text-amber-500',   bg: 'from-amber-500/8 to-amber-500/3',     border: 'border-amber-200 dark:border-amber-500/20',     href: '/writing'   },
  { label: 'Listening', sub: 'Sections 1–4 Practice',  icon: Headphones, colorCls: 'text-sky-500',     bg: 'from-sky-500/8 to-sky-500/3',         border: 'border-sky-200 dark:border-sky-500/20',         href: '/listening' },
  { label: 'Reading',   sub: 'Academic & General',     icon: BookOpen,   colorCls: 'text-violet-500',  bg: 'from-violet-500/8 to-violet-500/3',   border: 'border-violet-200 dark:border-violet-500/20',   href: '/reading'   },
];

export default function DashboardPage() {
  const [shareOpen, setShareOpen] = useState(false);
  const [tasks, setTasks] = useState(TODAY_TASKS);
  const user = useCurrentUser();
  const { data: stats }             = useDashboardStats();
  const { data: activity = [] }     = useDashboardActivity();
  const { data: recentTests = [] }  = useDashboardRecentTests();
  const { data: cefrScores = [] }   = useCefrScores();

  const firstName    = user?.displayName?.split(' ')[0] ?? 'there';
  const overallBand  = stats?.overallBand  ?? 5.5;
  const goalBand     = stats?.goalBand     ?? 7.0;
  const streak       = stats?.streakDays   ?? 0;
  const daysEstimate = Math.round((goalBand - overallBand) * 28);
  const completedCount = tasks.filter(t => t.done).length;
  const remainingMin   = tasks.filter(t => !t.done).reduce((a, t) => a + parseInt(t.duration), 0);

  function toggleTask(id: number) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  }

  return (
    <div className="space-y-7 pb-10">
      <ProfileShareCard isOpen={shareOpen} onClose={() => setShareOpen(false)} />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <motion.section
        {...fadeUp(0)}
        className="relative rounded-[2rem] overflow-hidden border border-outline-variant"
        style={{ background: 'linear-gradient(135deg,rgba(99,102,241,0.08) 0%,rgba(139,92,246,0.05) 50%,rgba(16,185,129,0.04) 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute -top-28 -right-28 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full bg-violet-500/8 blur-3xl" />
        </div>
        <div className="relative p-6 md:p-10">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
            {/* Left: greeting + AI message */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold uppercase tracking-wider">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
                  Active Member
                </span>
                {streak > 0 && (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                    <Flame size={10} /> {streak} Day Streak
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-on-surface leading-tight">
                {getGreeting()},{' '}
                <span className="bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">{firstName}.</span>
              </h1>

              {/* AI Coach message */}
              <div className="mt-5 flex items-start gap-3 p-4 rounded-2xl bg-white/60 dark:bg-white/5 border border-white/80 dark:border-white/8 max-w-xl">
                <div className="h-8 w-8 rounded-xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sparkles size={14} className="text-indigo-500" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">AI Coach</p>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    You&apos;re currently at <strong className="text-on-surface">Band {formatBandScore(overallBand)}</strong>.
                    Your target is <strong className="text-on-surface">Band {formatBandScore(goalBand)}</strong>.
                    Focus today on{' '}
                    <strong className="text-amber-600 dark:text-amber-400">Writing Task 2 coherence</strong>
                    {' '}+{' '}
                    <strong className="text-emerald-600 dark:text-emerald-400">Speaking fluency</strong>.
                  </p>
                </div>
              </div>
              <p className="mt-3 text-xs text-on-surface-variant ml-1">
                At your current pace — estimated{' '}
                <strong className="text-on-surface">{daysEstimate} days</strong> to reach Band{' '}
                {formatBandScore(goalBand)}.
              </p>
            </div>

            {/* Right: band display + CTA */}
            <div className="flex flex-col items-start md:items-end gap-5">
              <div className="flex items-center gap-5">
                <div className="text-center">
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Current Band</p>
                  <div className="text-5xl font-black text-on-surface tabular-nums">{formatBandScore(overallBand)}</div>
                </div>
                <ArrowRight size={18} className="text-on-surface-variant mt-4" />
                <div className="text-center">
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Target Band</p>
                  <div className="text-5xl font-black bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent tabular-nums">{formatBandScore(goalBand)}</div>
                </div>
              </div>
              <div className="flex gap-3 flex-wrap">
                <Link href="/speaking" className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-200 dark:shadow-none active:scale-[0.97]">
                  <Play size={13} fill="white" /> Continue Today
                </Link>
                <Link href="/progress" className="flex items-center gap-2 px-5 py-3 bg-white/70 dark:bg-white/8 hover:bg-white dark:hover:bg-white/12 border border-outline-variant text-on-surface rounded-xl text-sm font-bold transition-all active:scale-[0.97]">
                  <BarChart3 size={13} /> My Progress
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── 4 Skill Band Cards ────────────────────────────────────────────── */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {SKILL_CONFIG.map((cfg, i) => {
          const score = cefrScores.find(s => s.skill === cfg.skill)?.score ?? 0;
          const trendUp = cfg.trend > 0;
          return (
            <motion.div key={cfg.skill} {...fadeUp(0.05 + i * 0.07)}>
              <Link href={cfg.href} className={cn(
                'block p-5 rounded-2xl border bg-surface-container-lowest transition-all hover:shadow-md hover:-translate-y-0.5 group',
                cfg.border
              )}>
                <div className="flex items-center justify-between mb-3">
                  <div className={cn('h-9 w-9 rounded-xl flex items-center justify-center', cfg.bg)}>
                    <cfg.icon size={17} className={cfg.color} />
                  </div>
                  <span className={cn(
                    'text-[10px] font-bold px-2 py-0.5 rounded-full',
                    trendUp
                      ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400'
                      : 'text-rose-600 bg-rose-50 dark:bg-rose-500/10 dark:text-rose-400'
                  )}>
                    {trendUp ? '↑' : '↓'} {Math.abs(cfg.trend)}
                  </span>
                </div>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">{cfg.label}</p>
                <p className="text-2xl font-black text-on-surface">{score > 0 ? formatBandScore(score) : '—'}</p>
                {score > 0 && (
                  <div className="mt-3 h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(score / 9) * 100}%` }}
                      transition={{ duration: 0.9, delay: 0.25 + i * 0.08, ease: 'easeOut' }}
                      className={cn('h-full rounded-full', cfg.bar)}
                    />
                  </div>
                )}
                <p className="mt-2 text-[10px] font-semibold text-on-surface-variant group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                  Practice now →
                </p>
              </Link>
            </motion.div>
          );
        })}
      </section>

      {/* ── Study Plan + AI Insight ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Study Plan */}
        <motion.div {...fadeUp(0.15)} className="lg:col-span-7">
          <div className="h-full bg-surface-container-lowest border border-outline-variant rounded-[2rem] p-7 md:p-9">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <Calendar size={14} className="text-indigo-500" />
                  <h2 className="text-lg font-black text-on-surface">Today&apos;s Study Plan</h2>
                </div>
                <p className="text-xs text-on-surface-variant">
                  {completedCount}/{tasks.length} complete · {remainingMin} min remaining
                </p>
              </div>
              <span className="px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-wider flex-shrink-0">
                AI Generated
              </span>
            </div>

            <div className="space-y-2.5">
              {tasks.map((task, i) => {
                const Icon = task.icon;
                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.06, duration: 0.4 }}
                  >
                    <div
                      onClick={() => toggleTask(task.id)}
                      className={cn(
                        'flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all group',
                        task.done
                          ? 'bg-emerald-50/40 dark:bg-emerald-500/5 border-emerald-100 dark:border-emerald-500/10 opacity-60'
                          : 'bg-slate-50/40 dark:bg-white/3 border-slate-100 dark:border-white/5 hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:bg-slate-50/80 dark:hover:bg-white/5'
                      )}
                    >
                      <button
                        className={cn(
                          'h-5 w-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all',
                          task.done
                            ? 'bg-emerald-500 border-emerald-500'
                            : 'border-slate-300 dark:border-slate-600 hover:border-emerald-400'
                        )}
                      >
                        {task.done && <CheckCircle2 size={11} className="text-white" />}
                      </button>
                      <div className={cn('h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0', task.bg)}>
                        <Icon size={14} className={task.color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn('text-sm font-bold truncate', task.done ? 'line-through text-on-surface-variant' : 'text-on-surface')}>{task.label}</p>
                        <p className="text-[11px] text-on-surface-variant truncate">{task.detail}</p>
                      </div>
                      <span className="flex items-center gap-1 text-[10px] font-bold text-on-surface-variant flex-shrink-0">
                        <Clock size={10} /> {task.duration}
                      </span>
                      <ChevronRight size={13} className="text-on-surface-variant group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-6 pt-5 border-t border-outline-variant">
              <div className="flex justify-between text-[11px] font-bold text-on-surface-variant mb-2">
                <span>Daily progress</span>
                <span>{Math.round((completedCount / tasks.length) * 100)}%</span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: `${(completedCount / tasks.length) * 100}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* AI Insight + Quota */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          <motion.div {...fadeUp(0.2)}>
            <div className="relative bg-indigo-600 rounded-[2rem] p-7 text-white overflow-hidden">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/8" />
              <div className="absolute -left-6 -bottom-6 h-20 w-20 rounded-full bg-white/5" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Brain size={13} className="text-indigo-300" />
                  <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider">Weekly AI Insight</span>
                </div>
                <h3 className="text-xl font-black mb-3 leading-snug">Listening improved.<br />Writing needs focus now.</h3>
                <ul className="space-y-2 mb-5">
                  {[
                    { label: 'Listening',         change: '+0.5 bands this week',  ok: true  },
                    { label: 'Writing coherence', change: 'Below Band 6 threshold', ok: false },
                    { label: 'Vocabulary range',  change: 'Strong consistent growth', ok: true },
                  ].map(item => (
                    <li key={item.label} className="flex items-start gap-2 text-sm">
                      <span className={cn('font-black mt-0.5', item.ok ? 'text-emerald-300' : 'text-amber-300')}>
                        {item.ok ? '↑' : '↓'}
                      </span>
                      <span className="text-white/80 leading-snug">
                        <strong className="text-white">{item.label}</strong> — {item.change}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link href="/progress" className="flex items-center justify-center gap-2 w-full py-3 bg-white/15 hover:bg-white/25 rounded-xl text-sm font-bold transition-all">
                  View Full Analysis <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </motion.div>
          <motion.div {...fadeUp(0.25)}>
            <UsageQuotaCard />
          </motion.div>
        </div>
      </div>

      {/* ── Band Progress Chart + Quick Access ───────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <motion.div {...fadeUp(0.2)} className="lg:col-span-8">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-[2rem] p-7 md:p-9">
            <div className="flex items-center justify-between mb-7">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <BarChart3 size={15} className="text-indigo-500" />
                  <h2 className="text-lg font-black text-on-surface">Band Progress</h2>
                </div>
                <p className="text-xs text-on-surface-variant">Sectional performance — last 7 days</p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5">
                <Calendar size={11} className="text-slate-400" />
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">Last 7 Days</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Skill bars */}
              <div className="space-y-4">
                {SKILL_CONFIG.map((cfg) => {
                  const score = cefrScores.find(s => s.skill === cfg.skill)?.score ?? 0;
                  return (
                    <div key={cfg.skill}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <cfg.icon size={12} className={cfg.color} />
                          <span className="text-xs font-bold text-on-surface capitalize">{cfg.label}</span>
                        </div>
                        <span className={cn('text-xs font-black', cfg.color)}>
                          {score > 0 ? `${formatBandScore(score)} / 9.0` : '—'}
                        </span>
                      </div>
                      <div className="h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(score / 9) * 100}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          className={cn('h-full rounded-full', cfg.bar)}
                        />
                      </div>
                    </div>
                  );
                })}
                <div className="pt-3 border-t border-outline-variant flex items-center justify-between">
                  <span className="text-xs font-bold text-on-surface">Overall Band</span>
                  <span className="text-base font-black text-indigo-600 dark:text-indigo-400">{formatBandScore(overallBand)} / 9.0</span>
                </div>
              </div>

              {/* Weekly bar chart */}
              <div className="relative h-44 flex items-end justify-between gap-1 pt-6">
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6">
                  {[9, 7, 5, 3].map(v => (
                    <div key={v} className="flex items-center gap-2">
                      <span className="text-[9px] font-bold text-slate-300 dark:text-slate-700 w-3 text-right">{v}</span>
                      <div className="flex-1 border-t border-dashed border-slate-100 dark:border-white/5" />
                    </div>
                  ))}
                </div>
                {activity.map((d, i) => (
                  <div key={i} className="relative flex flex-col items-center group/bar flex-1">
                    <motion.div
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      style={{ transformOrigin: 'bottom', height: `${(d.score / 9) * 100}%` }}
                      transition={{ duration: 0.55, delay: 0.1 + i * 0.06, ease: 'easeOut' }}
                      className="w-full max-w-[26px] mx-auto bg-gradient-to-t from-indigo-500/20 to-indigo-500 rounded-t-md group-hover/bar:to-indigo-400 transition-colors"
                    >
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold px-2 py-0.5 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-10">
                        {formatBandScore(d.score)}
                      </div>
                    </motion.div>
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-600 mt-1.5 uppercase">{d.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Access */}
        <motion.div {...fadeUp(0.25)} className="lg:col-span-4">
          <div className="h-full bg-surface-container-lowest border border-outline-variant rounded-[2rem] p-7">
            <h3 className="text-base font-black text-on-surface mb-5 flex items-center gap-2">
              <Zap size={14} className="text-amber-500" /> Quick Practice
            </h3>
            <div className="space-y-2.5">
              {QUICK_MODULES.map(mod => {
                const Icon = mod.icon;
                return (
                  <Link key={mod.label} href={mod.href} className={cn(
                    'flex items-center gap-3 p-3.5 rounded-xl border bg-gradient-to-r transition-all hover:shadow-sm group',
                    mod.bg, mod.border
                  )}>
                    <div className="h-9 w-9 rounded-lg bg-white/70 dark:bg-black/20 flex items-center justify-center flex-shrink-0">
                      <Icon size={16} className={mod.colorCls} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-on-surface">{mod.label}</p>
                      <p className="text-[10px] text-on-surface-variant truncate">{mod.sub}</p>
                    </div>
                    <ChevronRight size={13} className="text-on-surface-variant group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
                  </Link>
                );
              })}
              <Link href="/lessons" className="flex items-center gap-3 p-3.5 rounded-xl border border-dashed border-outline-variant hover:border-indigo-300 dark:hover:border-indigo-500/40 transition-all group">
                <div className="h-9 w-9 rounded-lg bg-slate-50 dark:bg-white/5 flex items-center justify-center flex-shrink-0">
                  <Trophy size={15} className="text-on-surface-variant" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-on-surface">All Lessons</p>
                  <p className="text-[10px] text-on-surface-variant">Learning paths & roadmaps</p>
                </div>
                <ChevronRight size={13} className="text-on-surface-variant group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Recent Test Activity ──────────────────────────────────────────── */}
      <motion.section {...fadeUp(0.25)}>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-[2rem] p-7 md:p-9">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-black text-on-surface">Recent Test Activity</h2>
              <p className="text-xs text-on-surface-variant">Your latest IELTS practice performance</p>
            </div>
            <Link href="/progress" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
              View All <ChevronRight size={12} />
            </Link>
          </div>

          {recentTests.length > 0 ? (
            <div className="space-y-2">
              {recentTests.map(test => {
                const icons = { Listening: Headphones, Reading: BookOpen, Writing: PenTool, Speaking: Mic2 } as const;
                const colors = {
                  Listening: 'bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400',
                  Reading:   'bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400',
                  Writing:   'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
                  Speaking:  'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
                } as const;
                const Icon = icons[test.type as keyof typeof icons] ?? BookOpen;
                const colorCls = colors[test.type as keyof typeof colors] ?? '';
                return (
                  <div key={test.id} className="flex items-center gap-4 p-4 bg-slate-50/40 dark:bg-white/3 rounded-xl border border-slate-100 dark:border-white/5 hover:border-indigo-200 dark:hover:border-indigo-500/20 transition-all group">
                    <div className={cn('h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0', colorCls)}>
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-on-surface truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{test.name}</p>
                      <p className="text-[11px] text-on-surface-variant">{test.type} · {test.date}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-base font-black text-on-surface">{test.band}</p>
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{test.score}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Trophy size={36} className="mx-auto mb-3 text-slate-200 dark:text-slate-700" />
              <p className="text-sm font-bold text-on-surface mb-1">No tests completed yet</p>
              <p className="text-xs text-on-surface-variant mb-5">Start your first mock test and track your IELTS progress here.</p>
              <Link href="/listening" className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all">
                Start First Test <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>
      </motion.section>

      {/* ── IELTS Expert Tips ─────────────────────────────────────────────── */}
      <motion.section {...fadeUp(0.3)}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              emoji: '🎧', title: 'Listening Strategy',
              text: 'Use your 10-minute transfer time wisely — verify spelling and grammar before writing answers on the sheet.',
              bg: 'bg-sky-50/60 dark:bg-sky-500/5 border-sky-100 dark:border-sky-500/15',
              iconBg: 'bg-sky-100 dark:bg-sky-500/15', color: 'text-sky-700 dark:text-sky-400',
            },
            {
              emoji: '📖', title: 'Reading Strategy',
              text: 'Always read questions before the passage — it trains your brain to scan for relevant information and saves 3–5 minutes.',
              bg: 'bg-violet-50/60 dark:bg-violet-500/5 border-violet-100 dark:border-violet-500/15',
              iconBg: 'bg-violet-100 dark:bg-violet-500/15', color: 'text-violet-700 dark:text-violet-400',
            },
            {
              emoji: '✏️', title: 'Writing Strategy',
              text: 'Task 2 is worth double the marks. Spend 5 minutes planning your argument before writing. 40 minutes total.',
              bg: 'bg-amber-50/60 dark:bg-amber-500/5 border-amber-100 dark:border-amber-500/15',
              iconBg: 'bg-amber-100 dark:bg-amber-500/15', color: 'text-amber-700 dark:text-amber-400',
            },
          ].map(tip => (
            <div key={tip.title} className={cn('p-6 rounded-2xl border', tip.bg)}>
              <div className={cn('h-10 w-10 rounded-xl flex items-center justify-center mb-4 text-lg', tip.iconBg)}>
                {tip.emoji}
              </div>
              <h4 className={cn('text-sm font-black mb-2', tip.color)}>{tip.title}</h4>
              <p className="text-sm leading-relaxed text-on-surface-variant">{tip.text}</p>
            </div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
