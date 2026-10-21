# Spain Beach Cleanup Rover Dashboard

A browser-based frontend simulation for the EPICS Spain Beach Cleanup rover.

## Features

- Modern dark telemetry dashboard
- Interactive LiDAR-style beach simulation
- Click-to-move manual control
- WASD / arrow-key manual control
- Autonomous demo mode
- Trash detection and clickable trash targets
- Trash pickup updates the bin telemetry
- Obstacle detection
- Simulated battery usage, distance, speed, runtime and connection status
- Presentation/test buttons for trash, obstacles, battery, bin, connection and E-stop
- OpenStreetMap + Leaflet mini map
- Expandable live map
- Simulated GPS synchronized to the rover position
- Event log

## Run it

Install Node.js first. Node 20 LTS or newer is recommended.

Open a terminal in this folder and run:

```bash
npm install
npm run dev
```

Vite will print a local URL, usually:

```text
http://localhost:5173
```

Open that URL in a browser.

## Presentation build

```bash
npm run build
npm run preview
```

The production files will be placed in `dist/`.

## Important

The dashboard simulation itself is local, but OpenStreetMap map tiles require an internet connection. The beach simulation still works if map tiles are unavailable.

## Main files to edit

- `src/App.jsx` — simulation behavior, robot data, trash, obstacles and map coordinates
- `src/styles.css` — colors, layout and visual appearance

## Later: connect the real rover

Right now all telemetry lives in browser state. Later, the same interface can be fed with Raspberry Pi telemetry through WebSockets, REST, MQTT, or another connection method.
