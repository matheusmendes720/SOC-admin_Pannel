/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReactNode } from 'react';
import { motion } from 'motion/react';
import { metricsService, MetricsConfig } from '../services/metricsService';
import { Sliders, ShieldAlert, Zap, Globe } from 'lucide-react';

interface MetricsControllersProps {
  config: MetricsConfig;
  onChange: (config: Partial<MetricsConfig>) => void;
}

/**
 * MetricsControllers Component
 * 
 * ARCHITECTURAL ROLE:
 * Simulation Hyperparameter Orchestrator. This component provides the primary 
 * "Steering UI" for the serverless algorithms residing in the MetricsEngine. 
 * 
 * DESIGN PATTERN:
 * Controller Grid. Uses high-contrast sliders and status-aware toggle buttons 
 * to manipulate state across the global simulation context.
 * 
 * DATA MAPPING:
 * Directly mutates the `MetricsConfig` properties (Sensitivity, Threshold, Speed). 
 * These mutations trigger immediate algorithmic shifts in the `generateSnapshot` 
 * heuristic loop, changing the frequency and severity of mock data output.
 */
export default function MetricsControllers({ config, onChange }: MetricsControllersProps) {
  return (
    <div className="flex flex-col gap-6 p-2">
      <div className="space-y-4">
        <span className="text-[10px] uppercase text-tui-text-secondary font-bold tracking-[0.2em] flex items-center gap-2">
          <Sliders className="w-3 h-3 text-neon-matrix" /> Simulation_Conduit
        </span>
        
        {/* Sensitivity Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-mono">
            <span className="text-white/60">SENSITIVITY</span>
            <span className="text-neon-matrix">{config.sensitivity}%</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={config.sensitivity}
            onChange={(e) => onChange({ sensitivity: parseInt(e.target.value) })}
            className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-neon-matrix"
          />
        </div>

        {/* Threshold Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-mono">
            <span className="text-white/60">THREAT_FLOOR</span>
            <span className="text-petro-orange">{config.threshold}ms</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={config.threshold}
            onChange={(e) => onChange({ threshold: parseInt(e.target.value) })}
            className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-petro-orange"
          />
        </div>

        {/* Lifecycle Speed Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-mono">
            <span className="text-white/60">ORCH_SPEED</span>
            <span className="text-terminal-cyan">{config.lifecycleSpeed}x</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="10" 
            value={config.lifecycleSpeed}
            onChange={(e) => onChange({ lifecycleSpeed: parseInt(e.target.value) })}
            className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-terminal-cyan"
          />
        </div>
      </div>

      <div className="space-y-3">
        <span className="text-[10px] uppercase text-tui-text-secondary font-bold tracking-[0.2em]">Protocol_Toggles</span>
        
        <ControlButton 
          label="REALTIME_SYNC" 
          active={config.realTimeMode} 
          onClick={() => onChange({ realTimeMode: !config.realTimeMode })}
          icon={<Globe className="w-3 h-3" />}
        />
        
        <ControlButton 
          label="AGENT_BURST" 
          active={config.agentCount > 4} 
          onClick={() => onChange({ agentCount: config.agentCount > 4 ? 4 : 8 })}
          icon={<Zap className="w-3 h-3" />}
        />
        
        <ControlButton 
          label="HARDEN_IO" 
          active={false} 
          onClick={() => {}}
          icon={<ShieldAlert className="w-3 h-3" />}
        />
      </div>

      {/* Agent Status Monitor */}
      <div className="mt-4 acrylic-card border-white/5 bg-white/5 p-3">
        <span className="text-[9px] uppercase text-tui-text-secondary font-bold mb-2 block">Agentic_Health</span>
        <div className="grid grid-cols-4 gap-1">
          {[1,2,3,4].map(i => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className={`w-full h-1 rounded-full ${config.realTimeMode ? 'bg-neon-matrix' : 'bg-white/10'} opacity-50 shadow-[0_0_5px_currentColor]`}></div>
              <span className="text-[8px] text-white/40">A{i}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ControlButton({ label, active, onClick, icon }: { label: string; active: boolean; onClick: () => void; icon: ReactNode }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full py-2 px-3 rounded border transition-all duration-300 flex items-center justify-between group ${
        active 
          ? 'bg-neon-matrix/10 border-neon-matrix/30 text-neon-matrix' 
          : 'bg-white/5 border-white/10 text-tui-text-secondary hover:border-white/20'
      }`}
    >
      <div className="flex items-center gap-2">
        <div className={active ? 'animate-pulse' : ''}>{icon}</div>
        <span className="text-[10px] font-mono tracking-tighter">{label}</span>
      </div>
      <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-neon-matrix shadow-[0_0_8px_#00FF41]' : 'bg-white/10'}`} />
    </button>
  );
}
