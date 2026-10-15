import { useEffect, useMemo, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Html,
  OrbitControls,
  Stage,
} from "@react-three/drei";
import * as THREE from "three";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  Box,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Cpu,
  Download,
  Gauge,
  HardDrive,
  LayoutDashboard,
  Maximize2,
  MoreHorizontal,
  RotateCcw,
  Search,
  Settings2,
  ShieldCheck,
  Thermometer,
  Zap,
} from "lucide-react";

type PartKey = "motor" | "housing" | "shaft" | "cooling" | "base";
type Reading = {
  time: string;
  temperature: number;
  vibration: number;
  rpm: number;
};
const parts: Record<
  PartKey,
  {
    name: string;
    id: string;
    status: string;
    material: string;
    installed: string;
    description: string;
  }
> = {
  motor: {
    name: "Drive motor",
    id: "MTR-001",
    status: "Operational",
    material: "Cast aluminium",
    installed: "12 Feb 2024",
    description:
      "Primary electric drive unit. Converts electrical energy into rotational motion.",
  },
  housing: {
    name: "Pump housing",
    id: "HSG-002",
    status: "Operational",
    material: "Ductile iron",
    installed: "12 Feb 2024",
    description: "Pressure-rated enclosure protecting the impeller assembly.",
  },
  shaft: {
    name: "Drive shaft",
    id: "SFT-003",
    status: "Operational",
    material: "Stainless steel 316",
    installed: "12 Feb 2024",
    description: "Transfers torque from the motor to the pump assembly.",
  },
  cooling: {
    name: "Cooling fan",
    id: "FAN-004",
    status: "Inspection due",
    material: "Reinforced polymer",
    installed: "12 Feb 2024",
    description:
      "Moves air across the motor fins to regulate operating temperature.",
  },
  base: {
    name: "Mounting frame",
    id: "BAS-005",
    status: "Operational",
    material: "Powder-coated steel",
    installed: "12 Feb 2024",
    description:
      "Structural base isolating vibration and securing the assembly.",
  },
};

function Machine({
  selected,
  onSelect,
}: {
  selected: PartKey;
  onSelect: (p: PartKey) => void;
}) {
  const rotor = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (rotor.current) {
      rotor.current.rotation.x += delta * 2;
    }
  });
  const mat = (color: string, metalness = 0.65, roughness = 0.32) =>
    new THREE.MeshStandardMaterial({ color, metalness, roughness });
  const steel = mat("#a8b6c8"),
    dark = mat("#263447"),
    blue = mat("#3b82f6", 0.45),
    copper = mat("#c58a55", 0.7),
    selectedMat = mat("#56d6b1", 0.45, 0.25);
  const materialFor = (key: PartKey, normal: THREE.Material) =>
    selected === key ? selectedMat : normal;
  const pick = (key: PartKey) => ({
    onClick: (e: any) => {
      e.stopPropagation();
      onSelect(key);
    },
    onPointerOver: (e: any) => {
      e.stopPropagation();
      document.body.style.cursor = "pointer";
    },
    onPointerOut: () => {
      document.body.style.cursor = "auto";
    },
  });
  return (
    <group rotation={[0.08, -0.45, 0]} position={[0, -0.12, 0]}>
      {/* mounting frame */}
      <mesh
        position={[0, -1.02, 0]}
        material={materialFor("base", dark)}
        {...pick("base")}
      >
        <boxGeometry args={[3.25, 0.22, 1.55]} />
      </mesh>
      {[-1.18, 1.18].map((x) => (
        <mesh
          key={x}
          position={[x, -0.83, 0]}
          material={dark}
          {...pick("base")}
        >
          <boxGeometry args={[0.22, 0.35, 1.25]} />
        </mesh>
      ))}
      {/* pump housing */}
      <mesh
        position={[-0.85, -0.14, 0]}
        rotation={[0, 0, Math.PI / 2]}
        material={materialFor("housing", blue)}
        {...pick("housing")}
      >
        <cylinderGeometry args={[0.68, 0.68, 0.92, 48]} />
      </mesh>
      <mesh
        position={[-0.85, 0.36, 0]}
        material={materialFor("housing", blue)}
        {...pick("housing")}
      >
        <cylinderGeometry args={[0.22, 0.22, 0.25, 32]} />
      </mesh>
      <mesh
        position={[-0.85, -0.14, 0.47]}
        material={materialFor("housing", steel)}
        {...pick("housing")}
      >
        <torusGeometry args={[0.43, 0.065, 12, 48]} />
      </mesh>
      {/* motor body and fins */}
      <mesh
        position={[0.48, -0.12, 0]}
        material={materialFor("motor", steel)}
        {...pick("motor")}
      >
        <cylinderGeometry args={[0.56, 0.56, 1.42, 48]} />
      </mesh>
      {Array.from({ length: 9 }, (_, i) => (
        <mesh
          key={i}
          position={[0.48, -0.12, 0]}
          rotation={[0, 0, (i * Math.PI) / 9]}
          material={materialFor("motor", dark)}
          {...pick("motor")}
        >
          <torusGeometry args={[0.54, 0.025, 8, 48]} />
        </mesh>
      ))}
      <mesh position={[0.48, 0.48, 0]} material={dark} {...pick("motor")}>
        <cylinderGeometry args={[0.22, 0.22, 0.16, 32]} />
      </mesh>
      {/* cooling fan cover */}
      <mesh
        position={[1.28, -0.12, 0]}
        rotation={[0, 0, Math.PI / 2]}
        material={materialFor("cooling", dark)}
        {...pick("cooling")}
      >
        <cylinderGeometry args={[0.48, 0.48, 0.16, 40]} />
      </mesh>
      <mesh
        position={[1.38, -0.12, 0]}
        rotation={[0, 0, Math.PI / 2]}
        material={materialFor("cooling", steel)}
        {...pick("cooling")}
      >
        <torusGeometry args={[0.36, 0.035, 10, 40]} />
      </mesh>
      <group ref={rotor} position={[1.4, -0.12, 0]}>
        {Array.from({ length: 7 }, (_, i) => (
          <mesh
            key={i}
            rotation={[0, 0, (i * Math.PI * 2) / 7]}
            position={[0, 0, 0]}
            material={materialFor("cooling", copper)}
            {...pick("cooling")}
          >
            <boxGeometry args={[0.36, 0.065, 0.07]} />
          </mesh>
        ))}
        <mesh material={steel} {...pick("cooling")}>
          <sphereGeometry args={[0.13, 20, 20]} />
        </mesh>
      </group>
      {/* shaft linking assemblies */}
      <mesh
        position={[-0.05, -0.12, 0]}
        rotation={[0, 0, Math.PI / 2]}
        material={materialFor("shaft", copper)}
        {...pick("shaft")}
      >
        <cylinderGeometry args={[0.13, 0.13, 0.82, 24]} />
      </mesh>
      <mesh position={[-0.05, -0.12, 0]} material={copper} {...pick("shaft")}>
        <torusGeometry args={[0.19, 0.035, 10, 32]} />
      </mesh>
      {/* fasteners */}
      {[-1.15, 1.15].map((x) =>
        [-0.48, 0.48].map((z) => (
          <mesh
            key={`${x}-${z}`}
            position={[x, -0.88, z]}
            material={steel}
            {...pick("base")}
          >
            <cylinderGeometry args={[0.065, 0.065, 0.045, 12]} />
          </mesh>
        )),
      )}
      {selected !== "base" && (
        <Html
          position={[
            selected === "housing"
              ? -0.85
              : selected === "cooling"
                ? 1.35
                : selected === "shaft"
                  ? -0.05
                  : 0.48,
            0.92,
            0,
          ]}
          center
          distanceFactor={7}
          style={{ pointerEvents: "none" }}
        >
          <div className="model-tag">{parts[selected].name}</div>
        </Html>
      )}
    </group>
  );
}

function MetricCard({
  title,
  value,
  unit,
  change,
  positive,
  icon: Icon,
  tone = "blue",
}: any) {
  return (
    <div className="metric-card">
      <div className="metric-top">
        <span>{title}</span>
        <span className={`metric-icon ${tone}`}>
          <Icon size={16} />
        </span>
      </div>
      <div className="metric-value">
        {value}
        <small>{unit}</small>
      </div>
      <div className={`metric-change ${positive ? "positive" : "neutral"}`}>
        {positive ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}{" "}
        {change}
        <span> vs last hour</span>
      </div>
    </div>
  );
}

export default function App() {
  const [selected, setSelected] = useState<PartKey>("motor");
  const [tab, setTab] = useState<"overview" | "components">("overview");
  const [running, setRunning] = useState(true);
  const [timeRange, setTimeRange] = useState("1H");
  const [readings, setReadings] = useState<Reading[]>(() =>
    Array.from({ length: 16 }, (_, i) => ({
      time: `${String(10 + Math.floor(i / 4)).padStart(2, "0")}:${String((i % 4) * 15).padStart(2, "0")}`,
      temperature: 62 + Math.sin(i * 0.7) * 3 + i * 0.18,
      vibration: 2.1 + Math.cos(i * 0.55) * 0.35,
      rpm: 1460 + Math.sin(i * 0.6) * 28,
    })),
  );
  const latest = readings[readings.length - 1];
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(
      () =>
        setReadings((prev) => {
          const last = prev[prev.length - 1];
          const d = new Date();
          return [
            ...prev.slice(-19),
            {
              time: `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`,
              temperature: Math.max(
                58,
                Math.min(76, last.temperature + (Math.random() - 0.48) * 1.4),
              ),
              vibration: Math.max(
                1.3,
                Math.min(3.5, last.vibration + (Math.random() - 0.5) * 0.22),
              ),
              rpm: Math.round(
                Math.max(
                  1420,
                  Math.min(1510, last.rpm + (Math.random() - 0.5) * 20),
                ),
              ),
            },
          ];
        }),
      2500,
    );
    return () => window.clearInterval(id);
  }, [running]);
  const downloadReport = () => {
    const blob = new Blob(
      [
        JSON.stringify(
          {
            asset: "PMP-204",
            name: "Centrifugal Pump Assembly",
            generatedAt: new Date().toISOString(),
            dataType: "SIMULATED DEMO TELEMETRY",
            latest,
            components: Object.values(parts),
          },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "twinview-asset-report.json";
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <Box size={20} />
          </div>
          <div>
            <strong>
              twinview<span>.</span>
            </strong>
            <small>INDUSTRIAL INTELLIGENCE</small>
          </div>
        </div>
        <div className="workspace-label">
          WORKSPACE <ChevronDown size={13} />
        </div>
        <div className="workspace-card">
          <div className="workspace-avatar">AC</div>
          <div>
            <strong>Acme Manufacturing</strong>
            <small>Engineering workspace</small>
          </div>
          <MoreHorizontal size={17} />
        </div>
        <div className="nav-label">PLATFORM</div>
        <button className="nav-item active">
          <LayoutDashboard size={17} /> Overview <span className="nav-dot" />
        </button>
        <button className="nav-item" onClick={() => setTab("components")}>
          <Box size={17} /> Asset explorer
        </button>
        <button
          className="nav-item"
          onClick={() =>
            document
              .getElementById("telemetry")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          <Activity size={17} /> Telemetry
        </button>
        <button className="nav-item" onClick={() => setSelected("cooling")}>
          <Bell size={17} /> Alerts <span className="nav-count">1</span>
        </button>
        <div className="nav-label management-label">MANAGEMENT</div>
        <button className="nav-item" onClick={downloadReport}>
          <Download size={17} /> Reports
        </button>
        <button className="nav-item" onClick={() => setRunning(!running)}>
          <Settings2 size={17} /> Demo settings
        </button>
        <div className="sidebar-bottom">
          <div className="help-card">
            <CircleHelp size={17} />
            <div>
              <strong>Need a hand?</strong>
              <small>Explore the demo data</small>
            </div>
            <ChevronRight size={15} />
          </div>
          <div className="user-card">
            <div className="user-avatar">SV</div>
            <div>
              <strong>Demo workspace</strong>
              <small>Digital Twin Engineer</small>
            </div>
            <MoreHorizontal size={17} />
          </div>
        </div>
      </aside>
      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumbs">
            Workspace <ChevronRight size={14} /> <span>Asset overview</span>
          </div>
          <div className="topbar-actions">
            <div className="search-box">
              <Search size={15} />
              <span>Search anything...</span>
              <kbd>⌘ K</kbd>
            </div>
            <button className="icon-button" aria-label="Notifications">
              <Bell size={17} />
              <i />
            </button>
            <div className="top-avatar">SV</div>
          </div>
        </header>
        <div className="page-content">
          <div className="page-heading">
            <div>
              <div className="eyebrow">
                <span className="eyebrow-dot" /> DIGITAL TWIN PLATFORM{" "}
                <span className="demo-badge">DEMO ENVIRONMENT</span>
              </div>
              <h1>Asset overview</h1>
              <p>
                Monitor, inspect, and understand your equipment in real time.
              </p>
            </div>
            <div className="heading-actions">
              <button className="secondary-button" onClick={downloadReport}>
                <Download size={15} /> Export report
              </button>
              <button
                className={`primary-button ${running ? "" : "paused"}`}
                onClick={() => setRunning(!running)}
              >
                {running ? <Activity size={15} /> : <RotateCcw size={15} />}{" "}
                {running ? "Live simulation" : "Resume simulation"}{" "}
                <span className={`live-dot ${running ? "" : "off"}`} />
              </button>
            </div>
          </div>
          <div className="asset-strip">
            <div className="asset-main-icon">
              <Cpu size={21} />
            </div>
            <div className="asset-name">
              <strong>Centrifugal Pump Assembly</strong>
              <span>
                <span className="asset-id">PMP-204</span>
                <span className="separator">/</span> Production line A{" "}
                <span className="separator">/</span> Building 02
              </span>
            </div>
            <div className="asset-status">
              <span className="status-dot" /> Operational
            </div>
            <div className="asset-divider" />
            <div className="asset-meta">
              <span>LAST SYNC</span>
              <strong>
                {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </strong>
            </div>
            <div className="asset-meta">
              <span>FIRMWARE</span>
              <strong>v2.8.1</strong>
            </div>
            <button className="more-button" aria-label="More options">
              <MoreHorizontal size={19} />
            </button>
          </div>
          <div className="metrics-grid">
            <MetricCard
              title="Temperature"
              value={latest.temperature.toFixed(1)}
              unit="°C"
              change="1.8%"
              positive
              icon={Thermometer}
              tone="orange"
            />
            <MetricCard
              title="Motor speed"
              value={latest.rpm.toLocaleString()}
              unit="RPM"
              change="2.4%"
              positive
              icon={Gauge}
              tone="blue"
            />
            <MetricCard
              title="Vibration"
              value={latest.vibration.toFixed(2)}
              unit="mm/s"
              change="0.6%"
              positive
              icon={Activity}
              tone="purple"
            />
            <MetricCard
              title="Power draw"
              value="4.82"
              unit="kW"
              change="3.2%"
              positive
              icon={Zap}
              tone="green"
            />
          </div>
          <div className="dashboard-grid">
            <section className="panel model-panel">
              <div className="panel-header">
                <div>
                  <div className="panel-title">
                    3D asset viewer{" "}
                    <span className="live-indicator">
                      <span /> LIVE
                    </span>
                  </div>
                  <p>Interactive equipment model</p>
                </div>
                <div className="panel-tools">
                  <button
                    title="Reset view"
                    onClick={() => setSelected("motor")}
                  >
                    <RotateCcw size={15} />
                  </button>
                  <button title="Expand viewer">
                    <Maximize2 size={15} />
                  </button>
                  <button title="More options">
                    <MoreHorizontal size={17} />
                  </button>
                </div>
              </div>
              <div className="model-stage">
                <div className="model-label">
                  <span className="label-square">
                    <Box size={13} />
                  </span>
                  <div>
                    <strong>PMP-204 / Assembly</strong>
                    <small>Perspective view · LOD 1</small>
                  </div>
                </div>
                <div className="model-hint">
                  <span className="hint-cursor">↖</span> Drag to orbit{" "}
                  <span className="hint-sep">·</span> Scroll to zoom
                </div>
                <Canvas
                  camera={{ position: [4.3, 2.8, 5.3], fov: 43 }}
                  dpr={[1, 1.75]}
                  gl={{ antialias: true, alpha: true }}
                >
                  <color attach="background" args={["#101923"]} />
                  <ambientLight intensity={0.65} />
                  <directionalLight position={[5, 6, 5]} intensity={2.2} />
                  <pointLight
                    position={[-3, 1, -2]}
                    intensity={1.2}
                    color="#58d9b8"
                  />
                  <Stage
                    environment="city"
                    intensity={0.45}
                    adjustCamera={false}
                  >
                    <Machine selected={selected} onSelect={setSelected} />
                  </Stage>
                  <ContactShadows
                    position={[0, -1.18, 0]}
                    opacity={0.34}
                    scale={7}
                    blur={2.5}
                    far={3}
                  />
                  <Environment preset="city" />
                  <OrbitControls
                    makeDefault
                    minDistance={3}
                    maxDistance={10}
                    maxPolarAngle={Math.PI * 0.48}
                  />
                </Canvas>
                <div className="axis-widget">
                  <span className="axis-y">Y</span>
                  <span className="axis-x">X</span>
                  <span className="axis-z">Z</span>
                  <div />
                </div>
              </div>
              <div className="model-footer">
                <div className="model-legend">
                  <span>
                    <i className="legend-green" /> Operational
                  </span>
                  <span>
                    <i className="legend-blue" /> Selected component
                  </span>
                </div>
                <button
                  className="text-button"
                  onClick={() =>
                    setTab(tab === "components" ? "overview" : "components")
                  }
                >
                  {tab === "components"
                    ? "Hide components"
                    : "Explore components"}{" "}
                  <ChevronRight size={14} />
                </button>
              </div>
              {tab === "components" && (
                <div className="component-list">
                  {(Object.keys(parts) as PartKey[]).map((k) => (
                    <button
                      key={k}
                      onClick={() => setSelected(k)}
                      className={`component-row ${selected === k ? "chosen" : ""}`}
                    >
                      <span className="component-bullet" />
                      <span>{parts[k].name}</span>
                      <small>{parts[k].id}</small>
                      <ChevronRight size={14} />
                    </button>
                  ))}
                </div>
              )}
            </section>
            <section className="panel detail-panel">
              <div className="panel-header">
                <div>
                  <div className="panel-title">Component details</div>
                  <p>Selected asset information</p>
                </div>
                <button className="plain-icon">
                  <MoreHorizontal size={18} />
                </button>
              </div>
              <div className="component-preview">
                <div className="preview-art">
                  <div className={`part-glyph ${selected}`}>
                    <Box size={30} />
                  </div>
                  <span className="preview-glow" />
                </div>
                <div className="preview-info">
                  <span className="component-type">
                    COMPONENT / {parts[selected].id}
                  </span>
                  <h3>{parts[selected].name}</h3>
                  <span
                    className={`component-status ${parts[selected].status === "Operational" ? "" : "warning"}`}
                  >
                    <span /> {parts[selected].status}
                  </span>
                </div>
              </div>
              <div className="detail-description">
                {parts[selected].description}
              </div>
              <div className="detail-table">
                <div>
                  <span>Component ID</span>
                  <strong>{parts[selected].id}</strong>
                </div>
                <div>
                  <span>Material</span>
                  <strong>{parts[selected].material}</strong>
                </div>
                <div>
                  <span>Installation date</span>
                  <strong>{parts[selected].installed}</strong>
                </div>
                <div>
                  <span>Operating mode</span>
                  <strong>Continuous</strong>
                </div>
              </div>
              <div className="detail-actions">
                <button
                  className="secondary-button full"
                  onClick={() => setTab("components")}
                >
                  <HardDrive size={15} /> View all components
                </button>
              </div>
              <div className="maintenance-note">
                <div className="maintenance-icon">
                  <AlertTriangle size={16} />
                </div>
                <div>
                  <strong>
                    {selected === "cooling"
                      ? "Maintenance recommended"
                      : "Preventive maintenance"}
                  </strong>
                  <p>
                    {selected === "cooling"
                      ? "Cooling fan inspection is due in 3 days."
                      : "Next scheduled service in 18 days."}
                  </p>
                </div>
                <ChevronRight size={15} />
              </div>
            </section>
          </div>
          <div className="bottom-grid" id="telemetry">
            <section className="panel telemetry-panel">
              <div className="panel-header">
                <div>
                  <div className="panel-title">Performance telemetry</div>
                  <p>
                    Sensor readings over time{" "}
                    <span className="simulated-label">SIMULATED DATA</span>
                  </p>
                </div>
                <div className="range-tabs">
                  {["1H", "6H", "24H"].map((r) => (
                    <button
                      key={r}
                      onClick={() => setTimeRange(r)}
                      className={timeRange === r ? "selected" : ""}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div className="chart-legend">
                <span>
                  <i className="chart-temp" /> Temperature (°C)
                </span>
                <span>
                  <i className="chart-vib" /> Vibration (mm/s)
                </span>
              </div>
              <div className="chart-wrap">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={
                      timeRange === "1H"
                        ? readings.slice(-12)
                        : timeRange === "6H"
                          ? readings
                          : readings.map((r, i) => ({
                              ...r,
                              temperature: r.temperature + Math.sin(i) * 2,
                            }))
                    }
                    margin={{ top: 8, right: 5, left: -24, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="tempFill" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="0%"
                          stopColor="#58d9b8"
                          stopOpacity={0.19}
                        />
                        <stop
                          offset="100%"
                          stopColor="#58d9b8"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient id="vibFill" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="0%"
                          stopColor="#8b7cf6"
                          stopOpacity={0.14}
                        />
                        <stop
                          offset="100%"
                          stopColor="#8b7cf6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      stroke="#24313f"
                      strokeDasharray="3 5"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="time"
                      tick={{ fill: "#718096", fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                      minTickGap={24}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#111b26",
                        border: "1px solid #2c3b4b",
                        borderRadius: 9,
                        color: "#e7edf5",
                        fontSize: 12,
                      }}
                      labelStyle={{ color: "#9eacbd" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="temperature"
                      name="Temperature °C"
                      stroke="#58d9b8"
                      strokeWidth={2}
                      fill="url(#tempFill)"
                      isAnimationActive={false}
                    />
                    <Area
                      type="monotone"
                      dataKey="vibration"
                      name="Vibration mm/s"
                      stroke="#8b7cf6"
                      strokeWidth={1.7}
                      fill="url(#vibFill)"
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="chart-foot">
                <span>
                  <span className="status-dot" /> Streaming every 2.5 seconds
                </span>
                <span>Last updated just now</span>
              </div>
            </section>
            <section className="panel alerts-panel">
              <div className="panel-header">
                <div>
                  <div className="panel-title">
                    System alerts <span className="alert-count">1</span>
                  </div>
                  <p>Events that may need attention</p>
                </div>
                <button
                  className="text-button"
                  onClick={() => setSelected("cooling")}
                >
                  View all <ChevronRight size={14} />
                </button>
              </div>
              <div className="alert-item">
                <div className="alert-icon warning-icon">
                  <AlertTriangle size={17} />
                </div>
                <div className="alert-copy">
                  <div>
                    <strong>Cooling fan inspection due</strong>
                    <span className="severity">MEDIUM</span>
                  </div>
                  <p>FAN-004 · Preventive maintenance window approaching.</p>
                  <small>
                    12 minutes ago <span>·</span> Asset PMP-204
                  </small>
                </div>
                <ChevronRight size={16} />
              </div>
              <div className="alert-item resolved">
                <div className="alert-icon success-icon">
                  <Check size={17} />
                </div>
                <div className="alert-copy">
                  <div>
                    <strong>System diagnostics passed</strong>
                    <span className="resolved-label">RESOLVED</span>
                  </div>
                  <p>All monitored systems are responding normally.</p>
                  <small>
                    1 hour ago <span>·</span> Asset PMP-204
                  </small>
                </div>
              </div>
              <div className="alert-summary">
                <ShieldCheck size={16} />
                <span>
                  <strong>System health is stable.</strong> No critical alerts
                  detected.
                </span>
              </div>
            </section>
          </div>
          <footer className="footer">
            <span>© 2026 TwinView · Digital Twin demo</span>
            <span>
              <span className="footer-status" /> All systems operational{" "}
              <span className="footer-divider">|</span>{" "}
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                Back to top ↑
              </button>
            </span>
          </footer>
        </div>
      </main>
    </div>
  );
}
