'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import Link from 'next/link';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useCreateCheckout } from '@/features/billing/hooks/useCreateCheckout';
import { detectPaymentProvider } from '@/features/billing/utils/payment-region';
import type { SubscriptionPlan } from '@/shared/types/auth.types';
import type { BillingInterval } from '@/features/billing/types/billing.types';
import {
  Mic2, BookOpen, Headphones, PenLine, Brain, Target, Zap,
  Check, Star, ArrowRight, Play, BarChart2, Globe, Users,
  TrendingUp, Shield, MessageSquare, Sparkles, ChevronDown,
  Menu, X, GraduationCap, Briefcase, Building2, Plane, Code2,
  Moon, Sun, Flame, Cpu, Eye, Bot, Wand2, Clock, LineChart,
  FileText, RefreshCw, Volume2, ChevronRight, Award, Layers, Crown,
} from 'lucide-react';

// ─── Animation Helpers ────────────────────────────────────────────────────────

function FadeIn({ children, delay = 0, y = 24, className = '' }: {
  children: React.ReactNode; delay?: number; y?: number; className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px 0px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StaggerChildren({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px 0px' });
  return (
    <motion.div ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const childVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};
function AnimChild({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <motion.div variants={childVariant} className={className}>{children}</motion.div>;
}

function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const start = Date.now(); const dur = 1800;
    const tick = () => {
      const p = Math.min((Date.now() - start) / dur, 1);
      setVal(Math.round(p * to));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, to]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Blog', href: '/blog' },
  { label: 'Changelog', href: '/changelog' },
];

const TRUSTED_BRANDS = [
  'Infosys', 'TCS', 'Zoho', 'HCL Technologies', 'Wipro', 'Cognizant',
  'IIT Delhi', 'IIT Bombay', 'BITS Pilani', 'Manipal University',
  'Byju\'s', 'upGrad', 'Unacademy', 'PhysicsWallah',
  'Deloitte', 'Accenture', 'Capgemini', 'IBM India',
];

const SKILLS = [
  {
    icon: <Mic2 size={26} />, color: 'from-indigo-500 to-violet-500',
    glow: 'rgba(99,102,241,0.2)', badge: 'Most Practised', title: 'Speaking',
    desc: 'Build pronunciation, fluency, and real-time confidence through AI-powered conversation practice.',
    points: ['Pronunciation accuracy scoring', 'Real-time fluency detection', 'Accent neutralization coaching', 'IELTS Speaking Band predictor', 'Mock interview simulations'],
    stat: { label: 'Accuracy improvement', val: '+34%' },
  },
  {
    icon: <Headphones size={26} />, color: 'from-violet-500 to-purple-500',
    glow: 'rgba(139,92,246,0.2)', badge: 'Often Neglected', title: 'Listening',
    desc: 'Train your brain to decode fast speech, different accents, and real-world audio intelligently.',
    points: ['Multi-accent comprehension drills', 'Speed listening exercises', 'Podcast & lecture understanding', 'IELTS Listening practice', 'Audio memory strengthening'],
    stat: { label: 'Comprehension gain', val: '+41%' },
  },
  {
    icon: <BookOpen size={26} />, color: 'from-sky-500 to-cyan-500',
    glow: 'rgba(14,165,233,0.2)', badge: 'Foundation Skill', title: 'Reading',
    desc: 'Develop speed reading, academic comprehension, and critical analysis for professional success.',
    points: ['Speed reading development', 'Academic text analysis', 'Vocabulary in context', 'IELTS Reading strategy', 'Critical comprehension training'],
    stat: { label: 'Reading speed gain', val: '+52%' },
  },
  {
    icon: <PenLine size={26} />, color: 'from-emerald-500 to-teal-500',
    glow: 'rgba(16,185,129,0.2)', badge: 'Career-Critical', title: 'Writing',
    desc: 'Master grammar, professional email tone, essay structure, and clear communication under pressure.',
    points: ['AI grammar correction engine', 'Professional email coaching', 'Essay structure feedback', 'IELTS Task 1 & 2 evaluation', 'Tone and coherence scoring'],
    stat: { label: 'Writing quality score', val: '+48%' },
  },
];

const AI_FEATURES = [
  { icon: <Brain size={20} />, title: 'Weak Skill Detection', desc: 'AI maps your unique skill gaps across all 4 domains in under 5 minutes.' },
  { icon: <Target size={20} />, title: 'Personalised Goal Setting', desc: 'Custom study plans built around your timeline, target score, and learning style.' },
  { icon: <Eye size={20} />, title: 'Hesitation Tracking', desc: 'AI detects pauses, filler words, and confidence drops during speaking.' },
  { icon: <LineChart size={20} />, title: 'Grammar Pattern Analysis', desc: 'Identifies your most frequent grammar mistakes and creates targeted drills.' },
  { icon: <TrendingUp size={20} />, title: 'IELTS Band Prediction', desc: 'Real-time scoring aligned with official IELTS criteria — accurate to ±0.5 bands.' },
  { icon: <RefreshCw size={20} />, title: 'Adaptive Difficulty', desc: 'Every session auto-calibrates — harder when you improve, supportive when you struggle.' },
];

const STEPS = [
  { n: '01', icon: <GraduationCap size={22} />, title: 'Create Your Account', desc: 'Sign up in 30 seconds. No credit card required. Start immediately.' },
  { n: '02', icon: <Brain size={22} />, title: 'Smart Assessment', desc: '8-minute AI test across Speaking, Listening, Reading, Writing — your real starting point.' },
  { n: '03', icon: <Wand2 size={22} />, title: 'AI Builds Your Plan', desc: 'Personalised roadmap generated from your goals, timeline, and weakest skills.' },
  { n: '04', icon: <Flame size={22} />, title: 'Practice Daily', desc: 'Bite-sized, adaptive sessions that fit your schedule — 10 to 60 minutes per day.' },
  { n: '05', icon: <BarChart2 size={22} />, title: 'Track Fluency Growth', desc: 'Visual progress dashboard showing improvement across every skill and metric.' },
  { n: '06', icon: <Sparkles size={22} />, title: 'Achieve Real Fluency', desc: 'Land your target IELTS band, ace your interview, or communicate globally with confidence.' },
];

const FEATURES = [
  { icon: <Mic2 size={20} />, color: '#6366f1', bg: 'rgba(99,102,241,0.1)', title: 'AI Speaking Evaluation', desc: 'Real-time pronunciation, fluency, and confidence scoring with detailed feedback after every session.' },
  { icon: <Bot size={20} />, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', title: 'AI Conversation Partner', desc: 'Practice natural conversations 24/7 with an AI tutor that adapts to your level and corrects you in real time.' },
  { icon: <FileText size={20} />, color: '#10b981', bg: 'rgba(16,185,129,0.1)', title: 'AI Essay & Writing Review', desc: 'Submit any writing — the AI returns grammar fixes, coherence scores, and task achievement analysis.' },
  { icon: <Volume2 size={20} />, color: '#0ea5e9', bg: 'rgba(14,165,233,0.1)', title: 'Pronunciation Coach', desc: 'Phoneme-level analysis detects exact sounds you mispronounce and provides targeted mouth-position drills.' },
  { icon: <Target size={20} />, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', title: 'Mock IELTS Tests', desc: 'Full-length Academic and General Training mock tests with AI marking to IELTS Band descriptors.' },
  { icon: <Brain size={20} />, color: '#ec4899', bg: 'rgba(236,72,153,0.1)', title: 'Vocabulary Intelligence', desc: 'Spaced-repetition word engine that learns which words you forget and resurfaces them intelligently.' },
  { icon: <LineChart size={20} />, color: '#6366f1', bg: 'rgba(99,102,241,0.1)', title: 'Fluency Analytics', desc: 'Visual dashboard tracking 12+ metrics including speaking speed, pause frequency, and grammar accuracy.' },
  { icon: <Layers size={20} />, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', title: 'Adaptive Learning Paths', desc: 'Lesson difficulty auto-adjusts every session — always challenging enough to grow, never frustrating.' },
  { icon: <Shield size={20} />, color: '#10b981', bg: 'rgba(16,185,129,0.1)', title: 'Confidence Tracking', desc: 'AI measures hesitation, speaking speed, and willingness to respond — then builds your courage systematically.' },
  { icon: <Cpu size={20} />, color: '#0ea5e9', bg: 'rgba(14,165,233,0.1)', title: 'Listening Intelligence', desc: 'Train with real-world audio — podcasts, lectures, conversations — with AI comprehension feedback.' },
];

const ANALYTICS = [
  { label: 'Speaking Confidence', val: 82, color: '#6366f1', prev: 61 },
  { label: 'Grammar Accuracy', val: 91, color: '#10b981', prev: 74 },
  { label: 'Vocabulary Growth', val: 76, color: '#8b5cf6', prev: 52 },
  { label: 'Listening Score', val: 88, color: '#0ea5e9', prev: 67 },
  { label: 'Writing Quality', val: 79, color: '#ec4899', prev: 58 },
];

const TESTIMONIALS = [
  {
    name: 'Priya Sharma', role: 'Software Engineer', company: 'TCS → Google', avatar: 'PS',
    color: 'from-indigo-500 to-violet-500',
    text: 'I tried 4 other platforms and scored 6.5 twice. Lingoura AI analyzed my listening and showed me I was guessing instead of comprehending. Targeted it for 6 weeks — Band 8.0.',
    metric: '6.5 → 8.0', metricLabel: 'IELTS Band', stars: 5,
  },
  {
    name: 'James Okonkwo', role: 'Full-Stack Developer', company: 'London, UK', avatar: 'JO',
    color: 'from-violet-500 to-purple-500',
    text: 'My technical skills got me the interview but my English held me back. Lingoura AI mock interviews were brutal — in the best way. Got the role at a FAANG company after 3 weeks of daily practice.',
    metric: '3× faster', metricLabel: 'Interview success', stars: 5,
  },
  {
    name: 'Mei Zhang', role: 'MBA Student', company: 'University of Toronto', avatar: 'MZ',
    color: 'from-sky-500 to-cyan-500',
    text: 'Academic writing was my biggest weakness. The AI essay reviewer gave me feedback that my professors never did — specific, structured, and actionable. My grades improved within a month.',
    metric: 'C → A', metricLabel: 'Academic English', stars: 5,
  },
  {
    name: 'Rafael Santos', role: 'Product Manager', company: 'São Paulo → Amsterdam', avatar: 'RS',
    color: 'from-emerald-500 to-teal-500',
    text: 'Moving to Amsterdam I needed professional English fast. The business communication modules are unlike anything else — real scenarios, real vocabulary, real confidence built in 4 months.',
    metric: '+80%', metricLabel: 'Confidence score', stars: 5,
  },
  {
    name: 'Ananya Iyer', role: 'IELTS Aspirant', company: 'Bengaluru, India', avatar: 'AI',
    color: 'from-pink-500 to-rose-500',
    text: 'The pronunciation coach is incredible. I could finally hear exactly which sounds I was getting wrong. My speaking examiner commented on how natural my delivery sounded.',
    metric: '5.5 → 7.5', metricLabel: 'Speaking Band', stars: 5,
  },
  {
    name: 'David Kim', role: 'Data Analyst', company: 'Seoul → Toronto', avatar: 'DK',
    color: 'from-amber-500 to-orange-500',
    text: 'The spaced repetition vocabulary system is genius. I stopped forgetting words after just 2 weeks. My reading speed went up by 40% and my comprehension dramatically improved.',
    metric: '+40%', metricLabel: 'Reading speed', stars: 5,
  },
];

const PLANS = [
  {
    id: 'FREE',
    name: 'Free',
    tagline: 'Explore the platform',
    monthlyPrice: 0,
    annualPrice: 0,
    badge: null as string | null,
    icon: 'zap' as const,
    features: [
      '5 AI conversations / day',
      '2 speaking sessions / month',
      '1 mock IELTS test / month',
      '10 vocabulary words / day',
      'Basic progress dashboard',
      'Community forum access',
      'Gemini Flash AI model',
    ],
    notIncluded: ['Writing corrections', 'Advanced analytics', 'Personalized learning path'],
    cta: 'Start Free Forever',
    href: '/register',
    popular: false,
    ctaType: 'ghost' as const,
  },
  {
    id: 'PRO',
    name: 'Pro',
    tagline: 'For serious learners',
    monthlyPrice: 20,
    annualPrice: 15,
    monthlyPriceINR: 2277,   // $20 × ₹96.46 + 18% GST
    annualPriceINR: 1708,    // $15 × ₹96.46 + 18% GST
    badge: 'Most Popular' as string | null,
    icon: 'crown' as const,
    features: [
      '100 AI conversations / day',
      '30 speaking sessions / month',
      '10 full mock tests / month',
      '20 AI writing corrections / month',
      '50 vocabulary words / day',
      'Advanced analytics & insights',
      'Personalized AI learning path',
      'Priority email support',
      'GPT-4.1 + Claude Sonnet models',
      'Secure checkout via Stripe',
    ],
    notIncluded: [] as string[],
    cta: 'Get Started with Pro',
    href: '/register?plan=pro',
    popular: true,
    ctaType: 'primary' as const,
  },
  {
    id: 'ELITE',
    name: 'Elite',
    tagline: 'For intensive fluency transformation',
    monthlyPrice: 39,
    annualPrice: 29,
    monthlyPriceINR: 3199,
    annualPriceINR: 2499,
    badge: null as string | null,
    icon: 'flame' as const,
    features: [
      '300 AI conversations / day',
      '100 speaking sessions / month',
      '30 full mock IELTS tests / month',
      '100 AI writing corrections / month',
      'Unlimited vocabulary practice',
      'Advanced pronunciation scoring',
      'AI interview simulations',
      'AI career English coaching',
      'Full analytics suite',
      'Premium AI models + faster response',
      'Early access to new AI features',
      'Priority support',
      'Personalized weekly fluency reports',
    ],
    notIncluded: [] as string[],
    cta: 'Get Started with Elite',
    href: '/register?plan=elite',
    popular: false,
    ctaType: 'elite' as const,
  },
  {
    id: 'ENTERPRISE',
    name: 'Enterprise',
    tagline: 'For teams & institutions',
    monthlyPrice: null as number | null,
    annualPrice: null as number | null,
    badge: null as string | null,
    icon: 'building' as const,
    features: [
      'Everything in Pro',
      'Unlimited team members',
      'High-volume AI usage (fair use)',
      'Custom learning paths per team',
      'Admin dashboard & team analytics',
      'SSO & LDAP integration',
      'Dedicated account manager',
      'SLA & priority infrastructure',
      'Custom branding',
    ],
    notIncluded: [] as string[],
    cta: 'Contact Sales',
    href: 'mailto:sales@lingoura.ai',
    popular: false,
    ctaType: 'outline' as const,
  },
];

const COMPARE_ROWS = [
  { label: 'AI Conversations / day',      free: '5',    pro: '100',   ent: 'Custom' },
  { label: 'Speaking Sessions / month',   free: '2',    pro: '30',    ent: 'High-volume' },
  { label: 'Mock IELTS Tests / month',    free: '1',    pro: '10',    ent: 'Custom' },
  { label: 'Writing Corrections / month', free: '—',    pro: '20',    ent: 'Custom' },
  { label: 'Vocabulary Words / day',      free: '10',   pro: '50',    ent: 'Unlimited' },
  { label: 'AI Model Quality',            free: 'Flash',pro: 'Premium',ent: 'Premium' },
  { label: 'Advanced Analytics',          free: false,  pro: true,    ent: true },
  { label: 'Personalized Learning Path',  free: false,  pro: true,    ent: true },
  { label: 'Priority Support',            free: false,  pro: 'Email', ent: 'Dedicated' },
  { label: 'Team Management',             free: false,  pro: false,   ent: true },
  { label: 'SSO / LDAP',                  free: false,  pro: false,   ent: true },
  { label: 'Custom Branding',             free: false,  pro: false,   ent: true },
];

const TRUST_NUMBERS = [
  { val: '10,000+', label: 'Active Learners' },
  { val: '4.9★',    label: 'Average Rating' },
  { val: '97%',     label: 'Satisfaction Rate' },
  { val: '+1.2 Bands', label: 'Avg. IELTS Improvement' },
];

const FAQS = [
  { q: 'Can I cancel my plan anytime?', a: 'Yes — cancel from your account settings with one click. You keep full access until the end of your current billing period. No questions asked, no lock-in, no cancellation fees.' },
  { q: 'What AI models do I get on each plan?', a: 'Free users get Gemini Flash. Pro users access GPT-4.1 and Claude Sonnet. Elite users get Premium+ priority models — faster responses and the latest AI capabilities including advanced pronunciation scoring.' },
  { q: 'Is Lingoura AI only for IELTS preparation?', a: 'No. While IELTS prep is a core use case, Lingoura AI is a complete English fluency platform for professionals, students, and global communicators — covering Speaking, Listening, Reading, Writing, and Vocabulary.' },
  { q: 'How does the AI evaluate my speaking?', a: 'Our AI analyzes pronunciation at the phoneme level, fluency (speaking speed, pauses, hesitation), vocabulary range, grammar, and coherence — aligned with official IELTS Band descriptors and Cambridge English standards.' },
  { q: 'What happens when I hit my usage limit?', a: 'You\'ll see a clear notification when you\'re close and when you\'ve reached the limit. You can wait for the monthly reset or upgrade instantly. We never cut off access mid-session.' },
  { q: 'What payment methods are accepted?', a: 'All major credit/debit cards via Stripe. India users can also pay via Razorpay (UPI, NetBanking, cards). Annual plans save you 21% compared to monthly billing.' },
];

// ─── Global CSS ───────────────────────────────────────────────────────────────

function GlobalCSS({ isDark }: { isDark: boolean }) {
  return (
    <style>{`
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

      :root {
        --bg: ${isDark ? '#030711' : '#F4F5FB'};
        --bg2: ${isDark ? '#080C18' : '#ECEEF8'};
        --ink: ${isDark ? '#F1F5F9' : '#0F172A'};
        --ink2: ${isDark ? '#94A3B8' : '#475569'};
        --ink3: ${isDark ? '#475569' : '#94A3B8'};
        --card: ${isDark ? 'rgba(255,255,255,0.035)' : 'rgba(255,255,255,0.85)'};
        --card-border: ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(99,102,241,0.1)'};
        --card-shadow: ${isDark ? 'none' : '0 4px 32px rgba(99,102,241,0.07), 0 1px 4px rgba(0,0,0,0.06)'};
        --nav-bg: ${isDark ? 'rgba(3,7,17,0.85)' : 'rgba(244,245,251,0.85)'};
        --label-bg: ${isDark ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.08)'};
        --label-border: ${isDark ? 'rgba(99,102,241,0.25)' : 'rgba(99,102,241,0.2)'};
        --label-color: ${isDark ? '#818cf8' : '#4f46e5'};
        --muted-text: ${isDark ? '#64748b' : '#64748b'};
        --feat-hover-border: ${isDark ? 'rgba(255,255,255,0.13)' : 'rgba(99,102,241,0.25)'};
        --section-sub: ${isDark ? '#64748b' : '#6b7280'};
      }

      html { scroll-behavior: smooth; }

      .lp {
        font-family: 'Manrope', system-ui, -apple-system, sans-serif;
        background: var(--bg);
        color: var(--ink);
        -webkit-font-smoothing: antialiased;
        overflow-x: hidden;
        position: relative;
      }

      /* ── Scrollbar ── */
      .lp::-webkit-scrollbar { width: 4px; }
      .lp::-webkit-scrollbar-track { background: transparent; }
      .lp::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.4); border-radius: 9999px; }

      /* ── Gradient text ── */
      .grad-text {
        background: linear-gradient(135deg, #818cf8 0%, #a78bfa 40%, #f472b6 100%);
        -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
      }

      /* ── Global floating background ── */
      .global-bg {
        position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden;
      }
      .global-orb {
        position: absolute; border-radius: 50%; filter: blur(120px); pointer-events: none;
      }

      /* ── Layout ── */
      .container { max-width: 1200px; margin: 0 auto; padding: 0 clamp(16px, 4vw, 32px); }
      .container-lg { max-width: 1360px; margin: 0 auto; padding: 0 clamp(16px, 4vw, 32px); }
      .section { padding: clamp(72px, 10vw, 120px) 0; position: relative; }

      /* ── Typography ── */
      .section-label {
        display: inline-flex; align-items: center; gap: 8px;
        font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;
        color: var(--label-color); background: var(--label-bg); border: 1px solid var(--label-border);
        padding: 5px 14px; border-radius: 999px; margin-bottom: 20px;
      }
      .section-h {
        font-size: clamp(1.875rem, 4.5vw, 3.25rem); font-weight: 900;
        line-height: 1.08; letter-spacing: -0.035em; color: var(--ink);
      }
      .section-sub {
        font-size: clamp(0.9375rem, 2vw, 1.0625rem);
        color: var(--section-sub); line-height: 1.75; max-width: 560px; margin: 16px auto 0;
      }

      /* ── Card ── */
      .card {
        background: var(--card);
        border: 1px solid var(--card-border);
        backdrop-filter: blur(16px);
        box-shadow: var(--card-shadow);
        border-radius: 20px;
      }
      .card-lg { border-radius: 28px; }

      /* ── Glass ── */
      .glass {
        background: ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.7)'};
        border: 1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.9)'};
        backdrop-filter: blur(20px);
        box-shadow: ${isDark ? 'none' : '0 4px 24px rgba(0,0,0,0.06)'};
      }

      /* ── Nav links ── */
      .nav-link {
        font-size: 13.5px; font-weight: 600; color: var(--ink2);
        text-decoration: none; transition: color 0.15s; position: relative; padding-bottom: 2px;
      }
      .nav-link:hover { color: var(--ink); }
      .nav-link::after {
        content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 1.5px;
        background: linear-gradient(90deg, #6366f1, #a78bfa);
        transform: scaleX(0); transform-origin: center; transition: transform 0.2s ease;
      }
      .nav-link:hover::after { transform: scaleX(1); }

      /* ── Buttons ── */
      .btn-primary {
        display: inline-flex; align-items: center; gap: 8px;
        padding: clamp(12px, 2vw, 14px) clamp(20px, 3vw, 28px);
        border-radius: 14px; font-weight: 700; font-size: clamp(13px, 1.5vw, 15px);
        color: #fff; text-decoration: none; cursor: pointer; border: none;
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        box-shadow: 0 8px 32px -8px rgba(99,102,241,0.55);
        transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
        white-space: nowrap;
      }
      .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 40px -8px rgba(99,102,241,0.65); }
      .btn-primary:active { transform: translateY(0); }

      .btn-ghost {
        display: inline-flex; align-items: center; gap: 8px;
        padding: clamp(11px, 2vw, 13px) clamp(18px, 3vw, 24px);
        border-radius: 14px; font-weight: 700; font-size: clamp(13px, 1.5vw, 15px);
        color: var(--ink2); background: transparent; cursor: pointer;
        border: 1.5px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(99,102,241,0.2)'};
        transition: all 0.2s; white-space: nowrap; text-decoration: none;
      }
      .btn-ghost:hover {
        border-color: ${isDark ? 'rgba(255,255,255,0.25)' : 'rgba(99,102,241,0.4)'};
        color: var(--ink);
        background: ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(99,102,241,0.05)'};
      }

      /* ── Feature card ── */
      .feat-card {
        transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
        cursor: default;
      }
      .feat-card:hover {
        transform: translateY(-4px);
        border-color: var(--feat-hover-border) !important;
        box-shadow: ${isDark ? '0 20px 40px -12px rgba(99,102,241,0.15)' : '0 16px 40px -8px rgba(99,102,241,0.12)'} !important;
      }

      /* ── Skill bar ── */
      .skill-bar-bg {
        height: 5px; border-radius: 999px;
        background: ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(99,102,241,0.08)'};
        overflow: hidden;
      }

      /* ── Step card hover ── */
      .step-card { transition: transform 0.25s, box-shadow 0.25s; }
      .step-card:hover { transform: translateY(-4px); }

      /* ── FAQ ── */
      .faq-item {
        border-bottom: 1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(99,102,241,0.1)'};
      }

      /* ── Testimonial card ── */
      .testi-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
      .testi-card:hover {
        transform: translateY(-6px);
        box-shadow: ${isDark ? '0 24px 48px -12px rgba(0,0,0,0.5)' : '0 24px 48px -12px rgba(99,102,241,0.15)'} !important;
      }

      /* ── Animations ── */
      @keyframes orbFloat {
        0%, 100% { transform: translateY(0) scale(1) rotate(0deg); }
        33% { transform: translateY(-30px) scale(1.04) rotate(2deg); }
        66% { transform: translateY(-12px) scale(0.97) rotate(-1deg); }
      }
      @keyframes floatY {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      @keyframes pulseDot {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.4; transform: scale(0.75); }
      }
      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      @keyframes marquee {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      @keyframes glowPulse {
        0%, 100% { opacity: 0.6; }
        50% { opacity: 1; }
      }

      .orb-float { animation: orbFloat 14s ease-in-out infinite; }
      .float { animation: floatY 5s ease-in-out infinite; }
      .pulse-dot { animation: pulseDot 1.8s ease-in-out infinite; }
      .glow-pulse { animation: glowPulse 3s ease-in-out infinite; }

      /* ── Marquee ── */
      .marquee-track { animation: marquee 28s linear infinite; display: flex; width: max-content; }
      .marquee-track:hover { animation-play-state: paused; }
      .marquee-wrap { overflow: hidden; mask-image: linear-gradient(to right, transparent, black 12%, black 88%, transparent); -webkit-mask-image: linear-gradient(to right, transparent, black 12%, black 88%, transparent); }

      /* ── Plan card ── */
      .plan-popular {
        background: linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.06));
        box-shadow: 0 0 0 1px rgba(99,102,241,0.35), 0 20px 60px -20px rgba(99,102,241,0.3);
      }
      .plan-card { transition: transform 0.25s, box-shadow 0.25s; }
      .plan-card:hover { transform: translateY(-4px); }

      /* ── Video container ── */
      .video-glow {
        position: absolute; inset: -2px; border-radius: 26px; z-index: -1;
        background: linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899);
        filter: blur(20px); opacity: 0.5;
        animation: glowPulse 3s ease-in-out infinite;
      }

      /* ── Responsive ── */
      .hide-mobile { display: flex !important; }
      .show-mobile { display: none !important; }

      @media (max-width: 768px) {
        .hide-mobile { display: none !important; }
        .show-mobile { display: flex !important; }
        .mobile-col { flex-direction: column !important; }
        .mobile-full { width: 100% !important; }
        .mobile-center { text-align: center !important; justify-content: center !important; }
        .mobile-stack { grid-template-columns: 1fr !important; }
        .mobile-2col { grid-template-columns: 1fr 1fr !important; }
        .mobile-gap { gap: 16px !important; }
      }
      @media (max-width: 480px) {
        .mobile-2col { grid-template-columns: 1fr !important; }
      }
      @media (min-width: 769px) and (max-width: 1024px) {
        .tablet-2col { grid-template-columns: 1fr 1fr !important; }
      }
    `}</style>
  );
}

// ─── Global Floating Background ───────────────────────────────────────────────

function GlobalBackground({ isDark }: { isDark: boolean }) {
  return (
    <div className="global-bg">
      {isDark ? (
        <>
          <div className="global-orb orb-float" style={{ width: 900, height: 900, background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)', top: -200, left: -200 }} />
          <div className="global-orb orb-float" style={{ width: 700, height: 700, background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)', top: '30%', right: -150, animationDelay: '-5s' }} />
          <div className="global-orb orb-float" style={{ width: 600, height: 600, background: 'radial-gradient(circle, rgba(236,72,153,0.04) 0%, transparent 70%)', bottom: '10%', left: '20%', animationDelay: '-9s' }} />
          <div className="global-orb orb-float" style={{ width: 500, height: 500, background: 'radial-gradient(circle, rgba(14,165,233,0.04) 0%, transparent 70%)', bottom: -100, right: '10%', animationDelay: '-12s' }} />
        </>
      ) : (
        <>
          <div className="global-orb orb-float" style={{ width: 800, height: 800, background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)', top: -200, left: -200 }} />
          <div className="global-orb orb-float" style={{ width: 600, height: 600, background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)', top: '25%', right: -100, animationDelay: '-5s' }} />
          <div className="global-orb orb-float" style={{ width: 500, height: 500, background: 'radial-gradient(circle, rgba(14,165,233,0.05) 0%, transparent 70%)', bottom: '20%', left: '10%', animationDelay: '-9s' }} />
        </>
      )}
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar({ isDark, toggleTheme }: { isDark: boolean; toggleTheme: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const borderColor = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(99,102,241,0.1)';

  return (
    <>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        transition: 'background 0.3s, box-shadow 0.3s',
        background: scrolled ? (isDark ? 'rgba(3,7,17,0.9)' : 'rgba(244,245,251,0.9)') : 'transparent',
        backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
        borderBottom: scrolled ? `1px solid ${borderColor}` : '1px solid transparent',
        boxShadow: scrolled ? (isDark ? '0 4px 40px rgba(0,0,0,0.3)' : '0 4px 32px rgba(99,102,241,0.08)') : 'none',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', height: 68, gap: 0 }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none', marginRight: 36, flexShrink: 0 }}>
            <img src="/logo-icon.png" alt="Lingoura AI" style={{ height: 34, width: 'auto', objectFit: 'contain' }} />
            <span style={{ fontSize: 17, fontWeight: 900, letterSpacing: '-0.025em' }}>
              <span style={{ color: '#7c3aed' }}>Lingoura</span>
              <span style={{ background: 'linear-gradient(to right, #7c3aed, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}> AI</span>
            </span>
          </Link>

          {/* Nav links desktop */}
          <nav className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: 24, flex: 1 }}>
            {NAV_LINKS.map(l => <Link key={l.label} href={l.href} className="nav-link">{l.label}</Link>)}
          </nav>

          {/* Right CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
            <button onClick={toggleTheme} style={{
              width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(99,102,241,0.07)',
              border: `1px solid ${borderColor}`, color: isDark ? '#94a3b8' : '#6366f1', cursor: 'pointer',
              transition: 'all 0.2s',
            }}>
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <Link href="/login" className="nav-link hide-mobile" style={{ padding: '8px 14px', borderRadius: 10 }}>Sign In</Link>
            {/* Premium CTA — matches pricing gradient */}
            <Link href="/register" className="hide-mobile" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 13, fontWeight: 800,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 60%, #a855f7 100%)',
              color: '#fff', textDecoration: 'none',
              padding: '9px 20px', borderRadius: 12,
              boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
              transition: 'transform 0.15s, box-shadow 0.15s',
              whiteSpace: 'nowrap',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 28px rgba(99,102,241,0.5)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(99,102,241,0.4)'; }}
            >
              <Zap size={13} style={{ fill: 'currentColor' }} /> Get Pro Access
            </Link>
            {/* Mobile hamburger */}
            <button
              className="show-mobile"
              onClick={() => setMobileOpen(v => !v)}
              style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center', background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(99,102,241,0.07)', border: `1px solid ${borderColor}`, borderRadius: 10, color: isDark ? '#94a3b8' : '#6366f1', cursor: 'pointer' }}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, zIndex: 190, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              style={{
                position: 'fixed', top: 0, right: 0, bottom: 0, width: 'min(320px, 85vw)', zIndex: 200,
                background: isDark ? 'rgba(8,12,24,0.98)' : 'rgba(244,245,251,0.98)',
                backdropFilter: 'blur(24px)',
                borderLeft: `1px solid ${borderColor}`,
                display: 'flex', flexDirection: 'column', padding: '24px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 32 }}>
                <button onClick={() => setMobileOpen(false)} style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)', border: 'none', cursor: 'pointer', color: isDark ? '#94a3b8' : '#6b7280' }}>
                  <X size={18} />
                </button>
              </div>
              <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {NAV_LINKS.map(l => (
                  <Link key={l.label} href={l.href} onClick={() => setMobileOpen(false)}
                    style={{ display: 'block', padding: '14px 16px', borderRadius: 12, fontSize: 16, fontWeight: 700, color: isDark ? '#cbd5e1' : '#374151', textDecoration: 'none', transition: 'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(99,102,241,0.07)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 24, borderTop: `1px solid ${borderColor}` }}>
                <Link href="/login" onClick={() => setMobileOpen(false)} style={{ width: '100%', textAlign: 'center', padding: '13px', borderRadius: 12, border: `1.5px solid ${borderColor}`, color: isDark ? '#cbd5e1' : '#374151', fontWeight: 700, textDecoration: 'none', fontSize: 15 }}>Sign In</Link>
                <Link href="/register" onClick={() => setMobileOpen(false)} style={{ width: '100%', textAlign: 'center', padding: '13px', borderRadius: 12, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontWeight: 800, textDecoration: 'none', fontSize: 15, boxShadow: '0 4px 20px rgba(99,102,241,0.4)' }}>
                  Get Pro Access
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function SkillBar({ label, score, color, delay }: { label: string; score: number; color: string; delay: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8' }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color }}>{score}%</span>
      </div>
      <div className="skill-bar-bg">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${score}%` } : {}}
          transition={{ duration: 1.3, delay, ease: [0.22, 1, 0.36, 1] }}
          style={{ height: '100%', borderRadius: 999, background: `linear-gradient(90deg, ${color}88, ${color})` }}
        />
      </div>
    </div>
  );
}

function HeroDashboard() {
  return (
    <div className="float" style={{ position: 'relative', maxWidth: 400, width: '100%' }}>
      <div style={{ position: 'absolute', inset: -1, borderRadius: 28, background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.2), rgba(236,72,153,0.15))', filter: 'blur(24px)', opacity: 0.6 }} className="glow-pulse" />
      <div style={{ background: 'rgba(12,16,30,0.88)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(24px)', borderRadius: 24, padding: 24, position: 'relative', overflow: 'hidden' }}>
        {/* shimmer overlay */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100%', overflow: 'hidden', borderRadius: 24, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100%', background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)', animation: 'shimmer 3s ease-in-out infinite' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900, color: '#fff' }}>PS</div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>Priya S.</p>
              <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>IELTS Target: Band 8.0</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 999, padding: '3px 9px' }}>
            <span className="pulse-dot" style={{ width: 5, height: 5, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: '#10b981' }}>Live AI Session</span>
          </div>
        </div>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#475569', marginBottom: 14 }}>Skill Assessment</p>
        <SkillBar label="Speaking" score={78} color="#6366f1" delay={0.1} />
        <SkillBar label="Listening" score={84} color="#8b5cf6" delay={0.2} />
        <SkillBar label="Reading" score={91} color="#0ea5e9" delay={0.3} />
        <SkillBar label="Writing" score={67} color="#ec4899" delay={0.4} />
        <div style={{ marginTop: 18, padding: '11px 14px', background: 'rgba(236,72,153,0.08)', border: '1px solid rgba(236,72,153,0.2)', borderRadius: 12 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#f472b6', margin: '0 0 3px' }}>⚡ AI Insight</p>
          <p style={{ fontSize: 12, color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>Writing is your weakest skill. Focus: Task 2 essay coherence will add +0.5 bands.</p>
        </div>
        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 14px', background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 12 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8' }}>Predicted IELTS Band</span>
          <span style={{ fontSize: 22, fontWeight: 900, background: 'linear-gradient(135deg,#818cf8,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>7.5</span>
        </div>
      </div>
      {/* Floating badges */}
      <div style={{ position: 'absolute', top: -18, right: -20, background: 'rgba(12,16,30,0.85)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(16px)', borderRadius: 12, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
        <Flame size={13} style={{ color: '#f59e0b' }} />
        <span style={{ fontSize: 12, fontWeight: 700, color: '#f1f5f9', whiteSpace: 'nowrap' }}>21-day streak 🔥</span>
      </div>
      <div style={{ position: 'absolute', bottom: -18, left: -20, background: 'rgba(12,16,30,0.85)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(16px)', borderRadius: 12, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
        <TrendingUp size={13} style={{ color: '#10b981' }} />
        <span style={{ fontSize: 12, fontWeight: 700, color: '#f1f5f9', whiteSpace: 'nowrap' }}>+0.5 Band this week</span>
      </div>
    </div>
  );
}

function Hero({ isDark }: { isDark: boolean }) {
  return (
    <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: 88, paddingBottom: 64, position: 'relative', zIndex: 1 }}>
      <div className="container-lg">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 480px), 1fr))', gap: 'clamp(40px, 6vw, 96px)', alignItems: 'center' }}>
          {/* Left */}
          <div>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 999, padding: '5px 14px', marginBottom: 24 }}>
                <span className="pulse-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: '#818cf8', display: 'inline-block' }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: '#818cf8', letterSpacing: '0.04em' }}>AI-Powered English Fluency Platform</span>
              </div>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              style={{ fontSize: 'clamp(2.2rem, 5.5vw, 3.9rem)', fontWeight: 900, lineHeight: 1.07, letterSpacing: '-0.035em', marginBottom: 22, color: isDark ? '#f1f5f9' : '#0f172a' }}
            >
              Master Real English<br />
              <span className="grad-text">Fluency With Your</span><br />
              Personal AI Mentor
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.22 }}
              style={{ fontSize: 'clamp(15px, 2vw, 17px)', color: isDark ? '#64748b' : '#6b7280', lineHeight: 1.75, marginBottom: 32, maxWidth: 480 }}>
              Improve <strong style={{ color: isDark ? '#94a3b8' : '#374151' }}>Speaking, Listening, Writing, and Reading</strong> with adaptive AI coaching — built for IELTS learners, professionals, and global communicators.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.32 }}
              style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 40 }}>
              <Link href="/register" className="btn-primary">Start Free — No Card Needed <ArrowRight size={15} /></Link>
              <a href="#demo" className="btn-ghost"><Play size={14} style={{ fill: 'currentColor' }} /> Watch 90s Demo</a>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.5 }}
              style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
              {[
                { icon: <Users size={13} />, text: '10,000+ Active Learners' },
                { icon: <Award size={13} />, text: '97% Satisfaction Rate' },
                { icon: <Shield size={13} />, text: 'Cancel Anytime' },
              ].map(b => (
                <div key={b.text} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: '#6366f1' }}>{b.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: isDark ? '#475569' : '#6b7280' }}>{b.text}</span>
                </div>
              ))}
            </motion.div>
          </div>
          {/* Right — dashboard preview */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '32px 0' }}
            className="hide-mobile">
            <HeroDashboard />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Trusted By (Marquee) ────────────────────────────────────────────────────

function TrustedBy({ isDark }: { isDark: boolean }) {
  const doubled = [...TRUSTED_BRANDS, ...TRUSTED_BRANDS];
  return (
    <section style={{ paddingTop: 48, paddingBottom: 64, position: 'relative', zIndex: 1 }}>
      <div className="container" style={{ textAlign: 'center', marginBottom: 32 }}>
        <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: isDark ? '#334155' : '#94a3b8' }}>
          Trusted by learners at leading companies & institutions
        </p>
      </div>
      <div className="marquee-wrap">
        <div className="marquee-track" style={{ gap: 0 }}>
          {doubled.map((brand, i) => (
            <div key={i} style={{
              padding: '0 32px',
              display: 'flex', alignItems: 'center',
              fontSize: 14, fontWeight: 800, letterSpacing: '-0.01em',
              color: isDark ? 'rgba(148,163,184,0.35)' : 'rgba(71,85,105,0.3)',
              whiteSpace: 'nowrap',
              transition: 'color 0.2s',
              userSelect: 'none',
            }}>
              {brand}
              <span style={{ display: 'inline-block', width: 4, height: 4, borderRadius: '50%', background: isDark ? 'rgba(99,102,241,0.25)' : 'rgba(99,102,241,0.2)', marginLeft: 32 }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────

function StatsBar({ isDark }: { isDark: boolean }) {
  const stats = [
    { val: 10000, suffix: '+', label: 'Active Learners', icon: <Users size={20} /> },
    { val: 97, suffix: '%', label: 'Satisfaction Rate', icon: <Award size={20} /> },
    { val: 40, suffix: '+', label: 'Countries Served', icon: <Globe size={20} /> },
    { val: 1, suffix: '.5 Bands', label: 'Avg. IELTS Gain', icon: <TrendingUp size={20} /> },
  ];
  return (
    <section style={{ paddingTop: 32, paddingBottom: 80, position: 'relative', zIndex: 1 }}>
      <div className="container">
        <div className="card card-lg" style={{ padding: 'clamp(24px, 4vw, 48px)' }}>
          <StaggerChildren>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 24 }}>
              {stats.map((s, i) => (
                <AnimChild key={s.label}>
                  <div style={{ textAlign: 'center', padding: '8px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10, color: '#6366f1' }}>{s.icon}</div>
                    <div style={{ fontSize: 'clamp(24px, 4vw, 34px)', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: 4, background: 'linear-gradient(135deg,#818cf8,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      <Counter to={s.val} suffix={s.suffix} />
                    </div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: isDark ? '#475569' : '#6b7280', margin: 0 }}>{s.label}</p>
                  </div>
                </AnimChild>
              ))}
            </div>
          </StaggerChildren>
        </div>
      </div>
    </section>
  );
}

// ─── Skills Section ───────────────────────────────────────────────────────────

function SkillsSection({ isDark }: { isDark: boolean }) {
  const [active, setActive] = useState(0);
  const skill = SKILLS[active];
  return (
    <section className="section" id="skills" style={{ position: 'relative', zIndex: 1 }}>
      <div className="container">
        <FadeIn>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="section-label">The 4 Pillars</span>
            <h2 className="section-h">Real Fluency Is<br /><span className="grad-text">More Than Just Speaking</span></h2>
            <p className="section-sub">Most learners focus only on speaking and wonder why they still struggle. True English mastery requires all four core skills — and our AI coaches every single one.</p>
          </div>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 48, flexWrap: 'wrap' }}>
            {SKILLS.map((s, i) => (
              <button key={i} onClick={() => setActive(i)} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 20px', borderRadius: 12, cursor: 'pointer', fontSize: 14, fontWeight: 700,
                border: `1.5px solid ${active === i ? 'rgba(99,102,241,0.5)' : (isDark ? 'rgba(255,255,255,0.07)' : 'rgba(99,102,241,0.12)')}`,
                background: active === i ? (isDark ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.08)') : 'transparent',
                color: active === i ? '#818cf8' : (isDark ? '#64748b' : '#94a3b8'),
                transition: 'all 0.2s',
              }}>
                {s.icon}{s.title}
              </button>
            ))}
          </div>
        </FadeIn>
        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.4 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 440px), 1fr))', gap: 24 }}>
              {/* Left */}
              <div className="card card-lg" style={{ padding: 'clamp(24px, 4vw, 40px)' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 8, padding: '4px 12px', fontSize: 11, fontWeight: 700, color: '#818cf8', marginBottom: 20, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {skill.badge}
                </div>
                <h3 style={{ fontSize: 'clamp(22px, 3vw, 28px)', fontWeight: 900, color: isDark ? '#f1f5f9' : '#0f172a', marginBottom: 12 }}>{skill.title}</h3>
                <p style={{ fontSize: 15, color: isDark ? '#64748b' : '#6b7280', lineHeight: 1.7, marginBottom: 24 }}>{skill.desc}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
                  {skill.points.map(p => (
                    <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Check size={15} style={{ color: '#10b981', flexShrink: 0 }} />
                      <span style={{ fontSize: 14, fontWeight: 600, color: isDark ? '#94a3b8' : '#374151' }}>{p}</span>
                    </div>
                  ))}
                </div>
                <div style={{ padding: '14px 18px', background: isDark ? 'rgba(16,185,129,0.08)' : 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, color: isDark ? '#64748b' : '#6b7280', fontWeight: 600 }}>{skill.stat.label}</span>
                  <span style={{ fontSize: 22, fontWeight: 900, color: '#10b981' }}>{skill.stat.val}</span>
                </div>
              </div>
              {/* Right — AI features */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {AI_FEATURES.map((f, i) => (
                  <div key={f.title} className="card feat-card" style={{ padding: 20 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8', marginBottom: 12 }}>{f.icon}</div>
                    <p style={{ fontSize: 13, fontWeight: 800, color: isDark ? '#f1f5f9' : '#0f172a', marginBottom: 6, lineHeight: 1.3 }}>{f.title}</p>
                    <p style={{ fontSize: 12, color: isDark ? '#64748b' : '#6b7280', lineHeight: 1.55 }}>{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────

function HowItWorks({ isDark }: { isDark: boolean }) {
  return (
    <section className="section" id="how" style={{ position: 'relative', zIndex: 1 }}>
      <div className="container">
        <FadeIn>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="section-label">Get Started</span>
            <h2 className="section-h">From Zero to Fluent<br /><span className="grad-text">in 6 Simple Steps</span></h2>
            <p className="section-sub">A structured journey designed to maximize improvement from your very first session.</p>
          </div>
        </FadeIn>
        <StaggerChildren>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 20 }}>
            {STEPS.map((s, i) => (
              <AnimChild key={s.n}>
                <div className="card card-lg step-card" style={{ padding: 28, height: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8', flexShrink: 0 }}>{s.icon}</div>
                    <span style={{ fontSize: 13, fontWeight: 900, color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)', letterSpacing: '-0.02em' }}>{s.n}</span>
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: isDark ? '#f1f5f9' : '#0f172a', marginBottom: 8 }}>{s.title}</h3>
                  <p style={{ fontSize: 13, color: isDark ? '#64748b' : '#6b7280', lineHeight: 1.65 }}>{s.desc}</p>
                </div>
              </AnimChild>
            ))}
          </div>
        </StaggerChildren>
      </div>
    </section>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────

function FeaturesSection({ isDark }: { isDark: boolean }) {
  return (
    <section className="section" id="features" style={{ position: 'relative', zIndex: 1 }}>
      <div className="container">
        <FadeIn>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="section-label">Platform Capabilities</span>
            <h2 className="section-h">Everything You Need<br /><span className="grad-text">To Master English</span></h2>
            <p className="section-sub">Ten precision-built AI tools working together to accelerate your English fluency journey.</p>
          </div>
        </FadeIn>
        <StaggerChildren>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))', gap: 16 }}>
            {FEATURES.map((f, i) => (
              <AnimChild key={f.title}>
                <div className="card feat-card" style={{ padding: 24, height: '100%' }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: f.color, marginBottom: 16 }}>{f.icon}</div>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: isDark ? '#f1f5f9' : '#0f172a', marginBottom: 8, lineHeight: 1.3 }}>{f.title}</h3>
                  <p style={{ fontSize: 13, color: isDark ? '#64748b' : '#6b7280', lineHeight: 1.65 }}>{f.desc}</p>
                </div>
              </AnimChild>
            ))}
          </div>
        </StaggerChildren>
      </div>
    </section>
  );
}

// ─── Demo Video ───────────────────────────────────────────────────────────────

function DemoVideo({ isDark }: { isDark: boolean }) {
  const [playing, setPlaying] = useState(false);
  return (
    <section className="section" id="demo" style={{ position: 'relative', zIndex: 1 }}>
      <div className="container" style={{ maxWidth: 900 }}>
        <FadeIn>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span className="section-label"><Play size={11} style={{ fill: 'currentColor' }} /> Watch Demo</span>
            <h2 className="section-h">See How AI Builds<br /><span className="grad-text">Your English Fluency</span></h2>
            <p className="section-sub">Watch how learners improve speaking, writing, listening, and confidence using adaptive AI coaching.</p>
          </div>
        </FadeIn>
        <FadeIn delay={0.15}>
          <div style={{ position: 'relative', borderRadius: 24, overflow: 'hidden' }}>
            <div className="video-glow" />
            <div style={{ position: 'relative', paddingBottom: '56.25%', background: isDark ? '#0c1120' : '#1a1f35', borderRadius: 22, border: `1px solid ${isDark ? 'rgba(99,102,241,0.25)' : 'rgba(99,102,241,0.3)'}`, overflow: 'hidden' }}>
              {!playing ? (
                <button
                  onClick={() => setPlaying(true)}
                  style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', gap: 20 }}
                >
                  {/* thumbnail gradient */}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.06) 50%, rgba(236,72,153,0.05) 100%)' }} />
                  <div style={{ position: 'absolute', inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: '32px 32px' }} />
                  {/* Floating UI mockup */}
                  <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
                      {[{ l: 'Speaking', v: '78%', c: '#6366f1' }, { l: 'Writing', v: '91%', c: '#10b981' }, { l: 'Band Pred.', v: '7.5', c: '#8b5cf6' }].map(m => (
                        <div key={m.l} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '12px 20px', textAlign: 'center', backdropFilter: 'blur(12px)' }}>
                          <div style={{ fontSize: 22, fontWeight: 900, color: m.c }}>{m.v}</div>
                          <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', marginTop: 2 }}>{m.l}</div>
                        </div>
                      ))}
                    </div>
                    <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.96 }}
                      style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 12px rgba(99,102,241,0.15), 0 0 0 24px rgba(99,102,241,0.07)', cursor: 'pointer' }}>
                      <Play size={28} style={{ fill: '#fff', color: '#fff', marginLeft: 4 }} />
                    </motion.div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>Click to watch the 90-second demo</p>
                  </div>
                </button>
              ) : (
                <iframe
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── Analytics Section ────────────────────────────────────────────────────────

function AnalyticsSection({ isDark }: { isDark: boolean }) {
  return (
    <section className="section" style={{ position: 'relative', zIndex: 1 }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 440px), 1fr))', gap: 40, alignItems: 'center' }}>
          <FadeIn>
            <span className="section-label">Real Outcomes</span>
            <h2 className="section-h" style={{ marginBottom: 16 }}>Progress You Can<br /><span className="grad-text">See & Measure</span></h2>
            <p style={{ fontSize: 15, color: isDark ? '#64748b' : '#6b7280', lineHeight: 1.75, marginBottom: 32, maxWidth: 420 }}>
              Every session generates measurable data across all 5 key fluency dimensions. Watch your scores climb in real time.
            </p>
            <div style={{ display: 'flex', gap: 20 }}>
              <Link href="/register" className="btn-primary">Start Improving Today <ArrowRight size={14} /></Link>
            </div>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div className="card card-lg" style={{ padding: 'clamp(24px, 4vw, 36px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
                <p style={{ fontSize: 14, fontWeight: 800, color: isDark ? '#f1f5f9' : '#0f172a' }}>Fluency Metrics</p>
                <div style={{ display: 'flex', gap: 16 }}>
                  {[{ label: 'Before', color: isDark ? '#1e293b' : '#e2e8f0' }, { label: 'After', color: '#6366f1' }].map(l => (
                    <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 3, background: l.color }} />
                      <span style={{ fontSize: 11, fontWeight: 600, color: isDark ? '#64748b' : '#94a3b8' }}>{l.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              {ANALYTICS.map((a, i) => {
                const ref = useRef(null);
                const inView = useInView(ref, { once: true });
                return (
                  <div key={a.label} ref={ref} style={{ marginBottom: i < ANALYTICS.length - 1 ? 24 : 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: isDark ? '#94a3b8' : '#374151' }}>{a.label}</span>
                      <div style={{ display: 'flex', gap: 12 }}>
                        <span style={{ fontSize: 12, color: isDark ? '#475569' : '#94a3b8', fontWeight: 600 }}>{a.prev}%</span>
                        <span style={{ fontSize: 12, fontWeight: 800, color: a.color }}>{a.val}%</span>
                      </div>
                    </div>
                    <div style={{ height: 6, borderRadius: 999, background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', overflow: 'hidden', position: 'relative' }}>
                      <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${a.prev}%`, borderRadius: 999, background: isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0' }} />
                      <motion.div initial={{ width: 0 }} animate={inView ? { width: `${a.val}%` } : {}} transition={{ duration: 1.3, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                        style={{ position: 'absolute', left: 0, top: 0, height: '100%', borderRadius: 999, background: `linear-gradient(90deg, ${a.color}88, ${a.color})` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

function Testimonials({ isDark }: { isDark: boolean }) {
  return (
    <section className="section" id="testimonials" style={{ position: 'relative', zIndex: 1 }}>
      <div className="container">
        <FadeIn>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="section-label"><Star size={11} /> Real Results</span>
            <h2 className="section-h">Learners Who Changed<br /><span className="grad-text">Their Lives With AI</span></h2>
            <p className="section-sub">Thousands of real learners — professionals, students, immigrants — who levelled up with Lingoura AI.</p>
          </div>
        </FadeIn>
        <StaggerChildren>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))', gap: 20 }}>
            {TESTIMONIALS.map((t, i) => (
              <AnimChild key={t.name}>
                <div className="card testi-card" style={{
                  padding: 28, height: '100%', display: 'flex', flexDirection: 'column', gap: 20,
                  background: isDark ? 'rgba(255,255,255,0.035)' : 'rgba(255,255,255,0.9)',
                  boxShadow: isDark ? 'none' : '0 4px 32px rgba(99,102,241,0.07), 0 1px 4px rgba(0,0,0,0.05)',
                }}>
                  {/* Stars */}
                  <div style={{ display: 'flex', gap: 3 }}>
                    {Array.from({ length: t.stars }).map((_, si) => <Star key={si} size={14} style={{ fill: '#f59e0b', color: '#f59e0b' }} />)}
                  </div>
                  {/* Quote */}
                  <p style={{ fontSize: 14, color: isDark ? '#94a3b8' : '#475569', lineHeight: 1.72, flex: 1, fontStyle: 'italic' }}>"{t.text}"</p>
                  {/* Metric pill */}
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 14px', borderRadius: 10, background: isDark ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.15)', alignSelf: 'flex-start' }}>
                    <TrendingUp size={14} style={{ color: '#818cf8' }} />
                    <div>
                      <span style={{ fontSize: 15, fontWeight: 900, color: '#818cf8', marginRight: 6 }}>{t.metric}</span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: isDark ? '#64748b' : '#94a3b8' }}>{t.metricLabel}</span>
                    </div>
                  </div>
                  {/* Author */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 16, borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(99,102,241,0.08)'}` }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: `linear-gradient(135deg, ${t.color.split(' ')[1].replace('from-', '').replace('-500', '')}, ${t.color.split(' ')[2]?.replace('to-', '').replace('-500', '') ?? 'violet'})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: '#fff', flexShrink: 0, backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))` }}>
                      {t.avatar}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 800, color: isDark ? '#f1f5f9' : '#0f172a', margin: 0 }}>{t.name}</p>
                      <p style={{ fontSize: 12, color: isDark ? '#64748b' : '#94a3b8', margin: 0 }}>{t.role} · {t.company}</p>
                    </div>
                  </div>
                </div>
              </AnimChild>
            ))}
          </div>
        </StaggerChildren>
        {/* Bottom stats */}
        <FadeIn delay={0.2}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap', marginTop: 48, paddingTop: 40, borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(99,102,241,0.1)'}` }}>
            {[{ val: '10,000+', label: 'Active Learners' }, { val: '4.9★', label: 'Average Rating' }, { val: '97%', label: 'Satisfaction Rate' }, { val: '#1', label: 'AI IELTS Platform' }].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 900, background: 'linear-gradient(135deg,#818cf8,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.03em' }}>{s.val}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: isDark ? '#475569' : '#94a3b8', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── Pricing ──────────────────────────────────────────────────────────────────

function PlanIcon({ icon }: { icon: string }) {
  const map: Record<string, { bg: string; color: string; el: React.ReactNode }> = {
    zap:      { bg: 'rgba(100,116,139,0.15)', color: '#64748b',  el: <Zap size={17} /> },
    crown:    { bg: 'rgba(99,102,241,0.15)',  color: '#818cf8',  el: <Crown size={17} /> },
    flame:    { bg: 'rgba(139,92,246,0.15)',  color: '#a78bfa',  el: <Flame size={17} /> },
    building: { bg: 'rgba(245,158,11,0.15)',  color: '#f59e0b',  el: <Building2 size={17} /> },
  };
  const { bg, color, el } = map[icon] ?? map.zap;
  return (
    <div style={{ width: 36, height: 36, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }}>
      {el}
    </div>
  );
}

function PricingSection({ isDark }: { isDark: boolean }) {
  const [interval, setIntervalVal] = useState<'monthly' | 'annual'>('monthly');
  const { isAuthenticated } = useAuthStore();
  const checkout = useCreateCheckout();

  function handlePlanClick(planId: string, planHref: string) {
    if (isAuthenticated && (planId === 'PRO' || planId === 'ELITE')) {
      checkout.mutate({
        plan: planId as SubscriptionPlan,
        interval: interval as BillingInterval,
        providerHint: detectPaymentProvider(),
      });
      return;
    }
    window.location.href = planHref;
  }

  const ink  = isDark ? '#f1f5f9' : '#0f172a';
  const ink2 = isDark ? '#94a3b8' : '#475569';
  const ink3 = isDark ? '#64748b' : '#94a3b8';
  const cardBg = isDark ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.88)';
  const cardBorder = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(99,102,241,0.1)';
  const tableBg = isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.6)';
  const rowHover = isDark ? 'rgba(255,255,255,0.02)' : 'rgba(99,102,241,0.02)';
  const divider = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(99,102,241,0.08)';

  const COMPARE_DATA = [
    { label: 'AI Conversations / day',      free: '5',    pro: '100',    elite: '300',       ent: 'Custom' },
    { label: 'Speaking Sessions / month',   free: '2',    pro: '30',     elite: '100',       ent: 'High-volume' },
    { label: 'Mock IELTS Tests / month',    free: '1',    pro: '10',     elite: '30',        ent: 'Custom' },
    { label: 'Writing Corrections / month', free: '—',    pro: '20',     elite: '100',       ent: 'Custom' },
    { label: 'Vocabulary Words / day',      free: '10',   pro: '50',     elite: 'Unlimited', ent: 'Unlimited' },
    { label: 'AI Model Quality',            free: 'Flash',pro: 'Premium',elite: 'Premium+',  ent: 'Premium' },
    { label: 'Pronunciation Scoring',       free: false,  pro: false,    elite: true,        ent: true },
    { label: 'AI Interview Simulations',    free: false,  pro: false,    elite: true,        ent: true },
    { label: 'Advanced Analytics',          free: false,  pro: true,     elite: true,        ent: true },
    { label: 'Personalized Learning Path',  free: false,  pro: true,     elite: true,        ent: true },
    { label: 'Weekly Fluency Reports',      free: false,  pro: false,    elite: true,        ent: true },
    { label: 'Priority Support',            free: false,  pro: 'Email',  elite: 'Priority',  ent: 'Dedicated' },
    { label: 'Team Management',             free: false,  pro: false,    elite: false,       ent: true },
    { label: 'SSO / LDAP',                  free: false,  pro: false,    elite: false,       ent: true },
    { label: 'Custom Branding',             free: false,  pro: false,    elite: false,       ent: true },
  ];

  function CellVal({ v }: { v: string | boolean }) {
    if (v === true)  return <Check size={15} style={{ color: '#818cf8', margin: '0 auto' }} />;
    if (v === false) return <span style={{ color: ink3, fontSize: 16, lineHeight: 1 }}>—</span>;
    return <span style={{ fontSize: 12, fontWeight: 700, color: ink2 }}>{v}</span>;
  }

  return (
    <section className="section" id="pricing" style={{ position: 'relative', zIndex: 1 }}>
      <div className="container">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <FadeIn>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <span className="section-label">Pricing</span>
            <h2 className="section-h">Invest in Your<br /><span className="grad-text">English Career</span></h2>
            <p className="section-sub">Start free. Upgrade when your ambition demands it. No hidden fees, no surprise charges.</p>
          </div>
        </FadeIn>

        {/* ── Interval Toggle ─────────────────────────────────────────────── */}
        <FadeIn delay={0.08}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 48 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: 4, borderRadius: 14, background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(99,102,241,0.05)', border: `1px solid ${cardBorder}` }}>
              {(['monthly', 'annual'] as const).map(v => (
                <button
                  key={v}
                  onClick={() => setIntervalVal(v)}
                  style={{
                    position: 'relative', padding: '8px 20px', borderRadius: 10, border: 'none', cursor: 'pointer',
                    fontSize: 13, fontWeight: 800, background: 'transparent',
                    color: interval === v ? '#fff' : ink3,
                    transition: 'color 0.2s',
                  }}
                >
                  {interval === v && (
                    <motion.div
                      layoutId="lp-interval-pill"
                      style={{ position: 'absolute', inset: 0, borderRadius: 10, background: '#6366f1', zIndex: 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    />
                  )}
                  <span style={{ position: 'relative', zIndex: 1, textTransform: 'capitalize' }}>{v}</span>
                  {v === 'annual' && (
                    <span style={{
                      position: 'relative', zIndex: 1, marginLeft: 6,
                      fontSize: 10, fontWeight: 900, padding: '2px 6px', borderRadius: 6,
                      background: interval === 'annual' ? 'rgba(255,255,255,0.2)' : 'rgba(16,185,129,0.15)',
                      color: interval === 'annual' ? '#fff' : '#10b981',
                    }}>−21%</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* ── Plan Cards ──────────────────────────────────────────────────── */}
        <StaggerChildren>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 20, alignItems: 'start' }}>
            {PLANS.map((plan) => {
              const price = interval === 'annual' ? plan.annualPrice : plan.monthlyPrice;
              const isFree = plan.id === 'FREE';
              const isEnt = plan.id === 'ENTERPRISE';
              const isElite = plan.id === 'ELITE';

              return (
                <AnimChild key={plan.id}>
                  <motion.div
                    whileHover={{ y: plan.popular ? -6 : isElite ? -5 : -3 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      padding: 28, display: 'flex', flexDirection: 'column', position: 'relative',
                      borderRadius: 22,
                      border: `1px solid ${plan.popular ? 'rgba(99,102,241,0.45)' : isElite ? 'rgba(139,92,246,0.35)' : cardBorder}`,
                      background: plan.popular
                        ? (isDark ? 'linear-gradient(145deg,rgba(99,102,241,0.12),rgba(139,92,246,0.07))' : 'linear-gradient(145deg,rgba(99,102,241,0.06),rgba(139,92,246,0.03))')
                        : isElite
                          ? (isDark ? 'linear-gradient(145deg,rgba(139,92,246,0.1),rgba(167,139,250,0.05))' : 'linear-gradient(145deg,rgba(139,92,246,0.06),rgba(167,139,250,0.02))')
                          : cardBg,
                      backdropFilter: 'blur(16px)',
                      boxShadow: plan.popular
                        ? '0 0 0 1px rgba(99,102,241,0.3),0 24px 64px -20px rgba(99,102,241,0.3)'
                        : isElite
                          ? '0 0 0 1px rgba(139,92,246,0.2),0 16px 48px -16px rgba(139,92,246,0.25)'
                          : (isDark ? 'none' : '0 4px 28px rgba(99,102,241,0.07)'),
                    }}
                  >
                    {/* Badge */}
                    {plan.badge && (
                      <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 14px', borderRadius: 999, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', fontSize: 11, fontWeight: 900, color: '#fff', letterSpacing: '0.07em', textTransform: 'uppercase', boxShadow: '0 4px 16px rgba(99,102,241,0.45)', whiteSpace: 'nowrap' }}>
                          <Star size={9} fill="#fff" /> {plan.badge}
                        </span>
                      </div>
                    )}

                    {/* Icon + name */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                      <PlanIcon icon={plan.icon} />
                      <div>
                        <p style={{ fontSize: 16, fontWeight: 900, color: ink, margin: 0 }}>{plan.name}</p>
                        <p style={{ fontSize: 11, color: ink3, margin: 0, marginTop: 1 }}>{plan.tagline}</p>
                      </div>
                    </div>

                    {/* Price */}
                    <div style={{ marginBottom: 22 }}>
                      {isEnt ? (
                        <>
                          <span style={{ fontSize: 34, fontWeight: 900, color: ink, letterSpacing: '-0.03em' }}>Custom</span>
                          <p style={{ fontSize: 12, color: ink3, marginTop: 4 }}>Volume-based pricing</p>
                        </>
                      ) : isFree ? (
                        <>
                          <span style={{ fontSize: 34, fontWeight: 900, color: ink, letterSpacing: '-0.03em' }}>Free</span>
                          <span style={{ fontSize: 14, color: ink3, marginLeft: 6, fontWeight: 600 }}>forever</span>
                        </>
                      ) : (
                        <>
                          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4 }}>
                            <span style={{ fontSize: 34, fontWeight: 900, color: ink, letterSpacing: '-0.03em' }}>${price}</span>
                            <span style={{ fontSize: 13, color: ink3, marginBottom: 4, fontWeight: 600 }}>/month</span>
                          </div>
                          {interval === 'annual' && (
                            <p style={{ fontSize: 11, color: '#10b981', fontWeight: 700, marginTop: 3 }}>
                              Billed ${price! * 12}/yr — save ${(plan.monthlyPrice! - price!) * 12}
                            </p>
                          )}
                          {interval === 'monthly' && (
                            <p style={{ fontSize: 11, color: ink3, marginTop: 3 }}>
                              or ${plan.annualPrice}/mo billed annually
                            </p>
                          )}
                        </>
                      )}
                    </div>

                    {/* CTA */}
                    <button
                      onClick={() => handlePlanClick(plan.id, plan.href)}
                      disabled={checkout.isPending}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        padding: '12px 18px', borderRadius: 12, textDecoration: 'none',
                        fontSize: 13, fontWeight: 800, marginBottom: 22, transition: 'all 0.2s',
                        width: '100%', cursor: checkout.isPending ? 'not-allowed' : 'pointer',
                        opacity: checkout.isPending ? 0.6 : 1, border: 'none',
                        ...(plan.ctaType === 'primary'
                          ? { background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', boxShadow: '0 8px 24px rgba(99,102,241,0.38)' }
                          : plan.ctaType === 'elite'
                            ? { background: 'linear-gradient(135deg,#7c3aed,#a78bfa)', color: '#fff', boxShadow: '0 8px 24px rgba(139,92,246,0.38)' }
                            : plan.ctaType === 'outline'
                              ? { border: '1.5px solid rgba(245,158,11,0.35)', color: isDark ? '#f59e0b' : '#d97706', background: 'transparent' }
                              : { border: `1.5px solid ${cardBorder}`, color: isDark ? '#94a3b8' : '#6366f1', background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(99,102,241,0.04)' }),
                      }}
                    >
                      {(plan.ctaType === 'primary' || plan.ctaType === 'elite') && <Sparkles size={13} />}
                      {checkout.isPending ? 'Opening checkout…' : plan.cta}
                      <ArrowRight size={13} />
                    </button>

                    {plan.popular && (
                      <p style={{ textAlign: 'center', fontSize: 10, color: ink3, marginTop: -14, marginBottom: 16 }}>
                        Cancel anytime · Secure checkout
                      </p>
                    )}

                    {/* Features */}
                    <ul style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 9 }}>
                      {plan.features.map(f => (
                        <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
                          <Check size={13} style={{ color: plan.popular ? '#818cf8' : isElite ? '#a78bfa' : '#10b981', flexShrink: 0, marginTop: 2 }} />
                          <span style={{ fontSize: 12, fontWeight: 500, color: ink2, lineHeight: 1.45 }}>{f}</span>
                        </li>
                      ))}
                      {plan.notIncluded.map(f => (
                        <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
                          <X size={13} style={{ color: isDark ? '#334155' : '#cbd5e1', flexShrink: 0, marginTop: 2 }} />
                          <span style={{ fontSize: 12, fontWeight: 500, color: ink3, lineHeight: 1.45 }}>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </AnimChild>
              );
            })}
          </div>
        </StaggerChildren>

        {/* ── Money-back ──────────────────────────────────────────────────── */}
        <FadeIn delay={0.2}>
          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 12, color: ink3 }}>
            Cancel anytime from your account settings. <strong style={{ color: isDark ? '#64748b' : '#6b7280' }}>Secure payments via Stripe.</strong>
          </p>
        </FadeIn>

        {/* ── Trust Stats ─────────────────────────────────────────────────── */}
        <FadeIn delay={0.1}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap', marginTop: 52, paddingTop: 40, borderTop: `1px solid ${divider}` }}>
            {TRUST_NUMBERS.map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 26, fontWeight: 900, background: 'linear-gradient(135deg,#818cf8,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.03em' }}>{s.val}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: ink3, marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* ── Comparison Table ────────────────────────────────────────────── */}
        <FadeIn delay={0.15}>
          <div style={{ marginTop: 64 }}>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <p style={{ fontSize: 11, fontWeight: 800, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Compare Plans</p>
              <h3 style={{ fontSize: 22, fontWeight: 900, color: ink, margin: 0 }}>Everything in one view</h3>
            </div>

            <div style={{ borderRadius: 18, border: `1px solid ${cardBorder}`, background: tableBg, backdropFilter: 'blur(12px)', overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${divider}` }}>
                      <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 11, fontWeight: 800, color: ink3, textTransform: 'uppercase', letterSpacing: '0.08em', width: '34%' }}>Feature</th>
                      <th style={{ textAlign: 'center', padding: '14px 12px', fontSize: 11, fontWeight: 800, color: ink3, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Free</th>
                      <th style={{ textAlign: 'center', padding: '14px 12px', fontSize: 11, fontWeight: 800, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.08em', background: 'rgba(99,102,241,0.06)', borderLeft: '1px solid rgba(99,102,241,0.12)', borderRight: '1px solid rgba(99,102,241,0.12)' }}>Pro</th>
                      <th style={{ textAlign: 'center', padding: '14px 12px', fontSize: 11, fontWeight: 800, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.08em', background: 'rgba(139,92,246,0.06)', borderLeft: '1px solid rgba(139,92,246,0.12)', borderRight: '1px solid rgba(139,92,246,0.12)' }}>Elite</th>
                      <th style={{ textAlign: 'center', padding: '14px 12px', fontSize: 11, fontWeight: 800, color: isDark ? '#f59e0b' : '#d97706', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Enterprise</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARE_DATA.map((row, i) => (
                      <tr key={row.label} style={{ borderBottom: i < COMPARE_DATA.length - 1 ? `1px solid ${divider}` : 'none', background: i % 2 === 0 ? 'transparent' : rowHover }}>
                        <td style={{ padding: '12px 20px', color: ink2, fontWeight: 600 }}>{row.label}</td>
                        <td style={{ padding: '12px 12px', textAlign: 'center' }}>
                          {row.free === false ? <span style={{ color: ink3, fontSize: 17, lineHeight: 1 }}>—</span> : <span style={{ fontSize: 12, fontWeight: 700, color: ink2 }}>{row.free}</span>}
                        </td>
                        <td style={{ padding: '12px 12px', textAlign: 'center', background: 'rgba(99,102,241,0.04)', borderLeft: '1px solid rgba(99,102,241,0.1)', borderRight: '1px solid rgba(99,102,241,0.1)' }}>
                          {row.pro === true ? <Check size={15} style={{ color: '#818cf8', margin: '0 auto', display: 'block' }} /> : row.pro === false ? <span style={{ color: ink3, fontSize: 17, lineHeight: 1 }}>—</span> : <span style={{ fontSize: 12, fontWeight: 700, color: ink2 }}>{row.pro}</span>}
                        </td>
                        <td style={{ padding: '12px 12px', textAlign: 'center', background: 'rgba(139,92,246,0.04)', borderLeft: '1px solid rgba(139,92,246,0.1)', borderRight: '1px solid rgba(139,92,246,0.1)' }}>
                          {row.elite === true ? <Check size={15} style={{ color: '#a78bfa', margin: '0 auto', display: 'block' }} /> : row.elite === false ? <span style={{ color: ink3, fontSize: 17, lineHeight: 1 }}>—</span> : <span style={{ fontSize: 12, fontWeight: 700, color: ink2 }}>{row.elite}</span>}
                        </td>
                        <td style={{ padding: '12px 12px', textAlign: 'center' }}>
                          {row.ent === true ? <Check size={15} style={{ color: '#10b981', margin: '0 auto', display: 'block' }} /> : row.ent === false ? <span style={{ color: ink3, fontSize: 17, lineHeight: 1 }}>—</span> : <span style={{ fontSize: 12, fontWeight: 700, color: ink2 }}>{row.ent}</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </FadeIn>

      </div>
    </section>
  );
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

function FAQ({ isDark }: { isDark: boolean }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="section" style={{ position: 'relative', zIndex: 1 }}>
      <div className="container" style={{ maxWidth: 720 }}>
        <FadeIn>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span className="section-label">FAQ</span>
            <h2 className="section-h">Frequently Asked<br /><span className="grad-text">Questions</span></h2>
          </div>
        </FadeIn>
        <div>
          {FAQS.map((faq, i) => (
            <FadeIn key={faq.q} delay={i * 0.04}>
              <div className="faq-item">
                <button onClick={() => setOpen(open === i ? null : i)} style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
                  padding: '20px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: isDark ? '#f1f5f9' : '#0f172a', lineHeight: 1.4 }}>{faq.q}</span>
                  <motion.div animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.25 }} style={{ flexShrink: 0, color: isDark ? '#64748b' : '#94a3b8' }}>
                    <ChevronDown size={18} />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} style={{ overflow: 'hidden' }}>
                      <p style={{ fontSize: 14, color: isDark ? '#64748b' : '#6b7280', lineHeight: 1.75, paddingBottom: 20 }}>{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA Banner ───────────────────────────────────────────────────────────────

function CTABanner({ isDark }: { isDark: boolean }) {
  return (
    <section style={{ padding: 'clamp(48px, 8vw, 96px) 0', position: 'relative', zIndex: 1 }}>
      <div className="container" style={{ maxWidth: 860 }}>
        <FadeIn>
          <div style={{
            position: 'relative', borderRadius: 28, padding: 'clamp(40px, 6vw, 72px) clamp(24px, 5vw, 64px)',
            textAlign: 'center', overflow: 'hidden',
            background: isDark ? 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.07), rgba(236,72,153,0.05))' : 'linear-gradient(135deg, rgba(99,102,241,0.06), rgba(139,92,246,0.04))',
            border: `1px solid ${isDark ? 'rgba(99,102,241,0.25)' : 'rgba(99,102,241,0.15)'}`,
            boxShadow: isDark ? '0 0 80px -20px rgba(99,102,241,0.2)' : '0 20px 60px -20px rgba(99,102,241,0.1)',
          }}>
            {/* shimmer */}
            <div style={{ position: 'absolute', top: 0, left: '-100%', width: '60%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)', animation: 'shimmer 4s ease-in-out infinite', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.12), transparent 70%)', pointerEvents: 'none' }} />
            <span className="section-label" style={{ marginBottom: 20 }}>Start Today</span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.035em', color: isDark ? '#f1f5f9' : '#0f172a', marginBottom: 16, lineHeight: 1.1 }}>
              Ready to Sound Fluent?<br /><span className="grad-text">Start Your AI Journey Free.</span>
            </h2>
            <p style={{ fontSize: 16, color: isDark ? '#64748b' : '#6b7280', lineHeight: 1.7, marginBottom: 36, maxWidth: 480, margin: '0 auto 36px' }}>
              Join 10,000+ learners already improving with Lingoura AI. No credit card required. Results from day one.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/register" className="btn-primary" style={{ fontSize: 15 }}>Start Free — No Card Needed <ArrowRight size={15} /></Link>
              <Link href="#pricing" className="btn-ghost" style={{ fontSize: 15 }}>View Pricing</Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer({ isDark }: { isDark: boolean }) {
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(99,102,241,0.1)';
  const cols = [
    { title: 'Platform', links: [{ label: 'Features', href: '#features' }, { label: 'How It Works', href: '#how' }, { label: 'Pricing', href: '#pricing' }, { label: 'Case Studies', href: '/case-studies' }] },
    { title: 'Resources', links: [{ label: 'Blog', href: '/blog' }, { label: 'Changelog', href: '/changelog' }, { label: 'IELTS Guide', href: '/blog' }, { label: 'Vocabulary Lists', href: '/blog' }] },
    { title: 'Company', links: [{ label: 'About', href: '#' }, { label: 'Careers', href: '#' }, { label: 'Privacy Policy', href: '#' }, { label: 'Terms of Service', href: '#' }] },
  ];
  return (
    <footer style={{ borderTop: `1px solid ${borderColor}`, paddingTop: 56, paddingBottom: 32, position: 'relative', zIndex: 1 }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 32, marginBottom: 48 }}>
          {/* Brand col */}
          <div style={{ gridColumn: 'span 1' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 14 }}>
              <img src="/logo-icon.png" alt="Lingoura AI" style={{ height: 30, width: 'auto', objectFit: 'contain' }} />
              <span style={{ fontSize: 16, fontWeight: 900, letterSpacing: '-0.025em' }}>
                <span style={{ color: '#7c3aed' }}>Lingoura</span>
                <span style={{ background: 'linear-gradient(to right, #7c3aed, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}> AI</span>
              </span>
            </Link>
            <p style={{ fontSize: 13, color: isDark ? '#475569' : '#94a3b8', lineHeight: 1.65, maxWidth: 220 }}>Premium AI-powered English fluency for IELTS learners, professionals, and global communicators.</p>
          </div>
          {cols.map(col => (
            <div key={col.title}>
              <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: isDark ? '#334155' : '#94a3b8', marginBottom: 16 }}>{col.title}</p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {col.links.map(l => (
                  <li key={l.label}><Link href={l.href} style={{ fontSize: 14, fontWeight: 600, color: isDark ? '#64748b' : '#6b7280', textDecoration: 'none', transition: 'color 0.15s' }}>{l.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, paddingTop: 24, borderTop: `1px solid ${borderColor}` }}>
          <p style={{ fontSize: 13, color: isDark ? '#334155' : '#94a3b8' }}>© 2026 Lingoura AI. All rights reserved.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981' }} className="pulse-dot" />
            <span style={{ fontSize: 12, fontWeight: 700, color: isDark ? '#334155' : '#94a3b8' }}>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Page Root ────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('landing-theme');
    if (saved === 'light') setIsDark(false);
    else setIsDark(true);
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem('landing-theme', next ? 'dark' : 'light');
  };

  return (
    <div className="lp">
      <GlobalCSS isDark={isDark} />
      <GlobalBackground isDark={isDark} />
      <Navbar isDark={isDark} toggleTheme={toggle} />
      <Hero isDark={isDark} />
      <TrustedBy isDark={isDark} />
      <StatsBar isDark={isDark} />
      <SkillsSection isDark={isDark} />
      <HowItWorks isDark={isDark} />
      <FeaturesSection isDark={isDark} />
      <DemoVideo isDark={isDark} />
      <AnalyticsSection isDark={isDark} />
      <Testimonials isDark={isDark} />
      <PricingSection isDark={isDark} />
      <FAQ isDark={isDark} />
      <CTABanner isDark={isDark} />
      <Footer isDark={isDark} />
    </div>
  );
}
