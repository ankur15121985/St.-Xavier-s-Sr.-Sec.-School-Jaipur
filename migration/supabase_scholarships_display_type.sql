-- Add display_type column to scholarships table
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS display_type TEXT DEFAULT 'tile';

-- Update existing rows to default 'tile'
UPDATE scholarships SET display_type = 'tile' WHERE display_type IS NULL;

-- Reload schema
NOTIFY pgrst, 'reload schema';
