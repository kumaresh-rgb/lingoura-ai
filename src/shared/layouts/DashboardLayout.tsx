'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useUiStore } from '@/shared/store/ui.store';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { sidebarPinned } = useUiStore();
  const [isHovered, setIsHovered] = useState(false);

  // Collapsed when not pinned and not hovered
  const isCollapsed = !sidebarPinned && !isHovered;

  return (
    <div className="min-h-screen bg-transparent">
      <Header isSidebarCollapsed={isCollapsed} />

      <div className="flex">
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="h-screen shrink-0"
        >
          <Sidebar isCollapsed={isCollapsed} />
        </div>

        <motion.main
          animate={{ marginLeft: sidebarPinned ? (isCollapsed ? 80 : 288) : 80 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 min-h-screen pt-20"
        >
          <div className="p-4 md:p-8 lg:p-10 w-full">
            <div className="max-w-[1600px] mx-auto w-full">{children}</div>
          </div>
        </motion.main>
      </div>
    </div>
  );
}
