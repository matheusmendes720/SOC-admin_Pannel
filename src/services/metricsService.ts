/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Enhanced Security Metrics Service (Multi-Agentic SOC Simulation)
 * Manages complex cybersecurity data structures, threat heuristic simulations,
 * and multi-agent coordination states. Provides a high-density telemetry stream
 * for incident response and real-time anomaly detection.
 */

export type ThreatLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type AgentStatus = 'POLLING' | 'ANALYZING' | 'MITIGATING' | 'IDLE';

export interface SecurityAgent {
  id: string;
  name: string;
  type: 'DLP' | 'NETWORK' | 'ENDPOINT' | 'HEURISTIC';
  status: AgentStatus;
  load: number;
  lastDetection: string | null;
}

export interface SecurityIncident {
  id: string;
  timestamp: string;
  type: 'SQL_INJECTION' | 'BRUTE_FORCE' | 'DLP_LEAK' | 'MALWARE_PHONING' | 'UNAUTHORIZED_ACCESS';
  severity: ThreatLevel;
  source: string;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED';
  summary: string;
}

export interface SecurityKPI {
  label: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  color: 'matrix' | 'orange' | 'cyan' | 'red';
}

export interface MetricSnapshot {
  timestamp: number;
  cpu: number;
  memory: {
    total: number;
    used: number;
    percentage: number;
  };
  network: {
    rx: number; 
    tx: number; 
    activeConnections: number;
    threatScore: number;
  };
  disk: {
    read: number; 
    write: number; 
    iowait: number;
    entropy: number; // For Ransomware detection simulation
  };
  agents: SecurityAgent[];
  incidents: SecurityIncident[];
  kpis: SecurityKPI[];
  threatsHistory: { time: string; count: number }[];
}

export interface MetricsConfig {
  sensitivity: number; // 0-100
  threshold: number;   // 0-100
  agentCount: number;
  realTimeMode: boolean;
}

class MetricsEngine {
  private history: MetricSnapshot[] = [];
  private maxHistory = 60;
  private config: MetricsConfig = {
    sensitivity: 45,
    threshold: 75,
    agentCount: 4,
    realTimeMode: true
  };

  private threats: string[] = [
    'CVE-2026-XSS: Reflected bypass attempt',
    'DLP_TRIGGER: Binary blob detected in egress',
    'ANOMALY: High entropy sequence in /var/db',
    'NET_FLOW: Packet spike from unknown orbital ASN',
    'AGENT_SIG: Credential harvesting pattern match'
  ];

  constructor() {
    this.initialize();
  }

  private initialize() {
    for (let i = 0; i < this.maxHistory; i++) {
      this.history.push(this.generateSnapshot(Date.now() - (this.maxHistory - i) * 60000));
    }
  }

  public setConfig(newConfig: Partial<MetricsConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  public getConfig() {
    return { ...this.config };
  }

  private generateSnapshot(timestamp: number): MetricSnapshot {
    const { sensitivity, threshold } = this.config;
    const isBurst = Math.random() * 100 < sensitivity;
    
    const cpuBase = isBurst ? 70 : 15;
    const threatScoreBase = isBurst ? 80 : 10;

    const agents: SecurityAgent[] = [
      { id: 'A1', name: 'Matrix-Scanner', type: 'ENDPOINT', status: isBurst ? 'ANALYZING' : 'POLLING', load: 15 + Math.random() * 80, lastDetection: isBurst ? 'L1-MALWARE' : null },
      { id: 'A2', name: 'Petro-Firewall', type: 'NETWORK', status: isBurst ? 'MITIGATING' : 'POLLING', load: 10 + Math.random() * 70, lastDetection: null },
      { id: 'A3', name: 'Void-Watcher', type: 'HEURISTIC', status: 'IDLE', load: 5, lastDetection: null },
      { id: 'A4', name: 'Bit-Sense', type: 'DLP', status: 'POLLING', load: 30, lastDetection: 'EGRESS-OVERFLOW' }
    ];

    const incidentTypes: SecurityIncident['type'][] = ['SQL_INJECTION', 'BRUTE_FORCE', 'DLP_LEAK', 'MALWARE_PHONING', 'UNAUTHORIZED_ACCESS'];
    const incidents: SecurityIncident[] = isBurst ? [{
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      type: incidentTypes[Math.floor(Math.random() * incidentTypes.length)],
      severity: isBurst ? 'CRITICAL' : 'LOW',
      source: '185.22.x.x',
      status: 'OPEN',
      summary: this.threats[Math.floor(Math.random() * this.threats.length)]
    }] : [];

    return {
      timestamp,
      cpu: Math.min(100, cpuBase + Math.floor(Math.random() * 20)),
      memory: {
        total: 16,
        used: 4.2 + (Math.random() * 2.5),
        percentage: 30 + Math.random() * 15
      },
      network: {
        rx: 10 + Math.random() * 1500,
        tx: 5 + Math.random() * 800,
        activeConnections: 1200 + Math.floor(Math.random() * 500),
        threatScore: Math.min(100, threatScoreBase + Math.random() * 20)
      },
      disk: {
        read: 10 + Math.random() * 100,
        write: 5 + Math.random() * 40,
        iowait: Math.random() * sensitivity / 10,
        entropy: 0.2 + Math.random() * 0.7
      },
      agents,
      incidents,
      kpis: [
        { label: 'THREATS_DET', value: isBurst ? 142 : 12, trend: 'up', color: isBurst ? 'red' : 'matrix' },
        { label: 'MTTR', value: 4.2, trend: 'down', color: 'cyan' },
        { label: 'MIT_RATE', value: 98.4, trend: 'stable', color: 'matrix' }
      ],
      threatsHistory: Array.from({ length: 12 }, (_, j) => ({
        time: `${12 - j}h`,
        count: Math.floor(Math.random() * threshold)
      }))
    };
  }

  public tick(): MetricSnapshot {
    const next = this.generateSnapshot(Date.now());
    this.history.push(next);
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }
    return next;
  }

  public getHistory() {
    return [...this.history];
  }
}

export const metricsService = new MetricsEngine();
