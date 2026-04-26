import React from 'react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import Layout from '../components/layout/Layout';
import { AppData } from '../types';
import { 
  Briefcase, 
  Lock, 
  Info, 
  Mail, 
  FileText
} from 'lucide-react';

const CareersPage = ({ data }: { data: AppData }) => {
  return (
    <Layout data={data}>
      <Helmet>
        <title>Careers | St. Xavier's Sr. Sec. School, Jaipur</title>
        <meta name="description" content="Career opportunities at St. Xavier's Jaipur. Join our dedicated team of educators and administrative staff." />
      </Helmet>

      <div className="bg-school-paper min-h-screen">
        {/* Banner Section */}
        <section className="relative h-[400px] overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0">
            <img 
              src="https://picsum.photos/seed/school_team/1920/1080?blur=1" 
              alt="School Team" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-school-navy/50 backdrop-blur-[1px]"></div>
          </div>
          <div className="relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-school-navy p-6 md:p-10 rounded-[32px] border border-white/20 shadow-2xl inline-block"
            >
              <h1 className="text-4xl md:text-5xl font-serif font-black text-white italic tracking-tight uppercase">Careers</h1>
              <div className="w-12 h-1 bg-school-gold mx-auto mt-4"></div>
            </motion.div>
          </div>
        </section>

        {/* Status Card Section */}
        <section className="py-24 max-w-7xl mx-auto px-6 flex justify-center">
           <motion.div
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             className="w-full max-w-4xl bg-school-paper rounded-[48px] border border-school-ink/10 shadow-[0_32px_64px_-16px_rgba(0,33,71,0.1)] p-12 md:p-24 text-center relative overflow-hidden"
           >
              <div className="absolute top-0 left-0 w-full h-2 bg-school-gold"></div>
              
              <div className="space-y-10">
                <div className="w-20 h-20 bg-school-paper/50 rounded-full flex items-center justify-center mx-auto text-school-navy mb-12">
                   <Lock size={40} className="text-school-gold" />
                </div>
                
                <h2 className="text-4xl md:text-6xl font-serif font-black text-school-ink italic tracking-tight">
                  Application Form Closed
                </h2>
                
                <div className="max-w-2xl mx-auto space-y-6 text-justify">
                  <p className="text-lg text-school-ink/60 font-medium leading-relaxed">
                    Thank you for your interest in joining St. Xavier's Secondary School, Jaipur. Currently, the recruitment cycle is closed and we are not accepting new applications.
                  </p>
                  <p className="text-sm text-school-ink/40 italic">
                    Please check back regularly or follow our social media handles for future vacancy announcements.
                  </p>
                </div>

                <div className="pt-12 border-t border-school-ink/10 flex flex-col md:flex-row items-center justify-center gap-8">
                   <div className="flex items-center gap-3 text-school-ink">
                      <Mail size={18} className="text-school-gold" />
                      <span className="text-xs font-black uppercase tracking-widest leading-none">xavier41jaipur@gmail.com</span>
                   </div>
                   <div className="hidden md:block w-px h-4 bg-school-ink/10"></div>
                   <div className="flex items-center gap-3 text-school-ink">
                      <Info size={18} className="text-school-gold" />
                      <span className="text-xs font-black uppercase tracking-widest leading-none">Institutional Recruitment</span>
                   </div>
                </div>
              </div>

              {/* Decorative background mark */}
              <Briefcase className="absolute -bottom-10 -right-10 text-school-ink/5 w-64 h-64 -rotate-12 pointer-events-none" />
           </motion.div>
        </section>

        {/* General Guidelines */}
        <section className="pb-24 max-w-7xl mx-auto px-6 lg:px-12">
           <div className="grid md:grid-cols-2 gap-12">
              <div className="p-10 glass-surface rounded-[40px] border border-school-ink/10">
                 <h3 className="text-2xl font-serif font-black text-school-ink italic mb-6">Selection Process</h3>
                 <p className="text-sm text-school-ink/60 leading-relaxed mb-6 font-medium">
                   St. Xavier's follows a rigorous selection procedure based on merit, pedagogical expertise, and alignment with Jesuit values. This typically includes:
                 </p>
                 <ul className="space-y-3">
                   {[
                     'Screening of Applications',
                     'Written Proficiency Test',
                     'Personal Interview with the Board',
                     'Classroom Demonstration'
                   ].map(item => (
                     <li key={item} className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-school-ink/60">
                        <div className="w-1.5 h-1.5 bg-school-gold rounded-full"></div>
                        {item}
                     </li>
                   ))}
                 </ul>
              </div>

              <div className="p-10 bg-school-navy text-white rounded-[40px] shadow-2xl">
                 <h3 className="text-2xl font-serif font-black italic mb-6 text-school-gold">Waitlist Policy</h3>
                 <p className="text-sm text-white/70 leading-relaxed font-light">
                   While the form is closed, exemplary candidates (PGT/TGT/PRT) may send their detailed Resume to our official email. Profiles are added to our talent database and contacted during off-cycle vacancies.
                 </p>
                 <div className="mt-8 flex items-center gap-4 text-white/40">
                   <FileText size={20} />
                   <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Mandatory: Latest Passport Bio-data & Qualifications</span>
                 </div>
              </div>
           </div>
        </section>
      </div>
    </Layout>
  );
};

export default CareersPage;
