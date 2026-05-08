-- COMPREHENSIVE SUPABASE SETUP & SEEDING
-- Run this in your Supabase SQL Editor

-- 1. DROP EXISTING TABLES IF NEEDED (Careful: This clears data)
-- DROP TABLE IF EXISTS academics, activities, alumni, school_info, parent_obligations, careers, mandatory_disclosures, contact_content;

-- 2. CREATE TABLES FUNCTION
CREATE OR REPLACE FUNCTION create_page_table(table_name TEXT) 
RETURNS void AS $$
BEGIN
    EXECUTE format('
        CREATE TABLE IF NOT EXISTS %I (
            id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
            title TEXT,
            heading TEXT,
            content TEXT,
            image_url TEXT,
            "attachmentUrl" TEXT,
            is_enabled BOOLEAN DEFAULT true,
            order_index INTEGER DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone(''utc''::text, now())
        );
        ALTER TABLE %I ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Public Full Access" ON %I;
        CREATE POLICY "Public Full Access" ON %I FOR ALL TO public USING (true) WITH CHECK (true);
        GRANT ALL ON TABLE %I TO anon, authenticated, postgres, service_role;
    ', table_name, table_name, table_name, table_name, table_name);
END;
$$ LANGUAGE plpgsql;

-- 3. INITIALIZE TABLES
SELECT create_page_table('academics');
SELECT create_page_table('activities');
SELECT create_page_table('alumni');
SELECT create_page_table('school_info');
SELECT create_page_table('parent_obligations');
SELECT create_page_table('careers');
SELECT create_page_table('mandatory_disclosures');
SELECT create_page_table('contact_content');

-- 4. SEED DATA

-- ACADEMICS
INSERT INTO academics (id, title, heading, content, order_index) VALUES
('acad-1', 'Jesuit Education', 'Legacy of Magis', 'St. Xavier’s School, Jaipur, is a Christian Minority School, which has been established and is managed by the Jaipur Xavier Educational Association (JXEA), a registered charitable society. The school is under the management of the Jesuit Fathers of the Delhi Province of the Society of Jesus.', 0),
('acad-2', 'Primary Education', 'Foundations of Excellence', 'The primary school focuses on building strong linguistic and mathematical foundations. We believe in learning through play, exploration, and structured inquiry.', 1),
('acad-3', 'Modern Facilities', 'Technical Edge', 'Our campus is equipped with state-of-the-art computer labs, science laboratories (Physics, Chemistry, Biology), and smart classrooms to facilitate 21st-century learning.', 2);

-- ACTIVITIES
INSERT INTO activities (id, title, heading, content, order_index) VALUES
('act-1', 'Athletics & Sports', 'Physical Integrity', 'The school offers a wide range of sports including Handball, Basketball, Volleyball, Football, Baseball, Tennis, Table Tennis, Swimming, Cricket, Squash, Shooting, and Badminton.', 0),
('act-2', 'Cultural Society', 'Artistic Expression', 'Students participate in Debate, Elocution, Music Contests, Dance Festivals, Dramatics, Painting, andSnooker. We encourage creative expression in every form.', 1),
('act-3', 'Clubs & Societies', 'Specialized Interests', 'Clubs include Xavier Literature Club, Philatelic Club, Interact Club, Inquisitive Club, Orchestra, Dance Club, Creative Artist’s Club, Science Club, and Photography Club.', 2);

-- ALUMNI
INSERT INTO alumni (id, title, heading, content, order_index) VALUES
('alum-1', 'The Apex Body', 'Globally Connected Xaverians', 'Xavier’s Alumni (XA) is the apex body of the alumni of St. Xavier’s School, Jaipur. With a rich history, XA has over 4000 members spread across the globe.', 0),
('alum-2', 'Mission & Vision', 'Bonds of Friendship', 'The mission is to foster and keep alive the bonds of friendship and understanding among the alumni themselves and between the Alumni and the School.', 1);

-- SCHOOL INFO
INSERT INTO school_info (id, title, heading, content, order_index) VALUES
('si-1', 'General Details', 'Institutional Identity', 'Name of the School: St. Xavier''s Sr. Sec. School<br />Address: Bhagwan Das Road, C-Scheme, Jaipur - 302 001 (Rajasthan)<br />Year of Foundation: 1941<br />School Management: Jaipur Xavier Educational Association', 0),
('si-2', 'Contact Information', 'Connect With Us', 'Phone Nos.: 0141-2370296, 2372336, 2367792<br />Email: stxaviersschooljaipur@gmail.com<br />Website: www.stxaviersschooljaipur.com', 1),
('si-3', 'Statutory Records', 'CBSE & Statutory Codes', 'Affiliation No.: 1730003<br />School Code: 16003<br />Medium of Instruction: English<br />Student Type: Co-educational<br />Classes: Prep to XII', 2);

-- PARENT OBLIGATIONS
INSERT INTO parent_obligations (id, title, heading, content, order_index) VALUES
('po-1', 'Educational Partnership', 'Full Co-operation', 'Parents are reminded that they are the primary educators of their children. The school expects full co-operation in enforcing discipline and character formation.', 0),
('po-2', 'Attendance & Leave', 'Punctuality', 'Students must reach school 10 minutes before the first bell. Latecomers will not be admitted to class. Leave of absence must be recorded in the handbook.', 1);

-- CAREERS
INSERT INTO careers (id, title, heading, content, order_index) VALUES
('car-1', 'PGT Mathematics', 'Academic Vacancy', 'We are looking for a dedicated PGT Mathematics teacher with experience in CBSE curriculum and Jesuit values.', 0);

-- MANDATORY DISCLOSURES
INSERT INTO mandatory_disclosures (id, title, heading, content, order_index) VALUES
('md-1', 'Society Registration', 'Public Document', 'Copy of Society Registration/Trust Deed is available for verification. Valid and permanent registration under Jaipur Xavier Educational Association.', 0),
('md-2', 'NOC Certificate', 'Rajasthan Govt', 'No Objection Certificate from the State Government obtained in 1962 (F-6(43)Edu Cell VI/61).', 1);

-- CONTACT CONTENT
INSERT INTO contact_content (id, title, heading, content, order_index) VALUES
('con-1', 'Office Hours', 'Administrative Timing', 'Monday - Friday: 8:00 AM to 1:00 PM\nSaturday: 8:30 AM to 11:30 AM', 0);

-- 5. RELOAD SCHEMA
NOTIFY pgrst, 'reload schema';
