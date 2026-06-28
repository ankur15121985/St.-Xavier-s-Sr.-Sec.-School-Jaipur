import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('[AUTH] FATAL: JWT_SECRET environment variable is missing.');
}

export interface AuthenticatedRequest extends NextApiRequest {
  user?: {
    id: string;
    username: string;
    role: string;
  };
}

export function authenticateToken(req: AuthenticatedRequest, res: NextApiResponse): boolean {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.warn(`[AUTH] Missing token for ${req.method} ${req.url}`);
    res.status(401).json({ error: 'Authentication required' });
    return false;
  }

  try {
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET not configured');
    }
    const user = jwt.verify(token, JWT_SECRET) as any;
    req.user = user;
    return true;
  } catch (err: any) {
    console.error(`[AUTH] Invalid token for ${req.method} ${req.url}:`, err.message);
    if (err.message === 'JWT_SECRET not configured') {
      res.status(500).json({ error: 'Server authentication misconfigured' });
    } else {
      res.status(403).json({ error: 'Session expired or invalid' });
    }
    return false;
  }
}
