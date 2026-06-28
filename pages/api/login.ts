import { NextApiRequest, NextApiResponse } from 'next';
import { getDatabase } from '../../src/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('[AUTH] FATAL: JWT_SECRET environment variable is missing.');
}
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Simple in-memory rate limiter
const loginAttempts = new Map<string, { count: number, lastAttempt: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const clientIp = (req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || 'unknown').split(',')[0];
  const now = Date.now();

  // Clean up old entries periodically (could be more sophisticated, but fine for this scope)
  if (Math.random() < 0.1) {
    for (const [ip, data] of loginAttempts.entries()) {
      if (now - data.lastAttempt > RATE_LIMIT_WINDOW) {
        loginAttempts.delete(ip);
      }
    }
  }

  // Check rate limit
  const attempts = loginAttempts.get(clientIp);
  if (attempts && attempts.count >= MAX_ATTEMPTS && now - attempts.lastAttempt < RATE_LIMIT_WINDOW) {
    const remainingTime = Math.ceil((RATE_LIMIT_WINDOW - (now - attempts.lastAttempt)) / 60000);
    console.warn(`[AUTH] Rate limit exceeded for IP: ${clientIp}. Retrying in ${remainingTime} minutes.`);
    return res.status(429).json({ 
      error: `Too many login attempts. Please try again in ${remainingTime} minutes.` 
    });
  }

  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  try {
    // 1. Try Local SQLite Database first
    const db = getDatabase();
    let user = db.prepare("SELECT * FROM admins WHERE username = ?").get(username) as any;
    
    // 2. If not in SQLite, try Supabase with Service Role (Bypassing RLS)
    if (!user) {
      if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
        console.error(`[AUTH] Service Role Key is missing! Cannot check Supabase admins table with RLS enabled. Please add SUPABASE_SERVICE_ROLE_KEY to secrets.`);
      } else {
        console.log(`[AUTH] User ${username} not in SQLite, checking Supabase with Service Role...`);
        try {
          const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
          const { data: supUser, error: supError } = await supabaseAdmin
            .from('admins')
            .select('*')
            .eq('username', username)
            .maybeSingle();
          
          if (!supError && supUser) {
            console.log(`[AUTH] Found user ${username} in Supabase via Service Role.`);
            user = supUser;
          } else if (supError) {
            console.error(`[AUTH] Supabase query error:`, supError.message);
          }
        } catch (err) {
          console.error(`[AUTH] Failed to initialize Supabase Admin client:`, err);
        }
      }
    }

    if (!user) {
      console.warn(`[AUTH] Login failed: User ${username} not found in any database`);
      
      // Track failed attempt
      const current = loginAttempts.get(clientIp) || { count: 0, lastAttempt: now };
      loginAttempts.set(clientIp, { count: current.count + 1, lastAttempt: now });
      
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    let validPassword = false;
    if (user.password && user.password.startsWith('$2b$')) {
      validPassword = await bcrypt.compare(password, user.password);
    } else {
      // DANGER: Plain text fallback is disabled for security
      console.error(`[AUTH] User ${username} has a non-hashed password. Access denied for security.`);
      validPassword = false;
    }

    if (!validPassword) {
      console.warn(`[AUTH] Login failed: Incorrect password for ${username}`);
      
      // Track failed attempt
      const current = loginAttempts.get(clientIp) || { count: 0, lastAttempt: now };
      loginAttempts.set(clientIp, { count: current.count + 1, lastAttempt: now });
      
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Success! Clear attempts for this IP
    loginAttempts.delete(clientIp);

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role || 'admin' },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    console.log(`[AUTH] ${username} logged in successfully via Next.js API`);
    return res.status(200).json({ 
      token, 
      user: { id: user.id, username: user.username, role: user.role || 'admin' } 
    });
  } catch (err: any) {
    console.error(`[AUTH] Login system error:`, err);
    return res.status(500).json({ error: 'Login system error' });
  }
}
