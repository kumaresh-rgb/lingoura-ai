'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Volume2, Bookmark, Brain, Sparkles, ChevronRight,
  ChevronLeft, ArrowRight, Target, TrendingUp, Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useVocabularyFeed, useAddToDeck, useReviewWord } from '@/features/vocabulary/hooks/useVocabulary';
import type { VocabularyWord } from '@/features/vocabulary/types/vocabulary.types';

const BAND_COLORS: Record<number, { bg: string; text: string; border: string }> = {
  5: { bg: 'bg-slate-50 dark:bg-slate-500/10', text: 'text-slate-600 dark:text-slate-400', border: 'border-slate-200 dark:border-slate-500/20' },
  6: { bg: 'bg-sky-50 dark:bg-sky-500/10',     text: 'text-sky-600 dark:text-sky-400',     border: 'border-sky-200 dark:border-sky-500/20'     },
  7: { bg: 'bg-indigo-50 dark:bg-indigo-500/10', text: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-200 dark:border-indigo-500/20' },
  8: { bg: 'bg-violet-50 dark:bg-violet-500/10', text: 'text-violet-600 dark:text-violet-400', border: 'border-violet-200 dark:border-violet-500/20' },
  9: { bg: 'bg-violet-50 dark:bg-violet-500/10', text: 'text-violet-600 dark:text-violet-400', border: 'border-violet-200 dark:border-violet-500/20' },
};

const CATEGORY_EMOJIS: Record<string, string> = {
  environment: '🌿',
  education:   '🎓',
  technology:  '💻',
  business:    '💼',
  culture:     '🌍',
  immigration: '✈️',
  health:      '🏥',
  society:     '🤝',
  general:     '📚',
};

function WordCard({
  word,
  wordIndex,
  total,
  onPrev,
  onNext,
}: {
  word: VocabularyWord;
  wordIndex: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  const [activeTab, setActiveTab] = useState<'definition' | 'examples' | 'collocations'>('definition');
  const addToDeck = useAddToDeck();
  const reviewWord = useReviewWord();
  const bandCfg = BAND_COLORS[word.ieltsBandMin] ?? BAND_COLORS[6];
  const categoryEmoji = CATEGORY_EMOJIS[word.category] ?? '📖';

  function handleAddToDeck() {
    if (!word.isInDeck) addToDeck.mutate(word.id);
  }

  function handleNext() {
    setActiveTab('definition');
    onNext();
  }
  function handlePrev() {
    setActiveTab('definition');
    onPrev();
  }

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-[2rem] p-5 sm:p-7 md:p-10">
      {/* Navigation + band */}
      <div className="flex items-center justify-between mb-5 md:mb-8">
        <div className="flex items-center gap-2">
          <button onClick={handlePrev} className="h-9 w-9 rounded-xl border border-outline-variant flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:border-indigo-300 dark:hover:border-indigo-500/40 transition-all">
            <ChevronLeft size={18} />
          </button>
          <span className="text-[11px] font-bold text-on-surface-variant px-3">{wordIndex + 1} of {total}</span>
          <button onClick={handleNext} className="h-9 w-9 rounded-xl border border-outline-variant flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:border-indigo-300 dark:hover:border-indigo-500/40 transition-all">
            <ChevronRight size={18} />
          </button>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <span className={cn('text-[10px] font-bold px-2.5 py-1 rounded-full border', bandCfg.bg, bandCfg.text, bandCfg.border)}>
            Band {word.ieltsBandMin}
          </span>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-on-surface-variant">
            {categoryEmoji} {word.category}
          </span>
          {word.isAcademicWordList && (
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/20">
              AWL
            </span>
          )}
        </div>
      </div>

      {/* Word + pronunciation */}
      <div className="text-center mb-5 md:mb-8">
        <h2 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight text-on-surface mb-3" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
          {word.word}
        </h2>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <span className="text-sm text-on-surface-variant italic">{word.partOfSpeech}</span>
          {word.pronunciation && (
            <>
              <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700 hidden sm:block" />
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">/{word.pronunciation}/</span>
            </>
          )}
          {word.phoneticIpa && (
            <>
              <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700 hidden sm:block" />
              <span className="text-xs text-on-surface-variant">{word.phoneticIpa}</span>
            </>
          )}
          {word.audioUrl && (
            <button
              onClick={() => new Audio(word.audioUrl!).play()}
              className="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-all"
            >
              <Volume2 size={14} />
            </button>
          )}
        </div>
        {/* SRS status badge */}
        {word.srsStatus && (
          <div className="mt-2">
            <span className={cn(
              'text-[10px] font-bold px-2.5 py-1 rounded-full',
              word.srsStatus === 'mastered' && 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
              word.srsStatus === 'reviewing' && 'bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400',
              word.srsStatus === 'learning' && 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400',
              word.srsStatus === 'new' && 'bg-slate-100 dark:bg-white/5 text-on-surface-variant',
            )}>
              {word.srsStatus === 'mastered' ? '✓ Mastered' : word.srsStatus === 'reviewing' ? '↻ Reviewing' : word.srsStatus === 'learning' ? '◐ Learning' : '◯ New'}
            </span>
          </div>
        )}
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
              {word.synonyms.length > 0 && (
                <div className="mb-4">
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Synonyms</p>
                  <div className="flex flex-wrap gap-2">
                    {word.synonyms.map(s => (
                      <span key={s} className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/15 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs font-bold">{s}</span>
                    ))}
                  </div>
                </div>
              )}
              {word.mnemonic && (
                <div className="p-3 bg-amber-50/50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/10 rounded-xl">
                  <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">Memory Tip</p>
                  <p className="text-xs text-on-surface-variant leading-relaxed">{word.mnemonic}</p>
                </div>
              )}
            </div>
          )}
          {activeTab === 'examples' && (
            <div className="space-y-3">
              {word.examples.map((ex, i) => (
                <div key={i} className="p-4 bg-slate-50/60 dark:bg-white/3 border border-outline-variant rounded-xl">
                  <p className="text-sm text-on-surface leading-relaxed">
                    {ex.split(new RegExp(`(${word.word})`, 'i')).map((part, j) => (
                      <React.Fragment key={j}>
                        {part.toLowerCase() === word.word.toLowerCase()
                          ? <strong className="text-indigo-600 dark:text-indigo-400 underline decoration-indigo-200 dark:decoration-indigo-500/30">{part}</strong>
                          : part}
                      </React.Fragment>
                    ))}
                  </p>
                </div>
              ))}
              {word.commonMistake && (
                <div className="p-3 bg-rose-50/50 dark:bg-rose-500/5 border border-rose-100 dark:border-rose-500/10 rounded-xl">
                  <p className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-1">Common Mistake</p>
                  <p className="text-xs text-on-surface-variant leading-relaxed">{word.commonMistake}</p>
                </div>
              )}
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
              {word.etymology && (
                <div className="mt-4 p-3 bg-slate-50/60 dark:bg-white/3 border border-outline-variant rounded-xl">
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Etymology</p>
                  <p className="text-xs text-on-surface-variant leading-relaxed">{word.etymology}</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6 md:mt-8 pt-5 border-t border-outline-variant">
        {/* SRS Rating buttons when word is in deck */}
        {word.isInDeck ? (
          <div className="flex gap-2 flex-1">
            {[
              { label: 'Hard', quality: 1, color: 'border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10' },
              { label: 'OK',   quality: 3, color: 'border-sky-200 dark:border-sky-500/30 text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-500/10' },
              { label: 'Easy', quality: 5, color: 'border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10' },
            ].map(r => (
              <button
                key={r.label}
                onClick={() => { reviewWord.mutate({ wordId: word.id, quality: r.quality }); handleNext(); }}
                disabled={reviewWord.isPending}
                className={cn('flex-1 py-3 rounded-xl text-xs font-bold border transition-all', r.color)}
              >
                {r.label}
              </button>
            ))}
          </div>
        ) : (
          <button
            onClick={handleAddToDeck}
            disabled={addToDeck.isPending}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold border border-outline-variant text-on-surface-variant hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
          >
            <Bookmark size={15} />
            {addToDeck.isPending ? 'Adding...' : 'Add to Deck'}
          </button>
        )}
        <button onClick={handleNext} className="flex-1 flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.97]">
          Next Word <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}

export default function VocabularyPage() {
  const { data: feed, isLoading, isError } = useVocabularyFeed();

  const [activeFilter, setActiveFilter] = useState<'all' | 'due' | 'recommended'>('all');
  const [wordIndex, setWordIndex] = useState(0);

  const allWords = useMemo<VocabularyWord[]>(() => {
    if (!feed) return [];
    if (activeFilter === 'due') return feed.dueForReview;
    if (activeFilter === 'recommended') return feed.recommended;
    return [...feed.dueForReview, ...feed.recommended];
  }, [feed, activeFilter]);

  const word = allWords[wordIndex % Math.max(1, allWords.length)];

  function nextWord() { setWordIndex(i => (i + 1) % Math.max(1, allWords.length)); }
  function prevWord() { setWordIndex(i => (i - 1 + Math.max(1, allWords.length)) % Math.max(1, allWords.length)); }

  function handleFilterChange(f: typeof activeFilter) {
    setActiveFilter(f);
    setWordIndex(0);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] gap-3 text-on-surface-variant">
        <Loader2 size={20} className="animate-spin" />
        <span className="text-sm font-semibold">Loading vocabulary...</span>
      </div>
    );
  }

  if (isError || !feed) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-center">
        <div>
          <p className="text-sm font-bold text-on-surface mb-1">Could not load vocabulary</p>
          <p className="text-xs text-on-surface-variant">Please check your connection and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-[2rem] overflow-hidden border border-indigo-200 dark:border-indigo-500/20 p-5 sm:p-7 md:p-10"
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
              <p className="text-xl font-black text-on-surface">{feed.totalInDeck}</p>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">In Deck</p>
            </div>
            <div className="p-4 bg-white/60 dark:bg-white/5 border border-white/80 dark:border-white/8 rounded-2xl text-center min-w-[80px]">
              <p className="text-xl font-black text-amber-500">{feed.dueCount}</p>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Due Today</p>
            </div>
            <div className="p-4 bg-white/60 dark:bg-white/5 border border-white/80 dark:border-white/8 rounded-2xl text-center min-w-[80px]">
              <p className="text-xl font-black text-emerald-500">{feed.masteredCount}</p>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Mastered</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── Word of the Day banner ──────────────────────────────────────────── */}
      {feed.wordOfDay && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex items-center gap-4 p-4 sm:p-5 bg-gradient-to-r from-amber-50 to-amber-50/50 dark:from-amber-500/10 dark:to-transparent border border-amber-200 dark:border-amber-500/20 rounded-2xl"
        >
          <span className="text-2xl flex-shrink-0">☀️</span>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-0.5">Word of the Day</p>
            <p className="text-sm font-black text-on-surface truncate">
              {feed.wordOfDay.word}
              <span className="ml-2 text-xs font-normal text-on-surface-variant">{feed.wordOfDay.shortDefinition ?? feed.wordOfDay.definition}</span>
            </p>
          </div>
        </motion.div>
      )}

      {/* ── Filter tabs ───────────────────────────────────────────────────── */}
      <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
        {([
          { id: 'all',         label: 'All Words',    count: feed.dueForReview.length + feed.recommended.length },
          { id: 'due',         label: 'Due for Review', count: feed.dueForReview.length },
          { id: 'recommended', label: 'Recommended',  count: feed.recommended.length },
        ] as const).map(f => (
          <button
            key={f.id}
            onClick={() => handleFilterChange(f.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap border transition-all flex-shrink-0',
              activeFilter === f.id
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                : 'bg-surface-container-lowest border-outline-variant text-on-surface-variant hover:border-indigo-300 dark:hover:border-indigo-500/40'
            )}
          >
            {f.label}
            <span className={cn(
              'px-1.5 py-0.5 rounded-full text-[10px] font-black',
              activeFilter === f.id ? 'bg-white/20' : 'bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400'
            )}>
              {f.count}
            </span>
          </button>
        ))}
      </div>

      {/* ── Main Word Card + Sidebar ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Word card */}
        <motion.div
          key={word?.id ?? 'empty'}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          className="lg:col-span-8"
        >
          {word ? (
            <WordCard
              word={word}
              wordIndex={wordIndex}
              total={allWords.length}
              onPrev={prevWord}
              onNext={nextWord}
            />
          ) : (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-[2rem] p-10 text-center">
              <p className="text-2xl mb-3">🎉</p>
              <p className="text-sm font-bold text-on-surface mb-1">
                {activeFilter === 'due' ? 'All caught up!' : 'No words here yet'}
              </p>
              <p className="text-xs text-on-surface-variant">
                {activeFilter === 'due'
                  ? 'No words are due for review right now. Check back later!'
                  : 'Switch to Recommended to discover new words.'}
              </p>
            </div>
          )}
        </motion.div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-5">
          {/* SRS stats */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-[2rem] p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target size={14} className="text-indigo-500" />
              <h3 className="text-sm font-black text-on-surface">Your Progress</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: 'In Deck',  value: feed.totalInDeck,  color: 'bg-indigo-500' },
                { label: 'Due Today', value: feed.dueCount,    color: 'bg-amber-500'  },
                { label: 'Mastered', value: feed.masteredCount, color: 'bg-emerald-500' },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex justify-between text-[10px] font-bold mb-1">
                    <span className="text-on-surface-variant">{item.label}</span>
                    <span className="text-on-surface">{item.value}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: feed.totalInDeck > 0 ? `${(item.value / feed.totalInDeck) * 100}%` : '0%' }}
                      transition={{ duration: 0.9, ease: 'easeOut' }}
                      className={cn('h-full rounded-full', item.color)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Band breakdown */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-[2rem] p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={14} className="text-emerald-500" />
              <h3 className="text-sm font-black text-on-surface">Band Distribution</h3>
            </div>
            <div className="space-y-3">
              {[5, 6, 7, 8].map(band => {
                const count = allWords.filter(w => w.ieltsBandMin === band).length;
                const total = Math.max(1, allWords.length);
                const colors: Record<number, string> = { 5: 'bg-slate-400', 6: 'bg-sky-500', 7: 'bg-indigo-500', 8: 'bg-violet-500' };
                return (
                  <div key={band}>
                    <div className="flex justify-between text-[10px] font-bold mb-1">
                      <span className="text-on-surface-variant">Band {band}+</span>
                      <span className="text-on-surface">{count} words</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(count / total) * 100}%` }}
                        transition={{ duration: 0.9, ease: 'easeOut' }}
                        className={cn('h-full rounded-full', colors[band])}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Word of day detail */}
          {feed.wordOfDay && (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-[2rem] p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={14} className="text-amber-500" />
                <h3 className="text-sm font-black text-on-surface">Word of the Day</h3>
              </div>
              <p className="text-lg font-black text-on-surface italic mb-1">{feed.wordOfDay.word}</p>
              <p className="text-xs text-on-surface-variant mb-3 leading-relaxed">{feed.wordOfDay.definition}</p>
              {feed.wordOfDay.examples[0] && (
                <div className="p-3 bg-slate-50/60 dark:bg-white/3 border border-outline-variant rounded-xl">
                  <p className="text-[11px] text-on-surface-variant leading-relaxed italic">&ldquo;{feed.wordOfDay.examples[0]}&rdquo;</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
