/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { SOCLifecyclePhase } from '../services/metricsService';
import { 
  Eye, 
  Search, 
  ListFilter, 
  BarChart2, 
  ShieldAlert, 
  RotateCcw, 
  Crosshair, 
  CheckCircle2 
} from 'lucide-react';

interface SOCLifecycleStageProps {
  currentPhase: SOCLifecyclePhase;
}

const PHASES: { id: SOCLifecyclePhase; label: string; icon: any; color: string }[] = [
  { id: 'MONITOR', label: 'MONITOR', icon: Eye, color: 'text-terminal-cyan' },
  { id: 'DETECT', label: 'DETECT', icon: Search, color: 'text-red-400' },
  { id: 'TRIAGE_L1', label: 'TRIAGE_L1', icon: ListFilter, color: 'text-petro-orange' },
  { id: 'ANALYSIS_L2', label: 'ANALYSIS_L2', icon: BarChart2, color: 'text-white' },
  { id: 'RESPONSE_L3', label: 'RESPONSE_L3', icon: ShieldAlert, color: 'text-red-500' },
  { id: 'RECOVERY', label: 'RECOVERY', icon: RotateCcw, color: 'text-neon-matrix' },
  { id: 'HUNT', label: 'HUNTING', icon: Crosshair, color: 'text-terminal-cyan' },
  { id: 'LESSONS_LEARNT', label: 'LESSONS', icon: CheckCircle2, color: 'text-neon-matrix' }
];

/**
 * SOCLifecycleStage Component
 * 
 * DESIGN PATTERN: Sequential Deterministic State Machine.
 * Visualizes the propagation of security events through the standard 8-stage 
 * SOC lifecycle. Utilizes Framer Motion's layout inheritance (layoutId) to
 * animate the "active cursor" across the temporal axis.
 * 
 * ARCHITECTURAL ROLE:
 * Acts as the primary "Progressive Viewport" into the simulation's current 
 * algorithm state, tying backend stage progression to frontend visual status.
 */
export default function SOCLifecycleStage({ currentPhase }: SOCLifecycleStageProps) {
  const activeIdx = PHASES.findIndex(p => p.id === currentPhase);

  return (
    <div className="acrylic-card border-white/5 bg-black/40 p-2 shrink-0 h-full">
      <div className="flex justify-between items-center h-full px-2 gap-1">
        {PHASES.map((phase, i) => {
          const isActive = i === activeIdx;
          const isPast = i < activeIdx;
          const Icon = phase.icon;

          return (
            <div key={phase.id} className="flex-1 flex flex-col items-center gap-1.5 px-1 relative">
              {/* Connection Line */}
              {i < PHASES.length - 1 && (
                <div className="absolute top-4 left-[50%] w-full h-[1px] bg-white/5 z-0" />
              )}
              {i < PHASES.length - 1 && isPast && (
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  className="absolute top-4 left-[50%] h-[1px] bg-neon-matrix/30 z-1" 
                />
              )}

              <motion.div
                animate={{ 
                  scale: isActive ? 1.1 : 1,
                  backgroundColor: isActive ? 'rgba(0, 255, 65, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                  borderColor: isActive ? 'var(--color-neon-matrix)' : isPast ? 'rgba(0, 255, 65, 0.3)' : 'rgba(255, 255, 255, 0.1)'
                }}
                className={`w-8 h-8 rounded border flex items-center justify-center relative z-10 transition-colors ${phase.color}`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'animate-pulse' : 'opacity-60'}`} />
                {isActive && (
                  <motion.div
                    layoutId="phase-glow"
                    className="absolute inset-0 bg-neon-matrix/20 blur-md rounded-full pointer-events-none"
                  />
                )}
              </motion.div>

              <div className="flex flex-col items-center select-none">
                 <span className={`text-[8px] font-black tracking-tighter transition-colors ${
                   isActive ? 'text-white' : isPast ? 'text-white/40' : 'text-white/10'
                 }`}>
                   {phase.label}
                 </span>
                 {isActive && (
                    <motion.div 
                      layoutId="active-dot" 
                      className="w-1 h-1 bg-neon-matrix rounded-full mt-0.5 shadow-[0_0_5px_#00FF41]" 
                    />
                 )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
