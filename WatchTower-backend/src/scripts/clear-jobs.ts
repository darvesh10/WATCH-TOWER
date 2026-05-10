import "dotenv/config";
import { monitorQueue } from "../queues/monitor.queue.js";

async function clearJobs() {
  const jobs = await monitorQueue.getRepeatableJobs();

  for (const job of jobs) {
    await monitorQueue.removeRepeatableByKey(job.key);

    console.log(`Deleted: ${job.name}`);
  }

  process.exit(0);
}

clearJobs();