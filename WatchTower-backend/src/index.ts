import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import monitorRoutes from './routes/monitor.routes.js';

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





// // 1. User Registration (Simplified for Phase 1)
// app.post('/register', async(req: Request, res: Response) => {
// const {email, password} = req.body;
// try{
//   const result = await pool.query(
//    'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
//    [email, password]
//   );
// res.status(201).json({ message: "User created", user: result.rows[0] });
//   } catch (err: any) {
//     res.status(400).json({ error: err.detail || "Registration failed" });
//   }
// });

// // 2. Add Website Monitor
// app.post('/monitors', async(req: Request, res: Response) => {
//   const {userId, url, interval} = req.body;
// try {
//     const result = await pool.query(
//       'INSERT INTO monitors (user_id, url, check_interval) VALUES ($1, $2, $3) RETURNING *',
//       [userId, url, interval]
//     );
//     res.status(201).json({ message: "Monitor added", monitor: result.rows[0] });
//   } catch (err: any) {
//     res.status(400).json({ error: "Failed to add monitor" });
//   }
// });






