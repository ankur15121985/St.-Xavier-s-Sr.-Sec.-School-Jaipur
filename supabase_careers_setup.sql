-- SUPABASE CAREERS SETUP
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS career_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL,
    full_name TEXT NOT NULL,
    parent_spouse_name TEXT NOT NULL,
    mobile_number TEXT NOT NULL,
    email TEXT NOT NULL,
    gender TEXT NOT NULL,
    dob TEXT NOT NULL,
    aadhar_number TEXT NOT NULL,
    major_subject TEXT,
    minor_subject_1 TEXT,
    minor_subject_2 TEXT,
    salary_expected TEXT,
    tet_details TEXT,
    interests TEXT,
    responsibilities_handled TEXT,
    statement_of_purpose TEXT,
    other_experience TEXT,
    education_qualifications JSONB DEFAULT '[]'::jsonb,
    teaching_experience JSONB DEFAULT '[]'::jsonb,
    achievements JSONB DEFAULT '[]'::jsonb,
    status TEXT DEFAULT 'Received',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE career_applications ENABLE ROW LEVEL SECURITY;

-- Drop existing patterns if any
DROP POLICY IF EXISTS "Public Insert Access" ON career_applications;
DROP POLICY IF EXISTS "Admin Full Access" ON career_applications;
DROP POLICY IF EXISTS "Public Full Access" ON career_applications;

-- We follow the project's pattern of public full access for development simplicity,
-- but ideally this should be restricted.
CREATE POLICY "Public Full Access" ON career_applications 
FOR ALL TO public 
USING (true) 
WITH CHECK (true);

-- Grant permissions
GRANT ALL ON TABLE career_applications TO anon, authenticated, postgres, service_role;

-- Notify schema reload
NOTIFY pgrst, 'reload schema';
