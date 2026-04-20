import React from 'react';
import { AppData } from '../types';
import Layout from '../components/layout/Layout';
import { motion } from 'motion/react';
import { Trophy, Award, Star } from 'lucide-react';

const AchievementsPage = ({ data }: { data: AppData }) => {
  return (
    <Layout links={data.links}>
      <section className="pt-48 pb-40 bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center mb-24">
           <h2 className="text-7xl font-serif font-black text-school-navy mb-8">Pillars of <span className="text-school-gold italic">Pride.</span></h2>
           <p className="text-xl text-school-navy/50 font-light max-w-2xl mx-auto">Celebrating the academic, cultural, and sporting milestones of the Xavierite community.</p>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid md:grid-cols-3 gap-12">
          {data.achievements.map((a, i) => (
            <motion.div 
              key={a.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-12 glass-card rounded-[48px] flex flex-col items-center text-center group"
            >
              <div className="w-24 h-24 rounded-3xl bg-school-navy/5 text-school-gold mb-10 flex items-center justify-center group-hover:bg-school-navy group-hover:text-white transition-all group-hover:scale-110 shadow-inner">
                {i % 2 === 0 ? <Trophy size={40} /> : <Award size={40} />}
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-school-gold mb-4">{a.year} Milestone</span>
              <h4 className="text-3xl font-serif font-black text-school-navy mb-6 group-hover:text-school-gold transition-colors">{a.title}</h4>
              <p className="text-sm text-school-navy/40 font-light leading-relaxed">{a.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-40">
           <div className="relative rounded-[64px] overflow-hidden bg-school-navy p-20 text-center">
              <Star size={120} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/5" />
              <div className="relative z-10">
                <h3 className="text-5xl font-serif font-black text-white mb-8 italic">"Building Men & Women for Others."</h3>
                <p className="text-xl text-white/40 font-light max-w-2xl mx-auto mb-16">Our legacy isn't just in the trophies we win, but in the character we build and the community we serve.</p>
                <div className="flex justify-center gap-12 text-white">
                  <div>
                    <div className="text-6xl font-black mb-2 tracking-tighter">80+</div>
                    <div className="text-[10px] uppercase font-black tracking-widest opacity-40">Years of Legacy</div>
                  </div>
                  <div className="w-px h-24 bg-white/10 hidden sm:block"></div>
                  <div>
                    <div className="text-6xl font-black mb-2 tracking-tighter">15k+</div>
                    <div className="text-[10px] uppercase font-black tracking-widest opacity-40">Global Alumni</div>
                  </div>
                </div>
              </div>
           </div>
        </div>
      </section>
    </Layout>
  );
};

export default AchievementsPage;
