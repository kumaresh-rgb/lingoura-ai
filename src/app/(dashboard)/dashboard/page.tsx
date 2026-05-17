'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Clock,
  Target,
  Zap,
  ArrowUpRight,
  ChevronRight,
  BookOpen,
  Mic2,
  Headphones,
  PenTool,
  Calendar,
  Sparkles,
  Award,
  BarChart3,
  CheckCircle2,
  AlertCircle,
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

const STAT_CONFIG = [
  {
    key: 'overallBand' as const,
    label: 'Overall Band',
    icon: Award,
    color: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-50 dark:bg-indigo-500/10',
    format: (v: number) => formatBandScore(v),
  },
  {
    key: 'studyTimeHours' as const,
    label: 'Study Time',
    icon: Clock,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-500/10',
    format: (v: number) => `${v}h`,
  },
  {
    key: 'goalBand' as const,
    label: 'Goal Target',
    icon: Target,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    format: (v: number) => formatBandScore(v),
  },
  {
    key: 'streakDays' as const,
    label: 'Daily Streak',
    icon: Zap,
    color: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-rose-50 dark:bg-rose-500/10',
    format: (v: number) => `${v}d`,
  },
] as const;

const CEFR_ICONS = {
  listening: Headphones,
  reading: BookOpen,
  speaking: Mic2,
  writing: PenTool,
};

const CEFR_COLORS = {
  listening: 'bg-indigo-500',
  reading: 'bg-violet-500',
  speaking: 'bg-emerald-500',
  writing: 'bg-rose-500',
};

export default function DashboardPage() {
  const [isShareOpen, setIsShareOpen] = React.useState(false);
  const user = useCurrentUser();
  const { data: stats } = useDashboardStats();
  const { data: activity = [] } = useDashboardActivity();
  const { data: recentTests = [] } = useDashboardRecentTests();
  const { data: cefrScores = [] } = useCefrScores();

  const firstName = user?.displayName?.split(' ')[0] ?? 'there';

  return (
    <div className="space-y-10">
      <ProfileShareCard isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />

      {/* Welcome */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-widest">
              Active Member • May 2026
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-on-surface leading-tight">
            Welcome back,{' '}
            <span className="text-indigo-600 dark:text-indigo-400">{firstName}.</span>
          </h1>
          <p className="text-lg text-on-surface-variant mt-4 leading-relaxed">
            You&apos;ve mastered{' '}
            <span className="text-indigo-600 dark:text-indigo-400 font-bold italic underline decoration-indigo-200 dark:decoration-indigo-500/30">
              42 new idioms
            </span>{' '}
            this week. Ready to tackle{' '}
            <span className="text-indigo-600 dark:text-indigo-400 font-bold italic underline decoration-indigo-200 dark:decoration-indigo-500/30">
              Advanced Negotiation
            </span>{' '}
            today?
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setIsShareOpen(true)}
            className="px-6 py-4 bg-white dark:bg-white/5 border border-outline-variant text-on-surface rounded-2xl font-bold hover:bg-slate-50 dark:hover:bg-white/10 transition-all flex items-center gap-3 active:scale-[0.97] group"
          >
            <Sparkles
              size={18}
              className="text-indigo-600 dark:text-indigo-400 group-hover:rotate-12 transition-transform"
            />
            Share Profile
          </button>
          <button className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-all flex items-center gap-2 group active:scale-[0.97]">
            Start Mock Test
            <ArrowUpRight
              size={18}
              className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
            />
          </button>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STAT_CONFIG.map((config, i) => {
          const value = stats?.[config.key] ?? 0;
          return (
            <motion.div
              key={config.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-surface-container-lowest border border-outline-variant rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={cn('p-4 rounded-2xl', config.bg)}>
                  <config.icon size={22} className={config.color} />
                </div>
                <div className="flex items-center gap-1 text-emerald-500 font-bold text-sm">
                  <ArrowUpRight size={14} />
                  +12%
                </div>
              </div>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                {config.label}
              </p>
              <h3 className="text-4xl font-black text-on-surface mt-1">{config.format(value)}</h3>
            </motion.div>
          );
        })}
      </section>

      {/* Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* CEFR + Activity chart */}
        <div className="lg:col-span-8 bg-surface-container-lowest border border-outline-variant rounded-[3rem] p-8 md:p-10 shadow-sm overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 size={18} className="text-indigo-600" />
                <h2 className="text-2xl font-black text-on-surface">IELTS Band Analysis</h2>
              </div>
              <p className="text-on-surface-variant font-medium text-sm">
                Holistic sectional performance overview
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5">
              <Calendar size={13} className="text-slate-400" />
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-tight">
                Last 30 Days
              </span>
              <ChevronRight size={13} className="text-slate-400" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* CEFR bars */}
            <div className="space-y-5">
              {cefrScores.map((data) => {
                const Icon = CEFR_ICONS[data.skill];
                const barColor = CEFR_COLORS[data.skill];
                return (
                  <div key={data.skill} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon size={15} className="text-on-surface-variant" />
                        <span className="text-sm font-bold text-on-surface capitalize">
                          {data.skill}
                        </span>
                      </div>
                      <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                        {formatBandScore(data.score)} / 9.0
                      </span>
                    </div>
                    <div className="h-2.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(data.score / 9) * 100}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className={cn('h-full rounded-full', barColor)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Activity graph */}
            <div className="relative h-56 flex items-end justify-between px-2 pt-8">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-full border-t border-slate-100/60 dark:border-white/5 border-dashed"
                  />
                ))}
              </div>
              {activity.map((d, i) => (
                <div key={i} className="relative flex flex-col items-center group/bar flex-1">
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    style={{ transformOrigin: 'bottom', height: `${(d.score / 9) * 100}%` }}
                    transition={{ duration: 0.6, delay: i * 0.06, ease: 'easeOut' }}
                    className="w-4/5 bg-gradient-to-t from-indigo-500/30 to-indigo-500 rounded-t-lg group-hover/bar:from-indigo-500/60 group-hover/bar:to-indigo-400 transition-colors duration-200 relative"
                  >
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {formatBandScore(d.score)}
                    </div>
                  </motion.div>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-3 uppercase">
                    {d.day}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Insight + Progress cards */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-200 dark:shadow-none relative overflow-hidden">
            <Zap className="absolute -right-8 -top-8 h-32 w-32 text-white/10" aria-hidden />
            <div className="relative z-10">
              <h3 className="text-xl font-black mb-3 leading-tight">IELTS Strategy Insight</h3>
              <p className="text-indigo-100 font-medium text-sm leading-relaxed mb-6">
                Based on your recent scores, focus on Section 4 monologues and academic subject markers.
              </p>
              <button className="w-full py-3.5 bg-white text-indigo-600 rounded-2xl font-bold hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2 text-sm">
                Improve Listening <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant rounded-[2.5rem] p-8 shadow-sm">
            <h3 className="text-lg font-black text-on-surface mb-5 flex items-center gap-2">
              <TrendingUp size={18} className="text-emerald-500" />
              Progress to Band {stats ? formatBandScore(stats.goalBand) : '8.5'}
            </h3>
            <div>
              <div className="flex mb-2 items-center justify-between">
                <span className="text-xs font-bold py-1 px-2 uppercase rounded-full text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400">
                  On Track
                </span>
                <span className="text-xs font-black text-on-surface">78%</span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden mb-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '78%' }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-emerald-500 rounded-full"
                />
              </div>
              <p className="text-[11px] text-on-surface-variant font-medium">
                Estimated completion in 14 days
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Tests */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-surface-container-lowest border border-outline-variant rounded-[3.5rem] p-8 md:p-10 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-on-surface">Recent Test Activity</h2>
              <p className="text-on-surface-variant font-medium text-sm">
                Your latest IELTS practice performances
              </p>
            </div>
            <button className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
              View All
            </button>
          </div>

          <div className="space-y-3">
            {recentTests.map((test) => {
              const typeIcons = {
                Listening: Headphones,
                Reading: BookOpen,
                Writing: PenTool,
                Speaking: Mic2,
              };
              const typeColors = {
                Listening: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
                Reading: 'bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400',
                Writing: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
                Speaking: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
              };
              const Icon = typeIcons[test.type] ?? BookOpen;
              const colorClass = typeColors[test.type] ?? '';
              return (
                <div
                  key={test.id}
                  className="flex items-center justify-between p-5 bg-slate-50/50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        'h-12 w-12 rounded-xl flex items-center justify-center',
                        colorClass
                      )}
                    >
                      <Icon size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-on-surface text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {test.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-on-surface-variant">{test.type}</span>
                        <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                        <span className="text-xs text-on-surface-variant">{test.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-black text-on-surface">{test.band}</div>
                    <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                      {test.score}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sectional focus */}
        <div className="lg:col-span-4">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-[3rem] p-8 shadow-sm h-full">
            <h3 className="text-lg font-black text-on-surface mb-7">Sectional Focus</h3>
            <div className="space-y-5">
              {[
                { name: 'Sentence Completion', progress: 85, color: 'bg-indigo-500' },
                { name: 'Matching Information', progress: 62, color: 'bg-violet-500' },
                { name: 'Short Answer Questions', progress: 45, color: 'bg-emerald-500' },
                { name: 'Essay Organization', progress: 70, color: 'bg-rose-500' },
              ].map((skill) => (
                <div key={skill.name} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-on-surface-variant">{skill.name}</span>
                    <span className="text-on-surface">{skill.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full', skill.color)}
                      style={{ width: `${skill.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-3.5 border border-outline-variant hover:bg-slate-50 dark:hover:bg-white/5 text-on-surface text-sm font-bold rounded-xl transition-all">
              Full Analytics Report
            </button>
          </div>
        </div>
      </section>

      {/* Tips */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: CheckCircle2,
            title: 'Listening Tip',
            text: 'Write answers in pencil — you have 10 minutes to transfer them to the answer sheet.',
            scheme: { bg: 'bg-emerald-50/40 dark:bg-emerald-500/5', border: 'border-emerald-100/60 dark:border-emerald-500/10', icon: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600', title: 'text-emerald-900 dark:text-emerald-400', body: 'text-emerald-700/70 dark:text-emerald-400/60' },
          },
          {
            icon: CheckCircle2,
            title: 'Reading Tip',
            text: "No extra transfer time is given — write answers directly on the answer sheet.",
            scheme: { bg: 'bg-blue-50/40 dark:bg-blue-500/5', border: 'border-blue-100/60 dark:border-blue-500/10', icon: 'bg-blue-100 dark:bg-blue-500/20 text-blue-600', title: 'text-blue-900 dark:text-blue-400', body: 'text-blue-700/70 dark:text-blue-400/60' },
          },
          {
            icon: AlertCircle,
            title: 'Writing Tip',
            text: 'Task 1 needs 150+ words, Task 2 needs 250+ words. Stay within the limits.',
            scheme: { bg: 'bg-amber-50/40 dark:bg-amber-500/5', border: 'border-amber-100/60 dark:border-amber-500/10', icon: 'bg-amber-100 dark:bg-amber-500/20 text-amber-600', title: 'text-amber-900 dark:text-amber-400', body: 'text-amber-700/70 dark:text-amber-400/60' },
          },
        ].map(({ icon: Icon, title, text, scheme }) => (
          <div
            key={title}
            className={cn(
              'p-7 border rounded-[2.5rem]',
              scheme.bg,
              scheme.border
            )}
          >
            <div
              className={cn(
                'h-11 w-11 rounded-xl flex items-center justify-center mb-5',
                scheme.icon
              )}
            >
              <Icon size={22} />
            </div>
            <h4 className={cn('text-base font-bold mb-2', scheme.title)}>{title}</h4>
            <p className={cn('text-sm leading-relaxed', scheme.body)}>{text}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
