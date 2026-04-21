/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, ReactNode } from "react";
import { motion } from "motion/react";
import { metricsService, MetricSnapshot, MetricsConfig } from "./services/metricsService";
import CPUChart from "./components/CPUChart";
import NetworkTrafficChart from "./components/NetworkTrafficChart";
import TerminalInput from "./components/TerminalInput";
import MetricsControllers from "./components/MetricsControllers";
import SecurityAnalytics from "./components/SecurityAnalytics";
import IncidentBoard from "./components/IncidentBoard";
import ThreatStream from "./components/ThreatStream";
import ReportingDocs from "./components/ReportingDocs";
import SOCLifecycleStage from "./components/SOCLifecycleStage";
import DataModelViewer from "./components/DataModelViewer";
import { 
  Cpu, 
  Activity, 
  Clock,
  Globe,
  ShieldCheck,
  Zap,
  Target,
  FileText,
  GanttChartSquare
} from "lucide-react";

/**
 * AXE-GUARD SOC SUITE (CyberSec-Ops Edition)
 * 
 * ARCHITECTURAL ROLE:
 * SOC Central Nervous System (Orchestrator). This is the root application 
 * component that manages the global lifecycle of the MetricsEngine. It acts
 * as the "Master State Provider," distributing the synthesized telemetry 
 * snapshots to all specialized Bento-Grid widgets.
 * 
 * DESIGN PATTERN:
 * Pro-Grade Bento Grid Dashboard. Utilizes a rigid, non-expanding layout 
 * strategy with independent scroll zones to maintain high information density
 * without sacrificing visual stability.
 * 
 * DATA MAPPING:
 * Synchronizes the 1000ms engine heartbeat with the React state tree, triggering 
 * a recursive visual reactive update across all architectural layers.
 */
export default function App() {
  const [metrics, setMetrics] = useState<MetricSnapshot | null>(null);
  const [config, setConfig] = useState<MetricsConfig>(metricsService.getConfig());
  const [history, setHistory] = useState<string[]>([
    'axeguard.dlp --enforce-all',
    'langgraph --init-soc-subgraph',
    'prometheus.query --entropy-check'
  ]);
  
  useEffect(() => {
    const update = () => {
      setMetrics(metricsService.tick());
    };
    update();
    const interval = setInterval(update, 1000); // Increased frequency for "pulse" effect
    return () => clearInterval(interval);
  }, []);

  const handleConfigChange = (newConfig: Partial<MetricsConfig>) => {
    metricsService.setConfig(newConfig);
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  const handleExecute = (cmd: string) => {
    setHistory(prev => [cmd, ...prev].slice(0, 10));
  };

  if (!metrics) return null;

  return (
    <div className="relative h-screen max-h-screen p-3 md:p-6 flex flex-col gap-4 max-w-[2000px] mx-auto overflow-hidden bg-tui-bg select-none">
      <BackgroundLayer />
      
      {/* Dynamic Gradients for Depth */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-terminal-cyan/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-petro-orange/10 rounded-full blur-[180px] pointer-events-none" />

      {/* Header - Fixed Height */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel z-50 flex items-center justify-between py-4 px-8 border-white/5 h-20 shrink-0 shadow-2xl"
      >
        <div className="flex items-center gap-4">
          <div className="p-2 bg-terminal-cyan/10 rounded-lg border border-terminal-cyan/20 ring-4 ring-terminal-cyan/5">
            <ShieldCheck className="w-6 h-6 text-terminal-cyan" />
          </div>
          <div className="flex flex-col">
            <span className="hacker-font font-bold text-terminal-cyan text-2xl tracking-widest glow-text-cyan">
              AXE_GUARD_SOC_CORE
            </span>
            <span className="text-[9px] uppercase tracking-[0.3em] text-tui-text-secondary font-bold flex items-center gap-2">
              <Zap className="w-3 h-3 text-neon-matrix" /> AGENTIC_DLP_ORCHESTRATION_PLATFORM
            </span>
          </div>
        </div>
        <div className="flex items-center gap-10">
          <div className="hidden xl:flex items-center gap-6 pr-6 border-r border-white/5">
            {metrics.kpis.map(kpi => (
              <div key={kpi.label} className="flex flex-col items-end group cursor-help relative">
                <span className="text-[9px] text-white/30 uppercase tracking-[0.2em] font-bold">{kpi.label}</span>
                <div className="flex items-baseline gap-2">
                  <span className={`text-sm hacker-font font-bold leading-none mt-1 ${
                    kpi.color === 'matrix' ? 'text-neon-matrix' : 
                    kpi.color === 'cyan' ? 'text-terminal-cyan' : 
                    kpi.color === 'red' ? 'text-red-400' : 'text-petro-orange'
                  }`}>
                    {kpi.value}
                  </span>
                  {kpi.subValue && (
                    <span className="text-[8px] text-white/20 font-mono italic opacity-0 group-hover:opacity-100 transition-opacity">
                      {kpi.subValue}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-neon-matrix shadow-[0_0_8px_#00FF41] animate-pulse" />
              <span className="tui-status-badge border-white/10 text-white/60 bg-white/5">NODE_SYNC: OK</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-terminal-cyan" />
              <span className="text-xs font-mono font-bold text-white/40 tracking-wider">AX-001_SYNC</span>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] 2xl:grid-cols-[320px_1fr_380px] gap-4 relative z-10 overflow-hidden">
        {/* Left Sidebar - High-Density Config */}
        <motion.aside 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-4 h-full min-h-0"
        >
          <div className="glass-panel p-4 flex flex-col gap-6 overflow-y-auto custom-scrollbar flex-1 border-white/5 shadow-inner">
            <MetricsControllers config={config} onChange={handleConfigChange} />
            
            <div className="acrylic-card p-4 border-white/5 bg-white/5 shrink-0 space-y-4">
                <div className="flex items-center gap-2">
                  <Target className="w-3.5 h-3.5 text-petro-orange" />
                  <span className="text-[10px] uppercase text-tui-text-secondary font-bold tracking-[0.2em]">GUARD_STATUS</span>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-white/40 tracking-wider">AXE_SHIELD_V4.2</span>
                    <span className={metrics.axeGuardStatus === 'ACTIVE' ? "text-neon-matrix glow-text-matrix" : "text-red-400"}>
                      {metrics.axeGuardStatus}
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                     <motion.div 
                       className="h-full bg-neon-matrix shadow-[0_0_10px_#00FF41]" 
                       initial={{ width: 0 }} 
                       animate={{ width: '92%' }} 
                     />
                  </div>
                  <div className="pt-2 grid grid-cols-1 gap-1.5">
                     {metrics.langGraphNodes.map(node => (
                       <div key={node.id} className="flex justify-between items-center text-[9px] font-mono p-1 rounded hover:bg-white/5 transition-colors">
                          <span className="text-white/40 truncate pr-2">NODE.{node.id}</span>
                          <span className={`text-[8px] font-bold ${node.status === 'ACTIVE' ? "text-terminal-cyan" : "text-white/10"}`}>{node.status}</span>
                       </div>
                     ))}
                  </div>
                </div>
            </div>
          </div>

          <div className="acrylic-card p-5 border-petro-orange/20 bg-petro-orange/5 shrink-0 flex items-center justify-between">
             <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-petro-orange" />
                  <span className="text-[9px] text-petro-orange font-bold uppercase tracking-widest">DLP_ENTROPY</span>
                </div>
                <div className="hacker-font text-3xl text-white font-bold leading-none tracking-tighter">
                  {metrics.disk.entropy.toFixed(5)}
                </div>
             </div>
             <div className="w-12 h-12 rounded-full border border-petro-orange/20 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-petro-orange/10 border-t-petro-orange animate-spin" />
             </div>
          </div>
        </motion.aside>

        {/* Center Operations Zone - The Matrix Bento */}
        <main className="flex flex-col gap-4 min-w-0 h-full overflow-hidden">
          {/* Top Stage - Fixed Height */}
          <div className="shrink-0 h-24 glass-panel border-white/5 p-2 flex items-center">
            <SOCLifecycleStage currentPhase={metrics.currentPhase} />
          </div>

          {/* Primary Viewport - Flex Growing Area */}
          <div className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-12 gap-4 overflow-hidden">
            {/* Docs & Analytics - Main Row */}
            <div className="xl:col-span-8 flex flex-col gap-4 min-h-0">
               <div className="flex-1 min-h-0">
                 <ReportingDocs reports={metrics.reportingAgent} />
               </div>
               <div className="shrink-0 h-[220px]">
                 <IncidentBoard incidents={metrics.incidents} agents={metrics.agents} />
               </div>
            </div>

            {/* Realtime Streams & Charts - Side Row */}
            <div className="xl:col-span-4 flex flex-col gap-4 min-h-0">
               <div className="flex-1 min-h-0">
                 <SecurityAnalytics 
                   threatData={metrics.threatsHistory} 
                   threatScore={metrics.network.threatScore} 
                   threatStream={metrics.threatStream}
                 />
               </div>
               <div className="shrink-0 h-[160px]">
                 <CPUChart usage={metrics.cpu} />
               </div>
               <div className="flex-1 min-h-0">
                  <DataModelViewer metrics={metrics} />
               </div>
            </div>
          </div>

          {/* Infrastructure Layer - Bottom Row */}
          <div className="shrink-0 h-[300px] grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-4">
             <div className="h-full">
               <NetworkTrafficChart rx={metrics.network.rx} tx={metrics.network.tx} />
             </div>
             
             <div className="acrylic-card p-5 border-white/5 bg-deep-void/60 h-full flex flex-col relative group">
                <div className="absolute top-4 right-4 text-[8px] text-white/10 font-mono tracking-widest">SHELL_S01</div>
                <div className="flex items-center gap-2 mb-4 shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-petro-orange animate-pulse" />
                  <span className="text-[10px] uppercase text-petro-orange font-bold tracking-[0.2em] glow-text-orange">MISSION_OPERATIONAL_LOGS</span>
                </div>
                <div className="flex-1 min-h-0 tui-mono text-[11px] flex flex-col gap-3 overflow-hidden">
                   <div className="flex-1 overflow-y-auto pr-3 custom-scrollbar space-y-4 opacity-50 hover:opacity-100 transition-opacity">
                      {history.map((h, i) => (
                        <div key={i} className="flex gap-4 border-l border-white/5 pl-4 py-1 relative">
                          <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-white/10" />
                          <span className="text-white/20 shrink-0 tabular-nums">[{new Date().toLocaleTimeString()}]</span>
                          <span className="text-neon-matrix/80 shrink-0 font-bold">CMD://</span>
                          <span className="text-white/80 break-all">{h}</span>
                          <span className="text-terminal-cyan ml-auto text-[9px] font-bold group-hover:animate-pulse">_ACK_</span>
                        </div>
                      ))}
                   </div>
                   <div className="shrink-0 pt-4 border-t border-white/10">
                     <TerminalInput onExecute={handleExecute} />
                   </div>
                </div>
             </div>
          </div>
        </main>

        {/* Right Intelligence Panes - Balanced Fixed Width */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-4 h-full min-h-0"
        >
          <div className="h-44 shrink-0">
            <StatCard 
              label="SYNTHETIC_LOAD_MATRIX" 
              value={`${metrics.cpu}%`} 
              percentage={metrics.cpu} 
              icon={<Cpu className="w-5 h-5" />} 
              color="matrix"
            />
          </div>
          
          <div className="flex-1 min-h-0 flex flex-col gap-4">
            <div className="flex-1 min-h-0 glass-panel border-white/5 overflow-hidden flex flex-col">
              <ThreatStream events={metrics.threatStream} />
            </div>
            
            <div className="acrylic-card border-white/10 bg-deep-void/80 h-72 shrink-0 p-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-terminal-cyan/40 to-transparent" />
              <span className="text-[10px] uppercase text-white/40 font-bold tracking-[0.3em] mb-6 block border-b border-white/5 pb-2">SURVIVABILITY_INDEX_STREAM</span>
              
              <div className="space-y-6 tui-mono text-sm leading-none">
                <div className="flex justify-between items-center group">
                  <span className="uppercase tracking-[0.2em] text-white/40 group-hover:text-neon-matrix/80 transition-colors">Neural_Sync</span>
                  <div className="flex gap-1.5">
                    {[...Array(5)].map((_, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0.3 }}
                        animate={{ opacity: 1 }}
                        transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                        className="w-2 h-4 bg-neon-matrix rounded-[1px] shadow-[0_0_10px_#00FF41]" 
                      />
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between items-center group">
                  <span className="uppercase tracking-[0.2em] text-white/40 group-hover:text-red-400 transition-colors">Leak_Events</span>
                  <span className="font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">{metrics.incidents.length} CRIT</span>
                </div>
                
                <div className="pt-4">
                  <div className="flex justify-between items-center mb-2">
                      <span className="text-[9px] uppercase tracking-widest text-white/30 font-bold">Hardening_Buffer</span>
                      <span className="text-terminal-cyan font-bold tabular-nums">0.9997_SIGMA</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden p-[1px] border border-white/5">
                      <motion.div 
                        className="h-full bg-terminal-cyan shadow-[0_0_15px_#00FFFF]"
                        initial={{ width: 0 }}
                        animate={{ width: '94%' }}
                        transition={{ duration: 2, ease: "easeOut" }}
                      />
                  </div>
                </div>

                <div className="p-4 border border-white/5 rounded bg-black/40 mt-6 group hover:border-neon-matrix/20 transition-colors">
                  <p className="text-[10px] leading-relaxed text-white/40 italic font-serif">
                    "Axe-Guard Delta-9 is active. Encrypting cross-node telemetry. Neural weights optimized for low-entropy detection."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/**
 * BackgroundLayer Component
 * Handles parallax mouse tracking in an isolated state to prevent dashboard flickering.
 */
function BackgroundLayer() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <motion.div 
      className="parallax-layer opacity-40"
      animate={{ 
        x: mousePos.x * -30, 
        y: mousePos.y * -30,
        rotate: mousePos.x * 0.5,
      }}
      transition={{ type: 'spring', damping: 25, stiffness: 40 }}
    />
  );
}

function StatCard({ label, value, percentage, icon, color }: { 
  label: string; 
  value: string; 
  percentage: number; 
  icon: ReactNode;
  color: 'matrix' | 'orange' | 'cyan' 
}) {
  const themes = {
    matrix: { text: 'text-neon-matrix', bg: 'bg-neon-matrix', border: 'border-neon-matrix/20', glow: 'shadow-[0_0_15px_rgba(0,255,65,0.1)]' },
    orange: { text: 'text-petro-orange', bg: 'bg-petro-orange', border: 'border-petro-orange/20', glow: 'shadow-[0_0_15px_rgba(255,98,0,0.1)]' },
    cyan: { text: 'text-terminal-cyan', bg: 'bg-terminal-cyan', border: 'border-terminal-cyan/20', glow: 'shadow-[0_0_15px_rgba(0,255,255,0.1)]' }
  }[color];

  return (
    <div className={`acrylic-card ${themes.border} ${themes.glow}`}>
      <div className="flex justify-between items-start mb-3">
        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-tui-text-secondary">{label}</span>
        <div className={`opacity-80 ${themes.text}`}>{icon}</div>
      </div>
      <div className="flex items-baseline gap-2">
        <div className={`tui-mono text-3xl font-black ${themes.text} glow-text-${color === 'matrix' ? 'green' : color}`}>{value}</div>
      </div>
      <div className="mt-4 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ type: 'spring', damping: 15 }}
          className={`h-full ${themes.bg} shadow-[0_0_10px_currentColor]`}
          style={{ backgroundColor: `var(--color-${color === 'matrix' ? 'neon-matrix' : color === 'orange' ? 'petro-orange' : 'terminal-cyan'})` }}
        />
      </div>
    </div>
  );
}
