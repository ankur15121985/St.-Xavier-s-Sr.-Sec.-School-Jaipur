import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import Layout from '../components/layout/Layout';
import { AppData, FormerStudentLeader } from '../types';
import { GraduationCap, Calendar, ShieldCheck, Award } from 'lucide-react';

// Three.js Background Component with more active effects
const ParticleField = () => {
  const points = useRef<THREE.Points>(null);
  
  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.getElapsedTime() * 0.05;
      points.current.rotation.x = state.clock.getElapsedTime() * 0.02;
    }
  });

  const count = 2000;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 15;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
  }

  return (
    <Points positions={positions} ref={points}>
      <PointMaterial
        transparent
        color="#d4af37"
        size={0.015}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.3}
      />
    </Points>
  );
};

const BackgroundScene = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#ffffff" />
        <ParticleField />
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
          <Sphere args={[1, 100, 200]} scale={1.5} position={[-4, 2, -2]}>
            <MeshDistortMaterial color="#002147" speed={3} distort={0.4} />
          </Sphere>
        </Float>
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1.5}>
          <Sphere args={[1, 100, 200]} scale={1} position={[4, -2, -3]}>
            <MeshDistortMaterial color="#d4af37" speed={2} distort={0.3} />
          </Sphere>
        </Float>
      </Canvas>
    </div>
  );
};

const TimelineItem = ({ leader, index, side }: { leader: FormerStudentLeader, index: number, side: 'left' | 'right' }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <motion.div
      ref={containerRef}
      style={{ y, opacity }}
      className={`relative mb-4 flex w-full ${side === 'left' ? 'justify-start md:pr-12' : 'justify-end md:pl-12'}`}
    >
      <div className="bg-white/90 backdrop-blur-xl rounded-[32px] shadow-2xl w-full max-w-lg px-8 py-6 border border-white/40 ring-1 ring-black/5 hover:ring-school-gold/50 transition-all duration-700 hover:-translate-y-2 group relative overflow-hidden">
        {/* Decorative background accent */}
        <div className={`absolute top-0 ${side === 'left' ? 'right-0' : 'left-0'} w-32 h-32 bg-school-gold/5 rounded-full blur-3xl group-hover:bg-school-gold/10 transition-colors`}></div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-school-gold/10 flex items-center justify-center text-school-gold group-hover:bg-school-gold group-hover:text-white transition-all">
                <Award size={20} />
             </div>
             <div className="flex flex-col">
                <span className="text-school-gold font-black text-[11px] uppercase tracking-[0.3em]">{leader.academic_year}</span>
                <p className="text-school-ink/30 text-[9px] font-black uppercase tracking-[0.2em] line-clamp-1">{leader.role}</p>
             </div>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
             <ShieldCheck size={20} className="text-school-gold" />
          </div>
        </div>
        
        <h3 className="font-serif text-4xl text-school-navy mb-4 leading-tight group-hover:text-school-gold transition-colors duration-300">
          {leader.name}
        </h3>
        
        <div className="h-1 w-12 bg-linear-to-r from-school-gold to-transparent rounded-full opacity-30 group-hover:w-24 group-hover:opacity-100 transition-all duration-500"></div>
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

  // Interleave the leaders by year
  const combinedLeaders: FormerStudentLeader[] = [];
  const maxLen = Math.max(headBoys.length, headGirls.length);
  for (let i = 0; i < maxLen; i++) {
    if (headBoys[i]) combinedLeaders.push(headBoys[i]);
    if (headGirls[i]) combinedLeaders.push(headGirls[i]);
  }

  return (
    <Layout data={data}>
      <div className="bg-school-paper min-h-screen selection:bg-school-gold/30 relative overflow-hidden">
        <BackgroundScene />
        
        {/* Banner Section */}
        <section className="pt-10 pb-16 px-6 relative z-10">
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

        {/* Timeline List Section */}
        <section className="pb-32 px-6 relative z-10">
          <div className="max-w-4xl mx-auto relative">
             <div className="absolute left-1/2 top-10 bottom-10 w-px bg-linear-to-b from-transparent via-school-gold/20 to-transparent hidden md:block"></div>
             
             <div className="space-y-4">
                {combinedLeaders.length > 0 ? (
                  combinedLeaders.map((leader, index) => (
                    <TimelineItem key={leader.id} leader={leader} index={index} side={index % 2 === 0 ? 'left' : 'right'} />
                  ))
                ) : (
                  <div className="text-center py-20 text-school-ink/30 italic">Records being updated...</div>
                )}
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
