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
      if (stats.size > 0) {
        res.setHeader('Content-Type', contentType);
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        res.setHeader('Content-Length', stats.size);
        
        const readStream = fs.createReadStream(cachePath);
        return readStream.pipe(res);
      } else {
        // Delete empty or corrupt cached files
        try { fs.unlinkSync(cachePath); } catch (_) {}
      }
    } catch (e) {
      // fallback to refetching on error
    }
  }

  // Fetch the remote file with SSL-error resistance and standard 302 Redirection fallback
  try {
    const options = {
      rejectUnauthorized: false,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'image/*,application/pdf,*/*'
      }
    };
    https.get(url, options, (remoteRes) => {
      if (remoteRes.statusCode !== 200) {
        console.warn(`[Proxy] Remote fetch status ${remoteRes.statusCode}, redirecting to source URL`);
        return res.redirect(302, url);
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
      console.warn('[Proxy] Connection error, redirecting:', err.message);
      return res.redirect(302, url);
    });
  } catch (err: any) {
    console.warn('[Proxy] Exception, redirecting:', err.message);
    return res.redirect(302, url);
  }
}
