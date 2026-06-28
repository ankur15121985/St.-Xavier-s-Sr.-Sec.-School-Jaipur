import { NextApiRequest, NextApiResponse } from 'next';
import { fetchServerData, getDatabase } from '../../src/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 1. Fetch current content_updated_at value representing current database version
    let lastUpdated = '2026-06-15T00:00:00.000Z';
    try {
      const db = getDatabase();
      const row = db.prepare("SELECT value FROM content WHERE key = 'content_updated_at'").get() as any;
      if (row && row.value) {
        lastUpdated = row.value;
      }
    } catch (e) {}

    // Let the ETag be a unique hash/string identifier of the database version
    const etag = `W/"school-data-${encodeURIComponent(lastUpdated)}"`;

    const { force } = req.query;

    // 2. Validate If-None-Match header for HTTP 304 Not Modified
    const ifNoneMatch = req.headers['if-none-match'];
    if (ifNoneMatch === etag && force !== 'true') {
      res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=600');
      res.setHeader('ETag', etag);
      return res.status(304).end(); // 304 response sends exactly 0 bytes body, completely bypassing egress!
    }

    // 3. Fetch consolidated site data (uses server-side memory cache if TTL is valid)
    const data = await fetchServerData(force === 'true');

    // 4. Set modern CDN-friendly caching tags
    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=600');
    res.setHeader('ETag', etag);

    return res.status(200).json(data);
  } catch (err: any) {
    console.error('Fetch API route error:', err);
    return res.status(500).json({ error: err.message });
  }
}
