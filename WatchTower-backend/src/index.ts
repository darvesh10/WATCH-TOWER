import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import monitorRoutes from './routes/monitor.routes.js';
import './workers/monitor.worker.js';

const app = express();
connectDB();

app.use(express.json());
app.use(cookieParser());

// User Routes 
app.use('/api/auth', authRoutes);

//Monitor Routes

app.use('/api/monitors', monitorRoutes);


const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));





