"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  Clock, 
  Target, 
  Zap, 
  ArrowUpRight,
  ChevronRight,
  BookOpen,
  Mic2,
  Headphones,
  PenTool,
  Calendar,
  Sparkles,
  Award,
  BarChart3,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { ProfileShareCard } from "@/components/ProfileShareCard";
import { cn } from "@/lib/utils";

const stats = [
  { label: "Overall Band", value: "7.5", icon: Award, color: "text-indigo-600", bg: "bg-indigo-50", darkBg: "dark:bg-indigo-500/10", darkColor: "dark:text-indigo-400" },
  { label: "Study Time", value: "42h", icon: Clock, color: "text-amber-600", bg: "bg-amber-50", darkBg: "dark:bg-amber-500/10", darkColor: "dark:text-amber-400" },
  { label: "Goal Target", value: "8.5", icon: Target, color: "text-emerald-600", bg: "bg-emerald-50", darkBg: "dark:bg-emerald-500/10", darkColor: "dark:text-emerald-400" },
  { label: "Daily Streak", value: "12d", icon: Zap, color: "text-rose-600", bg: "bg-rose-50", darkBg: "dark:bg-rose-500/10", darkColor: "dark:text-rose-400" },
];

const cefrData = [
  { skill: "Listening", score: 8.0, color: "bg-indigo-500", icon: Headphones },
  { skill: "Reading", score: 7.5, color: "bg-violet-500", icon: BookOpen },
  { skill: "Speaking", score: 7.0, color: "bg-emerald-500", icon: Mic2 },
  { skill: "Writing", score: 6.5, color: "bg-rose-500", icon: PenTool },
];

const activityData = [
  { day: "Mon", score: 6.5 },
  { day: "Tue", score: 7.0 },
  { day: "Wed", score: 7.5 },
  { day: "Thu", score: 7.2 },
  { day: "Fri", score: 7.8 },
  { day: "Sat", score: 8.0 },
  { day: "Sun", score: 7.5 },
];

const recentTests = [
  { type: "Listening", name: "Section 4: Academic Lecture", score: "36/40", band: "8.0", date: "2 hours ago", status: "completed" },
  { type: "Reading", name: "Section 2: Work Environment", score: "32/40", band: "7.5", date: "Yesterday", status: "completed" },
  { type: "Writing", name: "Task 2: Global Warming Essay", score: "Pending", band: "N/A", date: "2 days ago", status: "review" },
];

export default function DashboardPage() {
  const [isShareOpen, setIsShareOpen] = React.useState(false);

  return (
    <div className="space-y-10">
      <ProfileShareCard isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
      
      {/* Welcome & Overview Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-widest">Active Member • May 2026</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-on-surface leading-tight">
            Welcome back, <span className="text-indigo-600 dark:text-indigo-400">Alex.</span>
          </h1>
          <p className="text-lg text-on-surface-variant mt-4 leading-relaxed">
            You've mastered <span className="text-indigo-600 dark:text-indigo-400 font-bold italic underline decoration-indigo-200 dark:decoration-indigo-500/30">42 new idioms</span> this week. Ready to tackle <span className="text-indigo-600 dark:text-indigo-400 font-bold italic underline decoration-indigo-200 dark:decoration-indigo-500/30">Advanced Negotiation</span> today?
          </p>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={() => setIsShareOpen(true)}
            className="px-6 py-4 bg-white dark:bg-white/5 border border-outline-variant text-on-surface rounded-2xl font-bold hover:bg-slate-50 dark:hover:bg-white/10 transition-all flex items-center gap-3 active:scale-95 group"
          >
            <Sparkles size={18} className="text-indigo-600 dark:text-indigo-400 group-hover:rotate-12 transition-transform" />
            Share Profile
          </button>
          <button className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-all flex items-center gap-2 group">
            Start Mock Test
            <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Main Stats Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-surface-container-lowest border border-outline-variant rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-4 rounded-2xl transition-colors", stat.bg, stat.darkBg, stat.color, stat.darkColor)}>
                <stat.icon size={24} />
              </div>
              <div className="flex items-center gap-1 text-emerald-500 font-bold text-sm">
                <ArrowUpRight size={16} />
                +12%
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-4xl font-black text-on-surface mt-1">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* CEFR Progress Chart - Refined */}
        <div className="lg:col-span-8 bg-surface-container-lowest border border-outline-variant rounded-[3rem] p-8 md:p-10 shadow-sm relative overflow-hidden group">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 size={18} className="text-indigo-600" />
                <h2 className="text-2xl font-black text-on-surface">IELTS Band Analysis</h2>
              </div>
              <p className="text-on-surface-variant font-medium">Holistic sectional performance overview</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5">
              <Calendar size={14} className="text-slate-400" />
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-tight">Last 30 Days</span>
              <ChevronRight size={14} className="text-slate-400" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Radar-like breakdown */}
            <div className="space-y-6">
              {cefrData.map((data) => (
                <div key={data.skill} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <data.icon size={16} className="text-on-surface-variant" />
                      <span className="text-sm font-bold text-on-surface">{data.skill}</span>
                    </div>
                    <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">{data.score} / 9.0</span>
                  </div>
                  <div className="h-3 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(data.score / 9) * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={cn("h-full rounded-full shadow-[0_0_12px_rgba(99,102,241,0.3)]", data.color)}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Visual Graph Mock */}
            <div className="relative h-64 flex items-end justify-between px-2 pt-10">
              <div className="absolute inset-0 border-b border-slate-100 dark:border-white/5 flex flex-col justify-between pointer-events-none">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-full border-t border-slate-100/50 dark:border-white/5 border-dashed" />
                ))}
              </div>
              {activityData.map((d, i) => (
                <div key={i} className="relative flex flex-col items-center group/bar w-8">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${(d.score / 9) * 100}%` }}
                    className="w-full bg-gradient-to-t from-indigo-500/20 to-indigo-500 rounded-t-lg relative group-hover/bar:from-indigo-500 group-hover/bar:to-indigo-400 transition-all duration-300"
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap">
                      Band {d.score}
                    </div>
                  </motion.div>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-4 uppercase">{d.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Intelligence Insight Card */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-100 dark:shadow-none relative overflow-hidden group">
            <Zap className="absolute -right-8 -top-8 h-32 w-32 text-white/10 group-hover:rotate-12 transition-transform duration-700" />
            <div className="relative z-10">
              <h3 className="text-2xl font-black mb-4 leading-tight">IELTS Strategy Insight</h3>
              <p className="text-indigo-100 font-medium text-sm leading-relaxed mb-8">
                "Based on your recent listening scores, you should focus on Section 4 monologues. Pay attention to academic subject markers."
              </p>
              <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-bold hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2">
                Improve Listening
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant rounded-[2.5rem] p-8 shadow-sm">
            <h3 className="text-lg font-black text-on-surface mb-6 flex items-center gap-2">
              <TrendingUp size={20} className="text-emerald-500" />
              Progress to Band 8.5
            </h3>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-bold inline-block py-1 px-2 uppercase rounded-full text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400">
                    On Track
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black inline-block text-on-surface">
                    78%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-slate-100 dark:bg-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "78%" }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500"
                />
              </div>
              <p className="text-[11px] text-on-surface-variant font-medium">Estimated completion in 14 days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-surface-container-lowest border border-outline-variant rounded-[3.5rem] p-8 md:p-12 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl font-black text-on-surface">Recent Test Activity</h2>
              <p className="text-on-surface-variant font-medium">Your latest performances in IELTS practice</p>
            </div>
            <button className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline">View All History</button>
          </div>

          <div className="space-y-4">
            {recentTests.map((test, i) => (
              <div key={i} className="flex items-center justify-between p-6 bg-slate-50/50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5 hover:border-indigo-200 transition-all group">
                <div className="flex items-center gap-5">
                  <div className={cn(
                    "h-14 w-14 rounded-2xl flex items-center justify-center transition-colors",
                    test.type === "Listening" ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" :
                    test.type === "Reading" ? "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400" :
                    "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                  )}>
                    {test.type === "Listening" ? <Headphones size={24} /> : test.type === "Reading" ? <BookOpen size={24} /> : <PenTool size={24} />}
                  </div>
                  <div>
                    <h4 className="font-bold text-on-surface group-hover:text-indigo-600 transition-colors">{test.name}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-on-surface-variant">{test.type}</span>
                      <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                      <span className="text-xs text-on-surface-variant">{test.date}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-on-surface">{test.band}</div>
                  <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{test.score}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Skills Breakdown */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-[3rem] p-8 shadow-sm">
            <h3 className="text-lg font-black text-on-surface mb-8">Sectional Focus</h3>
            <div className="space-y-6">
              {[
                { name: "Sentence Completion", progress: 85, color: "bg-indigo-500" },
                { name: "Matching Information", progress: 62, color: "bg-violet-500" },
                { name: "Short Answer Qs", progress: 45, color: "bg-emerald-500" },
                { name: "Essay Organization", progress: 70, color: "bg-rose-500" },
              ].map((skill) => (
                <div key={skill.name} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-on-surface-variant">{skill.name}</span>
                    <span className="text-on-surface">{skill.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full", skill.color)} style={{ width: `${skill.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-10 py-4 border border-outline-variant hover:bg-slate-50 dark:hover:bg-white/5 text-on-surface text-sm font-bold rounded-2xl transition-all">
              Full Analytics Report
            </button>
          </div>
        </div>
      </section>

      {/* Test Tips Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-8 bg-emerald-50/30 dark:bg-emerald-500/5 border border-emerald-100/50 dark:border-emerald-500/10 rounded-[2.5rem]">
          <div className="h-12 w-12 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 flex items-center justify-center mb-6">
            <CheckCircle2 size={24} />
          </div>
          <h4 className="text-lg font-bold text-emerald-900 dark:text-emerald-400 mb-2">Listening Tip</h4>
          <p className="text-sm text-emerald-700/70 dark:text-emerald-400/60 leading-relaxed">
            Write your answers in pencil and remember you have 10 minutes to transfer them to the answer sheet.
          </p>
        </div>
        <div className="p-8 bg-blue-50/30 dark:bg-blue-500/5 border border-blue-100/50 dark:border-blue-500/10 rounded-[2.5rem]">
          <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-500/20 text-blue-600 flex items-center justify-center mb-6">
            <CheckCircle2 size={24} />
          </div>
          <h4 className="text-lg font-bold text-blue-900 dark:text-blue-400 mb-2">Reading Tip</h4>
          <p className="text-sm text-blue-700/70 dark:text-blue-400/60 leading-relaxed">
            No extra time is given for transfer. Write your answers directly on the answer sheet if possible.
          </p>
        </div>
        <div className="p-8 bg-amber-50/30 dark:bg-amber-500/5 border border-amber-100/50 dark:border-amber-500/10 rounded-[2.5rem]">
          <div className="h-12 w-12 rounded-xl bg-amber-100 dark:bg-amber-500/20 text-amber-600 flex items-center justify-center mb-6">
            <AlertCircle size={24} />
          </div>
          <h4 className="text-lg font-bold text-amber-900 dark:text-amber-400 mb-2">Writing Tip</h4>
          <p className="text-sm text-amber-700/70 dark:text-amber-400/60 leading-relaxed">
            Pay attention to word limits: Task 1 needs 150+ words, Task 2 needs 250+ words.
          </p>
        </div>
      </section>
    </div>
  );
}
