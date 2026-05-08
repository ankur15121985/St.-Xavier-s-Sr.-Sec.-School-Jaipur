import React from 'react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import Layout from '../components/layout/Layout';
import { AppData } from '../types';
import { 
  BookOpen, 
  Award, 
  Lightbulb, 
  Microscope,
  Scroll,
  FileText,
  ChevronRight
} from 'lucide-react';

const AcademicsPage = ({ data }: { data: AppData }) => {
  const sections = data.academics || [];

  return (
    <Layout data={data}>
      <Helmet>
        <title>Academics | St. Xavier's Sr. Sec. School, Jaipur</title>
        <meta name="description" content="Explore the academic excellence, curriculum, and educational philosophy at St. Xavier's Sr. Sec. School, Jaipur. From primary to senior secondary education." />
      </Helmet>
      <div className="bg-school-paper min-h-screen">
        {/* Artistic Hero Section */}
        <section className="py-24 bg-school-navy relative overflow-hidden">
          <div className="absolute inset-0 z-0">
             <div className="absolute top-0 right-0 w-[60%] h-full bg-school-gold/5 blur-[120px] rounded-full translate-x-1/2"></div>
             <div className="absolute bottom-0 left-0 w-[40%] h-[60%] bg-white/5 blur-[100px] rounded-full -translate-x-1/2"></div>
          </div>
          <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl"
            >
              <div className="inline-flex items-center gap-3 px-6 py-2 bg-school-gold/10 text-school-gold rounded-full text-[10px] font-black uppercase tracking-widest mb-10 border border-school-gold/20 backdrop-blur-md">
                <BookOpen size={14} />
                Intellectual Formation
              </div>
              <h1 className="text-6xl md:text-8xl font-serif font-black text-white tracking-tighter mb-8 italic uppercase leading-none">
                Academic <span className="text-school-gold block">Excellence</span>
              </h1>
              <p className="text-white/60 text-xl font-light italic max-w-2xl leading-relaxed">
                St. Xavier’s Jaipur offers a rigorous academic curriculum grounded in the Jesuit tradition of 'Magis'—the pursuit of the greater good through holistic learning.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Dynamic Content Sections from data.academics */}
        <section className="py-24 max-w-7xl mx-auto px-6 lg:px-12">
          {sections.length > 0 ? (
            <div className="space-y-32">
              {sections.map((section, idx) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className={`flex flex-col ${idx % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-20 items-center`}
                >
                  <div className="lg:w-1/2 space-y-10 w-full">
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-school-navy rounded-3xl flex items-center justify-center text-school-gold shadow-2xl">
                          {idx % 4 === 0 && <Award size={32} />}
                          {idx % 4 === 1 && <Microscope size={32} />}
                          {idx % 4 === 2 && <Lightbulb size={32} />}
                          {idx % 4 === 3 && <Scroll size={32} />}
                        </div>
                        <div>
                          <h2 className="text-4xl font-serif font-black text-school-ink italic tracking-tight uppercase leading-none">
                            {section.title}
                          </h2>
                          {section.heading && (
                            <p className="text-[10px] font-black uppercase text-school-gold tracking-[0.3em] mt-3">{section.heading}</p>
                          )}
                        </div>
                      </div>
                      <div className="w-24 h-1.5 bg-school-gold rounded-full"></div>
                      <div 
                        className="markdown-body prose prose-lg max-w-none text-school-ink/70 font-light leading-relaxed text-justify"
                        dangerouslySetInnerHTML={{ __html: section.content }}
                      />
                    </div>

                    {section.attachmentUrl && (
                      <div className="pt-6">
                        <a 
                          href={section.attachmentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-3 px-10 py-5 bg-school-navy text-white rounded-[24px] text-[10px] font-black uppercase tracking-widest hover:bg-school-gold hover:text-school-navy transition-all shadow-2xl group"
                        >
                          <FileText size={18} />
                          Download Academic Resource
                          <ChevronRight size={16} className="group-hover:translate-x-2 transition-transform" />
                        </a>
                      </div>
                    )}
                  </div>

                  {section.image_url && (
                    <div className="lg:w-1/2 w-full">
                      <div className="relative">
                        <div className="absolute inset-0 bg-school-navy rounded-[60px] translate-x-4 translate-y-4"></div>
                        <img 
                          src={section.image_url} 
                          alt={section.title} 
                          className="relative z-10 w-full aspect-[4/3] object-cover rounded-[60px] shadow-2xl border-2 border-white/10"
                          loading="lazy"
                        />
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-school-gold rounded-[40px] z-0 blur-2xl opacity-20"></div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-40 text-center bg-white rounded-[80px] border border-dashed border-school-ink/10 shadow-sm">
               <div className="w-24 h-24 bg-school-ink/5 rounded-full flex items-center justify-center text-school-ink/10 mx-auto mb-8">
                 <Scroll size={48} />
               </div>
               <h3 className="text-3xl font-serif font-black text-school-ink italic mb-4">Curriculum Details Coming Soon</h3>
               <p className="text-school-ink/40 font-light max-w-md mx-auto">Our academic department is currently updating the detailed syllabus and curriculum guidelines for the new session.</p>
            </div>
          )}
        </section>

        {/* Closing Tagline */}
        <section className="py-32 text-center bg-school-paper relative overflow-hidden">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
             <h2 className="text-[15vw] font-serif font-black text-school-ink/5 italic whitespace-nowrap uppercase">MAGIS • MAGIS • MAGIS</h2>
           </div>
           <div className="max-w-4xl mx-auto px-6 relative z-10">
             <h2 className="text-4xl md:text-5xl font-serif font-black text-school-ink italic tracking-tight underline decoration-school-gold decoration-4 underline-offset-8">
               "For the Greater Glory of God"
             </h2>
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-school-ink/30 mt-12">St. Xavier's Sr. Sec. School, Jaipur • Since 1941</p>
           </div>
        </section>
      </div>
    </Layout>
  );
};

export default AcademicsPage;
