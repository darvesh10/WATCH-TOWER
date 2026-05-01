import { Redis } from 'ioredis';

// Upstash ke liye TLS (SSL) zaroori hai isliye hum connection string direct use karenge
export const redisConnection = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null, // BullMQ ke liye ye setting zaroori hai
});

redisConnection.on('connect', () => console.log('✅ Connected to Upstash Redis'));
redisConnection.on('error', (err) => console.error('❌ Redis Error:', err));
