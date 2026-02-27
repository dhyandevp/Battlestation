import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export async function POST(request: Request) {
    try {
        const { action } = await request.json();

        // Log intent to Prisma to update the Activity feed instantly
        try {
            if (process.env.DATABASE_URL) {
                const prisma = new PrismaClient({
                    datasourceUrl: process.env.DATABASE_URL
                } as any);
                await prisma.systemLog.create({
                    data: {
                        level: 'info',
                        source: 'Command Console',
                        message: `Command dispatched: ${action}`,
                    }
                });
            }
        } catch (dbError) {
            console.warn("Database not configured, skipped logging:", action);
        }

        // Call your homelab server through Cloudflare Tunnels / Port-forwarding
        const HOMELAB_TUNNEL = process.env.HOMELAB_TUNNEL_URL;

        // Fire and forget webhook trigger
        if (HOMELAB_TUNNEL) {
            await fetch(`${HOMELAB_TUNNEL}/webhook/${action}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${process.env.HOMELAB_EXECUTION_SECRET}` }
            }).catch((e) => console.log('Homelab hook swallowed:', e));
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Command execution failed' }, { status: 500 });
    }
}
