-- ==============================================================================
-- HARDENED SUPABASE RLS SECURITY POLICIES (v5 - PERMISSION ERROR FIX)
-- Run this in your Supabase SQL Editor to secure your database.
-- ==============================================================================

-- 1. CLEAN UP ALL OLD POLICIES FROM PUBLIC TABLES
DO $$ 
DECLARE
    pol_record RECORD;
BEGIN 
    FOR pol_record IN 
        SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public' 
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol_record.policyname, pol_record.tablename);
    END LOOP;
END $$;

-- 2. ENABLE RLS ON ALL PUBLIC TABLES
DO $$ 
DECLARE
    t_name TEXT;
BEGIN 
    FOR t_name IN SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' 
    LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t_name);
    END LOOP;
END $$;

-- 3. HELPER: RLS BYPASS FUNCTION
-- This allows the admin portal to "prove" it is an admin via a session variable
CREATE OR REPLACE FUNCTION public.set_config_admin(val text) 
RETURNS text 
LANGUAGE plpgsql 
SECURITY DEFINER 
AS $$
BEGIN
    PERFORM set_config('app.admin_secret', val, false);
    RETURN val;
END;
$$;

GRANT EXECUTE ON FUNCTION public.set_config_admin(text) TO anon, authenticated;

-- 4. PUBLIC READ TABLES (Website Content)
DO $$ 
DECLARE
    t_name TEXT;
    public_tables TEXT[] := ARRAY[
        'notices', 'events', 'staff', 'gallery', 'fees', 'links', 'achievements', 
        'page_sections', 'academics', 'activities', 'alumni', 'school_info', 
        'parent_obligations', 'careers', 'mandatory_disclosures', 'contact_content', 
        'studentHonors', 'navigation_menu', 'carousel', 'faqs', 'popups', 'marquee', 
        'former_leaders', 'scholarships', 'jesuit_page_content', 'custom_content', 
        'useful_links', 'lead_grace', 'digital_campus', 'school_history', 'site_settings', 'site_stats'
    ];
BEGIN 
    FOREACH t_name IN ARRAY public_tables LOOP
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = t_name AND table_schema = 'public') THEN
            EXECUTE format('CREATE POLICY "Public Read" ON public.%I FOR SELECT TO public USING (true)', t_name);
            EXECUTE format('CREATE POLICY "Admin Full Access" ON public.%I FOR ALL TO authenticated USING (true) WITH CHECK (true)', t_name);
            -- Legacy Admin Portal Bypass
            EXECUTE format('CREATE POLICY "Legacy Admin Read" ON public.%I FOR SELECT TO public USING (current_setting(''app.admin_secret'', true) = ''st-xaviers-admin-authenticated'')', t_name);
            EXECUTE format('CREATE POLICY "Legacy Admin Write" ON public.%I FOR ALL TO public USING (current_setting(''app.admin_secret'', true) = ''st-xaviers-admin-authenticated'') WITH CHECK (current_setting(''app.admin_secret'', true) = ''st-xaviers-admin-authenticated'')', t_name);
        END IF;
    END LOOP;
END $$;

-- 5. SECURE SUBMISSION TABLES (Messages/Forms)
DO $$ 
DECLARE
    t_name TEXT;
    submission_tables TEXT[] := ARRAY['messages', 'career_applications', 'transfer_certificates'];
BEGIN 
    FOREACH t_name IN ARRAY submission_tables LOOP
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = t_name AND table_schema = 'public') THEN
            EXECUTE format('CREATE POLICY "Public Insert Only" ON public.%I FOR INSERT TO public WITH CHECK (true)', t_name);
            EXECUTE format('CREATE POLICY "Admin Management" ON public.%I FOR ALL TO authenticated USING (true) WITH CHECK (true)', t_name);
            EXECUTE format('CREATE POLICY "Legacy Admin Data Sync" ON public.%I FOR SELECT TO public USING (current_setting(''app.admin_secret'', true) = ''st-xaviers-admin-authenticated'')', t_name);
            EXECUTE format('CREATE POLICY "Legacy Admin Data Full" ON public.%I FOR ALL TO public USING (current_setting(''app.admin_secret'', true) = ''st-xaviers-admin-authenticated'') WITH CHECK (current_setting(''app.admin_secret'', true) = ''st-xaviers-admin-authenticated'')', t_name);
        END IF;
    END LOOP;
END $$;

-- 6. PRIVATE SYSTEM TABLES (Logs/Admins)
DO $$ 
DECLARE
    t_name TEXT;
    system_tables TEXT[] := ARRAY['admins', 'logs', 'visitor_ips'];
BEGIN 
    FOREACH t_name IN ARRAY system_tables LOOP
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = t_name AND table_schema = 'public') THEN
            EXECUTE format('CREATE POLICY "Admin Only Access" ON public.%I FOR ALL TO authenticated USING (true) WITH CHECK (true)', t_name);
            EXECUTE format('CREATE POLICY "Legacy Admin System Sync" ON public.%I FOR SELECT TO public USING (current_setting(''app.admin_secret'', true) = ''st-xaviers-admin-authenticated'')', t_name);
        END IF;
    END LOOP;
END $$;

-- 7. STORAGE POLICIES
-- NOTE: If you get errors here, you may need to enable RLS on the 'storage.objects' table via the Supabase Dashboard UI.
DO $$ 
BEGIN 
    -- Only try if we can see the table
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'objects' AND table_schema = 'storage') THEN
        DROP POLICY IF EXISTS "Public Storage Read" ON storage.objects;
        DROP POLICY IF EXISTS "Admin Storage Manage" ON storage.objects;
        DROP POLICY IF EXISTS "Legacy Admin Storage Upload" ON storage.objects;

        CREATE POLICY "Public Storage Read" ON storage.objects FOR SELECT TO public USING (bucket_id = 'uploads');
        CREATE POLICY "Admin Storage Manage" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'uploads') WITH CHECK (bucket_id = 'uploads');
        CREATE POLICY "Legacy Admin Storage Upload" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'uploads' AND current_setting('app.admin_secret', true) = 'st-xaviers-admin-authenticated');
    END IF;
END $$;

-- 8. FINAL GRANTS
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
REVOKE INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public FROM anon;
GRANT INSERT ON messages, career_applications, transfer_certificates TO anon;

-- REFRESH SCHEMA
NOTIFY pgrst, 'reload schema';
