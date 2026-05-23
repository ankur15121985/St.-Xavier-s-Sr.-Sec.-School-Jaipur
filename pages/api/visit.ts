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

  let count = 477706; // Standard initial count fallback

  try {
    const db = getDatabase();
    
    // 1. Local SQLite site-stats counter
    try {
      db.prepare("UPDATE site_stats SET visitor_count = visitor_count + 1 WHERE id = 'main'").run();
      const stats = db.prepare("SELECT visitor_count FROM site_stats WHERE id = 'main'").get() as any;
      if (stats) count = stats.visitor_count;
    } catch (sqlErr) {
      console.warn("[STATS] Local SQLite visitor save fail:", sqlErr);
    }

    // 2. Supabase Sync (Primary source for serverless deployments)
    if (supabaseServer) {
      try {
        const { data: sbData, error: fetchError } = await supabaseServer
          .from('site_stats')
          .select('visitor_count')
          .eq('id', 'main')
          .maybeSingle();
        
        const currentSbCount = sbData?.visitor_count || count;
        const newCount = Math.max(currentSbCount + 1, count);
        
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

    return res.status(200).json({ success: true, count });
  } catch (err: any) {
    console.error('[STATS] Event-driven visitor log failed:', err.message);
    return res.status(200).json({ success: false, count, error: err.message });
  }
}
