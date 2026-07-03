import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';

const JWT_SECRET = process.env.JWT_SECRET || 'st-xaviers-school-default-secure-secret-change-me';

const cleanSupabaseUrl = (url?: string): string => {
  if (!url) return '';
  const trimmed = url.trim();
  try {
    const urlObj = new URL(trimmed);
    return `${urlObj.protocol}//${urlObj.host}`;
  } catch (e) {
    return trimmed.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
  }
};

const SUPABASE_URL = cleanSupabaseUrl(process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL);
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

export interface AuthenticatedRequest extends NextApiRequest {
  user?: {
    id: string;
    username: string;
    role: string;
  };
}

export async function authenticateToken(req: AuthenticatedRequest, res: NextApiResponse): Promise<boolean> {
  console.log(`[AUTH] Authenticating ${req.method} ${req.url}...`);
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn('[AUTH] Supabase environment variables are missing on the server!');
  }

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token || token === 'null' || token === 'undefined' || token === '') {
    console.warn(`[AUTH] Missing or invalid token for ${req.method} ${req.url}`);
    res.status(401).json({ error: 'Authentication required. Please login again.' });
    return false;
  }

  console.log(`[AUTH] Token length: ${token.length}. First 10 chars: ${token.substring(0, 10)}`);

  // 1. Try custom JWT (Fast, no network)
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    console.log(`[AUTH] Custom JWT verified for user: ${decoded.username}`);
    req.user = decoded;
    return true;
  } catch (err: any) {
    console.log(`[AUTH] Custom JWT verification failed: ${err.message}. Trying Supabase fallback...`);
    // If it's a JWT error, maybe it's actually a Supabase token?
    // Let's try verifying with Supabase if we have config
    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      try {
        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        const { data: { user }, error } = await supabase.auth.getUser(token);
        
        if (!error && user) {
          console.log(`[AUTH] Supabase token verified for user: ${user.email}`);
          const bootstrapEmail = 'ankur15121985@gmail.com';
          const isAdmin = user.email === bootstrapEmail || user.app_metadata?.role === 'admin';
          
          if (isAdmin) {
            console.log('[AUTH] User is an authorized admin.');
            req.user = {
              id: user.id,
              username: user.email || 'admin',
              role: 'admin'
            };
            return true;
          } else {
            console.warn(`[AUTH] User ${user.email} is NOT an admin.`);
          }
        } else if (error) {
          console.error('[AUTH] Supabase getUser error:', error.message);
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
