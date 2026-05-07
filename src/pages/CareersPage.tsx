import React from 'react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import Layout from '../components/layout/Layout';
import { AppData } from '../types';
import { 
  Briefcase, 
  Send, 
  MapPin, 
  Calendar, 
  ArrowRight,
  Sparkles,
  FileText
} from 'lucide-react';
import Markdown from 'react-markdown';

const CareersPage = ({ data }: { data: AppData }) => {
  const jobs = data.careers || [];

  return (
    <Layout data={data}>
      <Helmet>
        <title>Careers | St. Xavier's Sr. Sec. School, Jaipur</title>
        <meta name="description" content="Join our team at St. Xavier's Sr. Sec. School, Jaipur. Explore career opportunities for teaching and non-teaching staff in a legacy Jesuit institution." />
      </Helmet>
      <div className="bg-school-paper min-h-screen">
        {/* Hero Section */}
        <section className="py-24 bg-school-navy relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
            <svg className="h-full w-full" viewBox="0 0 100 100">
              <pattern id="dotPattern" width="4" height="4" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="0.5" fill="white" />
              </pattern>
              <rect width="100" height="100" fill="url(#dotPattern)" />
            </svg>
          </div>
          <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-6 py-2 bg-school-gold/10 text-school-gold rounded-full text-[10px] font-black uppercase tracking-widest mb-12"
            >
              <Sparkles size={14} />
              Shape the Future
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl font-serif font-black text-white tracking-tighter mb-8 italic uppercase"
            >
              Join Our <span className="text-school-gold">Legacy</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white/50 text-xl font-light italic max-w-2xl mx-auto leading-relaxed"
            >
              Become part of a values-driven community dedicated to excellence, character, and the service of others.
            </motion.p>
          </div>
        </section>

        {/* Job Listings mapping from data.careers */}
        <section className="py-24 max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-20">
            <h2 className="text-4xl font-serif font-black text-school-ink italic tracking-tight uppercase">Current <span className="text-school-gold">Openings</span></h2>
            <div className="w-16 h-1.5 bg-school-gold mt-4 rounded-full"></div>
          </div>

          {jobs.length > 0 ? (
            <div className="grid gap-8">
              {jobs.map((job, idx) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group bg-white rounded-[40px] p-10 md:p-12 border border-school-ink/5 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-6 flex-1">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-school-navy rounded-2xl flex items-center justify-center text-white shrink-0 group-hover:bg-school-gold group-hover:text-school-navy transition-colors">
                          <Briefcase size={28} />
                        </div>
                        <div>
                          <h3 className="text-2xl font-serif font-black text-school-ink italic uppercase group-hover:text-school-gold transition-colors">{job.title}</h3>
                          <div className="flex gap-4 mt-2">
                            <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-school-ink/40">
                              <MapPin size={12} className="text-school-gold" />
                              Main Campus
                            </span>
                            <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-school-ink/40">
                              <Calendar size={12} className="text-school-gold" />
                              Posted {new Date().toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="markdown-body prose prose-sm max-w-none text-school-ink/60 font-light leading-relaxed">
                        <Markdown>{job.content}</Markdown>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      {job.attachmentUrl ? (
                        <a 
                          href={job.attachmentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-8 py-4 bg-school-navy text-white rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-school-gold hover:text-school-navy transition-all shadow-lg min-w-[200px]"
                        >
                          View Details PDF
                          <FileText size={14} />
                        </a>
                      ) : (
                        <a 
                          href={`mailto:${data.content.hrEmail || 'careers@stxaviersjaipur.org'}?subject=Application for ${job.title}`}
                          className="px-8 py-4 bg-school-navy text-white rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-school-gold hover:text-school-navy transition-all shadow-lg min-w-[200px]"
                        >
                          Apply Now
                          <Send size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-40 text-center glass-surface rounded-[60px] border border-dashed border-school-ink/10">
               <div className="w-20 h-20 bg-school-ink/5 rounded-full flex items-center justify-center text-school-ink/10 mx-auto mb-8">
                 <Briefcase size={40} />
               </div>
               <h3 className="text-2xl font-serif font-black text-school-ink italic mb-2 uppercase">No Current Vacancies</h3>
               <p className="text-school-ink/40 font-light max-w-sm mx-auto">We are always looking for exceptional talent. If you believe you fit our legacy, feel free to send your resume to our HR department.</p>
               <a 
                href={`mailto:${data.content.hrEmail || 'careers@stxaviersjaipur.org'}`}
                className="mt-10 inline-flex items-center gap-2 text-school-gold font-black uppercase tracking-widest text-[10px] hover:underline"
              >
                Send Spontaneous Application <ArrowRight size={14} />
              </a>
            </div>
          )}
        </section>

        {/* Values Section */}
        <section className="py-32 bg-school-navy relative overflow-hidden">
           <div className="absolute top-0 right-0 w-1/2 h-full bg-school-gold/5 -skew-x-12 transform translate-x-1/2"></div>
           <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
             <div className="grid lg:grid-cols-2 gap-24 items-center">
               <div className="space-y-8">
                 <h2 className="text-5xl font-serif font-black text-white italic tracking-tight italic uppercase">Why Work <span className="text-school-gold">With Us?</span></h2>
                 <p className="text-white/60 text-lg font-light leading-relaxed">
                   At St. Xavier's, we believe that education is more than just teaching—it's a mission to form men and women for others. We provide a professional environment where growth is encouraged and tradition is honored.
                 </p>
                 <ul className="space-y-6">
                    {[
                      "Global Network of Jesuit Institutions",
                      "Commitment to Professional Development",
                      "Rich Institutional Heritage & Prestige",
                      "Supportive Faculty Community"
                    ].map((val) => (
                      <li key={val} className="flex items-center gap-4 text-white/80 group">
                        <div className="w-2 h-2 bg-school-gold rounded-full group-hover:scale-150 transition-transform"></div>
                        <span className="font-bold uppercase tracking-tight text-sm">{val}</span>
                      </li>
                    ))}
                 </ul>
               </div>
               <div className="relative">
                 <div className="aspect-square bg-white/5 rounded-[60px] border border-white/10 flex items-center justify-center p-12">
                   <div className="text-center space-y-8">
                     <p className="text-4xl font-serif font-black text-white italic leading-tight">
                        "Enkindling Minds & Empowering Souls"
                     </p>
                     <div className="w-12 h-1 bg-school-gold mx-auto"></div>
                     <p className="text-xs uppercase tracking-[0.4em] text-white/30">Jaipur Xavier Educational Association</p>
                   </div>
                 </div>
               </div>
             </div>
           </div>
        </section>
      </div>
    </Layout>
  );
};

export default CareersPage;
