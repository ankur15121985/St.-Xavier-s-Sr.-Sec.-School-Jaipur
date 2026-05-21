-- SQL script to create scholarships table in Supabase
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

CREATE TABLE IF NOT EXISTS scholarships (
    id TEXT PRIMARY KEY,
    title TEXT,
    heading TEXT,
    content TEXT,
    order_index INTEGER DEFAULT 0,
    "attachmentUrl" TEXT,
    "image_url" TEXT,
    is_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS and grant access
ALTER TABLE scholarships ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Full Access" ON scholarships;
CREATE POLICY "Public Full Access" ON scholarships FOR ALL TO public USING (true) WITH CHECK (true);
GRANT ALL ON TABLE scholarships TO anon, authenticated, postgres, service_role;

-- Reload schema cache
NOTIFY pgrst, 'reload schema';
