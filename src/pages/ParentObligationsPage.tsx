import React from 'react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import Layout from '../components/layout/Layout';
import { AppData } from '../types';
import { 
  Heart, 
  HelpCircle, 
  Users, 
  Info,
  CheckCircle,
  FileText,
  AlertCircle,
  ShieldCheck,
  BookOpen
} from 'lucide-react';
import Markdown from 'react-markdown';

const ParentObligationsPage = ({ data }: { data: AppData }) => {
  const sections = data.parent_obligations || [];

  return (
    <Layout data={data}>
      <Helmet>
        <title>Obligations of Parents | St. Xavier's Sr. Sec. School, Jaipur</title>
        <meta name="description" content="Important guidelines, expectations, and obligations for parents of students at St. Xavier's Sr. Sec. School, Jaipur. Partnering for a better educational future." />
      </Helmet>
      <div className="bg-school-paper min-h-screen pb-32">
        {/* Modern Hero Section */}
        <section className="py-24 bg-school-navy relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-[20%] left-[10%] w-[40vw] h-[40vw] bg-school-gold/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-[20%] right-[10%] w-[30vw] h-[30vw] bg-white/10 rounded-full blur-[100px]" />
          </div>
          <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 px-6 py-2 bg-school-gold/10 text-school-gold rounded-full text-[10px] font-black uppercase tracking-widest mb-10 border border-school-gold/20"
            >
              <Heart size={14} />
              Educational Partnership
            </motion.div>
            <h1 className="text-5xl md:text-8xl font-serif font-black text-white tracking-tighter mb-8 italic uppercase">
              Parent <span className="text-school-gold">Obligations</span>
            </h1>
            <p className="text-white/50 text-xl font-light italic max-w-2xl mx-auto leading-relaxed">
              Fostering a collaborative environment where parents and educators work together to fulfill the school’s mission and student success.
            </p>
          </div>
        </section>

        {/* Dynamic content sections from data.parent_obligations */}
        <section className="py-24 max-w-5xl mx-auto px-6 lg:px-12">
          {sections.length > 0 ? (
            <div className="space-y-20">
              {sections.map((section, idx) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group bg-white rounded-[50px] p-10 md:p-16 border border-school-ink/5 shadow-sm hover:shadow-2xl transition-all duration-500 relative overflow-hidden"
                >
                   {/* Background Accent */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-school-paper -mr-32 -mt-32 rounded-full opacity-50 group-hover:bg-school-gold/5 transition-colors" />
                  
                  <div className="relative z-10">
                    <div className="text-center mb-14">
                      <div className="flex justify-center mb-8">
                         <div className="w-16 h-16 bg-school-navy/5 rounded-3xl flex items-center justify-center text-school-gold group-hover:scale-110 transition-transform">
                            {idx === 0 && <ShieldCheck size={32} />}
                            {idx === 1 && <Users size={32} />}
                            {idx === 2 && <Info size={32} />}
                            {idx > 2 && <BookOpen size={32} />}
                         </div>
                      </div>
                      <h3 className="text-3xl md:text-5xl font-serif font-black text-school-navy italic uppercase leading-tight group-hover:text-school-gold transition-colors underline decoration-school-gold/20 underline-offset-12">
                        {section.title}
                      </h3>
                      {section.heading && (
                        <p className="text-sm font-black uppercase text-school-gold tracking-[0.3em] mt-10 max-w-3xl mx-auto leading-relaxed text-center">
                          {section.heading}
                        </p>
                      )}
                    </div>

                    <div className="markdown-body prose prose-xl max-w-none text-school-ink/80 font-normal leading-loose text-justify space-y-4">
                      <Markdown>{section.content}</Markdown>
                    </div>

                    {section.attachmentUrl && (
                      <div className="mt-16 pt-10 border-t border-school-ink/5 flex justify-center">
                        <a 
                          href={section.attachmentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/btn inline-flex items-center gap-4 px-10 py-5 bg-school-navy text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-school-gold hover:text-school-navy transition-all shadow-xl hover:shadow-school-gold/20 active:scale-95"
                        >
                          Download Detailed Policy (PDF) 
                          <FileText size={18} className="group-hover/btn:translate-y-[-2px] transition-transform" />
                        </a>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-40 text-center glass-surface rounded-[60px] border border-dashed border-school-ink/10">
              <div className="w-20 h-20 bg-school-ink/5 rounded-full flex items-center justify-center text-school-ink/10 mx-auto mb-8">
                <Heart size={40} />
              </div>
              <h3 className="text-xl font-serif font-bold text-school-ink italic mb-4">Sharing the Journey</h3>
              <p className="text-school-ink/40 max-w-md mx-auto">Specific obligations for this year are currently being updated. Please check back shortly.</p>
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default ParentObligationsPage;
