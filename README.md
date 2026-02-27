# Homerton Dashboard

This repository presents my Home Lab Dashboard, designed to manage and monitor my self-hosted infrastructure through a clean, modern, and structured interface.

The full production version of this dashboard is securely hosted on my private network. Due to security and privacy reasons, it cannot be publicly shared.

## Features

- **Enterprise & Professional UX:** Built with a minimal, native-feeling, slate/grayscale aesthetic optimized for focus.
- **Large live clock display:** Keep track of time instantly.
- **Integrated task management:** Built-in to-do tracking.
- **Built-in calendar system:** Manage and visualize schedules.
- **Responsive design (desktop and mobile):** Access seamlessly across any device.
- **Optimized layout with no visual flaws:** Pixel perfect alignment across all components.
- **Secure and privacy-focused structure:** Built for private, self-hosted deployments.

## Applications Supported

- Pi-hole
- Home Assistant
- Portainer
- Uptime Kuma
- Nginx Proxy Manager
- Tailscale
- Jellyfin
- Vaultwarden
- Nextcloud
- Grafana

## Production Pre-Flight Checklist

Before deploying this to Vercel or your local Docker environment, ensure the following steps are taken:

- [ ] **Database Connection:** `DATABASE_URL` is set in the `.env` file pointing to a valid PostgreSQL/Supabase instance.
- [ ] **Prisma Migration:** You have run `npx prisma db push` to initialize the database schema.
- [ ] **Security Keys:** Set `HOMELAB_INGESTION_KEY` and `HOMELAB_EXECUTION_SECRET` in your deployment environment securely.
- [ ] **Hardware Agents:** Ensure your local Raspberry Pi / Proxmox node has the python telemetry script running to ping `/api/metrics`.
- [ ] **Webhooks Map:** Ensure port-forwarded webhooks map properly to the `/api/docker-control` destination targets on your home perimeter router.

## Getting Started Locally

First, install native dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
