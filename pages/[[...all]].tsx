import { useRouter } from 'next/router';
import { useAppData } from '../src/context/AppDataContext';
import { motion, AnimatePresence } from 'motion/react';
import React, { useEffect } from 'react';

import dynamic from 'next/dynamic';

const ElegantLoader = () => (
  <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6">
    <div className="w-12 h-12 border-2 border-school-navy/10 border-t-school-accent rounded-full animate-spin mb-4" />
    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-school-navy/40 dark:text-white/40 font-mono">
      St. Xavier's Jaipur
    </span>
  </div>
);

const HomePage = dynamic(() => import('../src/pages/HomePage'), { loading: ElegantLoader });
const StaffPage = dynamic(() => import('../src/pages/StaffPage'), { loading: ElegantLoader });
const GalleryPage = dynamic(() => import('../src/pages/GalleryPage'), { loading: ElegantLoader });
const NoticesPage = dynamic(() => import('../src/pages/NoticesPage'), { loading: ElegantLoader });
const EventsPage = dynamic(() => import('../src/pages/EventsPage'), { loading: ElegantLoader });
const FeesPage = dynamic(() => import('../src/pages/FeesPage'), { loading: ElegantLoader });
const AchievementsPage = dynamic(() => import('../src/pages/AchievementsPage'), { loading: ElegantLoader });
const HistoryPage = dynamic(() => import('../src/pages/HistoryPage'), { loading: ElegantLoader });
const FounderPatronPage = dynamic(() => import('../src/pages/FounderPatronPage'), { loading: ElegantLoader });
const GoverningMembersPage = dynamic(() => import('../src/pages/GoverningMembersPage'), { loading: ElegantLoader });
const FormerRectorsPage = dynamic(() => import('../src/pages/FormerRectorsPage'), { loading: ElegantLoader });
const FormerPrincipalsPage = dynamic(() => import('../src/pages/FormerPrincipalsPage'), { loading: ElegantLoader });
const SchoolAnthemPage = dynamic(() => import('../src/pages/SchoolAnthemPage'), { loading: ElegantLoader });
const AdmissionPolicyPage = dynamic(() => import('../src/pages/AdmissionPolicyPage'), { loading: ElegantLoader });
const ScholarshipPage = dynamic(() => import('../src/pages/ScholarshipPage'), { loading: ElegantLoader });
const StudybaseAppPage = dynamic(() => import('../src/pages/StudybaseAppPage'), { loading: ElegantLoader });
const JesuitEducationPage = dynamic(() => import('../src/pages/JesuitEducationPage'), { loading: ElegantLoader });
const SportsComplexPage = dynamic(() => import('../src/pages/SportsComplexPage'), { loading: ElegantLoader });
const CoCurricularActivitiesPage = dynamic(() => import('../src/pages/CoCurricularActivitiesPage'), { loading: ElegantLoader });
const AlumniPage = dynamic(() => import('../src/pages/AlumniPage'), { loading: ElegantLoader });
const SchoolInformationPage = dynamic(() => import('../src/pages/SchoolInformationPage'), { loading: ElegantLoader });
const ParentObligationsPage = dynamic(() => import('../src/pages/ParentObligationsPage'), { loading: ElegantLoader });
const CareersPage = dynamic(() => import('../src/pages/CareersPage'), { loading: ElegantLoader });
const MandatoryDisclosuresPage = dynamic(() => import('../src/pages/MandatoryDisclosuresPage'), { loading: ElegantLoader });
const StatutoryArchivesPage = dynamic(() => import('../src/pages/StatutoryArchivesPage'), { loading: ElegantLoader });
const FireSafetyPage = dynamic(() => import('../src/pages/FireSafetyPage'), { loading: ElegantLoader });
const NoticeBoardPage = dynamic(() => import('../src/pages/NoticeBoardPage'), { loading: ElegantLoader });
const TransferCertificatePage = dynamic(() => import('../src/pages/TransferCertificatePage'), { loading: ElegantLoader });
const StreamToppersPage = dynamic(() => import('../src/pages/StreamToppersPage'), { loading: ElegantLoader });
const LaurelDistinctionPage = dynamic(() => import('../src/pages/LaurelDistinctionPage'), { loading: ElegantLoader });
const XavieriteOfTheYearPage = dynamic(() => import('../src/pages/XavieriteOfTheYearPage'), { loading: ElegantLoader });
const StudentLeadershipPage = dynamic(() => import('../src/pages/StudentLeadershipPage'), { loading: ElegantLoader });
const LeadGracePage = dynamic(() => import('../src/pages/LeadGracePage'), { loading: ElegantLoader });
const ExplorePage = dynamic(() => import('../src/pages/ExplorePage'), { loading: ElegantLoader });
const ContactPage = dynamic(() => import('../src/pages/ContactPage'), { loading: ElegantLoader });
const AdminPortal = dynamic(() => import('../src/pages/AdminPortal'), { loading: ElegantLoader });
const SitemapPage = dynamic(() => import('../src/pages/SitemapPage'), { loading: ElegantLoader });

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
