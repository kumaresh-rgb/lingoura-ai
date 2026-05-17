'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Loader2,
  Sparkles,
  Brain,
  Target,
  Clock,
  Zap,
} from 'lucide-react';
import { useAuthStore } from '@/features/auth/store/auth.store';
import {
  useOnboardingStore,
  type OnboardingProfile,
  type LearningGoal,
  type LearningStyle,
  type DailyCommitment,
  type IeltsBand,
  type CefrLevel,
} from '@/features/onboarding/store/onboarding.store';
import { ROUTES } from '@/shared/constants/routes';
import { cn } from '@/shared/lib/utils';

// ─── Constants ────────────────────────────────────────────────────────────────

const GOALS: { id: LearningGoal; icon: string; label: string; desc: string }[] = [
  { id: 'ielts', icon: '🎯', label: 'IELTS Preparation', desc: 'Target Band 7+' },
  { id: 'fluency', icon: '🗣️', label: 'Speak Fluently', desc: 'Confident in any conversation' },
  {
    id: 'professional',
    icon: '💼',
    label: 'Professional English',
    desc: 'Meetings, emails, presentations',
  },
  { id: 'interviews', icon: '🤝', label: 'Job Interviews', desc: 'Land your dream role' },
  { id: 'vocabulary', icon: '📚', label: 'Build Vocabulary', desc: 'Expand word power daily' },
  { id: 'abroad', icon: '✈️', label: 'Move Abroad', desc: 'Life in English-speaking countries' },
  { id: 'confidence', icon: '💪', label: 'Build Confidence', desc: 'Overcome hesitation & fear' },
  { id: 'daily', icon: '💬', label: 'Daily Communication', desc: 'Everyday conversations' },
];

const IELTS_BANDS: { value: IeltsBand; label: string; insight: string }[] = [
  { value: '5.0', label: '5.0', insight: 'Modest user' },
  { value: '5.5', label: '5.5', insight: 'Modest user+' },
  { value: '6.0', label: '6.0', insight: 'Competent user' },
  { value: '6.5', label: '6.5', insight: 'Competent user+' },
  { value: '7.0', label: '7.0', insight: 'Good user' },
  { value: '7.5', label: '7.5', insight: 'Good user+' },
  { value: '8.0', label: '8.0', insight: 'Very good user' },
  { value: '8.5+', label: '8.5+', insight: 'Expert user' },
];

const CEFR_LEVELS: { value: CefrLevel; label: string; desc: string }[] = [
  { value: 'A1', label: 'A1 — Beginner', desc: 'Can use basic phrases' },
  { value: 'A2', label: 'A2 — Elementary', desc: 'Can handle simple situations' },
  {
    value: 'B1',
    label: 'B1 — Intermediate',
    desc: 'Can deal with most situations while travelling',
  },
  {
    value: 'B2',
    label: 'B2 — Upper-Intermediate',
    desc: 'Can interact with native speakers fluently',
  },
  { value: 'C1', label: 'C1 — Advanced', desc: 'Can express ideas fluently and spontaneously' },
  { value: 'C2', label: 'C2 — Mastery', desc: 'Can understand everything heard or read' },
];

const HARDEST_SKILLS = ['Speaking', 'Listening', 'Reading', 'Writing', 'Vocabulary', 'Grammar'];

const SKILLS: { id: keyof OnboardingProfile['skillRatings']; label: string; emoji: string }[] = [
  { id: 'listening', label: 'Listening', emoji: '👂' },
  { id: 'reading', label: 'Reading', emoji: '📖' },
  { id: 'writing', label: 'Writing', emoji: '✍️' },
  { id: 'speaking', label: 'Speaking', emoji: '🎤' },
  { id: 'vocabulary', label: 'Vocabulary', emoji: '📚' },
  { id: 'grammar', label: 'Grammar', emoji: '🔤' },
];

const COMMITMENTS: { value: DailyCommitment; label: string; desc: string; sessions: string }[] = [
  {
    value: '10min',
    label: '10 minutes',
    desc: 'Light daily habit',
    sessions: '1 micro-lesson/day',
  },
  { value: '20min', label: '20 minutes', desc: 'Consistent progress', sessions: '2 lessons/day' },
  {
    value: '30min',
    label: '30 minutes',
    desc: 'Steady improvement',
    sessions: '1 full session/day',
  },
  { value: '1hr', label: '1 hour', desc: 'Accelerated growth', sessions: '2 full sessions/day' },
  { value: '2hr+', label: '2+ hours', desc: 'Intensive immersion', sessions: 'Full program/day' },
];

const LEARNING_STYLES: { id: LearningStyle; icon: string; label: string }[] = [
  { id: 'video', icon: '🎬', label: 'Video Lessons' },
  { id: 'audio', icon: '🎧', label: 'Audio Listening' },
  { id: 'tests', icon: '📝', label: 'Practice Tests' },
  { id: 'ai-chat', icon: '🤖', label: 'AI Conversations' },
  { id: 'reading', icon: '📖', label: 'Reading Practice' },
  { id: 'vocab-drills', icon: '🔁', label: 'Vocabulary Drills' },
  { id: 'speaking', icon: '🎤', label: 'Speaking Practice' },
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface WizardData {
  goals: LearningGoal[];
  targetBand: IeltsBand | null;
  cefrLevel: CefrLevel | null;
  confidenceLevel: number;
  fearOfMistakes: boolean;
  hesitation: boolean;
  hardestSkill: string | null;
  skillRatings: OnboardingProfile['skillRatings'];
  dailyCommitment: DailyCommitment | null;
  learningStyle: LearningStyle[];
}

const DEFAULTS: WizardData = {
  goals: [],
  targetBand: null,
  cefrLevel: null,
  confidenceLevel: 5,
  fearOfMistakes: false,
  hesitation: false,
  hardestSkill: null,
  skillRatings: { listening: 5, reading: 5, writing: 5, speaking: 5, vocabulary: 5, grammar: 5 },
  dailyCommitment: null,
  learningStyle: [],
};

// step 0 = welcome, steps 1-7 are content steps, progress counts 1-6
function canProceed(step: number, data: WizardData): boolean {
  if (step === 0) return true;
  if (step === 1) return data.goals.length > 0;
  if (step === 2) return data.goals.includes('ielts') ? !!data.targetBand : !!data.cefrLevel;
  if (step === 3) return true;
  if (step === 4) return true;
  if (step === 5) return !!data.dailyCommitment;
  if (step === 6) return data.learningStyle.length > 0;
  return true;
}

// ─── Shared UI ────────────────────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-xs font-bold tracking-widest text-slate-500 uppercase">{children}</p>
  );
}

function StepHeading({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-7">
      <h2 className="text-2xl leading-snug font-extrabold tracking-tight text-white">{title}</h2>
      {sub && <p className="mt-2 text-sm leading-relaxed font-medium text-slate-400">{sub}</p>}
    </div>
  );
}

function ToggleCard({
  label,
  desc,
  selected,
  onClick,
}: {
  label: string;
  desc?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full items-center justify-between rounded-xl border px-4 py-3.5 text-left transition-all duration-150',
        selected
          ? 'border-indigo-500/60 bg-indigo-600/20 text-white'
          : 'border-white/8 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-slate-200'
      )}
    >
      <div>
        <p className="text-sm font-semibold">{label}</p>
        {desc && <p className="mt-0.5 text-xs text-slate-500">{desc}</p>}
      </div>
      {selected && <Check size={16} className="ml-3 shrink-0 text-indigo-400" />}
    </button>
  );
}

function RatingSlider({
  value,
  onChange,
  label,
  emoji,
}: {
  value: number;
  onChange: (v: number) => void;
  label: string;
  emoji: string;
}) {
  const EMOJIS = ['😟', '😕', '😐', '🙂', '😊', '😄', '🤩'];
  const emojiIdx = Math.floor((value - 1) / (10 / EMOJIS.length));
  const pct = ((value - 1) / 9) * 100;
  return (
    <div className="flex items-center gap-4">
      <span className="w-7 shrink-0 text-lg">{emoji}</span>
      <div className="flex-1">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-200">{label}</span>
          <span className="font-mono text-xs text-slate-400">{value}/10</span>
        </div>
        <div className="relative">
          <input
            type="range"
            min={1}
            max={10}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-indigo-500"
          />
          <div
            className="pointer-events-none absolute top-0 left-0 h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <span className="w-7 shrink-0 text-center text-lg">
        {EMOJIS[Math.min(emojiIdx, EMOJIS.length - 1)]}
      </span>
    </div>
  );
}

// ─── Nav Bar ─────────────────────────────────────────────────────────────────

function NavBar({
  onBack,
  onNext,
  showBack,
  label,
  disabled,
}: {
  onBack: () => void;
  onNext: () => void;
  showBack: boolean;
  label: string;
  disabled: boolean;
}) {
  return (
    <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
      {showBack ? (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-slate-300"
        >
          <ArrowLeft size={15} /> Back
        </button>
      ) : (
        <div />
      )}
      <button
        onClick={onNext}
        disabled={disabled}
        className={cn(
          'flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-all duration-150',
          disabled
            ? 'cursor-not-allowed bg-white/5 text-slate-600'
            : 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500'
        )}
      >
        {label} <ArrowRight size={15} />
      </button>
    </div>
  );
}

// ─── Wizard Steps ─────────────────────────────────────────────────────────────

// Step 0 — Welcome
function WelcomeStep({ name, onStart }: { name: string; onStart: () => void }) {
  const features = [
    { icon: <Brain size={16} />, text: 'Personalized AI learning path' },
    { icon: <Target size={16} />, text: 'Adaptive goal tracking' },
    { icon: <Zap size={16} />, text: 'Real-time speaking coach' },
    { icon: <Sparkles size={16} />, text: 'AI-powered fluency analysis' },
  ];
  return (
    <div className="w-full max-w-2xl mx-auto text-center">
      {/* Icon */}
      <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-indigo-500 to-violet-600 text-3xl shadow-2xl shadow-indigo-500/30">
        ✦
      </div>

      {/* Badge */}
      <span className="mb-4 inline-block rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-[11px] font-bold tracking-wider whitespace-nowrap text-indigo-400 uppercase">
        Welcome to Lingoura AI
      </span>

      {/* Heading */}
      <h1 className="mb-4 text-3xl leading-tight font-black tracking-tight text-white sm:text-4xl md:text-5xl overflow-hidden">
        {name ? `Hey ${name}, ` : 'Hey there, '}
        <span className="block bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
          let&apos;s build your fluency system
        </span>
      </h1>

      {/* Description */}
      <p className="mx-auto mb-8 max-w-[28rem] text-base leading-relaxed font-medium text-slate-400">
        We&apos;ll personalize your English learning experience in under 2 minutes.
      </p>

      {/* Feature grid */}
      <div className="mx-auto mb-10 grid max-w-[32rem] grid-cols-2 gap-2.5">
        {features.map((f, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 rounded-xl border border-white/8 bg-white/[0.04] px-3 py-3 text-left"
          >
            <span className="shrink-0 text-indigo-400">{f.icon}</span>
            <span className="text-xs leading-tight font-semibold text-slate-300">{f.text}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="flex justify-center">
        <button
          onClick={onStart}
          className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-4 text-base font-bold text-white shadow-2xl shadow-indigo-600/30 transition-all hover:from-indigo-500 hover:to-violet-500 active:scale-[0.98]"
        >
          Start My Journey <ArrowRight size={18} />
        </button>
      </div>
      <p className="mt-4 text-xs text-slate-600">Takes about 2 minutes · No credit card required</p>
    </div>
  );
}

// Step 1 — Goals
function GoalsStep({
  goals,
  onChange,
}: {
  goals: LearningGoal[];
  onChange: (g: LearningGoal[]) => void;
}) {
  const toggle = (id: LearningGoal) =>
    onChange(goals.includes(id) ? goals.filter((g) => g !== id) : [...goals, id]);
  return (
    <div>
      <StepHeading
        title="What's your primary goal?"
        sub="Select all that apply — we'll tailor your plan accordingly."
      />
      <div className="grid grid-cols-2 gap-2.5">
        {GOALS.map((g) => {
          const selected = goals.includes(g.id);
          return (
            <button
              key={g.id}
              onClick={() => toggle(g.id)}
              className={cn(
                'flex items-start gap-3 rounded-xl border p-4 text-left transition-all duration-150',
                selected
                  ? 'border-indigo-500/60 bg-indigo-600/20'
                  : 'border-white/8 bg-white/[0.03] hover:border-white/20'
              )}
            >
              <span className="mt-0.5 text-xl">{g.icon}</span>
              <div>
                <p className={cn('text-sm font-bold', selected ? 'text-white' : 'text-slate-300')}>
                  {g.label}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">{g.desc}</p>
              </div>
              {selected && <Check size={14} className="mt-0.5 ml-auto shrink-0 text-indigo-400" />}
            </button>
          );
        })}
      </div>
      {goals.length === 0 && (
        <p className="mt-4 text-center text-xs text-slate-600">
          Select at least one goal to continue
        </p>
      )}
    </div>
  );
}

// Step 2 — Target Level
function TargetLevelStep({
  isIelts,
  targetBand,
  cefrLevel,
  onBand,
  onCefr,
}: {
  isIelts: boolean;
  targetBand: IeltsBand | null;
  cefrLevel: CefrLevel | null;
  onBand: (b: IeltsBand) => void;
  onCefr: (c: CefrLevel) => void;
}) {
  if (isIelts) {
    return (
      <div>
        <StepHeading
          title="What IELTS band are you targeting?"
          sub="Most learners improve by 1 band within 90 days of consistent practice."
        />
        <div className="grid grid-cols-4 gap-2.5">
          {IELTS_BANDS.map((b) => (
            <button
              key={b.value}
              onClick={() => onBand(b.value)}
              className={cn(
                'flex flex-col items-center rounded-xl border px-2 py-4 transition-all duration-150',
                targetBand === b.value
                  ? 'border-indigo-500/70 bg-indigo-600/25 text-white'
                  : 'border-white/8 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-slate-200'
              )}
            >
              <span className="text-2xl font-black">{b.label}</span>
              <span className="mt-1 text-center text-[10px] leading-tight text-slate-500">
                {b.insight}
              </span>
              {targetBand === b.value && <Check size={14} className="mt-2 text-indigo-400" />}
            </button>
          ))}
        </div>
        <div className="mt-5 rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-4">
          <p className="text-xs font-semibold text-indigo-300">
            💡 <strong>Lingoura Insight:</strong> Learners targeting Band 7+ who practice ≥30
            min/day achieve their goal 3× faster than weekend-only learners.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div>
      <StepHeading
        title="What's your current English level?"
        sub="Be honest — we use this to set the right starting point for you."
      />
      <div className="space-y-2.5">
        {CEFR_LEVELS.map((c) => (
          <button
            key={c.value}
            onClick={() => onCefr(c.value)}
            className={cn(
              'flex w-full items-center justify-between rounded-xl border px-5 py-4 text-left transition-all duration-150',
              cefrLevel === c.value
                ? 'border-indigo-500/60 bg-indigo-600/20'
                : 'border-white/8 bg-white/[0.03] hover:border-white/20'
            )}
          >
            <div>
              <p
                className={cn(
                  'text-sm font-bold',
                  cefrLevel === c.value ? 'text-white' : 'text-slate-300'
                )}
              >
                {c.label}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">{c.desc}</p>
            </div>
            {cefrLevel === c.value && <Check size={16} className="shrink-0 text-indigo-400" />}
          </button>
        ))}
      </div>
    </div>
  );
}

// Step 3 — Confidence & Emotional Assessment
function ConfidenceStep({
  data,
  onChange,
}: {
  data: Pick<WizardData, 'confidenceLevel' | 'fearOfMistakes' | 'hesitation' | 'hardestSkill'>;
  onChange: (patch: Partial<WizardData>) => void;
}) {
  const CONF_LABELS = [
    'Very low',
    'Low',
    'Below average',
    'Slightly low',
    'Average',
    'Decent',
    'Good',
    'Strong',
    'Very strong',
    'Excellent',
  ];
  return (
    <div className="space-y-7">
      <StepHeading
        title="Let's understand your confidence"
        sub="A great tutor first understands the learner emotionally. Be open — there's no wrong answer."
      />

      {/* Confidence slider */}
      <div>
        <Label>Speaking confidence (1 = very low, 10 = very high)</Label>
        <div className="px-1">
          <RatingSlider
            value={data.confidenceLevel}
            onChange={(v) => onChange({ confidenceLevel: v })}
            label={CONF_LABELS[data.confidenceLevel - 1]}
            emoji="🎤"
          />
        </div>
      </div>

      {/* Fear / Hesitation toggles */}
      <div className="space-y-2.5">
        <Label>How do you feel?</Label>
        <ToggleCard
          label="I fear making grammar mistakes"
          desc="Worrying about errors holds back fluency"
          selected={data.fearOfMistakes}
          onClick={() => onChange({ fearOfMistakes: !data.fearOfMistakes })}
        />
        <ToggleCard
          label="I hesitate before speaking"
          desc="Pause too long searching for words"
          selected={data.hesitation}
          onClick={() => onChange({ hesitation: !data.hesitation })}
        />
      </div>

      {/* Hardest skill */}
      <div>
        <Label>Which skill feels hardest right now?</Label>
        <div className="grid grid-cols-3 gap-2">
          {HARDEST_SKILLS.map((skill) => (
            <button
              key={skill}
              onClick={() => onChange({ hardestSkill: data.hardestSkill === skill ? null : skill })}
              className={cn(
                'rounded-xl border px-3 py-2.5 text-sm font-semibold transition-all duration-150',
                data.hardestSkill === skill
                  ? 'border-violet-500/60 bg-violet-600/25 text-white'
                  : 'border-white/8 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-slate-200'
              )}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Step 4 — Skill Self-Rating
function SkillRatingsStep({
  ratings,
  onChange,
}: {
  ratings: OnboardingProfile['skillRatings'];
  onChange: (patch: Partial<OnboardingProfile['skillRatings']>) => void;
}) {
  return (
    <div>
      <StepHeading
        title="Rate your current skill levels"
        sub="Honest self-assessment helps us target the areas that need the most attention."
      />
      <div className="space-y-5">
        {SKILLS.map((s) => (
          <RatingSlider
            key={s.id}
            emoji={s.emoji}
            label={s.label}
            value={ratings[s.id]}
            onChange={(v) => onChange({ [s.id]: v })}
          />
        ))}
      </div>
    </div>
  );
}

// Step 5 — Daily Commitment
function CommitmentStep({
  value,
  onChange,
}: {
  value: DailyCommitment | null;
  onChange: (v: DailyCommitment) => void;
}) {
  return (
    <div>
      <StepHeading
        title="How much time can you invest daily?"
        sub="Consistent short sessions beat occasional long ones. Choose what's realistic for you."
      />
      <div className="space-y-2.5">
        {COMMITMENTS.map((c) => (
          <button
            key={c.value}
            onClick={() => onChange(c.value)}
            className={cn(
              'flex w-full items-center justify-between rounded-xl border px-5 py-4 transition-all duration-150',
              value === c.value
                ? 'border-indigo-500/60 bg-indigo-600/20'
                : 'border-white/8 bg-white/[0.03] hover:border-white/20'
            )}
          >
            <div className="text-left">
              <p
                className={cn(
                  'text-sm font-bold',
                  value === c.value ? 'text-white' : 'text-slate-300'
                )}
              >
                {c.label}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                {c.desc} · {c.sessions}
              </p>
            </div>
            {value === c.value && <Check size={16} className="shrink-0 text-indigo-400" />}
          </button>
        ))}
      </div>
    </div>
  );
}

// Step 6 — Learning Style
function LearningStyleStep({
  value,
  onChange,
}: {
  value: LearningStyle[];
  onChange: (v: LearningStyle[]) => void;
}) {
  const toggle = (id: LearningStyle) =>
    onChange(value.includes(id) ? value.filter((s) => s !== id) : [...value, id]);
  return (
    <div>
      <StepHeading
        title="How do you learn best?"
        sub="Select all that resonate — your AI coach will blend these into your sessions."
      />
      <div className="grid grid-cols-2 gap-2.5">
        {LEARNING_STYLES.map((s) => {
          const selected = value.includes(s.id);
          return (
            <button
              key={s.id}
              onClick={() => toggle(s.id)}
              className={cn(
                'flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-all duration-150',
                selected
                  ? 'border-indigo-500/60 bg-indigo-600/20'
                  : 'border-white/8 bg-white/[0.03] hover:border-white/20'
              )}
            >
              <span className="text-xl">{s.icon}</span>
              <span
                className={cn('text-sm font-semibold', selected ? 'text-white' : 'text-slate-300')}
              >
                {s.label}
              </span>
              {selected && <Check size={14} className="ml-auto shrink-0 text-indigo-400" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Step 7 — AI Plan Generation
function PlanGenerationStep({ data, onDone }: { data: WizardData; onDone: () => void }) {
  const [phase, setPhase] = useState<'loading' | 'ready'>('loading');
  const isIelts = data.goals.includes('ielts');
  const weakestSkill = Object.entries(data.skillRatings).sort((a, b) => a[1] - b[1])[0];

  useEffect(() => {
    const t = setTimeout(() => setPhase('ready'), 2800);
    return () => clearTimeout(t);
  }, []);

  if (phase === 'loading') {
    const stages = [
      'Analyzing your goals…',
      'Mapping your skill levels…',
      'Building your fluency roadmap…',
      'Personalizing your AI coach…',
    ];
    return (
      <div className="flex flex-col items-center py-8 text-center">
        <div className="relative mb-8">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-indigo-500/20 bg-indigo-500/10">
            <Loader2 size={32} className="animate-spin text-indigo-400" />
          </div>
          <div className="absolute inset-0 animate-ping rounded-full border border-indigo-500/20 opacity-40" />
        </div>
        <h2 className="mb-2 text-2xl font-black text-white">Building your plan…</h2>
        <p className="mb-6 text-sm text-slate-400">Your AI English mentor is being configured</p>
        <div className="w-full max-w-xs space-y-2">
          {stages.map((s, i) => (
            <motion.div
              key={s}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.55 }}
              className="flex items-center gap-2 text-xs text-slate-500"
            >
              <div className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-indigo-500" />
              {s}
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  const planItems = [
    {
      icon: '🎯',
      label: 'Primary focus',
      value: GOALS.find((g) => g.id === data.goals[0])?.label ?? 'English Fluency',
    },
    {
      icon: '📊',
      label: isIelts ? 'Target band' : 'Starting level',
      value: isIelts ? `Band ${data.targetBand}` : (data.cefrLevel ?? 'B1'),
    },
    {
      icon: '⚡',
      label: 'Daily commitment',
      value: COMMITMENTS.find((c) => c.value === data.dailyCommitment)?.label ?? '20 minutes',
    },
    {
      icon: '🔧',
      label: 'Priority skill',
      value: `${weakestSkill[0][0].toUpperCase()}${weakestSkill[0].slice(1)} (rated ${weakestSkill[1]}/10)`,
    },
    {
      icon: '🧠',
      label: 'Learning mode',
      value:
        data.learningStyle.length > 0
          ? `${data.learningStyle.length} styles blended`
          : 'AI-adaptive',
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/20 text-xl">
          ✅
        </div>
        <div>
          <h2 className="text-xl font-black text-white">Your fluency system is ready!</h2>
          <p className="text-sm text-slate-400">Personalized just for you</p>
        </div>
      </div>

      <div className="mb-7 space-y-2.5">
        {planItems.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.04] p-4"
          >
            <span className="text-xl">{item.icon}</span>
            <div>
              <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                {item.label}
              </p>
              <p className="mt-0.5 text-sm font-bold text-white">{item.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {data.fearOfMistakes && (
        <div className="mb-5 rounded-xl border border-violet-500/20 bg-violet-500/10 p-4">
          <p className="text-xs font-semibold text-violet-300">
            💜 <strong>Coach note:</strong> We noticed you fear making mistakes. Your AI coach is
            trained to be encouraging, not corrective. You'll build confidence through exposure, not
            perfection.
          </p>
        </div>
      )}

      <button
        onClick={onDone}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-4 text-sm font-bold text-white shadow-xl shadow-indigo-600/25 transition-all hover:from-indigo-500 hover:to-violet-500 active:scale-[0.98]"
      >
        Enter My Dashboard <ArrowRight size={16} />
      </button>
    </div>
  );
}

// ─── Main Wizard ─────────────────────────────────────────────────────────────

const CONTENT_STEPS = 7; // steps 1–6 show progress (6 steps); step 7 is completion

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 48 : -48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -48 : 48, opacity: 0 }),
};

export default function OnboardingPage() {
  const router = useRouter();
  const { isAuthenticated, isInitializing, user } = useAuthStore();
  const { hasCompletedOnboarding, completeOnboarding } = useOnboardingStore();

  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [data, setData] = useState<WizardData>(DEFAULTS);

  const patch = (partial: Partial<WizardData>) => setData((d) => ({ ...d, ...partial }));

  useEffect(() => {
    if (isInitializing) return;
    if (!isAuthenticated) {
      router.replace(ROUTES.LOGIN);
      return;
    }
    if (hasCompletedOnboarding) {
      router.replace(ROUTES.DASHBOARD);
    }
  }, [isAuthenticated, isInitializing, hasCompletedOnboarding, router]);

  const goNext = () => {
    setDir(1);
    setStep((s) => s + 1);
  };
  const goBack = () => {
    setDir(-1);
    setStep((s) => s - 1);
  };

  const handleComplete = () => {
    completeOnboarding({
      goals: data.goals,
      targetBand: data.targetBand,
      cefrLevel: data.cefrLevel,
      confidenceLevel: data.confidenceLevel,
      fearOfMistakes: data.fearOfMistakes,
      hesitation: data.hesitation,
      hardestSkill: data.hardestSkill,
      skillRatings: data.skillRatings,
      dailyCommitment: data.dailyCommitment,
      learningStyle: data.learningStyle,
    });
    router.replace(ROUTES.DASHBOARD);
  };

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#030712]">
        <Loader2 size={28} className="animate-spin text-indigo-400" />
      </div>
    );
  }

  const firstName = user?.displayName?.split(' ')[0] ?? '';
  const progressPct = step === 0 ? 0 : Math.min(100, Math.round((step / 6) * 100));
  const isContentStep = step > 0 && step < 7;

  const stepNavLabel: Record<number, string> = {
    1: 'Set Goals',
    2: 'Set Target',
    3: 'Assess Confidence',
    4: 'Rate Skills',
    5: 'Set Schedule',
    6: 'Pick Style',
  };

  return (
    <div
      className="flex min-h-screen flex-col bg-[#030712]"
      style={{
        backgroundImage:
          'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,102,241,0.12) 0%, transparent 70%)',
      }}
    >
      {/* Progress bar */}
      {step > 0 && step < 7 && (
        <div className="fixed top-0 right-0 left-0 z-50 h-0.5 bg-white/5">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500"
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      )}

      {/* Top bar (not on welcome or generation) */}
      {isContentStep && (
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2">
            <img src="/logo-icon.png" alt="Lingoura AI" className="h-8 w-auto object-contain" />
            <span className="text-base font-black tracking-tight">
              <span className="text-violet-400">Lingoura</span>
              <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent"> AI</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500">Step {step} of 6</span>
            <span className="rounded-full bg-indigo-500/10 px-2.5 py-1 text-[10px] font-bold tracking-widest text-indigo-400 uppercase">
              {stepNavLabel[step]}
            </span>
          </div>
        </div>
      )}

      {/* Content */}
      <div
        className={cn('flex flex-1 items-center justify-center px-5 py-10', step === 0 && 'pt-20')}
      >
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={step}
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            >
              {step === 0 && <WelcomeStep name={firstName} onStart={goNext} />}

              {step > 0 && step < 7 && (
                <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-8 backdrop-blur-sm">
                  {step === 1 && (
                    <GoalsStep goals={data.goals} onChange={(g) => patch({ goals: g })} />
                  )}
                  {step === 2 && (
                    <TargetLevelStep
                      isIelts={data.goals.includes('ielts')}
                      targetBand={data.targetBand}
                      cefrLevel={data.cefrLevel}
                      onBand={(b) => patch({ targetBand: b })}
                      onCefr={(c) => patch({ cefrLevel: c })}
                    />
                  )}
                  {step === 3 && (
                    <ConfidenceStep
                      data={{
                        confidenceLevel: data.confidenceLevel,
                        fearOfMistakes: data.fearOfMistakes,
                        hesitation: data.hesitation,
                        hardestSkill: data.hardestSkill,
                      }}
                      onChange={patch}
                    />
                  )}
                  {step === 4 && (
                    <SkillRatingsStep
                      ratings={data.skillRatings}
                      onChange={(sr) => patch({ skillRatings: { ...data.skillRatings, ...sr } })}
                    />
                  )}
                  {step === 5 && (
                    <CommitmentStep
                      value={data.dailyCommitment}
                      onChange={(v) => patch({ dailyCommitment: v })}
                    />
                  )}
                  {step === 6 && (
                    <LearningStyleStep
                      value={data.learningStyle}
                      onChange={(v) => patch({ learningStyle: v })}
                    />
                  )}

                  <NavBar
                    onBack={goBack}
                    onNext={step === 6 ? goNext : goNext}
                    showBack={step > 1}
                    label={step === 6 ? 'Generate My Plan' : 'Continue'}
                    disabled={!canProceed(step, data)}
                  />
                </div>
              )}

              {step === 7 && (
                <div className="mx-auto max-w-lg rounded-3xl border border-white/8 bg-white/[0.03] p-8 backdrop-blur-sm">
                  <PlanGenerationStep data={data} onDone={handleComplete} />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      {step === 0 && (
        <p className="pb-6 text-center text-[11px] font-medium text-slate-700">
          Powered by Lingoura Intelligence · Your data is private and secure
        </p>
      )}
    </div>
  );
}
