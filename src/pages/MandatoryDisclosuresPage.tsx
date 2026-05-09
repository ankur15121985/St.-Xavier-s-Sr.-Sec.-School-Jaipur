import React from 'react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import Layout from '../components/layout/Layout';
import { AppData } from '../types';
import { 
  FileText, 
  ExternalLink, 
  ShieldCheck,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

const MandatoryDisclosuresPage = ({ data }: { data: AppData }) => {
  const disclosures = data.mandatory_disclosures || [];

  return (
    <Layout data={data}>
      <Helmet>
        <title>Mandatory Disclosures | St. Xavier's Sr. Sec. School, Jaipur</title>
        <meta name="description" content="Official mandatory public disclosures, statutory documents, and CBSE compliance reports for St. Xavier's Sr. Sec. School, Jaipur." />
      </Helmet>
      <div className="bg-school-paper min-h-screen">
        {/* Hero Section */}
        <section className="py-24 bg-school-navy relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
            <svg className="h-full w-full" viewBox="0 0 100 100">
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          </div>
          <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-school-gold/10 text-school-gold rounded-full text-[10px] font-black uppercase tracking-widest mb-8">
                <ShieldCheck size={14} />
                Statutory Compliance
              </div>
              <h1 className="text-5xl md:text-7xl font-serif font-black text-white tracking-tighter mb-8 italic uppercase">
                Mandatory <span className="text-school-gold block">Disclosures</span>
              </h1>
              <p className="text-white/50 text-xl font-light italic leading-relaxed">
                In compliance with CBSE guidelines, St. Xavier's School maintains transparency by providing access to all statutory documents and reports.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-24 max-w-7xl mx-auto px-6 lg:px-12">
          {disclosures.length > 0 ? (
            <div className="grid gap-12">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {disclosures.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    id={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className="group bg-white rounded-[40px] p-8 border border-school-ink/5 shadow-sm hover:shadow-2xl hover:border-school-gold/20 transition-all duration-500 flex flex-col"
                  >
                    <div className="w-16 h-16 bg-school-ink/5 rounded-2xl flex items-center justify-center text-school-navy mb-8 group-hover:bg-school-gold group-hover:text-white transition-colors duration-500">
                      <FileText size={32} />
                    </div>
                    
                    <h3 className="text-xl font-serif font-black text-school-ink italic mb-4 leading-tight group-hover:text-school-gold transition-colors italic uppercase">
                      {item.title}
                    </h3>
                    
                    <div 
                      className="text-sm text-school-ink/60 font-light mb-8 flex-1 prose prose-sm line-clamp-4"
                      dangerouslySetInnerHTML={{ __html: item.content }}
                    />

                    {item.attachmentUrl ? (
                      <a 
                        href={item.attachmentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-4 bg-school-navy text-white rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-school-gold hover:text-school-navy transition-all shadow-lg active:scale-95"
                      >
                        Download Document
                        <ExternalLink size={14} />
                      </a>
                    ) : (
                      <div className="w-full py-4 bg-school-ink/5 text-school-ink/30 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest cursor-not-allowed">
                        Document Pending
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Statutory Checklist */}
              <div className="bg-school-navy rounded-[60px] p-12 md:p-20 relative overflow-hidden mt-12">
                <div className="absolute top-0 right-0 w-96 h-96 bg-school-gold opacity-10 rounded-full blur-[120px] -mr-48 -mt-48" />
                <div className="relative z-10 grid lg:grid-cols-2 gap-20 items-center">
                  <div>
                    <h2 className="text-4xl font-serif font-black text-white italic tracking-tight mb-8 uppercase">Compliance <span className="text-school-gold">Checklist</span></h2>
                    <div className="space-y-6">
                      {[
                        "Society/Trust Registration documents",
                        "NOC from State Government",
                        "Building Safety Certificate",
                        "Fire Safety Certificate",
                        "Self-attested certificates & Affidavits",
                        "Water, Health & Sanitation Certificate"
                      ].map((text, i) => (
                        <div key={i} className="flex items-center gap-4 text-white/70">
                          <CheckCircle2 size={24} className="text-school-gold shrink-0" />
                          <span className="text-sm font-medium">{text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[40px] p-10 space-y-8">
                    <p className="text-white/60 text-sm font-light italic leading-relaxed">
                      All disclosures are updated annually or as per administrative changes. For any specific queries regarding compliance, please contact the school administration office.
                    </p>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between py-4 border-b border-white/5">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Latest Update</span>
                        <span className="text-xs font-bold text-school-gold">{new Date().getFullYear()} Session</span>
                      </div>
                      <div className="flex items-center justify-between py-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Board Authority</span>
                        <span className="text-xs font-bold text-white uppercase">CBSE, New Delhi</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-40 text-center glass-surface rounded-[60px] border border-dashed border-school-ink/20">
              <div className="w-24 h-24 bg-school-ink/5 rounded-full flex items-center justify-center text-school-ink/10 mx-auto mb-8">
                <FileText size={48} />
              </div>
              <h2 className="text-3xl font-serif font-black text-school-ink italic mb-4 uppercase">No Disclosures Uploaded</h2>
              <p className="text-school-ink/40 font-light max-w-sm mx-auto">Please check back later or contact the administration for statutory documentation.</p>
            </div>
          )}
        </section>

        {/* Footer Contact Placeholder */}
        <section className="py-24 bg-school-paper text-center">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-serif font-black text-school-ink italic tracking-tight mb-8 underline decoration-school-gold decoration-4 underline-offset-8 uppercase">
              Official Institutional Verification
            </h2>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-school-ink/30">Jaipur Xavier Educational Association • Established 1941</p>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default MandatoryDisclosuresPage;
