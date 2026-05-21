-- UPDATE CAREER APPLICATIONS SCHEMA
-- Adds Address, Photo, Application ID, IP, and Declaration fields

ALTER TABLE career_applications 
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS photo_url TEXT,
ADD COLUMN IF NOT EXISTS application_no TEXT,
ADD COLUMN IF NOT EXISTS user_ip TEXT,
ADD COLUMN IF NOT EXISTS declaration_accepted BOOLEAN DEFAULT false;

-- Create storage bucket for photos
-- Run this in Supabase SQL Editor to enable photo uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('career_assets', 'career_assets', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies to allow public uploads (simplified for dev)
CREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'career_assets');
CREATE POLICY "Public View" ON storage.objects FOR SELECT USING (bucket_id = 'career_assets');
