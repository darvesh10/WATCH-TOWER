import { Worker } from "bullmq";
import axios from "axios";
import { redisConnection } from "../config/redis.js";
import { pool } from "../config/db.js";
import { sendDiscordAlert } from "../utils/alert.js";

export const monitorWorker = new Worker(
  "monitor-requests", // Wahi naam jo Queue ka hai
  async (job) => {
    const { monitorId, url } = job.data;
    console.log(`🔍 Checking website: ${url}`);

    const startTime = Date.now();
    try {
      // 1. Asli Ping (Request)
      const response = await axios.get(url, { timeout: 10000 }); // 10s timeout
      const responseTime = Date.now() - startTime;

      // 2. Database Update (Success)
      await pool.query(
        "UPDATE monitors SET last_status = $1, last_checked = NOW() WHERE id = $2",
        [response.status, monitorId],
      );

      console.log(`✅ ${url} is UP (${response.status}) - ${responseTime}ms`);
    } catch (error: any) {
      // 3. Database Update (Failure)
      const status = error.response?.status || 500;
      await pool.query(
        "UPDATE monitors SET last_status = $1, last_checked = NOW() WHERE id = $2",
        [status, monitorId],
      );

      // We check for !status.toString().startsWith('2') to be safe,
      // though inside a catch block, it's usually already a non-200 status.
      if (status !== 200) {
        await sendDiscordAlert(`🚨 ALERT: ${url} is DOWN! Status: ${status}`);
      }
      console.log(`❌ ${url} is DOWN (${status})`);
      // Phase 4 mein hum yahan Alert trigger karenge!
    }
  },
  { connection: redisConnection },
);

monitorWorker.on("failed", (job, err) => {
  console.error(`🚨 Job failed for ${job?.id}: ${err.message}`);
});
