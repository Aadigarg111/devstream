const express = require('express');
const WebSocket = require('ws');
const si = require('systeminformation');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static('public'));

// Store historical data
const history = {
  cpu: [],
  mem: [],
  network: { in: [], out: [] }
};

const MAX_HISTORY = 60;

// Get system stats
async function getSystemStats() {
  try {
    const [cpu, mem, fsSize, currentLoad, osInfo, processes, networkStats, diskIO] = await Promise.all([
      si.cpu(),
      si.mem(),
      si.fsSize(),
      si.currentLoad(),
      si.osInfo(),
      si.processes(),
      si.networkStats(),
      si.disksIO()
    ]);

    const uptime = si.time();
    
    // Get top processes
    const topProcs = processes.list
      .sort((a, b) => b.cpu - a.cpu)
      .slice(0, 10)
      .map(p => ({
        pid: p.pid,
        name: p.name,
        cpu: p.cpu.toFixed(1),
        mem: p.mem.toFixed(1),
        memMB: (p.memRss / 1024).toFixed(1)
      }));

    // Update history
    history.cpu.push(currentLoad.currentLoad);
    history.mem.push((mem.used / mem.total) * 100);
    
    if (history.cpu.length > MAX_HISTORY) history.cpu.shift();
    if (history.mem.length > MAX_HISTORY) history.mem.shift();

    const netStat = networkStats[0] || {};
    
    return {
      cpu: {
        model: cpu.manufacturer + ' ' + cpu.brand,
        cores: cpu.cores,
        physicalCores: cpu.physicalCores,
        usage: currentLoad.currentLoad.toFixed(2),
        usageUser: currentLoad.currentLoadUser.toFixed(2),
        usageSystem: currentLoad.currentLoadSystem.toFixed(2)
      },
      memory: {
        total: (mem.total / 1024 / 1024 / 1024).toFixed(1),
        used: (mem.used / 1024 / 1024 / 1024).toFixed(1),
        free: (mem.free / 1024 / 1024 / 1024).toFixed(1),
        percentage: ((mem.used / mem.total) * 100).toFixed(1)
      },
      storage: {
        total: (fsSize[0].size / 1024 / 1024 / 1024).toFixed(1),
        used: (fsSize[0].used / 1024 / 1024 / 1024).toFixed(1),
        available: (fsSize[0].available / 1024 / 1024 / 1024).toFixed(1),
        percentage: fsSize[0].use.toFixed(1)
      },
      network: {
        interface: netStat.iface || 'ens5',
        rx: (netStat.rx_sec / 1024).toFixed(1),
        tx: (netStat.tx_sec / 1024).toFixed(1),
        rxTotal: (netStat.rx_bytes / 1024 / 1024 / 1024).toFixed(2),
        txTotal: (netStat.tx_bytes / 1024 / 1024 / 1024).toFixed(2)
      },
      system: {
        hostname: osInfo.hostname,
        platform: osInfo.platform,
        distro: osInfo.distro,
        kernel: osInfo.kernel,
        uptime: formatUptime(uptime.uptime)
      },
      processes: {
        all: processes.all,
        running: processes.running,
        blocked: processes.blocked,
        sleeping: processes.sleeping,
        top: topProcs
      },
      history: history,
      diskIO: {
        read: (diskIO.rIO_sec / 1024).toFixed(1),
        write: (diskIO.wIO_sec / 1024).toFixed(1)
      }
    };
  } catch (error) {
    console.error('Error getting stats:', error);
    return null;
  }
}

function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  return `${days}d ${hours}h ${mins}m`;
}

// WebSocket connection
wss.on('connection', (ws) => {
  console.log('Client connected');
  
  const interval = setInterval(async () => {
    const stats = await getSystemStats();
    if (stats && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(stats));
    }
  }, 1000);

  ws.on('close', () => {
    console.log('Client disconnected');
    clearInterval(interval);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server dashboard running on http://localhost:${PORT}`);
});
