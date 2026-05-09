"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  Sparkles, 
  Bookmark,
  Share2,
  Brain,
  CheckCircle2,
  Trophy,
  Clock,
  Type
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ReadingPage() {
  const [fontSize, setFontSize] = useState("text-lg");

  return (
    <div className="space-y-12 max-w-[1400px] mx-auto">
      
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">Reading Lab</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-4 text-lg font-medium max-w-2xl leading-relaxed">
            Deepen your comprehension and expand your vocabulary with AI-enhanced immersive reading.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Left Column: Reading Content (Main) */}
        <div className="xl:col-span-8 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-[3rem] shadow-sm overflow-hidden flex flex-col min-h-[800px]">
          {/* Reader Header */}
          <div className="px-8 md:px-12 py-10 border-b border-slate-100 dark:border-white/5 flex flex-col sm:flex-row justify-between items-center bg-slate-50/50 dark:bg-white/5 gap-6">
            <div className="flex items-center gap-5">
              <div className="h-14 w-14 rounded-2xl primary-gradient flex items-center justify-center text-white shadow-xl shadow-indigo-100 dark:shadow-none">
                <BookOpen size={30} />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">The Psychology of Productivity</h2>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 bg-white dark:bg-white/10 border border-indigo-100 dark:border-indigo-500/20 px-3 py-1 rounded-full uppercase tracking-widest">B2 Intermediate</span>
                  <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    <Clock size={12} /> 12 Min Read
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="h-12 w-12 rounded-2xl border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-white/10 transition-all">
                <Bookmark size={20} />
              </button>
              <button onClick={() => setFontSize(fontSize === "text-lg" ? "text-xl" : "text-lg")} className="h-12 w-12 rounded-2xl border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-white/10 transition-all">
                <Type size={20} />
              </button>
              <button className="h-12 w-12 rounded-2xl border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-white/10 transition-all">
                <Share2 size={20} />
              </button>
            </div>
          </div>

          <div className="px-12 py-6 bg-slate-900 flex justify-between items-center text-white relative overflow-hidden">
             <div className="absolute top-0 left-0 h-full w-1 primary-gradient" />
             <div className="flex items-center gap-8 relative z-10">
                <div>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Current Speed</p>
                   <p className="text-xl font-bold flex items-center gap-2">240 <span className="text-xs text-indigo-400">WPM</span></p>
                </div>
                <div className="h-10 w-[1px] bg-white/10" />
                <div>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Retention Rate</p>
                   <p className="text-xl font-bold text-emerald-400">92%</p>
                </div>
             </div>
          </div>

          {/* Article Area */}
          <div className="flex-1 overflow-y-auto p-12 md:p-20 scrollbar-hide bg-white dark:bg-transparent">
            <article className={cn("max-w-3xl mx-auto leading-[2] text-slate-700 dark:text-slate-300 font-medium", fontSize)}>
              <p className="mb-8 first-letter:text-5xl first-letter:font-bold first-letter:text-indigo-600 first-letter:mr-3 first-letter:float-left">
                In the modern age of digital distraction, the concept of deep work has become a cornerstone for personal 
                effectiveness. Understanding how our brains handle concentration is the first step toward mastering your time.
              </p>
              
              <p className="mb-8">
                Psychological studies suggest that every time we switch tasks, there is a <span className="bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 px-1 border-b-2 border-indigo-200 dark:border-indigo-500/40 font-bold cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-500/30 transition-all">cognitive cost</span>. 
                This phenomenon, often referred to as &quot;attention residue,&quot; means that a part of your brain is still thinking 
                about the previous task while you are trying to focus on the new one.
              </p>

              <div className="my-16 relative py-12 px-8 bg-indigo-50/30 dark:bg-indigo-500/5 rounded-[3rem] border border-indigo-100/50 dark:border-indigo-500/10">
                <blockquote className="italic text-2xl md:text-3xl text-indigo-900/80 dark:text-indigo-100/80 font-black leading-tight text-center">
                  &quot;Focus is not just about what you&apos;re doing, but about the thousands of things you&apos;re actively choosing not to do.&quot;
                </blockquote>
                <div className="mt-8 flex justify-center gap-2">
                   {[1, 2, 3].map(i => <div key={i} className="h-1.5 w-1.5 rounded-full bg-indigo-200 dark:bg-indigo-500/40" />)}
                </div>
              </div>

              <p className="mb-8">
                To mitigate these effects, top performers often utilize <span className="bg-orange-50 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300 px-1 border-b-2 border-orange-200 dark:border-orange-500/40 font-bold cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-500/30 transition-all">time-blocking</span> techniques. 
                By dedicating specific chunks of time to high-value activities, they can enter a state of &quot;flow&quot; where 
                productivity increases exponentially.
              </p>

              <p className="mb-8">
                Furthermore, the environment plays a critical role. A minimalist workspace reduces visual noise, allowing 
                the prefrontal cortex to prioritize complex problem-solving over sensory processing.
              </p>
            </article>
          </div>
        </div>

        {/* Right Column: AI Assistant & Exercises */}
        <div className="xl:col-span-4 flex flex-col gap-8">
          
          {/* AI Insight Explorer */}
          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 shadow-sm flex flex-col">
            <div className="flex items-center gap-2 mb-8">
               <Sparkles size={20} className="text-indigo-600 dark:text-indigo-400" />
               <h3 className="text-xl font-black text-slate-900 dark:text-white">AI Intelligence</h3>
            </div>
            
            <div className="space-y-6">
              <div className="p-6 bg-indigo-50/50 dark:bg-indigo-500/10 rounded-2xl border border-indigo-100/50 dark:border-indigo-500/20">
                 <h4 className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-3">Contextual Explanation</h4>
                 <p className="text-sm font-bold text-indigo-900 dark:text-indigo-100 mb-2">&quot;Cognitive Cost&quot;</p>
                 <p className="text-xs text-indigo-800/70 dark:text-indigo-300/70 leading-relaxed font-medium italic">
                   The mental energy used when switching between different tasks. It reduces your ability to focus deeply.
                 </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Key Vocabulary</h4>
                <div className="space-y-3">
                   <VocabItem word="Mitigate" meaning="To make less severe" level="C1" />
                   <VocabItem word="Exponentially" meaning="Increasingly rapid" level="B2" />
                   <VocabItem word="Minimalist" meaning="Keeping things simple" level="A2" />
                </div>
              </div>
            </div>
          </div>

          {/* Comprehension Mastery */}
          <div className="bg-slate-900 dark:bg-white/5 rounded-[3rem] p-10 text-white shadow-3xl flex flex-col relative overflow-hidden group border border-transparent dark:border-white/5">
            <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:opacity-20 transition-opacity duration-700">
               <Brain size={200} />
            </div>
            
            <div className="flex justify-between items-center mb-10 relative z-10">
              <h3 className="text-xl font-black flex items-center gap-3">
                <Trophy size={24} className="text-amber-400" /> Mastery Quiz
              </h3>
              <span className="text-[10px] font-bold text-slate-400 uppercase">3 Questions</span>
            </div>

            <div className="space-y-10 relative z-10">
              <div className="space-y-6">
                <p className="text-lg font-bold text-white leading-relaxed">
                  What is the primary cause of &quot;attention residue&quot; according to the analysis?
                </p>
                <div className="space-y-3">
                  {[
                    "A) Environmental visual noise",
                    "B) Rapid task switching",
                    "C) Sensory processing overload"
                  ].map((opt, i) => (
                    <motion.button 
                      key={i}
                      whileHover={{ x: 5, backgroundColor: "rgba(255,255,255,0.05)" }}
                      className="w-full p-5 rounded-[1.5rem] bg-white/5 border border-white/10 text-xs font-bold text-left transition-all"
                    >
                      {opt}
                    </motion.button>
                  ))}
                </div>
              </div>
              
              <div className="p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                 <div className="flex items-center gap-2 text-indigo-400 mb-3">
                   <Sparkles size={16} fill="currentColor" />
                   <span className="text-[10px] font-black uppercase tracking-widest">AI Strategy</span>
                 </div>
                 <p className="text-[10px] font-bold text-slate-400 leading-relaxed">
                   Look for the phrase &quot;attention residue&quot; in the second paragraph. The sentence following it explains the cause directly.
                 </p>
              </div>
            </div>

            <button className="mt-12 w-full py-5 bg-white dark:bg-indigo-600 text-slate-900 dark:text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 dark:hover:bg-indigo-700 transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-2 relative z-10">
              Complete Session <CheckCircle2 size={16} className="text-indigo-600 dark:text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function VocabItem({ word, meaning, level }: { word: string; meaning: string; level: string }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-[1.5rem] hover:bg-slate-50 dark:hover:bg-white/10 transition-all group cursor-pointer border border-transparent hover:border-slate-100 dark:hover:border-white/20 shadow-sm hover:shadow-md">
       <div className="flex flex-col">
         <span className="text-base font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors tracking-tight">{word}</span>
         <span className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest mt-1">{meaning}</span>
       </div>
       <span className="text-[10px] font-black bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 px-2.5 py-1 rounded-full border border-indigo-100 dark:border-indigo-500/30">{level}</span>
    </div>
  );
}
