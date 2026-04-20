import React from 'react';
import { AppData } from '../types';
import Layout from '../components/layout/Layout';
import { motion } from 'motion/react';
import { CreditCard, CheckCircle2 } from 'lucide-react';

const FeesPage = ({ data }: { data: AppData }) => {
  return (
    <Layout>
      <section className="pt-48 pb-40 bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center mb-24">
           <h2 className="text-7xl font-serif font-black text-school-navy mb-8">Fee <span className="text-school-gold italic">Structure.</span></h2>
           <p className="text-xl text-school-navy/50 font-light max-w-2xl mx-auto">Transparent financial outlines for the academic year 2026-27.</p>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="overflow-x-auto rounded-[40px] shadow-2xl border border-slate-100">
            <table className="w-full text-left border-collapse bg-white">
              <thead>
                <tr className="bg-school-navy text-white text-[10px] font-black uppercase tracking-[0.3em]">
                  <th className="p-10 border-b border-white/10">Grade</th>
                  <th className="p-10 border-b border-white/10">Admission Fee</th>
                  <th className="p-10 border-b border-white/10">Tuition (Monthly)</th>
                  <th className="p-10 border-b border-white/10">Quarterly Total</th>
                </tr>
              </thead>
              <tbody className="text-school-navy">
                {data.fees.map((f, i) => (
                  <motion.tr 
                    key={f.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-none"
                  >
                    <td className="p-10 font-black tracking-tight text-xl">{f.grade}</td>
                    <td className="p-10 text-school-navy/60 font-medium">{f.admissionFee}</td>
                    <td className="p-10 text-school-navy/60 font-medium">{f.tuition_fees}</td>
                    <td className="p-10">
                      <span className="px-6 py-2 bg-school-gold/10 text-school-gold rounded-full font-black text-lg">{f.quarterly}</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-20 p-12 glass-surface rounded-[40px] border border-school-navy/5 flex flex-col md:flex-row items-center gap-12">
            <div className="w-24 h-24 rounded-3xl bg-school-gold text-school-navy flex items-center justify-center shrink-0 shadow-xl">
              <CreditCard size={40} />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h4 className="text-3xl font-serif font-black text-school-navy mb-4">Digital Fee Portal</h4>
              <p className="text-school-navy/50 text-base leading-relaxed max-w-2xl">Pay fees securely through our online digital registration system. We support major credit cards, UPI, and net banking for your convenience.</p>
            </div>
            <button className="px-12 py-5 bg-school-navy text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-school-accent transition-all shadow-xl">
              Proceed to Payment
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default FeesPage;
