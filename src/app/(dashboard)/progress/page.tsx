"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Target, 
  Award, 
  Clock, 
  Activity,
  Zap,
  Mic2,
  Headphones,
  PenTool,
  BookOpen,
  Flame,
  ArrowUpRight,
  Sparkles,
  Layers
} from "lucide-react";
import { ProfileShareCard } from "@/components/ProfileShareCard";
import { cn } from "@/lib/utils";

export default function ProgressPage() {
  const [isShareOpen, setIsShareOpen] = React.useState(false);

  return (
    <div className="space-y-12 w-full pb-20">
      <ProfileShareCard isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
      
      {/* Header Section */}
      <section className="grid grid-cols-1 lg:grid-cols-[1fr_auto] items-end gap-6 w-full border-b border-slate-100 dark:border-white/5 pb-10">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-3">
             <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-bold uppercase tracking-widest">Active Growth</span>
             <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Data Verified</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">Fluency Analytics</h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 lg:justify-self-end">
          <button className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 px-5 py-3 rounded-2xl text-[10px] md:text-xs font-bold uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-white/10 transition-all flex items-center gap-2">
            <Calendar size={14} /> Last 30 Days
          </button>
          <button 
            onClick={() => setIsShareOpen(true)}
            className="primary-gradient text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-xl shadow-indigo-100 dark:shadow-none active:scale-95 transition-all flex items-center gap-3"
          >
            <Sparkles size={18} /> Share My Card
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 w-full">
        
        {/* Main CEFR Chart Card (8 cols) */}
        <div className="md:col-span-8 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-[3rem] p-10 md:p-12 shadow-sm flex flex-col h-[550px] w-full group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-[0.02] dark:opacity-[0.05] pointer-events-none group-hover:scale-110 transition-transform duration-1000 text-slate-900 dark:text-white">
             <BarChart3 size={350} />
          </div>

          <div className="flex justify-between items-start mb-12 relative z-10">
            <div>
              <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">CEFR Progression</h3>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-1">Skill Mastery Over Time</p>
            </div>
            <div className="flex gap-6">
              <LegendItem label="Speaking" color="bg-indigo-500" />
              <LegendItem label="Listening" color="bg-orange-500" />
            </div>
          </div>

          <div className="flex-1 flex items-end gap-3 md:gap-4 pb-4 px-2 relative z-10">
            {[35, 45, 40, 60, 75, 78, 85, 82, 90, 88, 92, 95].map((val, i) => (
              <div key={i} className="flex-1 group/bar relative flex flex-col items-center gap-3">
                  <div className="absolute -top-8 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-bold px-2 py-1 rounded-md">
                   {val}%
                </div>
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${val}%` }}
                  transition={{ duration: 1, delay: i * 0.05 }}
                  className="w-full bg-slate-50 dark:bg-white/5 rounded-t-xl group-hover/bar:bg-indigo-50 dark:group-hover/bar:bg-white/10 transition-colors relative"
                >
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${val * 0.7}%` }}
                    transition={{ duration: 1, delay: i * 0.05 + 0.2 }}
                    className="absolute bottom-0 w-full primary-gradient rounded-t-xl shadow-lg shadow-indigo-100 dark:shadow-none" 
                  />
                </motion.div>
                <span className="text-[8px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-tighter">W{i + 1}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-8 pt-8 border-t border-slate-50 dark:border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 relative z-10">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              You are currently <span className="text-indigo-600 dark:text-indigo-400 font-bold">12% faster</span> than the average learner.
            </p>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-full">
                  <TrendingUp size={14} /> +4.2% Growth
               </div>
               <div className="flex items-center gap-2 text-indigo-500 font-bold text-xs bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1.5 rounded-full">
                  <Activity size={14} /> High Velocity
               </div>
            </div>
          </div>
        </div>

        {/* Skill Breakdown Card (4 cols) */}
        <div className="md:col-span-4 bg-slate-900 rounded-[3rem] p-10 md:p-12 shadow-2xl shadow-slate-200 flex flex-col justify-between w-full text-white relative overflow-hidden">
           <div className="absolute bottom-0 left-0 p-12 opacity-[0.05] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
              <Layers size={250} />
           </div>
           
           <div className="relative z-10">
             <h3 className="text-2xl font-black tracking-tight mb-2 text-white">Skill Balance</h3>
             <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Holistic Fluency Score</p>
           </div>
           
           <div className="space-y-10 my-12 relative z-10">
              <SkillProgressDark icon={<Mic2 size={16} />} label="Speaking" score={72} color="bg-indigo-400" />
              <SkillProgressDark icon={<Headphones size={16} />} label="Listening" score={88} color="bg-orange-400" />
              <SkillProgressDark icon={<PenTool size={16} />} label="Writing" score={64} color="bg-blue-400" />
              <SkillProgressDark icon={<BookOpen size={16} />} label="Reading" score={94} color="bg-emerald-400" />
           </div>

           <div className="p-6 bg-white/5 rounded-3xl border border-white/10 relative z-10 backdrop-blur-xl">
             <div className="flex items-center gap-2 text-indigo-400 mb-3">
               <Target size={18} />
               <span className="text-[10px] font-bold uppercase tracking-widest">Primary Objective</span>
             </div>
             <p className="text-sm font-bold text-white leading-tight">C1 Advanced Certification</p>
             <p className="text-[10px] text-white/50 mt-2 font-medium">Estimated arrival in <span className="text-white font-bold">42 days</span></p>
           </div>
        </div>

        {/* Overall Fluency Hero (12 cols) */}
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="md:col-span-12 bg-indigo-600 rounded-[3.5rem] p-12 md:p-16 text-white relative overflow-hidden group shadow-2xl shadow-indigo-100 dark:shadow-none w-full"
         >
           <div className="absolute top-0 right-0 p-16 opacity-[0.08] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
             <Sparkles size={400} />
           </div>
           
           <div className="relative z-10 flex flex-col lg:flex-row justify-between gap-16 w-full items-center">
             <div className="flex-1 min-w-0">
               <div className="flex items-center gap-3 mb-8">
                 <div className="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/10">
                    <Award size={24} className="text-emerald-300" />
                 </div>
                 <span className="text-xs font-bold uppercase tracking-[0.3em] opacity-80 text-indigo-100">Milestone Achievement</span>
               </div>
               <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-6 leading-tight">You're evolving <br/>into a <span className="text-emerald-300 italic">native speaker.</span></h2>
               <p className="text-indigo-100/80 text-xl leading-relaxed max-w-2xl font-medium">
                 Your speaking confidence has increased by 14% this month. At this rate, you'll reach 
                 <span className="font-bold text-white underline underline-offset-8 decoration-emerald-400/50"> C1 Advanced</span> proficiency by late October.
               </p>
             </div>
             
             <div className="flex flex-col justify-center gap-6 w-full lg:w-96 flex-shrink-0">
               <div className="bg-white/10 backdrop-blur-2xl rounded-[2.5rem] p-10 border border-white/10 shadow-2xl">
                 <div className="flex justify-between items-center mb-4">
                   <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Learning Velocity</span>
                   <span className="text-xs font-bold text-emerald-300">+18%</span>
                 </div>
                 <div className="text-4xl font-black mb-6 tracking-tighter">Ultra Fast</div>
                 <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
                   <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "85%" }}
                      transition={{ duration: 2, ease: "easeOut" }}
                      className="h-full bg-emerald-400 rounded-full shadow-[0_0_20px_rgba(52,211,153,0.5)]" 
                   />
                 </div>
                 <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-4 text-center">Top 2% of Global Learners</p>
               </div>
             </div>
           </div>
         </motion.div>

        {/* Heatmap & Calendar Analysis (12 cols) */}
        <div className="md:col-span-12 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-[3rem] p-10 md:p-12 shadow-sm w-full relative overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
            <div>
              <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Consistency Heatmap</h3>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-1">Daily Activity Visualization</p>
            </div>
            <div className="flex items-center gap-4 bg-slate-50 dark:bg-white/5 px-4 py-2 rounded-2xl border border-slate-100 dark:border-white/10">
               <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Less</span>
               <div className="flex gap-1.5">
                 <div className="h-4 w-4 rounded-[4px] bg-white dark:bg-white/10 border border-slate-100 dark:border-white/20" />
                 <div className="h-4 w-4 rounded-[4px] bg-indigo-100" />
                 <div className="h-4 w-4 rounded-[4px] bg-indigo-300" />
                 <div className="h-4 w-4 rounded-[4px] bg-indigo-500" />
                 <div className="h-4 w-4 rounded-[4px] bg-indigo-700" />
               </div>
               <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">More</span>
            </div>
          </div>

          <div className="grid grid-cols-7 md:grid-cols-[repeat(26,1fr)] gap-2.5">
             {[...Array(182)].map((_, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.002 }}
                  className={cn(
                    "aspect-square rounded-[4px] transition-all cursor-pointer hover:ring-2 hover:ring-indigo-300 hover:scale-125 relative z-10",
                    i % 15 === 0 ? "bg-indigo-700" : 
                    i % 7 === 0 ? "bg-indigo-500" : 
                    i % 3 === 0 ? "bg-indigo-300" : i % 2 === 0 ? "bg-indigo-100" : "bg-slate-50 dark:bg-white/5"
                  )}
                  title={`Day ${i}: Activity Level ${i % 5}`}
                />
             ))}
          </div>
          
          <div className="flex justify-between mt-8 text-[10px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-[0.3em] px-2">
            <span>January</span>
            <span>February</span>
            <span>March</span>
            <span>April</span>
            <span>May</span>
            <span>June</span>
          </div>
        </div>

      </div>
    </div>
  );
}

function LegendItem({ label, color }: { label: string; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={cn("h-3 w-3 rounded-full", color)} />
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
    </div>
  );
}

function SkillProgressDark({ icon, label, score, color }: { icon: React.ReactNode; label: string; score: number; color: string }) {
  return (
    <div className="space-y-3 group cursor-pointer">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3 text-white/80 font-bold text-sm group-hover:text-white transition-colors">
          <div className={cn("h-8 w-8 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 group-hover:border-white/20", color.replace('bg-', 'text-'))}>
             {icon}
          </div>
          <span>{label}</span>
        </div>
        <span className={cn("text-xs font-black", color.replace('bg-', 'text-'))}>{score}%</span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={cn("h-full rounded-full shadow-[0_0_15px_rgba(255,255,255,0.1)]", color)} 
        />
      </div>
    </div>
  );
}

function BadgeCard({ icon, label, date }: { icon: React.ReactNode; label: string; date: string }) {
  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.02 }}
      className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm flex flex-col items-center text-center group w-full transition-all hover:shadow-xl hover:shadow-indigo-100/20"
    >
      <div className="h-24 w-24 rounded-full bg-slate-50 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-indigo-50 transition-all duration-500 relative">
        <div className="absolute inset-0 rounded-full border-2 border-dashed border-indigo-100 group-hover:rotate-180 transition-transform duration-1000 opacity-0 group-hover:opacity-100" />
        {React.cloneElement(icon as any, { size: 48 })}
      </div>
      <h4 className="text-lg font-black text-slate-900 mb-2">{label}</h4>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{date}</p>
    </motion.div>
  );
}
