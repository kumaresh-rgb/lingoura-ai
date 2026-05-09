"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Headphones, 
  Play, 
  Clock, 
  Target,
  ChevronRight,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

const ieltsSections = [
  {
    id: 1,
    title: "Section 1: Everyday Social Conversation",
    description: "A conversation between two people set in an everyday social context (e.g. a conversation in an accommodation agency).",
    duration: "7-8 mins",
    questions: "10 Questions",
    status: "Completed",
    difficulty: "Beginner"
  },
  {
    id: 2,
    title: "Section 2: Everyday Social Monologue",
    description: "A monologue set in an everyday social context (e.g. a speech about local facilities or a talk about the arrangements for meals during a conference).",
    duration: "7-8 mins",
    questions: "10 Questions",
    status: "Available",
    difficulty: "Intermediate"
  },
  {
    id: 3,
    title: "Section 3: Educational Conversation",
    description: "A conversation between up to four people set in an educational or training context (e.g. a university tutor and a student discussing an assignment).",
    duration: "8-9 mins",
    questions: "10 Questions",
    status: "Locked",
    difficulty: "Advanced"
  },
  {
    id: 4,
    title: "Section 4: Academic Monologue",
    description: "A monologue on an academic subject (e.g. a university lecture).",
    duration: "9-10 mins",
    questions: "10 Questions",
    status: "Locked",
    difficulty: "Expert"
  }
];

export default function ListeningPage() {
  return (
    <div className="space-y-10">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-widest">Listening Lab • IELTS Standard</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-on-surface leading-tight">
            IELTS Listening <span className="text-blue-600 dark:text-blue-400">Preparation.</span>
          </h1>
          <p className="text-lg text-on-surface-variant mt-4 max-w-2xl leading-relaxed">
            Master all four sections of the IELTS Listening test. Practice with real-world social contexts and complex academic lectures.
          </p>
        </div>
        
        <div className="flex gap-4">
          <div className="px-6 py-3 bg-surface-container-lowest border border-outline-variant rounded-2xl flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-sm font-bold text-on-surface">Target: Band 8.5</span>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Questions Attempted", value: "1,240", icon: Target, color: "text-blue-600" },
          { label: "Success Rate", value: "92%", icon: Zap, color: "text-amber-600" },
          { label: "Transfer Time Skill", value: "High", icon: Sparkles, color: "text-indigo-600" },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 flex items-center gap-4">
            <div className={cn("p-3 rounded-xl bg-slate-50 dark:bg-white/5", stat.color)}>
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{stat.label}</p>
              <h4 className="text-xl font-black text-on-surface">{stat.value}</h4>
            </div>
          </div>
        ))}
      </section>

      {/* IELTS Sections Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {ieltsSections.map((section, i) => (
          <motion.div 
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-surface-container-lowest border border-outline-variant rounded-[2.5rem] p-8 hover:border-blue-500/50 transition-all group cursor-pointer"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="h-14 w-14 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <Headphones size={28} />
              </div>
              <div className={cn(
                "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest",
                section.status === "Completed" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" :
                section.status === "Available" ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" :
                "bg-slate-50 text-slate-400 dark:bg-white/5 dark:text-slate-500"
              )}>
                {section.status}
              </div>
            </div>

            <h3 className="text-2xl font-black text-on-surface group-hover:text-blue-600 transition-colors mb-3">
              {section.title}
            </h3>
            <p className="text-on-surface-variant font-medium text-sm leading-relaxed mb-8">
              {section.description}
            </p>

            <div className="flex items-center gap-6 border-t border-outline-variant pt-6">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-slate-400" />
                <span className="text-xs font-bold text-on-surface-variant">{section.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Target size={16} className="text-slate-400" />
                <span className="text-xs font-bold text-on-surface-variant">{section.questions}</span>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <Play size={16} className="text-blue-600" />
                <span className="text-xs font-black text-blue-600 uppercase tracking-widest">Start Lab</span>
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Test Tips & Rules */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-[3rem] p-10">
        <div className="flex items-center gap-2 mb-8">
          <AlertCircle className="text-amber-500" size={24} />
          <h2 className="text-2xl font-black text-on-surface">Pro Tips for Listening</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="text-emerald-500 mt-1" size={18} />
              <p className="text-sm text-on-surface-variant leading-relaxed">
                <strong className="text-on-surface">One Listen Only:</strong> Each recording is heard once only. Don't pause!
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="text-emerald-500 mt-1" size={18} />
              <p className="text-sm text-on-surface-variant leading-relaxed">
                <strong className="text-on-surface">Read Ahead:</strong> Use the given time to read questions before you listen.
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="text-emerald-500 mt-1" size={18} />
              <p className="text-sm text-on-surface-variant leading-relaxed">
                <strong className="text-on-surface">Transfer Time:</strong> You have 10 minutes at the end to transfer answers to the sheet.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="text-emerald-500 mt-1" size={18} />
              <p className="text-sm text-on-surface-variant leading-relaxed">
                <strong className="text-on-surface">Word Limits:</strong> "NO MORE THAN TWO WORDS" means exactly that. "leather coat" is correct, "coat made of leather" is wrong.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
