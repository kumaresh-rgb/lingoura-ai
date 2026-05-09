"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  History, 
  BrainCircuit, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Zap,
  Clock,
  Headphones,
  PenTool,
  Mic2,
  BarChart3,
  Calendar,
  ChevronRight,
  MessageSquare,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function DailyReviewPage() {
  return (
    <div className="space-y-10 w-full pb-20">
      {/* Header Section */}
      <section className="grid grid-cols-1 lg:grid-cols-[1fr_auto] items-end gap-6 w-full border-b border-slate-100 dark:border-white/5 pb-10">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-3">
             <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-bold uppercase tracking-widest">Retention Engine</span>
             <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />
             <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Active Learning</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">Daily Performance Review</h1>
        </div>
        
        <div className="flex items-center gap-6">
           <div className="text-right hidden sm:block">
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Current Streak</p>
              <div className="flex items-center gap-2 justify-end">
                 <span className="text-2xl font-black text-slate-900 dark:text-white">12 Days</span>
                 <Zap size={20} className="text-orange-500 fill-orange-500" />
              </div>
           </div>
           <button className="primary-gradient text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-xl shadow-indigo-100 dark:shadow-none active:scale-95 transition-all">
             Start Review Session
           </button>
        </div>
      </section>

      {/* Hero Intelligence Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900 dark:bg-white/5 rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden group shadow-2xl shadow-slate-200 dark:shadow-none border border-transparent dark:border-white/5"
      >
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
          <BrainCircuit size={400} />
        </div>
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 space-y-8">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/10">
                <Sparkles size={24} className="text-indigo-400" />
              </div>
              <span className="text-sm font-bold uppercase tracking-[0.3em] opacity-60">AI Intelligence Summary</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter leading-[1.1]">
              Your memory is <span className="text-indigo-400 italic">peak</span> today.
            </h2>
            
            <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-2xl font-medium">
              You've successfully retained <span className="text-white font-bold">85%</span> of the concepts from the last 7 days. Today, we'll focus on stabilizing your <span className="text-indigo-300 underline decoration-indigo-300/30 underline-offset-8">Business Negotiation</span> vocabulary.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
               <StatItem label="Retention Score" value="94%" trend="+2.1%" />
               <StatItem label="Review Load" value="24 Words" trend="-4" />
               <StatItem label="Estimated Time" value="12 Min" trend="Optimal" />
            </div>
          </div>

          <div className="lg:col-span-5">
             <div className="bg-white/5 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/10 space-y-8">
                <h4 className="text-xs font-bold uppercase tracking-widest opacity-40">Today&apos;s Weak Spots</h4>
                <div className="space-y-4">
                   <WeakSpot icon={<PenTool size={16} />} label="Conditional Mood" impact="High" />
                   <WeakSpot icon={<Headphones size={16} />} label="Fast Native Speed" impact="Medium" />
                   <WeakSpot icon={<Mic2 size={16} />} label="Vowel Neutralization" impact="Critical" />
                </div>
                <button className="w-full bg-white text-slate-900 py-4 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
                   Target These Now <ChevronRight size={18} />
                </button>
             </div>
          </div>
        </div>
      </motion.div>

      {/* Performance Distribution Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {/* Listening Review */}
         <ReviewModule 
            icon={<Headphones className="text-blue-500" />}
            title="Listening Intelligence"
            description="Overall review of today's listening comprehension across 4 modules."
            stats={{ score: "88%", level: "Advanced" }}
            color="bg-blue-50 dark:bg-blue-500/10"
         />
         
         {/* Writing Review */}
         <ReviewModule 
            icon={<PenTool className="text-emerald-500" />}
            title="Writing Coherence"
            description="Analysis of your formal tone and grammatical precision in today's essays."
            stats={{ score: "76%", level: "Improving" }}
            color="bg-emerald-50 dark:bg-emerald-500/10"
         />

         {/* Retention Graph Widget */}
         <div className="bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-[2.5rem] p-8 shadow-sm flex flex-col justify-between group">
            <div className="flex justify-between items-start mb-6">
               <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">Retention Velocity</h3>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Last 24 Hours</p>
               </div>
               <Activity size={20} className="text-indigo-500 dark:text-indigo-400" />
            </div>
            
            <div className="flex-1 flex items-end gap-2 px-2 h-32 mb-6">
               {[40, 65, 45, 80, 55, 90, 75].map((h, i) => (
                  <div key={i} className="flex-1 bg-slate-50 dark:bg-white/5 rounded-t-lg relative overflow-hidden group-hover:bg-indigo-50/50 dark:group-hover:bg-white/10 transition-colors">
                     <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        className="absolute bottom-0 w-full bg-indigo-500 dark:bg-indigo-400 opacity-20"
                     />
                     <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${h * 0.6}%` }}
                        className="absolute bottom-0 w-full primary-gradient rounded-t-sm"
                     />
                  </div>
               ))}
            </div>
            
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest">
               <span>Mon</span>
               <span>Wed</span>
               <span>Sun</span>
            </div>
         </div>
      </div>

      {/* Detailed Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
         {/* Critical Correction Stream */}
         <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between px-2">
               <h3 className="text-xl font-bold flex items-center gap-3 text-slate-900 dark:text-white">
                  <CheckCircle2 size={24} className="text-indigo-600 dark:text-indigo-400" /> Grammar Correction Log
               </h3>
               <button className="text-xs font-bold text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors uppercase tracking-widest">View Detailed Log</button>
            </div>
            
            <div className="space-y-4">
               <CorrectionLogItem 
                  wrong="I have been to London since two years."
                  correct="I have been in London for two years."
                  concept="Prepositions of Duration"
                  frequency="3 times today"
               />
               <CorrectionLogItem 
                  wrong="The data suggest that..."
                  correct="The data suggests that..."
                  concept="Subject-Verb Agreement"
                  frequency="Recurring"
               />
            </div>
         </div>

         {/* Mastery Pulse Widget */}
         <div className="lg:col-span-4 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-[2.5rem] p-8 shadow-sm flex flex-col justify-between">
            <div>
               <h3 className="text-lg font-bold mb-6 text-slate-900 dark:text-white">Mastery Distribution</h3>
               <div className="space-y-6">
                  <MasteryBar label="Formal Vocabulary" percent={92} color="bg-indigo-500" />
                  <MasteryBar label="Casual Phrasal Verbs" percent={64} color="bg-orange-500" />
                  <MasteryBar label="Technical Writing" percent={78} color="bg-blue-500" />
                  <MasteryBar label="Idiomatic Expressions" percent={45} color="bg-rose-500" />
               </div>
            </div>
            
            <div className="mt-10 p-6 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 flex items-center gap-4">
               <div className="h-12 w-12 rounded-xl primary-gradient flex items-center justify-center text-white shadow-lg dark:shadow-none">
                  <Zap size={20} />
               </div>
               <div>
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">AI Prediction</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">C1 expected in 14 days</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

function StatItem({ label, value, trend }: { label: string; value: string; trend: string }) {
  return (
    <div className="bg-white/5 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/5">
      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{label}</p>
      <div className="flex items-center gap-3">
        <span className="text-xl font-bold">{value}</span>
        <span className={cn(
          "text-[10px] font-bold px-2 py-0.5 rounded-lg",
          trend.includes("+") ? "bg-emerald-500/20 text-emerald-400" : "bg-white/10 text-slate-400"
        )}>{trend}</span>
      </div>
    </div>
  );
}

function WeakSpot({ icon, label, impact }: { icon: React.ReactNode; label: string; impact: string }) {
  return (
    <div className="flex items-center justify-between group cursor-pointer">
      <div className="flex items-center gap-4">
        <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all">
          {React.cloneElement(icon as any, { size: 14 })}
        </div>
        <span className="text-sm font-medium text-slate-200">{label}</span>
      </div>
      <span className={cn(
        "text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md",
        impact === "Critical" ? "text-rose-400 bg-rose-400/10" : "text-slate-400 bg-white/5"
      )}>{impact}</span>
    </div>
  );
}

function ReviewModule({ icon, title, description, stats, color }: { icon: React.ReactNode; title: string; description: string; stats: { score: string; level: string }; color: string }) {
  return (
    <div className="bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-[2.5rem] p-8 shadow-sm flex flex-col justify-between hover:shadow-md dark:hover:shadow-none transition-all group">
      <div>
        <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center mb-6", color)}>
          {React.cloneElement(icon as any, { size: 24 })}
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">{description}</p>
      </div>
      <div className="flex justify-between items-center pt-6 border-t border-slate-50 dark:border-white/5">
         <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Score</span>
            <span className="text-xl font-black text-slate-900 dark:text-white">{stats.score}</span>
         </div>
         <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Status</span>
            <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-1">{stats.level}</p>
         </div>
      </div>
    </div>
  );
}

function CorrectionLogItem({ wrong, correct, concept, frequency }: { wrong: string; correct: string; concept: string; frequency: string }) {
  return (
    <div className="bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-3xl p-8 hover:border-indigo-100 dark:hover:border-indigo-500/30 transition-all group shadow-sm">
       <div className="flex justify-between items-start mb-6">
          <div className="px-3 py-1 bg-slate-50 dark:bg-white/10 rounded-lg text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{concept}</div>
          <span className="text-[10px] font-bold text-rose-500 dark:text-rose-400 uppercase tracking-widest flex items-center gap-1">
             <Activity size={12} /> {frequency}
          </span>
       </div>
       <div className="space-y-4">
          <div className="flex items-center gap-4 bg-rose-50/30 dark:bg-rose-500/10 p-4 rounded-xl border border-rose-50 dark:border-rose-500/20">
             <div className="h-6 w-6 rounded-full bg-rose-100 dark:bg-rose-500/30 flex items-center justify-center text-rose-500 dark:text-rose-300 text-[10px] font-bold">X</div>
             <p className="text-sm font-medium text-slate-500 dark:text-slate-400 italic">&quot;{wrong}&quot;</p>
          </div>
          <div className="flex items-center gap-4 bg-emerald-50/30 dark:bg-emerald-500/10 p-4 rounded-xl border border-emerald-50 dark:border-emerald-500/20">
             <div className="h-6 w-6 rounded-full bg-emerald-100 dark:bg-emerald-500/30 flex items-center justify-center text-emerald-500 dark:text-emerald-300 text-[10px] font-bold">✓</div>
             <p className="text-sm font-bold text-slate-900 dark:text-white">&quot;{correct}&quot;</p>
          </div>
       </div>
    </div>
  );
}

function MasteryBar({ label, percent, color }: { label: string; percent: number; color: string }) {
  return (
    <div className="space-y-2">
       <div className="flex justify-between items-center text-xs font-bold">
          <span className="text-slate-500 dark:text-slate-400 uppercase tracking-widest">{label}</span>
          <span className="text-slate-900 dark:text-white">{percent}%</span>
       </div>
       <div className="h-1.5 w-full bg-slate-50 dark:bg-white/5 rounded-full overflow-hidden border border-slate-100 dark:border-white/10">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            className={cn("h-full rounded-full", color)}
          />
       </div>
    </div>
  );
}
