-- SUPABASE UPDATE SCRIPT: PAGE SECTIONS
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS page_sections (
    id TEXT PRIMARY KEY,
    page_id TEXT NOT NULL,
    section_key TEXT,
    title TEXT,
    heading TEXT,
    content TEXT,
    image_url TEXT,
    "attachmentUrl" TEXT,
    is_enabled BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- UPDATE SETTINGS TABLE: Add missing columns if they don't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='showVirtualCampus') THEN
        ALTER TABLE settings ADD COLUMN "showVirtualCampus" BOOLEAN DEFAULT true;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='faviconUrl') THEN
        ALTER TABLE settings ADD COLUMN "faviconUrl" TEXT DEFAULT 'https://xaviersjaipur.edu.in/wp-content/uploads/2023/12/SchoolLogoTest.png';
    END IF;
END $$;

-- Enable RLS and set policies
ALTER TABLE page_sections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Full Access" ON page_sections;
CREATE POLICY "Public Full Access" ON page_sections FOR ALL TO public USING (true) WITH CHECK (true);
GRANT ALL ON TABLE page_sections TO anon, authenticated, postgres, service_role;

-- Ensure settings has a robust public policy as well
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Full Access" ON settings;
CREATE POLICY "Public Full Access" ON settings FOR ALL TO public USING (true) WITH CHECK (true);
GRANT ALL ON TABLE settings TO anon, authenticated, postgres, service_role;

-- JESUIT PAGE CONTENT TABLE
CREATE TABLE IF NOT EXISTS jesuit_page_content (
     id TEXT PRIMARY KEY DEFAULT 'primary',
     objectives_html TEXT,
     examinations_html TEXT,
     promotions_html TEXT,
     discipline_html TEXT,
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE jesuit_page_content ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Full Access" ON jesuit_page_content;
CREATE POLICY "Public Full Access" ON jesuit_page_content FOR ALL TO public USING (true) WITH CHECK (true);
GRANT ALL ON TABLE jesuit_page_content TO anon, authenticated, postgres, service_role;

-- Seed Jesuit Page Content if empty
INSERT INTO jesuit_page_content (id, objectives_html, examinations_html, promotions_html, discipline_html)
VALUES (
    'primary',
    '<ul><li>Help students become mature, spiritually oriented men and women of character.</li><li>Encourage continual striving after excellence in every field.</li><li>Value and judiciously use their freedom.</li><li>Be clear and firm on principles and courageous in action.</li><li>Be unselfish in the service of their fellow human beings.</li><li>Become agents of needed social change in the country.</li></ul>',
    '<p>Information about examinations will be updated soon.</p>',
    '<p>Information about promotions will be updated soon.</p>',
    '<ul><li>Arrive at least five minutes before the first bell.</li><li>Habitually clean and neat dress.</li><li>Official school diary is mandatory daily.</li><li>Excel in conduct and cleanliness.</li><li>Damages to property must be made good.</li><li>Personal vehicles require valid licences.</li></ul>'
) ON CONFLICT (id) DO NOTHING;

-- Notify schema reload
NOTIFY pgrst, 'reload schema';
