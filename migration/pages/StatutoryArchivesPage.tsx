import React from 'react';
import { AppData } from '../types';
import Layout from '../components/layout/Layout';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { ShieldCheck, Calendar, Download, Eye } from 'lucide-react';

const StatutoryArchivesPage = ({ data }: { data: AppData }) => {
  // We'll show gallery images that might be related to disclosures, 
  // or just all gallery images if that's the intent.
  const disclosureImagesFromSection = data.mandatory_disclosures?.filter(item => item.image_url).map(item => ({
    id: item.id,
    url: item.image_url!,
    caption: item.title,
    session: 'Mandatory Disclosure'
  })) || [];

  const archiveImages = [
    ...disclosureImagesFromSection,
    ...data.gallery.filter(item => item.is_enabled !== false)
  ];

  return (
    <Layout data={data}>
      <Helmet>
        <title>Statutory Archives | St. Xavier's Secondary School, Jaipur</title>
        <meta name="description" content="Official statutory and mandatory disclosure documents and visual records for St. Xavier's School, Jaipur." />
      </Helmet>

      <div className="bg-[#FDFDFD] min-h-screen pb-40">
        {/* Minimal Hero */}
        <section className="pt-32 pb-20 bg-school-navy relative overflow-hidden">
          <div className="absolute inset-0 bg-school-gold/5 blur-3xl rounded-full translate-x-1/2" />
          <div className="max-w-7xl mx-auto px-6 relative z-10">
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="space-y-6"
             >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-school-gold/10 text-school-gold rounded-full text-[10px] font-black uppercase tracking-widest border border-school-gold/20">
                  <ShieldCheck size={14} /> Official Records
                </div>
                <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase leading-[0.8] scale-y-110 origin-left">
                  STATUTORY <span className="text-school-gold italic">ARCHIVES.</span>
                </h1>
                <p className="text-lg text-white/40 font-medium max-w-2xl leading-relaxed">
                  A comprehensive visual repository of institutional certifications, mandatory disclosures, and historical documentation.
                </p>
             </motion.div>
          </div>
        </section>

        {/* Scrolling Wall of Images */}
        <section className="max-w-5xl mx-auto px-6 -mt-10">
          <div className="grid gap-20">
            {archiveImages.map((image, idx) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                {/* Meta Info */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-school-navy text-school-gold rounded-2xl flex items-center justify-center font-black italic text-xl">
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-school-navy uppercase tracking-tight leading-none mb-1">
                        {image.caption || 'Institutional Record'}
                      </h4>
                      <p className="text-[10px] font-black text-school-ink/30 uppercase tracking-widest flex items-center gap-2">
                         <Calendar size={12} className="text-school-gold" /> {image.session || 'Institutional Archive'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                     <a 
                       href={image.url} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="p-4 bg-school-paper rounded-full text-school-navy hover:bg-school-navy hover:text-white transition-all shadow-sm"
                     >
                        <Eye size={20} />
                     </a>
                     <a 
                       href={image.url} 
                       download
                       className="p-4 bg-school-paper rounded-full text-school-navy hover:bg-school-navy hover:text-white transition-all shadow-sm"
                     >
                        <Download size={20} />
                     </a>
                  </div>
                </div>

                {/* Main Image View */}
                <div className="relative rounded-[40px] overflow-hidden bg-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border border-school-ink/5 p-4 md:p-8 group-hover:shadow-[0_60px_120px_-30px_rgba(0,0,0,0.15)] transition-all duration-700">
                  <img 
                    src={image.url} 
                    alt={image.caption}
                    className="w-full h-auto rounded-[24px] saturate-[0.8] group-hover:saturate-100 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Subtle Grain Overlay */}
                  <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <filter id="noise">
                        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" />
                      </filter>
                      <rect width="100" height="100" filter="url(#noise)" />
                    </svg>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                   <div className="h-[1px] bg-school-ink/10 flex-1 mr-8 mt-2" />
                   <span className="text-[9px] font-black text-school-ink/20 uppercase tracking-[0.6em] italic">Official Documentation Registry</span>
                </div>
              </motion.div>
            ))}
          </div>

          {archiveImages.length === 0 && (
             <div className="py-40 text-center space-y-8">
                <div className="w-24 h-24 bg-school-paper rounded-full flex items-center justify-center text-school-ink/20 mx-auto">
                  <ShieldCheck size={48} />
                </div>
                <h3 className="text-3xl font-black text-school-navy uppercase tracking-tighter italic">Archives <span className="text-school-ink/20">Empty.</span></h3>
                <p className="text-school-ink/40 font-medium">No records have been uploaded to the statutory registry yet.</p>
             </div>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default StatutoryArchivesPage;
