import { type Request, type Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
      [email, hashedPassword]
    );
    const user = result.rows[0];

    // Token generate
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    );

    // ✅ FIX: Added .status().json() after setting cookie to complete the request
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    }).status(201).json({
      message: "User registered successfully",
      user,
      token
    });

  } catch (err: any) {
    res.status(400).json({ error: "Email already exists" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '1d' });
    
    // ✅ FIX: Added .status().json() after setting cookie to complete the request
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    }).status(200).json({
      message: "Logged in successfully",
      token
    });

  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("token");
  res.json({
    message: "Logged out",
  });
};