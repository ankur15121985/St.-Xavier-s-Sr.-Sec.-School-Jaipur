import React from 'react';
import { AppData } from '../types';
import Layout from '../components/layout/Layout';
import { motion } from 'motion/react';
import { Bell, ArrowRight } from 'lucide-react';

const NoticesPage = ({ data }: { data: AppData }) => {
  return (
    <Layout data={data}>
      <section className="pt-48 pb-40 bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-24">
           <h2 className="text-7xl font-serif font-black text-school-navy mb-8">Official <span className="text-school-gold italic">Announcements.</span></h2>
           <p className="text-xl text-school-navy/50 font-light max-w-2xl">Digital circulars, examination updates, and administrative bulletins.</p>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid gap-6">
          {data.notices.map((n, i) => (
            <motion.div 
              key={n.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-12 glass-surface rounded-[40px] hover:bg-white transition-all group flex flex-col md:flex-row justify-between items-start md:items-center gap-8 shadow-sm hover:shadow-2xl"
            >
              <div className="flex-1">
                <div className="flex gap-4 mb-6">
                  <span className="px-4 py-1.5 bg-school-gold/10 text-school-gold text-[10px] font-black uppercase tracking-widest rounded-full">{n.category}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-school-navy/30 py-1.5">{n.date}</span>
                </div>
                <h4 className="text-3xl font-serif font-black text-school-navy group-hover:text-school-gold transition-colors">{n.title}</h4>
              </div>
              <button className="flex items-center gap-4 bg-school-navy text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-school-accent transition-all">
                Download PDF
                <ArrowRight size={14} className="text-school-gold" />
              </button>
            </motion.div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default NoticesPage;
