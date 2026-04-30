/*******************************************************************************
  MASTER SUPABASE SETUP SCRIPT
  Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
********************************************************************************/

-- 1. CREATE ALL TABLES (IF NOT EXISTS)
CREATE TABLE IF NOT EXISTS notices (id TEXT PRIMARY KEY);
CREATE TABLE IF NOT EXISTS staff (id TEXT PRIMARY KEY);
CREATE TABLE IF NOT EXISTS gallery (id TEXT PRIMARY KEY);
CREATE TABLE IF NOT EXISTS carousel (id TEXT PRIMARY KEY);
CREATE TABLE IF NOT EXISTS fees (id TEXT PRIMARY KEY);
CREATE TABLE IF NOT EXISTS links (id TEXT PRIMARY KEY);
CREATE TABLE IF NOT EXISTS events (id TEXT PRIMARY KEY);
CREATE TABLE IF NOT EXISTS achievements (id TEXT PRIMARY KEY);
CREATE TABLE IF NOT EXISTS transfer_certificates (id TEXT PRIMARY KEY);
CREATE TABLE IF NOT EXISTS "studentHonors" (id TEXT PRIMARY KEY);
CREATE TABLE IF NOT EXISTS menu (id TEXT PRIMARY KEY);
CREATE TABLE IF NOT EXISTS faqs (id TEXT PRIMARY KEY);
CREATE TABLE IF NOT EXISTS messages (id TEXT PRIMARY KEY);
CREATE TABLE IF NOT EXISTS popups (id TEXT PRIMARY KEY);
CREATE TABLE IF NOT EXISTS settings (id TEXT PRIMARY KEY);
CREATE TABLE IF NOT EXISTS content (id TEXT PRIMARY KEY);

-- 2. MIGRATION: ADD ALL COLUMNS TO ALL TABLES
-- This ensures that even if tables already existed, they get the new columns.
DO $$ 
BEGIN 
    -- Notices
    BEGIN ALTER TABLE notices ADD COLUMN title TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE notices ADD COLUMN content TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE notices ADD COLUMN date TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE notices ADD COLUMN category TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE notices ADD COLUMN link TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE notices ADD COLUMN "attachmentUrl" TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;

    -- Staff
    BEGIN ALTER TABLE staff ADD COLUMN name TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE staff ADD COLUMN role TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE staff ADD COLUMN bio TEXT DEFAULT ''; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE staff ADD COLUMN image TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE staff ADD COLUMN type TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE staff ADD COLUMN "attachmentUrl" TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;

    -- Gallery
    BEGIN ALTER TABLE gallery ADD COLUMN url TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE gallery ADD COLUMN caption TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE gallery ADD COLUMN session TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE gallery ADD COLUMN "attachmentUrl" TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;

    -- Carousel
    BEGIN ALTER TABLE carousel ADD COLUMN url TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE carousel ADD COLUMN caption TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE carousel ADD COLUMN session TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE carousel ADD COLUMN "attachmentUrl" TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;

    -- Fees
    BEGIN ALTER TABLE fees ADD COLUMN category TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE fees ADD COLUMN particulars TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE fees ADD COLUMN amount TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE fees ADD COLUMN quarterly TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE fees ADD COLUMN remarks TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE fees ADD COLUMN order_index INTEGER DEFAULT 0; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE fees ADD COLUMN "attachmentUrl" TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;

    -- Links
    BEGIN ALTER TABLE links ADD COLUMN title TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE links ADD COLUMN url TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE links ADD COLUMN "isPriority" BOOLEAN DEFAULT false; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE links ADD COLUMN icon TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE links ADD COLUMN "attachmentUrl" TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;

    -- Events
    BEGIN ALTER TABLE events ADD COLUMN title TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE events ADD COLUMN date TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE events ADD COLUMN time TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE events ADD COLUMN location TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE events ADD COLUMN "attachmentUrl" TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;

    -- Achievements
    BEGIN ALTER TABLE achievements ADD COLUMN title TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE achievements ADD COLUMN year TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE achievements ADD COLUMN description TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE achievements ADD COLUMN "attachmentUrl" TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    
    -- Student Honors
    BEGIN ALTER TABLE "studentHonors" ADD COLUMN name TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE "studentHonors" ADD COLUMN category TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE "studentHonors" ADD COLUMN result TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE "studentHonors" ADD COLUMN subtext TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE "studentHonors" ADD COLUMN image TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE "studentHonors" ADD COLUMN order_index INTEGER DEFAULT 0; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE "studentHonors" ADD COLUMN "attachmentUrl" TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;

    -- Menu
    BEGIN ALTER TABLE menu ADD COLUMN label TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE menu ADD COLUMN href TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE menu ADD COLUMN parent_id TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE menu ADD COLUMN order_index INTEGER DEFAULT 0; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE menu ADD COLUMN "attachmentUrl" TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;

    -- FAQs
    BEGIN ALTER TABLE faqs ADD COLUMN question TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE faqs ADD COLUMN answer TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE faqs ADD COLUMN category TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE faqs ADD COLUMN order_index INTEGER DEFAULT 0; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE faqs ADD COLUMN "attachmentUrl" TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;

    -- Messages
    BEGIN ALTER TABLE messages ADD COLUMN name TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE messages ADD COLUMN email TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE messages ADD COLUMN subject TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE messages ADD COLUMN message TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE messages ADD COLUMN timestamp TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE messages ADD COLUMN status TEXT DEFAULT 'new'; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE messages ADD COLUMN "attachmentUrl" TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;

    -- Popups
    BEGIN ALTER TABLE popups ADD COLUMN title TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE popups ADD COLUMN type TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE popups ADD COLUMN content TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE popups ADD COLUMN "buttonText" TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE popups ADD COLUMN "buttonLink" TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE popups ADD COLUMN "isActive" BOOLEAN DEFAULT false; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE popups ADD COLUMN order_index INTEGER DEFAULT 0; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE popups ADD COLUMN "attachmentUrl" TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;

    -- Settings
    BEGIN ALTER TABLE settings ADD COLUMN "applyNowEnabled" BOOLEAN DEFAULT true; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE settings ADD COLUMN "applyNowUrl" TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE settings ADD COLUMN "applyNowLabel" TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE settings ADD COLUMN "siteName" TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE settings ADD COLUMN "siteLogo" TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE settings ADD COLUMN "contactEmail" TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE settings ADD COLUMN "contactPhone" TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE settings ADD COLUMN "contactAddress" TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE settings ADD COLUMN "currentSession" TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE settings ADD COLUMN "feesPdfUrl" TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE settings ADD COLUMN "popupMessage" TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE settings ADD COLUMN "popupEnabled" BOOLEAN DEFAULT false; EXCEPTION WHEN duplicate_column THEN NULL; END;
    
    -- Content
    BEGIN ALTER TABLE content ADD COLUMN key TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE content ADD COLUMN value TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
END $$;

-- 3. ENABLE PUBLIC ACCESS FOR ALL TABLES
-- This allows the Admin Portal to read/write/update without auth blocks during testing.

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
        
        RAISE NOTICE 'Permissions set for %', t_name;
    END LOOP;

    -- Handle case-sensitive table if it persists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'studentHonors') THEN
        ALTER TABLE "studentHonors" ENABLE ROW LEVEL SECURITY;
        EXECUTE 'DROP POLICY IF EXISTS "Public Full Access" ON "studentHonors"';
        EXECUTE 'CREATE POLICY "Public Full Access" ON "studentHonors" FOR ALL TO public USING (true) WITH CHECK (true)';
    END IF;
END $$;

-- 3. FINAL SCHEMA CACHE RELOAD
NOTIFY pgrst, 'reload schema';
