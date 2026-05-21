-- COMPREHENSIVE SETUP FOR CO-CURRICULAR ACTIVITIES
-- This script creates a flexible table to manage headings, text, lists, and tables.

DROP TABLE IF EXISTS co_curricular_activities;

CREATE TABLE co_curricular_activities (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT,
    heading TEXT,
    content TEXT,
    display_type TEXT DEFAULT 'tile', -- 'tile', 'text', 'heading', 'table', 'list'
    category TEXT DEFAULT 'General',
    order_index INTEGER DEFAULT 0,
    "attachmentUrl" TEXT,
    "image_url" TEXT,
    is_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security
ALTER TABLE co_curricular_activities ENABLE ROW LEVEL SECURITY;

-- Create policy for public access
CREATE POLICY "Public Full Access" ON co_curricular_activities FOR ALL TO public USING (true) WITH CHECK (true);

-- Grant permissions
GRANT ALL ON TABLE co_curricular_activities TO anon, authenticated, postgres, service_role;

-- Notify schema cache
NOTIFY pgrst, 'reload schema';

-- Seed initial content from user request
INSERT INTO co_curricular_activities (title, content, display_type, order_index) VALUES 
('Philosophy', 'The years a student spends in the school enable him/her to acquire sound principles of conduct and action, and lay a solid foundation for true and purposeful living when he/she attains manhood or womanhood. Principles of honesty, trust, cooperation, self-reliance, and hard work are inculcated through various school activities. In these activities the boy/girl learns to do things for him/herself under the steady supervision and guidance of moderators.', 'text', 0),
('House System - Blues, Golds, Greens and Reds', 'Certain activities like dramatics, elocution, sports and games are conducted under the guidance of the Vice-Principals and House Moderators assisted by Captains and Cultural Secretaries. House Moderators, Captains, and Cultural Secretaries are appointed for this purpose.', 'heading', 1),
('Sports & Games', '<ul><li>Hand Ball</li><li>Basketball</li><li>Volleyball</li><li>Football</li><li>Baseball</li><li>Tennis</li><li>Table Tennis</li><li>Swimming</li><li>Cricket</li><li>Squash</li><li>Shooting</li><li>Badminton</li><li>Snooker</li></ul>', 'list', 2),
('Clubs & Societies', '<ul><li>Xavier Philatelic Club</li><li>Xavier Interact Club</li><li>Xavier Inquisitive Club (Senior)</li><li>Xavier Inquisitive Club (Junior)</li><li>Xavier Orchestra</li><li>Xavier Dance Club</li><li>Xavier Creative Artist’s Club</li><li>N.C.C.</li><li>Scout</li><li>L.T.S.</li><li>Xavier Science Club</li><li>Xavier Debating Society</li><li>Taru Mitra</li><li>Xavier Photography Club</li></ul>', 'list', 3),
('Prefect System', 'It is a body of students appointed by the Principal, and it functions under the guidance of the Vice-Principals.', 'heading', 4),
('School Office Bearers', '{"headers":["Category","Positions"],"rows":[["Sports","General Captain, Asst. General Captain, House Captains"],["Cultural","Gen. Cultural Secretary, Asst. Gen. Cultural Secretary, House Cult. Secretary"],["Discipline","Head Prefects (A Boy & Girl), Prefects"]]}', 'table', 5);
