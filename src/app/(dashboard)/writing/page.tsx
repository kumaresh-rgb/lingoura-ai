'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  PenTool, Clock, Target, CheckCircle2, ChevronRight, Sparkles,
  BarChart2, AlignLeft, FileText, AlertCircle, Brain, ArrowRight,
  Wand2, TrendingUp, BookOpen, Edit3,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type TaskType = 'task1-academic' | 'task1-general' | 'task2';

const TASKS: Record<TaskType, {
  id: TaskType; label: string; sub: string; duration: string; wordCount: string;
  icon: React.ElementType; color: string; bg: string; border: string; bar: string;
  prompt: string; guidance: string[];
}> = {
  'task1-academic': {
    id: 'task1-academic', label: 'Task 1 — Academic', sub: 'Graph, Chart or Diagram', duration: '20 min', wordCount: '150+ words',
    icon: BarChart2, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10', border: 'border-amber-200 dark:border-amber-500/20', bar: 'bg-amber-500',
    prompt: 'The bar chart below shows the percentage of households in owned and rented accommodation in England and Wales between 1918 and 2011.\n\nSummarize the information by selecting and reporting the main features, and make comparisons where relevant.',
    guidance: ['Introduce what the chart shows', 'Describe the overall trend', 'Select 2–3 key data points with numbers', 'Compare the highest and lowest values', 'Do NOT give your opinion'],
  },
  'task1-general': {
    id: 'task1-general', label: 'Task 1 — General Training', sub: 'Formal or Informal Letter', duration: '20 min', wordCount: '150+ words',
    icon: FileText, color: 'text-sky-500', bg: 'bg-sky-50 dark:bg-sky-500/10', border: 'border-sky-200 dark:border-sky-500/20', bar: 'bg-sky-500',
    prompt: 'You recently had a problem with a product you bought from an online store. The product arrived damaged and the customer service team has not responded to your complaint.\n\nWrite a letter to the manager of the store. In your letter:\n• explain what you bought and when\n• describe the problem\n• say what you would like them to do',
    guidance: ['Use the correct letter format (Dear Sir/Madam...)', 'Address all 3 bullet points clearly', 'Use appropriate formal or semi-formal tone', 'Sign off correctly (Yours faithfully/sincerely)', 'Check word count — 150 words minimum'],
  },
  'task2': {
    id: 'task2', label: 'Task 2 — Essay', sub: 'Academic & General Training', duration: '40 min', wordCount: '250+ words',
    icon: AlignLeft, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-500/10', border: 'border-rose-200 dark:border-rose-500/20', bar: 'bg-rose-500',
    prompt: 'Some people believe that technology has made our lives more complicated. Others think that technology has simplified our lives.\n\nDiscuss both views and give your own opinion. Give reasons for your answer and include any relevant examples from your own knowledge or experience.',
    guidance: ['Write a clear 2-sentence introduction + thesis statement', 'Body paragraph 1: First view + supporting evidence', 'Body paragraph 2: Second view + supporting evidence', 'Give YOUR opinion clearly in conclusion', 'Use discourse markers for cohesion'],
  },
};

const CRITERIA = [
  { name: 'Task Achievement',      key: 'task',     score: 75, color: 'bg-amber-500',   text: 'text-amber-600 dark:text-amber-400',   tip: 'Addresses all parts of the task' },
  { name: 'Coherence & Cohesion',  key: 'cohesion', score: 60, color: 'bg-indigo-500',  text: 'text-indigo-600 dark:text-indigo-400',  tip: 'Logical flow, discourse markers' },
  { name: 'Lexical Resource',      key: 'lexical',  score: 85, color: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400', tip: 'Vocabulary range and accuracy' },
  { name: 'Grammatical Accuracy',  key: 'grammar',  score: 70, color: 'bg-violet-500',  text: 'text-violet-600 dark:text-violet-400',   tip: 'Sentence structure variety' },
];

function bandFromScore(score: number) {
  if (score >= 90) return 8.5;
  if (score >= 80) return 7.5;
  if (score >= 70) return 7.0;
  if (score >= 60) return 6.5;
  if (score >= 50) return 6.0;
  return 5.5;
}

export default function WritingPage() {
  const [activeTask, setActiveTask] = useState<TaskType>('task2');
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const task = TASKS[activeTask];
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const minWords = activeTask === 'task2' ? 250 : 150;
  const wordPct = Math.min((wordCount / minWords) * 100, 100);
  const avgScore = Math.round(CRITERIA.reduce((a, c) => a + c.score, 0) / CRITERIA.length);
  const estimatedBand = bandFromScore(avgScore);

  return (
    <div className="space-y-8 pb-10">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-[2rem] overflow-hidden border border-amber-200 dark:border-amber-500/20 p-7 md:p-10"
        style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.07) 0%, rgba(217,119,6,0.04) 50%, rgba(245,158,11,0.02) 100%)' }}
      >
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                <Wand2 size={10} /> AI Writing Lab
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-white/8 text-on-surface-variant text-[10px] font-bold uppercase tracking-wider">
                IELTS Standard
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-on-surface leading-tight">
              Writing<br />
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Excellence Lab</span>
            </h1>
            <p className="mt-3 text-sm text-on-surface-variant max-w-lg leading-relaxed">
              Write your response to an IELTS task, then receive AI examiner feedback on task achievement, coherence, vocabulary, and grammar — with a predicted band score.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <div className="p-4 bg-white/60 dark:bg-white/5 border border-white/80 dark:border-white/8 rounded-2xl text-center min-w-[80px]">
              <p className="text-xl font-black text-on-surface">6.5</p>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Avg Band</p>
            </div>
            <div className="p-4 bg-white/60 dark:bg-white/5 border border-white/80 dark:border-white/8 rounded-2xl text-center min-w-[80px]">
              <p className="text-xl font-black text-on-surface">8</p>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Submissions</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── Task Type Selector ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(Object.values(TASKS) as typeof TASKS[TaskType][]).map((t, i) => {
          const Icon = t.icon;
          const isActive = activeTask === t.id;
          return (
            <motion.button
              key={t.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 + i * 0.07, duration: 0.45 }}
              onClick={() => { setActiveTask(t.id); setSubmitted(false); setText(''); }}
              className={cn(
                'text-left p-5 rounded-2xl border transition-all group',
                isActive
                  ? cn('border-amber-400 dark:border-amber-500/50 bg-amber-50/60 dark:bg-amber-500/8 shadow-lg shadow-amber-500/10')
                  : 'border-outline-variant bg-surface-container-lowest hover:border-amber-300 dark:hover:border-amber-500/40 hover:shadow-md'
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={cn('h-9 w-9 rounded-xl flex items-center justify-center', t.bg)}>
                  <Icon size={16} className={t.color} />
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-on-surface-variant">
                  <Clock size={10} /> {t.duration}
                </div>
              </div>
              <p className="text-sm font-black text-on-surface mb-0.5">{t.label}</p>
              <p className="text-[11px] text-on-surface-variant mb-2">{t.sub}</p>
              <span className={cn(
                'inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold',
                t.bg, t.color.replace('text-', 'text-').split(' ')[0]
              )}>
                {t.wordCount}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* ── Writing Lab ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main writing area */}
        <motion.div
          key={activeTask}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35 }}
          className="lg:col-span-8 space-y-5"
        >
          {/* Prompt */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-[2rem] p-7">
            <div className="flex items-center gap-2 mb-4">
              <div className={cn('h-8 w-8 rounded-xl flex items-center justify-center', task.bg)}>
                <task.icon size={15} className={task.color} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Task Prompt</p>
                <p className="text-xs font-bold text-on-surface">{task.label}</p>
              </div>
            </div>
            <div className={cn('p-4 rounded-xl border-l-4', task.border, task.bg)}>
              <p className="text-sm text-on-surface leading-relaxed whitespace-pre-line">{task.prompt}</p>
            </div>
            <div className="mt-4">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Writing Guide</p>
              <ul className="space-y-1.5">
                {task.guidance.map((g, i) => (
                  <li key={i} className="flex items-start gap-2 text-[11px] text-on-surface-variant">
                    <span className={cn('font-black mt-0.5 flex-shrink-0', task.color)}>{i + 1}.</span>
                    {g}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Editor */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-[2rem] p-7">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Edit3 size={14} className="text-on-surface-variant" />
                <h3 className="text-sm font-black text-on-surface">Your Response</h3>
              </div>
              <div className="flex items-center gap-3">
                <span className={cn(
                  'text-[11px] font-bold px-2.5 py-1 rounded-lg',
                  wordCount >= minWords
                    ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'bg-slate-100 dark:bg-white/5 text-on-surface-variant'
                )}>
                  {wordCount} / {minWords}+ words
                </span>
                <div className="flex items-center gap-1 text-[10px] font-bold text-on-surface-variant px-2.5 py-1 bg-slate-50 dark:bg-white/5 rounded-lg">
                  <Clock size={10} /> {task.duration}
                </div>
              </div>
            </div>

            {/* Word count bar */}
            <div className="h-1 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden mb-4">
              <motion.div
                animate={{ width: `${wordPct}%` }}
                className={cn('h-full rounded-full transition-all', wordCount >= minWords ? 'bg-emerald-500' : 'bg-amber-500')}
              />
            </div>

            <textarea
              value={text}
              onChange={e => { setText(e.target.value); setSubmitted(false); }}
              placeholder={`Start writing your ${task.label} response here...\n\nTip: Begin with a clear introduction that paraphrases the task prompt.`}
              className="w-full h-64 md:h-80 resize-none bg-slate-50/40 dark:bg-white/3 border border-slate-200 dark:border-white/8 rounded-xl p-4 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-amber-400 dark:focus:border-amber-500/50 transition-colors leading-relaxed font-medium"
            />

            <div className="flex flex-col sm:flex-row items-center gap-4 mt-5">
              <button
                onClick={() => wordCount >= minWords && setSubmitted(true)}
                disabled={wordCount < minWords}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all',
                  wordCount >= minWords
                    ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/25 active:scale-[0.97]'
                    : 'bg-slate-100 dark:bg-white/5 text-on-surface-variant cursor-not-allowed'
                )}
              >
                <Sparkles size={15} />
                {wordCount < minWords ? `Need ${minWords - wordCount} more words` : 'Get AI Feedback'}
              </button>
              <button
                onClick={() => { setText(''); setSubmitted(false); }}
                className="px-5 py-3.5 border border-outline-variant hover:bg-slate-50 dark:hover:bg-white/5 text-on-surface-variant rounded-xl font-bold text-sm transition-all"
              >
                Clear
              </button>
            </div>

            {/* AI feedback (shown after submission) */}
            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 space-y-3"
              >
                <div className="flex items-center gap-2 text-sm font-black text-on-surface">
                  <Brain size={15} className="text-indigo-500" />
                  AI Examiner Feedback
                </div>
                {[
                  { type: 'strength', icon: '✓', color: 'bg-emerald-50 dark:bg-emerald-500/8 border-emerald-100 dark:border-emerald-500/15 text-emerald-700 dark:text-emerald-300', text: 'Strong introduction — you paraphrased the task prompt effectively without copying it directly.' },
                  { type: 'improve',  icon: '→', color: 'bg-amber-50 dark:bg-amber-500/8 border-amber-100 dark:border-amber-500/15 text-amber-700 dark:text-amber-300',   text: 'Cohesion: Use more discourse markers. Instead of "Also", try "Furthermore" or "In addition to this".' },
                  { type: 'grammar',  icon: '✎', color: 'bg-rose-50 dark:bg-rose-500/8 border-rose-100 dark:border-rose-500/15 text-rose-700 dark:text-rose-300',       text: 'Grammar: "There is many reasons" → "There are many reasons". Check subject-verb agreement.' },
                ].map(fb => (
                  <div key={fb.text} className={cn('p-3.5 rounded-xl border text-[11px] font-semibold leading-relaxed flex items-start gap-2', fb.color)}>
                    <span className="font-black flex-shrink-0 mt-0.5">{fb.icon}</span>
                    {fb.text}
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Scoring sidebar */}
        <div className="lg:col-span-4 space-y-5">
          {/* Scoring criteria */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-[2rem] p-6">
            <div className="flex items-center gap-2 mb-5">
              <BarChart2 size={14} className="text-amber-500" />
              <h3 className="text-sm font-black text-on-surface">Scoring Criteria</h3>
            </div>
            <div className="space-y-4">
              {CRITERIA.map(c => (
                <div key={c.key}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-on-surface-variant">{c.name}</span>
                    <span className={cn('text-[11px] font-black', c.text)}>{c.score}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${c.score}%` }}
                      transition={{ duration: 0.9, ease: 'easeOut' }}
                      className={cn('h-full rounded-full', c.color)}
                    />
                  </div>
                  <p className="text-[10px] text-on-surface-variant mt-1">{c.tip}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-4 border-t border-outline-variant">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-on-surface">Estimated Band</span>
                <span className="text-lg font-black text-amber-500">{estimatedBand} / 9</span>
              </div>
              <p className="text-[10px] text-on-surface-variant">Based on your last submitted response</p>
            </div>
          </div>

          {/* IELTS Writing tips */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-[2rem] p-6">
            <div className="flex items-center gap-2 mb-4">
              <Brain size={14} className="text-indigo-500" />
              <h3 className="text-sm font-black text-on-surface">Expert Tips</h3>
            </div>
            <div className="space-y-3">
              {[
                { emoji: '⏱️', tip: 'Task 2 is worth double marks — always complete it before running out of time.' },
                { emoji: '📐', tip: 'Structure: Introduction → Body 1 → Body 2 → Conclusion. Every paragraph needs a clear topic sentence.' },
                { emoji: '🎯', tip: 'Aim for 4–5 different sentence structures. Mix simple, compound, and complex sentences.' },
              ].map(t => (
                <div key={t.tip} className="flex items-start gap-2.5 p-3 bg-slate-50/60 dark:bg-white/3 rounded-xl">
                  <span className="text-base flex-shrink-0">{t.emoji}</span>
                  <p className="text-[11px] text-on-surface-variant leading-relaxed">{t.tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
