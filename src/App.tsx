/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, ReactNode, useRef } from "react";
import { motion } from "motion/react";
import { metricsService, MetricSnapshot, MetricsConfig } from "./services/metricsService";
import CPUChart from "./components/CPUChart";
import NetworkTrafficChart from "./components/NetworkTrafficChart";
import ProcessMonitor from "./components/ProcessMonitor";
import TerminalInput from "./components/TerminalInput";
import MetricsControllers from "./components/MetricsControllers";
import SecurityAnalytics from "./components/SecurityAnalytics";
import IncidentBoard from "./components/IncidentBoard";
import { 
  Cpu, 
  Database, 
  Terminal as TerminalIcon, 
  Activity, 
  History, 
  Layers,
  Clock,
  Globe,
  HardDrive,
  ShieldCheck,
  Zap,
  Target
} from "lucide-react";

/**
 * Enhanced PetroShield SOC Dashboard (Multi-Agentic Architecture)
 * Fully documented data structures for real-world cyber threat visualization.
 * Integrates simulation controls, heuristic incident detection, and multi-agent synergy.
 */
export default function App() {
  const [metrics, setMetrics] = useState<MetricSnapshot | null>(null);
  const [config, setConfig] = useState<MetricsConfig>(metricsService.getConfig());
  const [history, setHistory] = useState<string[]>([
    'shield.sys --scan-all',
    'petro_verify --identity=core_admin',
    'matrix_burst --sector=7G'
  ]);
  const [terminalLines, setTerminalLines] = useState<{type: 'cmd' | 'out' | 'info' | 'warn', text: string}[]>([
    { type: 'info', text: 'PETROSHIELD_SOC_CLIENT_V2.0.4.7' },
    { type: 'info', text: 'MATRIX_SYNERGY: OPTIMAL' },
    { type: 'cmd', text: 'shield_on' },
    { type: 'out', text: '[SYSTEM] Initializing multi-agent heuristic net...' },
  ]);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalLines]);

  useEffect(() => {
    const update = () => {
      const snap = metricsService.tick();
      setMetrics(snap);
      
      // Auto-log incidents to terminal
      if (snap.incidents.length > 0) {
        setTerminalLines(prev => [
          ...prev,
          { type: 'warn', text: `[THREAT_DETECTED] ${snap.incidents[0].type}: ${snap.incidents[0].summary}` }
        ].slice(-50));
      }
    };
    update();
    const interval = setInterval(update, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleConfigChange = (newConfig: Partial<MetricsConfig>) => {
    metricsService.setConfig(newConfig);
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  const handleExecute = (cmd: string) => {
    setHistory(prev => [cmd, ...prev].slice(0, 10));
    setTerminalLines(prev => [
      ...prev,
      { type: 'cmd', text: cmd },
      { type: 'out', text: `[SECURE_ACCESS] Authenticating request: ${cmd.toUpperCase()}...` },
      { type: 'out', text: `[PETROSHIELD] Execution context verified.` }
    ].slice(-50));
  };

  if (!metrics) return null;

  return (
    <div className="relative min-h-screen p-3 md:p-6 flex flex-col gap-4 max-w-[1700px] mx-auto overflow-hidden bg-tui-bg">
      {/* 3D Parallax Background Layer */}
      <motion.div 
        className="parallax-layer opacity-40"
        animate={{ 
          x: mousePos.x * -30, 
          y: mousePos.y * -30,
          rotate: mousePos.x * 0.5,
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 40 }}
      />
      
      <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-neon-matrix/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] bg-petro-orange/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel sticky top-0 z-50 flex items-center justify-between py-4 px-8 border-white/5"
      >
        <div className="flex items-center gap-4">
          <div className="p-2 bg-neon-matrix/10 rounded-lg border border-neon-matrix/20">
            <ShieldCheck className="w-6 h-6 text-neon-matrix" />
          </div>
          <div className="flex flex-col">
            <span className="hacker-font font-bold text-neon-matrix text-2xl tracking-widest glow-text-green">
              PETRO_SOC_CORE
            </span>
            <span className="text-[9px] uppercase tracking-[0.3em] text-tui-text-secondary font-bold">
              MULTI_AGENTIC_ORCHESTRATION_SUITE
            </span>
          </div>
        </div>
        <div className="flex items-center gap-10">
          <div className="hidden lg:flex items-center gap-6">
            {metrics.kpis.map(kpi => (
              <div key={kpi.label} className="flex flex-col items-end">
                <span className="text-[9px] text-white/30 uppercase tracking-[0.2em] font-bold">{kpi.label}</span>
                <span className={`text-sm hacker-font font-bold leading-none mt-1 text-tui-${kpi.color === 'matrix' ? 'green' : kpi.color}`}>
                  {kpi.value}
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-terminal-cyan" />
            <span className="tui-status-badge border-terminal-cyan/30 text-terminal-cyan bg-terminal-cyan/5">UPTIME_2026.RT</span>
          </div>
        </div>
      </motion.header>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr_340px] gap-4 flex-1 min-h-0 relative z-10">
        {/* Left Sidebar: Controls */}
        <motion.aside 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar"
        >
          <MetricsControllers config={config} onChange={handleConfigChange} />
          
          <div className="mt-auto acrylic-card p-4 border-white/5 bg-white/5">
             <div className="flex items-center gap-2 mb-3">
                <Target className="w-3.5 h-3.5 text-petro-orange" />
                <span className="text-[10px] uppercase text-tui-text-secondary font-bold tracking-widest">Global_Evasion</span>
             </div>
             <div className="tui-mono text-[9px] text-white/50 space-y-1">
                <div>THREAT_SCORE: <span className="text-petro-orange font-bold">{metrics.network.threatScore.toFixed(0)}</span></div>
                <div>L7_LATENCY: 12.4ms</div>
                <div>HEURISTICS: <span className="text-neon-matrix">ACTIVE</span></div>
             </div>
          </div>
        </motion.aside>

        {/* Main Center Area */}
        <div className="flex flex-col gap-4 flex-1 min-w-0 overflow-y-auto custom-scrollbar pb-6 scroll-smooth">
          <motion.main 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="acrylic-card border-terminal-cyan/20 bg-deep-void/60 h-[340px] flex flex-col shadow-[inset_0_0_40px_rgba(0,255,255,0.03)]"
          >
            <div className="px-4 py-2 border-b border-white/5 bg-white/5 flex justify-between items-center shrink-0">
               <div className="flex gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/20 border border-red-400/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-petro-orange/20 border border-petro-orange/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-neon-matrix/20 border border-neon-matrix/40" />
               </div>
               <span className="text-[9px] font-mono text-white/20 tracking-widest uppercase">PETRO_SEC_VIRTUAL_SHELL</span>
            </div>
            <div 
              ref={terminalRef}
              className="tui-mono space-y-2 overflow-y-auto custom-scrollbar flex-1 p-4"
            >
              {terminalLines.map((line, idx) => (
                <div key={idx} className="flex gap-3 items-start animate-in fade-in slide-in-from-left-1 duration-300">
                  {line.type === 'cmd' && (
                    <span className="text-neon-matrix shrink-0 font-bold opacity-80">❱❱❱</span>
                  )}
                  <span className={`${
                    line.type === 'cmd' ? 'text-white font-medium' : 
                    line.type === 'info' ? 'text-terminal-cyan/80 hacker-font tracking-wide' : 
                    line.type === 'warn' ? 'text-red-400 font-bold glow-text-red uppercase text-[10px]' :
                    'text-tui-text-secondary opacity-70 text-[11px] leading-relaxed italic'
                  }`}>
                    {line.text}
                  </span>
                </div>
              ))}
              <TerminalInput onExecute={handleExecute} />
            </div>
          </motion.main>

          <SecurityAnalytics threatData={metrics.threatsHistory} threatScore={metrics.network.threatScore} />
          
          <IncidentBoard incidents={metrics.incidents} agents={metrics.agents} />

          <CPUChart />

          <NetworkTrafficChart />

          {/* Bottom Interactive History / Macro Panel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 shrink-0 mt-2">
            <motion.div className="acrylic-card border-petro-orange/10 p-4">
              <span className="text-[10px] uppercase text-petro-orange font-bold tracking-[0.2em] mb-4 block glow-text-orange">
                REPLAY_HISTORY
              </span>
              <div className="tui-mono text-tui-text-secondary space-y-2 text-xs">
                {history.map((cmd, idx) => (
                  <div key={idx} className={`py-1.5 border-b border-white/5 truncate flex gap-3 items-center ${idx === 0 ? 'text-neon-matrix/80' : ''}`}>
                    <span className="text-[9px] opacity-30 font-bold">L{idx}</span>
                    <span className="flex-1">{cmd}</span>
                    {idx === 0 && <Zap className="w-3 h-3 animate-pulse" />}
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div className="acrylic-card border-terminal-cyan/10 p-4">
              <span className="text-[10px] uppercase text-terminal-cyan font-bold tracking-[0.2em] mb-4 block glow-text-cyan">
                MACRO_ORCHESTRATORS
              </span>
              <div className="flex flex-wrap gap-2">
                {['shield_purge', 'agent_boost', 'flush_vnet', 'deep_heuristic_eval', 'threat_neutralization', 'matrix_sync', 'evasion_reset'].map((text) => (
                  <Suggestion key={text} text={text} />
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Stats Pane: Telemetry & Resilience */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col gap-4 h-full"
        >
          <StatCard 
            label="MATRIX_SYNTHESIS" 
            value={`${metrics.cpu}%`} 
            percentage={metrics.cpu} 
            icon={<Cpu className="w-5 h-5" />} 
            color="matrix"
          />
          <StatCard 
            label="ENTROPY_INDEX" 
            value={`${metrics.disk.entropy.toFixed(3)}`} 
            percentage={metrics.disk.entropy * 100} 
            icon={<Activity className="w-5 h-5" />} 
            color="orange"
          />
          <StatCard 
            label="THREAT_LATITUDE" 
            value={`${metrics.network.threatScore.toFixed(0)}%`} 
            percentage={metrics.network.threatScore} 
            icon={<Globe className="w-5 h-5" />} 
            color="cyan"
          />
          
          <div className="acrylic-card flex-1 border-white/5 bg-deep-void/40">
            <span className="text-[10px] uppercase text-tui-text-secondary font-bold tracking-[0.2em] mb-4 block">SURVIVABILITY_INDEX</span>
            <div className="space-y-5 tui-mono text-xs">
              <div className="flex justify-between items-center text-neon-matrix/90">
                <span className="uppercase tracking-widest opacity-60">Agent_Sync</span>
                <div className="flex gap-1">
                   {[...Array(5)].map((_, i) => <div key={i} className="w-1 h-3 bg-neon-matrix rounded-sm shadow-[0_0_5px_#00FF41]" />)}
                </div>
              </div>
              <div className="flex justify-between items-center text-petro-orange/90">
                <span className="uppercase tracking-widest opacity-60">Packet_Loss</span>
                <span className="font-bold">0.02%</span>
              </div>
              
              <div className="mt-8">
                 <div className="flex justify-between items-center mb-1">
                    <span className="text-[9px] uppercase tracking-widest opacity-50 font-bold">Collective_Harden</span>
                    <span className="text-terminal-cyan font-bold">{metrics.network.activeConnections} CONNS</span>
                 </div>
                 <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-terminal-cyan shadow-[0_0_10px_#00FFFF]"
                      initial={{ width: 0 }}
                      animate={{ width: '88%' }}
                    />
                 </div>
              </div>

              <div className="p-3 border border-neon-matrix/10 rounded bg-neon-matrix/5 mt-4">
                 <p className="text-[10px] leading-tight text-white/60 italic">
                    "AI-driven heuristics are currently processing L4 telemetry. Threat latitude remains optimal."
                 </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
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

function Suggestion({ text, ...props }: { text: string; [key: string]: any }) {
  return (
    <div {...props} className="px-3 py-2 bg-deep-void/40 text-terminal-cyan tui-mono text-[10px] rounded-lg hover:bg-terminal-cyan/10 transition-all duration-300 cursor-pointer border border-terminal-cyan/10 hover:border-terminal-cyan/30 flex items-center gap-2 group font-bold tracking-tight">
      <span className="text-neon-matrix opacity-40 group-hover:opacity-100 transition-opacity">❱</span>
      {text}
    </div>
  );
}
