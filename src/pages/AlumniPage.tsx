import React from 'react';
import { motion } from 'motion/react';
import Layout from '../components/layout/Layout';
import { AppData } from '../types';
import { 
  Users, 
  MapPin, 
  Calendar, 
  Newspaper, 
  ExternalLink,
  MessageSquare,
  Globe,
  PartyPopper
} from 'lucide-react';

const AlumniPage = ({ data }: { data: AppData }) => {
  return (
    <Layout data={data}>
      <div className="pt-32 bg-slate-50 min-h-screen">
        {/* Banner with Background Image */}
        <section className="relative h-[400px] overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0">
            <img 
              src="https://picsum.photos/seed/alumni_gathering/1920/1080?blur=2" 
              alt="Alumni Gathering Background" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-school-navy/60 backdrop-blur-[2px]"></div>
          </div>
          <div className="relative z-10 text-center px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-school-navy p-8 md:p-12 rounded-[32px] border border-white/10 shadow-2xl inline-block"
            >
              <h1 className="text-4xl md:text-6xl font-serif font-black text-white italic tracking-tighter mb-2">Xavier's <br className="md:hidden" /> <span className="text-school-gold not-italic uppercase text-2xl md:text-4xl tracking-[0.3em]">Alumni</span></h1>
              <div className="w-16 h-1 bg-school-gold mx-auto mt-4"></div>
            </motion.div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-24 max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-3 gap-16 items-start">
            
            {/* Left Narrative */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2 space-y-10"
            >
              <div className="space-y-6">
                <h2 className="text-4xl font-serif font-black text-school-navy italic leading-snug">
                  The Apex Body of Global Xaverians
                </h2>
                <div className="w-24 h-1.5 bg-school-gold rounded-full"></div>
                <p className="text-xl text-school-navy/70 font-light leading-relaxed">
                  Xavier’s Alumni is the new name for the <span className="font-bold text-school-navy italic text-lg">Old Boy’s Association (OBA)</span>, the apex body of the alumni of St. Xavier’s School, Jaipur. With a rich and textured history of its own, Xavier’s Alumni (XA) has over <span className="font-bold text-school-navy">4000 members</span> who are spread far and wide to every corner of the earth. 
                </p>
                <div className="p-8 bg-white border-l-4 border-school-gold rounded-r-3xl shadow-lg italic text-lg text-school-navy/80 font-serif">
                   "To foster and to keep alive the bonds of friendship and understanding among the alumni themselves and between the Alumni and the School."
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-school-gold">
                    <Users size={20} />
                    <h3 className="text-lg font-serif font-black uppercase tracking-tight text-school-navy italic">Membership</h3>
                  </div>
                  <p className="text-sm text-school-navy/60 leading-relaxed font-light">
                    Available to students of St. Xavier’s School, Jaipur per the XA constitution. Principal's approval is mandatory for passing out batches. Members gain access to specified privileges detailed in the X.A. directory.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-school-gold">
                    <Calendar size={20} />
                    <h3 className="text-lg font-serif font-black uppercase tracking-tight text-school-navy italic">Event Calendar</h3>
                  </div>
                  <p className="text-sm text-school-navy/60 leading-relaxed font-light">
                    From career counseling for seniors to sporting events, debates, and quiz contests, XA maintains a vibrant annual calendar that serves both the school and the nation.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right Sidebar - Newsletter & Connections */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="glass-surface p-10 rounded-[48px] border border-white shadow-xl space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-school-navy rounded-2xl flex items-center justify-center text-white">
                    <Newspaper size={24} />
                  </div>
                  <h3 className="text-xl font-serif font-black italic text-school-navy">The Newsletter</h3>
                </div>
                <p className="text-sm text-school-navy/60 font-light">
                  Stay updated with our quarterly issue featuring news and views of the Alumni fraternity from across the globe.
                </p>
                <div className="h-px bg-slate-100"></div>
                <div className="flex items-center gap-4">
                   <Globe size={18} className="text-school-gold" />
                   <p className="text-[10px] uppercase font-black tracking-widest text-school-navy/40">Part of North Zone & World Jesuit Alumni Association</p>
                </div>
              </div>

              <div className="bg-school-navy p-10 rounded-[48px] shadow-2xl text-white space-y-6">
                <PartyPopper size={32} className="text-school-gold" />
                <h3 className="text-2xl font-serif font-black italic uppercase text-white">Social Fraternity</h3>
                <ul className="space-y-4">
                  {['The Alumni Picnic', 'Pool-side Party', 'The Xavier’s Ball'].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm font-light text-white/70">
                       <div className="w-1.5 h-1.5 bg-school-gold rounded-full"></div>
                       {item}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-white/40 italic">"Members gather in large numbers with their families to strengthen community bonds."</p>
              </div>

              <a 
                href="#" 
                className="flex items-center justify-center gap-3 w-full py-6 bg-school-gold text-school-navy rounded-[32px] font-black uppercase text-xs tracking-[0.2em] hover:bg-school-navy hover:text-white transition-all shadow-lg group"
              >
                <ExternalLink size={18} />
                Visit Alumni Website
                <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </a>
            </motion.div>

          </div>
        </section>

        {/* Closing Quote */}
        <section className="py-24 bg-white border-y border-slate-50 text-center px-6">
           <motion.div 
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             viewport={{ once: true }}
             className="max-w-2xl mx-auto space-y-6"
           >
             <MessageSquare className="text-school-gold mx-auto" size={32} />
             <p className="text-xl font-serif font-black italic text-school-navy leading-relaxed">
               "Once a Xaverian, Always a Xaverian. Our legacy is built by the footprints of those who walked these halls before us."
             </p>
             <div className="w-16 h-1 bg-school-gold mx-auto"></div>
           </motion.div>
        </section>
      </div>
    </Layout>
  );
};

// Helper Icon integration if missed
const ArrowRight = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
);

export default AlumniPage;
