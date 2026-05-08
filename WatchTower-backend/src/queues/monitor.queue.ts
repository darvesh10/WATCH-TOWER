import { Queue } from 'bullmq';
import { redisConnection } from '../config/redis.js';

export const monitorQueue = new Queue('monitor-requests', {
  connection: redisConnection,
});

// Ek helper function jo job add karega
// src/queues/monitor.queue.ts
export const addMonitorToQueue = async (monitorId: string, url: string, interval: number) => {
  await monitorQueue.add(
    `monitor-${monitorId}`, 
    { monitorId, url },
    {
      repeat: {
        every: interval, // 🔥 YAHAN SE "* 1000" HATA DIYA
      },
      jobId: monitorId,
    }
  );
};