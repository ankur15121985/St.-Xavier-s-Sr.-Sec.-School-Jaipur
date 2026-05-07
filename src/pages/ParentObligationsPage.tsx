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
  AlertCircle
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
      <div className="bg-school-paper min-h-screen">
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
        <section className="py-24 max-w-7xl mx-auto px-6 lg:px-12">
          {sections.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
              {sections.map((section, idx) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group bg-white rounded-[50px] p-10 border border-school-ink/5 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden relative"
                >
                  <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 transform translate-x-1/3 -translate-y-1/3 group-hover:text-school-gold group-hover:opacity-10 transition-all duration-500">
                    <Info size={120} />
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-14 h-14 bg-school-navy rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg group-hover:bg-school-gold group-hover:text-school-navy transition-colors">
                        {idx % 4 === 0 && <Users size={28} />}
                        {idx % 4 === 1 && <AlertCircle size={28} />}
                        {idx % 4 === 2 && <CheckCircle size={28} />}
                        {idx % 4 === 3 && <HelpCircle size={28} />}
                      </div>
                      <div>
                        <h3 className="text-2xl font-serif font-black text-school-ink italic uppercase leading-none group-hover:text-school-gold transition-colors">{section.title}</h3>
                        {section.heading && <p className="text-[9px] font-black uppercase text-school-gold tracking-widest mt-2">{section.heading}</p>}
                      </div>
                    </div>

                    <div className="markdown-body prose prose-sm max-w-none text-school-ink/70 font-light leading-relaxed">
                      <Markdown>{section.content}</Markdown>
                    </div>

                    {section.attachmentUrl && (
                      <div className="mt-8 pt-8 border-t border-school-ink/5">
                        <a 
                          href={section.attachmentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-school-gold font-black uppercase tracking-widest text-[10px] hover:underline"
                        >
                          Download Detailed Policy (PDF) <FileText size={14} />
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
              <h3 className="text-2xl font-serif font-black text-school-ink italic mb-2 uppercase">Policy Updates in Progress</h3>
              <p className="text-school-ink/40 font-light max-w-sm mx-auto">Specific guidelines for the current academic session will be available shortly. Please contact the administration for current policy details.</p>
            </div>
          )}
        </section>

        {/* Closing Notice */}
        <section className="py-24 border-t border-school-ink/5 text-center">
          <div className="max-w-4xl mx-auto px-6">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="bg-school-navy rounded-[60px] p-20 text-white relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                 <svg width="100%" height="100%">
                   <pattern id="diagonal-stripe" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                     <rect width="2" height="20" transform="translate(0,0)" fill="white"></rect>
                   </pattern>
                   <rect width="100%" height="100%" fill="url(#diagonal-stripe)"></rect>
                 </svg>
              </div>
              <h2 className="text-4xl font-serif font-black text-school-gold italic mb-8 uppercase italic underline decoration-white/20 underline-offset-8">Co-Operation is Essential</h2>
              <p className="text-white/60 text-lg font-light max-w-2xl mx-auto leading-relaxed mb-12 italic">
                {data.content.parentObligationsClosingText || '"The school counts on the full co-operation of the parents for the character formation of the student."'}
              </p>
              <div className="w-16 h-1 bg-school-gold mx-auto"></div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mt-12">Jaipur Xavier Educational Association</p>
            </motion.div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default ParentObligationsPage;
