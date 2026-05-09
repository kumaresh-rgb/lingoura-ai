"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mic, 
  MicOff, 
  X, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  BarChart3,
  MessageSquare,
  Zap,
  Volume2,
  BrainCircuit,
  Info,
  Activity,
  Smile,
  Square,
  ChevronRight,
  User as UserIcon,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SpeakingPage() {
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hello! I'm your communication coach. Today, let's practice a business negotiation scenario. You're trying to finalize a contract, but the client is asking for a 15% discount. How would you respond?", time: "10:02 AM" }
  ]);
  const [transcription, setTranscription] = useState("");
  const [corrections, setCorrections] = useState([
    { type: "grammar", original: "He go office", correction: "He goes to the office", icon: <CheckCircle2 size={14} /> },
    { type: "filler", text: "um", count: 12, icon: <AlertCircle size={14} /> },
    { type: "pronunciation", word: "Negotiate", issue: "Stress on wrong syllable", icon: <Volume2 size={14} /> }
  ]);

  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Simulate transcription
      setTranscription("I think we can... um... offer a 5% discount if they commit to a longer... actually... a two-year contract.");
    }
  };

  return (
    <div className="space-y-12 max-w-[1400px] mx-auto">
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">Speaking Lab</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-4 text-lg font-medium max-w-2xl leading-relaxed">
            Refine your pronunciation and fluency with real-time AI voice feedback and deep analysis.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10 transition-all font-bold shadow-sm flex items-center gap-2">
            <BarChart3 size={18} /> Detailed Analytics
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        
        {/* Main Conversation Area */}
        <div className="xl:col-span-8 space-y-10">
          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-[3rem] p-8 md:p-12 shadow-[0_20px_50px_-20px_rgba(93,95,239,0.05)] relative overflow-hidden h-[650px] flex flex-col group">
            <div className="absolute top-0 left-0 w-full h-1.5 primary-gradient opacity-10" />
            
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto space-y-10 pr-4 scrollbar-hide">
              {messages.map((msg, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={cn(
                    "flex gap-6 max-w-[85%]",
                    msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                  )}
                >
                  <div className={cn(
                    "h-12 w-12 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-lg",
                    msg.role === "ai" ? "bg-indigo-600 text-white shadow-indigo-100" : "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400 shadow-slate-100 dark:shadow-none"
                  )}>
                    {msg.role === "ai" ? <Sparkles size={24} /> : <UserIcon size={24} />}
                  </div>
                  <div className="space-y-2">
                    <div className={cn(
                      "p-6 rounded-[2rem] text-base md:text-lg leading-relaxed font-medium shadow-sm",
                      msg.role === "ai" ? "bg-indigo-50/50 dark:bg-indigo-500/10 text-slate-800 dark:text-slate-200 rounded-tl-none" : "bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-300 rounded-tr-none"
                    )}>
                      {msg.text}
                    </div>
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 block",
                      msg.role === "user" ? "text-right" : "text-left"
                    )}>
                      {msg.time}
                    </span>
                  </div>
                </motion.div>
              ))}

              {isListening && transcription && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex gap-6 max-w-[85%] ml-auto flex-row-reverse"
                >
                  <div className="h-12 w-12 rounded-2xl bg-indigo-600 text-white flex-shrink-0 flex items-center justify-center shadow-xl shadow-indigo-200 relative">
                    <Mic size={24} />
                    <motion.div 
                      animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="absolute inset-0 bg-indigo-400 rounded-2xl -z-10"
                    />
                  </div>
                  <div className="p-6 rounded-[2rem] rounded-tr-none bg-indigo-600 text-white text-lg leading-relaxed shadow-2xl shadow-indigo-100 font-medium">
                    {transcription}
                    <motion.span 
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ repeat: Infinity, duration: 0.8 }}
                      className="inline-block w-1.5 h-6 bg-white/50 ml-2 align-middle" 
                    />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Interaction Bar */}
            <div className="mt-8 pt-8 border-t border-slate-50 dark:border-white/5">
              <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                   <div className="flex gap-1.5 items-end h-10">
                     {[1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1].map((h, i) => (
                       <motion.div 
                         key={i}
                         animate={isListening ? { height: [h*4, h*8, h*4], backgroundColor: ["#6366f1", "#818cf8", "#6366f1"] } : { height: 8 }}
                         transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.1 }}
                         className="w-2 bg-slate-200 dark:bg-white/10 rounded-full transition-colors"
                       />
                     ))}
                   </div>
                   <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">Ambient Analysis Active</span>
                 </div>
                 <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-100 dark:border-emerald-500/20">
                   <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Live Feedback Enabled
                 </div>
              </div>

              <div className="flex items-center gap-8">
                <button 
                  onClick={toggleListening}
                  className={cn(
                    "h-28 w-28 rounded-[2.5rem] flex items-center justify-center transition-all duration-500 shadow-2xl relative group overflow-hidden border-8 border-white",
                    isListening 
                      ? "bg-rose-500 text-white shadow-rose-200 scale-110" 
                      : "primary-gradient text-white shadow-indigo-200 hover:scale-105 active:scale-95"
                  )}
                >
                  {isListening ? <Square size={36} fill="white" /> : <Mic size={36} fill="white" />}
                  {isListening && (
                    <motion.div 
                      animate={{ scale: [1, 2, 1], opacity: [0.1, 0, 0.1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute inset-0 bg-white"
                    />
                  )}
                </button>
                
                <div className="flex-1">
                  <div className={cn(
                    "bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-[2.5rem] p-8 text-xl font-medium transition-all min-h-[100px] flex items-center",
                    isListening ? "text-slate-900 dark:text-white shadow-inner" : "text-slate-400 dark:text-slate-600 italic"
                  )}>
                    {isListening ? "Listening with intelligence..." : "Tap the microphone to practice speaking..."}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pitch & Fluency Visualizer (Premium Area) */}
          <div className="bg-slate-900 dark:bg-white/5 rounded-[3rem] p-12 text-white shadow-3xl relative overflow-hidden group border border-transparent dark:border-white/5">
             <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:opacity-[0.08] transition-opacity duration-700">
               <Activity size={250} />
             </div>
             
             <div className="flex justify-between items-center mb-10 relative z-10">
               <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
                 <Zap size={24} className="text-indigo-400" /> Pitch & Resonance Tracking
               </h3>
               <div className="flex gap-4">
                 <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-indigo-400">Natural Range</div>
                 <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-emerald-400">Stable Tempo</div>
               </div>
             </div>

             <div className="h-40 flex items-end gap-1.5 px-4 relative z-10">
                {Array.from({ length: 60 }).map((_, i) => (
                  <motion.div 
                    key={i}
                    initial={{ height: "10%" }}
                    animate={{ height: `${Math.random() * 70 + 10}%` }}
                    transition={{ repeat: Infinity, duration: 2, delay: i * 0.03, ease: "easeInOut" }}
                    className="flex-1 bg-gradient-to-t from-indigo-600 via-indigo-400 to-indigo-300 rounded-full opacity-30 group-hover:opacity-60 transition-opacity"
                  />
                ))}
             </div>
             
             <div className="grid grid-cols-3 mt-10 border-t border-white/5 pt-10 relative z-10">
                <div className="text-center">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Pace</p>
                  <p className="text-xl font-bold">142 WPM</p>
                </div>
                <div className="text-center border-x border-white/5">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Clarity</p>
                  <p className="text-xl font-bold">96.4%</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Volume</p>
                  <p className="text-xl font-bold">Stable</p>
                </div>
             </div>
          </div>
        </div>

        {/* Sidebar Analysis Area */}
        <div className="xl:col-span-4 space-y-8">
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-[3rem] p-10 shadow-sm"
          >
            <h3 className="text-2xl font-black mb-10 flex items-center gap-3 text-slate-900 dark:text-white">
              <Sparkles size={24} className="text-indigo-600 dark:text-indigo-400" /> Live Assessment
            </h3>
            
            <div className="space-y-12">
              <ScoreRow label="Pronunciation" score={94} color="bg-emerald-500" />
              <ScoreRow label="Natural Fluency" score={82} color="bg-indigo-500" />
              <ScoreRow label="Grammar Depth" score={76} color="bg-amber-500" />
            </div>

            <div className="mt-16 pt-10 border-t border-slate-50 dark:border-white/5 space-y-8">
                <div className="flex justify-between items-center">
                 <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Emotion Recognition</h4>
                 <Info size={14} className="text-slate-300 dark:text-slate-700" />
               </div>
               <motion.div 
                 whileHover={{ scale: 1.05 }}
                 className="flex items-center gap-6 bg-slate-50 dark:bg-white/5 p-6 rounded-[2rem] border border-slate-100 dark:border-white/10 transition-all cursor-pointer"
               >
                 <div className="h-16 w-16 rounded-[1.5rem] bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-50 dark:shadow-none">
                   <Smile size={32} />
                 </div>
                 <div>
                   <p className="text-lg font-bold text-slate-900 dark:text-white leading-tight">Confident & Engaging</p>
                   <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Tone is ideal for executive discussions.</p>
                 </div>
               </motion.div>
            </div>
          </motion.div>

          <div className="bg-indigo-600 rounded-[3rem] p-12 text-white shadow-3xl shadow-indigo-100 dark:shadow-none relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-700">
              <Zap size={120} />
            </div>
            
            <h3 className="text-2xl font-black mb-8 relative z-10">Critical Targets</h3>
            <div className="space-y-6 relative z-10">
              {['Fiscal Policy', 'Paradigm Shift', 'Incentivize'].map(word => (
                <motion.div 
                  key={word} 
                  whileHover={{ x: 10 }}
                  className="flex items-center justify-between group/word cursor-pointer p-2 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <span className="text-xl font-bold opacity-90 group-hover/word:opacity-100">{word}</span>
                  <div className="h-10 w-10 rounded-2xl bg-white/10 flex items-center justify-center group-hover/word:bg-white/20 transition-all border border-white/10">
                    <ArrowRight size={20} />
                  </div>
                </motion.div>
              ))}
            </div>
            <button className="w-full mt-12 py-5 bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-2">
              Sync to Study Deck <Sparkles size={16} fill="currentColor" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScoreRow({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{label}</span>
        <span className="text-xs font-bold text-slate-900 dark:text-white">{score}%</span>
      </div>
      <div className="h-1.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={cn("h-full rounded-full", color)} 
        />
      </div>
    </div>
  );
}

