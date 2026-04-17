/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
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
import { Shield, Radar, Zap } from 'lucide-react';

interface SecurityAnalyticsProps {
  threatData: { time: string; count: number }[];
  threatScore: number;
}

/**
 * SecurityAnalytics Component
 * Provides various chart types (Bar, Scatter) for multi-dimensional data visualization.
 * Focuses on threat distributions and packet-level inspection simulation.
 */
export default function SecurityAnalytics({ threatData, threatScore }: SecurityAnalyticsProps) {
  // Mock scatter data for "Packet Entropy vs. Payload Size"
  const scatterData = Array.from({ length: 20 }, () => ({
    x: Math.random() * 1500, // Payload size
    y: Math.random() * 1.0,  // Entropy
    z: Math.random() * 100   // Threat intensity
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Threat Distribution Bar Chart */}
      <div className="acrylic-card border-petro-orange/20 min-h-[220px]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-petro-orange animate-pulse" />
            <span className="text-[10px] uppercase text-petro-orange font-bold tracking-[0.2em] glow-text-orange">
              THREAT_DISTRIBUTION_VECTOR
            </span>
          </div>
          <span className="text-[10px] text-white/40 font-mono">12H_SPAN</span>
        </div>
        
        <ResponsiveContainer width="100%" height={140}>
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

      {/* Packet Inspection Scatter Plot */}
      <div className="acrylic-card border-terminal-cyan/20 min-h-[220px]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Radar className="w-4 h-4 text-terminal-cyan" />
            <span className="text-[10px] uppercase text-terminal-cyan font-bold tracking-[0.2em] glow-text-cyan">
              PACKET_ENTROPY_ANALYSIS
            </span>
          </div>
          <div className="flex items-center gap-1">
             <span className="text-[9px] text-white/40 uppercase">Current:</span>
             <span className="text-terminal-cyan text-[10px] font-bold">ALPHA_SIG</span>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={140}>
          <ScatterChart margin={{ top: 20, right: 0, bottom: 0, left: -40 }}>
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
  );
}
