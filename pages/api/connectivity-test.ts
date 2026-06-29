import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const SUPABASE_URL = (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
  const ANON_KEY = (process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();
  const SERVICE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || '').trim();
  
  const SUPABASE_KEY = SERVICE_KEY || ANON_KEY;
  
  // Robust URL cleaning: SDK needs ONLY the base project URL (e.g. https://xyz.supabase.co)
  const cleanUrl = SUPABASE_URL
    .replace(/\/rest\/v1\/?$/, '') // Remove /rest/v1 or /rest/v1/
    .replace(/\/$/, '');           // Remove trailing slash
  
  const status: any = {
    connected: false,
    hasServiceRole: !!SERVICE_KEY,
    url: cleanUrl ? `${cleanUrl.slice(0, 25)}...` : 'MISSING',
    detectedKeys: {
      url: !!SUPABASE_URL,
      anon: !!ANON_KEY,
      serviceRole: !!SERVICE_KEY,
      standardRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
    },
    tables: {}
  };

  if (!cleanUrl || !SUPABASE_KEY) {
    status.error = 'Supabase URL or Key is missing from environment variables.';
    return res.status(200).json(status);
  }

  try {
    const supabase = createClient(cleanUrl, SUPABASE_KEY);
    
    // Check connection by fetching content_updated_at
    const { data, error } = await supabase.from('content').select('value').eq('key', 'content_updated_at').maybeSingle();
    
    if (error) {
      status.error = `Connection check failed: ${error.message}`;
    } else {
      status.connected = true;
    }

    const collections = [
       'notices', 'staff', 'gallery', 'fees', 'links', 
       'events', 'achievements', 'studentHonors', 'navigation_menu', 'carousel', 'popups', 'transfer_certificates', 'faqs', 'messages', 'marquee', 'admins', 'logs', 'former_leaders',
       'former_principals', 'former_rectors', 'former_managers', 'former_student_leaders', 'streamwise_toppers', 'xavierite_of_the_year', 'useful_links', 'custom_content', 'lead_grace', 'school_history',
       'activities', 'co_curricular_activities', 'alumni', 'school_info', 'parent_obligations', 'careers', 'mandatory_disclosures', 'contact_content', 'jesuit_page_content', 'scholarships', 'fire_safety', 'site_stats', 'career_applications'
    ];

    // Audit tables in parallel
    const tableChecks = collections.map(async (name) => {
      try {
        const { count, error } = await supabase.from(name).select('*', { count: 'exact', head: true });
        status.tables[name] = {
          count: count !== null ? count : 0,
          error: error ? error.message : null
        };
      } catch (e: any) {
        status.tables[name] = { count: 0, error: e.message };
      }
    });

    await Promise.all(tableChecks);

    // Also check for 'inquiries' as a fallback since the user mentioned it
    try {
      const { count, error } = await supabase.from('inquiries').select('*', { count: 'exact', head: true });
      if (!error && count !== null) {
        status.tables['inquiries'] = { count, error: null };
      }
    } catch (e) {}

    return res.status(200).json(status);
  } catch (err: any) {
    status.error = `Fatal Audit Error: ${err.message}`;
    return res.status(200).json(status);
  }
}
