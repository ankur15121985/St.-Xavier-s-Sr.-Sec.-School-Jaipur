import React, { useState } from 'react';
import { AppData } from '../types';
import Layout from '../components/layout/Layout';
import { motion, AnimatePresence } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { Maximize2, X, Camera, Calendar, Image as ImageIcon } from 'lucide-react';

const GalleryPage = ({ data }: { data: AppData }) => {
  const [selectedImage, setSelectedImage] = useState<typeof data.gallery[0] | null>(null);

  return (
    <Layout data={data}>
      <Helmet>
        <title>Gallery | St. Xavier's Sr. Sec. School, Jaipur</title>
        <meta name="description" content="Explore the visual legacy of St. Xavier's Jaipur through our curated photo gallery capturing moments of academic and cultural excellence." />
      </Helmet>

      <section className="pb-40 bg-school-paper min-h-screen">
        {/* Decorative background mark */}
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
          <Camera size={400} />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-24 relative z-10">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="flex flex-col items-center text-center"
           >
              <div className="inline-flex items-center gap-3 px-6 py-2 bg-school-gold/10 rounded-full border border-school-gold/20 mb-8">
                <ImageIcon className="text-school-gold" size={16} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-school-ink/60">Institutional Archives</span>
              </div>
              <h2 className="text-6xl md:text-8xl font-serif font-black text-school-ink mb-8 tracking-tighter uppercase italic leading-none">Visual <span className="text-school-gold">Chronicles.</span></h2>
              <div className="w-24 h-1 bg-school-gold rounded-full mb-8"></div>
              <p className="text-xl text-school-ink/40 font-light max-w-2xl mx-auto italic">Capturing the soul of St. Xavier's through moments of growth, celebration, and academic pursuit.</p>
           </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {data.gallery.map((item, i) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedImage(item)}
              className="group cursor-pointer"
            >
              <div className="aspect-[4/5] rounded-[48px] overflow-hidden relative shadow-[0_20px_50px_rgba(0,33,71,0.15)] bg-school-paper border-[12px] border-school-paper transition-transform duration-500 hover:-translate-y-4">
                <img 
                  src={item.url} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  alt={item.caption}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-school-navy/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center text-white">
                    <Maximize2 size={24} />
                  </div>
                </div>
              </div>
              <div className="mt-8 px-6 text-center">
                <h4 className="text-xl font-serif font-bold text-school-navy italic tracking-tight mb-2 group-hover:text-school-gold transition-colors">{item.caption}</h4>
                <div className="flex items-center justify-center gap-2 opacity-30 text-[9px] font-black uppercase tracking-widest">
                  <Calendar size={10} />
                  <span>St. Xavier's Archives • 2026</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12"
            >
              <div 
                className="absolute inset-0 bg-school-navy/95 backdrop-blur-2xl"
                onClick={() => setSelectedImage(null)}
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-full max-w-7xl h-full flex flex-col items-center justify-center"
              >
                <button 
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-0 right-0 m-4 md:-mr-12 md:-mt-12 w-12 h-12 rounded-full bg-white/10 hover:bg-white text-white hover:text-school-navy flex items-center justify-center transition-all z-20"
                >
                  <X size={24} />
                </button>
                <div className="w-full h-full rounded-[40px] overflow-hidden border-8 border-white/10 shadow-2xl relative">
                  <img 
                    src={selectedImage.url} 
                    className="w-full h-full object-contain bg-black/20"
                    alt={selectedImage.caption}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-8 md:p-12 bg-gradient-to-t from-black/80 to-transparent">
                    <h5 className="text-white font-serif italic text-3xl md:text-5xl font-black mb-4">{selectedImage.caption}</h5>
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em]">Official Photographic Record • St. Xavier's, Jaipur</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </Layout>
  );
};

export default GalleryPage;
