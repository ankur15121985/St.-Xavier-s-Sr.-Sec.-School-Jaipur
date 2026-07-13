import React from 'react';
import { motion } from 'motion/react';
import Layout from '../components/layout/Layout';
import { AppData, StudentHonor } from '../types';
import { Award, GraduationCap, Star, Zap } from 'lucide-react';

const LaurelDistinctionPage = ({ data }: { data: AppData }) => {
  const enabledHonors = (data.studentHonors || []).filter(h => h.is_enabled !== false);
  
  const class10Toppers = enabledHonors.filter(h => h.category === 'Class 10 Topper');
  const class12Toppers = enabledHonors.filter(h => h.category === 'Class 12 Topper');
  const jeeAchievers = enabledHonors.filter(h => h.category === 'JEE Achiever');

  const HonorCard = ({ honor, index }: { honor: StudentHonor, index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative"
    >
      <div className="absolute inset-0 bg-school-gold/20 rounded-[40px] blur-2xl group-hover:bg-school-gold/40 transition-all opacity-0 group-hover:opacity-100" />
      <div className="relative bg-white rounded-[40px] p-8 border border-school-ink/5 shadow-xl hover:shadow-2xl transition-all h-full flex flex-col items-center text-center overflow-hidden">
        {/* Academic Image */}
        {!data.settings?.hideAttachedImages && (
          <div className="relative mb-8 pt-4">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-school-paper shadow-2xl relative z-10 group-hover:scale-110 transition-transform duration-700">
              {honor.image ? (
                <img src={honor.image} alt={honor.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-school-navy/5 flex items-center justify-center">
                  <Star className="text-school-gold opacity-30" size={40} />
                </div>
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-school-gold rounded-full flex items-center justify-center text-white border-4 border-white z-20 shadow-lg">
               <Award size={20} />
            </div>
          </div>
        )}

        <h3 className="text-2xl font-serif font-black text-school-navy leading-tight mb-2 group-hover:text-school-gold transition-colors">
          {honor.name}
        </h3>
        <p className="text-sm font-black text-school-accent uppercase tracking-widest mb-4">
          {honor.result}
        </p>
        <p className="text-xs text-school-ink/50 leading-relaxed italic line-clamp-3">
          {honor.subtext}
        </p>
        
        <div className="mt-8 pt-6 border-t border-school-ink/5 w-full flex items-center justify-center gap-2">
           <Award size={14} className="text-school-gold" />
           <span className="text-[10px] font-black uppercase tracking-widest text-school-ink/40 italic">Institution Pride</span>
        </div>
      </div>
    </motion.div>
  );

  const Section = ({ title, icon: Icon, students, description, color }: { title: string, icon: any, students: StudentHonor[], description: string, color: string }) => (
    <section className="py-24 border-b border-school-ink/5 last:border-0" id={title.toLowerCase().replace(/\s+/g, '-')}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div className="space-y-4">
            <div className={`w-16 h-16 rounded-2xl ${color} flex items-center justify-center text-white mb-6 shadow-xl`}>
               <Icon size={32} />
            </div>
            <h2 className="text-5xl md:text-7xl font-serif font-black text-school-navy">
               {title}.
            </h2>
            <p className="text-xl text-school-ink/40 font-light max-w-xl">
               {description}
            </p>
          </div>
          <div className="flex items-center gap-4 text-school-gold">
            <span className="text-6xl font-black tracking-tighter">{students.length}</span>
            <div className="text-[10px] font-black uppercase tracking-widest opacity-60 leading-tight">
               Achievers<br />Recognized
            </div>
          </div>
        </div>

        {students.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {students.sort((a, b) => (a.order_index || 0) - (b.order_index || 0)).map((s, i) => (
              <HonorCard key={s.id} honor={s} index={i} />
            ))}
          </div>
        ) : (
          <div className="p-20 bg-school-paper border-2 border-dashed border-school-ink/10 rounded-[64px] text-center">
             <div className="w-20 h-20 rounded-full bg-school-ink/5 flex items-center justify-center mx-auto mb-8">
                <Star size={32} className="text-school-ink/20" />
             </div>
             <h4 className="text-2xl font-serif font-black text-school-ink opacity-30 italic">No records displayed for this category.</h4>
          </div>
        )}
      </div>
    </section>
  );

  return (
    <Layout data={data}>
      <div className="bg-school-paper min-h-screen">
        {/* Page Header */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center pt-20 mb-12">
           <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             className="inline-block py-2 px-6 bg-school-gold/10 rounded-full mb-8"
           >
             <span className="text-school-gold font-black uppercase tracking-[0.4em] text-[10px]">Academic & Competitive Merit</span>
           </motion.div>
           <h1 className="text-6xl md:text-[9rem] font-serif font-black text-school-navy tracking-tighter leading-none mb-12">
             Laurel & <span className="text-school-gold italic">Distinction.</span>
           </h1>
           <p className="text-2xl text-school-ink/40 font-light max-w-3xl mx-auto italic">
             "Celebrating the brilliant minds that define our legacy of excellence and set new benchmarks for the future."
           </p>
        </div>

        {/* Navigation Quick Links */}
        <div className="max-w-7xl mx-auto px-6 mb-20 flex flex-wrap justify-center gap-4">
           {['Class 10 Toppers', 'Class 12 Toppers', 'JEE Achievers'].map(anchor => (
             <button 
               key={anchor}
               onClick={() => document.getElementById(anchor.toLowerCase().replace(/\s+/g, '-'))?.scrollIntoView({ behavior: 'smooth' })}
               className="px-8 py-3 bg-white border border-school-ink/5 rounded-full text-[10px] font-black uppercase tracking-widest text-school-navy hover:bg-school-gold hover:text-white transition-all shadow-sm"
             >
               {anchor}
             </button>
           ))}
        </div>

        {/* Sections */}
        <Section 
          title="Class 10 Toppers" 
          icon={GraduationCap} 
          students={class10Toppers} 
          description="Foundational brilliance in the secondary board examinations."
          color="bg-indigo-900" 
        />
        <Section 
          title="Class 12 Toppers" 
          icon={Award} 
          students={class12Toppers} 
          description="Exceptional performance in the senior secondary examinations."
          color="bg-crimson-900" 
        />
        <Section 
          title="JEE Achievers" 
          icon={Zap} 
          students={jeeAchievers} 
          description="Our competitive edge: Top rankers in JEE Mains and Advanced."
          color="bg-emerald-900" 
        />

        {/* Decorative Bottom Banner */}
        <section className="py-40 px-6">
           <div className="max-w-7xl mx-auto relative rounded-[80px] overflow-hidden bg-school-navy p-20 text-center">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="relative z-10"
              >
                <div className="w-24 h-24 bg-white/10 rounded-3xl flex items-center justify-center text-school-gold mx-auto mb-10 border border-white/5 shadow-inner">
                   <Star size={48} />
                </div>
                <h3 className="text-5xl md:text-7xl font-display font-medium text-white italic mb-8 leading-tight">Inspiring Generations.</h3>
                <p className="text-xl text-white/40 font-light max-w-2xl mx-auto mb-16 italic">
                  "Every achievement is a stepping stone to a greater purpose. May your brilliance light up the world around you."
                </p>
                <div className="w-32 h-1 bg-school-gold mx-auto rounded-full mb-12"></div>
                <div className="text-[10px] uppercase font-black tracking-[0.6em] text-white/30 border border-white/5 inline-block py-2 px-6 rounded-full backdrop-blur-md">
                   VINCIT OMNIA VERITAS
                </div>
              </motion.div>
           </div>
        </section>
      </div>
    </Layout>
  );
};

export default LaurelDistinctionPage;
