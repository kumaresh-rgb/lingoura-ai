'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
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

// Based on actual git commits — no fabricated history.
const RELEASES: Release[] = [
  {
    version: '0.5.0',
    date: 'May 19, 2026',
    label: 'Latest',
    labelColor: '#10b981',
    headline: 'Vocabulary Engine, Billing System & Razorpay Checkout',
    summary: 'Shipped the full vocabulary engine (SM-2 spaced repetition, 30 IELTS words, 4 packs) and the complete billing system with Razorpay and Stripe checkout, correct INR+GST pricing, and plan-status updates across all components.',
    tags: ['Vocabulary', 'Billing', 'Razorpay', 'Pricing'],
    changes: [
      { type: 'feature', text: 'SM-2 spaced-repetition vocabulary engine — Hard / OK / Easy review buttons with adaptive scheduling' },
      { type: 'feature', text: '30 curated IELTS Band 7+ words seeded (mitigate, ubiquitous, exacerbate …)' },
      { type: 'feature', text: '4 IELTS vocabulary packs: Environment, Society, Health, Academic Essentials' },
      { type: 'feature', text: 'Word of the Day seeded daily — VocabularyFeed endpoint returns today\'s word first' },
      { type: 'feature', text: 'Full billing system: SubscriptionPlan, Subscription, FeatureEntitlement, Payment, Invoice entities' },
      { type: 'feature', text: 'Razorpay checkout flow — order created server-side, modal opened client-side, HMAC webhook verified' },
      { type: 'feature', text: 'Stripe checkout flow with server-side session creation and redirect' },
      { type: 'feature', text: 'Next.js webhook relay routes for both Razorpay and Stripe with signature verification' },
      { type: 'feature', text: 'Optimistic plan status update immediately on payment success — all components reflect upgrade without a round-trip' },
      { type: 'feature', text: 'Post-payment navigation: redirects to Dashboard after successful Razorpay payment' },
      { type: 'improvement', text: 'Pricing corrected across all layers: PRO $20 / INR 2,277 (incl. 18% GST), ELITE $39 / INR 4,439' },
      { type: 'improvement', text: 'Elite plan status now propagates correctly — plan ID flows from checkout event through Zustand store' },
      { type: 'improvement', text: 'DB seeder wrapped in try-catch so server starts even when Neon DB is unreachable' },
      { type: 'security', text: 'Real credentials removed from appsettings.Development.json — replaced with OVERRIDE_VIA_USER_SECRETS' },
      { type: 'security', text: 'Internal webhook secret placeholder added to tests/api.http — real value stays in .env.local only' },
      { type: 'fix', text: 'Webhook relay env-var name mismatch fixed (INTERNAL_WEBHOOK_SECRET vs BACKEND_INTERNAL_SECRET)' },
    ],
  },
  {
    version: '0.4.0',
    date: 'May 17, 2026',
    headline: 'Dashboard Restructure & Landing Page Premium Redesign',
    summary: 'Restructured the main dashboard layout for clarity, and rebuilt the landing page product section with cleaner copy, correct pricing, and a more polished visual hierarchy.',
    tags: ['Dashboard', 'Landing Page', 'Design'],
    changes: [
      { type: 'improvement', text: 'Dashboard layout restructured — skill cards, study plan, AI insight and usage quota repositioned for better flow' },
      { type: 'improvement', text: 'Landing page product pricing section rebuilt — cleaner plan comparison, correct feature lists' },
      { type: 'improvement', text: 'Landing page hero refined — headline copy tightened, trust badges updated' },
      { type: 'fix', text: 'Pricing section showed $19 for PRO — corrected to $20 with accurate INR conversion' },
    ],
  },
  {
    version: '0.3.0',
    date: 'May 16, 2026',
    headline: 'Production-Grade ASP.NET Core 9 Backend with Full Auth Flow',
    summary: 'Shipped the complete backend: JWT auth, Google OAuth, refresh token rotation, FluentValidation, rate limiting, and connected the Next.js frontend end-to-end.',
    tags: ['Backend', 'Auth', 'Security', 'API'],
    changes: [
      { type: 'feature', text: 'ASP.NET Core 9 backend with Clean Architecture — Domain, Application, Infrastructure, API layers' },
      { type: 'feature', text: 'JWT access tokens (15 min) + httpOnly refresh tokens (7 day) with rotation on every renewal' },
      { type: 'feature', text: 'Google OAuth 2.0 sign-in integrated — tokens issued on first login, user profile auto-created' },
      { type: 'feature', text: 'FluentValidation pipeline — all request bodies validated, errors returned as 400 with field details' },
      { type: 'feature', text: 'Rate limiting: 10 req/min on /auth endpoints, 429 returned with Retry-After header on lockout' },
      { type: 'feature', text: 'ICurrentUserService — resolves authenticated user ID from JWT claims in any handler' },
      { type: 'feature', text: 'EF Core 9 + Npgsql wired to Neon cloud PostgreSQL — migrations auto-applied on startup' },
      { type: 'feature', text: 'Next.js frontend connected to ASP.NET backend — login, register, Google OAuth, token refresh all live' },
      { type: 'security', text: 'Refresh token rotation enforced — old token invalidated on each use to prevent replay attacks' },
      { type: 'security', text: 'All auth endpoints rate-limited; account lockout triggers 429 not 401 to prevent enumeration' },
    ],
  },
  {
    version: '0.2.0',
    date: 'May 9, 2026',
    headline: 'Glassmorphism UI, Dark Mode & Case Studies Page',
    summary: 'Complete UI overhaul with glassmorphism design system, independent dark mode for the landing page, and a new case studies section.',
    tags: ['UI', 'Dark Mode', 'Design System'],
    changes: [
      { type: 'feature', text: 'Independent dark/light mode toggle on landing page — persisted to localStorage, separate from dashboard theme' },
      { type: 'feature', text: 'Case studies page — real learner transformation stories with Band improvement metrics' },
      { type: 'feature', text: 'Profile share card — shareable IELTS progress card rendered via React Portal to avoid z-index conflicts' },
      { type: 'feature', text: 'Glassmorphism design system — backdrop-blur sidebar, card-glass surfaces, CSS custom properties for --surface, --outline-variant' },
      { type: 'improvement', text: 'Shared dashboard layout with collapsible sidebar — pin state persisted to localStorage' },
      { type: 'improvement', text: 'Specialized IELTS curriculum content across Listening, Reading, Writing modules' },
      { type: 'improvement', text: 'Global rose-mesh animated background on landing page' },
      { type: 'fix', text: 'Profile share card overlay stacking context — Portal ensures card renders above sidebar regardless of position context' },
      { type: 'fix', text: 'Route group (dashboard) layout duplicated in per-page layouts — removed redundant wrappers' },
    ],
  },
  {
    version: '0.1.0',
    date: 'May 9, 2026',
    label: 'Initial',
    labelColor: '#6366f1',
    headline: 'Initial Commit — AI English Fluency Platform',
    summary: 'First working version: Next.js 16 App Router, Tailwind CSS 4, Framer Motion, Radix UI, and the full landing page with IELTS-focused content.',
    tags: ['Next.js', 'Tailwind', 'Framer Motion'],
    changes: [
      { type: 'feature', text: 'Next.js 16 App Router with TypeScript 5 strict mode' },
      { type: 'feature', text: 'Tailwind CSS 4 via @tailwindcss/postcss — no tailwind.config.js, config in postcss.config.mjs' },
      { type: 'feature', text: 'Framer Motion 12 animations — staggered card entrances, sidebar expand/collapse at 0.7s' },
      { type: 'feature', text: 'Radix UI primitives: Dialog, DropdownMenu, Tabs, Progress, ScrollArea, Avatar' },
      { type: 'feature', text: 'Landing page with IELTS-focused hero, features, pricing, testimonials, and FAQ sections' },
      { type: 'feature', text: 'Dashboard shell with Speaking, Listening, Reading, Writing, Vocabulary, Lessons pages' },
      { type: 'feature', text: 'Path alias @/* → ./src/* configured' },
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
  const [isDark, setIsDark] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<ReleaseType | 'all'>('all');

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
