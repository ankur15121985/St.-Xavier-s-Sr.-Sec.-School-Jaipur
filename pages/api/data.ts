import { NextApiRequest, NextApiResponse } from 'next';
import { fetchServerData } from '../../src/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');

    const data = await fetchServerData();
    return res.status(200).json(data);
  } catch (err: any) {
    console.error('Fetch API route error:', err);
    return res.status(500).json({ error: err.message });
  }
}
