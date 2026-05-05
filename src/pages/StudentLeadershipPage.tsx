import React from 'react';
import { motion } from 'motion/react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import Layout from '../components/layout/Layout';
import { AppData, FormerStudentLeader } from '../types';
import { GraduationCap, Calendar, ShieldCheck } from 'lucide-react';

// Three.js Background Component
const BackgroundScene = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1.5} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#d4af37" />
      </Canvas>
    </div>
  );
};

const TimelineItem = ({ leader, index, side }: { leader: FormerStudentLeader, index: number, side: 'left' | 'right' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: side === 'left' ? -50 : 50, y: 20 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
      className={`relative mb-8 flex w-full ${side === 'left' ? 'justify-end pr-8' : 'justify-start pl-8'}`}
    >
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl w-full max-w-sm px-8 py-6 border-l-4 border-school-gold hover:shadow-school-gold/20 transition-all duration-500 hover:-translate-y-1 relative group overflow-hidden">
        <div className="absolute -top-4 -right-4 p-4 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity rotate-12">
           <ShieldCheck size={100} className="text-school-navy" />
        </div>
        <div className="flex items-center gap-2 mb-3">
          <Calendar size={14} className="text-school-gold" />
          <span className="text-school-gold font-black text-[11px] uppercase tracking-[0.2em]">{leader.academic_year}</span>
        </div>
        <h3 className="font-serif text-2xl text-school-ink mb-1 group-hover:text-school-gold transition-colors duration-300">
          {leader.name}
        </h3>
        <p className="text-school-ink/40 text-[10px] font-bold uppercase tracking-widest">{leader.role}</p>
      </div>
    </motion.div>
  );
};

const StudentLeadershipPage = ({ data }: { data: AppData }) => {
  const formerLeadersList = (data.former_student_leaders || [])
    .filter(l => l.is_enabled !== false)
    .sort((a, b) => {
      // Sort by academic year descending
      const yearA = (a.academic_year || "").split('-')[0];
      const yearB = (b.academic_year || "").split('-')[0];
      return parseInt(yearB) - parseInt(yearA);
    });

  const headBoys = formerLeadersList.filter(l => l.role === 'Head Boy');
  const headGirls = formerLeadersList.filter(l => l.role === 'Head Girl');

  return (
    <Layout data={data}>
      <div className="bg-school-paper min-h-screen selection:bg-school-gold/30 relative overflow-hidden">
        <BackgroundScene />
        
        {/* Banner Section */}
        <section className="pt-40 pb-24 px-6 relative z-10">
          <div className="max-w-7xl mx-auto flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-center relative"
            >
              <div className="inline-block px-5 py-2 bg-school-gold/10 text-school-gold text-[11px] font-black uppercase tracking-[0.5em] mb-8 rounded-full border border-school-gold/20 backdrop-blur-md">
                Institutional Legacy
              </div>
              <h1 className="text-6xl md:text-9xl font-serif text-school-ink tracking-tighter mb-8 leading-none">
                Former <br />
                <span className="italic text-school-gold">Head Boy & Girls</span>
              </h1>
              <div className="w-32 h-px bg-linear-to-r from-transparent via-school-gold to-transparent mx-auto mb-10"></div>
              <p className="max-w-2xl mx-auto text-school-ink/50 text-xl font-medium leading-relaxed italic">
                A hall of honor dedicated to those who carried forward the torch of leadership and excellence at St. Xavier's.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Timeline Columns Section */}
        <section className="pb-32 px-6 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative">
              {/* Vertical Divider Line for Desktop */}
              <div className="hidden md:block absolute left-1/2 -top-10 -bottom-10 w-px bg-linear-to-b from-transparent via-school-gold/20 to-transparent"></div>

              {/* Head Boys Column */}
              <div className="space-y-12">
                <div className="flex items-center justify-center md:justify-end gap-4 mb-12 pr-0 md:pr-12">
                   <h2 className="text-3xl md:text-5xl font-serif italic text-school-ink">Head Boys</h2>
                   <div className="w-12 h-px bg-school-gold"></div>
                </div>
                {headBoys.length > 0 ? (
                  headBoys.map((leader, index) => (
                    <TimelineItem key={leader.id} leader={leader} index={index} side="left" />
                  ))
                ) : (
                  <div className="text-center py-20 text-school-ink/30 italic">Records being updated...</div>
                )}
              </div>

              {/* Head Girls Column */}
              <div className="space-y-12 pt-20 md:pt-0">
                <div className="flex items-center justify-center md:justify-start gap-4 mb-12 pl-0 md:pl-12">
                   <div className="w-12 h-px bg-school-gold"></div>
                   <h2 className="text-3xl md:text-5xl font-serif italic text-school-ink">Head Girls</h2>
                </div>
                {headGirls.length > 0 ? (
                  headGirls.map((leader, index) => (
                    <TimelineItem key={leader.id} leader={leader} index={index} side="right" />
                  ))
                ) : (
                  <div className="text-center py-20 text-school-ink/30 italic">Records being updated...</div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Footer Accent */}
        <section className="py-32 px-6 bg-school-navy text-white relative overflow-hidden rounded-t-[100px] shadow-[0_-20px_50px_rgba(0,0,0,0.2)]">
          <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          </div>
          
          <div className="max-w-3xl mx-auto text-center relative z-10">
             <motion.div
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
             >
               <GraduationCap className="mx-auto mb-10 text-school-gold" size={80} />
               <h2 className="text-5xl font-serif italic mb-8">Once a Xavierite, <br /> <span className="text-school-gold">Always a Xavierite</span></h2>
               <div className="w-16 h-1 bg-school-gold mx-auto mb-8 rounded-full"></div>
               <p className="text-white/40 font-medium italic text-lg">
                 Upholding the torch of truth, justice, and liberty - our leaders carry the spirit of "Luceat Lux Vestra" into the world.
               </p>
             </motion.div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default StudentLeadershipPage;
