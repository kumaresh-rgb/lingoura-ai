"use client";

import React from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isPinned, setIsPinned] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const pathname = usePathname();

  // Persistence: Load pin state from localStorage on mount
  React.useEffect(() => {
    const savedPin = localStorage.getItem("sidebar-pinned");
    if (savedPin === "true") {
      setIsPinned(true);
    }
  }, []);

  // Persistence: Save pin state to localStorage when it changes
  const togglePin = () => {
    const nextPin = !isPinned;
    setIsPinned(nextPin);
    localStorage.setItem("sidebar-pinned", nextPin.toString());
  };

  // Sidebar is collapsed ONLY if it's NOT pinned AND NOT hovered
  const isCollapsed = !isPinned && !isHovered;

  return (
    <div className="min-h-screen bg-transparent relative">
      <Header isSidebarCollapsed={isCollapsed} />
      
      <div className="flex relative">
        <div 
          onMouseEnter={() => setIsHovered(true)} 
          onMouseLeave={() => setIsHovered(false)}
          className="h-screen flex-shrink-0"
        >
          <Sidebar 
            isCollapsed={isCollapsed} 
            isPinned={isPinned}
            togglePin={togglePin}
          />
        </div>
        
        <motion.main 
          animate={{ 
            marginLeft: isPinned ? (isCollapsed ? 80 : 288) : 80 
          }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 pt-20"
        >
          <div className="p-4 md:p-8 lg:p-12 w-full">
            {/* Page content rendered instantly without full-page animations for better performance */}
            <div className="max-w-[1600px] mx-auto w-full">
              {children}
            </div>
          </div>
        </motion.main>
      </div>
    </div>
  );
}
