import {type Request, type Response } from 'express';
import { pool } from '../config/db.js';
import { addMonitorToQueue } from '../queues/monitor.queue.js';


export const addMonitor = async (req: any, res: Response) => {
  // Interval ko destructure karte waqt default 60000 (1 min) rakho
  const { url, interval = 60000 } = req.body;
  const userId = req.user.id; 

  try {
    // DB mein interval save ho raha hai (ms mein)
    const result = await pool.query(
      'INSERT INTO monitors (user_id, url, check_interval) VALUES ($1, $2, $3) RETURNING *',
      [userId, url, interval]
    );
    
    const monitor = result.rows[0];

    // BullMQ Queue mein task bhej rahe hain
    // Yaad rakhna: addMonitorToQueue ke andar ab sirf 'interval' pass hoga, multiply nahi
    await addMonitorToQueue(monitor.id, monitor.url, monitor.check_interval);

    res.status(201).json({ message: "Monitor added & scheduled", monitor });
  } catch (err) {
    console.error("Add Monitor Error:", err);
    res.status(500).json({ error: "Failed to add monitor" });
  }
};

export const getMyMonitors = async (req: any, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM monitors WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed" });
  }
};


import { monitorQueue } from '../queues/monitor.queue.js'; 

export const deleteMonitor = async (req: any, res: Response) => {
  const monitorId = req.params.id;

  try {
    // 1. Delete from PostgreSQL
    const result = await pool.query(
      "DELETE FROM monitors WHERE id = $1 AND user_id = $2 RETURNING *",
      [monitorId, req.user.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Monitor not found or unauthorized" });
    }

    // 2. Fetch all repeatable jobs from Redis
    const repeatableJobs = await monitorQueue.getRepeatableJobs();
    
    // 🔥 FIX: Find the job by its exact NAME, not ID. 
    const jobToRemove = repeatableJobs.find(job => job.name === `monitor-${monitorId}`);
    
    if (jobToRemove) {
      // Remove it using its unique BullMQ key
      await monitorQueue.removeRepeatableByKey(jobToRemove.key);
      console.log(`🗑️ Stopped monitoring: Job ${monitorId} successfully removed from Queue`);
    } else {
      console.log(`⚠️ Warning: Job monitor-${monitorId} was not found in the BullMQ queue.`);
    }

    res.json({ message: "Monitor and background task deleted successfully" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ error: "Failed to delete monitor" });
  }
};