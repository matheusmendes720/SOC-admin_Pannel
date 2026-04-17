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
    { type: 'info', text: 'NODE_NAME: AIS-NODE-ALPHA-X' },
    { type: 'info', text: 'KERNEL: 6.2.0-26-GENERIC' },
    { type: 'info', text: 'ACTIVE_USERS: 1 (720matheusmendes@gmail.com)' },
    { type: 'cmd', text: 'tail -f /var/log/syslog' },
  ]);

  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalLines]);

  useEffect(() => {
    // Subscriber loop for the mock BFF layer
    const update = () => setMetrics(metricsService.tick());
    update();
    const interval = setInterval(update, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleExecute = (cmd: string) => {
    setHistory(prev => [cmd, ...prev].slice(0, 10));
    setTerminalLines(prev => [
      ...prev,
      { type: 'cmd', text: cmd },
      { type: 'out', text: `[SYSTEM] Processing request: ${cmd}...` },
      { type: 'out', text: `[OK] Task executed successfully.` }
    ]);
  };

  if (!metrics) return null;

  return (
    <div className="min-h-screen p-3 md:p-4 flex flex-col gap-3 md:gap-4 max-w-[1400px] mx-auto overflow-hidden">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="tui-card flex items-center justify-between py-3 px-5"
      >
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-5 h-5 text-tui-green" />
          <span className="tui-mono font-bold text-tui-green text-lg tracking-tight">
            [ REACT_TUI_OS ]
          </span>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-tui-green" />
            <span className="tui-status-badge border-tui-green text-tui-green">System: Stable</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-tui-cyan" />
            <span className="tui-status-badge border-tui-cyan text-tui-cyan">Uptime: 104:12:44</span>
          </div>
        </div>
      </motion.header>

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr_280px] gap-3 md:gap-4 flex-1 min-h-0">
        {/* Sidebar */}
        <motion.aside 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="tui-card flex flex-col gap-1 overflow-y-auto"
        >
          <span className="tui-sidebar-title">Project Explorer</span>
          <FileItem name="/ src" />
          <FileItem name="  + App.tsx" active />
          <FileItem name="  + hooks/" />
          <FileItem name="    - useTerminal.ts" />
          <FileItem name="  + components/" />
          <FileItem name="    - Terminal.tsx" />
          <FileItem name="    - CPUChart.tsx" />
          <FileItem name="    - ProcessMonitor.tsx" active />
          <FileItem name="    - Header.tsx" />
          <div className="mt-4">
            <span className="tui-sidebar-title">/ services</span>
            <FileItem name="- metricsService.ts" active />
          </div>
          <div className="mt-4">
            <span className="tui-sidebar-title">/ config</span>
            <FileItem name="- theme.json" />
            <FileItem name="- tsconfig.json" />
          </div>
        </motion.aside>

        {/* Main Center Area */}
        <div className="flex flex-col gap-3 md:gap-4 flex-1 min-w-0 overflow-y-auto custom-scrollbar">
          <motion.main 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="tui-card border-tui-cyan/50 shadow-[inset_0_0_20px_rgba(0,210,255,0.05)] bg-black/40 h-[280px] flex flex-col"
          >
            <div 
              ref={terminalRef}
              className="tui-mono space-y-1 overflow-y-auto custom-scrollbar flex-1 p-2"
            >
              {terminalLines.map((line, idx) => (
                <div key={idx} className="flex gap-2">
                  {line.type === 'cmd' && <span className="text-tui-green shrink-0">root@tui-station:~/app#</span>}
                  <span className={`${
                    line.type === 'cmd' ? 'text-white' : 
                    line.type === 'info' ? 'text-tui-text-secondary opacity-80 text-xs' : 
                    'text-tui-cyan opacity-60 text-[10px]'
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 h-[180px] shrink-0">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="tui-card overflow-y-auto"
            >
              <span className="tui-sidebar-title flex items-center gap-2">
                <History className="w-3 h-3" /> Command History
              </span>
              <div className="tui-mono text-tui-text-secondary space-y-1">
                {history.map((cmd, idx) => (
                  <div key={idx} className={`py-1 border-b border-tui-border/50 truncate ${idx === 0 ? 'text-tui-cyan' : ''}`}>
                    {cmd}
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="tui-card"
            >
              <span className="tui-sidebar-title flex items-center gap-2">
                <Layers className="w-3 h-3" /> Auto-complete
              </span>
              <div className="flex flex-wrap gap-2">
                {['npm', 'git', 'ls', 'cat', 'grep', 'curl', 'clear', 'node', 'help'].map((text) => (
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
          className="flex flex-col gap-3 md:gap-4 h-full"
        >
          <StatCard 
            label="CPU Usage" 
            value={`${metrics.cpu}%`} 
            percentage={metrics.cpu} 
            icon={<Cpu className="w-4 h-4" />} 
            color="cyan"
          />
          <StatCard 
            label="Memory Load" 
            value={`${metrics.memory.used.toFixed(1)} / 16 GB`} 
            percentage={metrics.memory.percentage} 
            icon={<Database className="w-4 h-4" />} 
            color="green"
          />
          <StatCard 
            label="Network Traffic" 
            value={`${metrics.network.rx.toFixed(1)} KB/s`} 
            percentage={Math.min(100, (metrics.network.rx / 1000) * 100)} 
            icon={<Globe className="w-4 h-4" />} 
            color="orange"
          />
          <StatCard 
            label="Disk I/O" 
            value={`${metrics.disk.read.toFixed(1)} MB/s`} 
            percentage={Math.min(100, (metrics.disk.read / 100) * 100)} 
            icon={<HardDrive className="w-4 h-4" />} 
            color="cyan"
          />
          <div className="tui-card flex-1">
            <span className="tui-sidebar-title flex items-center gap-2">
              <Activity className="w-3 h-3" /> Active Workers
            </span>
            <div className="mt-4 space-y-3 tui-mono text-sm">
              <div className="flex justify-between border-b border-tui-border pb-1">
                <span>Vite HMR</span>
                <span className="text-tui-green">ON</span>
              </div>
              <div className="flex justify-between border-b border-tui-border pb-1">
                <span>Tailwind JIT</span>
                <span className="text-tui-green">ON</span>
              </div>
              <div className="flex justify-between border-b border-tui-border pb-1">
                <span>I/O Wait</span>
                <span className="text-tui-cyan">{metrics.disk.iowait.toFixed(3)}ms</span>
              </div>
              <div className="flex justify-between border-b border-tui-border pb-1">
                <span>Proc Load</span>
                <span className="text-tui-green">OPTIMAL</span>
              </div>
              <div className="flex justify-between border-b border-tui-border pb-1">
                <span>Telemetry</span>
                <span className="text-tui-cyan">5Hz POLLING</span>
              </div>
              <div className="flex justify-between border-b border-tui-border pb-1">
                <span>Compiler</span>
                <span className="text-tui-orange">WAIT</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function FileItem({ name, active }: { name: string; active?: boolean }) {
  return (
    <div 
      className={`tui-mono py-1 px-2 cursor-pointer transition-colors ${
        active ? 'text-tui-cyan bg-tui-cyan/5 border-l-2 border-tui-cyan' : 'text-tui-text-secondary hover:text-tui-text-primary'
      }`}
    >
      {name}
    </div>
  );
}

function StatCard({ label, value, percentage, icon, color }: { 
  label: string; 
  value: string; 
  percentage: number; 
  icon: ReactNode;
  color: 'cyan' | 'green' | 'orange' 
}) {
  const colorClass = {
    cyan: 'bg-tui-cyan',
    green: 'bg-tui-green',
    orange: 'bg-tui-orange'
  }[color];

  return (
    <div className="tui-card">
      <div className="flex justify-between items-start mb-2">
        <span className="text-[10px] uppercase text-tui-text-secondary tracking-widest">{label}</span>
        <div className={`opacity-60 text-tui-${color}`}>{icon}</div>
      </div>
      <div className="tui-mono text-2xl font-bold">{value}</div>
      <div className="mt-3 h-1 w-full bg-tui-border rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          className={`h-full ${colorClass}`}
        />
      </div>
    </div>
  );
}

function Suggestion({ text }: { text: string }) {
  return (
    <div className="px-2 py-1 bg-tui-border/50 text-tui-orange tui-mono text-[10px] rounded hover:bg-tui-orange/10 transition-colors cursor-pointer border border-tui-orange/20">
      {text}
    </div>
  );
}
