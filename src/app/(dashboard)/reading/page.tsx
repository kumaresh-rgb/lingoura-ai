"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  Search, 
  Clock, 
  Target,
  FileText,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Layout,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const readingSections = [
  {
    id: 1,
    title: "Section 1: Everyday Life Factual",
    description: "Two or three short factual texts (e.g. hotel advertisements) related to everyday life in an English-speaking country.",
    duration: "20 mins",
    questions: "13-14 Questions",
    status: "Completed",
    type: "General / Academic"
  },
  {
    id: 2,
    title: "Section 2: Work-Related Issues",
    description: "Two short factual texts focusing on workplace issues like applying for jobs, company policies, and staff development.",
    duration: "20 mins",
    questions: "13-14 Questions",
    status: "Available",
    type: "Work Focus"
  },
  {
    id: 3,
    title: "Section 3: Complex General Topic",
    description: "One longer, more complex text on a topic of general interest. Discursive and analytical in nature.",
    duration: "20 mins",
    questions: "13-14 Questions",
    status: "Locked",
    type: "Analytical"
  }
];

const questionTypes = [
  "Multiple Choice",
  "True / False / Not Given",
  "Matching Headings",
  "Sentence Completion",
  "Summary Completion",
  "Short-answer Questions"
];

export default function ReadingPage() {
  return (
    <div className="space-y-10">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 text-[10px] font-bold uppercase tracking-widest">Reading Lab • IELTS Standard</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-on-surface leading-tight">
            IELTS Reading <span className="text-violet-600 dark:text-violet-400">Mastery.</span>
          </h1>
          <p className="text-lg text-on-surface-variant mt-4 max-w-2xl leading-relaxed">
            Practice with authentic texts from books, journals, and newspapers. Master the 3-section structure within the 60-minute time limit.
          </p>
        </div>
        
        <div className="flex gap-4">
          <div className="px-6 py-3 bg-surface-container-lowest border border-outline-variant rounded-2xl flex items-center gap-3 shadow-sm">
            <Search size={18} className="text-violet-600" />
            <span className="text-sm font-bold text-on-surface">Skill: Scanning & Skimming</span>
          </div>
        </div>
      </section>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Sections List */}
        <div className="lg:col-span-8 space-y-6">
          <h2 className="text-xl font-black text-on-surface flex items-center gap-2 mb-4">
            <Layout size={20} className="text-violet-600" />
            Test Sections
          </h2>
          {readingSections.map((section, i) => (
            <motion.div 
              key={section.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 md:p-8 hover:shadow-lg transition-all group flex flex-col md:flex-row gap-6"
            >
              <div className="h-16 w-16 shrink-0 rounded-2xl bg-violet-50 dark:bg-violet-500/10 text-violet-600 flex items-center justify-center">
                <FileText size={32} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-black text-on-surface group-hover:text-violet-600 transition-colors">
                    {section.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-500">{section.duration}</span>
                  </div>
                </div>
                <p className="text-on-surface-variant font-medium text-sm leading-relaxed mb-6">
                  {section.description}
                </p>
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <span className="px-3 py-1 bg-slate-50 dark:bg-white/5 rounded-lg text-[10px] font-bold text-slate-500 uppercase">{section.type}</span>
                      <span className="text-xs font-bold text-on-surface-variant">{section.questions}</span>
                   </div>
                   <button className="flex items-center gap-2 text-violet-600 font-black text-xs uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                     Open Section <ChevronRight size={16} />
                   </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-surface-container-lowest border border-outline-variant rounded-[2.5rem] p-8 shadow-sm">
              <h3 className="text-lg font-black text-on-surface mb-6 flex items-center gap-2">
                <HelpCircle size={20} className="text-amber-500" />
                Question Types
              </h3>
              <div className="space-y-3">
                 {questionTypes.map((type) => (
                   <div key={type} className="flex items-center gap-3 p-3 bg-slate-50/50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5">
                      <div className="h-2 w-2 rounded-full bg-violet-500" />
                      <span className="text-xs font-bold text-on-surface-variant">{type}</span>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-violet-600 rounded-[2.5rem] p-8 text-white">
              <h3 className="text-xl font-black mb-4">Reading Strategy</h3>
              <p className="text-violet-100 text-sm leading-relaxed mb-6">
                Don't read every word. Master the art of <strong>Skimming</strong> for gist and <strong>Scanning</strong> for specific information.
              </p>
              <button className="w-full py-4 bg-white text-violet-600 rounded-2xl font-bold hover:bg-violet-50 transition-colors">
                 Practice Scanning
              </button>
           </div>
        </div>
      </div>

      {/* Pro Tips Section */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-[3rem] p-10">
        <div className="flex items-center gap-2 mb-8">
          <AlertCircle className="text-amber-500" size={24} />
          <h2 className="text-2xl font-black text-on-surface">Reading Test Tips</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="text-emerald-500 mt-1" size={18} />
              <p className="text-sm text-on-surface-variant leading-relaxed">
                <strong className="text-on-surface">No Transfer Time:</strong> Unlike Listening, you don't get extra time to transfer answers. Write directly on the answer sheet.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="text-emerald-500 mt-1" size={18} />
              <p className="text-sm text-on-surface-variant leading-relaxed">
                <strong className="text-on-surface">Time Management:</strong> Spend approximately 20 minutes on each section. Don't get stuck on one difficult question.
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="text-emerald-500 mt-1" size={18} />
              <p className="text-sm text-on-surface-variant leading-relaxed">
                <strong className="text-on-surface">Answer All:</strong> There is no negative marking. Even if you aren't sure, take an educated guess.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="text-emerald-500 mt-1" size={18} />
              <p className="text-sm text-on-surface-variant leading-relaxed">
                <strong className="text-on-surface">Glossary:</strong> If the text contains highly technical terms, a simple glossary is usually provided at the end.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
