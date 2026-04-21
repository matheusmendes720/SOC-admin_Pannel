/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { metricsService } from '../services/metricsService';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { Activity } from 'lucide-react';

interface CPUChartProps {
  usage: number;
}

/**
 * CPUChart Component
 * 
 * ARCHITECTURAL ROLE:
 * Real-time Historical Time-Series Visualizer. This component implements a local
 * sliding-window buffer to display the last 60 minutes of CPU load telemetry
 * derived from the `MetricSnapshot.cpu` synthesized by the BFF MetricsEngine.
 * 
 * DESIGN PATTERN:
 * High-Density Glow-Tech aesthetic utilizing Recharts Area gradients and 
 * neon-matrix stroke variables to represent infrastructure pressure.
 */
export default function CPUChart({ usage }: CPUChartProps) {
  const [data, setData] = useState(() => 
    metricsService.getHistory().map((snap, idx) => ({
      time: `${59 - idx}m ago`,
      usage: snap.cpu
    }))
  );

  useEffect(() => {
    setData(prevData => {
      const newData = prevData.slice(1).map((item, idx) => ({
        ...item,
        time: `${59 - idx}m ago`
      }));
      
      newData.push({
        time: '0m ago',
        usage: usage
      });
      
      return newData;
    });
  }, [usage]);

  return (
    <div className="w-full h-full acrylic-card border-neon-matrix/20 bg-black/60 shadow-[0_0_20px_rgba(0,255,65,0.05)] flex flex-col p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-neon-matrix animate-pulse" />
          <span className="text-[10px] uppercase text-neon-matrix font-bold tracking-[0.2em] pl-1 glow-text-green">
            CPU_LOAD_TELEMETRY_STREAM
          </span>
        </div>
        <div className="flex gap-4 pr-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-neon-matrix shadow-[0_0_8px_#00FF41] animate-pulse"></div>
            <span className="text-[9px] uppercase text-tui-text-secondary tracking-widest font-bold">L1_CACHING</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          <defs>
            <linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00FF41" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#00FF41" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke="rgba(0, 255, 65, 0.1)" 
          />
          <XAxis 
            dataKey="time" 
            hide 
          />
          <YAxis 
            domain={[0, 100]} 
            tick={{ fill: 'rgba(0, 255, 65, 0.5)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(10, 10, 10, 0.9)', 
              border: '1px solid rgba(0, 255, 65, 0.3)',
              borderRadius: '8px',
              fontFamily: 'JetBrains Mono',
              fontSize: '11px',
              color: '#00FF41',
              boxShadow: '0 0 15px rgba(0, 255, 65, 0.2)'
            }}
            itemStyle={{ color: '#00FF41' }}
            cursor={{ stroke: '#00FF41', strokeWidth: 1, strokeDasharray: '5 5' }}
          />
          <Area 
            type="monotone" 
            dataKey="usage" 
            stroke="#00FF41" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#usageGradient)" 
            isAnimationActive={true}
            animationDuration={1000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
