"use client";

import React from "react";

export function MeshBackground() {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden select-none">
      <div className="absolute inset-0 bg-[#FAFBFF] dark:bg-[#020617]" />
      <div className="absolute inset-0 opacity-[0.7] dark:opacity-[0.15] blur-[100px]">
        {/* Top Left - Indigo */}
        <div className="absolute top-0 left-0 w-[50vw] h-[50vh] bg-indigo-200/50 dark:bg-indigo-500/20 rounded-full translate-x-[-20%] translate-y-[-20%]" />
        
        {/* Top Right - Rose/Pink */}
        <div className="absolute top-0 right-0 w-[60vw] h-[60vh] bg-rose-200/60 dark:bg-rose-500/30 rounded-full translate-x-[20%] translate-y-[-20%]" />
        
        {/* Bottom Left - Blue */}
        <div className="absolute bottom-0 left-0 w-[50vw] h-[50vh] bg-blue-200/40 dark:bg-blue-500/20 rounded-full translate-x-[-20%] translate-y-[20%]" />
        
        {/* Bottom Right - Pink/Indigo */}
        <div className="absolute bottom-0 right-0 w-[60vw] h-[60vh] bg-pink-300/50 dark:bg-pink-500/30 rounded-full translate-x-[20%] translate-y-[20%]" />
        
        {/* Center - Rose Glow */}
        <div className="absolute top-1/2 left-1/2 w-[70vw] h-[70vh] bg-rose-100/60 dark:bg-rose-500/10 rounded-full translate-x-[-50%] translate-y-[-50%]" />
      </div>
    </div>
  );
}
