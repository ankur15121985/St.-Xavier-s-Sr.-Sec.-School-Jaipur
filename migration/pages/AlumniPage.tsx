import React from 'react';
import { motion } from 'motion/react';
import Layout from '../components/layout/Layout';
import { AppData } from '../types';
import { 
  Users, 
  MapPin, 
  Calendar, 
  Newspaper, 
  ExternalLink,
  MessageSquare,
  Globe,
  PartyPopper,
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AlumniPage = ({ data }: { data: AppData }) => {
  const alumniSections = data.alumni || [];
  
  return (
    <Layout data={data}>
      <div className="pt-32 bg-school-paper min-h-screen">
        {/* Banner with Background Image */}
        <section className="relative h-[400px] overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0">
            <img 
              src={data.content.alumniHeroImage || "https://picsum.photos/seed/alumni_gathering/1920/1080?blur=2"} 
              alt="Alumni Gathering Background" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-school-navy/60 backdrop-blur-[2px]"></div>
          </div>
          <div className="relative z-10 text-center px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-school-navy p-8 md:p-12 rounded-[32px] border border-white/10 shadow-2xl inline-block"
            >
              <h1 className="text-4xl md:text-6xl font-serif font-black text-white italic tracking-tighter mb-2">
                {data.content.alumniHeroTitle || "Xavier's"} <br className="md:hidden" /> <span className="text-school-gold not-italic uppercase text-2xl md:text-4xl tracking-[0.3em]">{data.content.alumniHeroSubtitle || "Alumni"}</span>
              </h1>
              <div className="w-16 h-1 bg-school-gold mx-auto mt-4"></div>
            </motion.div>
          </div>
        </section>

        {/* Dynamic Content Sections */}
        <section className="py-24 max-w-7xl mx-auto px-6 lg:px-12">
          {alumniSections.length > 0 ? (
            <div className="space-y-32">
              {alumniSections.map((section, idx) => (
                <motion.div 
                  key={section.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className={`flex flex-col ${idx % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-16 items-start`}
                >
                  <div className="lg:w-3/5 space-y-10 w-full">
                    <div className="space-y-6">
                      <h2 className="text-4xl font-serif font-black text-school-ink italic leading-snug">
                        {section.title}
                      </h2>
                      <div className="w-24 h-1.5 bg-school-gold rounded-full"></div>
                      {section.heading && (
                        <p className="text-[10px] uppercase font-black tracking-widest text-school-gold">
                          {section.heading}
                        </p>
                      )}
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
                          className="inline-flex items-center gap-3 px-8 py-4 bg-school-navy text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-school-gold hover:text-school-navy transition-all shadow-xl"
                        >
                          <FileText size={16} />
                          Download Resource
                        </a>
                      </div>
                    )}
                  </div>

                  {section.image_url && (
                    <div className="lg:w-2/5 w-full">
                      <div className="relative group">
                        <div className="absolute inset-0 bg-school-gold rounded-[40px] rotate-3 group-hover:rotate-6 transition-transform"></div>
                        <img 
                          src={section.image_url} 
                          alt={section.title} 
                          className="relative z-10 w-full aspect-[4/5] object-cover rounded-[40px] shadow-2xl border-4 border-white"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-school-paper border border-dashed border-school-ink/10 rounded-[60px]">
              <div className="w-20 h-20 bg-school-gold/10 text-school-gold rounded-full flex items-center justify-center mx-auto mb-6">
                <Users size={32} />
              </div>
              <h2 className="text-2xl font-serif font-black text-school-ink italic">Alumni Network Details Pending</h2>
              <p className="text-school-ink/40 max-w-md mx-auto mt-4 font-light">The official XA directory and alumni association updates will be available shortly.</p>
            </div>
          )}
        </section>

        {/* Alumni Dashboard Placeholder (Optional Key Links) */}
        <section className="py-24 bg-school-navy relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white rounded-full blur-[150px] -mr-[250px] -mt-[250px]" />
          </div>
          <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[48px] text-white">
                <Globe size={32} className="text-school-gold mb-6" />
                <h3 className="text-2xl font-serif font-black italic mb-4">Official Portal</h3>
                <p className="text-white/50 text-sm font-light mb-8">Access the dedicated St. Xavier's Alumni Association global website.</p>
                <a href={data.content.alumniWebsiteUrl || "#"} className="inline-flex items-center gap-2 text-school-gold text-[10px] font-black uppercase tracking-widest hover:underline whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                  Visit xaviersalumni.org <ExternalLink size={12} />
                </a>
              </div>
              
              <div className="p-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[48px] text-white">
                <Newspaper size={32} className="text-school-gold mb-6" />
                <h3 className="text-2xl font-serif font-black italic mb-4">Newsletter</h3>
                <p className="text-white/50 text-sm font-light mb-8">Quarterly magazine covering global reach and local alumni achievements.</p>
                <a href={data.content.alumniNewsletterUrl || "#"} className="inline-flex items-center gap-2 text-school-gold text-[10px] font-black uppercase tracking-widest hover:underline">
                  Download Latest Issue <ExternalLink size={12} />
                </a>
              </div>

              <div className="p-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[48px] text-white">
                <PartyPopper size={32} className="text-school-gold mb-6" />
                <h3 className="text-2xl font-serif font-black italic mb-4">Events & Ball</h3>
                <p className="text-white/50 text-sm font-light mb-8">Stay informed about the Alumni Picnic, Ball, and annual gatherings.</p>
                <Link to="/events" className="inline-flex items-center gap-2 text-school-gold text-[10px] font-black uppercase tracking-widest hover:underline">
                  View Event Calendar <ExternalLink size={12} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Closing Quote */}
        <section className="py-24 bg-school-paper border-y border-school-ink/10 text-center px-6">
           <motion.div 
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             viewport={{ once: true }}
             className="max-w-2xl mx-auto space-y-6"
           >
             <MessageSquare className="text-school-gold mx-auto" size={32} />
             <p className="text-xl font-serif font-black italic text-school-ink leading-relaxed">
               {data.content.alumniQuote || "\"Once a Xaverian, Always a Xaverian. Our legacy is built by the footprints of those who walked these halls before us.\""}
             </p>
             <div className="w-16 h-1 bg-school-gold mx-auto"></div>
           </motion.div>
        </section>
      </div>
    </Layout>
  );
};

export default AlumniPage;
