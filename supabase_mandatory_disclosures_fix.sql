-- SUPABASE FIX: Add category column to mandatory_disclosures
-- Run this in your Supabase SQL Editor

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='mandatory_disclosures' AND column_name='category') THEN
        ALTER TABLE mandatory_disclosures ADD COLUMN category TEXT;
    END IF;
END $$;

-- Enable RLS and set policies (re-ensure)
ALTER TABLE mandatory_disclosures ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Full Access" ON mandatory_disclosures;
CREATE POLICY "Public Full Access" ON mandatory_disclosures FOR ALL TO public USING (true) WITH CHECK (true);
GRANT ALL ON TABLE mandatory_disclosures TO anon, authenticated, postgres, service_role;

-- Reload schema cache
NOTIFY pgrst, 'reload schema';
