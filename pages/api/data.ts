import { NextApiRequest, NextApiResponse } from 'next';
import { fetchServerData } from '../../src/lib/db';

// Helper function to recursively rewrite Supabase Storage URLs to point to our media proxy
function rewriteSupabaseUrls(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'string') {
    if (obj.includes('.supabase.co/storage/v1/object/public/')) {
      return `/api/media-proxy?url=${encodeURIComponent(obj)}`;
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => rewriteSupabaseUrls(item));
  }

  if (typeof obj === 'object') {
    const newObj: any = {};
    for (const key of Object.keys(obj)) {
      newObj[key] = rewriteSupabaseUrls(obj[key]);
    }
    return newObj;
  }

  return obj;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');

    const rawData = await fetchServerData();
    const data = rewriteSupabaseUrls(rawData);
    
    return res.status(200).json(data);
  } catch (err: any) {
    console.error('Fetch API route error:', err);
    return res.status(500).json({ error: err.message });
  }
}
