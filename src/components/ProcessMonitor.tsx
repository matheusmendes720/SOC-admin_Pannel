/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { metricsService, SecurityAgent } from '../services/metricsService';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Zap } from 'lucide-react';

/**
 * AgentActivityMonitor Component
 * 
 * ARCHITECTURAL ROLE:
 * Agentic Swarm Activity Heartbeat. This specialized monitor replaces traditional
 * OS process tracking with simulation-specific agent telemetry. It provides 
 * high-fidelity visibility into the "Compute Load" of specific serverless-like 
 * agentic entities.
 * 
 * DESIGN PATTERN:
 * TUI Heartbeat Table. Uses a persistent grid layout with status-aware 
 * indicators and load-balancing bars.
 * 
 * DATA MAPPING:
 * Directly maps the `SecurityAgent` registry from the simulation data model, 
 * providing a tabular view of coordination and resource utilization.
 */
export default function ProcessMonitor() {
  const [agents, setAgents] = useState<SecurityAgent[]>([]);

  useEffect(() => {
    const update = () => {
      const snap = metricsService.tick();
      setAgents(snap.agents);
    };
    update();
    const interval = setInterval(update, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="acrylic-card mt-4 border-neon-matrix/10 bg-black/40 flex-1 shadow-[0_0_25px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-neon-matrix/10 rounded border border-neon-matrix/20">
            <ShieldCheck className="w-3 h-3 text-neon-matrix" />
          </div>
          <span className="text-[10px] uppercase text-neon-matrix font-bold tracking-[0.3em] glow-text-green">
            AGENTIC_SWARM_HEARTBEAT
          </span>
        </div>
        <div className="flex gap-4">
          <span className="tui-mono text-[9px] text-tui-text-secondary border-r border-white/10 pr-4">SWARM_SYNC: <span className="text-terminal-cyan">ACTIVE</span></span>
          <span className="tui-mono text-[9px] text-tui-text-secondary">LATENCY: <span className="text-terminal-cyan">0.4ms</span></span>
        </div>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full tui-mono text-xs border-collapse">
          <thead>
            <tr className="text-tui-text-secondary border-b border-white/10 opacity-60">
              <th className="text-left py-3 font-bold uppercase tracking-widest text-[10px]">AGENT_UID</th>
              <th className="text-left py-3 font-bold uppercase tracking-widest text-[10px]">DESIGNATION</th>
              <th className="text-right py-3 font-bold uppercase tracking-widest text-[10px]">COMPUTE_LOAD</th>
              <th className="text-right py-3 font-bold uppercase tracking-widest text-[10px]">TYPE</th>
              <th className="text-center py-3 font-bold uppercase tracking-widest text-[10px]">DIRECTIVE</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {agents.map((agent) => (
                <motion.tr 
                  key={agent.id}
                  initial={{ opacity: 0, scale: 0.98, backgroundColor: 'rgba(0, 255, 65, 0)' }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, x: 20 }}
                  whileHover={{ backgroundColor: 'rgba(0, 255, 65, 0.03)' }}
                  className="border-b border-white/5 transition-all duration-300 group"
                >
                  <td className="py-2.5 text-neon-matrix font-bold opacity-80">{agent.id}</td>
                  <td className="py-2.5 text-tui-text-primary group-hover:text-neon-matrix transition-colors font-medium">{agent.name}</td>
                  <td className="py-2.5 text-right font-bold text-neon-matrix">
                    <div className="flex items-center justify-end gap-2">
                       {agent.load.toFixed(1)}%
                       <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden hidden sm:block">
                          <motion.div 
                            className={`h-full ${agent.status === 'MITIGATING' ? 'bg-red-500' : 'bg-neon-matrix'}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${agent.load}%` }}
                          />
                       </div>
                    </div>
                  </td>
                  <td className="py-2.5 text-right text-tui-text-secondary italic">{agent.type}</td>
                  <td className="py-2.5 text-center">
                    <span className={`px-2 py-0.5 rounded border ${
                      agent.status === 'MITIGATING' 
                        ? 'border-red-500/30 text-red-500 bg-red-500/5 shadow-[0_0_10px_rgba(239,68,68,0.1)]' 
                        : 'border-neon-matrix/30 text-neon-matrix bg-neon-matrix/5 shadow-[0_0_10px_rgba(0,255,65,0.1)]'
                    } text-[9px] font-black uppercase tracking-widest`}>
                      {agent.status}
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
