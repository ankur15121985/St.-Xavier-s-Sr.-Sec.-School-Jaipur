import React from 'react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import Layout from '../components/layout/Layout';
import { AppData } from '../types';
import { 
  Bell, 
  Calendar, 
  FileText, 
  Download, 
  Megaphone,
  Clock,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

const NoticeBoardPage = ({ data }: { data: AppData }) => {
  const notices = [
    {
      date: "March 30, 2026",
      title: "Class Timetable 6 to 12 (2026_27)",
      category: "Academic",
      link: "#"
    },
    {
      date: "March 30, 2026",
      title: "Revised Provisional List of Std. XI(2026-27)",
      category: "Admission",
      link: "#"
    },
    {
      date: "March 17, 2026",
      title: "Provisional List of Std. XI (2026-27)",
      category: "Admission",
      link: "#"
    },
    {
      date: "January 22, 2026",
      title: "Schedule for final examinations 2025-26",
      category: "Examination",
      link: "#"
    },
    {
      date: "December 13, 2025",
      title: "Admission Notice for Std. 1 2026-27 (Corrigendum)",
      category: "Admission",
      link: "#"
    },
    {
      date: "January 25, 2025",
      title: "Schedule For Final Examination : 2024-25",
      category: "Examination",
      link: "#"
    },
    {
      date: "January 15, 2025",
      title: "SCHEDULE FOR PRE-BOARD II EXAM ( CLASS X ) 2024-25",
      category: "Examination",
      link: "#"
    },
    {
      date: "December 10, 2024",
      title: "Admission Notice for Std. 1 (2025-26)",
      category: "Admission",
      link: "#"
    },
    {
      date: "May 18, 2024",
      title: "Summer Holidays Notice 2024",
      description: "In view of the summer holidays (from 18-05-2024 to 30-06-2024) the school will be closed. Students will report to school on 01-07-2024 @ 07:30 a.m. Principal SXS, C-Scheme",
      category: "Administrative",
      link: "#"
    },
    {
      date: "April 24, 2024",
      title: "EXAM SCHEDULE FOR PERIODIC TEST 2024 - 25",
      category: "Examination",
      link: "#"
    },
    {
      date: "April 16, 2024",
      title: "Fee Payment (Quarter-I 2024-25)",
      description: "Fee challans for the academic year has been uploaded on Studybase App. Last date for payment is April 25, 2024. UPI, NETBANKING, and Credit Cards accepted without extra bank charges.",
      category: "Finance",
      link: "#"
    },
    {
      date: "April 1, 2024",
      title: "Class Time Table (I - V) 2024-25",
      category: "Academic",
      link: "#"
    },
    {
      date: "April 1, 2024",
      title: "Class Time Table (VI - XII) 2024-25",
      category: "Academic",
      link: "#"
    }
  ];

  return (
    <Layout data={data}>
      <Helmet>
        <title>Notice Board | St. Xavier's Sr. Sec. School, Jaipur</title>
        <meta name="description" content="Official digital notice board for St. Xavier's Jaipur. Stay updated with the latest academic timetables, admission lists, and examination schedules." />
      </Helmet>

      <div className="bg-slate-50 min-h-screen">
        {/* Header Section */}
        <section className="py-24 bg-school-navy relative overflow-hidden">
          <motion.div 
            animate={{ 
              rotate: [0, 10, 0],
              scale: [1, 1.1, 1] 
            }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute -top-24 -right-24 w-96 h-96 bg-school-gold/10 rounded-full blur-[100px]"
          />
          <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 rounded-full border border-white/10 mb-8">
                <Megaphone className="text-school-gold" size={16} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70">Official Announcements</span>
              </div>
              <h1 className="text-5xl md:text-8xl font-serif font-black text-white tracking-tighter italic uppercase mb-8 leading-[0.9]">Notice <br/> <span className="text-school-gold">Board.</span></h1>
              <p className="text-white/40 text-xl font-light max-w-2xl mx-auto italic">Keep track of the latest updates, circulars, and academic announcements from the school administration.</p>
            </motion.div>
          </div>
        </section>

        {/* Notices Feed */}
        <section className="py-24 max-w-5xl mx-auto px-6 lg:px-12">
          <div className="space-y-6">
            {notices.map((notice, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="group relative bg-white rounded-[32px] p-8 md:p-12 border border-slate-100 shadow-sm hover:shadow-2xl hover:border-school-gold/30 transition-all duration-500"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-50 rounded-full border border-slate-100">
                        <Calendar size={12} className="text-school-navy/40" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-school-navy/60">{notice.date}</span>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-school-gold bg-school-gold/5 px-4 py-1.5 rounded-full">{notice.category}</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-serif font-black text-school-navy group-hover:text-school-gold transition-colors duration-300 mb-4">{notice.title}</h3>
                    {notice.description && (
                      <p className="text-sm text-slate-500 leading-relaxed max-w-2xl font-medium mb-4 italic">
                        {notice.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-3 px-8 py-4 bg-school-navy text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-school-accent transition-all shadow-xl active:scale-95">
                      <Download size={14} className="text-school-gold" />
                      View Attachment
                    </button>
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-school-navy opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                      <ChevronRight size={20} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact/Help Link */}
        <section className="py-24 bg-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="inline-block p-12 rounded-[48px] bg-sky-50 border-2 border-dashed border-sky-200">
              <Clock className="mx-auto text-school-navy mb-6" size={48} />
              <h4 className="text-2xl font-serif font-black text-school-navy italic uppercase mb-4">Frequency of Updates</h4>
              <p className="text-slate-500 text-sm max-w-xl mx-auto leading-relaxed font-medium">
                The digital notice board is updated in real-time as circulars are issued. Parents are encouraged to check this portal alongside the <strong>Studybase App</strong> for critical alerts.
              </p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default NoticeBoardPage;
