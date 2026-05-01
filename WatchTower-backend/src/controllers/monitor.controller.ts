import {type Request, type Response } from 'express';
import { pool } from '../config/db.js';
import { addMonitorToQueue } from '../queues/monitor.queue.js';

export const addMonitor = async (req: any, res: Response) => {
  const { url, interval } = req.body;
  const userId = req.user.id; // Automated from Token!

  try {
    const result = await pool.query(
      'INSERT INTO monitors (user_id, url, check_interval) VALUES ($1, $2, $3) RETURNING *',
      [userId, url, interval]
    );
    const monitor = result.rows[0];
    //  MAGIC LINE: BullMQ Queue mein task daal do
    await addMonitorToQueue(monitor.id, monitor.url, monitor.check_interval);

    res.status(201).json({ message: "Monitor added & scheduled", monitor });
  } catch (err) {
    res.status(500).json({ error: "Failed to add monitor" });
  }
};

export const getMyMonitors = async (req: any, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM monitors WHERE user_id = $1', [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed" });
  }
};
