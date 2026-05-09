"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  Filter, 
  Clock, 
  Trophy, 
  BarChart, 
  Sparkles,
  Play,
  Bookmark
} from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  "All", "Business", "Communication", "Academic", "Daily Life", "Career"
];

const lessons = [
  {
    title: "Job Interview Mastery",
    category: "Career",
    level: "B2",
    duration: "45 mins",
    difficulty: "Medium",
    progress: 0,
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80",
    aiGenerated: true
  },
  {
    title: "The Art of Storytelling",
    category: "Communication",
    level: "C1",
    duration: "30 mins",
    difficulty: "Advanced",
    progress: 25,
    image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=600&q=80",
    aiGenerated: true
  },
  {
    title: "Email Etiquette 101",
    category: "Business",
    level: "B1",
    duration: "20 mins",
    difficulty: "Easy",
    progress: 100,
    image: "https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&w=600&q=80",
    aiGenerated: false
  },
  {
    title: "Handling Objections",
    category: "Business",
    level: "B2",
    duration: "35 mins",
    difficulty: "Medium",
    progress: 65,
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=600&q=80",
    aiGenerated: true
  },
  {
    title: "Public Speaking Basics",
    category: "Communication",
    level: "A2",
    duration: "15 mins",
    difficulty: "Easy",
    progress: 10,
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=600&q=80",
    aiGenerated: true
  },
  {
    title: "Advanced Negotiation",
    category: "Business",
    level: "C1",
    duration: "50 mins",
    difficulty: "Hard",
    progress: 0,
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80",
    aiGenerated: true
  }
];

export default function LessonsPage() {
  const [selectedCategory, setSelectedCategory] = React.useState("All");

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <section className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
        <div className="flex-1 min-w-[300px]">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">Explore Lessons</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-4 max-w-2xl text-lg font-medium leading-relaxed">
            Choose from hundreds of AI-generated lessons tailored to your specific goals and level.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
          <div className="relative w-full sm:w-80">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input 
              type="text" 
              placeholder="Search lessons..." 
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all outline-none font-medium text-slate-900 dark:text-white"
            />
          </div>
          <button className="w-full sm:w-auto px-6 py-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-2 font-bold shadow-sm">
            <Filter size={18} /> Filters
          </button>
        </div>
      </section>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              "px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap",
              selectedCategory === cat 
                ? "primary-gradient text-white shadow-lg shadow-indigo-200 dark:shadow-none" 
                : "bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {lessons.map((lesson, i) => (
          <motion.div
            key={lesson.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl dark:hover:shadow-none transition-all duration-500 flex flex-col"
          >
            {/* Image Container */}
            <div className="relative h-56 w-full overflow-hidden">
              <img 
                src={lesson.image} 
                alt={lesson.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold text-indigo-600 shadow-sm">
                  {lesson.level}
                </span>
                {lesson.aiGenerated && (
                  <span className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 shadow-md">
                    <Sparkles size={10} /> AI Generated
                  </span>
                )}
              </div>

              <button className="absolute top-4 right-4 h-10 w-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors shadow-sm opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300">
                <Bookmark size={18} />
              </button>

              <button className="absolute inset-0 m-auto h-16 w-16 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-indigo-600 shadow-xl opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300">
                <Play size={24} fill="currentColor" />
              </button>
            </div>

            {/* Content Container */}
            <div className="p-8 flex flex-col flex-1">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                {lesson.category}
              </span>
              <h3 className="text-xl font-bold tracking-tight mb-4 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-slate-900 dark:text-white">
                {lesson.title}
              </h3>
              
              <div className="grid grid-cols-2 gap-4 mt-auto">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <Clock size={16} />
                  <span className="text-xs font-medium">{lesson.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <BarChart size={16} />
                  <span className="text-xs font-medium">{lesson.difficulty}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                <div className="flex-1 max-w-[120px] h-1.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 transition-all duration-1000" 
                    style={{ width: `${lesson.progress}%` }} 
                  />
                </div>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">
                  {lesson.progress === 100 ? "Completed" : `${lesson.progress}% Done`}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
