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

      {/* Important Links Section - Clean Bento Aesthetic */}
      <section id="important-links" className="py-32 selection:bg-school-accent selection:text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-12 gap-16 md:gap-24 items-start">
            <div className="lg:col-span-5 space-y-10">
               <motion.div
                 initial={{ opacity: 0, x: -20 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ amount: 0.1 }}
                 className="flex items-center gap-4"
               >
                 <div className="w-8 h-[2px] bg-school-accent" />
                 <span className="text-school-accent font-bold uppercase tracking-widest text-[10px]">Resources</span>
               </motion.div>
               <motion.h2 
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ amount: 0.1 }}
                 transition={{ duration: 0.8 }}
                 className="text-5xl md:text-7xl font-bold text-school-navy dark:text-white leading-[1.1] tracking-tight"
               >
                 {data.content?.nodesTitle1 || 'Vital'} <br />
                 <span className="text-school-accent">{data.content?.nodesTitle2 || 'Nodes.'}</span>
               </motion.h2>

               <motion.p
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ amount: 0.1 }}
                 transition={{ delay: 0.3, duration: 0.8 }}
                 className="text-lg text-slate-700 font-medium leading-normal max-w-sm"
               >
                 {data.content?.nodesDescription || 'Institutional highlights condensed for your convenience.'}
               </motion.p>
            </div>

            <motion.div 
               variants={staggerContainer}
               initial="initial"
               whileInView="whileInView"
               viewport={{ amount: 0.1 }}
               className="lg:col-span-7 grid grid-cols-2 md:grid-cols-6 gap-4"
            >
               {((data.links && data.links.length > 0) ? data.links.slice(0, 5) : [
                 { id: '1', title: 'School Fees', icon: 'Calendar', url: '/fees' },
                 { id: '2', title: 'Exams', icon: 'Trophy', url: '/notices' },
                 { id: '3', title: 'Gallery', icon: 'ImageIcon', url: '/gallery' },
                 { id: '4', title: 'Notices', icon: 'Bell', url: '/notice-board' },
                 { id: '5', title: 'Academics', icon: 'SchoolIcon', url: '/jesuit-education-objectives' },
               ]).map((item: any, idx) => {
                 const colSpan = idx === 0 || idx === 1 ? 'md:col-span-3' : idx === 2 ? 'md:col-span-2' : idx === 3 ? 'md:col-span-4' : 'md:col-span-6';
                 const color = 'bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm';
                 const textColor = 'text-school-navy dark:text-white';
                 const targetUrl = item.url || item.href;
                 
                 return (
                   <motion.div key={item.id || idx} variants={fadeInUp} className={colSpan}>
                     <Link
                       to={targetUrl}
                       className={`w-full h-full ${color} p-8 rounded-3xl flex flex-col justify-between border border-black/5 dark:border-white/5 hover:border-school-accent/30 transition-all duration-500 group relative overflow-hidden shadow-sm`}
                     >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-black/5 dark:bg-white/5 ${textColor}`}>
                          {getIcon(item.icon)}
                        </div>
   
                        <div className="mt-8 space-y-1 relative z-10">
                          <h4 className={`text-xl font-bold ${textColor} leading-tight`}>
                            {item.title}
                          </h4>
                        </div>
                     </Link>
                   </motion.div>
                 );
               })}
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

      {/* Distinction Section - Transparent with Glass Elements */}
      <section className="py-12 md:py-24 bg-transparent relative overflow-hidden">
        {/* Decorative Circle with Blend */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] border-[40px] md:border-[100px] border-school-accent/5 rounded-full pointer-events-none mix-blend-multiply" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.1 }}
            className="text-center mb-10 md:mb-20 space-y-4"
          >
            <h2 className="text-5xl md:text-[10rem] font-black text-school-ink tracking-tighter leading-none opacity-5 absolute -top-10 md:-top-20 left-0 text-left">ESTABLISHED.</h2>
            <h2 className="text-4xl md:text-8xl font-black text-school-ink tracking-tighter relative">Hyper-Focused <br /><span className="text-school-accent italic font-serif">Excellence.</span></h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              { title: 'Academic Mastery', subtitle: 'Section 01', icon: <SchoolIcon className="w-8 h-8 md:w-12 md:h-12" /> },
              { title: 'Holistic Legacy', subtitle: 'Section 02', icon: <Trophy className="w-8 h-8 md:w-12 md:h-12" /> },
              { title: 'Global Identity', subtitle: 'Section 03', icon: <Users2 className="w-8 h-8 md:w-12 md:h-12" /> }
            ].map((h, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ amount: 0.1 }}
                transition={{ delay: i * 0.1 }}
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
