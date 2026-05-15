import React from 'react';
import { motion } from 'motion/react';
import Layout from '../components/layout/Layout';
import { AppData, XavieriteOfYear } from '../types';
import { Award } from 'lucide-react';

const XavieriteOfTheYearPage = ({ data }: { data: AppData }) => {
  const enabledWinners = (data.xavierite_of_the_year || []).filter(x => x.is_enabled !== false);
  const winners = [...enabledWinners].sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));

  const rows: XavieriteOfYear[][] = [];
  for (let i = 0; i < winners.length; i += 2) {
    rows.push(winners.slice(i, i + 2));
  }

  return (
    <Layout data={data}>
      <div className="bg-school-paper min-h-screen selection:bg-school-gold/30">
        {/* Banner Section - Editorial Style */}
        <section className="pt-24 pb-12 px-6 overflow-hidden relative">
          <div className="absolute top-10 left-10 text-[12vw] font-black text-school-ink/[0.03] select-none pointer-events-none uppercase">
            Excellence
          </div>
          
          <div className="max-w-7xl mx-auto flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center relative"
            >
              <div className="inline-block px-4 py-1.5 bg-school-gold/10 text-school-gold text-[10px] font-black uppercase tracking-[0.4em] mb-6 rounded-full border border-school-gold/20">
                Institutional Honor
              </div>
              <h1 className="text-6xl md:text-8xl font-serif text-school-ink tracking-tight mb-8">
                Xavierite of <span className="italic text-school-gold">the Year.</span>
              </h1>
              <div className="w-24 h-px bg-school-ink/20 mx-auto mb-8"></div>
              <p className="max-w-2xl mx-auto text-school-ink/60 text-lg font-medium leading-relaxed italic">
                Recognizing individuals who embody the spirit of "Magis" and demonstrate holistic excellence in every facet of life.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Grid/Snake Section */}
        <section className="pb-32 px-6">
          <div className="max-w-6xl mx-auto space-y-12">
            {rows.length > 0 ? (
              rows.map((row, rowIndex) => (
                <div key={rowIndex} className="relative">
                  {/* Connection Line to next row */}
                  {rowIndex < rows.length - 1 && (
                    <motion.div 
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className={`absolute -bottom-12 ${rowIndex % 2 === 0 ? 'right-20' : 'left-20'} w-2 md:w-3 h-12 bg-linear-to-b from-school-gold via-school-gold/50 to-school-gold/20 origin-top hidden md:block shadow-[0_0_15px_rgba(226,180,80,0.3)]`}
                    >
                      <motion.div 
                        animate={{ y: [-48, 48] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="w-full h-8 bg-white/60 blur-[2px]"
                      />
                    </motion.div>
                  )}

                  <div className={`flex flex-col md:flex-row gap-8 ${rowIndex % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                    {row.map((winner, itemIndex) => {
                      const globalIndex = rowIndex * 2 + itemIndex;
                      return (
                        <motion.div
                          key={winner.id}
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: itemIndex * 0.1 }}
                          className="flex-1"
                        >
                          <div className="bg-white/80 backdrop-blur-xl rounded-[40px] p-10 shadow-xl border border-white/40 h-full group hover:shadow-2xl transition-all duration-500 relative ring-1 ring-black/5 hover:ring-school-gold/30">
                             {/* Flow indicator */}
                              {itemIndex === 0 && row.length > 1 && (
                               <div className={`hidden md:block absolute top-1/2 -translate-y-1/2 ${rowIndex % 2 === 0 ? '-right-6' : '-left-6'} z-20`}>
                                 <motion.div 
                                    initial={{ scaleX: 0 }}
                                    whileInView={{ scaleX: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: 0.3 }}
                                    className="w-12 h-2 md:h-3 bg-school-gold/40 origin-center overflow-hidden shadow-[0_0_10px_rgba(226,180,80,0.2)]"
                                 >
                                   <motion.div 
                                     animate={{ x: rowIndex % 2 === 0 ? [-60, 60] : [60, -60] }}
                                     transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                                     className="w-8 h-full bg-white/80 blur-[2px]"
                                   />
                                 </motion.div>
                               </div>
                             )}

                             <div className="flex items-center justify-between mb-8">
                                <div className="w-14 h-14 rounded-2xl bg-school-navy/5 flex items-center justify-center text-school-gold group-hover:bg-school-gold group-hover:text-white transition-all">
                                  <Award size={24} />
                                </div>
                                <span className="text-school-ink/10 font-serif italic text-4xl">#{String(globalIndex + 1).padStart(2, '0')}</span>
                             </div>

                             <div className="space-y-4">
                               <div className="flex items-center gap-4">
                                 <span className="text-2xl font-black text-school-gold tracking-tight">{winner.academic_year}</span>
                                 <div className="flex-1 h-px bg-school-ink/5"></div>
                               </div>
                               
                               <h3 className="text-3xl font-serif text-school-ink leading-tight group-hover:text-school-gold transition-colors">
                                 {winner.name}
                               </h3>

                               {winner.citation && (
                                 <div className="relative pl-6 border-l border-school-gold/20 py-1">
                                   <p className="text-sm text-school-ink/60 font-medium italic leading-relaxed">
                                     "{winner.citation}"
                                   </p>
                                 </div>
                               )}
                             </div>

                             <div className="mt-8 flex gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-school-gold/20" />
                                <div className="h-1.5 w-1.5 rounded-full bg-school-gold/20" />
                                <div className="h-1.5 w-1.5 rounded-full bg-school-gold/30" />
                             </div>

                             {winner.image && (
                               <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <img src={winner.image} alt={winner.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-lg" />
                               </div>
                             )}
                          </div>
                        </motion.div>
                      );
                    })}
                    {/* Placeholder for alignment */}
                    {row.length < 2 && <div className="flex-1 hidden md:block" />}
                  </div>
                </div>
              ))
            ) : (
              <div className="max-w-xl mx-auto bg-white/50 backdrop-blur-sm p-16 rounded-[48px] border border-school-ink/5 text-center shadow-xl">
                 <Award size={40} className="mx-auto text-school-gold/30 mb-6" />
                 <h2 className="text-2xl font-serif text-school-ink italic">The Roll of Honor</h2>
                 <p className="text-school-ink/40 mt-4 font-medium leading-relaxed">The records for this academic cycle are currently being updated. Please return to view the full roster of excellence.</p>
              </div>
            )}
          </div>
        </section>

        {/* Footer Accent */}
        <section className="px-6 pb-20">
          <div className="max-w-7xl mx-auto">
             <div className="bg-school-navy rounded-[60px] p-16 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-white/[0.02] mix-blend-overlay"></div>
                <div className="relative z-10">
                  <h3 className="text-3xl md:text-5xl font-serif font-black text-white italic mb-6 tracking-tight">Character is Excellence.</h3>
                  <p className="text-lg text-white/40 font-light max-w-2xl mx-auto leading-relaxed">
                    This award is the highest recognition of a student's commitment to the Jesuit values of service, leadership, and academic rigor.
                  </p>
                </div>
             </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default XavieriteOfTheYearPage;
