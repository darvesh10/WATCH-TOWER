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
      // 1. Website ping
      const response = await axios.get(url, { timeout: 10000 });

      const responseTimeMs = Date.now() - startTime;
      const responseTimeSec = responseTimeMs / 1000;

      // ✅ PROMETHEUS METRICS (SUCCESS)
      monitorStatusCounter.inc({
        url,
        status_code: response.status,
        result: "up",
      });

      responseTimeHistogram.observe(
        { url },
        responseTimeSec
      );

      // 2. Database update
      await pool.query(
        "UPDATE monitors SET last_status = $1, last_checked = NOW() WHERE id = $2",
        [response.status, monitorId]
      );

      console.log(
        `✅ ${url} is UP (${response.status}) - ${responseTimeMs}ms`
      );

    } catch (error:any) {
      const status = error.response?.status || 500;

      // ❌ PROMETHEUS METRICS (FAILURE)
      monitorStatusCounter.inc({
        url,
        status_code: status,
        result: "down",
      });

      // 3. Database update
      await pool.query(
        "UPDATE monitors SET last_status = $1, last_checked = NOW() WHERE id = $2",
        [status, monitorId]
      );

      // 4. Discord alert
      if (status !== 200) {
        await sendDiscordAlert(
          `🚨 ALERT: ${url} is DOWN! Status: ${status}`
        );
      }

      console.log(`❌ ${url} is DOWN (${status})`);
    }
  },
  { connection: redisConnection }
);

// Worker failure listener
monitorWorker.on("failed", (job, err) => {
  console.error(`🚨 Job failed for ${job?.id}: ${err.message}`);
});