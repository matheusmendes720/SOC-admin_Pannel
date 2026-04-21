/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
  CartesianGrid
} from 'recharts';
import { Shield, Radar, Zap, Clock, Activity, AlertCircle } from 'lucide-react';
import { ThreatEvent } from '../services/metricsService';

interface SecurityAnalyticsProps {
  threatData: { time: string; count: number }[];
  threatScore: number;
  threatStream: ThreatEvent[];
}

/**
 * SecurityAnalytics Component
 * 
 * ARCHITECTURAL ROLE:
 * Multi-Dimensional Threat Heuristics Visualizer. This is a high-density "Bento Widget"
 * that synthesizes three distinct views: temporal density (BarChart), entropy 
 * distribution (ScatterPlot), and a chronological event stream (Timeline).
 * 
 * DESIGN PATTERN:
 * Pro-Grade Bento Intelligence. Uses precise geometric stacks to communicate
 * advanced metadata (Packet Entropy, Chronology) in a singular viewport.
 * 
 * DATA MAPPING:
 * Aggregates `threatsHistory`, `network.threatScore`, and the live `threatStream` 
 * to provide a 360-degree observability layer for the SOC simulation.
 */
export default function SecurityAnalytics({ threatData, threatScore, threatStream }: SecurityAnalyticsProps) {
  // Memoize scatter data to prevent "flickering" during re-renders
  const scatterData = useMemo(() => Array.from({ length: 24 }, (_, i) => ({
    id: `pkt-${i}`,
    x: 10 + Math.random() * 1490, 
    y: 0.1 + Math.random() * 0.8,  
    z: 50 + Math.random() * 250   
  })), []);

  return (
    <div className="flex flex-col gap-4 h-full min-h-0">
      {/* Top Section: Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[60%] shrink-0">
        {/* Threat Distribution Bar Chart */}
        <div className="acrylic-card border-petro-orange/20 h-full flex flex-col p-3 overflow-hidden">
          <div className="flex items-center justify-between mb-2 shrink-0">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-petro-orange animate-pulse" />
              <span className="text-[10px] uppercase text-petro-orange font-bold tracking-[0.2em] glow-text-orange">
                THREAT_DISTRIBUTION
              </span>
            </div>
            <span className="text-[10px] text-white/40 font-mono">12H_SPAN</span>
          </div>
          
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart data={threatData}>
                <XAxis dataKey="time" hide />
                <Tooltip 
                  cursor={{ fill: 'rgba(255, 98, 0, 0.05)' }}
                  contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #FF6200', borderRadius: '8px', fontSize: '10px' }}
                />
                <Bar dataKey="count" radius={[2, 2, 0, 0]}>
                  {threatData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.count > 50 ? '#FF6200' : '#00FF41'} 
                      fillOpacity={0.6}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Packet Inspection Scatter Plot */}
        <div className="acrylic-card border-terminal-cyan/20 h-full flex flex-col p-3 overflow-hidden">
          <div className="flex items-center justify-between mb-2 shrink-0">
            <div className="flex items-center gap-2">
              <Radar className="w-4 h-4 text-terminal-cyan" />
              <span className="text-[10px] uppercase text-terminal-cyan font-bold tracking-[0.2em] glow-text-cyan">
                PACKET_ENTROPY
              </span>
            </div>
            <div className="flex items-center gap-1">
               <span className="text-[9px] text-white/40 uppercase">Mode:</span>
               <span className="text-terminal-cyan text-[10px] font-bold tracking-tighter">SIG_ALPHA</span>
            </div>
          </div>

          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <ScatterChart margin={{ top: 10, right: 0, bottom: 0, left: -40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 255, 255, 0.05)" />
                <XAxis type="number" dataKey="x" name="Size" unit="kb" hide />
                <YAxis type="number" dataKey="y" name="Entropy" hide />
                <ZAxis type="number" dataKey="z" range={[50, 400]} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="Packets" data={scatterData} fill="#00FFFF" fillOpacity={0.3} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Section: Chronological Timeline */}
      <div className="acrylic-card border-white/5 bg-deep-void/20 flex-1 min-h-0 flex flex-col p-3 overflow-hidden">
        <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2 shrink-0">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-neon-matrix" />
            <span className="text-[10px] uppercase text-tui-text-secondary font-bold tracking-[0.2em]">
              CHRONO_THREAT_TIMELINE
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-neon-matrix animate-ping" />
            <span className="text-[8px] text-white/30 font-mono tracking-widest uppercase">REALTIME_INGEST</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
          <div className="relative border-l border-white/10 ml-2 pl-4 space-y-3 py-1">
            <AnimatePresence initial={false}>
              {threatStream.slice().reverse().map((event, idx) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="relative"
                >
                  {/* Timeline Dot */}
                  <div className={`absolute -left-[21px] top-1 w-2 h-2 rounded-full border-2 border-tui-bg ${
                    event.severity === 'CRITICAL' ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 
                    event.severity === 'HIGH' ? 'bg-petro-orange' : 'bg-neon-matrix'
                  }`} />
                  
                  <div className="flex flex-col gap-1 hover:bg-white/5 p-1 rounded transition-colors group">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono text-white/40">{new Date(event.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                        <span className={`text-[10px] font-bold ${
                          event.severity === 'CRITICAL' ? 'text-red-400' : 
                          event.severity === 'HIGH' ? 'text-petro-orange' : 'text-neon-matrix'
                        }`}>
                          {event.type}
                        </span>
                      </div>
                      <span className={`text-[8px] font-black px-1 rounded ${
                        event.severity === 'CRITICAL' ? 'bg-red-500 text-white' : 
                        event.severity === 'HIGH' ? 'bg-petro-orange text-black' : 'bg-neon-matrix/10 text-neon-matrix'
                      }`}>
                        {event.severity}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] text-white/20 font-mono uppercase tracking-tighter truncate max-w-[120px]">
                        ID: {event.id}
                      </span>
                      <span className="text-[8px] text-white/40 font-mono truncate">
                        SRC: {event.source}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
