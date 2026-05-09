import React from 'react';
import { motion } from 'motion/react';
import Layout from '../components/layout/Layout';
import { AppData } from '../types';
import { ShieldCheck, FileText, ExternalLink, Image as ImageIcon, AlertCircle } from 'lucide-react';

const FireSafetyPage = ({ data }: { data: AppData }) => {
  const safetyItems = (data.fire_safety || [])
    .filter(item => item.is_enabled !== false)
    .sort((a, b) => (a.order_index || 0) - (b.order_index || 0));

  return (
    <Layout data={data}>
      <div className="pt-20">
        {/* Hero Section */}
        <section className="relative py-24 bg-school-navy overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-school-navy via-school-navy/95 to-school-paper"></div>
          
          <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-1 bg-school-gold"></div>
                <span className="text-school-gold font-black uppercase tracking-[0.3em] text-[10px]">Institutional Safety & Preparedness</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-serif font-black text-white italic tracking-tight leading-none mb-8">
                Compliance & <span className="text-school-gold block not-italic">Safety Records.</span>
              </h1>
              <p className="text-white/60 text-lg md:text-xl font-medium leading-relaxed">
                St. Xavier's School Jaipur maintains rigorous safety protocols and valid certifications. Browse our institutional compliance documentation below.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-32 bg-school-paper relative">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            {safetyItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {safetyItems.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="group bg-white rounded-3xl p-8 border border-school-ink/5 hover:border-school-gold/30 transition-all hover:shadow-2xl hover:shadow-school-gold/5 flex flex-col h-full"
                  >
                    <div className="flex items-start justify-between mb-8">
                      <div className="w-14 h-14 bg-school-navy/5 rounded-2xl flex items-center justify-center text-school-navy group-hover:bg-school-navy group-hover:text-white transition-all duration-500">
                        {item.attachmentUrl?.toLowerCase().endsWith('.pdf') ? <FileText size={24} /> : 
                         item.image_url ? <ImageIcon size={24} /> : 
                         <ShieldCheck size={24} />}
                      </div>
                      <span className="text-[10px] font-black text-school-ink/20 uppercase tracking-widest">
                        #{idx + 1}
                      </span>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-2xl font-serif font-black text-school-navy mb-2 leading-tight">
                        {item.title}
                      </h3>
                      {item.heading && (
                        <p className="text-[10px] font-black uppercase tracking-widest text-school-gold mb-4">
                          {item.heading}
                        </p>
                      )}
                      <p className="text-school-ink/60 text-sm leading-relaxed mb-8">
                        {item.content}
                      </p>
                    </div>

                    <div className="mt-auto space-y-3">
                      {item.attachmentUrl && (
                        <a 
                          href={item.attachmentUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-between w-full p-4 bg-school-navy text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-school-gold hover:text-school-navy transition-all group/btn"
                        >
                          View Document
                          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover/btn:bg-school-navy/10">
                            <ExternalLink size={12} />
                          </div>
                        </a>
                      )}
                      
                      {item.image_url && !item.attachmentUrl && (
                        <div className="rounded-xl overflow-hidden aspect-[4/3] border border-school-ink/10">
                          <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        </div>
                      )}

                      {!item.attachmentUrl && !item.image_url && (
                        <div className="pt-4 border-t border-school-ink/5 italic text-school-ink/40 text-[10px] font-medium">
                          Internal reference available at school administrative office.
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-white rounded-[40px] border-2 border-dashed border-school-ink/5">
                <AlertCircle size={48} className="mx-auto text-school-ink/10 mb-6" />
                <h3 className="text-2xl font-serif font-black text-school-navy mb-2 italic">No Records Found</h3>
                <p className="text-school-ink/40 max-w-md mx-auto text-sm">
                  The fire safety records are currently being updated in our digital portal. Please check back shortly for valid certifications and protocols.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Action Call */}
        <section className="py-24 bg-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-serif font-black text-school-navy mb-6 tracking-tight">
              Institutional Safety <span className="text-school-gold">Compliance.</span>
            </h2>
            <p className="text-school-ink/60 leading-relaxed mb-12">
              Our campus is equipped with intelligent smoke detection, centralized alarm systems, and emergency lighting. For specific queries regarding safety protocols, please contact the Physical Education and Safety Department.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <a href="/contact" className="px-10 py-5 bg-school-navy text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-school-gold hover:text-school-navy transition-all shadow-xl shadow-school-navy/10">Contact Safety Dept</a>
              <a href="/mandatory-disclosures" className="px-10 py-5 bg-school-paper text-school-navy border border-school-navy/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-school-gold transition-all">Mandatory Disclosures</a>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default FireSafetyPage;
