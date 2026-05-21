-- ENHANCE CO-CURRICULAR ACTIVITIES WITH FIRE SAFETY AND REFINED CONTENT
-- This script adds more items to the co_curricular_activities table

INSERT INTO co_curricular_activities (title, content, display_type, category, order_index, "image_url") VALUES 
('Fire Safety & Emergency Preparedness', 'The school conducts regular fire drills and safety awareness sessions in collaboration with the Jaipur Fire Department. Every student and staff member is trained to use fire extinguishers and follow evacuation protocols to ensure a 100% safe environment.', 'tile', 'Safety', 6, 'https://images.unsplash.com/photo-1582213706093-9c84e1837943?auto=format&fit=crop&q=80&w=800'),
('Annual institutional Exhibition', 'A showcase of scientific temper, artistic flair, and cultural diversity where students present projects ranging from robotics to sustainable architecture.', 'tile', 'Academic', 7, 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800');

-- Ensure the menu item points to co-curricular if that's where they want it
-- Actually, let's keep the menu to Mandatory Disclosures for the CERTIFICATE 
-- but maybe add a new menu item for drills if they want.

-- Update navigation menu if it exists in DB to point to the new fire safety portal
UPDATE navigation_menu SET href = '/safety-guidelines' WHERE label ILIKE '%Fire safety%';
