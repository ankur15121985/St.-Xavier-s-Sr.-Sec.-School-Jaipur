/********************************************************************************
  SUPABASE UPDATE SCRIPT (ADDITIVE - NO DATA LOSS)
  Only creates missing tables and columns. 
  Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
********************************************************************************/

-- 1. Create missing tables
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

CREATE TABLE IF NOT EXISTS navigation_menu (
    id TEXT PRIMARY KEY,
    label TEXT,
    href TEXT,
    parent_id TEXT,
    order_index INTEGER DEFAULT 0,
    "attachmentUrl" TEXT
);

CREATE TABLE IF NOT EXISTS former_leaders (
    id TEXT PRIMARY KEY,
    name TEXT,
    role TEXT,
    tenure TEXT,
    image TEXT,
    order_index INTEGER DEFAULT 0,
    "attachmentUrl" TEXT,
    is_enabled BOOLEAN DEFAULT true,
    type TEXT DEFAULT 'Principal'
);

-- 2. Add missing columns to settings table
DO $$
BEGIN
    -- Existing flag/session columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'settings' AND column_name = 'flagImage') THEN
        ALTER TABLE settings ADD COLUMN "flagImage" TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'settings' AND column_name = 'flagEnabled') THEN
        ALTER TABLE settings ADD COLUMN "flagEnabled" BOOLEAN DEFAULT true;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'settings' AND column_name = 'currentSession') THEN
        ALTER TABLE settings ADD COLUMN "currentSession" TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'settings' AND column_name = 'feesPdfUrl') THEN
        ALTER TABLE settings ADD COLUMN "feesPdfUrl" TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'settings' AND column_name = 'aboutTitle') THEN
        ALTER TABLE settings ADD COLUMN "aboutTitle" TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'settings' AND column_name = 'aboutContent') THEN
        ALTER TABLE settings ADD COLUMN "aboutContent" TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'settings' AND column_name = 'historyTitle') THEN
        ALTER TABLE settings ADD COLUMN "historyTitle" TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'settings' AND column_name = 'historyContent') THEN
        ALTER TABLE settings ADD COLUMN "historyContent" TEXT;
    END IF;

    -- NEW: Visibility Flags
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'settings' AND column_name = 'showCarousel') THEN
        ALTER TABLE settings ADD COLUMN "showCarousel" BOOLEAN DEFAULT true;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'settings' AND column_name = 'showMarquee') THEN
        ALTER TABLE settings ADD COLUMN "showMarquee" BOOLEAN DEFAULT true;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'settings' AND column_name = 'showAbout') THEN
        ALTER TABLE settings ADD COLUMN "showAbout" BOOLEAN DEFAULT true;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'settings' AND column_name = 'showFeature') THEN
        ALTER TABLE settings ADD COLUMN "showFeature" BOOLEAN DEFAULT true;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'settings' AND column_name = 'showVision') THEN
        ALTER TABLE settings ADD COLUMN "showVision" BOOLEAN DEFAULT true;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'settings' AND column_name = 'showInsights') THEN
        ALTER TABLE settings ADD COLUMN "showInsights" BOOLEAN DEFAULT true;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'settings' AND column_name = 'showPrincipalMessage') THEN
        ALTER TABLE settings ADD COLUMN "showPrincipalMessage" BOOLEAN DEFAULT true;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'settings' AND column_name = 'showDistinction') THEN
        ALTER TABLE settings ADD COLUMN "showDistinction" BOOLEAN DEFAULT true;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'settings' AND column_name = 'showGallery') THEN
        ALTER TABLE settings ADD COLUMN "showGallery" BOOLEAN DEFAULT true;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'settings' AND column_name = 'showLeadership') THEN
        ALTER TABLE settings ADD COLUMN "showLeadership" BOOLEAN DEFAULT true;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'settings' AND column_name = 'showHonors') THEN
        ALTER TABLE settings ADD COLUMN "showHonors" BOOLEAN DEFAULT true;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'settings' AND column_name = 'popupEnabled') THEN
        ALTER TABLE settings ADD COLUMN "popupEnabled" BOOLEAN DEFAULT true;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'settings' AND column_name = 'popupMessage') THEN
        ALTER TABLE settings ADD COLUMN "popupMessage" TEXT;
    END IF;
END $$;

-- 3. Add is_enabled to content tables
DO $$
DECLARE
    t_name TEXT;
    tables_to_update TEXT[] := ARRAY[
        'notices', 'staff', 'gallery', 'links', 'events', 'achievements', 'studentHonors', 
        'navigation_menu', 'carousel', 'faqs', 'custom_content', 'former_leaders',
        'former_principals', 'former_rectors', 'former_managers', 'student_leaders', 
        'streamwise_toppers', 'xavierite_of_the_year', 'lead_grace'
    ];
BEGIN
    FOREACH t_name IN ARRAY tables_to_update
    LOOP
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = t_name) THEN
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = t_name AND column_name = 'is_enabled') THEN
                EXECUTE format('ALTER TABLE %I ADD COLUMN is_enabled BOOLEAN DEFAULT true', t_name);
            END IF;
        END IF;
    END LOOP;
END $$;

-- school_history table
CREATE TABLE IF NOT EXISTS school_history (
    id TEXT PRIMARY KEY,
    title TEXT,
    content TEXT,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- digital_campus table
CREATE TABLE IF NOT EXISTS digital_campus (
    id TEXT PRIMARY KEY DEFAULT 'current',
    title TEXT DEFAULT 'Legacy in Motion',
    model_url TEXT,
    is_enabled BOOLEAN DEFAULT true,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Add foreign keys if not exists (using DO block for safety)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_useful_links_notice'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.tables WHERE table_name = 'notices'
    ) THEN
        ALTER TABLE useful_links ADD CONSTRAINT fk_useful_links_notice FOREIGN KEY ("noticeId") REFERENCES notices(id) ON DELETE SET NULL;
    END IF;
END $$;

-- 5. Ensure RLS and Policies (Runs on all public tables)
DO $$ 
DECLARE
    t_name TEXT;
BEGIN 
    FOR t_name IN SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' 
    AND table_name NOT IN ('schema_migrations', 'pg_stat_statements')
    LOOP
        EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t_name);
        EXECUTE format('DROP POLICY IF EXISTS "Public Full Access" ON %I', t_name);
        EXECUTE format('
            CREATE POLICY "Public Full Access" ON %I 
            FOR ALL 
            TO public 
            USING (true) 
            WITH CHECK (true)
        ', t_name);
    END LOOP;

    -- Handle studentHonors explicitly due to case sensitivity in some environments
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'studentHonors') THEN
        ALTER TABLE "studentHonors" ENABLE ROW LEVEL SECURITY;
        EXECUTE 'DROP POLICY IF EXISTS "Public Full Access" ON "studentHonors"';
        EXECUTE 'CREATE POLICY "Public Full Access" ON "studentHonors" FOR ALL TO public USING (true) WITH CHECK (true)';
    END IF;
END $$;

-- 6. Reload Schema Cache
NOTIFY pgrst, 'reload schema';
