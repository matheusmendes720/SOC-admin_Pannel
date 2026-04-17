/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, ReactNode, useRef } from "react";
import { motion } from "motion/react";
import { metricsService, MetricSnapshot } from "./services/metricsService";
import CPUChart from "./components/CPUChart";
import ProcessMonitor from "./components/ProcessMonitor";
import TerminalInput from "./components/TerminalInput";
import { 
  Cpu, 
  Database, 
  FileCode, 
  Terminal as TerminalIcon, 
  Activity, 
  History, 
  Layers,
  Search,
  CheckCircle2,
  Clock,
  Globe,
  HardDrive
} from "lucide-react";

/**
 * Bento TUI Dashboard
 * An advanced data-driven frontend architecture utilizing a Mock BFF (Backend-For-Frontend)
 * for high-density metric visualization without a physical database tier.
 * 
 * Architecture Patterns:
 * - Singleton Service: metricsService manages cross-component data synchronization.
 * - Reactive Polling: Secondary data streams update at 5Hz frequencies.
 * - Bento Composition: UI decomposition into logical organisms (Header, Sidebar, Monitor, Chart).
 */
export default function App() {
  const [metrics, setMetrics] = useState<MetricSnapshot | null>(null);
  const [history, setHistory] = useState<string[]>([
    'curl -X GET /api/v1/metrics/aggregate',
    'grep -r "MetricsEngine" ./src/services',
    'node --inspect-brk ./server.ts'
  ]);
  const [terminalLines, setTerminalLines] = useState<{type: 'cmd' | 'out' | 'info', text: string}[]>([
    { type: 'cmd', text: 'cat /sys/kernel/debug/metrics' },
    { type: 'info', text: 'NODE_NAME: PETROSHIELD-NODE-ALPHA' },
    { type: 'info', text: 'KERNEL: 6.8.0-PRO-SECURITY' },
    { type: 'info', text: 'ACTIVE_USERS: 1 (720matheusmendes@gmail.com)' },
    { type: 'cmd', text: 'tail -f /var/log/syslog' },
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
    const update = () => setMetrics(metricsService.tick());
    update();
    const interval = setInterval(update, 2000); // Faster polling for dashboard energy
    return () => clearInterval(interval);
  }, []);

  const handleExecute = (cmd: string) => {
    setHistory(prev => [cmd, ...prev].slice(0, 10));
    setTerminalLines(prev => [
      ...prev,
      { type: 'cmd', text: cmd },
      { type: 'out', text: `[SECURE_ACCESS] Authenticating request: ${cmd.toUpperCase()}...` },
      { type: 'out', text: `[PETROSHIELD] Execution context verified.` }
    ]);
  };

  if (!metrics) return null;

  return (
    <div className="relative min-h-screen p-3 md:p-6 flex flex-col gap-4 max-w-[1600px] mx-auto overflow-hidden bg-tui-bg">
      {/* 3D Parallax Background Layer */}
      <motion.div 
        className="parallax-layer"
        animate={{ 
          x: mousePos.x * -20, 
          y: mousePos.y * -20,
          rotate: mousePos.x * 1,
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 50 }}
      />
      
      {/* Dynamic Glow Orbs */}
      <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-neon-matrix/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] bg-petro-orange/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel sticky top-0 z-50 flex items-center justify-between py-4 px-8 border-white/10"
      >
        <div className="flex items-center gap-4">
          <div className="p-2 bg-neon-matrix/10 rounded-lg border border-neon-matrix/20 shadow-[0_0_15px_rgba(0,255,65,0.1)]">
            <TerminalIcon className="w-6 h-6 text-neon-matrix" />
          </div>
          <div className="flex flex-col">
            <span className="hacker-font font-bold text-neon-matrix text-2xl tracking-widest glow-text-green">
              PETROSHIELD 2026
            </span>
            <span className="text-[9px] uppercase tracking-[0.3em] text-tui-text-secondary font-bold">
              Formula 1 Protection Tier
            </span>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <div className="hidden lg:flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-neon-matrix shadow-[0_0_8px_#00FF41] animate-pulse" />
            <span className="tui-status-badge border-neon-matrix/30 text-neon-matrix bg-neon-matrix/5">MATRIX_STABLE</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-terminal-cyan" />
            <span className="tui-status-badge border-terminal-cyan/30 text-terminal-cyan bg-terminal-cyan/5">UPTIME_RESILIENCE</span>
          </div>
        </div>
      </motion.header>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] gap-4 flex-1 min-h-0 relative z-10">
        {/* Sidebar */}
        <motion.aside 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar"
        >
          <div>
            <span className="text-[10px] uppercase text-tui-text-secondary font-bold tracking-widest mb-4 block">Navigation_Tree</span>
            <div className="space-y-1">
              <FileItem name="/ core" folder />
              <FileItem name="  ↳ shield.sys" active />
              <FileItem name="  ↳ firewall.cfg" />
              <FileItem name="/ assets" folder />
              <FileItem name="  ↳ logo_neon_v2" />
              <FileItem name="  ↳ metrics_schema" />
            </div>
          </div>
          
          <div className="mt-4">
            <span className="text-[10px] uppercase text-tui-text-secondary font-bold tracking-widest mb-4 block">Security_Slices</span>
            <div className="space-y-1">
              <FileItem name="endpoint_scan" />
              <FileItem name="packet_inspect" active />
              <FileItem name="threat_vector" />
            </div>
          </div>

          <div className="mt-auto p-4 border border-neon-matrix/10 rounded-lg bg-neon-matrix/5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-neon-matrix animate-ping" />
              <span className="hacker-font text-neon-matrix">LIVE_FEED</span>
            </div>
            <p className="text-[10px] text-tui-text-secondary leading-tight">
              Intercepting anomalies in sector 7-G. High priority telemetry incoming.
            </p>
          </div>
        </motion.aside>

        {/* Main Center Area */}
        <div className="flex flex-col gap-4 flex-1 min-w-0 overflow-y-auto custom-scrollbar pb-6">
          <motion.main 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="acrylic-card border-terminal-cyan/20 bg-deep-void/60 h-[320px] flex flex-col shadow-[inset_0_0_30px_rgba(0,255,255,0.03)]"
          >
            <div 
              ref={terminalRef}
              className="tui-mono space-y-2 overflow-y-auto custom-scrollbar flex-1 p-4"
            >
              {terminalLines.map((line, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  {line.type === 'cmd' && (
                    <span className="text-neon-matrix shrink-0 font-bold opacity-80">❱❱❱</span>
                  )}
                  <span className={`${
                    line.type === 'cmd' ? 'text-white font-medium' : 
                    line.type === 'info' ? 'text-terminal-cyan/80 hacker-font tracking-wide' : 
                    'text-tui-text-secondary opacity-70 text-[11px] leading-relaxed italic'
                  }`}>
                    {line.text}
                  </span>
                </div>
              ))}
              <TerminalInput onExecute={handleExecute} />
            </div>
          </motion.main>

          <CPUChart />
          
          <ProcessMonitor />

          {/* Bottom Panel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[180px] shrink-0">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="acrylic-card border-petro-orange/20"
            >
              <span className="text-[10px] uppercase text-petro-orange font-bold tracking-[0.2em] mb-4 block glow-text-orange">
                REPLAY_HISTORY
              </span>
              <div className="tui-mono text-tui-text-secondary space-y-2">
                {history.map((cmd, idx) => (
                  <div key={idx} className={`py-1 border-b border-white/5 truncate flex gap-2 items-center ${idx === 0 ? 'text-neon-matrix/80' : ''}`}>
                    <span className="text-[10px] opacity-30">[{idx}]</span>
                    {cmd}
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="acrylic-card border-terminal-cyan/20"
            >
              <span className="text-[10px] uppercase text-terminal-cyan font-bold tracking-[0.2em] mb-4 block glow-text-cyan">
                MACRO_COMPILER
              </span>
              <div className="flex flex-wrap gap-2">
                {['shield_on', 'deep_scan', 'flush_cache', 'reboot_node', 'petro_verify', 'matrix_burst', 'trace_rt'].map((text) => (
                  <Suggestion key={text} text={text} />
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Stats Pane */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col gap-4 h-full"
        >
          <StatCard 
            label="SYSTEM_LOAD" 
            value={`${metrics.cpu}%`} 
            percentage={metrics.cpu} 
            icon={<Cpu className="w-5 h-5" />} 
            color="matrix"
          />
          <StatCard 
            label="MEMORY_RESILIENCE" 
            value={`${metrics.memory.used.toFixed(1)}GB`} 
            percentage={metrics.memory.percentage} 
            icon={<Database className="w-5 h-5" />} 
            color="orange"
          />
          <StatCard 
            label="PKT_THROUGHPUT" 
            value={`${metrics.network.rx.toFixed(0)}kb/s`} 
            percentage={Math.min(100, (metrics.network.rx / 1000) * 100)} 
            icon={<Globe className="w-5 h-5" />} 
            color="cyan"
          />
          <div className="acrylic-card flex-1 border-neon-matrix/10">
            <span className="text-[10px] uppercase text-tui-text-secondary font-bold tracking-[0.2em] mb-4 block">CORE_STATUS_SUMMARY</span>
            <div className="space-y-4 tui-mono text-xs">
              <div className="flex justify-between items-center text-neon-matrix/80">
                <span className="uppercase tracking-widest opacity-60">Matrix_HMR</span>
                <span className="px-2 py-0.5 bg-neon-matrix/10 border border-neon-matrix/20 rounded">SYNCED</span>
              </div>
              <div className="flex justify-between items-center text-petro-orange/80">
                <span className="uppercase tracking-widest opacity-60">Petro_Auth</span>
                <span className="px-2 py-0.5 bg-petro-orange/10 border border-petro-orange/20 rounded">VALID</span>
              </div>
              <div className="flex justify-between items-center text-terminal-cyan/80">
                <span className="uppercase tracking-widest opacity-60">I/O_Wait</span>
                <span className="font-bold">{metrics.disk.iowait.toFixed(3)}ms</span>
              </div>
              <div className="mt-6">
                 <div className="flex justify-between items-center mb-1">
                    <span className="text-[9px] uppercase tracking-widest opacity-50">Global_Resilience</span>
                    <span className="text-neon-matrix">98.2%</span>
                 </div>
                 <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-neon-matrix shadow-[0_0_10px_#00FF41]"
                      initial={{ width: 0 }}
                      animate={{ width: '98.2%' }}
                    />
                 </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function FileItem({ name, active, folder }: { name: string; active?: boolean; folder?: boolean }) {
  return (
    <div 
      className={`tui-mono py-1.5 px-3 cursor-pointer transition-all duration-300 rounded-md border border-transparent flex items-center gap-2 group ${
        active 
          ? 'text-neon-matrix bg-neon-matrix/10 border-neon-matrix/20 shadow-[0_0_15px_rgba(0,255,65,0.05)]' 
          : 'text-tui-text-secondary hover:text-white hover:bg-white/5'
      }`}
    >
      <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-neon-matrix shadow-[0_0_8px_#00FF41]' : 'bg-transparent border border-white/20'}`} />
      <span className={folder ? 'font-bold tracking-wider' : ''}>{name}</span>
      {active && <span className="ml-auto text-[9px] opacity-40 animate-pulse">ACTIVE</span>}
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
    <div {...props} className="px-3 py-1.5 bg-deep-void/40 text-terminal-cyan tui-mono text-[10px] rounded-lg hover:bg-terminal-cyan/10 transition-all duration-300 cursor-pointer border border-terminal-cyan/10 hover:border-terminal-cyan/30 flex items-center gap-2 group">
      <span className="opacity-0 group-hover:opacity-100 transition-opacity">❱</span>
      {text}
    </div>
  );
}
