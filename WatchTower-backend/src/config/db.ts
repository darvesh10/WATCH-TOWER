import 'dotenv/config';
import pg from 'pg';
import { log } from 'node:console';



const { Pool } = pg;

//connection pool: way to connection with DB.

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
    rejectUnauthorized: false, // imp for neon db
  },
});

// Test Connection
export const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Connected to Neon PostgreSQL');
    client.release();
  } catch (err) {
    console.error('❌ Database Connection Error:', err);
    process.exit(1); // Agar DB nahi connected, toh app band kar do
  }
};