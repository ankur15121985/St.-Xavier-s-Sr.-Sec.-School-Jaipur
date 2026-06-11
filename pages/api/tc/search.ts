import { NextApiRequest, NextApiResponse } from 'next';
import { getDatabase } from '../../../src/lib/db';

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
      return res.status(200).json(tc);
    } else {
      console.warn(`[TC SEARCH API] No match for ${admissionNumber} with DOB ${dob}`);
      return res.status(404).json({ error: 'Certificate not found. Please verify details.' });
    }
  } catch (err: any) {
    console.error(`[TC SEARCH ERROR]`, err.message);
    return res.status(500).json({ error: 'Search failed' });
  }
}
