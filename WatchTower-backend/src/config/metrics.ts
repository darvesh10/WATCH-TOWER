import client from 'prom-client';

// 1. Default metrics (CPU, Memory usage monitor karne ke liye)
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

// 2. Custom Metric: Uptime track karne ke liye
export const monitorStatusCounter = new client.Counter({
  name: 'monitor_check_total',
  help: 'Total number of website checks',
  labelNames: ['url', 'status_code', 'result'], // Result: 'up' or 'down'
});

// 3. Custom Metric: Response time track karne ke liye
export const responseTimeHistogram = new client.Histogram({
  name: 'monitor_response_time_seconds',
  help: 'Response time of monitored websites',
  labelNames: ['url'],
  buckets: [0.1, 0.5, 1, 2, 5], // 100ms se 5s tak ke buckets
});

export { client };
