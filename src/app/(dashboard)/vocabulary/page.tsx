'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Volume2, Bookmark, Brain, RefreshCw, Sparkles, ChevronRight,
  ChevronLeft, ArrowRight, Star, Check, X, Zap, BookOpen,
  Target, TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Category = 'all' | 'environment' | 'education' | 'technology' | 'business' | 'culture' | 'immigration';

const CATEGORIES: { id: Category; label: string; emoji: string }[] = [
  { id: 'all',         label: 'All',         emoji: '📚' },
  { id: 'environment', label: 'Environment', emoji: '🌿' },
  { id: 'education',   label: 'Education',   emoji: '🎓' },
  { id: 'technology',  label: 'Technology',  emoji: '💻' },
  { id: 'business',    label: 'Business',    emoji: '💼' },
  { id: 'culture',     label: 'Culture',     emoji: '🌍' },
  { id: 'immigration', label: 'Immigration', emoji: '✈️' },
];

const WORDS = [
  { word: 'mitigate',      pos: 'verb',       pronunciation: 'MIT-uh-gayt',        band: 7, category: 'environment' as Category, definition: 'To make something less severe, serious, or painful.', examples: ['The government implemented policies to mitigate the effects of climate change.', 'Planting trees can help mitigate carbon emissions significantly.'], synonyms: ['alleviate', 'reduce', 'lessen', 'diminish'], collocations: ['mitigate risk', 'mitigate the impact', 'mitigate damage'], saved: false },
  { word: 'proliferate',   pos: 'verb',       pronunciation: 'pruh-LIF-uh-rayt',   band: 7, category: 'technology' as Category,   definition: 'To increase rapidly in numbers; to multiply.', examples: ['Social media platforms have proliferated exponentially over the last decade.', 'Online businesses began to proliferate following the pandemic.'], synonyms: ['multiply', 'spread', 'expand', 'grow rapidly'], collocations: ['proliferate rapidly', 'technology proliferates', 'wildly proliferating'], saved: true },
  { word: 'paradigm',      pos: 'noun',       pronunciation: 'PA-ruh-dime',        band: 8, category: 'education' as Category,    definition: 'A typical example or pattern of something; a model or framework.', examples: ['The internet represents a paradigm shift in how people access information.', 'Researchers are challenging the existing paradigm in behavioral economics.'], synonyms: ['model', 'framework', 'archetype', 'standard'], collocations: ['paradigm shift', 'dominant paradigm', 'paradigm change'], saved: false },
  { word: 'assimilate',    pos: 'verb',       pronunciation: 'uh-SIM-uh-layt',     band: 6, category: 'immigration' as Category,  definition: 'To absorb and integrate into a wider society or culture.', examples: ['Immigrants often struggle to assimilate into a new culture while maintaining their heritage.', 'Children assimilate new languages more quickly than adults.'], synonyms: ['integrate', 'absorb', 'adapt', 'acclimatize'], collocations: ['assimilate into society', 'cultural assimilation', 'assimilate information'], saved: false },
  { word: 'autonomous',    pos: 'adjective',  pronunciation: 'aw-TON-uh-mus',      band: 7, category: 'technology' as Category,   definition: 'Acting independently and having the freedom to do so.', examples: ['Autonomous vehicles are expected to transform urban transportation by 2030.', 'The region was granted autonomous status following years of political negotiation.'], synonyms: ['independent', 'self-governing', 'self-directed', 'sovereign'], collocations: ['autonomous vehicle', 'fully autonomous', 'autonomous region'], saved: true },
];

const BAND_COLORS: Record<number, { bg: string; text: string; border: string }> = {
  5: { bg: 'bg-slate-50 dark:bg-slate-500/10', text: 'text-slate-600 dark:text-slate-400', border: 'border-slate-200 dark:border-slate-500/20' },
  6: { bg: 'bg-sky-50 dark:bg-sky-500/10',     text: 'text-sky-600 dark:text-sky-400',     border: 'border-sky-200 dark:border-sky-500/20'     },
  7: { bg: 'bg-indigo-50 dark:bg-indigo-500/10', text: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-200 dark:border-indigo-500/20' },
  8: { bg: 'bg-violet-50 dark:bg-violet-500/10', text: 'text-violet-600 dark:text-violet-400', border: 'border-violet-200 dark:border-violet-500/20' },
};

export default function VocabularyPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [wordIndex, setWordIndex] = useState(0);
  const [savedWords, setSavedWords] = useState<string[]>(['proliferate', 'autonomous']);
  const [quizMode, setQuizMode] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState<'correct' | 'wrong' | null>(null);
  const [activeTab, setActiveTab] = useState<'definition' | 'examples' | 'collocations'>('definition');

  const filtered = activeCategory === 'all' ? WORDS : WORDS.filter(w => w.category === activeCategory);
  const word = filtered[wordIndex % filtered.length];
  const bandCfg = BAND_COLORS[word?.band ?? 6];
  const isSaved = savedWords.includes(word?.word);

  function toggleSave() {
    setSavedWords(prev =>
      prev.includes(word.word) ? prev.filter(w => w !== word.word) : [...prev, word.word]
    );
  }

  function nextWord() { setWordIndex(i => (i + 1) % filtered.length); setActiveTab('definition'); setQuizAnswer(null); }
  function prevWord() { setWordIndex(i => (i - 1 + filtered.length) % filtered.length); setActiveTab('definition'); setQuizAnswer(null); }

  if (!word) return null;

  return (
    <div className="space-y-8 pb-10">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-[2rem] overflow-hidden border border-indigo-200 dark:border-indigo-500/20 p-7 md:p-10"
        style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.07) 0%, rgba(79,70,229,0.04) 50%, rgba(99,102,241,0.02) 100%)' }}
      >
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold uppercase tracking-wider">
                <Brain size={10} /> IELTS Vocabulary
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-white/8 text-on-surface-variant text-[10px] font-bold uppercase tracking-wider">
                Spaced Repetition
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-on-surface leading-tight">
              Lexical<br />
              <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">Intelligence Engine</span>
            </h1>
            <p className="mt-3 text-sm text-on-surface-variant max-w-lg leading-relaxed">
              Band-targeted IELTS vocabulary with collocations, pronunciation, and AI-powered spaced repetition. Learn words that actually appear in the IELTS exam.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <div className="p-4 bg-white/60 dark:bg-white/5 border border-white/80 dark:border-white/8 rounded-2xl text-center min-w-[80px]">
              <p className="text-xl font-black text-on-surface">247</p>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Words Learned</p>
            </div>
            <div className="p-4 bg-white/60 dark:bg-white/5 border border-white/80 dark:border-white/8 rounded-2xl text-center min-w-[80px]">
              <p className="text-xl font-black text-indigo-500">{savedWords.length}</p>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Saved Words</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── Category Filter ───────────────────────────────────────────────── */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => { setActiveCategory(cat.id); setWordIndex(0); setActiveTab('definition'); }}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap border transition-all flex-shrink-0',
              activeCategory === cat.id
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                : 'bg-surface-container-lowest border-outline-variant text-on-surface-variant hover:border-indigo-300 dark:hover:border-indigo-500/40'
            )}
          >
            <span>{cat.emoji}</span> {cat.label}
          </button>
        ))}
      </div>

      {/* ── Main Word Card + Sidebar ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Word card */}
        <motion.div
          key={word.word}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          className="lg:col-span-8"
        >
          <div className="bg-surface-container-lowest border border-outline-variant rounded-[2rem] p-8 md:p-10">
            {/* Navigation + band */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <button onClick={prevWord} className="h-9 w-9 rounded-xl border border-outline-variant flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:border-indigo-300 dark:hover:border-indigo-500/40 transition-all">
                  <ChevronLeft size={18} />
                </button>
                <span className="text-[11px] font-bold text-on-surface-variant px-3">{wordIndex + 1} of {filtered.length}</span>
                <button onClick={nextWord} className="h-9 w-9 rounded-xl border border-outline-variant flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:border-indigo-300 dark:hover:border-indigo-500/40 transition-all">
                  <ChevronRight size={18} />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn('text-[10px] font-bold px-2.5 py-1 rounded-full border', bandCfg.bg, bandCfg.text, bandCfg.border)}>
                  Band {word.band}
                </span>
                <span className={cn('text-[10px] font-bold px-2.5 py-1 rounded-full', CATEGORIES.find(c => c.id === word.category)?.emoji)}>
                  {CATEGORIES.find(c => c.id === word.category)?.emoji} {word.category}
                </span>
              </div>
            </div>

            {/* Word + pronunciation */}
            <div className="text-center mb-8">
              <h2 className="text-5xl md:text-7xl font-black tracking-tight text-on-surface mb-3" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                {word.word}
              </h2>
              <div className="flex items-center justify-center gap-4">
                <span className="text-sm text-on-surface-variant italic">{word.pos}</span>
                <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                <span className="text-sm font-bold text-on-surface-variant uppercase tracking-wider text-xs">/{word.pronunciation}/</span>
                <button className="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-all">
                  <Volume2 size={14} />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-outline-variant pb-0">
              {(['definition', 'examples', 'collocations'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    'px-4 pb-3 text-xs font-bold capitalize border-b-2 transition-all -mb-px',
                    activeTab === tab
                      ? 'text-indigo-600 dark:text-indigo-400 border-indigo-500'
                      : 'text-on-surface-variant border-transparent hover:text-on-surface'
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                {activeTab === 'definition' && (
                  <div>
                    <p className="text-base text-on-surface leading-relaxed mb-5">{word.definition}</p>
                    <div>
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Synonyms</p>
                      <div className="flex flex-wrap gap-2">
                        {word.synonyms.map(s => (
                          <span key={s} className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/15 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs font-bold">{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === 'examples' && (
                  <div className="space-y-3">
                    {word.examples.map((ex, i) => (
                      <div key={i} className="p-4 bg-slate-50/60 dark:bg-white/3 border border-outline-variant rounded-xl">
                        <p className="text-sm text-on-surface leading-relaxed">
                          {ex.split(word.word).map((part, j, arr) => (
                            <React.Fragment key={j}>
                              {part}
                              {j < arr.length - 1 && (
                                <strong className="text-indigo-600 dark:text-indigo-400 underline decoration-indigo-200 dark:decoration-indigo-500/30">{word.word}</strong>
                              )}
                            </React.Fragment>
                          ))}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
                {activeTab === 'collocations' && (
                  <div>
                    <p className="text-[11px] text-on-surface-variant mb-3">Common word combinations used in academic English:</p>
                    <div className="space-y-2">
                      {word.collocations.map(col => (
                        <div key={col} className="flex items-center gap-3 p-3 bg-slate-50/60 dark:bg-white/3 border border-outline-variant rounded-xl">
                          <span className="text-indigo-500 font-black text-sm">→</span>
                          <span className="text-sm font-bold text-on-surface italic">{col}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Actions */}
            <div className="flex gap-3 mt-8 pt-5 border-t border-outline-variant">
              <button
                onClick={toggleSave}
                className={cn(
                  'flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold border transition-all',
                  isSaved
                    ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400'
                    : 'border-outline-variant text-on-surface-variant hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:text-indigo-600 dark:hover:text-indigo-400'
                )}
              >
                <Bookmark size={15} className={isSaved ? 'fill-current' : ''} />
                {isSaved ? 'Saved' : 'Save Word'}
              </button>
              <button onClick={nextWord} className="flex-1 flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.97]">
                Next Word <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-5">
          {/* Daily progress */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-[2rem] p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target size={14} className="text-indigo-500" />
              <h3 className="text-sm font-black text-on-surface">Daily Goal</h3>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-on-surface-variant">Words learned today</span>
              <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">7 / 10</span>
            </div>
            <div className="h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden mb-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '70%' }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
              />
            </div>
            <p className="text-[11px] text-on-surface-variant">3 more words to hit today&apos;s target 🎯</p>
          </div>

          {/* Band breakdown */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-[2rem] p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={14} className="text-emerald-500" />
              <h3 className="text-sm font-black text-on-surface">Band Distribution</h3>
            </div>
            <div className="space-y-3">
              {[
                { band: 5, count: 84,  color: 'bg-slate-400' },
                { band: 6, count: 96,  color: 'bg-sky-500'   },
                { band: 7, count: 52,  color: 'bg-indigo-500' },
                { band: 8, count: 15,  color: 'bg-violet-500' },
              ].map(item => (
                <div key={item.band}>
                  <div className="flex justify-between text-[10px] font-bold mb-1">
                    <span className="text-on-surface-variant">Band {item.band}+</span>
                    <span className="text-on-surface">{item.count} words</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.count / 247) * 100}%` }}
                      transition={{ duration: 0.9, ease: 'easeOut' }}
                      className={cn('h-full rounded-full', item.color)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick quiz */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-[2rem] p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={14} className="text-amber-500" />
              <h3 className="text-sm font-black text-on-surface">Quick Quiz</h3>
            </div>
            <p className="text-xs text-on-surface-variant mb-3">Which sentence uses <strong className="text-on-surface">mitigate</strong> correctly?</p>
            {[
              { opt: 'A', text: 'She mitigated the test score by studying hard.', correct: false },
              { opt: 'B', text: 'Policies were introduced to mitigate air pollution.', correct: true },
            ].map(q => (
              <button
                key={q.opt}
                onClick={() => setQuizAnswer(q.correct ? 'correct' : 'wrong')}
                className={cn(
                  'w-full text-left p-3 rounded-xl border text-[11px] font-semibold mb-2 transition-all leading-relaxed',
                  quizAnswer === null
                    ? 'border-outline-variant hover:border-indigo-300 dark:hover:border-indigo-500/40 text-on-surface-variant'
                    : q.correct
                      ? 'bg-emerald-50 dark:bg-emerald-500/8 border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                      : 'bg-rose-50 dark:bg-rose-500/8 border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-300 opacity-60'
                )}
              >
                <strong className="mr-2">{q.opt}.</strong>{q.text}
                {quizAnswer !== null && q.correct && <span className="ml-2">✓</span>}
              </button>
            ))}
            {quizAnswer && (
              <p className={cn('text-[10px] font-bold mt-2', quizAnswer === 'correct' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400')}>
                {quizAnswer === 'correct' ? '✓ Correct! Great vocabulary instinct.' : '✗ Incorrect. "Mitigate" means to reduce severity, not improve a score.'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
