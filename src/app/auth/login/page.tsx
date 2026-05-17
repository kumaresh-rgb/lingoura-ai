'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';

export default function LoginPage() {
  return (
    // Updated background to match your landing page deep dark theme
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#030712] p-6 selection:bg-indigo-500/30 dark:bg-slate-950">
      {/* Decorative Ambient Background Glows */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 blur-[120px]" />

      {/* Brand Logo - consistency with your navbar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 mb-8"
      >
        <Link href="/" className="group flex items-center gap-2">
          <span className="text-2xl font-extrabold tracking-tight text-white">
            Lingoura{' '}
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              AI
            </span>
          </span>
        </Link>
      </motion.div>

      {/* Main Login Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative z-10 w-full max-w-md overflow-hidden rounded-[2.5rem] border border-slate-800/80 bg-slate-900/40 p-8 shadow-2xl backdrop-blur-xl md:p-10"
      >
        {/* Subtle Background Sparkle with brand glow */}
        <div className="pointer-events-none absolute top-0 right-0 p-6 text-indigo-400 opacity-[0.08]">
          <Sparkles size={100} />
        </div>

        <div>
          {/* Header Typography tuned to match "Master English with Precision AI" */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl">
              Welcome back
            </h1>
            <p className="mt-2 text-xs font-medium tracking-wide text-slate-400">
              Continue your journey with Lingoura AI
            </p>
          </div>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            {/* Email Input Field */}
            <div className="space-y-2">
              <label className="ml-2 text-[10px] font-bold tracking-[0.15em] text-slate-400 uppercase">
                Email Address
              </label>
              <div className="group relative">
                <Mail
                  size={16}
                  className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-indigo-400"
                />
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full rounded-full border border-slate-800/60 bg-slate-950/60 py-3.5 pr-6 pl-12 text-sm font-medium text-white transition-all outline-none placeholder:text-slate-600 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>
            </div>

            {/* Password Input Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-2">
                <label className="text-[10px] font-bold tracking-[0.15em] text-slate-400 uppercase">
                  Password
                </label>
                <Link
                  href="/auth/forgot"
                  className="text-[10px] font-bold tracking-[0.15em] text-indigo-400 uppercase transition-colors hover:text-indigo-300"
                >
                  Forgot?
                </Link>
              </div>
              <div className="group relative">
                <Lock
                  size={16}
                  className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-indigo-400"
                />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full rounded-full border border-slate-800/60 bg-slate-950/60 py-3.5 pr-6 pl-12 text-sm font-medium text-white transition-all outline-none placeholder:text-slate-700 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>
            </div>

            {/* Action Button styled using your brand's signature CTA profile */}
            <button className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-4 text-xs font-bold tracking-widest text-white uppercase shadow-lg shadow-indigo-600/20 transition-all hover:opacity-95 hover:shadow-indigo-600/40 active:scale-[0.98]">
              Sign In{' '}
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          {/* Footer Link section matching your capsule layout rules */}
          <div className="mt-8 border-t border-slate-800/60 pt-6 text-center">
            <p className="text-xs font-medium text-slate-400">
              Don't have an account?{' '}
              <Link
                href="/auth/signup"
                className="font-bold text-indigo-400 transition-colors hover:text-indigo-300"
              >
                Sign up for free
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
