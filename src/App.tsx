/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route,
  useLocation
} from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { AppData } from './types';
import { HelmetProvider } from 'react-helmet-async';
import { FirebaseProvider, useFirebase } from './components/FirebaseProvider';
import { firebaseService } from './lib/firebaseService';

// Page Imports
import HomePage from './pages/HomePage';
import StaffPage from './pages/StaffPage';
import GalleryPage from './pages/GalleryPage';
import NoticesPage from './pages/NoticesPage';
import EventsPage from './pages/EventsPage';
import FeesPage from './pages/FeesPage';
import AchievementsPage from './pages/AchievementsPage';
import HistoryPage from './pages/HistoryPage';
import FounderPatronPage from './pages/FounderPatronPage';
import GoverningMembersPage from './pages/GoverningMembersPage';
import SchoolAnthemPage from './pages/SchoolAnthemPage';
import AdmissionPolicyPage from './pages/AdmissionPolicyPage';
import ScholarshipPage from './pages/ScholarshipPage';
import StudybaseAppPage from './pages/StudybaseAppPage';
import JesuitEducationPage from './pages/JesuitEducationPage';
import SportsComplexPage from './pages/SportsComplexPage';
import CoCurricularActivitiesPage from './pages/CoCurricularActivitiesPage';
import AlumniPage from './pages/AlumniPage';
import SchoolInformationPage from './pages/SchoolInformationPage';
import ParentObligationsPage from './pages/ParentObligationsPage';
import CareersPage from './pages/CareersPage';
import NoticeBoardPage from './pages/NoticeBoardPage';
import ContactPage from './pages/ContactPage';
import AdminPortal from './pages/AdminPortal';
import TransferCertificatePage from './pages/TransferCertificatePage';

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const id = location.hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500); // Wait for page transition
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

const DEFAULT_DATA: AppData = {
  notices: [
    { id: '1', title: 'Summer Holiday Closure Notice', content: 'Dear parents, In view of the summer holidays (from 18-05-2024 to 30-06-2024) the school will be closed. Students will report to school on 01-07-2024 @ 07:30 a.m. Principal SXS, C-Scheme', date: 'May 18, 2024 10:52 AM', category: 'Circular' },
    { id: '2', title: 'Class Timetable 6 to 12 (2026_27)', date: 'March 30, 2026 5:50 PM', category: 'Circular' },
    { id: '3', title: 'Revised Provisional List of Std. XI (2026-27)', date: 'March 30, 2026 5:49 PM', category: 'Circular' },
  ],
  staff: [
    { id: '1', name: "FR. NELSON A. D'SILVA, SJ", role: 'MANAGER, TREASURER', bio: 'Appointed: 01-05-2021. Overseeing financial stewardship and institutional management.', image: 'https://picsum.photos/seed/nelson/400/400', type: 'Management' },
    { id: '2', name: 'FR. M. AROCKIAM, SJ', role: 'PRINCIPAL', bio: 'Appointed: 01-07-2018. Leading the academic vision and spiritual growth of the institution.', image: 'https://picsum.photos/seed/arockiam/400/400', type: 'Management' },
    { id: '3', name: 'FR. MADALAIMUTHU ANTHONIAPPAN, SJ ( Fr. BRITTO )', role: 'COORDINATOR ( MIDDLE SCHOOL )', bio: 'Appointed: 01-07-2024. Ensuring academic excellence and discipline in the middle school wing.', image: 'https://picsum.photos/seed/britto/400/400', type: 'Administration' },
    { id: '4', name: 'SR. RUTH MARIAM, SCJM', role: 'COORDINATOR ( JUNIOR SCHOOL )', bio: 'Appointed: 01-04-2025. Dedicated to the holistic primary education and foundational growth.', image: 'https://picsum.photos/seed/ruth/400/400', type: 'Administration' },
    { id: '5', name: 'MRS. KSHAMA SHARMA', role: 'COORDINATOR-ACADEMICS ( SENIOR SCHOOL )', bio: 'Appointed: 01-04-2002. Senior academic lead ensuring curriculum standards in senior secondary.', image: 'https://picsum.photos/seed/kshama/400/400', type: 'Administration' },
    { id: '6', name: 'MR. ALEX THOMAS', role: 'COORDINATOR-ACTIVITIES ( SENIOR SCHOOL )', bio: 'Appointed: 01-08-1996. Overseeing extracurricular engagement and senior school activities.', image: 'https://picsum.photos/seed/alex/400/400', type: 'Administration' },
    // PGT (7-25)
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
    { id: '25', name: 'NEHA WHITNEY', role: 'PGT', bio: 'Appointed: 01-07-2025. Status: Contract. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    
    // TGT (26-63)
    { id: '26', name: 'M. CASTELINO', role: 'TGT', bio: 'Appointed: 01-07-1994. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '27', name: 'B. ACHARYA', role: 'TGT', bio: 'Appointed: 01-07-1997. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '28', name: 'ASHOK SINGH KACHHWAHA', role: 'TGT', bio: 'Appointed: 01-11-1999. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '29', name: 'PINKY VARGHESE', role: 'TGT', bio: 'Appointed: 01-07-2000. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '30', name: 'S. SRIVASTAVA', role: 'TGT', bio: 'Appointed: 01-07-2000. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '31', name: 'A. LAZER', role: 'TGT', bio: 'Appointed: 01-10-2000. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '32', name: 'B. SHARMA', role: 'TGT', bio: 'Appointed: 01-04-2001. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '33', name: 'KAMAYANI ATRE', role: 'TGT', bio: 'Appointed: 01-04-2001. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '34', name: 'S GAUTAM', role: 'TGT', bio: 'Appointed: 01-04-2002. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '35', name: 'SUMIT CHAUHAN', role: 'TGT', bio: 'Appointed: 01-04-2002. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '36', name: 'MAMTA BATRA', role: 'TGT', bio: 'Appointed: 01-07-2002. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '37', name: 'S. RATHORE', role: 'TGT', bio: 'Appointed: 01-04-2003. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '38', name: 'NAVRATAN AGARWAL', role: 'TGT', bio: 'Appointed: 01-04-2005. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '39', name: 'SAPNA SHARMA', role: 'TGT', bio: 'Appointed: 01-04-2006. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '40', name: 'ARADHANA BHATNAGAR', role: 'TGT', bio: 'Appointed: 01-04-2006. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '41', name: 'CHRISTINE UPASANA LOBO', role: 'TGT', bio: 'Appointed: 01-04-2007. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '42', name: 'GOVIND NARAYAN SHARMA', role: 'TGT', bio: 'Appointed: 01-07-2007. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '43', name: 'C.B. JOSE', role: 'TGT', bio: 'Appointed: 01-04-2008. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '44', name: 'SAROJ NAUTIYAL', role: 'TGT', bio: 'Appointed: 01-04-2008. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '45', name: 'MAMTA SHEKHAWAT', role: 'TGT', bio: 'Appointed: 01-04-2009. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '46', name: 'ANANT AKASH HENRY', role: 'TGT', bio: 'Appointed: 01-08-2010. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '47', name: 'POOJA SHERRY', role: 'TGT', bio: 'Appointed: 01-04-2011. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '48', name: 'JINU GEORGE', role: 'TGT', bio: 'Appointed: 01-04-2012. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '49', name: 'GOLDY BHARGAVA', role: 'TGT', bio: 'Appointed: 01-07-2012. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '50', name: 'OLIVE E MALAKI', role: 'TGT', bio: 'Appointed: 01-10-2014. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '51', name: 'SHRUTI PAREEK', role: 'TGT', bio: 'Appointed: 01-07-2014. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '52', name: 'NAMRATA SOMANI', role: 'TGT', bio: 'Appointed: 01-10-2014. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '53', name: 'JENNIFER BARNO', role: 'TGT', bio: 'Appointed: 01-04-2016. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '54', name: 'CHHAYA SINGH', role: 'TGT', bio: 'Appointed: 01-04-2017. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '55', name: 'JISS MARY GEORGE', role: 'TGT', bio: 'Appointed: 01-04-2017. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '56', name: 'AKHILA R. NAIR', role: 'TGT', bio: 'Appointed: 01-04-2017. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '57', name: 'SIJI JOSE', role: 'TGT', bio: 'Appointed: 02-07-2018. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '58', name: 'SOBIN CHERIAN', role: 'TGT', bio: 'Appointed: 01-07-2019. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '59', name: 'KHUSHBOO KHANGAROT', role: 'TGT', bio: 'Appointed: 01-07-2022. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '60', name: 'STEPHIE CAROLENE MENDONCA', role: 'TGT', bio: 'Appointed: 01-07-2022. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '61', name: 'BHUMIKA SHARMA', role: 'TGT', bio: 'Appointed: 01-12-2024. Status: Contract. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '62', name: 'DIVYA SWARUP', role: 'TGT', bio: 'Appointed: 01-07-2023. Status: Contract. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '63', name: 'K.B. ARUN', role: 'TGT', bio: 'Appointed: 01-07-2025. Status: Contract. Full Time Trained Faculty.', image: '', type: 'Faculty' },

    // PRT (64-102)
    { id: '64', name: 'N. CHOPRA', role: 'PRT', bio: 'Appointed: 01-07-1993. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '65', name: 'LALITA PAREEK', role: 'PRT', bio: 'Appointed: 01-07-1994. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '66', name: 'M. ARORA', role: 'PRT', bio: 'Appointed: 01-07-1997. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '67', name: 'PINKY GROVER', role: 'PRT', bio: 'Appointed: 01-07-2001. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '68', name: 'MALVEA TRIBENI', role: 'PRT', bio: 'Appointed: 01-04-2008. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '69', name: 'NEETU GAGAN SINGH', role: 'PRT', bio: 'Appointed: 01-04-2008. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '70', name: 'VARSHA JAIN', role: 'PRT', bio: 'Appointed: 01-04-2010. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '71', name: 'ELIZABETH THOMAS', role: 'PRT', bio: 'Appointed: 01-04-2010. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '72', name: 'SONAL GUPTA', role: 'PRT', bio: 'Appointed: 01-04-2010. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '73', name: 'SAPNA SHARMA', role: 'PRT', bio: 'Appointed: 01-08-2010. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '74', name: 'VINITA YADAV', role: 'PRT', bio: 'Appointed: 01-08-2010. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '75', name: 'AMALA JOHN', role: 'PRT', bio: 'Appointed: 01-04-2011. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '76', name: 'ASHA JOHN', role: 'PRT', bio: 'Appointed: 01-04-2011. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '77', name: 'VIBHA OJHA', role: 'PRT', bio: 'Appointed: 01-04-2011. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '78', name: 'SANKRANTI BHARDWAJ', role: 'PRT', bio: 'Appointed: 01-04-2012. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '79', name: 'NIDHI JAIN', role: 'PRT', bio: 'Appointed: 01-04-2012. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '80', name: 'SHAISTA REHMAN', role: 'PRT', bio: 'Appointed: 01-04-2012. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '81', name: 'RICHA KAPOOR', role: 'PRT', bio: 'Appointed: 01-04-2012. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '82', name: 'SINDHU VARMA', role: 'PRT', bio: 'Appointed: 01-04-2012. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '83', name: 'MEGHA MANAN MUKUL', role: 'PRT', bio: 'Appointed: 01-04-2012. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '84', name: 'LIJI JAIN', role: 'PRT', bio: 'Appointed: 01-04-2013. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '85', name: 'SUCHITA JACOB', role: 'PRT', bio: 'Appointed: 01-04-2013. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '86', name: 'YOGITA MOUDGIL', role: 'PRT', bio: 'Appointed: 01-07-2013. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '87', name: 'ARPITA BHARGAVA', role: 'PRT', bio: 'Appointed: 01-04-2014. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '88', name: 'JINSY PHILIP', role: 'PRT', bio: 'Appointed: 01-04-2014. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '89', name: 'NISHA BHATI', role: 'PRT', bio: 'Appointed: 01-10-2014. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '90', name: 'RUPA SHUKLA', role: 'PRT', bio: 'Appointed: 01-07-2014. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '91', name: 'SEEMA SHARMA', role: 'PRT', bio: 'Appointed: 01-11-2013. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '92', name: 'A B PATHAK', role: 'PRT', bio: 'Appointed: 01-04-2014. Status: Contract (Ad Hoc). Trained Faculty.', image: '', type: 'Faculty' },
    { id: '93', name: 'SHIKHA SRIVASTAVA', role: 'PRT', bio: 'Appointed: 01-04-2015. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '94', name: 'SR. LISSY KURIAN, SCJM', role: 'PRT', bio: 'Appointed: 01-07-2025. Status: Confirmed (Ad Hoc). Trained Faculty.', image: '', type: 'Faculty' },
    { id: '95', name: 'MANISHA DIXIT', role: 'PRT', bio: 'Appointed: 01-08-2017. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '96', name: 'BLOSSOM BLISS FERNADES', role: 'PRT', bio: 'Appointed: 01-07-2022. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '97', name: 'SHAZIA IRAM', role: 'PRT', bio: 'Appointed: 01-07-2022. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '98', name: 'NANCY MANSINGH', role: 'PRT', bio: 'Appointed: 01-07-2023. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '99', name: 'MAGDELENE LOBO', role: 'PRT', bio: 'Appointed: 01-07-2023. Status: Confirmed. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '100', name: 'RUCHIKA SINGHAL', role: 'PRT', bio: 'Appointed: 01-07-2024. Status: Probation. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '101', name: 'VINITA SINGH', role: 'PRT', bio: 'Appointed: 01-07-2024. Status: Contract. Full Time Trained Faculty.', image: '', type: 'Faculty' },
    { id: '102', name: 'PRAHLAD SINGH', role: 'PRT', bio: 'Appointed: 01-07-2025. Status: Contract. Full Time Trained Faculty.', image: '', type: 'Faculty' },

    // Administrative Staff (103-111)
    { id: '103', name: 'S.G. MATHEW', role: 'OFFICE ASSISTANT', bio: 'Appointed: 01-04-2001. Status: Confirmed. Full Time Trained staff.', image: '', type: 'Administration' },
    { id: '104', name: 'BINU JOHN THOMAS', role: 'ACCOUNTANT', bio: 'Appointed: 01-07-2001. Status: Confirmed. Full Time Trained staff.', image: '', type: 'Administration' },
    { id: '105', name: 'PRATAP LAKRA', role: 'LIBRARIAN', bio: 'Appointed: 01-09-1997. Status: Confirmed. Full Time Trained staff.', image: '', type: 'Administration' },
    { id: '106', name: 'KURIAKOSE P. PAULOSE', role: 'CHEMISTRY LAB ASST.', bio: 'Appointed: 01-04-2005. Status: Confirmed. Full Time Trained staff.', image: '', type: 'Administration' },
    { id: '107', name: 'BETCY AJI', role: 'OFFICE ASSISTANT', bio: 'Appointed: 15-09-2010. Status: Confirmed. Full Time Trained staff.', image: '', type: 'Administration' },
    { id: '108', name: 'BISHNU POKHREL', role: 'COMPUTER LAB ASST.', bio: 'Appointed: 01-04-2011. Status: Confirmed. Full Time Trained staff.', image: '', type: 'Administration' },
    { id: '109', name: 'NELSON STANLEY THEODORE', role: 'PA TO PRINCIPAL', bio: 'Appointed: 07-01-2015. Status: Confirmed. Full Time Trained staff.', image: '', type: 'Administration' },
    { id: '110', name: 'NIKHIL ABRAHAM GEORGE', role: 'ACC. ASST', bio: 'Appointed: 03-07-2017. Status: Confirmed. Full Time Trained staff.', image: '', type: 'Administration' },
    { id: '111', name: 'RAVINDRA SHARMA', role: 'BIO LAB ASST.', bio: 'Appointed: 01-09-1994. Status: Confirmed. Full Time Trained staff.', image: '', type: 'Administration' }
  ],
  gallery: [
    { id: '1', url: 'https://picsum.photos/seed/x_facade/1200/800', caption: 'St. Xavier\'s Main Architecture' },
    { id: '2', url: 'https://picsum.photos/seed/x_prayer/1200/800', caption: 'The Morning Assembly Circle' },
    { id: '3', url: 'https://picsum.photos/seed/x_lab/1200/800', caption: 'Physics Research Wing' },
    { id: '4', url: 'https://picsum.photos/seed/x_sports/1200/800', caption: 'Inter-House Cricket Semi-Finals' },
    { id: '5', url: 'https://picsum.photos/seed/x_art/1200/800', caption: 'Fine Arts Exhibition' },
    { id: '6', url: 'https://picsum.photos/seed/x_lib/1200/800', caption: 'Students in the Central Library' },
    { id: '7', url: 'https://picsum.photos/seed/x_prize/1200/800', caption: 'Annual Prize Distribution 2025' },
    { id: '8', url: 'https://picsum.photos/seed/x_dance/1200/800', caption: 'Cultural Night Performance' },
    { id: '9', url: 'https://picsum.photos/seed/x_march/1200/800', caption: 'Independence Day Parade' },
    { id: '10', url: 'https://picsum.photos/seed/x_choir/1200/800', caption: 'Institutional Choir Performance' },
    { id: '11', url: 'https://picsum.photos/seed/x_yoga/1200/800', caption: 'Morning Mindfulness & Yoga' },
    { id: '12', url: 'https://picsum.photos/seed/x_debate/1200/800', caption: 'Inter-School Debating Championship' }
  ],
  fees: [
    { id: 'f1', category: 'School Fee', particulars: 'School fee (std. I to VII)', amount: '95900', quarterly: '23975', remarks: '', order_index: 0, attachmentUrl: 'https://xaviersjaipur.edu.in/wp-content/uploads/2024/03/Admission-Prospectus-2024-25.pdf' },
    { id: 'f2', category: 'School Fee', particulars: 'School fee (std. VIII)', amount: '87600', quarterly: '21900', remarks: '', order_index: 1, attachmentUrl: '' },
    { id: 'f3', category: 'School Fee', particulars: 'School fee (std. IX & X)', amount: '88000', quarterly: '22000', remarks: '', order_index: 2, attachmentUrl: '' },
    { id: 'f4', category: 'School Fee', particulars: 'School fee (std. XI & XII)', amount: '100400', quarterly: '25100', remarks: '', order_index: 3, attachmentUrl: '' },
    { id: 'f5', category: 'Annual Fee', particulars: 'Annual fee (std. I to X)', amount: '8700', quarterly: '2175', remarks: 'Charged in 4 Quarters', order_index: 4, attachmentUrl: '' },
    { id: 'f6', category: 'Annual Fee', particulars: 'Annual fee (std. XI)', amount: '11800', quarterly: '2950', remarks: 'Charged in 4 Quarters', order_index: 5, attachmentUrl: '' },
    { id: 'f7', category: 'Annual Fee', particulars: 'Annual fee (std. XII)', amount: '13000', quarterly: '3250', remarks: 'Charged in 4 Quarters', order_index: 6, attachmentUrl: '' },
    { id: 'f8', category: 'Admission Fee', particulars: 'Admission fee (std. I)', amount: '33200', quarterly: '0', remarks: 'Charged at the time of admission', order_index: 7, attachmentUrl: '' },
    { id: 'f9', category: 'Admission Fee', particulars: 'Admission fee (std. II to XII)', amount: '43500', quarterly: '0', remarks: 'Charged at the time of admission', order_index: 8, attachmentUrl: '' },
  ],
  links: [
    { id: '1', title: 'Schedule for PT1 (2026-27)', url: '#', isPriority: true, icon: 'Calendar' },
    { id: '2', title: 'Revised Provisional List of Std. XI', url: '#', isPriority: true, icon: 'FileText' },
    { id: '3', title: 'Class Timetable 6 to 12', url: '#', isPriority: true, icon: 'Calendar' },
    { id: '4', title: 'Admission Notice for Std. 1', url: '#', isPriority: true, icon: 'Bell' },
    { id: '5', title: 'Booklet for Session 2025-26', url: '#', isPriority: true, icon: 'FileText' },
    { id: '6', title: 'Admission Prospectus', url: 'https://xaviersjaipur.edu.in/wp-content/uploads/2024/03/Admission-Prospectus-2024-25.pdf', icon: 'FileText' },
    { id: 'app-1', title: 'Apply Now 2026-27', url: '#', icon: 'Send' },
    { id: '7', title: 'Parent Portal', url: '/studybase-app', icon: 'Layout' },
    { id: '8', title: 'XAOSA Alumni', url: '#', icon: 'Users' },
    { id: '9', title: 'CBSE Affiliation', url: '#', icon: 'Shield' }
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
  ],
  studentHonors: [
    { id: '1', name: 'Rijul Jain', category: 'JEE Mains:- 90.44%', result: '90.44%', subtext: 'SCIENCE CLUB (JOINT SECRETARY), RAJYA PURASKAR AWARDEE (SCOUTS AND GUIDES)', image: 'https://picsum.photos/seed/student1/300/300', order_index: 0 },
    { id: '2', name: 'Ameyatman Roy', category: 'JEE Mains:- 90.27%', result: '90.27%', subtext: '90.27 PERCENTILE', image: 'https://picsum.photos/seed/student2/300/300', order_index: 1 },
    { id: '3', name: 'Aryan Sharma', category: 'JEE Mains:- 99.12%', result: '99.12%', subtext: 'ACADEMIC EXCELLENCE AWARD WINNER', image: 'https://picsum.photos/seed/student3/300/300', order_index: 2 },
  ],
  menu: [
    { id: '1', label: 'Home', href: '/', parent_id: null, order_index: 0 },
    { id: '2', label: 'About Us', href: '#', parent_id: null, order_index: 1 },
    { id: '2-1', label: 'Historical view of the school', href: '/history', parent_id: '2', order_index: 0 },
    { id: '2-2', label: 'our Founder', href: '/founder-patron#founder', parent_id: '2', order_index: 1 },
    { id: '2-3', label: 'Our Patron', href: '/founder-patron#patron', parent_id: '2', order_index: 2 },
    { id: '2-4', label: 'School Governing Members', href: '/governing-members', parent_id: '2', order_index: 3 },
    { id: '2-5', label: 'School Staff', href: '/staff', parent_id: '2', order_index: 4 },
    { id: '3', label: 'Admission', href: '#', parent_id: null, order_index: 2 },
    { id: '3-1', label: 'Admission Policy', href: '/admission-policy', parent_id: '3', order_index: 0 },
    { id: '3-2', label: 'Scholarship & Concessions', href: '/scholarships', parent_id: '3', order_index: 1 },
    { id: '3-3', label: 'Fees Structure', href: '/fees', parent_id: '3', order_index: 2 },
    { id: '3-4', label: 'Studybase Mobile App', href: '/studybase-app', parent_id: '3', order_index: 3 },
    { id: '3-5', label: 'Prospectus', href: '/admission-policy#prospectus', parent_id: '3', order_index: 4 },
    { id: '4', label: 'Academics', href: '#', parent_id: null, order_index: 3 },
    { id: '4-1', label: 'Jesuit Education Objectives', href: '/jesuit-education-objectives', parent_id: '4', order_index: 0 },
    { id: '4-2', label: 'Examinations & Premotions', href: '#', parent_id: '4', order_index: 1 },
    { id: '4-3', label: 'rules & Discipline', href: '#', parent_id: '4', order_index: 2 },
    { id: '5', label: 'Activities', href: '#', parent_id: null, order_index: 4 },
    { id: '5-1', label: 'Co-Curricular Activities', href: '/co-curricular', parent_id: '5', order_index: 0 },
    { id: '5-2', label: 'Fr. Batson Sports Complex', href: '/sports-complex', parent_id: '5', order_index: 1 },
    { id: '5-3', label: 'Xavier’s Alumni', href: '/alumni', parent_id: '5', order_index: 2 },
    { id: '5-4', label: 'Media Gallery', href: '/gallery', parent_id: '5', order_index: 3 },
    { id: '5-5', label: 'Event Calendar', href: '/events', parent_id: '5', order_index: 4 },
    { id: '5-6', label: 'Student Achievements', href: '/achievements', parent_id: '5', order_index: 5 },
    { id: '6', label: 'CBSE Corner', href: '#', parent_id: null, order_index: 5 },
    { id: '6-1', label: 'School Information', href: '/school-info', parent_id: '6', order_index: 0 },
    { id: '6-2', label: 'Fire safety', href: '#', parent_id: '6', order_index: 1 },
    { id: '7', label: 'For Parents', href: '#', parent_id: null, order_index: 6 },
    { id: '7-1', label: 'Obligations of Parents', href: '/parent-obligations', parent_id: '7', order_index: 0 },
    { id: '8', label: 'Career', href: '#', parent_id: null, order_index: 7 },
    { id: '8-1', label: 'Careers', href: '/careers', parent_id: '8', order_index: 0 },
    { id: '9', label: 'More', href: '#', parent_id: null, order_index: 8 },
    { id: '9-1', label: 'Notice Board', href: '/notice-board', parent_id: '9', order_index: 0 },
    { id: '9-3', label: 'Mandatory disclosure', href: '#', parent_id: '9', order_index: 1 },
    { id: '9-4', label: 'Transfer Certificate', href: '/transfer-certificate', parent_id: '9', order_index: 2 },
    { id: '10', label: 'Contact', href: '/contact', parent_id: null, order_index: 9 },
  ],
  carousel: [
    { id: 'c1', url: 'https://lh3.googleusercontent.com/d/1C-_jZCL-OpkhhOV_R6oTGRfNxkhBIkHN=w1600', caption: 'Legacy of Excellence' },
    { id: 'c2', url: 'https://lh3.googleusercontent.com/d/1ZfP3k6bFiwdZdEe3CI_U6KhBkAEaybUs=w1600', caption: 'Modern Campus Mastery' },
    { id: 'c3', url: 'https://lh3.googleusercontent.com/d/187y5AfGgvXnofNL6h85uU1rpdfaWYDCH=w1600', caption: 'St. Xavier\'s Spirit' },
  ],
  faqs: [
    { id: 'f1', question: 'What are the school timings?', answer: 'Junior School: 7:30 AM - 12:30 PM. Senior School: 7:30 AM - 1:30 PM.', category: 'General', order_index: 0 },
    { id: 'f2', question: 'Is there a transport facility?', answer: 'Yes, the school provides bus facilities covering most major parts of Jaipur city.', category: 'General', order_index: 1 }
  ],
  messages: [],
  settings: {
    id: 'global',
    applyNowEnabled: true,
    applyNowUrl: 'https://xaviersjaipur.edu.in/wp-content/uploads/2024/03/Admission-Prospectus-2024-25.pdf',
    applyNowLabel: 'Apply 2026-27',
    siteName: "St. Xavier's Sr. Sec. School, Jaipur",
    siteLogo: 'https://xaviersjaipur.edu.in/wp-content/uploads/2023/12/SchoolLogoTest.png',
    contactEmail: 'xaviersjaipur@gmail.com',
    contactPhone: '0141-2372336, 2362436',
    contactAddress: 'Bhagwan Das Road, C-Scheme, Jaipur - 302001, Rajasthan, India'
  },
  content: {
    id: 'global',
    heroTitle1: 'Beyond',
    heroTitle2: 'Imagination.',
    heroBadge: 'A Legacy of Jesuit Excellence',
    heroDescription: 'Step into a world where tradition meets innovation. Empowering leaders since 1941.',
    carouselBranding: 'Jaipur Legacy.',
    aboutBadge: 'Welcome to Excellence',
    aboutTitle1: 'About',
    aboutTitle2: 'St. Xavier’s School.',
    aboutDescription: 'Established in 1941, St. Xavier\'s School, Jaipur, is a premier Jesuit institution dedicated to the holistic development of its students. Rooted in the rich heritage of the Society of Jesus, we strive to nurture "men and women for others" through academic excellence, character building, and social responsibility.',
    mottoTitle: 'Motto',
    mottoDescription: '"For God and Country" represents our core ethos of service and devotion.',
    historyButton: 'Discover Our Story',
    exploreButton: 'Explore Campus',
    nodesTitle1: 'Vital',
    nodesTitle2: 'Nodes.',
    nodesDescription: 'The administrative heart of our institution, condensed for your convenience.',
    helpdeskLabel: 'Support Helpdesk',
    wiredTitle: 'Stay Wired.',
    wiredBadge: 'Real-time Institutional Heartbeat',
    principalBadge: "Guardian's Vision",
    principalTitle1: 'Lead',
    principalTitle2: 'with',
    principalTitle3: 'Grace.',
    principalQuote: 'We cultivate individuals of character, resilient in spirit and enlightened in soul. Education is the journey of becoming.',
    principalButton: 'The Full Narrative',
    regencyBadge: 'The Guardians',
    regencyTitle1: 'The',
    regencyTitle2: 'Regency.',
    oeuvreTitle1: 'Campus',
    oeuvreTitle2: 'Oeuvre.',
    oeuvreDescription: 'A visual collective capturing the vibrant soul of St. Xavier\'s Jaipur.'
  }
};

const DataLoader = ({ children, data, setData, loading, setLoading }: { children: React.ReactNode, data: AppData, setData: (d: AppData) => void, loading: boolean, setLoading: (l: boolean) => void }) => {
  const { isAdmin, loading: authLoading } = useFirebase();

  useEffect(() => {
    if (authLoading) return;

    const fetchDataAndSeed = async () => {
      try {
        const fetchedData = await firebaseService.fetchAllData();
        
        let hasData = false;
        if (fetchedData) {
          Object.values(fetchedData).forEach(arr => {
            if (Array.isArray(arr) && arr.length > 0) hasData = true;
          });
        }
        
        if (hasData && fetchedData) {
          const merged = { ...DEFAULT_DATA };
          Object.keys(fetchedData).forEach(key => {
            const k = key as keyof AppData;
            let val = fetchedData[k];
            if (val) {
              if (Array.isArray(val)) {
                if (val.length > 0) {
                  if (k === 'menu') {
                    // Filter out deprecated or duplicate menu items
                    val = (val as any[]).filter(m => 
                      m.label !== 'Staff Directory' && 
                      m.id !== '2-7' &&
                      m.label !== 'School ANthem'
                    );
                    
                    const fetchedIds = new Set((val as any[]).map(m => m.id));
                    const missing = DEFAULT_DATA.menu.filter(m => !fetchedIds.has(m.id));
                    merged[k] = [...(val as any[]), ...missing] as any;
                  } else {
                    merged[k] = val as any;
                  }
                }
              } else {
                merged[k] = val as any;
              }
            }
          });
          
          if (fetchedData.menu?.length > 0 && isAdmin) {
            const fetchedIds = new Set(fetchedData.menu.map((m: any) => m.id));
            const missing = DEFAULT_DATA.menu.filter(m => !fetchedIds.has(m.id));
            
            if (missing.length > 0 && isAdmin) {
              for (const item of missing) {
                await firebaseService.saveItem('menu', item);
              }
              const refresh = await firebaseService.fetchAllData();
              const latest = { ...DEFAULT_DATA };
              if (refresh) {
                Object.keys(refresh).forEach(k => {
                  const key = k as keyof AppData;
                  const val = refresh[key];
                  if (val) {
                    if (Array.isArray(val)) {
                      if (val.length > 0) latest[key] = val as any;
                    } else {
                      latest[key] = val as any;
                    }
                  }
                });
              }
              setData(latest);
            } else {
              setData(merged);
            }
          } else {
            setData(merged);
          }
        } else if (isAdmin) {
          console.log('Fresh Firestore detected and user is admin. Starting sequential seeding...');
          await firebaseService.syncAll(DEFAULT_DATA);
          const finalData = await firebaseService.fetchAllData();
          if (finalData) setData({ ...DEFAULT_DATA, ...finalData } as AppData);
        } else {
          // Keep default data if not admin and DB is empty
          console.log('Firestore is empty. Log in as admin to sync/seed data.');
        }
      } catch (err) {
        console.error('Firebase data sync error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDataAndSeed();
  }, [isAdmin, authLoading]);

  if (loading || authLoading) return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-school-navy overflow-hidden">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="relative flex flex-col items-center"
      >
        <div className="absolute inset-0 bg-school-gold/10 rounded-full blur-[100px] animate-pulse"></div>
        <img 
          src="https://xaviersjaipur.edu.in/wp-content/uploads/2023/12/SchoolLogoTest.png" 
          alt="Legacy Loading" 
          className="w-40 h-40 relative z-10 brightness-110 drop-shadow-[0_0_30px_rgba(226,180,80,0.3)]"
        />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-10 text-center"
        >
          <h3 className="text-school-paper font-display text-2xl font-black tracking-[0.3em] uppercase">St. Xavier's</h3>
          <p className="text-school-gold font-serif italic text-sm mt-2 tracking-widest opacity-60">Established 1941 • Jaipur</p>
        </motion.div>
      </motion.div>
    </div>
  );

  return <>{children}</>;
};

export default function App() {
  const [data, setData] = useState<AppData>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);

  return (
    <FirebaseProvider>
      <DataLoader data={data} setData={setData} loading={loading} setLoading={setLoading}>
        <HelmetProvider>
          <Router>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<PageTransition><HomePage data={data} /></PageTransition>} />
                <Route path="/staff" element={<PageTransition><StaffPage data={data} /></PageTransition>} />
                <Route path="/gallery" element={<PageTransition><GalleryPage data={data} /></PageTransition>} />
                <Route path="/notices" element={<PageTransition><NoticesPage data={data} /></PageTransition>} />
                <Route path="/events" element={<PageTransition><EventsPage data={data} /></PageTransition>} />
                <Route path="/fees" element={<PageTransition><FeesPage data={data} /></PageTransition>} />
                <Route path="/achievements" element={<PageTransition><AchievementsPage data={data} /></PageTransition>} />
                <Route path="/history" element={<PageTransition><HistoryPage data={data} /></PageTransition>} />
                <Route path="/founder-patron" element={<PageTransition><FounderPatronPage data={data} /></PageTransition>} />
                <Route path="/governing-members" element={<PageTransition><GoverningMembersPage data={data} /></PageTransition>} />
                <Route path="/anthem" element={<PageTransition><SchoolAnthemPage data={data} /></PageTransition>} />
                <Route path="/admission-policy" element={<PageTransition><AdmissionPolicyPage data={data} /></PageTransition>} />
                <Route path="/scholarships" element={<PageTransition><ScholarshipPage data={data} /></PageTransition>} />
                <Route path="/studybase-app" element={<PageTransition><StudybaseAppPage data={data} /></PageTransition>} />
                <Route path="/jesuit-education-objectives" element={<PageTransition><JesuitEducationPage data={data} /></PageTransition>} />
                <Route path="/sports-complex" element={<PageTransition><SportsComplexPage data={data} /></PageTransition>} />
                <Route path="/co-curricular" element={<PageTransition><CoCurricularActivitiesPage data={data} /></PageTransition>} />
                <Route path="/alumni" element={<PageTransition><AlumniPage data={data} /></PageTransition>} />
                <Route path="/school-info" element={<PageTransition><SchoolInformationPage data={data} /></PageTransition>} />
                <Route path="/parent-obligations" element={<PageTransition><ParentObligationsPage data={data} /></PageTransition>} />
                <Route path="/careers" element={<PageTransition><CareersPage data={data} /></PageTransition>} />
                <Route path="/notice-board" element={<PageTransition><NoticeBoardPage data={data} /></PageTransition>} />
                <Route path="/transfer-certificate" element={<PageTransition><TransferCertificatePage data={data} /></PageTransition>} />
                <Route path="/contact" element={<PageTransition><ContactPage data={data} /></PageTransition>} />
                <Route path="/admin" element={<PageTransition><AdminPortal data={data} setData={setData} /></PageTransition>} />
              </Routes>
            </AnimatePresence>
          </Router>
        </HelmetProvider>
      </DataLoader>
    </FirebaseProvider>
  );
}
