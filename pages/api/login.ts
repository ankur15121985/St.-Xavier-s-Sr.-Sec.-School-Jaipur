import { NextApiRequest, NextApiResponse } from 'next';
import { getDatabase } from '../../src/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-fallback-only-change-in-production';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  try {
    const db = getDatabase();
    const user = db.prepare("SELECT * FROM admins WHERE username = ?").get(username) as any;
    
    if (!user) {
      console.warn(`[AUTH] Login failed: User ${username} not found`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      console.warn(`[AUTH] Login failed: Incorrect password for ${username}`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    console.log(`[AUTH] ${username} logged in successfully via Next.js API`);
    return res.status(200).json({ 
      token, 
      user: { id: user.id, username: user.username, role: user.role } 
    });
  } catch (err: any) {
    console.error(`[AUTH] Login system error:`, err);
    return res.status(500).json({ error: 'Login system error' });
  }
}
