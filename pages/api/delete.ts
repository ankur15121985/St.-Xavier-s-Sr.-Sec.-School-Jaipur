import { NextApiResponse } from 'next';
import { getDatabase, clearServerDataCache } from '../../src/lib/db';
import { authenticateToken, AuthenticatedRequest } from '../../src/lib/auth';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY || '';
const SUPABASE_KEY = SERVICE_KEY || ANON_KEY;

let supabaseServer: any = null;
if (SUPABASE_URL && SUPABASE_KEY) {
  if (!SERVICE_KEY) {
    console.warn('[SUPABASE] SERVICE_ROLE_KEY is missing. Delete operations may fail due to RLS if the project is hardened.');
  }
  try {
    const cleanUrl = SUPABASE_URL.trim().replace('/rest/v1/', '').replace('/rest/v1', '').replace(/\/$/, '');
    supabaseServer = createClient(cleanUrl, SUPABASE_KEY);
  } catch (e) {
    console.error('[SUPABASE] Failed to initialize in delete api:', e);
  }
}

const WHITELIST_TABLES = [
  'notices', 'staff', 'gallery', 'carousel', 'fees', 'links', 'useful_links',
  'events', 'achievements', 'transfer_certificates', 'studentHonors', 'menu',
  'navigation_menu', 'faqs', 'messages', 'popups', 'school_info', 'activities',
  'alumni', 'parent_obligations', 'careers', 'mandatory_disclosures', 'contact_content',
  'scholarships', 'fire_safety', 'jesuit_page_content', 'school_history', 'lead_grace',
  'digital_campus', 'former_leaders', 'former_principals', 'former_rectors', 'former_managers',
  'former_student_leaders', 'marquee', 'streamwise_toppers', 'xavierite_of_the_year',
  'custom_content', 'co_curricular_activities', 'career_applications', 'settings', 'site_settings'
];

export default async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!authenticateToken(req, res)) {
    return;
  }

  try {
    const { table, id, ids } = req.body;
    
    if (!WHITELIST_TABLES.includes(table)) {
      return res.status(400).json({ error: `Invalid table: ${table}` });
    }

    console.log(`[DELETE INITIATED] Table: ${table}, ID: ${id || 'bulk'}`);

    // 1. Sync Delete to Supabase
    if (supabaseServer) {
      const targetTable = table === 'settings' ? 'site_settings' : table;
      try {
        if (ids && Array.isArray(ids)) {
          let { error } = await supabaseServer.from(targetTable).delete().in('id', ids);
          if (error && table === 'settings' && targetTable === 'site_settings') {
            const errMsg = error.message?.toLowerCase() || '';
            const isTableError = error.code === 'PGRST125' || 
                                 error.code === 'PGRST204' || 
                                 error.status === 404 || 
                                 errMsg.includes('site_settings') || 
                                 errMsg.includes('relation "public.site_settings"');
            if (isTableError) {
              console.warn(`[SUPABASE DELETE] site_settings missing, attempting fallback settings...`);
              const fallbackResult = await supabaseServer.from('settings').delete().in('id', ids);
              error = fallbackResult.error;
            }
          }
          if (error) console.warn(`[SUPABASE DELETE BULK WARNING] ${targetTable}:`, error.message);
        } else if (id) {
          let { error } = await supabaseServer.from(targetTable).delete().eq('id', id);
          if (error && table === 'settings' && targetTable === 'site_settings') {
            const errMsg = error.message?.toLowerCase() || '';
            const isTableError = error.code === 'PGRST125' || 
                                 error.code === 'PGRST204' || 
                                 error.status === 404 || 
                                 errMsg.includes('site_settings') || 
                                 errMsg.includes('relation "public.site_settings"');
            if (isTableError) {
              console.warn(`[SUPABASE DELETE fallback] attempting settings fallback...`);
              const fallbackResult = await supabaseServer.from('settings').delete().eq('id', id);
              error = fallbackResult.error;
            }
          }
          if (error) console.warn(`[SUPABASE DELETE UNIFIED WARNING] ${targetTable}:`, error.message);
        }
      } catch (e: any) {
        console.warn('[SUPABASE DELETE UNIFIED EXCEPTION]', e.message);
      }
    }

    // 2. Local SQLite Delete
    const db = getDatabase();
    let sqliteTable = table;
    if (table === 'navigation_menu') {
      sqliteTable = 'menu';
    } else if (table === 'site_settings' || table === 'settings') {
      sqliteTable = 'settings';
    }

    let result;
    if (ids && Array.isArray(ids)) {
      if (ids.length === 0) return res.status(200).json({ success: true, changes: 0 });
      const placeholders = ids.map(() => '?').join(',');
      const stmt = db.prepare(`DELETE FROM "${sqliteTable}" WHERE id IN (${placeholders})`);
      result = stmt.run(ids);
      
      if (sqliteTable === 'settings') {
        try {
          db.prepare(`DELETE FROM "site_settings" WHERE id IN (${placeholders})`).run(ids);
        } catch (e) {}
      }
    } else {
      const stmt = db.prepare(`DELETE FROM "${sqliteTable}" WHERE id = ?`);
      result = stmt.run(id);
      
      if (sqliteTable === 'settings') {
        try {
          db.prepare(`DELETE FROM "site_settings" WHERE id = ?`).run(id);
        } catch (e) {}
      }
    }
    
    console.log(`[SQL DELETE SUCCESS] Local ${table} removed ${result.changes} rows.`);

    // 3. Record Audit Log
    try {
      const user = req.user?.username || 'Admin';
      const action = `DELETE_${table.toUpperCase()}`;
      const details = `Removed ${id || `${ids?.length} items`} from ${table}`;
      db.prepare("INSERT INTO logs (id, user, action, details, timestamp) VALUES (?, ?, ?, ?, ?)")
        .run(crypto.randomUUID(), user, action, details, new Date().toISOString());
    } catch (logErr) {
      console.error("[AUDIT] Delete log failed:", logErr);
    }

    // Update local and remote content timestamp via 'content' table key 'content_updated_at' to propagate cache changes
    const newTimestamp = new Date().toISOString();
    try {
      db.prepare("INSERT OR REPLACE INTO content (key, value) VALUES ('content_updated_at', ?)").run(newTimestamp);
    } catch (e) {}

    if (supabaseServer) {
      try {
        await supabaseServer.from('content').upsert({ key: 'content_updated_at', value: newTimestamp });
      } catch (e) {}
    }

    clearServerDataCache();
    return res.status(200).json({ success: true, changes: result.changes });
  } catch (err: any) {
    console.error(`[SQL DELETE ERROR]`, err.message);
    return res.status(500).json({ error: err.message });
  }
}
