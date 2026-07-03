import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers['authorization'];
  const supabaseToken = authHeader && authHeader.split(' ')[1];

  if (!supabaseToken) {
    return res.status(401).json({ error: 'Supabase session required' });
  }

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return res.status(500).json({ error: 'Supabase not configured on server' });
  }

  try {
    console.log('[AUTH EXCHANGE] Received exchange request for token (first 10 chars):', supabaseToken.substring(0, 10));
    // 1. Verify the token with Supabase
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data: { user }, error } = await supabase.auth.getUser(supabaseToken);

    if (error || !user) {
      console.error('[AUTH EXCHANGE] Supabase getUser error:', error?.message);
      return res.status(401).json({ error: 'Invalid Supabase session', details: error?.message });
    }

    console.log('[AUTH EXCHANGE] User verified:', user.email);

    // 2. Check if user is an admin
    const bootstrapEmail = 'ankur15121985@gmail.com';
    const isAdmin = user.email === bootstrapEmail || user.app_metadata?.role === 'admin';

    if (!isAdmin) {
      return res.status(403).json({ error: 'Not an authorized admin' });
    }

    // 3. Issue our custom JWT
    const token = jwt.sign(
      { id: user.id, username: user.email, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    return res.status(200).json({ 
      token,
      user: {
        id: user.id,
        username: user.email,
        role: 'admin'
      }
    });
  } catch (err: any) {
    console.error('[AUTH EXCHANGE] Error:', err);
    return res.status(500).json({ error: 'Token exchange failed' });
  }
}
