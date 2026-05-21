'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useAnimationFrame } from 'framer-motion';
import {
  Mic2, Clock, Target, CheckCircle2, ChevronRight, Sparkles,
  MessageSquare, Play, Pause, RotateCcw, TrendingUp, X,
  Volume2, BarChart2, Brain, Star, ArrowRight, Zap,
  Maximize2, Minimize2, SkipForward, BookOpen, Flame,
  MicOff, CheckCircle, AlertTriangle, Lightbulb, Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Data ────────────────────────────────────────────────────────────────────

const DAILY_TOPIC = {
  title: 'The Impact of Technology on Human Connection',
  difficulty: 'Band 7–8',
  duration: '12 min',
  vocabFocus: ['interconnected', 'alienation', 'paradoxically', 'fostered', 'superficial'],
  grammarFocus: 'Present perfect + contrast clauses ("While technology has…, it has also…")',
  tutorIntro: "Today we'll explore how technology shapes our social bonds — a rich IELTS topic that tests your ability to discuss abstract ideas with nuance.",
  part: 'Part 3 Discussion',
  icon: '🌐',
};

const PARTS = [
  {
    id: 1, title: 'Part 1', subtitle: 'Introduction & Interview',
    desc: 'General questions on familiar topics — home, family, work, hobbies.',
    timing: '4–5 min', focus: 'Fluency', band: 6.5,
    color: '#10b981', glow: 'rgba(16,185,129,0.35)',
    questions: [
      'Tell me about your hometown. What do you like most about it?',
      'Do you work or are you a student? What do you enjoy about it?',
      'How do you usually spend your weekends?',
      'Do you enjoy cooking? Why or why not?',
    ],
  },
  {
    id: 2, title: 'Part 2', subtitle: 'Individual Long Turn',
    desc: 'Cue card topic — 1 min preparation, then speak for 1–2 minutes.',
    timing: '3–4 min', focus: 'Coherence', band: 6.0,
    color: '#6366f1', glow: 'rgba(99,102,241,0.35)',
    questions: [
      'Describe a memorable journey you have taken. You should say: where you went, who you went with, what you did there, and explain why it was so memorable.',
    ],
  },
  {
    id: 3, title: 'Part 3', subtitle: 'Two-Way Discussion',
    desc: 'Abstract discussion — analyze, speculate, and justify complex views.',
    timing: '4–5 min', focus: 'Critical Thinking', band: 5.5,
    color: '#8b5cf6', glow: 'rgba(139,92,246,0.35)',
    questions: [
      'Why do you think people travel to different countries nowadays?',
      'How has tourism changed over the past few decades?',
      'What impact does mass tourism have on local cultures?',
      'Do you think space tourism will ever become common? Why?',
    ],
  },
];

const CRITERIA = [
  { name: 'Fluency & Coherence', score: 6.5, color: '#10b981', tip: 'Speak at natural pace, avoid long pauses' },
  { name: 'Lexical Resource',    score: 6.0, color: '#6366f1', tip: 'Use varied and topic-specific vocabulary' },
  { name: 'Grammatical Range',   score: 5.5, color: '#8b5cf6', tip: 'Mix simple and complex sentence structures' },
  { name: 'Pronunciation',       score: 7.0, color: '#0ea5e9', tip: 'Clear phoneme production, natural intonation' },
];

const LIVE_HINTS = [
  { type: 'tip',      icon: Lightbulb, text: 'Try: "What I mean by that is…" to buy thinking time', color: '#6366f1' },
  { type: 'grammar',  icon: AlertTriangle, text: 'Use past tense here — "I went" not "I go"', color: '#f59e0b' },
  { type: 'vocab',    icon: Sparkles, text: 'Replace "good" → "beneficial" or "advantageous"', color: '#8b5cf6' },
  { type: 'praise',   icon: CheckCircle, text: 'Excellent use of a contrast clause!', color: '#10b981' },
  { type: 'pace',     icon: Volume2, text: 'Slow down slightly — clarity over speed', color: '#0ea5e9' },
  { type: 'filler',   icon: AlertTriangle, text: 'Avoid repeating "basically" — try "essentially"', color: '#f59e0b' },
  { type: 'praise',   icon: CheckCircle, text: 'Strong vocabulary choice: "interconnected"', color: '#10b981' },
  { type: 'tip',      icon: Lightbulb, text: 'Add a specific example to support your point', color: '#6366f1' },
];

// ─── AI Orb ───────────────────────────────────────────────────────────────────

type OrbState = 'idle' | 'listening' | 'thinking' | 'speaking';

function AIOrb({ state, partColor }: { state: OrbState; partColor: string }) {
  const ringScales = state === 'speaking' ? [1.15, 1.32, 1.52] : state === 'listening' ? [1.1, 1.22] : [1.08];
  const orbScale   = state === 'speaking' ? [1, 1.04, 0.98, 1.04, 1] : state === 'listening' ? [1, 1.02, 1] : [1, 1.015, 1];
  const orbDur     = state === 'speaking' ? 1.2 : 3.5;

  return (
    <div style={{ position: 'relative', width: 220, height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Outer glow rings */}
      {ringScales.map((s, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute', borderRadius: '50%',
            width: 220, height: 220,
            border: `1px solid ${partColor}`,
            opacity: 0,
          }}
          animate={{ scale: [1, s], opacity: [0.6, 0] }}
          transition={{ duration: 2.2, delay: i * 0.55, repeat: Infinity, ease: 'easeOut' }}
        />
      ))}

      {/* Static ambient glow */}
      <div style={{
        position: 'absolute', width: 260, height: 260, borderRadius: '50%',
        background: `radial-gradient(circle, ${partColor.replace(')', ',0.2)').replace('rgb', 'rgba')} 0%, transparent 70%)`,
        filter: 'blur(24px)',
        animation: 'orbGlow 4s ease-in-out infinite',
      }} />

      {/* Core orb */}
      <motion.div
        animate={{ scale: orbScale }}
        transition={{ duration: orbDur, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          width: 180, height: 180, borderRadius: '50%', position: 'relative', overflow: 'hidden',
          background: `conic-gradient(from 0deg, ${partColor}, #8b5cf6, #ec4899, #6366f1, ${partColor})`,
          boxShadow: `0 0 60px ${partColor.replace(')', ',0.5)').replace('rgb', 'rgba')}, 0 0 120px ${partColor.replace(')', ',0.25)').replace('rgb', 'rgba')}`,
        }}
      >
        {/* Shimmer layer */}
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            background: 'conic-gradient(from 0deg, transparent 0%, rgba(255,255,255,0.15) 30%, transparent 60%)',
          }}
        />
        {/* Inner highlight */}
        <div style={{
          position: 'absolute', top: '15%', left: '20%', width: '35%', height: '25%',
          borderRadius: '50%', background: 'rgba(255,255,255,0.25)', filter: 'blur(8px)',
        }} />
        {/* Center icon */}
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {state === 'thinking' ? (
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}>
              <Brain size={36} color="rgba(255,255,255,0.9)" />
            </motion.div>
          ) : state === 'listening' ? (
            <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 0.8, repeat: Infinity }}>
              <Mic2 size={36} color="rgba(255,255,255,0.9)" />
            </motion.div>
          ) : (
            <Sparkles size={36} color="rgba(255,255,255,0.9)" />
          )}
        </div>
      </motion.div>

      <style>{`
        @keyframes orbGlow { 0%,100%{opacity:0.6;transform:scale(1);} 50%{opacity:1;transform:scale(1.08);} }
      `}</style>
    </div>
  );
}

// ─── Waveform ─────────────────────────────────────────────────────────────────

function Waveform({ active, color }: { active: boolean; color: string }) {
  const bars = 48;
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, height: 64 }}>
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          animate={active ? {
            height: [4, Math.random() * 52 + 6, Math.random() * 36 + 4, 4],
            opacity: [0.4, 1, 0.7, 0.4],
          } : { height: 4, opacity: 0.25 }}
          transition={active ? {
            duration: 0.35 + (i % 7) * 0.06,
            repeat: Infinity,
            delay: i * 0.018,
            ease: 'easeInOut',
          } : { duration: 0.3 }}
          style={{
            width: 3, borderRadius: 999, minHeight: 4,
            background: active
              ? `linear-gradient(to top, ${color}88, ${color})`
              : 'rgba(100,116,139,0.3)',
          }}
        />
      ))}
    </div>
  );
}

// ─── Live Feedback Chip ───────────────────────────────────────────────────────

function FeedbackChip({ hint, onDismiss }: { hint: typeof LIVE_HINTS[0]; onDismiss: () => void }) {
  const Icon = hint.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.95 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 10,
        padding: '10px 14px', borderRadius: 14,
        background: `${hint.color}14`,
        border: `1px solid ${hint.color}30`,
        backdropFilter: 'blur(12px)',
        maxWidth: 340, cursor: 'pointer',
      }}
      onClick={onDismiss}
    >
      <Icon size={13} style={{ color: hint.color, flexShrink: 0, marginTop: 1 }} />
      <span style={{ fontSize: 12, fontWeight: 600, color: hint.color, lineHeight: 1.5 }}>{hint.text}</span>
    </motion.div>
  );
}

// ─── Immersive Session Mode ───────────────────────────────────────────────────

function ImmersiveSession({
  part, onExit,
}: { part: typeof PARTS[0]; onExit: () => void }) {
  const [orbState, setOrbState]       = useState<OrbState>('speaking');
  const [userSpeaking, setUserSpeaking] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [elapsed, setElapsed]          = useState(0);
  const [qIndex, setQIndex]            = useState(0);
  const [hints, setHints]              = useState<typeof LIVE_HINTS>([]);
  const [showScoring, setShowScoring]  = useState(false);
  const [phase, setPhase]              = useState<'ai-question' | 'user-answer' | 'ai-thinking' | 'feedback'>('ai-question');
  const containerRef = useRef<HTMLDivElement>(null);

  // Timer
  useEffect(() => {
    const id = setInterval(() => setElapsed(s => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  // AI question sequence — auto-advance through phases
  useEffect(() => {
    if (phase === 'ai-question') {
      const t = setTimeout(() => setPhase('user-answer'), 3500);
      return () => clearTimeout(t);
    }
    if (phase === 'ai-thinking') {
      setOrbState('thinking');
      const t = setTimeout(() => {
        setOrbState('speaking');
        setPhase('feedback');
      }, 2000);
      return () => clearTimeout(t);
    }
    if (phase === 'feedback') {
      const t = setTimeout(() => {
        setHints([]);
        setPhase('ai-question');
        setQIndex(i => (i + 1) % part.questions.length);
      }, 5000);
      return () => clearTimeout(t);
    }
  }, [phase, part.questions.length]);

  useEffect(() => {
    setOrbState(
      phase === 'ai-question'  ? 'speaking'  :
      phase === 'user-answer'  ? 'listening' :
      phase === 'ai-thinking'  ? 'thinking'  : 'speaking'
    );
    setUserSpeaking(phase === 'user-answer');
  }, [phase]);

  // Spawn random hints while user is speaking
  useEffect(() => {
    if (phase !== 'user-answer') return;
    const id = setInterval(() => {
      if (hints.length >= 2) return;
      const h = LIVE_HINTS[Math.floor(Math.random() * LIVE_HINTS.length)];
      setHints(prev => [...prev.slice(-1), h]);
    }, 3500);
    return () => clearInterval(id);
  }, [phase, hints.length]);

  const handleMic = () => {
    if (phase === 'user-answer') {
      setPhase('ai-thinking');
      setHints([]);
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      containerRef.current?.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
    setIsFullscreen(f => !f);
  };

  const phaseLabel =
    phase === 'ai-question'  ? 'AI Examiner is speaking…' :
    phase === 'user-answer'  ? 'Your turn — speak now'    :
    phase === 'ai-thinking'  ? 'AI is evaluating…'        :
                               'AI feedback';

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: '#03070f',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Ambient gradient */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse 60% 50% at 50% 40%, ${part.color}18 0%, transparent 70%)`,
      }} />

      {/* ── Top bar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 28px', position: 'relative', zIndex: 1,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            padding: '4px 12px', borderRadius: 999,
            background: `${part.color}20`, border: `1px solid ${part.color}40`,
            fontSize: 11, fontWeight: 800, color: part.color, letterSpacing: '0.08em',
          }}>
            {part.title} · {part.subtitle}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444', animation: 'pulse 1.5s ease-in-out infinite' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#ef4444' }}>LIVE</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Clock size={13} style={{ color: '#64748b' }} />
            <span style={{ fontSize: 14, fontWeight: 800, color: '#94a3b8', fontVariantNumeric: 'tabular-nums' }}>{fmt(elapsed)}</span>
          </div>
          <button onClick={() => setShowScoring(s => !s)} style={{
            width: 34, height: 34, borderRadius: 10,
            background: showScoring ? `${part.color}25` : 'rgba(255,255,255,0.05)',
            border: `1px solid ${showScoring ? part.color + '40' : 'rgba(255,255,255,0.08)'}`,
            color: showScoring ? part.color : '#64748b',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
            <BarChart2 size={15} />
          </button>
          <button onClick={toggleFullscreen} style={{
            width: 34, height: 34, borderRadius: 10, cursor: 'pointer',
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
            color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
          <button onClick={onExit} style={{
            width: 34, height: 34, borderRadius: 10, cursor: 'pointer',
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
            color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <X size={15} />
          </button>
        </div>
      </div>

      {/* ── Main area ── */}
      <div style={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden' }}>

        {/* Center stage */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 32, padding: '24px 20px',
          position: 'relative',
        }}>

          {/* Phase label */}
          <motion.div
            key={phaseLabel}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              padding: '6px 18px', borderRadius: 999,
              background: phase === 'user-answer' ? 'rgba(239,68,68,0.12)' : `${part.color}15`,
              border: `1px solid ${phase === 'user-answer' ? 'rgba(239,68,68,0.25)' : part.color + '30'}`,
              fontSize: 11, fontWeight: 800,
              color: phase === 'user-answer' ? '#ef4444' : part.color,
              letterSpacing: '0.07em', textTransform: 'uppercase',
            }}
          >
            {phaseLabel}
          </motion.div>

          {/* AI Orb */}
          <AIOrb state={orbState} partColor={part.color} />

          {/* Question / transcript */}
          <AnimatePresence mode="wait">
            <motion.div
              key={qIndex + phase}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{
                maxWidth: 600, textAlign: 'center',
                padding: '20px 28px', borderRadius: 20,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                backdropFilter: 'blur(16px)',
              }}
            >
              {phase === 'feedback' ? (
                <>
                  <p style={{ fontSize: 11, fontWeight: 800, color: part.color, marginBottom: 10, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    AI Tutor Feedback
                  </p>
                  <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.7, margin: 0 }}>
                    Good attempt! Your fluency was natural. Try expanding your vocabulary — instead of "it was very good", say "it was remarkably enriching". Watch for filler words too.
                  </p>
                </>
              ) : (
                <>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 10, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    {phase === 'user-answer' ? 'Respond to:' : 'Question'}
                  </p>
                  <p style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', lineHeight: 1.65, margin: 0 }}>
                    "{part.questions[qIndex]}"
                  </p>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Waveform */}
          <div style={{ width: '100%', maxWidth: 520 }}>
            <Waveform active={userSpeaking} color={part.color} />
          </div>

          {/* Live feedback chips */}
          <div style={{ position: 'absolute', bottom: 120, right: 24, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
            <AnimatePresence>
              {hints.map((h, i) => (
                <FeedbackChip
                  key={i + h.text}
                  hint={h}
                  onDismiss={() => setHints(prev => prev.filter((_, idx) => idx !== i))}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* ── Bottom controls ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, position: 'absolute', bottom: 32 }}>
            {/* Skip */}
            <button
              onClick={() => { setQIndex(i => (i + 1) % part.questions.length); setPhase('ai-question'); setHints([]); }}
              style={{
                width: 48, height: 48, borderRadius: '50%', cursor: 'pointer',
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
              title="Next question"
            >
              <SkipForward size={18} />
            </button>

            {/* Main mic button */}
            <button
              onClick={handleMic}
              disabled={phase === 'ai-question' || phase === 'ai-thinking'}
              style={{
                width: 72, height: 72, borderRadius: '50%', cursor: phase === 'user-answer' ? 'pointer' : 'default',
                background: phase === 'user-answer'
                  ? 'linear-gradient(135deg, #ef4444, #f97316)'
                  : `linear-gradient(135deg, ${part.color}, #8b5cf6)`,
                border: 'none', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: phase === 'user-answer'
                  ? '0 0 0 12px rgba(239,68,68,0.12), 0 8px 32px rgba(239,68,68,0.4)'
                  : `0 8px 32px ${part.color}50`,
                opacity: (phase === 'ai-question' || phase === 'ai-thinking') ? 0.4 : 1,
                transition: 'all 0.3s',
              }}
              title={phase === 'user-answer' ? 'Done speaking' : 'Waiting for AI…'}
            >
              {phase === 'user-answer' ? <MicOff size={26} /> : <Mic2 size={26} />}
            </button>

            {/* Reset */}
            <button
              onClick={() => { setPhase('ai-question'); setQIndex(0); setElapsed(0); setHints([]); }}
              style={{
                width: 48, height: 48, borderRadius: '50%', cursor: 'pointer',
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
              title="Restart"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>

        {/* ── Scoring panel (slide-in) ── */}
        <AnimatePresence>
          {showScoring && (
            <motion.div
              initial={{ x: 320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 320, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{
                width: 300, flexShrink: 0,
                background: 'rgba(9,13,26,0.95)',
                borderLeft: '1px solid rgba(255,255,255,0.07)',
                backdropFilter: 'blur(24px)',
                padding: 24, overflowY: 'auto',
                display: 'flex', flexDirection: 'column', gap: 20,
              }}
            >
              <div>
                <p style={{ fontSize: 11, fontWeight: 800, color: '#334155', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
                  Live Scoring
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {CRITERIA.map((c, i) => (
                    <div key={c.name}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b' }}>{c.name}</span>
                        <span style={{ fontSize: 12, fontWeight: 900, color: c.color }}>{c.score}</span>
                      </div>
                      <div style={{ height: 4, borderRadius: 999, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(c.score / 9) * 100}%` }}
                          transition={{ duration: 1, delay: i * 0.1, ease: 'easeOut' }}
                          style={{ height: '100%', borderRadius: 999, background: `linear-gradient(90deg, ${c.color}88, ${c.color})` }}
                        />
                      </div>
                      <p style={{ fontSize: 10, color: '#334155', marginTop: 4 }}>{c.tip}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Predicted band */}
              <div style={{
                padding: '16px 18px', borderRadius: 16,
                background: `linear-gradient(135deg, ${part.color}15, rgba(139,92,246,0.08))`,
                border: `1px solid ${part.color}30`,
              }}>
                <p style={{ fontSize: 10, fontWeight: 800, color: '#475569', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Predicted Band</p>
                <p style={{ fontSize: 34, fontWeight: 900, color: part.color, letterSpacing: '-0.04em', margin: 0 }}>6.2</p>
                <p style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>↑ +0.2 from last session</p>
              </div>

              {/* Recent feedback */}
              <div>
                <p style={{ fontSize: 11, fontWeight: 800, color: '#334155', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>AI Corrections</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { icon: CheckCircle, text: 'Good use of linking devices', color: '#10b981' },
                    { icon: AlertTriangle, text: 'Avoid "you know" as filler', color: '#f59e0b' },
                    { icon: Sparkles, text: 'Strong vocabulary: "interconnected"', color: '#8b5cf6' },
                  ].map((fb, i) => {
                    const FbIcon = fb.icon;
                    return (
                      <div key={i} style={{
                        display: 'flex', gap: 8, padding: '8px 10px', borderRadius: 10,
                        background: `${fb.color}0f`, border: `1px solid ${fb.color}20`,
                      }}>
                        <FbIcon size={12} style={{ color: fb.color, flexShrink: 0, marginTop: 1 }} />
                        <span style={{ fontSize: 11, color: fb.color, lineHeight: 1.5 }}>{fb.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }
      `}</style>
    </div>
  );
}

// ─── Daily Topic Card ─────────────────────────────────────────────────────────

function DailyTopicCard({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-[2rem] overflow-hidden p-7 md:p-9"
      style={{
        background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.08) 50%, rgba(236,72,153,0.06) 100%)',
        border: '1px solid rgba(99,102,241,0.25)',
      }}
    >
      {/* Ambient glow */}
      <div style={{ position: 'absolute', top: -60, right: -60, width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -40, left: '30%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-7">
        {/* Left */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-5 flex-wrap">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider"
              style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#818cf8' }}>
              <Flame size={10} /> AI Daily Topic
            </span>
            <span className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
              style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)', color: '#a78bfa' }}>
              {DAILY_TOPIC.part}
            </span>
            <span className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
              style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#34d399' }}>
              {DAILY_TOPIC.difficulty}
            </span>
          </div>
          <div className="flex items-start gap-4 mb-4">
            <span className="text-4xl leading-none mt-1 flex-shrink-0">{DAILY_TOPIC.icon}</span>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-tight"
              style={{ color: '#f1f5f9' }}>
              {DAILY_TOPIC.title}
            </h2>
          </div>
          <p className="text-sm leading-relaxed mb-5" style={{ color: '#64748b', maxWidth: 560 }}>
            {DAILY_TOPIC.tutorIntro}
          </p>

          {/* Focus chips */}
          <div className="flex flex-col sm:flex-row gap-4 mb-5">
            <div className="flex-1 p-3.5 rounded-2xl" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}>
              <p className="text-[10px] font-black uppercase tracking-wider mb-2" style={{ color: '#6366f1' }}>Vocabulary Focus</p>
              <div className="flex flex-wrap gap-1.5">
                {DAILY_TOPIC.vocabFocus.map(v => (
                  <span key={v} className="px-2 py-0.5 rounded-lg text-[11px] font-bold" style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8' }}>{v}</span>
                ))}
              </div>
            </div>
            <div className="flex-1 p-3.5 rounded-2xl" style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)' }}>
              <p className="text-[10px] font-black uppercase tracking-wider mb-2" style={{ color: '#8b5cf6' }}>Grammar Focus</p>
              <p className="text-[11px] leading-relaxed" style={{ color: '#a78bfa' }}>{DAILY_TOPIC.grammarFocus}</p>
            </div>
          </div>
        </div>

        {/* Right — CTA */}
        <div className="flex flex-col items-center gap-4 lg:items-end flex-shrink-0">
          <div className="text-center lg:text-right">
            <div className="flex items-center gap-2 mb-1 justify-center lg:justify-end">
              <Clock size={12} style={{ color: '#64748b' }} />
              <span className="text-xs font-bold" style={{ color: '#64748b' }}>{DAILY_TOPIC.duration}</span>
            </div>
            <p className="text-xs" style={{ color: '#334155' }}>Estimated session time</p>
          </div>
          <button
            onClick={onStart}
            className="flex items-center gap-2.5 px-7 py-4 rounded-2xl font-black text-sm text-white"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7)',
              boxShadow: '0 8px 32px rgba(99,102,241,0.45)',
              border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(99,102,241,0.55)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(99,102,241,0.45)'; }}
          >
            <Sparkles size={15} /> Start Today&apos;s Topic
          </button>
          <p className="text-[11px]" style={{ color: '#334155' }}>No login required to preview</p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Lobby (Part Selector) ────────────────────────────────────────────────────

function Lobby({ onStartSession }: { onStartSession: (part: typeof PARTS[0]) => void }) {
  const [hoveredPart, setHoveredPart] = useState<number | null>(null);

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-5"
      >
        <div>
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider"
              style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', color: '#34d399' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block', animation: 'pulse 1.8s ease-in-out infinite' }} />
              AI Speaking Lab
            </span>
            <span className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#64748b' }}>
              IELTS Standard
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight text-on-surface">
            Speaking<br />
            <span style={{ background: 'linear-gradient(135deg, #34d399, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Examiner Simulation
            </span>
          </h1>
          <p className="mt-2 text-sm text-on-surface-variant max-w-md leading-relaxed">
            Practice all 3 IELTS parts with an AI examiner. Get live pronunciation feedback, fluency scores, and band predictions.
          </p>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          {[{ val: '6.0', label: 'Avg Band', color: '#10b981' }, { val: '12', label: 'Sessions' }, { val: '+0.5', label: 'This Week', color: '#10b981' }].map(s => (
            <div key={s.label} className="p-4 rounded-2xl text-center min-w-[72px]"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <p className="text-xl font-black" style={{ color: s.color ?? 'var(--color-on-surface)' }}>{s.val}</p>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Daily topic card */}
      <DailyTopicCard onStart={() => onStartSession(PARTS[2])} />

      {/* Part cards */}
      <div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xs font-black uppercase tracking-wider text-on-surface-variant mb-4"
        >
          Or choose a specific part
        </motion.p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PARTS.map((part, i) => (
            <motion.button
              key={part.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => onStartSession(part)}
              onMouseEnter={() => setHoveredPart(part.id)}
              onMouseLeave={() => setHoveredPart(null)}
              className="w-full text-left p-6 rounded-2xl border transition-all group relative overflow-hidden"
              style={{
                background: hoveredPart === part.id ? `${part.color}0e` : 'rgba(255,255,255,0.025)',
                border: `1px solid ${hoveredPart === part.id ? part.color + '45' : 'rgba(255,255,255,0.07)'}`,
                boxShadow: hoveredPart === part.id ? `0 8px 32px ${part.color}20` : 'none',
                transition: 'all 0.25s ease',
                cursor: 'pointer',
              }}
            >
              {/* Glow when hovered */}
              {hoveredPart === part.id && (
                <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: '50%', background: `radial-gradient(circle, ${part.color}25 0%, transparent 70%)`, filter: 'blur(20px)', pointerEvents: 'none' }} />
              )}

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div style={{
                    width: 42, height: 42, borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: `${part.color}18`, border: `1px solid ${part.color}30`,
                  }}>
                    <Mic2 size={18} style={{ color: part.color }} />
                  </div>
                  <div style={{
                    padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 900,
                    color: part.color, background: `${part.color}15`, border: `1px solid ${part.color}25`,
                  }}>
                    Band {part.band}
                  </div>
                </div>

                <p style={{ fontSize: 13, fontWeight: 900, color: '#f1f5f9', marginBottom: 2 }}>{part.title}</p>
                <p style={{ fontSize: 11, fontWeight: 700, color: part.color, marginBottom: 8 }}>{part.subtitle}</p>
                <p style={{ fontSize: 11, color: '#475569', lineHeight: 1.6, marginBottom: 14 }}>{part.desc}</p>

                <div className="flex items-center gap-3">
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, color: '#475569' }}>
                    <Clock size={10} /> {part.timing}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, color: '#475569' }}>
                    <Target size={10} /> {part.focus}
                  </span>
                </div>

                {/* Band progress bar */}
                <div className="mt-4 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(part.band / 9) * 100}%` }}
                    transition={{ duration: 0.9, delay: 0.2 + i * 0.08 }}
                    style={{ height: '100%', borderRadius: 999, background: `linear-gradient(90deg, ${part.color}88, ${part.color})` }}
                  />
                </div>

                <div className="mt-4 flex items-center gap-1.5"
                  style={{ fontSize: 11, fontWeight: 800, color: hoveredPart === part.id ? part.color : '#475569', transition: 'color 0.2s' }}>
                  Start Practice <ChevronRight size={13} />
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* IELTS Scoring Criteria */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5 }}
        className="p-6 rounded-2xl"
        style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="flex items-center gap-2 mb-5">
          <BarChart2 size={14} style={{ color: '#6366f1' }} />
          <h3 className="text-sm font-black text-on-surface">Your Current IELTS Profile</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CRITERIA.map((c, i) => (
            <div key={c.name}>
              <div className="flex justify-between mb-2">
                <span className="text-xs font-bold text-on-surface-variant">{c.name}</span>
                <span className="text-xs font-black" style={{ color: c.color }}>{c.score}/9</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(c.score / 9) * 100}%` }}
                  transition={{ duration: 1, delay: 0.4 + i * 0.08 }}
                  style={{ height: '100%', borderRadius: 999, background: `linear-gradient(90deg, ${c.color}77, ${c.color})` }}
                />
              </div>
              <p className="text-[10px] text-on-surface-variant mt-1.5">{c.tip}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 pt-4 border-t border-outline-variant flex items-center justify-between">
          <span className="text-sm font-bold text-on-surface-variant">Overall Predicted Band</span>
          <span className="text-2xl font-black" style={{ color: '#10b981' }}>6.0 / 9</span>
        </div>
      </motion.div>

      <style>{`@keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.4;}}`}</style>
    </div>
  );
}

// ─── Page Root ────────────────────────────────────────────────────────────────

export default function SpeakingPage() {
  const [activePart, setActivePart] = useState<typeof PARTS[0] | null>(null);

  if (activePart) {
    return <ImmersiveSession part={activePart} onExit={() => setActivePart(null)} />;
  }

  return <Lobby onStartSession={setActivePart} />;
}
