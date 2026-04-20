/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route
} from 'react-router-dom';
import { AppData } from './types';

// Page Imports
import HomePage from './pages/HomePage';
import StaffPage from './pages/StaffPage';
import GalleryPage from './pages/GalleryPage';
import NoticesPage from './pages/NoticesPage';
import EventsPage from './pages/EventsPage';
import FeesPage from './pages/FeesPage';
import AchievementsPage from './pages/AchievementsPage';
import AdminPortal from './pages/AdminPortal';

const DEFAULT_DATA: AppData = {
  notices: [
    { id: '1', title: 'Summer Vacations Announcement 2026', date: 'April 15, 2026', category: 'Circular' },
    { id: '2', title: 'Pre-Primary Admission Intake 2026-27', date: 'March 25, 2026', category: 'Admissions' },
    { id: '3', title: 'Inter-House Creative Writing Winners', date: 'April 05, 2026', category: 'Activities' },
    { id: '4', title: 'Instruction for CBSE Practical Examinations', date: 'February 20, 2026', category: 'Examination' }
  ],
  staff: [
    { id: '1', name: 'Rev. Fr. S. Arulasamy, S.J.', role: 'Principal', bio: 'Leading the institution with a vision for holistic Jesuit education and character formation.', image: 'https://picsum.photos/seed/p_arul/400/400', type: 'Management' },
    { id: '2', name: 'Rev. Fr. John Ravi, S.J.', role: 'Manager', bio: 'Guiding the school\'s mission and spiritual growth within the Jaipur Jesuit Society.', image: 'https://picsum.photos/seed/p_john/400/400', type: 'Management' },
    { id: '3', name: 'Ms. Sunita Sharma', role: 'Vice Principal', bio: 'Driving academic excellence and implementing progressive pedagogical standards across sections.', image: 'https://picsum.photos/seed/p_sunita/400/400', type: 'Faculty' },
    { id: '4', name: 'Rev. Fr. Raymond Cherubin, S.J.', role: 'Administrator', bio: 'Managing campus operations, infrastructure, and student welfare services.', image: 'https://picsum.photos/seed/p_ray/400/400', type: 'Administration' },
    { id: '5', name: 'Mr. Pradeep Mishra', role: 'HOD - Physics', bio: 'Senior educator specializing in advanced mechanics and thermodynamics for senior secondary years.', image: 'https://picsum.photos/seed/t_pradeep/400/400', type: 'Faculty' },
    { id: '6', name: 'Ms. Anjali Gupta', role: 'HOD - Mathematics', bio: 'Dedicated to fostering logical reasoning and mathematical proficiency in competitive students.', image: 'https://picsum.photos/seed/t_anjali/400/400', type: 'Faculty' },
    { id: '7', name: 'Mr. Rajesh Jain', role: 'HOD - Commerce', bio: 'Expert in accountancy and business studies, bridging academic theory with market reality.', image: 'https://picsum.photos/seed/t_rajesh/400/400', type: 'Faculty' },
    { id: '8', name: 'Ms. Neha Kapoor', role: 'Department of English', bio: 'Enriching students with literary appreciation and effective communication skills.', image: 'https://picsum.photos/seed/t_neha/400/400', type: 'Faculty' },
    { id: '9', name: 'Mr. Amit Saxena', role: 'IT Coordinator', bio: 'Leading the digital transformation and computer science programs at the institution.', image: 'https://picsum.photos/seed/t_amit/400/400', type: 'Administration' },
    { id: '10', name: 'Dr. Pallavi Singh', role: 'Counselor', bio: 'Providing emotional and psychological support to ensure balanced student well-being.', image: 'https://picsum.photos/seed/t_pallavi/400/400', type: 'Administration' },
    { id: '11', name: 'Mr. Vikram Singh', role: 'Physical Education Director', bio: 'Promoting sportsmanship and physical fitness through a variety of athletic programs.', image: 'https://picsum.photos/seed/t_vikram/400/400', type: 'Faculty' }
  ],
  gallery: [
    { id: '1', url: 'https://picsum.photos/seed/x_facade/1200/800', caption: 'St. Xavier\'s Main Architecture' },
    { id: '2', url: 'https://picsum.photos/seed/x_prayer/1200/800', caption: 'The Morning Assembly Circle' },
    { id: '3', url: 'https://picsum.photos/seed/x_lab/1200/800', caption: 'Physics Research Wing' },
    { id: '4', url: 'https://picsum.photos/seed/x_sports/1200/800', caption: 'Inter-House Cricket Semi-Finals' },
    { id: '5', url: 'https://picsum.photos/seed/x_art/1200/800', caption: 'Fine Arts Exhibition' },
    { id: '6', url: 'https://picsum.photos/seed/x_lib/1200/800', caption: 'Students in the Central Library' }
  ],
  fees: [
    { id: '1', grade: 'LKG - Prep', admissionFee: '₹40,000', tuition_fees: '₹4,500', quarterly: '₹13,500' },
    { id: '2', grade: 'I - V', admissionFee: '₹40,000', tuition_fees: '₹5,200', quarterly: '₹15,600' },
    { id: '3', grade: 'VI - VIII', admissionFee: '₹45,000', tuition_fees: '₹5,800', quarterly: '₹17,400' },
    { id: '4', grade: 'IX - X', admissionFee: '₹50,000', tuition_fees: '₹6,400', quarterly: '₹19,200' },
    { id: '5', grade: 'XI - XII', admissionFee: '₹55,000', tuition_fees: '₹7,200', quarterly: '₹21,600' }
  ],
  links: [
    { id: '1', title: 'Student & Parent Portal', url: '#' },
    { id: '2', title: 'Academic Calendar 2025-26', url: '#' },
    { id: '3', title: 'XAOSA Alumni Registration', url: '#' },
    { id: '4', title: 'CBSE Affiliation Info', url: '#' }
  ],
  events: [
    { id: '1', title: 'Investiture Ceremony 2026', date: 'May 15, 2026', time: '09:00 AM', location: 'St. Ignatius Hall' },
    { id: '2', title: 'Summer Football Camp', date: 'June 01, 2026', time: '06:30 AM', location: 'Main School Grounds' },
    { id: '3', title: 'Alumni Homecoming Dinner', date: 'July 20, 2026', time: '07:30 PM', location: 'Open Quadrangle' }
  ],
  achievements: [
    { id: '1', title: 'National Science Fair Gold', year: '2026', description: 'Our senior robotics team secured the first position at the National Science Congress.' },
    { id: '2', title: 'Best School in Jaipur 2025', year: '2025', description: 'Ranked #1 for Holistic Development by Education World.' },
    { id: '3', title: 'State Cricket Champions', year: '2025', description: 'The U-19 team won the Rajasthan State Inter-School Tournament.' }
  ]
};

export default function App() {
  const [data, setData] = useState<AppData>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDataAndSeed = async () => {
      try {
        const res = await fetch('/api/data');
        const fetchedData = await res.json();
        
        const merged = { ...DEFAULT_DATA };
        let hasData = false;
        Object.keys(fetchedData).forEach(key => {
          if (fetchedData[key] && fetchedData[key].length > 0) {
            merged[key as keyof AppData] = fetchedData[key];
            hasData = true;
          }
        });
        
        if (hasData) {
          setData(merged);
        } else {
          console.log('Fresh database detected. Starting sequential seeding...');
          for (const table of Object.keys(DEFAULT_DATA)) {
            const items = DEFAULT_DATA[table as keyof AppData];
            for (const item of items) {
              await fetch('/api/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ table, item })
              });
            }
          }
          const finalRes = await fetch('/api/data');
          const finalData = await finalRes.json();
          setData(finalData);
        }
      } catch (err) {
        console.error('Data sync error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDataAndSeed();
  }, []);

  if (loading) return <div className="h-screen w-screen flex items-center justify-center bg-school-navy text-white font-serif italic text-2xl">Initializing Jesuit Portal...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage data={data} />} />
        <Route path="/staff" element={<StaffPage data={data} />} />
        <Route path="/gallery" element={<GalleryPage data={data} />} />
        <Route path="/notices" element={<NoticesPage data={data} />} />
        <Route path="/events" element={<EventsPage data={data} />} />
        <Route path="/fees" element={<FeesPage data={data} />} />
        <Route path="/achievements" element={<AchievementsPage data={data} />} />
        <Route path="/admin" element={<AdminPortal data={data} setData={setData} />} />
      </Routes>
    </Router>
  );
}
