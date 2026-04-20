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
