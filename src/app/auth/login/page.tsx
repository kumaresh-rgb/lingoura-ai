"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Sparkles } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white border border-slate-200 rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-12 shadow-sm relative overflow-hidden"
      >
        {/* Background Sparkle */}
        <div className="absolute top-0 right-0 p-8 opacity-[0.05] pointer-events-none">
           <Sparkles size={120} className="text-indigo-600" />
        </div>

        <div className="relative z-10">
          <div className="mb-10 text-center">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-on-surface">Welcome back</h1>
            <p className="text-sm text-slate-500 mt-2 font-medium">Continue your journey with Lingoura AI</p>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="email" 
                  placeholder="name@example.com"
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-4">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Password</label>
                <Link href="/auth/forgot" className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest hover:underline">Forgot?</Link>
              </div>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none font-medium"
                />
              </div>
            </div>

            <button className="w-full primary-gradient text-white py-5 rounded-2xl font-bold text-sm shadow-xl shadow-indigo-100 hover:shadow-indigo-200 transition-all flex items-center justify-center gap-2 active:scale-[0.98]">
              Sign In <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-slate-50 text-center">
            <p className="text-sm text-slate-500 font-medium">
              Don't have an account? <Link href="/auth/signup" className="text-indigo-600 font-bold hover:underline">Sign up for free</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
