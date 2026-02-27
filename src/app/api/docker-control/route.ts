import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { action } = await request.json();

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
