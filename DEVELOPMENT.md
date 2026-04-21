# AXE-GUARD SOC SUITE: Development Guide

This guide is intended for engineers looking to extend or modify the AXE-GUARD simulation environment.

## 1. Extending the MetricsEngine

The simulation logic resides in `/src/services/metricsService.ts`. All data synthesis happens in the `generateSnapshot` method.

### Adding a New KPI
1. Update the `SecurityKPI` interface.
2. In `generateSnapshot`, add a new object to the `kpis` array.
3. The UI in `App.tsx` will automatically render the new KPI in the header.

### Modifying Lifecycle Phases
The standard 8-stage lifecycle is defined in the `SOCLifecyclePhase` type and the `phases` array in `MetricsEngine`. To add a phase:
1. Define the new phase in the `SOCLifecyclePhase` union type.
2. Add it to the `this.phases` array in the `MetricsEngine` constructor.
3. Update `SOCLifecycleStage.tsx` to include an icon for the new phase.

---

## 2. Creating New UI Widgets

All widgets should follow the "Bento Grid" design pattern.

### Recommended Component Structure:
- **Architectural Role**: Define what part of the simulation the component visualizes.
- **Data Hook**: Consume data via props from `App.tsx` (which subscribes to the `metricsService`).
- **Styling**: Use the `.acrylic-card` class and Tailwind utility classes for consistent TUI appearance.

### Example Widget Template:
```tsx
import { motion } from 'motion/react';
import { Activity } from 'lucide-react';

export default function MyNewWidget({ data }) {
  return (
    <div className="acrylic-card p-4 h-full border-terminal-cyan/10">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-4 h-4 text-terminal-cyan" />
        <span className="text-[10px] font-bold uppercase tracking-widest">MY_WIDGET_DATA</span>
      </div>
      {/* Visual logic goes here */}
    </div>
  );
}
```

---

## 3. Extending the TUI (Terminal)

The terminal and its suggestions are managed in `TerminalInput.tsx`.

### Adding Commands:
1. Add your new command string to the `SUGGESTIONS` array in `TerminalInput.tsx`.
2. Update the `onExecute` handler in `App.tsx` to implement the logic for the new command (e.g., triggering a specific alert or changing a simulation mode).

---

## 4. Tuning Simulation Parameters

The simulation "vibe" is primarily controlled by the `MetricsConfig`:
- **Sensitivity**: Directly impacts the probability of a "Burst" (High Threat) state.
- **Threshold**: Determines when the `SecurityAnalytics` scatter plot markers change behavior.
- **LifecycleSpeed**: Inversely proportional to the time spent in each SOC phase.

Adjust these defaults in the `MetricsEngine` private `config` property.

---

## 5. Heuristic Deep Tuning (More Mock Data)

To increase the "entropy" or complexity of the in-memory simulation without an API:

### 1. Entropy Injectors
Modify the `disk.entropy` calculation in `generateSnapshot`. You can introduce sine-wave periodicities to simulate daily traffic cycles:
```ts
const timeFactor = Math.sin(timestamp / 1000000);
const rawEntropy = 0.5 + (timeFactor * 0.2);
```

### 2. Multi-Agent Data Expansion
To add more mock metrics per agent (e.g., `neuralHealth`, `cachePressure`), expand the `SecurityAgent` interface in `metricsService.ts`. Ensure you provide a "Drift" value in each `tick()` so the bars actually move:
```ts
agent.neuralHealth = this.smooth(95 + Math.random() * 5, agent.neuralHealth);
```

---

## 6. Design Token Refactoring (Aesthetics)

Visual identity is managed via **Atomic Style Tokens** in `src/index.css`.

### Global Color Shifts
To re-brand the platform (e.g., from Matrix Green to Deep Sea Blue):
1. Locate the `--color-neon-matrix` variable in `@theme`.
2. Update the hex value.
3. Because all components use the `text-neon-matrix` or `border-neon-matrix` Tailwind classes, the re-brand will propagate instantly.

### Structural Refactoring (Grid Sizes)
The "Pro-Grade Bento Grid" relies on explicit height/width classes in `App.tsx`:
- **Change Proportions**: Locate the `grid-cols-` and `h-[]` classes in the `App.tsx` return block.
- **Invariant**: Maintain a 12-column virtual grid. Adjust `col-span-X` to re-balance widget dominance.

---

## 7. Refactoring Data Structures (BFF Orchestration)

When the business requirements change the "Object Model" (e.g., adding a `threatOrigin` field to all events):

1. **Schema Update**: Update the TypeScript interface in `metricsService.ts`.
2. **Propagator Update**: Update the `MetricSnapshot` generation to include the new field.
3. **Component Injection**: Update the props of the relevant widget (e.g., `ThreatStream.tsx`).
4. **DataModelViewer Verification**: Use the integrated **DataModelViewer** widget (in the bottom-left of the live app) to verify that the raw JS object actually contains the new field at runtime.

---

## 8. Genetic Chart Manipulation (Molecular Level)

To modify the "genetic" behavior of data plots (Recharts):

### 1. Point Entropy & Scatter Dynamics
In `SecurityAnalytics.tsx`, the scatter plot markers represent "Packet Entropy." To change their visual behavior:
- **Marker Size**: Adjust the `range` prop in the `<ZAxis />` component.
- **Jitter Logic**: Modify the `Math.random()` multipliers in the `useMemo` block that generates the `scatterData`. Increasing the multiplier increases visual "chaos."

### 2. Area Interpolation
For `CPUChart` and `NetworkTrafficChart`, the `type="monotone"` prop ensures smooth curves. For a more "Brutalist/TUI" feel, change this to `type="stepAfter"`. This will convert technical curves into digital step-functions.

---

## 9. High-Fidelity Widget Interactivity

AXE-GUARD uses **Motion (React)** for sub-atomic layout animations.

### 1. Active Cursor Inheritance
To add a "Glow Follow" or "Active State" to a new widget:
```tsx
<motion.div 
  whileHover={{ scale: 1.02, backgroundColor: 'rgba(0, 255, 65, 0.05)' }}
  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
  className="... border border-white/5 hover:border-neon-matrix/30"
>
  {/* Content */}
</motion.div>
```

### 2. Manual Pulse Triggers
You can trigger a "Security Alert Pulse" on any widget by binding its opacity or border-color to the `metrics.axeGuardStatus` state. If 'ISOLATED', add `animate={{ borderColor: ['#ff0000', '#000000'] }}` to simulate a warning beacon.

---

## 10. Deployment Notes

As this is a **Client-Side BFF**, the application is fully static upon build.
- **Build**: `npm run build`
- **Output**: The `/dist` folder can be served from any static host (Cloud Run, S3, Firebase Hosting, etc.).

No backend configuration is required unless you choose to replace the `MetricsEngine` with a real Webhook or WebSocket stream.

---
*Developed for SOC Orchestration & Architecture Research.*
