'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useUiStore } from '@/shared/store/ui.store';
import { UpgradeModal } from '@/features/billing/components/UpgradeModal';

function MobileSidebar() {
  const { mobileSidebarOpen, setMobileSidebarOpen } = useUiStore();
  const pathname = usePathname();

  // Close on route change
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname, setMobileSidebarOpen]);

  // Close on ESC
  useEffect(() => {
    if (!mobileSidebarOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileSidebarOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [mobileSidebarOpen, setMobileSidebarOpen]);

  return (
    <AnimatePresence>
      {mobileSidebarOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="mobile-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
            aria-hidden
          />

          {/* Drawer */}
          <motion.div
            key="mobile-drawer"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed left-0 top-0 bottom-0 z-[70] w-72 lg:hidden"
            style={{ willChange: 'transform' }}
          >
            {/* Close button */}
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="absolute top-4 right-4 z-10 h-8 w-8 rounded-full bg-white/10 dark:bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              aria-label="Close navigation"
            >
              <X size={16} />
            </button>
            {/* Reuse Sidebar in always-expanded mode */}
            <Sidebar isCollapsed={false} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return isDesktop;
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { sidebarPinned } = useUiStore();
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname();
  const isDesktop = useIsDesktop();

  // Collapsed when not pinned and not hovered
  const isCollapsed = !sidebarPinned && !isHovered;

  return (
    <div className="min-h-screen bg-transparent">
      <Header isSidebarCollapsed={isCollapsed} />

      <div className="flex">
        {/* Desktop sidebar — hidden on mobile */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="h-screen shrink-0 hidden lg:block"
        >
          <Sidebar isCollapsed={isCollapsed} />
        </div>

        <motion.main
          animate={{ marginLeft: isDesktop ? (sidebarPinned ? (isCollapsed ? 80 : 288) : 80) : 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 min-h-screen pt-20 min-w-0 overflow-x-hidden"
        >
          <div className="p-4 md:p-8 lg:p-10 w-full">
            <div className="max-w-[1600px] mx-auto w-full">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={pathname}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  style={{ willChange: 'opacity, transform' }}
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.main>
      </div>

      {/* Mobile slide-over sidebar */}
      <MobileSidebar />

      <UpgradeModal />
    </div>
  );
}
