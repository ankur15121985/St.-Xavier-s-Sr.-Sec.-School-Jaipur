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
    <Layout links={data.links}>
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
            <div className="inline-block px-8 py-2.5 glass-surface rounded-full text-[11px] font-black uppercase tracking-[0.5em] text-school-navy mb-12 floating shadow-sm font-black">ESTABLISHED 1941 • JESUIT TRADITION</div>
            <h2 className="text-8xl md:text-[11rem] font-serif font-black text-school-navy leading-[0.8] mb-12 tracking-tighter glow-text pointer-events-auto">Transforming <br /> <span className="text-school-gold italic">Vision.</span></h2>
            <p className="text-2xl md:text-3xl text-school-navy/50 font-light mb-16 max-w-3xl mx-auto leading-relaxed pointer-events-auto">Empowering men and women for others with a commitment to academic excellence and moral fortitude in Jaipur.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-10 pointer-events-auto">
              <button className="px-16 py-6 glass-dark text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all">Digital Registration</button>
              <button className="px-16 py-6 glass-surface text-school-navy rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl">Virtual Tour</button>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* About Section - Inserted just after "carousel" (Hero) */}
      <section className="py-24 bg-white px-6 lg:px-12">
        <div className="max-w-7xl mx-auto rounded-[64px] border-2 border-school-navy/10 p-12 md:p-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-school-navy/5 rounded-full blur-[100px] -mr-48 -mt-48 transition-all group-hover:scale-110"></div>
          
          <div className="grid lg:grid-cols-2 gap-20 relative z-10">
            {/* Left Content Column */}
            <div className="space-y-10">
              <p className="text-xl md:text-2xl text-school-navy leading-relaxed font-light">
                <span className="font-serif font-black text-school-gold italic">St. Xavier’s Senior Secondary School, Jaipur</span> is a Christian minority school under the management of the Jesuits, an international Christian Religious Order, known as the Society of Jesus.
              </p>
              <p className="text-lg text-school-navy/60 leading-relaxed font-light">
                St. Xavier’s School for boys was founded in July, 1941 under the name of St. Mary’s Boy’s School in the Roman Catholic Church Compound at Ghat Gate, Jaipur by Rev. Fr. Ignatius, O.F.M. Cap. In July 1943 its management was entrusted to the Jesuit Fathers, renowned for their educational work. The school was transferred to the present site and renamed St. Xavier’s School in January, 1945, and still later as St. Xavier’s Sr. Sec. School.
              </p>
            </div>

            {/* Right Header Column */}
            <div className="flex flex-col justify-center">
              <div className="space-y-4">
                <h3 className="text-5xl font-serif font-black text-school-navy tracking-tight italic">About</h3>
                <h2 className="text-8xl md:text-9xl font-serif font-black text-school-navy leading-[0.85] tracking-tighter">
                  St. Xavier's <br />
                  <span className="text-school-gold">School</span>
                </h2>
              </div>
            </div>
          </div>

          {/* Bottom Full-Width Content */}
          <div className="mt-20 pt-20 border-t border-slate-100 relative z-10">
            <p className="text-lg text-school-navy/70 leading-relaxed font-light max-w-5xl">
              The Society of Jesus, founded by St. Ignatius of Loyola in 1540, has, since its origin, been active in the field of education throughout the world. In India, the Society of Jesus is at present responsible for more than one hundred high schools and 25 colleges in which over a lakh and a half, young people belonging to every creed, social class, community and linguistic group are educated through the medium of English and regional languages. These institutions are part of the Catholic Church’s effort to share in the country’s educational undertaking. This effort, while particularly responsible to the Christian community, has always been at the service of the whole nation. Thus in these institutions, recognised as Christian Minority Institutions, the religious beliefs of all students are treated with respect.
            </p>
          </div>
        </div>
      </section>

      {/* Message from the Principal Section */}
      <section className="py-24 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            {/* Principal Portrait */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-5"
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-school-gold/20 rounded-[48px] rotate-3 scale-105 group-hover:rotate-6 transition-transform duration-500"></div>
                <div className="relative aspect-[3/4] rounded-[48px] overflow-hidden shadow-2xl border-8 border-white">
                  <img 
                    src="https://picsum.photos/seed/arockiam_principal/800/1067" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    alt="Fr. M. Arockiam, SJ"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-school-navy/60 to-transparent"></div>
                  <div className="absolute bottom-10 left-10 text-white">
                    <p className="text-sm font-black uppercase tracking-[0.3em] mb-2 text-school-gold">Principal</p>
                    <h4 className="text-3xl font-serif font-black">Fr. M. Arockiam, SJ</h4>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Message Content */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-7 space-y-10"
            >
              <div>
                <h2 className="text-5xl md:text-6xl font-serif font-black text-school-navy mb-4 tracking-tight leading-tight">
                  Message from <br />
                  <span className="text-school-gold italic">the Principal.</span>
                </h2>
                <div className="w-20 h-1.5 bg-school-gold rounded-full"></div>
              </div>

              <div className="space-y-8 text-school-navy/80 leading-relaxed font-light text-lg">
                <p className="font-medium text-school-navy italic text-xl">"Dear Parents, Students and well wishers..."</p>
                <p>
                  With the advent of National Education Policy (NEP 2020) many innovative ideas are presented to us by the government in the school and college education. The structure of school education has been remodelled from 10+2 system to 5+3+3+4 system, i.e., Foundational (5 years = pre-school to grade 2), Preparatory (3years = grades 3-5), Middle (3 years = grades 6-8) and Secondary (4years = grades 9-12). The new system lays greater emphasis on experiential learning based on learning outcomes than mere rote learning of facts.
                </p>
                <p>
                  What is envisaged through this attempt is to develop good human beings capable of rational thought and action, possessing compassion and empathy, courage and resilience, scientific temper and creative imagination, with sound ethical moorings and values. It aims at building an equitable, inclusive, and plural society.
                </p>
                <p>
                  We at Xavier’s have been continuing the mission of shaping young minds since 1941. The changing educational scenario in the post Covid-19 era and the implementation of NEP-2020 guidelines calls for constant updating and reinventing ourselves to be relevant in the present context. At the same time, we cannot compromise on the values and pillars of Jesuit Educational pedagogy and practice i.e., Competence, Conscience, Compassion and Commitment. 
                </p>
                <p className="font-semibold text-school-navy">
                  Duties precede rights. I invite all the stakeholders to be partners in the mission of education and to work towards shaping a better India with the values enshrined in our Constitution.
                </p>
              </div>

              <div className="pt-10 border-t border-slate-200">
                <p className="text-school-navy/40 uppercase font-black tracking-widest text-xs mb-1">Sincerely,</p>
                <p className="text-xl font-serif font-black text-school-navy">Fr. M. Arockiam, SJ</p>
                <p className="text-sm text-school-gold font-bold">Principal</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Campus Updates Section (Notice Board & Events) */}
      <section className="py-32 relative overflow-hidden group">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/xavier_campus/1920/1080?blur=10" 
            className="w-full h-full object-cover opacity-10"
            alt="Campus Background"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16">
            
            {/* Redesigned Notice Board */}
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-10 pb-6 border-b border-school-navy/10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-school-navy rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <Bell size={24} />
                  </div>
                  <h3 className="text-3xl font-serif font-black text-school-navy tracking-tight">Notice Board</h3>
                </div>
                <Link to="/notices" className="text-[10px] font-black uppercase tracking-[0.2em] text-school-gold hover:text-school-navy transition-colors border-b-2 border-school-gold/30 hover:border-school-navy">View All Notices</Link>
              </div>

              <div className="flex-1 space-y-6">
                {data.notices.slice(0, 3).map((notice, idx) => (
                  <motion.div 
                    key={notice.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="glass-surface p-8 rounded-[32px] border border-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group/card"
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest text-school-navy/30 mb-3 block">{notice.date}</span>
                    <h4 className="text-lg font-serif font-bold text-school-navy mb-4 group-hover/card:text-school-gold transition-colors">{notice.title}</h4>
                    {notice.content && (
                      <p className="text-sm text-school-navy/60 leading-relaxed font-light line-clamp-3 italic">
                        {notice.content}
                      </p>
                    )}
                  </motion.div>
                ))}
                {data.notices.length === 0 && (
                  <div className="h-full flex items-center justify-center text-school-navy/20 font-serif italic py-20 bg-slate-50/50 rounded-[32px] border-2 border-dashed border-slate-100">
                    No active notices at this time.
                  </div>
                )}
              </div>
            </div>

            {/* Upcoming Events Portal */}
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-10 pb-6 border-b border-school-navy/10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-school-gold rounded-2xl flex items-center justify-center text-school-navy shadow-lg">
                    <Calendar size={24} />
                  </div>
                  <h3 className="text-3xl font-serif font-black text-school-navy tracking-tight">Upcoming Events</h3>
                </div>
                <Link to="/events" className="text-[10px] font-black uppercase tracking-[0.2em] text-school-gold hover:text-school-navy transition-colors border-b-2 border-school-gold/30 hover:border-school-navy">View All Events</Link>
              </div>

              <div className="flex-1 space-y-6">
                {data.events.slice(0, 3).map((event, idx) => (
                  <motion.div 
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (idx + 3) * 0.1 }}
                    className="flex gap-6 items-start glass-surface p-8 rounded-[32px] border border-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group/card"
                  >
                    <div className="shrink-0 w-20 h-20 bg-school-navy rounded-3xl flex flex-col items-center justify-center text-white shadow-xl">
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-60">May</span>
                      <span className="text-3xl font-serif font-black">{event.date.split(' ')[1].replace(',', '')}</span>
                    </div>
                    <div className="flex-1 pt-1">
                      <h4 className="text-xl font-serif font-bold text-school-navy mb-3 group-hover/card:text-school-gold transition-colors">{event.title}</h4>
                      <div className="flex flex-wrap gap-4 text-[10px] font-black uppercase tracking-widest text-school-navy/40">
                         <span className="flex items-center gap-1.5"><Bell size={10} className="text-school-gold" /> {event.time}</span>
                         <span className="flex items-center gap-1.5"><MapIcon size={10} className="text-school-gold" /> {event.location}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {data.events.length === 0 && (
                  <div className="h-full flex items-center justify-center text-school-navy/20 font-serif italic py-20 bg-slate-50/50 rounded-[32px] border-2 border-dashed border-slate-100">
                    Check back soon for upcoming events.
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
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

      {/* Life @ Xavier's Gallery Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-24">
            <h2 className="text-6xl font-serif font-black text-school-navy mb-4">Life @ <span className="text-school-gold italic">Xavier's.</span></h2>
            <p className="text-xl text-school-navy/40 font-light">A visual journal of our vibrant campus culture, traditions, and collective spirit.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[250px]">
             {data.gallery.slice(0, 8).map((img, i) => {
                const spanOptions = [
                  "md:col-span-8 md:row-span-2", 
                  "md:col-span-4 md:row-span-1", 
                  "md:col-span-4 md:row-span-1", 
                  "md:col-span-3 md:row-span-1", 
                  "md:col-span-5 md:row-span-2", 
                  "md:col-span-4 md:row-span-2", 
                  "md:col-span-4 md:row-span-1", 
                  "md:col-span-8 md:row-span-1"
                ];
                return (
                  <motion.div
                    key={img.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.6 }}
                    className={`relative group overflow-hidden rounded-[40px] shadow-sm hover:shadow-2xl transition-all duration-500 ${spanOptions[i % spanOptions.length]}`}
                  >
                    <img 
                      src={img.url} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                      alt={img.caption}
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-school-navy/90 via-school-navy/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-10">
                       <motion.div 
                         initial={{ y: 20, opacity: 0 }}
                         whileHover={{ y: 0, opacity: 1 }}
                         className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500"
                       >
                         <p className="text-white text-xl font-serif italic mb-3">{img.caption}</p>
                         <div className="w-12 h-1.5 bg-school-gold rounded-full"></div>
                       </motion.div>
                    </div>
                  </motion.div>
                );
             })}
          </div>

          <div className="mt-20 text-center">
            <Link to="/gallery" className="inline-flex items-center gap-4 px-12 py-5 glass-dark text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-all">
              Explore Full Archive <ArrowRight size={16} />
            </Link>
          </div>
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
              <div className="glass-card p-8 rounded-[32px] flex flex-col items-center text-center h-full">
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
