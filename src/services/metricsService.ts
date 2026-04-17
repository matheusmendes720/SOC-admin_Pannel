/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Metrics Service (Mock BFF Layer)
 * This service simulates a Backend-For-Frontend (BFF) layer, managing 
 * complex data structures and recursive algorithms for system telemetry.
 * It provides high-fidelity mock data for CPU, Memory, Network, and Disk states.
 */

export interface MetricSnapshot {
  timestamp: number;
  cpu: number;
  memory: {
    total: number;
    used: number;
    percentage: number;
  };
  network: {
    rx: number; // Receive KB/s
    tx: number; // Transmit KB/s
    activeConnections: number;
  };
  disk: {
    read: number; // MB/s
    write: number; // MB/s
    iowait: number;
  };
  processes: ProcessInfo[];
}

export interface ProcessInfo {
  pid: number;
  name: string;
  cpu: number;
  mem: number;
  status: 'running' | 'sleeping' | 'zombie';
}

/**
 * MetricsEngine Class
 * Implements a singleton-like pattern to maintain state across the static page lifetime.
 * Simulates a serverless background task for metric accumulation.
 */
class MetricsEngine {
  private history: MetricSnapshot[] = [];
  private maxHistory = 60;

  constructor() {
    this.initialize();
  }

  private initialize() {
    // Bootstrap initial history buffer
    for (let i = 0; i < this.maxHistory; i++) {
      this.history.push(this.generateSnapshot(Date.now() - (this.maxHistory - i) * 60000));
    }
  }

  /**
   * Generates a realistic system telemetry snapshot.
   * Uses weighted randomness to simulate bursty system behavior.
   */
  private generateSnapshot(timestamp: number): MetricSnapshot {
    const isBurst = Math.random() > 0.85;
    const cpuBase = isBurst ? 60 : 20;
    
    return {
      timestamp,
      cpu: Math.min(100, cpuBase + Math.floor(Math.random() * 30)),
      memory: {
        total: 16,
        used: 2.4 + (Math.random() * 0.5),
        percentage: 15 + Math.random() * 5
      },
      network: {
        rx: 10 + Math.random() * 200,
        tx: 5 + Math.random() * 50,
        activeConnections: 124 + Math.floor(Math.random() * 10)
      },
      disk: {
        read: 2 + Math.random() * 20,
        write: 1 + Math.random() * 5,
        iowait: Math.random() * 2
      },
      processes: [
        { pid: 1024, name: 'vite-dev', cpu: 12.4, mem: 450, status: 'running' },
        { pid: 2048, name: 'typescript-lsp', cpu: 5.2, mem: 820, status: 'sleeping' },
        { pid: 4096, name: 'chrome-headless', cpu: 25.1, mem: 1200, status: 'running' }
      ]
    };
  }

  /**
   * Tick function simulates a data refresh from a BFF endpoint.
   */
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
