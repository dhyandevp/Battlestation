"use client";

import React from "react";
import { motion } from "framer-motion";
import useSWR from "swr";
import { 
  Server, Shield, HardDrive, Power, RefreshCw, 
  Trash2, Activity, Play, SkipForward, Pause 
} from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Reusable Antigravity Card Wrapper mapping massive diffused shadows
const FloatingCard = ({ children, className = "", delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: [0, -8, 0] }}
    transition={{ 
      y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay },
      opacity: { duration: 0.8 }
    }}
    whileHover={{ y: -16, scale: 1.02 }}
    className={`bg-[#F2ECE4]/70 backdrop-blur-2xl rounded-3xl p-6 shadow-[0_30px_60px_rgba(0,0,0,0.05)] hover:shadow-[0_45px_70px_rgba(0,0,0,0.08)] transition-shadow duration-500 border border-white/40 ${className}`}
  >
    {children}
  </motion.div>
);

export default function CommandCenter() {
  // SWR continuously polls Vercel backend every 5 seconds for telemetry
  const { data: metrics } = useSWR('/api/metrics', fetcher, { refreshInterval: 5000 });

  return (
    <div className="min-h-screen bg-[#F9F7F3] text-gray-800 p-8 font-sans overflow-hidden relative selection:bg-[#E8A87C] selection:text-white">
      {/* Abstract background auroras for extreme depth */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#E27D60]/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#C38D9E]/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 pt-4">
        
        {/* --- HERO SECTION --- */}
        <header className="col-span-12 flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pl-2 gap-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1 }}>
            <h1 className="text-4xl font-light tracking-tight text-gray-900">
              Welcome Back, <span className="font-semibold text-[#E27D60]">Dhyandev</span>
            </h1>
            <p className="text-gray-500 mt-2 font-medium tracking-wide">Antigravity systems nominal.</p>
          </motion.div>

          <div className="flex flex-wrap gap-4">
            <StatusPill icon={<Server size={14}/>} label="Network" status="Healthy" color="text-[#85C1A9]" delay={0.1} />
            <StatusPill icon={<Shield size={14}/>} label="Security" status="Active" color="text-[#C38D9E]" delay={0.2} />
            <StatusPill icon={<HardDrive size={14}/>} label="Storage" status="78%" color="text-[#E8A87C]" delay={0.3} />
          </div>
        </header>

        {/* --- LEFT COLUMN: Environment & Actions --- */}
        <div className="col-span-1 md:col-span-4 flex flex-col gap-8">
          
          {/* Server Environment */}
          <FloatingCard className="h-72 flex flex-col justify-between overflow-hidden relative" delay={0}>
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#E8A87C]/10 mix-blend-multiply" />
            <div className="z-10">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Live View</h2>
              <p className="text-2xl font-medium text-gray-800 tracking-tight">Rack Alpha-01</p>
            </div>
            {/* Abstract 3D Render Illusion Placeholder */}
            <div className="z-10 self-center mb-4">
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                className="w-36 h-36 border-[1px] border-[#E27D60]/20 rounded-full flex items-center justify-center border-dashed"
              >
                <div className="w-24 h-24 bg-gradient-to-tr from-[#E27D60]/20 to-[#C38D9E]/20 rounded-full blur-[8px] object-cover animate-pulse shadow-inner" />
              </motion.div>
            </div>
          </FloatingCard>

          {/* Weightless Quick Actions */}
          <FloatingCard delay={0.2}>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">Quick Actions</h2>
            <div className="space-y-4">
              <ActionToggle label="Reboot Proxmox Node" icon={<Power size={18} />} color="text-[#E27D60]" action="reboot_pve" />
              <ActionToggle label="Restart Portainer" icon={<RefreshCw size={18} />} color="text-[#E8A87C]" action="restart_portainer" />
              <ActionToggle label="Flush Pi-hole DNS" icon={<Trash2 size={18} />} color="text-[#C38D9E]" action="flush_dns" />
            </div>
          </FloatingCard>
        </div>

        {/* --- CENTER COLUMN: The Dial & Lifestyle --- */}
        <div className="col-span-1 md:col-span-4 flex flex-col gap-8">
          
          {/* The Floating Dial (Suspended in Space) */}
          <FloatingCard className="flex flex-col items-center justify-center py-12 relative" delay={0.1}>
             <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest absolute top-6 left-6">Cluster Physics</h2>
             <div className="relative w-56 h-auto mt-6">
               <svg viewBox="0 0 100 55" className="w-full h-full overflow-visible drop-shadow-xl" aria-label="Temperature Dial">
                 <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#E5D9C5" strokeWidth="3" strokeLinecap="round" />
                 <motion.path 
                   d="M 10 50 A 40 40 0 0 1 90 50" 
                   fill="none" 
                   stroke="#E27D60" 
                   strokeWidth="3.5" 
                   strokeLinecap="round" 
                   strokeDasharray="125"
                   // Mathematical offset calculation
                   strokeDashoffset={125 - (125 * (metrics?.cpuTemp || 48)) / 100}
                   transition={{ duration: 1.5, ease: "easeOut" }}
                 />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-end pb-1 text-center">
                 <span className="text-5xl font-light text-gray-800 tracking-tighter">{metrics?.cpuTemp || "48"}&deg;C</span>
                 <span className="text-[10px] text-[#E8A87C] font-bold tracking-widest mt-1">CPU THERMALS</span>
               </div>
             </div>
          </FloatingCard>

          {/* Haryanvi Media Player */}
          <FloatingCard delay={0.3} className="flex items-center gap-5">
            <div className="w-16 h-16 min-w-[64px] rounded-2xl bg-gradient-to-br from-[#E27D60] to-[#E8A87C] shadow-[0_10px_20px_rgba(226,125,96,0.2)] flex items-center justify-center text-white relative overflow-hidden">
               <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 bg-white/20 rounded-full blur-xl" />
               <Activity size={24} className="relative z-10" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-gray-800 truncate">Desi Kalakaar</h3>
              <p className="text-xs text-gray-400 mt-1 font-medium truncate">Haryanvi Flow &middot; Playing</p>
            </div>
            <div className="flex items-center gap-4 text-[#C38D9E]">
              <button aria-label="Pause" className="hover:text-[#E27D60] transition-colors"><Pause size={20} fill="currentColor" /></button>
              <button aria-label="Skip Forward" className="hover:text-[#E27D60] transition-colors"><SkipForward size={20} fill="currentColor" /></button>
            </div>
          </FloatingCard>

          {/* Recreation Status */}
          <FloatingCard delay={0.4} className="flex justify-between items-center py-5">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Recreation Node</p>
              <p className="text-sm font-semibold text-gray-800 mt-1">Red Dead Redemption 2</p>
            </div>
            <div className="flex items-center gap-2 bg-[#85C1A9]/10 px-3 py-1.5 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#85C1A9] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#85C1A9]"></span>
              </span>
              <span className="text-[10px] font-bold tracking-widest text-[#85C1A9]">ONLINE</span>
            </div>
          </FloatingCard>
        </div>

        {/* --- RIGHT COLUMN: Activity & Skill Tracking --- */}
        <div className="col-span-1 md:col-span-4 flex flex-col gap-8">
          
          {/* Skill & Weekend Project Tracker */}
          <FloatingCard delay={0.2} className="flex-1">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">IT Mastery Roadmap</h2>
            <div className="space-y-5">
              <ProgressBar label="Linux Core Internals" progress={75} color="bg-[#E27D60]" />
              <ProgressBar label="Docker Orchestration" progress={90} color="bg-[#E8A87C]" />
              <ProgressBar label="AI Systems Integration" progress={40} color="bg-[#C38D9E]" />
            </div>
            <div className="mt-8 pt-5 border-t border-gray-200/50">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide">Weekend Project</h3>
              </div>
              <div className="bg-white/40 border border-white/50 rounded-xl p-4 shadow-sm">
                  <p className="text-sm text-gray-700 font-medium leading-relaxed">Local LLM Agent with Ollama</p>
                  <p className="text-xs mt-2 text-[#E27D60] font-bold">IN PROGRESS</p>
              </div>
            </div>
          </FloatingCard>

          {/* Floating Bubble Activity Feed */}
          <FloatingCard delay={0.4}>
            <div className="flex justify-between items-center mb-5">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Telemetry Stream</h2>
                <span className="text-[10px] font-bold text-[#E8A87C] bg-[#E8A87C]/10 px-2 py-1 rounded-full uppercase">Live</span>
            </div>
            <div className="relative border-l-2 border-white/60 ml-3 space-y-6">
              <ActivityLog time="Just now" msg="Container 'nginx-proxy' updated successfully." variant="info" />
              <ActivityLog time="12m ago" msg="SSH login attempt blocked." variant="alert" />
              <ActivityLog time="1h ago" msg="Proxmox snapshot completed." variant="success" />
            </div>
          </FloatingCard>
        </div>

      </div>
    </div>
  );
}

// --- MICRO-COMPONENTS --- //

const StatusPill = ({ icon, label, status, color, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay, duration: 0.5 }}
    className="flex items-center gap-2 bg-[#F2ECE4]/90 backdrop-blur-md px-4 py-2 rounded-full shadow-[0_10px_20px_rgba(0,0,0,0.03)] border border-white/50"
  >
    <span className={color}>{icon}</span>
    <span className="text-[11px] font-bold text-gray-700 tracking-wide uppercase">{label}</span>
  </motion.div>
);

const ActionToggle = ({ label, icon, color, action }: any) => {
  const handleAction = async () => {
    await fetch('/api/docker-control', { method: 'POST', body: JSON.stringify({ action }) });
  };
  return (
    <motion.button 
      whileHover={{ scale: 1.03, x: 2 }} whileTap={{ scale: 0.97 }} onClick={handleAction}
      className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/40 hover:bg-white/70 transition-colors shadow-[0_4px_10px_rgba(0,0,0,0.02)] border border-white/30"
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl bg-white shadow-sm ${color}`}>{icon}</div>
        <span className="text-sm font-semibold text-gray-700">{label}</span>
      </div>
      {/* Tactile Switch Visual */}
      <div className="w-10 h-6 bg-white border border-gray-100 rounded-full relative shadow-inner">
        <div className="absolute top-[3px] left-[3px] w-4 h-4 bg-gray-200 rounded-full shadow-sm" />
      </div>
    </motion.button>
  );
};

const ProgressBar = ({ label, progress, color }: any) => (
  <div>
    <div className="flex justify-between text-xs font-bold mb-2">
      <span className="text-gray-600">{label}</span>
      <span className="text-gray-400">{progress}%</span>
    </div>
    <div className="h-2 w-full bg-white/60 rounded-full overflow-hidden shadow-inner">
      <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1.2, ease: "easeOut" }} className={`h-full ${color} rounded-full`} />
    </div>
  </div>
);

const ActivityLog = ({ time, msg, variant }: any) => {
  const colors: Record<string, string> = { info: "bg-[#E8A87C]", alert: "bg-[#E27D60]", success: "bg-[#85C1A9]" };
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="relative pl-6">
      <span className={`absolute top-1 left-[-6px] w-3 h-3 rounded-full ${colors[variant]} ring-4 ring-[#F2ECE4] shadow-sm`} />
      <p className="text-[10px] text-gray-400 font-bold mb-0.5 uppercase tracking-wider">{time}</p>
      <p className="text-sm text-gray-700 font-medium">{msg}</p>
    </motion.div>
  );
};
