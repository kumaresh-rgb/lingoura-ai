"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Flame, 
  TrendingUp, 
  Clock, 
  Languages, 
  CheckCircle2, 
  MessageSquare, 
  Sparkles,
  ArrowRight,
  BrainCircuit,
  Zap,
  Play,
  Activity,
  ArrowUpRight,
  Globe
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  return (
    <div className="space-y-12 pb-20">
      {/* Hero Greeting & Quick Stats */}
      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-slate-100 dark:border-white/5 pb-12">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-3">
             <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-bold uppercase tracking-widest">Active Member</span>
             <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">May 2026</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            Welcome back, <span className="text-indigo-600 dark:text-indigo-400">Alex.</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-4 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
            You've mastered 42 new idioms this week. Ready to tackle <span className="text-slate-900 dark:text-white font-bold underline decoration-indigo-300 dark:decoration-indigo-500/50 underline-offset-8">Advanced Negotiation</span> today?
          </p>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="h-16 w-16 rounded-[2rem] bg-slate-900 dark:bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-slate-200 dark:shadow-none">
              <Flame size={28} className="text-orange-500 fill-orange-500" />
           </div>
           <div>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Daily Streak</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">12 Days</p>
           </div>
        </div>
      </section>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 w-full">
        
        {/* Main Performance Analytics (8 cols) */}
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="md:col-span-8 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-[3rem] p-10 md:p-12 shadow-sm relative overflow-hidden group backdrop-blur-xl"
        >
          <div className="absolute top-0 right-0 p-12 opacity-[0.02] dark:opacity-[0.05] pointer-events-none group-hover:scale-110 transition-transform duration-1000 text-slate-900 dark:text-white">
             <Activity size={350} />
          </div>

          <div className="flex justify-between items-start mb-12 relative z-10">
            <div>
              <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">CEFR Progress</h3>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-1">Holistic Leveling Analysis</p>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-4 py-2 rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
               <TrendingUp size={14} /> +4.2% Growth
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
             <div className="md:col-span-2">
                <div className="flex items-end gap-3 h-48 mb-6">
                   {[40, 55, 45, 70, 85, 78, 92].map((h, i) => (
                      <div key={i} className="flex-1 bg-slate-50 dark:bg-white/5 rounded-t-2xl relative overflow-hidden group/bar">
                         <motion.div 
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            className="absolute bottom-0 w-full primary-gradient rounded-t-2xl shadow-lg shadow-indigo-100 dark:shadow-none"
                         />
                         <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-bold px-2 py-1 rounded-md">
                            {h}%
                         </div>
                      </div>
                   ))}
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest px-2">
                   <span>Mon</span>
                   <span>Wed</span>
                   <span>Fri</span>
                   <span>Sun</span>
                </div>
             </div>

             <div className="space-y-6">
                <MiniStat label="Speaking" value="B2" percent={78} />
                <MiniStat label="Listening" value="C1" percent={92} />
                <MiniStat label="Writing" value="B2" percent={64} />
             </div>
          </div>
        </motion.div>

        {/* Quick Insights (4 cols) */}
        <div className="md:col-span-4 grid grid-cols-1 gap-8">
           <motion.div 
             whileHover={{ y: -5 }}
             className="bg-indigo-600 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-indigo-100 dark:shadow-none relative overflow-hidden group"
           >
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-500">
                 <Languages size={150} />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2">Vocabulary Depth</p>
              <p className="text-4xl font-black tracking-tight">1,240</p>
              <p className="text-sm font-medium opacity-60 mt-2">Active Words Mastered</p>
              <button className="mt-8 flex items-center gap-2 text-xs font-bold bg-white/20 hover:bg-white/30 transition-all px-4 py-2.5 rounded-xl border border-white/10 backdrop-blur-md">
                 Review Now <ArrowRight size={14} />
              </button>
           </motion.div>

           <motion.div 
             whileHover={{ y: -5 }}
             className="bg-slate-900 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-slate-200 dark:shadow-none relative overflow-hidden group backdrop-blur-xl"
           >
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                 <Clock size={150} />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-2">Learning Velocity</p>
              <p className="text-4xl font-black tracking-tight text-indigo-400 dark:text-indigo-400">42h</p>
              <p className="text-sm font-medium opacity-40 mt-2">Total Dedicated Time</p>
              <div className="mt-8 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                 <TrendingUp size={12} /> +15% this week
              </div>
           </motion.div>
        </div>

        {/* Active Learning Path (8 cols) */}
        <div className="md:col-span-8 space-y-8">
           <div className="flex items-center justify-between px-2">
              <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Learning Path</h2>
              <Link href="/lessons" className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest hover:underline flex items-center gap-2">
                 View Curriculum <ArrowUpRight size={16} />
              </Link>
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <PathCard 
                 title="Advanced Negotiation"
                 module="Module 4: Handling Objections"
                 progress={65}
                 image="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=400&q=80"
                 status="Active"
              />
              <PathCard 
                 title="The Subjunctive Mood"
                 module="Module 2: Hypotheses & Regrets"
                 progress={15}
                 image="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=400&q=80"
                 status="Up Next"
              />
           </div>
        </div>

        {/* AI Recommendations & Trends (4 cols) */}
        <div className="md:col-span-4 space-y-8">
           <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white px-2">AI Insights</h2>
           <div className="bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-[3rem] p-10 shadow-sm space-y-8 backdrop-blur-xl">
              <ActivityItem 
                 icon={<Sparkles size={18} />} 
                 title="Pattern Unlocked" 
                 desc="Refined use of passive voice." 
                 color="text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-500/10"
              />
              <ActivityItem 
                 icon={<CheckCircle2 size={18} />} 
                 title="Unit Mastered" 
                 desc="Modal Verbs: 95% Accuracy" 
                 color="text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10"
              />
              <div className="pt-6 border-t border-slate-50 dark:border-white/5">
                 <button className="w-full bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-900 dark:text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all">
                    View Growth Report
                 </button>
              </div>
           </div>

           <div className="bg-indigo-50/50 dark:bg-indigo-500/5 rounded-[3rem] p-10 border border-indigo-100/50 dark:border-indigo-500/10 relative overflow-hidden group backdrop-blur-xl">
              <div className="relative z-10">
                 <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <BrainCircuit size={14} /> AI Recommendation
                 </p>
                 <h4 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">Focus on formal tone for business emails.</h4>
                 <button className="mt-6 text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 hover:translate-x-1 transition-transform">
                    Start Session <ArrowRight size={14} />
                 </button>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}

function MiniStat({ label, value, percent }: { label: string; value: string; percent: number }) {
  return (
    <div className="space-y-2">
       <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          <span>{label}</span>
          <span className="text-slate-900 dark:text-white">{value}</span>
       </div>
       <div className="h-1.5 w-full bg-slate-50 dark:bg-white/5 rounded-full overflow-hidden border border-slate-100 dark:border-white/5">
          <motion.div 
             initial={{ width: 0 }}
             animate={{ width: `${percent}%` }}
             className="h-full bg-indigo-500 rounded-full"
          />
       </div>
    </div>
  );
}

function PathCard({ title, module, progress, image, status }: { title: string; module: string; progress: number; image: string; status: string }) {
  return (
    <motion.div 
       whileHover={{ y: -8 }}
       className="group cursor-pointer bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-[2.5rem] p-6 shadow-sm hover:shadow-xl dark:shadow-none transition-all duration-500 backdrop-blur-xl"
    >
       <div className="h-44 w-full rounded-3xl overflow-hidden mb-6 relative">
          <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
          <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors" />
          <div className={cn(
             "absolute top-4 left-4 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest backdrop-blur-md border border-white/20 shadow-xl",
             status === "Active" ? "bg-white text-indigo-600" : "bg-black/50 text-white"
          )}>
             {status}
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-center translate-y-full group-hover:translate-y-0 transition-transform">
             <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center text-indigo-600 shadow-2xl scale-0 group-hover:scale-100 transition-transform delay-100">
                <Play size={20} fill="currentColor" />
             </div>
          </div>
       </div>
       <h4 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{title}</h4>
       <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">{module}</p>
       <div className="mt-8 flex items-center gap-4">
          <div className="flex-1 h-1.5 bg-slate-50 dark:bg-white/5 rounded-full overflow-hidden border border-slate-100 dark:border-white/5">
             <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: `${progress}%` }}
                className="h-full primary-gradient rounded-full"
             />
          </div>
          <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400">{progress}%</span>
       </div>
    </motion.div>
  );
}

function ActivityItem({ icon, title, desc, color }: { icon: React.ReactNode; title: string; desc: string; color: string }) {
  return (
    <div className="flex gap-5 group cursor-default">
       <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 shadow-sm", color)}>
          {icon}
       </div>
       <div className="flex flex-col justify-center">
          <p className="text-sm font-black text-slate-900 dark:text-white leading-tight">{title}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium">{desc}</p>
       </div>
    </div>
  );
}
