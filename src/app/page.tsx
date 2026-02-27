"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import useSWR from "swr";
import {
  Bell, Activity, Wind, Droplet, ShieldCheck,
  ChevronRight, Power, RefreshCw, Trash2,
  Play, Pause, SkipForward, SkipBack, Lock, Unlock,
  Home, Bed, Car, TreePine, Plus
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
  const [activeTab, setActiveTab] = useState("Living Room");
  const [locks, setLocks] = useState({ front: true, bedroom: false, garage: true });

  return (
    <div className="min-h-screen bg-[#F0EBE1] p-4 md:p-6 lg:p-8 font-sans text-gray-800 flex justify-center items-center overflow-x-hidden selection:bg-[#C38D9E] selection:text-white">

      {/* Outer App Container (Simulating the clean edge in the image) */}
      <div className="w-full max-w-[1440px] bg-[#FDFCFB] rounded-[40px] shadow-[0_40px_100px_rgba(195,141,158,0.15)] border border-white/50 p-6 md:p-8 relative overflow-hidden flex flex-col gap-8">

        {/* Soft background glow to match the purple tint slightly but keeping Antigravity cream */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#C38D9E]/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#E27D60]/5 blur-[120px] rounded-full pointer-events-none" />

        {/* --- NAVBAR --- */}
        <nav className="flex justify-between items-center relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C38D9E] to-[#E8A87C] flex items-center justify-center text-white font-bold shadow-md">
              <Activity size={18} />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">Battlestation</span>
          </div>

          <div className="hidden lg:flex items-center gap-8 text-sm font-semibold text-gray-500">
            <span className="bg-[#C38D9E] text-white px-6 py-2.5 rounded-full shadow-md cursor-pointer">Dashboard</span>
            <span className="hover:text-gray-900 cursor-pointer transition-colors">Security</span>
            <span className="hover:text-gray-900 cursor-pointer transition-colors">Devices</span>
            <span className="hover:text-gray-900 cursor-pointer transition-colors">Statistics</span>
            <span className="hover:text-gray-900 cursor-pointer transition-colors">Settings</span>
          </div>

          <div className="flex items-center gap-4">
            <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative">
              <Bell size={18} className="text-gray-600" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#E27D60] rounded-full ring-2 ring-white"></span>
            </button>
            <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white shadow-md overflow-hidden flex items-center justify-center">
              {/* Profile placeholder */}
              <div className="w-full h-full bg-gradient-to-tr from-[#E8A87C] to-[#E27D60]" />
            </div>
          </div>
        </nav>

        {/* --- MAIN GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-10 relative z-10 w-full flex-1">

          {/* LEFT SIDE (Spans 8 cols ideally, but using 7 for tighter fit based on image) */}
          <div className="lg:col-span-8 flex flex-col gap-8">

            {/* Header & Address */}
            <div>
              <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-4xl font-semibold tracking-tight text-gray-900">
                Welcome Back
              </motion.h1>
              <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="text-gray-500 mt-2 font-medium">
                403 Magnetic Drive Unit 4
              </motion.p>
            </div>

            {/* 3 Status Cards Row */}
            <div className="grid grid-cols-3 gap-4">
              <GlassCard delay={0.1} hover={false} className="py-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-[#C38D9E]" />
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Network Status</span>
                </div>
                <p className="text-lg font-bold text-gray-900">Healthy</p>
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

            {/* Camera & Quick Stack */}
            <div className="grid grid-cols-12 gap-6">
              {/* Huge Live View */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="col-span-8 h-64 rounded-[32px] overflow-hidden relative shadow-[0_20px_40px_rgba(0,0,0,0.06)] group">
                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent z-10" />
                <div className="absolute inset-0 bg-gray-200">
                  {/* Abstract structural placeholder acting as the 3D render */}
                  <div className="w-full h-full bg-[#FDFCFB] flex items-center justify-center relative overflow-hidden">
                    <div className="absolute w-[150%] h-[150%] bg-gradient-to-tr from-transparent via-[#E8A87C]/10 to-transparent rotate-12 blur-2xl" />
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 100, repeat: Infinity, ease: "linear" }} className="w-64 h-64 border border-[#E27D60]/20 rounded-full border-dashed flex items-center justify-center">
                      <div className="w-32 h-32 bg-[#C38D9E]/10 rounded-full blur-xl animate-pulse" />
                    </motion.div>
                  </div>
                </div>
                {/* Live Badge */}
                <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-[#E27D60] animate-pulse"></span>
                  <span className="text-xs font-bold text-gray-700">Live</span>
                </div>
              </motion.div>

              {/* Stack of Toggles */}
              <div className="col-span-4 flex flex-col gap-4">
                <ToggleCard icon={<RefreshCw size={18} />} title="Restart Nginx" time="Last sync 12pm" delay={0.3} active />
                <ToggleCard icon={<Power size={18} />} title="Reboot Proxy" time="Idle" delay={0.4} />
                <ToggleCard icon={<Trash2 size={18} />} title="Flush Logs" time="Scheduled 6pm" delay={0.5} active />
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-8 border-b border-gray-200/60 pb-1 mt-2">
              {["Living Room", "Kitchen Room", "Bedroom", "Dining Room", "Family Room"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 text-sm font-semibold transition-all relative ${activeTab === tab ? "text-[#C38D9E]" : "text-gray-400 hover:text-gray-600"}`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div layoutId="activeTab" className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-[#C38D9E] rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Lock Cards & Media Player */}
            <div className="grid grid-cols-12 gap-6 mt-2">
              <LockCard title="Front Door" status={locks.front ? "Locked" : "Unlock"} battery="76%" locked={locks.front} onClick={() => setLocks({ ...locks, front: !locks.front })} delay={0.4} />
              <LockCard title="Bedroom" status={locks.bedroom ? "Locked" : "Unlock"} battery="65%" locked={locks.bedroom} onClick={() => setLocks({ ...locks, bedroom: !locks.bedroom })} delay={0.5} />
              <LockCard title="Garage" status={locks.garage ? "Locked" : "Unlock"} battery="85%" locked={locks.garage} onClick={() => setLocks({ ...locks, garage: !locks.garage })} delay={0.6} />

              {/* Media Player */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="col-span-4 bg-[#1C1A27] rounded-[32px] overflow-hidden relative shadow-[0_20px_40px_rgba(0,0,0,0.15)] text-white flex flex-col justify-end p-5 h-full min-h-[180px] group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                {/* Abstract colorful background for album art */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#E27D60] to-[#C38D9E] opacity-60 group-hover:scale-105 transition-transform duration-700" />

                <div className="relative z-20">
                  <div className="flex justify-between items-end mb-4">
                    <div>
                      <h3 className="text-lg font-bold">The Blinding Lights</h3>
                      <p className="text-xs text-gray-300">The Weeknd</p>
                    </div>
                    <button className="text-white hover:text-[#E8A87C] transition-colors"><Activity size={20} /></button>
                  </div>
                  {/* Controls */}
                  <div className="w-full h-1 bg-white/20 rounded-full mb-4 overflow-hidden">
                    <div className="w-1/3 h-full bg-white rounded-full"></div>
                  </div>
                  <div className="flex justify-center items-center gap-6">
                    <button className="text-white/70 hover:text-white transition-colors"><SkipBack size={20} fill="currentColor" /></button>
                    <button className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform"><Play size={18} fill="currentColor" className="ml-1" /></button>
                    <button className="text-white/70 hover:text-white transition-colors"><SkipForward size={20} fill="currentColor" /></button>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>

          {/* RIGHT SIDE (Spans 4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-8 relative">

            {/* Top Sub-header for Dial */}
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
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Outdoor Temp</p>
                <p className="text-sm font-bold text-gray-900">27&deg;</p>
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
                  {/* Background Track */}
                  <path d="M 20 95 A 75 75 0 0 1 180 95" fill="none" stroke="#EAE5DC" strokeWidth="12" strokeLinecap="round" />
                  {/* Tick Marks around the dial */}
                  {[...Array(15)].map((_, i) => {
                    const angle = (i * 12) + 180;
                    const rad = (angle * Math.PI) / 180;
                    const x1 = 100 + 85 * Math.cos(rad);
                    const y1 = 95 + 85 * Math.sin(rad);
                    const x2 = 100 + 92 * Math.cos(rad);
                    const y2 = 95 + 92 * Math.sin(rad);
                    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#D4CEC2" strokeWidth="2" strokeLinecap="round" />
                  })}
                  {/* Indicator Bar (Animated) */}
                  <motion.path
                    d="M 20 95 A 75 75 0 0 1 180 95"
                    fill="none"
                    stroke="url(#purpleGradient)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray="235"
                    strokeDashoffset={235 - (235 * (metrics?.cpuTemp || 45) / 100)} // e.g. 45% filled
                    transition={{ duration: 2, ease: "easeOut" }}
                  />
                  <defs>
                    <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#C38D9E" />
                      <stop offset="100%" stopColor="#E27D60" />
                    </linearGradient>
                  </defs>
                </svg>
                {/* Labels around dial */}
                <span className="absolute left-2 bottom-1 text-[10px] font-bold text-gray-400">16&deg;</span>
                <span className="absolute top-0 text-[10px] font-bold text-gray-400">20&deg;</span>
                <span className="absolute right-2 bottom-1 text-[10px] font-bold text-gray-400">32&deg;</span>

                {/* Center Value */}
                <div className="absolute bottom-2 flex flex-col items-center">
                  <span className="text-5xl font-light text-gray-900 tracking-tighter ml-2">19&deg;</span>
                </div>
              </div>
            </div>

            {/* Activity List */}
            <div className="flex-1 mt-6">
              <div className="flex justify-between items-center mb-6 px-2">
                <h3 className="text-lg font-bold text-gray-900">Activity</h3>
                <span className="text-xs font-semibold text-gray-400 underline cursor-pointer hover:text-gray-600">See more</span>
              </div>

              <div className="space-y-4 px-2">
                <ActivityItem icon={<Home size={18} />} title="Home" detail="12 Activities" delay={0.1} />
                <ActivityItem icon={<Bed size={18} />} title="Bedroom" detail="2 Activities" delay={0.2} />
                <ActivityItem icon={<Car size={18} />} title="Garage" detail="4 Activities" delay={0.3} />
                <ActivityItem icon={<TreePine size={18} />} title="Backyard" detail="3 Activities" delay={0.4} />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="w-full mt-6 bg-[#C38D9E] text-white py-4 rounded-full font-bold shadow-lg hover:shadow-xl transition-all"
              >
                Add Location
              </motion.button>
            </div>

            {/* Members area */}
            <div className="mt-4 px-2">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Members</h3>
              <div className="flex items-center">
                <Avatar color="bg-[#E27D60]" delay={0.1} z={40} />
                <Avatar color="bg-[#E8A87C]" delay={0.2} z={30} className="-ml-3" />
                <Avatar color="bg-[#85C1A9]" delay={0.3} z={20} className="-ml-3" />
                <div className="w-10 h-10 rounded-full bg-[#C38D9E] text-white flex items-center justify-center text-xs font-bold border-2 border-[#FDFCFB] shadow-sm relative z-10 -ml-3">
                  12+
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
  <motion.div
    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay }}
    className="bg-white/70 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between shadow-[0_10px_20px_rgba(0,0,0,0.03)] border border-white hover:bg-white transition-colors cursor-pointer group"
  >
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${active ? 'bg-[#FDFCFB] text-gray-800' : 'bg-[#F9F7F3] text-gray-500'}`}>
        <div className="relative group-hover:scale-110 transition-transform">
          {icon}
        </div>
      </div>
      <div>
        <h4 className="text-sm font-bold text-gray-800">{title}</h4>
        <p className="text-[10px] font-semibold text-gray-400 flex items-center gap-1">
          <Activity size={10} /> {time}
        </p>
      </div>
    </div>
    {/* iOS style toggle */}
    <div className={`w-10 h-5 rounded-full relative transition-colors ${active ? 'bg-black' : 'bg-gray-200'}`}>
      <div className={`w-4 h-4 bg-white rounded-full absolute top-[2px] transition-all shadow-sm ${active ? 'left-[22px]' : 'left-[2px]'}`}></div>
    </div>
  </motion.div>
);

const LockCard = ({ title, status, battery, delay, locked, onClick }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
    className="col-span-3 lg:col-span-3 bg-white/60 backdrop-blur-xl rounded-[32px] p-5 border border-white shadow-[0_15px_30px_rgba(0,0,0,0.03)] flex flex-col justify-between"
  >
    <div>
      <h3 className="text-sm font-bold text-gray-900">{title}</h3>
      <p className="text-xs font-semibold text-gray-500 mb-6">{status}</p>
    </div>

    <div className="flex items-end justify-between relative mt-8">
      <div>
        <span className={`text-4xl font-light tracking-tighter ${locked ? 'text-gray-300' : 'text-[#C38D9E]'}`}>{battery}</span>
        <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mt-1">Battery</p>
      </div>
      {/* Visual combination lock representation */}
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-[#222] rounded-[24px] overflow-hidden flex flex-col items-center py-2 gap-[2px]">
        <div className="w-8 h-[2px] bg-white/20 rounded-full"></div>
        <div className="w-8 h-[2px] bg-white/20 rounded-full"></div>
        <div className="w-10 h-[2px] bg-white/50 rounded-full mt-1"></div>
        <div className="w-8 h-[2px] bg-white/20 rounded-full mt-1"></div>
        <div className="w-8 h-[2px] bg-white/20 rounded-full"></div>
      </div>
    </div>

    {/* Swipe to unlock (aesthetic representation) */}
    <div
      onClick={onClick}
      className={`mt-6 rounded-full w-full h-11 flex items-center justify-between p-1 cursor-pointer transition-colors border ${locked ? 'bg-white border-gray-100' : 'bg-white border-white'}`}
    >
      {locked ? (
        <>
          <div className="w-9 h-9 bg-white shadow-sm border border-gray-100 rounded-full flex items-center justify-center text-gray-400">
            <Lock size={14} />
          </div>
          <span className="text-[10px] font-bold text-gray-400 tracking-wider">Swipe Lock &gt;&gt;&gt;</span>
          <div className="w-8" />
        </>
      ) : (
        <>
          <div className="w-4" />
          <span className="text-[10px] font-bold text-[#E27D60] tracking-wider">&lt;&lt;&lt; Swipe Unlock</span>
          <div className="w-9 h-9 bg-[#E27D60] shadow-sm rounded-full flex items-center justify-center text-white">
            <Unlock size={14} />
          </div>
        </>
      )}
    </div>
  </motion.div>
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
