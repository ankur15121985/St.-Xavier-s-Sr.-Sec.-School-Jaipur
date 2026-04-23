import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Trophy, School as SchoolIcon, Map as MapIcon, Calendar, Bell, Users2 } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { PerspectiveCard } from '../components/ui/PerspectiveCard';
import { AppData } from '../types';

import { Carousel } from '../components/ui/Carousel';
import { HonorsSlider } from '../components/ui/HonorsSlider';

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

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] as any }
  };

  const staggerContainer = {
    initial: {},
    whileInView: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  return (
    <Layout data={data}>
      {/* Full Width Dynamic Carousel */}
      <section className="w-full h-[60vh] md:h-screen overflow-hidden relative">
        <Carousel images={carouselImages} />
        {/* Overlaid Branding Overlay for Carousel */}
        <div className="absolute inset-0 bg-gradient-to-b from-school-ink/30 via-transparent to-school-ink/60 pointer-events-none flex items-center justify-center">
            <motion.div 
               initial={{ opacity: 0, y: 50 }}
               animate={{ opacity: 1, y: 0 }}
               className="text-center px-6"
            >
               <h1 className="text-5xl md:text-9xl font-black text-white tracking-widest uppercase italic drop-shadow-2xl">Jaipur Legacy.</h1>
            </motion.div>
        </div>
      </section>

      {/* Immersive Wero-Style Hero Section - Background Transparent */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden px-6 py-32 bg-transparent">
        {/* Large Decorative Background Text for Mobile/Desktop */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 pointer-events-none select-none overflow-hidden lg:hidden">
          <h2 className="text-[40vw] font-black text-school-accent opacity-[0.03] -rotate-12 translate-x-[-10%] translate-y-[20%] whitespace-nowrap">
            2026-27
          </h2>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10 w-full">
          <div className="flex flex-col items-center text-center space-y-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="px-6 py-2 bg-white/80 backdrop-blur-md rounded-full border border-school-accent/10 shadow-sm"
            >
              <span className="text-[14px] font-bold text-school-accent uppercase tracking-widest">A Legacy of Jesuit Excellence</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-[12vw] md:text-[8rem] font-sans font-black leading-[0.9] tracking-tighter text-school-ink"
            >
              Beyond <br />
              <span className="text-school-accent">Imagination.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-2xl md:text-3xl text-school-ink/60 font-medium max-w-3xl leading-snug"
            >
              Step into a world where tradition meets innovation. <br className="hidden md:block" />
              Empowering leaders since <span className="text-school-accent font-black">1941</span>.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-6"
            >
              <button className="px-14 py-6 bg-school-accent text-white rounded-full text-xl font-black shadow-[0_20px_40px_rgba(122,61,252,0.3)] hover:scale-105 active:scale-95 transition-all">
                Join the Legacy
              </button>
              <button className="px-14 py-6 bg-school-neon text-school-ink rounded-full text-xl font-black shadow-[0_20px_40px_rgba(199,242,18,0.2)] hover:scale-105 active:scale-95 transition-all">
                Explore Campus
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Wero-style Marquee Wrapper - Semi-transparent */}
      <section className="bg-school-accent/80 backdrop-blur-md py-12 overflow-hidden">
        <div className="flex animate-infinite-scroll whitespace-nowrap gap-16">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-16 text-white text-[120px] font-black tracking-tighter uppercase leading-none opacity-90">
              <span>St. Xaviers</span>
              <div className="w-16 h-16 bg-school-neon rounded-full" />
              <span className="text-school-neon italic">Jaipur</span>
              <div className="w-16 h-16 bg-school-gold rounded-full" />
              <span>Jesuit</span>
              <div className="w-16 h-16 border-4 border-white rounded-full" />
            </div>
          ))}
        </div>
      </section>

      {/* Feature Section - Overlapping Pills - BG Transparent */}
      <section className="py-40 bg-transparent relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <motion.div 
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-[10vw] md:text-8xl font-black text-school-ink leading-none tracking-tight">
                Crafted for <br />
                <span className="text-school-accent italic">Modernality.</span>
              </h2>
              <p className="text-2xl text-school-ink/60 font-medium leading-relaxed max-w-xl">
                We believe in an education that transcends boundaries. Our curriculum is a perfect blend of digital fluency and ancient wisdom.
              </p>
              
              <div className="flex flex-wrap gap-4">
                {['Smart Labs', 'Global Network', 'Jesuit Values', 'High Performance'].map((tag, i) => (
                  <span key={i} className="px-8 py-3 rounded-full border-2 border-school-accent/20 bg-white/40 backdrop-blur-sm text-xl font-bold hover:bg-school-accent hover:text-white transition-all cursor-default">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="relative aspect-square"
            >
              <div className="absolute inset-0 bg-school-accent/10 rounded-[100px] rotate-3 -z-10 blur-3xl animate-blob" />
              <div className="relative h-full w-full rounded-[100px] overflow-hidden shadow-2xl border-8 border-white bg-white/50 backdrop-blur-2xl">
                 <img src={carouselImages[0]} className="w-full h-full object-cover mix-blend-multiply opacity-90" alt="Feature" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision Section - Blended Tone Glass */}
      <section className="py-40 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[80px] mx-6 mb-20 overflow-hidden relative shadow-2xl group">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <h3 className="text-[15vw] md:text-[12rem] font-sans font-black leading-none tracking-tighter uppercase italic opacity-5 absolute top-10 left-1/2 -translate-x-1/2 select-none group-hover:opacity-10 transition-opacity">
              Motto
            </h3>
            <h4 className="text-5xl md:text-7xl font-black leading-tight relative z-10 max-w-5xl mx-auto text-school-ink">
              "For God and Country" represents our core ethos of service and devotion.
            </h4>
            <div className="flex justify-center pt-10">
              <Link to="/history" className="px-16 py-7 bg-school-accent text-white rounded-full text-2xl font-black hover:scale-110 active:scale-95 transition-all shadow-xl">
                The Full Story
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Campus Intelligence - BG Transparent */}
      <section className="py-40 bg-transparent my-20">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 text-center mb-32 space-y-6">
          <h3 className="text-6xl md:text-[8rem] font-sans font-black text-school-ink tracking-tight">Stay Wired.</h3>
          <p className="text-2xl text-school-accent font-black uppercase tracking-widest">Real-time Institutional Heartbeat</p>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12">
           <motion.div 
             whileHover={{ y: -10 }}
             className="bg-white/40 backdrop-blur-3xl p-12 rounded-[80px] shadow-2xl space-y-12 border border-white/40 hover:border-school-accent/20 transition-all"
           >
              <div className="flex items-center justify-between">
                <h4 className="text-5xl font-black text-school-ink tracking-tighter">Notice Board</h4>
                <div className="w-20 h-20 bg-school-accent/10 rounded-full flex items-center justify-center text-school-accent"><Bell size={40} /></div>
              </div>
              <div className="grid gap-6">
                {data.notices.slice(0, 3).map((n, i) => (
                  <Link key={n.id} to="/notices" className="flex items-center justify-between p-8 bg-white/30 rounded-[40px] hover:bg-school-accent hover:text-white transition-all group">
                    <div>
                      <p className="text-sm font-black text-gray-500 uppercase tracking-widest mb-2 group-hover:text-white/60">{n.date}</p>
                      <h5 className="text-2xl font-black text-school-ink leading-tight group-hover:text-white">{n.title}</h5>
                    </div>
                    <ArrowRight size={32} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0" />
                  </Link>
                ))}
              </div>
           </motion.div>

           <motion.div 
             whileHover={{ y: -10 }}
             className="bg-school-accent/90 backdrop-blur-3xl p-12 rounded-[80px] shadow-2xl space-y-12 text-white border border-white/20"
           >
              <div className="flex items-center justify-between">
                <h4 className="text-5xl font-black tracking-tighter text-white">Engagements</h4>
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center text-school-neon"><Calendar size={40} /></div>
              </div>
              <div className="grid gap-8">
                {data.events.slice(0, 3).map((e, i) => (
                  <div key={e.id} className="flex gap-8 items-center border-b border-white/10 pb-8 last:border-0 group cursor-default">
                    <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-[32px] flex items-center justify-center text-white shrink-0 group-hover:scale-110 group-hover:bg-school-neon group-hover:text-school-ink transition-all">
                      <span className="text-4xl font-black leading-none">{24 + i}</span>
                    </div>
                    <div>
                      <h5 className="text-3xl font-black text-white leading-tight">{e.title}</h5>
                      <p className="text-white/60 font-black uppercase text-sm tracking-widest mt-2">{e.location}</p>
                    </div>
                  </div>
                ))}
              </div>
           </motion.div>
        </div>
      </section>

      {/* Message from the Principal Section - BG Transparent */}
      <section className="py-40 bg-transparent relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-32 items-center">
            {/* Portrait - Large Rounded */}
            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               className="relative"
            >
              <div className="aspect-[4/5] rounded-[100px] overflow-hidden shadow-[0_80px_160px_-40px_rgba(0,0,0,0.15)] relative group bg-white/30 backdrop-blur-xl border border-white/40">
                <img 
                  src="https://picsum.photos/seed/arockiam_principal/800/1000" 
                  className="w-full h-full object-cover grayscale brightness-105 group-hover:grayscale-0 transition-all duration-[2s]" 
                  alt="Fr. M. Arockiam, SJ"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-school-ink/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              {/* Badge */}
              <div className="absolute -bottom-10 -right-10 bg-school-neon p-10 rounded-[40px] shadow-2xl rotate-3 border-4 border-white/80">
                <p className="text-4xl font-black text-school-ink leading-none italic">Leadership</p>
                <div className="w-12 h-2 bg-school-accent mt-4 rounded-full" />
              </div>
            </motion.div>

            {/* Content */}
            <div className="space-y-12">
              <span className="px-8 py-3 bg-white/40 backdrop-blur-sm rounded-full text-sm font-black uppercase tracking-[0.3em] text-school-accent shadow-sm border border-white/60">Guardian's Vision</span>
              <h2 className="text-[12vw] md:text-9xl font-black text-school-ink leading-[0.8] tracking-tighter">
                Lead <br />
                with <br />
                <span className="text-school-accent italic text-[14vw] md:text-[10rem]">Grace.</span>
              </h2>
              <div className="space-y-10 text-school-ink/60 font-medium text-3xl leading-snug">
                <p className="relative">
                  <span className="absolute -top-12 -left-12 text-[15rem] font-serif text-school-accent opacity-5 pointer-events-none select-none">“</span>
                  We cultivate individuals of character, resilient in spirit and enlightened in soul. Education is the journey of becoming.
                </p>
                <div className="pt-6">
                   <Link to="/principal-message" className="inline-flex items-center gap-6 px-14 py-6 bg-school-ink text-white rounded-full text-xl font-black hover:bg-school-accent transition-all shadow-xl active:scale-95">
                     The Full Narrative <ArrowRight size={32} />
                   </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Distinction Section - Transparent with Glass Elements */}
      <section className="py-40 bg-transparent relative overflow-hidden">
        {/* Decorative Circle with Blend */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] border-[100px] border-school-accent/5 rounded-full pointer-events-none mix-blend-multiply" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-32 space-y-4">
            <h2 className="text-7xl md:text-[10rem] font-black text-school-ink tracking-tighter leading-none opacity-5 absolute -top-20 left-0 text-left">ESTABLISHED.</h2>
            <h2 className="text-6xl md:text-8xl font-black text-school-ink tracking-tighter relative">Hyper-Focused <br /><span className="text-school-accent italic font-serif">Excellence.</span></h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Academic Mastery', subtitle: 'Section 01', icon: <SchoolIcon size={48} /> },
              { title: 'Holistic Legacy', subtitle: 'Section 02', icon: <Trophy size={48} /> },
              { title: 'Global Identity', subtitle: 'Section 03', icon: <Users2 size={48} /> }
            ].map((h, i) => (
              <motion.div 
                key={i}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group bg-white/40 backdrop-blur-3xl p-16 rounded-[80px] border border-white/60 hover:bg-school-accent hover:text-white transition-all cursor-pointer flex flex-col justify-between min-h-[500px] shadow-xl shadow-school-accent/5"
              >
                <div className="w-24 h-24 bg-school-accent rounded-[32px] flex items-center justify-center text-white mb-10 group-hover:bg-white group-hover:text-school-accent group-hover:rotate-12 transition-all shadow-lg shadow-school-accent/20">
                  {h.icon}
                </div>
                <div>
                  <p className="text-sm font-black uppercase text-school-accent tracking-widest mb-4 group-hover:text-white/60">{h.subtitle}</p>
                  <h4 className="text-5xl font-black text-school-ink leading-tight group-hover:text-white transition-colors">{h.title}</h4>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Narrative Grid - Ultra Rounded Gallery - BG Transparent */}
      <section className="py-40 bg-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-32 flex flex-col md:flex-row md:items-end justify-between gap-12">
            <h2 className="text-7xl md:text-[12rem] font-black text-school-ink tracking-tighter leading-[0.8]">
              Campus <br />
              <span className="text-school-accent italic">Oeuvre.</span>
            </h2>
            <p className="text-2xl text-school-ink/40 font-medium max-w-sm leading-tight">
              A visual collective capturing the vibrant soul of St. Xavier's Jaipur.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {data.gallery.slice(0, 6).map((img, i) => (
                <motion.div
                  key={img.id}
                  whileHover={{ scale: 0.98 }}
                  className="relative group overflow-hidden rounded-[80px] aspect-[4/5] bg-white/20 backdrop-blur-xl shadow-2xl border border-white/40"
                >
                  <img 
                    src={img.url} 
                    className="w-full h-full object-cover grayscale brightness-110 group-hover:grayscale-0 transition-all duration-[1s]" 
                    alt={img.caption}
                  />
                  <div className="absolute inset-x-6 bottom-6 bg-white/90 backdrop-blur-md p-8 rounded-[40px] translate-y-32 group-hover:translate-y-0 transition-transform duration-500 shadow-xl">
                     <p className="text-sm font-black text-school-accent uppercase tracking-widest mb-2">Moments</p>
                     <p className="text-xl font-black text-school-ink">{img.caption}</p>
                  </div>
                </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* Leadership Section - Blended Regency Pills */}
      <section className="py-40 bg-white/10 backdrop-blur-3xl rounded-[100px] mx-6 lg:mx-12 my-20 overflow-hidden relative shadow-2xl border border-white/20">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-32 gap-10">
             <div className="space-y-4">
                <span className="px-6 py-2 bg-school-accent text-white rounded-full text-xs font-black uppercase tracking-widest">The Guardians</span>
                <h2 className="text-7xl md:text-[10rem] font-black text-school-ink tracking-tighter leading-[0.8]">The <br /><span className="text-school-accent italic">Regency.</span></h2>
             </div>
             <div className="max-w-xl">
                <Link to="/staff" className="group flex items-center justify-center gap-6 px-16 py-7 bg-school-ink text-white rounded-full text-xl font-black hover:bg-school-accent transition-all shadow-2xl">
                  Staff Archive <ArrowRight size={32} className="group-hover:translate-x-2 transition-transform" />
                </Link>
             </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {data.staff.filter(s => s.type === 'Management' || s.type === 'Administration').slice(0, 4).map((s, i) => (
              <motion.div 
                key={s.id}
                whileHover={{ y: -10 }}
                className="group bg-white/50 backdrop-blur-2xl p-8 rounded-[100px] shadow-2xl transition-all border border-white/60"
              >
                <div className="relative aspect-square rounded-full overflow-hidden mb-10 border-8 border-white/80 shadow-inner">
                  {s.image ? (
                    <img src={s.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={s.name} />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center"><Users2 size={64} className="text-school-ink/10" /></div>
                  )}
                </div>
                <div className="text-center px-4 mb-8">
                  <h4 className="text-3xl font-black text-school-ink leading-tight">{s.name}</h4>
                  <p className="text-sm font-black uppercase text-school-accent tracking-widest mt-4">{s.role}</p>
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
    </Layout>
  );
};

export default HomePage;
