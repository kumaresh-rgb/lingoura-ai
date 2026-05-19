'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import {
  Sun, Moon, ArrowLeft, ArrowRight, Star, TrendingUp, Users,
  Mic2, PenLine, BookOpen, CheckCircle2, Quote, Zap, Award, Target,
  Clock, BarChart2, ChevronRight,
} from 'lucide-react';

// ─── Data ────────────────────────────────────────────────────────────────────

const CASES = [
  {
    id: 1,
    category: 'IELTS Speaking',
    categoryColor: '#6366f1',
    categoryBg: 'rgba(99,102,241,0.1)',
    icon: Mic2,
    name: 'Priya Sharma',
    role: 'Software Engineer → Google London',
    avatar: 'PS',
    avatarGrad: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
    location: 'Bengaluru, India',
    timeline: '6 weeks',
    challenge: 'Priya had scored 6.5 in IELTS twice despite strong grammar. Her issue was hesitation during Part 2 cue cards — she ran out of ideas within 30 seconds and used filler words excessively. Standard practice apps gave scores but no actionable coaching.',
    solution: 'Lingoura AI\'s Speaking Coach analyzed her hesitation patterns at the phoneme level, identifying three recurring triggers: topic vocabulary gaps, transition phrase overuse, and speaking speed (she rushed when anxious). The AI built a 6-week plan targeting exactly those gaps — daily 20-min mock cue card sessions with instant pronunciation and fluency feedback.',
    result: 'In her third IELTS attempt, Priya scored 8.0 in Speaking — a 1.5 band improvement. The examiner noted her "natural delivery and wide lexical range." She is now at Google London.',
    quote: 'I tried four other platforms and scored 6.5 twice. Lingoura AI showed me I was guessing instead of comprehending. Six weeks later — Band 8.0.',
    metrics: [
      { label: 'Speaking Band', before: '6.5', after: '8.0', delta: '+1.5' },
      { label: 'Hesitation Rate', before: '18%', after: '4%', delta: '–77%' },
      { label: 'Practice Sessions', before: '—', after: '42', delta: '42' },
    ],
    features: ['Real-time hesitation detection', 'Phoneme-level pronunciation scoring', 'Cue card AI coach', 'IELTS Band predictor'],
    stars: 5,
  },
  {
    id: 2,
    category: 'IELTS Writing',
    categoryColor: '#10b981',
    categoryBg: 'rgba(16,185,129,0.1)',
    icon: PenLine,
    name: 'Ahmed Al-Rashid',
    role: 'Civil Engineer → UK Visa Applicant',
    avatar: 'AA',
    avatarGrad: 'linear-gradient(135deg,#10b981,#059669)',
    location: 'Dubai, UAE',
    timeline: '8 weeks',
    challenge: 'Ahmed\'s writing was grammatically correct but Task 2 essays lacked logical flow — coherence score was consistently 6.0. He couldn\'t identify where his arguments broke down. Human tutors gave generic advice ("use more connectives") that didn\'t help.',
    solution: 'The AI Writing Evaluator broke down each essay paragraph-by-paragraph, scoring coherence, task achievement, lexical resource, and grammatical range separately. It identified that Ahmed\'s body paragraphs didn\'t link back to his thesis. Over 45 evaluated essays, the AI iteratively tightened his template — from a 4-paragraph structure to a proven Band 8 framework with specific transition cues.',
    result: 'Ahmed achieved 8.5 in Writing — up from 6.5. His UK Skilled Worker visa was approved. He credits the paragraph-level breakdown as the single most useful tool he\'d ever used for IELTS preparation.',
    quote: 'The AI essay reviewer gave me feedback my professors never did — specific, structured, actionable. My writing band jumped two full points in 8 weeks.',
    metrics: [
      { label: 'Writing Band', before: '6.5', after: '8.5', delta: '+2.0' },
      { label: 'Essays Evaluated', before: '—', after: '45', delta: '45' },
      { label: 'Coherence Score', before: '6.0', after: '8.5', delta: '+2.5' },
    ],
    features: ['Paragraph-level coherence analysis', 'Task achievement scoring', 'Band 8 essay framework', 'Vocabulary enrichment suggestions'],
    stars: 5,
  },
  {
    id: 3,
    category: 'Professional Fluency',
    categoryColor: '#f59e0b',
    categoryBg: 'rgba(245,158,11,0.1)',
    icon: Zap,
    name: 'Rafael Santos',
    role: 'Product Manager → Amsterdam',
    avatar: 'RS',
    avatarGrad: 'linear-gradient(135deg,#f59e0b,#ef4444)',
    location: 'São Paulo, Brazil',
    timeline: '4 months',
    challenge: 'Rafael had strong written English but struggled in live professional meetings. He over-prepared, spoke slowly, and avoided complex vocabulary he wasn\'t confident pronouncing. His confidence score in Lingoura AI\'s assessment: 38/100.',
    solution: 'Lingoura AI\'s AI Conversation Partner ran daily 15-minute business scenario simulations — product reviews, stakeholder updates, salary negotiations. Each session tracked speaking speed, vocabulary range, and filler word frequency. The system nudged Rafael into more complex structures as his confidence grew, using a spaced challenge curve.',
    result: 'After 4 months, Rafael relocated to Amsterdam as a Senior PM. His confidence score reached 91/100. In his exit interview for the role, the hiring manager called his English "remarkably natural for a non-native speaker."',
    quote: 'Moving to Amsterdam I needed professional English fast. The business scenarios are unlike anything else — real vocabulary, real confidence, built in 4 months.',
    metrics: [
      { label: 'Confidence Score', before: '38/100', after: '91/100', delta: '+139%' },
      { label: 'Filler Words/min', before: '8.4', after: '1.2', delta: '–86%' },
      { label: 'Speaking Speed', before: '108 WPM', after: '142 WPM', delta: '+32%' },
    ],
    features: ['AI business scenario simulations', 'Filler word tracking', 'Speaking speed coaching', 'Vocabulary range analysis'],
    stars: 5,
  },
  {
    id: 4,
    category: 'Institutional Scale',
    categoryColor: '#8b5cf6',
    categoryBg: 'rgba(139,92,246,0.1)',
    icon: Users,
    name: 'Global Language Academy',
    role: '500+ students · Mumbai, India',
    avatar: 'GL',
    avatarGrad: 'linear-gradient(135deg,#8b5cf6,#6366f1)',
    location: 'Mumbai, India',
    timeline: '3 months integration',
    challenge: 'The academy had 500+ IELTS students but teachers spent 60% of their time on repetitive writing corrections and speaking mock tests — leaving little time for high-value coaching. Student satisfaction was 71% and pass rates had plateaued at 68%.',
    solution: 'Lingoura AI was integrated into the curriculum as a homework and practice layer. Students used the AI speaking coach and writing evaluator between classes. Teachers received AI-generated weekly progress reports highlighting each student\'s specific gap areas. Class time shifted to strategy, motivation, and edge-case coaching.',
    result: 'Student pass rate increased from 68% to 94% in 3 months. Teacher admin time dropped 65%. Satisfaction reached 96%. The academy has since integrated Lingoura AI across all 3 branches.',
    quote: 'The admin time saved alone was worth it. But the real result was our students — a 94% pass rate in 3 months changed our reputation in the city.',
    metrics: [
      { label: 'Student Pass Rate', before: '68%', after: '94%', delta: '+38%' },
      { label: 'Admin Time Saved', before: '—', after: '65%', delta: '65%' },
      { label: 'Satisfaction', before: '71%', after: '96%', delta: '+25pts' },
    ],
    features: ['Multi-student progress dashboard', 'Automated weekly reports', 'Curriculum integration API', 'Performance benchmarking'],
    stars: 5,
  },
];

const TRUST_STATS = [
  { val: '10,000+', label: 'Active Learners', icon: Users },
  { val: '+1.2', label: 'Avg. Band Improvement', icon: TrendingUp },
  { val: '97%', label: 'Satisfaction Rate', icon: Award },
  { val: '6 wks', label: 'Avg. to First Improvement', icon: Clock },
];

// ─── Animation ────────────────────────────────────────────────────────────────

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

// ─── Case Card ────────────────────────────────────────────────────────────────

function CaseCard({ c, isDark, idx }: { c: typeof CASES[0]; isDark: boolean; idx: number }) {
  const Icon = c.icon;
  const ink = isDark ? '#F9FAFB' : '#111111';
  const muted = isDark ? '#9CA3AF' : '#6B7280';
  const cardBg = isDark ? 'rgba(255,255,255,0.03)' : '#ffffff';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)';
  const rowBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)';

  return (
    <FadeIn delay={idx * 0.1}>
      <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 28, overflow: 'hidden', boxShadow: isDark ? 'none' : '0 8px 40px rgba(0,0,0,0.06)' }}>

        {/* Card Header */}
        <div style={{ padding: '36px 40px 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: c.avatarGrad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900, color: '#fff', flexShrink: 0 }}>
              {c.avatar}
            </div>
            <div>
              <p style={{ fontSize: 17, fontWeight: 800, color: ink, margin: 0 }}>{c.name}</p>
              <p style={{ fontSize: 13, color: muted, margin: 0 }}>{c.role}</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 999, fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', background: c.categoryBg, color: c.categoryColor }}>
              <Icon size={11} /> {c.category}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {Array.from({ length: c.stars }).map((_, i) => <Star key={i} size={13} style={{ fill: '#f59e0b', color: '#f59e0b' }} />)}
            </span>
          </div>
        </div>

        {/* Meta row */}
        <div style={{ padding: '16px 40px', display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, color: muted, display: 'flex', alignItems: 'center', gap: 5 }}>
            <Target size={12} /> {c.location}
          </span>
          <span style={{ fontSize: 12, color: muted, display: 'flex', alignItems: 'center', gap: 5 }}>
            <Clock size={12} /> {c.timeline}
          </span>
        </div>

        {/* Metrics bar */}
        <div style={{ margin: '0 40px 28px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {c.metrics.map((m, i) => (
            <div key={i} style={{ background: rowBg, borderRadius: 16, padding: '16px 18px', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 13, color: muted, fontWeight: 600 }}>{m.before}</span>
                <span style={{ fontSize: 13, color: isDark ? '#475569' : '#cbd5e1' }}>→</span>
                <span style={{ fontSize: 15, fontWeight: 900, color: c.categoryColor }}>{m.after}</span>
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: '2px 8px', borderRadius: 999, background: c.categoryBg, marginBottom: 4 }}>
                <TrendingUp size={9} style={{ color: c.categoryColor }} />
                <span style={{ fontSize: 10, fontWeight: 800, color: c.categoryColor }}>{m.delta}</span>
              </div>
              <p style={{ fontSize: 10, fontWeight: 700, color: muted, margin: 0, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{m.label}</p>
            </div>
          ))}
        </div>

        {/* Body: Challenge / Solution / Result */}
        <div style={{ padding: '0 40px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 28 }}>
          {[
            { label: 'Challenge', text: c.challenge, color: '#ef4444', bg: isDark ? 'rgba(239,68,68,0.06)' : 'rgba(239,68,68,0.04)', border: isDark ? 'rgba(239,68,68,0.15)' : 'rgba(239,68,68,0.1)' },
            { label: 'Solution', text: c.solution, color: c.categoryColor, bg: c.categoryBg, border: `${c.categoryColor}22` },
            { label: 'Result', text: c.result, color: '#10b981', bg: isDark ? 'rgba(16,185,129,0.06)' : 'rgba(16,185,129,0.04)', border: isDark ? 'rgba(16,185,129,0.15)' : 'rgba(16,185,129,0.1)' },
          ].map(({ label, text, color, bg, border: b }) => (
            <div key={label} style={{ background: bg, border: `1px solid ${b}`, borderRadius: 16, padding: '18px 20px' }}>
              <p style={{ fontSize: 10, fontWeight: 800, color, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>{label}</p>
              <p style={{ fontSize: 13, color: isDark ? '#d1d5db' : '#374151', lineHeight: 1.65, margin: 0 }}>{text}</p>
            </div>
          ))}
        </div>

        {/* Quote */}
        <div style={{ margin: '0 40px 28px', padding: '20px 24px', background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(99,102,241,0.03)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(99,102,241,0.12)'}`, borderRadius: 16, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <Quote size={20} style={{ color: c.categoryColor, flexShrink: 0, marginTop: 2 }} />
          <p style={{ fontSize: 14, fontStyle: 'italic', color: isDark ? '#e2e8f0' : '#1e293b', lineHeight: 1.7, margin: 0, fontWeight: 500 }}>{c.quote}</p>
        </div>

        {/* Features used */}
        <div style={{ padding: '20px 40px 36px', borderTop: `1px solid ${border}` }}>
          <p style={{ fontSize: 11, fontWeight: 800, color: muted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Features Used</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {c.features.map((f) => (
              <span key={f} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color: c.categoryColor, background: c.categoryBg, padding: '5px 12px', borderRadius: 8 }}>
                <CheckCircle2 size={11} /> {f}
              </span>
            ))}
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CaseStudiesPage() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('landing-theme');
    if (saved === 'light') setIsDark(false);
    else setIsDark(true);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem('landing-theme', next ? 'dark' : 'light');
  };

  const bg = isDark ? '#0B0E14' : '#F4F5FB';
  const ink = isDark ? '#F9FAFB' : '#111111';
  const muted = isDark ? '#9CA3AF' : '#6B7280';
  const navBg = isDark ? 'rgba(11,14,20,0.88)' : 'rgba(244,245,251,0.88)';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(99,102,241,0.1)';

  return (
    <div style={{ minHeight: '100vh', background: bg, color: ink, fontFamily: "'Manrope', system-ui, sans-serif", WebkitFontSmoothing: 'antialiased', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .cs-nav-link { font-size: 13px; font-weight: 600; color: ${isDark ? '#94a3b8' : '#64748b'}; text-decoration: none; transition: color 0.15s; }
        .cs-nav-link:hover { color: ${isDark ? '#f1f5f9' : '#111'}; }
        @media (max-width: 768px) {
          .cs-metrics { grid-template-columns: 1fr !important; }
          .cs-body { grid-template-columns: 1fr !important; }
          .cs-card-pad { padding: 24px !important; }
          .cs-stats { grid-template-columns: 1fr 1fr !important; }
          .cs-hero-p { font-size: 16px !important; }
        }
        @media (max-width: 480px) {
          .cs-stats { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── Floating background orbs ── */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)', top: -200, left: -150, filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)', bottom: '20%', right: -100, filter: 'blur(60px)' }} />
      </div>

      {/* ── Navbar ── */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: 64, display: 'flex', alignItems: 'center', background: navBg, backdropFilter: 'blur(20px) saturate(180%)', borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', padding: '0 clamp(16px,4vw,32px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <img src="/logo-icon.png" alt="Lingoura AI" style={{ height: 30, width: 'auto', objectFit: 'contain' }} />
            <span style={{ fontSize: 16, fontWeight: 900, letterSpacing: '-0.025em' }}>
              <span style={{ color: '#7c3aed' }}>Lingoura</span>
              <span style={{ background: 'linear-gradient(to right, #7c3aed, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}> AI</span>
            </span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link href="/blog" className="cs-nav-link">Blog</Link>
            <Link href="/changelog" className="cs-nav-link">Changelog</Link>
            <button onClick={toggleTheme} style={{ width: 34, height: 34, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(99,102,241,0.07)', border: `1px solid ${border}`, color: isDark ? '#94a3b8' : '#6366f1', cursor: 'pointer', transition: 'all 0.2s' }}>
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 700, color: muted, textDecoration: 'none', transition: 'color 0.15s' }}>
              <ArrowLeft size={14} /> Home
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ paddingTop: 'clamp(96px, 14vw, 140px)', paddingBottom: 'clamp(40px, 6vw, 72px)', textAlign: 'center', position: 'relative', zIndex: 1, padding: 'clamp(96px, 14vw, 140px) clamp(16px,4vw,32px) clamp(40px,6vw,72px)' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 999, background: isDark ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.08)', border: `1px solid ${isDark ? 'rgba(99,102,241,0.25)' : 'rgba(99,102,241,0.2)'}`, marginBottom: 24 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#818cf8', display: 'inline-block' }} />
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: isDark ? '#818cf8' : '#6366f1' }}>Real Results. Verified Outcomes.</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5.5vw, 3.75rem)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.04em', color: ink, marginBottom: 20 }}>
            Students Who Transformed<br />
            <span style={{ background: 'linear-gradient(135deg, #818cf8, #a78bfa 40%, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Their English Forever</span>
          </h1>
          <p className="cs-hero-p" style={{ fontSize: 18, color: muted, maxWidth: 580, margin: '0 auto 48px', lineHeight: 1.7 }}>
            Not testimonials. Full breakdowns — the challenge, the solution, the data. Every story is a real learner, real improvement, real outcome.
          </p>

          {/* Trust stats */}
          <div className="cs-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, maxWidth: 800, margin: '0 auto' }}>
            {TRUST_STATS.map(({ val, label, icon: Icon }) => (
              <div key={label} style={{ padding: '20px 16px', borderRadius: 18, background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.8)', border: `1px solid ${border}`, backdropFilter: 'blur(12px)' }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                  <Icon size={15} style={{ color: '#818cf8' }} />
                </div>
                <p style={{ fontSize: 22, fontWeight: 900, color: ink, margin: '0 0 3px' }}>{val}</p>
                <p style={{ fontSize: 11, fontWeight: 700, color: muted, textTransform: 'uppercase', letterSpacing: '0.07em', margin: 0 }}>{label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Case Studies ── */}
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(16px,4vw,32px) clamp(64px,8vw,120px)', position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 40 }}>
        {CASES.map((c, i) => (
          <CaseCard key={c.id} c={c} isDark={isDark} idx={i} />
        ))}
      </main>

      {/* ── CTA ── */}
      <section style={{ padding: 'clamp(48px,8vw,96px) clamp(16px,4vw,32px)', position: 'relative', zIndex: 1 }}>
        <FadeIn>
          <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center', padding: 'clamp(40px,6vw,64px)', borderRadius: 28, background: isDark ? 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.07))' : 'linear-gradient(135deg, rgba(99,102,241,0.06), rgba(139,92,246,0.04))', border: `1px solid ${isDark ? 'rgba(99,102,241,0.25)' : 'rgba(99,102,241,0.15)'}` }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 999, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', marginBottom: 20 }}>
              <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#818cf8' }}>Start Today</span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)', fontWeight: 900, letterSpacing: '-0.035em', color: ink, lineHeight: 1.1, marginBottom: 16 }}>
              Ready to Write Your<br />
              <span style={{ background: 'linear-gradient(135deg, #818cf8, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Own Success Story?</span>
            </h2>
            <p style={{ fontSize: 16, color: muted, lineHeight: 1.7, marginBottom: 32, maxWidth: 440, margin: '0 auto 32px' }}>
              Join 10,000+ learners already improving with Lingoura AI. No credit card required. Results from day one.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '13px 28px', borderRadius: 14, fontWeight: 800, fontSize: 15, color: '#fff', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 8px 32px rgba(99,102,241,0.4)', textDecoration: 'none' }}>
                Start Free <ArrowRight size={15} />
              </Link>
              <Link href="/#pricing" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '13px 24px', borderRadius: 14, fontWeight: 700, fontSize: 15, color: muted, border: `1.5px solid ${border}`, textDecoration: 'none' }}>
                View Pricing
              </Link>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: `1px solid ${border}`, padding: 'clamp(24px,4vw,40px) clamp(16px,4vw,32px)', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <p style={{ fontSize: 13, color: muted }}>© 2026 Lingoura AI. All rights reserved.</p>
          <div style={{ display: 'flex', gap: 20 }}>
            <Link href="/" className="cs-nav-link">Home</Link>
            <Link href="/blog" className="cs-nav-link">Blog</Link>
            <Link href="/changelog" className="cs-nav-link">Changelog</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
