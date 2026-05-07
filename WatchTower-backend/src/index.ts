import 'dotenv/config';
import express from 'express';
import cors from "cors";
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import monitorRoutes from './routes/monitor.routes.js';
import './workers/monitor.worker.js';
import { client } from './config/metrics.js';

const app = express();
connectDB();

app.use(
  cors({
    origin: "http://localhost:3002",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// User Routes 
app.use('/api/auth', authRoutes);

//Monitor Routes

app.use('/api/monitors', monitorRoutes);

// Prometheus Metrics Endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});




const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));





