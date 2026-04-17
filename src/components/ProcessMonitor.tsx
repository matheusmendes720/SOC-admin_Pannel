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
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="tui-card mt-4 border-tui-border bg-black/20 flex-1">
      <div className="flex items-center justify-between mb-4">
        <span className="tui-sidebar-title flex items-center gap-2">
          <ListFilter className="w-3 h-3" /> System Process Monitor
        </span>
        <div className="flex gap-2">
          <span className="tui-mono text-[9px] text-tui-text-secondary">THREADS: 1,402</span>
          <span className="tui-mono text-[9px] text-tui-text-secondary">HANDLES: 12,450</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full tui-mono text-xs border-collapse">
          <thead>
            <tr className="text-tui-text-secondary border-b border-tui-border">
              <th className="text-left py-2 font-normal uppercase tracking-tighter">PID</th>
              <th className="text-left py-2 font-normal uppercase tracking-tighter">NAME</th>
              <th className="text-right py-2 font-normal uppercase tracking-tighter">CPU%</th>
              <th className="text-right py-2 font-normal uppercase tracking-tighter">MEM (MB)</th>
              <th className="text-center py-2 font-normal uppercase tracking-tighter">STATUS</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {processes.map((p) => (
                <motion.tr 
                  key={p.pid}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="border-b border-tui-border/30 hover:bg-tui-cyan/5 transition-colors group"
                >
                  <td className="py-2 text-tui-cyan opacity-80">{p.pid}</td>
                  <td className="py-2 text-tui-text-primary group-hover:text-tui-cyan transition-colors">{p.name}</td>
                  <td className="py-2 text-right text-tui-green">{p.cpu.toFixed(1)}</td>
                  <td className="py-2 text-right text-tui-text-secondary">{p.mem}</td>
                  <td className="py-2 text-center">
                    <span className={`px-1.5 py-0.5 rounded-sm text-[9px] font-bold ${
                      p.status === 'running' ? 'bg-tui-green/20 text-tui-green' : 'bg-tui-text-secondary/20 text-tui-text-secondary'
                    }`}>
                      {p.status.toUpperCase()}
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
