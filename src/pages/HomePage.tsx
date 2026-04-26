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
  Users2, 
  Image as ImageIcon,
  FileText,
  Send,
  Layout as LayoutIcon,
  Users,
  Shield,
  ArrowUpRight
} from 'lucide-react';

const getIcon = (name?: string) => {
  switch (name) {
    case 'FileText': return <FileText />;
    case 'Send': return <Send />;
    case 'Layout': return <LayoutIcon />;
    case 'Calendar': return <Calendar />;
    case 'Users': return <Users />;
    case 'Shield': return <Shield />;
    case 'Trophy': return <Trophy />;
    case 'ImageIcon': return <ImageIcon />;
    case 'Bell': return <Bell />;
    case 'SchoolIcon': return <SchoolIcon />;
    default: return <ArrowUpRight />;
  }
};
import Layout from '../components/layout/Layout';
import { PerspectiveCard } from '../components/ui/PerspectiveCard';
import { Campus3D } from '../components/ui/Campus3D';
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
      <section className="w-full h-[50vh] md:h-[70vh] overflow-hidden relative">
        <Carousel images={carouselImages} />
        {/* Overlaid Branding Overlay for Carousel */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 pointer-events-none flex items-center justify-center">
            <motion.div 
               initial={{ opacity: 0, y: 50 }}
               animate={{ opacity: 1, y: 0 }}
               className="text-center px-6"
            >
               <h1 className="text-4xl md:text-8xl font-black text-white tracking-widest uppercase italic drop-shadow-2xl">
                 {data.content?.carouselBranding || 'Jaipur Legacy.'}
               </h1>
            </motion.div>
        </div>
      </section>

      {/* Immersive Wero-Style Hero Section - Background Transparent */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden px-6 py-12 md:py-20 bg-transparent">
        {/* Large Decorative Background Text for Mobile/Desktop */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 pointer-events-none select-none overflow-hidden lg:hidden">
          <h2 className="text-[60vw] font-black text-school-accent opacity-[0.02] -rotate-12 translate-x-[-10%] translate-y-[20%] whitespace-nowrap">
            2026-27
          </h2>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10 w-full">
          <div className="flex flex-col items-center text-center space-y-8 md:space-y-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="px-4 py-1.5 md:px-6 md:py-2 bg-school-paper/80 dark:bg-school-paper/30 backdrop-blur-md rounded-full border border-school-ink/10 shadow-sm"
            >
              <span className="text-[10px] md:text-[14px] font-bold text-school-accent uppercase tracking-widest">
                {data.content?.heroBadge || 'A Legacy of Jesuit Excellence'}
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-[18vw] md:text-[8rem] font-sans font-black leading-[0.9] tracking-tighter text-school-ink"
            >
              {data.content?.heroTitle1 || 'Beyond'} <br />
              <span className="text-school-accent">{data.content?.heroTitle2 || 'Imagination.'}</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-lg md:text-3xl text-school-ink/60 font-medium max-w-3xl leading-snug px-4 text-justify md:text-center"
            >
              {data.content?.heroDescription || 'Step into a world where tradition meets innovation. Empowering leaders since 1941.'}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6"
            >
              {data.settings?.applyNowEnabled && (
                <a 
                  href={data.settings.applyNowUrl || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 md:px-14 py-4 md:py-6 bg-school-accent text-white rounded-full text-lg md:text-xl font-black shadow-[0_20px_40px_rgba(122,61,252,0.3)] hover:scale-105 active:scale-95 transition-all text-center"
                >
                  {data.settings.applyNowLabel || 'Join the Legacy'}
                </a>
              )}
              <button 
                onClick={() => {
                  const campusSection = document.getElementById('campus-3d');
                  campusSection?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-8 md:px-14 py-4 md:py-6 bg-school-neon text-school-ink rounded-full text-lg md:text-xl font-black shadow-[0_20px_40px_rgba(199,242,18,0.2)] hover:scale-105 active:scale-95 transition-all"
              >
                {data.content?.exploreButton || 'Explore Campus'}
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About St. Xavier's School - Introduction Section */}
      <section id="about-section" className="py-24 bg-white dark:bg-transparent relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="inline-block px-6 py-2 bg-school-accent/10 rounded-full">
                <span className="text-school-accent font-black uppercase tracking-widest text-sm">
                  {data.content?.aboutBadge || 'Welcome to Excellence'}
                </span>
              </div>
              <h2 className="text-5xl md:text-7xl font-sans font-black text-school-ink tracking-tight">
                {data.content?.aboutTitle1 || 'About'} <br />
                <span className="text-school-accent italic">{data.content?.aboutTitle2 || 'St. Xavier’s School.'}</span>
              </h2>
              <p className="text-xl text-school-ink/60 font-medium leading-relaxed text-justify">
                {data.content?.aboutDescription || 'Established in 1941, St. Xavier\'s School, Jaipur, is a premier Jesuit institution dedicated to the holistic development of its students. Rooted in the rich heritage of the Society of Jesus, we strive to nurture "men and women for others" through academic excellence, character building, and social responsibility.'}
              </p>
              <div className="pt-4">
                <Link to="/history" className="inline-flex items-center gap-3 px-10 py-4 bg-school-ink text-white rounded-full font-black hover:bg-school-accent transition-all shadow-xl">
                  {data.content?.historyButton || 'Discover Our Story'}
                  <ArrowRight size={20} />
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-square"
            >
              <div className="absolute inset-0 bg-school-gold/20 rounded-[60px] rotate-6 -z-10 blur-2xl" />
              <div className="h-full w-full rounded-[60px] overflow-hidden border-8 border-white shadow-2xl">
                <img 
                  src="https://picsum.photos/seed/xavier_about/1000/1000" 
                  alt="School Campus" 
                  className="w-full h-full object-cover" 
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>      {/* Important Links Section - Redesigned with Editorial Bento Aesthetic */}
      <section id="important-links" className="py-24 bg-school-ink selection:bg-school-accent selection:text-white relative overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-school-accent/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[30vw] h-[30vw] bg-school-gold/5 blur-[100px] rounded-full translate-y-1/3 -translate-x-1/4" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-12 gap-16 md:gap-24 items-start">
            {/* Title Area - Editorial Style */}
            <div className="lg:col-span-5 space-y-10">
               <motion.div
                 initial={{ opacity: 0, x: -20 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 className="flex items-center gap-4"
               >
                 <div className="w-12 h-[2px] bg-school-accent" />
                 <span className="text-school-accent font-black uppercase tracking-[0.4em] text-xs">Quick Access</span>
               </motion.div>                <motion.h2 
                 initial={{ opacity: 0, y: 40 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 className="text-7xl md:text-[8.5rem] font-black text-white leading-[0.8] tracking-tighter"
               >
                 {data.content?.nodesTitle1 || 'Vital'} <br />
                 <span className="text-school-accent italic">{data.content?.nodesTitle2 || 'Nodes.'}</span>
               </motion.h2>

               <motion.p
                 initial={{ opacity: 0 }}
                 whileInView={{ opacity: 1 }}
                 viewport={{ once: true }}
                 transition={{ delay: 0.3 }}
                 className="text-xl md:text-2xl text-white/40 font-medium leading-snug max-w-sm"
               >
                 {data.content?.nodesDescription || 'The administrative heart of our institution, condensed for your convenience.'}
               </motion.p>

               <div className="pt-4">
                 <Link to="/contact" className="group flex items-center gap-4 text-white/60 hover:text-white transition-colors">
                    <span className="text-sm font-black uppercase tracking-widest">
                      {data.content?.helpdeskLabel || 'Support Helpdesk'}
                    </span>
                    <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-school-accent group-hover:border-school-accent transition-all">
                      <ArrowRight size={16} />
                    </div>
                 </Link>
               </div>
            </div>

            {/* Bento Grid Area */}
            <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-6 gap-4">
               {((data.links && data.links.length > 0) ? data.links.slice(0, 5) : [
                 { id: '1', title: 'School Fees', icon: 'Calendar', url: '/fees' },
                 { id: '2', title: 'Exams', icon: 'Trophy', url: '/notices' },
                 { id: '3', title: 'Gallery', icon: 'ImageIcon', url: '/gallery' },
                 { id: '4', title: 'Notices', icon: 'Bell', url: '/notice-board' },
                 { id: '5', title: 'Academics', icon: 'SchoolIcon', url: '/jesuit-education-objectives' },
               ]).map((item: any, idx) => {
                 const colSpan = idx === 0 || idx === 1 ? 'md:col-span-3' : idx === 2 ? 'md:col-span-2' : idx === 3 ? 'md:col-span-4' : 'md:col-span-6';
                 const color = idx === 0 ? 'bg-school-accent' : idx === 3 ? 'bg-school-neon' : idx === 4 ? 'bg-white/10' : 'bg-white/5';
                 const textColor = idx === 3 ? 'text-school-ink' : 'text-white';
                 const targetUrl = item.url || item.href;
                 
                 return (
                   <Link
                     key={item.id || idx}
                     to={targetUrl}
                     className={`${colSpan} ${color} p-8 rounded-[32px] flex flex-col justify-between hover:scale-[0.98] transition-all duration-300 group relative border border-white/5 overflow-hidden`}
                   >
                      <div className="absolute top-0 right-0 p-8 transform translate-x-4 -translate-y-4 opacity-0 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-10 transition-all duration-500">
                        <div className="scale-[3]">
                          {getIcon(item.icon)}
                        </div>
                      </div>
 
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color.includes('white') ? 'bg-white/10' : 'bg-black/10'} ${textColor}`}>
                        {getIcon(item.icon)}
                      </div>
 
                      <div className="mt-12 space-y-2 relative z-10">
                        <p className={`text-[10px] font-black uppercase tracking-widest ${textColor} opacity-50`}>Entry {idx + 1}</p>
                        <h4 className={`text-2xl font-black ${textColor} leading-tight group-hover:translate-x-2 transition-transform`}>
                          {item.title}
                        </h4>
                      </div>
                   </Link>
                 );
               })}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Insights - Animated Cards with Hover Parallax - BG Transparent */}

      {/* Wero-style Marquee Wrapper - Semi-transparent */}
      <section className="bg-school-accent/80 backdrop-blur-md py-6 md:py-12 overflow-hidden">
        <div className="flex animate-infinite-scroll whitespace-nowrap gap-8 md:gap-16">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-8 md:gap-16 text-white text-[60px] md:text-[120px] font-black tracking-tighter uppercase leading-none opacity-90">
              <span>St. Xaviers</span>
              <div className="w-8 h-8 md:w-16 md:h-16 bg-school-neon rounded-full" />
              <span className="text-school-neon italic">Jaipur</span>
              <div className="w-8 h-8 md:w-16 md:h-16 bg-school-gold rounded-full" />
              <span>Jesuit</span>
              <div className="w-8 h-8 md:w-16 md:h-16 border-4 border-white rounded-full" />
            </div>
          ))}
        </div>
      </section>

      {/* Feature Section - Overlapping Pills - BG Transparent */}
      <section className="py-12 md:py-24 bg-transparent relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 md:gap-24 items-center">
            <motion.div 
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-6 md:space-y-8"
            >
              <h2 className="text-[12vw] md:text-8xl font-black text-school-ink leading-none tracking-tight">
                Crafted for <br />
                <span className="text-school-accent italic">Modernality.</span>
              </h2>
              <p className="text-xl md:text-2xl text-school-ink/60 font-medium leading-relaxed max-w-xl text-justify">
                We believe in an education that transcends boundaries. Our curriculum is a perfect blend of digital fluency and ancient wisdom.
              </p>
              
              <div className="flex flex-wrap gap-3 md:gap-4">
                {['Smart Labs', 'Global Network', 'Jesuit Values', 'High Performance'].map((tag, i) => (
                  <span key={i} className="px-5 md:px-8 py-2 md:py-3 rounded-full border border-school-ink/10 bg-school-paper/60 backdrop-blur-sm text-lg md:text-xl font-bold hover:bg-school-accent hover:text-white transition-all cursor-default text-school-ink">
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
              <div className="absolute inset-0 bg-school-accent/10 rounded-[40px] md:rounded-[100px] rotate-3 -z-10 blur-3xl animate-blob" />
              <div className="relative h-full w-full rounded-[40px] md:rounded-[100px] overflow-hidden shadow-2xl border-4 md:border-8 border-school-paper bg-school-paper/50 backdrop-blur-2xl">
                 <img src={carouselImages[0]} className="w-full h-full object-cover mix-blend-multiply opacity-90" alt="Feature" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision Section - Blended Tone Glass */}
      <section className="py-12 md:py-24 bg-school-paper/60 dark:bg-school-paper/10 backdrop-blur-2xl border border-school-ink/10 rounded-[40px] md:rounded-[80px] mx-6 mb-12 overflow-hidden relative shadow-2xl group">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-8 md:space-y-12"
          >
            <h3 className="text-[25vw] md:text-[12rem] font-sans font-black leading-none tracking-tighter uppercase italic opacity-5 absolute top-10 left-1/2 -translate-x-1/2 select-none group-hover:opacity-10 transition-opacity">
              {data.content?.mottoTitle || 'Motto'}
            </h3>
            <h4 className="text-3xl md:text-7xl font-black leading-tight relative z-10 max-w-5xl mx-auto text-school-ink">
              {data.content?.mottoDescription || '"For God and Country" represents our core ethos of service and devotion.'}
            </h4>
            <div className="flex justify-center pt-6 md:pt-10">
              <Link to="/history" className="px-10 md:px-16 py-4 md:py-7 bg-school-accent text-white rounded-full text-xl md:text-2xl font-black hover:scale-110 active:scale-95 transition-all shadow-xl">
                The Full Story
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Campus Intelligence - BG Transparent */}
      <section className="py-12 md:py-24 bg-transparent my-6 md:my-10">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 text-center mb-10 md:mb-20 space-y-4 md:space-y-6">
          <h3 className="text-4xl md:text-[8rem] font-sans font-black text-school-ink tracking-tight">
            {data.content?.wiredTitle || 'Stay Wired.'}
          </h3>
          <p className="text-lg md:text-2xl text-school-accent font-black uppercase tracking-widest">
            {data.content?.wiredBadge || 'Real-time Institutional Heartbeat'}
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8 md:gap-12">
           <motion.div 
             whileHover={{ y: -10 }}
             className="bg-school-paper/60 dark:bg-school-paper/40 backdrop-blur-3xl p-6 md:p-12 rounded-[40px] md:rounded-[80px] shadow-2xl space-y-8 md:space-y-12 border border-school-ink/10 hover:border-school-accent/20 transition-all font-medium"
           >
              <div className="flex items-center justify-between">
                <h4 className="text-3xl md:text-5xl font-black text-school-ink tracking-tighter">Notice Board</h4>
                <div className="w-12 h-12 md:w-20 md:h-20 bg-school-accent/10 rounded-full flex items-center justify-center text-school-accent"><Bell className="w-6 h-6 md:w-10 md:h-10" /></div>
              </div>
              <div className="grid gap-4 md:gap-6">
                {data.notices.slice(0, 3).map((n, i) => (
                  <Link key={n.id} to="/notices" className="flex items-center justify-between p-5 md:p-8 bg-school-paper/60 dark:bg-school-paper/30 rounded-[24px] md:rounded-[40px] hover:bg-school-accent hover:text-white transition-all group border border-school-ink/5">
                    <div className="flex-1 min-w-0 pr-4">
                      <p className="text-[10px] md:text-sm font-black text-school-ink/50 uppercase tracking-widest mb-1 group-hover:text-white/60 truncate">{n.date}</p>
                      <h5 className="text-lg md:text-2xl font-black text-school-ink leading-tight group-hover:text-white line-clamp-2">{n.title}</h5>
                    </div>
                    <ArrowRight size={24} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0 shrink-0" />
                  </Link>
                ))}
              </div>
           </motion.div>

           <motion.div 
             whileHover={{ y: -10 }}
             className="bg-school-accent/90 backdrop-blur-3xl p-6 md:p-12 rounded-[40px] md:rounded-[80px] shadow-2xl space-y-8 md:space-y-12 text-white border border-white/20"
           >
              <div className="flex items-center justify-between">
                <h4 className="text-3xl md:text-5xl font-black tracking-tighter text-white">Engagements</h4>
                <div className="w-12 h-12 md:w-20 md:h-20 bg-white/10 rounded-full flex items-center justify-center text-school-neon"><Calendar className="w-6 h-6 md:w-10 md:h-10" /></div>
              </div>
              <div className="grid gap-6 md:gap-8">
                {data.events.slice(0, 3).map((e, i) => (
                  <div key={e.id} className="flex gap-4 md:gap-8 items-center border-b border-white/10 pb-6 md:pb-8 last:border-0 group cursor-default">
                    <div className="w-16 h-16 md:w-24 md:h-24 bg-white/10 backdrop-blur-md rounded-[20px] md:rounded-[32px] flex items-center justify-center text-white shrink-0 group-hover:scale-110 group-hover:bg-school-neon group-hover:text-school-ink transition-all">
                      <span className="text-2xl md:text-4xl font-black leading-none">{24 + i}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xl md:text-3xl font-black text-white leading-tight line-clamp-2">{e.title}</h5>
                      <p className="text-white/60 font-black uppercase text-[10px] md:text-sm tracking-widest mt-1 truncate">{e.location}</p>
                    </div>
                  </div>
                ))}
              </div>
           </motion.div>
        </div>
      </section>

      {/* Message from the Principal Section - BG Transparent */}
      <section className="py-12 md:py-24 bg-transparent relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 md:gap-32 items-center">
            {/* Portrait - Large Rounded */}
            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               className="relative"
            >
              <div className="aspect-[4/5] rounded-[40px] md:rounded-[100px] overflow-hidden shadow-[0_80px_160px_-40px_rgba(0,0,0,0.15)] relative group bg-school-paper/30 backdrop-blur-xl border border-school-ink/10">
                <img 
                  src="https://picsum.photos/seed/arockiam_principal/800/1000" 
                  className="w-full h-full object-cover grayscale brightness-105 group-hover:grayscale-0 transition-all duration-[2s]" 
                  alt="Fr. M. Arockiam, SJ"
                />
              </div>
              {/* Badge */}
              <div className="absolute -bottom-6 -right-6 md:-bottom-10 md:-right-10 bg-school-neon p-6 md:p-10 rounded-[24px] md:rounded-[40px] shadow-2xl rotate-3 border-4 border-school-paper/80">
                <p className="text-2xl md:text-4xl font-black text-school-ink leading-none italic">Leadership</p>
                <div className="w-8 h-1.5 md:w-12 md:h-2 bg-school-accent mt-3 md:mt-4 rounded-full" />
              </div>
            </motion.div>

            {/* Content */}
            <div className="space-y-8 md:space-y-12">
              <span className="px-5 md:px-8 py-2 md:py-3 bg-school-paper/40 backdrop-blur-sm rounded-full text-[10px] md:text-sm font-black uppercase tracking-[0.3em] text-school-accent shadow-sm border border-school-ink/10">
                {data.content?.principalBadge || "Guardian's Vision"}
              </span>
              <h2 className="text-[15vw] md:text-9xl font-black text-school-ink leading-[0.8] tracking-tighter">
                {data.content?.principalTitle1 || 'Lead'} <br />
                {data.content?.principalTitle2 || 'with'} <br />
                <span className="text-school-accent italic text-[18vw] md:text-[10rem]">
                  {data.content?.principalTitle3 || 'Grace.'}
                </span>
              </h2>
              <div className="space-y-6 md:space-y-10 text-school-ink/60 font-medium text-xl md:text-3xl leading-snug">
                <p className="relative">
                  <span className="absolute -top-8 -left-8 md:-top-12 md:-left-12 text-[8rem] md:text-[15rem] font-serif text-school-accent opacity-5 pointer-events-none select-none">“</span>
                  {data.content?.principalQuote || 'We cultivate individuals of character, resilient in spirit and enlightened in soul. Education is the journey of becoming.'}
                </p>
                <div className="pt-4 md:pt-6">
                   <Link to="/principal-message" className="inline-flex items-center gap-4 md:gap-6 px-10 md:px-14 py-4 md:py-6 bg-school-ink text-white rounded-full text-lg md:text-xl font-black hover:bg-school-accent transition-all shadow-xl active:scale-95">
                     {data.content?.principalButton || 'The Full Narrative'} <ArrowRight className="w-6 h-6 md:w-8 md:h-8" />
                   </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Distinction Section - Transparent with Glass Elements */}
      <section className="py-12 md:py-24 bg-transparent relative overflow-hidden">
        {/* Decorative Circle with Blend */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] border-[40px] md:border-[100px] border-school-accent/5 rounded-full pointer-events-none mix-blend-multiply" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-10 md:mb-20 space-y-4">
            <h2 className="text-5xl md:text-[10rem] font-black text-school-ink tracking-tighter leading-none opacity-5 absolute -top-10 md:-top-20 left-0 text-left">ESTABLISHED.</h2>
            <h2 className="text-4xl md:text-8xl font-black text-school-ink tracking-tighter relative">Hyper-Focused <br /><span className="text-school-accent italic font-serif">Excellence.</span></h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              { title: 'Academic Mastery', subtitle: 'Section 01', icon: <SchoolIcon className="w-8 h-8 md:w-12 md:h-12" /> },
              { title: 'Holistic Legacy', subtitle: 'Section 02', icon: <Trophy className="w-8 h-8 md:w-12 md:h-12" /> },
              { title: 'Global Identity', subtitle: 'Section 03', icon: <Users2 className="w-8 h-8 md:w-12 md:h-12" /> }
            ].map((h, i) => (
              <motion.div 
                key={i}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group bg-school-paper/40 backdrop-blur-3xl p-10 md:p-16 rounded-[40px] md:rounded-[80px] border border-school-ink/10 hover:bg-school-accent hover:text-white transition-all cursor-pointer flex flex-col justify-between min-h-[350px] md:min-h-[500px] shadow-xl shadow-school-accent/5"
              >
                <div className="w-16 h-16 md:w-24 md:h-24 bg-school-accent rounded-[20px] md:rounded-[32px] flex items-center justify-center text-white mb-6 md:init-10 group-hover:bg-white group-hover:text-school-accent group-hover:rotate-12 transition-all shadow-lg shadow-school-accent/20">
                  {h.icon}
                </div>
                <div>
                  <p className="text-[10px] md:text-sm font-black uppercase text-school-accent tracking-widest mb-2 md:mb-4 group-hover:text-white/60">{h.subtitle}</p>
                  <h4 className="text-3xl md:text-5xl font-black text-school-ink leading-tight group-hover:text-white transition-colors">{h.title}</h4>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3D Campus Animation / Virtual Tour */}
      <section className="relative w-full h-screen overflow-hidden">
        <Campus3D />
      </section>

      {/* Visual Narrative Grid - Ultra Rounded Gallery - BG Transparent */}
      <section className="py-12 md:py-24 bg-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-10 md:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-12">
            <h2 className="text-5xl md:text-[12rem] font-black text-school-ink tracking-tighter leading-[0.8]">
              {data.content?.oeuvreTitle1 || 'Campus'} <br />
              <span className="text-school-accent italic">{data.content?.oeuvreTitle2 || 'Oeuvre.'}</span>
            </h2>
            <p className="text-lg md:text-2xl text-school-ink/40 font-medium max-w-sm leading-tight">
              {data.content?.oeuvreDescription || 'A visual collective capturing the vibrant soul of St. Xavier\'s Jaipur.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
             {data.gallery.slice(0, 6).map((img, i) => (
                <motion.div
                  key={img.id}
                  whileHover={{ scale: 0.98 }}
                  className="relative group overflow-hidden rounded-[40px] md:rounded-[80px] aspect-[4/5] bg-school-paper/60 dark:bg-school-paper/20 backdrop-blur-xl shadow-2xl border border-school-ink/10"
                >
                  <img 
                    src={img.url} 
                    className="w-full h-full object-cover grayscale brightness-110 group-hover:grayscale-0 transition-all duration-[1s]" 
                    alt={img.caption}
                  />
                  <div className="absolute inset-x-4 md:inset-x-6 bottom-4 md:bottom-6 bg-school-paper/90 backdrop-blur-md p-6 md:p-8 rounded-[24px] md:rounded-[40px] translate-y-32 group-hover:translate-y-0 transition-transform duration-500 shadow-xl border border-school-ink/5">
                     <p className="text-[10px] md:text-sm font-black text-school-accent uppercase tracking-widest mb-1 md:mb-2">Moments</p>
                     <p className="text-lg md:text-xl font-black text-school-ink">{img.caption}</p>
                  </div>
                </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* Leadership Section - Blended Regency Pills */}
      <section className="py-12 md:py-24 bg-school-paper/30 backdrop-blur-3xl rounded-[40px] md:rounded-[100px] mx-6 lg:mx-12 my-6 md:my-10 overflow-hidden relative shadow-2xl border border-school-ink/10">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 md:mb-20 gap-8 md:gap-10">
             <div className="space-y-3 md:space-y-4">
                <span className="px-5 md:px-6 py-1.5 md:py-2 bg-school-accent text-white rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest">
                  {data.content?.regencyBadge || 'The Guardians'}
                </span>
                <h2 className="text-5xl md:text-[10rem] font-black text-school-ink tracking-tighter leading-[0.8]">
                  {data.content?.regencyTitle1 || 'The'} <br />
                  <span className="text-school-accent italic">{data.content?.regencyTitle2 || 'Regency.'}</span>
                </h2>
             </div>
             <div className="w-full lg:max-w-xl">
                <Link to="/staff" className="group flex items-center justify-center gap-4 md:gap-6 px-10 md:px-16 py-4 md:py-7 bg-school-ink text-white rounded-full text-lg md:text-xl font-black hover:bg-school-accent transition-all shadow-2xl">
                  Staff Archive <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                </Link>
             </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {data.staff.filter(s => s.type === 'Management' || s.type === 'Administration').slice(0, 4).map((s, i) => (
              <motion.div 
                key={s.id}
                whileHover={{ y: -10 }}
                className="group bg-school-paper/50 backdrop-blur-2xl p-6 md:p-8 rounded-[40px] md:rounded-[100px] shadow-2xl transition-all border border-school-ink/10"
              >
                <div className="relative aspect-square rounded-full overflow-hidden mb-6 md:mb-10 border-4 md:border-8 border-school-paper/80 shadow-inner max-w-[200px] mx-auto lg:max-w-none">
                  {s.image ? (
                    <img src={s.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={s.name} />
                  ) : (
                    <div className="w-full h-full bg-school-ink/5 flex items-center justify-center"><Users2 size={48} className="text-school-ink/10" /></div>
                  )}
                </div>
                <div className="text-center px-2 mb-4 md:mb-8 flex flex-col items-center justify-center min-h-[120px]">
                  <h4 className="text-xl md:text-2xl font-black text-school-ink leading-tight break-words max-w-full italic px-2">
                    {s.name}
                  </h4>
                  <p className="text-[9px] md:text-[11px] font-bold uppercase text-school-accent tracking-[0.15em] mt-3 md:mt-4 leading-relaxed max-w-[90%] mx-auto">
                    {s.role}
                  </p>
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
