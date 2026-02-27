"use client";

import React, { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";
import {
  Bell, Activity, Lock, Zap, Thermometer, Database, Cpu,
  ChevronRight, MoreHorizontal, LayoutGrid, CheckCircle2, Circle, Plus, Server, Home, Shield, Settings, Calendar as CalendarIcon, Power, HardDrive
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const INITIAL_TASKS = [
  { id: 1, text: "Update Pi-hole blocklists", done: false },
  { id: 2, text: "Check Proxmox backup logs", done: true },
  { id: 3, text: "Renew SSL certificates", done: false },
  { id: 4, text: "Monitor Tailscale nodes", done: false },
];

const HOSTED_APPS = [
  { name: "Pi-hole", status: "Active", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  { name: "Home Assistant", status: "Active", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  { name: "Portainer", status: "Active", color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20" },
  { name: "Uptime Kuma", status: "Warning", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  { name: "Nginx Proxy", status: "Active", color: "text-teal-400 bg-teal-500/10 border-teal-500/20" },
  { name: "Tailscale", status: "Active", color: "text-zinc-400 bg-zinc-500/10 border-zinc-500/20" },
];

export default function CommandCenter() {
  const [metrics, setMetrics] = useState<any>(null);
  const [toggles, setToggles] = useState({ proxy: true, dns: true, vpn: false });

  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState<Date | null>(null);
  const [tasks, setTasks] = useState(INITIAL_TASKS);

  useEffect(() => {
    setMounted(true);
    setTime(new Date());

    const clockTimer = setInterval(() => setTime(new Date()), 1000);

    // Initial fetch
    fetcher('/api/metrics').then(setMetrics).catch(() => { });
    const metricsTimer = setInterval(() => {
      fetcher('/api/metrics').then(setMetrics).catch(() => { });
    }, 5000);

    return () => {
      clearInterval(clockTimer);
      clearInterval(metricsTimer);
    };
  }, []);

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const executeAction = async (actionId: string) => {
    if (actionId === 'proxy') setToggles(p => ({ ...p, proxy: !p.proxy }));
    if (actionId === 'dns') setToggles(p => ({ ...p, dns: !p.dns }));
    if (actionId === 'vpn') setToggles(p => ({ ...p, vpn: !p.vpn }));
    try {
      await fetch('/api/docker-control', {
        method: 'POST',
        body: JSON.stringify({ action: actionId })
      });
    } catch (e) { console.error("Action failed:", e); }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans flex flex-col md:flex-row overflow-hidden selection:bg-indigo-500/30">

      {/* 
        ==============================
        SIDEBAR (Desktop) / BOTTOM BAR (Mobile)
        ==============================
      */}
      <nav className="fixed bottom-0 w-full md:relative md:w-[240px] lg:w-[280px] bg-[#0a0a0a] border-t md:border-t-0 md:border-r border-zinc-900 flex md:flex-col justify-between md:justify-start z-50 p-4 md:p-6 md:h-screen">
        {/* Logo - Hidden on mobile */}
        <div className="hidden md:flex items-center gap-3 mb-10 pl-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(79,70,229,0.3)]">
            <Activity size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Battle Station</span>
        </div>

        {/* Nav Links */}
        <div className="flex md:flex-col gap-2 w-full justify-around md:justify-start">
          <NavLink icon={<Home size={20} />} label="Dashboard" active />
          <NavLink icon={<HardDrive size={20} />} label="Infrastructure" />
          <NavLink icon={<CalendarIcon size={20} />} label="Schedules" />
          <NavLink icon={<Settings size={20} />} label="Settings" />
        </div>

        {/* Bottom Action - Hidden on mobile */}
        <div className="hidden md:flex flex-col gap-4 mt-auto">
          <div className="p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800/80 hover:bg-zinc-900 transition-colors cursor-pointer group flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-500 to-orange-500 flex items-center justify-center">
                <Power size={14} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">System Power</p>
                <p className="text-xs text-emerald-500 font-medium">Nominal Draw</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* 
        ==============================
        MAIN DASHBOARD CONTENT
        ==============================
      */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto pb-24 md:pb-0 relative">

        {/* Subtle Background Glows */}
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none hidden md:block" />

        {/* Top Header Row */}
        <header className="px-5 py-4 md:px-10 md:py-8 flex justify-between items-center sticky top-0 bg-[#050505]/80 backdrop-blur-xl z-40 border-b border-zinc-900/50">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-1">Battle Station</h1>
            <p className="text-xs md:text-sm text-zinc-500 font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              Network Secure &middot; All nodes active
            </p>
          </div>

          {/* BIG LIVE CLOCK */}
          <div className="bg-zinc-900/50 px-5 py-2.5 rounded-2xl border border-zinc-800/80 hidden lg:flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-2xl font-light tabular-nums text-white tracking-tight leading-none mb-1">
                {mounted && time ? format(time, "HH:mm") : "--:--"}
                <span className="text-zinc-500 font-medium ml-1 text-base">{mounted && time ? format(time, "ss") : "--"}</span>
              </span>
              <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-widest leading-none">
                {mounted && time ? format(time, "EEE, MMM do") : "--"}
              </span>
            </div>
            <div className="w-[1px] h-8 bg-zinc-800" />
            <button className="text-zinc-400 hover:text-white transition w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-900/80 border border-zinc-800">
              <Bell size={18} />
            </button>
          </div>

          {/* Mobile Only Clock */}
          <div className="md:hidden text-right">
            <span className="text-xl font-light text-white">{mounted && time ? format(time, "HH:mm") : "--:--"}</span>
          </div>
        </header>

        {/* Dashboard Grid Container */}
        <div className="p-4 md:p-8 flex flex-col gap-6 max-w-[1600px] w-full mx-auto">

          {/* Row 1: Key Summary Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <MetricSummary title="Uplink Traffic" value="842 Mbps" trend="+12%" positive />
            <MetricSummary title="System Load" value={`${metrics?.loadAvg || '1.24'}`} sub="Proxmox Node" />
            <MetricSummary title="Core Thermal" value={`${metrics?.cpuTemp || 45}°C`} sub="Stable Cooling" />
            <MetricSummary title="DNS Queries" value="142k" trend="12% Blocked" positive={false} />
          </div>

          {/* Row 2: Live View & Side Modules */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

            {/* Rack Live View - 8 Cols */}
            <div className="xl:col-span-8 bg-[#0a0a0a] rounded-[24px] md:rounded-[32px] border border-zinc-900 overflow-hidden relative min-h-[250px] md:min-h-[400px] flex flex-col shadow-xl">
              <div className="p-4 md:p-5 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent absolute top-0 w-full z-10">
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] md:text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
                    Server Alpha
                  </div>
                </div>
                <button className="w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition backdrop-blur-md">
                  <MoreHorizontal size={18} />
                </button>
              </div>

              {/* Simulated Camera Feed pattern */}
              <div className="flex-1 w-full h-full relative flex justify-center items-center bg-black/80">
                <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:32px_32px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 md:w-48 h-32 md:h-48 border border-zinc-800/50 rounded-full flex items-center justify-center">
                  <div className="absolute inset-0 bg-indigo-500/10 blur-[40px] rounded-full" />
                  <div className="w-full h-[1px] bg-zinc-800/30 absolute" />
                  <div className="h-full w-[1px] bg-zinc-800/30 absolute" />
                  <div className="w-2 h-2 rounded-full bg-indigo-500/80 shadow-[0_0_15px_rgba(99,102,241,1)]" />
                </div>
              </div>
            </div>

            {/* Task Sidebar column - 4 Cols */}
            <div className="xl:col-span-4 flex flex-col gap-6 md:gap-6">

              {/* Calendar Integration */}
              <div className="bg-[#0a0a0a] rounded-[24px] md:rounded-[32px] p-5 md:p-6 border border-zinc-900 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <CalendarIcon size={18} className="text-indigo-500" /> Auto-Deploy
                  </h3>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest bg-zinc-900 px-2 py-1 rounded-md">
                    {mounted && time ? format(time, "MMMM") : "---"}
                  </span>
                </div>
                {/* Visual mini-calendar */}
                <div className="grid grid-cols-7 gap-1 md:gap-2 text-center">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <span key={d} className="text-[10px] font-bold text-zinc-600 mb-2">{d}</span>)}
                  {mounted && time && (() => {
                    const start = startOfMonth(time);
                    const end = endOfMonth(time);
                    const days = eachDayOfInterval({ start, end });
                    const blanks = Array(start.getDay()).fill(null);
                    return [...blanks, ...days].map((day, i) => {
                      if (!day) return <div key={i} className="aspect-square" />;
                      const isToday = isSameDay(day, time);
                      return (
                        <div key={i} className={cn(
                          "text-xs md:text-sm aspect-square flex items-center justify-center rounded-xl font-medium transition-all",
                          isToday ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-110 relative z-10" : "text-zinc-400 hover:bg-zinc-800 hover:text-white cursor-pointer"
                        )}>
                          {format(day, "d")}
                        </div>
                      )
                    })
                  })()}
                </div>
              </div>

              {/* Infrastructure Gateways - Toggles */}
              <div className="bg-[#0a0a0a] rounded-[24px] md:rounded-[32px] p-5 md:p-6 border border-zinc-900 shadow-xl flex flex-col gap-3 flex-1">
                <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                  <Shield size={18} className="text-indigo-500" /> Active Tunnels
                </h3>
                <ToggleNode title="Nginx Proxy Entry" active={toggles.proxy} onClick={() => executeAction('proxy')} />
                <ToggleNode title="Pi-Hole DNS Sink" active={toggles.dns} onClick={() => executeAction('dns')} />
                <ToggleNode title="Tailscale Subnet" active={toggles.vpn} onClick={() => executeAction('vpn')} />
              </div>

            </div>

          </div>

          {/* Row 3: Bottom Sections (Services and Tasks) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Hosted Services Grid */}
            <div className="bg-[#0a0a0a] rounded-[24px] md:rounded-[32px] p-5 md:p-8 border border-zinc-900 shadow-xl flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Database size={18} className="text-indigo-500" /> Hosted Apps
                </h3>
                <LayoutGrid size={18} className="text-zinc-500" />
              </div>

              {/* Mobile wrap, Desktop rigid grid */}
              <div className="flex flex-wrap md:grid md:grid-cols-3 gap-3">
                {HOSTED_APPS.map((app, i) => (
                  <div key={i} className={cn(
                    "w-[48%] md:w-auto p-4 rounded-2xl bg-[#050505] border hover:border-zinc-700 transition-colors cursor-pointer group flex flex-col items-center text-center",
                    app.color.split("border-")[1] ? `border-${app.color.split("border-")[1]}` : "border-zinc-900"
                  )}>
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-3", app.color.split(" border")[0])}>
                      <Server size={20} />
                    </div>
                    <p className="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors">{app.name}</p>
                    <p className={cn("text-[10px] md:text-xs uppercase tracking-widest font-bold mt-1", app.status === 'Active' ? 'text-emerald-500/70' : 'text-amber-500/70')}>{app.status}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Maintenance Tasks Tracking */}
            <div className="bg-[#0a0a0a] rounded-[24px] md:rounded-[32px] p-5 md:p-8 border border-zinc-900 shadow-xl flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Zap size={18} className="text-indigo-500" /> Maintenance
                </h3>
                <button className="text-zinc-100 bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors shadow-lg shadow-indigo-500/20">
                  <Plus size={14} /> Add Log
                </button>
              </div>
              <div className="space-y-3">
                {tasks.map(task => (
                  <div key={task.id} onClick={() => toggleTask(task.id)} className="flex items-center gap-4 p-4 rounded-2xl bg-[#050505] border border-zinc-900 hover:border-zinc-800 cursor-pointer group transition-all">
                    <button className="focus:outline-none flex-shrink-0">
                      {task.done ? <CheckCircle2 size={20} className="text-emerald-500" /> : <Circle size={20} className="text-zinc-600 group-hover:text-zinc-400" />}
                    </button>
                    <span className={cn("text-sm transition-all", task.done ? "text-zinc-600 line-through" : "text-zinc-200 font-medium group-hover:text-white")}>{task.text}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}

/** ==========================================
 * UI COMPONENTS
 * ========================================== */

function NavLink({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <button className={cn(
      "flex md:flex-row flex-col items-center md:justify-start justify-center gap-1.5 md:gap-3 p-3 md:px-5 md:py-3.5 rounded-xl md:rounded-2xl transition-all w-full",
      active ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 font-medium"
    )}>
      {icon}
      <span className="text-[10px] md:text-sm font-bold">{label}</span>
    </button>
  );
}

function MetricSummary({ title, value, trend, sub, positive }: { title: string, value: string, trend?: string, sub?: string, positive?: boolean }) {
  return (
    <div className="bg-[#0a0a0a] rounded-[20px] p-5 md:p-6 border border-zinc-900 flex flex-col justify-between shadow-lg">
      <h3 className="text-[10px] md:text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 md:mb-5">{title}</h3>
      <div className="flex flex-col gap-1">
        <p className="text-2xl md:text-4xl font-light text-white tracking-tight tabular-nums relative">
          {value}
        </p>
        {(trend || sub) && (
          <span className={cn("text-[10px] md:text-xs font-bold uppercase tracking-widest mt-1",
            trend ? (positive ? "text-emerald-400" : "text-rose-400") : "text-zinc-600"
          )}>
            {trend || sub}
          </span>
        )}
      </div>
    </div>
  );
}

function ToggleNode({ title, active, onClick }: { title: string, active: boolean, onClick: () => void }) {
  return (
    <div onClick={onClick} className="flex items-center justify-between p-3.5 rounded-2xl bg-[#050505] border border-zinc-900 hover:border-zinc-800 cursor-pointer transition-all group">
      <span className={cn("text-sm font-bold transition-colors", active ? "text-white" : "text-zinc-500 group-hover:text-zinc-400")}>{title}</span>
      <div className={cn("w-12 h-6 rounded-full relative transition-colors duration-300 flex items-center px-1 border", active ? "bg-indigo-600 border-indigo-500" : "bg-zinc-900 border-zinc-800")}>
        <div className={cn("w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300", active ? "translate-x-6" : "translate-x-0 bg-zinc-600")} />
      </div>
    </div>
  );
}
