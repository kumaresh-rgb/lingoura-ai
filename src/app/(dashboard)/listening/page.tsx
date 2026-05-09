"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Headphones, 
  Sparkles, 
  FileText, 
  ChevronRight, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward,
  CheckCircle2,
  ListFilter,
  Globe,
  Settings2,
  ArrowRight,
  History
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ListeningPage() {
  const [mode, setMode] = useState<"select" | "ai" | "custom" | "active">("select");
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="space-y-12 max-w-[1400px] mx-auto">
      <section>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">Listening Lab</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-4 text-lg font-medium max-w-2xl leading-relaxed">
          Master diverse accents and nuances with AI-personalized listening experiences.
        </p>
      </section>

      <AnimatePresence mode="wait">
        
        {/* Mode Selection */}
        {mode === "select" && (
          <motion.div 
            key="select"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-12"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ModeCard 
                title="AI Concept Generator"
                description="Custom listening session based on your level, preferred accent, and professional goals."
                icon={<Sparkles size={32} />}
                onClick={() => setMode("ai")}
                primary
              />
              <ModeCard 
                title="Contextual Upload"
                description="Turn any article, video link, or document into an interactive listening challenge."
                icon={<FileText size={32} />}
                onClick={() => setMode("custom")}
              />
            </div>

            {/* Recent Sessions */}
            <section className="space-y-6">
              <h2 className="text-2xl font-black tracking-tight flex items-center gap-2 text-slate-900 dark:text-white">
                <History size={24} className="text-indigo-600 dark:text-indigo-400" /> Recent Practice
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[
                  { title: "Silicon Valley Tech Talk", date: "2 hours ago", accent: "American", score: "92%" },
                  { title: "BBC Business Morning", date: "Yesterday", accent: "British", score: "88%" },
                  { title: "Global Logistics Sync", date: "3 days ago", accent: "Australian", score: "95%" },
                ].map((session, i) => (
                  <motion.div 
                    key={session.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 p-8 rounded-[2rem] hover:shadow-2xl dark:hover:shadow-none hover:border-indigo-100 dark:hover:border-white/20 transition-all group cursor-pointer"
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1 rounded-full">{session.accent}</span>
                      <span className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black">{session.score}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white mt-6 text-xl group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{session.title}</h4>
                    <div className="flex items-center gap-2 mt-6 text-slate-400 dark:text-slate-500">
                      <span className="text-xs font-bold">{session.date}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </motion.div>
        )}

        {/* AI Setup Mode */}
        {mode === "ai" && (
           <motion.div 
             key="ai"
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             exit={{ opacity: 0, x: -20 }}
             className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-sm space-y-10 w-full"
           >
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Configure AI Session</h2>
                <button onClick={() => setMode("select")} className="h-12 w-12 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-indigo-600 transition-all">
                  <SkipBack size={20} className="rotate-180" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <SetupOption label="Category" options={["Business", "Daily", "Academic", "Interview"]} icon={<ListFilter size={18} />} />
                <SetupOption label="CEFR Level" options={["A1", "A2", "B1", "B2", "C1", "C2"]} icon={<CheckCircle2 size={18} />} />
                <SetupOption label="Accent" options={["US", "UK", "AU", "IN"]} icon={<Globe size={18} />} />
                <SetupOption label="Duration" options={["5m", "10m", "15m", "20m"]} icon={<Settings2 size={18} />} />
              </div>

              <button 
                onClick={() => setMode("active")}
                className="w-full primary-gradient text-white py-6 rounded-3xl font-bold text-lg shadow-2xl shadow-indigo-100 dark:shadow-none active:scale-[0.98] transition-all hover:translate-y-[-2px]"
              >
                Generate & Start Immersive Session
              </button>
           </motion.div>
        )}

        {/* Active Session Mode */}
        {mode === "active" && (
          <motion.div 
            key="active"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-10 w-full"
          >
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
              
              {/* Main Player Area */}
              <div className="xl:col-span-8 space-y-10">
                <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-[3rem] p-8 md:p-16 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 primary-gradient opacity-20" />
                  
                  <div className="h-40 w-40 md:h-64 md:w-64 rounded-[3rem] primary-gradient flex items-center justify-center text-white mb-10 shadow-3xl shadow-indigo-100 dark:shadow-none relative group overflow-hidden">
                     <Headphones className="h-16 w-16 md:h-24 md:w-24 relative z-10" />
                     <motion.div 
                       animate={isPlaying ? { scale: [1, 1.5, 1], opacity: [0.1, 0.3, 0.1] } : {}}
                       transition={{ repeat: Infinity, duration: 3 }}
                       className="absolute inset-0 bg-white pointer-events-none"
                     />
                  </div>

                  <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">The Future of Remote Work</h2>
                  <p className="text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-[0.3em] text-xs mt-4">B2 Upper Intermediate • British Accent</p>

                  <div className="w-full mt-12 space-y-3">
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden relative">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "45%" }}
                        className="h-full bg-indigo-500 rounded-full relative z-10" 
                      />
                    </div>
                    <div className="flex justify-between text-xs font-black text-slate-400">
                      <span>02:14</span>
                      <span>05:00</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 md:gap-16 mt-10">
                    <button className="text-slate-300 dark:text-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all hover:scale-110 active:scale-95"><SkipBack size={32} /></button>
                    <button 
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="h-24 w-24 md:h-32 md:w-32 rounded-[2.5rem] primary-gradient text-white flex items-center justify-center shadow-3xl shadow-indigo-100 dark:shadow-none hover:scale-105 active:scale-90 transition-all border-8 border-white dark:border-white/10"
                    >
                      {isPlaying ? <Pause size={48} fill="white" /> : <Play size={48} fill="white" className="ml-2" />}
                    </button>
                    <button className="text-slate-300 dark:text-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all hover:scale-110 active:scale-95"><SkipForward size={32} /></button>
                  </div>
                </div>

                {/* Transcription Area */}
                <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-[3rem] p-10 shadow-sm">
                  <div className="flex items-center justify-between mb-10">
                    <h3 className="text-xl font-black flex items-center gap-3 text-slate-900 dark:text-white">
                      <FileText size={24} className="text-indigo-600 dark:text-indigo-400" /> Immersive Transcript
                    </h3>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-slate-50 dark:bg-white/10 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-50 dark:hover:bg-white/20 transition-all text-slate-600 dark:text-slate-400">Highlight Nouns</button>
                      <button className="px-4 py-2 bg-slate-50 dark:bg-white/10 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-50 dark:hover:bg-white/20 transition-all text-slate-600 dark:text-slate-400">Show Translation</button>
                    </div>
                  </div>
                  <div className="space-y-6 text-xl md:text-2xl text-slate-600 dark:text-slate-300 leading-[1.8] font-medium">
                    <p>In recent years, the landscape of global business has shifted dramatically. <span className="text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-100 dark:border-indigo-500/30 cursor-help hover:bg-indigo-50 dark:hover:bg-white/10 px-1 transition-all">Remote work</span> is no longer just a luxury; it has become a fundamental pillar of corporate strategy.</p>
                    <p className="opacity-30 dark:opacity-20">However, this transition comes with its own set of challenges, particularly regarding team cohesion and spontaneous innovation...</p>
                  </div>
                </div>
              </div>

              {/* Sidebar Analysis Area */}
              <div className="xl:col-span-4 space-y-8">
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-slate-900 dark:bg-white/5 rounded-[3rem] p-8 text-white shadow-2xl shadow-slate-200 dark:shadow-none border border-transparent dark:border-white/5 relative overflow-hidden"
                >
                  <div className="absolute -top-10 -right-10 opacity-10">
                    <Globe size={200} />
                  </div>
                  <h3 className="text-xl font-bold mb-6 relative z-10 flex items-center gap-2">
                    <Sparkles size={20} className="text-indigo-400" /> Accent Analysis
                  </h3>
                  <div className="space-y-6 relative z-10">
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Current Focus</p>
                      <p className="text-sm font-bold">Received Pronunciation (RP)</p>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-xs">
                        <span className="opacity-60 font-bold uppercase tracking-widest">Intonation Pattern</span>
                        <span className="text-indigo-400 font-black">94% Accurate</span>
                      </div>
                      <div className="h-1 w-full bg-white/10 rounded-full">
                        <div className="h-full bg-indigo-500 w-[94%]" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-xs">
                        <span className="opacity-60 font-bold uppercase tracking-widest">Vowel Nuances</span>
                        <span className="text-indigo-400 font-black">81% Accurate</span>
                      </div>
                      <div className="h-1 w-full bg-white/10 rounded-full">
                        <div className="h-full bg-indigo-500 w-[81%]" />
                      </div>
                    </div>
                  </div>
                </motion.div>

                <div className="bg-indigo-600 rounded-[3rem] p-10 text-white flex flex-col justify-between shadow-2xl shadow-indigo-200 dark:shadow-none">
                  <div>
                    <h3 className="text-xl font-black mb-6">Real-time Challenge</h3>
                    <p className="text-lg opacity-90 leading-relaxed font-medium">
                      Identify the speaker's tone regarding the future of office spaces.
                    </p>
                  </div>
                  <div className="space-y-3 mt-10">
                    <button className="w-full py-4 px-6 bg-white text-indigo-600 hover:bg-indigo-50 rounded-2xl text-xs font-black text-left transition-all shadow-lg active:scale-95">Skeptical & Cautious</button>
                    <button className="w-full py-4 px-6 bg-white/10 hover:bg-white/20 rounded-2xl text-xs font-black text-left transition-all border border-white/20">Optimistic & Resilient</button>
                    <button className="w-full py-4 px-6 bg-white/10 hover:bg-white/20 rounded-2xl text-xs font-black text-left transition-all border border-white/20">Indifferent & Practical</button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

function ModeCard({ title, description, icon, onClick, primary }: { title: string; description: string; icon: React.ReactNode; onClick: () => void; primary?: boolean }) {
  return (
    <motion.div 
      whileHover={{ y: -12, scale: 1.02 }}
      onClick={onClick}
      className={cn(
        "cursor-pointer p-8 md:p-12 rounded-[3rem] border transition-all duration-500 flex flex-col items-center text-center group h-full justify-center",
        primary 
          ? "bg-white dark:bg-white/5 border-slate-200 dark:border-white/5 shadow-sm hover:shadow-3xl dark:hover:shadow-none hover:border-indigo-100 dark:hover:border-white/20" 
          : "bg-white dark:bg-white/5 border-slate-200 dark:border-white/5 shadow-sm hover:shadow-3xl dark:hover:shadow-none hover:border-indigo-100 dark:hover:border-white/20"
      )}
    >
      <div className={cn(
        "h-20 w-20 md:h-28 md:w-28 rounded-3xl flex items-center justify-center mb-10 transition-all duration-500 relative",
        primary ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:primary-gradient group-hover:text-white group-hover:shadow-xl group-hover:shadow-indigo-100 dark:group-hover:shadow-none" : "bg-slate-50 dark:bg-white/10 text-slate-500 dark:text-slate-400 group-hover:bg-indigo-50 dark:group-hover:bg-white/20 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
      )}>
        {icon}
      </div>
      <h3 className="text-2xl md:text-3xl font-black tracking-tight mb-4 text-slate-900 dark:text-white leading-tight">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium text-lg">{description}</p>
      <div className="mt-10 flex items-center gap-3 text-indigo-600 font-black text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
        Enter Workshop <ChevronRight size={18} />
      </div>
    </motion.div>
  );
}

function SetupOption({ label, options, icon }: { label: string; options: string[]; icon: React.ReactNode }) {
  const [selected, setSelected] = useState(options[0]);
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
        {icon} {label}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((opt: string) => (
          <button
            key={opt}
            onClick={() => setSelected(opt)}
            className={cn(
              "px-5 py-2.5 rounded-2xl text-xs font-bold transition-all border",
              selected === opt 
                ? "bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100 dark:shadow-none" 
                : "bg-white dark:bg-white/5 border-slate-100 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:bg-indigo-50/30 dark:hover:bg-white/10"
            )}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
