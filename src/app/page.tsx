"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Bell, Activity, Lock, Unlock,
  Home, Bed, Car, TreePine, Plus, Server, CheckCircle2, Circle,
  RefreshCw, Power, Trash2
} from "lucide-react";

/** ==========================================
 * UTILITY & DATA PREP
 * ========================================== */
const fetcher = (url: string) => fetch(url).then((res) => res.json());

const INITIAL_TASKS = [
  { id: 1, text: "Update Pi-hole blocklists", done: false },
  { id: 2, text: "Check Proxmox backup logs", done: true },
  { id: 3, text: "Renew SSL certificates", done: false },
];

const HOSTED_APPS = [
  { name: "Pi-hole", status: "Active", color: "bg-slate-600" },
  { name: "Home Assistant", status: "Active", color: "bg-slate-700" },
  { name: "Portainer", status: "Active", color: "bg-slate-800" },
  { name: "Uptime Kuma", status: "Active", color: "bg-slate-600" },
  { name: "Nginx Proxy", status: "Active", color: "bg-slate-700" },
  { name: "Tailscale", status: "Active", color: "bg-slate-800" },
  { name: "Jellyfin", status: "Active", color: "bg-slate-600" },
  { name: "Vaultwarden", status: "Active", color: "bg-slate-700" },
];

/** ==========================================
 * MAIN VIEW
 * ========================================== */
export default function CommandCenter() {
  const [metrics, setMetrics] = useState<any>(null);
  const [locks, setLocks] = useState({ front: true, bedroom: false, garage: true });

  // Mounted check for hydration safety with Date
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState<Date | null>(null);
  const [tasks, setTasks] = useState(INITIAL_TASKS);

  useEffect(() => {
    setMounted(true);
    setTime(new Date());

    // Clock Timer
    const clockTimer = setInterval(() => setTime(new Date()), 1000);

    // Metrics Polling
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

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900 font-sans p-4 md:p-8 flex justify-center items-center">
      <main className="w-full max-w-[1440px] bg-white rounded-3xl shadow-sm border border-zinc-200 p-6 md:p-10 flex flex-col gap-8 ring-1 ring-zinc-900/5">

        {/* --- NAVBAR --- */}
        <header className="flex justify-between items-center pb-6 border-b border-zinc-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-white" aria-hidden="true">
              <Activity size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-900">Homerton Core</span>
          </div>

          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-zinc-500" aria-label="Main Navigation">
            <a href="#" className="text-zinc-900 bg-zinc-100 px-4 py-2 rounded-lg" aria-current="page">Dashboard</a>
            <a href="#" className="hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 rounded px-2 py-1">Applications</a>
            <a href="#" className="hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 rounded px-2 py-1">Infrastructure</a>
            <a href="#" className="hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 rounded px-2 py-1">Settings</a>
          </nav>

          <div className="flex items-center gap-4">
            <button aria-label="Notifications" className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-zinc-100 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-900">
              <Bell size={20} className="text-zinc-600" />
            </button>
            <div className="w-10 h-10 rounded-full bg-zinc-200 border border-zinc-300 overflow-hidden" aria-label="User Profile" role="img" />
          </div>
        </header>

        {/* --- DASHBOARD GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

          {/* LEFT CONTENT COLUMN */}
          <section className="lg:col-span-8 flex flex-col gap-8">

            {/* Header / Date / Clock (SEO & semantic text) */}
            <article className="flex max-md:flex-col justify-between items-start md:items-end gap-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight text-zinc-900">
                  Infrastructure Health
                </h1>
                <p className="text-zinc-500 mt-1 font-medium text-sm lg:text-base">
                  {mounted && time ? format(time, "EEEE, MMMM do yyyy") : "Loading date..."}
                </p>
              </div>

              <div aria-live="polite" className="text-left md:text-right">
                <p className="text-4xl lg:text-5xl font-light tracking-tighter text-zinc-900 tabular-nums">
                  {mounted && time ? format(time, "HH:mm") : "--:--"}
                  <span className="text-2xl text-zinc-400 font-medium ml-1">
                    {mounted && time ? format(time, "ss") : "--"}
                  </span>
                </p>
                <h2 className="text-xs font-bold text-zinc-500 tracking-widest uppercase mt-1">Local Edge Time</h2>
              </div>
            </article>

            {/* Core Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MetricCard title="Network Edge" value="Healthy" dotColor="bg-emerald-500" />
              <MetricCard title="Proxmox Load" value={`${metrics?.loadAvg || '1.2'} Avg`} dotColor="bg-blue-500" />
              <MetricCard title="DNS Sinkhole" value="Active" dotColor="bg-indigo-500" />
            </div>

            {/* Split View: Live Feed & Tasks */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

              {/* Rack Live View */}
              <div className="md:col-span-7 lg:col-span-8 relative rounded-2xl overflow-hidden bg-zinc-900 h-64 shadow-inner ring-1 ring-zinc-900/10">
                <div className="absolute inset-x-0 top-0 p-4 flex justify-between items-start z-10 bg-gradient-to-b from-black/50 to-transparent">
                  <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/10">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" aria-hidden="true" />
                    <span className="text-xs font-medium text-white">Rack Live Feed</span>
                  </div>
                </div>
                {/* Fallback pattern for camera frame */}
                <div className="w-full h-full opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
              </div>

              {/* Task Manager Widget */}
              <div className="md:col-span-5 lg:col-span-4 bg-zinc-50 rounded-2xl p-5 border border-zinc-200 flex flex-col">
                <h3 className="text-sm font-semibold text-zinc-900 mb-4">Maintenance Tasks</h3>
                <ul className="flex-1 space-y-3" role="list">
                  {tasks.map(task => (
                    <li key={task.id} className="flex items-start gap-3">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="mt-0.5 focus:outline-none focus:ring-2 focus:ring-zinc-900 rounded flex-shrink-0"
                        aria-label={task.done ? "Mark task incomplete" : "Mark task complete"}
                        aria-pressed={task.done}
                      >
                        {task.done ? <CheckCircle2 size={18} className="text-zinc-400" /> : <Circle size={18} className="text-zinc-300 hover:text-zinc-500 transition-colors" />}
                      </button>
                      <span className={`text-sm ${task.done ? 'text-zinc-400 line-through' : 'text-zinc-700 font-medium'}`}>
                        {task.text}
                      </span>
                    </li>
                  ))}
                </ul>
                <button className="w-full mt-4 flex items-center justify-center gap-2 text-xs font-medium text-zinc-900 bg-white border border-zinc-200 hover:bg-zinc-50 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-900">
                  <Plus size={14} /> Add Task
                </button>
              </div>

            </div>

            {/* Application Drawer */}
            <section aria-label="Hosted Applications">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-semibold text-zinc-900">Hosted Applications</h3>
                <a href="#" className="text-sm font-medium text-indigo-600 hover:underline">View Stack</a>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x" role="list">
                {HOSTED_APPS.map((app, i) => (
                  <div
                    key={i}
                    role="listitem"
                    tabIndex={0}
                    className="snap-start min-w-[140px] bg-white border border-zinc-200 rounded-xl p-4 flex flex-col items-center gap-3 hover:border-zinc-300 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  >
                    <div className={`w-10 h-10 rounded-lg ${app.color} flex items-center justify-center text-white`} aria-hidden="true">
                      <Server size={18} />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-zinc-900">{app.name}</p>
                      <p className="text-xs text-emerald-600 mt-0.5 font-medium">{app.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </section>

          {/* RIGHT SIDEBAR COLUMN */}
          <aside className="lg:col-span-4 flex flex-col gap-8">

            {/* Telemetry Dial */}
            <section className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6" aria-label="System Telemetry">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900">Proxmox Cluster</h3>
                  <p className="text-xs text-zinc-500 mt-1">Core Thermal Output</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Avg Temp</p>
                  <p className="text-sm font-semibold text-zinc-900">45&deg;</p>
                </div>
              </div>

              {/* Minimal Dial Implementation (No JS animations needed for production static state) */}
              <div className="relative w-full aspect-[2/1] flex items-end justify-center overflow-hidden">
                <svg viewBox="0 0 200 100" className="w-full absolute bottom-0" aria-hidden="true">
                  <path d="M 20 95 A 75 75 0 0 1 180 95" fill="none" stroke="#e4e4e7" strokeWidth="12" strokeLinecap="round" />
                  {/* Indicator Bar */}
                  <path
                    d="M 20 95 A 75 75 0 0 1 180 95"
                    fill="none"
                    stroke="#3f3f46"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray="235"
                    strokeDashoffset={235 - (235 * (metrics?.cpuTemp || 45) / 100)}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute bottom-2 flex flex-col items-center">
                  <span className="text-4xl font-light text-zinc-900 tabular-nums">
                    {metrics?.cpuTemp || 45}&deg;
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between mt-6 gap-2">
                <button className="flex-1 py-2 rounded-lg bg-zinc-900 text-white text-xs font-medium hover:bg-zinc-800 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900">
                  Peak Mode
                </button>
                <button className="flex-1 py-2 rounded-lg bg-white border border-zinc-200 text-zinc-900 text-xs font-medium hover:bg-zinc-50 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900">
                  Eco Mode
                </button>
              </div>
            </section>

            {/* Smart Calendar */}
            <section className="bg-white border border-zinc-200 rounded-2xl p-6" aria-label="System Calendar">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-semibold text-zinc-900">Deployment Calendar</h3>
                <button className="text-xs font-medium text-zinc-500 hover:text-zinc-900 underline focus:outline-none">Full Month</button>
              </div>

              <div>
                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                    <span key={d} className="text-[10px] font-bold text-zinc-400" aria-hidden="true">{d}</span>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1" role="grid" aria-label="Current Month Calendar">
                  {[...Array(28)].map((_, i) => {
                    const isToday = mounted && time && (i + 1 === parseInt(format(time, "d")));
                    return (
                      <div
                        key={i}
                        role="gridcell"
                        tabIndex={0}
                        aria-selected={isToday ? "true" : "false"}
                        className={`h-8 w-full flex items-center justify-center rounded text-xs font-medium cursor-pointer transition-colors focus:ring-2 focus:ring-zinc-900 outline-none
                          ${isToday ? 'bg-zinc-900 text-white shadow-sm' : 'text-zinc-600 hover:bg-zinc-100'}`}
                      >
                        {i + 1}
                      </div>
                    )
                  })}
                </div>
              </div>
            </section>

          </aside>
        </div>
      </main>
    </div>
  );
}

/** ==========================================
 * PURE SUB-COMPONENTS
 * ========================================== */
function MetricCard({ title, value, dotColor }: { title: string, value: string, dotColor: string }) {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-4 flex flex-col justify-center">
      <div className="flex items-center gap-2 mb-2">
        <span className={`w-2.5 h-2.5 rounded-full ${dotColor}`} aria-hidden="true" />
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{title}</h3>
      </div>
      <p className="text-lg font-semibold text-zinc-900">{value}</p>
    </div>
  );
}
