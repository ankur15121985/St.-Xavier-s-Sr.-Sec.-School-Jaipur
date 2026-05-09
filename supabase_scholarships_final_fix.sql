-- FINAL COMPREHENSIVE FIX FOR SCHOLARSHIPS TABLE
-- Use this if you are getting "attachmentUrl" column errors or "missing table" errors.
-- WARNING: This will drop the existing scholarships table and recreate it.

DROP TABLE IF EXISTS scholarships;

CREATE TABLE scholarships (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT,
    heading TEXT,
    content TEXT,
    display_type TEXT DEFAULT 'tile',
    category TEXT DEFAULT 'General Concessions',
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

-- IMPORTANT: Reload the PostgREST schema cache to make column changes visible immediately
-- If NOTIFY doesn't work, you might need to run this as superuser or just wait 30 seconds.
NOTIFY pgrst, 'reload schema';

-- Verify the table exists in public schema
SELECT * FROM scholarships LIMIT 1;
