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
      <div className="bg-school-paper min-h-screen">
        {/* Banner Section */}
        <section className="py-20 bg-school-navy relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
          </div>
          <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-5xl md:text-7xl font-serif font-black text-white tracking-tighter mb-6 italic">
                Former <br /> 
                <span className="text-school-gold not-italic uppercase text-3xl md:text-4xl tracking-[0.3em]">{title}</span>
              </h1>
              <p className="text-white/50 text-xl font-light max-w-2xl mx-auto italic">{description}</p>
            </motion.div>
          </div>
        </section>

        {/* List Section */}
        <section className="py-24 max-w-5xl mx-auto px-6 lg:px-12 relative z-10 -mt-12">
          {leaders.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-8">
              {leaders.map((leader, i) => (
                <motion.div
                  key={leader.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ amount: 0.1 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/40 backdrop-blur-xl p-8 rounded-[40px] border border-school-ink/10 shadow-xl flex items-center gap-8 group hover:border-school-accent transition-all duration-500"
                >
                  <div className="w-24 h-24 rounded-3xl bg-school-paper/50 flex items-center justify-center shrink-0 border border-school-ink/5 overflow-hidden group-hover:scale-105 transition-transform duration-500">
                    {leader.image ? (
                      <img src={leader.image} alt={leader.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                    ) : (
                      <Users2 size={32} className="text-school-ink/20" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-school-ink italic leading-tight mb-2 group-hover:text-school-accent transition-colors">{leader.name}</h3>
                    <div className="flex items-center gap-2 text-school-accent font-black uppercase text-[10px] tracking-widest bg-school-paper/50 px-3 py-1 rounded-full border border-school-ink/5 w-fit">
                      <History size={12} />
                      {leader.tenure}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white/40 backdrop-blur-xl p-20 rounded-[64px] border border-school-ink/10 shadow-2xl text-center">
              <div className="w-20 h-20 bg-school-paper/50 rounded-full flex items-center justify-center mx-auto mb-6 text-school-ink/20">
                <Award size={40} />
              </div>
              <h3 className="text-2xl font-serif font-black text-school-ink italic">Legacy Registry</h3>
              <p className="text-school-ink/40 mt-4 font-medium tracking-wide">Historical data is being currently archived. Please check back soon.</p>
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default FormerLeadersPage;
