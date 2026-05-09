"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Bell, 
  Shield, 
  Mic2, 
  Globe, 
  CreditCard, 
  LogOut,
  ChevronRight,
  UserCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  return (
    <div className="space-y-8 md:space-y-10 max-w-4xl">
      {/* Header Section */}
      <section>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm md:text-base font-medium">
          Manage your account, preferences, and learning goals.
        </p>
      </section>

      <div className="space-y-6">
        
        {/* Profile Section */}
        <section className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-10 shadow-sm">
           <div className="flex items-center gap-8 mb-10">
              <div className="relative group cursor-pointer">
                <div className="h-24 w-24 rounded-[2rem] overflow-hidden border-4 border-indigo-50 dark:border-indigo-500/20 transition-all group-hover:border-indigo-100 dark:group-hover:border-indigo-500/40">
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80" 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-2 rounded-xl shadow-sm text-indigo-600 dark:text-indigo-400">
                  <UserCircle size={16} />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Sarah Jenkins</h3>
                <p className="text-sm font-medium text-slate-400 dark:text-slate-500">sarah.j@example.com</p>
                <div className="flex gap-2 mt-3">
                  <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-widest rounded-lg">Pro Member</span>
                  <span className="px-3 py-1 bg-slate-50 dark:bg-white/10 text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest rounded-lg">B2 Level</span>
                </div>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">Full Name</label>
                <input type="text" defaultValue="Sarah Jenkins" className="w-full p-4 bg-slate-50 dark:bg-white/5 border-none rounded-2xl font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">Email</label>
                <input type="email" defaultValue="sarah.j@example.com" className="w-full p-4 bg-slate-50 dark:bg-white/5 border-none rounded-2xl font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white" />
              </div>
           </div>
        </section>

        {/* General Settings */}
        <section className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-6 shadow-sm divide-y divide-slate-50 dark:divide-white/5">
           <SettingsItem icon={<Bell />} label="Notifications" desc="Manage your alerts and daily reminders" />
           <SettingsItem icon={<Mic2 />} label="Voice Settings" desc="Configure your microphone and speech recognition" />
           <SettingsItem icon={<Globe />} label="Language & Region" desc="English (US), Timezone: EST" />
           <SettingsItem icon={<Shield />} label="Security & Privacy" desc="Password, 2FA, and data preferences" />
           <SettingsItem icon={<CreditCard />} label="Subscription" desc="Your next billing date is June 12, 2026" />
        </section>

        {/* Danger Zone */}
        <button className="w-full p-6 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-[2.5rem] font-bold flex items-center justify-center gap-2 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all group">
           <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" /> Sign Out
        </button>

      </div>
    </div>
  );
}

function SettingsItem({ icon, label, desc }: { icon: React.ReactNode; label: string; desc: string }) {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-slate-50/50 dark:hover:bg-white/10 transition-all cursor-pointer group rounded-2xl">
      <div className="flex items-center gap-5">
        <div className="h-12 w-12 rounded-2xl bg-slate-50 dark:bg-white/10 flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/20 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-all">
           {React.cloneElement(icon as any, { size: 20 })}
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900 dark:text-white">{label}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">{desc}</p>
        </div>
      </div>
      <ChevronRight size={18} className="text-slate-300 dark:text-slate-700 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-all" />
    </div>
  );
}
