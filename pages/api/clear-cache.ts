import { NextApiRequest, NextApiResponse } from 'next';
import { fetchServerData } from '../../src/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Calling fetchServerData(true) forces a bypass of the cache and refills it
    await fetchServerData(true);
    return res.status(200).json({ 
      success: true, 
      message: 'Cache cleared and data re-fetched from Supabase successfully.',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}
