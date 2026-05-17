'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic2, Clock, Target, CheckCircle2, ChevronRight, Sparkles, Users,
  MessageSquare, Play, Pause, RotateCcw, TrendingUp, AlertCircle,
  Volume2, BarChart2, Brain, Star, ArrowRight, Lock, Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const PARTS = [
  {
    id: 1,
    title: 'Part 1: Introduction & Interview',
    description: 'The examiner asks general questions on familiar topics — home, family, work, studies, and interests. Focus on fluency and natural delivery.',
    timing: '4–5 min',
    focus: 'General Fluency',
    band: 6.0,
    icon: MessageSquare,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    border: 'border-emerald-200 dark:border-emerald-500/20',
    bar: 'bg-emerald-500',
    status: 'available',
    sampleTopics: ['Your hometown', 'Daily routine', 'Hobbies & interests', 'Work or studies'],
  },
  {
    id: 2,
    title: 'Part 2: Individual Long Turn',
    description: 'You receive a cue card with a topic. You have 1 minute to prepare, then speak for 1–2 minutes. The examiner may ask 1–2 follow-up questions.',
    timing: '3–4 min',
    focus: 'Coherent Delivery',
    band: 5.5,
    icon: Mic2,
    color: 'text-indigo-500',
    bg: 'bg-indigo-50 dark:bg-indigo-500/10',
    border: 'border-indigo-200 dark:border-indigo-500/20',
    bar: 'bg-indigo-500',
    status: 'available',
    sampleTopics: ['A memorable journey', 'A person who inspired you', 'A skill you want to learn', 'A place you enjoy visiting'],
  },
  {
    id: 3,
    title: 'Part 3: Two-Way Discussion',
    description: 'Abstract discussion connected to Part 2 topic. The examiner asks complex questions requiring you to analyze, speculate, and justify your views.',
    timing: '4–5 min',
    focus: 'Abstract Thinking',
    band: 5.0,
    icon: Users,
    color: 'text-violet-500',
    bg: 'bg-violet-50 dark:bg-violet-500/10',
    border: 'border-violet-200 dark:border-violet-500/20',
    bar: 'bg-violet-500',
    status: 'locked',
    sampleTopics: ['Impact of travel on culture', 'Why people travel differently', 'Future of global tourism', 'Environmental effects of travel'],
  },
];

const CRITERIA = [
  { name: 'Fluency & Coherence',   score: 6.5, color: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400', tip: 'Speak at natural pace, avoid long pauses' },
  { name: 'Lexical Resource',       score: 6.0, color: 'bg-indigo-500',  text: 'text-indigo-600 dark:text-indigo-400',   tip: 'Use varied and topic-specific vocabulary' },
  { name: 'Grammatical Range',      score: 5.5, color: 'bg-violet-500',  text: 'text-violet-600 dark:text-violet-400',   tip: 'Mix simple and complex sentence structures' },
  { name: 'Pronunciation',          score: 7.0, color: 'bg-sky-500',     text: 'text-sky-600 dark:text-sky-400',         tip: 'Clear phoneme production, natural intonation' },
];

const TIPS = [
  { icon: '💡', title: 'No memorized speeches', text: 'Examiners are trained to detect memorized answers. Speak naturally and adapt to the question.' },
  { icon: '⏱️', title: 'Fill the full 2 minutes', text: "For Part 2, plan 4 points — Who, What, When, Why — and cover all of them to fill your time naturally." },
  { icon: '🔗', title: 'Use discourse markers', text: 'Phrases like "Furthermore", "On the other hand", and "What I mean is..." signal coherent, organized thinking.' },
];

export default function SpeakingPage() {
  const [selectedPart, setSelectedPart] = useState<number | null>(null);
  const [sessionActive, setSessionActive] = useState(false);
  const [recording, setRecording] = useState(false);
  const [timer, setTimer] = useState(0);

  const selectedPartData = PARTS.find(p => p.id === selectedPart);

  return (
    <div className="space-y-8 pb-10">

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
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                AI Speaking Lab
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-white/8 text-on-surface-variant text-[10px] font-bold uppercase tracking-wider">
                IELTS Standard
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-on-surface leading-tight">
              Speaking<br />
              <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Examiner Simulation</span>
            </h1>
            <p className="mt-3 text-sm text-on-surface-variant max-w-lg leading-relaxed">
              Practice with an AI examiner across all three IELTS Speaking parts. Get real-time pronunciation feedback, fluency scores, and band predictions.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <div className="p-4 bg-white/60 dark:bg-white/5 border border-white/80 dark:border-white/8 rounded-2xl text-center min-w-[80px]">
              <p className="text-xl font-black text-on-surface">6.0</p>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Avg Band</p>
            </div>
            <div className="p-4 bg-white/60 dark:bg-white/5 border border-white/80 dark:border-white/8 rounded-2xl text-center min-w-[80px]">
              <p className="text-xl font-black text-on-surface">12</p>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Sessions</p>
            </div>
            <div className="p-4 bg-white/60 dark:bg-white/5 border border-white/80 dark:border-white/8 rounded-2xl text-center min-w-[80px]">
              <p className="text-xl font-black text-emerald-500">↑0.5</p>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">This Week</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── Part Selector ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {PARTS.map((part, i) => {
          const Icon = part.icon;
          const isSelected = selectedPart === part.id;
          const isLocked = part.status === 'locked';
          return (
            <motion.div
              key={part.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                onClick={() => !isLocked && setSelectedPart(isSelected ? null : part.id)}
                className={cn(
                  'w-full text-left p-6 rounded-2xl border transition-all group',
                  isSelected
                    ? 'border-emerald-400 dark:border-emerald-500/50 bg-emerald-50/60 dark:bg-emerald-500/8 shadow-lg shadow-emerald-500/10'
                    : isLocked
                      ? 'border-outline-variant bg-surface-container-lowest opacity-60 cursor-not-allowed'
                      : 'border-outline-variant bg-surface-container-lowest hover:border-emerald-300 dark:hover:border-emerald-500/40 hover:shadow-md'
                )}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={cn('h-10 w-10 rounded-xl flex items-center justify-center', part.bg)}>
                    {isLocked ? <Lock size={16} className="text-on-surface-variant" /> : <Icon size={17} className={part.color} />}
                  </div>
                  {isLocked ? (
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider px-2 py-1 bg-slate-100 dark:bg-white/5 rounded-lg">Locked</span>
                  ) : (
                    <span className={cn('text-sm font-black', part.color)}>{part.band} / 9</span>
                  )}
                </div>
                <h3 className="text-sm font-black text-on-surface mb-1">{part.title}</h3>
                <p className="text-[11px] text-on-surface-variant mb-3 leading-relaxed line-clamp-2">{part.description}</p>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-[10px] font-bold text-on-surface-variant">
                    <Clock size={10} /> {part.timing}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-on-surface-variant">
                    <Target size={10} /> {part.focus}
                  </span>
                </div>
                {!isLocked && (
                  <div className="mt-3 h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(part.band / 9) * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.3 + i * 0.08, ease: 'easeOut' }}
                      className={cn('h-full rounded-full', part.bar)}
                    />
                  </div>
                )}
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* ── Session Panel ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedPartData && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Main session area */}
              <div className="lg:col-span-8 bg-surface-container-lowest border border-outline-variant rounded-[2rem] p-7 md:p-9">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-0.5">Active Practice</p>
                    <h2 className="text-xl font-black text-on-surface">{selectedPartData.title}</h2>
                  </div>
                  {sessionActive && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-xl">
                      <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">Recording</span>
                    </div>
                  )}
                </div>

                {/* AI Examiner avatar */}
                <div className="flex flex-col items-center py-8 border border-outline-variant rounded-2xl bg-slate-50/40 dark:bg-white/3 mb-6">
                  <div className="relative mb-4">
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-xl shadow-emerald-500/20">
                      <span className="text-2xl font-black text-white">AI</span>
                    </div>
                    {sessionActive && (
                      <motion.div
                        animate={{ scale: [1, 1.15, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="absolute inset-0 rounded-full border-2 border-emerald-400/50"
                      />
                    )}
                  </div>
                  <p className="text-sm font-bold text-on-surface mb-1">AI IELTS Examiner</p>
                  <p className="text-[11px] text-on-surface-variant mb-5">Professional · Supportive · IELTS Certified</p>

                  {/* Sample question display */}
                  {sessionActive ? (
                    <div className="max-w-md text-center p-4 bg-white/60 dark:bg-white/5 border border-white/80 dark:border-white/8 rounded-2xl">
                      <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2">Current Question</p>
                      <p className="text-base font-bold text-on-surface leading-relaxed">
                        {selectedPartData.id === 1 && '"Tell me about your hometown. What do you like most about living there?"'}
                        {selectedPartData.id === 2 && '"I\'d like you to describe a memorable journey you have taken. You have 1 minute to prepare."'}
                        {selectedPartData.id === 3 && '"Why do you think people travel to different countries? What are the cultural implications?"'}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-on-surface-variant max-w-xs text-center leading-relaxed">
                      Click &quot;Start Session&quot; to begin your AI-guided practice. The examiner will ask questions appropriate to your current level.
                    </p>
                  )}
                </div>

                {/* Controls */}
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {!sessionActive ? (
                    <button
                      onClick={() => setSessionActive(true)}
                      className="flex-1 flex items-center justify-center gap-2 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-500/25 active:scale-[0.97]"
                    >
                      <Play size={16} fill="white" /> Start Session
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => setRecording(!recording)}
                        className={cn(
                          'flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-sm transition-all',
                          recording
                            ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25'
                            : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                        )}
                      >
                        {recording ? <><Pause size={16} /> Stop Recording</> : <><Mic2 size={16} /> Start Speaking</>}
                      </button>
                      <button
                        onClick={() => { setSessionActive(false); setRecording(false); }}
                        className="px-5 py-4 border border-outline-variant hover:bg-slate-50 dark:hover:bg-white/5 text-on-surface-variant rounded-xl font-bold text-sm transition-all"
                      >
                        <RotateCcw size={16} />
                      </button>
                    </>
                  )}
                </div>

                {/* Waveform (visual only) */}
                {recording && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-5 flex items-center justify-center gap-1 h-12"
                  >
                    {Array.from({ length: 24 }).map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ height: [8, Math.random() * 36 + 8, 8] }}
                        transition={{ repeat: Infinity, duration: 0.4 + Math.random() * 0.4, delay: i * 0.04 }}
                        className="w-1.5 bg-emerald-500 rounded-full"
                        style={{ minHeight: 8 }}
                      />
                    ))}
                  </motion.div>
                )}

                {/* Sample topics */}
                <div className="mt-6 pt-5 border-t border-outline-variant">
                  <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-3">Sample Topics — {selectedPartData.title.split(':')[0]}</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedPartData.sampleTopics.map(topic => (
                      <span key={topic} className="px-3 py-1.5 bg-slate-50 dark:bg-white/5 border border-outline-variant rounded-lg text-xs font-semibold text-on-surface-variant">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Scoring sidebar */}
              <div className="lg:col-span-4 space-y-5">
                {/* Live scores */}
                <div className="bg-surface-container-lowest border border-outline-variant rounded-[2rem] p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <BarChart2 size={14} className="text-indigo-500" />
                    <h3 className="text-sm font-black text-on-surface">Scoring Criteria</h3>
                  </div>
                  <div className="space-y-4">
                    {CRITERIA.map(c => (
                      <div key={c.name}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-bold text-on-surface-variant">{c.name}</span>
                          <span className={cn('text-xs font-black', c.text)}>{c.score} / 9</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(c.score / 9) * 100}%` }}
                            transition={{ duration: 0.9, ease: 'easeOut' }}
                            className={cn('h-full rounded-full', c.color)}
                          />
                        </div>
                        <p className="text-[10px] text-on-surface-variant mt-1">{c.tip}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 pt-4 border-t border-outline-variant flex items-center justify-between">
                    <span className="text-xs font-bold text-on-surface">Estimated Band</span>
                    <span className="text-lg font-black text-emerald-500">6.0 / 9</span>
                  </div>
                </div>

                {/* AI feedback card */}
                <div className="bg-surface-container-lowest border border-outline-variant rounded-[2rem] p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles size={14} className="text-indigo-500" />
                    <h3 className="text-sm font-black text-on-surface">AI Feedback</h3>
                  </div>
                  <div className="space-y-3">
                    {[
                      { type: 'strength', icon: '✓', text: 'Good intonation and natural pausing between ideas', color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10' },
                      { type: 'improve',  icon: '→', text: 'Expand vocabulary — replace "good" with "beneficial" or "advantageous"', color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10' },
                      { type: 'tip',      icon: '💡', text: 'Use the phrase "What I mean by that is..." to buy time when thinking', color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10' },
                    ].map(fb => (
                      <div key={fb.text} className={cn('p-3 rounded-xl text-[11px] font-semibold leading-relaxed flex items-start gap-2', fb.color)}>
                        <span className="font-black flex-shrink-0 mt-0.5">{fb.icon}</span>
                        {fb.text}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── IELTS Speaking Tips ───────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TIPS.map(tip => (
            <div key={tip.title} className="p-6 bg-surface-container-lowest border border-outline-variant rounded-2xl">
              <div className="text-2xl mb-3">{tip.icon}</div>
              <h4 className="text-sm font-black text-on-surface mb-2">{tip.title}</h4>
              <p className="text-xs leading-relaxed text-on-surface-variant">{tip.text}</p>
            </div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
