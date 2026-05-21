import React from 'react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import Layout from '../components/layout/Layout';
import { AppData } from '../types';
import { 
  Building2, 
  ShieldCheck, 
  Globe, 
  Map, 
  Library,
  UserCheck,
  Scale,
  Clock,
  ExternalLink,
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';

const SchoolInformationPage = ({ data }: { data: AppData }) => {
  // Use dynamic sections if available, fallback to empty or default
  const dynamicSections = data.school_info || [];
  
  // Icon mapping helper
  const getIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('basic') || t.includes('address')) return <Building2 className="text-school-gold" />;
    if (t.includes('recognition') || t.includes('noc')) return <ShieldCheck className="text-school-gold" />;
    if (t.includes('affiliation')) return <Globe className="text-school-gold" />;
    if (t.includes('management') || t.includes('trust')) return <UserCheck className="text-school-gold" />;
    if (t.includes('campus') || t.includes('infra')) return <Map className="text-school-gold" />;
    if (t.includes('facilit') || t.includes('resource') || t.includes('library')) return <Library className="text-school-gold" />;
    if (t.includes('cycle') || t.includes('period') || t.includes('time')) return <Clock className="text-school-gold" />;
    return <FileText className="text-school-gold" />;
  };

  return (
    <Layout data={data}>
      <Helmet>
        <title>{data.content.schoolInfoPageTitle || "School Information"} | St. Xavier's Sr. Sec. School, Jaipur</title>
        <meta name="description" content="Access official mandatory public disclosures, CBSE affiliation details, and comprehensive school information for St. Xavier's Sr. Sec. School, Jaipur." />
      </Helmet>
      <div className="bg-school-paper min-h-screen">
        {/* Hero Section */}
        <section className="py-20 bg-school-navy relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
          </div>
          <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center"
            >
              <div className="mb-8 relative">
                <div className="absolute inset-0 bg-school-gold blur-3xl opacity-20 rounded-full"></div>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="w-32 h-32 md:w-40 md:h-40 rounded-[40px] bg-white text-school-navy flex items-center justify-center font-serif font-black text-6xl md:text-7xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-4 border-school-gold/30 relative z-10"
                >
                  X
                  <div className="absolute -bottom-2 -right-2 bg-school-gold text-white p-2 rounded-2xl shadow-lg border-2 border-white">
                    <ShieldCheck size={24} />
                  </div>
                </motion.div>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-serif font-black text-white tracking-tighter mb-6 italic uppercase">
                {data.content.schoolInfoHeroTitle || "School"} <span className="text-school-gold">{data.content.schoolInfoHeroSubtitle || "Information"}</span>
              </h1>
              <p className="text-white/50 text-xl font-light max-w-3xl mx-auto italic">
                {data.content.schoolInfoHeroDescription || "Mandatory Public Disclosure and Statutory Information (CBSE)."}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Data Grid - Standard Info */}
        <section className="py-24 max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-12">
            <h2 className="text-3xl font-serif font-black text-school-ink italic uppercase tracking-tight flex items-center gap-4">
              <span className="w-12 h-px bg-school-gold"></span>
              {data.content.statutoryDisclosureTitle || "Statutory Disclosure"}
            </h2>
          </div>
          
          {dynamicSections.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-8">
              {dynamicSections.map((section, idx) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-school-paper rounded-[40px] border border-school-ink/10 shadow-sm overflow-hidden"
                >
                  <div className="p-8 border-b border-school-ink/5 bg-school-ink/5 flex items-center gap-4">
                    <div className="w-12 h-12 bg-school-paper rounded-2xl flex items-center justify-center shadow-sm">
                      {getIcon(section.title)}
                    </div>
                    <div>
                      <h3 className="text-xl font-serif font-black text-school-ink italic uppercase tracking-tight">{section.title}</h3>
                      {section.heading && <p className="text-[9px] font-black uppercase text-school-gold tracking-widest">{section.heading}</p>}
                    </div>
                  </div>
                  <div className="p-8 space-y-4">
                    <div 
                      className="markdown-body prose prose-sm max-w-none text-school-ink/70"
                      dangerouslySetInnerHTML={{ __html: section.content }}
                    />
                    {section.attachmentUrl && (
                      <div className="mt-4 pt-4 border-t border-school-ink/5">
                        <a 
                          href={section.attachmentUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-school-gold font-black uppercase tracking-widest text-[10px] hover:underline"
                        >
                          View Attachment <ExternalLink size={12} />
                        </a>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-school-ink/40 font-serif italic">No information sections have been added to the admin panel yet.</p>
            </div>
          )}
        </section>

        {/* Dynamic Static Elements */}
        {data.content.grievanceOfficerName && (
          <section className="py-24 border-t border-school-ink/10">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
              <div className="mb-16 text-center">
                <h2 className="text-4xl font-serif font-black text-school-ink italic uppercase tracking-tight">
                  {data.content.statutoryOfficersTitle || "Statutory Officers"}
                </h2>
                <div className="w-24 h-1 bg-school-gold mx-auto mt-6 rounded-full"></div>
              </div>

              <div className="grid md:grid-cols-2 gap-12">
                <div className="p-12 glass-surface rounded-[48px] border border-school-ink/10">
                  <div className="flex items-center gap-4 mb-8">
                    <UserCheck className="text-school-gold" size={32} />
                    <div>
                      <h3 className="text-2xl font-serif font-black text-school-ink italic">Grievance Officer</h3>
                      <p className="text-[10px] uppercase font-black tracking-widest text-school-ink/30">Redressal & Compliance</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between border-b border-school-ink/5 pb-4">
                      <span className="text-[10px] font-black uppercase tracking-widest text-school-ink/40">Name</span>
                      <span className="text-sm font-bold text-school-ink">{data.content.grievanceOfficerName}</span>
                    </div>
                    <div className="flex justify-between border-b border-school-ink/5 pb-4">
                      <span className="text-[10px] font-black uppercase tracking-widest text-school-ink/40">Email</span>
                      <span className="text-sm text-school-ink/70">{data.content.grievanceOfficerEmail}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-school-ink/40">Phone</span>
                      <span className="text-sm text-school-ink/70">{data.content.grievanceOfficerPhone}</span>
                    </div>
                  </div>
                </div>

                <div className="p-12 bg-school-navy text-white rounded-[48px] shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                  <div className="flex items-center gap-4 mb-8">
                    <Scale className="text-school-gold" size={32} />
                    <div>
                      <h3 className="text-2xl font-serif font-black text-white italic">Internal Committees</h3>
                      <p className="text-[10px] uppercase font-black tracking-widest text-white/30">Statutory Bodies</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <Link to="/mandatory-disclosures" className="flex justify-between items-center group p-4 border border-white/10 rounded-2xl hover:bg-white/5 transition-all">
                      <span className="text-xs font-black uppercase tracking-widest text-white/70">Mandatory Public Disclosure</span>
                      <ExternalLink size={16} className="text-school-gold group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link to="/fees" className="flex justify-between items-center group p-4 border border-white/10 rounded-2xl hover:bg-white/5 transition-all">
                      <span className="text-xs font-black uppercase tracking-widest text-white/70">Detailed Fee Structure</span>
                      <ExternalLink size={16} className="text-school-gold group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link to="/staff" className="flex justify-between items-center group p-4 border border-white/10 rounded-2xl hover:bg-white/5 transition-all">
                      <span className="text-xs font-black uppercase tracking-widest text-white/70">Teaching Staff List</span>
                      <ExternalLink size={16} className="text-school-gold group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Contact Footer Banner */}
        <section className="py-24 text-center max-w-4xl mx-auto px-6">
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-serif font-black text-school-ink italic tracking-tight underline decoration-school-gold decoration-4 underline-offset-8">
              {data.content.schoolInfoTagline || "\"Dedicated to Excellence in Education Since 1941\""}
            </h2>
            <p className="text-xs font-black uppercase tracking-[0.4em] text-school-ink/30">
              {data.content.educationalTrustName || "Jaipur Xavier Educational Association"}
            </p>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default SchoolInformationPage;
