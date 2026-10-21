# Shoreline-style rover simulator (standalone)

This is the **Spain Beach Cleanup rover simulation dashboard**, visually restyled to match the supplied **Shoreline** website. It is **not merged** with the Shoreline website: no routes, pages, components, or dependencies were imported from the other project.

## Design matching

- Warm dry-sand `#f3f0e6` page and light-surf `#faf8f2` panels.
- Shoreline's kelp green `#0e3f3c`, measured accent `#1c7a6d`, border `#cdc7b6` and dark drawing panel `#0c1f24`.
- Fraunces headings and Inter for controls and interface content.
- Three-wave Shoreline mark, **not** the old `BC` box, as in the supplied reference.
- Quiet, restrained controls instead of neon buttons.
- Simulator retained as a dark technical drawing, consistent with Shoreline's engineering-diagram band.

## Features retained

Everything from rover dashboard v1.4: manual and autonomous movement, sensor-range trash detection, click-to-collect, obstacle routing, return-to-base behavior, simulated automatic bin emptying/charging in auto mode, map and expanding map, speed slider, test controls, emergency stop, status indicators, and cumulative activity counter.

## Install / run

You need Node.js and npm on your Mac. From this folder run:

```bash
npm install
npm run dev
```

Then open the local address printed by Vite (typically http://localhost:5173).

### If you already have our working rover app

You can **avoid reinstalling** by copying just these files into its `src` folder:

- `src/App.jsx`
- `src/styles.css`

For the branded icon, copy `public/favicon.svg` and optionally replace `index.html`; leave your existing `package.json` and lockfile in place. No changes are required to Leaflet or React.

## Notes

- The simulation is not connected to the real rover or LiDAR.
- The small OpenStreetMap map requires a network connection for tiles.
- The reference site and simulator remain separate. A later integration can put this simulator behind a new route on the Shoreline website.
- Google Fonts are used for Fraunces and Inter. If offline, serif/system fallbacks are applied.
