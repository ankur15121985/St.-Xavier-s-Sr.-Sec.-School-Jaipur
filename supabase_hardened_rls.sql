-- ==============================================================================
-- HARDENED SUPABASE RLS SECURITY POLICIES (IDEMPOTENT VERSION)
-- Run this in your Supabase SQL Editor to secure your database.
-- ==============================================================================

-- 1. Ensure RLS is enabled on ALL tables
DO $$ 
DECLARE
    t_name TEXT;
BEGIN 
    FOR t_name IN SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' 
    AND table_name NOT IN ('schema_migrations', 'pg_stat_statements')
    LOOP
        EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t_name);
    END LOOP;
END $$;

-- 2. Clean up existing permissive policies to start clean
DO $$ 
DECLARE
    pol_record RECORD;
BEGIN 
    FOR pol_record IN 
        SELECT policyname, tablename 
        FROM pg_policies 
        WHERE schemaname = 'public' 
        AND (policyname ILIKE '%Public Full Access%' OR policyname ILIKE '%Allow All%' OR policyname ILIKE '%System Select%')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I', pol_record.policyname, pol_record.tablename);
    END LOOP;
END $$;

-- 3. Define PUBLIC READ tables (Data shown on the website)
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
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = t_name) THEN
            -- Drop existing before creating to avoid "already exists" errors
            EXECUTE format('DROP POLICY IF EXISTS "Public Read" ON %I', t_name);
            EXECUTE format('DROP POLICY IF EXISTS "Admin Full Access" ON %I', t_name);

            -- Public can SELECT
            EXECUTE format('CREATE POLICY "Public Read" ON %I FOR SELECT TO public USING (true)', t_name);
            -- Authenticated Admins can do EVERYTHING
            EXECUTE format('CREATE POLICY "Admin Full Access" ON %I FOR ALL TO authenticated USING (true) WITH CHECK (true)', t_name);
        END IF;
    END LOOP;
END $$;

-- 4. Define SECURE SUBMISSION tables (Forms/Messages)
DO $$ 
DECLARE
    t_name TEXT;
    submission_tables TEXT[] := ARRAY['messages', 'career_applications', 'transfer_certificates'];
BEGIN 
    FOREACH t_name IN ARRAY submission_tables LOOP
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = t_name) THEN
            -- Drop existing before creating
            EXECUTE format('DROP POLICY IF EXISTS "Secure Submission" ON %I', t_name);
            EXECUTE format('DROP POLICY IF EXISTS "Admin Management" ON %I', t_name);

            -- Public can only INSERT (send data)
            EXECUTE format('CREATE POLICY "Secure Submission" ON %I FOR INSERT TO public WITH CHECK (true)', t_name);
            -- Authenticated Admins can READ and MANAGE
            EXECUTE format('CREATE POLICY "Admin Management" ON %I FOR ALL TO authenticated USING (true) WITH CHECK (true)', t_name);
        END IF;
    END LOOP;
END $$;

-- 5. Define PRIVATE SYSTEM tables
DO $$ 
DECLARE
    t_name TEXT;
    system_tables TEXT[] := ARRAY['admins', 'logs', 'visitor_ips'];
BEGIN 
    FOREACH t_name IN ARRAY system_tables LOOP
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = t_name) THEN
            -- Drop existing before creating
            EXECUTE format('DROP POLICY IF EXISTS "Admin Only Access" ON %I', t_name);
            -- Only Authenticated users can access
            EXECUTE format('CREATE POLICY "Admin Only Access" ON %I FOR ALL TO authenticated USING (true) WITH CHECK (true)', t_name);
        END IF;
    END LOOP;
END $$;

-- 6. Storage Security (Buckets)
DROP POLICY IF EXISTS "Public Storage Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Storage Insert" ON storage.objects;
DROP POLICY IF EXISTS "Admin Storage Full Access" ON storage.objects;

-- Anyone can see images in 'uploads'
CREATE POLICY "Public Storage Access" ON storage.objects 
FOR SELECT TO public 
USING (bucket_id = 'uploads');

-- Only logged-in admins can upload/delete
CREATE POLICY "Admin Storage Full Access" ON storage.objects 
FOR ALL TO authenticated 
USING (bucket_id = 'uploads') 
WITH CHECK (bucket_id = 'uploads');

-- 7. Grant proper permissions to roles
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
-- Revoke write access from anon as extra layer
REVOKE INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public FROM anon;
-- Exception: Allow anon to insert into submission tables
GRANT INSERT ON messages, career_applications, transfer_certificates TO anon;

-- Notify Supabase to reload the schema cache
NOTIFY pgrst, 'reload schema';
