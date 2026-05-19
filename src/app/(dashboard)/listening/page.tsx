'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Headphones, Play, Pause, Clock, Target, CheckCircle2, ChevronRight,
  Sparkles, Zap, SkipForward, Volume2, RotateCcw, Brain, Lock,
  BarChart2, AlertCircle, ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const SECTIONS = [
  {
    id: 1, title: 'Section 1', sub: 'Everyday Social Conversation',
    description: 'A conversation between two people in an everyday social context — e.g. accommodation enquiry, sports club registration.',
    duration: '7–8 min', questions: 10, difficulty: 'Beginner', status: 'completed',
    accent: 'British', band: 7.0,
    questionTypes: ['Form completion', 'Note completion', 'Multiple choice'],
    color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10', border: 'border-emerald-200 dark:border-emerald-500/20', bar: 'bg-emerald-500',
  },
  {
    id: 2, title: 'Section 2', sub: 'Everyday Social Monologue',
    description: 'A monologue in an everyday social context — e.g. a radio broadcast about local facilities, a welcome speech at a conference.',
    duration: '7–8 min', questions: 10, difficulty: 'Intermediate', status: 'available',
    accent: 'Australian', band: 6.0,
    questionTypes: ['Map labeling', 'Table completion', 'Sentence completion'],
    color: 'text-sky-500', bg: 'bg-sky-50 dark:bg-sky-500/10', border: 'border-sky-200 dark:border-sky-500/20', bar: 'bg-sky-500',
  },
  {
    id: 3, title: 'Section 3', sub: 'Educational Conversation',
    description: 'A conversation between up to four people in an educational context — e.g. university tutor and student discussing an assignment or project.',
    duration: '8–9 min', questions: 10, difficulty: 'Advanced', status: 'locked',
    accent: 'American', band: 0,
    questionTypes: ['Multiple choice', 'Matching', 'Short answer'],
    color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-500/10', border: 'border-violet-200 dark:border-violet-500/20', bar: 'bg-violet-500',
  },
  {
    id: 4, title: 'Section 4', sub: 'Academic Monologue',
    description: 'A monologue on an academic subject — e.g. a university lecture on environmental science, technology, or history.',
    duration: '9–10 min', questions: 10, difficulty: 'Expert', status: 'locked',
    accent: 'Canadian', band: 0,
    questionTypes: ['Summary completion', 'Diagram labeling', 'Sentence completion'],
    color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-500/10', border: 'border-rose-200 dark:border-rose-500/20', bar: 'bg-rose-500',
  },
];

const DIFFICULTY_CONFIG: Record<string, { color: string; bg: string }> = {
  Beginner:     { color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
  Intermediate: { color: 'text-sky-600 dark:text-sky-400',         bg: 'bg-sky-50 dark:bg-sky-500/10'         },
  Advanced:     { color: 'text-violet-600 dark:text-violet-400',   bg: 'bg-violet-50 dark:bg-violet-500/10'   },
  Expert:       { color: 'text-rose-600 dark:text-rose-400',       bg: 'bg-rose-50 dark:bg-rose-500/10'       },
};

const MOCK_QUESTIONS = [
  { id: 1, type: 'Form Completion', q: 'Name of accommodation: ______',           options: [] },
  { id: 2, type: 'Multiple Choice', q: 'When does the sports club meet?',          options: ['Monday and Wednesday', 'Tuesday and Thursday', 'Friday and Saturday'] },
  { id: 3, type: 'Note Completion', q: 'Maximum number of members per team: ____', options: [] },
  { id: 4, type: 'Multiple Choice', q: 'What is included in the annual fee?',      options: ['Equipment hire only', 'Coaching and equipment', 'Coaching only'] },
];

export default function ListeningPage() {
  const [selectedSection, setSelectedSection] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [volume, setVolume] = useState(80);

  const section = SECTIONS.find(s => s.id === selectedSection);
  const diffConfig = section ? DIFFICULTY_CONFIG[section.difficulty] : null;

  return (
    <div className="space-y-8 pb-10">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-[2rem] overflow-hidden border border-sky-200 dark:border-sky-500/20 p-5 sm:p-7 md:p-10"
        style={{ background: 'linear-gradient(135deg, rgba(14,165,233,0.07) 0%, rgba(2,132,199,0.04) 50%, rgba(14,165,233,0.02) 100%)' }}
      >
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-500/15 text-sky-700 dark:text-sky-300 text-[10px] font-bold uppercase tracking-wider">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-500 animate-pulse" />
                AI Listening Lab
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-white/8 text-on-surface-variant text-[10px] font-bold uppercase tracking-wider">
                IELTS Standard
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-on-surface leading-tight">
              Listening<br />
              <span className="bg-gradient-to-r from-sky-500 to-cyan-500 bg-clip-text text-transparent">Practice Lab</span>
            </h1>
            <p className="mt-3 text-sm text-on-surface-variant max-w-lg leading-relaxed">
              Train across all four IELTS Listening sections with authentic native speaker accents. Practice note-taking, form completion, and map labeling under real exam conditions.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <div className="p-4 bg-white/60 dark:bg-white/5 border border-white/80 dark:border-white/8 rounded-2xl text-center min-w-[80px]">
              <p className="text-xl font-black text-on-surface">7.0</p>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Last Band</p>
            </div>
            <div className="p-4 bg-white/60 dark:bg-white/5 border border-white/80 dark:border-white/8 rounded-2xl text-center min-w-[80px]">
              <p className="text-xl font-black text-on-surface">1/4</p>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Sections Done</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── Section Cards ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {SECTIONS.map((sec, i) => {
          const isSelected = selectedSection === sec.id;
          const isLocked = sec.status === 'locked';
          const isCompleted = sec.status === 'completed';
          const diffCfg = DIFFICULTY_CONFIG[sec.difficulty];
          return (
            <motion.div
              key={sec.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 + i * 0.07, duration: 0.45 }}
            >
              <button
                onClick={() => !isLocked && setSelectedSection(isSelected ? null : sec.id)}
                className={cn(
                  'w-full text-left p-6 rounded-2xl border transition-all group relative overflow-hidden',
                  isSelected
                    ? cn(sec.border, 'shadow-lg')
                    : isLocked
                      ? 'border-outline-variant bg-surface-container-lowest opacity-55 cursor-not-allowed'
                      : 'border-outline-variant bg-surface-container-lowest hover:shadow-md'
                )}
                style={isSelected ? { background: `linear-gradient(135deg, var(--surface-container-lowest), transparent)` } : undefined}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className={cn('h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0', sec.bg)}>
                      {isLocked
                        ? <Lock size={16} className="text-on-surface-variant" />
                        : isCompleted
                          ? <CheckCircle2 size={16} className={sec.color} />
                          : <Headphones size={16} className={sec.color} />
                      }
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{sec.title}</p>
                      <p className="text-sm font-black text-on-surface">{sec.sub}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full', diffCfg.bg, diffCfg.color)}>
                      {sec.difficulty}
                    </span>
                    {isCompleted && (
                      <span className="text-[10px] font-black text-sky-500">{sec.band} / 9</span>
                    )}
                  </div>
                </div>

                <p className="text-[11px] text-on-surface-variant mb-4 leading-relaxed text-left">{sec.description}</p>

                <div className="flex items-center gap-4 mb-3">
                  <span className="flex items-center gap-1 text-[10px] font-bold text-on-surface-variant">
                    <Clock size={10} /> {sec.duration}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-on-surface-variant">
                    <Target size={10} /> {sec.questions} Questions
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-on-surface-variant">
                    <Volume2 size={10} /> {sec.accent}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {sec.questionTypes.map(qt => (
                    <span key={qt} className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-md', sec.bg, sec.color)}>
                      {qt}
                    </span>
                  ))}
                </div>

                {isCompleted && (
                  <div className="mt-4 h-1 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <div className={cn('h-full rounded-full', sec.bar)} style={{ width: '100%' }} />
                  </div>
                )}
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* ── Practice Session ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {section && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Audio player + questions */}
              <div className="lg:col-span-8 space-y-5">
                {/* Audio Player */}
                <div className="bg-surface-container-lowest border border-outline-variant rounded-[2rem] p-5 sm:p-7">
                  <div className="flex items-center justify-between mb-5 gap-3">
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider mb-0.5">Now Playing</p>
                      <h2 className="text-lg font-black text-on-surface">{section.title}: {section.sub}</h2>
                      <p className="text-xs text-on-surface-variant">{section.accent} Accent · {section.duration}</p>
                    </div>
                    <div className={cn('h-12 w-12 rounded-2xl flex items-center justify-center', section.bg)}>
                      <Headphones size={20} className={section.color} />
                    </div>
                  </div>

                  {/* Waveform visualization */}
                  <div className="flex items-center justify-center gap-0.5 h-14 mb-5 px-2 overflow-hidden">
                    {Array.from({ length: 32 }).map((_, i) => (
                      <motion.div
                        key={i}
                        animate={playing ? { height: [4, Math.random() * 40 + 4, 4] } : { height: 4 }}
                        transition={{ repeat: Infinity, duration: 0.3 + Math.random() * 0.3, delay: i * 0.02 }}
                        className={cn('w-1 rounded-full', i < 16 ? section.bar : 'bg-slate-200 dark:bg-white/10')}
                        style={{ minHeight: 4 }}
                      />
                    ))}
                  </div>

                  {/* Progress bar */}
                  <div className="h-1.5 bg-slate-100 dark:bg-white/5 rounded-full mb-3 overflow-hidden">
                    <div className={cn('h-full rounded-full', section.bar)} style={{ width: playing ? '33%' : '0%', transition: 'width 0.5s' }} />
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-on-surface-variant mb-5">
                    <span>2:34</span>
                    <span>{section.duration.split('–')[0]}:00</span>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-center gap-5">
                    <button className="h-10 w-10 flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors">
                      <RotateCcw size={18} />
                    </button>
                    <button
                      onClick={() => setPlaying(!playing)}
                      className={cn('h-14 w-14 rounded-full flex items-center justify-center text-white transition-all shadow-lg active:scale-95', section.bar)}
                    >
                      {playing ? <Pause size={22} /> : <Play size={22} fill="white" />}
                    </button>
                    <button className="h-10 w-10 flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors">
                      <SkipForward size={18} />
                    </button>
                  </div>

                  {/* Volume */}
                  <div className="flex items-center gap-3 mt-5">
                    <Volume2 size={14} className="text-on-surface-variant flex-shrink-0" />
                    <input
                      type="range" min="0" max="100" value={volume}
                      onChange={e => setVolume(Number(e.target.value))}
                      className="flex-1 h-1 accent-sky-500"
                    />
                    <span className="text-[10px] font-bold text-on-surface-variant w-8 text-right">{volume}%</span>
                  </div>

                  <p className="mt-4 text-[10px] text-center text-on-surface-variant">
                    ⚠️ In the real IELTS exam, you can only hear the recording once. Practice without replaying.
                  </p>
                </div>

                {/* Questions */}
                <div className="bg-surface-container-lowest border border-outline-variant rounded-[2rem] p-7">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-base font-black text-on-surface">Answer the Questions</h3>
                    <span className="text-[10px] font-bold text-on-surface-variant px-3 py-1 bg-slate-50 dark:bg-white/5 rounded-lg border border-outline-variant">
                      {section.questions} Questions
                    </span>
                  </div>
                  <div className="space-y-5">
                    {MOCK_QUESTIONS.map(q => (
                      <div key={q.id} className="space-y-2">
                        <div className="flex items-start gap-3">
                          <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-md flex-shrink-0 mt-0.5', section.bg, section.color)}>
                            Q{q.id}
                          </span>
                          <p className="text-sm font-semibold text-on-surface">{q.q}</p>
                        </div>
                        {q.options.length > 0 ? (
                          <div className="ml-9 space-y-2">
                            {q.options.map(opt => (
                              <label key={opt} className="flex items-center gap-3 p-3 rounded-xl border border-outline-variant hover:border-sky-300 dark:hover:border-sky-500/40 cursor-pointer bg-slate-50/30 dark:bg-white/2 transition-all group">
                                <input
                                  type="radio" name={`q${q.id}`} value={opt}
                                  onChange={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                                  className="accent-sky-500"
                                />
                                <span className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">{opt}</span>
                              </label>
                            ))}
                          </div>
                        ) : (
                          <input
                            type="text"
                            placeholder="Write your answer..."
                            value={answers[q.id] ?? ''}
                            onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                            className="mt-2 w-full px-4 py-2.5 bg-slate-50/40 dark:bg-white/3 border border-slate-200 dark:border-white/8 rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-sky-400 dark:focus:border-sky-500/50 transition-colors"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setSubmitted(true)}
                    className="mt-7 w-full flex items-center justify-center gap-2 py-3.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-sky-500/20 active:scale-[0.97]"
                  >
                    <Sparkles size={15} /> Submit Answers for AI Review
                  </button>
                  {submitted && (
                    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-500/8 border border-emerald-100 dark:border-emerald-500/15 rounded-xl text-sm text-emerald-700 dark:text-emerald-300 font-semibold text-center">
                      ✓ Answers submitted — AI review will be ready in a few seconds.
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Section tips sidebar */}
              <div className="lg:col-span-4 space-y-5">
                <div className="bg-surface-container-lowest border border-outline-variant rounded-[2rem] p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Brain size={14} className="text-sky-500" />
                    <h3 className="text-sm font-black text-on-surface">Section Strategy</h3>
                  </div>
                  <div className="space-y-3">
                    {[
                      { icon: '👁️', tip: 'Read questions before audio starts — use 30 seconds to predict answers.' },
                      { icon: '✍️', tip: 'Write while listening — don\'t wait until after to fill in answers.' },
                      { icon: '🔤', tip: 'Spelling counts — write exactly what you hear, check capital letters.' },
                      { icon: '⏩', tip: 'If you miss an answer, move on immediately to avoid missing the next one.' },
                    ].map(t => (
                      <div key={t.tip} className="flex items-start gap-2.5 p-3 bg-slate-50/60 dark:bg-white/3 rounded-xl">
                        <span className="text-base flex-shrink-0">{t.icon}</span>
                        <p className="text-[11px] text-on-surface-variant leading-relaxed">{t.tip}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-surface-container-lowest border border-outline-variant rounded-[2rem] p-6">
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-3">Question Types</p>
                  <div className="flex flex-wrap gap-2">
                    {section.questionTypes.map(qt => (
                      <span key={qt} className={cn('text-[10px] font-bold px-2.5 py-1.5 rounded-lg border', section.bg, section.border, section.color)}>
                        {qt}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
