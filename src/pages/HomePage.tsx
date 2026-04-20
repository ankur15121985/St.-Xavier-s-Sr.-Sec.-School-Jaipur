import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Trophy, School as SchoolIcon, Map as MapIcon, Calendar, Bell, Users2 } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { PerspectiveCard } from '../components/ui/PerspectiveCard';
import { AppData } from '../types';

const HomePage = ({ data }: { data: AppData }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });

  const textX = useTransform(springX, [ -50, 50 ], [ 15, -15 ]);
  const textY = useTransform(springY, [ -50, 50 ], [ 15, -15 ]);
  const textRotateX = useTransform(springY, [ -50, 50 ], [ 5, -5 ]);
  const textRotateY = useTransform(springX, [ -50, 50 ], [ -5, 5 ]);

  const handleHeroMouseMove = (e: React.MouseEvent) => {
    const x = e.clientX - window.innerWidth / 2;
    const y = e.clientY - window.innerHeight / 2;
    mouseX.set(x / 20);
    mouseY.set(y / 20);
  };

  return (
    <Layout>
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-slate-50" onMouseMove={handleHeroMouseMove}>
        <div className="absolute inset-0 z-0 overflow-hidden">
           <motion.div 
             animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0], x: [0, 100, 0], y: [0, 50, 0] }}
             transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
             className="absolute -top-[20%] -left-[10%] w-[60%] h-[80%] bg-school-navy/5 rounded-full blur-[120px]"
           />
           <motion.div 
             animate={{ scale: [1, 1.3, 1], rotate: [0, -45, 0], x: [0, -150, 0], y: [0, -100, 0] }}
             transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
             className="absolute -bottom-[10%] -right-[5%] w-[50%] h-[70%] bg-school-gold/10 rounded-full blur-[100px]"
           />
           <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-white to-transparent"></div>
        </div>
        <motion.div style={{ x: textX, y: textY, rotateX: textRotateX, rotateY: textRotateY, transformStyle: "preserve-3d" }} className="relative z-10 text-center px-6 pointer-events-none">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}>
            <div className="inline-block px-8 py-2.5 glass-surface rounded-full text-[11px] font-black uppercase tracking-[0.5em] text-school-navy mb-12 floating shadow-sm border border-school-navy/5 font-black">ESTABLISHED 1941 • JESUIT TRADITION</div>
            <h2 className="text-8xl md:text-[11rem] font-serif font-black text-school-navy leading-[0.8] mb-12 tracking-tighter glow-text pointer-events-auto">Transforming <br /> <span className="text-school-gold italic">Vision.</span></h2>
            <p className="text-2xl md:text-3xl text-school-navy/50 font-light mb-16 max-w-3xl mx-auto leading-relaxed pointer-events-auto">Empowering men and women for others with a commitment to academic excellence and moral fortitude in Jaipur.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-10 pointer-events-auto">
              <button className="px-16 py-6 glass-dark text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl">Digital Registration</button>
              <button className="px-16 py-6 glass-surface text-school-navy rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl">Virtual Tour</button>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Highlights Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid md:grid-cols-3 gap-12">
           {[
             { title: 'Academic Excellence', subtitle: 'Curriculum', icon: <SchoolIcon size={32} />, color: 'bg-school-navy text-white' },
             { title: 'Holistic Growth', subtitle: 'Sports & Arts', icon: <Trophy size={32} />, color: 'bg-school-gold text-school-navy' },
             { title: 'Global Legacy', subtitle: 'Alumni Network', icon: <Users2 size={32} />, color: 'bg-white text-school-navy border border-slate-100' }
           ].map((h, i) => (
             <PerspectiveCard key={i} delay={i * 0.1}>
               <div className={`p-10 rounded-[40px] flex flex-col items-center text-center shadow-sm hover:shadow-2xl transition-all ${h.color}`}>
                 <div className="mb-8">{h.icon}</div>
                 <span className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">{h.subtitle}</span>
                 <h4 className="text-2xl font-serif font-black">{h.title}</h4>
               </div>
             </PerspectiveCard>
           ))}
        </div>
      </section>

      {/* Snapshot of Staff */}
      <section className="py-40 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-end mb-24">
          <div className="max-w-2xl">
            <h2 className="text-6xl font-serif font-black text-school-navy mb-8">Executive <span className="text-school-gold italic">Leadership.</span></h2>
            <p className="text-xl text-school-navy/50 font-light">The visionaries guiding St. Xavier's Jaipur towards a brighter future.</p>
          </div>
          <Link to="/staff" className="flex items-center gap-4 px-8 py-4 glass-dark text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl">
            View All Staff <ArrowRight size={14} />
          </Link>
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {data.staff.slice(0, 4).map((s, i) => (
            <PerspectiveCard key={s.id} delay={i * 0.1}>
              <div className="glass-surface p-8 rounded-[32px] border border-slate-100 flex flex-col items-center text-center h-full">
                <div className="w-32 h-32 rounded-3xl mb-8 shadow-xl overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-200">
                  {s.image ? (
                    <img src={s.image} className="w-full h-full object-cover" alt={s.name} referrerPolicy="no-referrer" />
                  ) : (
                    <Users2 size={48} className="text-slate-300" />
                  )}
                </div>
                <h4 className="text-2xl font-serif font-black text-school-navy mb-2">{s.name}</h4>
                <p className="text-[10px] uppercase font-black tracking-widest text-school-gold">{s.role}</p>
              </div>
            </PerspectiveCard>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
