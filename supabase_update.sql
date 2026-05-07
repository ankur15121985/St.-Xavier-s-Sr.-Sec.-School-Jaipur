-- SUPABASE UPDATE SCRIPT: PAGE SECTIONS
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS page_sections (
    id TEXT PRIMARY KEY,
    page_id TEXT NOT NULL,
    section_key TEXT,
    title TEXT,
    heading TEXT,
    content TEXT,
    image_url TEXT,
    "attachmentUrl" TEXT,
    is_enabled BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- UPDATE SETTINGS TABLE: Add missing columns if they don't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='showVirtualCampus') THEN
        ALTER TABLE settings ADD COLUMN "showVirtualCampus" BOOLEAN DEFAULT true;
    END IF;
END $$;

-- Enable RLS and set policies
ALTER TABLE page_sections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Full Access" ON page_sections;
CREATE POLICY "Public Full Access" ON page_sections FOR ALL TO public USING (true) WITH CHECK (true);
GRANT ALL ON TABLE page_sections TO anon, authenticated, postgres, service_role;

-- Ensure settings has a robust public policy as well
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Full Access" ON settings;
CREATE POLICY "Public Full Access" ON settings FOR ALL TO public USING (true) WITH CHECK (true);
GRANT ALL ON TABLE settings TO anon, authenticated, postgres, service_role;

-- Notify schema reload
NOTIFY pgrst, 'reload schema';
