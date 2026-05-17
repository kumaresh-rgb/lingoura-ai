'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Search, Clock, Target, CheckCircle2, ChevronRight,
  Sparkles, Brain, Lock, BarChart2, AlertCircle, ArrowRight,
  Highlighter, Eye, Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const PASSAGES = [
  {
    id: 1, title: 'Section 1: Everyday Life',
    sub: 'Factual texts related to daily life in an English-speaking country',
    duration: '20 min', questions: '13–14', status: 'completed', type: 'General / Academic', band: 7.0,
    topic: 'Local Library Services',
    color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10', border: 'border-emerald-200 dark:border-emerald-500/20', bar: 'bg-emerald-500',
    questionTypes: ['True / False / Not Given', 'Form completion', 'Multiple choice'],
    excerpt: 'The Westfield Public Library offers a wide range of services to the local community...',
  },
  {
    id: 2, title: 'Section 2: Work & Employment',
    sub: 'Work-related texts on job applications, policies, and workplace development',
    duration: '20 min', questions: '13–14', status: 'available', type: 'Work Focus', band: 0,
    topic: 'Workplace Health and Safety Policy',
    color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-500/10', border: 'border-violet-200 dark:border-violet-500/20', bar: 'bg-violet-500',
    questionTypes: ['Matching headings', 'Sentence completion', 'Short-answer'],
    excerpt: 'All employees are required to comply with the Health and Safety at Work Act 1974...',
  },
  {
    id: 3, title: 'Section 3: Complex General Topic',
    sub: 'One longer, analytical text on a topic of general interest',
    duration: '20 min', questions: '13–14', status: 'locked', type: 'Analytical', band: 0,
    topic: 'The Psychology of Decision Making',
    color: 'text-sky-500', bg: 'bg-sky-50 dark:bg-sky-500/10', border: 'border-sky-200 dark:border-sky-500/20', bar: 'bg-sky-500',
    questionTypes: ['Matching information', 'Summary completion', 'True / False / Not Given'],
    excerpt: 'Researchers have long been fascinated by the cognitive processes that underpin human decision...',
  },
];

const SAMPLE_PASSAGE = `The Westfield Public Library offers a wide range of services to the local community, including book borrowing, internet access, and study spaces. The library is open six days a week, from Monday to Saturday, between the hours of 9 am and 8 pm. On Sundays, the library remains closed.

Members can borrow up to eight items at a time, including books, DVDs, and magazines. The standard loan period is three weeks for books and one week for DVDs. Members may renew items up to three times, either online, by telephone, or in person at the library counter.

The library also provides free Wi-Fi access to all registered members. To register, individuals must present proof of address and a valid form of identification. Registration cards are issued on the same day and are valid for two years before they need to be renewed.

Children under 16 are encouraged to join the library's Young Readers Programme, which runs every Saturday morning at 10 am. The sessions are free and focus on developing reading skills through interactive storytelling and group activities.`;

const SAMPLE_QUESTIONS = [
  { id: 1, type: 'True / False / Not Given', q: 'The library is open every day of the week.', answer: '' },
  { id: 2, type: 'True / False / Not Given', q: 'Members are allowed to borrow DVDs from the library.', answer: '' },
  { id: 3, type: 'Short Answer', q: 'How many times can members renew a borrowed item?', answer: '' },
  { id: 4, type: 'Short Answer', q: 'What must applicants provide to register for a library card?', answer: '' },
];

const QUESTION_TYPES = ['True / False / Not Given', 'Matching headings', 'Sentence completion', 'Summary completion', 'Short-answer', 'Multiple choice'];

export default function ReadingPage() {
  const [selectedPassage, setSelectedPassage] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'passage' | 'questions'>('passage');
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [highlighted, setHighlighted] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState('20:00');

  const passage = PASSAGES.find(p => p.id === selectedPassage);

  return (
    <div className="space-y-8 pb-10">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-[2rem] overflow-hidden border border-violet-200 dark:border-violet-500/20 p-7 md:p-10"
        style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.07) 0%, rgba(109,40,217,0.04) 50%, rgba(139,92,246,0.02) 100%)' }}
      >
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-500/15 text-violet-700 dark:text-violet-300 text-[10px] font-bold uppercase tracking-wider">
                <Eye size={10} /> AI Reading Lab
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-white/8 text-on-surface-variant text-[10px] font-bold uppercase tracking-wider">
                IELTS Standard
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-on-surface leading-tight">
              Reading<br />
              <span className="bg-gradient-to-r from-violet-500 to-purple-500 bg-clip-text text-transparent">Comprehension Lab</span>
            </h1>
            <p className="mt-3 text-sm text-on-surface-variant max-w-lg leading-relaxed">
              Practice skimming, scanning, and deep comprehension across Academic and General Training passages. Get AI explanations for every answer — right and wrong.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <div className="p-4 bg-white/60 dark:bg-white/5 border border-white/80 dark:border-white/8 rounded-2xl text-center min-w-[80px]">
              <p className="text-xl font-black text-on-surface">7.0</p>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Last Band</p>
            </div>
            <div className="p-4 bg-white/60 dark:bg-white/5 border border-white/80 dark:border-white/8 rounded-2xl text-center min-w-[80px]">
              <p className="text-xl font-black text-on-surface">1/3</p>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Passages Done</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── Passage Selector ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {PASSAGES.map((p, i) => {
          const isSelected = selectedPassage === p.id;
          const isLocked = p.status === 'locked';
          const isCompleted = p.status === 'completed';
          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 + i * 0.07 }}
            >
              <button
                onClick={() => !isLocked && setSelectedPassage(isSelected ? null : p.id)}
                className={cn(
                  'w-full text-left p-6 rounded-2xl border transition-all',
                  isSelected
                    ? cn(p.border, 'shadow-lg bg-surface-container-lowest')
                    : isLocked
                      ? 'border-outline-variant bg-surface-container-lowest opacity-55 cursor-not-allowed'
                      : 'border-outline-variant bg-surface-container-lowest hover:shadow-md hover:border-violet-300 dark:hover:border-violet-500/40'
                )}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={cn('h-10 w-10 rounded-xl flex items-center justify-center', p.bg)}>
                    {isLocked
                      ? <Lock size={16} className="text-on-surface-variant" />
                      : isCompleted
                        ? <CheckCircle2 size={16} className={p.color} />
                        : <BookOpen size={16} className={p.color} />
                    }
                  </div>
                  {isCompleted && (
                    <span className={cn('text-sm font-black', p.color)}>{p.band} / 9</span>
                  )}
                  {isLocked && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/8 text-on-surface-variant">Locked</span>
                  )}
                </div>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">{p.type}</p>
                <p className="text-sm font-black text-on-surface mb-1">{p.title}</p>
                <p className="text-[11px] text-on-surface-variant mb-3 leading-relaxed">{p.sub}</p>
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex items-center gap-1 text-[10px] font-bold text-on-surface-variant">
                    <Clock size={10} /> {p.duration}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-on-surface-variant">
                    <Target size={10} /> {p.questions} Qs
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {p.questionTypes.map(qt => (
                    <span key={qt} className={cn('text-[9px] font-semibold px-2 py-0.5 rounded-md', p.bg, p.color)}>
                      {qt}
                    </span>
                  ))}
                </div>
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* ── Reading Lab ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {passage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Reading panel */}
              <div className="lg:col-span-7 bg-surface-container-lowest border border-outline-variant rounded-[2rem] p-7">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-[10px] font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider mb-0.5">Reading Passage</p>
                    <h2 className="text-base font-black text-on-surface">{passage.topic}</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 rounded-xl">
                      <Clock size={12} className="text-amber-500" />
                      <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">{timeLeft}</span>
                    </div>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 dark:bg-violet-500/10 border border-violet-100 dark:border-violet-500/20 rounded-xl">
                      <Highlighter size={12} className="text-violet-500" />
                      <span className="text-[10px] font-bold text-violet-600 dark:text-violet-400">Highlight</span>
                    </button>
                  </div>
                </div>

                {/* Mobile tab switch */}
                <div className="flex lg:hidden gap-2 mb-4">
                  {(['passage', 'questions'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={cn(
                        'flex-1 py-2 rounded-xl text-xs font-bold capitalize transition-all',
                        activeTab === tab
                          ? 'bg-violet-500 text-white'
                          : 'bg-slate-50 dark:bg-white/5 text-on-surface-variant border border-outline-variant'
                      )}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className={cn(
                  'prose prose-sm max-w-none text-on-surface-variant leading-7 text-sm',
                  activeTab === 'questions' ? 'hidden lg:block' : ''
                )}>
                  <div className="space-y-4 p-1">
                    {SAMPLE_PASSAGE.split('\n\n').map((para, i) => (
                      <p key={i} className="text-sm leading-7 text-on-surface-variant">{para}</p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Questions panel */}
              <div className={cn('lg:col-span-5 bg-surface-container-lowest border border-outline-variant rounded-[2rem] p-7', activeTab === 'passage' ? 'hidden lg:block' : '')}>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-base font-black text-on-surface">Answer the Questions</h3>
                  <span className="text-[10px] font-bold text-on-surface-variant">{Object.keys(answers).length} / {SAMPLE_QUESTIONS.length} answered</span>
                </div>

                <div className="space-y-5">
                  {SAMPLE_QUESTIONS.map(q => (
                    <div key={q.id} className="space-y-2">
                      <div className="flex items-start gap-2">
                        <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-md flex-shrink-0 mt-0.5', passage.bg, passage.color)}>Q{q.id}</span>
                        <div>
                          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">{q.type}</p>
                          <p className="text-sm font-semibold text-on-surface leading-snug">{q.q}</p>
                        </div>
                      </div>
                      {q.type === 'True / False / Not Given' ? (
                        <div className="ml-9 flex gap-2">
                          {['True', 'False', 'Not Given'].map(opt => (
                            <button
                              key={opt}
                              onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                              className={cn(
                                'flex-1 py-2 rounded-xl text-[11px] font-bold border transition-all',
                                answers[q.id] === opt
                                  ? 'bg-violet-500 text-white border-violet-500 shadow-sm'
                                  : 'border-outline-variant text-on-surface-variant hover:border-violet-300 dark:hover:border-violet-500/40 bg-slate-50/40 dark:bg-white/3'
                              )}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <input
                          type="text"
                          placeholder="Write your answer..."
                          value={answers[q.id] ?? ''}
                          onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                          className="ml-9 w-full px-4 py-2.5 bg-slate-50/40 dark:bg-white/3 border border-slate-200 dark:border-white/8 rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-violet-400 dark:focus:border-violet-500/50 transition-colors"
                        />
                      )}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setSubmitted(true)}
                  className="mt-7 w-full flex items-center justify-center gap-2 py-3.5 bg-violet-500 hover:bg-violet-600 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-violet-500/20 active:scale-[0.97]"
                >
                  <Sparkles size={15} /> Submit for AI Review
                </button>

                {submitted && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 space-y-2">
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">AI Explanations</p>
                    {[
                      { q: 'Q1', result: false, expl: 'FALSE — The passage states the library is closed on Sundays, not open every day.' },
                      { q: 'Q2', result: true,  expl: 'TRUE — "Members can borrow up to eight items at a time, including books, DVDs, and magazines."' },
                    ].map(item => (
                      <div key={item.q} className={cn(
                        'p-3 rounded-xl border text-[11px] leading-relaxed',
                        item.result ? 'bg-emerald-50 dark:bg-emerald-500/8 border-emerald-100 dark:border-emerald-500/15 text-emerald-700 dark:text-emerald-300' : 'bg-rose-50 dark:bg-rose-500/8 border-rose-100 dark:border-rose-500/15 text-rose-700 dark:text-rose-300'
                      )}>
                        <strong>{item.q}: {item.result ? '✓ Correct' : '✗ Incorrect'}</strong> — {item.expl}
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Question type reference */}
            <div className="mt-5 bg-surface-container-lowest border border-outline-variant rounded-[2rem] p-6">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-4">All IELTS Reading Question Types</p>
              <div className="flex flex-wrap gap-2">
                {QUESTION_TYPES.map(qt => (
                  <span key={qt} className="text-[11px] font-semibold px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-white/5 border border-outline-variant text-on-surface-variant">
                    {qt}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
