"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  BookOpen, 
  Headphones, 
  Mic2, 
  BookText, 
  PenTool, 
  Zap, 
  History, 
  BarChart3, 
  Settings,
  Pin,
  PinOff,
  Sparkles,
  Globe
} from "lucide-react";
import { cn } from "../lib/utils";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Lessons", href: "/lessons", icon: BookOpen },
  { name: "Listening", href: "/listening", icon: Headphones },
  { name: "Speaking", href: "/speaking", icon: Mic2 },
  { name: "Reading", href: "/reading", icon: BookText },
  { name: "Writing", href: "/writing", icon: PenTool },
  { name: "Vocabulary", href: "/vocabulary", icon: Zap },
  { name: "Review", href: "/review", icon: History },
  { name: "Progress", href: "/progress", icon: BarChart3 },
];

export function Sidebar({ isCollapsed, isPinned, togglePin }: { isCollapsed: boolean, isPinned: boolean, togglePin: () => void }) {
  const pathname = usePathname();

  return (
    <motion.aside 
      animate={{ width: isCollapsed ? 80 : 288 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed left-0 top-0 h-screen bg-surface dark:bg-surface-container-low/80 dark:backdrop-blur-xl z-50 flex flex-col border-r border-slate-200/60 dark:border-white/5"
    >
      {/* Brand Section */}
      <div className={cn(
        "h-24 flex items-center px-6 mb-4 transition-all duration-700 ease-[0.22,1,0.36,1]",
        isCollapsed ? "justify-center px-0" : ""
      )}>
        <div className="flex items-center justify-center w-full">
          <img src="/logo-icon.png" alt="Logo" className="h-20 w-auto object-contain mix-blend-multiply dark:mix-blend-normal" />
        </div>
      </div>

      {/* Pin Toggle */}
      <button 
        onClick={togglePin}
        className={cn(
          "absolute right-0 top-10 translate-x-1/2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-full h-8 w-8 flex items-center justify-center shadow-lg hover:shadow-indigo-200 dark:hover:shadow-none transition-all z-50 group/pin",
          isPinned ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 hover:text-slate-900 dark:hover:text-white"
        )}
      >
        {isPinned ? (
          <Pin size={14} className="fill-indigo-600 dark:fill-indigo-400" />
        ) : (
          <PinOff size={14} className="group-hover/pin:scale-110 transition-transform" />
        )}
      </button>

      {/* Navigation */}
      <div className="flex-1 px-3 flex flex-col gap-0.5 overflow-y-auto scrollbar-hide">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex items-center gap-3 p-2.5 rounded-lg transition-all duration-200 group relative",
                isActive 
                  ? "bg-indigo-50/50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold shadow-sm shadow-indigo-100/20" 
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              <div className="flex-shrink-0">
                <item.icon size={18} className={cn(isActive ? "text-indigo-600" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300")} />
              </div>
              
              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="text-sm tracking-tight truncate"
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Active Indicator Bar */}
              {isActive && (
                <motion.div 
                  layoutId="active-indicator"
                  className="absolute left-0 w-1 h-5 bg-indigo-500 rounded-r-full" 
                />
              )}

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-14 bg-slate-900 text-white text-[10px] py-1.5 px-3 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-2 group-hover:translate-x-0 shadow-xl whitespace-nowrap z-[60] font-medium">
                  {item.name}
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-slate-100 dark:border-white/5 flex flex-col gap-1">
        {/* Pro Status Mini Card */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div 
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200/60 dark:border-white/5 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Plan Status</span>
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-1.5 py-0.5 rounded">PRO</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm">
                  <Sparkles size={14} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">Advanced AI</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Unlimited practice</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Link 
          href="/settings"
          className={cn(
            "flex items-center gap-3 p-2.5 rounded-lg transition-all duration-200 group relative",
            pathname === "/settings" ? "bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white font-semibold" : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5"
          )}
        >
          <Settings size={18} className={cn(pathname === "/settings" ? "text-slate-900 dark:text-white" : "text-slate-400")} />
          {!isCollapsed && <span className="text-sm font-medium">Settings</span>}
        </Link>
      </div>
    </motion.aside>
  );
}
