import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';

const JWT_SECRET = process.env.JWT_SECRET || 'st-xaviers-school-default-secure-secret-change-me';
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

export interface AuthenticatedRequest extends NextApiRequest {
  user?: {
    id: string;
    username: string;
    role: string;
  };
}

export async function authenticateToken(req: AuthenticatedRequest, res: NextApiResponse): Promise<boolean> {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token || token === 'null' || token === 'undefined') {
    console.warn(`[AUTH] Missing token for ${req.method} ${req.url}`);
    res.status(401).json({ error: 'Authentication required. Please login again.' });
    return false;
  }

  // 1. Try custom JWT (Fast, no network)
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    return true;
  } catch (err: any) {
    // If it's a JWT error, maybe it's actually a Supabase token?
    // Let's try verifying with Supabase if we have config
    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      try {
        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        const { data: { user }, error } = await supabase.auth.getUser(token);
        
        if (!error && user) {
          const bootstrapEmail = 'ankur15121985@gmail.com';
          const isAdmin = user.email === bootstrapEmail || user.app_metadata?.role === 'admin';
          
          if (isAdmin) {
            req.user = {
              id: user.id,
              username: user.email || 'admin',
              role: 'admin'
            };
            return true;
          }
        }
      } catch (sbErr) {
        console.error('[AUTH] Supabase fallback verification failed:', sbErr);
      }
    }

    console.error(`[AUTH] Token validation failed for ${req.method} ${req.url}:`, err.message);
    const isExpired = err.message?.includes('expired');
    res.status(403).json({ 
      error: isExpired ? 'Session expired. Please logout and login again.' : 'Invalid session. Please login again.',
      details: err.message 
    });
    return false;
  }
}
