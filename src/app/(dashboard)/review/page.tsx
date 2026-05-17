"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BrainCircuit,
  Sparkles,
  CheckCircle2,
  XCircle,
  Zap,
  Headphones,
  PenTool,
  Mic2,
  BookOpen,
  ChevronRight,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  Calendar,
  ArrowRight,
  Lightbulb,
  Volume2,
  Star,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: "easeOut" as const },
});

// ─── Data ────────────────────────────────────────────────────────────────────

const GRAMMAR_MISTAKES = [
  {
    id: 1,
    wrong: "I have been to London since two years.",
    correct: "I have been in London for two years.",
    concept: "Prepositions of Duration",
    skill: "Writing",
    frequency: 3,
    severity: "high" as const,
    explanation:
      "Use 'for' with durations (periods of time) and 'since' with specific starting points.",
  },
  {
    id: 2,
    wrong: "The data suggest that emissions has increased.",
    correct: "The data suggest that emissions have increased.",
    concept: "Subject-Verb Agreement",
    skill: "Writing",
    frequency: 2,
    severity: "high" as const,
    explanation:
      "'Emissions' is plural — it takes 'have', not 'has'. The noun closest to the verb determines agreement.",
  },
  {
    id: 3,
    wrong: "Despite of the rain, they continued.",
    correct: "Despite the rain, they continued.",
    concept: "Preposition Misuse",
    skill: "Speaking",
    frequency: 1,
    severity: "medium" as const,
    explanation:
      "'Despite' is a preposition itself — it does not take 'of'. Use 'in spite of' if you want to include 'of'.",
  },
];

const VOCAB_TO_REVIEW = [
  {
    id: 1,
    word: "Consequently",
    definition: "As a result; therefore",
    example: "He studied hard; consequently, he passed.",
    band: "B2",
    missed: true,
    collocations: ["consequently lead to", "as a consequence"],
  },
  {
    id: 2,
    word: "Albeit",
    definition: "Although; even though",
    example: "The plan worked, albeit slowly.",
    band: "C1",
    missed: false,
    collocations: ["albeit briefly", "albeit difficult"],
  },
  {
    id: 3,
    word: "Mitigate",
    definition: "To make less severe or serious",
    example: "Policies to mitigate climate change.",
    band: "C1",
    missed: true,
    collocations: ["mitigate risk", "mitigate the impact"],
  },
  {
    id: 4,
    word: "Proliferate",
    definition: "To increase rapidly in number",
    example: "Social media platforms have proliferated.",
    band: "C2",
    missed: false,
    collocations: ["proliferate rapidly", "continue to proliferate"],
  },
];

const PRONUNCIATION_ITEMS = [
  {
    phoneme: "/θ/",
    word: "through",
    issue: "Pronounced as /f/ — 'frough'",
    tip: "Place tongue between teeth for /θ/",
    severity: "high" as const,
  },
  {
    phoneme: "/ɪ/",
    word: "bit vs beat",
    issue: "Vowel confusion between short /ɪ/ and long /iː/",
    tip: "Relax your mouth for /ɪ/, tense for /iː/",
    severity: "medium" as const,
  },
];

const TOMORROW_RECS = [
  {
    icon: <PenTool size={18} />,
    skill: "Writing",
    color: "emerald",
    title: "Task 2 Essay Practice",
    reason: "Your coherence score dropped 12% — focus on paragraph linking.",
    duration: "40 min",
    priority: "high" as const,
  },
  {
    icon: <Mic2 size={18} />,
    skill: "Speaking",
    color: "orange",
    title: "Part 2 Long-turn Practice",
    reason: "You ran out of content in 1 min 10 sec — aim for 2 full minutes.",
    duration: "25 min",
    priority: "high" as const,
  },
  {
    icon: <BookOpen size={18} />,
    skill: "Vocabulary",
    color: "violet",
    title: "IELTS Band 7+ Word Drills",
    reason: "3 missed words from today's reading need spaced repetition review.",
    duration: "15 min",
    priority: "medium" as const,
  },
  {
    icon: <Headphones size={18} />,
    skill: "Listening",
    color: "blue",
    title: "Section 3 Academic Lectures",
    reason: "Accuracy fell to 62% on lecture-style recordings.",
    duration: "20 min",
    priority: "medium" as const,
  },
];

const SKILL_SCORES = [
  { label: "Listening", score: 88, prev: 85, icon: <Headphones size={16} />, color: "bg-blue-500" },
  { label: "Reading", score: 79, prev: 82, icon: <BookOpen size={16} />, color: "bg-emerald-500" },
  { label: "Writing", score: 72, prev: 74, icon: <PenTool size={16} />, color: "bg-orange-500" },
  { label: "Speaking", score: 76, prev: 71, icon: <Mic2 size={16} />, color: "bg-violet-500" },
];

const BAND_COLORS: Record<string, string> = {
  B1: "bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-400",
  B2: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400",
  C1: "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-400",
  C2: "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400",
};

const SEVERITY_CONFIG = {
  high: { label: "High Impact", cls: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10" },
  medium: { label: "Medium", cls: "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10" },
  low: { label: "Minor", cls: "text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/5" },
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default function DailyReviewPage() {
  const [activeVocab, setActiveVocab] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [expandedGrammar, setExpandedGrammar] = useState<number | null>(null);

  const totalMistakes = GRAMMAR_MISTAKES.length + PRONUNCIATION_ITEMS.length;
  const sessionsToday = 4;
  const retentionScore = 85;

  return (
    <div className="space-y-10 w-full pb-20">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <motion.section {...fadeUp(0)} className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-slate-100 dark:border-white/5 pb-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-bold uppercase tracking-widest">
              Daily Review
            </span>
            <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              AI-Powered Reflection
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            Performance Review
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
            Today&apos;s mistakes, patterns, and tomorrow&apos;s plan — all in one place.
          </p>
        </div>

        <div className="flex items-center gap-6 shrink-0">
          <div className="hidden sm:block text-right">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
              Streak
            </p>
            <div className="flex items-center gap-1.5 justify-end">
              <span className="text-2xl font-black text-slate-900 dark:text-white">12</span>
              <Zap size={18} className="text-orange-500 fill-orange-500" />
            </div>
          </div>
          <button className="primary-gradient text-white px-6 py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-indigo-200 dark:shadow-none active:scale-95 transition-transform flex items-center gap-2">
            <RefreshCw size={16} />
            Start Re-Study
          </button>
        </div>
      </motion.section>

      {/* ── AI Intelligence Card ─────────────────────────────────────────────── */}
      <motion.div {...fadeUp(0.05)} className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 dark:bg-white/5 border border-transparent dark:border-white/5 p-8 md:p-12 text-white shadow-2xl shadow-slate-200/60 dark:shadow-none">
        <div className="pointer-events-none absolute top-0 right-0 p-10 opacity-[0.04]">
          <BrainCircuit size={340} />
        </div>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
                <Sparkles size={20} className="text-indigo-400" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-60">
                AI Intelligence Summary
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
              Strong session — <span className="text-indigo-400 italic">3 patterns</span> need attention today.
            </h2>
            <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-xl">
              You retained <span className="text-white font-bold">{retentionScore}%</span> of this week&apos;s content. Preposition usage and subject-verb agreement are recurring weak points. We&apos;ve queued targeted drills for tomorrow.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <StatPill label="Mistakes" value={String(totalMistakes)} icon={<AlertTriangle size={12} />} color="rose" />
              <StatPill label="Sessions" value={String(sessionsToday)} icon={<Activity size={12} />} color="indigo" />
              <StatPill label="Retention" value={`${retentionScore}%`} icon={<TrendingUp size={12} />} color="emerald" />
            </div>
          </div>

          {/* Skill score mini bars */}
          <div className="lg:col-span-5 bg-white/5 rounded-[2rem] p-7 border border-white/10 space-y-5">
            <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-40">
              Today&apos;s Skill Scores
            </h4>
            {SKILL_SCORES.map((s) => {
              const delta = s.score - s.prev;
              return (
                <div key={s.label} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2 text-slate-300">
                      {s.icon}
                      <span className="font-medium">{s.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn("text-[10px] font-bold flex items-center gap-0.5", delta >= 0 ? "text-emerald-400" : "text-rose-400")}>
                        {delta >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                        {delta >= 0 ? "+" : ""}{delta}%
                      </span>
                      <span className="font-bold text-white">{s.score}%</span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${s.score}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className={cn("h-full rounded-full", s.color)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* ── Grammar Mistakes ─────────────────────────────────────────────────── */}
      <motion.section {...fadeUp(0.1)} className="space-y-5">
        <SectionHeader
          icon={<CheckCircle2 size={20} className="text-rose-500" />}
          title="Grammar Mistakes"
          subtitle={`${GRAMMAR_MISTAKES.length} errors detected today`}
          action="Review All"
        />

        <div className="space-y-4">
          {GRAMMAR_MISTAKES.map((item, i) => (
            <motion.div
              key={item.id}
              {...fadeUp(0.12 + i * 0.05)}
              className="bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-3xl p-6 shadow-sm hover:border-slate-200 dark:hover:border-white/10 transition-all cursor-pointer"
              onClick={() => setExpandedGrammar(expandedGrammar === item.id ? null : item.id)}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={cn("text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg", SEVERITY_CONFIG[item.severity].cls)}>
                    {SEVERITY_CONFIG[item.severity].label}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-slate-50 dark:bg-white/5 px-2.5 py-1 rounded-lg">
                    {item.concept}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    {item.skill} · ×{item.frequency}
                  </span>
                </div>
                <ChevronRight
                  size={16}
                  className={cn("text-slate-400 shrink-0 transition-transform", expandedGrammar === item.id && "rotate-90")}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 px-4 py-3 rounded-xl">
                  <XCircle size={16} className="text-rose-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-slate-500 dark:text-slate-400 italic">&quot;{item.wrong}&quot;</p>
                </div>
                <div className="flex items-start gap-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 px-4 py-3 rounded-xl">
                  <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">&quot;{item.correct}&quot;</p>
                </div>
              </div>

              <AnimatePresence>
                {expandedGrammar === item.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 flex items-start gap-3 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 px-4 py-3 rounded-xl">
                      <Lightbulb size={16} className="text-indigo-500 mt-0.5 shrink-0" />
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{item.explanation}</p>
                    </div>
                    <button className="mt-3 text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 hover:gap-2.5 transition-all">
                      Practice This Rule <ArrowRight size={12} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── Pronunciation + Vocabulary ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Pronunciation Review */}
        <motion.section {...fadeUp(0.15)} className="space-y-5">
          <SectionHeader
            icon={<Volume2 size={20} className="text-orange-500" />}
            title="Pronunciation Gaps"
            subtitle="Detected from today's speaking sessions"
          />
          <div className="space-y-4">
            {PRONUNCIATION_ITEMS.map((item, i) => (
              <motion.div key={i} {...fadeUp(0.17 + i * 0.04)} className="bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl p-5 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center shrink-0">
                    <span className="text-xs font-black text-orange-600 dark:text-orange-400">{item.phoneme}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">{item.word}</span>
                      <span className={cn("text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md", SEVERITY_CONFIG[item.severity].cls)}>
                        {SEVERITY_CONFIG[item.severity].label}
                      </span>
                    </div>
                    <p className="text-xs text-rose-500 dark:text-rose-400 mb-2">{item.issue}</p>
                    <div className="flex items-start gap-1.5">
                      <Lightbulb size={12} className="text-indigo-500 mt-0.5 shrink-0" />
                      <p className="text-xs text-slate-500 dark:text-slate-400">{item.tip}</p>
                    </div>
                  </div>
                </div>
                <button className="mt-4 w-full bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 text-orange-600 dark:text-orange-400 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-orange-100 dark:hover:bg-orange-500/20 transition-colors">
                  <Mic2 size={13} /> Practice Pronunciation
                </button>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Vocabulary Flashcard Review */}
        <motion.section {...fadeUp(0.15)} className="space-y-5">
          <SectionHeader
            icon={<BookOpen size={20} className="text-violet-500" />}
            title="Vocabulary to Revisit"
            subtitle={`${VOCAB_TO_REVIEW.filter(w => w.missed).length} words missed — spaced repetition queued`}
          />

          <div className="bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-3xl p-7 shadow-sm">
            {/* Card navigator */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex gap-2">
                {VOCAB_TO_REVIEW.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setActiveVocab(i); setFlipped(false); }}
                    className={cn("h-2 rounded-full transition-all", i === activeVocab ? "w-6 bg-violet-500" : "w-2 bg-slate-200 dark:bg-white/10")}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500">{activeVocab + 1} / {VOCAB_TO_REVIEW.length}</span>
            </div>

            {/* Flashcard */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeVocab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3">
                  <span className={cn("text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-widest", BAND_COLORS[VOCAB_TO_REVIEW[activeVocab].band])}>
                    {VOCAB_TO_REVIEW[activeVocab].band}
                  </span>
                  {VOCAB_TO_REVIEW[activeVocab].missed && (
                    <span className="text-[10px] font-bold text-rose-500 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 px-2.5 py-1 rounded-lg uppercase tracking-widest">
                      Missed Today
                    </span>
                  )}
                </div>

                <div
                  className="bg-slate-50 dark:bg-white/5 rounded-2xl p-6 cursor-pointer border border-slate-100 dark:border-white/5 hover:border-violet-200 dark:hover:border-violet-500/30 transition-all min-h-[120px] flex flex-col justify-center"
                  onClick={() => setFlipped(!flipped)}
                >
                  {!flipped ? (
                    <div>
                      <p className="text-2xl font-black text-slate-900 dark:text-white mb-1">{VOCAB_TO_REVIEW[activeVocab].word}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">Tap to reveal definition</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{VOCAB_TO_REVIEW[activeVocab].definition}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 italic">&quot;{VOCAB_TO_REVIEW[activeVocab].example}&quot;</p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {VOCAB_TO_REVIEW[activeVocab].collocations.map((c) => (
                          <span key={c} className="text-[10px] px-2 py-0.5 rounded-md bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-400 font-medium">{c}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => { setActiveVocab((activeVocab + 1) % VOCAB_TO_REVIEW.length); setFlipped(false); }}
                    className="py-2.5 rounded-xl border border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                  >
                    <RotateCcw size={12} /> Needs Work
                  </button>
                  <button
                    onClick={() => { setActiveVocab((activeVocab + 1) % VOCAB_TO_REVIEW.length); setFlipped(false); }}
                    className="py-2.5 rounded-xl bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-emerald-600 transition-colors"
                  >
                    <Star size={12} /> Got It
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.section>
      </div>

      {/* ── Weak Pattern Detection ───────────────────────────────────────────── */}
      <motion.section {...fadeUp(0.2)} className="space-y-5">
        <SectionHeader
          icon={<BrainCircuit size={20} className="text-indigo-500" />}
          title="Weak Pattern Detection"
          subtitle="AI-identified recurring error clusters"
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { label: "Preposition Errors", count: 4, change: "+2 from yesterday", pct: 78, color: "bg-rose-500" },
            { label: "Article Usage (a/an/the)", count: 3, change: "Stable", pct: 55, color: "bg-orange-500" },
            { label: "Passive Voice", count: 2, change: "-1 from yesterday", pct: 35, color: "bg-emerald-500" },
          ].map((p, i) => (
            <motion.div key={i} {...fadeUp(0.22 + i * 0.04)} className="bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm leading-tight">{p.label}</h4>
                <span className="text-2xl font-black text-slate-900 dark:text-white">{p.count}</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden mb-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${p.pct}%` }}
                  transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                  className={cn("h-full rounded-full", p.color)}
                />
              </div>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{p.change}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── AI Recommendations for Tomorrow ─────────────────────────────────── */}
      <motion.section {...fadeUp(0.25)} className="space-y-5">
        <SectionHeader
          icon={<Target size={20} className="text-emerald-500" />}
          title="AI Study Plan for Tomorrow"
          subtitle="Personalised based on today's performance gaps"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {TOMORROW_RECS.map((rec, i) => {
            const colorMap: Record<string, string> = {
              emerald: "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400",
              orange: "bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400",
              violet: "bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-400",
              blue: "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400",
            };
            return (
              <motion.div key={i} {...fadeUp(0.27 + i * 0.05)} className="bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl p-6 shadow-sm group hover:border-slate-200 dark:hover:border-white/10 transition-all">
                <div className="flex items-start gap-4">
                  <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0", colorMap[rec.color])}>
                    {rec.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">{rec.title}</span>
                      {rec.priority === "high" && (
                        <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 px-2 py-0.5 rounded-md uppercase tracking-widest">
                          Priority
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">{rec.reason}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1">
                        <Calendar size={10} /> {rec.duration}
                      </span>
                      <button className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 group-hover:gap-2 transition-all">
                        Schedule <ArrowRight size={11} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* ── Reflection + Memory Reinforcement ───────────────────────────────── */}
      <motion.section {...fadeUp(0.3)}>
        <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl shadow-indigo-200/50 dark:shadow-none">
          <div className="pointer-events-none absolute top-0 right-0 p-10 opacity-[0.06]">
            <Sparkles size={300} />
          </div>
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-white/15 flex items-center justify-center border border-white/20">
                  <Lightbulb size={18} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-70">AI Coach Reflection</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
                Consistency is your biggest asset right now.
              </h3>
              <p className="text-indigo-100 text-sm md:text-base leading-relaxed max-w-2xl">
                You&apos;ve practiced every day for 12 days — that puts you in the <strong className="text-white">top 8% of active learners</strong>. Fix your preposition patterns this week and your Writing band will jump by at least 0.5. Keep going.
              </p>
            </div>
            <div className="lg:col-span-4 space-y-3">
              {[
                { label: "Memory retention", value: `${retentionScore}%` },
                { label: "Study consistency", value: "12 days" },
                { label: "Projected band", value: "7.0 → 7.5" },
              ].map((stat) => (
                <div key={stat.label} className="flex justify-between items-center bg-white/10 rounded-xl px-4 py-3 border border-white/10">
                  <span className="text-xs font-medium text-indigo-200">{stat.label}</span>
                  <span className="text-sm font-black">{stat.value}</span>
                </div>
              ))}
              <button className="w-full mt-2 bg-white text-indigo-700 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-indigo-50 transition-colors">
                Start Tomorrow&apos;s Plan <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </motion.section>

    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function SectionHeader({ icon, title, subtitle, action }: { icon: React.ReactNode; title: string; subtitle: string; action?: string }) {
  return (
    <div className="flex items-center justify-between px-1">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white">{title}</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{subtitle}</p>
        </div>
      </div>
      {action && (
        <button className="text-xs font-bold text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors uppercase tracking-widest">
          {action}
        </button>
      )}
    </div>
  );
}

function StatPill({ label, value, icon, color }: { label: string; value: string; icon: React.ReactNode; color: "rose" | "indigo" | "emerald" }) {
  const colorMap = {
    rose: "bg-rose-500/20 text-rose-300",
    indigo: "bg-indigo-500/20 text-indigo-300",
    emerald: "bg-emerald-500/20 text-emerald-300",
  };
  return (
    <div className={cn("flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/5", colorMap[color])}>
      {icon}
      <span className="text-xs font-bold">{label}</span>
      <span className="text-sm font-black text-white">{value}</span>
    </div>
  );
}
