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
  try {
    const cleanUrl = SUPABASE_URL.trim().replace('/rest/v1/', '').replace('/rest/v1', '').replace(/\/$/, '');
    supabaseServer = createClient(cleanUrl, SUPABASE_KEY);
  } catch (e) {
    console.error('[SUPABASE] Failed to initialize in save api:', e);
  }
}

const SCHEMA: Record<string, string[]> = {
  notices: ['id', 'title', 'content', 'date', 'category', 'link', 'attachmentUrl'],
  staff: ['id', 'name', 'role', 'bio', 'image', 'type', 'attachmentUrl'],
  gallery: ['id', 'url', 'caption', 'session', 'attachmentUrl'],
  carousel: ['id', 'url', 'caption', 'session', 'attachmentUrl'],
  fees: ['id', 'category', 'particulars', 'amount', 'quarterly', 'remarks', 'order_index', 'attachmentUrl'],
  links: ['id', 'title', 'url', 'isPriority', 'icon', 'attachmentUrl'],
  useful_links: ['id', 'title', 'url', 'isPriority', 'icon', 'attachmentUrl'],
  events: ['id', 'title', 'date', 'time', 'location', 'attachmentUrl'],
  achievements: ['id', 'title', 'year', 'description', 'attachmentUrl'],
  transfer_certificates: ['id', 'admission_number', 'dob', 'student_name', 'attachmentUrl'],
  studentHonors: ['id', 'name', 'category', 'result', 'subtext', 'image', 'order_index', 'attachmentUrl'],
  menu: ['id', 'label', 'href', 'parent_id', 'order_index', 'attachmentUrl', 'is_enabled'],
  navigation_menu: ['id', 'label', 'href', 'parent_id', 'order_index', 'attachmentUrl', 'is_enabled'],
  faqs: ['id', 'question', 'answer', 'category', 'order_index', 'attachmentUrl'],
  messages: ['id', 'name', 'email', 'subject', 'message', 'timestamp', 'status', 'attachmentUrl'],
  popups: ['id', 'title', 'type', 'content', 'buttonText', 'buttonLink', 'isActive', 'order_index', 'attachmentUrl'],
  school_info: ['id', 'title', 'heading', 'content', 'order_index', 'attachmentUrl'],
  activities: ['id', 'title', 'heading', 'content', 'order_index', 'attachmentUrl', 'image_url'],
  alumni: ['id', 'title', 'heading', 'content', 'order_index', 'attachmentUrl', 'image_url'],
  parent_obligations: ['id', 'title', 'heading', 'content', 'order_index', 'attachmentUrl', 'image_url'],
  careers: ['id', 'title', 'heading', 'content', 'order_index', 'attachmentUrl', 'image_url'],
  mandatory_disclosures: ['id', 'title', 'heading', 'content', 'order_index', 'attachmentUrl', 'image_url', 'category', 'is_enabled'],
  contact_content: ['id', 'title', 'heading', 'content', 'order_index', 'attachmentUrl', 'image_url'],
  scholarships: ['id', 'title', 'heading', 'content', 'order_index', 'attachmentUrl', 'image_url'],
  fire_safety: ['id', 'title', 'heading', 'content', 'order_index', 'attachmentUrl', 'image_url', 'is_enabled'],
  jesuit_page_content: ['id', 'objectives_html', 'examinations_html', 'promotions_html', 'discipline_html', 'updated_at'],
  school_history: ['id', 'title', 'content', 'updated_at'],
  lead_grace: ['id', 'heading', 'content', 'image_url', 'updated_at'],
  digital_campus: ['id', 'title', 'is_enabled', 'model_url'],
  former_leaders: ['id', 'name', 'tenure', 'image', 'order_index', 'type'],
  former_principals: ['id', 'name', 'tenure', 'image', 'order_index'],
  former_rectors: ['id', 'name', 'tenure', 'image', 'order_index'],
  former_managers: ['id', 'name', 'tenure', 'image', 'order_index'],
  former_student_leaders: ['id', 'name', 'role', 'academic_year', 'image', 'order_index'],
  marquee: ['id', 'text', 'link', 'attachmentUrl', 'isActive', 'order_index'],
  streamwise_toppers: ['id', 'name', 'stream', 'percentage', 'academic_year', 'image', 'order_index'],
  xavierite_of_the_year: ['id', 'name', 'academic_year', 'citation', 'image', 'order_index'],
  custom_content: ['id', 'title', 'heading', 'content', 'order_index', 'attachmentUrl', 'is_enabled'],
  co_curricular_activities: ['id', 'title', 'heading', 'content', 'display_type', 'category', 'order_index', 'attachmentUrl', 'image_url', 'is_enabled'],
  career_applications: [
    'id', 'application_no', 'category', 'full_name', 'parent_spouse_name', 'mobile_number', 'email', 'gender', 'dob', 'aadhar_number', 'address', 'photo_url', 'user_ip', 'declaration_accepted', 'major_subject', 'minor_subject_1', 'minor_subject_2', 'salary_expected', 'tet_details', 'interests', 'responsibilities_handled', 'statement_of_purpose', 'other_experience', 'education_qualifications', 'teaching_experience', 'achievements', 'teacher_category', 'created_at', 'status'
  ],
  logs: ['id', 'user', 'action', 'details', 'timestamp'],
  settings: [
    'id', 'applyNowEnabled', 'applyNowUrl', 'applyNowLabel', 'siteName', 'siteLogo', 
    'contactEmail', 'contactPhone', 'contactAddress', 'currentSession', 'feesPdfUrl', 
    'popupMessage', 'popupEnabled', 'googleSearchConsoleKey', 'bingWebmasterKey', 
    'indexNowKey', 'ogTitle', 'ogDescription', 'ogImage',
    'showCarousel', 'showMarquee', 'showAbout', 'showFeature', 'showVision', 
    'showInsights', 'showPrincipalMessage', 'showDistinction', 'showVirtualCampus', 
    'showGallery', 'showLeadership', 'showHonors', 'careerFormEnabled', 'flagEnabled',
    'flagImage', 'aboutTitle', 'aboutContent', 'historyTitle', 'historyContent', 'faviconUrl'
  ],
  content: [
    'id', 'heroTitle1', 'heroTitle2', 'heroBadge', 'heroDescription', 'carouselBranding',
    'aboutBadge', 'aboutTitle1', 'aboutTitle2', 'aboutDescription', 'mottoTitle', 'mottoDescription',
    'historyButton', 'principalBadge', 'principalTitle1', 'principalTitle2', 'principalTitle3',
    'principalQuote', 'principalButton', 'oeuvreTitle1', 'oeuvreTitle2', 'oeuvreDescription',
    'regencyBadge', 'regencyTitle', 'regencyDescription', 'nodesTitle1', 'nodesTitle2', 'nodesDescription',
    'helpdeskLabel', 'wiredTitle', 'wiredBadge', 'exploreButton', 'footerDescription'
  ]
};

export default async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!await authenticateToken(req, res)) {
    return;
  }

  try {
    const { table, item } = req.body;
    const whitelist = Object.keys(SCHEMA);
    
    if (!whitelist.includes(table)) {
      return res.status(400).json({ error: 'Invalid table name' });
    }

    // Ensure non-null values for required settings columns and force ID to 'global'
    if (table === 'settings' || table === 'site_settings') {
      item.id = 'global';
      if (item.applyNowUrl === null || item.applyNowUrl === undefined) item.applyNowUrl = '';
      if (item.applyNowLabel === null || item.applyNowLabel === undefined) item.applyNowLabel = 'Apply Now';
      if (item.applyNowEnabled === null || item.applyNowEnabled === undefined) item.applyNowEnabled = 1;
    }

    const allowedFields = SCHEMA[table];
    const fields = Object.keys(item).filter(k => allowedFields.includes(k));
    
    if (fields.length === 0) {
      return res.status(400).json({ error: 'No valid fields to save' });
    }

    console.log(`[SYNC INITIATED] Table: ${table}, ID: ${item.id}`);

    // 1. Sync to Supabase if client is ready
    if (supabaseServer) {
      try {
        const sanitizedForSupabase = { ...item };
        if (table === 'popups' && 'isActive' in sanitizedForSupabase) sanitizedForSupabase.isActive = !!sanitizedForSupabase.isActive;
        if (table === 'settings' && 'applyNowEnabled' in sanitizedForSupabase) sanitizedForSupabase.applyNowEnabled = !!sanitizedForSupabase.applyNowEnabled;
        if (table === 'settings' && 'popupEnabled' in sanitizedForSupabase) sanitizedForSupabase.popupEnabled = !!sanitizedForSupabase.popupEnabled;

        const targetTable = table === 'settings' ? 'site_settings' : table;
        let { error } = await supabaseServer.from(targetTable).upsert(sanitizedForSupabase);
        if (error && table === 'settings' && targetTable === 'site_settings') {
          const errMsg = error.message?.toLowerCase() || '';
          const isTableError = error.code === 'PGRST125' || 
                               error.code === 'PGRST204' || 
                               error.status === 404 || 
                               errMsg.includes('site_settings') || 
                               errMsg.includes('invalid path') || 
                               errMsg.includes('relation "public.site_settings" does not exist');
          if (isTableError) {
            console.warn(`[SUPABASE SYNC] 'site_settings' not found on remote. Trying fallback to 'settings'...`);
            const fallbackResult = await supabaseServer.from('settings').upsert(sanitizedForSupabase);
            error = fallbackResult.error;
          }
        }
        if (error) {
          console.warn(`[SUPABASE SYNC WARNING] ${table}:`, error.message);
        }
      } catch (e: any) {
        console.warn('[SUPABASE SYNC EXCEPTION]', e.message);
      }
    }

    // 2. Local SQLite Sync
    const db = getDatabase();
    let sqliteTable = table;
    if (table === 'navigation_menu') {
      sqliteTable = 'menu';
    } else if (table === 'site_settings' || table === 'settings') {
      sqliteTable = 'site_settings';
    }

    const placeholders = fields.map(() => '?').join(',');
    const values = fields.map(f => {
      const val = item[f];
      if (typeof val === 'boolean') return val ? 1 : 0;
      return val;
    });

    const query = `INSERT OR REPLACE INTO "${sqliteTable}" (${fields.map(f => `"${f}"`).join(',')}) VALUES (${placeholders})`;
    db.prepare(query).run(values);
    
    // settings mirroring
    if (table === 'settings' || table === 'site_settings') {
      try {
        const queryMirror = `INSERT OR REPLACE INTO "site_settings" (${fields.map(f => `"${f}"`).join(',')}) VALUES (${placeholders})`;
        db.prepare(queryMirror).run(values);
      } catch (e: any) {
        console.warn(`[SQL MIRROR WARNING] ${e.message}`);
      }
    }
    
    // 3. Record Audit Log
    try {
      const user = req.user?.username || 'Admin';
      const action = `UPDATE_${table.toUpperCase()}`;
      const details = `Managed ${item?.id || 'record'} in ${table}`;
      db.prepare("INSERT INTO logs (id, user, action, details, timestamp) VALUES (?, ?, ?, ?, ?)")
        .run(crypto.randomUUID(), user, action, details, new Date().toISOString());
    } catch (logErr) {
      console.error("[AUDIT] Log failed:", logErr);
    }

    console.log(`[SQL SUCCESS] Local ${table} item persisted via API save.`);

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
    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error(`[SQL ERROR] SAVE FAILED:`, err.message);
    return res.status(500).json({ error: err.message });
  }
}
