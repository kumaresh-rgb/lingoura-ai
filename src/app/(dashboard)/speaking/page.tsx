"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Mic2, 
  Clock, 
  Target,
  FileText,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  MessageSquare,
  Sparkles,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";

const speakingParts = [
  {
    id: 1,
    title: "Part 1: Introduction & Interview",
    description: "The examiner asks general questions on familiar topics like home, family, work, and interests.",
    timing: "4-5 mins",
    focus: "General Fluency",
    status: "Available",
    icon: MessageSquare,
    color: "bg-emerald-500"
  },
  {
    id: 2,
    title: "Part 2: Individual Long Turn",
    description: "Talk about a given topic for 1-2 minutes. You have 1 minute to prepare and make notes.",
    timing: "3-4 mins",
    focus: "Coherent Delivery",
    status: "Available",
    icon: Mic2,
    color: "bg-indigo-500"
  },
  {
    id: 3,
    title: "Part 3: Two-way Discussion",
    description: "Discuss more abstract issues and ideas connected to the topic from Part 2.",
    timing: "4-5 mins",
    focus: "Abstract Speculation",
    status: "Locked",
    icon: Users,
    color: "bg-violet-500"
  }
];

const criteria = [
  { name: "Fluency & Coherence", level: "Expert" },
  { name: "Lexical Resource", level: "Advanced" },
  { name: "Grammatical Range", level: "Intermediate" },
  { name: "Pronunciation", level: "Expert" },
];

export default function SpeakingPage() {
  return (
    <div className="space-y-10">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-widest">Speaking Lab • IELTS Standard</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-on-surface leading-tight">
            IELTS Speaking <span className="text-emerald-600 dark:text-emerald-400">Fluency.</span>
          </h1>
          <p className="text-lg text-on-surface-variant mt-4 max-w-2xl leading-relaxed">
            Simulate a real 1-on-1 interview with our AI examiner. Master the 3-part structure from general intros to abstract discussions.
          </p>
        </div>
        
        <div className="flex gap-4">
          <div className="px-6 py-3 bg-surface-container-lowest border border-outline-variant rounded-2xl flex items-center gap-3 shadow-sm">
            <Sparkles size={18} className="text-emerald-600" />
            <span className="text-sm font-bold text-on-surface">Voice AI Active</span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Parts List */}
        <div className="lg:col-span-8 space-y-6">
          <h2 className="text-xl font-black text-on-surface flex items-center gap-2 mb-4">
            <Users size={20} className="text-emerald-600" />
            Test Parts
          </h2>
          <div className="grid grid-cols-1 gap-6">
            {speakingParts.map((part, i) => (
              <motion.div 
                key={part.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-surface-container-lowest border border-outline-variant rounded-[2.5rem] p-8 hover:shadow-xl transition-all group flex flex-col md:flex-row gap-8 items-center"
              >
                <div className={cn("h-20 w-20 shrink-0 rounded-3xl flex items-center justify-center text-white shadow-lg", part.color)}>
                  <part.icon size={36} />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-2">
                    <h3 className="text-2xl font-black text-on-surface">{part.title}</h3>
                    <span className="text-xs font-bold text-on-surface-variant px-3 py-1 bg-slate-50 dark:bg-white/5 rounded-full border border-slate-100 dark:border-white/5">
                      {part.timing}
                    </span>
                  </div>
                  <p className="text-on-surface-variant font-medium text-sm leading-relaxed mb-6">
                    {part.description}
                  </p>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                    <div className="flex items-center gap-2">
                      <Target size={14} className="text-slate-400" />
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Focus: {part.focus}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-500" />
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-tighter">{part.status}</span>
                    </div>
                  </div>
                </div>
                <button className={cn(
                  "px-8 py-4 rounded-2xl text-white font-black text-sm uppercase tracking-widest transition-all shadow-md active:scale-95",
                  part.color
                )}>
                  Start Part {part.id}
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar: Scoring & Tips */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-surface-container-lowest border border-outline-variant rounded-[3rem] p-8 shadow-sm">
              <h3 className="text-lg font-black text-on-surface mb-8">Official Assessment</h3>
              <div className="space-y-6">
                 {criteria.map((item) => (
                   <div key={item.name} className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
                      <div>
                        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{item.name}</p>
                        <p className="text-sm font-black text-on-surface mt-1">{item.level}</p>
                      </div>
                      <div className="h-2 w-2 rounded-full bg-emerald-500" />
                   </div>
                 ))}
              </div>
              <p className="mt-8 text-[11px] text-on-surface-variant leading-relaxed text-center">
                Your performance is assessed throughout all 3 parts by a certified AI examiner.
              </p>
           </div>

           <div className="bg-emerald-600 rounded-[2.5rem] p-8 text-white">
              <h3 className="text-xl font-black mb-4">Fluency Tip</h3>
              <p className="text-emerald-100 text-sm leading-relaxed mb-6">
                Don't worry about making mistakes. Focus on <strong>speaking at length</strong> and organizing your ideas coherently.
              </p>
              <button className="w-full py-4 bg-white text-emerald-600 rounded-2xl font-bold hover:bg-emerald-50 transition-colors">
                 Quick Fluency Drill
              </button>
           </div>
        </div>
      </div>

      {/* Test Guidelines */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-[3rem] p-10">
        <h2 className="text-2xl font-black text-on-surface mb-8">Test Skills Assessed</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="space-y-4">
             <div className="h-1 w-12 bg-emerald-500 rounded-full" />
             <h4 className="font-bold text-on-surface">Everyday Communication</h4>
             <p className="text-sm text-on-surface-variant leading-relaxed">Ability to communicate opinions and information on everyday topics and common experiences.</p>
          </div>
          <div className="space-y-4">
             <div className="h-1 w-12 bg-indigo-500 rounded-full" />
             <h4 className="font-bold text-on-surface">Length & Coherence</h4>
             <p className="text-sm text-on-surface-variant leading-relaxed">Ability to speak at length on a given topic using appropriate language and organizing ideas coherently.</p>
          </div>
          <div className="space-y-4">
             <div className="h-1 w-12 bg-violet-500 rounded-full" />
             <h4 className="font-bold text-on-surface">Abstract Speculation</h4>
             <p className="text-sm text-on-surface-variant leading-relaxed">Ability to express and justify opinions and to analyse, discuss and speculate about complex issues.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
