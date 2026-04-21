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
import { Globe } from 'lucide-react';

interface NetworkTrafficChartProps {
  rx: number;
  tx: number;
}

/**
 * NetworkTrafficChart Component
 * 
 * ARCHITECTURAL ROLE:
 * Dual-Channel Network Throughput Tracker. This component visualizes the binary 
 * flow (RX/TX) of network telemetry metrics synthesized by the MetricsEngine.
 * 
 * DESIGN PATTERN:
 * Ingress/Egress Glow-Tech. Uses contrasting color variables (Cyan vs Orange) 
 * to visually separate downstream from upstream data intensity.
 * 
 * DATA MAPPING:
 * Directly maps the `network.rx` and `network.tx` historical streams into a 
 * synchronized AreaChart for volumetric analysis.
 */
export default function NetworkTrafficChart({ rx, tx }: NetworkTrafficChartProps) {
  const [data, setData] = useState(() => 
    metricsService.getHistory().map((snap, idx) => ({
      time: `${59 - idx}m ago`,
      rx: snap.network.rx,
      tx: snap.network.tx
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
        rx: rx,
        tx: tx
      });
      
      return newData;
    });
  }, [rx, tx]);

  return (
    <div className="w-full h-full acrylic-card border-terminal-cyan/20 bg-black/60 shadow-[0_0_20px_rgba(0,255,255,0.05)] flex flex-col p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-terminal-cyan animate-pulse" />
          <span className="text-[10px] uppercase text-terminal-cyan font-bold tracking-[0.2em] pl-1 glow-text-cyan">
            NETWORK_TRAFFIC_TELEMETRY
          </span>
        </div>
        <div className="flex gap-4 pr-1">
          <div className="flex items-center gap-2">
            <span className="text-[9px] uppercase text-terminal-cyan tracking-widest font-bold">RX_TRAFFIC</span>
            <span className="text-[9px] uppercase text-petro-orange tracking-widest font-bold ml-2">TX_TRAFFIC</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          <defs>
            <linearGradient id="rxGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00FFFF" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#00FFFF" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="txGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FF6200" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#FF6200" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke="rgba(0, 255, 255, 0.05)" 
          />
          <XAxis 
            dataKey="time" 
            hide 
          />
          <YAxis 
            tick={{ fill: 'rgba(0, 255, 255, 0.5)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(10, 10, 10, 0.9)', 
              border: '1px solid rgba(0, 255, 255, 0.3)',
              borderRadius: '8px',
              fontFamily: 'JetBrains Mono',
              fontSize: '11px',
              color: '#00FFFF',
              boxShadow: '0 0 15px rgba(0, 255, 255, 0.2)'
            }}
            itemStyle={{ fontSize: '10px' }}
            cursor={{ stroke: '#00FFFF', strokeWidth: 1, strokeDasharray: '5 5' }}
          />
          <Area 
            type="monotone" 
            dataKey="rx" 
            stroke="#00FFFF" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#rxGradient)" 
            isAnimationActive={true}
          />
          <Area 
            type="monotone" 
            dataKey="tx" 
            stroke="#FF6200" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#txGradient)" 
            isAnimationActive={true}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
