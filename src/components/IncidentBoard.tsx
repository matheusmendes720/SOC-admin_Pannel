/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { SecurityIncident, SecurityAgent } from '../services/metricsService';
import { AlertCircle, Terminal, UserCheck, ShieldOff } from 'lucide-react';

interface IncidentBoardProps {
  incidents: SecurityIncident[];
  agents: SecurityAgent[];
}

/**
 * IncidentBoard Component
 * 
 * ARCHITECTURAL ROLE:
 * Real-time Multi-Agent Orchestration Observer. Acts as the primary display for 
 * the async `incidents` buffer and the `agents` registry. It translates the 
 * internal status of isolated serverless-like agents into a human-readable 
 * mission board.
 * 
 * DESIGN PATTERN:
 * Split Bento Detail Panel focusing on high-severity alerting (left) and 
 * agent resource/status telemetry (right).
 */
export default function IncidentBoard({ incidents, agents }: IncidentBoardProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 h-full">
      {/* Live Alerts List */}
      <div className="xl:col-span-2 acrylic-card border-neon-matrix/10 bg-black/40 flex flex-col p-3">
        <div className="flex items-center gap-2 mb-3 border-b border-white/5 pb-2">
          <AlertCircle className="w-4 h-4 text-petro-orange animate-pulse" />
          <span className="text-[10px] uppercase text-tui-text-secondary font-bold tracking-[0.2em]">
            ACTIVE_SECURITY_INCIDENTS
          </span>
        </div>

        <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
          <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-2">
          <AnimatePresence mode="popLayout">
            {incidents.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[10px] text-neon-matrix/40 py-8 text-center hacker-font uppercase tracking-widest"
              >
                // NO_THREATS_DETECTED_IN_CURRENT_BUFFER //
              </motion.div>
            ) : (
              incidents.map(inc => (
                <motion.div
                  key={inc.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`p-3 rounded-lg border flex gap-4 items-start ${
                    inc.severity === 'CRITICAL' ? 'bg-red-500/10 border-red-500/30' : 'bg-petro-orange/5 border-petro-orange/20'
                  }`}
                >
                  <div className={`p-2 rounded-md ${inc.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-500' : 'bg-petro-orange/20 text-petro-orange'}`}>
                    <ShieldOff className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-white font-bold text-xs">{inc.type}</span>
                      <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border ${
                        inc.severity === 'CRITICAL' ? 'bg-red-500/20 border-red-500/30 text-red-400' : 'bg-petro-orange/20 border-petro-orange/30 text-petro-orange'
                      }`}>
                        {inc.severity}
                      </span>
                    </div>
                    <p className="text-[10px] text-tui-text-secondary leading-relaxed mb-2 uppercase opacity-80">{inc.summary}</p>
                    <div className="flex justify-between text-[9px] font-mono text-white/30 italic">
                      <span>SRC: {inc.source}</span>
                      <span>{new Date(inc.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>

    {/* Multi-Agentic Sync Status */}
      <div className="acrylic-card border-terminal-cyan/10 bg-black/40 p-3 h-full overflow-hidden flex flex-col">
        <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
          <UserCheck className="w-4 h-4 text-terminal-cyan" />
          <span className="text-[10px] uppercase text-tui-text-secondary font-bold tracking-[0.2em]">
            AGENT_COORDINATION
          </span>
        </div>

        <div className="space-y-4">
          {agents.map(agent => (
            <div key={agent.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${agent.status === 'MITIGATING' ? 'bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]' : 'bg-neon-matrix shadow-[0_0_8px_#00FF41]'}`} />
                  <span className="text-[10px] text-white/80 font-bold tracking-tight">{agent.name}</span>
                </div>
                <span className={`text-[9px] font-mono ${agent.status === 'MITIGATING' ? 'text-red-400' : 'text-neon-matrix/60'}`}>
                  {agent.status}
                </span>
              </div>
              
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                   className={`h-full ${agent.status === 'MITIGATING' ? 'bg-red-500' : 'bg-terminal-cyan'}`}
                   initial={{ width: 0 }}
                   animate={{ width: `${agent.load}%` }}
                   transition={{ type: 'spring', damping: 20 }}
                />
              </div>
              
              {agent.lastDetection && (
                <div className="flex items-center gap-1.5 text-[8px] text-petro-orange/80 uppercase italic px-1 pt-1">
                  <Terminal className="w-2.5 h-2.5" />
                  DET: {agent.lastDetection}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
