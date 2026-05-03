import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Trophy, 
  School as SchoolIcon, 
  Map as MapIcon, 
  Calendar, 
  Bell, 
  Users2
} from 'lucide-react';

import Layout from '../components/layout/Layout';
import { FocusVisual } from '../components/ui/FocusVisual';
import { Campus3D } from '../components/ui/Campus3D';
import { AppData } from '../types';

import { Carousel } from '../components/ui/Carousel';
import { HonorsSlider } from '../components/ui/HonorsSlider';
import { AnnouncementModal } from '../components/ui/AnnouncementModal';
import { Marquee } from '../components/ui/Marquee';

const HomePage = ({ data }: { data: AppData }) => {
  const carouselImages = data.carousel && data.carousel.length > 0 
    ? data.carousel.map(c => c.url) 
    : [
        "https://lh3.googleusercontent.com/d/1C-_jZCL-OpkhhOV_R6oTGRfNxkhBIkHN=w1600",
        "https://lh3.googleusercontent.com/d/1ZfP3k6bFiwdZdEe3CI_U6KhBkAEaybUs=w1600",
        "https://lh3.googleusercontent.com/d/187y5AfGgvXnofNL6h85uU1rpdfaWYDCH=w1600"
      ];

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });

  const textX = useTransform(springX, [ -50, 50 ], [ 10, -10 ]);
  const textY = useTransform(springY, [ -50, 50 ], [ 10, -10 ]);
  const textRotateX = useTransform(springY, [ -50, 50 ], [ 3, -3 ]);
  const textRotateY = useTransform(springX, [ -50, 50 ], [ -3, 3 ]);

  const handleHeroMouseMove = (e: React.MouseEvent) => {
    const x = e.clientX - window.innerWidth / 2;
    const y = e.clientY - window.innerHeight / 2;
    mouseX.set(x / 30);
    mouseY.set(y / 30);
  };

  return (
    <Layout data={data}>
      {/* Spacer for fixed navbar on Home page */}
      <div className="h-[120px] md:h-[180px]" />

      {/* Full Width Dynamic Carousel */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full h-[calc(100vh-120px)] md:h-[calc(100vh-180px)] overflow-hidden relative shadow-2xl"
      >
        <Carousel images={carouselImages} />
      </motion.section>

      {/* Marquee Section */}
      <Marquee items={data.marquee || []} />

      {/* About St. Xavier's School - Introduction Section */}
      <section id="about-section" className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.1, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="inline-block px-4 py-1.5 bg-school-accent/10 rounded-full">
                <span className="text-school-accent font-bold uppercase tracking-widest text-[10px]">
                  {data.content?.aboutBadge || 'Welcome to Excellence'}
                </span>
              </div>
              <h2 className="text-4xl md:text-6xl font-sans font-bold text-school-navy tracking-tight leading-tight">
                {data.content?.aboutTitle1 || 'About'} <br />
                <span className="text-school-accent">{data.content?.aboutTitle2 || 'St. Xavier’s School.'}</span>
              </h2>
              <p className="text-lg text-slate-700 font-medium leading-relaxed">
                {data.content?.aboutDescription || 'Established in 1941, St. Xavier\'s School, Jaipur, is a premier Jesuit institution dedicated to the holistic development of its students.'}
              </p>
              <div className="pt-4">
                <Link to="/history" className="inline-flex items-center gap-3 px-8 py-3 bg-school-navy text-white rounded-full font-bold hover:bg-school-accent transition-all shadow-xl">
                  Our Story
                  <ArrowRight size={18} />
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ amount: 0.1, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="relative aspect-square"
            >
              <div className="h-full w-full rounded-[40px] overflow-hidden border border-black/5 shadow-xl">
                <img 
                  src="https://lh3.googleusercontent.com/d/1ZfP3k6bFiwdZdEe3CI_U6KhBkAEaybUs" 
                  alt="About St. Xavier’s School" 
                  className="w-full h-full object-cover" 
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Section - Simple Clean */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <motion.div 
               initial={{ opacity: 0, y: 50 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ amount: 0.1 }}
               transition={{ duration: 0.8 }}
               className="space-y-8"
            >
              <h2 className="text-5xl md:text-7xl font-bold text-school-navy leading-tight tracking-tight">
                Crafted for <br />
                <span className="text-school-accent">Modernity.</span>
              </h2>
              <p className="text-lg text-slate-700 font-medium leading-relaxed max-w-xl">
                We believe in an education that transcends boundaries. Our curriculum is a perfect blend of digital fluency and ancient wisdom.
              </p>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ amount: 0.1 }}
               transition={{ duration: 0.8 }}
               className="relative aspect-square"
            >
              <div className="h-full w-full rounded-3xl overflow-hidden shadow-xl border border-black/5">
                 <img src={carouselImages[0]} className="w-full h-full object-cover" alt="Feature" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision Section - Minimal Clean */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ amount: 0.1 }}
        transition={{ duration: 1 }}
        className="py-24 border-y border-black/5 dark:border-white/5"
      >
        <div className="max-w-7xl mx-auto px-6 text-center">
            <h4 className="text-2xl md:text-5xl font-bold leading-tight max-w-4xl mx-auto text-school-navy dark:text-white">
              {data.content?.mottoDescription || '"For God and Country" represents our core ethos of service and devotion.'}
            </h4>
        </div>
      </motion.section>

      {/* Insights Section - Simple Clean */}
      <section className="py-32 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.1 }}
          className="max-w-[1440px] mx-auto px-6 text-center mb-16"
        >
          <h3 className="text-4xl md:text-6xl font-bold text-school-navy tracking-tight">Stay Updated.</h3>
        </motion.div>

        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8">
           <motion.div 
             initial={{ opacity: 0, x: -30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ amount: 0.1 }}
             transition={{ duration: 0.8 }}
             className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm p-10 rounded-3xl border border-black/5 shadow-sm"
           >
              <h4 className="text-2xl font-bold mb-8">Notice Board</h4>
              <div className="space-y-4">
                {data.notices.slice(0, 3).map((n) => (
                  <Link key={n.id} to="/notices" className="block p-5 rounded-2xl bg-black/5 dark:bg-white/5 hover:bg-school-accent/5 transition-all border border-black/5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{n.date}</p>
                    <h5 className="text-lg font-bold text-school-navy dark:text-white leading-tight">{n.title}</h5>
                  </Link>
                ))}
              </div>
           </motion.div>

           <motion.div 
             initial={{ opacity: 0, x: 30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ amount: 0.1 }}
             transition={{ duration: 0.8 }}
             className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm p-10 rounded-3xl border border-black/5 shadow-sm"
           >
              <h4 className="text-2xl font-bold mb-8 text-school-navy dark:text-white">Upcoming Events</h4>
              <div className="space-y-6">
                {data.events.slice(0, 3).map((e, i) => (
                  <div key={e.id} className="flex gap-6 items-center border-b border-black/5 dark:border-white/5 pb-6 last:border-0">
                    <div className="w-16 h-16 bg-school-navy text-white rounded-2xl flex items-center justify-center shrink-0">
                      <span className="text-2xl font-bold">{24 + i}</span>
                    </div>
                    <div>
                      <h5 className="text-lg font-bold leading-tight text-school-navy dark:text-white">{e.title}</h5>
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">{e.location}</p>
                    </div>
                  </div>
                ))}
              </div>
           </motion.div>
        </div>
      </section>

      {/* Principal Message Section - Slick Editorial */}
      <section className="py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <motion.div 
               initial={{ opacity: 0, x: -50 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ amount: 0.1 }}
               transition={{ duration: 1 }}
               className="relative"
            >
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ amount: 0.1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="aspect-[4/5] rounded-3xl overflow-hidden shadow-xl relative group transition-all duration-1000 border border-black/5"
              >
                <img 
                  src={data.content?.principalLeadGraceImage || "https://lh3.googleusercontent.com/d/1Jou0otbLF6w1gb7ESnRALHnDbjCEgmxc"} 
                  className="w-full h-full object-cover" 
                  alt={data.content?.principalTitleLead || "Fr. M. Arockiam, SJ"}
                />
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ amount: 0.1 }}
              transition={{ duration: 1 }}
              className="space-y-10"
            >
              <span className="text-[10px] font-bold uppercase tracking-widest text-school-accent">
                {data.content?.principalBadge || "Guardian's Vision"}
              </span>
              <h2 className="text-5xl md:text-7xl font-bold text-school-navy leading-tight tracking-tight">
                {data.content?.principalTitle1 || 'Lead'} <br />
                <span className="text-school-accent italic">{data.content?.principalTitle3 || 'Grace.'}</span>
              </h2>
              <div className="space-y-8 text-slate-800 font-bold text-lg md:text-2xl leading-relaxed italic">
                <p>
                  {data.content?.principalQuote || 'We cultivate individuals of character, resilient in spirit and enlightened in soul. Education is the journey of becoming.'}
                </p>
                <div className="pt-4 not-italic">
                   <Link to="/principal-message" className="inline-flex items-center gap-3 px-8 py-3 bg-school-navy text-white rounded-full font-bold hover:bg-school-accent transition-all shadow-xl">
                     Read The Full Message <ArrowRight size={18} />
                   </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Distinction Section - Redesigned Hyper-Focused Excellence */}
      <section className="py-20 md:py-32 relative overflow-hidden bg-school-paper">
        <FocusVisual />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="mb-20">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ amount: 0.1 }}
              className="flex items-center gap-4 mb-6"
            >
              <div className="w-12 h-[1px] bg-school-accent" />
              <span className="text-school-accent font-black uppercase tracking-[0.3em] text-[10px]">Institutional Distinction</span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.1 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl md:text-7xl font-black text-school-navy dark:text-white leading-[0.9] tracking-tighter max-w-4xl"
            >
              Hyper-focused <br />
              <span className="text-school-accent italic font-serif font-light">Excellence.</span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Card 01 - Academic Mastery (NEW & COMPACT) */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.1 }}
              transition={{ duration: 0.8 }}
              className="group relative"
            >
              <div className="relative h-[480px] bg-white dark:bg-slate-900 rounded-[40px] border border-black/5 p-10 flex flex-col justify-between overflow-hidden shadow-2xl shadow-black/5">
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 bg-school-navy rounded-2xl flex items-center justify-center text-white shadow-lg shadow-school-navy/20">
                      <SchoolIcon size={24} />
                    </div>
                    <div className="h-[2px] w-8 bg-slate-100" />
                    <span className="text-2xl font-black text-school-navy/10">01</span>
                  </div>
                  
                  <h3 className="text-4xl font-black text-school-navy dark:text-white leading-tight mb-6">Academic <br />Mastery.</h3>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed">Rigorous standards meet innovative pedagogy, creating an environment where intellectual boundaries are redefined.</p>
                </div>

                <div className="relative z-10">
                  {/* Creative Visual: Mini Dashboard Style */}
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-black/5">
                    <div className="flex justify-between items-end mb-4">
                      <div className="space-y-1">
                        <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Pillar Status</div>
                        <div className="text-xs font-black text-school-navy dark:text-white">OPTIMIZED</div>
                      </div>
                      <div className="flex gap-1">
                        {[40, 70, 50, 90, 60].map((h, i) => (
                          <motion.div 
                            key={i} 
                            initial={{ height: 0 }}
                            whileInView={{ height: h + '%' }}
                            className="w-1.5 bg-school-accent rounded-full" 
                          />
                        ))}
                      </div>
                    </div>
                    <div className="h-[1px] w-full bg-slate-200 dark:bg-white/10 mb-4" />
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-1">
                         <div className="text-[7px] font-black text-slate-400 uppercase">Consistency</div>
                         <div className="text-[10px] font-black text-school-navy dark:text-white">99.8%</div>
                       </div>
                       <div className="space-y-1">
                         <div className="text-[7px] font-black text-slate-400 uppercase">Innovation</div>
                         <div className="text-[10px] font-black text-school-navy dark:text-white">LEADING</div>
                       </div>
                    </div>
                  </div>
                </div>

                {/* Decorative Technical Grid */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                  <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                </div>
              </div>
            </motion.div>

            {/* Card 02 - Holistic Legacy */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="group"
            >
              <div className="h-[480px] bg-school-accent p-10 rounded-[40px] flex flex-col justify-between text-white group cursor-pointer hover:shadow-2xl hover:shadow-school-accent/30 transition-all duration-500 overflow-hidden relative">
                <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                  <Trophy size={240} strokeWidth={1} />
                </div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-10">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                      <Trophy size={24} />
                    </div>
                    <span className="text-3xl font-black opacity-30">02</span>
                  </div>
                  
                  <h3 className="text-4xl font-black leading-tight mb-6">Holistic <br />Legacy.</h3>
                  <p className="text-white/80 text-sm font-medium leading-relaxed">A century-long commitment to nurturing character and spirit, forging leaders for a better world.</p>
                </div>
                
                <div className="relative z-10 pt-8 border-t border-white/20 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Established 1941</span>
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                    <div className="w-1 h-1 bg-white rounded-full animate-ping" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 03 - Global Identity */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="group"
            >
              <div className="h-[480px] bg-slate-50 dark:bg-slate-900 border border-black/5 p-10 rounded-[40px] flex flex-col justify-between overflow-hidden relative group cursor-pointer hover:bg-school-navy hover:text-white transition-all duration-500">
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-10">
                    <div className="w-12 h-12 bg-black/5 dark:bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-white transition-colors">
                      <Users2 size={24} className="group-hover:text-school-navy" />
                    </div>
                    <span className="text-2xl font-black text-black/10 dark:text-white/10 group-hover:text-white/20">03</span>
                  </div>
                  
                  <h3 className="text-4xl font-black leading-tight mb-6">Global <br />Identity.</h3>
                  <p className="text-slate-500 group-hover:text-white/70 text-sm font-medium leading-relaxed">Connecting Xavierites across continents through a shared vision of service and excellence.</p>
                </div>

                <div className="relative z-10">
                   <div className="flex -space-x-4 mb-6">
                     {[...Array(4)].map((_, i) => (
                       <div key={i} className="inline-block h-12 w-12 rounded-2xl ring-4 ring-white dark:ring-slate-900 bg-slate-200 group-hover:ring-school-navy transition-all overflow-hidden">
                         <img src={`https://i.pravatar.cc/150?u=${i + 10}`} className="w-full h-full object-cover" />
                       </div>
                     ))}
                     <div className="inline-block h-12 w-12 rounded-2xl ring-4 ring-white dark:ring-slate-900 bg-school-accent flex items-center justify-center text-[10px] font-black text-white group-hover:ring-school-navy">
                       +5K
                     </div>
                   </div>
                   <div className="h-[2px] w-full bg-black/5 group-hover:bg-white/10" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3D Campus Animation / Virtual Tour */}
      <section className="relative w-full h-screen overflow-hidden">
        <Campus3D />
      </section>

      {/* Visual Narrative Grid - Simple Gallery */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.1 }}
            className="mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-school-navy dark:text-white tracking-tight">
              Campus <span className="text-school-accent">Gallery.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {data.gallery.slice(0, 6).map((img, i) => (
                <motion.div
                  key={img.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ amount: 0.1 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 0.98 }}
                  className="relative group overflow-hidden rounded-3xl aspect-[4/5] bg-black/5"
                >
                  <img 
                    src={img.url} 
                    className="w-full h-full object-cover grayscale brightness-110 group-hover:grayscale-0 transition-all duration-700" 
                    alt={img.caption || 'Gallery Image'}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                     <p className="text-white font-bold">{img.caption}</p>
                  </div>
                </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* Leadership Section - Regency Registry Style */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ amount: 0.1 }}
            className="mb-20 border-b border-black/5 dark:border-white/5 pb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
          >
            <div>
              <h2 className="text-4xl md:text-7xl font-bold text-school-navy dark:text-white tracking-tight">
                {data.content?.regencyTitle || 'The Regency.'}
              </h2>
              <p className="text-slate-400 font-medium mt-4 max-w-xl">
                {data.content?.regencyDescription || 'The governing body and leadership dedicated to the institutional vision and student excellence.'}
              </p>
            </div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-12">
            {data.staff.filter(s => s.type === 'Management' || s.type === 'Administration').slice(0, 6).map((s, i) => (
              <motion.div 
                key={s.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ amount: 0.1 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ x: 10 }}
                className="group flex flex-col gap-4 border-l-2 border-slate-100 dark:border-slate-800 pl-8 hover:border-school-accent transition-colors py-2"
              >
                <div className="space-y-1">
                  <h4 className="text-2xl md:text-3xl font-bold text-school-navy dark:text-white leading-none group-hover:text-school-accent transition-colors">
                    {s.name}
                  </h4>
                  <p className="text-sm font-black text-school-accent uppercase tracking-[0.2em]">
                    {s.role}
                  </p>
                </div>
                {s.bio && (
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-sm">
                    {s.bio}
                  </p>
                )}
                <div className="pt-2">
                  <span className="text-[10px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest">Leadership Registry • SXS Jaipur</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Student Honors / Congratulations Slider */}
      <div className="bg-transparent pb-32">
        <HonorsSlider honors={data.studentHonors} />
      </div>

      <AnnouncementModal popups={data.popups || []} />
    </Layout>
  );
};

export default HomePage;
