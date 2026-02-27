import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET endpoint: Consumed by SWR on the React Frontend to power floating dials
export async function GET() {
    try {
        const latest = await prisma.telemetry.findFirst({
            orderBy: { timestamp: 'desc' },
        });

        // Antigravity fallback if database is empty initially
        if (!latest) return NextResponse.json({ cpuTemp: 44.5, loadAvg: 1.2, ramUsage: 16.4 });
        return NextResponse.json(latest);
    } catch (error) {
        return NextResponse.json({ cpuTemp: 44.5, loadAvg: 1.2, ramUsage: 16.4 });
    }
}

// POST endpoint: Consumed securely by your local Homelab agent pushing data out
export async function POST(request: Request) {
    const apiKey = request.headers.get('x-api-key');

    if (apiKey !== process.env.HOMELAB_INGESTION_KEY) {
        return NextResponse.json({ error: 'Invalid Authority' }, { status: 401 });
    }

    try {
        const data = await request.json();
        const telemetry = await prisma.telemetry.create({
            data: {
                node: data.node,
                cpuTemp: data.cpuTemp,
                loadAvg: data.loadAvg,
                ramUsage: data.ramUsage,
            }
        });

        return NextResponse.json({ success: true, telemetry });
    } catch (error) {
        return NextResponse.json({ error: 'Malformed payload' }, { status: 400 });
    }
}
