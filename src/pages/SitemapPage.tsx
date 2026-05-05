import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { AppData } from '../types';
import { motion } from 'motion/react';
import { ChevronRight, Map, Compass, Shield, BookOpen, Users, Trophy, MessageSquare } from 'lucide-react';

const SitemapPage = ({ data }: { data: AppData }) => {
  const sections = [
    {
      title: "Institutional",
      icon: <Shield className="text-school-accent" size={24} />,
      links: [
        { label: "History & Legacy", href: "/history" },
        { label: "Jesuit Education Objectives", href: "/jesuit-education-objectives" },
        { label: "Founder Patron", href: "/founder-patron" },
        { label: "Governing Members", href: "/governing-members" },
        { label: "Former Managers", href: "/former-managers" },
        { label: "Former Principals", href: "/former-principals" },
        { label: "Former Rectors", href: "/former-rectors" },
        { label: "School Anthem", href: "/anthem" },
      ]
    },
    {
      title: "Admissions & Academics",
      icon: <BookOpen className="text-school-gold" size={24} />,
      links: [
        { label: "Admission Policy", href: "/admission-policy" },
        { label: "Fee Structure", href: "/fees" },
        { label: "Scholarships", href: "/scholarships" },
        { label: "Staff Directory", href: "/staff" },
        { label: "Stream Toppers", href: "/stream-toppers" },
        { label: "Xavierite of the Year", href: "/xavierite-of-the-year" },
      ]
    },
    {
      title: "Student Life",
      icon: <Trophy className="text-school-accent" size={24} />,
      links: [
        { label: "Co-Curricular Activities", href: "/co-curricular" },
        { label: "Fr. Batson Sports Complex", href: "/sports-complex" },
        { label: "Media Gallery", href: "/gallery" },
        { label: "School Events", href: "/events" },
        { label: "Achievements", href: "/achievements" },
        { label: "Insights Explorer", href: "/explore" },
      ]
    },
    {
      title: "Resources & Contact",
      icon: <MessageSquare className="text-school-navy" size={24} />,
      links: [
        { label: "Notice Board", href: "/notice-board" },
        { label: "Mandatory Disclosure", href: "/school-info" },
        { label: "Transfer Certificates", href: "/transfer-certificate" },
        { label: "Careers", href: "/careers" },
        { label: "Contact Us", href: "/contact" },
        { label: "Studybase App", href: "/studybase-app" },
        { label: "Alumni Portal", href: "/alumni" },
      ]
    }
  ];

  return (
    <Layout data={data}>
      <div className="py-32 bg-school-paper dark:bg-slate-950 min-h-screen">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-20 text-center space-y-4"
          >
            <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-school-navy text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
              <Map size={14} /> Comprehensive Directory
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-school-navy dark:text-white italic tracking-tighter">
              Site <span className="text-school-accent">Map.</span>
            </h1>
            <p className="text-slate-500 max-w-2xl mx-auto font-medium"> Navigate through the digital ecosystem of St. Xavier's Senior Secondary School, Jaipur.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {sections.map((section, idx) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white dark:bg-slate-900 rounded-[40px] p-10 border border-black/5 shadow-2xl shadow-black/5 flex flex-col h-full"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center shadow-inner">
                    {section.icon}
                  </div>
                  <h2 className="text-xl font-black text-school-navy dark:text-white leading-tight">{section.title}</h2>
                </div>
                
                <ul className="space-y-4 flex-1">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link 
                        to={link.href}
                        className="flex items-center gap-2 text-slate-500 hover:text-school-accent transition-colors group font-bold text-sm"
                      >
                        <ChevronRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-school-accent" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-24 p-12 bg-school-navy rounded-[50px] text-white overflow-hidden relative"
          >
             <div className="absolute top-0 right-0 w-64 h-64 bg-school-gold/20 blur-[100px] rounded-full" />
             <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                <div className="space-y-2">
                   <h3 className="text-3xl font-black italic">Need immediate help?</h3>
                   <p className="text-white/60 font-medium uppercase tracking-widest text-xs">Reach out to our administrative support</p>
                </div>
                <Link to="/contact" className="px-10 py-4 bg-white text-school-navy rounded-full font-black text-sm uppercase tracking-widest hover:bg-school-gold hover:text-white transition-all shadow-xl">
                   Connect Now
                </Link>
             </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default SitemapPage;
