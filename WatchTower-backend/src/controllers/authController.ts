import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';

export const register = async (req: any, res: any) => {
  const { email, password } = req.body;
  
  // 1. Password Hashing
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const result = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
      [email, hashedPassword]
    );
    
    // 2. Generate JWT
    const token = jwt.sign({ id: result.rows[0].id }, process.env.JWT_SECRET!, { expiresIn: '1d' });

    // 3. Set Cookie
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.status(201).json({ message: "User created", user: result.rows[0] });
  } catch (err: any) {
    res.status(400).json({ error: "Email already exists" });
  }
};