import React from 'react';
import { motion } from 'motion/react';
import Layout from '../components/layout/Layout';
import { AppData } from '../types';
import { 
  Users, 
  Trophy, 
  Music, 
  Palette, 
  Globe, 
  Camera, 
  Microscope,
  Award,
  Heart,
  FileText,
  Star,
  Activity,
  Zap,
  ShieldCheck
} from 'lucide-react';
import Markdown from 'react-markdown';

const CoCurricularActivitiesPage = ({ data }: { data: AppData }) => {
  const dynamicActivities = data.activities || [];

  // Icon mapping helper
  const getIcon = (title: string, index: number) => {
    const t = title.toLowerCase();
    if (t.includes('sport') || t.includes('athletic') || t.includes('game')) return <Trophy size={32} className="text-school-gold" />;
    if (t.includes('music') || t.includes('dance') || t.includes('cultural')) return <Music size={32} className="text-school-gold" />;
    if (t.includes('art') || t.includes('creative') || t.includes('palette')) return <Palette size={32} className="text-school-gold" />;
    if (t.includes('club') || t.includes('society') || t.includes('inquisitive')) return <Users size={32} className="text-school-gold" />;
    if (t.includes('science') || t.includes('microscope') || t.includes('lab')) return <Microscope size={32} className="text-school-gold" />;
    if (t.includes('service') || t.includes('social') || t.includes('heart')) return <Heart size={32} className="text-school-gold" />;
    if (t.includes('ncc') || t.includes('scout') || t.includes('shield')) return <ShieldCheck size={32} className="text-school-gold" />;
    
    // Cycle through icons for variety if no keyword matches
    const icons = [<Star size={32} />, <Activity size={32} />, <Zap size={32} />, <Award size={32} />, <Globe size={32} />, <Camera size={32} />];
    return React.cloneElement(icons[index % icons.length] as React.ReactElement<any>, { className: "text-school-gold" });
  };

  return (
    <Layout data={data}>
      <div className="pt-32 bg-school-paper min-h-screen">
        {/* Hero Section */}
        <section className="py-20 bg-school-navy relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
          </div>
          <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-5xl md:text-7xl font-serif font-black text-white tracking-tighter mb-6 italic uppercase">
                {data.content.activitiesHeroTitle || "Co-Curricular"} <br /> 
                <span className="text-school-gold not-italic uppercase text-3xl md:text-4xl tracking-[0.3em]">
                  {data.content.activitiesHeroSubtitle || "Activities"}
                </span>
              </h1>
              <p className="text-white/50 text-xl font-light max-w-3xl mx-auto italic">
                {data.content.activitiesHeroDescription || "Developing sound principles of conduct and action through steady supervision and guidance."}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Dynamic Activity Sections */}
        <section className="py-24 max-w-7xl mx-auto px-6 lg:px-12">
          {dynamicActivities.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
              {dynamicActivities.map((section, idx) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="group bg-white rounded-[40px] p-10 border border-school-ink/5 shadow-sm hover:shadow-2xl hover:border-school-gold/20 transition-all duration-500 flex flex-col"
                >
                  <div className="w-16 h-16 bg-school-ink/5 rounded-2xl flex items-center justify-center text-school-navy mb-8 group-hover:bg-school-navy group-hover:text-white transition-all shadow-sm">
                    {getIcon(section.title, idx)}
                  </div>
                  
                  <h3 className="text-2xl font-serif font-black text-school-ink italic mb-4 uppercase group-hover:text-school-gold transition-colors">
                    {section.title}
                  </h3>
                  
                  {section.heading && (
                    <p className="text-[10px] font-black uppercase text-school-gold tracking-widest mb-6">
                      {section.heading}
                    </p>
                  )}

                  <div className="markdown-body prose prose-sm max-w-none text-school-ink/60 font-light leading-relaxed flex-1">
                    <Markdown>{section.content}</Markdown>
                  </div>

                  {section.image_url && (
                    <div className="mt-8 rounded-[24px] overflow-hidden aspect-video border border-school-ink/10">
                      <img 
                        src={section.image_url} 
                        alt={section.title} 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}

                  {section.attachmentUrl && (
                    <div className="mt-6 pt-6 border-t border-school-ink/5">
                      <a 
                        href={section.attachmentUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-school-gold font-black uppercase tracking-widest text-[10px] hover:underline"
                      >
                        View Resource <FileText size={12} />
                      </a>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-40 text-center glass-surface rounded-[60px] border border-dashed border-school-ink/10">
               <div className="w-20 h-20 bg-school-ink/5 rounded-full flex items-center justify-center text-school-ink/10 mx-auto mb-8">
                 <Zap size={40} />
               </div>
               <h3 className="text-2xl font-serif font-black text-school-ink italic mb-2 uppercase">Activities Portal Updating</h3>
               <p className="text-school-ink/40 font-light max-w-sm mx-auto">We are currently migrating our extensive co-curricular directory to the digital campus portal.</p>
            </div>
          )}
        </section>

        {/* Philosophy Section */}
        <section className="py-24 border-t border-school-ink/5 bg-school-ink/5">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-10"
            >
              <div className="flex justify-center">
                <Heart className="text-school-gold" size={40} />
              </div>
              <p className="text-2xl md:text-3xl font-serif font-black text-school-ink italic leading-tight">
                {data.content.activitiesPhilosophyText || "\"Honesty, trust, cooperation, self-reliance, and hard work are inculcated through various school activities. In these, the student learns to do things for themselves under guidance.\""}
              </p>
              <div className="w-24 h-1.5 bg-school-gold mx-auto rounded-full"></div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-school-ink/30">Jaipur Xavier Educational Association</p>
            </motion.div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default CoCurricularActivitiesPage;

