import React from 'react';
import { AppData } from '../types';
import Layout from '../components/layout/Layout';
import { motion } from 'motion/react';

const GalleryPage = ({ data }: { data: AppData }) => {
  return (
    <Layout>
      <section className="pt-48 pb-40 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center mb-24">
           <h2 className="text-7xl font-serif font-black text-school-navy mb-8">Visual <span className="text-school-gold italic">Chronicles.</span></h2>
           <p className="text-xl text-school-navy/50 font-light max-w-2xl mx-auto">Capturing moments of growth, celebration, and academic pursuit at St. Xavier's.</p>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.gallery.map((item, i) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group aspect-[4/3] rounded-[40px] overflow-hidden relative shadow-2xl bg-white border-8 border-white"
            >
              <img 
                src={item.url} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                alt={item.caption}
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-school-navy to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-12">
                <p className="text-white font-serif italic text-2xl">{item.caption}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default GalleryPage;
