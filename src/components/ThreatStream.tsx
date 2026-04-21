/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { ThreatEvent } from '../services/metricsService';
import { Radio, AlertTriangle, ShieldX } from 'lucide-react';

interface ThreatStreamProps {
  events: ThreatEvent[];
}

/**
 * ThreatStream Component
 * 
 * ARCHITECTURAL ROLE:
 * High-Volume Event Ingest Buffer. This component provides high-density, raw 
 * visibility into the absolute state changes of the simulation's event loop. 
 * 
 * DESIGN PATTERN:
 * Log-Style Vertical Reactive Feed. Utilizes a reverse-chronological list 
 * focusing on immediate data triage and unformatted telemetry ingestion.
 * 
 * DATA MAPPING:
 * Directly consumes the `threatStream` array, translating raw event objects 
 * into glowing, severity-coded visual primitives using AnimatePresence for 
 * real-time entry deltas.
 */
export default function ThreatStream({ events }: ThreatStreamProps) {
  return (
    <div className="acrylic-card border-red-500/20 bg-red-950/5 h-full flex flex-col p-3 overflow-hidden">
      <div className="flex items-center justify-between mb-4 border-b border-red-500/10 pb-2 shrink-0">
        <div className="flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
          <span className="text-[10px] uppercase text-red-500 font-bold tracking-[0.2em] glow-text-red">
            RAW_THREAT_INGESTION
          </span>
        </div>
        <div className="px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/20">
          <span className="text-[8px] text-red-400 font-mono">LIVE_STREAM</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
        <AnimatePresence initial={false}>
          {events.slice().reverse().map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: 20, backgroundColor: 'rgba(239, 68, 68, 0.2)' }}
              animate={{ opacity: 1, x: 0, backgroundColor: 'rgba(239, 68, 68, 0.03)' }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-2 border border-red-500/10 rounded flex flex-col gap-1.5 group hover:border-red-500/30 transition-all cursor-crosshair"
            >
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-mono text-white/40">{event.id}</span>
                <span className={`text-[8px] px-1 rounded ${
                  event.severity === 'CRITICAL' ? 'bg-red-500 text-white' : 'bg-petro-orange text-black'
                } font-black`}>
                  {event.severity}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <AlertTriangle className={`w-3 h-3 ${event.severity === 'CRITICAL' ? 'text-red-500' : 'text-petro-orange'}`} />
                <span className="text-[10px] text-white/90 font-bold truncate leading-none">
                  {event.type}
                </span>
              </div>

              <div className="flex justify-between items-center px-1 py-0.5 bg-black/40 rounded border border-white/5">
                <span className="text-[9px] font-mono text-white/40">SRC: {event.source}</span>
                <ShieldX className="w-2.5 h-2.5 text-red-500/50" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-3 pt-2 border-t border-red-500/10">
        <div className="flex justify-between items-center opacity-40">
           <span className="text-[8px] font-mono text-red-400 uppercase">Axe-Guard Filter: Active</span>
           <div className="flex gap-0.5">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="w-1 h-1 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
