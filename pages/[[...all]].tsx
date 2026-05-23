import { useRouter } from 'next/router';
import { useAppData } from '../src/context/AppDataContext';
import { motion, AnimatePresence } from 'motion/react';
import React, { useEffect } from 'react';

import HomePage from '../src/pages/HomePage';
import StaffPage from '../src/pages/StaffPage';
import GalleryPage from '../src/pages/GalleryPage';
import NoticesPage from '../src/pages/NoticesPage';
import EventsPage from '../src/pages/EventsPage';
import FeesPage from '../src/pages/FeesPage';
import AchievementsPage from '../src/pages/AchievementsPage';
import HistoryPage from '../src/pages/HistoryPage';
import FounderPatronPage from '../src/pages/FounderPatronPage';
import GoverningMembersPage from '../src/pages/GoverningMembersPage';
import FormerRectorsPage from '../src/pages/FormerRectorsPage';
import FormerPrincipalsPage from '../src/pages/FormerPrincipalsPage';
import SchoolAnthemPage from '../src/pages/SchoolAnthemPage';
import AdmissionPolicyPage from '../src/pages/AdmissionPolicyPage';
import ScholarshipPage from '../src/pages/ScholarshipPage';
import StudybaseAppPage from '../src/pages/StudybaseAppPage';
import JesuitEducationPage from '../src/pages/JesuitEducationPage';
import SportsComplexPage from '../src/pages/SportsComplexPage';
import CoCurricularActivitiesPage from '../src/pages/CoCurricularActivitiesPage';
import AlumniPage from '../src/pages/AlumniPage';
import SchoolInformationPage from '../src/pages/SchoolInformationPage';
import ParentObligationsPage from '../src/pages/ParentObligationsPage';
import CareersPage from '../src/pages/CareersPage';
import MandatoryDisclosuresPage from '../src/pages/MandatoryDisclosuresPage';
import StatutoryArchivesPage from '../src/pages/StatutoryArchivesPage';
import FireSafetyPage from '../src/pages/FireSafetyPage';
import NoticeBoardPage from '../src/pages/NoticeBoardPage';
import TransferCertificatePage from '../src/pages/TransferCertificatePage';
import StreamToppersPage from '../src/pages/StreamToppersPage';
import LaurelDistinctionPage from '../src/pages/LaurelDistinctionPage';
import XavieriteOfTheYearPage from '../src/pages/XavieriteOfTheYearPage';
import StudentLeadershipPage from '../src/pages/StudentLeadershipPage';
import LeadGracePage from '../src/pages/LeadGracePage';
import ExplorePage from '../src/pages/ExplorePage';
import ContactPage from '../src/pages/ContactPage';
import AdminPortal from '../src/pages/AdminPortal';
import SitemapPage from '../src/pages/SitemapPage';

export default function CatchAllPage() {
  const router = useRouter();
  const { data, setData } = useAppData();
  
  const { all } = router.query;
  const path = Array.isArray(all) ? '/' + all.join('/') : '/';

  // Smooth scroll to top on page navigation
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, [path]);

  // Page selection and rendering
  let component = null;
  switch (path) {
    case '/':
      component = <HomePage data={data} />;
      break;
    case '/staff':
      component = <StaffPage data={data} />;
      break;
    case '/gallery':
      component = <GalleryPage data={data} />;
      break;
    case '/notices':
      component = <NoticesPage data={data} />;
      break;
    case '/events':
      component = <EventsPage data={data} />;
      break;
    case '/fees':
      component = <FeesPage data={data} />;
      break;
    case '/achievements':
      component = <AchievementsPage data={data} />;
      break;
    case '/history':
      component = <HistoryPage data={data} />;
      break;
    case '/founder-patron':
      component = <FounderPatronPage data={data} />;
      break;
    case '/governing-members':
      component = <GoverningMembersPage data={data} />;
      break;
    case '/former-rectors':
      component = <FormerRectorsPage data={data} />;
      break;
    case '/former-principals':
      component = <FormerPrincipalsPage data={data} />;
      break;
    case '/anthem':
      component = <SchoolAnthemPage data={data} />;
      break;
    case '/admission-policy':
      component = <AdmissionPolicyPage data={data} />;
      break;
    case '/scholarships':
      component = <ScholarshipPage data={data} />;
      break;
    case '/studybase-app':
      component = <StudybaseAppPage data={data} />;
      break;
    case '/jesuit-education-objectives':
      component = <JesuitEducationPage data={data} />;
      break;
    case '/academics':
      component = <JesuitEducationPage data={data} />;
      break;
    case '/sports-complex':
      component = <SportsComplexPage data={data} />;
      break;
    case '/co-curricular':
      component = <CoCurricularActivitiesPage data={data} />;
      break;
    case '/alumni':
      component = <AlumniPage data={data} />;
      break;
    case '/school-info':
      component = <SchoolInformationPage data={data} />;
      break;
    case '/parent-obligations':
      component = <ParentObligationsPage data={data} />;
      break;
    case '/careers':
      component = <CareersPage data={data} />;
      break;
    case '/mandatory-disclosures':
      component = <MandatoryDisclosuresPage data={data} />;
      break;
    case '/statutory-archives':
      component = <StatutoryArchivesPage data={data} />;
      break;
    case '/safety-guidelines':
      component = <FireSafetyPage data={data} />;
      break;
    case '/notice-board':
      component = <NoticeBoardPage data={data} />;
      break;
    case '/transfer-certificate':
      component = <TransferCertificatePage data={data} />;
      break;
    case '/stream-toppers':
      component = <StreamToppersPage data={data} />;
      break;
    case '/laurel-distinction':
      component = <LaurelDistinctionPage data={data} />;
      break;
    case '/xavierite-of-the-year':
      component = <XavieriteOfTheYearPage data={data} />;
      break;
    case '/former-student-leaders':
      component = <StudentLeadershipPage data={data} />;
      break;
    case '/lead-grace':
      component = <LeadGracePage data={data} />;
      break;
    case '/explore':
      component = <ExplorePage data={data} />;
      break;
    case '/contact':
      component = <ContactPage data={data} />;
      break;
    case '/admin':
      component = <AdminPortal data={data} setData={setData} />;
      break;
    case '/sitemap':
      component = <SitemapPage data={data} />;
      break;
    default:
      component = <HomePage data={data} />;
      break;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={path}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        {component}
      </motion.div>
    </AnimatePresence>
  );
}

import { fetchServerData } from '../src/lib/db';

export async function getServerSideProps(context: any) {
  const { req, res } = context;
  const rawUrl = req.url || '';
  
  // Extract accurate pathname without query strings
  const pathname = rawUrl.split('?')[0] || '';

  try {
    const initialData = await fetchServerData();
    const settings = initialData?.settings || {};

    // 1. Google Search Console dynamic HTML file verification
    // Auto-responds to any google[hash].html with the corresponding verification proof
    if (pathname.match(/^\/google[a-zA-Z0-9_\-]+\.html$/i)) {
      const filename = pathname.substring(1);
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.write(`google-site-verification: ${filename}`);
      res.end();
      return { props: { initialData: null } };
    }

    // 2. Bing Webmaster XML Verification (BingSiteAuth.xml)
    if (pathname.toLowerCase() === '/bingsiteauth.xml' && settings.bingWebmasterKey) {
      res.setHeader('Content-Type', 'application/xml; charset=utf-8');
      res.write(`<?xml version="1.0" encoding="utf-8"?>
<users>
  <user>${settings.bingWebmasterKey}</user>
</users>`);
      res.end();
      return { props: { initialData: null } };
    }

    // 3. IndexNow verification key file (.txt)
    if (pathname.match(/^\/[a-zA-Z0-9_\-]+\.txt$/i)) {
      const filename = pathname.substring(1);
      const key = filename.replace(/\.txt$/i, '');
      
      // If indexNowKey matches or someone requested indexnow.txt directly
      if (settings.indexNowKey && (settings.indexNowKey === key || key.toLowerCase() === 'indexnow')) {
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.write(settings.indexNowKey);
        res.end();
        return { props: { initialData: null } };
      }
    }

    // Normal payload delivery
    const serialized = JSON.parse(JSON.stringify(initialData));
    return {
      props: {
        initialData: serialized,
      },
    };
  } catch (err: any) {
    console.error('Server-side query fetch error:', err.message);
    return {
      props: {
        initialData: null,
      },
    };
  }
}
