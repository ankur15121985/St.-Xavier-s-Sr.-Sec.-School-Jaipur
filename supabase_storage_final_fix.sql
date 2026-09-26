-- STORAGE FINAL FIX
-- Ensures 'career_assets' bucket exists, is public, and has all necessary RLS policies

-- 1. Create or Update Bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'career_assets', 
    'career_assets', 
    true, 
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Drop existing policies to prevent conflicts
DROP POLICY IF EXISTS "Public Upload" ON storage.objects;
DROP POLICY IF EXISTS "Public View" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete" ON storage.objects;
DROP POLICY IF EXISTS "Public Update" ON storage.objects;

-- 3. Create robust policies for 'career_assets'
-- Allow public to INSERT new files
CREATE POLICY "Public Upload" ON storage.objects 
FOR INSERT TO public 
WITH CHECK (bucket_id = 'career_assets');

-- Allow public to VIEW files
CREATE POLICY "Public View" ON storage.objects 
FOR SELECT TO public 
USING (bucket_id = 'career_assets');

-- Allow public to UPDATE files (needed for upsert)
CREATE POLICY "Public Update" ON storage.objects 
FOR UPDATE TO public 
USING (bucket_id = 'career_assets');

-- Allow public to DELETE files (needed for removal feature)
CREATE POLICY "Public Delete" ON storage.objects 
FOR DELETE TO public 
USING (bucket_id = 'career_assets');

-- 4. Do the same for 'uploads' bucket as a backup standard
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Storage Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Storage Insert" ON storage.objects;
DROP POLICY IF EXISTS "Public Storage Update" ON storage.objects;
DROP POLICY IF EXISTS "Public Storage Delete" ON storage.objects;

CREATE POLICY "Public Storage Access" ON storage.objects FOR SELECT TO public USING (bucket_id = 'uploads');
CREATE POLICY "Public Storage Insert" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'uploads');
CREATE POLICY "Public Storage Update" ON storage.objects FOR UPDATE TO public USING (bucket_id = 'uploads');
CREATE POLICY "Public Storage Delete" ON storage.objects FOR DELETE TO public USING (bucket_id = 'uploads');

-- Grant all permissions
GRANT ALL ON TABLE storage.objects TO anon, authenticated, postgres, service_role;
GRANT ALL ON TABLE storage.buckets TO anon, authenticated, postgres, service_role;
