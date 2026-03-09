# CloudBroker UI

<p align="center">
  <img src="public/cloudbroker-logo.svg" alt="CloudBroker" width="64" height="64" />
</p>

Web UI for the [CloudBroker](https://github.com/braghettos/cloudbroker) multi-cloud compute pricing API.

## Features

- **Recommendations** — Search for the best cloud instances by vCPU, RAM, arch, price, and more. Compare results side-by-side, export JSON/CSV.
- **Price Analytics** — Price changes table, trend charts, provider comparison bar chart, provider scorecard radar.
- **Providers** — Browse providers and regions.
- **Instances** — Explore instance types with filters; view prices in a side panel.
- **Prices** — Filterable price table.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and configure:

   ```bash
   cp .env.example .env
   ```

   - `VITE_API_BASE_URL` — Leave empty in development to use the Vite proxy.
   - `VITE_API_KEY` — API key for CloudBroker (optional in dev if backend bypasses auth).

3. Ensure the CloudBroker API is running (e.g. `http://localhost:8000`).

## Development

```bash
npm run dev
```

The app runs at `http://localhost:5173`. API requests to `/api` and `/health` are proxied to the backend.

## Build

```bash
npm run build
```

Output is in `dist/`.

## Tech Stack

- React 18 + TypeScript + Vite
- Tailwind CSS + Radix UI (shadcn-style components)
- TanStack Query, React Hook Form + Zod, Recharts, React Router v6
