'use client';

import { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  Sun, Moon, Zap, Shield, Bug, Sparkles, Wrench,
  ChevronDown, Search, X, ArrowUpRight, CheckCircle2, Filter
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type ReleaseType = 'feature' | 'improvement' | 'fix' | 'security' | 'breaking';

interface ChangeItem {
  type: ReleaseType;
  text: string;
}

interface Release {
  version: string;
  date: string;
  label?: string;
  labelColor?: string;
  headline: string;
  summary: string;
  changes: ChangeItem[];
  tags: string[];
}

// ─── Static Data ─────────────────────────────────────────────────────────────

const RELEASES: Release[] = [
  {
    version: '2.4.0',
    date: 'May 15, 2026',
    label: 'Latest',
    labelColor: '#10b981',
    headline: 'Real-Time AI Speaking Coach & Pronunciation Scoring',
    summary: 'Launched the most advanced speaking evaluation engine on the IELTS market — phoneme-level pronunciation scoring, fluency rate analysis, and live Band prediction.',
    tags: ['Speaking', 'AI', 'Pronunciation'],
    changes: [
      { type: 'feature', text: 'Live phoneme-level pronunciation scoring with IPA breakdown' },
      { type: 'feature', text: 'Real-time fluency rate measurement (words per minute + hesitations)' },
      { type: 'feature', text: 'AI-generated Band 0–9 speaking prediction after every session' },
      { type: 'feature', text: 'Accent-agnostic model trained on 50+ regional English accents' },
      { type: 'improvement', text: 'Speaking session latency reduced from 380ms to 95ms' },
      { type: 'improvement', text: 'Microphone permission flow redesigned for mobile browsers' },
      { type: 'fix', text: 'Fixed audio dropout on iOS 17.4+ Safari during long recordings' },
    ],
  },
  {
    version: '2.3.2',
    date: 'May 7, 2026',
    headline: 'Dashboard Performance & Analytics Overhaul',
    summary: 'Major performance improvements across the dashboard, new analytics charts, and enhanced progress tracking.',
    tags: ['Dashboard', 'Performance', 'Analytics'],
    changes: [
      { type: 'improvement', text: 'Dashboard initial load time reduced by 64% via route-level code splitting' },
      { type: 'feature', text: 'New skill radar chart showing CEFR level across all 4 IELTS skills' },
      { type: 'feature', text: 'Streak calendar with 90-day heatmap view' },
      { type: 'feature', text: 'Exportable progress report as PDF for visa/university applications' },
      { type: 'fix', text: 'Dark mode inconsistency fixed in the analytics tab on Firefox' },
      { type: 'fix', text: 'Progress bars no longer overflow on very long task names' },
    ],
  },
  {
    version: '2.3.0',
    date: 'Apr 29, 2026',
    headline: 'Vocabulary Builder with Spaced Repetition Engine',
    summary: 'Introducing our science-backed spaced repetition system for vocabulary retention — proven to reduce forgetting by 80%.',
    tags: ['Vocabulary', 'SRS', 'Learning'],
    changes: [
      { type: 'feature', text: 'Spaced Repetition System (SRS) engine with Ebbinghaus curve scheduling' },
      { type: 'feature', text: 'Contextual sentences for every vocabulary item drawn from real IELTS passages' },
      { type: 'feature', text: '2,400 curated academic vocabulary words across 12 topic categories' },
      { type: 'feature', text: 'Audio pronunciation by native British and American speakers' },
      { type: 'improvement', text: 'Vocabulary quiz redesigned with swipe gesture support on mobile' },
      { type: 'fix', text: 'Words marked as "known" were incorrectly re-appearing in daily queue' },
    ],
  },
  {
    version: '2.2.1',
    date: 'Apr 18, 2026',
    headline: 'Security Patch & Data Privacy Update',
    summary: 'Critical security update addressing JWT token handling and GDPR compliance improvements.',
    tags: ['Security', 'Privacy', 'GDPR'],
    changes: [
      { type: 'security', text: 'JWT refresh token rotation now enforced on every session renewal' },
      { type: 'security', text: 'Session tokens are now httpOnly, Secure, and SameSite=Strict' },
      { type: 'security', text: 'Rate limiting added to all authentication endpoints (10 req/min)' },
      { type: 'improvement', text: 'GDPR data export now includes all AI interaction logs' },
      { type: 'improvement', text: 'Cookie consent banner updated for EU/UK regulatory compliance' },
      { type: 'fix', text: 'Resolved edge case where expired tokens were not being invalidated on logout' },
    ],
  },
  {
    version: '2.2.0',
    date: 'Apr 10, 2026',
    headline: 'Writing Evaluator v2: Coherence & Cohesion Scoring',
    summary: 'Completely rebuilt writing evaluation engine with sentence-level cohesion scoring, transition analysis, and structural feedback.',
    tags: ['Writing', 'AI', 'IELTS'],
    changes: [
      { type: 'feature', text: 'Sentence-level coherence scoring highlighted inline in submitted essays' },
      { type: 'feature', text: 'Transition word analysis with suggestions from 240 high-band alternatives' },
      { type: 'feature', text: 'Task 1 (Academic) graph description evaluation — data interpretation scoring' },
      { type: 'feature', text: 'Task 2 argument structure scoring (claim, evidence, conclusion)' },
      { type: 'improvement', text: 'Writing evaluation processing time cut from 8s to 1.4s' },
      { type: 'improvement', text: 'Feedback language made more examiner-authentic based on Cambridge rubrics' },
      { type: 'fix', text: 'Essay word count was under-counting hyphenated compounds' },
      { type: 'fix', text: 'Copy-paste from Word/Google Docs no longer strips paragraph formatting' },
    ],
  },
  {
    version: '2.1.0',
    date: 'Mar 25, 2026',
    headline: 'Mock Test Engine — Full Timed IELTS Simulations',
    summary: 'Launch of the complete mock test environment with real-exam timing, official question formats, and auto-graded results.',
    tags: ['Mock Test', 'IELTS', 'Exam Prep'],
    changes: [
      { type: 'feature', text: 'Full timed IELTS Academic and General Training mock tests' },
      { type: 'feature', text: 'Official question types: MC, matching, short answer, completion, T/F/NG' },
      { type: 'feature', text: 'Auto-graded Listening and Reading with detailed answer explanations' },
      { type: 'feature', text: 'Test history with score trends across up to 12 past attempts' },
      { type: 'improvement', text: 'Timer now shows warning at 5 and 2 minutes remaining per section' },
      { type: 'fix', text: 'Submit button was available before time expired on some mobile viewports' },
    ],
  },
  {
    version: '2.0.0',
    date: 'Mar 1, 2026',
    label: 'Major',
    labelColor: '#8b5cf6',
    headline: 'Lingoura 2.0 — Complete Platform Rebuild',
    summary: 'Full relaunch with a new design system, AI engine v2, and the feature-driven architecture powering all future development.',
    tags: ['Platform', 'Design', 'Architecture'],
    changes: [
      { type: 'breaking', text: 'Legacy v1 API endpoints deprecated — v2 endpoints required from this version' },
      { type: 'feature', text: 'Entirely new UI with glassmorphism design system and dark mode' },
      { type: 'feature', text: 'AI engine rebuilt from scratch on Claude claude-sonnet-4-6 with IELTS-specific fine-tuning' },
      { type: 'feature', text: 'Feature-driven architecture with modular auth, billing, and learning modules' },
      { type: 'feature', text: 'Subscription system with Free, Pro, Team, and Enterprise tiers' },
      { type: 'feature', text: 'Multi-language onboarding (English, Hindi, Arabic, Mandarin)' },
      { type: 'improvement', text: 'All pages now server-side rendered for instant load and better SEO' },
      { type: 'security', text: 'OAuth 2.0 + PKCE with Google and Microsoft sign-in' },
    ],
  },
  {
    version: '1.9.4',
    date: 'Jan 12, 2026',
    headline: 'Final v1 Maintenance Release',
    summary: 'Last maintenance release for the v1 platform before the 2.0 migration.',
    tags: ['Maintenance', 'v1'],
    changes: [
      { type: 'fix', text: 'Resolved speaking session timeout on slow connections (>400ms latency)' },
      { type: 'fix', text: 'Writing submission failed silently when essay exceeded 400 words on mobile' },
      { type: 'security', text: 'Dependency security patches: updated 14 npm packages with CVEs' },
      { type: 'improvement', text: 'Error messages now include a reference code for faster support resolution' },
    ],
  },
];

const CHANGE_TYPE_META: Record<ReleaseType, { label: string; color: string; bg: string; darkBg: string; icon: React.ReactNode }> = {
  feature:     { label: 'New',         color: '#059669', bg: '#d1fae5', darkBg: 'rgba(5,150,105,0.15)',   icon: <Sparkles size={11} /> },
  improvement: { label: 'Improved',    color: '#6366f1', bg: '#e0e7ff', darkBg: 'rgba(99,102,241,0.15)', icon: <Zap size={11} /> },
  fix:         { label: 'Fixed',       color: '#d97706', bg: '#fef3c7', darkBg: 'rgba(217,119,6,0.15)',  icon: <Bug size={11} /> },
  security:    { label: 'Security',    color: '#dc2626', bg: '#fee2e2', darkBg: 'rgba(220,38,38,0.15)',  icon: <Shield size={11} /> },
  breaking:    { label: 'Breaking',    color: '#7c3aed', bg: '#ede9fe', darkBg: 'rgba(124,58,237,0.15)', icon: <Wrench size={11} /> },
};

const FILTER_TYPES: { id: ReleaseType | 'all'; label: string }[] = [
  { id: 'all', label: 'All Changes' },
  { id: 'feature', label: 'New Features' },
  { id: 'improvement', label: 'Improvements' },
  { id: 'fix', label: 'Bug Fixes' },
  { id: 'security', label: 'Security' },
  { id: 'breaking', label: 'Breaking' },
];

// ─── Animation Helper ─────────────────────────────────────────────────────────

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ─── Release Card ─────────────────────────────────────────────────────────────

function ReleaseCard({ release, isDark, activeFilter }: { release: Release; isDark: boolean; activeFilter: ReleaseType | 'all' }) {
  const [expanded, setExpanded] = useState(release.version === RELEASES[0].version);

  const visibleChanges = activeFilter === 'all' ? release.changes : release.changes.filter((c) => c.type === activeFilter);
  if (visibleChanges.length === 0) return null;

  const ink = isDark ? '#F9FAFB' : '#111111';
  const muted = isDark ? '#9CA3AF' : '#6B7280';
  const cardBg = isDark ? 'rgba(255,255,255,0.03)' : '#fff';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)';

  return (
    <FadeIn>
      <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 24, overflow: 'hidden', boxShadow: isDark ? 'none' : '0 4px 20px rgba(0,0,0,0.05)' }}>
        {/* Header */}
        <button
          onClick={() => setExpanded(!expanded)}
          style={{ width: '100%', padding: '28px 32px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: 16 }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'monospace', fontSize: 15, fontWeight: 800, color: isDark ? '#818cf8' : '#4f46e5' }}>
                v{release.version}
              </span>
              {release.label && (
                <span style={{ padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 800, color: '#fff', background: release.labelColor, letterSpacing: '0.05em' }}>
                  {release.label}
                </span>
              )}
              <span style={{ fontSize: 12, color: muted, fontWeight: 600 }}>{release.date}</span>
              {release.tags.map((tag) => (
                <span key={tag} style={{ padding: '2px 9px', borderRadius: 6, fontSize: 11, fontWeight: 700, background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)', color: muted }}>
                  {tag}
                </span>
              ))}
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: ink, marginBottom: 6, letterSpacing: '-0.02em' }}>
              {release.headline}
            </h2>
            <p style={{ fontSize: 14, color: muted, lineHeight: 1.6, maxWidth: 640 }}>{release.summary}</p>
          </div>
          <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.25 }} style={{ flexShrink: 0, marginTop: 4 }}>
            <ChevronDown size={18} style={{ color: muted }} />
          </motion.div>
        </button>

        {/* Changes */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ padding: '0 32px 28px', borderTop: `1px solid ${border}` }}>
                <div style={{ paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {visibleChanges.map((change, i) => {
                    const meta = CHANGE_TYPE_META[change.type];
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}
                      >
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 4,
                          padding: '3px 9px', borderRadius: 6, fontSize: 10, fontWeight: 800,
                          letterSpacing: '0.06em', flexShrink: 0, marginTop: 2,
                          color: meta.color, background: isDark ? meta.darkBg : meta.bg,
                        }}>
                          {meta.icon} {meta.label}
                        </span>
                        <span style={{ fontSize: 14, color: isDark ? '#d1d5db' : '#374151', lineHeight: 1.55, fontWeight: 500 }}>
                          {change.text}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </FadeIn>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ChangelogPage() {
  const [isDark, setIsDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<ReleaseType | 'all'>('all');

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem('landing-theme', next ? 'dark' : 'light');
  };

  const filteredReleases = useMemo(() => {
    return RELEASES.filter((r) => {
      const q = searchQuery.toLowerCase();
      const matchSearch = !q || r.version.includes(q) || r.headline.toLowerCase().includes(q) || r.summary.toLowerCase().includes(q) || r.tags.some((t) => t.toLowerCase().includes(q)) || r.changes.some((c) => c.text.toLowerCase().includes(q));
      const matchFilter = activeFilter === 'all' || r.changes.some((c) => c.type === activeFilter);
      return matchSearch && matchFilter;
    });
  }, [searchQuery, activeFilter]);

  const totalFeatures = RELEASES.flatMap((r) => r.changes).filter((c) => c.type === 'feature').length;
  const totalFixes = RELEASES.flatMap((r) => r.changes).filter((c) => c.type === 'fix').length;
  const latestVersion = RELEASES[0].version;

  const bg = isDark ? '#0B0E14' : '#FAFBFF';
  const ink = isDark ? '#F9FAFB' : '#111111';
  const muted = isDark ? '#9CA3AF' : '#6B7280';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)';
  const navBg = isDark ? 'rgba(11,14,20,0.85)' : 'rgba(255,255,255,0.8)';
  const inputBg = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)';
  const cardBg = isDark ? 'rgba(255,255,255,0.03)' : '#fff';

  return (
    <div style={{ minHeight: '100vh', background: bg, color: ink, fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", WebkitFontSmoothing: 'antialiased' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        .cat-btn { transition: all 0.2s; }
        .cat-btn:hover { opacity: 0.85; }
        .scrollbar-hide { scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .timeline-dot::before {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 2px;
          background: linear-gradient(to bottom, rgba(99,102,241,0.4), transparent);
        }
      `}</style>

      {/* ── Navbar ── */}
      <nav style={{
        position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
        width: 'calc(100% - 40px)', maxWidth: 1200, zIndex: 1000,
        height: 68, display: 'flex', alignItems: 'center', padding: '0 28px',
        background: navBg, backdropFilter: 'blur(24px) saturate(180%)',
        border: `1px solid ${border}`, borderRadius: 24,
        boxShadow: isDark ? 'none' : '0 8px 32px rgba(0,0,0,0.06)',
      }}>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <img src="/logo-icon.png" alt="Lingoura AI" style={{ height: 34, width: 'auto', objectFit: 'contain' }} />
            <span style={{ fontSize: 17, fontWeight: 900, letterSpacing: '-0.025em' }}>
              <span style={{ color: '#7c3aed' }}>Lingoura</span>
              <span style={{ background: 'linear-gradient(to right, #7c3aed, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}> AI</span>
            </span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={toggleTheme} style={{ padding: 9, borderRadius: 10, background: inputBg, border: `1px solid ${border}`, cursor: 'pointer', display: 'flex', alignItems: 'center', color: muted }}>
              {isDark ? <Sun size={16} style={{ color: '#facc15' }} /> : <Moon size={16} />}
            </button>
            <Link href="/" style={{ fontSize: 13, fontWeight: 700, color: muted, textDecoration: 'none' }}>← Home</Link>
            <Link href="/blog" style={{ fontSize: 13, fontWeight: 700, color: muted, textDecoration: 'none' }}>Blog</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div style={{ paddingTop: 120, paddingBottom: 64, background: isDark ? 'radial-gradient(ellipse 70% 50% at 50% -5%, rgba(99,102,241,0.12) 0%, transparent 70%)' : 'radial-gradient(ellipse 70% 50% at 50% -5%, rgba(99,102,241,0.06) 0%, transparent 70%)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <FadeIn>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 9999, background: isDark ? 'rgba(99,102,241,0.12)' : '#eef2ff', border: `1px solid ${isDark ? 'rgba(99,102,241,0.25)' : '#c7d2fe'}`, marginBottom: 24 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#6366f1', display: 'inline-block', animation: 'pulse 2s ease-in-out infinite' }} />
              <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
              <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: isDark ? '#818cf8' : '#4f46e5' }}>Product Changelog</span>
            </div>

            <h1 style={{ fontSize: 'clamp(36px, 6vw, 68px)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: 16, color: ink }}>
              What&apos;s{' '}
              <span style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 50%, #ec4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                new
              </span>
            </h1>
            <p style={{ fontSize: 18, color: muted, maxWidth: 480, margin: '0 auto 40px', lineHeight: 1.6 }}>
              Every improvement, feature, and fix — shipped to help you score higher.
            </p>

            {/* Stats row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
              {[
                { label: 'Current Version', value: `v${latestVersion}` },
                { label: 'Features Shipped', value: `${totalFeatures}+` },
                { label: 'Bugs Fixed', value: `${totalFixes}+` },
                { label: 'Releases', value: `${RELEASES.length}` },
              ].map((stat) => (
                <div key={stat.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 900, color: ink, letterSpacing: '-0.03em' }}>{stat.value}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2 }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>

      {/* ── Filters ── */}
      <div style={{ position: 'sticky', top: 88, zIndex: 100, background: bg, borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '14px 24px', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: '0 0 220px' }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: muted }} />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search releases..."
              style={{
                width: '100%', padding: '8px 12px 8px 32px', borderRadius: 10,
                background: inputBg, border: `1px solid ${border}`,
                color: ink, fontSize: 13, fontWeight: 500, outline: 'none', boxSizing: 'border-box',
              }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: muted }}>
                <X size={13} />
              </button>
            )}
          </div>

          {/* Type filters */}
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', flexWrap: 'nowrap' }} className="scrollbar-hide">
            {FILTER_TYPES.map((f) => {
              const active = activeFilter === f.id;
              const meta = f.id !== 'all' ? CHANGE_TYPE_META[f.id as ReleaseType] : null;
              return (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id as ReleaseType | 'all')}
                  className="cat-btn"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    padding: '7px 14px', borderRadius: 9, fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
                    background: active ? (isDark ? 'rgba(99,102,241,0.2)' : '#eef2ff') : (isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'),
                    color: active ? (isDark ? '#818cf8' : '#4f46e5') : muted,
                    border: `1px solid ${active ? (isDark ? 'rgba(99,102,241,0.35)' : '#c7d2fe') : border}`,
                  }}
                >
                  {meta && <span style={{ color: meta.color }}>{meta.icon}</span>}
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Timeline ── */}
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '48px 24px 96px' }}>
        {filteredReleases.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px', color: muted }}>
            <p style={{ fontSize: 48, marginBottom: 16 }}>🔍</p>
            <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: ink }}>No releases found</p>
            <p style={{ fontSize: 14 }}>Try adjusting your search or filter</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, position: 'relative' }}>
            {/* Vertical timeline line */}
            <div style={{ position: 'absolute', left: -28, top: 0, bottom: 0, width: 2, background: isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.08)' }} />

            {filteredReleases.map((release, i) => (
              <div key={release.version} style={{ position: 'relative' }}>
                {/* Timeline dot */}
                <div style={{
                  position: 'absolute', left: -34, top: 32, width: 14, height: 14,
                  borderRadius: '50%', border: `2px solid ${isDark ? '#6366f1' : '#4f46e5'}`,
                  background: release.label ? (release.labelColor ?? '#6366f1') : (isDark ? '#0B0E14' : '#FAFBFF'),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  zIndex: 1,
                }}>
                  {release.label && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />}
                </div>
                <ReleaseCard release={release} isDark={isDark} activeFilter={activeFilter} />
              </div>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <FadeIn delay={0.1}>
          <div style={{ marginTop: 64, padding: 40, borderRadius: 24, textAlign: 'center', background: isDark ? 'rgba(99,102,241,0.06)' : '#f5f3ff', border: `1px solid ${isDark ? 'rgba(99,102,241,0.2)' : '#ddd6fe'}` }}>
            <CheckCircle2 size={40} style={{ color: isDark ? '#818cf8' : '#6366f1', margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: 20, fontWeight: 800, color: ink, marginBottom: 8 }}>Stay up to date</h3>
            <p style={{ fontSize: 14, color: muted, marginBottom: 24, lineHeight: 1.6 }}>
              Follow our changelog to know exactly when new features land. We ship weekly.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '12px 24px', borderRadius: 12, background: isDark ? '#6366f1' : '#4f46e5', color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 700 }}>
                Read the Blog <ArrowUpRight size={14} />
              </Link>
              <Link href="/auth/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '12px 24px', borderRadius: 12, background: 'transparent', color: isDark ? '#818cf8' : '#4f46e5', textDecoration: 'none', fontSize: 14, fontWeight: 700, border: `1px solid ${isDark ? 'rgba(99,102,241,0.3)' : '#c4b5fd'}` }}>
                Try for Free
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>

      {/* ── Footer ── */}
      <footer style={{ borderTop: `1px solid ${border}`, padding: '32px 24px', textAlign: 'center' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 12 }}>
          <img src="/logo-icon.png" alt="Lingoura AI" style={{ height: 28, objectFit: 'contain' }} />
          <span style={{ fontSize: 15, fontWeight: 900, letterSpacing: '-0.025em' }}>
            <span style={{ color: '#7c3aed' }}>Lingoura</span>
            <span style={{ background: 'linear-gradient(to right, #7c3aed, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}> AI</span>
          </span>
        </Link>
        <p style={{ fontSize: 12, color: muted, fontWeight: 600 }}>© 2026 Lingoura AI · All rights reserved</p>
      </footer>
    </div>
  );
}
