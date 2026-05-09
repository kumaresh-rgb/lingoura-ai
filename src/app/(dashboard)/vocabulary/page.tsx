"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Volume2, 
  Bookmark, 
  Search, 
  Brain, 
  RefreshCw, 
  Sparkles,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  History,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function VocabularyPage() {
  const [activeTab, setActiveTab] = useState("insights");

  return (
    <div className="space-y-12 w-full pb-20">
      {/* Header Section */}
      <section className="grid grid-cols-1 lg:grid-cols-[1fr_auto] items-end gap-6 w-full border-b border-slate-100 dark:border-white/5 pb-8">
        <div className="min-w-0">
          <h1 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.3em] mb-3">Lexicon Laboratory</h1>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">Word of the Day</h2>
        </div>
        <div className="text-right">
           <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">May 9, 2026</p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 w-full">
        
        {/* Main Content Area (8 cols) */}
        <div className="lg:col-span-8 space-y-16">
          
          {/* Featured Word Section */}
          <section className="relative">
            <div className="flex flex-col items-center text-center mb-12">
              <div className="flex items-center gap-8 mb-4">
                <button className="h-10 w-10 rounded-full border border-slate-100 dark:border-white/10 flex items-center justify-center text-slate-300 dark:text-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-100 dark:hover:border-white/20 transition-all">
                  <ChevronLeft size={20} />
                </button>
                <h2 className="text-7xl md:text-9xl font-serif italic text-slate-900 dark:text-white tracking-tighter">gallivant</h2>
                <button className="h-10 w-10 rounded-full border border-slate-100 dark:border-white/10 flex items-center justify-center text-slate-300 dark:text-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-100 dark:hover:border-white/20 transition-all">
                  <ChevronRight size={20} />
                </button>
              </div>
              <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 font-medium">
                <span className="italic">verb</span>
                <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                <span className="tracking-widest uppercase text-xs font-bold">GAL-uh-vant</span>
                <button className="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-all">
                  <Volume2 size={14} />
                </button>
                <div className="h-4 w-px bg-slate-200 dark:bg-white/10 mx-2" />
                <button className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-500/10 px-3 py-1.5 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-all border border-indigo-100/50 dark:border-indigo-500/20 shadow-sm">
                  <Sparkles size={12} /> Explain with AI
                </button>
              </div>
            </div>

            <div className="space-y-12">
              {/* Meaning */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white border-b border-indigo-100 dark:border-white/5 pb-2 flex items-center gap-2">
                  What It Means
                </h3>
                <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-serif">
                  To gallivant is to go or travel to many different places for pleasure. 
                  <span className="italic text-slate-400 dark:text-slate-500 ml-2">Gallivant</span> is a somewhat informal word that is often applied 
                  when the user of the word does not approve of such pleasurable traveling.
                </p>
              </div>

              {/* Examples */}
              <div className="space-y-4">
                <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed italic border-l-4 border-indigo-500 pl-6 py-2">
                  // They&apos;ve been <span className="font-bold text-slate-900 dark:text-white">gallivanting</span> all over town instead of studying for their finals.
                </p>
                <a href="#" className="inline-flex items-center text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:underline gap-1">
                  See the entry <ArrowRight size={14} />
                </a>
              </div>

              {/* Context Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-widest text-xs">GALLIVANT in Context</h3>
                <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-serif">
                  “These days, she can be found <span className="italic">gallivanting</span> around the Upper West Side, catching the latest Broadway shows 
                  and occasionally hopping onstage to belt show tunes with the waitstaff at her beloved Times Square restaurant, 
                  where she remains hands-on with the business.” — <span className="font-bold text-slate-900 dark:text-white">McKenzie Beard</span>, <span className="italic">The New York Post</span>, 18 Feb. 2026
                </p>

                {/* Did You Know? */}
                <div className="bg-slate-50 dark:bg-white/5 rounded-[2.5rem] p-10 border border-slate-100 dark:border-white/5">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <Info size={20} className="text-indigo-600 dark:text-indigo-400" /> Did You Know?
                  </h3>
                  <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-serif">
                    Back in the 14th century, <span className="italic font-bold text-indigo-600 dark:text-indigo-400">gallant</span>, a noun borrowed from the French word <span className="italic">galant</span>, 
                    referred to a fashionable young man. By the middle of the next century, it was being used more specifically to refer to 
                    such a man who was attentive to, and had a fondness for, the company of women. In the late 17th century, this “ladies&apos; man” 
                    sense gave rise to the verb <span className="italic font-bold text-indigo-600 dark:text-indigo-400">gallant</span> to describe the process a suitor used to win a lady&apos;s heart, 
                    and “gallanting” became synonymous with “courting.” It’s this verb <span className="italic">gallant</span> that is the likely source 
                    of <span className="italic">gallivant</span>, which originally meant “to act as a gallant” or “to go about usually ostentatiously 
                    or indiscreetly with members of the opposite sex.” Today, however, <span className="italic">gallivant</span> is more likely 
                    to describe pleasurable wandering than romancing.
                  </p>
                </div>
              </div>

              {/* Ask AI Section */}
              <div className="bg-white dark:bg-white/5 border-2 border-indigo-50 dark:border-indigo-500/10 rounded-[2.5rem] p-10 shadow-xl shadow-indigo-100/20 dark:shadow-none">
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-10 w-10 rounded-xl primary-gradient flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-none">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Ask Lingoura AI</h3>
                    <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">Get deeper insights or custom examples for &quot;gallivant&quot;</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {[
                    "Give me 5 business examples",
                    "How is it different from 'travel'?",
                    "Write a short story using this word",
                    "Common idioms with this word"
                  ].map(q => (
                    <button key={q} className="px-4 py-2 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-full text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-100 dark:hover:border-white/20 hover:bg-white dark:hover:bg-white/10 transition-all">
                      {q}
                    </button>
                  ))}
                </div>

                <div className="relative group">
                  <input 
                    type="text" 
                    placeholder="Ask anything about this word..." 
                    className="w-full bg-slate-50 dark:bg-white/10 border-none rounded-2xl px-6 py-5 pr-16 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none text-slate-900 dark:text-white"
                  />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 primary-gradient rounded-xl flex items-center justify-center text-white shadow-md active:scale-95 transition-all">
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Quiz Section (M-W Style) */}
          <section className="pt-16 border-t border-slate-100 dark:border-white/5">
            <div className="text-center mb-10">
               <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2">Test Your Vocabulary</h3>
               <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">AI-Powered Adaptive Quizzes</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <QuizMiniCard 
                  image="https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=200&q=80" 
                  title="Name That Animal!" 
                  action="Play Now" 
               />
               <QuizMiniCard 
                  image="https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=200&q=80" 
                  title="Spelling Bee AI" 
                  action="Challenge" 
               />
               <QuizMiniCard 
                  image="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=200&q=80" 
                  title="Context Master" 
                  action="Start" 
               />
            </div>
          </section>
        </div>

        {/* Sidebar Area (4 cols) */}
        <div className="lg:col-span-4 space-y-10">
          {/* AI Subscription / Newsletter Mockup */}
          <div className="bg-slate-900 dark:bg-white/5 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-slate-200 dark:shadow-none border border-transparent dark:border-white/5">
            <h3 className="text-xl font-bold mb-4">Build your vocabulary!</h3>
            <p className="text-slate-400 dark:text-slate-500 text-sm mb-8 leading-relaxed">
              Get Word of the Day in your inbox every day with AI-curated context for your level.
            </p>
            <div className="space-y-4">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="w-full bg-white/10 dark:bg-white/10 border border-white/10 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-white"
              />
              <button className="w-full primary-gradient py-3 rounded-xl font-bold text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all">
                Subscribe
              </button>
            </div>
          </div>

          {/* AI Word Search */}
          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 shadow-sm">
             <div className="flex items-center gap-3 mb-6">
                <Search size={18} className="text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-bold text-slate-900 dark:text-white">Instant Analysis</h3>
             </div>
             <input 
               type="text" 
               placeholder="Search any word..." 
               className="w-full bg-slate-50 dark:bg-white/10 border-none rounded-2xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none text-slate-900 dark:text-white"
             />
             <div className="mt-6 flex flex-wrap gap-2">
                {["Obfuscate", "Pragmatic", "Resilient", "Paradigm"].map(w => (
                  <button key={w} className="px-3 py-1.5 bg-slate-50 dark:bg-white/5 rounded-lg text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 transition-all">
                    {w}
                  </button>
                ))}
             </div>
          </div>

          {/* AI Mastery Quiz Widget */}
          <div className="bg-indigo-50/50 dark:bg-white/5 rounded-[2.5rem] p-8 border border-indigo-100/50 dark:border-white/5">
             <div className="flex items-center gap-2 mb-6">
                <Brain size={18} className="text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-bold text-slate-900 dark:text-white">Daily Challenge</h3>
             </div>
             <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                Unscramble the letters to reveal a verb meaning "to wander aimlessly":
             </p>
             <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-indigo-100 dark:border-white/10 shadow-sm text-center">
                <div className="text-2xl font-black tracking-[0.3em] text-indigo-600 dark:text-indigo-400 mb-4 uppercase">
                   LLVGNAITA
                </div>
                <button className="w-full bg-indigo-600 text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-indigo-700 transition-all">
                   Solve
                </button>
             </div>
          </div>

          {/* Recently Viewed */}
          <div className="space-y-4 px-2">
             <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <History size={14} /> Recently Explored
             </h3>
             <div className="space-y-3">
                <div className="flex justify-between items-center group cursor-pointer">
                   <span className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Eloquent</span>
                   <span className="text-[10px] font-bold text-slate-300 dark:text-slate-700">May 8</span>
                </div>
                <div className="flex justify-between items-center group cursor-pointer">
                   <span className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Pragmatic</span>
                   <span className="text-[10px] font-bold text-slate-300 dark:text-slate-700">May 7</span>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function QuizMiniCard({ image, title, action }: { image: string; title: string; action: string }) {
  return (
    <div className="group cursor-pointer">
      <div className="aspect-[4/3] rounded-3xl overflow-hidden mb-4 relative">
        <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
           <span className="text-white font-bold text-xs flex items-center gap-2">
              {action} <ChevronRight size={14} />
           </span>
        </div>
      </div>
      <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{title}</h4>
      <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mt-1">{action}</p>
    </div>
  );
}
