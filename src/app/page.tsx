'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import Link from 'next/link';
import {
  Mic2, BookOpen, Headphones, PenLine, Brain, Target, Zap,
  Check, Star, ArrowRight, Play, BarChart2, Globe, Users,
  TrendingUp, Shield, MessageSquare, Sparkles, ChevronDown,
  Menu, X, GraduationCap, Briefcase, Building2, Plane, Code2,
  Moon, Sun, Flame, Cpu, Eye, Bot, Wand2, Clock, LineChart,
  FileText, RefreshCw, Volume2, ChevronRight, Award, Layers,
} from 'lucide-react';

// ─── Animation helpers ────────────────────────────────────────────────────────

function FadeIn({ children, delay = 0, y = 28, className = '' }: {
  children: React.ReactNode; delay?: number; y?: number; className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px 0px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StaggerChildren({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px 0px' });
  return (
    <motion.div ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const childVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
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
    const start = Date.now();
    const dur = 1800;
    const tick = () => {
      const p = Math.min((Date.now() - start) / dur, 1);
      setVal(Math.round(p * to));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, to]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Learning System', href: '#skills' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Success Stories', href: '#testimonials' },
  { label: 'Blog', href: '/blog' },
  { label: 'Changelog', href: '/changelog' },
];

const SKILLS = [
  {
    icon: <Mic2 size={28} />,
    color: 'from-indigo-500 to-violet-500',
    glow: 'rgba(99,102,241,0.15)',
    badge: 'Most Practised',
    title: 'Speaking',
    desc: 'Build pronunciation, fluency, and real-time confidence through AI-powered conversation practice.',
    points: ['Pronunciation accuracy scoring', 'Real-time fluency detection', 'Accent neutralization coaching', 'IELTS Speaking Band predictor', 'Mock interview simulations'],
    stat: { label: 'Accuracy improvement', val: '+34%' },
  },
  {
    icon: <Headphones size={28} />,
    color: 'from-violet-500 to-purple-500',
    glow: 'rgba(139,92,246,0.15)',
    badge: 'Often Neglected',
    title: 'Listening',
    desc: 'Train your brain to decode fast speech, different accents, and real-world audio intelligently.',
    points: ['Multi-accent comprehension drills', 'Speed listening exercises', 'Podcast & lecture understanding', 'IELTS Listening practice', 'Audio memory strengthening'],
    stat: { label: 'Comprehension gain', val: '+41%' },
  },
  {
    icon: <BookOpen size={28} />,
    color: 'from-sky-500 to-cyan-500',
    glow: 'rgba(14,165,233,0.15)',
    badge: 'Foundation Skill',
    title: 'Reading',
    desc: 'Develop speed reading, academic comprehension, and critical analysis for professional success.',
    points: ['Speed reading development', 'Academic text analysis', 'Vocabulary in context', 'IELTS Reading strategy', 'Critical comprehension training'],
    stat: { label: 'Reading speed gain', val: '+52%' },
  },
  {
    icon: <PenLine size={28} />,
    color: 'from-emerald-500 to-teal-500',
    glow: 'rgba(16,185,129,0.15)',
    badge: 'Career-Critical',
    title: 'Writing',
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

const USE_CASES = [
  {
    icon: <GraduationCap size={24} />,
    color: 'from-indigo-500/20 to-violet-500/20',
    border: 'border-indigo-500/20',
    label: 'IELTS Student',
    pain: 'Spending months on generic prep without knowing which skills to fix.',
    solution: 'AI pinpoints your weakest IELTS skill in minutes and builds a daily plan to reach your target band.',
    metric: 'Avg. Band improvement: +1.5 in 90 days',
  },
  {
    icon: <Code2 size={24} />,
    color: 'from-sky-500/20 to-cyan-500/20',
    border: 'border-sky-500/20',
    label: 'Software Developer',
    pain: 'Technical skills are strong but struggling to communicate in English meetings and code reviews.',
    solution: 'Professional English coaching for technical contexts — presentations, documentation, and global team collaboration.',
    metric: '87% report improved team communication',
  },
  {
    icon: <Briefcase size={24} />,
    color: 'from-amber-500/20 to-orange-500/20',
    border: 'border-amber-500/20',
    label: 'Job Seeker',
    pain: 'Failing interviews not because of skill, but because of English confidence and articulation.',
    solution: 'AI mock interviews, STAR method coaching, and real-time speaking feedback to help you communicate with confidence.',
    metric: '3× more interview success rate',
  },
  {
    icon: <Building2 size={24} />,
    color: 'from-violet-500/20 to-purple-500/20',
    border: 'border-violet-500/20',
    label: 'Corporate Professional',
    pain: 'Non-native speakers overlooked in meetings despite being highly capable.',
    solution: 'Business English coaching — emails, reports, presentations, and boardroom communication at the highest level.',
    metric: 'Used by professionals at 200+ companies',
  },
  {
    icon: <Plane size={24} />,
    color: 'from-emerald-500/20 to-teal-500/20',
    border: 'border-emerald-500/20',
    label: 'Moving Abroad',
    pain: 'Preparing for immigration, visa interviews, or life in an English-speaking country.',
    solution: 'Real-world English for everyday life — banking, healthcare, housing, and social conversations.',
    metric: '94% feel confident after 60 days',
  },
  {
    icon: <Globe size={24} />,
    color: 'from-pink-500/20 to-rose-500/20',
    border: 'border-pink-500/20',
    label: 'Global Student',
    pain: 'Studying at an international university but struggling with academic English and essay writing.',
    solution: 'Academic English coaching for lectures, assignments, essays, and class participation.',
    metric: 'Avg. GPA improvement in English courses: +0.8',
  },
];

const FEATURES = [
  { icon: <Mic2 size={20} />, color: '#6366f1', title: 'AI Speaking Evaluation', desc: 'Real-time pronunciation, fluency, and confidence scoring with detailed feedback after every session.' },
  { icon: <Bot size={20} />, color: '#8b5cf6', title: 'AI Conversation Partner', desc: 'Practice natural conversations 24/7 with an AI tutor that adapts to your level and corrects you in real time.' },
  { icon: <FileText size={20} />, color: '#10b981', title: 'AI Essay & Writing Review', desc: 'Submit any writing — the AI returns grammar fixes, coherence scores, and task achievement analysis.' },
  { icon: <Volume2 size={20} />, color: '#0ea5e9', title: 'Pronunciation Coach', desc: 'Phoneme-level analysis detects exact sounds you mispronounce and provides targeted mouth-position drills.' },
  { icon: <Target size={20} />, color: '#f59e0b', title: 'Mock IELTS Tests', desc: 'Full-length Academic and General Training mock tests with AI marking to IELTS Band descriptors.' },
  { icon: <Brain size={20} />, color: '#ec4899', title: 'Vocabulary Intelligence', desc: 'Spaced-repetition word engine that learns which words you forget and resurfaces them intelligently.' },
  { icon: <LineChart size={20} />, color: '#6366f1', title: 'Fluency Analytics', desc: 'Visual dashboard tracking 12+ metrics including speaking speed, pause frequency, and grammar accuracy.' },
  { icon: <Layers size={20} />, color: '#8b5cf6', title: 'Adaptive Learning Paths', desc: 'Lesson difficulty auto-adjusts every session — always challenging enough to grow, never frustrating.' },
  { icon: <Shield size={20} />, color: '#10b981', title: 'Confidence Tracking', desc: 'AI measures hesitation, speaking speed, and willingness to respond — then builds your courage systematically.' },
  { icon: <Cpu size={20} />, color: '#0ea5e9', title: 'Listening Intelligence', desc: 'Train with real-world audio — podcasts, lectures, conversations — with AI comprehension feedback.' },
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
    name: 'Priya Sharma',
    role: 'IELTS Candidate → Band 8.0',
    avatar: 'PS',
    color: 'from-indigo-500 to-violet-500',
    text: 'I tried 4 other platforms and scored 6.5 twice. Lingoura AI analyzed my listening and showed me I was guessing instead of comprehending. Targeted it for 6 weeks. Band 8.0.',
    band: '6.5 → 8.0',
    metric: 'in 11 weeks',
  },
  {
    name: 'James Okonkwo',
    role: 'Software Engineer, London',
    avatar: 'JO',
    color: 'from-violet-500 to-purple-500',
    text: 'My technical skills got me the interview but my English held me back. Lingoura AI mock interviews were brutal — in the best way. I got the role after 3 weeks of daily practice.',
    band: '3 rejections → Hired',
    metric: 'at a FAANG company',
  },
  {
    name: 'Mei Zhang',
    role: 'MBA Student, University of Toronto',
    avatar: 'MZ',
    color: 'from-sky-500 to-cyan-500',
    text: 'Academic writing was my biggest weakness. The AI essay reviewer gave me feedback that my professors never did — specific, structured, and actionable. My grades improved within a month.',
    band: 'C → A grade',
    metric: 'in Academic English',
  },
  {
    name: 'Rafael Santos',
    role: 'Product Manager, São Paulo → Amsterdam',
    avatar: 'RS',
    color: 'from-emerald-500 to-teal-500',
    text: 'Moving to Amsterdam I needed professional English fast. The business communication modules are unlike anything else — real scenarios, real vocabulary, real confidence.',
    band: 'Intermediate → Fluent',
    metric: 'in 4 months',
  },
];

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    color: 'border-white/8',
    cta: 'Start Free',
    href: '/register',
    ctaStyle: 'border border-white/15 text-slate-300 hover:border-white/30 hover:text-white',
    features: ['5 AI conversations / day', '2 speaking sessions / month', '1 mock test / month', 'Basic progress dashboard', 'Community access'],
    limits: true,
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/month',
    color: 'border-indigo-500/50',
    cta: 'Start 14-Day Free Trial',
    href: '/register?plan=pro',
    popular: true,
    ctaStyle: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25',
    features: ['100 AI conversations / day', '30 speaking sessions / month', '10 mock tests / month', '20 writing corrections / month', 'Advanced analytics & insights', 'Personalized AI learning path', 'Priority email support'],
    limits: false,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'pricing',
    color: 'border-violet-500/30',
    cta: 'Contact Sales',
    href: 'mailto:sales@lingoura.ai',
    ctaStyle: 'border border-violet-500/40 text-violet-400 hover:bg-violet-500/10',
    features: ['Unlimited members', 'Unlimited AI usage', 'Custom learning paths', 'SSO & LDAP integration', 'Dedicated account manager', 'SLA guarantee', 'Custom branding & white-label'],
    limits: false,
  },
];

const FAQS = [
  { q: 'Is Lingoura AI just for IELTS preparation?', a: 'No. While we have a world-class IELTS preparation system, Lingoura AI is a complete English fluency platform — coaching Speaking, Listening, Reading, and Writing for professionals, students, immigrants, and global communicators.' },
  { q: 'How does the AI evaluate my speaking?', a: 'Our AI analyzes pronunciation accuracy at the phoneme level, fluency (speaking speed, pauses, hesitation), vocabulary range, grammar, and coherence — aligned with official IELTS descriptors and Cambridge English standards.' },
  { q: 'Can beginners use Lingoura AI?', a: 'Yes. Our smart assessment identifies your current level (A1–C2) and builds a plan starting exactly where you are. The AI adapts difficulty in real time — it is never too hard or too easy.' },
  { q: 'Is the Pro plan truly unlimited?', a: 'Pro has generous daily limits (100 AI chats, 30 speaking sessions) built to support serious daily learners while ensuring fair infrastructure usage for all users. Enterprise plans have truly unlimited usage.' },
  { q: 'How is my progress tracked?', a: 'Your dashboard tracks 12+ metrics: speaking confidence, grammar accuracy, vocabulary growth, IELTS band prediction, study streaks, listening scores, writing quality, and more — updated after every session.' },
  { q: 'How accurate is the IELTS Band prediction?', a: 'Our scoring model is trained on official IELTS criteria and predicts within ±0.5 of your actual band score for 94% of users. It evaluates all four skills independently and combines them into an overall band.' },
  { q: 'Can I use this on mobile?', a: 'Yes. Lingoura AI is fully responsive across all devices. Speaking practice and listening drills are optimised for mobile with low-latency audio processing.' },
  { q: 'What if I do not see results?', a: 'We offer a 14-day money-back guarantee on Pro, no questions asked. We are also confident: users who complete 21+ days of consistent practice show measurable improvement in every session metric.' },
];

// ─── CSS ──────────────────────────────────────────────────────────────────────

function GlobalCSS() {
  return (
    <style>{`
      *, *::before, *::after { box-sizing: border-box; }

      .lp {
        font-family: 'Manrope', system-ui, sans-serif;
        background: #020617;
        color: #f1f5f9;
        -webkit-font-smoothing: antialiased;
        overflow-x: hidden;
      }
      .lp.light {
        background: #f8fafc;
        color: #0f172a;
      }

      /* Scrollbar */
      .lp::-webkit-scrollbar { width: 4px; }
      .lp::-webkit-scrollbar-track { background: transparent; }
      .lp::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.4); border-radius: 9999px; }

      /* Gradient text */
      .grad-text {
        background: linear-gradient(135deg, #818cf8 0%, #a78bfa 40%, #f472b6 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      .grad-text-green {
        background: linear-gradient(135deg, #34d399 0%, #059669 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      /* Glow orbs */
      .orb {
        position: absolute;
        border-radius: 50%;
        filter: blur(100px);
        pointer-events: none;
        animation: orbFloat 12s ease-in-out infinite;
      }
      @keyframes orbFloat {
        0%, 100% { transform: translateY(0) scale(1); }
        50% { transform: translateY(-24px) scale(1.04); }
      }

      /* Glass card */
      .glass {
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(255,255,255,0.08);
        backdrop-filter: blur(12px);
      }
      .glass-strong {
        background: rgba(255,255,255,0.06);
        border: 1px solid rgba(255,255,255,0.12);
        backdrop-filter: blur(20px);
      }
      .lp.light .glass {
        background: rgba(0,0,0,0.03);
        border-color: rgba(0,0,0,0.07);
      }

      /* Shimmer */
      @keyframes shimmer {
        0% { background-position: -400px 0; }
        100% { background-position: 400px 0; }
      }
      .shimmer {
        background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%);
        background-size: 400px 100%;
        animation: shimmer 2.5s linear infinite;
      }

      /* Pulse dot */
      @keyframes pulseDot {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.4; transform: scale(0.8); }
      }
      .pulse-dot { animation: pulseDot 1.8s ease-in-out infinite; }

      /* Float */
      @keyframes floatY {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      .float { animation: floatY 5s ease-in-out infinite; }

      /* Skill bar fill */
      @keyframes barFill {
        from { width: 0; }
      }

      /* Section */
      .section { padding: 100px 0; position: relative; }
      .section-sm { padding: 64px 0; }
      .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
      .container-lg { max-width: 1360px; margin: 0 auto; padding: 0 24px; }

      /* Section label */
      .section-label {
        display: inline-block;
        font-size: 11px; font-weight: 700;
        letter-spacing: 0.15em; text-transform: uppercase;
        color: #818cf8;
        background: rgba(99,102,241,0.1);
        border: 1px solid rgba(99,102,241,0.2);
        padding: 5px 14px; border-radius: 999px;
        margin-bottom: 20px;
      }

      /* Responsive */
      @media (max-width: 768px) {
        .section { padding: 72px 0; }
        .hide-mobile { display: none !important; }
      }

      /* Prose */
      .section-h { font-size: clamp(2rem, 5vw, 3.25rem); font-weight: 900; line-height: 1.1; letter-spacing: -0.03em; }
      .section-sub { font-size: 1.0625rem; color: #64748b; line-height: 1.7; max-width: 560px; margin: 0 auto; }
      .lp.light .section-sub { color: #475569; }

      /* Range input (for any sliders) */
      input[type=range] { accent-color: #6366f1; }

      /* Navbar */
      .nav-link {
        font-size: 14px; font-weight: 600; color: #94a3b8;
        text-decoration: none; transition: color 0.15s;
        position: relative; padding-bottom: 2px;
      }
      .nav-link:hover { color: #f1f5f9; }
      .nav-link::after {
        content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 1.5px;
        background: linear-gradient(90deg, #6366f1, #a78bfa);
        transform: scaleX(0); transform-origin: center;
        transition: transform 0.2s ease;
      }
      .nav-link:hover::after { transform: scaleX(1); }

      /* Skill bar */
      .skill-bar-fill {
        height: 100%;
        border-radius: 9999px;
        transition: width 1.4s cubic-bezier(0.22, 1, 0.36, 1);
      }

      /* Step connector */
      .step-connector {
        position: absolute;
        top: 28px; left: calc(50% + 28px);
        width: calc(100% - 56px);
        height: 1px;
        background: linear-gradient(90deg, rgba(99,102,241,0.5), rgba(99,102,241,0.1));
      }

      /* Testimonial card hover */
      .testi-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
      .testi-card:hover { transform: translateY(-6px); box-shadow: 0 24px 48px -12px rgba(0,0,0,0.4); }

      /* Feature card hover */
      .feat-card { transition: transform 0.25s ease, border-color 0.25s ease; }
      .feat-card:hover { transform: translateY(-4px); border-color: rgba(255,255,255,0.14); }

      /* Plan card */
      .plan-card-popular {
        background: linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.05));
        box-shadow: 0 0 0 1px rgba(99,102,241,0.3), 0 20px 60px -20px rgba(99,102,241,0.3);
      }

      /* FAQ */
      .faq-item { border-bottom: 1px solid rgba(255,255,255,0.06); }
      .lp.light .faq-item { border-color: rgba(0,0,0,0.07); }

      /* Gradient border button */
      .btn-grad {
        position: relative; z-index: 0;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        border-radius: 14px; padding: 14px 32px;
        font-weight: 700; font-size: 15px; color: #fff;
        border: none; cursor: pointer;
        transition: opacity 0.2s, transform 0.15s;
        box-shadow: 0 8px 32px -8px rgba(99,102,241,0.5);
      }
      .btn-grad:hover { opacity: 0.92; transform: translateY(-1px); }

      .btn-ghost {
        border: 1.5px solid rgba(255,255,255,0.12);
        border-radius: 14px; padding: 13px 28px;
        font-weight: 700; font-size: 15px;
        color: #cbd5e1; cursor: pointer;
        background: transparent;
        transition: border-color 0.2s, color 0.2s, background 0.2s;
      }
      .btn-ghost:hover { border-color: rgba(255,255,255,0.25); color: #f1f5f9; background: rgba(255,255,255,0.04); }

      /* Grid noise overlay */
      .noise-bg::before {
        content: '';
        position: absolute; inset: 0;
        background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='g' width='40' height='40' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 40 0 L 0 0 0 40' fill='none' stroke='rgba(255,255,255,0.025)' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='40' height='40' fill='url(%23g)'/%3E%3C/svg%3E");
        pointer-events: none; z-index: 0;
      }
    `}</style>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar({ isDark, toggleTheme }: { isDark: boolean; toggleTheme: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        transition: 'background 0.3s, border-color 0.3s, box-shadow 0.3s',
        background: scrolled
          ? isDark ? 'rgba(2,6,23,0.92)' : 'rgba(248,250,252,0.92)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : '1px solid transparent',
        boxShadow: scrolled ? '0 4px 40px rgba(0,0,0,0.25)' : 'none',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 0, height: 68 }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginRight: 40 }}>
          <img src="/logo-icon.png" alt="Lingoura AI" style={{ height: 36, width: 'auto', objectFit: 'contain' }} />
          <span style={{ fontSize: 17, fontWeight: 900, letterSpacing: '-0.025em' }}>
            <span style={{ color: '#7c3aed' }}>Lingoura</span>
            <span style={{ background: 'linear-gradient(to right, #7c3aed, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}> AI</span>
          </span>
        </Link>

        {/* Nav links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 28, flex: 1 }} className="hide-mobile">
          {NAV_LINKS.map(l => (
            <Link key={l.label} href={l.href} className="nav-link">{l.label}</Link>
          ))}
        </nav>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto' }}>
          <button onClick={toggleTheme} style={{
            width: 36, height: 36, borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#94a3b8', cursor: 'pointer',
          }}>
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <Link href="/login" className="hide-mobile" style={{
            fontSize: 14, fontWeight: 600, color: '#94a3b8',
            textDecoration: 'none', padding: '8px 16px', borderRadius: 10,
            transition: 'color 0.15s',
          }}>
            Sign In
          </Link>
          <Link href="/register" style={{
            fontSize: 14, fontWeight: 700,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: '#fff', textDecoration: 'none',
            padding: '9px 22px', borderRadius: 12,
            boxShadow: '0 4px 20px rgba(99,102,241,0.35)',
            transition: 'opacity 0.15s, transform 0.15s',
            whiteSpace: 'nowrap',
          }}>
            Get Started
          </Link>
          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(v => !v)}
            style={{ display: 'none', width: 36, height: 36, alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#94a3b8', cursor: 'pointer' }}
            className="show-mobile"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            style={{ background: isDark ? 'rgba(2,6,23,0.98)' : 'rgba(248,250,252,0.98)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '16px 24px 24px' }}
          >
            {NAV_LINKS.map(l => (
              <Link key={l.label} href={l.href} onClick={() => setMobileOpen(false)}
                style={{ display: 'block', padding: '12px 0', fontSize: 15, fontWeight: 600, color: '#94a3b8', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                {l.label}
              </Link>
            ))}
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <Link href="/login" style={{ flex: 1, textAlign: 'center', padding: '12px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.12)', color: '#cbd5e1', fontWeight: 700, textDecoration: 'none' }}>Sign In</Link>
              <Link href="/register" style={{ flex: 1, textAlign: 'center', padding: '12px', borderRadius: 12, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontWeight: 700, textDecoration: 'none' }}>Get Started</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
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
      <div style={{ height: 5, borderRadius: 999, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${score}%` } : {}}
          transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] }}
          style={{ height: '100%', borderRadius: 999, background: `linear-gradient(90deg, ${color}99, ${color})` }}
        />
      </div>
    </div>
  );
}

function HeroDashboard() {
  return (
    <div className="float" style={{ position: 'relative', maxWidth: 420 }}>
      {/* Main card */}
      <div className="glass-strong" style={{ borderRadius: 24, padding: 28, position: 'relative', overflow: 'hidden' }}>
        <div className="shimmer" style={{ position: 'absolute', inset: 0, borderRadius: 24 }} />
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, color: '#fff' }}>PS</div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>Priya S.</p>
              <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>IELTS Target: Band 8.0</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 999, padding: '4px 10px' }}>
            <span className="pulse-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: '#10b981' }}>AI Session Active</span>
          </div>
        </div>

        {/* Skills */}
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#475569', marginBottom: 14 }}>Skill Assessment</p>
        <SkillBar label="Speaking" score={78} color="#6366f1" delay={0.1} />
        <SkillBar label="Listening" score={84} color="#8b5cf6" delay={0.2} />
        <SkillBar label="Reading" score={91} color="#0ea5e9" delay={0.3} />
        <SkillBar label="Writing" score={67} color="#ec4899" delay={0.4} />

        {/* AI Insight */}
        <div style={{ marginTop: 20, padding: '12px 14px', background: 'rgba(236,72,153,0.08)', border: '1px solid rgba(236,72,153,0.2)', borderRadius: 12 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#f472b6', margin: '0 0 4px' }}>⚡ AI Insight</p>
          <p style={{ fontSize: 12, color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>Writing is your weakest skill. Focus: Task 2 essay coherence will add +0.5 bands.</p>
        </div>

        {/* Band prediction */}
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 12 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8' }}>Predicted IELTS Band</span>
          <span style={{ fontSize: 22, fontWeight: 900, background: 'linear-gradient(135deg,#818cf8,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>7.5</span>
        </div>
      </div>

      {/* Floating mini cards */}
      <div className="glass" style={{
        position: 'absolute', top: -20, right: -32, borderRadius: 14, padding: '10px 14px',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <Flame size={14} style={{ color: '#f59e0b' }} />
        <span style={{ fontSize: 12, fontWeight: 700, color: '#f1f5f9', whiteSpace: 'nowrap' }}>21-day streak 🔥</span>
      </div>
      <div className="glass" style={{
        position: 'absolute', bottom: -18, left: -28, borderRadius: 14, padding: '10px 14px',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <TrendingUp size={14} style={{ color: '#10b981' }} />
        <span style={{ fontSize: 12, fontWeight: 700, color: '#f1f5f9', whiteSpace: 'nowrap' }}>+0.5 Band this week</span>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: 100, paddingBottom: 80, position: 'relative', overflow: 'hidden' }}>
      {/* Background orbs */}
      <div className="orb" style={{ width: 700, height: 700, background: 'rgba(99,102,241,0.08)', top: -100, left: -200 }} />
      <div className="orb" style={{ width: 500, height: 500, background: 'rgba(139,92,246,0.06)', bottom: -100, right: -100, animationDelay: '4s' }} />
      <div className="orb" style={{ width: 300, height: 300, background: 'rgba(236,72,153,0.05)', top: '40%', right: '20%', animationDelay: '8s' }} />

      <div className="container-lg" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center', position: 'relative', zIndex: 1 }}>
        {/* Left */}
        <div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 999, padding: '6px 14px', marginBottom: 24 }}>
              <span className="pulse-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: '#818cf8', display: 'inline-block' }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#818cf8', letterSpacing: '0.05em' }}>AI-Powered English Fluency Platform</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', fontWeight: 900, lineHeight: 1.08, letterSpacing: '-0.035em', marginBottom: 24 }}
          >
            Master Real English<br />
            <span className="grad-text">Fluency With Your</span><br />
            Personal AI Mentor
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            style={{ fontSize: 17, color: '#64748b', lineHeight: 1.75, marginBottom: 36, maxWidth: 500 }}
          >
            Improve <strong style={{ color: '#94a3b8' }}>Speaking, Listening, Writing, and Reading</strong> with adaptive AI coaching — built for IELTS learners, professionals, students, and global communicators.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 48 }}
          >
            <Link href="/register" className="btn-grad" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
              Start Free — No Card Needed <ArrowRight size={16} />
            </Link>
            <button className="btn-ghost" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Play size={15} style={{ fill: 'currentColor' }} /> Watch 90s Demo
            </button>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}
          >
            {[
              { icon: <Users size={14} />, text: '10,000+ Active Learners' },
              { icon: <Award size={14} />, text: '97% Satisfaction Rate' },
              { icon: <Shield size={14} />, text: '14-Day Money Back' },
            ].map(b => (
              <div key={b.text} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: '#6366f1' }}>{b.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>{b.text}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          className="hide-mobile"
        >
          <HeroDashboard />
        </motion.div>
      </div>
    </section>
  );
}

// ─── Stats Bar ─────────────────────────────────────────────────────────────────

function StatsBar() {
  const stats = [
    { val: 10000, suffix: '+', label: 'Active Learners', icon: <Users size={20} /> },
    { val: 97, suffix: '%', label: 'Satisfaction Rate', icon: <Award size={20} /> },
    { val: 40, suffix: '+', label: 'Countries', icon: <Globe size={20} /> },
    { val: 1, suffix: '.5', label: 'Avg. Band Improvement', icon: <TrendingUp size={20} /> },
  ];
  return (
    <section className="section-sm" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="container">
        <StaggerChildren style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
          {stats.map(s => (
            <AnimChild key={s.label}>
              <div style={{ textAlign: 'center', padding: '16px 12px' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8, color: '#6366f1' }}>{s.icon}</div>
                <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-0.04em', marginBottom: 4, background: 'linear-gradient(135deg,#818cf8,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  <Counter to={s.val} suffix={s.suffix} />
                </div>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#475569', margin: 0 }}>{s.label}</p>
              </div>
            </AnimChild>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}

// ─── 4 Skills (THE KEY SECTION) ───────────────────────────────────────────────

function SkillsSection() {
  const [active, setActive] = useState(0);
  const skill = SKILLS[active];

  return (
    <section className="section noise-bg" id="skills" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="orb" style={{ width: 600, height: 600, background: 'rgba(99,102,241,0.06)', top: -100, right: -100, animationDelay: '2s' }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <FadeIn>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <span className="section-label">The 4 Pillars</span>
            <h2 className="section-h" style={{ marginBottom: 20 }}>
              Real English Fluency Is<br />
              <span className="grad-text">More Than Just Speaking</span>
            </h2>
            <p className="section-sub">
              Most learners focus only on speaking and wonder why they still struggle. True English mastery requires all four core skills working together — and our AI coaches every single one.
            </p>
          </div>
        </FadeIn>

        {/* Tab strip */}
        <FadeIn delay={0.1}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 48, flexWrap: 'wrap' }}>
            {SKILLS.map((s, i) => (
              <button
                key={s.title}
                onClick={() => setActive(i)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '10px 22px', borderRadius: 14, cursor: 'pointer',
                  fontWeight: 700, fontSize: 14, border: 'none',
                  transition: 'all 0.25s ease',
                  background: active === i
                    ? `linear-gradient(135deg, ${s.color.includes('indigo') ? '#4f46e5' : s.color.includes('violet') ? '#7c3aed' : s.color.includes('sky') ? '#0284c7' : '#059669'}, ${s.color.includes('indigo') ? '#7c3aed' : s.color.includes('violet') ? '#6d28d9' : s.color.includes('sky') ? '#06b6d4' : '#0d9488'})`
                    : 'rgba(255,255,255,0.04)',
                  color: active === i ? '#fff' : '#64748b',
                  boxShadow: active === i ? '0 8px 24px -8px rgba(99,102,241,0.4)' : 'none',
                }}
              >
                <span style={{ color: active === i ? '#fff' : '#64748b' }}>{s.icon}</span>
                {s.title}
              </button>
            ))}
          </div>
        </FadeIn>

        {/* Active skill detail */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>
              {/* Left: content */}
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 999, padding: '4px 12px', marginBottom: 20 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#818cf8', letterSpacing: '0.1em' }}>{skill.badge}</span>
                </div>
                <h3 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 16, lineHeight: 1.1 }}>
                  Master <span className="grad-text">{skill.title}</span><br />Like a Native Speaker
                </h3>
                <p style={{ fontSize: 16, color: '#64748b', lineHeight: 1.75, marginBottom: 32 }}>{skill.desc}</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 36 }}>
                  {skill.points.map(p => (
                    <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Check size={11} style={{ color: '#818cf8' }} />
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#94a3b8' }}>{p}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '14px 20px', background: `rgba(99,102,241,0.08)`, border: '1px solid rgba(99,102,241,0.2)', borderRadius: 14 }}>
                  <TrendingUp size={18} style={{ color: '#818cf8' }} />
                  <div>
                    <p style={{ margin: 0, fontSize: 11, color: '#475569', fontWeight: 600 }}>Average learner result</p>
                    <p style={{ margin: 0, fontSize: 16, fontWeight: 900, color: '#f1f5f9' }}>{skill.stat.val} <span style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>{skill.stat.label}</span></p>
                  </div>
                </div>
              </div>

              {/* Right: visual */}
              <div>
                <div className="glass-strong" style={{ borderRadius: 24, padding: 32, position: 'relative', overflow: 'hidden' }}>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#475569', marginBottom: 20 }}>AI {skill.title} Analysis</p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 28 }}>
                    {skill.points.slice(0, 4).map((p, i) => (
                      <div key={p}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                          <span style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8' }}>{p}</span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: '#818cf8' }}>{60 + i * 9 + active * 4}%</span>
                        </div>
                        <div style={{ height: 5, borderRadius: 999, background: 'rgba(255,255,255,0.06)' }}>
                          <motion.div
                            key={`${active}-${i}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${60 + i * 9 + active * 4}%` }}
                            transition={{ duration: 1.1, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                            style={{ height: '100%', borderRadius: 999, background: 'linear-gradient(90deg, #6366f1, #a78bfa)' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* AI comment box */}
                  <div style={{ padding: '14px 16px', background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                      <Bot size={13} style={{ color: '#10b981' }} />
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#10b981', letterSpacing: '0.1em' }}>AI Recommendation</span>
                    </div>
                    <p style={{ fontSize: 12, color: '#94a3b8', margin: 0, lineHeight: 1.6 }}>
                      {active === 0 && 'Your pronunciation accuracy is strong. Focus on speaking speed and reducing pause frequency to improve fluency score.'}
                      {active === 1 && 'You struggle with fast native speech. Daily 10-min accent drills + listening at 1.25x speed will close this gap.'}
                      {active === 2 && 'Reading comprehension is excellent. Speed reading practice will increase efficiency by 40% in 3 weeks.'}
                      {active === 3 && 'Sentence coherence needs work. Practice linking devices and paragraph structure to boost Task 2 score.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* 4-card overview grid (below) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 64 }}>
          {SKILLS.map((s, i) => (
            <FadeIn key={s.title} delay={i * 0.08}>
              <button
                onClick={() => setActive(i)}
                style={{
                  width: '100%', textAlign: 'left', cursor: 'pointer',
                  padding: 20, borderRadius: 18,
                  background: active === i ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.025)',
                  border: active === i ? '1px solid rgba(99,102,241,0.3)' : '1px solid rgba(255,255,255,0.06)',
                  transition: 'all 0.25s ease',
                  boxShadow: active === i ? '0 0 0 1px rgba(99,102,241,0.1) inset' : 'none',
                }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 12, background: `linear-gradient(135deg, ${s.glow.replace('0.15', '0.4')}, rgba(0,0,0,0))`, border: `1px solid ${s.glow.replace('0.15', '0.5')}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14, color: '#818cf8' }}>
                  {s.icon}
                </div>
                <p style={{ fontSize: 15, fontWeight: 800, color: '#f1f5f9', margin: '0 0 4px' }}>{s.title}</p>
                <p style={{ fontSize: 12, color: '#475569', margin: 0, lineHeight: 1.5 }}>{s.desc.substring(0, 55)}…</p>
              </button>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── AI Personalization ───────────────────────────────────────────────────────

function AISection() {
  return (
    <section className="section" id="ai" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="orb" style={{ width: 500, height: 500, background: 'rgba(139,92,246,0.07)', bottom: -100, left: -50 }} />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          {/* Left: visual */}
          <FadeIn>
            <div style={{ position: 'relative' }}>
              <div className="glass-strong" style={{ borderRadius: 24, padding: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Brain size={18} style={{ color: '#fff' }} />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#f1f5f9' }}>Lingoura AI Engine</p>
                    <p style={{ margin: 0, fontSize: 11, color: '#475569' }}>Learning profile v3.2 — updating</p>
                  </div>
                  <div className="pulse-dot" style={{ width: 8, height: 8, borderRadius: '50%', background: '#6366f1', marginLeft: 'auto' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { label: 'Detected hesitation pattern', val: 'Before complex sentences', color: '#f472b6' },
                    { label: 'Grammar error frequency', val: 'Subject-verb agreement: 18%', color: '#fb923c' },
                    { label: 'Vocabulary level', val: 'B2 — pushing toward C1', color: '#34d399' },
                    { label: 'Optimal session time', val: '9:00 AM – 10:00 AM (your peak)', color: '#818cf8' },
                    { label: 'Next milestone', val: 'IELTS Band 7.5 in 6 weeks', color: '#facc15' },
                  ].map(r => (
                    <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 10 }}>
                      <span style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>{r.label}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: r.color }}>{r.val}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Floating AI score badge */}
              <div className="glass float" style={{ position: 'absolute', top: -16, right: -24, borderRadius: 14, padding: '12px 18px', textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: 11, color: '#64748b', fontWeight: 600 }}>AI Confidence</p>
                <p style={{ margin: 0, fontSize: 26, fontWeight: 900, color: '#818cf8' }}>94%</p>
                <p style={{ margin: 0, fontSize: 10, color: '#475569' }}>prediction accuracy</p>
              </div>
            </div>
          </FadeIn>

          {/* Right: text */}
          <FadeIn delay={0.15}>
            <span className="section-label">AI Personalisation</span>
            <h2 className="section-h" style={{ marginBottom: 20 }}>
              Your AI Mentor<br />
              <span className="grad-text">Knows You Deeply</span>
            </h2>
            <p style={{ fontSize: 16, color: '#64748b', lineHeight: 1.75, marginBottom: 40 }}>
              Unlike generic learning apps, Lingoura AI builds a unique profile of every learner — detecting patterns, predicting struggles before they happen, and adapting every session in real time.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {AI_FEATURES.map(f => (
                <div key={f.title} className="glass" style={{ borderRadius: 16, padding: '18px 20px' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8', marginBottom: 12 }}>
                    {f.icon}
                  </div>
                  <p style={{ margin: '0 0 6px', fontSize: 13, fontWeight: 700, color: '#f1f5f9' }}>{f.title}</p>
                  <p style={{ margin: 0, fontSize: 12, color: '#475569', lineHeight: 1.55 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────

function HowItWorks() {
  return (
    <section className="section" id="how" style={{ position: 'relative', background: 'rgba(255,255,255,0.01)' }}>
      <div className="container">
        <FadeIn>
          <div style={{ textAlign: 'center', marginBottom: 72 }}>
            <span className="section-label">How It Works</span>
            <h2 className="section-h" style={{ marginBottom: 16 }}>
              From Zero to <span className="grad-text">Fluency</span> in 6 Steps
            </h2>
            <p className="section-sub">A structured, AI-guided journey that takes you from assessment to confident, real-world English fluency.</p>
          </div>
        </FadeIn>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {STEPS.map((s, i) => (
            <FadeIn key={s.n} delay={i * 0.07}>
              <div className="glass feat-card" style={{ borderRadius: 20, padding: 28, position: 'relative', height: '100%' }}>
                {/* Step number */}
                <div style={{ fontSize: 11, fontWeight: 900, color: '#475569', letterSpacing: '0.1em', marginBottom: 16 }}>{s.n}</div>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.1))', border: '1px solid rgba(99,102,241,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, color: '#818cf8' }}>
                  {s.icon}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9', marginBottom: 10 }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.65, margin: 0 }}>{s.desc}</p>
                {/* Connector (except last row) */}
                {i < 3 && i !== 2 && (
                  <ChevronRight size={14} style={{ position: 'absolute', right: -14, top: '50%', transform: 'translateY(-50%)', color: '#334155', zIndex: 2 }} />
                )}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Use Cases ────────────────────────────────────────────────────────────────

function UseCases() {
  return (
    <section className="section" id="use-cases">
      <div className="container">
        <FadeIn>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <span className="section-label">Who It's For</span>
            <h2 className="section-h" style={{ marginBottom: 16 }}>
              English Fluency for <span className="grad-text">Every Journey</span>
            </h2>
            <p className="section-sub">Whether you're chasing an IELTS band, a dream job, or a new life abroad — Lingoura AI meets you exactly where you are.</p>
          </div>
        </FadeIn>

        <StaggerChildren style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {USE_CASES.map(u => (
            <AnimChild key={u.label}>
              <div className={`glass feat-card`} style={{ borderRadius: 20, padding: 28, height: '100%', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: `linear-gradient(135deg, ${u.color.replace('from-', '').split(' ')[0].replace('/', ' ')})`, border: `1px solid ${u.border.replace('border-', '')}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18, color: '#818cf8' }}>
                  {u.icon}
                </div>
                <div style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: '#6366f1', marginBottom: 10 }}>{u.label}</div>
                <p style={{ fontWeight: 700, color: '#94a3b8', fontSize: 13, marginBottom: 12, lineHeight: 1.5 }}>
                  <span style={{ color: '#f97316', fontWeight: 800 }}>Pain: </span>{u.pain}
                </p>
                <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.65, marginBottom: 16 }}>
                  <span style={{ color: '#10b981', fontWeight: 800 }}>Solution: </span>{u.solution}
                </p>
                <div style={{ padding: '8px 12px', background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 10 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#34d399', margin: 0 }}>{u.metric}</p>
                </div>
              </div>
            </AnimChild>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────

function Features() {
  return (
    <section className="section" id="features" style={{ background: 'rgba(255,255,255,0.01)' }}>
      <div className="container">
        <FadeIn>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <span className="section-label">Platform Features</span>
            <h2 className="section-h" style={{ marginBottom: 16 }}>
              Every Tool Your English<br />
              <span className="grad-text">Journey Needs</span>
            </h2>
            <p className="section-sub">10+ AI-powered features working together to accelerate your path to English mastery — in one platform.</p>
          </div>
        </FadeIn>

        <StaggerChildren style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {FEATURES.map((f, i) => (
            <AnimChild key={f.title}>
              <div className="glass feat-card" style={{ borderRadius: 18, padding: '24px 22px', height: '100%' }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: `${f.color}1a`, border: `1px solid ${f.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, color: f.color }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
              </div>
            </AnimChild>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}

// ─── Analytics Visual ─────────────────────────────────────────────────────────

function AnalyticsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px 0px' });

  return (
    <section className="section" id="analytics" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="orb" style={{ width: 600, height: 600, background: 'rgba(99,102,241,0.07)', top: -50, left: -100 }} />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <FadeIn>
            <span className="section-label">Fluency Analytics</span>
            <h2 className="section-h" style={{ marginBottom: 20 }}>
              See Every Dimension<br />
              <span className="grad-text">of Your Progress</span>
            </h2>
            <p style={{ fontSize: 16, color: '#64748b', lineHeight: 1.75, marginBottom: 32 }}>
              Your personal analytics dashboard tracks 12+ metrics in real time. Know exactly where you are, how far you've come, and what to do next.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {['Speaking confidence score — updated after every session', 'Grammar accuracy trends over 30, 60, 90 days', 'IELTS Band trajectory and prediction', 'Study consistency and streak tracking', 'Vocabulary acquisition rate'].map(p => (
                <div key={p} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <Check size={14} style={{ color: '#6366f1', marginTop: 3, flexShrink: 0 }} />
                  <span style={{ fontSize: 14, color: '#64748b' }}>{p}</span>
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div ref={ref} className="glass-strong" style={{ borderRadius: 24, padding: 32 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#f1f5f9' }}>Skill Performance Dashboard</p>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: 999 }}>Last 90 days</div>
              </div>

              {ANALYTICS.map((a, i) => (
                <div key={a.label} style={{ marginBottom: i < ANALYTICS.length - 1 ? 22 : 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8' }}>{a.label}</span>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <span style={{ fontSize: 11, color: '#475569', textDecoration: 'line-through' }}>{a.prev}%</span>
                      <span style={{ fontSize: 13, fontWeight: 800, color: a.color }}>{a.val}%</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '2px 6px', borderRadius: 999 }}>+{a.val - a.prev}%</span>
                    </div>
                  </div>
                  <div style={{ height: 8, borderRadius: 999, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: `${a.prev}%` }}
                      animate={inView ? { width: `${a.val}%` } : {}}
                      transition={{ duration: 1.4, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                      style={{ height: '100%', borderRadius: 999, background: `linear-gradient(90deg, ${a.color}80, ${a.color})` }}
                    />
                  </div>
                </div>
              ))}

              <div style={{ marginTop: 24, padding: '14px 16px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ margin: 0, fontSize: 11, color: '#475569', fontWeight: 600 }}>Overall Fluency Score</p>
                  <p style={{ margin: 0, fontSize: 22, fontWeight: 900, color: '#f1f5f9' }}>83.2 <span style={{ fontSize: 12, color: '#6366f1' }}>/ 100</span></p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0, fontSize: 11, color: '#475569', fontWeight: 600 }}>IELTS Prediction</p>
                  <p style={{ margin: 0, fontSize: 22, fontWeight: 900, background: 'linear-gradient(135deg,#818cf8,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Band 7.5</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

function Testimonials() {
  return (
    <section className="section" id="testimonials" style={{ background: 'rgba(255,255,255,0.01)' }}>
      <div className="container">
        <FadeIn>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <span className="section-label">Success Stories</span>
            <h2 className="section-h" style={{ marginBottom: 16 }}>
              Real Results from<br />
              <span className="grad-text">Real Learners</span>
            </h2>
            <p className="section-sub">10,000+ learners have transformed their English fluency with Lingoura AI. Here are their stories.</p>
          </div>
        </FadeIn>

        <StaggerChildren style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
          {TESTIMONIALS.map(t => (
            <AnimChild key={t.name}>
              <div className="glass testi-card" style={{ borderRadius: 22, padding: 32, height: '100%' }}>
                {/* Stars */}
                <div style={{ display: 'flex', gap: 3, marginBottom: 20 }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} style={{ fill: '#f59e0b', color: '#f59e0b' }} />
                  ))}
                </div>
                {/* Quote */}
                <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.8, marginBottom: 28, fontStyle: 'italic' }}>
                  &ldquo;{t.text}&rdquo;
                </p>
                {/* User */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 42, height: 42, borderRadius: '50%', background: `linear-gradient(135deg, ${t.color.split(' ')[1]}, ${t.color.split(' ')[3]})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, color: '#fff' }}>
                      {t.avatar}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#f1f5f9' }}>{t.name}</p>
                      <p style={{ margin: 0, fontSize: 12, color: '#475569' }}>{t.role}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, fontSize: 16, fontWeight: 900, background: 'linear-gradient(135deg,#818cf8,#f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{t.band}</p>
                    <p style={{ margin: 0, fontSize: 11, color: '#475569' }}>{t.metric}</p>
                  </div>
                </div>
              </div>
            </AnimChild>
          ))}
        </StaggerChildren>

        {/* Stats row */}
        <FadeIn delay={0.2}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, marginTop: 64, background: 'rgba(255,255,255,0.05)', borderRadius: 20, overflow: 'hidden' }}>
            {[
              { n: '94%', label: 'achieve target IELTS band within 90 days' },
              { n: '±0.5', label: 'IELTS Band prediction accuracy' },
              { n: '21 days', label: 'average to see measurable fluency improvement' },
              { n: '10,000+', label: 'learners trust Lingoura AI globally' },
            ].map(s => (
              <div key={s.label} style={{ padding: '28px 24px', background: 'rgba(255,255,255,0.02)', textAlign: 'center' }}>
                <p style={{ margin: '0 0 8px', fontSize: 28, fontWeight: 900, background: 'linear-gradient(135deg,#818cf8,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.n}</p>
                <p style={{ margin: 0, fontSize: 13, color: '#475569', lineHeight: 1.5 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── Pricing Preview ──────────────────────────────────────────────────────────

function PricingSection() {
  const [annual, setAnnual] = useState(false);

  return (
    <section className="section" id="pricing">
      <div className="container">
        <FadeIn>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <span className="section-label">Pricing</span>
            <h2 className="section-h" style={{ marginBottom: 16 }}>
              Simple, Honest<br />
              <span className="grad-text">Pricing</span>
            </h2>
            <p className="section-sub" style={{ marginBottom: 28 }}>Start free. Upgrade when your ambition demands it. No surprises.</p>
            {/* Toggle */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '6px 8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14 }}>
              {['Monthly', 'Annual'].map(p => (
                <button key={p} onClick={() => setAnnual(p === 'Annual')}
                  style={{ padding: '8px 20px', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 14, transition: 'all 0.2s', background: (annual ? p === 'Annual' : p === 'Monthly') ? 'rgba(255,255,255,0.1)' : 'transparent', color: (annual ? p === 'Annual' : p === 'Monthly') ? '#f1f5f9' : '#475569' }}>
                  {p} {p === 'Annual' && <span style={{ fontSize: 10, color: '#34d399', fontWeight: 800, marginLeft: 4 }}>SAVE 17%</span>}
                </button>
              ))}
            </div>
          </div>
        </FadeIn>

        <StaggerChildren style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {PLANS.map((p, i) => (
            <AnimChild key={p.name}>
              <div style={{ position: 'relative', borderRadius: 24, padding: 28, height: '100%', border: '1px solid', borderColor: p.color === 'border-white/8' ? 'rgba(255,255,255,0.08)' : p.color === 'border-indigo-500/50' ? 'rgba(99,102,241,0.5)' : 'rgba(139,92,246,0.3)' }} className={p.popular ? 'plan-card-popular' : 'glass'}>
                {p.popular && (
                  <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', padding: '5px 18px', borderRadius: 999, fontSize: 10, fontWeight: 900, color: '#fff', letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>
                    MOST POPULAR
                  </div>
                )}
                <p style={{ fontSize: 14, fontWeight: 800, color: '#94a3b8', marginBottom: 4 }}>{p.name}</p>
                <div style={{ marginBottom: 24 }}>
                  <span style={{ fontSize: 36, fontWeight: 900, color: '#f1f5f9' }}>{p.price === '$19' && annual ? '$15' : p.price}</span>
                  <span style={{ fontSize: 14, color: '#475569', marginLeft: 4 }}>{p.period}</span>
                  {annual && p.price === '$19' && <span style={{ display: 'block', fontSize: 11, color: '#34d399', fontWeight: 700, marginTop: 4 }}>Save $48/year</span>}
                </div>
                <Link href={p.href} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '12px 20px', borderRadius: 14, fontWeight: 700, fontSize: 14, textDecoration: 'none', marginBottom: 24, transition: 'all 0.2s' }} className={p.ctaStyle}>
                  {p.cta} <ArrowRight size={14} />
                </Link>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {p.features.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Check size={13} style={{ color: p.popular ? '#818cf8' : '#475569', flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: p.popular ? '#94a3b8' : '#64748b' }}>{f}</span>
                    </div>
                  ))}
                </div>
                {p.limits && (
                  <p style={{ marginTop: 20, fontSize: 11, color: '#334155', textAlign: 'center' }}>Daily limits apply — upgrade for more</p>
                )}
              </div>
            </AnimChild>
          ))}
        </StaggerChildren>

        <FadeIn delay={0.3}>
          <p style={{ textAlign: 'center', fontSize: 13, color: '#334155', marginTop: 32 }}>
            All plans include a <span style={{ color: '#94a3b8', fontWeight: 700 }}>14-day money-back guarantee</span> · Secure payments via Stripe · Cancel anytime
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="section" id="faq" style={{ background: 'rgba(255,255,255,0.01)' }}>
      <div className="container" style={{ maxWidth: 760 }}>
        <FadeIn>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <span className="section-label">FAQ</span>
            <h2 className="section-h" style={{ marginBottom: 16 }}>
              Everything You Need<br />
              <span className="grad-text">to Know</span>
            </h2>
          </div>
        </FadeIn>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {FAQS.map((f, i) => (
            <FadeIn key={f.q} delay={i * 0.04}>
              <div className="faq-item" style={{ paddingBlock: 0 }}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: 16 }}
                >
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>{f.q}</span>
                  <motion.div animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.25 }} style={{ flexShrink: 0, color: '#475569' }}>
                    <ChevronDown size={18} />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.75, paddingBottom: 22, margin: 0 }}>{f.a}</p>
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

function CTABanner() {
  return (
    <section className="section-sm" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="orb" style={{ width: 800, height: 400, background: 'rgba(99,102,241,0.1)', top: '-50%', left: '50%', transform: 'translateX(-50%)' }} />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <FadeIn>
          <div style={{ textAlign: 'center', padding: '72px 40px', background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.05))', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 32, position: 'relative', overflow: 'hidden' }}>
            <div className="shimmer" style={{ position: 'absolute', inset: 0, borderRadius: 32 }} />
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 16, position: 'relative' }}>
              Your Real English Journey<br />
              <span className="grad-text">Starts Today</span>
            </h2>
            <p style={{ fontSize: 16, color: '#64748b', lineHeight: 1.7, marginBottom: 36, maxWidth: 520, margin: '0 auto 36px', position: 'relative' }}>
              Join 10,000+ learners who chose a smarter way to master English fluency — powered by AI that truly understands how you learn.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap', position: 'relative' }}>
              <Link href="/register" className="btn-grad" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
                Start Free Today <ArrowRight size={16} />
              </Link>
              <Link href="/pricing" className="btn-ghost" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
                View All Plans
              </Link>
            </div>
            <p style={{ marginTop: 20, fontSize: 13, color: '#334155', position: 'relative' }}>No credit card required · Free forever plan available · Cancel pro anytime</p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  const cols = [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '#features' },
        { label: 'Learning System', href: '#skills' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'Changelog', href: '/changelog' },
        { label: 'Blog', href: '/blog' },
        { label: 'API Status', href: '#' },
      ],
    },
    {
      title: 'Learning',
      links: [
        { label: 'IELTS Prep', href: '#' },
        { label: 'Speaking Practice', href: '#' },
        { label: 'Writing Coach', href: '#' },
        { label: 'Listening Drills', href: '#' },
        { label: 'Reading Skills', href: '#' },
        { label: 'Vocabulary Engine', href: '#' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'Contact', href: '#' },
        { label: 'Success Stories', href: '#testimonials' },
        { label: 'Press Kit', href: '#' },
        { label: 'Partnerships', href: '#' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '#' },
        { label: 'Terms of Service', href: '#' },
        { label: 'Cookie Policy', href: '#' },
        { label: 'GDPR', href: '#' },
        { label: 'Accessibility', href: '#' },
      ],
    },
  ];

  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 72, paddingBottom: 40 }}>
      <div className="container">
        {/* Top row */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr repeat(4, 1fr)', gap: 48, marginBottom: 64 }}>
          {/* Brand */}
          <div>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 16 }}>
              <img src="/logo-icon.png" alt="Lingoura AI" style={{ height: 36, width: 'auto', objectFit: 'contain' }} />
              <span style={{ fontSize: 17, fontWeight: 900, letterSpacing: '-0.025em' }}>
                <span style={{ color: '#7c3aed' }}>Lingoura</span>
                <span style={{ background: 'linear-gradient(to right, #7c3aed, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}> AI</span>
              </span>
            </Link>
            <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.7, marginBottom: 24, maxWidth: 240 }}>
              The AI-powered English fluency operating system for serious learners worldwide.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              {['𝕏', 'in', 'yt', '▶'].map((icon, i) => (
                <a key={i} href="#" style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: '#475569', textDecoration: 'none', transition: 'color 0.15s, border-color 0.15s' }}>
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {cols.map(col => (
            <div key={col.title}>
              <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#334155', marginBottom: 16 }}>{col.title}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {col.links.map(l => (
                  <Link key={l.label} href={l.href} style={{ fontSize: 13, color: '#475569', textDecoration: 'none', fontWeight: 500, transition: 'color 0.15s' }}>
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 28, flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: 13, color: '#334155', margin: 0 }}>© 2026 Lingoura AI. All rights reserved.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 12, color: '#334155' }}>Powered by Advanced AI · Built for Global Learners</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 999, padding: '4px 10px' }}>
              <span className="pulse-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#10b981' }}>All Systems Operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [isDark, setIsDark] = useState(true);

  return (
    <div className={`lp${isDark ? '' : ' light'}`} style={{ minHeight: '100vh' }}>
      <GlobalCSS />
      <style>{`
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .skills-tab-grid { grid-template-columns: 1fr 1fr !important; }
          .skills-detail { grid-template-columns: 1fr !important; }
          .ai-grid { grid-template-columns: 1fr !important; }
          .analytics-grid { grid-template-columns: 1fr !important; }
          .steps-grid { grid-template-columns: 1fr 1fr !important; }
          .use-cases-grid { grid-template-columns: 1fr 1fr !important; }
          .plans-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
          .testi-grid { grid-template-columns: 1fr !important; }
          .show-mobile { display: flex !important; }
        }
        @media (max-width: 600px) {
          .use-cases-grid, .testi-grid, .steps-grid { grid-template-columns: 1fr !important; }
          .analytics-stats { grid-template-columns: 1fr 1fr !important; }
        }
        .show-mobile { display: none; }
      `}</style>

      <Navbar isDark={isDark} toggleTheme={() => setIsDark(v => !v)} />
      <Hero />
      <StatsBar />
      <SkillsSection />
      <AISection />
      <HowItWorks />
      <UseCases />
      <Features />
      <AnalyticsSection />
      <Testimonials />
      <PricingSection />
      <FAQ />
      <CTABanner />
      <Footer />
    </div>
  );
}
