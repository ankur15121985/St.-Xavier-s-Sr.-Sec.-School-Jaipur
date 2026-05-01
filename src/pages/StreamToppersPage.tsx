import React from 'react';
import { motion } from 'motion/react';
import Layout from '../components/layout/Layout';
import { AppData, StreamwiseTopper } from '../types';
import { Award, Star, BookOpen, Calculator, Globe } from 'lucide-react';

const StreamToppersPage = ({ data }: { data: AppData }) => {
  const scienceToppers = data.streamwise_toppers.filter(t => t.stream === 'Science');
  const commerceToppers = data.streamwise_toppers.filter(t => t.stream === 'Commerce');
  const humanitiesToppers = data.streamwise_toppers.filter(t => t.stream === 'Humanities');

  const TopperCard = ({ topper, index }: { topper: StreamwiseTopper, index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative"
    >
      <div className="absolute inset-0 bg-school-gold/20 rounded-[40px] blur-2xl group-hover:bg-school-gold/40 transition-all opacity-0 group-hover:opacity-100" />
      <div className="relative bg-white rounded-[40px] p-8 border border-school-ink/5 shadow-xl hover:shadow-2xl transition-all h-full flex flex-col items-center text-center overflow-hidden">
        {/* Academic Year Badge */}
        <div className="absolute top-6 right-6 px-3 py-1 bg-school-navy/5 rounded-full text-[10px] font-black tracking-widest text-school-navy/40 uppercase">
          {topper.academic_year || '2023-24'}
        </div>

        {/* Score Badge */}
        <div className="relative mb-8 pt-4">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-school-navy/5 border-2 border-dashed border-school-gold/30 flex items-center justify-center relative z-10 group-hover:bg-school-gold transition-all duration-500">
            <Star size={40} className="text-school-gold group-hover:text-white transition-colors" />
          </div>
        </div>

        <h3 className="text-2xl font-serif font-black text-school-navy leading-tight mb-2 group-hover:text-school-gold transition-colors">
          {topper.name}
        </h3>
        <p className="text-sm font-black text-school-accent uppercase tracking-widest mb-6">
          Stream Topper • {topper.stream}
        </p>
        
        <div className="mt-auto pt-6 border-t border-school-ink/5 w-full flex items-center justify-center gap-2">
           <Award size={14} className="text-school-gold" />
           <span className="text-[10px] font-black uppercase tracking-widest text-school-ink/40 italic">Institution Merit Holder</span>
        </div>
      </div>
    </motion.div>
  );

  const StreamSection = ({ title, icon: Icon, toppers, color }: { title: string, icon: any, toppers: StreamwiseTopper[], color: string }) => (
    <section className="py-24 border-b border-school-ink/5 last:border-0">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div className="space-y-4">
            <div className={`w-16 h-16 rounded-2xl ${color} flex items-center justify-center text-white mb-6 shadow-xl`}>
               <Icon size={32} />
            </div>
            <h2 className="text-5xl md:text-7xl font-serif font-black text-school-navy">
               {title} <span className="text-school-gold italic">Toppers.</span>
            </h2>
            <p className="text-xl text-school-ink/40 font-light max-w-xl">
               Celebrating the absolute pinnacle of academic performance within the {title} faculty.
            </p>
          </div>
          <div className="flex items-center gap-4 text-school-gold">
            <span className="text-6xl font-black tracking-tighter">{toppers.length}</span>
            <div className="text-[10px] font-black uppercase tracking-widest opacity-60 leading-tight">
               Registered<br />Merit Lists
            </div>
          </div>
        </div>

        {toppers.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {toppers.sort((a, b) => (a.order_index || 0) - (b.order_index || 0)).map((t, i) => (
              <TopperCard key={t.id} topper={t} index={i} />
            ))}
          </div>
        ) : (
          <div className="p-20 bg-school-paper border-2 border-dashed border-school-ink/10 rounded-[64px] text-center">
             <div className="w-20 h-20 rounded-full bg-school-ink/5 flex items-center justify-center mx-auto mb-8">
                <Star size={32} className="text-school-ink/20" />
             </div>
             <h4 className="text-2xl font-serif font-black text-school-ink opacity-30 italic">Records for this session are currently being processed.</h4>
          </div>
        )}
      </div>
    </section>
  );

  return (
    <Layout data={data}>
      <div className="pt-48 bg-school-paper min-h-screen">
        {/* Page Header */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center mb-12">
           <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             className="inline-block py-2 px-6 bg-school-gold/10 rounded-full mb-8"
           >
             <span className="text-school-gold font-black uppercase tracking-[0.4em] text-[10px]">Academic Merit Showcase</span>
           </motion.div>
           <h1 className="text-6xl md:text-[9rem] font-serif font-black text-school-navy tracking-tighter leading-none mb-12">
             The Hall of <span className="text-school-gold italic">Glory.</span>
           </h1>
           <p className="text-2xl text-school-ink/40 font-light max-w-3xl mx-auto italic">
             "To excel is to surpass the boundaries of expectation and define new horizons of potential."
           </p>
        </div>

        {/* Stream Sections */}
        <StreamSection 
          title="Science" 
          icon={Calculator} 
          toppers={scienceToppers} 
          color="bg-blue-900" 
        />
        <StreamSection 
          title="Commerce" 
          icon={BookOpen} 
          toppers={commerceToppers} 
          color="bg-emerald-900" 
        />
        <StreamSection 
          title="Humanities" 
          icon={Globe} 
          toppers={humanitiesToppers} 
          color="bg-amber-900" 
        />

        {/* Bottom Banner */}
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
                <h3 className="text-5xl md:text-7xl font-serif font-black text-white italic mb-8 italic leading-tight">Beyond Academic Borders.</h3>
                <p className="text-xl text-white/40 font-light max-w-2xl mx-auto mb-16">
                  While we celebrate these stellar scores, we remember that true Xavierite excellence lies in being "Men and Women for Others" - where intellect meets compassion.
                </p>
                <div className="w-32 h-1 bg-school-gold mx-auto rounded-full mb-12"></div>
                <div className="text-[10px] uppercase font-black tracking-[0.6em] text-white/30 border border-white/5 inline-block py-2 px-6 rounded-full backdrop-blur-md">
                   Made by ABHISHEK MATHUR
                </div>
              </motion.div>
           </div>
        </section>
      </div>
    </Layout>
  );
};

export default StreamToppersPage;
