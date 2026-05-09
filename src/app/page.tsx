"use client";
import { useState, useEffect, useRef } from "react";

// ─── Google Font Loader ────────────────────────────────────────────────────
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
    }

    html { scroll-behavior: smooth; }

    body {
      font-family: var(--font);
      background: var(--bg);
      color: var(--ink);
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
      position: relative;
    }

    /* ── Mesh Background ── */
    .bg-mesh {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      z-index: -1;
      background-color: #FAFBFF;
      background-image: 
        radial-gradient(at 0% 0%, rgba(124, 58, 237, 0.08) 0px, transparent 50%),
        radial-gradient(at 100% 0%, rgba(244, 114, 182, 0.12) 0px, transparent 50%),
        radial-gradient(at 100% 100%, rgba(99, 102, 241, 0.1) 0px, transparent 50%),
        radial-gradient(at 0% 100%, rgba(56, 189, 248, 0.1) 0px, transparent 50%),
        radial-gradient(at 0% 50%, rgba(99, 102, 241, 0.15) 0px, transparent 50%),
        radial-gradient(at 80% 20%, rgba(244, 114, 182, 0.15) 0px, transparent 50%);
      filter: blur(80px);
      pointer-events: none;
    }

    /* ── Animations ── */
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(32px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes float1 {
      0%,100% { transform: translateY(0px); }
      50%      { transform: translateY(-14px); }
    }
    @keyframes float2 {
      0%,100% { transform: translateY(0px); }
      50%      { transform: translateY(10px); }
    }
    @keyframes pulse-ring {
      0%   { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(99,102,241,.35); }
      70%  { transform: scale(1);    box-shadow: 0 0 0 18px rgba(99,102,241,0); }
      100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(99,102,241,0); }
    }

    .fade-up   { animation: fadeUp .9s cubic-bezier(.22,1,.36,1) both; }
    .d-100     { animation-delay: .1s; }
    .d-200     { animation-delay: .2s; }
    .d-300     { animation-delay: .3s; }
    .d-400     { animation-delay: .4s; }
    .d-500     { animation-delay: .5s; }
    .float1    { animation: float1 6s ease-in-out infinite; }
    .float2    { animation: float2 7s ease-in-out infinite; }

    /* ── Gradient text ── */
    .grad-text {
      background: linear-gradient(135deg, var(--violet) 0%, var(--indigo) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* ── Nav ── */
    .nav {
      position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
      width: calc(100% - 40px); max-width: 1200px; z-index: 1000;
      height: 68px;
      display: flex; align-items: center;
      padding: 0 32px;
      background: rgba(255, 255, 255, 0.75);
      backdrop-filter: blur(24px) saturate(180%);
      border: 1px solid rgba(255, 255, 255, 0.4);
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
      font-family: var(--font); font-weight: 800; font-size: 28px;
      letter-spacing: -.03em;
      background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #EC4899 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-decoration: none;
    }
    .logo-img {
      height: 64px; width: auto; object-fit: contain;
      margin-left: -12px;
      mix-blend-multiply;
    }
    .nav-links {
      display: flex; gap: 40px; list-style: none;
    }
    .nav-links a {
      font-size: 11px; font-weight: 700; letter-spacing: .18em;
      text-transform: uppercase; color: var(--muted);
      text-decoration: none; transition: color .2s;
    }
    .nav-links a:hover { color: var(--indigo); }
    .btn-primary {
      padding: 12px 24px;
      background: #111111;
      color: #fff; border: none; border-radius: 8px;
      font-family: var(--font); font-size: 11px; font-weight: 700;
      letter-spacing: .12em; text-transform: uppercase;
      cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: inline-flex; align-items: center; gap: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      text-decoration: none;
    }
    .btn-primary:hover { background: #333333; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.15); }
    .btn-primary:active { transform: scale(.98); }
    .btn-ghost {
      padding: 14px 32px;
      background: #fff; color: var(--ink);
      border: 1.5px solid rgba(17,17,17,.1);
      border-radius: 14px;
      font-family: var(--font); font-size: 15px; font-weight: 700;
      cursor: pointer; transition: background .2s, transform .15s;
    }
    .btn-ghost:hover { background: #f5f5f5; transform: translateY(-1px); }

    /* ── Hero ── */
    .hero {
      padding: 160px 48px 100px;
      text-align: center;
      display: flex; flex-direction: column; align-items: center;
      position: relative; overflow: hidden;
    }
    .hero::before {
      content: '';
      position: absolute; top: -20%; left: 50%; transform: translateX(-50%);
      width: 900px; height: 600px;
      background: radial-gradient(ellipse at center, rgba(99,102,241,.07) 0%, transparent 65%);
      pointer-events: none;
    }
    .badge {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 6px 16px; border-radius: 99px;
      background: rgba(99,102,241,.08);
      border: 1px solid rgba(99,102,241,.18);
      color: var(--indigo);
      font-size: 10px; font-weight: 800; letter-spacing: .28em; text-transform: uppercase;
      margin-bottom: 36px;
    }
    .hero-h1 {
      font-size: clamp(56px, 9vw, 112px);
      font-weight: 800;
      line-height: .88;
      letter-spacing: -.045em;
      color: var(--ink);
      margin-bottom: 28px;
      max-width: 900px;
    }
    .hero-sub {
      font-size: clamp(17px, 2vw, 21px);
      font-weight: 500;
      color: var(--muted);
      line-height: 1.6;
      max-width: 580px;
      margin-bottom: 48px;
      letter-spacing: -.01em;
    }
    .hero-ctas {
      display: flex; gap: 16px; flex-wrap: wrap; justify-content: center;
      margin-bottom: 36px;
    }
    .btn-hero {
      padding: 18px 36px;
      background: #111111;
      color: #fff; border: none; border-radius: 10px;
      font-family: var(--font); font-size: 16px; font-weight: 600;
      cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }
    .btn-hero:hover { transform: translateY(-3px); background: #333333; box-shadow: 0 20px 40px rgba(0,0,0,0.2); }
    .social-proof {
      display: flex; align-items: center; gap: 12px;
      padding: 10px 20px; border-radius: 99px;
      background: rgba(17,17,17,.04); border: 1px solid rgba(17,17,17,.07);
      font-size: 12px; font-weight: 700; color: var(--muted);
      letter-spacing: .06em; margin-bottom: 80px;
    }
    .avatars { display: flex; }
    .avatar {
      width: 26px; height: 26px; border-radius: 50%;
      border: 2px solid #fff; margin-left: -8px;
      background: var(--indigo-light);
    }
    .avatar:first-child { margin-left: 0; }
    .social-proof span.accent { color: var(--indigo); font-weight: 800; }

    /* ── Mock UI Card ── */
    .hero-card-wrap {
      position: relative; width: 100%; max-width: 900px;
    }
    .hero-card {
      background: #fff;
      border-radius: 48px;
      border: 1px solid rgba(17,17,17,.07);
      padding: 24px;
      box-shadow: 0 40px 100px rgba(99,102,241,.08), 0 8px 24px rgba(0,0,0,.04);
    }
    .hero-card-inner {
      background: #F4F5FC;
      border-radius: 32px;
      border: 1px solid rgba(17,17,17,.05);
      aspect-ratio: 16/9;
      display: flex; flex-direction: column;
      padding: 40px; gap: 24px; overflow: hidden;
      position: relative;
    }
    .mock-bar {
      height: 48px; background: #fff; border-radius: 16px;
      border: 1px solid rgba(17,17,17,.06);
      display: flex; align-items: center; padding: 0 20px; gap: 12px;
      width: 70%;
    }
    .mock-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--indigo-light); }
    .mock-line { height: 10px; border-radius: 99px; background: rgba(17,17,17,.06); }
    .mock-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; flex: 1; }
    .mock-tile {
      background: #fff; border-radius: 24px;
      border: 1px solid rgba(17,17,17,.06);
      padding: 28px; display: flex; flex-direction: column; gap: 16px;
      box-shadow: 0 4px 12px rgba(0,0,0,.03);
    }
    .mock-icon-box {
      width: 44px; height: 44px; border-radius: 12px;
      background: var(--indigo-light);
      display: flex; align-items: center; justify-content: center;
      font-size: 20px;
    }
    .mock-lines { display: flex; flex-direction: column; gap: 8px; }
    .mock-tile-center {
      background: #fff; border-radius: 24px;
      border: 1px solid rgba(17,17,17,.06);
      display: flex; align-items: center; justify-content: center;
      font-size: 72px; opacity: .12;
    }
    /* floating side cards */
    .side-card {
      position: absolute;
      background: #fff;
      border-radius: 24px;
      border: 1px solid rgba(17,17,17,.07);
      padding: 24px;
      box-shadow: 0 24px 64px rgba(0,0,0,.08);
      width: 240px;
    }
    .side-card-left  { left: -80px; top: 40px; }
    .side-card-right { right: -80px; top: 120px; }
    .sc-row { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
    .sc-icon {
      width: 36px; height: 36px; border-radius: 10px;
      background: var(--indigo-light);
      display: flex; align-items: center; justify-content: center;
      font-size: 16px;
    }
    .sc-label { font-size: 12px; font-weight: 800; color: var(--ink); }
    .sc-lines { display: flex; flex-direction: column; gap: 6px; }
    .sc-check-row { display: flex; align-items: center; gap: 8px; }
    .sc-check { color: #10B981; font-size: 12px; font-weight: 800; }

    /* ── Trusted by ── */
    .trusted {
      padding: 60px 48px;
      text-align: center;
    }
    .trusted-label {
      font-size: 10px; font-weight: 800; letter-spacing: .28em;
      text-transform: uppercase; color: var(--light); margin-bottom: 32px;
    }
    .trusted-logos {
      display: flex; flex-wrap: wrap; justify-content: center;
      gap: 48px; filter: grayscale(1); opacity: .35;
    }
    .trusted-logos span {
      font-size: 20px; font-weight: 800; letter-spacing: -.03em; color: var(--ink);
    }

    /* ── Section base ── */
    section { padding: 120px 48px; background: transparent; }
    .section-inner { max-width: 1280px; margin: 0 auto; }
    .section-tag {
      display: inline-flex; padding: 6px 16px; border-radius: 99px;
      background: rgba(99,102,241,.06); border: 1px solid rgba(99,102,241,.14);
      font-size: 10px; font-weight: 800; letter-spacing: .24em;
      text-transform: uppercase; color: var(--indigo);
      margin-bottom: 24px;
    }
    .section-h2 {
      font-size: clamp(36px, 5vw, 64px);
      font-weight: 800; letter-spacing: -.04em;
      line-height: 1.0; color: var(--ink); margin-bottom: 20px;
    }
    .section-sub {
      font-size: 18px; font-weight: 500;
      color: var(--muted); line-height: 1.6; max-width: 560px;
    }

    /* ── Pain cards ── */
    .pain-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 64px; }
    .pain-card {
      background: #fff; padding: 40px; border-radius: 28px;
      border: 1px solid rgba(17,17,17,.06);
      box-shadow: 0 8px 32px rgba(0,0,0,.02);
      transition: transform .3s, box-shadow .3s;
    }
    .pain-card:hover { transform: translateY(-8px); box-shadow: 0 24px 64px rgba(99,102,241,.1); }
    .pain-icon {
      width: 52px; height: 52px; border-radius: 14px;
      background: var(--indigo-light);
      display: flex; align-items: center; justify-content: center;
      font-size: 24px; margin-bottom: 28px;
    }
    .pain-title { font-size: 20px; font-weight: 800; letter-spacing: -.02em; margin-bottom: 12px; }
    .pain-desc { font-size: 15px; font-weight: 500; color: var(--muted); line-height: 1.6; }

    /* ── Features ── */
    .features-bg { background: transparent; }
    .features-split { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
    .feature-pills { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 48px; }
    .feature-pill {
      display: flex; align-items: center; gap: 12px;
      padding: 16px; border-radius: 14px;
      background: rgba(99,102,241,.04); border: 1px solid rgba(99,102,241,.1);
      transition: background .2s;
    }
    .feature-pill:hover { background: rgba(99,102,241,.1); }
    .fp-icon {
      width: 38px; height: 38px; border-radius: 10px;
      background: var(--indigo-light);
      display: flex; align-items: center; justify-content: center; font-size: 18px;
      flex-shrink: 0;
    }
    .fp-label { font-size: 11px; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }

    /* feature mock card */
    .feat-mock {
      background: #fff; border-radius: 48px; padding: 24px;
      box-shadow: 0 32px 80px rgba(99,102,241,.09);
      border: 1px solid rgba(17,17,17,.06);
    }
    .feat-mock-inner {
      background: #F4F5FC; border-radius: 32px;
      aspect-ratio: 4/5; padding: 32px;
      display: flex; flex-direction: column; justify-content: flex-end;
    }
    .feat-bottom-card {
      background: #fff; border-radius: 20px; padding: 24px;
      border: 1px solid rgba(17,17,17,.06);
      box-shadow: 0 8px 32px rgba(0,0,0,.06);
      transform: translateY(16px); transition: transform .4s;
    }
    .feat-mock:hover .feat-bottom-card { transform: translateY(0); }

    /* ── How it works (steps) ── */
    .steps-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; margin-top: 64px; }
    .step-card {
      position: relative; padding: 40px; border-radius: 28px;
      border: 1px solid rgba(17,17,17,.06);
      background: #fff; box-shadow: 0 8px 32px rgba(0,0,0,.02);
    }
    .step-num {
      position: absolute; top: -18px; left: 36px;
      width: 36px; height: 36px; border-radius: 50%;
      background: linear-gradient(135deg,var(--violet),var(--indigo));
      color: #fff; display: flex; align-items: center; justify-content: center;
      font-size: 13px; font-weight: 800;
      box-shadow: 0 6px 18px rgba(99,102,241,.35);
    }
    .step-icon { font-size: 36px; margin-bottom: 20px; }
    .step-title { font-size: 20px; font-weight: 800; letter-spacing: -.02em; margin-bottom: 10px; }
    .step-desc { font-size: 15px; font-weight: 500; color: var(--muted); line-height: 1.6; }

    /* ── Pricing ── */
    .pricing-center { text-align: center; display: flex; flex-direction: column; align-items: center; }
    .billing-toggle {
      display: flex; gap: 4px; padding: 4px;
      background: rgba(17,17,17,.05); border-radius: 14px;
      border: 1px solid rgba(17,17,17,.08); margin: 32px 0 48px;
    }
    .toggle-btn {
      padding: 10px 28px; border-radius: 10px; border: none;
      background: transparent; cursor: pointer;
      font-family: var(--font); font-size: 11px; font-weight: 800;
      letter-spacing: .16em; text-transform: uppercase;
      color: var(--muted); transition: all .2s;
      display: flex; align-items: center; gap: 8px;
    }
    .toggle-btn.active { background: #fff; color: var(--ink); box-shadow: 0 2px 8px rgba(0,0,0,.06); }
    .save-badge {
      font-size: 9px; font-weight: 800; letter-spacing: .1em;
      background: var(--indigo); color: #fff; padding: 2px 8px; border-radius: 6px;
    }
    .pricing-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; max-width: 1100px; align-items: center; }
    .plan-card {
      padding: 48px; border-radius: 32px; border: 1px solid rgba(17,17,17,.04);
      background: #fff; text-align: left;
      box-shadow: 0 10px 40px rgba(0,0,0,.02);
      transition: all .4s cubic-bezier(0.23, 1, 0.32, 1);
      display: flex; flex-direction: column; gap: 32px;
    }
    .plan-card:hover { transform: translateY(-12px); box-shadow: 0 40px 80px rgba(0,0,0,0.06); }
    .plan-card.featured {
      background: #6366F1;
      color: #fff; border-color: transparent;
      box-shadow: 0 30px 60px rgba(99,102,241,0.3);
      transform: scale(1.05);
      z-index: 1;
    }
    .plan-card.featured:hover { transform: scale(1.05) translateY(-12px); }
    .plan-icon {
      width: 60px; height: 60px; border-radius: 18px;
      background: #F4F7FF;
      display: flex; align-items: center; justify-content: center; font-size: 28px;
    }
    .plan-card.featured .plan-icon { background: rgba(255,255,255,.2); color: #fff; }
    .plan-name { font-size: 28px; font-weight: 800; letter-spacing: -.03em; margin-bottom: 4px; }
    .plan-desc { font-size: 13px; font-weight: 600; letter-spacing: .05em; text-transform: uppercase; opacity: .7; }
    .plan-price { font-size: 64px; font-weight: 800; letter-spacing: -.05em; line-height: 1; }
    .plan-per { font-size: 16px; font-weight: 600; opacity: .7; }
    .plan-features { display: flex; flex-direction: column; gap: 16px; flex: 1; padding: 32px 0; border-top: 1px solid rgba(17,17,17,.04); }
    .plan-card.featured .plan-features { border-top-color: rgba(255,255,255,.15); }
    .pf-item { display: flex; align-items: center; gap: 12px; font-size: 16px; font-weight: 500; }
    .pf-check { font-size: 14px; font-weight: 900; color: #10B981; }
    .plan-card.featured .pf-check { color: #fff; }
    .plan-btn {
      width: 100%; padding: 20px; border-radius: 14px; border: none;
      font-family: var(--font); font-size: 13px; font-weight: 700;
      letter-spacing: .08em; text-transform: uppercase;
      cursor: pointer; transition: all .3s;
      background: #111111;
      color: #fff;
    }
    .plan-card.featured .plan-btn { background: #fff; color: #6366F1; }
    .plan-btn:hover { transform: translateY(-2px); opacity: 0.9; }
    .popular-chip {
      position: absolute; top: 24px; right: 24px;
      padding: 6px 14px; border-radius: 99px;
      background: rgba(255,255,255,0.2); color: #fff;
      font-size: 10px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase;
      backdrop-filter: blur(4px); border: 1px solid rgba(255,255,255,0.3);
    }

    /* ── Testimonials ── */
    .testi-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; margin-top: 64px; }
    .testi-card {
      background: #fff; padding: 40px; border-radius: 28px;
      border: 1px solid rgba(17,17,17,.06);
      box-shadow: 0 8px 32px rgba(0,0,0,.02);
      transition: transform .3s;
      display: flex; flex-direction: column; gap: 24px;
    }
    .testi-card:hover { transform: translateY(-8px); }
    .testi-quote { font-size: 17px; font-weight: 500; color: #374151; line-height: 1.65; font-style: italic; flex: 1; }
    .testi-author { display: flex; align-items: center; gap: 14px; padding-top: 20px; border-top: 1px solid rgba(17,17,17,.05); }
    .testi-avatar { width: 44px; height: 44px; border-radius: 50%; background: var(--indigo-light); display:flex;align-items:center;justify-content:center;font-size:18px; }
    .testi-name { font-size: 15px; font-weight: 800; }
    .testi-role { font-size: 12px; font-weight: 600; color: var(--muted); }
    .stars { color: var(--indigo); font-size: 14px; letter-spacing: 2px; }

    /* ── FAQ ── */
    .faq-split { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; }
    .faq-chat {
      position: sticky; top: 100px;
      background: linear-gradient(145deg,rgba(99,102,241,.07),rgba(99,102,241,.02));
      border: 1px solid rgba(99,102,241,.12);
      border-radius: 48px; padding: 40px;
    }
    .chat-msg {
      display: flex; gap: 12px; margin-bottom: 20px;
    }
    .chat-msg.right { flex-direction: row-reverse; }
    .chat-avatar { width: 40px; height: 40px; border-radius: 12px; background: #fff; flex-shrink: 0; display:flex;align-items:center;justify-content:center;font-size:18px; box-shadow:0 4px 12px rgba(0,0,0,.08); }
    .chat-bubble {
      background: #fff; padding: 18px 22px; border-radius: 20px; border-radius-top-left: 4px;
      border: 1px solid rgba(17,17,17,.06); max-width: 75%;
      box-shadow: 0 4px 16px rgba(0,0,0,.06);
    }
    .chat-msg.right .chat-bubble {
      background: var(--indigo); color: #fff; border-color: transparent;
    }
    .chat-name { font-size: 9px; font-weight: 900; letter-spacing: .18em; text-transform: uppercase; color: var(--indigo); margin-bottom: 6px; }
    .chat-msg.right .chat-name { color: rgba(255,255,255,.7); }
    .chat-text { font-size: 15px; font-weight: 600; line-height: 1.5; }
    .chat-actions { display: flex; gap: 8px; margin-top: 12px; }
    .chat-action-btn {
      padding: 6px 12px; border-radius: 8px; border: 1px solid rgba(17,17,17,.08);
      background: rgba(17,17,17,.03); font-family: var(--font);
      font-size: 10px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase;
      cursor: pointer; color: var(--muted); transition: all .2s;
    }
    .chat-action-btn:hover { background: var(--indigo); color: #fff; border-color: var(--indigo); }
    .chat-time { font-size: 9px; font-weight: 700; opacity: .45; margin-top: 6px; }
    .faq-list { display: flex; flex-direction: column; gap: 12px; }
    .faq-item {
      border-radius: 20px; border: 1px solid rgba(17,17,17,.07);
      background: rgba(17,17,17,.02); overflow: hidden;
      transition: background .2s, border-color .2s;
    }
    .faq-item.open { background: #fff; border-color: rgba(99,102,241,.15); box-shadow: 0 8px 32px rgba(99,102,241,.08); }
    .faq-trigger {
      display: flex; justify-content: space-between; align-items: center;
      padding: 22px 24px; cursor: pointer; gap: 16px;
    }
    .faq-q { font-size: 16px; font-weight: 700; letter-spacing: -.01em; }
    .faq-chevron { font-size: 18px; color: var(--muted); flex-shrink: 0; transition: transform .3s; }
    .faq-item.open .faq-chevron { transform: rotate(180deg); color: var(--indigo); }
    .faq-answer { padding: 0 24px 22px; font-size: 15px; font-weight: 500; color: var(--muted); line-height: 1.65; }

    /* ── CTA ── */
    .cta-section {
      text-align: center; display: flex; flex-direction: column; align-items: center;
      position: relative; overflow: hidden;
    }
    .cta-section::before {
      content: '';
      position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
      width: 120%; height: 120%;
      background: radial-gradient(ellipse at center, rgba(99,102,241,.05) 0%, transparent 55%);
      pointer-events: none;
    }
    .cta-h2 {
      font-size: clamp(48px, 8vw, 100px);
      font-weight: 800; letter-spacing: -.05em; line-height: .88;
      color: var(--ink); margin-bottom: 24px;
    }
    .cta-small { display: flex; gap: 20px; font-size: 11px; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; color: var(--light); }

    /* ── Footer ── */
    footer {
      padding: 80px 48px 48px;
      position: relative; overflow: hidden;
      background: transparent;
    }
    .footer-inner { max-width: 1280px; margin: 0 auto; }
    .footer-top { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr; gap: 48px; margin-bottom: 64px; }
    .footer-tagline { font-size: 16px; font-weight: 500; color: var(--muted); margin-top: 16px; max-width: 240px; line-height: 1.6; }
    .footer-col-title { font-size: 10px; font-weight: 900; letter-spacing: .22em; text-transform: uppercase; color: var(--ink); margin-bottom: 24px; }
    .footer-links { display: flex; flex-direction: column; gap: 14px; }
    .footer-links a { font-size: 13px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); text-decoration: none; transition: color .2s; }
    .footer-links a:hover { color: var(--indigo); }
    .footer-bottom { display: flex; justify-content: space-between; align-items: center; padding-top: 24px; border-top: 1px solid rgba(17,17,17,.05); }
    .footer-copy { font-size: 11px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: var(--light); }
    .footer-watermark {
      position: absolute; bottom: -40px; left: 50%; transform: translateX(-50%);
      font-size: clamp(80px,18vw,200px); font-weight: 800; letter-spacing: -.05em;
      color: rgba(17,17,17,.025); white-space: nowrap; pointer-events: none; user-select: none;
    }

    /* ── Feature Grid ── */
    .feat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; margin-top: 64px; }
    .feat-card {
      background: #fff; padding: 48px; border-radius: 32px;
      border: 1px solid rgba(17,17,17,.04);
      box-shadow: 0 10px 40px rgba(0,0,0,.02);
      transition: all .3s ease;
    }
    .feat-card:hover { transform: translateY(-10px); box-shadow: 0 30px 70px rgba(0,0,0,0.06); border-color: rgba(99,102,241,0.1); }
    .feat-icon-box {
      width: 56px; height: 56px; border-radius: 16px;
      background: #F8F9FF; display: flex; align-items: center; justify-content: center;
      font-size: 26px; margin-bottom: 32px;
    }
    .feat-card h3 { font-size: 22px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 16px; color: var(--ink); }
    .feat-card p { font-size: 15px; font-weight: 500; color: var(--muted); line-height: 1.7; }

    /* ── Timeline ── */
    .timeline-wrap { margin-top: 80px; position: relative; padding-bottom: 60px; }
    .timeline-line {
      position: absolute; top: 120px; left: 0; right: 0; height: 4px;
      background: rgba(99,102,241,0.1); border-radius: 2px;
    }
    .timeline-progress {
      position: absolute; top: 120px; left: 0; width: 65%; height: 4px;
      background: var(--indigo); border-radius: 2px;
    }
    .timeline-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; position: relative; z-index: 1; }
    .timeline-node {
      width: 24px; height: 24px; border-radius: 50%; background: #fff;
      border: 4px solid var(--indigo); margin-bottom: 40px;
    }
    .timeline-card {
      background: #fff; padding: 32px; border-radius: 24px;
      border: 1px solid rgba(17,17,17,0.05);
      box-shadow: 0 20px 50px rgba(0,0,0,0.04);
    }

    /* ── Integrations ── */
    .int-wrap { display: flex; justify-content: center; align-items: center; gap: 40px; margin-top: 60px; flex-wrap: wrap; }
    .int-logo {
      width: 64px; height: 64px; border-radius: 50%;
      background: #fff; border: 1px solid rgba(17,17,17,0.06);
      display: flex; align-items: center; justify-content: center;
      font-size: 28px; box-shadow: 0 10px 30px rgba(0,0,0,0.03);
      transition: transform 0.3s;
    }
    .int-logo:hover { transform: scale(1.1) translateY(-5px); }

    /* ── Reveal utility ── */
    .reveal { opacity: 0; transform: translateY(28px); transition: opacity .8s cubic-bezier(.22,1,.36,1), transform .8s cubic-bezier(.22,1,.36,1); }
    .reveal.visible { opacity: 1; transform: translateY(0); }

    /* ── Responsive ── */
    @media (max-width: 1024px) {
      .pain-grid, .feat-grid, .pricing-grid, .testi-grid, .steps-grid, .timeline-grid { grid-template-columns: repeat(2, 1fr); }
      .features-split, .faq-split { grid-template-columns: 1fr; gap: 40px; }
      .side-card { display: none; }
      .footer-top { grid-template-columns: 1fr 1fr; }
    }

    @media (max-width: 768px) {
      .nav { width: calc(100% - 20px); top: 10px; padding: 0 16px; height: 60px; }
      .nav-links { display: none; }
      .nav-inner { justify-content: space-between; }
      .btn-primary { padding: 8px 16px; font-size: 10px; }
      
      section { padding: 60px 20px; }
      .hero { padding-top: 120px; }
      .hero-h1 { font-size: 38px; line-height: 1.1; }
      .hero-sub { font-size: 16px; margin-bottom: 32px; }
      .hero-ctas { flex-direction: column; width: 100%; gap: 12px; }
      .btn-hero, .btn-ghost { width: 100%; text-align: center; }
      
      .pain-grid, .feat-grid, .pricing-grid, .testi-grid, .steps-grid, .timeline-grid { grid-template-columns: 1fr; width: 100%; }
      .timeline-line, .timeline-progress, .timeline-node { display: none; }
      .timeline-card { margin-bottom: 20px; }
      
      .footer-top { grid-template-columns: 1fr; gap: 32px; }
      .footer-bottom { flex-direction: column; gap: 16px; text-align: center; }
      
      .plan-card { padding: 32px; }
      .plan-card.featured { transform: scale(1); }
      .plan-card.featured:hover { transform: translateY(-12px); }
      
      .faq-chat { position: relative; top: 0; padding: 24px; border-radius: 24px; }
      .cta-h2 { font-size: 32px; }
      .section-h2 { font-size: 28px; }
      .hero-card { padding: 12px; border-radius: 24px; }
      .hero-card-inner { padding: 16px; border-radius: 16px; }
      .mock-bar { width: 100%; }
      .side-card { display: none !important; }
    }
  `}</style>
);

// ─── Reveal on scroll ──────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { (el as HTMLElement).classList.add("visible"); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function R({ children, delay = 0, style = {} }: { children: React.ReactNode, delay?: number, style?: React.CSSProperties }) {
  const ref = useReveal();
  return (
    <div ref={ref} className="reveal" style={{ transitionDelay: `${delay}s`, ...style }}>
      {children}
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────
interface Plan {
  name: string;
  price: {
    monthly: string;
    yearly: string;
  };
  desc: string;
  icon: string;
  features: string[];
  cta: string;
  featured?: boolean;
}

const plans: Plan[] = [
  { name: "Standard Plan", price: { monthly: "0",  yearly: "0"  }, desc: "Perfect for beginners", icon: "⚡", features: ["Basic IELTS Overview", "1 Mock Test per month", "Daily Vocabulary", "Progress tracking"], cta: "Start Learning" },
  { name: "Premium IELTS", price: { monthly: "29", yearly: "24" }, desc: "Best for serious candidates", icon: "✨", features: ["Unlimited AI Speaking Prep", "Unlimited Writing Evaluation", "Official IELTS Mock Tests", "Band Score Prediction", "Priority support"], cta: "Get Band 8.0", featured: true },
  { name: "Tutor Pro",     price: { monthly: "49", yearly: "42" }, desc: "For coaches and schools", icon: "👥", features: ["Everything in Premium", "Student management", "Detailed error analysis", "Custom feedback templates"], cta: "Contact Sales" },
];

const faqs = [
  { q: "Is Lingoura AI suitable for both Academic and General Training?", a: "Yes! Our AI is trained on both Academic and General Training modules to provide specialized feedback for your specific test type." },
  { q: "How accurate is the AI Band Score prediction?", a: "Our scoring algorithms are aligned with the official IELTS assessment criteria (Task Achievement, Coherence, Lexical Resource, etc.) to provide predictions within 0.5 of your actual score." },
  { q: "Can I practice Speaking with the AI?", a: "Absolutely. Our real-time AI Speaking coach simulates Part 1, 2, and 3 of the IELTS test and provides instant feedback on fluency and pronunciation." },
  { q: "Does it help with Writing Task 1 and 2?", a: "Yes. You can submit your essays and data descriptions for instant evaluation against IELTS standards, including grammatical range and accuracy." },
  { q: "Are the Reading and Listening tests exam-standard?", a: "Yes — all our practice materials are designed to match the difficulty, timing, and structure of real IELTS exams." },
  { q: "How often are the practice materials updated?", a: "We update our question bank weekly with the latest IELTS topics and trends to ensure you're always prepared for the current exam cycle." },
];

const testimonials = [
  { name: "Maria Garcia",  role: "IELTS Candidate (Band 8.5)", avatar: "👩‍🎓", quote: "Lingoura AI was the only tool that gave me the instant feedback I needed to fix my Writing Task 2 coherence issues." },
  { name: "Ahmed Khan",    role: "IELTS Candidate (Band 8.0)", avatar: "👨‍💻", quote: "The AI Speaking practice felt so real. It helped me overcome my nervousness and improve my pronunciation significantly." },
  { name: "Li Wei",        role: "Graduate Student",          avatar: "👩‍🎓", quote: "I love how the dashboard tracks my band score progress across all four sections. It keeps me incredibly motivated." },
];

// ─── Main Component ────────────────────────────────────────────────────────
export default function LearnFlowLanding() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <>
      <FontLoader />
      <div className="bg-mesh" />

      {/* NAV */}
      <nav className="nav">
        <div className="nav-inner">
          <a href="#" className="logo">
            <img src="/logo-icon.png" alt="Lingoura AI" className="logo-img" />
            Lingoura AI
          </a>
          <ul className="nav-links">
            <li><a href="#features">Features</a></li>
            <li><a href="#how-it-works">Workflow</a></li>
            <li><a href="#pricing">Pricing</a></li>
          </ul>
          <a href="#pricing" className="btn-primary">Get Started →</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero" style={{ paddingTop: 160 }}>
        <div className="badge fade-up">✨ Certified IELTS Coaching</div>

        <h1 className="hero-h1 fade-up d-100">
          Master the IELTS<br />
          <span className="grad-text">With AI Precision</span>
        </h1>

        <p className="hero-sub fade-up d-200">
          The ultimate AI-powered preparation platform for IELTS. Master Speaking, Writing, Reading, and Listening with real-time feedback and exam-standard mocks.
        </p>

        <div className="hero-ctas fade-up d-300">
          <a href="#pricing" className="btn-hero" style={{ textDecoration: "none", display: "inline-block" }}>Get Started Free</a>
          <a href="#how-it-works" className="btn-ghost" style={{ textDecoration: "none", display: "inline-block" }}>See How It Works</a>
        </div>

        <div className="social-proof fade-up d-400">
          <div className="avatars">
            {[1,2,3].map(i => <div key={i} className="avatar" />)}
          </div>
          <span>Join</span>
          <span className="accent">10,000+</span>
          <span>candidates achieving Band 8.0+</span>
        </div>

        {/* MOCK UI */}
        <div className="hero-card-wrap fade-up d-500">
          {/* floating left */}
          <div className="side-card side-card-left float1">
            <div className="sc-row">
              <div className="sc-icon">🧠</div>
              <span className="sc-label">AI Tutor</span>
            </div>
            <div className="sc-lines">
              <div className="mock-line" style={{ width: "100%", background: "#EEF2FF" }} />
              <div className="mock-line" style={{ width: "75%", background: "#F4F4F5" }} />
              <div style={{ height: 40, borderRadius: 10, background: "#EEF2FF", marginTop: 10, border: "1px solid rgba(99,102,241,.12)" }} />
            </div>
          </div>

          {/* floating right */}
          <div className="side-card side-card-right float2">
            <div className="sc-check-row" style={{ marginBottom: 14 }}>
              <div className="sc-check">✓</div>
              <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: ".18em", textTransform: "uppercase", color: "#10B981" }}>Fluency Boosted</span>
            </div>
            <div style={{ height: 100, background: "#F4F5FC", borderRadius: 14, border: "1px solid rgba(17,17,17,.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, opacity: .3 }}>
              📊
            </div>
          </div>

          <div className="hero-card">
            <div className="hero-card-inner">
              <div className="mock-bar">
                {[1,2,3].map(i=><div key={i} className="mock-dot" />)}
                <div className="mock-line" style={{ width: 120, background: "#E0E7FF" }} />
              </div>
              <div className="mock-grid">
                <div className="mock-tile">
                  <div className="mock-icon-box">💬</div>
                  <div className="mock-lines">
                    <div className="mock-line" style={{ width: "100%", height: 8 }} />
                    <div className="mock-line" style={{ width: "70%", height: 8 }} />
                    <div className="mock-line" style={{ width: "85%", height: 8 }} />
                  </div>
                </div>
                <div className="mock-tile-center mock-tile">✨</div>
              </div>
            </div>
          </div>
        </div>

        {/* Trusted by */}
        <div className="trusted" style={{ width: "100%", maxWidth: 900 }}>
          <p className="trusted-label">Trusted by teams and learners worldwide</p>
          <div className="trusted-logos">
            {["Nova Labs", "BrightCore", "Cognify", "SkillBridge", "Orbit Labs"].map(n => (
              <span key={n}>{n}</span>
            ))}
          </div>
        </div>
      </section>

      {/* WHY LEARNING FEELS HARD */}
      <section>
        <div className="section-inner">
          <R style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div className="section-tag">Why Learning Feels Hard</div>
            <h2 className="section-h2" style={{ maxWidth: 700, textAlign: "center" }}>
              Learning today feels overwhelming,<br />unstructured, and easy to forget.
            </h2>
          </R>
          <div className="pain-grid">
            {[
              { icon: "📉", title: "Inaccurate Feedback",  desc: "Self-study feels like guessing. You don't know why your band score is stuck." },
              { icon: "⌛", title: "Wasted Prep Time",      desc: "Spending hours on generic resources that don't match actual exam standards." },
              { icon: "😰", title: "Exam Anxiety",        desc: "Fear of the Speaking examiner or the high-pressure Writing tasks." },
            ].map((item, i) => (
              <R key={i} delay={i * .1}>
                <div className="pain-card">
                  <div className="pain-icon">{item.icon}</div>
                  <h3 className="pain-title">{item.title}</h3>
                  <p className="pain-desc">{item.desc}</p>
                </div>
              </R>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="features-bg">
        <div className="section-inner">
          <div className="features-split">
            <R>
              <div className="section-tag">IELTS Specialized AI</div>
              <h2 className="section-h2">The only coach you <span className="grad-text">need</span><br />for Band 8.5</h2>
              <p className="section-sub">Personalized IELTS roadmaps, instant band score predictions, and human-like AI speaking partners.</p>
              <div className="feature-pills">
                {[
                  { icon: "⚡", label: "Active Learning" },
                  { icon: "🔄", label: "Smart Retention" },
                  { icon: "🧠", label: "Neural Paths" },
                  { icon: "💡", label: "Expert Insights" },
                ].map(f => (
                  <div className="feature-pill" key={f.label}>
                    <div className="fp-icon">{f.icon}</div>
                    <span className="fp-label">{f.label}</span>
                  </div>
                ))}
              </div>
            </R>
            <R delay={.15}>
              <div className="feat-mock">
                <div className="feat-mock-inner">
                  <div className="feat-bottom-card">
                    <div className="mock-line" style={{ width: "55%", height: 10, background: "#E0E7FF", marginBottom: 14 }} />
                    <div className="mock-line" style={{ width: "100%", height: 7, background: "#F4F4F5", marginBottom: 8 }} />
                    <div className="mock-line" style={{ width: "100%", height: 7, background: "#F4F4F5" }} />
                  </div>
                </div>
              </div>
            </R>
          </div>
        </div>
      </section>

      {/* FEATURE GRID */}
      <section>
        <div className="section-inner">
          <R style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div className="section-tag">All-in-one Platform</div>
            <h2 className="section-h2" style={{ maxWidth: 700 }}>Everything you need to learn<br />at scale with AI</h2>
          </R>
          <div className="feat-grid">
            {[
              { icon: "🎧", title: "Listening Mastery", desc: "4 sections of authentic social and academic recordings with exam-standard questions." },
              { icon: "📖", title: "Reading Lab", desc: "Master Skimming and Scanning with texts from official books, journals, and newspapers." },
              { icon: "✍️", title: "Writing Evaluator", desc: "Instant Band 9 level feedback on Task 1 data descriptions and Task 2 essays." },
              { icon: "🗣️", title: "Speaking Coach", desc: "Real-time AI voice partner that evaluates your fluency, coherence, and grammar." },
              { icon: "📊", title: "Band Prediction", desc: "Accurate score forecasting across all modules based on official assessment criteria." },
              { icon: "📈", title: "Progress Track", desc: "Deep analytics on your consistency, performance trends, and focus areas." },
            ].map((f, i) => (
              <R key={i} delay={i * 0.05}>
                <div className="feat-card">
                  <div className="feat-icon-box">{f.icon}</div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              </R>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section>
        <div className="section-inner">
          <R style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div className="section-tag">Master Any Topic</div>
            <h2 className="section-h2">See how our users master<br />a focus topic</h2>
          </R>
          <div className="timeline-wrap">
            <div className="timeline-line" />
            <div className="timeline-progress" />
            <div className="timeline-grid">
              {[
                { label: "Foundation", title: "Building the Basics", desc: "Start with fundamental concepts and core definitions to build a solid base." },
                { label: "Deep Dive", title: "Core Concepts", desc: "Master the underlying principles and complex mechanics of your subject." },
                { label: "Mastery", title: "Advanced Application", desc: "Apply your knowledge to real-world scenarios and complex problem solving." },
              ].map((t, i) => (
                <div key={i}>
                  <div className="timeline-node" style={{ opacity: i < 2 ? 1 : 0.3 }} />
                  <R delay={i * 0.1}>
                    <div className="timeline-card">
                      <div className="section-tag" style={{ fontSize: 9, marginBottom: 12 }}>{t.label}</div>
                      <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>{t.title}</h3>
                      <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.6 }}>{t.desc}</p>
                    </div>
                  </R>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* INTEGRATIONS */}
      <section>
        <div className="section-inner" style={{ textAlign: "center" }}>
          <R style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div className="section-tag">Integrations</div>
            <h2 className="section-h2">Integrates with all your<br />favorite tools</h2>
            <p className="section-sub">Connect Lingoura AI with the tools you already use to create a seamless learning workflow.</p>
          </R>
          <div className="int-wrap">
            {["📁", "📝", "💬", "🎨", "📅", "🚀", "🛠️", "💡"].map((icon, i) => (
              <R key={i} delay={i * 0.05}>
                <div className="int-logo">{icon}</div>
              </R>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works">
        <div className="section-inner">
          <R style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div className="section-tag">Start learning smarter in just a few steps</div>
            <h2 className="section-h2">Simple. Powerful. Personalized.</h2>
          </R>
          <div className="steps-grid">
            {[
              { num: 1, icon: "🗂️", title: "Structured Learning Path",  desc: "Import your topic and let Lingoura AI build a structured learning curriculum for you." },
              { num: 2, icon: "🤖", title: "Learn with AI Guidance",    desc: "Ask questions, get explanations, and receive personalized feedback from your AI tutor." },
              { num: 3, icon: "📈", title: "Track and Improve",         desc: "Visualize your retention, consistency streaks, and mastery with detailed analytics." },
            ].map((s, i) => (
              <R key={i} delay={i * .12}>
                <div className="step-card">
                  <div className="step-num">{s.num}</div>
                  <div className="step-icon">{s.icon}</div>
                  <h3 className="step-title">{s.title}</h3>
                  <p className="step-desc">{s.desc}</p>
                </div>
              </R>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing">
        <div className="section-inner pricing-center">
          <R>
            <div className="section-tag">Simple Pricing</div>
            <h2 className="section-h2">Simple pricing for<br />smarter learning</h2>
            <p className="section-sub">Start for free and upgrade as you grow. No hidden fees.</p>
          </R>

          <div className="billing-toggle">
            <button className={`toggle-btn ${billing === "monthly" ? "active" : ""}`} onClick={() => setBilling("monthly")}>Monthly</button>
            <button className={`toggle-btn ${billing === "yearly"  ? "active" : ""}`} onClick={() => setBilling("yearly")}>
              Yearly <span className="save-badge">Save 17%</span>
            </button>
          </div>

          <div className="pricing-grid">
            {plans.map((plan, i) => (
              <R key={i} delay={i * .1}>
                <div className={`plan-card ${plan.featured ? "featured" : ""}`} style={{ position: "relative" }}>
                  {plan.featured && <div className="popular-chip">🔥 Most Popular</div>}
                  <div>
                    <div className="plan-icon">{plan.icon}</div>
                  </div>
                  <div>
                    <div className="plan-name">{plan.name}</div>
                    <div className="plan-desc">{plan.desc}</div>
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                      <span className="plan-price">${plan.price[billing]}</span>
                      <span className="plan-per">/ mo</span>
                    </div>
                  </div>
                  <div className="plan-features">
                    {plan.features.map(f => (
                      <div className="pf-item" key={f}>
                        <span className="pf-check">✓</span>
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                  <button className="plan-btn">{plan.cta}</button>
                </div>
              </R>
            ))}
          </div>

          <div style={{ marginTop: 32, display: "flex", gap: 20 }}>
            {["No credit card required", "Cancel anytime", "Free plan available"].map((t, i) => (
              <span key={i} style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--light)" }}>
                {i > 0 ? "• " : ""}{t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section>
        <div className="section-inner" style={{ textAlign: "center" }}>
          <R style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div className="section-tag">What Our Users Say</div>
            <div className="stars">★★★★★</div>
            <h2 className="section-h2" style={{ marginTop: 12 }}>Loved by learners worldwide</h2>
            <p className="section-sub">Thousands of learners use Lingoura AI to stay focused, organized, and consistent every day.</p>
          </R>
          <div className="testi-grid">
            {testimonials.map((t, i) => (
              <R key={i} delay={i * .1}>
                <div className="testi-card">
                  <p className="testi-quote">"{t.quote}"</p>
                  <div className="testi-author">
                    <div className="testi-avatar">{t.avatar}</div>
                    <div>
                      <div className="testi-name">{t.name}</div>
                      <div className="testi-role">{t.role}</div>
                    </div>
                  </div>
                </div>
              </R>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section>
        <div className="section-inner">
          <div className="faq-split">
            {/* Left – chat mockup */}
            <R>
              <div className="faq-chat">
                <div className="chat-msg">
                  <div className="chat-avatar">✨</div>
                  <div className="chat-bubble">
                    <div className="chat-name">AI Tutor</div>
                    <div className="chat-text">Do you have any questions?</div>
                    <div className="chat-actions">
                      <button className="chat-action-btn">👍</button>
                      <button className="chat-action-btn">👎</button>
                      <button className="chat-action-btn" style={{ marginLeft: "auto" }}>📋 Save to Notes</button>
                    </div>
                  </div>
                </div>
                <div className="chat-msg right">
                  <div className="chat-bubble">
                    <div className="chat-name">You</div>
                    <div className="chat-text">Yes, I have some questions!</div>
                    <div className="chat-time">10:30 AM</div>
                  </div>
                </div>
              </div>
            </R>

            {/* Right – accordion */}
            <div>
              <R>
                <div className="section-tag">Frequently Asked Questions</div>
                <h2 className="section-h2">Everything you<br />need to know</h2>
                <p className="section-sub" style={{ marginBottom: 40 }}>Find answers to the most common questions about Lingoura AI.</p>
              </R>
              <div className="faq-list">
                {faqs.map((faq, i) => (
                  <div key={i} className={`faq-item ${openFaq === i ? "open" : ""}`}>
                    <div className="faq-trigger" onClick={() => setOpenFaq(openFaq === i ? -1 : i)}>
                      <span className="faq-q">{faq.q}</span>
                      <span className="faq-chevron">{openFaq === i ? "⌃" : "⌄"}</span>
                    </div>
                    {openFaq === i && <div className="faq-answer">{faq.a}</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="cta-section">
        <div className="section-inner" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <R>
            <h2 className="cta-h2">
              Ready to achieve<br />your dream Band<br />score?
            </h2>
            <p className="section-sub" style={{ textAlign: "center", marginBottom: 48, maxWidth: 520 }}>
              Join thousands of candidates using Lingoura AI to perfect their IELTS skills and unlock their global future.
            </p>
            <div className="hero-ctas">
              <button className="btn-hero">Get Started Free</button>
              <button className="btn-ghost">Try Demo</button>
            </div>
            <div className="cta-small">
              <span>No credit card required</span>
              <span>•</span>
              <span>Free plan available</span>
              <span>•</span>
              <span>Cancel anytime</span>
            </div>
          </R>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-inner">
          <div className="footer-top">
            <div>
              <a href="#" className="logo" style={{ textDecoration: "none" }}>
                <img src="/logo-icon.png" alt="Lingoura AI" className="logo-img" />
                Lingoura AI
              </a>
              <p className="footer-tagline">Smarter learning powered by AI.</p>
            </div>
            {[
              { title: "Product",  links: ["Features", "Integrations", "Pricing", "Updates"] },
              { title: "Company",  links: ["About Us", "Careers", "Blog"] },
              { title: "Resources",links: ["Documentation", "Help Center", "Community"] },
              { title: "Legal",    links: ["Privacy Policy", "Terms of Service"] },
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
          </div>
        </div>
        <div className="footer-watermark">Lingoura AI</div>
      </footer>
    </>
  );
}