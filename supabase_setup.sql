/********************************************************************************
  SUPABASE SETUP SCRIPT (ULTRA-CLEAN SLATE RESET)
  Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
********************************************************************************/

-- 1. (OPTIONAL) RESET TABLES - COMMENTED OUT FOR SAFETY
-- To reset a specific table, uncomment the line below:
-- DROP TABLE IF EXISTS notices CASCADE;
-- ... etc.

-- 2. CREATE SYSTEM TABLES
CREATE TABLE IF NOT EXISTS admins (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'staff' CHECK (role IN ('admin', 'staff')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS logs (
    id TEXT PRIMARY KEY,
    "user" TEXT NOT NULL,
    action TEXT NOT NULL,
    details TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
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
    "popupEnabled" BOOLEAN DEFAULT true,
    "popupMessage" TEXT,
    "flagImage" TEXT,
    "flagEnabled" BOOLEAN DEFAULT true,
    "currentSession" TEXT,
    "feesPdfUrl" TEXT
);

CREATE TABLE IF NOT EXISTS content (
    id TEXT DEFAULT 'global',
    key TEXT PRIMARY KEY,
    value TEXT
);

-- 3. SCHOOL DATA TABLES
CREATE TABLE IF NOT EXISTS notices (
    id TEXT PRIMARY KEY,
    title TEXT,
    content TEXT,
    date TEXT,
    category TEXT,
    link TEXT,
    "attachmentUrl" TEXT
);

CREATE TABLE IF NOT EXISTS staff (
    id TEXT PRIMARY KEY,
    name TEXT,
    role TEXT,
    bio TEXT,
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

CREATE TABLE IF NOT EXISTS navigation_menu (
    id TEXT PRIMARY KEY,
    label TEXT,
    href TEXT,
    parent_id TEXT,
    order_index INTEGER DEFAULT 0,
    "attachmentUrl" TEXT
);

CREATE TABLE IF NOT EXISTS carousel (
    id TEXT PRIMARY KEY,
    url TEXT,
    caption TEXT,
    session TEXT,
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

CREATE TABLE IF NOT EXISTS transfer_certificates (
    id TEXT PRIMARY KEY,
    admission_number TEXT,
    dob TEXT,
    student_name TEXT,
    "attachmentUrl" TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT,
    subject TEXT,
    message TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    status TEXT DEFAULT 'new'
);

CREATE TABLE IF NOT EXISTS popups (
    id TEXT PRIMARY KEY,
    title TEXT,
    header TEXT,
    type TEXT,
    content TEXT,
    "buttonText" TEXT,
    "buttonLink" TEXT,
    "isActive" BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    "attachmentUrl" TEXT
);

CREATE TABLE IF NOT EXISTS marquee (
    id TEXT PRIMARY KEY,
    text TEXT,
    link TEXT,
    "isActive" BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    "attachmentUrl" TEXT
);

-- LEADERSHIP HISTORY
CREATE TABLE IF NOT EXISTS former_principals (id TEXT PRIMARY KEY, name TEXT, tenure TEXT, image TEXT, order_index INTEGER DEFAULT 0, "attachmentUrl" TEXT);
CREATE TABLE IF NOT EXISTS former_rectors (id TEXT PRIMARY KEY, name TEXT, tenure TEXT, image TEXT, order_index INTEGER DEFAULT 0, "attachmentUrl" TEXT);
CREATE TABLE IF NOT EXISTS former_managers (id TEXT PRIMARY KEY, name TEXT, tenure TEXT, image TEXT, order_index INTEGER DEFAULT 0, "attachmentUrl" TEXT);
CREATE TABLE IF NOT EXISTS student_leaders (id TEXT PRIMARY KEY, name TEXT, role TEXT, academic_year TEXT, image TEXT, order_index INTEGER DEFAULT 0, "attachmentUrl" TEXT);
CREATE TABLE IF NOT EXISTS streamwise_toppers (id TEXT PRIMARY KEY, name TEXT, stream TEXT, percentage TEXT, academic_year TEXT, image TEXT, order_index INTEGER DEFAULT 0, "attachmentUrl" TEXT);
CREATE TABLE IF NOT EXISTS xavierite_of_the_year (id TEXT PRIMARY KEY, name TEXT, academic_year TEXT, citation TEXT, image TEXT, order_index INTEGER DEFAULT 0, "attachmentUrl" TEXT);

CREATE TABLE IF NOT EXISTS custom_content (
    id TEXT PRIMARY KEY,
    title TEXT,
    heading TEXT,
    content TEXT,
    order_index INTEGER DEFAULT 0,
    "attachmentUrl" TEXT
);

CREATE TABLE IF NOT EXISTS useful_links (
    id TEXT PRIMARY KEY,
    title TEXT,
    url TEXT,
    "isPriority" BOOLEAN DEFAULT false,
    icon TEXT,
    "attachmentUrl" TEXT,
    "noticeId" TEXT
);

-- 4. RELATIONSHIPS
ALTER TABLE useful_links ADD CONSTRAINT fk_notice FOREIGN KEY ("noticeId") REFERENCES notices(id) ON DELETE SET NULL;

-- 5. ENABLE PUBLIC FULL ACCESS FOR ALL TABLES (DEVELOPMENT MODE)
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
        
        -- Create a blanket policy for ALL operations
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

-- 6. STORAGE BUCKET SETUP
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

-- 7. RELOAD SCHEMA CACHE (CRITICAL FOR PGRST204 ERRORS)
NOTIFY pgrst, 'reload schema';
