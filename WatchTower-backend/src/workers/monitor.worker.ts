import { Worker } from "bullmq";
import axios from "axios";
import { redisConnection } from "../config/redis.js";
import { pool } from "../config/db.js";
import { sendDiscordAlert } from "../utils/alert.js";
import { monitorStatusCounter, responseTimeHistogram } from "../config/metrics.js";

export const monitorWorker = new Worker(
  "monitor-requests",
  async (job) => {
    const { monitorId, url } = job.data;

    console.log(`🔍 Checking website: ${url}`);

   const startTime = Date.now();

    try {
      const response = await axios.get(url, { timeout: 10000 });
      const responseTimeMs = Date.now() - startTime;
      const responseTimeSec = responseTimeMs / 1000;

      // ✅ Metrics
      monitorStatusCounter.inc({ url, status_code: response.status, result: "up" });
      responseTimeHistogram.observe({ url }, responseTimeSec);

      // 2. Database update (Added last_response_time)
      await pool.query(
        "UPDATE monitors SET last_status = $1, last_checked = NOW(), last_response_time = $2 WHERE id = $3",
        [response.status, responseTimeMs, monitorId]
      );

      console.log(`✅ ${url} is UP (${response.status}) - ${responseTimeMs}ms`);

    } catch (error: any) {
      const responseTimeMs = Date.now() - startTime; // Still track time on failure
      const status = error.response?.status || 500;

      // ❌ Metrics
      monitorStatusCounter.inc({ url, status_code: status, result: "down" });

      // 3. Database update (Added last_response_time)
      await pool.query(
        "UPDATE monitors SET last_status = $1, last_checked = NOW(), last_response_time = $2 WHERE id = $3",
        [status, responseTimeMs, monitorId]
      );

      if (status !== 200) {
        await sendDiscordAlert(`🚨 ALERT: ${url} is DOWN! Status: ${status}`);
      }

      console.log(`❌ ${url} is DOWN (${status}) - ${responseTimeMs}ms`);
    }
  },
  { connection: redisConnection }
);