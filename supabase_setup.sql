/********************************************************************************
  SUPABASE SETUP SCRIPT (CLEAN SLATE RESET)
  Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
********************************************************************************/

-- 1. DROP ALL EXISTING TABLES (DANGER: DELETES DATA FOR A CLEAN START)
DROP TABLE IF EXISTS notices CASCADE;
DROP TABLE IF EXISTS staff CASCADE;
DROP TABLE IF EXISTS gallery CASCADE;
DROP TABLE IF EXISTS carousel CASCADE;
DROP TABLE IF EXISTS fees CASCADE;
DROP TABLE IF EXISTS links CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS achievements CASCADE;
DROP TABLE IF EXISTS transfer_certificates CASCADE;
DROP TABLE IF EXISTS "studentHonors" CASCADE;
DROP TABLE IF EXISTS navigation_menu CASCADE;
DROP TABLE IF EXISTS faqs CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS popups CASCADE;
DROP TABLE IF EXISTS marquee CASCADE;
DROP TABLE IF EXISTS former_principals CASCADE;
DROP TABLE IF EXISTS former_rectors CASCADE;
DROP TABLE IF EXISTS former_managers CASCADE;
DROP TABLE IF EXISTS student_leaders CASCADE;
DROP TABLE IF EXISTS streamwise_toppers CASCADE;
DROP TABLE IF EXISTS xavierite_of_the_year CASCADE;
DROP TABLE IF EXISTS useful_links CASCADE;
DROP TABLE IF EXISTS admins CASCADE;
DROP TABLE IF EXISTS logs CASCADE;
DROP TABLE IF EXISTS settings CASCADE;
DROP TABLE IF EXISTS content CASCADE;

-- Auth & Logs
CREATE TABLE admins (
    id TEXT PRIMARY KEY, 
    username TEXT UNIQUE NOT NULL, 
    password TEXT NOT NULL, 
    role TEXT DEFAULT 'staff',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE logs (
    id TEXT PRIMARY KEY,
    "user" TEXT NOT NULL,
    action TEXT NOT NULL,
    details TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. CREATE CAROUSEL TABLE (FIRST PRIORITY)
CREATE TABLE carousel (
    id TEXT PRIMARY KEY,
    url TEXT,
    caption TEXT,
    session TEXT,
    "attachmentUrl" TEXT
);

-- 3. CREATE REMAINING TABLES FOR OTHER MENUS
CREATE TABLE notices (id TEXT PRIMARY KEY, title TEXT, content TEXT, date TEXT, category TEXT, link TEXT, "attachmentUrl" TEXT);
CREATE TABLE staff (id TEXT PRIMARY KEY, name TEXT, role TEXT, bio TEXT DEFAULT '', image TEXT, type TEXT, "attachmentUrl" TEXT);
CREATE TABLE gallery (id TEXT PRIMARY KEY, url TEXT, caption TEXT, session TEXT, "attachmentUrl" TEXT);
CREATE TABLE fees (id TEXT PRIMARY KEY, category TEXT, particulars TEXT, amount TEXT, quarterly TEXT, remarks TEXT, order_index INTEGER DEFAULT 0, "attachmentUrl" TEXT);
CREATE TABLE links (id TEXT PRIMARY KEY, title TEXT, url TEXT, "isPriority" BOOLEAN DEFAULT false, icon TEXT, "attachmentUrl" TEXT);
CREATE TABLE events (id TEXT PRIMARY KEY, title TEXT, date TEXT, time TEXT, location TEXT, "attachmentUrl" TEXT);
CREATE TABLE achievements (id TEXT PRIMARY KEY, title TEXT, year TEXT, description TEXT, "attachmentUrl" TEXT);
CREATE TABLE transfer_certificates (id TEXT PRIMARY KEY, admission_number TEXT, dob TEXT, student_name TEXT, "attachmentUrl" TEXT);
CREATE TABLE "studentHonors" (id TEXT PRIMARY KEY, name TEXT, category TEXT, result TEXT, subtext TEXT, image TEXT, order_index INTEGER DEFAULT 0, "attachmentUrl" TEXT);
CREATE TABLE navigation_menu (id TEXT PRIMARY KEY, label TEXT, href TEXT, parent_id TEXT, order_index INTEGER DEFAULT 0, "attachmentUrl" TEXT);
CREATE TABLE faqs (id TEXT PRIMARY KEY, question TEXT, answer TEXT, category TEXT, order_index INTEGER DEFAULT 0, "attachmentUrl" TEXT);
CREATE TABLE messages (id TEXT PRIMARY KEY, name TEXT, email TEXT, subject TEXT, message TEXT, timestamp TEXT, status TEXT DEFAULT 'new', "attachmentUrl" TEXT);
CREATE TABLE popups (id TEXT PRIMARY KEY, title TEXT, header TEXT, type TEXT, content TEXT, "buttonText" TEXT, "buttonLink" TEXT, "isActive" BOOLEAN DEFAULT false, order_index INTEGER DEFAULT 0, "attachmentUrl" TEXT);
CREATE TABLE marquee (id TEXT PRIMARY KEY, text TEXT, link TEXT, "attachmentUrl" TEXT, "isActive" BOOLEAN DEFAULT true, order_index INTEGER DEFAULT 0);
CREATE TABLE former_principals (id TEXT PRIMARY KEY, name TEXT, tenure TEXT, image TEXT, order_index INTEGER DEFAULT 0, "attachmentUrl" TEXT);
CREATE TABLE former_rectors (id TEXT PRIMARY KEY, name TEXT, tenure TEXT, image TEXT, order_index INTEGER DEFAULT 0, "attachmentUrl" TEXT);
CREATE TABLE former_managers (id TEXT PRIMARY KEY, name TEXT, tenure TEXT, image TEXT, order_index INTEGER DEFAULT 0, "attachmentUrl" TEXT);
CREATE TABLE student_leaders (id TEXT PRIMARY KEY, name TEXT, role TEXT, academic_year TEXT, image TEXT, order_index INTEGER DEFAULT 0, "attachmentUrl" TEXT);
CREATE TABLE streamwise_toppers (id TEXT PRIMARY KEY, name TEXT, stream TEXT, percentage TEXT, academic_year TEXT, image TEXT, order_index INTEGER DEFAULT 0, "attachmentUrl" TEXT);
CREATE TABLE xavierite_of_the_year (id TEXT PRIMARY KEY, name TEXT, academic_year TEXT, citation TEXT, image TEXT, order_index INTEGER DEFAULT 0, "attachmentUrl" TEXT);
CREATE TABLE useful_links (id TEXT PRIMARY KEY, title TEXT, url TEXT, "isPriority" BOOLEAN DEFAULT false, icon TEXT, "attachmentUrl" TEXT);
CREATE TABLE settings (id TEXT PRIMARY KEY, "applyNowEnabled" BOOLEAN DEFAULT true, "applyNowUrl" TEXT, "applyNowLabel" TEXT, "siteName" TEXT, "siteLogo" TEXT, "contactEmail" TEXT, "contactPhone" TEXT, "contactAddress" TEXT, "currentSession" TEXT, "feesPdfUrl" TEXT, "popupMessage" TEXT, "popupEnabled" BOOLEAN DEFAULT false);
CREATE TABLE content (id TEXT PRIMARY KEY, key TEXT, value TEXT);

-- 4. ENABLE PUBLIC FULL ACCESS FOR ALL TABLES
DO $$ 
DECLARE
    t_name TEXT;
BEGIN 
    FOR t_name IN SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' 
    AND table_name NOT IN ('schema_migrations', 'pg_stat_statements')
    LOOP
        -- Enable RLS
        EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t_name);
        
        -- Drop any old policy
        EXECUTE format('DROP POLICY IF EXISTS "Public Full Access" ON %I', t_name);
        
        -- Create a blanket policy for ALL operations (Read, Insert, Update, Delete)
        EXECUTE format('
            CREATE POLICY "Public Full Access" ON %I 
            FOR ALL 
            TO public 
            USING (true) 
            WITH CHECK (true)
        ', t_name);
    END LOOP;

    -- Handle case-sensitive table if it persists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'studentHonors') THEN
        ALTER TABLE "studentHonors" ENABLE ROW LEVEL SECURITY;
        EXECUTE 'DROP POLICY IF EXISTS "Public Full Access" ON "studentHonors"';
        EXECUTE 'CREATE POLICY "Public Full Access" ON "studentHonors" FOR ALL TO public USING (true) WITH CHECK (true)';
    END IF;
END $$;

-- 5. FINAL SCHEMA CACHE RELOAD
NOTIFY pgrst, 'reload schema';

-- 6. STORAGE BUCKET SETUP (For Vercel/Production Uploads)
-- Create 'uploads' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for 'uploads' bucket
DROP POLICY IF EXISTS "Public Storage Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Storage Insert" ON storage.objects;
DROP POLICY IF EXISTS "Public Storage Update" ON storage.objects;
DROP POLICY IF EXISTS "Public Storage Delete" ON storage.objects;

CREATE POLICY "Public Storage Access" ON storage.objects FOR SELECT TO public USING (bucket_id = 'uploads');
CREATE POLICY "Public Storage Insert" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'uploads');
CREATE POLICY "Public Storage Update" ON storage.objects FOR UPDATE TO public USING (bucket_id = 'uploads');
CREATE POLICY "Public Storage Delete" ON storage.objects FOR DELETE TO public USING (bucket_id = 'uploads');

/********************************************************************************
  APPENDIX: FIX UUID TYPE ERRORS & RLS
  If you see "invalid input syntax for type uuid" OR "RLS policy" errors, 
  run these commands in your Supabase SQL Editor.
********************************************************************************/

-- A. Convert ID columns to TEXT (Fixes UUID vs STRING mismatch)
ALTER TABLE streamwise_toppers ALTER COLUMN id TYPE TEXT;
ALTER TABLE xavierite_of_the_year ALTER COLUMN id TYPE TEXT;
ALTER TABLE student_leaders ALTER COLUMN id TYPE TEXT;
ALTER TABLE former_principals ALTER COLUMN id TYPE TEXT;
ALTER TABLE former_rectors ALTER COLUMN id TYPE TEXT;
ALTER TABLE former_managers ALTER COLUMN id TYPE TEXT;
ALTER TABLE staff ALTER COLUMN id TYPE TEXT;
ALTER TABLE notices ALTER COLUMN id TYPE TEXT;
ALTER TABLE events ALTER COLUMN id TYPE TEXT;
ALTER TABLE achievements ALTER COLUMN id TYPE TEXT;
ALTER TABLE settings ALTER COLUMN id TYPE TEXT;
ALTER TABLE content ALTER COLUMN id TYPE TEXT;
ALTER TABLE carousel ALTER COLUMN id TYPE TEXT;
ALTER TABLE gallery ALTER COLUMN id TYPE TEXT;
ALTER TABLE fees ALTER COLUMN id TYPE TEXT;
ALTER TABLE links ALTER COLUMN id TYPE TEXT;
ALTER TABLE transfer_certificates ALTER COLUMN id TYPE TEXT;
ALTER TABLE "studentHonors" ALTER COLUMN id TYPE TEXT;
ALTER TABLE navigation_menu ALTER COLUMN id TYPE TEXT;
ALTER TABLE faqs ALTER COLUMN id TYPE TEXT;
ALTER TABLE messages ALTER COLUMN id TYPE TEXT;
ALTER TABLE popups ALTER COLUMN id TYPE TEXT;
ALTER TABLE marquee ALTER COLUMN id TYPE TEXT;
ALTER TABLE useful_links ALTER COLUMN id TYPE TEXT;
ALTER TABLE admins ALTER COLUMN id TYPE TEXT;
ALTER TABLE logs ALTER COLUMN id TYPE TEXT;

-- B. Re-apply RLS for ALL tables
DO $$ 
DECLARE
    t_name TEXT;
BEGIN 
    FOR t_name IN SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' 
    AND table_name NOT IN ('schema_migrations', 'pg_stat_statements')
    LOOP
        EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t_name);
        EXECUTE format('DROP POLICY IF EXISTS "Public Full Access" ON %I', t_name);
        EXECUTE format('CREATE POLICY "Public Full Access" ON %I FOR ALL TO public USING (true) WITH CHECK (true)', t_name);
    END LOOP;

    -- Special handle for quoted table name
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'studentHonors') THEN
        ALTER TABLE "studentHonors" ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Public Full Access" ON "studentHonors";
        CREATE POLICY "Public Full Access" ON "studentHonors" FOR ALL TO public USING (true) WITH CHECK (true);
    END IF;
END $$;

NOTIFY pgrst, 'reload schema';
