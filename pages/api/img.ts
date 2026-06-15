import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import https from 'https';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query;
  if (!url || typeof url !== 'string') {
    return res.status(400).end('URL is required');
  }

  // Validate that the request domain is our Supabase host to prevent arbitrary proxying
  if (!url.includes('.supabase.co') && !url.startsWith('https://')) {
    return res.status(400).end('Only Supabase media proxy allowed');
  }

  // Calculate local safe filename hash to cache in /tmp
  const hash = Buffer.from(url).toString('base64url');
  const cachePath = path.join('/tmp', `proxy-${hash}`);

  // Determine content type based on the source URL extension
  let contentType = 'image/png';
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.endsWith('.webp')) contentType = 'image/webp';
  else if (lowerUrl.endsWith('.jpg') || lowerUrl.endsWith('.jpeg')) contentType = 'image/jpeg';
  else if (lowerUrl.endsWith('.gif')) contentType = 'image/gif';
  else if (lowerUrl.endsWith('.svg')) contentType = 'image/svg+xml';
  else if (lowerUrl.endsWith('.pdf')) contentType = 'application/pdf';

  // Check if cache exists in filesystem
  if (fs.existsSync(cachePath)) {
    try {
      const stats = fs.statSync(cachePath);
      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      res.setHeader('Content-Length', stats.size);
      
      const readStream = fs.createReadStream(cachePath);
      return readStream.pipe(res);
    } catch (e) {
      // fallback to refetching on error
    }
  }

  // Fetch the remote file
  try {
    https.get(url, (remoteRes) => {
      if (remoteRes.statusCode !== 200) {
        res.status(remoteRes.statusCode || 500).end();
        return;
      }

      // Read Content-Type from original response
      const incomingContentType = remoteRes.headers['content-type'] || contentType;
      res.setHeader('Content-Type', incomingContentType);
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

      // Create a write stream to /tmp cache
      const fileStream = fs.createWriteStream(cachePath);
      
      // Pipe original stream to both client response AND file cache
      remoteRes.pipe(fileStream);
      remoteRes.pipe(res);

    }).on('error', (err) => {
      res.status(500).end('Proxy error: ' + err.message);
    });
  } catch (err: any) {
    res.status(500).end(err.message);
  }
}
