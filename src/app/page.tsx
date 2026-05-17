"use client";
import { useState, useEffect, useRef } from "react";
import { Sun, Moon } from "lucide-react";

// ─── Font + Global CSS ─────────────────────────────────────────────────────
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --font: 'Manrope', 'Plus Jakarta Sans', system-ui, sans-serif;
      --bg:          #020617;
      --surface:     #0f172a;
      --surface-hi:  #1e293b;
      --ink:         #f8fafc;
      --muted:       #94a3b8;
      --outline:     rgba(255,255,255,0.08);
      --primary:     #c0c1ff;
      --secondary:   #ffb0cd;
      --tertiary:    #89ceff;
      --radius-xl:   28px;
      --radius-lg:   20px;
      --radius-md:   14px;
      --radius-pill: 9999px;
    }
    .lp-light {
      --bg:        #f8fafc;
      --surface:   #f1f5f9;
      --surface-hi:#e2e8f0;
      --ink:       #0f172a;
      --muted:     #64748b;
      --outline:   rgba(0,0,0,0.07);
      --primary:   #6366f1;
      --secondary: #ec4899;
      --tertiary:  #0ea5e9;
    }

    html { scroll-behavior: smooth; }

    /* ── Page shell ── */
    .lp {
      font-family: var(--font);
      background-color: var(--bg);
      color: var(--ink);
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
      min-height: 100vh;
      position: relative;
      transition: background-color 0.4s, color 0.4s;
    }

    /* Mesh gradient overlay */
    .lp::after {
      content: '';
      position: fixed; inset: 0; pointer-events: none; z-index: 0;
      background:
        radial-gradient(ellipse at 0% 0%,   rgba(192,193,255,.09) 0, transparent 55%),
        radial-gradient(ellipse at 100% 0%,  rgba(255,176,205,.06) 0, transparent 55%),
        radial-gradient(ellipse at 100% 100%,rgba(137,206,255,.04) 0, transparent 55%),
        radial-gradient(ellipse at 0% 100%,  rgba(192,193,255,.04) 0, transparent 55%);
    }
    .lp-light::after {
      background:
        radial-gradient(ellipse at 0% 0%,   rgba(99,102,241,.05) 0, transparent 55%),
        radial-gradient(ellipse at 100% 0%,  rgba(236,72,153,.03) 0, transparent 55%),
        radial-gradient(ellipse at 100% 100%,rgba(14,165,233,.02) 0, transparent 55%);
    }
    .lp > * { position: relative; z-index: 1; }

    /* ── Keyframes ── */
    @keyframes fadeUp {
      from { opacity:0; transform:translateY(28px); }
      to   { opacity:1; transform:translateY(0); }
    }
    @keyframes marquee {
      from { transform:translateX(0); }
      to   { transform:translateX(-50%); }
    }
    @keyframes waveFloat {
      0%,100% { transform:scaleY(1); }
      50%     { transform:scaleY(1.6); }
    }
    @keyframes floatY {
      0%,100% { transform:translateY(0); }
      50%     { transform:translateY(-10px); }
    }

    .fade-up { animation: fadeUp .85s cubic-bezier(.22,1,.36,1) both; }
    .d1 { animation-delay:.1s; } .d2 { animation-delay:.2s; }
    .d3 { animation-delay:.3s; } .d4 { animation-delay:.4s; }
    .d5 { animation-delay:.5s; }

    .reveal {
      opacity:0; transform:translateY(24px);
      transition: opacity .75s cubic-bezier(.22,1,.36,1), transform .75s cubic-bezier(.22,1,.36,1);
    }
    .reveal.vis { opacity:1; transform:translateY(0); }

    /* ── Gradient text ── */
    .grad {
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    }
    .grad-tri {
      background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 50%, var(--tertiary) 100%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    }
    .glow { text-shadow: 0 0 60px rgba(192,193,255,.4); }
    .lp-light .glow { text-shadow: 0 0 60px rgba(99,102,241,.2); }

    /* ── Glass surface ── */
    .glass {
      backdrop-filter: blur(24px) saturate(180%);
      background: rgba(255,255,255,.03);
      border: 1px solid rgba(255,255,255,.1);
    }
    .lp-light .glass {
      background: rgba(255,255,255,.75);
      border-color: rgba(0,0,0,.07);
    }
    .card {
      background: var(--surface);
      border: 1px solid var(--outline);
      border-radius: var(--radius-xl);
    }
    .lp-light .card {
      background: #fff;
      box-shadow: 0 4px 24px rgba(0,0,0,.05);
    }

    /* ── Nav ── */
    .nav {
      position: fixed; top: 14px; left: 50%; transform: translateX(-50%);
      width: calc(100% - 40px); max-width: 1280px; z-index: 200;
      height: 64px; display: flex; align-items: center; justify-content: space-between;
      padding: 0 28px;
      background: rgba(2,6,23,.55);
      backdrop-filter: blur(28px) saturate(200%);
      border: 1px solid rgba(255,255,255,.1);
      border-radius: var(--radius-pill);
      box-shadow: 0 8px 40px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.06);
      transition: all .3s;
    }
    .lp-light .nav {
      background: rgba(248,250,252,.8);
      border-color: rgba(0,0,0,.08);
      box-shadow: 0 8px 40px rgba(0,0,0,.08);
    }
    .logo {
      display: flex; align-items: center; gap: 4px;
      font-size: 18px; font-weight: 800; letter-spacing: -.025em;
      color: var(--ink); text-decoration: none;
    }
    .logo-img { height: 52px; width: auto; margin-left: -8px; }
    .nav-links { display: flex; align-items: center; gap: 36px; list-style: none; }
    .nav-links a {
      font-size: 14px; font-weight: 600; color: var(--muted);
      text-decoration: none; transition: color .2s;
    }
    .nav-links a:hover { color: var(--ink); }
    .nav-links a.active { color: var(--primary); border-bottom: 2px solid var(--primary); padding-bottom: 2px; }
    .nav-actions { display: flex; align-items: center; gap: 12px; }
    .theme-btn {
      width: 38px; height: 38px; border-radius: 50%; border: none;
      background: rgba(255,255,255,.06); cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      color: var(--muted); transition: all .2s;
    }
    .lp-light .theme-btn { background: rgba(0,0,0,.05); }
    .theme-btn:hover { background: rgba(255,255,255,.12); color: var(--ink); }
    .lp-light .theme-btn:hover { background: rgba(0,0,0,.09); }
    .btn-pill {
      padding: 10px 22px; border-radius: var(--radius-pill); border: none;
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      color: #02061a; font-family: var(--font); font-size: 13px; font-weight: 700;
      cursor: pointer; transition: all .25s; white-space: nowrap;
      box-shadow: 0 4px 18px rgba(192,193,255,.25);
      text-decoration: none; display: inline-flex; align-items: center;
    }
    .btn-pill:hover { transform: scale(1.04); box-shadow: 0 8px 28px rgba(192,193,255,.35); }
    .btn-pill:active { transform: scale(.97); }
    .lp-light .btn-pill { color: #02061a; }

    /* ── Section base ── */
    .section { padding: 100px 24px; }
    .container { max-width: 1280px; margin: 0 auto; }
    .section-tag {
      display: inline-block;
      font-size: 11px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase;
      color: var(--primary); margin-bottom: 16px;
    }
    .section-h2 {
      font-size: clamp(30px, 4.5vw, 54px);
      font-weight: 800; letter-spacing: -.035em; line-height: 1.07;
      color: var(--ink); margin-bottom: 16px;
    }
    .section-sub {
      font-size: 18px; font-weight: 500; color: var(--muted); line-height: 1.65;
    }

    /* ── Hero ── */
    .hero {
      padding: 168px 24px 80px;
      display: flex; flex-direction: column; align-items: center; text-align: center;
      max-width: 1280px; margin: 0 auto;
    }
    .hero-badge {
      display: inline-flex; align-items: center; gap: 10px;
      padding: 7px 20px; border-radius: var(--radius-pill);
      background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.12);
      margin-bottom: 36px;
    }
    .lp-light .hero-badge { background: rgba(99,102,241,.06); border-color: rgba(99,102,241,.18); }
    .badge-dot {
      width: 8px; height: 8px; border-radius: 50%;
      background: var(--secondary); box-shadow: 0 0 12px rgba(255,176,205,.8);
    }
    .lp-light .badge-dot { background: var(--secondary); box-shadow: 0 0 12px rgba(236,72,153,.4); }
    .badge-text { font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--secondary); }
    .lp-light .badge-text { color: var(--secondary); }
    .hero-h1 {
      font-size: clamp(48px, 9.5vw, 108px);
      font-weight: 800; letter-spacing: -.05em; line-height: .94;
      color: var(--ink); margin-bottom: 28px; max-width: 920px;
    }
    .hero-sub {
      font-size: clamp(16px, 1.8vw, 20px); font-weight: 500;
      color: var(--muted); line-height: 1.65; max-width: 600px; margin-bottom: 48px;
    }
    .hero-ctas { display: flex; gap: 16px; flex-wrap: wrap; justify-content: center; margin-bottom: 52px; }
    .btn-hero-main {
      padding: 18px 48px; border-radius: var(--radius-pill); border: none;
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      color: #02061a; font-family: var(--font); font-size: 16px; font-weight: 700;
      cursor: pointer; transition: all .3s;
      box-shadow: 0 8px 32px rgba(192,193,255,.3);
      text-decoration: none; display: inline-block;
    }
    .btn-hero-main:hover { transform: scale(1.05); box-shadow: 0 14px 44px rgba(192,193,255,.45); }
    .btn-hero-ghost {
      padding: 17px 40px; border-radius: var(--radius-pill);
      border: 1px solid rgba(255,255,255,.15);
      background: rgba(255,255,255,.05); backdrop-filter: blur(12px);
      color: var(--ink); font-family: var(--font); font-size: 16px; font-weight: 600;
      cursor: pointer; transition: all .3s;
      display: inline-flex; align-items: center; gap: 8px; text-decoration: none;
    }
    .lp-light .btn-hero-ghost { border-color: rgba(0,0,0,.13); background: rgba(255,255,255,.8); }
    .btn-hero-ghost:hover { background: rgba(255,255,255,.1); }
    .lp-light .btn-hero-ghost:hover { background: #fff; box-shadow: 0 4px 16px rgba(0,0,0,.08); }

    /* Social proof */
    .social-proof { display: flex; flex-direction: column; align-items: center; gap: 14px; margin-bottom: 72px; }
    .avatars { display: flex; }
    .av {
      width: 44px; height: 44px; border-radius: 50%;
      border: 2.5px solid var(--bg); margin-left: -12px;
      background: var(--surface-hi);
      display: flex; align-items: center; justify-content: center; font-size: 20px;
    }
    .av:first-child { margin-left: 0; }
    .av-plus {
      width: 44px; height: 44px; border-radius: 50%;
      border: 2.5px solid var(--bg); margin-left: -12px;
      background: var(--surface-hi);
      display: flex; align-items: center; justify-content: center;
      font-size: 11px; font-weight: 700; color: var(--primary);
    }
    .sp-label { font-size: 15px; font-weight: 600; color: var(--ink); }

    /* Hero visual */
    .hero-visual {
      width: 100%; max-width: 960px;
      border-radius: 32px;
      overflow: hidden;
      border: 1px solid var(--outline);
      box-shadow: 0 0 0 1px rgba(255,255,255,.04), 0 48px 120px rgba(192,193,255,.09);
      background: var(--surface);
    }
    .hv-topbar {
      height: 44px; background: var(--bg); border-bottom: 1px solid var(--outline);
      display: flex; align-items: center; padding: 0 20px; gap: 8px;
    }
    .hv-dot { width: 11px; height: 11px; border-radius: 50%; }
    .hv-body {
      display: grid; grid-template-columns: 190px 1fr;
      aspect-ratio: 16/7; overflow: hidden;
    }
    .hv-sidebar { border-right: 1px solid var(--outline); padding: 18px 14px; display: flex; flex-direction: column; gap: 6px; }
    .hv-si {
      height: 34px; border-radius: 9px; border: 1px solid transparent;
      display: flex; align-items: center; padding: 0 10px; gap: 8px;
      background: rgba(255,255,255,.03);
    }
    .hv-si.act { background: rgba(192,193,255,.1); border-color: rgba(192,193,255,.2); }
    .lp-light .hv-si.act { background: rgba(99,102,241,.08); border-color: rgba(99,102,241,.18); }
    .hv-si-ico { width: 14px; height: 14px; border-radius: 4px; background: var(--primary); opacity: .6; flex-shrink:0; }
    .hv-si-line { height: 7px; border-radius: 4px; background: rgba(255,255,255,.1); flex: 1; }
    .hv-si.act .hv-si-line { background: rgba(192,193,255,.35); }
    .hv-main { padding: 20px; display: flex; flex-direction: column; gap: 14px; }
    .hv-row { display: flex; align-items: center; justify-content: space-between; }
    .hv-title { height: 12px; border-radius: 6px; background: rgba(255,255,255,.14); width: 120px; }
    .hv-action { height: 28px; border-radius: 8px; background: rgba(192,193,255,.2); width: 72px; }
    .hv-stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; }
    .hv-stat {
      background: rgba(255,255,255,.03); border: 1px solid var(--outline);
      border-radius: 12px; padding: 12px;
    }
    .hv-stat-v { height: 16px; border-radius: 5px; width: 55%; margin-bottom: 6px; }
    .hv-stat-l { height: 7px; border-radius: 4px; background: rgba(255,255,255,.07); width: 75%; }
    .hv-chart {
      flex: 1; border-radius: 14px;
      background: rgba(255,255,255,.02); border: 1px solid var(--outline);
      display: flex; align-items: flex-end; padding: 14px; gap: 6px;
    }
    .hv-bar { flex: 1; border-radius: 4px 4px 0 0; }

    /* ── Marquee ── */
    .marquee-wrap {
      padding: 44px 0; overflow: hidden;
      border-top: 1px solid var(--outline); border-bottom: 1px solid var(--outline);
      background: rgba(255,255,255,.01);
    }
    .marquee-label {
      text-align: center; margin-bottom: 28px;
      font-size: 11px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase;
      color: var(--muted); opacity: .6;
    }
    .marquee-track { display: flex; animation: marquee 26s linear infinite; white-space: nowrap; }
    .marquee-inner { display: flex; align-items: center; gap: 72px; padding: 0 36px; min-width: max-content; }
    .mq-logo {
      font-size: 17px; font-weight: 800; letter-spacing: -.02em;
      color: var(--muted); opacity: .3; transition: opacity .2s; cursor: default;
    }
    .mq-logo:hover { opacity: .65; }

    /* ── Bento grid (features) ── */
    .bento { display: grid; grid-template-columns: repeat(12, 1fr); gap: 18px; margin-top: 56px; }
    .bento-8 { grid-column: span 8; }
    .bento-4 { grid-column: span 4; }
    .bento-card {
      border-radius: 24px; padding: 36px;
      overflow: hidden; position: relative;
      min-height: 300px; display: flex; flex-direction: column;
    }
    .bento-card .bc-icon { font-size: 32px; margin-bottom: 16px; }
    .bento-card h3 { font-size: 22px; font-weight: 800; letter-spacing: -.02em; color: var(--ink); margin-bottom: 10px; }
    .bento-card p { font-size: 15px; font-weight: 500; color: var(--muted); line-height: 1.65; max-width: 360px; }
    .bento-glow {
      position: absolute; width: 260px; height: 260px; border-radius: 50%;
      filter: blur(80px); pointer-events: none;
    }
    .bento-glow-r { right: -60px; bottom: -60px; }
    .bento-glow-l { left: -60px; top: -60px; }

    /* Waveform in speaking card */
    .waveform { display: flex; gap: 4px; align-items: flex-end; height: 88px; margin-top: auto; padding-top: 24px; }
    .wv { flex: 1; border-radius: 3px 3px 0 0; }
    .wv:nth-child(1) { height: 40%; animation: waveFloat 1.8s ease-in-out infinite; }
    .wv:nth-child(2) { height: 65%; animation: waveFloat 1.8s ease-in-out .2s infinite; }
    .wv:nth-child(3) { height: 100%; animation: waveFloat 1.8s ease-in-out .4s infinite; }
    .wv:nth-child(4) { height: 55%; animation: waveFloat 1.8s ease-in-out .6s infinite; }
    .wv:nth-child(5) { height: 35%; animation: waveFloat 1.8s ease-in-out .8s infinite; }

    /* Band score display */
    .band-score {
      font-size: 56px; font-weight: 900; letter-spacing: -.04em;
      margin-top: auto; padding-top: 24px;
    }

    /* ── Capability cards ── */
    .cap-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; margin-top: 56px; }
    .cap-card { padding: 8px; transition: transform .3s; }
    .cap-card:hover { transform: translateY(-4px); }
    .cap-ico {
      width: 52px; height: 52px; border-radius: 14px;
      display: flex; align-items: center; justify-content: center;
      font-size: 22px; margin-bottom: 20px; border: 1px solid;
    }
    .cap-ico.p { background: rgba(192,193,255,.1); border-color: rgba(192,193,255,.2); }
    .cap-ico.s { background: rgba(255,176,205,.1); border-color: rgba(255,176,205,.2); }
    .cap-ico.t { background: rgba(137,206,255,.1); border-color: rgba(137,206,255,.2); }
    .lp-light .cap-ico.p { background: rgba(99,102,241,.08); border-color: rgba(99,102,241,.2); }
    .lp-light .cap-ico.s { background: rgba(236,72,153,.08); border-color: rgba(236,72,153,.2); }
    .lp-light .cap-ico.t { background: rgba(14,165,233,.08); border-color: rgba(14,165,233,.2); }
    .cap-card h4 { font-size: 18px; font-weight: 800; letter-spacing: -.015em; color: var(--ink); margin-bottom: 10px; }
    .cap-card p { font-size: 15px; font-weight: 500; color: var(--muted); line-height: 1.65; }

    /* ── Timeline / Roadmap ── */
    .timeline { position: relative; max-width: 740px; margin: 64px auto 0; }
    .tl-line {
      position: absolute; left: 50%; top: 16px; bottom: 16px;
      width: 1px; background: var(--outline); transform: translateX(-50%);
    }
    .tl-step {
      display: grid; grid-template-columns: 1fr 48px 1fr; gap: 20px;
      align-items: center; margin-bottom: 56px; position: relative;
    }
    .tl-step:last-child { margin-bottom: 0; }
    .tl-node {
      width: 28px; height: 28px; border-radius: 50%;
      background: var(--surface); border: 3.5px solid; z-index: 1;
      box-shadow: 0 0 0 4px var(--bg);
      justify-self: center;
    }
    .tl-node.p { border-color: var(--primary); box-shadow: 0 0 0 4px var(--bg), 0 0 18px rgba(192,193,255,.5); }
    .tl-node.s { border-color: var(--secondary); box-shadow: 0 0 0 4px var(--bg), 0 0 18px rgba(255,176,205,.5); }
    .tl-node.t { border-color: var(--tertiary); box-shadow: 0 0 0 4px var(--bg), 0 0 18px rgba(137,206,255,.5); }
    .tl-content { }
    .tl-step:nth-child(odd) .tl-left { text-align: right; }
    .tl-step:nth-child(even) .tl-left { text-align: left; order: 3; }
    .tl-step:nth-child(even) .tl-right { order: 1; text-align: right; }
    .tl-chip {
      display: inline-block; padding: 3px 12px; border-radius: var(--radius-pill);
      font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase;
      background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1);
      margin-bottom: 8px;
    }
    .lp-light .tl-chip { background: rgba(0,0,0,.04); border-color: rgba(0,0,0,.09); }
    .tl-title { font-size: 18px; font-weight: 800; letter-spacing: -.02em; color: var(--ink); margin-bottom: 6px; }
    .tl-desc { font-size: 14px; font-weight: 500; color: var(--muted); line-height: 1.6; }
    .tl-glass-chip {
      display: inline-block; padding: 8px 16px; border-radius: 10px;
      font-size: 13px; font-weight: 700; border: 1px solid rgba(255,255,255,.1);
      backdrop-filter: blur(12px); background: rgba(255,255,255,.04);
    }
    .lp-light .tl-glass-chip { background: rgba(0,0,0,.04); border-color: rgba(0,0,0,.09); }

    /* ── Testimonials ── */
    .testi-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; margin-top: 56px; }
    .testi-card { border-radius: 24px; padding: 32px; display: flex; flex-direction: column; gap: 20px; transition: transform .3s; }
    .testi-card:hover { transform: translateY(-6px); }
    .testi-user { display: flex; align-items: center; gap: 14px; }
    .testi-av {
      width: 48px; height: 48px; border-radius: 50%;
      background: var(--surface-hi); border: 2px solid rgba(255,255,255,.1);
      display: flex; align-items: center; justify-content: center; font-size: 22px;
      flex-shrink: 0;
    }
    .testi-name { font-size: 15px; font-weight: 700; color: var(--ink); }
    .testi-role { font-size: 11px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
    .testi-quote { font-size: 15px; font-weight: 500; color: var(--muted); line-height: 1.72; font-style: italic; flex: 1; }
    .stars { font-size: 14px; letter-spacing: 2px; }

    /* ── Pricing ── */
    .pricing-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; align-items: center; max-width: 1100px; }
    .plan-card {
      border-radius: 26px; padding: 44px; display: flex; flex-direction: column; gap: 26px;
      border: 1px solid var(--outline);
      background: var(--surface);
      transition: transform .4s cubic-bezier(.23,1,.32,1), box-shadow .4s;
      position: relative;
    }
    .lp-light .plan-card { background: #fff; }
    .plan-card:not(.featured):hover { transform: translateY(-8px); box-shadow: 0 24px 60px rgba(0,0,0,.12); }
    .plan-card.featured {
      background: linear-gradient(145deg, rgba(192,193,255,.1), rgba(192,193,255,.02));
      border-color: rgba(192,193,255,.35);
      box-shadow: 0 0 0 1px rgba(192,193,255,.2), 0 28px 70px rgba(192,193,255,.12);
      transform: scale(1.04);
    }
    .lp-light .plan-card.featured {
      background: linear-gradient(145deg, rgba(99,102,241,.07), rgba(99,102,241,.01));
      border-color: rgba(99,102,241,.28);
      box-shadow: 0 0 0 1px rgba(99,102,241,.18), 0 28px 70px rgba(99,102,241,.1);
    }
    .plan-card.featured:hover { transform: scale(1.04) translateY(-8px); }
    .feat-chip {
      position: absolute; top: -16px; left: 50%; transform: translateX(-50%);
      padding: 5px 20px; border-radius: var(--radius-pill);
      background: var(--primary); color: #02061a;
      font-size: 10px; font-weight: 800; letter-spacing: .14em; text-transform: uppercase;
      white-space: nowrap; box-shadow: 0 4px 16px rgba(192,193,255,.3);
    }
    .lp-light .feat-chip { color: #02061a; }
    .plan-name { font-size: 24px; font-weight: 800; letter-spacing: -.025em; color: var(--ink); }
    .plan-price-row { display: flex; align-items: baseline; gap: 6px; }
    .plan-price { font-size: 52px; font-weight: 800; letter-spacing: -.045em; line-height: 1; color: var(--ink); }
    .plan-per { font-size: 15px; font-weight: 500; color: var(--muted); }
    .plan-features { display: flex; flex-direction: column; gap: 13px; flex: 1; }
    .pf-row { display: flex; align-items: center; gap: 11px; font-size: 15px; font-weight: 500; color: var(--ink); }
    .pf-check { color: var(--primary); font-weight: 900; font-size: 13px; flex-shrink: 0; }
    .plan-btn {
      width: 100%; padding: 15px; border-radius: var(--radius-pill);
      font-family: var(--font); font-size: 14px; font-weight: 700; cursor: pointer; transition: all .3s;
    }
    .plan-btn.outline { background: transparent; border: 1px solid rgba(255,255,255,.18); color: var(--ink); }
    .lp-light .plan-btn.outline { border-color: rgba(0,0,0,.14); }
    .plan-btn.outline:hover { border-color: rgba(255,255,255,.4); background: rgba(255,255,255,.05); }
    .lp-light .plan-btn.outline:hover { border-color: rgba(0,0,0,.25); background: rgba(0,0,0,.03); }
    .plan-btn.filled { background: var(--primary); border: none; color: #02061a; }
    .plan-btn.filled:hover { transform: scale(1.02); box-shadow: 0 8px 32px rgba(192,193,255,.3); }
    .lp-light .plan-btn.filled { color: #02061a; }

    /* Billing toggle */
    .billing-toggle {
      display: flex; gap: 4px; padding: 4px;
      background: rgba(255,255,255,.05); border-radius: var(--radius-md);
      border: 1px solid rgba(255,255,255,.08);
      margin: 28px 0 48px;
    }
    .lp-light .billing-toggle { background: rgba(0,0,0,.04); border-color: rgba(0,0,0,.07); }
    .toggle-btn {
      padding: 9px 24px; border-radius: 10px; border: none;
      background: transparent; cursor: pointer; font-family: var(--font);
      font-size: 12px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase;
      color: var(--muted); transition: all .2s; display: flex; align-items: center; gap: 8px;
    }
    .toggle-btn.active { background: rgba(255,255,255,.08); color: var(--ink); }
    .lp-light .toggle-btn.active { background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,.07); color: var(--ink); }
    .save-badge {
      font-size: 9px; font-weight: 800; letter-spacing: .1em;
      background: var(--primary); color: #02061a; padding: 2px 8px; border-radius: 6px;
    }

    /* ── FAQ ── */
    .faq-list { display: flex; flex-direction: column; gap: 10px; }
    .faq-item {
      border-radius: var(--radius-md); overflow: hidden;
      border: 1px solid rgba(255,255,255,.07);
      background: rgba(255,255,255,.02); transition: all .25s;
    }
    .lp-light .faq-item { border-color: rgba(0,0,0,.07); background: rgba(0,0,0,.02); }
    .faq-item.open { background: rgba(255,255,255,.04); border-color: rgba(192,193,255,.2); }
    .lp-light .faq-item.open { background: #fff; border-color: rgba(99,102,241,.2); box-shadow: 0 4px 20px rgba(0,0,0,.05); }
    .faq-trigger {
      display: flex; justify-content: space-between; align-items: center;
      padding: 20px 22px; cursor: pointer; gap: 16px;
    }
    .faq-q { font-size: 16px; font-weight: 700; color: var(--ink); }
    .faq-ch { color: var(--muted); transition: transform .3s; font-size: 20px; flex-shrink: 0; }
    .faq-item.open .faq-ch { transform: rotate(180deg); color: var(--primary); }
    .faq-ans { padding: 0 22px 20px; font-size: 15px; font-weight: 500; color: var(--muted); line-height: 1.65; }

    /* ── CTA box ── */
    .cta-box {
      border-radius: 32px; padding: 88px 48px; text-align: center; position: relative; overflow: hidden;
      background: linear-gradient(145deg, rgba(192,193,255,.1) 0%, rgba(15,23,42,0) 60%, rgba(255,176,205,.06) 100%);
      border: 1px solid rgba(255,255,255,.1);
    }
    .lp-light .cta-box {
      background: linear-gradient(145deg, rgba(99,102,241,.07) 0%, rgba(255,255,255,0) 60%, rgba(236,72,153,.04) 100%);
      border-color: rgba(0,0,0,.07);
    }
    .cta-orb {
      position: absolute; border-radius: 50%; filter: blur(100px); pointer-events: none;
      width: 360px; height: 360px;
    }
    .cta-orb-1 { background: rgba(192,193,255,.15); top: -120px; left: -80px; }
    .cta-orb-2 { background: rgba(255,176,205,.1); bottom: -120px; right: -80px; }
    .cta-h2 {
      font-size: clamp(36px, 6vw, 72px); font-weight: 800; letter-spacing: -.045em; line-height: 1.03;
      color: var(--ink); margin-bottom: 20px; position: relative; z-index: 1;
    }
    .cta-sub {
      font-size: 18px; font-weight: 500; color: var(--muted);
      max-width: 540px; margin: 0 auto 44px; line-height: 1.65; position: relative; z-index: 1;
    }
    .btn-cta {
      padding: 20px 56px; border-radius: var(--radius-pill); border: none;
      background: var(--ink); color: var(--bg);
      font-family: var(--font); font-size: 16px; font-weight: 700;
      cursor: pointer; transition: all .3s;
      box-shadow: 0 8px 32px rgba(0,0,0,.25); position: relative; z-index: 1;
    }
    .btn-cta:hover { transform: scale(1.04); box-shadow: 0 14px 48px rgba(0,0,0,.35); }

    /* ── Footer ── */
    .footer { padding: 80px 24px 0; border-top: 1px solid var(--outline); }
    .footer-inner { max-width: 1280px; margin: 0 auto; }
    .footer-top { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 48px; padding-bottom: 56px; }
    .footer-logo { font-size: 18px; font-weight: 800; letter-spacing: -.025em; color: var(--ink); margin-bottom: 12px; display: flex; align-items: center; }
    .footer-tagline { font-size: 14px; font-weight: 500; color: var(--muted); line-height: 1.6; max-width: 250px; }
    .footer-col-title { font-size: 10px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: var(--muted); opacity: .55; margin-bottom: 18px; }
    .footer-links { display: flex; flex-direction: column; gap: 11px; }
    .footer-links a { font-size: 14px; font-weight: 600; color: var(--muted); text-decoration: none; transition: color .2s; }
    .footer-links a:hover { color: var(--primary); }
    .footer-bottom {
      display: flex; justify-content: space-between; align-items: center;
      padding: 22px 0 48px; border-top: 1px solid var(--outline);
    }
    .footer-copy { font-size: 12px; font-weight: 600; color: var(--muted); opacity: .5; }
    .footer-wm {
      text-align: center; overflow: hidden; padding-bottom: 8px;
      font-size: clamp(64px, 16vw, 180px); font-weight: 800; letter-spacing: -.05em; line-height: 1;
      color: var(--ink); opacity: .025; white-space: nowrap;
      pointer-events: none; user-select: none;
    }

    /* ── Hamburger / mobile menu ── */
    .hamburger {
      display: none; flex-direction: column; gap: 5px;
      cursor: pointer; padding: 6px; border: none;
      background: none; border-radius: 8px; transition: background .2s;
    }
    .hamburger:hover { background: rgba(255,255,255,.08); }
    .lp-light .hamburger:hover { background: rgba(0,0,0,.06); }
    .hb-line { width: 22px; height: 2px; border-radius: 2px; background: var(--ink); transition: all .3s; }
    .mobile-menu {
      position: fixed; inset: 0; z-index: 150;
      background: var(--bg);
      display: flex; flex-direction: column;
      padding: 90px 32px 40px;
      transform: translateX(110%);
      transition: transform .4s cubic-bezier(.22,1,.36,1);
    }
    .mobile-menu.open { transform: translateX(0); }
    .mobile-menu a {
      font-size: 22px; font-weight: 800; letter-spacing: -.025em;
      color: var(--ink); text-decoration: none;
      padding: 18px 0; border-bottom: 1px solid var(--outline);
      transition: color .2s; display: block;
    }
    .mobile-menu a:hover { color: var(--primary); }
    .mm-cta { margin-top: 32px; }

    /* ── Stats bar ── */
    .stats-section { padding: 0 24px 80px; }
    .stats-bar {
      display: grid; grid-template-columns: repeat(4, 1fr);
      gap: 1px; background: var(--outline);
      border: 1px solid var(--outline); border-radius: 24px;
      overflow: hidden; max-width: 880px; width: 100%; margin: 0 auto;
    }
    .stat-item {
      background: var(--surface); padding: 28px 20px; text-align: center;
      transition: background .2s;
    }
    .stat-item:hover { background: var(--surface-hi); }
    .lp-light .stat-item { background: #fff; }
    .lp-light .stat-item:hover { background: var(--surface); }
    .stat-value { font-size: 34px; font-weight: 900; letter-spacing: -.04em; line-height: 1; }
    .stat-label {
      font-size: 11px; font-weight: 700; letter-spacing: .1em;
      text-transform: uppercase; color: var(--muted); margin-top: 6px;
    }

    /* ── How It Works ── */
    .hiw-grid {
      display: grid; grid-template-columns: repeat(3, 1fr);
      margin-top: 56px; position: relative;
    }
    .hiw-step { padding: 40px 32px; text-align: center; position: relative; z-index: 1; }
    .hiw-step:not(:last-child)::after {
      content: ''; position: absolute;
      top: 52px; right: 0; left: auto;
      width: 1px; height: 40px;
      background: var(--outline);
    }
    .hiw-num {
      width: 40px; height: 40px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 13px; font-weight: 900;
      background: var(--bg); border: 1.5px solid;
      margin: 0 auto 20px;
    }
    .hiw-ico { font-size: 32px; margin-bottom: 14px; }
    .hiw-title { font-size: 19px; font-weight: 800; letter-spacing: -.02em; color: var(--ink); margin-bottom: 10px; }
    .hiw-desc { font-size: 15px; font-weight: 500; color: var(--muted); line-height: 1.65; }

    /* ── Comparison table ── */
    .comp-wrap {
      overflow-x: auto; margin-top: 56px;
      border: 1px solid var(--outline); border-radius: 20px;
      background: var(--surface);
    }
    .lp-light .comp-wrap { background: #fff; }
    .comp-table { width: 100%; border-collapse: collapse; min-width: 520px; }
    .comp-table th {
      padding: 18px 24px; text-align: left;
      font-size: 11px; font-weight: 700; letter-spacing: .1em;
      text-transform: uppercase; color: var(--muted);
      border-bottom: 1px solid var(--outline); white-space: nowrap;
    }
    .comp-table th.comp-ours { color: var(--primary); background: rgba(192,193,255,.05); }
    .lp-light .comp-table th.comp-ours { background: rgba(99,102,241,.04); }
    .comp-table td {
      padding: 14px 24px; font-size: 14px; font-weight: 600;
      color: var(--ink); border-bottom: 1px solid var(--outline); white-space: nowrap;
    }
    .comp-table tr:last-child td { border-bottom: none; }
    .comp-table td.comp-ours { background: rgba(192,193,255,.03); }
    .lp-light .comp-table td.comp-ours { background: rgba(99,102,241,.02); }
    .comp-table td:first-child { color: var(--muted); font-size: 13px; }
    .comp-yes { color: #4ade80; }
    .comp-no  { color: rgba(255,255,255,.18); }
    .lp-light .comp-no { color: rgba(0,0,0,.15); }

    /* ── Results / case-study strip ── */
    .results-grid {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 56px;
    }
    .result-card {
      border-radius: 20px; padding: 32px; position: relative; overflow: hidden;
      border: 1px solid var(--outline); background: var(--surface);
      transition: transform .3s;
    }
    .result-card:hover { transform: translateY(-6px); }
    .lp-light .result-card { background: #fff; }
    .result-score {
      font-size: 48px; font-weight: 900; letter-spacing: -.045em; line-height: 1;
      margin-bottom: 4px;
    }
    .result-label { font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); }
    .result-name { font-size: 15px; font-weight: 700; color: var(--ink); margin-top: 16px; margin-bottom: 2px; }
    .result-role { font-size: 12px; font-weight: 600; color: var(--muted); }
    .result-quote { font-size: 14px; font-weight: 500; color: var(--muted); line-height: 1.6; margin-top: 12px; font-style: italic; }
    .result-glow {
      position: absolute; width: 160px; height: 160px; border-radius: 50%;
      filter: blur(60px); pointer-events: none; bottom: -40px; right: -40px;
      opacity: .2;
    }

    /* ── Responsive ── */
    @media (max-width: 1024px) {
      .bento-8 { grid-column: span 12; }
      .bento-4 { grid-column: span 6; }
      .cap-grid, .testi-grid, .pricing-grid { grid-template-columns: repeat(2,1fr); }
      .footer-top { grid-template-columns: 1fr 1fr; }
      .plan-card.featured { transform: scale(1); }
      .tl-line { left: 14px; }
      .tl-step { grid-template-columns: 0 28px 1fr; }
      .tl-step:nth-child(even) .tl-left,
      .tl-step:nth-child(odd) .tl-left { display: none; }
      .tl-step:nth-child(even) .tl-right { order: unset; text-align: left; }
    }
    @media (max-width: 768px) {
      .nav { width: calc(100% - 24px); top: 10px; height: 56px; padding: 0 18px; }
      .nav-links { display: none; }
      .hamburger { display: flex; }
      .section { padding: 64px 16px; }
      .hero { padding: 120px 16px 72px; }
      .hero-ctas { flex-direction: column; width: 100%; }
      .btn-hero-main, .btn-hero-ghost { width: 100%; text-align: center; justify-content: center; }
      .bento-4, .bento-8 { grid-column: span 12; }
      .cap-grid, .testi-grid, .pricing-grid, .results-grid { grid-template-columns: 1fr; }
      .footer-top { grid-template-columns: 1fr; gap: 32px; }
      .footer-bottom { flex-direction: column; gap: 12px; text-align: center; }
      .cta-box { padding: 52px 24px; }
      .hv-sidebar { display: none; }
      .hv-body { grid-template-columns: 1fr; }
      .plan-card.featured { transform: scale(1); }
      .tl-step { grid-template-columns: 0 28px 1fr; }
      .tl-step .tl-left { display: none; }
      .stats-bar { grid-template-columns: repeat(2, 1fr); border-radius: 16px; }
      .stat-value { font-size: 26px; }
      .hiw-grid { grid-template-columns: 1fr; }
      .hiw-step:not(:last-child)::after { display: none; }
      .hiw-step { padding: 24px 16px; }
      .stats-section { padding: 0 16px 60px; }
    }
  `}</style>
);

// ─── Reveal hook ───────────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("vis"); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function R({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const ref = useReveal();
  return (
    <div ref={ref} className="reveal" style={{ transitionDelay: `${delay}s`, ...style }}>
      {children}
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────
const plans = [
  {
    name: "Starter",
    price: { monthly: "0",  yearly: "0"  },
    desc: "Perfect to begin your IELTS journey",
    features: ["Basic IELTS Overview", "1 Mock Test / month", "Daily Vocabulary Builder", "Progress Dashboard"],
    cta: "Start Free", featured: false, href: "/register",
  },
  {
    name: "Pro Learner",
    price: { monthly: "29", yearly: "24" },
    desc: "Best for serious Band 8+ candidates",
    features: ["Unlimited AI Speaking Prep", "Unlimited Writing Evaluation", "Official IELTS Mock Tests", "Band Score Prediction", "Personal Fluency Roadmap"],
    cta: "Get Band 8.0", featured: true, href: "/register?plan=pro",
  },
  {
    name: "Global Elite",
    price: { monthly: "49", yearly: "42" },
    desc: "For coaches and institutions",
    features: ["Everything in Pro", "1-on-1 Expert Coaching", "Student Management", "Enterprise Interview Prep", "Priority Support"],
    cta: "Contact Sales", featured: false, href: "mailto:sales@lingoura.ai",
  },
];

const faqs = [
  { q: "Is Lingoura AI suitable for both Academic and General Training?",   a: "Yes. Our AI is trained on both Academic and General Training modules to provide specialized feedback for your specific test type." },
  { q: "How accurate is the AI Band Score prediction?",                     a: "Our scoring algorithms are aligned with the official IELTS criteria (Task Achievement, Coherence, Lexical Resource, Grammatical Range & Accuracy) to predict within 0.5 of your actual score." },
  { q: "Can I practice Speaking with the AI?",                             a: "Absolutely. Our real-time AI Speaking coach simulates Part 1, 2, and 3 and provides instant feedback on fluency, coherence, and pronunciation." },
  { q: "Does it help with Writing Task 1 and Task 2?",                     a: "Yes. Submit essays and data descriptions for instant evaluation against all four IELTS Writing assessment criteria." },
  { q: "Are the practice materials exam-standard?",                         a: "All Reading and Listening materials are designed to match the difficulty, timing, and structure of real IELTS exams." },
  { q: "How often are the practice materials updated?",                     a: "We update our question bank weekly with the latest IELTS topics and trends from official Cambridge and IDP resources." },
];

const testimonials = [
  { name: "Sarah Chen",      role: "Product Manager",         emoji: "👩‍💼", color: "var(--primary)",   quote: "The real-time Speaking feedback during roleplays changed everything. I finally feel confident walking into the exam room." },
  { name: "David Müller",    role: "Research Scientist",       emoji: "👨‍🔬", color: "var(--secondary)", quote: "The Writing Audit goes way beyond generic AI tools. It understands academic nuance and helped me polish my essays to Band 8.5." },
  { name: "Elena Rodriguez", role: "Executive Director",       emoji: "👩‍💼", color: "var(--tertiary)",  quote: "Consistency was always my biggest hurdle. Lingoura's roadmap keeps me on track with tangible progress every single day." },
];

const brands = ["NOVA LABS", "BRIGHTCORE", "COGNIFY", "SKILLBRIDGE", "ORBIT LABS", "AXION", "PRISM HQ", "VELOX AI"];

// ─── Chart heights for hero visual ────────────────────────────────────────
const chartBars = [
  { h: "40%", bg: "rgba(192,193,255,.3)" },
  { h: "65%", bg: "rgba(192,193,255,.45)" },
  { h: "55%", bg: "rgba(192,193,255,.35)" },
  { h: "90%", bg: "rgba(192,193,255,.6)" },
  { h: "70%", bg: "rgba(192,193,255,.5)" },
  { h: "45%", bg: "rgba(192,193,255,.35)" },
  { h: "80%", bg: "rgba(192,193,255,.55)" },
];

const statColors = ["rgba(192,193,255,.55)", "rgba(255,176,205,.5)", "rgba(137,206,255,.5)"];

// ─── Main ──────────────────────────────────────────────────────────────────
export default function LingouaLanding() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [openFaq, setOpenFaq] = useState(0);
  const [isDark, setIsDark] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("lp-theme");
    if (saved !== null) setIsDark(saved === "dark");
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem("lp-theme", next ? "dark" : "light");
  };

  return (
    <div className={`lp ${isDark ? "" : "lp-light"}`}>
      <Styles />

      {/* ── NAV ── */}
      <nav className="nav">
        <a href="#" className="logo">
          <img src="/logo-icon.png" alt="" className="logo-img" />
          Lingoura AI
        </a>
        <ul className="nav-links">
          <li><a href="#features" className="active">Product</a></li>
          <li><a href="#how">Curriculum</a></li>
          <li><a href="/case-studies">Case Studies</a></li>
          <li><a href="#pricing">Pricing</a></li>
        </ul>
        <div className="nav-actions">
          <button onClick={toggleTheme} className="theme-btn" aria-label="Toggle theme">
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <a href="#pricing" className="btn-pill" style={{ display: mobileMenuOpen ? "none" : "" }}>Get Started</a>
          <button
            className="hamburger"
            aria-label="Open menu"
            onClick={() => setMobileMenuOpen((o) => !o)}
          >
            <span className="hb-line" style={mobileMenuOpen ? { transform: "rotate(45deg) translate(5px, 5px)" } : {}} />
            <span className="hb-line" style={mobileMenuOpen ? { opacity: 0 } : {}} />
            <span className="hb-line" style={mobileMenuOpen ? { transform: "rotate(-45deg) translate(5px, -5px)" } : {}} />
          </button>
        </div>
      </nav>

      {/* ── MOBILE MENU ── */}
      <div className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`}>
        <a href="#features" onClick={() => setMobileMenuOpen(false)}>Product</a>
        <a href="#how" onClick={() => setMobileMenuOpen(false)}>Curriculum</a>
        <a href="/case-studies" onClick={() => setMobileMenuOpen(false)}>Case Studies</a>
        <a href="#pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
        <a href="/login" onClick={() => setMobileMenuOpen(false)} style={{ color: "var(--muted)" }}>Sign In</a>
        <div className="mm-cta">
          <a href="#pricing" className="btn-pill" onClick={() => setMobileMenuOpen(false)} style={{ width: "100%", justifyContent: "center", padding: "14px 24px", fontSize: 15 }}>
            Get Started Free
          </a>
        </div>
      </div>

      {/* ── HERO ── */}
      <div className="hero">
        <div className="hero-badge fade-up">
          <span className="badge-dot" />
          <span className="badge-text">Now powered by Advanced AI</span>
        </div>

        <h1 className="hero-h1 fade-up d1">
          Language Mastery{" "}<br />
          with{" "}
          <span className="grad glow">Precision AI</span>
        </h1>

        <p className="hero-sub fade-up d2">
          Lingoura combines cognitive science with real-time AI to elevate your English fluency. An adaptive IELTS curriculum designed for high-stakes professional success.
        </p>

        <div className="hero-ctas fade-up d3">
          <a href="#pricing" className="btn-hero-main">Get Started Free</a>
          <a href="#how" className="btn-hero-ghost">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            Watch Demo
          </a>
        </div>

        <div className="social-proof fade-up d4">
          <div className="avatars">
            {["🧑", "👩", "👨"].map((e, i) => <div key={i} className="av">{e}</div>)}
            <div className="av-plus">+10k</div>
          </div>
          <p className="sp-label">Join 10,000+ candidates achieving Band 8.0+</p>
        </div>

        {/* Platform mockup */}
        <div className="hero-visual fade-up d5">
          <div className="hv-topbar">
            <div className="hv-dot" style={{ background: "#FF5F57" }} />
            <div className="hv-dot" style={{ background: "#FEBC2E" }} />
            <div className="hv-dot" style={{ background: "#28C840" }} />
          </div>
          <div className="hv-body">
            <div className="hv-sidebar">
              {[true, false, false, false, false].map((active, i) => (
                <div key={i} className={`hv-si ${active ? "act" : ""}`}>
                  <div className="hv-si-ico" />
                  <div className="hv-si-line" />
                </div>
              ))}
            </div>
            <div className="hv-main">
              <div className="hv-row">
                <div className="hv-title" />
                <div className="hv-action" />
              </div>
              <div className="hv-stats">
                {statColors.map((bg, i) => (
                  <div key={i} className="hv-stat">
                    <div className="hv-stat-v" style={{ background: bg }} />
                    <div className="hv-stat-l" />
                  </div>
                ))}
              </div>
              <div className="hv-chart">
                {chartBars.map((b, i) => (
                  <div key={i} className="hv-bar" style={{ height: b.h, background: b.bg }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── STATS BAR ── */}
      <div className="stats-section">
        <div className="stats-bar">
          {[
            { v: "10,000+", l: "Active Students",  c: "var(--primary)"   },
            { v: "98.4%",   l: "Band Accuracy",    c: "var(--secondary)" },
            { v: "4.9 ★",   l: "User Rating",      c: "var(--tertiary)"  },
            { v: "150+",    l: "Countries",         c: "var(--primary)"   },
          ].map((s, i) => (
            <div key={i} className="stat-item">
              <div className="stat-value" style={{ background: `linear-gradient(135deg, ${s.c}, var(--secondary))`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{s.v}</div>
              <div className="stat-label">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── MARQUEE ── */}
      <div className="marquee-wrap">
        <p className="marquee-label">Trusted by learners and teams worldwide</p>
        <div className="marquee-track">
          {[0, 1].map(rep => (
            <div key={rep} className="marquee-inner">
              {brands.map(b => <span key={b} className="mq-logo">{b}</span>)}
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURES BENTO ── */}
      <section className="section" id="features">
        <div className="container">
          <R style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span className="section-tag">Precision Core</span>
            <h2 className="section-h2" style={{ maxWidth: 660 }}>Built for cognitive acceleration</h2>
            <p className="section-sub" style={{ maxWidth: 520, textAlign: "center" }}>
              Every tool is designed around how the brain acquires language — not just how it memorizes it.
            </p>
          </R>

          <div className="bento">
            {/* Speaking Coach — wide */}
            <R delay={0.05} style={{ gridColumn: "span 8" }}>
              <div className="bento-card glass bento-8" style={{ gridColumn: "span 8" }}>
                <div className="bento-glow bento-glow-r" style={{ background: "rgba(192,193,255,.12)" }} />
                <span className="bc-icon">🎙</span>
                <h3>Real-time Speaking Coach</h3>
                <p>Our AI analyzes your phonetics, cadence, and semantic accuracy as you speak — instant non-intrusive feedback, mid-sentence.</p>
                <div className="waveform">
                  {["rgba(192,193,255,.25)","rgba(192,193,255,.45)","rgba(192,193,255,.8)","rgba(192,193,255,.55)","rgba(192,193,255,.35)"].map((bg, i) => (
                    <div key={i} className="wv" style={{ background: bg }} />
                  ))}
                </div>
              </div>
            </R>

            {/* Band Predictor — narrow */}
            <R delay={0.1} style={{ gridColumn: "span 4" }}>
              <div className="bento-card glass bento-4" style={{ gridColumn: "span 4", textAlign: "center", justifyContent: "center", alignItems: "center" }}>
                <div className="bento-glow bento-glow-l" style={{ background: "rgba(255,176,205,.1)" }} />
                <span className="bc-icon">📊</span>
                <h3>IELTS Predictor</h3>
                <p>98.4% accuracy in predicting Band scores against the latest examiner criteria.</p>
                <div className="band-score grad">8.5</div>
              </div>
            </R>

            {/* Writing Audit — narrow */}
            <R delay={0.15} style={{ gridColumn: "span 4" }}>
              <div className="bento-card glass bento-4" style={{ gridColumn: "span 4" }}>
                <div className="bento-glow bento-glow-r" style={{ background: "rgba(137,206,255,.1)" }} />
                <span className="bc-icon">✍️</span>
                <h3>Writing Audit</h3>
                <p>Deep-dive analysis of grammatical cohesion, lexical resource, and task response for Task 1 & 2.</p>
              </div>
            </R>

            {/* Roleplay Lab — wide */}
            <R delay={0.2} style={{ gridColumn: "span 8" }}>
              <div className="bento-card glass bento-8" style={{ gridColumn: "span 8", flexDirection: "row", gap: 40, alignItems: "center" }}>
                <div className="bento-glow bento-glow-l" style={{ background: "rgba(192,193,255,.08)" }} />
                <div style={{ flex: 1 }}>
                  <span className="bc-icon">🎭</span>
                  <h3>Situational Roleplay Lab</h3>
                  <p>Practice IELTS Part 2 long turns, academic discussions, and professional scenarios in immersive AI-driven sessions.</p>
                  <button style={{ marginTop: 20, background: "none", border: "none", cursor: "pointer", color: "var(--primary)", font: "700 14px/1 var(--font)", letterSpacing: ".04em", display: "flex", alignItems: "center", gap: 6 }}>
                    Explore Scenarios →
                  </button>
                </div>
                <div style={{ width: 180, background: "rgba(255,255,255,.04)", border: "1px solid var(--outline)", borderRadius: 16, padding: 16, flexShrink: 0 }}>
                  {[100, 80, 60].map((w, i) => (
                    <div key={i} style={{ height: 8, borderRadius: 4, marginBottom: i < 2 ? 10 : 0, background: i === 2 ? `rgba(192,193,255,.4)` : "rgba(255,255,255,.1)", width: `${w}%` }} />
                  ))}
                </div>
              </div>
            </R>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section" style={{ borderTop: "1px solid var(--outline)" }}>
        <div className="container">
          <R style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span className="section-tag">Your Journey</span>
            <h2 className="section-h2" style={{ maxWidth: 560, textAlign: "center" }}>Three steps to Band 8.0</h2>
            <p className="section-sub" style={{ textAlign: "center", maxWidth: 480 }}>From zero to exam-ready in a structured, AI-guided path.</p>
          </R>
          <div className="hiw-grid">
            {[
              { num: "01", ico: "🎯", color: "var(--primary)",   title: "Set Your Goal",       desc: "Take our 10-minute AI placement test. We map your current CEFR level and define a precise Band target for your timeline." },
              { num: "02", ico: "🗺️",  color: "var(--secondary)", title: "Follow Your Roadmap", desc: "A day-by-day adaptive curriculum adjusts in real-time to your strengths and weaknesses across all four IELTS skills." },
              { num: "03", ico: "🏆", color: "var(--tertiary)",  title: "Achieve Your Score",  desc: "Full AI-graded mock exams under real conditions. Get your predicted Band score before you ever walk into the exam room." },
            ].map((step, i) => (
              <R key={i} delay={i * 0.12}>
                <div className="hiw-step">
                  <div className="hiw-num" style={{ borderColor: step.color, color: step.color }}>{step.num}</div>
                  <div className="hiw-ico">{step.ico}</div>
                  <div className="hiw-title">{step.title}</div>
                  <p className="hiw-desc">{step.desc}</p>
                </div>
              </R>
            ))}
          </div>
        </div>
      </section>

      {/* ── CAPABILITIES ── */}
      <section className="section" style={{ background: "rgba(255,255,255,.01)", borderTop: "1px solid var(--outline)", borderBottom: "1px solid var(--outline)" }}>
        <div className="container">
          <R style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span className="section-tag">Mastery Tools</span>
            <h2 className="section-h2" style={{ maxWidth: 560, textAlign: "center" }}>Intelligent analysis at every layer</h2>
          </R>
          <div className="cap-grid">
            {[
              { ico: "🎤", cls: "p", title: "Pronunciation Lab", desc: "Advanced waveform analysis that pinpoints subtle accent nuances and tonal inflections for native-level articulation." },
              { ico: "✅", cls: "s", title: "Grammar Audit",     desc: "Goes beyond spell-check to identify structural complexities and suggest sophisticated alternatives for academic writing." },
              { ico: "📚", cls: "t", title: "Vocabulary Engine",  desc: "Context-aware synonyms and IELTS-specific terminology recommendations to expand your Lexical Resource score." },
            ].map((c, i) => (
              <R key={i} delay={i * 0.1}>
                <div className="cap-card">
                  <div className={`cap-ico ${c.cls}`}>{c.ico}</div>
                  <h4>{c.title}</h4>
                  <p>{c.desc}</p>
                </div>
              </R>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPARISON ── */}
      <section className="section" style={{ borderTop: "1px solid var(--outline)" }}>
        <div className="container">
          <R style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span className="section-tag">Why Lingoura</span>
            <h2 className="section-h2" style={{ maxWidth: 560, textAlign: "center" }}>The smarter choice</h2>
            <p className="section-sub" style={{ textAlign: "center", maxWidth: 460 }}>See how we stack up against traditional prep methods.</p>
          </R>
          <div className="comp-wrap">
            <table className="comp-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th className="comp-ours">✦ Lingoura AI</th>
                  <th>Traditional Tutor</th>
                  <th>Generic AI</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feat: "24 / 7 Availability",          ours: true,    tutor: false,    ai: true           },
                  { feat: "IELTS-specific Training",       ours: true,    tutor: true,     ai: false          },
                  { feat: "Real-time Speaking Feedback",   ours: true,    tutor: false,    ai: false          },
                  { feat: "Band Score Prediction",         ours: true,    tutor: false,    ai: false          },
                  { feat: "Personalised Roadmap",          ours: true,    tutor: true,     ai: false          },
                  { feat: "Full Mock Test Grading",        ours: true,    tutor: false,    ai: false          },
                  { feat: "Starting price / month",        ours: "Free",  tutor: "$200+",  ai: "Free/Limited" },
                ].map((row, i) => (
                  <tr key={i}>
                    <td>{row.feat}</td>
                    <td className="comp-ours">{typeof row.ours === "boolean" ? (row.ours ? <span className="comp-yes">✓</span> : <span className="comp-no">—</span>) : row.ours}</td>
                    <td>{typeof row.tutor === "boolean" ? (row.tutor ? <span className="comp-yes">✓</span> : <span className="comp-no">—</span>) : row.tutor}</td>
                    <td>{typeof row.ai === "boolean" ? (row.ai ? <span className="comp-yes">✓</span> : <span className="comp-no">—</span>) : row.ai}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── RESULTS ── */}
      <section className="section" style={{ background: "rgba(255,255,255,.01)", borderTop: "1px solid var(--outline)" }}>
        <div className="container">
          <R style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span className="section-tag">Proven Results</span>
            <h2 className="section-h2" style={{ maxWidth: 560, textAlign: "center" }}>Real scores. Real people.</h2>
            <p className="section-sub" style={{ textAlign: "center", maxWidth: 460 }}>Our learners don&apos;t just improve — they achieve the exact score they need.</p>
          </R>
          <div className="results-grid">
            {[
              { score: "8.5", label: "Final Band", name: "Sarah Chen", role: "UK Visa Application", quote: "I jumped from 6.5 to 8.5 in 10 weeks. The Speaking Coach caught errors my human tutor never noticed.", color: "var(--primary)" },
              { score: "9.0", label: "Final Band", name: "David Müller", role: "PhD Admission — Oxford", quote: "The Writing Audit dissected my Task 2 essays with surgical precision. Band 9 felt impossible — until it wasn't.", color: "var(--secondary)" },
              { score: "7.5", label: "Final Band", name: "Priya Nair", role: "Canadian PR Application", quote: "I studied for 6 weeks alongside a full-time job. The adaptive roadmap made every minute count.", color: "var(--tertiary)" },
            ].map((r, i) => (
              <R key={i} delay={i * 0.1}>
                <div className="result-card">
                  <div className="result-glow" style={{ background: r.color }} />
                  <div className="result-score grad" style={{ background: `linear-gradient(135deg, ${r.color}, var(--secondary))`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{r.score}</div>
                  <div className="result-label">{r.label}</div>
                  <p className="result-quote">&ldquo;{r.quote}&rdquo;</p>
                  <div className="result-name">{r.name}</div>
                  <div className="result-role">{r.role}</div>
                </div>
              </R>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROADMAP ── */}
      <section className="section" id="how">
        <div className="container">
          <R style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span className="section-tag">Path to Mastery</span>
            <h2 className="section-h2" style={{ maxWidth: 560, textAlign: "center" }}>Your 4-month fluency blueprint</h2>
            <p className="section-sub" style={{ textAlign: "center", maxWidth: 480 }}>A structured, proven roadmap — built for Band 8.0 and beyond.</p>
          </R>
          <div className="timeline">
            <div className="tl-line" />
            {[
              { cls: "p", chip: "Month 1", title: "Foundation", desc: "Mastering core phonetic structures and high-frequency academic vocabulary.", tag: "Phonetic Integrity Check" },
              { cls: "s", chip: "Month 2", title: "Active Speaking", desc: "Immersive roleplay labs and idiom integration for natural, confident speech.", tag: "Conversational Dynamics" },
              { cls: "t", chip: "Month 3", title: "Writing & Grammar", desc: "Complex syntax mastery and professional writing audit for Task 1 & 2 excellence.", tag: "Syntactic Cohesion Audit" },
            ].map((step, i) => (
              <R key={i} delay={i * 0.12}>
                <div className="tl-step">
                  <div className="tl-content tl-left">
                    {i % 2 === 0
                      ? <><div className="tl-chip" style={{ color: `var(--${step.cls === "p" ? "primary" : step.cls === "s" ? "secondary" : "tertiary"})` }}>{step.chip}</div><div className="tl-title">{step.title}</div><div className="tl-desc">{step.desc}</div></>
                      : <div className="tl-glass-chip" style={{ color: `var(--${step.cls === "p" ? "primary" : step.cls === "s" ? "secondary" : "tertiary"})` }}>{step.tag}</div>
                    }
                  </div>
                  <div className={`tl-node ${step.cls}`} />
                  <div className="tl-content tl-right">
                    {i % 2 === 0
                      ? <div className="tl-glass-chip" style={{ color: `var(--${step.cls === "p" ? "primary" : step.cls === "s" ? "secondary" : "tertiary"})` }}>{step.tag}</div>
                      : <><div className="tl-chip" style={{ color: `var(--${step.cls === "p" ? "primary" : step.cls === "s" ? "secondary" : "tertiary"})` }}>{step.chip}</div><div className="tl-title">{step.title}</div><div className="tl-desc">{step.desc}</div></>
                    }
                  </div>
                </div>
              </R>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section" style={{ background: "rgba(255,255,255,.01)", borderTop: "1px solid var(--outline)" }}>
        <div className="container">
          <R style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h2 className="section-h2" style={{ maxWidth: 600, textAlign: "center" }}>Loved by learners worldwide</h2>
            <p className="section-sub" style={{ textAlign: "center", maxWidth: 480 }}>
              Thousands of learners use Lingoura AI to stay focused, organized, and consistent every day.
            </p>
          </R>
          <div className="testi-grid">
            {testimonials.map((t, i) => (
              <R key={i} delay={i * 0.1}>
                <div className="testi-card glass">
                  <div className="testi-user">
                    <div className="testi-av">{t.emoji}</div>
                    <div>
                      <div className="testi-name">{t.name}</div>
                      <div className="testi-role" style={{ color: t.color }}>{t.role}</div>
                    </div>
                  </div>
                  <p className="testi-quote">"{t.quote}"</p>
                  <div className="stars" style={{ color: t.color }}>★★★★★</div>
                </div>
              </R>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="section" id="pricing">
        <div className="container" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <R style={{ textAlign: "center" }}>
            <span className="section-tag">Investment</span>
            <h2 className="section-h2">A plan for every ambition</h2>
            <p className="section-sub">Start free, upgrade as you grow. No hidden fees.</p>
          </R>
          <div className="billing-toggle">
            <button className={`toggle-btn ${billing === "monthly" ? "active" : ""}`} onClick={() => setBilling("monthly")}>Monthly</button>
            <button className={`toggle-btn ${billing === "yearly"  ? "active" : ""}`} onClick={() => setBilling("yearly")}>
              Yearly <span className="save-badge">Save 17%</span>
            </button>
          </div>
          <div className="pricing-grid">
            {plans.map((plan, i) => (
              <R key={i} delay={i * 0.1}>
                <div className={`plan-card ${plan.featured ? "featured" : ""}`}>
                  {plan.featured && <div className="feat-chip">Most Popular</div>}
                  <div>
                    <div className="plan-name">{plan.name}</div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "var(--muted)", marginTop: 4 }}>{plan.desc}</div>
                  </div>
                  <div className="plan-price-row">
                    <span className="plan-price">${plan.price[billing]}</span>
                    <span className="plan-per">/ mo</span>
                  </div>
                  <div className="plan-features">
                    {plan.features.map(f => (
                      <div key={f} className="pf-row">
                        <span className="pf-check">✓</span>
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                  <a href={plan.href} className={`plan-btn ${plan.featured ? "filled" : "outline"}`} style={{ display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>{plan.cta}</a>
                </div>
              </R>
            ))}
          </div>
          <div style={{ marginTop: 28, display: "flex", gap: 20 }}>
            {["No credit card required", "Cancel anytime", "Free plan available"].map((t, i) => (
              <span key={i} style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--muted)", opacity: .55 }}>
                {i > 0 ? "· " : ""}{t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section" style={{ borderTop: "1px solid var(--outline)" }}>
        <div className="container" style={{ maxWidth: 720, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <R style={{ textAlign: "center" }}>
            <h2 className="section-h2">Curiosities answered</h2>
            <p className="section-sub" style={{ marginBottom: 40 }}>Everything you need to know about Lingoura AI.</p>
          </R>
          <div className="faq-list" style={{ width: "100%" }}>
            {faqs.map((faq, i) => (
              <div key={i} className={`faq-item ${openFaq === i ? "open" : ""}`}>
                <div className="faq-trigger" onClick={() => setOpenFaq(openFaq === i ? -1 : i)}>
                  <span className="faq-q">{faq.q}</span>
                  <span className="faq-ch">{openFaq === i ? "⌃" : "⌄"}</span>
                </div>
                {openFaq === i && <div className="faq-ans">{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section">
        <div className="container">
          <R>
            <div className="cta-box">
              <div className="cta-orb cta-orb-1" />
              <div className="cta-orb cta-orb-2" />
              <h2 className="cta-h2">Ready to redefine<br />your voice?</h2>
              <p className="cta-sub">Join the next generation of global speakers mastering English with cognitive precision and AI-powered guidance.</p>
              <a href="/register" className="btn-cta" style={{ display: "inline-block", textDecoration: "none" }}>Start Your Free Trial</a>
            </div>
          </R>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div>
              <div className="footer-logo">
                <img src="/logo-icon.png" alt="" style={{ height: 48, marginRight: 4, marginLeft: -8 }} />
                Lingoura AI
              </div>
              <p className="footer-tagline">Master English with Cognitive Intelligence.</p>
            </div>
            {[
              { title: "Product",   links: ["Speaking Room", "Writing Audit", "Curriculum", "Pricing"] },
              { title: "Resources", links: ["Community", "Help Center", "Case Studies", "Blog"] },
              { title: "Legal",     links: ["Privacy Policy", "Terms of Service", "Contact"] },
            ].map(col => (
              <div key={col.title}>
                <div className="footer-col-title">{col.title}</div>
                <div className="footer-links">
                  {col.links.map(l => <a key={l} href="#">{l}</a>)}
                </div>
              </div>
            ))}
          </div>
          <div className="footer-bottom">
            <span className="footer-copy">© 2026 Lingoura AI. All rights reserved.</span>
            <span className="footer-copy">Powered by Advanced AI</span>
          </div>
        </div>
        <div className="footer-wm">LINGOURA</div>
      </footer>
    </div>
  );
}
