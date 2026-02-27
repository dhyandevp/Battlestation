"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Server, Shield, Cpu, Activity, Zap, Film,
  Database, Bell, Wrench, Settings, Search,
  PlayCircle, Clock, AlertTriangle, PowerOff, PauseCircle, CheckCircle2,
  Thermometer, HardDrive, Wifi, Lock, Eye, Calendar
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Simulated God-Tier API Fetcher
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function GodTierCommandCenter() {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState<Date | null>(null);
  const [chaosActive, setChaosActive] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Real state powered by the Middleware Aggregator
  const [sysStats, setSysStats] = useState({
    upsWatts: 450,
    costPerKwh: 0.14,
    pveCpu: 45,
    pveRam: 72,
    wanDown: 854,
    wanUp: 122,
    dnsBlocked: '18.4%',
    failedLogins: 3,
    activeTranscodes: 2,
    vramUsage: 14.2
  });

  useEffect(() => {
    setMounted(true);
    setTime(new Date());
    const clockTimer = setInterval(() => setTime(new Date()), 1000);

    // Real-time polling to the Node Middleware Aggregator
    const fetchMetrics = async () => {
      if (maintenanceMode) return;
      try {
        const res = await fetcher('/api/god-tier-metrics');
        if (res?.success && res.data) {
          setSysStats(prev => ({ ...prev, ...res.data }));
          if (res.data.chaosActive !== undefined) {
            setChaosActive(res.data.chaosActive);
          }
        }
      } catch (e) {
        console.error("Middleware fetch failed", e);
      }
    };

    fetchMetrics(); // Initial fetch
    const metricTimer = setInterval(fetchMetrics, 2000);

    return () => {
      clearInterval(clockTimer);
      clearInterval(metricTimer);
    };
  }, [maintenanceMode]);

  const triggerChaos = async () => {
    setChaosActive(true);
    try {
      await fetch('/api/god-tier-metrics', {
        method: 'POST',
        body: JSON.stringify({ action: 'trigger_chaos' })
      });
    } catch (e) {
      console.error("Failed to trigger chaos", e);
    }
  };

  const currentMonthlyCost = ((sysStats.upsWatts / 1000) * 24 * 30 * sysStats.costPerKwh).toFixed(2);

  return (
    <div className={cn(
      "min-h-screen bg-[#030303] text-zinc-300 font-sans flex flex-col overflow-x-hidden selection:bg-cyan-500/30 transition-all duration-700 relative",
      maintenanceMode ? "grayscale opacity-80" : ""
    )}>

      {/* Dynamic Cyber-Glass Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-fuchsia-600/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
      {chaosActive && <div className="absolute inset-0 bg-red-600/5 z-0 pointer-events-none animate-pulse" />}

      {/* HEADER: Omni-Bar */}
      <header className="sticky top-0 z-50 px-6 py-4 border-b border-white/5 bg-[#030303]/70 backdrop-blur-2xl flex justify-between items-center shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-[1px] shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <div className="w-full h-full bg-[#030303] rounded-[11px] flex items-center justify-center">
              <Activity size={20} className="text-cyan-400" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-widest uppercase">Battle<span className="text-cyan-400">Station</span> V3</h1>
            <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-zinc-500">
              <span className={cn("w-2 h-2 rounded-full animate-pulse", maintenanceMode ? "bg-amber-500" : "bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]")} />
              {maintenanceMode ? "MAINTENANCE MODE" : "MIDDLEWARE ONLINE"}
            </div>
          </div>
        </div>

        {/* Time & Feature Toggles */}
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex flex-col items-end">
            <span className="text-2xl font-light tabular-nums text-white tracking-tight leading-none">
              {mounted && time ? format(time, "HH:mm") : "--:--"}
              <span className="text-cyan-500 font-bold ml-1 text-sm">{mounted && time ? format(time, "ss") : "--"}</span>
            </span>
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest mt-1">
              {mounted && time ? format(time, "EEE, MMM do") : "--"}
            </span>
          </div>

          <div className="h-8 w-[1px] bg-white/10 hidden md:block" />

          <div className="flex gap-2">
            {/* special features */}
            <button
              onClick={() => setMaintenanceMode(!maintenanceMode)}
              className={cn(
                "px-3 py-1.5 rounded-lg border text-xs font-bold transition-all uppercase tracking-widest flex items-center gap-2",
                maintenanceMode ? "bg-amber-500/20 border-amber-500/50 text-amber-500" : "bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:bg-white/10"
              )}
            >
              <PauseCircle size={14} /> Maintenance
            </button>
            <button
              onClick={triggerChaos}
              className="px-3 py-1.5 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white text-xs font-bold transition-all uppercase tracking-widest flex items-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
            >
              <AlertTriangle size={14} /> Chaos Mode
            </button>
          </div>
        </div>
      </header>

      {/* SUPER GRID */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1800px] w-full mx-auto relative z-10 space-y-6 md:space-y-8">

        {/* ========================================================= */}
        {/* TIER 1: METAL (Infrastructure)                            */}
        {/* ========================================================= */}
        <section>
          <h2 className="text-sm font-bold text-cyan-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <Server size={18} /> Tier 1: Metal
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <GlassCard glow="cyan">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Cluster CPU</span>
                <Cpu size={16} className="text-cyan-400" />
              </div>
              <div className="text-3xl font-light text-white">{sysStats.pveCpu.toFixed(1)}<span className="text-lg text-zinc-500">%</span></div>
              <ProgressBar value={sysStats.pveCpu} color="bg-cyan-500" />
            </GlassCard>

            <GlassCard glow="cyan">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Memory (RAM)</span>
                <Database size={16} className="text-cyan-400" />
              </div>
              <div className="text-3xl font-light text-white">{sysStats.pveRam}<span className="text-lg text-zinc-500">%</span></div>
              <ProgressBar value={sysStats.pveRam} color="bg-cyan-500" />
            </GlassCard>

            <GlassCard glow="blue">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">UPS Draw</span>
                <Zap size={16} className="text-blue-400" />
              </div>
              <div className="text-3xl font-light text-white tabular-nums">{sysStats.upsWatts.toFixed(0)} <span className="text-lg text-zinc-500">W</span></div>
              <div className="text-xs text-blue-400 font-bold tracking-widest uppercase mt-2">Est. Runtime: 42m</div>
            </GlassCard>

            {/* Energy Cost Estimator */}
            <GlassCard glow="emerald" className="bg-emerald-950/20 border-emerald-500/20">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Energy Cost</span>
                <span className="text-xs font-bold text-emerald-400 border border-emerald-500/30 px-2 rounded-md bg-emerald-500/10">${sysStats.costPerKwh}/kWh</span>
              </div>
              <div className="text-3xl font-light text-white tabular-nums">${currentMonthlyCost}</div>
              <div className="text-xs text-emerald-500/70 font-bold tracking-widest uppercase mt-2">Est. Monthly Total</div>
            </GlassCard>
          </div>
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">

          {/* ========================================================= */}
          {/* TIER 2: SHIELD (Networking & Security)                    */}
          {/* ========================================================= */}
          <section className="space-y-4">
            <h2 className="text-sm font-bold text-fuchsia-500 uppercase tracking-[0.2em] flex items-center gap-2">
              <Shield size={18} /> Tier 2: Shield
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[calc(100%-2rem)]">
              <GlassCard className="flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">WAN Traffic</span>
                  <Wifi size={16} className="text-fuchsia-400" />
                </div>
                <div className="flex-1 flex flex-col justify-center gap-4">
                  <div>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Downlink</p>
                    <p className="text-2xl font-light text-white tabular-nums">{sysStats.wanDown.toFixed(1)} <span className="text-sm text-zinc-500">Mbps</span></p>
                    <ProgressBar value={(sysStats.wanDown / 1000) * 100} color="bg-fuchsia-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Uplink</p>
                    <p className="text-2xl font-light text-white tabular-nums">{sysStats.wanUp.toFixed(1)} <span className="text-sm text-zinc-500">Mbps</span></p>
                    <ProgressBar value={(sysStats.wanUp / 1000) * 100} color="bg-fuchsia-400" />
                  </div>
                </div>
              </GlassCard>

              <div className="grid grid-rows-2 gap-4">
                <GlassCard glow="fuchsia" className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">DNS Ad-Block</p>
                    <p className="text-xl font-light text-white">{sysStats.dnsBlocked}</p>
                  </div>
                  <Lock size={24} className="text-fuchsia-500/50" />
                </GlassCard>
                <GlassCard glow="rose" className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Failed SSO Logins</p>
                    <p className="text-xl font-light text-rose-400">{sysStats.failedLogins} Attempts</p>
                  </div>
                  <Shield size={24} className="text-rose-500/50" />
                </GlassCard>
              </div>
            </div>
          </section>

          {/* ========================================================= */}
          {/* TIER 3: SMART (AI & Automation)                           */}
          {/* ========================================================= */}
          <section className="space-y-4">
            <h2 className="text-sm font-bold text-indigo-500 uppercase tracking-[0.2em] flex items-center gap-2">
              <Cpu size={18} /> Tier 3: Smart
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[calc(100%-2rem)]">
              <GlassCard glow="indigo" className="flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Ollama VRAM</span>
                  <span className="text-[10px] font-bold bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded">Llama3:8b</span>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="relative w-32 h-32 rounded-full border-[4px] border-white/5 flex items-center justify-center shadow-[inset_0_0_20px_rgba(99,102,241,0.2)]">
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                      <circle cx="64" cy="64" r="60" fill="none" stroke="currentColor" strokeWidth="4" className="text-white/5" />
                      <circle cx="64" cy="64" r="60" fill="none" stroke="currentColor" strokeWidth="4"
                        className="text-indigo-500"
                        strokeLinecap="round"
                        strokeDasharray={377}
                        strokeDashoffset={377 - (377 * (sysStats.vramUsage / 24))}
                        style={{ transition: 'stroke-dashoffset 1s ease-out' }} />
                    </svg>
                    <div className="text-center">
                      <p className="text-xl font-bold text-white tabular-nums">{sysStats.vramUsage.toFixed(1)}<span className="text-xs text-zinc-500 block">/ 24 GB</span></p>
                    </div>
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Home Actions</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <ActionButton icon={<Activity size={16} />} label="Office Lights" active />
                  <ActionButton icon={<Lock size={16} />} label="Front Door" active />
                  <ActionButton icon={<Thermometer size={16} />} label="HVAC 72°" active={false} />
                  <ActionButton icon={<PowerOff size={16} />} label="Kill Switch" active={false} />
                </div>
              </GlassCard>
            </div>
          </section>
        </div>

        {/* ========================================================= */}
        {/* TIER 4: LIFE (Media)                                      */}
        {/* ========================================================= */}
        <section>
          <h2 className="text-sm font-bold text-purple-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <Film size={18} /> Tier 4: Life
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Re-using the official F1 requested movie posters. */}
              <MediaPoster src="https://image.tmdb.org/t/p/w600_and_h900_bestv2/u2T7IhJwvhIWEdXxbTve2Ew2M3G.jpg" title="Drive to Survive" />
              <MediaPoster src="https://image.tmdb.org/t/p/w600_and_h900_bestv2/l3n1xZ1oXyM5E8o22ZgqfIt0NnP.jpg" title="Senna" />
              <MediaPoster src="https://image.tmdb.org/t/p/w600_and_h900_bestv2/uE1wA5kR303O0D10DtvxG5O91Kz.jpg" title="Rush" />
            </div>

            <div className="space-y-4 flex flex-col">
              <GlassCard className="flex-1 flex flex-col justify-center text-center items-center">
                <PlayCircle size={32} className="text-purple-500 mb-3" />
                <p className="text-4xl font-light text-white mb-1">{sysStats.activeTranscodes}</p>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Active Transcodes</p>
              </GlassCard>
              <GlassCard className="flex-1 flex flex-col justify-center text-center items-center bg-[url('https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=600&auto=format&fit=crop')] bg-cover bg-center relative overflow-hidden text-white border-white/20">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                <div className="relative z-10 w-full">
                  <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest mb-1">Immich Memory</p>
                  <p className="text-sm font-bold truncate">Norway Trip</p>
                  <p className="text-xs text-white/50">3 Years Ago</p>
                </div>
              </GlassCard>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* TIER 5: ADMIN (DevOps)                                    */}
        {/* ========================================================= */}
        <section>
          <h2 className="text-sm font-bold text-amber-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <Wrench size={18} /> Tier 5: Admin
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <GlassCard className="flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Docker Watchtower</h3>
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center text-xs font-bold">3</span>
              </div>
              <div className="space-y-2">
                <UpdateRow name="jellyfin/jellyfin:latest" />
                <UpdateRow name="louislam/uptime-kuma:1" />
                <UpdateRow name="pihole/pihole:latest" />
              </div>
            </GlassCard>

            <GlassCard className="lg:col-span-2 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Loki Critical Log Feed</h3>
                <button className="text-[10px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest">View All</button>
              </div>
              <div className="flex-1 bg-[#010101] rounded-xl border border-white/5 p-4 font-mono text-[11px] leading-extralight overflow-y-auto space-y-2 relative">
                {chaosActive && <div className="text-red-500">[FATAL] CONTAINER KILLED (Chaos Monkey Triggered) -&gt; Target: portainer/portainer-ce</div>}
                <div className="text-amber-400">[WARN] Nginx: Rate limiting enforced for IP 192.168.1.14</div>
                <div className="text-zinc-400">[INFO] Authentik: LDAP Sync completed in 2.4s</div>
                <div className="text-zinc-600">[INFO] Authelia: Session established for user admin</div>
              </div>
            </GlassCard>
          </div>
        </section>

      </main>
    </div>
  );
}

/** ==========================================
 * CYBER-GLASS UI COMPONENTS
 * ========================================== */

function GlassCard({ children, className, glow }: { children: React.ReactNode, className?: string, glow?: 'cyan' | 'fuchsia' | 'emerald' | 'rose' | 'indigo' | 'blue' }) {

  const glowMapping = {
    cyan: "hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:border-cyan-500/30",
    fuchsia: "hover:shadow-[0_0_30px_rgba(217,70,239,0.15)] hover:border-fuchsia-500/30",
    emerald: "hover:border-emerald-500/30",
    rose: "hover:border-rose-500/30",
    indigo: "hover:border-indigo-500/30 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]",
    blue: "hover:border-blue-500/30"
  };

  return (
    <div className={cn(
      "bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-2xl p-5 md:p-6 transition-all duration-300",
      glow ? glowMapping[glow] : "hover:border-white/[0.1] hover:bg-white/[0.04]",
      className
    )}>
      {children}
    </div>
  );
}

function ProgressBar({ value, color }: { value: number, color: string }) {
  return (
    <div className="mt-2 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
      <div className={cn("h-full rounded-full transition-all duration-1000", color)} style={{ width: `${value}%` }} />
    </div>
  );
}

function ActionButton({ icon, label, active }: { icon: React.ReactNode, label: string, active: boolean }) {
  return (
    <button className={cn(
      "p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all",
      active ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400" : "bg-white/5 border-white/5 text-zinc-500 hover:text-zinc-300 hover:bg-white/10"
    )}>
      {icon}
      <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
    </button>
  );
}

function MediaPoster({ src, title }: { src: string, title: string }) {
  return (
    <div className="relative aspect-[2/3] rounded-2xl overflow-hidden border border-white/10 bg-black/50 group cursor-pointer shadow-xl">
      <img src={src} alt={title} className="w-full h-full object-cover group-hover:scale-110 group-hover:opacity-60 transition-all duration-700 opacity-80" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
      <div className="absolute bottom-4 left-4 right-4">
        <h4 className="text-white font-bold text-sm truncate">{title}</h4>
      </div>
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <PlayCircle size={40} className="text-white shadow-2xl drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
      </div>
    </div>
  );
}

function UpdateRow({ name }: { name: string }) {
  return (
    <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5">
      <span className="text-xs font-mono text-zinc-400 truncate pr-4">{name}</span>
      <button className="text-[10px] font-bold uppercase tracking-widest text-amber-500 bg-amber-500/10 px-2 py-1 rounded hover:bg-amber-500 hover:text-[#030303] transition-colors whitespace-nowrap">
        Update
      </button>
    </div>
  );
}
