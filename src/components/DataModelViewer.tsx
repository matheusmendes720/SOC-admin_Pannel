/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { MetricSnapshot } from '../services/metricsService';
import { Database, Info, Layers, Activity } from 'lucide-react';

interface DataModelViewerProps {
  metrics: MetricSnapshot;
}

/**
 * DataModelViewer Component
 * 
 * ARCHITECTURAL PURPOSE:
 * Visualizes the raw, in-memory data structures managed by the MetricsEngine.
 * Demonstrates the "Deep Tuning" of the embedded data model without a traditional DB.
 * 
 * DESIGN:
 * Follows a "Structural Inspection" aesthetic, exposing object keys and 
 * relationship pointers used in the simulation's state synthesis.
 */
export default function DataModelViewer({ metrics }: DataModelViewerProps) {
  return (
    <div className="acrylic-card border-terminal-cyan/10 bg-black/60 p-4 h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-2">
          <Database className="w-3.5 h-3.5 text-terminal-cyan" />
          <span className="text-[10px] uppercase text-terminal-cyan font-bold tracking-[0.2em] glow-text-cyan">
            DATA_MODEL_INSPECTION
          </span>
        </div>
        <Info className="w-3.5 h-3.5 text-white/20" />
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-1">
        {/* Node Metrics Trace */}
        <section className="space-y-2">
          <div className="flex items-center gap-2 border-b border-white/5 pb-1">
            <Layers className="w-3 h-3 text-neon-matrix" />
            <span className="text-[9px] font-bold text-white/60">NODE_TELEMETRY_SNAPSHOT</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="tui-panel-secondary p-2 rounded flex flex-col">
              <span className="text-[8px] text-white/30 uppercase">Latency_Jitter</span>
              <span className="text-[11px] font-mono text-neon-matrix">{metrics.network.jitter.toFixed(2)}ms</span>
            </div>
            <div className="tui-panel-secondary p-2 rounded flex flex-col">
              <span className="text-[8px] text-white/30 uppercase">Packet_Loss</span>
              <span className="text-[11px] font-mono text-petro-orange">{(metrics.network.packetLoss * 100).toFixed(2)}%</span>
            </div>
            <div className="tui-panel-secondary p-2 rounded flex flex-col">
              <span className="text-[8px] text-white/30 uppercase">Cache_Pressure</span>
              <span className="text-[11px] font-mono text-terminal-cyan">{metrics.memory.cachePressure.toFixed(1)}%</span>
            </div>
            <div className="tui-panel-secondary p-2 rounded flex flex-col">
              <span className="text-[8px] text-white/30 uppercase">Swap_Demand</span>
              <span className="text-[11px] font-mono text-white/60">{metrics.memory.swap.toFixed(1)}GB</span>
            </div>
          </div>
        </section>

        {/* Neural Health Breakdown */}
        <section className="space-y-2">
          <div className="flex items-center gap-2 border-b border-white/5 pb-1">
            <Activity className="w-3 h-3 text-terminal-cyan" />
            <span className="text-[9px] font-bold text-white/60">AGENT_NEURAL_STABILITY</span>
          </div>
          <div className="space-y-1.5">
            {metrics.agents.map(agent => (
              <div key={agent.id} className="flex flex-col gap-1">
                <div className="flex justify-between items-center text-[8px] font-mono">
                  <span className="text-white/60">{agent.id}::{agent.name}</span>
                  <span className="text-terminal-cyan">{agent.neuralHealth}%</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${agent.neuralHealth}%` }}
                    className={`h-full ${agent.neuralHealth < 90 ? 'bg-petro-orange' : 'bg-terminal-cyan'}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Algorithm Heuristics */}
        <div className="mt-4 p-2 rounded bg-terminal-cyan/5 border border-terminal-cyan/10">
           <span className="text-[8px] text-terminal-cyan/60 font-mono italic leading-tight block">
             // [ALGO]: Linear Interpolation (LERP) currently synthesizing smoothing deltas at factor 0.3
             <br />
             // [STATE]: Heuristic burst mode is {metrics.network.threatScore > 50 ? 'ENGAGED' : 'QUIESCENT'}
           </span>
        </div>
      </div>
    </div>
  );
}
