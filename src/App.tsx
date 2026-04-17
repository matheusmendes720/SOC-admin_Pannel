/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { ReactNode } from "react";
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

export default function App() {
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
          <FileItem name="    - Header.tsx" />
          <div className="mt-4">
            <span className="tui-sidebar-title">/ config</span>
            <FileItem name="- theme.json" />
            <FileItem name="- tsconfig.json" />
          </div>
        </motion.aside>

        {/* Main Center Area */}
        <div className="flex flex-col gap-3 md:gap-4 flex-1 min-w-0">
          <motion.main 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="tui-card border-tui-cyan/50 shadow-[inset_0_0_20px_rgba(0,210,255,0.05)] bg-black flex-1 flex flex-col"
          >
            <div className="tui-mono space-y-2 overflow-y-auto custom-scrollbar flex-1">
              <div className="flex gap-2">
                <span className="text-tui-green">root@tui-station:~/app#</span>
                <span className="text-white">npm run dev</span>
              </div>
              <div className="text-tui-text-secondary opacity-80">{">"} vite dev</div>
              <div className="text-tui-text-secondary opacity-80">VITE v6.2.0 ready in 120ms</div>
              <div className="text-tui-text-secondary opacity-80">  ➜  Local:   http://localhost:3000/</div>
              <div className="text-tui-text-secondary opacity-80">  ➜  Network: use --host to expose</div>
              
              <div className="my-4" />
              
              <div className="flex gap-2">
                <span className="text-tui-green">root@tui-station:~/app#</span>
                <span className="text-white">git status</span>
              </div>
              <div className="text-tui-text-secondary opacity-80">On branch main</div>
              <div className="text-tui-text-secondary opacity-80">Changes not staged for commit:</div>
              <div className="text-tui-text-secondary opacity-80">  (use "git add {"<"}file{">"}..." to update what will be committed)</div>
              <div className="text-tui-orange pl-4 italic">modified:   src/App.tsx</div>
              
              <div className="my-4" />
              
              <div className="flex gap-2 items-center">
                <span className="text-tui-green">root@tui-station:~/app#</span>
                <span className="text-white group">grep "Bento" .<span className="tui-cursor" /></span>
              </div>
            </div>
          </motion.main>

          {/* Bottom Panel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 h-[180px]">
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
                <div className="pb-1 border-b border-tui-border/50">cd src && ls -la</div>
                <div className="py-1 border-b border-tui-border/50">npm install @google/genai</div>
                <div className="py-1 text-tui-cyan">cat package.json | grep version</div>
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
                <Suggestion text="--force" />
                <Suggestion text="--save-dev" />
                <Suggestion text="--verbose" />
                <Suggestion text="--silent" />
                <Suggestion text="--ignore-scripts" />
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
            value="42.8%" 
            percentage={42.8} 
            icon={<Cpu className="w-4 h-4" />} 
            color="cyan"
          />
          <StatCard 
            label="Memory Load" 
            value="2.4 / 16 GB" 
            percentage={15} 
            icon={<Database className="w-4 h-4" />} 
            color="green"
          />
          <StatCard 
            label="Network Traffic" 
            value="85.2 KB/s" 
            percentage={62} 
            icon={<Globe className="w-4 h-4" />} 
            color="orange"
          />
          <StatCard 
            label="Disk I/O" 
            value="12.5 MB/s" 
            percentage={28} 
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
                <span>ESLint</span>
                <span className="text-tui-green">ON</span>
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
