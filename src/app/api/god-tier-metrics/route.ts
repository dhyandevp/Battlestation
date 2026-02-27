import { NextResponse } from 'next/server';

// In a real production deployment, this cache would be Redis.
// For now, we simulate an in-memory cache managed by the Node.js backend.
let cachedGodTierMetrics = {
    // Tier 1
    upsWatts: 450,
    costPerKwh: 0.14,
    pveCpu: 45,
    pveRam: 72.4,

    // Tier 2
    wanDown: 854.2,
    wanUp: 122.1,
    dnsBlocked: '18.4%',
    failedLogins: 3,

    // Tier 3
    vramUsage: 14.2,

    // Tier 4
    activeTranscodes: 2,

    // Meta
    lastUpdated: Date.now(),
    chaosActive: false,
};

// Simulation of background polling loop (Node.js Aggregator)
// Every time an API route is hit, we fake "update" the cache if it's older than 2 seconds.
function updateMockCache() {
    const now = Date.now();
    if (now - cachedGodTierMetrics.lastUpdated > 2000) {
        cachedGodTierMetrics = {
            ...cachedGodTierMetrics,
            upsWatts: Math.max(0, cachedGodTierMetrics.upsWatts + (Math.random() * 20 - 10)),
            pveCpu: Math.min(100, Math.max(0, cachedGodTierMetrics.pveCpu + (Math.random() * 8 - 4))),
            wanDown: Math.max(0, cachedGodTierMetrics.wanDown + (Math.random() * 100 - 50)),
            wanUp: Math.max(0, cachedGodTierMetrics.wanUp + (Math.random() * 20 - 10)),
            lastUpdated: now,
        };
    }
}

export async function GET() {
    try {
        updateMockCache();
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
            // Auto reset chaos after 5 seconds
            setTimeout(() => {
                cachedGodTierMetrics.chaosActive = false;
            }, 5000);
            return NextResponse.json({ success: true, message: 'Chaos Monkey Deployed' });
        }

        return NextResponse.json({ error: 'Unknown Action' }, { status: 400 });
    } catch (error) {
        return NextResponse.json({ error: 'Middleware Failed' }, { status: 500 });
    }
}
