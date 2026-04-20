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
    { id: '1', name: "FR. NELSON A. D'SILVA, SJ", role: 'MANAGER, TREASURER', bio: 'Appointed: 01-05-2021. Overseeing financial stewardship and institutional management.', image: 'https://picsum.photos/seed/nelson/400/400', type: 'Management' },
    { id: '2', name: 'FR. M. AROCKIAM, SJ', role: 'PRINCIPAL', bio: 'Appointed: 01-07-2018. Leading the academic vision and spiritual growth of the institution.', image: 'https://picsum.photos/seed/arockiam/400/400', type: 'Management' },
    { id: '3', name: 'FR. MADALAIMUTHU ANTHONIAPPAN, SJ ( Fr. BRITTO )', role: 'COORDINATOR ( MIDDLE SCHOOL )', bio: 'Appointed: 01-07-2024. Ensuring academic excellence and discipline in the middle school wing.', image: 'https://picsum.photos/seed/britto/400/400', type: 'Administration' },
    { id: '4', name: 'SR. RUTH MARIAM, SCJM', role: 'COORDINATOR ( JUNIOR SCHOOL )', bio: 'Appointed: 01-04-2025. Dedicated to the holistic primary education and foundational growth.', image: 'https://picsum.photos/seed/ruth/400/400', type: 'Administration' },
    { id: '5', name: 'MRS. KSHAMA SHARMA', role: 'COORDINATOR-ACADEMICS ( SENIOR SCHOOL )', bio: 'Appointed: 01-04-2002. Senior academic lead ensuring curriculum standards in senior secondary.', image: 'https://picsum.photos/seed/kshama/400/400', type: 'Administration' },
    { id: '6', name: 'MR. ALEX THOMAS', role: 'COORDINATOR-ACTIVITIES ( SENIOR SCHOOL )', bio: 'Appointed: 01-08-1996. Overseeing extracurricular engagement and senior school activities.', image: 'https://picsum.photos/seed/alex/400/400', type: 'Administration' },
    { id: '7', name: 'ABHISHEK MATHUR', role: 'PGT', bio: 'Appointed: 01-07-2023. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '8', name: 'R. TRIVEDI', role: 'PGT', bio: 'Appointed: 01-07-1994. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '9', name: 'SHAJI THOMAS', role: 'PGT', bio: 'Appointed: 01-04-2003. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '10', name: 'DILIP SRIVASTAVA', role: 'PGT', bio: 'Appointed: 01-07-2007. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '11', name: 'GOPAL SHARMA', role: 'PGT', bio: 'Appointed: 01-07-2007. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '12', name: 'AJAY P. JOSE', role: 'PGT', bio: 'Appointed: 01-04-2009. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '13', name: 'NIMMI SAM', role: 'PGT', bio: 'Appointed: 06-07-2013. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '14', name: 'RAJENDRA JOSHI', role: 'PGT', bio: 'Appointed: 01-07-1990. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '15', name: 'SUJITHA KUMAR', role: 'PGT', bio: 'Appointed: 01-04-2006. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '16', name: 'VINEET BANSAL', role: 'PGT', bio: 'Appointed: 01-04-2015. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '17', name: 'NELEMA J. SOLOMON', role: 'PGT', bio: 'Appointed: 01-04-2016. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '18', name: 'NITIN ARORA', role: 'PGT', bio: 'Appointed: 01-04-2016. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '19', name: 'LORRAINE DAVIS', role: 'PGT', bio: 'Appointed: 01-04-2017. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '20', name: 'SHABANA AHMED', role: 'PGT', bio: 'Appointed: 01-04-2017. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '21', name: 'KIRAN PAREEK', role: 'PGT', bio: 'Appointed: 01-04-2018. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '22', name: 'RAJNI SINHA', role: 'PGT', bio: 'Appointed: 01-07-2019. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '23', name: 'DEEKSHA CHHABRA', role: 'PGT', bio: 'Appointed: 01-07-2020. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '24', name: 'SANGEETA JOSEPH', role: 'PGT', bio: 'Appointed: 01-07-2022. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '25', name: 'NEHA WHITNEY', role: 'PGT', bio: 'Appointed: 01-07-2025. Status: Contract. Full Time Trained Faculty.', image: '', type: 'Faculty' }
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
