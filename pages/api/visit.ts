import { NextApiRequest, NextApiResponse } from 'next';
import { getDatabase } from '../../src/lib/db';
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Extract visitor IP address or use custom client-provided visitorId
  let ip = (req.query.visitorId as string) || '';
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

  let count = 477706; // Standard initial count fallback
  let isUnique = true;

  try {
    const db = getDatabase();

    // 1. Check uniqueness locally in SQLite first
    try {
      const existing = db.prepare("SELECT ip FROM visitor_ips WHERE ip = ?").get(ip);
      if (existing) {
        isUnique = false;
      }
    } catch (sqlErr) {
      console.warn("[STATS] Local SQLite IP query fail: automatic self-healing...", sqlErr);
      try {
        db.exec("CREATE TABLE IF NOT EXISTS visitor_ips (ip TEXT PRIMARY KEY, visited_at TEXT)");
      } catch (e) {}
    }

    // 2. Query Supabase if visitor is locally unique but remote check is needed
    // (e.g. in multi-instance or serverless cold starts)
    if (isUnique && supabaseServer) {
      try {
        const { data: remoteIp, error: ipError } = await supabaseServer
          .from('visitor_ips')
          .select('ip')
          .eq('ip', ip)
          .maybeSingle();

        if (remoteIp) {
          isUnique = false;
          // Store locally to speed up subsequent requests
          try {
            db.prepare("INSERT OR IGNORE INTO visitor_ips (ip, visited_at) VALUES (?, ?)").run(ip, new Date().toISOString());
          } catch (e) {}
        }
      } catch (sbErr) {
        console.warn("[STATS] Supabase IP check exception:", sbErr);
      }
    }

    // 3. Update Local SQLite Site Stats
    try {
      if (isUnique) {
        // Record the unique IP and update local visitor count
        db.prepare("INSERT OR IGNORE INTO visitor_ips (ip, visited_at) VALUES (?, ?)").run(ip, new Date().toISOString());
        db.prepare("UPDATE site_stats SET visitor_count = visitor_count + 1 WHERE id = 'main'").run();
      }
      const stats = db.prepare("SELECT visitor_count FROM site_stats WHERE id = 'main'").get() as any;
      if (stats) {
        count = stats.visitor_count;
      }
    } catch (sqlErr) {
      console.warn("[STATS] Local SQLite visitor save fail:", sqlErr);
    }

    // 4. Update Supabase Sync
    if (supabaseServer) {
      try {
        const { data: sbData, error: fetchError } = await supabaseServer
          .from('site_stats')
          .select('visitor_count')
          .eq('id', 'main')
          .maybeSingle();

        const currentSbCount = sbData?.visitor_count || count;
        let newCount = currentSbCount;

        if (isUnique) {
          newCount = Math.max(currentSbCount + 1, count);
        } else {
          newCount = Math.max(currentSbCount, count);
        }

        // Upsert unique IP to Supabase if unique
        if (isUnique) {
          try {
            await supabaseServer
              .from('visitor_ips')
              .upsert({ ip, visited_at: new Date().toISOString() });
          } catch (ipSberr) {
            console.warn("[STATS] Supabase unique IP registration failed:", ipSberr);
          }
        }

        const { error: updateError } = await supabaseServer
          .from('site_stats')
          .upsert({ id: 'main', visitor_count: newCount, updated_at: new Date().toISOString() });

        if (!updateError) {
          count = newCount;
        } else {
          console.warn("[STATS] Supabase visitor count update failed:", updateError.message);
        }
      } catch (sbErr) {
        console.warn("[STATS] Supabase connect failed inside visit api:", sbErr);
      }
    }

    return res.status(200).json({ success: true, count, isUnique });
  } catch (err: any) {
    console.error('[STATS] Event-driven visitor log failed:', err.message);
    return res.status(200).json({ success: false, count, error: err.message });
  }
}
