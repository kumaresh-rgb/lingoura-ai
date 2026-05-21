'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, Trophy, Flame, Star, Clock, Target, Brain, Volume2,
  ChevronRight, RotateCcw, Check, X, ArrowRight, Sparkles,
  Mic2, BookOpen, MessageSquare, Lock, Play, Award,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Data ────────────────────────────────────────────────────────────────────

const GAMES = [
  {
    id: 'vocab-race',
    title: 'Vocabulary Race',
    subtitle: 'Define words faster than the clock',
    icon: Zap,
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.3)',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.25)',
    xp: 50,
    duration: '2 min',
    tag: 'Quick Play',
    locked: false,
  },
  {
    id: 'grammar-battle',
    title: 'Grammar Battle',
    subtitle: 'Fix sentences against the timer',
    icon: Brain,
    color: '#6366f1',
    glow: 'rgba(99,102,241,0.3)',
    bg: 'rgba(99,102,241,0.08)',
    border: 'rgba(99,102,241,0.25)',
    xp: 75,
    duration: '3 min',
    tag: 'Popular',
    locked: false,
  },
  {
    id: 'word-memory',
    title: 'Word Memory',
    subtitle: 'Match words to their meanings',
    icon: BookOpen,
    color: '#10b981',
    glow: 'rgba(16,185,129,0.3)',
    bg: 'rgba(16,185,129,0.08)',
    border: 'rgba(16,185,129,0.25)',
    xp: 60,
    duration: '2 min',
    tag: 'Brain Boost',
    locked: false,
  },
  {
    id: 'listening-snap',
    title: 'Listening Snap',
    subtitle: 'Identify words from audio clips',
    icon: Volume2,
    color: '#0ea5e9',
    glow: 'rgba(14,165,233,0.3)',
    bg: 'rgba(14,165,233,0.08)',
    border: 'rgba(14,165,233,0.25)',
    xp: 80,
    duration: '3 min',
    tag: 'New',
    locked: false,
  },
  {
    id: 'speed-type',
    title: 'Speed Typing',
    subtitle: 'Type IELTS phrases at full speed',
    icon: Flame,
    color: '#ef4444',
    glow: 'rgba(239,68,68,0.3)',
    bg: 'rgba(239,68,68,0.08)',
    border: 'rgba(239,68,68,0.25)',
    xp: 65,
    duration: '2 min',
    tag: 'Reflex',
    locked: false,
  },
  {
    id: 'ai-duel',
    title: 'AI Speaking Duel',
    subtitle: 'Beat the AI at pronunciation',
    icon: Mic2,
    color: '#8b5cf6',
    glow: 'rgba(139,92,246,0.3)',
    bg: 'rgba(139,92,246,0.08)',
    border: 'rgba(139,92,246,0.25)',
    xp: 120,
    duration: '5 min',
    tag: 'Pro',
    locked: true,
  },
];

const VOCAB_WORDS = [
  { word: 'Ubiquitous', options: ['Rare and unusual', 'Present everywhere', 'Completely silent', 'Extremely dangerous'], answer: 1 },
  { word: 'Eloquent', options: ['Confused', 'Poorly designed', 'Fluent and persuasive', 'Overly emotional'], answer: 2 },
  { word: 'Mitigate', options: ['Make worse', 'Lessen the impact', 'Create problems', 'Ignore completely'], answer: 1 },
  { word: 'Intrinsic', options: ['Externally imposed', 'Belonging naturally', 'Copied from others', 'Completely removed'], answer: 1 },
  { word: 'Adversity', options: ['Good fortune', 'A type of advertisement', 'Difficult circumstances', 'A warm climate'], answer: 2 },
  { word: 'Pragmatic', options: ['Dreamy and idealistic', 'Focused on practical results', 'Highly emotional', 'Completely random'], answer: 1 },
  { word: 'Substantial', options: ['Very small', 'Fairly large in size or amount', 'Invisible', 'Temporary'], answer: 1 },
  { word: 'Coherent', options: ['Logical and consistent', 'Disorganized', 'Very loud', 'Extremely old'], answer: 0 },
];

const GRAMMAR_SENTENCES = [
  { broken: 'She have been studying English for three year.', fixed: 'She has been studying English for three years.', error: 'Subject-verb agreement + plural noun' },
  { broken: 'He went to the store for buying some milk.', fixed: 'He went to the store to buy some milk.', error: 'Infinitive of purpose' },
  { broken: 'Despite of the rain, we enjoyed the picnic.', fixed: 'Despite the rain, we enjoyed the picnic.', error: '"Despite" takes no "of"' },
  { broken: 'This is the most biggest building in city.', fixed: 'This is the biggest building in the city.', error: 'Double superlative + missing article' },
  { broken: 'If I will pass the exam, I will celebrate.', fixed: 'If I pass the exam, I will celebrate.', error: 'First conditional — no "will" in if-clause' },
];

const MEMORY_PAIRS = [
  { word: 'Eloquent', meaning: 'Fluent & persuasive' },
  { word: 'Mitigate', meaning: 'Reduce severity' },
  { word: 'Pragmatic', meaning: 'Practical approach' },
  { word: 'Coherent', meaning: 'Logical & consistent' },
  { word: 'Adversity', meaning: 'Difficult circumstances' },
  { word: 'Ubiquitous', meaning: 'Present everywhere' },
];

// ─── Vocab Race Game ──────────────────────────────────────────────────────────

function VocabRaceGame({ onFinish }: { onFinish: (score: number, total: number) => void }) {
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  useEffect(() => {
    if (timeLeft <= 0) { onFinish(score, VOCAB_WORDS.length); return; }
    const id = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [timeLeft, score, onFinish]);

  const handleAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    const correct = idx === VOCAB_WORDS[qIdx].answer;
    if (correct) setScore(s => s + 1);
    setFeedback(correct ? 'correct' : 'wrong');
    setTimeout(() => {
      setFeedback(null);
      setSelected(null);
      if (qIdx + 1 >= VOCAB_WORDS.length) {
        onFinish(score + (correct ? 1 : 0), VOCAB_WORDS.length);
      } else {
        setQIdx(i => i + 1);
      }
    }, 900);
  };

  const q = VOCAB_WORDS[qIdx];
  const pct = (timeLeft / 120) * 100;
  const color = pct > 50 ? '#10b981' : pct > 25 ? '#f59e0b' : '#ef4444';

  return (
    <div className="flex flex-col gap-6 max-w-lg mx-auto">
      {/* Timer bar */}
      <div>
        <div className="flex justify-between mb-2">
          <span className="text-xs font-bold text-on-surface-variant">Q {qIdx + 1} / {VOCAB_WORDS.length}</span>
          <span className="text-sm font-black" style={{ color, fontVariantNumeric: 'tabular-nums' }}>
            {String(Math.floor(timeLeft / 60)).padStart(2,'0')}:{String(timeLeft % 60).padStart(2,'0')}
          </span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <motion.div animate={{ width: `${pct}%` }} transition={{ duration: 0.5 }}
            style={{ height: '100%', borderRadius: 999, background: `linear-gradient(90deg, ${color}88, ${color})` }} />
        </div>
      </div>

      {/* Score */}
      <div className="text-center">
        <AnimatePresence mode="wait">
          <motion.div key={qIdx} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.35 }}>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">What does this word mean?</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-2"
              style={{ background: 'linear-gradient(135deg,#f59e0b,#f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {q.word}
            </h2>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {q.options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrect = i === q.answer;
          const showResult = selected !== null;
          return (
            <motion.button key={i} onClick={() => handleAnswer(i)} whileTap={{ scale: 0.97 }}
              disabled={selected !== null}
              className="p-4 rounded-2xl text-left text-sm font-bold transition-all border"
              style={{
                background: showResult
                  ? isCorrect ? 'rgba(16,185,129,0.15)' : isSelected ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.03)'
                  : 'rgba(255,255,255,0.04)',
                border: `1px solid ${showResult
                  ? isCorrect ? 'rgba(16,185,129,0.4)' : isSelected ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.07)'
                  : 'rgba(255,255,255,0.08)'}`,
                color: showResult
                  ? isCorrect ? '#34d399' : isSelected ? '#f87171' : '#475569'
                  : 'var(--color-on-surface)',
                cursor: selected !== null ? 'default' : 'pointer',
              }}>
              <span className="text-xs font-black mr-2 opacity-50">{['A','B','C','D'][i]}</span>
              {opt}
            </motion.button>
          );
        })}
      </div>

      {/* Feedback badge */}
      <AnimatePresence>
        {feedback && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="text-center py-3 rounded-2xl font-black text-sm"
            style={{
              background: feedback === 'correct' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
              border: `1px solid ${feedback === 'correct' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
              color: feedback === 'correct' ? '#34d399' : '#f87171',
            }}>
            {feedback === 'correct' ? '✓ Correct! +10 XP' : '✗ Not quite — keep going!'}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Grammar Battle Game ──────────────────────────────────────────────────────

function GrammarBattleGame({ onFinish }: { onFinish: (score: number, total: number) => void }) {
  const [qIdx, setQIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180);
  const [score, setScore] = useState(0);
  const [input, setInput] = useState('');
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);

  useEffect(() => {
    if (timeLeft <= 0) { onFinish(score, GRAMMAR_SENTENCES.length); return; }
    const id = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [timeLeft, score, onFinish]);

  const q = GRAMMAR_SENTENCES[qIdx];

  const handleSubmit = () => {
    const correct = input.trim().toLowerCase() === q.fixed.toLowerCase();
    if (correct) setScore(s => s + 1);
    setResult(correct ? 'correct' : 'wrong');
    setTimeout(() => {
      setResult(null);
      setInput('');
      if (qIdx + 1 >= GRAMMAR_SENTENCES.length) {
        onFinish(score + (correct ? 1 : 0), GRAMMAR_SENTENCES.length);
      } else {
        setQIdx(i => i + 1);
      }
    }, 1500);
  };

  const pct = (timeLeft / 180) * 100;
  const color = pct > 50 ? '#6366f1' : pct > 25 ? '#f59e0b' : '#ef4444';

  return (
    <div className="flex flex-col gap-6 max-w-xl mx-auto">
      <div>
        <div className="flex justify-between mb-2">
          <span className="text-xs font-bold text-on-surface-variant">Sentence {qIdx + 1} / {GRAMMAR_SENTENCES.length}</span>
          <span className="text-sm font-black" style={{ color, fontVariantNumeric: 'tabular-nums' }}>
            {String(Math.floor(timeLeft / 60)).padStart(2,'0')}:{String(timeLeft % 60).padStart(2,'0')}
          </span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <motion.div animate={{ width: `${pct}%` }} style={{ height: '100%', borderRadius: 999, background: `linear-gradient(90deg, ${color}88, ${color})` }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={qIdx} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
          className="space-y-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#ef4444' }}>Fix the error in this sentence:</p>
            <div className="p-5 rounded-2xl text-base font-bold leading-relaxed"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5' }}>
              {q.broken}
            </div>
            <p className="text-xs mt-2" style={{ color: '#475569' }}>Error type: <span style={{ color: '#64748b', fontWeight: 700 }}>{q.error}</span></p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#6366f1' }}>Type the corrected sentence:</p>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type the corrected sentence here…"
              rows={2}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
              className="w-full p-4 rounded-2xl text-sm font-medium resize-none outline-none transition-all"
              style={{
                background: 'rgba(255,255,255,0.04)', border: `1px solid ${result === 'correct' ? 'rgba(16,185,129,0.4)' : result === 'wrong' ? 'rgba(239,68,68,0.4)' : 'rgba(99,102,241,0.25)'}`,
                color: 'var(--color-on-surface)', lineHeight: 1.6,
              }}
            />
          </div>

          <AnimatePresence>
            {result && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="p-4 rounded-2xl text-sm font-bold"
                style={{
                  background: result === 'correct' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                  border: `1px solid ${result === 'correct' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
                  color: result === 'correct' ? '#34d399' : '#f87171',
                }}>
                {result === 'correct' ? '✓ Perfect! Great grammar control.' : `✗ Correct: "${q.fixed}"`}
              </motion.div>
            )}
          </AnimatePresence>

          <button onClick={handleSubmit}
            className="w-full py-3.5 rounded-2xl font-black text-sm text-white flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', cursor: 'pointer' }}>
            <Check size={15} /> Submit Answer
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── Word Memory Game ─────────────────────────────────────────────────────────

function WordMemoryGame({ onFinish }: { onFinish: (score: number, total: number) => void }) {
  const allCards = [...MEMORY_PAIRS.map((p, i) => ({ id: `w${i}`, text: p.word, pairId: i, type: 'word' as const })),
                   ...MEMORY_PAIRS.map((p, i) => ({ id: `m${i}`, text: p.meaning, pairId: i, type: 'meaning' as const }))];
  const [cards] = useState(() => [...allCards].sort(() => Math.random() - 0.5));
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(120);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (timeLeft <= 0 || matched.length === allCards.length) {
      onFinish(matched.length / 2, MEMORY_PAIRS.length);
    }
    if (timeLeft <= 0) return;
    const id = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [timeLeft, matched.length, allCards.length, onFinish]);

  useEffect(() => {
    if (flipped.length === 2) {
      setAttempts(a => a + 1);
      const [a, b] = flipped.map(id => cards.find(c => c.id === id)!);
      if (a.pairId === b.pairId && a.type !== b.type) {
        setMatched(m => [...m, a.id, b.id]);
        setFlipped([]);
      } else {
        const t = setTimeout(() => setFlipped([]), 900);
        return () => clearTimeout(t);
      }
    }
  }, [flipped, cards]);

  const flip = (id: string) => {
    if (flipped.length === 2 || flipped.includes(id) || matched.includes(id)) return;
    setFlipped(f => [...f, id]);
  };

  return (
    <div className="flex flex-col gap-5 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-on-surface-variant">{matched.length / 2} / {MEMORY_PAIRS.length} matched · {attempts} attempts</span>
        <span className="text-sm font-black" style={{ color: timeLeft > 60 ? '#10b981' : '#f59e0b', fontVariantNumeric: 'tabular-nums' }}>
          {String(Math.floor(timeLeft / 60)).padStart(2,'0')}:{String(timeLeft % 60).padStart(2,'0')}
        </span>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {cards.map(card => {
          const isFlipped = flipped.includes(card.id) || matched.includes(card.id);
          const isMatched = matched.includes(card.id);
          return (
            <motion.button key={card.id} onClick={() => flip(card.id)} whileTap={{ scale: 0.95 }}
              className="aspect-square rounded-2xl p-3 text-xs font-bold text-center flex items-center justify-center leading-snug cursor-pointer border transition-all"
              style={{
                background: isMatched ? 'rgba(16,185,129,0.12)' : isFlipped ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${isMatched ? 'rgba(16,185,129,0.35)' : isFlipped ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.07)'}`,
                color: isMatched ? '#34d399' : isFlipped ? '#818cf8' : '#334155',
                boxShadow: isMatched ? '0 0 16px rgba(16,185,129,0.2)' : 'none',
              }}>
              {isFlipped ? card.text : '?'}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Speed Typing Game ────────────────────────────────────────────────────────

const TYPING_PHRASES = [
  'The impact of globalisation on cultural diversity is significant.',
  'Technology has fundamentally transformed modern communication.',
  'Environmental sustainability requires immediate collective action.',
  'Education plays a crucial role in reducing social inequality.',
  'Remote work has revolutionised professional productivity globally.',
];

function SpeedTypingGame({ onFinish }: { onFinish: (score: number, total: number) => void }) {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [input, setInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(120);
  const [score, setScore] = useState(0);
  const [wpm, setWpm] = useState(0);
  const startRef = useRef<number>(Date.now());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, [phraseIdx]);

  useEffect(() => {
    if (timeLeft <= 0) { onFinish(score, TYPING_PHRASES.length); return; }
    const id = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [timeLeft, score, onFinish]);

  const phrase = TYPING_PHRASES[phraseIdx];

  const handleChange = (val: string) => {
    setInput(val);
    const words = val.trim().split(/\s+/).length;
    const mins = (Date.now() - startRef.current) / 60000;
    setWpm(Math.round(words / Math.max(mins, 0.01)));
    if (val === phrase) {
      setScore(s => s + 1);
      setInput('');
      startRef.current = Date.now();
      if (phraseIdx + 1 >= TYPING_PHRASES.length) {
        onFinish(score + 1, TYPING_PHRASES.length);
      } else {
        setPhraseIdx(i => i + 1);
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold text-on-surface-variant">Phrase {phraseIdx + 1}/{TYPING_PHRASES.length}</span>
          <span className="px-2 py-0.5 rounded-lg text-xs font-black" style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444' }}>
            {wpm} WPM
          </span>
        </div>
        <span className="text-sm font-black" style={{ color: timeLeft > 60 ? '#ef4444' : '#f59e0b', fontVariantNumeric: 'tabular-nums' }}>
          {String(Math.floor(timeLeft / 60)).padStart(2,'0')}:{String(timeLeft % 60).padStart(2,'0')}
        </span>
      </div>

      {/* Phrase display with character coloring */}
      <div className="p-6 rounded-2xl text-lg font-mono leading-relaxed"
        style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
        {phrase.split('').map((char, i) => {
          const typed = input[i];
          const color = typed === undefined ? '#475569' : typed === char ? '#34d399' : '#f87171';
          return <span key={i} style={{ color, fontWeight: typed !== undefined ? 700 : 400 }}>{char}</span>;
        })}
      </div>

      <input
        ref={inputRef}
        value={input}
        onChange={e => handleChange(e.target.value)}
        placeholder="Start typing…"
        className="w-full p-4 rounded-2xl text-base outline-none"
        style={{
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(239,68,68,0.3)',
          color: 'var(--color-on-surface)', fontFamily: 'monospace',
        }}
      />
      <p className="text-center text-xs text-on-surface-variant">Score so far: <strong style={{ color: '#ef4444' }}>{score} phrases</strong></p>
    </div>
  );
}

// ─── Listening Snap Game ──────────────────────────────────────────────────────

const SNAP_WORDS = [
  { display: "Choose the word you'd hear in formal IELTS context:", options: ['Gonna', 'Going to', 'Gunna', 'Goin'], answer: 1 },
  { display: 'Which sounds most academic?', options: ['Lots of', 'A significant amount of', 'A ton of', 'Heaps'], answer: 1 },
  { display: 'Select the correct pronunciation marker:', options: ['ECOnomy', 'ecoNOmy', 'eCONomy', 'econoMY'], answer: 2 },
  { display: 'Which phrase fits IELTS Academic Writing Task 2?', options: ['I think this is bad', 'This has a negative impact', 'This is super bad', 'People hate it'], answer: 1 },
  { display: 'Identify the linking device:', options: ['Also', 'Furthermore', 'And then', 'Plus'], answer: 1 },
];

function ListeningSnapGame({ onFinish }: { onFinish: (score: number, total: number) => void }) {
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(150);

  useEffect(() => {
    if (timeLeft <= 0) { onFinish(score, SNAP_WORDS.length); return; }
    const id = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [timeLeft, score, onFinish]);

  const q = SNAP_WORDS[qIdx];
  const handleAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    const correct = idx === q.answer;
    if (correct) setScore(s => s + 1);
    setTimeout(() => {
      setSelected(null);
      if (qIdx + 1 >= SNAP_WORDS.length) { onFinish(score + (correct ? 1 : 0), SNAP_WORDS.length); }
      else setQIdx(i => i + 1);
    }, 900);
  };

  const pct = (timeLeft / 150) * 100;

  return (
    <div className="flex flex-col gap-6 max-w-lg mx-auto">
      <div>
        <div className="flex justify-between mb-2">
          <span className="text-xs font-bold text-on-surface-variant">Q {qIdx + 1}/{SNAP_WORDS.length}</span>
          <span className="text-sm font-black" style={{ color: '#0ea5e9', fontVariantNumeric: 'tabular-nums' }}>
            {String(Math.floor(timeLeft / 60)).padStart(2,'0')}:{String(timeLeft % 60).padStart(2,'0')}
          </span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <motion.div animate={{ width: `${pct}%` }} style={{ height: '100%', borderRadius: 999, background: 'linear-gradient(90deg,rgba(14,165,233,0.5),#0ea5e9)' }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={qIdx} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          className="space-y-5">
          <div className="p-5 rounded-2xl text-center" style={{ background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.2)' }}>
            <Volume2 size={22} className="mx-auto mb-3" style={{ color: '#0ea5e9' }} />
            <p className="text-sm font-bold" style={{ color: '#7dd3fc' }}>{q.display}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {q.options.map((opt, i) => {
              const isSelected = selected === i;
              const isCorrect = i === q.answer;
              const show = selected !== null;
              return (
                <motion.button key={i} onClick={() => handleAnswer(i)} whileTap={{ scale: 0.97 }}
                  className="p-4 rounded-2xl text-sm font-bold text-center border"
                  style={{
                    background: show ? isCorrect ? 'rgba(16,185,129,0.15)' : isSelected ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${show ? isCorrect ? 'rgba(16,185,129,0.4)' : isSelected ? 'rgba(239,68,68,0.35)' : 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.08)'}`,
                    color: show ? isCorrect ? '#34d399' : isSelected ? '#f87171' : '#475569' : 'var(--color-on-surface)',
                    cursor: selected !== null ? 'default' : 'pointer',
                  }}>
                  {opt}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── Result Screen ────────────────────────────────────────────────────────────

function ResultScreen({ score, total, game, xp, onRetry, onBack }: {
  score: number; total: number; game: typeof GAMES[0]; xp: number;
  onRetry: () => void; onBack: () => void;
}) {
  const pct = Math.round((score / total) * 100);
  const grade = pct >= 90 ? { label: 'Outstanding!', color: '#10b981' }
    : pct >= 70 ? { label: 'Great Work!', color: '#6366f1' }
    : pct >= 50 ? { label: 'Good Effort!', color: '#f59e0b' }
    : { label: 'Keep Practising!', color: '#64748b' };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center gap-8 py-12 max-w-sm mx-auto text-center">
      {/* Trophy */}
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}>
        <div style={{
          width: 100, height: 100, borderRadius: '50%',
          background: `radial-gradient(circle, ${game.color}30 0%, ${game.color}10 100%)`,
          border: `2px solid ${game.color}50`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 0 40px ${game.color}30`,
        }}>
          <Trophy size={44} style={{ color: game.color }} />
        </div>
      </motion.div>

      <div>
        <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="text-3xl font-black mb-1" style={{ color: grade.color }}>
          {grade.label}
        </motion.h2>
        <p className="text-on-surface-variant text-sm">{game.title} complete</p>
      </div>

      {/* Score ring */}
      <div style={{ position: 'relative', width: 140, height: 140 }}>
        <svg width={140} height={140} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={70} cy={70} r={60} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={10} />
          <motion.circle cx={70} cy={70} r={60} fill="none" stroke={game.color} strokeWidth={10}
            strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 60}`}
            initial={{ strokeDashoffset: 2 * Math.PI * 60 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 60 * (1 - pct / 100) }}
            transition={{ delay: 0.4, duration: 1.2, ease: 'easeOut' }}
          />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span className="text-3xl font-black" style={{ color: game.color }}>{score}/{total}</span>
          <span className="text-xs font-bold text-on-surface-variant">correct</span>
        </div>
      </div>

      {/* XP badge */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
        className="flex items-center gap-2 px-5 py-2.5 rounded-full font-black text-sm"
        style={{ background: `${game.color}15`, border: `1px solid ${game.color}30`, color: game.color }}>
        <Star size={14} fill={game.color} />
        +{Math.round(xp * (pct / 100))} XP earned
      </motion.div>

      <div className="flex gap-3 w-full">
        <button onClick={onRetry} className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-black border"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--color-on-surface)', cursor: 'pointer' }}>
          <RotateCcw size={14} /> Retry
        </button>
        <button onClick={onBack} className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-black text-white"
          style={{ background: `linear-gradient(135deg, ${game.color}, #8b5cf6)`, border: 'none', cursor: 'pointer' }}>
          <ArrowRight size={14} /> Next Game
        </button>
      </div>
    </motion.div>
  );
}

// ─── Active Game Shell ────────────────────────────────────────────────────────

function ActiveGame({ game, onBack }: { game: typeof GAMES[0]; onBack: () => void }) {
  const [result, setResult] = useState<{ score: number; total: number } | null>(null);
  const [key, setKey] = useState(0);

  const handleFinish = (score: number, total: number) => setResult({ score, total });
  const handleRetry = () => { setResult(null); setKey(k => k + 1); };

  return (
    <div className="min-h-screen pb-10">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-8">
        <button onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--color-on-surface-variant)', cursor: 'pointer' }}>
          ← Back
        </button>
        <div>
          <div className="flex items-center gap-2">
            <game.icon size={15} style={{ color: game.color }} />
            <h2 className="text-lg font-black text-on-surface">{game.title}</h2>
          </div>
          <p className="text-xs text-on-surface-variant">{game.subtitle}</p>
        </div>
        <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black"
          style={{ background: `${game.color}15`, color: game.color, border: `1px solid ${game.color}25` }}>
          <Star size={11} /> {game.xp} XP
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {result ? (
          <ResultScreen key="result" score={result.score} total={result.total} game={game} xp={game.xp} onRetry={handleRetry} onBack={onBack} />
        ) : (
          <motion.div key={`game-${key}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {game.id === 'vocab-race'    && <VocabRaceGame    key={key} onFinish={handleFinish} />}
            {game.id === 'grammar-battle'&& <GrammarBattleGame key={key} onFinish={handleFinish} />}
            {game.id === 'word-memory'   && <WordMemoryGame    key={key} onFinish={handleFinish} />}
            {game.id === 'speed-type'    && <SpeedTypingGame   key={key} onFinish={handleFinish} />}
            {game.id === 'listening-snap'&& <ListeningSnapGame key={key} onFinish={handleFinish} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Games Lobby ──────────────────────────────────────────────────────────────

const LEADERBOARD = [
  { name: 'Priya S.',  xp: 1240, streak: 14, avatar: 'PS', color: '#6366f1' },
  { name: 'Ahmed R.',  xp: 1105, streak: 9,  avatar: 'AR', color: '#10b981' },
  { name: 'You',       xp:  870, streak: 5,  avatar: 'ME', color: '#f59e0b', isMe: true },
  { name: 'Mei Z.',    xp:  730, streak: 3,  avatar: 'MZ', color: '#0ea5e9' },
];

function GamesLobby({ onSelect }: { onSelect: (game: typeof GAMES[0]) => void }) {
  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider"
            style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)', color: '#fbbf24' }}>
            <Flame size={10} /> Games Arcade
          </span>
          <span className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#64748b' }}>
            5 Games Available
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-on-surface mb-2">
          Learn Through <span style={{ background: 'linear-gradient(135deg,#f59e0b,#ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Play</span>
        </h1>
        <p className="text-sm text-on-surface-variant max-w-md leading-relaxed">
          Gamified exercises that build real vocabulary, grammar, and listening skills. Each game session earns XP toward your streak.
        </p>
      </motion.div>

      {/* XP + Streak bar */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-5"
        style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(239,68,68,0.06))', border: '1px solid rgba(245,158,11,0.2)' }}>
        {[
          { label: 'Total XP', val: '870', icon: Star, color: '#f59e0b' },
          { label: 'Day Streak', val: '5 🔥', icon: Flame, color: '#ef4444' },
          { label: 'Games Won', val: '23', icon: Trophy, color: '#10b981' },
          { label: 'Rank', val: '#3', icon: Award, color: '#8b5cf6' },
        ].map(s => (
          <div key={s.label} className="flex items-center gap-3 flex-1">
            <div style={{ width: 38, height: 38, borderRadius: 11, background: `${s.color}18`, border: `1px solid ${s.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <s.icon size={16} style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-lg font-black text-on-surface leading-none">{s.val}</p>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Game cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {GAMES.map((game, i) => (
          <motion.div key={game.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 + i * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
            <button
              onClick={() => !game.locked && onSelect(game)}
              disabled={game.locked}
              className="w-full text-left p-6 rounded-2xl border transition-all group relative overflow-hidden"
              style={{
                background: game.locked ? 'rgba(255,255,255,0.02)' : game.bg,
                border: `1px solid ${game.locked ? 'rgba(255,255,255,0.05)' : game.border}`,
                opacity: game.locked ? 0.55 : 1,
                cursor: game.locked ? 'not-allowed' : 'pointer',
                transition: 'all 0.22s ease',
              }}
              onMouseEnter={e => { if (!game.locked) (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px ${game.glow}`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
            >
              {/* Tag */}
              <div className="absolute top-4 right-4">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black"
                  style={{ background: game.locked ? 'rgba(255,255,255,0.06)' : `${game.color}20`, color: game.locked ? '#334155' : game.color }}>
                  {game.locked ? '🔒 Pro' : game.tag}
                </span>
              </div>

              <div style={{ width: 46, height: 46, borderRadius: 14, background: `${game.color}18`, border: `1px solid ${game.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <game.icon size={20} style={{ color: game.color }} />
              </div>

              <h3 className="text-base font-black text-on-surface mb-1">{game.title}</h3>
              <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">{game.subtitle}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-[10px] font-bold text-on-surface-variant">
                    <Clock size={10} /> {game.duration}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-bold" style={{ color: game.color }}>
                    <Star size={10} /> {game.xp} XP
                  </span>
                </div>
                {!game.locked && (
                  <div className="flex items-center gap-1 text-xs font-black" style={{ color: game.color }}>
                    Play <ChevronRight size={13} />
                  </div>
                )}
              </div>
            </button>
          </motion.div>
        ))}
      </div>

      {/* Leaderboard */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="p-6 rounded-2xl"
        style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-2 mb-5">
          <Trophy size={14} style={{ color: '#f59e0b' }} />
          <h3 className="text-sm font-black text-on-surface">Weekly Leaderboard</h3>
        </div>
        <div className="flex flex-col gap-3">
          {LEADERBOARD.map((u, i) => (
            <div key={u.name} className="flex items-center gap-3 p-3 rounded-xl"
              style={{ background: (u as any).isMe ? 'rgba(245,158,11,0.08)' : 'rgba(255,255,255,0.02)', border: `1px solid ${(u as any).isMe ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.05)'}` }}>
              <span className="text-sm font-black w-5 text-center" style={{ color: i === 0 ? '#fbbf24' : i === 1 ? '#94a3b8' : '#64748b' }}>
                {i + 1}
              </span>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: `linear-gradient(135deg, ${u.color}, #8b5cf6)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900, color: '#fff', flexShrink: 0 }}>
                {u.avatar}
              </div>
              <span className="flex-1 text-sm font-bold text-on-surface">{u.name} {(u as any).isMe && <span style={{ color: '#f59e0b', fontSize: 10, fontWeight: 900 }}>(You)</span>}</span>
              <div className="flex items-center gap-2 text-right">
                <span className="text-xs font-black" style={{ color: '#f59e0b' }}>{u.xp} XP</span>
                <span className="text-[10px] text-on-surface-variant">🔥 {u.streak}d</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ─── Page Root ────────────────────────────────────────────────────────────────

export default function GamesPage() {
  const [activeGame, setActiveGame] = useState<typeof GAMES[0] | null>(null);
  if (activeGame) return <ActiveGame game={activeGame} onBack={() => setActiveGame(null)} />;
  return <GamesLobby onSelect={setActiveGame} />;
}
