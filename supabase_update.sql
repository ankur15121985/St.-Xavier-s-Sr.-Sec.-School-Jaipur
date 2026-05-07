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

-- Enable RLS and set policies
ALTER TABLE page_sections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Full Access" ON page_sections;
CREATE POLICY "Public Full Access" ON page_sections FOR ALL TO public USING (true) WITH CHECK (true);
GRANT ALL ON TABLE page_sections TO anon, authenticated, postgres, service_role;

-- Notify schema reload
NOTIFY pgrst, 'reload schema';
