import React, { useState } from 'react';
import { AppData } from '../types';
import Layout from '../components/layout/Layout';
import { motion, AnimatePresence } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { Maximize2, X, Camera, Calendar, Image as ImageIcon, ChevronDown } from 'lucide-react';

const GalleryPage = ({ data }: { data: AppData }) => {
  const [selectedImage, setSelectedImage] = useState<typeof data.gallery[0] | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const groupedGallery = data.gallery.reduce((acc, item) => {
    const session = item.session || 'Institutional Archives';
    if (!acc[session]) acc[session] = [];
    acc[session].push(item);
    return acc;
  }, {} as Record<string, typeof data.gallery>);

  const allAvailableSessions = Object.keys(groupedGallery).sort((a, b) => {
    if (a === 'Institutional Archives') return 1;
    if (b === 'Institutional Archives') return -1;
    return b.localeCompare(a);
  });

  const displaySessions = activeFilter === 'All' 
    ? allAvailableSessions 
    : [activeFilter];

  return (
    <Layout data={data}>
      <Helmet>
        <title>Gallery | St. Xavier's Sr. Sec. School, Jaipur</title>
        <meta name="description" content="Explore the visual legacy of St. Xavier's Jaipur through our curated photo gallery capturing moments of academic and cultural excellence." />
      </Helmet>

      <section className="pb-40 bg-white dark:bg-slate-950 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 mb-24 relative z-10 pt-24 text-center">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="space-y-6"
           >
              <span className="text-[10px] font-bold uppercase tracking-widest text-school-accent">Institution Archives</span>
              <h2 className="text-5xl md:text-7xl font-bold text-school-navy dark:text-white tracking-tight leading-tight">Visual <span className="text-school-accent">Narratives.</span></h2>
              <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">Capturing the soul of St. Xavier's through moments of growth, celebration, and academic pursuit.</p>

              {/* Session Selector Dropdown */}
              <div className="relative inline-block w-full max-w-xs pt-8">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full flex items-center justify-between px-8 py-4 bg-white dark:bg-slate-900 rounded-3xl border border-black/5 dark:border-white/10 shadow-sm hover:border-school-accent transition-all"
                >
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-school-accent mb-1">Academic Session</span>
                    <span className="text-lg font-bold text-school-navy dark:text-white leading-none">{activeFilter}</span>
                  </div>
                  <ChevronDown 
                    size={20} 
                    className={`text-school-accent transition-transform duration-500 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                  />
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <>
                      {/* Backdrop for mobile to close when clicking outside */}
                      <div 
                        className="fixed inset-0 z-40 lg:hidden"
                        onClick={() => setIsDropdownOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.95 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-black/5 dark:border-white/10 p-4 z-50 overflow-hidden"
                      >
                        <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                          {['All', ...allAvailableSessions].map((filter) => (
                            <button
                              key={filter}
                              onClick={() => {
                                setActiveFilter(filter);
                                setIsDropdownOpen(false);
                              }}
                              className={`w-full text-left px-6 py-3 rounded-2xl text-sm font-bold transition-all mb-1 last:mb-0 flex items-center justify-between group/item ${
                                activeFilter === filter 
                                  ? 'bg-school-navy text-white' 
                                  : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-school-navy'
                              }`}
                            >
                              {filter}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
           </motion.div>
        </div>

        {displaySessions.map((session) => (
          <div key={session} className="mb-24">
            <div className="max-w-7xl mx-auto px-6 mb-12">
              <div className="flex items-center gap-6">
                <h3 className="text-2xl font-bold text-school-navy dark:text-white tracking-tight">{session}</h3>
                <div className="h-[1px] bg-black/5 dark:bg-white/5 flex-1"></div>
              </div>
            </div>
            
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {groupedGallery[session].map((item, i) => (
                <motion.div 
                  key={item.id}
                  whileHover={{ y: -5 }}
                  onClick={() => setSelectedImage(item)}
                  className="group cursor-pointer"
                >
                  <div className="aspect-[4/5] rounded-3xl overflow-hidden relative bg-slate-100 dark:bg-slate-800 border border-black/5 dark:border-white/5">
                    <img 
                      src={item.url} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                      alt={item.caption}
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white font-bold text-sm tracking-tight">{item.caption}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}

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
