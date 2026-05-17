'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3, TrendingUp, Calendar, Target, Award, Clock,
  Zap, Mic2, Headphones, PenTool, BookOpen, Flame,
  ArrowUpRight, Sparkles, Star, Trophy, CheckCircle2, Brain,
} from 'lucide-react';
import { ProfileShareCard } from '@/components/ProfileShareCard';
import { cn } from '@/lib/utils';

type Period = '7d' | '30d' | '90d';

const BAND_HISTORY = [
  { date: 'Week 1', listening: 5.5, reading: 5.0, writing: 4.5, speaking: 5.0 },
  { date: 'Week 2', listening: 6.0, reading: 5.5, writing: 5.0, speaking: 5.5 },
  { date: 'Week 3', listening: 6.0, reading: 6.0, writing: 5.0, speaking: 5.5 },
  { date: 'Week 4', listening: 6.5, reading: 6.5, writing: 5.5, speaking: 6.0 },
  { date: 'Week 5', listening: 7.0, reading: 6.5, writing: 5.5, speaking: 6.0 },
  { date: 'Week 6', listening: 7.0, reading: 7.0, writing: 6.0, speaking: 6.5 },
];

const ACHIEVEMENTS = [
  { id: 1,  title: '7-Day Streak',        desc: 'Studied 7 consecutive days',           icon: Flame,      color: 'text-amber-500',   bg: 'bg-amber-50 dark:bg-amber-500/10',     unlocked: true  },
  { id: 2,  title: 'First Mock Test',     desc: 'Completed your first full mock test',   icon: Trophy,     color: 'text-indigo-500',  bg: 'bg-indigo-50 dark:bg-indigo-500/10',   unlocked: true  },
  { id: 3,  title: 'Band 6 Achieved',     desc: 'Reached overall Band 6.0',              icon: Star,       color: 'text-yellow-500',  bg: 'bg-yellow-50 dark:bg-yellow-500/10',   unlocked: true  },
  { id: 4,  title: '100 Words Mastered',  desc: 'Learned 100 vocabulary words',          icon: BookOpen,   color: 'text-violet-500',  bg: 'bg-violet-50 dark:bg-violet-500/10',   unlocked: true  },
  { id: 5,  title: 'Speaking Champion',   desc: 'Scored 7.0 or above in Speaking',       icon: Mic2,       color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10', unlocked: false },
  { id: 6,  title: '30-Day Streak',       desc: 'Studied 30 consecutive days',           icon: Zap,        color: 'text-rose-500',    bg: 'bg-rose-50 dark:bg-rose-500/10',       unlocked: false },
  { id: 7,  title: 'Writing Wizard',      desc: 'Scored Band 7+ in Writing Task 2',      icon: PenTool,    color: 'text-sky-500',     bg: 'bg-sky-50 dark:bg-sky-500/10',         unlocked: false },
  { id: 8,  title: 'Target Reached',      desc: 'Achieved your target IELTS band',       icon: Target,     color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10', unlocked: false },
];

const SKILLS = [
  { skill: 'Listening', icon: Headphones, current: 7.0, start: 5.5, target: 8.0, color: 'text-sky-500', bg: 'bg-sky-50 dark:bg-sky-500/10', bar: 'bg-sky-500'     },
  { skill: 'Reading',   icon: BookOpen,   current: 7.0, start: 5.0, target: 7.5, color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-500/10', bar: 'bg-violet-500' },
  { skill: 'Writing',   icon: PenTool,    current: 6.0, start: 4.5, target: 7.0, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10', bar: 'bg-amber-500'   },
  { skill: 'Speaking',  icon: Mic2,       current: 6.5, start: 5.0, target: 7.5, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10', bar: 'bg-emerald-500' },
];

const WEEKS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const CONSISTENCY = [
  [true, true, false, true, true, false, true],
  [true, true, true, true, false, true, false],
  [false, true, true, true, true, true, true],
  [true, true, true, false, true, true, true],
];

export default function ProgressPage() {
  const [shareOpen, setShareOpen] = useState(false);
  const [period, setPeriod] = useState<Period>('30d');

  const overallCurrent = 6.5;
  const overallStart   = 5.0;
  const overallTarget  = 7.5;
  const improvement    = overallCurrent - overallStart;

  return (
    <div className="space-y-8 pb-10">
      <ProfileShareCard isOpen={shareOpen} onClose={() => setShareOpen(false)} />

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-[2rem] overflow-hidden border border-emerald-200 dark:border-emerald-500/20 p-7 md:p-10"
        style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.07) 0%, rgba(5,150,105,0.04) 50%, rgba(16,185,129,0.02) 100%)' }}
      >
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                <TrendingUp size={10} /> Active Growth
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-white/8 text-on-surface-variant text-[10px] font-bold uppercase tracking-wider">
                Data Verified
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-on-surface leading-tight">
              Fluency<br />
              <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Analytics</span>
            </h1>
            <p className="mt-3 text-sm text-on-surface-variant leading-relaxed">
              You&apos;ve improved by <strong className="text-emerald-600 dark:text-emerald-400">+{improvement} bands</strong> since you started.
              Target Band <strong className="text-on-surface">{overallTarget}</strong> is within reach.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            {(['7d', '30d', '90d'] as Period[]).map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  'px-4 py-2 rounded-xl text-xs font-bold border transition-all',
                  period === p
                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                    : 'bg-white/60 dark:bg-white/5 border-outline-variant text-on-surface-variant hover:border-emerald-300 dark:hover:border-emerald-500/40'
                )}
              >
                {p === '7d' ? 'Last 7 Days' : p === '30d' ? 'Last 30 Days' : 'Last 90 Days'}
              </button>
            ))}
            <button
              onClick={() => setShareOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-500/20"
            >
              <Sparkles size={12} /> Share Card
            </button>
          </div>
        </div>
      </motion.section>

      {/* ── Overall Band Stats ────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Current Band',     val: overallCurrent.toFixed(1), change: `+${improvement}`,  icon: BarChart3,  color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
          { label: 'Target Band',      val: overallTarget.toFixed(1),  change: null,                icon: Target,     color: 'text-emerald-500',bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
          { label: 'Study Streak',     val: '12 days',                 change: 'Best: 18d',         icon: Flame,      color: 'text-amber-500',  bg: 'bg-amber-50 dark:bg-amber-500/10'   },
          { label: 'Study Hours',      val: '47h',                     change: '+8h this week',     icon: Clock,      color: 'text-sky-500',    bg: 'bg-sky-50 dark:bg-sky-500/10'       },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <div className="bg-surface-container-lowest border border-outline-variant rounded-[2rem] p-6">
              <div className="flex items-center justify-between mb-3">
                <div className={cn('h-9 w-9 rounded-xl flex items-center justify-center', stat.bg)}>
                  <stat.icon size={16} className={stat.color} />
                </div>
                {stat.change && (
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">{stat.change}</span>
                )}
              </div>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">{stat.label}</p>
              <p className="text-2xl font-black text-on-surface">{stat.val}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Band Progress by Skill + Chart ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Skill progress */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-5">
          <div className="h-full bg-surface-container-lowest border border-outline-variant rounded-[2rem] p-7">
            <h2 className="text-lg font-black text-on-surface mb-6">Skill Band Progress</h2>
            <div className="space-y-6">
              {SKILLS.map(skill => {
                const progress = ((skill.current - skill.start) / (skill.target - skill.start)) * 100;
                return (
                  <div key={skill.skill}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={cn('h-7 w-7 rounded-lg flex items-center justify-center', skill.bg)}>
                          <skill.icon size={13} className={skill.color} />
                        </div>
                        <span className="text-sm font-bold text-on-surface">{skill.skill}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-on-surface-variant">{skill.start}</span>
                        <span className="text-xs font-black text-on-surface">{skill.current}</span>
                        <span className="text-xs text-on-surface-variant">/ {skill.target}</span>
                      </div>
                    </div>
                    <div className="relative h-3 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className={cn('h-full rounded-full', skill.bar)}
                      />
                      <div className="absolute inset-0 flex items-center justify-end pr-2">
                        {progress >= 80 && <span className="text-[9px] font-black text-white">🎯</span>}
                      </div>
                    </div>
                    <div className="flex justify-between text-[9px] font-bold text-on-surface-variant mt-1">
                      <span>Start: {skill.start}</span>
                      <span>+{(skill.current - skill.start).toFixed(1)} bands gained</span>
                      <span>Goal: {skill.target}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Band timeline chart */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="lg:col-span-7">
          <div className="h-full bg-surface-container-lowest border border-outline-variant rounded-[2rem] p-7">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-black text-on-surface">Band Score Timeline</h2>
                <p className="text-xs text-on-surface-variant">6-week progression across all skills</p>
              </div>
              <div className="flex gap-3 text-[10px] font-bold">
                {[
                  { label: 'Listen', color: 'bg-sky-500'    },
                  { label: 'Read',   color: 'bg-violet-500' },
                  { label: 'Write',  color: 'bg-amber-500'  },
                  { label: 'Speak',  color: 'bg-emerald-500'},
                ].map(l => (
                  <div key={l.label} className="flex items-center gap-1">
                    <div className={cn('h-2 w-4 rounded-full', l.color)} />
                    <span className="text-on-surface-variant">{l.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative h-52">
              {/* Y-axis labels */}
              <div className="absolute left-0 inset-y-0 flex flex-col justify-between pointer-events-none py-1">
                {[9, 8, 7, 6, 5, 4].map(v => (
                  <span key={v} className="text-[9px] font-bold text-slate-400 dark:text-slate-600 w-4 text-right">{v}</span>
                ))}
              </div>

              {/* Grid lines */}
              <div className="absolute left-6 right-0 inset-y-0 flex flex-col justify-between pointer-events-none py-1">
                {[9, 8, 7, 6, 5, 4].map(v => (
                  <div key={v} className="w-full border-t border-dashed border-slate-100 dark:border-white/5" />
                ))}
              </div>

              {/* Bars per week */}
              <div className="absolute left-8 right-0 inset-y-0 flex items-end justify-between gap-1 pb-0">
                {BAND_HISTORY.map((week, wi) => (
                  <div key={week.date} className="flex items-end gap-0.5 flex-1">
                    {[
                      { val: week.listening, color: 'bg-sky-500'    },
                      { val: week.reading,   color: 'bg-violet-500' },
                      { val: week.writing,   color: 'bg-amber-500'  },
                      { val: week.speaking,  color: 'bg-emerald-500'},
                    ].map((bar, bi) => (
                      <motion.div
                        key={bi}
                        initial={{ height: 0 }}
                        animate={{ height: `${((bar.val - 4) / 5) * 100}%` }}
                        transition={{ duration: 0.7, delay: wi * 0.08 + bi * 0.04, ease: 'easeOut' }}
                        className={cn('flex-1 rounded-t-sm min-w-[4px]', bar.color)}
                        title={`${bar.val}`}
                      />
                    ))}
                  </div>
                ))}
              </div>

              {/* X-axis labels */}
              <div className="absolute left-8 right-0 bottom-0 flex justify-between -mb-5">
                {BAND_HISTORY.map(week => (
                  <span key={week.date} className="text-[9px] font-bold text-slate-400 dark:text-slate-600 flex-1 text-center">{week.date}</span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Consistency Calendar + AI Insight ────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-7">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-[2rem] p-7">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-black text-on-surface">Study Consistency</h2>
                <p className="text-xs text-on-surface-variant">Last 4 weeks — green = studied</p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 rounded-xl">
                <Flame size={12} className="text-amber-500" />
                <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">12 day streak</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="grid grid-cols-7 gap-1.5 mb-1">
                {WEEKS.map(d => (
                  <div key={d} className="text-center text-[9px] font-bold text-on-surface-variant">{d}</div>
                ))}
              </div>
              {CONSISTENCY.map((week, wi) => (
                <div key={wi} className="grid grid-cols-7 gap-1.5">
                  {week.map((active, di) => (
                    <motion.div
                      key={di}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: (wi * 7 + di) * 0.02 }}
                      className={cn(
                        'h-8 rounded-lg border transition-all',
                        active
                          ? 'bg-emerald-400 dark:bg-emerald-500 border-emerald-400 dark:border-emerald-500'
                          : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/8'
                      )}
                    />
                  ))}
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between pt-4 border-t border-outline-variant">
              <div className="text-center">
                <p className="text-lg font-black text-on-surface">22/28</p>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Days Active</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-black text-on-surface">78%</p>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Consistency Rate</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-black text-on-surface">47h</p>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Total Study Time</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="lg:col-span-5 space-y-5">
          {/* AI coach insight */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}>
            <div className="bg-indigo-600 rounded-[2rem] p-6 text-white relative overflow-hidden">
              <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/8" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Brain size={13} className="text-indigo-300" />
                  <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider">AI Coach Analysis</span>
                </div>
                <h3 className="text-lg font-black mb-3 leading-snug">You&apos;re on track for Band 7 by August 2026</h3>
                <ul className="space-y-2 mb-4">
                  {[
                    { text: 'Listening improved +1.5 bands in 6 weeks', ok: true  },
                    { text: 'Writing still below Band 6 — needs daily focus', ok: false },
                    { text: 'Consistency rate of 78% is excellent', ok: true  },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-white/85">
                      <span className={cn('font-black flex-shrink-0', item.ok ? 'text-emerald-300' : 'text-amber-300')}>{item.ok ? '↑' : '→'}</span>
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Exam readiness */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }}>
            <div className="bg-surface-container-lowest border border-outline-variant rounded-[2rem] p-6">
              <div className="flex items-center gap-2 mb-4">
                <Target size={14} className="text-emerald-500" />
                <h3 className="text-sm font-black text-on-surface">Exam Readiness</h3>
              </div>
              <div className="space-y-3">
                {SKILLS.map(skill => {
                  const readiness = Math.min(Math.round(((skill.current - skill.start) / (skill.target - skill.start)) * 100), 100);
                  return (
                    <div key={skill.skill}>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-on-surface-variant">{skill.skill}</span>
                        <span className={cn(readiness >= 80 ? 'text-emerald-600 dark:text-emerald-400' : readiness >= 50 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400')}>{readiness}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${readiness}%` }}
                          transition={{ duration: 0.9, ease: 'easeOut' }}
                          className={cn('h-full rounded-full', readiness >= 80 ? 'bg-emerald-500' : readiness >= 50 ? 'bg-amber-500' : 'bg-rose-500')}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 pt-4 border-t border-outline-variant">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-on-surface">Overall Readiness</span>
                  <span className="text-base font-black text-indigo-600 dark:text-indigo-400">74%</span>
                </div>
                <p className="text-[10px] text-on-surface-variant mt-1">Predicted exam date readiness: ~45 days from now</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Achievements ──────────────────────────────────────────────────── */}
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-[2rem] p-7">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-black text-on-surface">Achievements</h2>
              <p className="text-xs text-on-surface-variant">{ACHIEVEMENTS.filter(a => a.unlocked).length} of {ACHIEVEMENTS.length} unlocked</p>
            </div>
            <div className="h-2 w-32 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(ACHIEVEMENTS.filter(a => a.unlocked).length / ACHIEVEMENTS.length) * 100}%` }} />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {ACHIEVEMENTS.map((ach, i) => (
              <motion.div key={ach.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + i * 0.05 }}>
                <div className={cn(
                  'p-4 rounded-2xl border text-center transition-all',
                  ach.unlocked
                    ? 'bg-surface-container-lowest border-outline-variant hover:shadow-md'
                    : 'bg-slate-50/40 dark:bg-white/2 border-dashed border-outline-variant opacity-50'
                )}>
                  <div className={cn('h-10 w-10 rounded-xl flex items-center justify-center mx-auto mb-3', ach.unlocked ? ach.bg : 'bg-slate-100 dark:bg-white/5')}>
                    <ach.icon size={18} className={ach.unlocked ? ach.color : 'text-on-surface-variant'} />
                  </div>
                  <p className="text-[11px] font-black text-on-surface leading-tight mb-1">{ach.title}</p>
                  <p className="text-[10px] text-on-surface-variant leading-snug">{ach.desc}</p>
                  {ach.unlocked && (
                    <div className="mt-2 flex items-center justify-center gap-1">
                      <CheckCircle2 size={11} className="text-emerald-500" />
                      <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400">Unlocked</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
}
