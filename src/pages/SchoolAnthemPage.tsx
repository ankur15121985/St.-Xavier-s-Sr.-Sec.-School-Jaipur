import React from 'react';
import { motion } from 'motion/react';
import Layout from '../components/layout/Layout';
import { AppData } from '../types';
import { Music } from 'lucide-react';

const SchoolAnthemPage = ({ data }: { data: AppData }) => {
  return (
    <Layout data={data}>
      <div className="pt-32 bg-slate-50 min-h-screen">
        {/* Hero Section */}
        <section className="relative h-[40vh] bg-school-navy flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center relative z-10 px-6"
          >
            <div className="w-16 h-16 bg-school-gold rounded-full flex items-center justify-center text-school-navy mx-auto mb-6 shadow-xl">
              <Music size={32} />
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-black text-white tracking-tighter italic">School <span className="text-school-gold not-italic uppercase text-3xl md:text-4xl tracking-[0.3em] block mt-2">Anthem</span></h1>
          </motion.div>
        </section>

        {/* Anthem Body */}
        <section className="py-24 max-w-4xl mx-auto px-6 lg:px-12 relative z-10 -mt-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-surface bg-white p-12 md:p-20 rounded-[64px] border border-white shadow-2xl relative overflow-hidden"
          >
            {/* Decorative Element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-school-gold/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            
            <div className="space-y-16 text-center">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-6xl font-serif font-black text-school-navy italic tracking-tight">Xavier's School Song</h2>
                <div className="w-24 h-1 bg-school-gold mx-auto rounded-full"></div>
              </div>

              <div className="space-y-12">
                {/* Intro Stanza */}
                <div className="space-y-2 text-xl md:text-2xl text-school-navy/80 font-light italic leading-relaxed">
                  <p>In this School, we're brothers and sisters</p>
                  <p>In this School, we learn to pray,</p>
                  <p>For God is our true Father</p>
                  <p>And Guides us on our way</p>
                </div>

                {/* Chorus */}
                <div className="bg-school-navy/5 p-10 rounded-[40px] border border-school-navy/5 space-y-6">
                  <p className="text-xs font-black uppercase tracking-[0.4em] text-school-gold">Chorus</p>
                  <p className="text-2xl md:text-3xl font-serif font-black text-school-navy leading-tight max-w-2xl mx-auto">
                    "Oh, it's fine, it's grand, it's marvelous <br /> St. Xavier's Gold and Blue! <br /> 
                    <span className="text-lg md:text-xl font-light not-italic text-school-navy/60 block mt-4 uppercase tracking-widest">
                      We learn to serve our fellow-men <br /> For God and country too.
                    </span>
                  </p>
                </div>

                {/* Numbered Stanzas */}
                <div className="grid gap-12 text-left max-w-2xl mx-auto">
                  <div className="flex gap-6 items-start">
                    <span className="shrink-0 w-10 h-10 rounded-xl bg-school-gold/20 flex items-center justify-center font-serif font-black text-school-gold italic">1.</span>
                    <p className="text-lg md:text-xl text-school-navy/70 leading-relaxed font-light">
                      Rich and Poor, we come together Lending all a helping hand, <br /> 
                      <span className="font-medium text-school-navy">People of all religions As one family we stand.</span>
                    </p>
                  </div>

                  <div className="flex gap-6 items-start">
                    <span className="shrink-0 w-10 h-10 rounded-xl bg-school-gold/20 flex items-center justify-center font-serif font-black text-school-gold italic">2.</span>
                    <p className="text-lg md:text-xl text-school-navy/70 leading-relaxed font-light">
                      Our School is a place of learning But it gives us as we put in, <br />
                      <span className="font-medium text-school-navy">It molds and builds our character To face the world and win.</span>
                    </p>
                  </div>
                </div>

                {/* Attribution */}
                <div className="pt-12 border-t border-slate-100 mt-16">
                  <p className="text-xl font-serif font-black italic text-school-navy tracking-tight">~Fr. G.A. Drinane, S.J.</p>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-school-navy/30 mt-2">Institutional Lyricist</p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </Layout>
  );
};

export default SchoolAnthemPage;
