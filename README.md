# TwinView — Industrial Digital Twin Demo

An interview-ready frontend demonstration of an industrial digital twin built with React, TypeScript, Three.js, React Three Fiber, Drei, and Recharts.

## What it demonstrates

- Interactive 3D centrifugal pump assembly (procedural Three.js geometry; no external model download required)
- Clickable component selection and metadata panel
- Simulated telemetry that updates every 2.5 seconds
- Temperature and vibration history chart
- Equipment status, alert panel, and a downloadable JSON asset report
- Responsive dark dashboard UI

> **Data integrity:** This is a portfolio/demo application. Telemetry is simulated and does not come from physical equipment. The current version uses local in-memory state; it does not yet include authentication, a persistent database, or a production telemetry ingestion service.

## Requirements

- Node.js 20+ (Node 22 recommended)
- npm

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).

## Production build

```bash
npm run build
npm run preview
```

The deployable static files are written to `dist/`.

## Deploy free/low-friction demo

### Option A — Vercel (quickest)
1. Create a GitHub repository named `twinview-digital-twin` and push this project.
2. In Vercel, import the repository.
3. Framework preset: **Vite**. Build command: `npm run build`. Output directory: `dist`.
4. Click Deploy and open the generated HTTPS URL.
5. Test 3D orbit/zoom, click each machine component, check live telemetry, and export the JSON report.

### Option B — Netlify
1. Import the GitHub repository in Netlify.
2. Build command: `npm run build`; publish directory: `dist`.
3. Deploy and test the generated URL.

### Option C — AWS Amplify Hosting
1. Push the repository to GitHub.
2. In AWS Amplify, choose **Host web app** and connect the repository/branch.
3. Use build command `npm run build` and artifact directory `dist` (Amplify's Vite build settings can usually be detected automatically).
4. Deploy and test the generated URL. This is a static frontend and does not require an EC2 instance.

## Suggested GitHub repository description

`Interactive industrial digital twin demo built with React, TypeScript, Three.js and React Three Fiber. Includes component inspection, simulated telemetry, performance charts and asset reporting.`

## 90-second demo script

1. “This is TwinView, a small industrial digital twin proof of concept.”
2. Orbit and zoom the pump model to show the 3D view is interactive.
3. Select the cooling fan and motor to show component metadata and maintenance context.
4. Point out temperature, RPM, vibration, and the telemetry chart updating in real time.
5. Show the maintenance alert and export the asset report.
6. Close with: “For a production deployment, I’d connect this UI to a NestJS API, persist asset/component metadata in PostgreSQL, and stream sensor readings over WebSockets or MQTT through a validated ingestion service.”

## Production roadmap

- NestJS API + PostgreSQL for assets, components, users, and maintenance records
- WebSocket/MQTT ingestion for real telemetry (with schema validation and authentication)
- S3-hosted versioned GLB/GLTF assets and signed URLs where appropriate
- Authentication and role-based access
- Tests, error/empty states, CI/CD, monitoring, and deployment environments

## Architecture (current demo)

```text
React + TypeScript
  ├── React Three Fiber / Three.js — interactive machine model
  ├── Local simulated telemetry — timer-driven readings
  ├── Recharts — temperature/vibration trend
  └── JSON export — current asset snapshot

Future production architecture:
React UI → NestJS API/WebSocket gateway → PostgreSQL
                               ↑
                     MQTT / sensor ingestion
S3 → versioned GLB/GLTF assets
```
