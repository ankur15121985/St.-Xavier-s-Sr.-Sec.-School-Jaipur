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
  const leaders = (data.former_leaders || [])
    .filter(l => l.type === type)
    .sort((a, b) => a.order_index - b.order_index);

  return (
    <Layout data={data}>
      <div className="bg-school-paper min-h-screen selection:bg-school-gold/30">
        {/* Banner Section - Editorial Style */}
        <section className="pt-32 pb-20 px-6 overflow-hidden relative">
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

        {/* Timeline List Section */}
        <section className="pb-32 px-6">
          <div className="max-w-6xl mx-auto relative">
            {/* Vertical Spine */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-school-ink/5 hidden md:block"></div>

            {leaders.length > 0 ? (
              <div className="space-y-12 md:space-y-0">
                {leaders.map((leader, i) => (
                  <motion.div
                    key={leader.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className={`flex flex-col md:flex-row items-center gap-8 md:gap-24 ${
                      i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                    } md:min-h-[300px]`}
                  >
                    {/* Content Side */}
                    <div className={`flex-1 w-full text-center ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                      <div className={`space-y-4 ${i % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                        <span className="text-school-gold font-serif italic text-2xl opacity-40">#{String(i + 1).padStart(2, '0')}</span>
                        <h3 className="text-3xl md:text-4xl font-serif text-school-ink leading-tight hover:text-school-gold transition-colors duration-500 cursor-default">
                          {leader.name}
                        </h3>
                        <div className={`flex items-center gap-3 w-fit ${i % 2 === 0 ? 'md:ml-auto' : 'md:mr-auto'} bg-white/50 px-5 py-2 rounded-2xl border border-school-ink/5 shadow-sm`}>
                          <History size={14} className="text-school-gold" />
                          <span className="text-xs font-black uppercase tracking-widest text-school-ink/60">{leader.tenure}</span>
                        </div>
                      </div>
                    </div>

                    {/* Image/Icon Side */}
                    <div className="flex-none relative">
                      <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-white shadow-2xl relative z-10 group">
                        <div className="absolute inset-0 bg-school-navy/10 group-hover:bg-transparent transition-colors duration-700"></div>
                        {leader.image ? (
                          <img src={leader.image} alt={leader.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" />
                        ) : (
                          <div className="w-full h-full bg-school-paper flex items-center justify-center text-school-ink/10">
                            <Users2 size={64} className="group-hover:scale-110 transition-transform duration-700" />
                          </div>
                        )}
                      </div>
                      {/* Decorative elements behind photo */}
                      <div className="absolute -inset-4 bg-school-gold/5 rounded-full blur-2xl -z-0"></div>
                    </div>

                    <div className="flex-1 hidden md:block"></div>
                  </motion.div>
                ))}
              </div>
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
