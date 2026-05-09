"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  PenTool, 
  Sparkles, 
  Send, 
  Image as ImageIcon, 
  FileText, 
  Mail, 
  AlignLeft,
  CheckCircle2,
  Zap,
  BarChart3,
  MessageSquare,
  ArrowRight,
  Info,
  ShieldCheck,
  Target,
  Trophy,
  History
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function WritingPage() {
  const [taskType, setTaskType] = useState<"select" | "active" | "feedback">("select");
  const [text, setText] = useState("");

  return (
    <div className="space-y-12 max-w-[1400px] mx-auto">
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">Writing Workshop</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-4 text-lg font-medium max-w-2xl leading-relaxed">
            Craft perfect emails, reports, and essays with real-time AI guidance and structural analysis.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10 transition-all font-bold shadow-sm flex items-center gap-2">
            <History size={18} /> Past Drafts
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        
        {/* Left Side: Writing Canvas */}
        <div className="xl:col-span-8 flex flex-col bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-[3rem] shadow-[0_20px_50px_-20px_rgba(93,95,239,0.05)] overflow-hidden min-h-[700px] group">
          
          {/* Header */}
          <div className="px-8 md:px-12 py-8 border-b border-slate-100 dark:border-white/5 flex flex-col sm:flex-row justify-between items-center bg-slate-50/50 dark:bg-white/5 gap-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl primary-gradient flex items-center justify-center text-white shadow-lg shadow-indigo-100 dark:shadow-none">
                <PenTool size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">Formal Project Proposal</h2>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest mt-1">B2 Upper Intermediate • Professional</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
               <div className="flex flex-col items-end">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{text.split(/\s+/).filter(x => x).length} words</span>
                 <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">3m Reading Time</span>
               </div>
               <button 
                 onClick={() => setTaskType("feedback")}
                 className="primary-gradient text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-200 flex items-center gap-3 active:scale-95 transition-all"
               >
                 Review Draft <Send size={16} />
               </button>
            </div>
          </div>

          {/* Prompt Section */}
          <div className="p-8 md:p-12 border-b border-slate-50 dark:border-white/5 bg-indigo-50/20 dark:bg-indigo-500/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-700">
              <Sparkles size={80} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400 mb-6 bg-white dark:bg-white/10 w-fit px-4 py-1.5 rounded-full border border-indigo-100 dark:border-white/10 shadow-sm relative z-10">
              <Sparkles size={16} fill="currentColor" />
              <span className="text-[10px] font-black uppercase tracking-widest">AI Composition Challenge</span>
            </div>
            <h3 className="text-xl md:text-2xl font-black text-slate-800 dark:text-slate-200 leading-relaxed relative z-10">
              Compose a persuasive proposal to a senior stakeholder advocating for a <span className="text-indigo-600 dark:text-indigo-400 underline decoration-indigo-200 dark:decoration-indigo-500/30 decoration-4 underline-offset-4">flexible work pilot program</span>. Address potential concerns about productivity and team culture.
            </h3>
          </div>

          {/* Editor Area */}
          <div className="flex-1 p-8 md:p-12 relative">
            <textarea 
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Start your masterpiece here..."
              className="w-full h-full text-xl text-slate-700 dark:text-slate-300 leading-[2] placeholder:text-slate-300 dark:placeholder:text-slate-600 resize-none border-none focus:ring-0 outline-none font-medium scrollbar-hide bg-transparent"
            />
            
            {/* Formatting Bar Floating */}
            <div className="absolute bottom-10 right-10 flex gap-2 bg-white/80 dark:bg-white/10 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-2 rounded-2xl shadow-2xl">
               <button className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-slate-50 dark:hover:bg-white/10 text-slate-400 hover:text-indigo-600 transition-all font-black">B</button>
               <button className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-slate-50 dark:hover:bg-white/10 text-slate-400 hover:text-indigo-600 transition-all italic">I</button>
               <button className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-slate-50 dark:hover:bg-white/10 text-slate-400 hover:text-indigo-600 transition-all"><AlignLeft size={18} /></button>
            </div>
          </div>
        </div>

        {/* Right Side: Feedback & Stats */}
        <div className="xl:col-span-4 space-y-8">
          
          {/* Quick Analysis Panel */}
          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-[3rem] p-10 shadow-sm flex flex-col gap-10">
             <h3 className="text-2xl font-black flex items-center gap-3 text-slate-900 dark:text-white">
               <Zap size={24} className="text-orange-500" /> Real-time Quality
             </h3>

             <div className="grid grid-cols-2 gap-8">
                <MetricBox label="Tone Profile" value="Persuasive" icon={<Target size={16} />} color="text-indigo-600 dark:text-indigo-400" />
                <MetricBox label="Clarity Index" value="Optimal" icon={<CheckCircle2 size={16} />} color="text-emerald-500 dark:text-emerald-400" />
                <MetricBox label="Plagiarism" value="0% Check" icon={<ShieldCheck size={16} />} color="text-emerald-500 dark:text-emerald-400" />
                <MetricBox label="AI Originality" value="100% User" icon={<Sparkles size={16} />} color="text-indigo-600 dark:text-indigo-400" />
             </div>

             <div className="space-y-6">
                <div className="flex justify-between items-center text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  <span>Draft Grade</span>
                  <span className="text-indigo-600 dark:text-indigo-400">B+ (88/100)</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: "88%" }}
                     transition={{ duration: 1.5, ease: "easeOut" }}
                     className="h-full primary-gradient rounded-full"
                   />
                </div>
             </div>

             <motion.div 
               whileHover={{ scale: 1.02 }}
               className="p-6 bg-slate-50 dark:bg-white/5 rounded-[2rem] border border-slate-100 dark:border-white/5 relative group cursor-help"
             >
               <div className="absolute top-4 right-4 text-indigo-400 opacity-50 group-hover:opacity-100 transition-opacity">
                 <Info size={16} />
               </div>
               <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">AI Coach Insight</h4>
               <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed italic">
                 &quot;Your opening is strong, but consider adding a specific data point about remote productivity to bolster your persuasive tone.&quot;
               </p>
             </motion.div>
          </div>

          {/* Advanced Insights / Structural Analysis */}
          <div className="bg-slate-900 dark:bg-white/5 rounded-[3rem] p-10 text-white shadow-3xl flex flex-col relative overflow-hidden group border border-transparent dark:border-white/5">
            <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:opacity-20 transition-opacity duration-700">
               <BarChart3 size={200} />
            </div>
            
            <div className="flex justify-between items-center mb-10 relative z-10">
              <h3 className="text-xl font-black flex items-center gap-3">
                <Trophy size={24} className="text-amber-400" /> Structural Mastery
              </h3>
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest px-3 py-1 bg-white/5 rounded-full border border-white/10">Elite Analysis</span>
            </div>

            <div className="space-y-8 relative z-10">
              <InsightCard 
                title="Lexical Diversity" 
                desc="You are using a rich variety of business-specific terminology. Excellent usage of 'advocating' and 'productivity'." 
                score={92} 
                color="bg-emerald-500"
                dark
              />
              <InsightCard 
                title="Syntactic Variation" 
                desc="Try to mix your sentence lengths. Currently, most sentences are between 15-20 words, which can feel repetitive." 
                score={58} 
                color="bg-indigo-500"
                dark
              />
              <InsightCard 
                title="Logical Cohesion" 
                desc="Your transition between the intro and body is smooth. Ensure the closing call-to-action is just as crisp." 
                score={85} 
                color="bg-amber-500"
                dark
              />
            </div>

            <button className="mt-12 w-full py-5 bg-white dark:bg-indigo-600 text-slate-900 dark:text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 dark:hover:bg-indigo-700 transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-2 relative z-10">
              Generate AI Polish <Sparkles size={16} fill="currentColor" className="text-indigo-600 dark:text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricBox({ label, value, icon, color }: { label: string; value: string; icon: React.ReactNode; color?: string }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        {icon} {label}
      </div>
      <p className={cn("text-sm font-extrabold", color || "text-slate-900 dark:text-white")}>{value}</p>
    </div>
  );
}

function InsightCard({ title, desc, score, color, dark }: { title: string; desc: string; score: number; color?: string; dark?: boolean }) {
  return (
    <div className={cn(
      "space-y-4 p-6 rounded-[2rem] border transition-all duration-300",
      dark ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-slate-50/30 border-slate-100 hover:border-indigo-100"
    )}>
      <div className="flex justify-between items-center">
        <h4 className={cn("text-xs font-black uppercase tracking-widest", dark ? "text-white" : "text-slate-900")}>{title}</h4>
        <span className={cn("text-[10px] font-black", dark ? "text-indigo-400" : "text-indigo-600")}>{score}%</span>
      </div>
      <div className={cn("h-1 rounded-full overflow-hidden", dark ? "bg-white/10" : "bg-slate-100")}>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className={cn("h-full rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]", color || "bg-indigo-500")} 
        />
      </div>
      <p className={cn("text-[10px] leading-relaxed font-bold", dark ? "text-slate-400" : "text-slate-500")}>
        {desc}
      </p>
    </div>
  );
}
