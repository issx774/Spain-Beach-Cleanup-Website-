import React, { useEffect, useMemo, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './rover.css'

const SIM_W = 1000
const SIM_H = 650
const ROBOT_RADIUS = 22
const PICKUP_RADIUS = 27
const DETECTION_RADIUS = 135
const BIN_CAPACITY = 40
const LOW_BATTERY_RETURN = 15
const HOME_RADIUS = 10
const TICK_MS = 55
const METERS_PER_PIXEL = 0.017
const MIN_X = 38
const MAX_X = SIM_W - 38
const MIN_Y = 185
const MAX_Y = SIM_H - 38

// Demonstration coordinates: a short, beach-aligned corridor around Barceloneta.
// These are NOT real GPS measurements. No simulated position is mapped to city streets.
const BEACH_TRACK = {
  southwest: [41.38010, 2.19348],
  northeast: [41.38156, 2.19472],
}

const INITIAL_ROBOT = { x: 168, y: 500, heading: -20 }
const HOME_POSITION = { x: INITIAL_ROBOT.x, y: INITIAL_ROBOT.y }

const INITIAL_TRASH = [
  { id: 1, x: 260, y: 470, type: 'Bottle', volume: 1.2, detected: false },
  { id: 2, x: 355, y: 535, type: 'Can', volume: 0.7, detected: false },
  { id: 3, x: 460, y: 400, type: 'Bottle cap', volume: 0.2, detected: false },
  { id: 4, x: 570, y: 500, type: 'Cigarette', volume: 0.1, detected: false },
  { id: 5, x: 650, y: 390, type: 'Paper', volume: 0.4, detected: false },
  { id: 6, x: 755, y: 455, type: 'Bottle', volume: 1.2, detected: false },
  { id: 7, x: 840, y: 360, type: 'Can', volume: 0.7, detected: false },
  { id: 8, x: 720, y: 560, type: 'Bottle cap', volume: 0.2, detected: false },
  { id: 9, x: 505, y: 565, type: 'Cigarette', volume: 0.1, detected: false },
  { id: 10, x: 875, y: 520, type: 'Paper', volume: 0.4, detected: false },
  { id: 11, x: 305, y: 340, type: 'Bottle', volume: 1.2, detected: false },
  { id: 12, x: 610, y: 310, type: 'Can', volume: 0.7, detected: false },
]

const INITIAL_OBSTACLES = [
  { id: 'o1', x: 410, y: 475, r: 36, label: 'Rock' },
  { id: 'o2', x: 675, y: 465, r: 42, label: 'Driftwood' },
  { id: 'o3', x: 790, y: 305, r: 34, label: 'Rock' },
]

const SPAWN_OBSTACLE_POINTS = [[330,500],[520,350],[710,525],[875,335]]
const PATROL_POINTS = [
  { x: 165, y: 520 }, { x: 870, y: 520 }, { x: 870, y: 420 },
  { x: 165, y: 420 }, { x: 165, y: 320 }, { x: 870, y: 320 },
]

const clamp = (value, min, max) => Math.max(min, Math.min(max, value))
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y)
// The visible LiDAR circle and the detection behavior use exactly the same radius.
const inDetectionRange = (robot, item) => distance(robot, item) <= DETECTION_RADIUS

function simToLatLng(x, y) {
  // x follows the length of the beach; y moves only within a narrow sand corridor.
  // Clamping also prevents accidentally displaying simulated GPS in nearby streets.
  const along = clamp(x / SIM_W, 0.06, 0.94)
  const across = clamp((y - 410) / 230, -1, 1)
  const [southLat, southLng] = BEACH_TRACK.southwest
  const [northLat, northLng] = BEACH_TRACK.northeast
  return [
    southLat + along * (northLat - southLat) - across * 0.000065,
    southLng + along * (northLng - southLng) + across * 0.000045,
  ]
}

// Visibility-graph routing: unlike the old one-way detour, every waypoint
// preserves the ORIGINAL destination, and lines are tested against all obstacles.
function segmentClear(a, b, obstacles) {
  const vx = b.x - a.x
  const vy = b.y - a.y
  const lenSq = vx * vx + vy * vy
  return obstacles.every(o => {
    const t = lenSq === 0 ? 0 : clamp(((o.x - a.x) * vx + (o.y - a.y) * vy) / lenSq, 0, 1)
    const px = a.x + t * vx
    const py = a.y + t * vy
    return Math.hypot(px - o.x, py - o.y) > o.r + ROBOT_RADIUS + 16
  })
}

function locationSafe(p, obstacles) {
  return p.x >= MIN_X && p.x <= MAX_X && p.y >= MIN_Y && p.y <= MAX_Y &&
    obstacles.every(o => distance(p, o) > o.r + ROBOT_RADIUS + 10)
}

function planSafeRoute(from, destination, obstacles) {
  if (!locationSafe(destination, obstacles)) return null
  if (segmentClear(from, destination, obstacles)) return [destination]
  const nodes = [from, destination]
  for (const o of obstacles) {
    // Outer ring keeps each straight chord beyond the collision boundary.
    const radius = o.r + ROBOT_RADIUS + 37
    for (let i = 0; i < 20; i++) {
      const a = i * 2 * Math.PI / 20
      const p = { x: o.x + Math.cos(a) * radius, y: o.y + Math.sin(a) * radius }
      if (locationSafe(p, obstacles)) nodes.push(p)
    }
  }
  const best = new Array(nodes.length).fill(Infinity)
  const parent = new Array(nodes.length).fill(-1)
  const visited = new Set()
  best[0] = 0
  for (let count = 0; count < nodes.length; count++) {
    let u = -1
    for (let i = 0; i < nodes.length; i++) {
      if (!visited.has(i) && (u === -1 || best[i] < best[u])) u = i
    }
    if (u < 0 || best[u] === Infinity) break
    if (u === 1) break
    visited.add(u)
    for (let v = 1; v < nodes.length; v++) {
      if (visited.has(v) || u === v) continue
      if (!segmentClear(nodes[u], nodes[v], obstacles)) continue
      const candidate = best[u] + distance(nodes[u], nodes[v])
      if (candidate < best[v]) { best[v] = candidate; parent[v] = u }
    }
  }
  if (best[1] === Infinity) return null
  const route = []
  let current = 1
  while (current !== 0 && current !== -1) {
    route.unshift(nodes[current])
    current = parent[current]
  }
  return current === 0 ? route : null
}

// A pickup only needs the rover to approach within its pickup radius.
// This lets autonomous mode collect items beside rocks rather than getting stuck.
function planAutoRoute(from, destination, obstacles) {
  const goals = [destination]
  if (destination.trashId) {
    for (let i = 0; i < 12; i++) {
      const theta = i * Math.PI / 6
      goals.push({
        x: destination.x + Math.cos(theta) * (PICKUP_RADIUS - 5),
        y: destination.y + Math.sin(theta) * (PICKUP_RADIUS - 5),
      })
    }
  }
  let bestRoute = null
  let bestLength = Infinity
  for (const goal of goals) {
    const route = planSafeRoute(from, goal, obstacles)
    if (!route) continue
    let length = 0
    let before = from
    for (const waypoint of route) {
      length += distance(before, waypoint)
      before = waypoint
    }
    if (length < bestLength) { bestLength = length; bestRoute = route }
  }
  return bestRoute
}

function nearestSpawnSpot(robot, obstacles, trash, index) {
  const angles = 16
  for (const radius of [76, 98, 118, 130]) {
    for (let n = 0; n < angles; n++) {
      const a = (index * 5 + n) * (2 * Math.PI / angles)
      const p = { x: robot.x + radius * Math.cos(a), y: robot.y + radius * Math.sin(a) }
      if (!locationSafe(p, obstacles)) continue
      if (trash.some(t => distance(t, p) < 33)) continue
      return p
    }
  }
  return null
}

function shortTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

function MiniMap({ robot, trail, expanded, onExpand }) {
  const center = simToLatLng(robot.x, robot.y)
  const mapRef = useRef(null)
  const leafletRef = useRef(null)
  const markerRef = useRef(null)
  const lineRef = useRef(null)

  // Leaflet runs directly in the existing React project. This avoids loading
  // a second React version solely to satisfy react-leaflet's older peer deps.
  useEffect(() => {
    if (!mapRef.current) return
    const map = L.map(mapRef.current, {
      zoomControl: expanded,
      scrollWheelZoom: expanded,
      attributionControl: true,
    }).setView(center, expanded ? 17 : 18)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map)
    lineRef.current = L.polyline(trail.map(p => simToLatLng(p.x, p.y)), {
      color: '#63c3ab', weight: 3, opacity: 0.85,
    }).addTo(map)
    markerRef.current = L.circleMarker(center, {
      radius: expanded ? 10 : 8,
      color: '#0c1f24', fillColor: '#63c3ab', fillOpacity: 1, weight: 3,
    }).addTo(map).bindPopup('Simulated rover position')
    leafletRef.current = map
    const frame = requestAnimationFrame(() => map.invalidateSize())
    return () => {
      cancelAnimationFrame(frame)
      map.remove()
      leafletRef.current = null
      markerRef.current = null
      lineRef.current = null
    }
  }, [expanded])

  useEffect(() => {
    const pos = simToLatLng(robot.x, robot.y)
    markerRef.current?.setLatLng(pos)
    lineRef.current?.setLatLngs(trail.map(p => simToLatLng(p.x, p.y)))
    if (!expanded) leafletRef.current?.panTo(pos, { animate: false })
  }, [robot.x, robot.y, trail, expanded])

  return (
    <div className={expanded ? 'map-modal-shell' : 'mini-map-shell'}>
      <div className="map-heading">
        <div>
          <span className="eyebrow">Map position</span>
          <strong>Barceloneta Beach</strong>
        </div>
        <button className="icon-button" type="button" onClick={onExpand} aria-label={expanded ? 'Close expanded map' : 'Expand map'} title={expanded ? 'Close map' : 'Expand map'}>
          {expanded ? '×' : '↗'}
        </button>
      </div>
      <div ref={mapRef} className="leaflet-map" aria-label="Map with simulated rover location" />
    </div>
  )
}

function MetricCard({ label, value, alert = false, good = false }) {
  return (
    <div className={`metric-card ${alert ? 'alert-card' : ''} ${good ? 'good-card' : ''}`}>
      <span className="metric-label">{label}</span>
      <strong className="metric-value">{value}</strong>
    </div>
  )
}

function ProgressBar({ value, max = 100, kind = 'cyan' }) {
  const pct = clamp((value / max) * 100, 0, 100)
  return <div className="progress-track"><div className={`progress-fill ${kind}`} style={{ width: `${pct}%` }} /></div>
}

function Rover({ robot }) {
  return (
    <g transform={`translate(${robot.x} ${robot.y}) rotate(${robot.heading})`}>
      <ellipse cx="0" cy="24" rx="32" ry="12" fill="rgba(0,0,0,.35)" />
      <rect x="-30" y="-21" width="60" height="42" rx="7" fill="#faf8f2" stroke="#0c1f24" strokeWidth="3" />
      <rect x="-22" y="-14" width="44" height="28" rx="4" fill="#8da49f" opacity=".65" />
      <rect x="-33" y="-18" width="9" height="16" rx="4" fill="#173036" stroke="#63c3ab" strokeWidth="2" />
      <rect x="-33" y="2" width="9" height="16" rx="4" fill="#173036" stroke="#63c3ab" strokeWidth="2" />
      <rect x="24" y="-18" width="9" height="16" rx="4" fill="#173036" stroke="#63c3ab" strokeWidth="2" />
      <rect x="24" y="2" width="9" height="16" rx="4" fill="#173036" stroke="#63c3ab" strokeWidth="2" />
      <path d="M-31 -16 L-48 -23 M-31 -8 L-50 -10 M-31 0 L-51 4 M-31 8 L-49 16 M-31 16 L-46 26"
            stroke="#e9efe8" strokeWidth="4" strokeLinecap="round" />
      <circle cx="0" cy="0" r="4" fill="#63c3ab" />
      <path d="M14 0 L31 0" stroke="#63c3ab" strokeWidth="3" />
      <polygon points="31,0 23,-5 23,5" fill="#63c3ab" />
    </g>
  )
}

function Simulation({ robot, trash, obstacles, selectedTrash, mode, status, target, eStop, autoCharging, onPointClick, onTrashClick }) {
  return (
    <div className="sim-frame">
      <svg viewBox={`0 0 ${SIM_W} ${SIM_H}`} className="simulation-svg" onClick={onPointClick} role="application" aria-label="Interactive rover beach simulation">
        <defs>
          <linearGradient id="sand" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#173036"/><stop offset="100%" stopColor="#0c1f24"/></linearGradient>
          <linearGradient id="water" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#113945"/><stop offset="100%" stopColor="#174e56"/></linearGradient>
          <pattern id="grid" width="42" height="42" patternUnits="userSpaceOnUse"><path d="M42 0 L0 0 0 42" fill="none" stroke="#32565a" strokeWidth="1" opacity=".45"/></pattern>
          <filter id="glowMagenta"><feGaussianBlur stdDeviation="5" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        <rect width={SIM_W} height={SIM_H} fill="url(#sand)" />
        <rect width={SIM_W} height={SIM_H} fill="url(#grid)" />
        <path d="M0,0 H1000 V150 C860,125 760,175 620,138 C470,98 330,172 0,125 Z" fill="url(#water)" />
        <path d="M0,127 C220,165 360,103 545,145 C710,183 815,113 1000,151" fill="none" stroke="#63c3ab" strokeWidth="2" opacity=".5" />
        <path d="M0,141 C220,179 360,117 545,159 C710,197 815,127 1000,165" fill="none" stroke="#63c3ab" strokeWidth="1" opacity=".22" />
        <g opacity=".24" stroke="#63c3ab" fill="none">
          <path d="M65 260 C230 215 365 250 510 220 S770 190 940 230" />
          <path d="M85 580 C230 545 420 590 580 550 S835 515 960 550" />
        </g>

        {obstacles.map(o => (
          <g key={o.id} className="obstacle-node">
            <circle cx={o.x} cy={o.y} r={o.r + 12} fill="none" stroke="#dba16a" strokeDasharray="5 7" opacity=".42" />
            <circle cx={o.x} cy={o.y} r={o.r} fill="#3a3430" stroke="#dba16a" strokeWidth="3" />
            <path d={`M${o.x-o.r/2} ${o.y+5} l${o.r/2} -${o.r/2} l${o.r/2} ${o.r/2} l${o.r/3} ${o.r/2} h-${o.r*1.4} z`} fill="#76614d" opacity=".75" />
            <text x={o.x} y={o.y + o.r + 24} textAnchor="middle" className="sim-label obstacle-label">{o.label}</text>
          </g>
        ))}

        {trash.map(item => {
          const isSelected = selectedTrash === item.id
          const detected = inDetectionRange(robot, item)
          const stroke = detected ? '#e2b58a' : '#758d8b'
          return (
            <g key={item.id} onClick={(e) => { e.stopPropagation(); onTrashClick(item) }} className={detected ? 'trash-node detected' : 'trash-node'} style={{ cursor: detected ? 'pointer' : 'default' }}>
              {detected && <circle cx={item.x} cy={item.y} r="29" fill="none" stroke="#e2b58a" strokeWidth="2" strokeDasharray="4 5" filter="url(#glowMagenta)" />}
              {isSelected && <circle cx={item.x} cy={item.y} r="38" fill="none" stroke="#63c3ab" strokeWidth="2" />}
              <rect x={item.x - 10} y={item.y - 8} width="20" height="16" rx="4" fill="#162d31" stroke={stroke} strokeWidth="3" />
              <path d={`M${item.x-5} ${item.y-2} h10 M${item.x-4} ${item.y+3} h8`} stroke={stroke} strokeWidth="2" />
              {detected && <text x={item.x} y={item.y - 35} textAnchor="middle" className="sim-label trash-label">{item.type}</text>}
            </g>
          )
        })}

        <g pointerEvents="none" transform={`translate(${HOME_POSITION.x} ${HOME_POSITION.y})`}>
          <circle r="14" fill="#0c1f24" stroke="#63c3ab" strokeDasharray="4 4" strokeWidth="2" opacity=".9" />
          <path d="M-5 1 L0 -4 L5 1 V6 H-5 Z" fill="none" stroke="#63c3ab" strokeWidth="1.5" />
          <text x="0" y="30" textAnchor="middle" className="sim-label home-label">BASE</text>
          {autoCharging && <text x="0" y="45" textAnchor="middle" fill="#63c3ab" fontWeight="800" fontSize="10">CHARGING</text>}
        </g>
        <circle cx={robot.x} cy={robot.y} r={DETECTION_RADIUS} fill="none" stroke="#63c3ab" strokeDasharray="8 10" opacity=".22" />
        <circle cx={robot.x} cy={robot.y} r="78" fill="none" stroke="#63c3ab" opacity=".12" />
        <circle cx={robot.x} cy={robot.y} r="42" fill="none" stroke="#63c3ab" opacity=".12" />
        <g transform={`translate(${robot.x} ${robot.y})`}>
          <g>
            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="2.3s" repeatCount="indefinite" />
            <path d="M0 0 L135 -25 A138 138 0 0 1 135 25 Z" fill="#63c3ab" opacity=".13" />
            <line x1="0" y1="0" x2="135" y2="0" stroke="#63c3ab" opacity=".25" />
          </g>
        </g>

        {target && <g pointerEvents="none"><circle cx={target.x} cy={target.y} r="17" fill="none" stroke="#63c3ab" strokeWidth="2"/><path d={`M${target.x-25} ${target.y} H${target.x+25} M${target.x} ${target.y-25} V${target.y+25}`} stroke="#63c3ab" opacity=".7"/></g>}
        <Rover robot={robot} />

        <g transform="translate(24 30)"><rect width="270" height="34" rx="8" fill="#0c1f24" opacity=".82" stroke="#2a454b"/><circle cx="18" cy="17" r="5" fill={eStop ? '#ff4d5e' : mode === 'AUTO' ? '#63c3ab' : '#63c3ab'}/><text x="32" y="22" className="sim-hud-text">{eStop ? 'EMERGENCY STOP' : `${mode} • ${status.toUpperCase()}`}</text></g>
        <g transform="translate(754 26)"><rect width="220" height="50" rx="9" fill="#0c1f24" opacity=".78" stroke="#2a454b"/><text x="14" y="19" className="sim-hud-small">SIMULATED SENSOR VIEW</text><text x="14" y="38" className="sim-hud-text">Detection radius: {Math.round(DETECTION_RADIUS * METERS_PER_PIXEL)} m</text></g>
      </svg>
      <div className="sim-help">Click beach to move • Click highlighted trash to collect • WASD / arrows for manual control</div>
    </div>
  )
}

export default function RoverSimulator() {
  const [robot, setRobot] = useState(INITIAL_ROBOT)
  const [trash, setTrash] = useState(INITIAL_TRASH)
  const [obstacles, setObstacles] = useState(INITIAL_OBSTACLES)
  const [mode, setMode] = useState('MANUAL')
  const [status, setStatus] = useState('Idle')
  const [target, setTarget] = useState(null)
  const [selectedTrash, setSelectedTrash] = useState(null)
  const [battery, setBattery] = useState(92)
  const [bin, setBin] = useState(4.2)
  const [pickups, setPickups] = useState(3)
  const [distanceM, setDistanceM] = useState(18.4)
  const [speed, setSpeed] = useState(0)
  const [speedSetting, setSpeedSetting] = useState(1.1)
  const [autoPhase, setAutoPhase] = useState('cleaning') // cleaning | returning | parked | blocked
  const [returnReason, setReturnReason] = useState(null)
  const [autoCharging, setAutoCharging] = useState(false)
  const pressedKeysRef = useRef(new Set())
  const routeRef = useRef([])
  const unreachableTrashRef = useRef(new Set())
  const [connection, setConnection] = useState(true)
  const [eStop, setEStop] = useState(false)
  const [runtime, setRuntime] = useState(0)
  const [logs, setLogs] = useState([
    { id: 1, time: shortTime(), level: 'info', text: 'Simulation initialized' },
    { id: 2, time: shortTime(), level: 'good', text: 'Rover connection online' },
  ])
  // Count ALL events since page load, even though the scrolling list keeps the latest 40.
  const [totalLogCount, setTotalLogCount] = useState(2)
  const [trail, setTrail] = useState([{ ...INITIAL_ROBOT }])
  const [mapExpanded, setMapExpanded] = useState(false)
  const [spawnTrashIndex, setSpawnTrashIndex] = useState(0)
  const [spawnObstacleIndex, setSpawnObstacleIndex] = useState(0)
  const [patrolIndex, setPatrolIndex] = useState(0)

  const detectedIdsRef = useRef(new Set())
  const obstacleWarnRef = useRef(new Set())
  const trailCounterRef = useRef(0)

  const addLog = (text, level = 'info') => {
    setLogs(prev => [{ id: Date.now() + Math.random(), time: shortTime(), text, level }, ...prev].slice(0, 40))
    setTotalLogCount(prev => prev + 1)
  }

  // Derived from the robot's position, not a permanent "detected" flag.
  // A piece of trash loses its highlight immediately when it leaves sensor range.
  const activeTrash = useMemo(() => trash.filter(t => inDetectionRange(robot, t)), [trash, robot])
  const currentLatLng = simToLatLng(robot.x, robot.y)
  const movingStatus = target && !['Obstacle detected', 'No safe route', 'Emergency stop', 'Connection lost'].includes(status)
    ? (mode === 'AUTO'
      ? autoPhase === 'returning' ? 'Returning to base' : target.trashId ? 'Collecting trash' : 'Autonomous movement'
      : target.trashId ? 'Collecting trash' : 'Moving to target')
    : status

  const findNearObstacle = (x, y) => obstacles.find(o => Math.hypot(x - o.x, y - o.y) < o.r + ROBOT_RADIUS + 8)

  // Log entry into the visible sensor circle once; leaving the circle clears it.
  useEffect(() => {
    const inRangeIds = new Set(activeTrash.map(item => item.id))
    activeTrash.forEach(item => {
      if (!detectedIdsRef.current.has(item.id)) {
        addLog(`Trash detected: ${item.type}`, 'detect')
      }
    })
    detectedIdsRef.current = inRangeIds
  }, [activeTrash])

  const startReturn = (reason) => {
    if (mode !== 'AUTO' || autoPhase !== 'cleaning') return
    const destination = { ...HOME_POSITION, home: true }
    routeRef.current = []
    setSelectedTrash(null)
    setTarget(destination)
    setAutoPhase('returning')
    setReturnReason(reason)
    setSpeed(0)
    setStatus('Returning to base')
    addLog(`Returning to base: ${reason}`, reason === 'Beach cleared' ? 'good' : 'warn')
  }

  // Called once at the end of EVERY successful AUTO return. Manual arrival
  // at the same location never triggers unloading or charging.
  const finishAutoReturn = () => {
    if (mode !== 'AUTO' || autoPhase !== 'returning') return
    setTarget(null)
    routeRef.current = []
    setSelectedTrash(null)
    setAutoPhase('parked')
    setSpeed(0)
    addLog(`Returned to base: ${returnReason || 'Cleaning completed'}`, 'good')

    // This happens even when the bin is not full (low battery / beach cleared).
    setBin(0)
    addLog(bin > 0 ? `Automatic waste unloading: ${bin.toFixed(1)} L emptied` : 'Automatic waste unloading: bin already empty', 'good')

    // Charge ONLY after low battery or after the beach has been cleared.
    // A full-bin-only return empties the bin, then remains parked.
    const shouldCharge = returnReason === 'Low battery' || returnReason === 'Beach cleared' ||
      battery <= LOW_BATTERY_RETURN || trash.length === 0
    if (shouldCharge && battery < 100) {
      setAutoCharging(true)
      setStatus('Charging at base')
      addLog('Automatic charging started at base', 'good')
    } else {
      setAutoCharging(false)
      setStatus('Parked at base')
    }
  }

  // Automatic charging happens gradually, so the battery display visibly
  // increases. It pauses when offline or emergency-stopped.
  useEffect(() => {
    if (!autoCharging || mode !== 'AUTO' || autoPhase !== 'parked' || !connection || eStop) return
    const timer = setInterval(() => setBattery(v => clamp(v + 1, 0, 100)), 300)
    return () => clearInterval(timer)
  }, [autoCharging, mode, autoPhase, connection, eStop])

  useEffect(() => {
    if (!autoCharging || battery < 100) return
    setAutoCharging(false)
    if (mode === 'AUTO' && autoPhase === 'parked') {
      setStatus('Fully charged at base')
      addLog('Automatic charging complete: battery 100%', 'good')
    }
  }, [autoCharging, battery, mode, autoPhase])

  // If a presenter sets Low Battery while already parked in AUTO mode,
  // charging starts there without requiring another drive away and back.
  useEffect(() => {
    if (mode !== 'AUTO' || autoPhase !== 'parked' || autoCharging ||
        battery > LOW_BATTERY_RETURN || !connection || eStop ||
        distance(robot, HOME_POSITION) > HOME_RADIUS) return
    setAutoCharging(true)
    setStatus('Charging at base')
    addLog('Automatic charging started at base (low battery)', 'good')
  }, [mode, autoPhase, autoCharging, battery, connection, eStop, robot])

  const collectTrash = (item) => {
    if (bin + item.volume > BIN_CAPACITY + 0.00001) {
      addLog(`Not enough bin space for ${item.type}`, 'warn')
      if (mode === 'AUTO') startReturn('Bin cannot hold more trash')
      return
    }
    setTrash(prev => prev.filter(t => t.id !== item.id))
    routeRef.current = []
    setSelectedTrash(null)
    setTarget(null)
    setPickups(v => v + 1)
    setBin(v => clamp(v + item.volume, 0, BIN_CAPACITY))
    setSpeed(0)
    setStatus('Trash collected')
    addLog(`Trash collected: ${item.type} (+${item.volume.toFixed(1)} L)`, 'good')
  }

  const moveStep = (dx, dy, source = 'manual') => {
    if (!connection || eStop || battery <= 0) return false
    const mag = Math.hypot(dx, dy)
    if (mag < 0.0001) return false
    const step = Math.min(mag, speedSetting * (TICK_MS / 1000) / METERS_PER_PIXEL)
    const nx = clamp(robot.x + dx / mag * step, MIN_X, MAX_X)
    const ny = clamp(robot.y + dy / mag * step, MIN_Y, MAX_Y)
    const obstacle = findNearObstacle(nx, ny)
    if (obstacle) {
      setSpeed(0)
      if (!obstacleWarnRef.current.has(obstacle.id)) {
        obstacleWarnRef.current.add(obstacle.id)
        addLog(`Obstacle detected: ${obstacle.label}`, 'warn')
      }
      if ((source === 'auto' || source === 'return') && target) {
        const updated = planAutoRoute(robot, target, obstacles)
        if (updated && updated.length) {
          routeRef.current = updated
          setStatus('Avoiding obstacle')
        } else {
          if (target.trashId) unreachableTrashRef.current.add(target.trashId)
          setTarget(null)
          routeRef.current = []
          if (source === 'return') {
            setAutoPhase('blocked')
            setStatus('Return path blocked')
            addLog('Cannot reach base safely; switch to manual control', 'danger')
          } else {
            setStatus('No safe route')
            addLog('No safe route to destination', 'warn')
          }
        }
      } else {
        setTarget(null)
        setStatus('Obstacle detected')
      }
      return false
    }
    const nextRobot = { x: nx, y: ny, heading: Math.atan2(dy, dx) * 180 / Math.PI }
    const pxDist = distance(nextRobot, robot)
    if (pxDist < 0.00001) return false
    setRobot(nextRobot)
    // Set only on an actual movement. A target's moving label stays until arrival.
    setSpeed(speedSetting)
    setDistanceM(v => v + pxDist * METERS_PER_PIXEL)
    setBattery(v => clamp(v - pxDist * 0.0018, 0, 100))
    trailCounterRef.current += 1
    if (trailCounterRef.current % 6 === 0) setTrail(prev => [...prev.slice(-175), nextRobot])
    return true
  }

  useEffect(() => {
    const id = setInterval(() => {
      if (connection && !eStop) setRuntime(v => v + 1)
    }, 1000)
    return () => clearInterval(id)
  }, [connection, eStop])

  useEffect(() => {
    const accepted = new Set(['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'])
    const onKeyDown = e => {
      const key = e.key.toLowerCase()
      if (!accepted.has(key) || mode !== 'MANUAL') return
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return
      e.preventDefault()
      if (eStop || !connection || battery <= 0) return
      pressedKeysRef.current.add(key)
      setTarget(null)
      routeRef.current = []
      setStatus('Moving')
    }
    const onKeyUp = e => {
      pressedKeysRef.current.delete(e.key.toLowerCase())
      if (pressedKeysRef.current.size === 0 && !target) {
        setSpeed(0)
        setStatus(current => current === 'Moving' ? 'Idle' : current)
      }
    }
    const onBlur = () => { pressedKeysRef.current.clear(); setSpeed(0) }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', onBlur)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', onBlur)
    }
  }, [mode, eStop, connection, target, bin, battery])

  useEffect(() => {
    const timer = setInterval(() => {
      if (!connection || eStop || battery <= 0) {
        setSpeed(0)
        if (battery <= 0) setStatus('Battery depleted')
        return
      }

      // Stop at the base after a completed return. A deliberate mode change
      // back to AUTO is required to start a new cleaning run.
      if (mode === 'AUTO' && (autoPhase === 'parked' || autoPhase === 'blocked')) {
        setSpeed(0)
        return
      }

      if (mode === 'MANUAL' && pressedKeysRef.current.size) {
        const held = pressedKeysRef.current
        const dx = Number(held.has('d') || held.has('arrowright')) - Number(held.has('a') || held.has('arrowleft'))
        const dy = Number(held.has('s') || held.has('arrowdown')) - Number(held.has('w') || held.has('arrowup'))
        if (dx || dy) moveStep(dx, dy, 'manual')
        return
      }

      let nextTarget = target
      if (mode === 'AUTO') {
        if (autoPhase === 'cleaning') {
          // Home triggers take priority over everything, including collection.
          if (bin >= BIN_CAPACITY - 0.00001) {
            startReturn('Bin full')
            return
          }
          if (battery <= LOW_BATTERY_RETURN) {
            startReturn('Low battery')
            return
          }
          if (trash.length === 0) {
            startReturn('Beach cleared')
            return
          }

          // NEW: Trash in the LiDAR circle interrupts a PATROL waypoint right
          // away. A selected trash destination remains active until collected.
          if (!nextTarget?.trashId) {
            const candidates = activeTrash
              .filter(item => !unreachableTrashRef.current.has(item.id))
              .sort((a, b) => distance(robot, a) - distance(robot, b))

            for (const item of candidates) {
              if (bin + item.volume > BIN_CAPACITY + 0.00001) {
                startReturn('Bin cannot hold detected trash')
                return
              }
              const candidateTarget = { x: item.x, y: item.y, trashId: item.id }
              const route = planAutoRoute(robot, candidateTarget, obstacles)
              if (route?.length) {
                routeRef.current = route
                setTarget(candidateTarget)
                setSelectedTrash(item.id)
                setStatus('Collecting trash')
                addLog(`Autonomous target selected: ${item.type}`, 'info')
                return  // Begin this target immediately on the next tick.
              }
              unreachableTrashRef.current.add(item.id)
              addLog(`Trash inaccessible: ${item.type}`, 'warn')
            }
          }

          // Patrol only when there is no in-range reachable trash to collect.
          if (!nextTarget) {
            for (let offset = 0; offset < PATROL_POINTS.length; offset++) {
              const waypoint = PATROL_POINTS[(patrolIndex + offset) % PATROL_POINTS.length]
              const route = planSafeRoute(robot, waypoint, obstacles)
              if (route?.length) {
                routeRef.current = route
                nextTarget = { ...waypoint, patrol: true }
                setPatrolIndex(v => v + offset)
                setTarget(nextTarget)
                setStatus('Autonomous movement')
                break
              }
            }
            if (!nextTarget) {
              setStatus('No safe route')
              setSpeed(0)
              return
            }
          }
        } else if (autoPhase === 'returning') {
          if (distance(robot, HOME_POSITION) <= HOME_RADIUS) {
            finishAutoReturn()
            return
          }
          // Never abandon the return trip for new trash detections.
          if (!nextTarget?.home) {
            nextTarget = { ...HOME_POSITION, home: true }
            setTarget(nextTarget)
            routeRef.current = []
          }
        }
      }

      if (!nextTarget) {
        setSpeed(0)
        setStatus(current => ['Obstacle detected', 'Trash collected', 'Emergency stop', 'Bin full', 'Low battery', 'No safe route'].includes(current)
          ? current : mode === 'AUTO' ? 'Scanning' : 'Idle')
        return
      }

      const arrivalRange = nextTarget.home ? HOME_RADIUS : nextTarget.trashId ? PICKUP_RADIUS : 6
      if (distance(robot, nextTarget) <= arrivalRange) {
        if (nextTarget.home) {
          finishAutoReturn()
        } else if (nextTarget.trashId) {
          const item = trash.find(t => t.id === nextTarget.trashId)
          if (item) collectTrash(item)
          else { setTarget(null); setSelectedTrash(null); routeRef.current = [] }
        } else {
          setTarget(null)
          routeRef.current = []
          if (mode === 'AUTO') setPatrolIndex(v => v + 1)
          setStatus(mode === 'AUTO' ? 'Scanning' : 'Idle')
          setSpeed(0)
        }
        return
      }

      if (mode === 'AUTO') {
        if (!routeRef.current.length) {
          const route = planAutoRoute(robot, nextTarget, obstacles)
          if (!route?.length) {
            if (autoPhase === 'returning') {
              setAutoPhase('blocked')
              setStatus('Return path blocked')
              addLog('Cannot reach base safely; switch to manual control', 'danger')
            } else {
              if (nextTarget.trashId) unreachableTrashRef.current.add(nextTarget.trashId)
              setStatus('No safe route')
              addLog('Auto navigation skipped unreachable target', 'warn')
            }
            setTarget(null)
            setSelectedTrash(null)
            setSpeed(0)
            return
          }
          routeRef.current = route
        }
        while (routeRef.current.length && distance(robot, routeRef.current[0]) < 5) routeRef.current.shift()
        const nextWaypoint = routeRef.current[0] || nextTarget
        moveStep(nextWaypoint.x - robot.x, nextWaypoint.y - robot.y,
          autoPhase === 'returning' ? 'return' : 'auto')
      } else {
        moveStep(nextTarget.x - robot.x, nextTarget.y - robot.y)
      }
    }, TICK_MS)
    return () => clearInterval(timer)
  }, [mode, autoPhase, returnReason, target, trash, activeTrash, robot, connection, eStop, battery, bin, patrolIndex, speedSetting, obstacles])

  useEffect(() => {
    if (battery <= 0) { setTarget(null); setSpeed(0); setStatus('Battery depleted') }
    // In auto mode, the interval owns the low-battery/full-bin return state.
    if (mode === 'MANUAL' && bin >= BIN_CAPACITY) setStatus('Bin full')
    if (mode === 'MANUAL' && battery > 0 && battery <= LOW_BATTERY_RETURN) setStatus('Low battery')
  }, [battery, bin, mode])

  const onPointClick = (e) => {
    if (mode !== 'MANUAL' || eStop || !connection) return
    const svg = e.currentTarget
    const pt = svg.createSVGPoint()
    pt.x = e.clientX
    pt.y = e.clientY
    const loc = pt.matrixTransform(svg.getScreenCTM().inverse())
    if (loc.y < 180) { addLog('Water boundary selected — movement blocked', 'warn'); return }
    setSelectedTrash(null)
    setTarget({ x: clamp(loc.x, MIN_X, MAX_X), y: clamp(loc.y, MIN_Y, MAX_Y) })
    routeRef.current = []
    setStatus('Moving to target')
  }

  const onTrashClick = (item) => {
    if (!inDetectionRange(robot, item)) return
    if (mode === 'AUTO' && autoPhase !== 'cleaning') {
      addLog('Robot is returning or parked; collection is paused', 'warn')
      return
    }
    if (bin + item.volume > BIN_CAPACITY + 0.00001) {
      addLog('Cannot collect trash: not enough bin space', 'warn')
      if (mode === 'AUTO') startReturn('Bin cannot hold detected trash')
      return
    }
    setSelectedTrash(item.id)
    const newTarget = { x: item.x, y: item.y, trashId: item.id }
    if (mode === 'AUTO') {
      const route = planAutoRoute(robot, newTarget, obstacles)
      if (!route) { addLog('No safe route to selected trash', 'warn'); return }
      routeRef.current = route
    }
    setTarget(newTarget)
    setStatus(mode === 'AUTO' ? 'Autonomous collection' : 'Moving to target')
    addLog(`Trash selected: ${item.type}`, 'detect')
  }

  const spawnTrash = () => {
    // Every spawn is near CURRENT rover position, in line of sight, and on safe sand.
    const position = nearestSpawnSpot(robot, obstacles, trash, spawnTrashIndex)
    if (!position) { addLog('No free space for nearby trash; move the rover', 'warn'); return }
    const types = ['Bottle', 'Can', 'Cigarette', 'Bottle cap', 'Paper']
    const type = types[spawnTrashIndex % types.length]
    const volumes = { Bottle: 1.2, Can: 0.7, Cigarette: 0.1, 'Bottle cap': 0.2, Paper: 0.4 }
    const id = Date.now() + spawnTrashIndex
    setTrash(prev => [...prev, { id, ...position, type, volume: volumes[type] }])
    setSpawnTrashIndex(v => v + 1)
    addLog(`Test trash spawned near rover: ${type}`, 'info')
  }

  const spawnObstacle = () => {
    const point = SPAWN_OBSTACLE_POINTS.find(([x,y]) =>
      distance(robot, {x,y}) > 105 && obstacles.every(o => distance(o, {x,y}) > 85))
    if (!point) { addLog('Move rover to create room for another obstacle', 'warn'); return }
    const [x, y] = point
    const obstacle = { id: `o-${Date.now()}`, x, y, r: 34, label: 'Test obstacle' }
    setObstacles(prev => [...prev, obstacle])
    routeRef.current = []
    unreachableTrashRef.current.clear()
    setSpawnObstacleIndex(v => v + 1)
    addLog('Test obstacle spawned', 'warn')
  }

  const reset = () => {
    setRobot(INITIAL_ROBOT); setTrash(INITIAL_TRASH); setObstacles(INITIAL_OBSTACLES)
    setMode('MANUAL'); setStatus('Idle'); setTarget(null); setSelectedTrash(null)
    setAutoPhase('cleaning'); setReturnReason(null); setAutoCharging(false)
    setPatrolIndex(0); setSpawnTrashIndex(0); setSpawnObstacleIndex(0)
    setSpeedSetting(1.1); routeRef.current = []; pressedKeysRef.current.clear(); unreachableTrashRef.current.clear()
    setBattery(92); setBin(4.2); setPickups(3); setDistanceM(18.4); setSpeed(0)
    setConnection(true); setEStop(false); setRuntime(0); setTrail([{ ...INITIAL_ROBOT }])
    detectedIdsRef.current = new Set(); obstacleWarnRef.current = new Set()
    addLog('Simulation reset', 'info')
  }

  const toggleMode = () => {
    setTarget(null); setSelectedTrash(null); routeRef.current = []; pressedKeysRef.current.clear()
    const next = mode === 'MANUAL' ? 'AUTO' : 'MANUAL'
    setAutoPhase('cleaning'); setReturnReason(null); setAutoCharging(false)
    setMode(next); setStatus(next === 'AUTO' ? 'Scanning' : 'Idle')
    addLog(`${next === 'AUTO' ? 'Autonomous' : 'Manual'} mode enabled`, 'info')
  }

  const toggleConnection = () => {
    const next = !connection
    setConnection(next)
    if (!next) { setTarget(null); routeRef.current=[]; pressedKeysRef.current.clear(); setSpeed(0); setStatus('Connection lost'); addLog('Rover connection lost', 'danger') }
    else { setStatus(autoCharging ? 'Charging at base' : 'Idle'); addLog('Rover connection restored', 'good') }
  }

  const toggleEStop = () => {
    const next = !eStop
    setEStop(next); setTarget(null); routeRef.current=[]; pressedKeysRef.current.clear(); setSpeed(0); setStatus(next ? 'Emergency stop' : autoCharging ? 'Charging at base' : 'Idle')
    addLog(next ? 'Emergency stop activated' : 'Emergency stop released', next ? 'danger' : 'good')
  }

  const formatRuntime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2,'0')
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2,'0')
    const s = String(seconds % 60).padStart(2,'0')
    return `${h}:${m}:${s}`
  }

  return (
    <div className="rover-dashboard">
      <section className="app-shell" aria-label="Interactive rover monitoring demonstration">
      <section className="workspace" aria-label="Interactive beach cleanup rover dashboard">
        <aside className="sidebar">
          <section className="panel telemetry-panel">
            <div className="panel-title-row"><div><span className="eyebrow">Live information</span><h2>Rover dashboard</h2></div><span className={`status-pill ${movingStatus.toLowerCase().replaceAll(' ','-')}`}>{movingStatus}</span></div>
            <div className="primary-bars">
              <div className="bar-row"><div className="bar-label"><span>Battery</span><strong>{battery.toFixed(0)}%</strong></div><ProgressBar value={battery} kind={battery <= 20 ? 'danger' : 'cyan'} /></div>
              <div className="bar-row"><div className="bar-label"><span>Trash bin</span><strong>{bin.toFixed(1)} / 40 L</strong></div><ProgressBar value={bin} max={40} kind={bin >= 36 ? 'danger' : 'magenta'} /></div>
            </div>
            <div className="speed-control">
              <div className="bar-label"><label htmlFor="rover-speed">Movement speed</label><strong>{speedSetting.toFixed(1)} m/s</strong></div>
              <input id="rover-speed" aria-label="Rover movement speed" type="range" min="0.4" max="2.2" step="0.1" value={speedSetting}
                onChange={e => setSpeedSetting(Number(e.target.value))} />
              <div className="speed-endpoints"><span>Slower</span><span>Faster</span></div>
            </div>
            <div className="metric-grid">
              <MetricCard label="Mode" value={mode === 'AUTO' ? 'Autonomous' : 'Manual'} good={mode === 'AUTO'} />
              <MetricCard label="Speed" value={`${speed.toFixed(2)} m/s`} />
              <MetricCard label="Distance" value={`${distanceM.toFixed(1)} m`} />
              <MetricCard label="Runtime" value={formatRuntime(runtime)} />
              <MetricCard label="Trash Pickups" value={pickups} />
              <MetricCard label="Detected Trash" value={activeTrash.length} alert={activeTrash.length > 0} />
              <MetricCard label="Obstacles" value={obstacles.length} />
              <MetricCard label="Connection" value={connection ? 'Online' : 'Offline'} alert={!connection} good={connection} />
            </div>
          </section>

          <section className="panel map-panel">
            <MiniMap robot={robot} trail={trail} expanded={false} onExpand={() => setMapExpanded(true)} />
            <div className="coords"><span>Demo GPS · {currentLatLng[0].toFixed(5)}° N</span><span>{currentLatLng[1].toFixed(5)}° E</span></div>
          </section>

          <section className="panel log-panel">
            <div className="panel-title-row compact"><div><span className="eyebrow">Monitoring</span><h2>Activity log</h2></div><span className="log-count" title="Total events since page load; showing the latest 40 below">{totalLogCount}</span></div>
            <div className="log-list">{logs.map(log => <div key={log.id} className={`log-item ${log.level}`}><span className="log-time">{log.time}</span><span className="log-marker"/><span>{log.text}</span></div>)}</div>
          </section>
        </aside>

        <section className="sim-column">
          <div className="sim-toolbar panel">
            <div className="toolbar-left"><div><span className="eyebrow">Barceloneta beach · Barcelona</span><h2>Rover simulation</h2></div><button className={`mode-toggle ${mode === 'AUTO' ? 'auto' : ''}`} onClick={toggleMode}><span>{mode === 'AUTO' ? 'AUTO' : 'MANUAL'}</span><i/></button></div>
            <div className="tool-buttons" aria-label="Simulation testing controls">
              <button className="action-button primary-action" onClick={spawnTrash}>+ Spawn trash</button>
              <button className="action-button" onClick={spawnObstacle}>+ Obstacle</button>
              <button onClick={() => { setBin(40); setStatus('Bin full'); addLog('Test state: trash bin full', 'warn') }}>Fill bin</button>
              <button onClick={() => { setBin(0); setStatus('Idle'); addLog('Trash bin emptied', 'good') }}>Empty bin</button>
              <button onClick={() => { setBattery(12); setStatus('Low battery'); addLog('Test state: low battery', 'warn') }}>Low battery</button>
              <button onClick={() => { setBattery(100); setStatus('Idle'); addLog('Battery recharged to 100%', 'good') }}>Recharge</button>
              <button onClick={toggleConnection}>{connection ? 'Go Offline' : 'Go Online'}</button>
              <button className={eStop ? 'danger-solid' : 'danger-outline'} onClick={toggleEStop}>{eStop ? 'Release E-Stop' : 'Emergency Stop'}</button>
              <button onClick={reset}>Reset simulation</button>
            </div>
          </div>

          <Simulation robot={robot} trash={trash} obstacles={obstacles} selectedTrash={selectedTrash} mode={mode} status={movingStatus} target={target} eStop={eStop} autoCharging={autoCharging} onPointClick={onPointClick} onTrashClick={onTrashClick} />
          <div className="bottom-strip"><div><span>Location</span><strong>Barceloneta Beach, Barcelona</strong></div><div><span>Control mode</span><strong>{mode === 'AUTO' ? 'Autonomous demo' : 'Click / WASD'}</strong></div><div><span>Detection</span><strong>Simulated detection</strong></div><div><span>Data source</span><strong>Browser state</strong></div></div>
        </section>
      </section>

      {mapExpanded && <div className="map-modal-backdrop" onClick={() => setMapExpanded(false)}><div className="map-modal" onClick={e => e.stopPropagation()}><MiniMap robot={robot} trail={trail} expanded={true} onExpand={() => setMapExpanded(false)} /></div></div>}
      </section>
    </div>
  )
}
