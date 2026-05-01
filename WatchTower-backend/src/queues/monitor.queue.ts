import { Queue } from 'bullmq';
import { redisConnection } from '../config/redis.js';

export const monitorQueue = new Queue('monitor-requests', {
  connection: redisConnection,
});

// Ek helper function jo job add karega
export const addMonitorToQueue = async (monitorId: string, url: string, interval: number) => {
  await monitorQueue.add(
    `monitor-${monitorId}`, 
    { monitorId, url },
    {
      repeat: {
        every: interval * 1000, // BullMQ milliseconds leta hai
      },
      jobId: monitorId, // Unique ID taaki jobs overlap na ho
    }
  );
};
