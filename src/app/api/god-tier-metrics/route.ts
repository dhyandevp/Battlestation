import { NextResponse } from 'next/server';
import fetch from 'node-fetch';
import * as https from 'https';

// -------------------------------------------------------------
// ENVIRONMENT VARIABLES & CONFIG
// -------------------------------------------------------------
const PROXMOX_URL = process.env.PROXMOX_URL || 'https://10.0.0.10:8006';
const PROXMOX_TOKEN_ID = process.env.PROXMOX_TOKEN_ID;
const PROXMOX_SECRET = process.env.PROXMOX_SECRET;
const PROXMOX_NODE = process.env.PROXMOX_NODE || 'pve';

const PIHOLE_URL = process.env.PIHOLE_URL || 'http://10.0.0.53/admin/api.php';
const PIHOLE_TOKEN = process.env.PIHOLE_TOKEN;

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://10.0.0.99:11434';
const JELLYFIN_URL = process.env.JELLYFIN_URL || 'http://10.0.0.70:8096';
const JELLYFIN_TOKEN = process.env.JELLYFIN_TOKEN;
const HA_URL = process.env.HA_URL || 'http://10.0.0.81:8123';
const HA_TOKEN = process.env.HA_TOKEN;

const LOKI_URL = process.env.LOKI_URL || 'http://10.0.0.65:3100';
const DOCKER_SOCKET = process.env.DOCKER_SOCKET || 'http://10.0.0.10:2375'; // Portainer Agent / Swarm Node

// Create an HTTPS agent that ignores self-signed cert errors (common in homelabs)
const agent = new https.Agent({
    rejectUnauthorized: false
});

// -------------------------------------------------------------
// IN-MEMORY CACHE
// -------------------------------------------------------------
let cachedGodTierMetrics = {
    // Tier 1 (Metal)
    upsWatts: 450,
    costPerKwh: 0.14,
    pveCpu: 45.0,
    pveRam: 72.4,

    // Tier 2 (Shield)
    wanDown: 854.2,
    wanUp: 122.1,
    dnsBlocked: '18.4%',
    failedLogins: 3,

    // Tier 3 (Smart)
    vramUsage: 14.2,

    // Tier 4 (Life)
    activeTranscodes: 2,

    // Tier 5 (Admin)
    criticalLogs: [
        { level: 'warn', text: '[WARN] Nginx: Rate limiting enforced for IP 192.168.1.14' },
        { level: 'info', text: '[INFO] Authentik: LDAP Sync completed in 2.4s' },
        { level: 'info', text: '[INFO] Authelia: Session established for user admin' },
    ],

    // Meta
    lastUpdated: 0,
    chaosActive: false,
};

// -------------------------------------------------------------
// API FETCHERS
// -------------------------------------------------------------

async function fetchProxmoxStats() {
    if (!PROXMOX_TOKEN_ID || !PROXMOX_SECRET) return null;
    try {
        const res = await fetch(`${PROXMOX_URL}/api2/json/nodes/${PROXMOX_NODE}/status`, {
            headers: {
                'Authorization': `PVEAPIToken=${PROXMOX_TOKEN_ID}=${PROXMOX_SECRET}`
            },
            agent
        });
        const json: any = await res.json();
        if (json.data) {
            const cpu = (json.data.cpu || 0) * 100;
            const ram = (json.data.memory.used / json.data.memory.total) * 100;
            return { pveCpu: cpu, pveRam: ram };
        }
    } catch (e) {
        console.error("Proxmox Fetch Error:", e);
    }
    return null;
}

async function fetchPiholeStats() {
    if (!PIHOLE_TOKEN) return null;
    try {
        const res = await fetch(`${PIHOLE_URL}?summaryRaw&auth=${PIHOLE_TOKEN}`);
        const json: any = await res.json();
        if (json.ads_percentage_today) {
            return { dnsBlocked: `${json.ads_percentage_today.toFixed(1)}%` };
        }
    } catch (e) {
        console.error("Pi-Hole Fetch Error:", e);
    }
    return null;
}

// Simple heuristic: poll Ollama /api/ps to see loaded models and estimate VRAM
async function fetchOllamaStats() {
    try {
        const res = await fetch(`${OLLAMA_URL}/api/ps`);
        const json: any = await res.json();
        if (json.models && json.models.length > 0) {
            let vram = 0;
            for (const m of json.models) vram += m.size_vram || 0;
            return { vramUsage: (vram / (1024 * 1024 * 1024)) || 14.2 }; // return GB
        }
    } catch (e) {
        // Silent fail if Ollama is asleep
    }
    return null;
}

async function fetchJellyfinStats() {
    if (!JELLYFIN_TOKEN) return null;
    try {
        const res = await fetch(`${JELLYFIN_URL}/Sessions?ActiveWithinSeconds=120`, {
            headers: { 'Authorization': `MediaBrowser Token="${JELLYFIN_TOKEN}"` }
        });
        const json: any = await res.json();
        // Count transcode active sessions
        let count = 0;
        if (Array.isArray(json)) {
            count = json.filter(s => s.TranscodingInfo).length;
        }
        return { activeTranscodes: count };
    } catch (e) {
        console.error("Jellyfin Fetch Error:", e);
    }
    return null;
}

async function fetchLokiLogs() {
    try {
        // Query Loki for the last 5 errors/warnings across the homelab
        const limit = 5;
        const query = encodeURIComponent('{level=~"error|warn"}');
        const res = await fetch(`${LOKI_URL}/loki/api/v1/query_range?query=${query}&limit=${limit}`);
        const json: any = await res.json();

        if (json.data && json.data.result.length > 0) {
            const logs: { level: string; text: string; }[] = [];
            json.data.result.forEach((stream: any) => {
                const lbls = stream.stream;
                stream.values.forEach((val: [string, string]) => {
                    logs.push({ level: lbls.level || 'info', text: val[1] });
                });
            });
            // Grab the last 5 chronologically
            return { criticalLogs: logs.slice(-5) };
        }
    } catch (e) {
        // Silent fail if Loki instance is down
    }
    return null;
}

// -------------------------------------------------------------
// MIDDLEWARE AGGREGATOR ENGINE
// -------------------------------------------------------------
async function updateCache() {
    const now = Date.now();
    // Throttle pulls to every 5 seconds to prevent hammering the local network
    if (now - cachedGodTierMetrics.lastUpdated > 5000) {

        // Execute API calls in parallel
        const [pveStats, piholeStats, ollamaStats, jellyfinStats, lokiStats] = await Promise.all([
            fetchProxmoxStats(),
            fetchPiholeStats(),
            fetchOllamaStats(),
            fetchJellyfinStats(),
            fetchLokiLogs()
        ]);

        // Merge real data if it exists. Otherwise, drift mock data for demo purposes.
        cachedGodTierMetrics = {
            ...cachedGodTierMetrics,
            // Fallback to mocking if API keys aren't set
            upsWatts: Math.max(0, cachedGodTierMetrics.upsWatts + (Math.random() * 20 - 10)),
            pveCpu: pveStats ? pveStats.pveCpu : Math.min(100, Math.max(0, cachedGodTierMetrics.pveCpu + (Math.random() * 8 - 4))),
            pveRam: pveStats ? pveStats.pveRam : cachedGodTierMetrics.pveRam,

            wanDown: Math.max(0, cachedGodTierMetrics.wanDown + (Math.random() * 100 - 50)),
            wanUp: Math.max(0, cachedGodTierMetrics.wanUp + (Math.random() * 20 - 10)),
            dnsBlocked: piholeStats ? piholeStats.dnsBlocked : cachedGodTierMetrics.dnsBlocked,

            vramUsage: ollamaStats ? ollamaStats.vramUsage : cachedGodTierMetrics.vramUsage,
            activeTranscodes: jellyfinStats ? jellyfinStats.activeTranscodes : cachedGodTierMetrics.activeTranscodes,

            criticalLogs: lokiStats ? lokiStats.criticalLogs : cachedGodTierMetrics.criticalLogs,

            lastUpdated: now,
        };
    }
}

export async function GET() {
    try {
        await updateCache();
        return NextResponse.json({ success: true, data: cachedGodTierMetrics });
    } catch (error) {
        return NextResponse.json({ error: 'Middleware Aggregator Failed' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        if (body.action === 'trigger_chaos') {
            cachedGodTierMetrics.chaosActive = true;

            // Randomly stop a non-essential node via Docker API (Chaos Engine)
            try {
                // Fetch running containers
                const cRes = await fetch(`${DOCKER_SOCKET}/containers/json`);
                const containers: any = await cRes.json();
                if (containers && containers.length > 0) {
                    // Filter out core routing/proxy layers so we don't bring the whole network down
                    const safeTargets = containers.filter((c: any) => !c.Names[0].includes("nginx") && !c.Names[0].includes("pihole"));
                    if (safeTargets.length > 0) {
                        const target = safeTargets[Math.floor(Math.random() * safeTargets.length)];
                        cachedGodTierMetrics.criticalLogs.unshift({ level: 'fatal', text: `[FATAL] CONTAINER KILLED (Chaos Monkey Triggered) -> Target: ${target.Names[0]}` });
                        // Execute actual chaotic stop
                        await fetch(`${DOCKER_SOCKET}/containers/${target.Id}/stop`, { method: 'POST' });
                    }
                }
            } catch (e) {
                // Mock consequence if docker socket unavailable
                cachedGodTierMetrics.criticalLogs.unshift({ level: 'fatal', text: `[FATAL] CONTAINER KILLED (Chaos Monkey Triggered) -> Target: portainer/portainer-ce` });
            }

            setTimeout(() => {
                cachedGodTierMetrics.chaosActive = false;
            }, 5000);
            return NextResponse.json({ success: true, message: 'Chaos Monkey Deployed' });
        }

        // Tier 3 Quick Actions Hook (Home Assistant Integration)
        if (body.action === 'ha_toggle' && HA_TOKEN) {
            const domain = body.entity_id.split('.')[0];
            await fetch(`${HA_URL}/api/services/${domain}/toggle`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${HA_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ entity_id: body.entity_id })
            });
            return NextResponse.json({ success: true, message: `Toggled ${body.entity_id}` });
        }

        return NextResponse.json({ error: 'Unknown Action' }, { status: 400 });
    } catch (error) {
        return NextResponse.json({ error: 'Middleware Failed' }, { status: 500 });
    }
}
