import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'motion/react';
import { Link } from '../lib/router-compat';
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
import dynamic from 'next/dynamic';

const FocusVisual = dynamic(() => import('../components/ui/FocusVisual').then(m => m.FocusVisual), { ssr: false });
const Campus3D = dynamic(() => import('../components/ui/Campus3D').then(m => m.Campus3D), { ssr: false });
import { AppData } from '../types';

import { Carousel } from '../components/ui/Carousel';
import { HonorsSlider } from '../components/ui/HonorsSlider';
import { AnnouncementModal } from '../components/ui/AnnouncementModal';
import { Marquee } from '../components/ui/Marquee';

import { Helmet } from 'react-helmet-async';

const getSmallImageUrl = (url: string) => {
  if (!url) return 'https://picsum.photos/seed/placeholder/150/150';
  if (url.includes('lh3.googleusercontent.com')) {
    if (url.includes('=')) {
      return url.split('=')[0] + '=w150-h150-c';
    }
    return url + '=w150-h150-c';
  }
  if (url.includes('picsum.photos')) {
    return url.replace(/\/\d+\/\d+$/, '/150/150');
  }
  return url;
};

const HomePage = ({ data }: { data: AppData }) => {
  const carouselImages = (data.carousel && data.carousel.length > 0 
    ? data.carousel.filter(c => c.is_enabled !== false && (c.is_enabled as any) !== 0).map(c => c.url) 
    : []).filter(url => !!url);
  
  const finalCarouselImages = carouselImages.length > 0 ? carouselImages : [
    "https://lh3.googleusercontent.com/d/1C-_jZCL-OpkhhOV_R6oTGRfNxkhBIkHN=w1600",
    "https://lh3.googleusercontent.com/d/1ZfP3k6bFiwdZdEe3CI_U6KhBkAEaybUs=w1600",
    "https://lh3.googleusercontent.com/d/187y5AfGgvXnofNL6h85uU1rpdfaWYDCH=w1600"
  ];

  const activeGallery = data.gallery?.filter(img => img.is_enabled !== false && (img.is_enabled as any) !== 0) || [];
  const activeNotices = data.notices?.filter(n => n.is_enabled !== false && (n.is_enabled as any) !== 0) || [];
  const activeEvents = data.events?.filter(e => e.is_enabled !== false && (e.is_enabled as any) !== 0) || [];
  const activeMarquee = (data.marquee || []).filter(i => i.isActive !== false && (i.isActive as any) !== 0);
  const activeStaff = data.staff?.filter(s => (s.type === 'Management' || s.type === 'Administration') && s.is_enabled !== false && (s.is_enabled as any) !== 0) || [];
  const activeHonors = data.studentHonors?.filter(h => h.is_enabled !== false && (h.is_enabled as any) !== 0) || [];

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
      <Helmet>
        <title>Home | {data.settings?.siteName || "St. Xavier's Sr. Sec. School, Jaipur"}</title>
        <meta name="description" content="Official website of St. Xavier's Senior Secondary School, Jaipur. A legacy of Jesuit excellence, shaping leaders since 1941." />
        <link rel="canonical" href="https://stxaviersjaipur.edu.in/" />
      </Helmet>
      {/* Spacer for fixed navbar on Home page */}
      <div className="h-[64px] md:h-[102px] lg:h-[134px]" />

      {/* Full Width Dynamic Carousel */}
      {!!data.settings?.showCarousel && finalCarouselImages.length > 0 && (
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full h-[calc(100dvh-64px)] md:h-[calc(100dvh-102px)] lg:h-[calc(100dvh-134px)] overflow-hidden relative"
        >
          <Carousel images={finalCarouselImages} />
        </motion.section>
      )}

      {/* Marquee Section */}
      {!!data.settings?.showMarquee && (
        <Marquee items={activeMarquee} />
      )}

      {/* About St. Xavier's School - Introduction Section */}
      {!!data.settings?.showAbout && (
        <section id="about-section" className="py-12 md:py-16 relative overflow-hidden">
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
                  {data.settings?.aboutTitle || (
                    <>
                      {data.content?.aboutTitle1 || 'About'} <br />
                      <span className="text-school-accent">{data.content?.aboutTitle2 || 'St. Xavier’s School.'}</span>
                    </>
                  )}
                </h2>
                <div 
                  className="text-lg text-slate-700 font-medium leading-relaxed whitespace-pre-wrap prose prose-slate max-w-none shadow-none bg-transparent line-clamp-4"
                  dangerouslySetInnerHTML={{ __html: data.settings?.aboutContent || data.content?.aboutDescription || 'Established in 1941, St. Xavier\'s School, Jaipur, is a premier Jesuit institution dedicated to the holistic development of its students.' }}
                />
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
      )}

      {/* Feature Section - Simple Clean */}
      {!!data.settings?.showFeature && (
        <section className="py-16 md:py-20 relative">
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
                   <img src={finalCarouselImages[0]} className="w-full h-full object-cover" alt="Feature" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Vision Section - Minimal Clean */}
      {!!data.settings?.showVision && (
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ amount: 0.1 }}
          transition={{ duration: 1 }}
          className="py-12 md:py-16 border-y border-black/5 dark:border-white/5"
        >
          <div className="max-w-7xl mx-auto px-6 text-center">
              <h4 className="text-2xl md:text-5xl font-bold leading-tight max-w-4xl mx-auto text-school-navy dark:text-white">
                {data.content?.mottoDescription || '"For God and Country" represents our core ethos of service and devotion.'}
              </h4>
          </div>
        </motion.section>
      )}

      {/* Insights Section - Simple Clean */}
      {!!data.settings?.showInsights && (activeNotices.length > 0 || activeEvents.length > 0) && (
        <section className="py-16 md:py-20 overflow-hidden">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.1 }}
            className="max-w-[1440px] mx-auto px-6 text-center mb-16"
          >
            <h3 className="text-4xl md:text-6xl font-bold text-school-navy tracking-tight">Stay Updated.</h3>
          </motion.div>

          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8">
             {activeNotices.length > 0 && (
               <motion.div 
                 initial={{ opacity: 0, x: -30 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ amount: 0.1 }}
                 transition={{ duration: 0.8 }}
                 className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm p-10 rounded-3xl border border-black/5 shadow-sm"
               >
                  <h4 className="text-2xl font-bold mb-8">Notice Board</h4>
                  <div className="space-y-4">
                    {activeNotices.slice(0, 3).map((n) => (
                      <Link key={n.id} to="/notices" className="block p-5 rounded-2xl bg-black/5 dark:bg-white/5 hover:bg-school-accent/5 transition-all border border-black/5">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{n.date}</p>
                        <h5 className="text-lg font-bold text-school-navy dark:text-white leading-tight">{n.title}</h5>
                      </Link>
                    ))}
                  </div>
               </motion.div>
             )}

             {activeEvents.length > 0 && (
               <motion.div 
                 initial={{ opacity: 0, x: 30 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ amount: 0.1 }}
                 transition={{ duration: 0.8 }}
                 className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm p-10 rounded-3xl border border-black/5 shadow-sm"
               >
                  <h4 className="text-2xl font-bold mb-8 text-school-navy dark:text-white">Upcoming Events</h4>
                  <div className="space-y-6">
                    {activeEvents.slice(0, 3).map((e) => {
                      const eventDate = new Date(e.date);
                      const day = isNaN(eventDate.getTime()) ? '??' : eventDate.getDate();
                      const month = isNaN(eventDate.getTime()) ? '???' : eventDate.toLocaleString('default', { month: 'short' });
                      
                      return (
                        <div key={e.id} className="flex gap-6 items-center border-b border-black/5 dark:border-white/5 pb-6 last:border-0">
                          <div className="w-16 h-16 bg-school-navy text-white rounded-2xl flex flex-col items-center justify-center shrink-0">
                            <span className="text-2xl font-bold leading-none">{day}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest mt-1 opacity-60">{month}</span>
                          </div>
                          <div>
                            <h5 className="text-lg font-bold leading-tight text-school-navy dark:text-white">{e.title}</h5>
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">{e.location}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
               </motion.div>
             )}
          </div>
        </section>
      )}

      {/* Principal Message Section - Slick Editorial */}
      {!!data.settings?.showPrincipalMessage && (
        <section className="py-16 md:py-20 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-24 lg:gap-32 items-center">
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
                    src={data.lead_grace?.[0]?.image_url || "https://lh3.googleusercontent.com/d/1Jou0otbLF6w1gb7ESnRALHnDbjCEgmxc"} 
                    className="w-full h-full object-cover" 
                    alt="Lead Grace"
                  />
                </motion.div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ amount: 0.1 }}
                transition={{ duration: 1 }}
                className="space-y-10 lg:pl-12"
              >
                <span className="text-[10px] font-bold uppercase tracking-widest text-school-accent">
                  {data.content?.principalBadge || "Guardian's Vision"}
                </span>
                <h2 className="text-5xl md:text-7xl font-bold text-school-navy leading-tight tracking-tight">
                  {data.lead_grace?.[0]?.heading?.split(' ')[0] || 'Lead'} <br />
                  <span className="text-school-accent italic">{data.lead_grace?.[0]?.heading?.split(' ').slice(1).join(' ') || 'Grace.'}</span>
                </h2>
                <div className="space-y-8 text-slate-800 font-bold text-lg md:text-2xl leading-relaxed italic whitespace-pre-wrap max-w-none shadow-none bg-transparent">
                  <div className="line-clamp-3">
                    "We cultivate individuals of character, resilient in spirit and enlightened in soul. Education is the journey of becoming."
                  </div>
                  <div className="pt-4 not-italic">
                     <Link to="/lead-grace" className="inline-flex items-center gap-3 px-8 py-3 bg-school-navy text-white rounded-full font-bold hover:bg-school-accent transition-all shadow-xl">
                       Read The Full Message <ArrowRight size={18} />
                     </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Visual Narrative Grid - Simple Gallery */}
      {!!data.settings?.showGallery && activeGallery.length > 0 && (
        <section className="py-12 md:py-16">
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
               {activeGallery.slice(0, 6).map((img, i) => (
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
      )}

      {/* Leadership Section - Regency Registry Style */}
      {!!data.settings?.showLeadership && activeStaff.length > 0 && (
        <section className="py-32">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ amount: 0.1 }}
              className="mb-20 border-b border-black/5 dark:border-white/5 pb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
            >
              <div>
                <h2 className="text-3xl md:text-6xl font-bold text-school-navy dark:text-white tracking-tight">
                  {data.content?.regencyTitle || 'The Regency.'}
                </h2>
                <p className="text-slate-400 font-medium mt-4 max-w-xl">
                  {data.content?.regencyDescription || 'The governing body and leadership dedicated to the institutional vision and student excellence.'}
                </p>
              </div>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-12">
              {activeStaff.slice(0, 6).map((s, i) => (
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
                    <h4 className="text-xl md:text-2xl font-bold text-school-navy dark:text-white leading-none group-hover:text-school-accent transition-colors">
                      {s.name}
                    </h4>
                    <p className="text-sm font-black text-school-accent uppercase tracking-[0.2em]">
                      {s.role}
                    </p>
                  </div>
                  {s.bio && (
                    <div 
                      className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-sm prose prose-slate prose-sm max-w-none shadow-none bg-transparent line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: s.bio }}
                    />
                  )}
                  <div className="pt-2">
                    <span className="text-[10px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest">Leadership Registry • SXS Jaipur</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Student Honors / Congratulations Slider */}
      {!!data.settings?.showHonors && activeHonors.length > 0 && (
        <div className="bg-transparent pb-32">
          <HonorsSlider honors={activeHonors} hideAttachedImages={!!data.settings?.hideAttachedImages} />
        </div>
      )}

      {/* {data.settings?.popupEnabled && data.settings?.popupEnabled !== 0 && <AnnouncementModal popups={data.popups || []} settings={data.settings} />} */}
    </Layout>
  );
};

export default HomePage;
