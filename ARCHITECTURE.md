# AXE-GUARD SOC SUITE: Architectural Blueprint

## 1. Overview
AXE-GUARD is a high-fidelity **Security Operations Center (SOC) Simulation Platform** built on a "Client-Side BFF" (Backend-for-Frontend) architecture. It is designed to simulate the complex, multi-agentic workflows involved in Data Loss Prevention (DLP), network monitoring, and incident response orchestration.

The platform prioritizes **observability** and **stateful transparency**, providing a professional-grade interface for managing synthesized telemetry in a purely client-side environment.

---

## 2. Core Architecture: The MetricsEngine
At the heart of AXE-GUARD lies the `MetricsEngine` (`/src/services/metricsService.ts`). This is a **Serverless Simulation Heuristic Engine** that replaces a traditional backend.

### Key Logic Patterns:
- **Heuristic Synthesis**: Uses deterministic algorithms (Linear Interpolation / LERP) to generate smooth, realistic telemetry (CPU, Network, Entropy) based on global configuration parameters.
- **Agentic State Machine**: Manages a registry of "Security Agents" with independent load factors, status directives, and directive-based mitigation logic.
- **SOC Lifecycle Orchestration**: Implements an 8-stage progress tracker that propagates events through standard security phases: *Detection -> Triage -> Mitigation -> Documentation*.
- **Temporal Persistence**: Backfills 60 points of historical data on boot, ensuring all time-series charts (Area, Bar, Scatter) provide immediate visual context.

---

## 3. Design Philosophy
The UI follows a **"Pro-Grade Bento Grid"** strategy, focusing on high information density and structural stability.

### Visual Aesthetic (Cyber-Ops):
- **Deep Void Backgrounds**: Utilizing `bg-deep-void` (`#020205`) to maximize contrast for neon indicators.
- **Neon-Matrix & Terminal-Cyan**: Strategic use of CSS variables to represent infrastructure health (Green) and orchestration status (Cyan).
- **Rigid Geometry**: Fixed-height components with independent scroll zones to prevent layout shifts during high-frequency data ingestion.
- **Glassmorphism (Acrylic)**: Layered transparency (acrylic-card) to maintain architectural depth while preserving legibility.

---

## 4. Component Registry

### CNS & Orchestration
- **App.tsx**: The root **Orchestrator**. Manages the global heartbeat and distributes telemetry snapshots.
- **SOCLifecycleStage**: A **Deterministic State Machine** visualizer showing the progress of security events along a temporal axis.

### Activity & Resource Monitoring
- **CPUChart**: A **Historical Time-Series Visualizer** for processing load.
- **NetworkTrafficChart**: A **Dual-Channel Throughput Tracker** mapping Ingress/Egress (RX/TX).
- **ProcessMonitor**: An **Agentic Swarm Heartbeat** tracker replacing OS-level process lists with agent-specific telemetry.

### Intelligence & Triage
- **IncidentBoard**: A **Multi-Agent Orchestration Observer** showing live severe alerts and agent coordination.
- **SecurityAnalytics**: A **Multi-Dimensional Heuristic Visualizer** combining Bar, Scatter, and Timeline views for 360-degree observability.
- **ThreatStream**: A **High-Volume Event Ingest Buffer** for raw, unformatted data triage.

### Control & Documentation
- **TerminalInput**: The **TUI Control Interface** for CLI-driven simulation orchestration.
- **MetricsControllers**: The **Hyperparameter Steering UI** for adjusting algorithmic sensitivity and speed.
- **ReportingDocs**: A **Knowledge Base & Archive** simulating the incident documentation phase.
- **DataModelViewer**: A **Structural Inspector** providing raw visibility into the simulation's internal data structures.

---

## 5. Data Flow & State Mapping
1. **Ticker**: The engine ticks every 1000ms.
2. **Snapshot**: A `MetricSnapshot` is synthesized based on current `MetricsConfig` (Sensitivity/Speed).
3. **Propagation**: The root `App` component receives the snapshot and propagates it via props to the Bento-Grid.
4. **Local Buffering**: Components like `CPUChart` and `NetworkTrafficChart` maintain local sliding-window buffers (60 points) derived from the incoming telemetry.
5. **UI Update**: Framer Motion and Recharts translate the raw deltas into smooth visual transitions and glowing indicators.

---

## 6. Spatial Topology & Grid Constraints
The interface is mathematically divided using a **Strict Character-Cell Grid Strategy**, inspired by Terminal User Interfaces (TUI). 

### Layout Constraints:
- **Fixed-Aspect Bento Grid**: Components utilize `h-full` within parent containers of explicit pixel/percentage heights. This prevents vertical "drift" during high-frequency data ingestion.
- **Independent Scroll Zones**: Any horizontal or vertical expansion beyond the viewport is handled via `overflow-hidden` with nested `custom-scrollbar` containers.
- **Data-Ink Ratio Optimization**: 90% of rendered pixels are dedicated to telemetry. Decorative elements are restricted to 1px borders and opacity-graded acrylic backgrounds.

---

## 7. Universal Refactoring Protocols
Changing the data model or visual identity requires adhering to the following **Structural Invariants**:

### Object Identity (Metric Refactoring):
1. **Interface First**: Always update `MetricSnapshot` or `MetricsConfig` in `/src/services/metricsService.ts` before modifying components.
2. **Deterministic Backfilling**: When adding a new metric (e.g., `packetEntropy`), update the `initialize()` method in `MetricsEngine` to ensure history charts don't "flatline" on cold start.
3. **Snapshot Immutability**: The `generateSnapshot` method MUST return a new object literal. Deep-cloning is avoided via spread operators to maintain performance on low-end nodes.

### Aesthetic Refactoring (Style Tokens):
- **Universal Variable Inheritance**: All components MUST use CSS variables defined in `@theme` block of `index.css` (e.g., `--color-neon-matrix`).
- **Atomic Indicators**: Complex widgets are decomposed into "Atoms" (e.g., a Status LED is a `motion.div` with an absolute shadow-pulse). 
- **Scale Invariance**: Use `text-[9px]` or `text-xs` for technical metadata. Never use responsive text sizing that breaks the TUI alignment constraints.

---

## 8. Molecular Component Architecture
AXE-GUARD employs a strict hierarchical decomposition from **Heuristic Definitions** to **Atomic Renderers**.

### 1. Genetic Data Layer (Genome)
Defined in `metricsService.ts`. This is the "DNA" of the simulation. If a field isn't in the interface, it doesn't exist in the product.

### 2. Atomic Renderers (Nucleotides)
Small, indivisible UI units used across all widgets:
- **Status LEDs**: `motion.div` with dynamic `animate` props linked to `agent.status`.
- **Sparklines**: Minimalist `<AreaChart />` components used for in-row telemetry.
- **Metadata Tags**: `text-[8px]` monospaced labels for raw ID injection.

### 3. Molecular Widgets (Complex Organs)
Components like `CPUChart` or `ThreatStream` synthesize multiple Atoms into a functional data product. They are "Self-Aware" of their spatial constraints, using `ResizeObserver` (implicitly via Recharts `ResponsiveContainer`) to maintain visual density.

---

## 9. Interactive Event Bus & Telemetry Feedback
Interactivity in AXE-GUARD is not just stylistic—it is a **reactive telemetry loop**.

- **Active Cursor Inheritance**: Component-level hover states trigger manual Framer Motion layout transitions. For example, hovering a KPI card scales the "Sub-Value" metadata while dimming surrounding nodes to focus attention on specific agentic directives.
- **Cross-Component Synchronization**: The `TerminalInput` dispatches commands that modify the `MetricsEngine` singleton. This immediately cascades a state change back to the `App` CNS, updating every "Cell" in the Bento Grid within 16ms (one frame).
- **Z-Axis Entropy**: Interactive depth is simulated using `backdrop-blur` and `z-index` layering. High-severity events "mount" to higher layers with aggressive glow-shadows to break the 2D grid plane.

---

## 10. Implementation Notes
- **React 18+ & Vite**: Optimized for high-frequency DOM updates.
- **Framer Motion**: Used for declarative layout transitions and "active cursor" inheritance.
- **Tailwind CSS**: Utility-first styling for precise TUI control.
- **Lucide React**: Normalized icon set for a consistent pro-tools identity.

---
*AXE-GUARD Architectural Documentation v1.3 - TUI System Edition*
