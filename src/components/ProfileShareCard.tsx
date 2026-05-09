"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Share2, Download, Award, Sparkles, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProfileShareCard({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white dark:bg-[#1e293b] rounded-[3rem] shadow-2xl relative z-10 w-full max-w-lg overflow-hidden border border-white/20"
          >
            {/* Card Content (This is what gets "shared") */}
            <div className="p-1 relative">
               <div className="bg-slate-900 rounded-[2.8rem] p-10 text-white relative overflow-hidden aspect-[4/5] flex flex-col justify-between">
                  {/* Decorative Background Elements */}
                  <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-500/20 blur-[80px] rounded-full" />
                  <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-pink-500/10 blur-[60px] rounded-full" />
                  
                  <div className="relative z-10">
                     <div className="flex justify-between items-start mb-12">
                        <div className="flex items-center gap-3">
                           <img src="/logo-icon.png" alt="Logo" className="h-12 w-auto" />
                           <div className="flex flex-col">
                              <span className="text-xl font-black tracking-tight leading-none bg-gradient-to-r from-[#4F46E5] to-[#EC4899] bg-clip-text text-transparent">Lingoura AI</span>
                              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">Certified Mastery</span>
                           </div>
                        </div>
                        <Award className="text-indigo-400" size={32} />
                     </div>

                     <div className="space-y-6">
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">Fluency Profile</p>
                        <h2 className="text-4xl font-black tracking-tight">Alex Newman</h2>
                        
                        <div className="grid grid-cols-2 gap-8 pt-8">
                           <div>
                              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Mastery Level</p>
                              <p className="text-2xl font-black text-indigo-400">C1 Advanced</p>
                           </div>
                           <div>
                              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Fluency Score</p>
                              <p className="text-2xl font-black text-emerald-400">88%</p>
                           </div>
                           <div>
                              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Active Streak</p>
                              <p className="text-2xl font-black text-orange-400">12 Days</p>
                           </div>
                           <div>
                              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Velocity</p>
                              <p className="text-2xl font-black text-pink-400">+18.4%</p>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="relative z-10 pt-10 border-t border-white/5 flex justify-between items-end">
                     <div>
                        <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.5em] mb-2">ID: LQ-2026-X99</p>
                        <div className="flex gap-2">
                           <div className="h-2 w-8 bg-indigo-500 rounded-full" />
                           <div className="h-2 w-2 bg-white/10 rounded-full" />
                           <div className="h-2 w-2 bg-white/10 rounded-full" />
                        </div>
                     </div>
                     <Globe className="text-white/10" size={40} />
                  </div>
               </div>
            </div>

            {/* Actions Footer */}
            <div className="p-8 bg-slate-50 dark:bg-slate-800/50 flex gap-4">
               <button className="flex-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-3 active:scale-95 transition-all">
                  <Download size={18} /> Download Image
               </button>
               <button className="h-14 w-14 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center active:scale-95 transition-all">
                  <Share2 size={20} />
               </button>
               <button 
                  onClick={onClose}
                  className="h-14 w-14 bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-slate-400 rounded-2xl flex items-center justify-center hover:bg-rose-100 hover:text-rose-600 transition-all"
               >
                  <X size={20} />
               </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
