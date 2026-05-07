import React from 'react';
import { motion } from 'motion/react';
import Layout from '../components/layout/Layout';
import { AppData, FormerLeader } from '../types';
import { Users2, History, Award } from 'lucide-react';

interface Props {
  data: AppData;
  type: 'Rector' | 'Manager' | 'Principal';
  title: string;
  description: string;
}

const FormerLeadersPage = ({ data, type, title, description }: Props) => {
  const getLeaders = () => {
    switch (type) {
      case 'Principal': return data.former_principals || [];
      case 'Rector': return data.former_rectors || [];
      case 'Manager': return data.former_managers || [];
      default: return [];
    }
  };

  const leaders = [...getLeaders()].filter(l => l.is_enabled !== false).sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));

  const rows: FormerLeader[][] = [];
  for (let i = 0; i < leaders.length; i += 2) {
    rows.push(leaders.slice(i, i + 2));
  }

  return (
    <Layout data={data}>
      <div className="bg-school-paper min-h-screen selection:bg-school-gold/30">
        {/* Banner Section - Editorial Style */}
        <section className="pt-24 pb-12 px-6 overflow-hidden relative">
          <div className="absolute top-10 left-10 text-[12vw] font-black text-school-ink/[0.03] select-none pointer-events-none uppercase">
            Legacy
          </div>
          
          <div className="max-w-7xl mx-auto flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center relative"
            >
              <div className="inline-block px-4 py-1.5 bg-school-gold/10 text-school-gold text-[10px] font-black uppercase tracking-[0.4em] mb-6 rounded-full border border-school-gold/20">
                Institutional History
              </div>
              <h1 className="text-6xl md:text-8xl font-serif text-school-ink tracking-tight mb-8">
                Former <span className="italic text-school-gold">{title}</span>
              </h1>
              <div className="w-24 h-px bg-school-ink/20 mx-auto mb-8"></div>
              <p className="max-w-2xl mx-auto text-school-ink/60 text-lg font-medium leading-relaxed italic">
                {description}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Snake Timeline Section */}
        <section className="pb-32 px-6">
          <div className="max-w-6xl mx-auto space-y-12">
            {rows.length > 0 ? (
              rows.map((row, rowIndex) => (
                <div key={rowIndex} className="relative">
                  {/* Connection Line to next row */}
                  {rowIndex < rows.length - 1 && (
                    <div className={`absolute -bottom-12 ${rowIndex % 2 === 0 ? 'right-20' : 'left-20'} w-px h-12 bg-school-gold/20 hidden md:block`} />
                  )}

                  <div className={`flex flex-col md:flex-row gap-8 ${rowIndex % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                    {row.map((leader, itemIndex) => {
                      const globalIndex = rowIndex * 2 + itemIndex;
                      return (
                        <motion.div
                          key={leader.id}
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: itemIndex * 0.1 }}
                          className="flex-1"
                        >
                          <div className="bg-white/80 backdrop-blur-xl rounded-[40px] p-10 shadow-xl border border-white/40 h-full group hover:shadow-2xl transition-all duration-500 relative">
                             {/* Flow indicator */}
                             {itemIndex === 0 && row.length > 1 && (
                               <div className={`hidden md:block absolute top-1/2 -translate-y-1/2 ${rowIndex % 2 === 0 ? '-right-6' : '-left-6'} z-20`}>
                                 <div className="w-12 h-px bg-school-gold/30" />
                               </div>
                             )}

                             <div className="flex items-center justify-between mb-8">
                                <div className="w-14 h-14 rounded-2xl bg-school-navy/5 flex items-center justify-center text-school-gold group-hover:bg-school-gold group-hover:text-white transition-all">
                                  <History size={24} />
                                </div>
                                <span className="text-school-ink/10 font-serif italic text-4xl">#{String(globalIndex + 1).padStart(2, '0')}</span>
                             </div>

                             <h3 className="text-3xl md:text-4xl font-serif text-school-ink leading-tight mb-6 group-hover:text-school-gold transition-colors">
                               {leader.name}
                             </h3>

                             <div className="inline-flex items-center gap-3 bg-school-gold/5 px-5 py-2.5 rounded-full border border-school-gold/10">
                               <span className="text-xs font-black uppercase tracking-widest text-school-gold">{leader.tenure}</span>
                             </div>

                             <div className="mt-8 flex gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-school-gold/20" />
                                <div className="h-1.5 w-1.5 rounded-full bg-school-gold/20" />
                                <div className="h-1.5 w-1.5 rounded-full bg-school-gold/30" />
                             </div>
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
                 <h2 className="text-2xl font-serif text-school-ink italic">An Everlasting Legacy</h2>
                 <p className="text-school-ink/40 mt-4 font-medium leading-relaxed">The records for this era are currently being meticulously preserved in our digital archives. Please return for the full roster.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default FormerLeadersPage;
