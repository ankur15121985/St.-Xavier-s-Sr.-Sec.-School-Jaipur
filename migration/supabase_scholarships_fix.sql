-- SQL script to fix missing scholarships table in Supabase
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

CREATE TABLE IF NOT EXISTS scholarships (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT,
    heading TEXT,
    content TEXT,
    order_index INTEGER DEFAULT 0,
    "attachmentUrl" TEXT,
    "image_url" TEXT,
    is_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security
ALTER TABLE scholarships ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists and create a new public access policy
DROP POLICY IF EXISTS "Public Full Access" ON scholarships;
CREATE POLICY "Public Full Access" ON scholarships FOR ALL TO public USING (true) WITH CHECK (true);

-- Grant permissions to all roles
GRANT ALL ON TABLE scholarships TO anon, authenticated, postgres, service_role;

-- Reload the PostgREST schema cache to make the table visible immediately
NOTIFY pgrst, 'reload schema';
