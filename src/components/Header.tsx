"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { 
  Bell, 
  Search, 
  User, 
  ChevronDown,
  Sparkles,
  Zap,
  Globe,
  Settings,
  Menu,
  Activity,
  ShieldCheck,
  Sun,
  Moon
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";

export function Header({ isSidebarCollapsed }: { isSidebarCollapsed: boolean }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only rendering theme-dependent UI after mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <motion.header 
      animate={{ 
        left: isSidebarCollapsed ? 80 : 288 
      }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 right-0 h-20 bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl border-b border-slate-200/40 dark:border-white/5 z-[40] px-6 md:px-10 flex items-center justify-between lg:left-auto"
    >
      {/* Left Section: Contextual Info */}
      <div className="flex items-center gap-5">
        {/* Mobile Brand */}
        <div className="flex items-center gap-3 lg:hidden">
          <img src="/logo-icon.png" alt="Lingoura AI" className="h-8 w-auto object-contain" />
          <span className="font-black text-lg tracking-tight bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#EC4899] bg-clip-text text-transparent">Lingoura AI</span>
        </div>

        {/* System Health / Professional Breadcrumb */}
        <div className="hidden lg:flex items-center gap-6">
           <div className="flex items-center gap-2.5 px-3 py-1.5 bg-emerald-50/50 dark:bg-emerald-500/10 rounded-full border border-emerald-100/50 dark:border-emerald-500/20">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">System Active</span>
           </div>
           
           <div className="flex items-center gap-2 group cursor-help">
              <ShieldCheck size={14} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">End-to-End Encryption</span>
           </div>
        </div>
      </div>

      {/* Middle Section: Search - Integrated look */}
      <div className="flex-1 max-w-2xl mx-12 hidden md:block">
        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search size={17} className="text-slate-400 dark:text-slate-500 group-focus-within:text-slate-900 dark:group-focus-within:text-white transition-colors" />
          </div>
          <input 
            type="text" 
            placeholder="Search Intelligence Base (Cmd + K)" 
            className="w-full bg-slate-100/50 dark:bg-white/5 border border-transparent rounded-xl py-2.5 pl-11 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-white/10 focus:bg-white dark:focus:bg-white/10 focus:border-slate-200 transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Right Section: Intelligence & Profile */}
      <div className="flex items-center gap-3 md:gap-5">
        {/* Theme Toggle */}
        <button 
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="h-10 w-10 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
        >
          {mounted ? (resolvedTheme === "dark" ? <Sun size={19} /> : <Moon size={19} />) : <div className="h-5 w-5" />}
        </button>

        {/* Intelligence Level Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-200/60 dark:border-white/5">
          <Zap size={13} className="text-amber-500 fill-amber-500" />
          <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-tighter">Level 12</span>
        </div>

        <div className="h-6 w-px bg-slate-200 dark:bg-white/10 hidden md:block mx-1" />

        {/* Notifications */}
        <button className="h-10 w-10 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all relative">
          <Bell size={19} />
          <span className="absolute top-2.5 right-2.5 h-1.5 w-1.5 bg-rose-500 rounded-full" />
        </button>

        <div className="flex items-center gap-3 group cursor-pointer ml-1">
           <div className="h-9 w-9 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden ring-2 ring-transparent group-hover:ring-indigo-500/20 transition-all">
              <img 
                src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80" 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
           </div>
           <ChevronDown size={14} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
        </div>
      </div>
    </motion.header>
  );
}
