"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  PenTool, 
  Clock, 
  Target,
  FileText,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  BarChart2,
  AlignLeft,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

const writingTasks = [
  {
    id: 1,
    title: "Task 1: Data Description",
    description: "Summarize and explain data from a graph, table, chart, or diagram. Describe stages of a process, how something works, or describe an object or event.",
    timing: "20 mins",
    wordCount: "150+ Words",
    status: "Available",
    type: "Academic / General Training (Letter)",
    icon: BarChart2,
    color: "bg-amber-500"
  },
  {
    id: 2,
    title: "Task 2: Essay Response",
    description: "Write an essay in response to a point of view, argument, or problem. This task contributes twice as much to the final writing score.",
    timing: "40 mins",
    wordCount: "250+ Words",
    status: "Available",
    type: "Discursive / Analytical",
    icon: AlignLeft,
    color: "bg-rose-500"
  }
];

const criteria = [
  { name: "Task Achievement", score: 75 },
  { name: "Coherence & Cohesion", score: 60 },
  { name: "Lexical Resource", score: 85 },
  { name: "Grammatical Accuracy", score: 70 },
];

export default function WritingPage() {
  return (
    <div className="space-y-10">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-bold uppercase tracking-widest">Writing Lab • IELTS Standard</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-on-surface leading-tight">
            IELTS Writing <span className="text-rose-600 dark:text-rose-400">Excellence.</span>
          </h1>
          <p className="text-lg text-on-surface-variant mt-4 leading-relaxed">
            Practice academic essay writing and data description. Get AI-driven feedback on your coherence, cohesion, and grammatical range.
          </p>
        </div>
        
        <div className="flex gap-4">
          <div className="px-6 py-3 bg-surface-container-lowest border border-outline-variant rounded-2xl flex items-center gap-3 shadow-sm">
            <Sparkles size={18} className="text-rose-600" />
            <span className="text-sm font-bold text-on-surface">AI Grading Enabled</span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Tasks List */}
        <div className="lg:col-span-8 space-y-6">
          <h2 className="text-xl font-black text-on-surface flex items-center gap-2 mb-4">
            <FileText size={20} className="text-rose-600" />
            Exam Tasks
          </h2>
          {writingTasks.map((task, i) => (
            <motion.div 
              key={task.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-surface-container-lowest border border-outline-variant rounded-[2.5rem] p-8 md:p-10 hover:border-rose-500/50 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 text-rose-500/5 group-hover:text-rose-500/10 transition-colors">
                 <task.icon size={120} />
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div className={cn("h-16 w-16 rounded-2xl flex items-center justify-center text-white", task.color)}>
                    <task.icon size={32} />
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5">
                    <Clock size={14} className="text-slate-400" />
                    <span className="text-xs font-bold text-on-surface">{task.timing}</span>
                  </div>
                </div>

                <h3 className="text-2xl font-black text-on-surface mb-3">{task.title}</h3>
                <p className="text-on-surface-variant font-medium text-sm leading-relaxed mb-8">
                  {task.description}
                </p>

                <div className="flex flex-wrap items-center gap-6 pt-8 border-t border-outline-variant">
                   <div className="flex items-center gap-2">
                      <Target size={16} className="text-slate-400" />
                      <span className="text-xs font-bold text-on-surface-variant">{task.wordCount}</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <HelpCircle size={16} className="text-slate-400" />
                      <span className="text-xs font-bold text-on-surface-variant">{task.type}</span>
                   </div>
                   <button className={cn(
                     "ml-auto px-6 py-3 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all",
                     task.color
                   )}>
                     Start Writing
                   </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sidebar: Performance & Tips */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-surface-container-lowest border border-outline-variant rounded-[2.5rem] p-8 shadow-sm">
              <h3 className="text-lg font-black text-on-surface mb-8">Assessment Criteria</h3>
              <div className="space-y-6">
                 {criteria.map((item) => (
                   <div key={item.name} className="space-y-2">
                      <div className="flex justify-between text-xs font-bold">
                         <span className="text-on-surface-variant">{item.name}</span>
                         <span className="text-on-surface">{item.score}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${item.score}%` }}
                           className="h-full bg-rose-500 rounded-full" 
                         />
                      </div>
                   </div>
                 ))}
              </div>
              <p className="mt-8 text-[11px] text-on-surface-variant leading-relaxed">
                Task 2 contributes twice as much to the final writing score. Allocate your time accordingly.
              </p>
           </div>

           <div className="bg-amber-50/50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/10 rounded-[2rem] p-8">
              <div className="flex items-center gap-2 mb-4">
                 <AlertCircle size={20} className="text-amber-600" />
                 <h4 className="font-black text-on-surface">Critical Tip</h4>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                 Spelling, grammar, and punctuation are all marked. You will lose points for each mistake. 
                 <br/><br/>
                 <strong className="text-on-surface">Word Limit Warning:</strong> If you write less than 150/250 words, you will be penalized.
              </p>
           </div>
        </div>
      </div>

      {/* Formatting Rules */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-[3rem] p-10">
        <h2 className="text-2xl font-black text-on-surface mb-8">Test Rules & Guidelines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="space-y-3">
             <div className="h-1 w-12 bg-rose-500 rounded-full" />
             <h4 className="font-bold text-on-surface">Drafting</h4>
             <p className="text-sm text-on-surface-variant leading-relaxed">You may make notes on the question paper, but they will not be marked.</p>
          </div>
          <div className="space-y-3">
             <div className="h-1 w-12 bg-indigo-500 rounded-full" />
             <h4 className="font-bold text-on-surface">Writing Style</h4>
             <p className="text-sm text-on-surface-variant leading-relaxed">Must write in full paragraphs. Note form or bullet points will lose marks.</p>
          </div>
          <div className="space-y-3">
             <div className="h-1 w-12 bg-emerald-500 rounded-full" />
             <h4 className="font-bold text-on-surface">Tool Usage</h4>
             <p className="text-sm text-on-surface-variant leading-relaxed">You may write in either pencil or pen. Capitals are allowed for everything.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
