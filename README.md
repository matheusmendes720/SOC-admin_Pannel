# 🛡️ AXE-GUARD SOC SUITE

> **Agentic DLP & CyberSec-Ops Orchestration Platform**
> 
> A high-fidelity, professional-grade Security Operations Center (SOC) dashboard. AXE-GUARD simulates advanced enterprise security environments, providing real-time observability into agentic middlewares, Data Loss Prevention (DLP) pipelines, and autonomous threat mitigation workflows.

![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)
![React](https://img.shields.io/badge/React-18+-61DAFB.svg?logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC.svg?logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-Rapid%20Dev-646CFF.svg?logo=vite)

---

## 🚀 Overview

AXE-GUARD is built for the "Next-Gen SOC," where human operators oversee a swarm of autonomous security agents. It utilizes a **Client-Side BFF (Backend-for-Frontend)** architecture to deliver a data-dense, real-time experience without requiring a complex server infrastructure.

### 💎 Key Features

- **Autonomous Metrics Engine**: A sophisticated simulation engine that handles high-frequency telemetry (CPU, Network, IO) using deterministic smoothing algorithms.
- **8-Stage SOC Lifecycle**: Full visualization of the NIST-aligned incident response rotation (Monitor, Detect, Triage, Analysis, Response, Recovery, Hunt, Lessons Learnt).
- **Agentic Multi-Tenant Observer**: Track the health and load of independent security agents (Axe-Guard, LangGraph, Prometheus).
- **Pro-Grade Bento Grid**: A rigid, high-density dashboard layout designed for multi-monitor setups and mission-critical visibility.
- **TUI Command Interface**: Integrated terminal for CLI-driven orchestration with real-time autocompletion.
- **Deep Data Inspection**: In-situ data model viewer to audit the raw state of the simulation engine.

---

## 🛠️ Tech Stack

- **Framework**: [React 18+](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animation**: [Motion (Framer Motion)](https://motion.dev/)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Simulation**: Custom **MetricsEngine** (In-memory heuristic synthesis)

---

## 📁 Project Structure

```bash
AXE-GUARD/
├── src/
│   ├── components/       # Bento-Grid widgets and UI modules
│   ├── services/         # MetricsEngine & Heuristic Logic
│   ├── App.tsx           # Dashboard Orchestrator (CNS)
│   ├── main.tsx          # Entry point
│   └── index.css         # Global TUI-theme styles
├── ARCHITECTURE.md       # Deep-dive into system design
├── DEVELOPMENT.md        # Guide for extending the platform
└── README.md             # Project overview (this file)
```

---

## 📖 Documentation

For deep technical insights, please refer to the following:

- **[Architectural Blueprint](./ARCHITECTURE.md)**: Details on the BFF pattern, LERP smoothing, and data flow.
- **[Development Guide](./DEVELOPMENT.md)**: Instructions for adding new agents, modifying simulation parameters, and extending the TUI command set.

---

## ⚡ Quick Start

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start the Simulation**:
   ```bash
   npm run dev
   ```

3. **Interact**: Use the **Simulation Conduit** in the left sidebar to adjust threat floor and orchestration speed. Use the terminal (bottom row) to execute commands.

---

## 📄 License
This project is licensed under the Apache-2.0 License - see the [LICENSE](http://www.apache.org/licenses/LICENSE-2.0) file for details.

*Crafted by the AXE-GUARD Architecture Team.*
