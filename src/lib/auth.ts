import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-fallback-only-change-in-production';

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
    const user = jwt.verify(token, JWT_SECRET) as any;
    req.user = user;
    return true;
  } catch (err: any) {
    console.error(`[AUTH] Invalid token for ${req.method} ${req.url}:`, err.message);
    res.status(403).json({ error: 'Session expired or invalid' });
    return false;
  }
}
