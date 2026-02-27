"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Bell, Activity, Lock, Unlock, Zap, Thermometer, Database, Cpu,
  ChevronRight, MoreHorizontal, LayoutGrid, LayoutList, CheckCircle2, Circle, Plus, Server
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
  { name: "Pi-hole", status: "Active", color: "bg-emerald-500/20 text-emerald-400" },
  { name: "Home Assistant", status: "Active", color: "bg-blue-500/20 text-blue-400" },
  { name: "Portainer", status: "Active", color: "bg-indigo-500/20 text-indigo-400" },
  { name: "Uptime Kuma", status: "Degraded", color: "bg-amber-500/20 text-amber-400" },
  { name: "Nginx Proxy", status: "Active", color: "bg-teal-500/20 text-teal-400" },
  { name: "Tailscale", status: "Active", color: "bg-zinc-500/20 text-zinc-400" },
  { name: "Jellyfin", status: "Active", color: "bg-purple-500/20 text-purple-400" },
  { name: "Vaultwarden", status: "Active", color: "bg-rose-500/20 text-rose-400" },
];

export default function CommandCenter() {
  const [metrics, setMetrics] = useState<any>(null);
  const [locks, setLocks] = useState({ front: true, bedroom: false, garage: true });
  const [toggles, setToggles] = useState({ proxy: true, dns: true, vpn: false });

  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState<Date | null>(null);
  const [tasks, setTasks] = useState(INITIAL_TASKS);

  useEffect(() => {
    setMounted(true);
    setTime(new Date());

    const clockTimer = setInterval(() => setTime(new Date()), 1000);

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
    // Optimistic UI toggle for demo purposes
    if (actionId === 'proxy') setToggles(p => ({ ...p, proxy: !p.proxy }));
    if (actionId === 'dns') setToggles(p => ({ ...p, dns: !p.dns }));
    if (actionId === 'vpn') setToggles(p => ({ ...p, vpn: !p.vpn }));

    // Trigger backend hook
    await fetch('/api/docker-control', {
      method: 'POST',
      body: JSON.stringify({ action: actionId })
    }).catch(e => console.error("Action failed:", e));
  };

  return (
    // Deep black/zinc-950 background for True Dark Mode
    <div className="min-h-screen bg-black text-zinc-100 font-sans p-4 md:p-6 lg:p-10 flex justify-center items-start">

      {/* Outer Shell - Subtle border, deep shadows */}
      <main className="w-full max-w-[1536px] bg-zinc-950 rounded-[40px] shadow-2xl border border-zinc-800/50 p-6 md:p-10 flex flex-col gap-8 relative overflow-hidden ring-1 ring-white/5">

        {/* Soft elegant glows inside the dark boundary */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500/5 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none" />

        {/* --- NAVBAR --- */}
        <header className="flex justify-between items-center pb-6 border-b border-zinc-900 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Activity size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Homerton <span className="text-zinc-500 font-medium">OS</span></span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-2 bg-zinc-900/50 p-1.5 rounded-2xl border border-zinc-800" aria-label="Main Navigation">
            <a href="#" className="text-white bg-zinc-800 px-5 py-2 rounded-xl text-sm font-medium shadow-sm border border-zinc-700">Overview</a>
            <a href="#" className="text-zinc-400 hover:text-white px-5 py-2 rounded-xl text-sm font-medium transition-colors">Network</a>
            <a href="#" className="text-zinc-400 hover:text-white px-5 py-2 rounded-xl text-sm font-medium transition-colors">Storage</a>
            <a href="#" className="text-zinc-400 hover:text-white px-5 py-2 rounded-xl text-sm font-medium transition-colors">Settings</a>
          </nav>

          <div className="flex items-center gap-4">
            <button aria-label="Notifications" className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-zinc-800 transition-colors focus:ring-2 focus:ring-indigo-500 relative">
              <Bell size={18} className="text-zinc-300" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-zinc-900" />
            </button>
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-zinc-800 border-2 border-zinc-700 overflow-hidden flex items-center justify-center">
              <div className="w-full h-full bg-gradient-to-tr from-indigo-500 to-purple-500 opacity-80" />
            </div>
          </div>
        </header>

        {/* --- DASHBOARD GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 relative z-10 mt-2">

          {/* LEFT 8 COLUMNS: Stats, Feeds, Action grids */}
          <section className="lg:col-span-8 flex flex-col gap-8">

            {/* Hero Header & Live Clock */}
            <article className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-zinc-900/30 p-8 rounded-[32px] border border-zinc-800/80">
              <div>
                <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight text-white mb-2">
                  System Nominal
                </h1>
                <p className="text-zinc-400 font-medium text-sm lg:text-base flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                  All endpoints reporting secure handshakes.
                </p>
              </div>

              <div aria-live="polite" className="text-left md:text-right bg-zinc-950/50 px-6 py-4 rounded-2xl border border-zinc-800/50 backdrop-blur-md">
                <p className="text-4xl lg:text-5xl font-light tracking-tighter text-white tabular-nums drop-shadow-md">
                  {mounted && time ? format(time, "HH:mm") : "--:--"}
                  <span className="text-2xl text-zinc-500 font-medium ml-1">
                    {mounted && time ? format(time, "ss") : "--"}
                  </span>
                </p>
                <h2 className="text-xs font-bold text-indigo-400 tracking-widest uppercase mt-2">Local Edge Time &middot; {mounted && time ? format(time, "E, MMM do") : ""}</h2>
              </div>
            </article>

            {/* Core Metrics Cards (Responsive 1 col mobile, 3 col desktop) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <MetricCard title="Network Uplink" value="98.4 Gbps" subvalue="Stable" icon={<Activity size={18} className="text-emerald-500" />} />
              <MetricCard title="Proxmox Load" value={`${metrics?.loadAvg || '1.24'} Avg`} subvalue="Core 0-15" icon={<Cpu size={18} className="text-blue-500" />} />
              <MetricCard title="DNS Queries" value="142.1k" subvalue="12% Blocked" icon={<Database size={18} className="text-indigo-500" />} />
            </div>

            {/* Middle Split: Camera Feed & Action Toggles */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

              {/* Rack Live View (7 cols) */}
              <div className="md:col-span-12 lg:col-span-7 relative rounded-[32px] overflow-hidden bg-zinc-950 h-[320px] shadow-2xl ring-1 ring-zinc-800">
                <div className="absolute inset-x-0 top-0 p-5 flex justify-between items-start z-10 bg-gradient-to-b from-black/80 to-transparent">
                  <div className="bg-black/60 backdrop-blur-xl px-4 py-2 rounded-full flex items-center gap-3 border border-white/10 shadow-lg">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.8)] animate-pulse" aria-hidden="true" />
                    <span className="text-xs font-bold tracking-wide text-white uppercase">Server Room Alpha</span>
                  </div>
                  <button className="bg-black/40 p-2 rounded-full text-white hover:bg-black/60 transition"><MoreHorizontal size={18} /></button>
                </div>
                {/* Simulated Camera Feed pattern */}
                <div className="w-full h-full relative flex items-center justify-center">
                  {/* Background Grid */}
                  <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:24px_24px]" />
                  {/* Center Reticle */}
                  <div className="w-32 h-32 border border-zinc-800/50 rounded-full flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-indigo-500/5 rounded-full blur-2xl" />
                    <div className="w-2 h-2 bg-indigo-500/50 rounded-full" />
                    <div className="absolute left-[-20px] right-[-20px] h-[1px] bg-zinc-800/30" />
                    <div className="absolute top-[-20px] bottom-[-20px] w-[1px] bg-zinc-800/30" />
                  </div>
                </div>
              </div>

              {/* Action Toggles (Interactive) (5 cols) */}
              <div className="md:col-span-12 lg:col-span-5 flex flex-col gap-4">
                <h3 className="text-sm font-semibold text-zinc-100 mb-1 px-1">Infrastructure Hub</h3>
                <InteractiveToggle
                  title="Nginx Reverse Proxy"
                  desc="Port 80/443 Traffic Routing"
                  active={toggles.proxy}
                  onClick={() => executeAction('proxy')}
                />
                <InteractiveToggle
                  title="Pi-hole DNS Engine"
                  desc="Network ad & tracker blocking"
                  active={toggles.dns}
                  onClick={() => executeAction('dns')}
                />
                <InteractiveToggle
                  title="Tailscale Subnet Exit"
                  desc="Remote access routing"
                  active={toggles.vpn}
                  onClick={() => executeAction('vpn')}
                />
              </div>

            </div>

            {/* Application Drawer */}
            <section aria-label="Hosted Applications" className="mt-2">
              <div className="flex justify-between items-center mb-6 px-1">
                <h3 className="text-lg font-bold text-white tracking-tight">Hosted Services</h3>
                <div className="flex gap-2">
                  <button className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition"><LayoutGrid size={16} /></button>
                  <button className="p-2 bg-zinc-900/50 border border-zinc-800 rounded-lg text-zinc-500 hover:text-white transition"><LayoutList size={16} /></button>
                </div>
              </div>

              {/* Responsive grid scrolling for mobile, wrapping for desktop */}
              <div className="flex overflow-x-auto pb-4 gap-4 lg:grid lg:grid-cols-4 lg:overflow-visible scrollbar-hide snap-x">
                {HOSTED_APPS.map((app, i) => (
                  <div
                    key={i}
                    role="button"
                    tabIndex={0}
                    className="snap-start min-w-[160px] bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-5 flex flex-col gap-4 hover:bg-zinc-800 transition-colors cursor-pointer group"
                  >
                    <div className="flex justify-between items-start">
                      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center border border-white/5", app.color)} aria-hidden="true">
                        <Server size={20} />
                      </div>
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-100 group-hover:text-white transition">{app.name}</p>
                      <p className="text-[11px] font-medium text-zinc-500 mt-1 uppercase tracking-wider">{app.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </section>

          {/* RIGHT 4 COLUMNS: Sidebar (Temp, Tasks, Calendar) */}
          <aside className="lg:col-span-4 flex flex-col gap-6">

            {/* Thermals Dial - Clean CSS rotation */}
            <section className="bg-zinc-900/40 border border-zinc-800/80 rounded-[32px] p-8 relative overflow-hidden" aria-label="System Telemetry">
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">Core Thermals</h3>
                  <p className="text-xs font-medium text-zinc-500 mt-1 uppercase tracking-wider">Proxmox Cluster</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                  <Thermometer size={18} />
                </div>
              </div>

              {/* Dial Implementation for Dark Mode */}
              <div className="relative w-full aspect-[2/1] flex items-end justify-center overflow-hidden mb-4">
                <svg viewBox="0 0 200 100" className="w-full absolute bottom-0" aria-hidden="true">
                  {/* Background Track */}
                  <path d="M 15 95 A 85 85 0 0 1 185 95" fill="none" stroke="#27272a" strokeWidth="8" strokeLinecap="round" />

                  {/* Ticks */}
                  {[...Array(21)].map((_, i) => {
                    const angle = (i * 9) + 180;
                    const rad = (angle * Math.PI) / 180;
                    const x1 = 100 + 72 * Math.cos(rad);
                    const y1 = 95 + 72 * Math.sin(rad);
                    const x2 = 100 + 76 * Math.cos(rad);
                    const y2 = 95 + 76 * Math.sin(rad);
                    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#3f3f46" strokeWidth="2" strokeLinecap="round" />
                  })}

                  {/* Active Thermal Bar */}
                  <path
                    d="M 15 95 A 85 85 0 0 1 185 95"
                    fill="none"
                    stroke="url(#thermalGradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray="267"
                    // 45 degrees out of 100 max mapped to 267 dash length
                    strokeDashoffset={267 - (267 * (metrics?.cpuTemp || 45) / 100)}
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="thermalGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8b5cf6" /> {/* Purple */}
                      <stop offset="50%" stopColor="#ec4899" /> {/* Pink */}
                      <stop offset="100%" stopColor="#f43f5e" /> {/* Rose */}
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute bottom-1 flex flex-col items-center">
                  <span className="text-5xl font-light text-white tabular-nums tracking-tighter shadow-black drop-shadow-lg">
                    {metrics?.cpuTemp || 45}&deg;
                  </span>
                </div>
              </div>
            </section>

            {/* Task Manager Widget - Interactive list */}
            <div className="bg-zinc-900/40 rounded-[32px] p-6 lg:p-8 border border-zinc-800/80 flex flex-col h-full min-h-[300px]">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">Active Tasks</h3>
                  <p className="text-xs font-medium text-zinc-500 mt-1 uppercase tracking-wider">Root Access</p>
                </div>
                <button className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-300 flex items-center justify-center hover:bg-zinc-700 hover:text-white transition"><Plus size={16} /></button>
              </div>

              <ul className="flex-1 space-y-4" role="list">
                {tasks.map(task => (
                  <li key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-zinc-800/50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        className="flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full"
                        aria-label={task.done ? "Mark task incomplete" : "Mark task complete"}
                      >
                        {task.done
                          ? <CheckCircle2 size={20} className="text-indigo-500" />
                          : <Circle size={20} className="text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                        }
                      </button>
                      <span className={cn(
                        "text-sm transition-all duration-300",
                        task.done ? 'text-zinc-600 line-through' : 'text-zinc-200 font-medium group-hover:text-white'
                      )}>
                        {task.text}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

          </aside>
        </div>
      </main>
    </div>
  );
}

/** ==========================================
 * PURE SUB-COMPONENTS
 * ========================================== */

function MetricCard({ title, value, subvalue, icon }: { title: string, value: string, subvalue: string, icon: React.ReactNode }) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-3xl p-6 flex flex-col justify-between hover:bg-zinc-800/80 transition-colors cursor-pointer group">
      <div className="flex justify-between items-start mb-6">
        <div className="w-10 h-10 rounded-full bg-zinc-950 flex items-center justify-center border border-zinc-800">
          {icon}
        </div>
      </div>
      <div>
        <p className="text-3xl font-light text-white tracking-tight tabular-nums mb-1">{value}</p>
        <div className="flex justify-between items-end">
          <h3 className="text-sm font-bold text-zinc-400 group-hover:text-zinc-300 transition-colors">{title}</h3>
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest bg-zinc-950 px-2 py-1 rounded-md">{subvalue}</span>
        </div>
      </div>
    </div>
  );
}

function InteractiveToggle({ title, desc, active, onClick }: { title: string, desc: string, active: boolean, onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      role="switch"
      aria-checked={active}
      tabIndex={0}
      className={cn(
        "p-4 rounded-2xl flex items-center justify-between cursor-pointer transition-all border outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent",
        active ? "bg-indigo-500/10 border-indigo-500/30" : "bg-zinc-900 border-zinc-800/80 hover:bg-zinc-800"
      )}
    >
      <div>
        <h4 className={cn("text-sm font-bold transition-colors", active ? "text-indigo-400" : "text-zinc-200")}>{title}</h4>
        <p className="text-xs text-zinc-500 font-medium mt-1">{desc}</p>
      </div>

      {/* iOS style toggle switch visually built for Dark Mode */}
      <div className={cn(
        "w-12 h-6 rounded-full relative transition-colors duration-300 flex items-center px-1",
        active ? "bg-indigo-500" : "bg-zinc-950 border border-zinc-800"
      )}>
        <div className={cn(
          "w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300",
          active ? "translate-x-6" : "translate-x-0 bg-zinc-500"
        )} />
      </div>
    </div>
  );
}
