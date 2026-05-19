'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useUiStore } from '@/shared/store/ui.store';
import { useSubscriptionStore } from '@/features/billing/store/subscription.store';
import { PLAN_DISPLAY_NAMES } from '@/shared/constants/plan-limits';
import { ROUTES } from '@/shared/constants/routes';

const navItems = [
  { name: 'Dashboard', href: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { name: 'Lessons', href: ROUTES.LESSONS, icon: BookOpen },
  { name: 'Listening', href: ROUTES.LISTENING, icon: Headphones },
  { name: 'Speaking', href: ROUTES.SPEAKING, icon: Mic2 },
  { name: 'Reading', href: ROUTES.READING, icon: BookText },
  { name: 'Writing', href: ROUTES.WRITING, icon: PenTool },
  { name: 'Vocabulary', href: ROUTES.VOCABULARY, icon: Zap },
  { name: 'Review', href: ROUTES.REVIEW, icon: History },
  { name: 'Progress', href: ROUTES.PROGRESS, icon: BarChart3 },
];

interface SidebarProps {
  isCollapsed: boolean;
}

export function Sidebar({ isCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const { sidebarPinned, setSidebarPinned } = useUiStore();
  const { plan, periodEnd } = useSubscriptionStore();
  const isPro = plan !== 'FREE';
  const renewalDate = periodEnd ? new Date(periodEnd).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : null;

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 80 : 288 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed left-0 top-0 h-screen bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl z-50 flex flex-col border-r border-slate-200/60 dark:border-white/5 overflow-hidden"
    >
      {/* Brand */}
      <div className="h-20 flex items-center px-4 shrink-0 overflow-hidden">
        {isCollapsed ? (
          <div className="flex justify-center w-full">
            <Image
              src="/logo-icon.png"
              alt="Lingoura AI"
              width={36}
              height={36}
              className="object-contain shrink-0"
              priority
            />
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            <Image
              src="/logo-icon.png"
              alt="Lingoura AI"
              width={36}
              height={36}
              className="object-contain shrink-0"
              priority
            />
            <span className="text-[17px] font-black tracking-tight whitespace-nowrap">
              <span className="text-violet-600 dark:text-violet-400">Lingoura</span>
              <span className="bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent"> AI</span>
            </span>
          </div>
        )}
      </div>

      {/* Pin toggle */}
      <button
        onClick={() => setSidebarPinned(!sidebarPinned)}
        aria-label={sidebarPinned ? 'Unpin sidebar' : 'Pin sidebar'}
        className={cn(
          'absolute right-0 top-10 translate-x-1/2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-full h-7 w-7 flex items-center justify-center shadow-md transition-all z-50 group/pin',
          sidebarPinned
            ? 'text-indigo-600 dark:text-indigo-400'
            : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'
        )}
      >
        {sidebarPinned ? (
          <Pin size={12} className="fill-indigo-600 dark:fill-indigo-400" />
        ) : (
          <PinOff size={12} className="group-hover/pin:scale-110 transition-transform" />
        )}
      </button>

      {/* Nav items */}
      <nav className="flex-1 px-2.5 flex flex-col gap-0.5 overflow-y-auto" aria-label="Main navigation">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 p-2.5 rounded-xl transition-all duration-150 group relative border border-transparent',
                isActive
                  ? 'bg-indigo-50/70 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-semibold border-indigo-100/60 dark:border-indigo-500/20'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-white/8 hover:text-slate-900 dark:hover:text-white hover:border-slate-200/50 dark:hover:border-white/10'
              )}
            >
              <div className="shrink-0 w-[18px]">
                <item.icon
                  size={18}
                  className={cn(
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'
                  )}
                />
              </div>

              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="text-sm tracking-tight truncate"
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 w-0.5 h-5 bg-indigo-500 rounded-r-full"
                />
              )}

              {/* Collapsed tooltip */}
              {isCollapsed && (
                <div className="absolute left-14 bg-slate-900 dark:bg-slate-700 text-white text-[10px] py-1.5 px-2.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-1 group-hover:translate-x-0 shadow-xl whitespace-nowrap z-[60] font-medium">
                  {item.name}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-2.5 border-t border-slate-100 dark:border-white/5 flex flex-col gap-1 shrink-0">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="p-3 mb-1 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200/60 dark:border-white/5 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  Plan Status
                </span>
                <span className={cn(
                  'text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase',
                  isPro
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10'
                    : 'text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/5'
                )}>
                  {PLAN_DISPLAY_NAMES[plan as keyof typeof PLAN_DISPLAY_NAMES] ?? plan}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className={cn(
                  'h-8 w-8 rounded-lg border flex items-center justify-center',
                  isPro
                    ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-white/10 text-indigo-600 dark:text-indigo-400'
                    : 'bg-slate-50 dark:bg-white/3 border-slate-200 dark:border-white/5 text-slate-400'
                )}>
                  <Sparkles size={13} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white leading-none mb-0.5">
                    {isPro ? `${PLAN_DISPLAY_NAMES[plan as keyof typeof PLAN_DISPLAY_NAMES] ?? plan} Plan` : 'Free Plan'}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    {isPro && renewalDate ? `Renews ${renewalDate}` : isPro ? 'Active' : 'Upgrade for more'}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Link
          href={ROUTES.SETTINGS}
          className={cn(
            'flex items-center gap-3 p-2.5 rounded-xl transition-all duration-150 group',
            pathname === ROUTES.SETTINGS
              ? 'bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
          )}
        >
          <Settings
            size={18}
            className={cn(
              pathname === ROUTES.SETTINGS
                ? 'text-slate-900 dark:text-white'
                : 'text-slate-400 dark:text-slate-500'
            )}
          />
          {!isCollapsed && <span className="text-sm font-medium">Settings</span>}
        </Link>
      </div>
    </motion.aside>
  );
}
