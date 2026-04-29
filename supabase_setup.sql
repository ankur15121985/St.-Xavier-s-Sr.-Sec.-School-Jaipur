/*******************************************************************************
  MASTER SUPABASE SETUP SCRIPT
  Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
********************************************************************************/

-- 1. CREATE ALL TABLES
-- These matches exactly with the AppData types for seamless sync.

CREATE TABLE IF NOT EXISTS notices (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT,
    date TEXT,
    category TEXT,
    link TEXT,
    "attachmentUrl" TEXT
);

CREATE TABLE IF NOT EXISTS staff (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT,
    bio TEXT DEFAULT '',
    image TEXT,
    type TEXT,
    "attachmentUrl" TEXT
);

CREATE TABLE IF NOT EXISTS gallery (
    id TEXT PRIMARY KEY,
    url TEXT,
    caption TEXT,
    session TEXT,
    "attachmentUrl" TEXT
);

CREATE TABLE IF NOT EXISTS carousel (
    id TEXT PRIMARY KEY,
    url TEXT,
    caption TEXT,
    session TEXT,
    "attachmentUrl" TEXT
);

CREATE TABLE IF NOT EXISTS fees (
    id TEXT PRIMARY KEY,
    category TEXT,
    particulars TEXT,
    amount TEXT,
    quarterly TEXT,
    remarks TEXT,
    order_index INTEGER DEFAULT 0,
    "attachmentUrl" TEXT
);

CREATE TABLE IF NOT EXISTS links (
    id TEXT PRIMARY KEY,
    title TEXT,
    url TEXT,
    "isPriority" BOOLEAN DEFAULT false,
    icon TEXT,
    "attachmentUrl" TEXT
);

CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    title TEXT,
    date TEXT,
    time TEXT,
    location TEXT,
    "attachmentUrl" TEXT
);

CREATE TABLE IF NOT EXISTS achievements (
    id TEXT PRIMARY KEY,
    title TEXT,
    year TEXT,
    description TEXT,
    "attachmentUrl" TEXT
);

CREATE TABLE IF NOT EXISTS transfer_certificates (
    id TEXT PRIMARY KEY,
    admission_number TEXT,
    dob TEXT,
    student_name TEXT,
    "attachmentUrl" TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "studentHonors" (
    id TEXT PRIMARY KEY,
    name TEXT,
    category TEXT,
    result TEXT,
    subtext TEXT,
    image TEXT,
    order_index INTEGER DEFAULT 0,
    "attachmentUrl" TEXT
);

CREATE TABLE IF NOT EXISTS menu (
    id TEXT PRIMARY KEY,
    label TEXT,
    href TEXT,
    parent_id TEXT,
    order_index INTEGER DEFAULT 0,
    "attachmentUrl" TEXT
);

CREATE TABLE IF NOT EXISTS faqs (
    id TEXT PRIMARY KEY,
    question TEXT,
    answer TEXT,
    category TEXT,
    order_index INTEGER DEFAULT 0,
    "attachmentUrl" TEXT
);

CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT,
    subject TEXT,
    message TEXT,
    timestamp TEXT,
    status TEXT DEFAULT 'new',
    "attachmentUrl" TEXT
);

CREATE TABLE IF NOT EXISTS popups (
    id TEXT PRIMARY KEY,
    title TEXT,
    type TEXT,
    content TEXT,
    "buttonText" TEXT,
    "buttonLink" TEXT,
    "isActive" BOOLEAN DEFAULT false,
    order_index INTEGER DEFAULT 0,
    "attachmentUrl" TEXT
);

CREATE TABLE IF NOT EXISTS settings (
    id TEXT PRIMARY KEY,
    "applyNowEnabled" BOOLEAN DEFAULT true,
    "applyNowUrl" TEXT,
    "applyNowLabel" TEXT,
    "siteName" TEXT,
    "siteLogo" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "contactAddress" TEXT,
    "currentSession" TEXT,
    "feesPdfUrl" TEXT,
    "popupMessage" TEXT,
    "popupEnabled" BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS content (
    id TEXT PRIMARY KEY,
    key TEXT,
    value TEXT
);

-- 2. ENABLE PUBLIC ACCESS FOR ALL TABLES
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
