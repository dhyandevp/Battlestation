"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import useSWR from "swr";
import { format } from "date-fns";
import {
  Bell, Activity, Wind, Droplet, ShieldCheck,
  ChevronRight, Power, RefreshCw, Trash2,
  Play, Pause, SkipForward, SkipBack, Lock, Unlock,
  Home, Bed, Car, TreePine, Plus, Server, CheckCircle2, Circle
} from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Main smooth floating card wrapper
const GlassCard = ({ children, className = "", delay = 0, hover = true }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay, ease: "easeOut" }}
    whileHover={hover ? { y: -5, transition: { duration: 0.2 } } : {}}
    className={`bg-[#F9F7F3]/80 backdrop-blur-2xl rounded-3xl p-5 shadow-[0_15px_40px_rgba(0,0,0,0.04)] border border-white/60 ${className}`}
  >
    {children}
  </motion.div>
);

export default function CommandCenter() {
  const { data: metrics } = useSWR('/api/metrics', fetcher, { refreshInterval: 5000 });
  const [activeTab, setActiveTab] = useState("Activity");
  const [locks, setLocks] = useState({ front: true, bedroom: false, garage: true });
  const [time, setTime] = useState(new Date());

  // Tasks state
  const [tasks, setTasks] = useState([
    { id: 1, text: "Update Pi-hole blocklists", done: false },
    { id: 2, text: "Check Proxmox backup logs", done: true },
    { id: 3, text: "Renew SSL certificates", done: false },
  ]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const applications = [
    { name: "Pi-hole", status: "Active", color: "bg-[#E27D60]" },
    { name: "Home Assistant", status: "Active", color: "bg-[#E8A87C]" },
    { name: "Portainer", status: "Active", color: "bg-[#C38D9E]" },
    { name: "Uptime Kuma", status: "Active", color: "bg-[#85C1A9]" },
    { name: "Nginx Proxy", status: "Active", color: "bg-[#E27D60]" },
    { name: "Tailscale", status: "Active", color: "bg-[#E8A87C]" },
    { name: "Jellyfin", status: "Active", color: "bg-[#C38D9E]" },
    { name: "Vaultwarden", status: "Active", color: "bg-[#85C1A9]" },
  ];

  return (
    <div className="min-h-screen bg-[#F0EBE1] p-4 md:p-6 lg:p-8 font-sans text-gray-800 flex justify-center items-center overflow-x-hidden selection:bg-[#C38D9E] selection:text-white">

      <div className="w-full max-w-[1440px] bg-[#FDFCFB] rounded-[40px] shadow-[0_40px_100px_rgba(195,141,158,0.15)] border border-white/50 p-6 md:p-8 relative overflow-hidden flex flex-col gap-8">

        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#C38D9E]/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#E27D60]/5 blur-[120px] rounded-full pointer-events-none" />

        {/* --- NAVBAR --- */}
        <nav className="flex justify-between items-center relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C38D9E] to-[#E8A87C] flex items-center justify-center text-white font-bold shadow-md">
              <Activity size={18} />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">Homerton</span>
          </div>

          <div className="hidden lg:flex items-center gap-8 text-sm font-semibold text-gray-500">
            <span className="bg-[#C38D9E] text-white px-6 py-2.5 rounded-full shadow-md cursor-pointer">Dashboard</span>
            <span className="hover:text-gray-900 cursor-pointer transition-colors">Applications</span>
            <span className="hover:text-gray-900 cursor-pointer transition-colors">Tasks</span>
            <span className="hover:text-gray-900 cursor-pointer transition-colors">Calendar</span>
            <span className="hover:text-gray-900 cursor-pointer transition-colors">Settings</span>
          </div>

          <div className="flex items-center gap-4">
            <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative">
              <Bell size={18} className="text-gray-600" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#E27D60] rounded-full ring-2 ring-white"></span>
            </button>
            <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white shadow-md overflow-hidden flex items-center justify-center">
              <div className="w-full h-full bg-gradient-to-tr from-[#E8A87C] to-[#E27D60]" />
            </div>
          </div>
        </nav>

        {/* --- MAIN GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-10 relative z-10 w-full flex-1">

          {/* LEFT SIDE */}
          <div className="lg:col-span-8 flex flex-col gap-8">

            <div className="flex justify-between items-end">
              <div>
                <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-4xl font-semibold tracking-tight text-gray-900">
                  Welcome Back
                </motion.h1>
                <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="text-gray-500 mt-2 font-medium">
                  {format(time, "EEEE, MMMM do yyyy")}
                </motion.p>
              </div>

              {/* LARGE LIVE CLOCK DISPLAY */}
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-right">
                <p className="text-5xl font-light tracking-tighter text-gray-800">
                  {format(time, "HH:mm")}
                  <span className="text-2xl text-gray-400 font-medium ml-1">{format(time, "ss")}</span>
                </p>
                <p className="text-xs font-bold text-[#E27D60] tracking-widest uppercase mt-1">Homelab Time</p>
              </motion.div>
            </div>

            {/* 3 Status Cards Row */}
            <div className="grid grid-cols-3 gap-4">
              <GlassCard delay={0.1} hover={false} className="py-4 flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-[#C38D9E]" />
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Network Status</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">Healthy</p>
                </div>
              </GlassCard>
              <GlassCard delay={0.2} hover={false} className="py-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-[#E8A87C]" />
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">System Load</span>
                </div>
                <p className="text-lg font-bold text-gray-900">Nominal</p>
              </GlassCard>
              <GlassCard delay={0.3} hover={false} className="py-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-[#85C1A9]" />
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Security</span>
                </div>
                <p className="text-lg font-bold text-gray-900">Operating</p>
              </GlassCard>
            </div>

            {/* Live Camera & Applications Grid */}
            <div className="grid grid-cols-12 gap-6">

              {/* Huge Live View */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="col-span-12 md:col-span-7 lg:col-span-8 h-64 rounded-[32px] overflow-hidden relative shadow-[0_20px_40px_rgba(0,0,0,0.06)] group">
                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent z-10" />
                <div className="absolute inset-0 bg-gray-200">
                  <div className="w-full h-full bg-[#FDFCFB] flex items-center justify-center relative overflow-hidden">
                    <div className="absolute w-[150%] h-[150%] bg-gradient-to-tr from-transparent via-[#E8A87C]/10 to-transparent rotate-12 blur-2xl" />
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 100, repeat: Infinity, ease: "linear" }} className="w-64 h-64 border border-[#E27D60]/20 rounded-full border-dashed flex items-center justify-center">
                      <div className="w-32 h-32 bg-[#C38D9E]/10 rounded-full blur-xl animate-pulse" />
                    </motion.div>
                  </div>
                </div>
                <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-[#E27D60] animate-pulse"></span>
                  <span className="text-xs font-bold text-gray-700">Live Rack View</span>
                </div>
              </motion.div>

              {/* Tasks / To-Do Manager */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="col-span-12 md:col-span-5 lg:col-span-4 bg-[#FDFCFB]/80 backdrop-blur-xl border border-white/60 shadow-[0_15px_40px_rgba(0,0,0,0.04)] rounded-[32px] p-5 flex flex-col">
                <h3 className="text-sm font-bold text-gray-900 mb-4">Task Management</h3>
                <div className="flex-1 space-y-3">
                  {tasks.map(task => (
                    <div key={task.id} onClick={() => toggleTask(task.id)} className="flex items-start gap-3 cursor-pointer group">
                      <div className="mt-0.5 text-[#C38D9E]">
                        {task.done ? <CheckCircle2 size={16} fill="#C38D9E" className="text-white" /> : <Circle size={16} className="text-gray-300 group-hover:text-[#C38D9E] transition-colors" />}
                      </div>
                      <p className={`text-sm transition-all ${task.done ? 'text-gray-400 line-through' : 'text-gray-700 font-medium'}`}>
                        {task.text}
                      </p>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 flex items-center justify-center gap-2 text-xs font-bold text-[#C38D9E] bg-[#C38D9E]/10 py-2.5 rounded-xl hover:bg-[#C38D9E]/20 transition-colors">
                  <Plus size={14} /> Add Task
                </button>
              </motion.div>
            </div>

            {/* Application List (Horizontally Scrollable) */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">Hosted Applications</h3>
                <span className="text-xs font-semibold text-[#E27D60] cursor-pointer hover:underline">View All</span>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {applications.map((app, i) => (
                  <motion.div
                    key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 * i }}
                    className="min-w-[140px] bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-3 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className={`w-12 h-12 rounded-full ${app.color} flex items-center justify-center text-white shadow-inner`}>
                      <Server size={20} />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold text-gray-800">{app.name}</p>
                      <p className="text-[10px] font-semibold text-[#85C1A9] mt-0.5">{app.status}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT SIDE (Spans 4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-8 relative">

            <div className="flex justify-between items-center px-2">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Proxmox Cluster</h3>
                <div className="flex gap-4 mt-1">
                  <span className="text-xs font-semibold text-[#85C1A9]">Node 1</span>
                  <span className="text-xs font-semibold text-gray-400">Node 2</span>
                  <span className="text-xs font-semibold text-gray-400">Node 3</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Avg Temp</p>
                <p className="text-sm font-bold text-gray-900">45&deg;</p>
              </div>
            </div>

            {/* Semicircle Dial & Controls */}
            <div className="flex gap-2 items-end justify-between mt-2">
              {/* Left Buttons */}
              <div className="flex flex-col gap-3 w-28">
                <button className="bg-[#C38D9E] text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md hover:brightness-110 transition-all text-xs font-bold">
                  <Activity size={14} /> Peak
                </button>
                <GlassCard className="py-3 px-4 flex justify-center text-xs font-bold text-gray-600 hover:text-gray-900 transition-colors shadow-sm cursor-pointer border border-white/60">
                  Idle
                </GlassCard>
                <GlassCard className="py-3 px-4 flex justify-center text-xs font-bold text-gray-600 hover:text-gray-900 transition-colors shadow-sm cursor-pointer border border-white/60">
                  Eco
                </GlassCard>
              </div>

              {/* The Dial itself */}
              <div className="relative w-64 h-36 flex items-end justify-center overflow-hidden flex-1">
                <svg viewBox="0 0 200 100" className="w-full absolute bottom-0 drop-shadow-2xl">
                  <path d="M 20 95 A 75 75 0 0 1 180 95" fill="none" stroke="#EAE5DC" strokeWidth="12" strokeLinecap="round" />
                  {[...Array(15)].map((_, i) => {
                    const angle = (i * 12) + 180;
                    const rad = (angle * Math.PI) / 180;
                    const x1 = 100 + 85 * Math.cos(rad);
                    const y1 = 95 + 85 * Math.sin(rad);
                    const x2 = 100 + 92 * Math.cos(rad);
                    const y2 = 95 + 92 * Math.sin(rad);
                    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#D4CEC2" strokeWidth="2" strokeLinecap="round" />
                  })}
                  <motion.path
                    d="M 20 95 A 75 75 0 0 1 180 95"
                    fill="none"
                    stroke="url(#purpleGradient)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray="235"
                    strokeDashoffset={235 - (235 * (metrics?.cpuTemp || 45) / 100)}
                    transition={{ duration: 2, ease: "easeOut" }}
                  />
                  <defs>
                    <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#C38D9E" />
                      <stop offset="100%" stopColor="#E27D60" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="absolute left-2 bottom-1 text-[10px] font-bold text-gray-400">30&deg;</span>
                <span className="absolute top-0 text-[10px] font-bold text-gray-400">50&deg;</span>
                <span className="absolute right-2 bottom-1 text-[10px] font-bold text-gray-400">90&deg;</span>

                <div className="absolute bottom-2 flex flex-col items-center">
                  <span className="text-5xl font-light text-gray-900 tracking-tighter ml-2">{metrics?.cpuTemp || 45}&deg;</span>
                </div>
              </div>
            </div>

            {/* Visual Calendar UI */}
            <div className="flex-1 mt-6">
              <div className="flex justify-between items-center mb-6 px-2">
                <h3 className="text-lg font-bold text-gray-900">Calendar</h3>
                <span className="text-xs font-semibold text-gray-400 underline cursor-pointer hover:text-gray-600">Full Month</span>
              </div>

              <div className="bg-white rounded-3xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-gray-800">{format(time, "MMMM yyyy")}</h4>
                  <div className="flex gap-2 text-gray-400">
                    <ChevronRight size={16} className="rotate-180 cursor-pointer hover:text-gray-900" />
                    <ChevronRight size={16} className="cursor-pointer hover:text-gray-900" />
                  </div>
                </div>
                {/* Mini Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                    <span key={d} className="text-[10px] font-bold text-gray-400">{d}</span>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {/* Dummy visual dates indicating layout precision */}
                  {[...Array(28)].map((_, i) => {
                    const isToday = i + 1 === parseInt(format(time, "d"));
                    return (
                      <div key={i} className={`h-8 w-full flex items-center justify-center rounded-lg text-xs font-semibold cursor-pointer transition-colors ${isToday ? 'bg-[#E27D60] text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
                        {i + 1}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Members area to match the image structure */}
              <div className="mt-8 px-2">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Team Access</h3>
                <div className="flex items-center">
                  <Avatar color="bg-[#E27D60]" delay={0.1} z={40} />
                  <Avatar color="bg-[#E8A87C]" delay={0.2} z={30} className="-ml-3" />
                  <Avatar color="bg-[#85C1A9]" delay={0.3} z={20} className="-ml-3" />
                  <div className="w-10 h-10 rounded-full bg-[#C38D9E] text-white flex items-center justify-center text-xs font-bold border-2 border-[#FDFCFB] shadow-sm relative z-10 -ml-3 cursor-pointer hover:brightness-110">
                    +
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// --- MICRO-COMPONENTS --- //

const ToggleCard = ({ icon, title, time, delay, active = false }: any) => (
  // Component omitted for brevity, keeping the UI intact
  null
);

const LockCard = ({ title, status, battery, delay, locked, onClick }: any) => (
  // Component omitted for brevity, keeping the UI intact
  null
);

const ActivityItem = ({ icon, title, detail, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay }}
    className="flex items-center justify-between group cursor-pointer"
  >
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-[#F9F7F3] transition-colors">
        {icon}
      </div>
      <div>
        <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#C38D9E] transition-colors">{title}</h4>
        <p className="text-xs font-semibold text-gray-400">{detail}</p>
      </div>
    </div>
    <div className="w-8 h-8 rounded-full flex items-center justify-center text-gray-300 group-hover:text-gray-600 transition-colors">
      <ChevronRight size={18} />
    </div>
  </motion.div>
);

const Avatar = ({ color, delay, z, className = "" }: any) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay }}
    className={`w-10 h-10 rounded-full ${color} border-2 border-[#FDFCFB] shadow-sm relative ${className}`}
    style={{ zIndex: z }}
  />
);
