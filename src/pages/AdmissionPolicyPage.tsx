import React from 'react';
import { motion } from 'motion/react';
import Layout from '../components/layout/Layout';
import { AppData } from '../types';
import { FileText, Download } from 'lucide-react';

const AdmissionPolicyPage = ({ data }: { data: AppData }) => {
  const prospectusLink = data.links.find(l => l.title.toLowerCase().includes('prospectus'))?.url || '#';

  return (
    <Layout data={data}>
      <div className="pt-32 bg-slate-50 min-h-screen">
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
              <h1 className="text-5xl md:text-7xl font-serif font-black text-white tracking-tighter mb-6 italic">Admission <br /> <span className="text-school-gold not-italic uppercase text-3xl md:text-4xl tracking-[0.3em]">Policy</span></h1>
              <p className="text-white/50 text-xl font-light max-w-2xl mx-auto italic">Guidelines and protocols for student enrollment and institutional withdrawal.</p>
            </motion.div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-24 max-w-4xl mx-auto px-6 lg:px-12 relative z-10 -mt-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-surface bg-white p-12 md:p-20 rounded-[64px] border border-white shadow-2xl space-y-16"
          >
            {/* Withdrawal Section */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-school-gold/10 rounded-2xl flex items-center justify-center text-school-gold">
                  <FileText size={24} />
                </div>
                <h2 className="text-4xl font-serif font-black text-school-navy italic tracking-tight uppercase">Withdrawal</h2>
              </div>
              
              <div className="space-y-6 text-lg text-school-navy/80 leading-relaxed font-light">
                <p>
                  Any intended withdrawal of a student from the school must be communicated to the Principal in writing at least one calendar month (30 days) in advance; otherwise one month's fee will be charged. Those who withdraw from the school in April or May must pay fee up to June inclusive.
                </p>
                <p>
                  The School reserves the right to ask the parents to withdraw their child if his/her progress in studies is unsatisfactory, conduct harmful to other students, fee is not paid on time or if there are other reasons which, in the opinion of the school authorities, render his/her continuation in the school undesirable. 
                </p>
                <div className="bg-slate-50 p-10 rounded-[32px] border border-slate-100 italic">
                  Honesty, cleanliness of person and dress, good manners and loyalty are expected of each student and anyone not conforming to the School's ideals in these matters may be asked to leave. Immorality, grave insubordination, contempt of authority or wilful damage to property are always reasons for dismissal.
                </div>
              </div>
            </div>

            {/* Action Section */}
            <div className="pt-12 border-t border-slate-100 flex flex-col items-center gap-8">
              <a 
                href={prospectusLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-10 py-5 bg-school-navy text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-school-gold hover:scale-105 transition-all shadow-xl group"
              >
                <Download size={18} className="group-hover:translate-y-1 transition-transform" />
                View Prospectus
              </a>
              <p className="text-xs text-school-navy/40 font-black uppercase tracking-widest text-center">Digital Admission Portal 2026-27</p>
            </div>
          </motion.div>
        </section>
      </div>
    </Layout>
  );
};

export default AdmissionPolicyPage;
