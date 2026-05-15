-- SUPABASE CAREERS UPDATE: Add teacher_category column
-- Run this in your Supabase SQL Editor

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='career_applications' AND column_name='teacher_category') THEN
        ALTER TABLE career_applications ADD COLUMN teacher_category TEXT;
    END IF;
END $$;

-- Reload schema cache
NOTIFY pgrst, 'reload schema';
