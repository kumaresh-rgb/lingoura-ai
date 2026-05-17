'use client';

import Link from 'next/link';

const FEATURES = [
  { icon: '🎙', text: 'Real-time AI Speaking Coach' },
  { icon: '✍️', text: 'Instant Writing Evaluation' },
  { icon: '📊', text: 'IELTS Band Score Prediction' },
];

const STATS = [
  { value: '10K+', label: 'Students' },
  { value: '98%',  label: 'Accuracy' },
  { value: '4.9★', label: 'Rating'   },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        .auth-root {
          min-height: 100vh;
          width: 100%;
          display: flex;
          background: #0f172a;
        }
        /* Left branding panel */
        .auth-left {
          display: none;
          flex-direction: column;
          justify-content: space-between;
          padding: 48px;
          position: relative;
          overflow: hidden;
          background: linear-gradient(145deg, #1e1b4b 0%, #0f172a 50%, #0c1a2e 100%);
          border-right: 1px solid rgba(255,255,255,0.06);
          width: 480px;
          flex-shrink: 0;
        }
        @media (min-width: 1024px) { .auth-left { display: flex; } }

        .auth-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          animation: authOrb 6s ease-in-out infinite;
          pointer-events: none;
        }
        .auth-orb-1 { width: 360px; height: 360px; background: rgba(99,102,241,0.25); top: -80px; left: -80px; animation-delay: 0s; }
        .auth-orb-2 { width: 300px; height: 300px; background: rgba(236,72,153,0.18); bottom: -40px; right: -60px; animation-delay: -2.5s; }
        .auth-orb-3 { width: 200px; height: 200px; background: rgba(14,165,233,0.14); top: 45%; left: 35%; animation-delay: -4.5s; }
        @keyframes authOrb {
          0%,100% { transform: translate(0,0) scale(1); }
          33%      { transform: translate(20px,-15px) scale(1.06); }
          66%      { transform: translate(-15px,20px) scale(0.94); }
        }
        .auth-grid {
          position: absolute; inset: 0; opacity: 0.03;
          background-image: radial-gradient(white 1px, transparent 1px);
          background-size: 32px 32px;
          pointer-events: none;
        }

        /* Right form panel */
        .auth-right {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background: #0f172a;
          width: 0; /* flex-grow handles actual width */
          min-width: 0;
        }
        .auth-mobile-bar {
          display: flex;
          align-items: center;
          padding: 18px 24px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        @media (min-width: 1024px) { .auth-mobile-bar { display: none; } }
        .auth-form-area {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 32px 24px;
        }
        @media (min-width: 640px) { .auth-form-area { padding: 40px 40px; } }
        @media (min-width: 1024px) { .auth-form-area { padding: 48px 64px; } }
        .auth-form-inner {
          width: 100%;
          max-width: 420px;
          flex-shrink: 0;
        }
        .auth-form-logo {
          display: none;
        }
        @media (min-width: 1024px) {
          .auth-form-logo { display: block; margin-bottom: 36px; }
        }
        .auth-footer-bar {
          padding: 16px 24px;
          text-align: center;
          border-top: 1px solid rgba(255,255,255,0.05);
          font-size: 11px;
          font-weight: 600;
          color: rgba(148,163,184,0.5);
          letter-spacing: 0.02em;
        }

        /* Left panel content */
        .auth-badge {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 6px 14px; border-radius: 9999px;
          background: rgba(99,102,241,0.15);
          border: 1px solid rgba(99,102,241,0.25);
          margin-bottom: 24px;
        }
        .auth-badge-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #818cf8;
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .auth-badge-text {
          font-size: 10px; font-weight: 700; letter-spacing: 0.12em;
          text-transform: uppercase; color: #a5b4fc;
        }
        .auth-headline {
          font-size: clamp(28px, 3.5vw, 42px);
          font-weight: 900; line-height: 1.06; letter-spacing: -0.04em;
          color: #fff; margin-bottom: 14px;
        }
        .auth-grad {
          background: linear-gradient(135deg, #a5b4fc 0%, #c084fc 50%, #f472b6 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .auth-sub {
          font-size: 15px; font-weight: 500; color: #64748b;
          line-height: 1.65; max-width: 300px; margin-bottom: 32px;
        }
        .auth-features { display: flex; flex-direction: column; gap: 12px; margin-bottom: 32px; }
        .auth-feature {
          display: flex; align-items: center; gap: 12px;
        }
        .auth-feature-ico {
          width: 36px; height: 36px; border-radius: 10px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          display: flex; align-items: center; justify-content: center;
          font-size: 15px; flex-shrink: 0;
        }
        .auth-feature-text { font-size: 13px; font-weight: 500; color: #94a3b8; }
        .auth-stats {
          display: grid; grid-template-columns: repeat(3,1fr);
          gap: 16px; padding-top: 24px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .auth-stat-v { font-size: 22px; font-weight: 900; color: #fff; line-height: 1; }
        .auth-stat-l {
          font-size: 10px; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; color: #475569; margin-top: 3px;
        }
        .auth-quote {
          font-size: 13px; font-style: italic; color: #334155;
          font-weight: 500; line-height: 1.6;
        }
        .auth-quote-author {
          font-size: 11px; font-weight: 700; color: #1e293b; margin-top: 6px;
        }
      `}</style>

      <div className="auth-root">
        {/* ── Left branding panel ── */}
        <div className="auth-left">
          <div className="auth-orb auth-orb-1" />
          <div className="auth-orb auth-orb-2" />
          <div className="auth-orb auth-orb-3" />
          <div className="auth-grid" />

          {/* Logo */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#fff', fontWeight: 800, fontSize: 18, letterSpacing: '-0.025em', textDecoration: 'none' }}>
              Lingoura AI
            </Link>
          </div>

          {/* Main pitch */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="auth-badge">
              <div className="auth-badge-dot" />
              <span className="auth-badge-text">AI-Powered · Live</span>
            </div>
            <h2 className="auth-headline">
              Master English<br />
              <span className="auth-grad">with precision AI</span>
            </h2>
            <p className="auth-sub">
              Join 10,000+ candidates achieving Band 8.0+ with cognitive science-backed preparation.
            </p>
            <div className="auth-features">
              {FEATURES.map((f, i) => (
                <div key={i} className="auth-feature">
                  <div className="auth-feature-ico">{f.icon}</div>
                  <span className="auth-feature-text">{f.text}</span>
                </div>
              ))}
            </div>
            <div className="auth-stats">
              {STATS.map((s, i) => (
                <div key={i}>
                  <div className="auth-stat-v">{s.value}</div>
                  <div className="auth-stat-l">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quote */}
          <div style={{ position: 'relative', zIndex: 1, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <p className="auth-quote">&ldquo;The only platform that understands IELTS at the examiner level.&rdquo;</p>
            <p className="auth-quote-author">— David Müller, Band 9.0</p>
          </div>
        </div>

        {/* ── Right form panel ── */}
        <div className="auth-right">
          <div className="auth-mobile-bar">
            <Link href="/" style={{ color: '#fff', fontWeight: 800, fontSize: 17, letterSpacing: '-0.025em', textDecoration: 'none' }}>
              Lingoura AI
            </Link>
          </div>

          <div className="auth-form-area">
            <div className="auth-form-inner">
              <div className="auth-form-logo">
                <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#fff', fontWeight: 800, fontSize: 18, letterSpacing: '-0.025em', textDecoration: 'none', marginBottom: 0 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', fontSize: 16 }}>✦</span>
                  Lingoura AI
                </Link>
              </div>
              {children}
            </div>
          </div>

          <div className="auth-footer-bar">
            Protected by industry-standard encryption · © 2026 Lingoura AI
          </div>
        </div>
      </div>
    </>
  );
}
