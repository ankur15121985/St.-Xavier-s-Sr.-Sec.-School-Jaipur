import { NextApiRequest, NextApiResponse } from 'next';
import { getDatabase } from '../../../src/lib/db';

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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { admissionNumber, dob } = req.body;
  console.log(`[TC SEARCH API] Query: ${admissionNumber}, DOB: ${dob}`);
  
  try {
    const db = getDatabase();
    const tc = db.prepare("SELECT * FROM transfer_certificates WHERE admission_number = ? AND dob = ?").get(admissionNumber, dob) as any;
    
    if (tc) {
      console.log(`[TC SEARCH API] Match found for ${admissionNumber}`);
      const optimizedTc = rewriteSupabaseUrls(tc);
      return res.status(200).json(optimizedTc);
    } else {
      console.warn(`[TC SEARCH API] No match for ${admissionNumber} with DOB ${dob}`);
      return res.status(404).json({ error: 'Certificate not found. Please verify details.' });
    }
  } catch (err: any) {
    console.error(`[TC SEARCH ERROR]`, err.message);
    return res.status(500).json({ error: 'Search failed' });
  }
}
