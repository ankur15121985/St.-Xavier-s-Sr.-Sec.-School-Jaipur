import React from 'react';
import { motion } from 'motion/react';
import Layout from '../components/layout/Layout';
import { AppData, XavieriteOfYear } from '../types';
import { Award, Star, Quote } from 'lucide-react';

const XavieriteOfTheYearPage = ({ data }: { data: AppData }) => {
  const years = [...(data.xavierite_of_the_year || [])].sort((a, b) => b.academic_year.localeCompare(a.academic_year));

  return (
    <Layout data={data}>
      <div className="bg-school-paper min-h-screen pt-48 pb-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center mb-32">
           <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             className="inline-block py-2 px-6 bg-school-gold/10 rounded-full mb-8"
           >
             <span className="text-school-gold font-black uppercase tracking-[0.4em] text-[10px]">St. Xavier's Supreme Honor</span>
           </motion.div>
           <h1 className="text-6xl md:text-9xl font-serif font-black text-school-navy tracking-tighter leading-none mb-12">
             Xavierite of <span className="text-school-gold italic">the Year.</span>
           </h1>
           <p className="text-2xl text-school-ink/40 font-light max-w-3xl mx-auto italic">
             Recognizing individuals who embody the spirit of "Magis" and demonstrate holistic excellence in every facet of life.
           </p>
        </div>

        <div className="max-w-5xl mx-auto px-6">
          {years.length > 0 ? (
            <div className="space-y-16">
              {years.map((winner, i) => (
                <motion.div
                  key={winner.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-school-gold/5 rounded-[64px] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative bg-white p-12 md:p-20 rounded-[64px] border border-school-ink/5 shadow-xl hover:shadow-2xl transition-all flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1 text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
                        <span className="text-5xl font-black text-school-gold tracking-tighter">{winner.academic_year}</span>
                        <div className="w-12 h-px bg-school-ink/10"></div>
                        <Award size={24} className="text-school-gold" />
                      </div>
                      <h3 className="text-4xl md:text-6xl font-serif font-black text-school-navy mb-6">
                        {winner.name}
                      </h3>
                      {winner.citation && (
                        <div className="relative">
                          <Quote className="absolute -top-4 -left-4 text-school-gold/20 w-12 h-12" />
                          <p className="text-xl text-school-ink/60 font-medium italic leading-relaxed pl-6">
                            {winner.citation}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="w-full md:w-px h-px md:h-40 bg-school-ink/5"></div>
                    
                    <div className="flex-none text-center">
                       <span className="text-[10px] font-black uppercase tracking-[0.3em] text-school-gold block mb-2">Institutional Badge</span>
                       <div className="w-24 h-24 rounded-full bg-school-gold/10 flex items-center justify-center text-school-gold mx-auto">
                          <Star size={40} className="fill-current" />
                       </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-32 bg-school-paper border-2 border-dashed border-school-ink/10 rounded-[64px] text-center">
               <Award size={64} className="mx-auto text-school-ink/10 mb-8" />
               <h4 className="text-2xl font-serif font-black text-school-ink/30 italic">The roll of honor is currently being updated for this academic cycle.</h4>
            </div>
          )}
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-40">
           <div className="bg-school-navy rounded-[80px] p-20 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-white/[0.02] mix-blend-overlay"></div>
              <div className="relative z-10">
                <h3 className="text-4xl md:text-6xl font-serif font-black text-white italic mb-8">Character is Excellence.</h3>
                <p className="text-xl text-white/40 font-light max-w-2xl mx-auto">This award is the highest recognition of a student's commitment to the Jesuit values of service, leadership, and academic rigor.</p>
              </div>
           </div>
        </div>
      </div>
    </Layout>
  );
};

export default XavieriteOfTheYearPage;
