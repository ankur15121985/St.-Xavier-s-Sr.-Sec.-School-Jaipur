-- DEDICATED FIRE SAFETY MANAGEMENT TABLE
-- This table allows attaching PDF, Images, and Links to any safety heading or text.

DROP TABLE IF EXISTS fire_safety;

CREATE TABLE fire_safety (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT,
    heading TEXT,
    content TEXT,
    display_type TEXT DEFAULT 'tile', 
    order_index INTEGER DEFAULT 0,
    "attachmentUrl" TEXT,
    "image_url" TEXT,
    is_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security
ALTER TABLE fire_safety ENABLE ROW LEVEL SECURITY;

-- Create policy for public access
CREATE POLICY "Public Full Access Fire Safety" ON fire_safety FOR ALL TO public USING (true) WITH CHECK (true);

-- Grant permissions
GRANT ALL ON TABLE fire_safety TO anon, authenticated, postgres, service_role;

-- Seed initial content
INSERT INTO fire_safety (title, heading, content, "attachmentUrl", display_type) VALUES 
('Fire Safety Certificate (2024-25)', 'Official Certification', 'Valid certificate issued by the competent regional authority for the current academic session.', '/placeholder.pdf', 'tile'),
('Emergency Evacuation Plan', 'School Blueprint', 'Detailed floor map showing exits, assembly points, and extinguisher locations.', null, 'text'),
('Mock Drill Sessions', 'Practical Training', 'Regular drills conducted every quarter to ensure preparedness among students and staff.', null, 'tile');

-- Notify schema cache
NOTIFY pgrst, 'reload schema';
