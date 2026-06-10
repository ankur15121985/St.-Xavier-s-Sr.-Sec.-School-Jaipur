import { NextApiRequest, NextApiResponse } from 'next';
import sharp from 'sharp';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).send('Method not allowed');
  }

  const { url } = req.query;
  if (!url || typeof url !== 'string') {
    return res.status(400).send('URL query parameter is required');
  }

  // Restrict proxy to Supabase Storage URLs to prevent open-proxy vulnerabilities
  const isSupabaseUrl = url.includes('.supabase.co/storage/v1/object/public/');
  if (!isSupabaseUrl) {
    return res.status(400).send('Only Supabase Storage public URLs can be proxied');
  }

  try {
    console.log(`[Media Proxy] Fetching and optimizing: ${url}`);
    const originResponse = await fetch(url);
    if (!originResponse.ok) {
      return res.status(originResponse.status).send('Failed to fetch media from storage origin');
    }

    const contentType = originResponse.headers.get('content-type') || 'application/octet-stream';
    const originalBuffer = Buffer.from(await originResponse.arrayBuffer());

    // Instruct the browser (and any upstream CDN/hosting router) to cache the asset globally for 1 year
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('Pragma', 'cache');
    res.setHeader('Expires', new Date(Date.now() + 31536000 * 1000).toUTCString());

    const isImage = contentType.startsWith('image/') && !contentType.includes('svg') && !contentType.includes('gif');

    if (isImage) {
      try {
        // Optimize and compress standard images (PNG, JPG, JPEG) to lightweight WebP format (defaults to 80% high quality)
        const optimizedBuffer = await sharp(originalBuffer)
          .webp({ quality: 80, effort: 4 })
          .toBuffer();

        res.setHeader('Content-Type', 'image/webp');
        console.log(`[Media Proxy] Successfully compressed image. Original length: ${originalBuffer.length} | Optimized length: ${optimizedBuffer.length}`);
        return res.status(200).send(optimizedBuffer);
      } catch (sharpError) {
        console.error('[Media Proxy] Sharp compression failed, serving original image:', sharpError);
        res.setHeader('Content-Type', contentType);
        return res.status(200).send(originalBuffer);
      }
    }

    // Default fallback for other files (PDFs, WebPs, SVGs, Excel sheets, etc.)
    res.setHeader('Content-Type', contentType);
    return res.status(200).send(originalBuffer);
  } catch (error: any) {
    console.error('[Media Proxy Exception]', error.message || error);
    return res.status(500).send('Internal Media Proxy Error');
  }
}
