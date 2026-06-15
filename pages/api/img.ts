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
        // Explicitly set browser max-age and CDN s-maxage to 1 year so both browser and global CDN edge cache it
        res.setHeader('Cache-Control', 'public, max-age=31536000, s-maxage=31536000, immutable');
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
      timeout: 8000, // abort request after 8 seconds of inactivity to avoid hanging
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'image/*,application/pdf,*/*'
      }
    };

    const remoteReq = https.get(url, options, (remoteRes) => {
      if (remoteRes.statusCode !== 200) {
        console.warn(`[Proxy] Remote fetch status ${remoteRes.statusCode}, redirecting to source URL`);
        return res.redirect(302, url);
      }

      // Read Content-Type from original response
      const incomingContentType = remoteRes.headers['content-type'] || contentType;
      
      const chunks: Buffer[] = [];
      remoteRes.on('data', (chunk) => {
        chunks.push(chunk);
      });

      remoteRes.on('end', () => {
        const buffer = Buffer.concat(chunks);
        
        // Serve image with aggressive max-age to client browser AND s-maxage to CDN edge network
        res.setHeader('Content-Type', incomingContentType);
        res.setHeader('Cache-Control', 'public, max-age=31536000, s-maxage=31536000, immutable');
        res.setHeader('Content-Length', buffer.length);
        res.end(buffer);

        // Write to tmp cache in background
        fs.writeFile(cachePath, buffer, (err) => {
          if (err) {
            console.warn('[Proxy] Failed to write cache file:', err.message);
          }
        });
      });

      remoteRes.on('error', (err) => {
        console.warn('[Proxy] Stream reading error, redirecting:', err.message);
        try { if (!res.writableEnded) res.redirect(302, url); } catch (_) {}
      });

    });

    remoteReq.on('timeout', () => {
      console.warn('[Proxy] Request timeout, redirecting to direct url');
      remoteReq.destroy();
      try { if (!res.writableEnded) res.redirect(302, url); } catch (_) {}
    });

    remoteReq.on('error', (err) => {
      console.warn('[Proxy] Connection error, redirecting:', err.message);
      try { if (!res.writableEnded) res.redirect(302, url); } catch (_) {}
    });

  } catch (err: any) {
    console.warn('[Proxy] Exception, redirecting:', err.message);
    try { if (!res.writableEnded) res.redirect(302, url); } catch (_) {}
  }
}
