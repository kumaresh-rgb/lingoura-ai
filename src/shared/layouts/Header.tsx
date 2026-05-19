'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import {
  Bell,
  Search,
  ChevronDown,
  Zap,
  ShieldCheck,
  Sun,
  Moon,
  LogOut,
  Menu,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/shared/lib/utils';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { useLogout } from '@/features/auth/hooks/useLogout';
import { useUiStore } from '@/shared/store/ui.store';

interface HeaderProps {
  isSidebarCollapsed: boolean;
}

export function Header({ isSidebarCollapsed }: HeaderProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const user = useCurrentUser();
  const logout = useLogout();
  const { setMobileSidebarOpen } = useUiStore();

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <motion.header
      animate={{ left: isDesktop ? (isSidebarCollapsed ? 80 : 288) : 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 right-0 h-20 bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl border-b border-slate-200/40 dark:border-white/5 z-40 px-4 md:px-8 flex items-center justify-between"
    >
      {/* Left */}
      <div className="flex items-center gap-3 lg:gap-5">
        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="lg:hidden h-9 w-9 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
          aria-label="Open navigation"
        >
          <Menu size={20} />
        </button>

        {/* Mobile brand */}
        <div className="flex items-center gap-2.5 lg:hidden">
          <Image src="/logo-icon.png" alt="Lingoura AI" width={32} height={32} className="object-contain" />
          <span className="font-black text-base tracking-tight bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 bg-clip-text text-transparent">
            Lingoura AI
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-5">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50/60 dark:bg-emerald-500/10 rounded-full border border-emerald-100/60 dark:border-emerald-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">
              System Active
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <ShieldCheck size={13} />
            <span className="text-[11px] font-medium">End-to-End Encrypted</span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-xl mx-10 hidden md:block">
        <div className="relative group">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-600 dark:group-focus-within:text-slate-300 transition-colors pointer-events-none"
          />
          <input
            type="search"
            placeholder="Search (⌘K)"
            className="w-full bg-slate-100/60 dark:bg-white/5 border border-transparent rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white dark:focus:bg-white/8 focus:border-slate-200/80 dark:focus:border-white/10 transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Theme toggle */}
        <button
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          className="h-9 w-9 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
          aria-label="Toggle theme"
        >
          {mounted ? (
            resolvedTheme === 'dark' ? <Sun size={17} /> : <Moon size={17} />
          ) : (
            <div className="h-[17px] w-[17px]" />
          )}
        </button>

        {/* Level badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-200/60 dark:border-white/5">
          <Zap size={12} className="text-amber-500 fill-amber-500" />
          <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-tight">
            Level 12
          </span>
        </div>

        <div className="h-5 w-px bg-slate-200 dark:bg-white/10 hidden md:block" />

        {/* Notifications */}
        <button
          className="h-9 w-9 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all relative"
          aria-label="Notifications"
        >
          <Bell size={17} />
          <span className="absolute top-2 right-2 h-1.5 w-1.5 bg-rose-500 rounded-full" />
        </button>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu((v) => !v)}
            className="flex items-center gap-2 group ml-1"
            aria-label="User menu"
            aria-expanded={showUserMenu}
          >
            <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-500/20 overflow-hidden ring-2 ring-transparent group-hover:ring-indigo-500/25 transition-all flex items-center justify-center">
              {user?.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt={user.displayName}
                  width={32}
                  height={32}
                  className="object-cover"
                />
              ) : (
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  {user?.displayName?.charAt(0).toUpperCase() ?? 'U'}
                </span>
              )}
            </div>
            <ChevronDown
              size={13}
              className={cn(
                'text-slate-400 group-hover:text-slate-600 transition-all duration-200',
                showUserMenu && 'rotate-180'
              )}
            />
          </button>

          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute right-0 top-12 w-52 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 dark:border-white/5">
                  <p className="text-sm font-semibold text-on-surface truncate">
                    {user?.displayName ?? 'User'}
                  </p>
                  <p className="text-xs text-on-surface-variant truncate">{user?.email}</p>
                </div>
                <div className="p-1.5">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      logout.mutate();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut size={15} />
                    Sign out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.header>
  );
}
