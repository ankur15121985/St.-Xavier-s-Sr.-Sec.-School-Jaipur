import { NextApiRequest, NextApiResponse } from 'next';
import { getDatabase, handleDatabaseError } from '../../src/lib/db';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

let supabaseServer: any = null;
if (SUPABASE_URL && SUPABASE_KEY) {
  try {
    const cleanUrl = SUPABASE_URL.trim().replace('/rest/v1/', '').replace('/rest/v1', '').replace(/\/$/, '');
    supabaseServer = createClient(cleanUrl, SUPABASE_KEY);
  } catch (e) {
    console.error('[SUPABASE] Failed to initialize in visit api:', e);
  }
}

// In-memory visitor count caching to save enormous amounts of server execution time and Vercel CPU limits
let cachedVisitorCount: number = 478200; 
let cachedVisitorCountExpiresAt: number = 0;
const VISITOR_CACHE_TTL_MS = 60000; // Cache for 1 minute

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Extract visitor IP address or use custom client-provided visitorId
  let ip = (req.query.visitorId as string) || '';
  const isSessionTracked = (req.query.sessionTracked as string) === 'true';

  if (!ip) {
    let rawIp = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.socket.remoteAddress || '127.0.0.1';
    if (Array.isArray(rawIp)) {
      rawIp = rawIp[0];
    }
    if (typeof rawIp === 'string') {
      rawIp = rawIp.split(',')[0].trim();
    }
    ip = rawIp || '127.0.0.1';
  }

  let isUnique = !isSessionTracked;

  // 1. Fast path: if the session has already been logged, and we have a fresh memory cache, serve it immediately!
  if (isSessionTracked && Date.now() < cachedVisitorCountExpiresAt) {
    return res.status(200).json({ success: true, count: cachedVisitorCount, isUnique: false });
  }

  try {
    const db = getDatabase();

    // 2. Uniqueness check locally (if we aren't already marked non-unique from session storage)
    if (isUnique) {
      try {
        const existing = db.prepare("SELECT ip FROM visitor_ips WHERE ip = ?").get(ip);
        if (existing) {
          isUnique = false;
        }
      } catch (sqlErr: any) {
        console.warn("[STATS] Local SQLite IP query fail: automatic self-healing...", sqlErr);
        if (sqlErr?.message?.toLowerCase().includes('malformed')) {
          handleDatabaseError(sqlErr);
        } else {
          try {
            db.exec("CREATE TABLE IF NOT EXISTS visitor_ips (ip TEXT PRIMARY KEY, visited_at TEXT)");
          } catch (e) {}
        }
      }
    }

    // 3. Uniqueness check remotely on Supabase (skip if we already know they are non-unique)
    if (isUnique && supabaseServer) {
      try {
        const { data: remoteIp, error: ipError } = await supabaseServer
          .from('visitor_ips')
          .select('ip')
          .eq('ip', ip)
          .maybeSingle();

        if (remoteIp) {
          isUnique = false;
          // Cache locally to speed up subsequent server requests
          try {
            db.prepare("INSERT OR IGNORE INTO visitor_ips (ip, visited_at) VALUES (?, ?)").run(ip, new Date().toISOString());
          } catch (e) {}
        }
      } catch (sbErr) {
        console.warn("[STATS] Supabase IP check exception:", sbErr);
      }
    }

    // 4. Update stats only if uniquely new
    let count = cachedVisitorCount;

    if (isUnique) {
      // Record new IP locally
      try {
        db.prepare("INSERT OR IGNORE INTO visitor_ips (ip, visited_at) VALUES (?, ?)").run(ip, new Date().toISOString());
        db.prepare("UPDATE site_stats SET visitor_count = visitor_count + 1 WHERE id = 'main'").run();
      } catch (e) {}

      // Fetch the latest count locally
      try {
        const stats = db.prepare("SELECT visitor_count FROM site_stats WHERE id = 'main'").get() as any;
        if (stats) {
          count = stats.visitor_count;
        }
      } catch (e) {}

      // Update Supabase synchronously/asynchronously for unique hits
      if (supabaseServer) {
        try {
          const { data: sbData } = await supabaseServer
            .from('site_stats')
            .select('visitor_count')
            .eq('id', 'main')
            .maybeSingle();

          const currentSbCount = sbData?.visitor_count || count;
          const newCount = Math.max(currentSbCount + 1, count);

          // Upload IP and count to Supabase
          try {
            await supabaseServer.from('visitor_ips').upsert({ ip, visited_at: new Date().toISOString() });
          } catch (e) {}

          await supabaseServer.from('site_stats').upsert({ id: 'main', visitor_count: newCount, updated_at: new Date().toISOString() });
          count = newCount;
        } catch (sbErr) {
          console.warn("[STATS] Supabase sync failure on unique hit:", sbErr);
        }
      }
    } else {
      // Non-unique request. Since we hit this block, either the local in-memory cache has expired (but they are sessionTracked)
      // or we found they are not unique via IP check. Let's perform a fast read-only fetch to populate the cache!
      if (Date.now() >= cachedVisitorCountExpiresAt) {
        let dbCount = 478200;
        // Read local SQLite
        try {
          const stats = db.prepare("SELECT visitor_count FROM site_stats WHERE id = 'main'").get() as any;
          if (stats) {
            dbCount = stats.visitor_count;
          }
        } catch (e) {}

        // Read or Sync with Supabase (if online and configured)
        if (supabaseServer) {
          try {
            const { data: sbData } = await supabaseServer
              .from('site_stats')
              .select('visitor_count')
              .eq('id', 'main')
              .maybeSingle();
            if (sbData && sbData.visitor_count) {
              dbCount = Math.max(dbCount, sbData.visitor_count);
            }
          } catch (e) {}
        }
        count = dbCount;
      } else {
        count = cachedVisitorCount;
      }
    }

    // Refresh memory cache
    cachedVisitorCount = count;
    cachedVisitorCountExpiresAt = Date.now() + VISITOR_CACHE_TTL_MS;

    // Set Cache-Control to reduce Origin Transfer and CPU. 
    // This allows the Edge to serve the count for 1 minute without hitting the Origin.
    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=60, stale-while-revalidate=300');

    return res.status(200).json({ success: true, count, isUnique });
  } catch (err: any) {
    console.error('[STATS] Event-driven visitor log failed:', err.message);
    // Even if database fails, return the last known cached count to the client instead of completely failing
    return res.status(200).json({ success: false, count: cachedVisitorCount, error: err.message });
  }
}
