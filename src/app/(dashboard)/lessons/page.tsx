'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen, Clock, Trophy, Sparkles, Play, Lock, CheckCircle2,
  ChevronRight, Target, Zap, Mic2, PenTool, Headphones, Brain,
  TrendingUp, Star, ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type GoalFilter = 'all' | 'ielts' | 'speaking' | 'writing' | 'grammar' | 'vocabulary';

const GOAL_TABS: { id: GoalFilter; label: string; emoji: string }[] = [
  { id: 'all',        label: 'All Paths',       emoji: '📚' },
  { id: 'ielts',      label: 'IELTS Roadmaps',  emoji: '🎯' },
  { id: 'speaking',   label: 'Speaking',         emoji: '🎤' },
  { id: 'writing',    label: 'Writing',           emoji: '✏️' },
  { id: 'grammar',    label: 'Grammar',           emoji: '📐' },
  { id: 'vocabulary', label: 'Vocabulary',        emoji: '💡' },
];

const PATHS = [
  {
    id: 1, category: 'ielts' as GoalFilter,
    title: 'IELTS Band 5 → 7 Roadmap',
    desc: 'Complete preparation path from Band 5 to Band 7 in 60 days. Covers all four skills with structured daily practice.',
    duration: '60 days', lessons: 48, level: 'Intermediate', icon: Target,
    color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-500/10', border: 'border-indigo-200 dark:border-indigo-500/20', bar: 'bg-indigo-500',
    progress: 35, status: 'in_progress' as const,
    topics: ['Diagnostic assessment', 'Listening strategy', 'Reading skimming', 'Writing structure', 'Speaking fluency'],
    badge: 'Most Popular',
  },
  {
    id: 2, category: 'speaking' as GoalFilter,
    title: 'Speaking Confidence Booster',
    desc: 'Eliminate fear of speaking English. Build fluency, reduce filler words, and speak naturally in professional settings.',
    duration: '21 days', lessons: 18, level: 'All Levels', icon: Mic2,
    color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10', border: 'border-emerald-200 dark:border-emerald-500/20', bar: 'bg-emerald-500',
    progress: 0, status: 'available' as const,
    topics: ['Overcoming speaking anxiety', 'Pronunciation drills', 'Fluency exercises', 'IELTS Part 1–3'],
    badge: null,
  },
  {
    id: 3, category: 'writing' as GoalFilter,
    title: 'Writing Coherence Masterclass',
    desc: 'Master essay structure, coherence, and academic vocabulary for IELTS Task 2 and professional writing.',
    duration: '28 days', lessons: 24, level: 'Intermediate', icon: PenTool,
    color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10', border: 'border-amber-200 dark:border-amber-500/20', bar: 'bg-amber-500',
    progress: 0, status: 'available' as const,
    topics: ['Paragraph structure', 'Cohesion devices', 'Task 2 essay types', 'Task 1 Academic'],
    badge: null,
  },
  {
    id: 4, category: 'grammar' as GoalFilter,
    title: 'Grammar Foundation',
    desc: 'Build a rock-solid grammar foundation — tenses, conditionals, passive voice, and complex structures for Band 7+.',
    duration: '30 days', lessons: 30, level: 'Beginner', icon: Brain,
    color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-500/10', border: 'border-violet-200 dark:border-violet-500/20', bar: 'bg-violet-500',
    progress: 100, status: 'completed' as const,
    topics: ['Present perfect vs past simple', 'Conditionals 0–3', 'Passive voice', 'Relative clauses'],
    badge: 'Completed',
  },
  {
    id: 5, category: 'ielts' as GoalFilter,
    title: 'IELTS Band 7 → 8.5 Elite Path',
    desc: 'Advanced preparation for high achievers targeting Band 8 or above. Intensive, daily practice with expert strategy.',
    duration: '45 days', lessons: 36, level: 'Advanced', icon: Trophy,
    color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-500/10', border: 'border-rose-200 dark:border-rose-500/20', bar: 'bg-rose-500',
    progress: 0, status: 'locked' as const,
    topics: ['Advanced academic vocabulary', 'Complex grammar structures', 'Section 4 strategies', 'Writing Task 2 Band 8 models'],
    badge: 'Elite',
  },
  {
    id: 6, category: 'vocabulary' as GoalFilter,
    title: 'Academic Vocabulary Builder',
    desc: 'Master 500 high-frequency IELTS words organized by topic, band level, and collocations. Spaced repetition system.',
    duration: '45 days', lessons: 45, level: 'All Levels', icon: BookOpen,
    color: 'text-sky-500', bg: 'bg-sky-50 dark:bg-sky-500/10', border: 'border-sky-200 dark:border-sky-500/20', bar: 'bg-sky-500',
    progress: 22, status: 'in_progress' as const,
    topics: ['Environment & Nature', 'Technology & Science', 'Education & Society', 'Business & Economics'],
    badge: null,
  },
];

const FEATURED_LESSON = {
  title: 'Writing Task 2: Argument Essay Structure',
  module: 'Writing Coherence Masterclass · Lesson 5 of 24',
  duration: '35 min', difficulty: 'Intermediate',
  desc: 'Learn the proven 4-paragraph structure for IELTS Task 2 argument essays. Includes Band 7 and Band 8 model answers with detailed analysis.',
  topics: ['Introduction paraphrasing', '2 body paragraphs', 'Conclusion writing', 'Cohesive devices'],
};

export default function LessonsPage() {
  const [activeGoal, setActiveGoal] = useState<GoalFilter>('all');

  const filtered = activeGoal === 'all' ? PATHS : PATHS.filter(p => p.category === activeGoal);

  return (
    <div className="space-y-8 pb-10">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-[2rem] overflow-hidden border border-violet-200 dark:border-violet-500/20 p-5 sm:p-7 md:p-10"
        style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.07) 0%, rgba(109,40,217,0.04) 50%, rgba(139,92,246,0.02) 100%)' }}
      >
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-500/15 text-violet-700 dark:text-violet-300 text-[10px] font-bold uppercase tracking-wider">
                <BookOpen size={10} /> Learning Paths
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-white/8 text-on-surface-variant text-[10px] font-bold uppercase tracking-wider">
                AI Adaptive
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-on-surface leading-tight">
              Structured<br />
              <span className="bg-gradient-to-r from-violet-500 to-purple-500 bg-clip-text text-transparent">Learning Paths</span>
            </h1>
            <p className="mt-3 text-sm text-on-surface-variant max-w-lg leading-relaxed">
              Goal-based IELTS roadmaps that unlock progressively as you improve. Each lesson builds on the last — designed by IELTS experts and powered by AI.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <div className="p-4 bg-white/60 dark:bg-white/5 border border-white/80 dark:border-white/8 rounded-2xl text-center min-w-[80px]">
              <p className="text-xl font-black text-on-surface">2</p>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Active Paths</p>
            </div>
            <div className="p-4 bg-white/60 dark:bg-white/5 border border-white/80 dark:border-white/8 rounded-2xl text-center min-w-[80px]">
              <p className="text-xl font-black text-on-surface">1</p>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Completed</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── Featured Continue Lesson ──────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="relative bg-indigo-600 rounded-[2rem] p-5 sm:p-7 text-white overflow-hidden">
          <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-white/8 pointer-events-none" />
          <div className="absolute -left-6 -bottom-6 h-24 w-24 rounded-full bg-white/5 pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Play size={11} className="text-indigo-300" />
                <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider">Continue Where You Left Off</span>
              </div>
              <h2 className="text-xl font-black mb-1 leading-snug">{FEATURED_LESSON.title}</h2>
              <p className="text-sm text-indigo-200 mb-3">{FEATURED_LESSON.module}</p>
              <div className="flex flex-wrap gap-2">
                {FEATURED_LESSON.topics.map(t => (
                  <span key={t} className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-white/15">{t}</span>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-start md:items-end gap-3 w-full md:w-auto flex-shrink-0">
              <div className="flex gap-4 text-center">
                <div>
                  <p className="text-lg font-black">{FEATURED_LESSON.duration}</p>
                  <p className="text-[10px] text-indigo-300 uppercase tracking-wider">Duration</p>
                </div>
                <div>
                  <p className="text-lg font-black">{FEATURED_LESSON.difficulty}</p>
                  <p className="text-[10px] text-indigo-300 uppercase tracking-wider">Level</p>
                </div>
              </div>
              <button className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-all">
                <Play size={14} fill="currentColor" /> Continue Lesson
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Goal Filter ───────────────────────────────────────────────────── */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide w-full min-w-0">
        {GOAL_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveGoal(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap border transition-all flex-shrink-0',
              activeGoal === tab.id
                ? 'bg-violet-600 text-white border-violet-600 shadow-sm'
                : 'bg-surface-container-lowest border-outline-variant text-on-surface-variant hover:border-violet-300 dark:hover:border-violet-500/40'
            )}
          >
            <span>{tab.emoji}</span> {tab.label}
          </button>
        ))}
      </div>

      {/* ── Learning Path Cards ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((path, i) => {
          const Icon = path.icon;
          const isLocked    = path.status === 'locked';
          const isCompleted = path.status === 'completed';
          const isActive    = path.status === 'in_progress';
          return (
            <motion.div
              key={path.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 + i * 0.07 }}
            >
              <div className={cn(
                'group relative flex flex-col p-6 rounded-[2rem] border h-full transition-all',
                isLocked
                  ? 'border-outline-variant bg-surface-container-lowest opacity-60'
                  : isActive
                    ? cn(path.border, 'bg-surface-container-lowest shadow-md')
                    : 'border-outline-variant bg-surface-container-lowest hover:shadow-md hover:-translate-y-0.5'
              )}>
                {/* Badge */}
                {path.badge && (
                  <div className={cn(
                    'absolute -top-3 left-6 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide',
                    path.badge === 'Completed' ? 'bg-emerald-500 text-white' :
                    path.badge === 'Elite'     ? 'bg-rose-500 text-white' :
                                                 'bg-indigo-600 text-white'
                  )}>
                    {path.badge === 'Completed' && '✓ '}
                    {path.badge}
                  </div>
                )}

                <div className="flex items-start justify-between mb-4">
                  <div className={cn('h-11 w-11 rounded-xl flex items-center justify-center', path.bg)}>
                    {isLocked ? <Lock size={18} className="text-on-surface-variant" /> : <Icon size={18} className={path.color} />}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full', path.bg, path.color)}>
                      {path.level}
                    </span>
                    {isActive && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
                        In Progress
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-base font-black text-on-surface mb-2 leading-snug">{path.title}</h3>
                <p className="text-[11px] text-on-surface-variant leading-relaxed mb-4 flex-1">{path.desc}</p>

                {/* Topics */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {path.topics.slice(0, 3).map(t => (
                    <span key={t} className={cn('text-[9px] font-semibold px-2 py-0.5 rounded-md', path.bg, path.color)}>
                      {t}
                    </span>
                  ))}
                  {path.topics.length > 3 && (
                    <span className="text-[9px] font-semibold px-2 py-0.5 rounded-md bg-slate-50 dark:bg-white/5 text-on-surface-variant">
                      +{path.topics.length - 3} more
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-[10px] font-bold text-on-surface-variant mb-4">
                  <span className="flex items-center gap-1"><Clock size={10} /> {path.duration}</span>
                  <span className="flex items-center gap-1"><BookOpen size={10} /> {path.lessons} lessons</span>
                </div>

                {/* Progress */}
                {path.progress > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between text-[10px] font-bold mb-1">
                      <span className="text-on-surface-variant">Progress</span>
                      <span className={path.color}>{path.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${path.progress}%` }}
                        transition={{ duration: 0.9, ease: 'easeOut' }}
                        className={cn('h-full rounded-full', path.bar)}
                      />
                    </div>
                  </div>
                )}

                <button className={cn(
                  'w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all',
                  isLocked
                    ? 'bg-slate-100 dark:bg-white/5 text-on-surface-variant cursor-not-allowed'
                    : isCompleted
                      ? 'bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                      : isActive
                        ? cn(path.bg, 'border', path.border, path.color, 'hover:opacity-80')
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                )}>
                  {isLocked    ? <><Lock size={13} /> Locked</> :
                   isCompleted ? <><CheckCircle2 size={13} /> Review Path</> :
                   isActive    ? <><Play size={13} fill="currentColor" /> Continue</> :
                                 <><Play size={13} fill="white" /> Start Path</>}
                  {!isLocked && <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
