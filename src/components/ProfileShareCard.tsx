"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Award, Sparkles } from "lucide-react";

export function ProfileShareCard({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes rotate-border {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.08); }
        }
        @keyframes float-particle {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.4; }
          50% { transform: translateY(-12px) rotate(180deg); opacity: 1; }
        }
        @keyframes gold-sweep {
          0% { left: -100%; }
          60%, 100% { left: 150%; }
        }
        @keyframes bar-fill {
          from { width: 0%; }
        }
        .gold-text {
          background: linear-gradient(
            90deg,
            #b8922a 0%,
            #f5d060 20%,
            #ffeaa0 40%,
            #d4a843 60%,
            #f5d060 80%,
            #b8922a 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }
        .gold-border-wrap {
          position: relative;
          border-radius: 3rem;
          padding: 2px;
          background: linear-gradient(135deg, #b8922a, #f5d060, #ffeaa0, #d4a843, #b8922a);
          background-size: 300% 300%;
          animation: shimmer 4s linear infinite;
        }
        .card-inner {
          background: linear-gradient(145deg, #0a0a0f 0%, #0f0d1a 40%, #0a0f0d 100%);
          border-radius: calc(3rem - 2px);
          position: relative;
          overflow: hidden;
        }
        .sweep-line {
          position: absolute;
          top: 0;
          left: -100%;
          width: 60%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(245, 208, 96, 0.04) 40%,
            rgba(255, 234, 160, 0.12) 50%,
            rgba(245, 208, 96, 0.04) 60%,
            transparent 100%
          );
          animation: gold-sweep 5s ease-in-out infinite;
          pointer-events: none;
          z-index: 5;
        }
        .particle {
          position: absolute;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: #f5d060;
          animation: float-particle 3s ease-in-out infinite;
        }
        .stat-bar {
          height: 2px;
          border-radius: 2px;
          background: linear-gradient(90deg, #b8922a, #f5d060, #ffeaa0);
          animation: bar-fill 1.5s ease-out forwards;
        }
        .glow-orb-gold {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          animation: pulse-glow 4s ease-in-out infinite;
          pointer-events: none;
        }
        .btn-gold {
          background: linear-gradient(135deg, #b8922a 0%, #f5d060 40%, #ffeaa0 60%, #d4a843 100%);
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
          color: #0a0a0f;
          font-weight: 800;
          letter-spacing: 0.04em;
          border: none;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .btn-gold:hover {
          transform: scale(1.02);
          box-shadow: 0 0 24px rgba(245, 208, 96, 0.4);
        }
        .btn-gold:active {
          transform: scale(0.97);
        }
        .divider-gold {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(245,208,96,0.3), rgba(255,234,160,0.6), rgba(245,208,96,0.3), transparent);
        }
        .badge-gold {
          background: linear-gradient(135deg, rgba(184,146,42,0.15), rgba(245,208,96,0.08));
          border: 1px solid rgba(245, 208, 96, 0.25);
          border-radius: 999px;
          padding: 4px 14px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
      `}</style>

      <AnimatePresence>
        {isOpen && (
          <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              style={{ position: "absolute", inset: 0, background: "rgba(5,4,12,0.85)", backdropFilter: "blur(12px)" }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 30 }}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
              style={{ position: "relative", zIndex: 10, width: 420, maxWidth: "95vw", display: "flex", flexDirection: "column" }}
            >
              {/* Gold border wrapper */}
              <div className="gold-border-wrap">
                <div className="card-inner">
                  {/* Sweep shimmer overlay */}
                  <div className="sweep-line" />

                  {/* Glow orbs */}
                  <div className="glow-orb-gold" style={{ width: 300, height: 300, top: -80, right: -60, background: "rgba(184,146,42,0.18)" }} />
                  <div className="glow-orb-gold" style={{ width: 200, height: 200, bottom: -40, left: -40, background: "rgba(120,80,10,0.12)", animationDelay: "2s" }} />
                  <div className="glow-orb-gold" style={{ width: 150, height: 150, top: "40%", left: "30%", background: "rgba(255,234,160,0.06)", animationDelay: "1s" }} />

                  {/* Floating particles */}
                  {[
                    { top: "15%", left: "12%", delay: "0s" },
                    { top: "25%", right: "18%", delay: "1.2s" },
                    { top: "55%", left: "8%", delay: "0.6s" },
                    { top: "70%", right: "12%", delay: "1.8s" },
                    { top: "40%", right: "6%", delay: "2.4s" },
                  ].map((p, i) => (
                    <div key={i} className="particle" style={{ ...p, animationDelay: p.delay }} />
                  ))}

                  {/* Card content */}
                  <div style={{ padding: "2rem 2rem 1.75rem", position: "relative", zIndex: 2 }}>
                    {/* Header */}
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "2.5rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <img src="/logo-icon.png" alt="Logo" style={{ width: 64, height: 64, objectFit: "contain" }} />
                        <div>
                          <div className="gold-text" style={{ fontSize: 20, fontWeight: 900, letterSpacing: "-0.02em", lineHeight: 1 }}>
                            Lingoura AI
                          </div>
                          <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(245,208,96,0.45)", letterSpacing: "0.35em", textTransform: "uppercase", marginTop: 5 }}>
                            Certified Mastery
                          </div>
                        </div>
                      </div>
                      <div style={{ position: "relative" }}>
                        <Award size={32} color="#f5d060" style={{ filter: "drop-shadow(0 0 8px rgba(245,208,96,0.5))" }} />
                      </div>
                    </div>

                    {/* Profile label */}
                    <div className="badge-gold" style={{ marginBottom: 12 }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#f5d060", boxShadow: "0 0 6px #f5d060" }} />
                      <span style={{ fontSize: 9, fontWeight: 700, color: "rgba(245,208,96,0.7)", letterSpacing: "0.4em", textTransform: "uppercase" }}>
                        Official Fluency Profile
                      </span>
                    </div>

                    {/* Name */}
                    <div style={{ marginBottom: "2rem" }}>
                      <h2 style={{ fontSize: 42, fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.05, color: "#f8f6f0", margin: 0 }}>
                        Alex Newman
                      </h2>
                    </div>

                    <div className="divider-gold" style={{ marginBottom: "1.75rem" }} />

                    {/* Stats grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem 2rem", marginBottom: "2rem" }}>
                      {[
                        { label: "Mastery Level", value: "C1 Advanced", color: "#a78bfa", barW: "88%" },
                        { label: "Fluency Score", value: "88%", color: "#34d399", barW: "88%" },
                        { label: "Active Streak", value: "12 Days", color: "#fb923c", barW: "60%" },
                        { label: "Velocity", value: "+18.4%", color: "#f472b6", barW: "72%" },
                      ].map((stat) => (
                        <div key={stat.label}>
                          <p style={{ fontSize: 9, fontWeight: 700, color: "rgba(245,208,96,0.35)", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 6 }}>
                            {stat.label}
                          </p>
                          <p style={{ fontSize: 20, fontWeight: 900, color: stat.color, margin: "0 0 8px", filter: `drop-shadow(0 0 6px ${stat.color}55)`, letterSpacing: "-0.01em" }}>
                            {stat.value}
                          </p>
                          <div style={{ background: "rgba(255,255,255,0.05)", height: 2, borderRadius: 2, overflow: "hidden" }}>
                            <div className="stat-bar" style={{ width: stat.barW }} />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="divider-gold" style={{ marginBottom: "1.5rem" }} />

                    {/* Footer row */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div>
                        <p style={{ fontSize: 9, fontWeight: 700, color: "rgba(245,208,96,0.2)", letterSpacing: "0.5em", textTransform: "uppercase", margin: "0 0 8px" }}>
                          ID: LQ-2026-X99
                        </p>
                        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                          <div style={{ height: 3, width: 36, borderRadius: 3, background: "linear-gradient(90deg, #b8922a, #f5d060)" }} />
                          <div style={{ height: 3, width: 3, borderRadius: "50%", background: "rgba(255,255,255,0.12)" }} />
                          <div style={{ height: 3, width: 3, borderRadius: "50%", background: "rgba(255,255,255,0.12)" }} />
                        </div>
                      </div>
                      <div style={{
                        width: 44, height: 44, 
                        display: "flex", alignItems: "center", justifyContent: "center"
                      }}>
                        <img src="/logo-icon.png" alt="Logo" style={{ width: "100%", height: "100%", objectFit: "contain", opacity: 0.4 }} />
                      </div>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div style={{
                    padding: "1.25rem 2rem 1.75rem",
                    borderTop: "1px solid rgba(245,208,96,0.08)",
                    display: "flex",
                    gap: 12,
                    background: "rgba(0,0,0,0.2)"
                  }}>
                    <button
                      className="btn-gold"
                      style={{
                        flex: 1,
                        height: 52,
                        borderRadius: 16,
                        fontSize: 14,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                      }}
                    >
                      <Download size={17} />
                      Download Card
                    </button>
                    <button
                      onClick={onClose}
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 16,
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "rgba(255,255,255,0.4)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        flexShrink: 0,
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = "rgba(220,60,60,0.15)";
                        (e.currentTarget as HTMLButtonElement).style.color = "#f87171";
                        (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(248,113,113,0.3)";
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)";
                        (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.4)";
                        (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)";
                      }}
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}