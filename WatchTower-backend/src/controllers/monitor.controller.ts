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


export const deleteMonitor = async (req: any, res: Response) => {
  const monitorId = req.params.id;

  try {
    await pool.query(
      "DELETE FROM monitors WHERE id = $1 AND user_id = $2",
      [monitorId, req.user.id]
    );

    res.json({
      message: "Monitor deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: "Failed to delete monitor",
    });
  }
};