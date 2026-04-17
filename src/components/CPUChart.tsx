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

/**
 * CPUChart Component
 * Visualizes CPU load telemetry data fetched from the internal MetricsEngine.
 * Implements a sliding window visualization of the last 60 minutes of activity.
 */
export default function CPUChart() {
  const [data, setData] = useState(() => 
    metricsService.getHistory().map((snap, idx) => ({
      time: `${59 - idx}m ago`,
      usage: snap.cpu
    }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const latest = metricsService.tick();
      setData(prevData => {
        const newData = prevData.slice(1).map((item, idx) => ({
          ...item,
          time: `${59 - idx}m ago`
        }));
        
        newData.push({
          time: '0m ago',
          usage: latest.cpu
        });
        
        return newData;
      });
    }, 5000); // Faster updates for visual feedback (5s)

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-[200px] mt-4 tui-card border-tui-border bg-black/40">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] uppercase text-tui-text-secondary tracking-widest pl-1">CPU Load History (60m)</span>
        <div className="flex gap-2 pr-1">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-tui-cyan shadow-[0_0_5px_rgba(0,210,255,0.5)]"></div>
            <span className="text-[9px] uppercase text-tui-text-secondary">Primary</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          <defs>
            <linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00d2ff" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#00d2ff" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke="#2d2e32" 
          />
          <XAxis 
            dataKey="time" 
            hide 
          />
          <YAxis 
            domain={[0, 100]} 
            tick={{ fill: '#8b8d98', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#141518', 
              border: '1px solid #2d2e32',
              borderRadius: '4px',
              fontFamily: 'JetBrains Mono',
              fontSize: '10px',
              color: '#e1e1e6'
            }}
            itemStyle={{ color: '#00d2ff' }}
            cursor={{ stroke: '#00d2ff', strokeWidth: 1 }}
          />
          <Area 
            type="monotone" 
            dataKey="usage" 
            stroke="#00d2ff" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#usageGradient)" 
            isAnimationActive={true}
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
