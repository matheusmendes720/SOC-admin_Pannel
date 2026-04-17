/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { metricsService, ProcessInfo } from '../services/metricsService';
import { motion, AnimatePresence } from 'motion/react';
import { ListFilter } from 'lucide-react';

/**
 * ProcessMonitor Component
 * Renders a tabular visualization of high-frequency process data.
 * Demonstrates recursive property lookup and state-driven row animations.
 */
export default function ProcessMonitor() {
  const [processes, setProcesses] = useState<ProcessInfo[]>([]);

  useEffect(() => {
    // Initial fetch
    setProcesses(metricsService.tick().processes);

    const interval = setInterval(() => {
      setProcesses(metricsService.tick().processes);
    }, 3000); // Shorter interval for dynamic feel

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="acrylic-card mt-4 border-neon-matrix/10 bg-black/40 flex-1 shadow-[0_0_25px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-neon-matrix/10 rounded border border-neon-matrix/20">
            <ListFilter className="w-3 h-3 text-neon-matrix" />
          </div>
          <span className="text-[10px] uppercase text-neon-matrix font-bold tracking-[0.3em] glow-text-green">
            SECURITY_PROCESS_HEARTBEAT
          </span>
        </div>
        <div className="flex gap-4">
          <span className="tui-mono text-[9px] text-tui-text-secondary border-r border-white/10 pr-4">THREADS: <span className="text-terminal-cyan">1,402</span></span>
          <span className="tui-mono text-[9px] text-tui-text-secondary">HANDLES: <span className="text-terminal-cyan">12,450</span></span>
        </div>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full tui-mono text-xs border-collapse">
          <thead>
            <tr className="text-tui-text-secondary border-b border-white/10 opacity-60">
              <th className="text-left py-3 font-bold uppercase tracking-widest text-[10px]">PID</th>
              <th className="text-left py-3 font-bold uppercase tracking-widest text-[10px]">THREAD_ID</th>
              <th className="text-right py-3 font-bold uppercase tracking-widest text-[10px]">CPU_LOAD</th>
              <th className="text-right py-3 font-bold uppercase tracking-widest text-[10px]">MEM_STACK</th>
              <th className="text-center py-3 font-bold uppercase tracking-widest text-[10px]">LIFECYCLE</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {processes.map((p) => (
                <motion.tr 
                  key={p.pid}
                  initial={{ opacity: 0, scale: 0.98, background: 'rgba(0, 255, 65, 0)' }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, x: 20 }}
                  whileHover={{ backgroundColor: 'rgba(0, 255, 65, 0.03)' }}
                  className="border-b border-white/5 transition-all duration-300 group"
                >
                  <td className="py-2.5 text-neon-matrix font-bold opacity-80">{p.pid}</td>
                  <td className="py-2.5 text-tui-text-primary group-hover:text-neon-matrix transition-colors font-medium">{p.name}</td>
                  <td className="py-2.5 text-right font-bold text-neon-matrix">
                    <div className="flex items-center justify-end gap-2">
                       {p.cpu.toFixed(1)}%
                       <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden hidden sm:block">
                          <motion.div 
                            className="h-full bg-neon-matrix" 
                            initial={{ width: 0 }}
                            animate={{ width: `${p.cpu}%` }}
                          />
                       </div>
                    </div>
                  </td>
                  <td className="py-2.5 text-right text-tui-text-secondary italic">{p.mem} MB</td>
                  <td className="py-2.5 text-center">
                    <span className={`px-2 py-0.5 rounded border ${
                      p.status === 'running' 
                        ? 'border-neon-matrix/30 text-neon-matrix bg-neon-matrix/5 shadow-[0_0_10px_rgba(0,255,65,0.1)]' 
                        : 'border-white/10 text-tui-text-secondary bg-white/5 opacity-50'
                    } text-[9px] font-black uppercase tracking-widest`}>
                      {p.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
