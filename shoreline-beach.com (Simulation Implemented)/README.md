# Shoreline + Rover Simulator

Combined from the uploaded **shoreline-beach.com** website and the standalone Shoreline-styled rover simulator.

## What is new

- `/rover-simulator`: interactive browser-only rover demonstration with an explanatory introduction
- A **Rover simulator** link in Shoreline’s header navigation (desktop and mobile), footer, and a dedicated home-page call-to-action
- All original mission/design content preserved
- Same Shoreline color palette and typography; rover CSS is scoped so it does not change the rest of the website
- Lazy-loading rover code and the map so the landing page loads without simulation dependencies
- Leaflet + OpenStreetMap instead of Google Maps; no paid map key or backend required

## Run it on your Mac

Open Terminal in this **combined project** directory:

```bash
npm install
npm run dev
```

Then open the local address printed by Vite, usually `http://localhost:5173/`.

Try the three pages:

- `/` — original mission
- `/design` — original design and cost
- `/rover-simulator` — combined simulation page

For a production build:

```bash
npm run build
npm run preview
npm audit
```

The project uses the modern dependency versions originally supplied with the Shoreline website (React 19 and Vite 8). No second React install is used. Running `npm install` generates a new lockfile; do not reuse your earlier standalone rover project's lockfile.

## Important distinctions

The original Shoreline pages describe a **fixed mesh structure**, while the rover simulator shows a **separate experimental mobile rover concept**. The website labels that distinction explicitly.

**No real sensor data is used.** Movements, detections, telemetry and coordinates are simulated in the visitor's browser. Map tiles need an internet connection; the rover simulation can still operate if the tiles don't load. There is no backend or authentication.

## Files you may edit

- `src/pages/RoverSimulatorPage.tsx`: introduction above the dashboard
- `src/components/RoverSimulator.jsx`: controls, telemetry, beach simulation, and Leaflet map
- `src/components/rover.css`: simulator styling only
- `src/components/SiteHeader.tsx`: navigation
- `src/pages/Home.tsx`: landing page CTA

Avoid replacing `src/App.tsx` with the old standalone `App.jsx`; that would remove the Shoreline routes.
