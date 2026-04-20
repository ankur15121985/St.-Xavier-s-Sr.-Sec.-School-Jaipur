import React, { useState } from 'react';
import { AppData } from '../types';
import Layout from '../components/layout/Layout';
import { motion, AnimatePresence } from 'motion/react';
import { CreditCard, ChevronDown, ChevronUp, Info, ShieldCheck } from 'lucide-react';

const FeesPage = ({ data }: { data: AppData }) => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <Layout links={data.links}>
      <section className="pt-48 pb-40 bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center mb-24">
           <h2 className="text-7xl font-serif font-black text-school-navy mb-8">Fee <span className="text-school-gold italic">Structure.</span></h2>
           <p className="text-xl text-school-navy/50 font-light max-w-2xl mx-auto">Transparent financial outlines for the academic year 2026-27. Click on a row to see detailed breakdowns.</p>
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
                  <th className="p-10 border-b border-white/10 text-center w-24">Details</th>
                </tr>
              </thead>
              <tbody className="text-school-navy">
                {data.fees.map((f, i) => (
                  <React.Fragment key={f.id}>
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => toggleRow(f.id)}
                      className={`cursor-pointer group transition-all ${expandedRow === f.id ? 'bg-slate-50' : 'hover:bg-slate-50'} border-b border-slate-50 last:border-none`}
                    >
                      <td className="p-10">
                        <div className="flex flex-col">
                          <span className="font-black tracking-tight text-xl">{f.grade}</span>
                          {expandedRow === f.id && <span className="text-[9px] font-black uppercase text-school-gold mt-1 tracking-widest">Active Viewing</span>}
                        </div>
                      </td>
                      <td className="p-10 text-school-navy/60 font-medium">{f.admissionFee}</td>
                      <td className="p-10 text-school-navy/60 font-medium">{f.tuition_fees}</td>
                      <td className="p-10">
                        <span className="px-6 py-2 bg-school-gold/10 text-school-gold rounded-full font-black text-lg">{f.quarterly}</span>
                      </td>
                      <td className="p-10 text-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${expandedRow === f.id ? 'bg-school-navy text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-school-gold group-hover:text-school-navy'}`}>
                          {expandedRow === f.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                      </td>
                    </motion.tr>
                    <AnimatePresence>
                      {expandedRow === f.id && (
                        <tr>
                          <td colSpan={5} className="p-0 border-b border-slate-100">
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden bg-slate-50/50"
                            >
                              <div className="p-12 pl-24 grid md:grid-cols-3 gap-12">
                                <div className="space-y-6">
                                  <h5 className="text-[10px] font-black uppercase tracking-widest text-school-navy/40 flex items-center gap-2">
                                    <Info size={14} className="text-school-gold" />
                                    Academic Components
                                  </h5>
                                  <div className="space-y-4">
                                    <div className="flex justify-between items-center py-2 border-b border-slate-200/50">
                                      <span className="text-sm font-medium text-school-navy/60">Library Access</span>
                                      <span className="text-sm font-black text-school-navy tracking-tight">₹1,200 / yr</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-slate-200/50">
                                      <span className="text-sm font-medium text-school-navy/60">Lab Facilities</span>
                                      <span className="text-sm font-black text-school-navy tracking-tight">₹2,500 / yr</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-slate-200/50">
                                      <span className="text-sm font-medium text-school-navy/60">Digital Resources</span>
                                      <span className="text-sm font-black text-school-navy tracking-tight">Included</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-6">
                                  <h5 className="text-[10px] font-black uppercase tracking-widest text-school-navy/40 flex items-center gap-2">
                                    <ShieldCheck size={14} className="text-school-gold" />
                                    Extra-Curricular
                                  </h5>
                                  <div className="space-y-4">
                                    <div className="flex justify-between items-center py-2 border-b border-slate-200/50">
                                      <span className="text-sm font-medium text-school-navy/60">Sports & Fitness</span>
                                      <span className="text-sm font-black text-school-navy tracking-tight">₹1,800 / yr</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-slate-200/50">
                                      <span className="text-sm font-medium text-school-navy/60">Art & Culture</span>
                                      <span className="text-sm font-black text-school-navy tracking-tight">₹1,500 / yr</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-slate-200/50">
                                      <span className="text-sm font-medium text-school-navy/60">Smart Class Levy</span>
                                      <span className="text-sm font-black text-school-navy tracking-tight">₹1,000 / yr</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="bg-school-navy rounded-[32px] p-8 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden group">
                                  <div className="absolute top-0 right-0 w-32 h-32 bg-school-gold/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform"></div>
                                  <div className="relative z-10">
                                    <h5 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-6">Payment Frequency</h5>
                                    <p className="text-xs font-light text-white/70 leading-relaxed mb-6">Fees are payable in four quarterly installments. Concessions are available for full annual payment.</p>
                                    <div className="flex items-center gap-4">
                                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-school-gold">
                                        <CreditCard size={20} />
                                      </div>
                                      <span className="text-[10px] font-black uppercase tracking-widest">Quarterly Cycle</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-20 p-12 glass-surface rounded-[40px] flex flex-col md:flex-row items-center gap-12">
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
