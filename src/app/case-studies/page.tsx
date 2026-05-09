"use client";
import { useState, useEffect, useRef } from "react";
import { Sun, Moon, ArrowLeft, TrendingUp, Award, Users, BookOpen, Star, CheckCircle2 } from "lucide-react";
import { MeshBackground } from "@/components/MeshBackground";
import Link from "next/link";

// ─── Font & Style Loader ───────────────────────────────────────────────────
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --font: 'Plus Jakarta Sans', sans-serif;
      --bg: #FAFBFF;
      --ink: #111111;
      --muted: #6B7280;
      --light: #C4C4C4;
      --indigo: #6366F1;
      --violet: #7C3AED;
      --indigo-light: #EEF2FF;
      --card-bg: #FFFFFF;
      --nav-bg: rgba(255, 255, 255, 0.75);
      --border: rgba(17,17,17,.07);
      --input-bg: #F4F5FC;
    }

    .landing-dark {
      --bg: #0B0E14;
      --ink: #F9FAFB;
      --muted: #9CA3AF;
      --light: #374151;
      --indigo: #818CF8;
      --violet: #A78BFA;
      --indigo-light: rgba(99, 102, 241, 0.15);
      --card-bg: #151B28;
      --nav-bg: rgba(11, 14, 20, 0.8);
      --border: rgba(255,255,255,0.1);
      --input-bg: #1A2131;
    }

    html { scroll-behavior: smooth; }

    .case-studies-wrapper {
      font-family: var(--font);
      background: var(--bg);
      color: var(--ink);
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
      position: relative;
      min-height: 100vh;
      transition: background-color 0.4s ease, color 0.4s ease;
    }

    /* ── Nav ── */
    .nav {
      position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
      width: calc(100% - 40px); max-width: 1200px; z-index: 1000;
      height: 68px;
      display: flex; align-items: center;
      padding: 0 32px;
      background: var(--nav-bg);
      backdrop-filter: blur(24px) saturate(180%);
      border: 1px solid var(--border);
      border-radius: 24px;
      box-shadow: 0 12px 40px rgba(0,0,0,0.06);
      transition: all 0.3s ease;
    }
    .nav-inner {
      width: 100%;
      display: flex; justify-content: space-between; align-items: center;
    }
    .logo {
      display: flex; align-items: center; gap: 4px;
      font-family: var(--font); font-weight: 800; font-size: 24px;
      letter-spacing: -.03em;
      background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #EC4899 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-decoration: none;
    }

    /* ── Hero ── */
    .hero {
      padding: 160px 48px 80px;
      text-align: center;
      max-width: 900px;
      margin: 0 auto;
    }
    .hero-h1 {
      font-size: clamp(48px, 8vw, 84px);
      font-weight: 800;
      line-height: .95;
      letter-spacing: -.045em;
      margin-bottom: 24px;
    }
    .grad-text {
      background: linear-gradient(135deg, var(--violet) 0%, var(--indigo) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* ── Case Study Grid ── */
    .case-grid {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 48px 120px;
      display: grid;
      grid-template-columns: 1fr;
      gap: 64px;
    }

    .case-card {
      background: var(--card-bg);
      border-radius: 40px;
      border: 1px solid var(--border);
      overflow: hidden;
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      box-shadow: 0 20px 50px rgba(0,0,0,0.04);
      transition: transform 0.4s ease, box-shadow 0.4s ease;
    }
    .case-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 40px 80px rgba(99,102,241,0.1);
    }

    .case-image-area {
      background: var(--input-bg);
      padding: 60px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 32px;
    }

    .case-content {
      padding: 60px;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .stat-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border-radius: 99px;
      background: var(--indigo-light);
      color: var(--indigo);
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .case-title {
      font-size: 32px;
      font-weight: 800;
      letter-spacing: -0.02em;
      line-height: 1.2;
    }

    .case-desc {
      font-size: 16px;
      color: var(--muted);
      line-height: 1.7;
    }

    .metric-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-top: 12px;
    }
    .metric-card {
      background: var(--bg);
      padding: 20px;
      border-radius: 20px;
      border: 1px solid var(--border);
    }
    .metric-value {
      font-size: 24px;
      font-weight: 800;
      color: var(--indigo);
      margin-bottom: 4px;
    }
    .metric-label {
      font-size: 12px;
      font-weight: 600;
      color: var(--muted);
      text-transform: uppercase;
    }

    .feature-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .feature-item {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 14px;
      font-weight: 600;
    }
    .feature-dot {
      color: #10B981;
    }

    .btn-back {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: var(--muted);
      text-decoration: none;
      font-size: 14px;
      font-weight: 700;
      transition: color 0.2s;
    }
    .btn-back:hover {
      color: var(--indigo);
    }

    @media (max-width: 1024px) {
      .case-card { grid-template-columns: 1fr; }
      .case-image-area { padding: 40px; }
      .case-content { padding: 40px; }
    }
    @media (max-width: 768px) {
      .hero { padding: 120px 24px 60px; }
      .hero-h1 { font-size: 42px; }
      .case-grid { padding: 0 24px 80px; }
    }
  `}</style>
);

const CaseStudiesPage = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("landing-theme");
    if (saved === "dark") setIsDark(true);
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    localStorage.setItem("landing-theme", newDark ? "dark" : "light");
  };

  const cases = [
    {
      title: "How Maria boosted her Speaking score from 6.0 to 8.0 in 4 weeks",
      desc: "Maria struggled with fluency and hesitation during the speaking section. By practicing 30 minutes daily with our AI Speaking Coach, she received instant feedback on her pronunciation and lexical resource.",
      metrics: [
        { label: "Band Score Improvement", value: "+2.0 Bands" },
        { label: "Practice Sessions", value: "28 Hours" },
      ],
      features: [
        "Real-time Fluency Analysis",
        "Vocabulary Enhancement Feedback",
        "Mock Interview Simulations",
        "Part 2 Cue Card Mastery"
      ],
      category: "Speaking Success",
      icon: "🎙️"
    },
    {
      title: "Mastering Coherence & Cohesion: Ahmed's Writing Breakthrough",
      desc: "Ahmed's writing was grammatically correct but lacked logical flow. Our AI Writing Evaluator pinpointed exactly where his transitions were weak and provided structural templates that transformed his essays.",
      metrics: [
        { label: "Writing Band", value: "8.5" },
        { label: "Essays Evaluated", value: "45" },
      ],
      features: [
        "Coherence Score Breakdown",
        "Grammatical Range Analysis",
        "Sample Model Answers",
        "Automated Error Correction"
      ],
      category: "Writing Mastery",
      icon: "✍️"
    },
    {
      title: "Scaling IELTS Preparation: Global Language Academy Case",
      desc: "A language academy with 500+ students integrated Lingoura AI into their curriculum. They saw a 40% increase in student satisfaction and a significant reduction in teacher grading time.",
      metrics: [
        { label: "Student Pass Rate", value: "94%" },
        { label: "Admin Time Saved", value: "65%" },
      ],
      features: [
        "Multi-student Dashboard",
        "Performance Benchmarking",
        "Curriculum Integration",
        "Automated Progress Reports"
      ],
      category: "Institutional Growth",
      icon: "🏫"
    }
  ];

  return (
    <div className={`case-studies-wrapper ${isDark ? "landing-dark" : ""}`}>
      <FontLoader />
      <MeshBackground />

      <nav className="nav">
        <div className="nav-inner">
          <Link href="/" className="logo">
            <img src="/logo-icon.png" alt="Logo" style={{ height: 40, width: "auto" }} />
            Lingoura AI
          </Link>
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2.5 rounded-xl transition-all active:scale-95 flex items-center justify-center"
              style={{ background: isDark ? "rgba(255,255,255,0.05)" : "rgba(17,17,17,0.03)" }}
            >
              {isDark ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-indigo-600" />}
            </button>
            <Link href="/" className="btn-back">
              <ArrowLeft size={16} />
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      <header className="hero">
        <div className="stat-badge" style={{ marginBottom: 24 }}>Success Stories</div>
        <h1 className="hero-h1">
          Real Results <br />
          <span className="grad-text">Driven by AI</span>
        </h1>
        <p style={{ fontSize: 18, color: "var(--muted)", maxWidth: 600, margin: "0 auto", lineHeight: 1.6 }}>
          Discover how students and institutions around the world are using Lingoura AI to achieve exceptional IELTS results in record time.
        </p>
      </header>

      <main className="case-grid">
        {cases.map((c, i) => (
          <div key={i} className="case-card">
            <div className="case-image-area">
              <div style={{ fontSize: 64 }}>{c.icon}</div>
              <div className="metric-grid">
                {c.metrics.map((m, mi) => (
                  <div key={mi} className="metric-card">
                    <div className="metric-value">{m.value}</div>
                    <div className="metric-label">{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="case-content">
              <div className="stat-badge">{c.category}</div>
              <h2 className="case-title">{c.title}</h2>
              <p className="case-desc">{c.desc}</p>
              <div className="feature-list">
                {c.features.map((f, fi) => (
                  <div key={fi} className="feature-item">
                    <CheckCircle2 size={16} className="feature-dot" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </main>

      <footer style={{ padding: "60px 48px", textAlign: "center", borderTop: "1px solid var(--border)" }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: "var(--light)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Ready to write your own success story?
        </p>
        <Link href="/#pricing" style={{ 
          marginTop: 24, 
          display: "inline-block", 
          padding: "16px 32px", 
          background: "var(--indigo)", 
          color: "#fff", 
          borderRadius: "14px", 
          textDecoration: "none", 
          fontWeight: 700,
          boxShadow: "0 10px 30px rgba(99,102,241,0.2)"
        }}>
          Join Lingoura AI Today
        </Link>
      </footer>
    </div>
  );
};

export default CaseStudiesPage;
