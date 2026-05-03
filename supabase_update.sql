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

-- 2. Add foreign keys if not exists (using DO block for safety)
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

-- 3. Ensure RLS and Policies (Runs on all public tables)
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
END $$;

-- 4. Reload Schema Cache
NOTIFY pgrst, 'reload schema';
