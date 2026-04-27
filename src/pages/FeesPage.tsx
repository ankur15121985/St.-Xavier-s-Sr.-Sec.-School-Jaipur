import React, { useState } from 'react';
import { AppData } from '../types';
import Layout from '../components/layout/Layout';
import { motion, AnimatePresence } from 'motion/react';
import { CreditCard, ChevronDown, ChevronUp, Info, ShieldCheck, FileText, Maximize2, Download } from 'lucide-react';
import PdfViewer from '../components/PdfViewer';

const FeesPage = ({ data }: { data: AppData }) => {
  const [activePdf, setActivePdf] = useState<string | null>(null);

  const schoolFees = data.fees.filter(f => f.category === 'School Fee').sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
  const annualFees = data.fees.filter(f => f.category === 'Annual Fee').sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
  const admissionFees = data.fees.filter(f => f.category === 'Admission Fee').sort((a, b) => (a.order_index || 0) - (b.order_index || 0));

  const TableHeader = ({ title, columns, data: tableData }: { title: string, columns: string[], data: any[] }) => (
    <div className="mb-16">
      <div className="flex items-center gap-6 mb-8 group cursor-default">
        <div className="h-[2px] bg-school-gold/30 flex-1 group-hover:bg-school-gold transition-colors"></div>
        <h3 className="text-3xl font-serif font-black text-school-navy italic tracking-tight">{title}</h3>
        <div className="h-[2px] bg-school-gold/30 flex-1 group-hover:bg-school-gold transition-colors"></div>
      </div>
      
      {tableData.length === 0 ? (
        <div className="p-12 text-center bg-white/50 rounded-[32px] border border-dashed border-school-gold/20">
          <p className="text-[10px] font-black uppercase tracking-widest text-school-gold/40">No records found in this category</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[32px] border border-school-ink/10 shadow-2xl bg-white group hover:border-school-gold/50 transition-all">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-school-navy text-white text-[10px] font-black uppercase tracking-[0.25em]">
                {columns.map((col, idx) => (
                  <th key={idx} className="p-8 border-b border-white/5 first:pl-10 last:pr-10">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody className="text-school-ink">
              {tableData.map((f, i) => (
                <tr key={f.id} className="border-b border-school-ink/5 hover:bg-school-gold/[0.03] transition-all last:border-none group/row">
                  <td className="p-8 first:pl-10">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base text-school-navy group-hover/row:text-school-gold transition-colors">{f.particulars}</span>
                        {f.attachmentUrl && (
                          <a 
                            href={f.attachmentUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center p-2 bg-school-gold/10 text-school-gold rounded-lg hover:bg-school-gold hover:text-school-navy transition-all shadow-sm"
                            title="Download Fee Structure"
                          >
                            <Download size={14} />
                          </a>
                        )}
                      </div>
                      {f.remarks && <span className="text-[9px] font-black uppercase tracking-widest text-school-ink/30 mt-1">{f.remarks}</span>}
                    </div>
                  </td>
                  <td className="p-8">
                    <span className="font-mono text-base font-medium opacity-60">₹{f.amount}</span>
                  </td>
                  <td className="p-8 last:pr-10">
                    {title !== 'Admission Fees' ? (
                      <span className="font-black text-lg text-school-gold tracking-tighter">₹{f.quarterly}</span>
                    ) : (
                      <span className="text-[10px] font-black uppercase tracking-widest text-school-ink/40">One-time</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <Layout data={data}>
      <section className="pt-12 pb-40 bg-school-paper min-h-screen">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center mb-24">
           <div className="inline-flex items-center gap-3 px-6 py-2 bg-school-gold/10 text-school-gold rounded-full text-[10px] font-black uppercase tracking-widest mb-8">
             Session 2025-26
           </div>
           <h2 className="text-7xl font-serif font-black text-school-ink mb-8">Financial <span className="text-school-gold italic">Blueprints.</span></h2>
           <p className="text-xl text-school-ink/40 font-light max-w-2xl mx-auto">Managing Committee Approved Fee Structure for the current academic session.</p>
        </div>

        <div className="max-w-5xl mx-auto px-6">
          <TableHeader 
            title="Managing Committee Approved School Fee Structure" 
            columns={['Particulars', 'Total School Fee', 'Quarterly School Fee']} 
            data={schoolFees}
          />
          
          <TableHeader 
            title="Annual Fees (Charged in 4 Quarters)" 
            columns={['Particulars', 'Total Annual Fee', 'Quarterly Annual Fee']} 
            data={annualFees}
          />
          
          <TableHeader 
            title="At the time of Admission (Only once from new students)" 
            columns={['Particulars', 'Amount', 'Remarks']} 
            data={admissionFees}
          />

          {/* Integrated PDF Viewer Section */}
          {(data.settings.feesPdfUrl || data.fees.find(f => f.attachmentUrl)?.attachmentUrl || data.settings.applyNowUrl) && (
            <div className="mt-24 mb-16">
              <div className="flex items-center gap-6 mb-12 group cursor-default">
                <div className="h-[2px] bg-school-gold/30 flex-1 group-hover:bg-school-gold transition-colors"></div>
                <h3 className="text-3xl font-serif font-black text-school-navy italic tracking-tight">Official Fee Documentation</h3>
                <div className="h-[2px] bg-school-gold/30 flex-1 group-hover:bg-school-gold transition-colors"></div>
              </div>
              
              <div className="aspect-[16/10] w-full bg-school-navy rounded-[40px] overflow-hidden shadow-2xl border border-school-ink/10 relative group">
                <iframe 
                   src={`${data.settings.feesPdfUrl || data.fees.find(f => f.attachmentUrl)?.attachmentUrl || data.settings.applyNowUrl}#toolbar=0`} 
                  className="w-full h-full border-none bg-white"
                  title="Integrated Fee PDF"
                />
                <button 
                  onClick={() => setActivePdf(data.settings.feesPdfUrl || data.fees.find(f => f.attachmentUrl)?.attachmentUrl || data.settings.applyNowUrl)}
                  className="absolute top-6 right-6 p-4 bg-school-gold text-school-navy rounded-2xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95"
                >
                  <Maximize2 size={24} />
                </button>
              </div>
              <div className="mt-6 flex justify-between items-center px-4">
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-school-ink/30 italic">Synchronized with Institutional Registry</p>
                 <a 
                   href={data.settings.feesPdfUrl || data.fees.find(f => f.attachmentUrl)?.attachmentUrl || data.settings.applyNowUrl} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="text-[10px] font-black uppercase tracking-widest text-school-gold hover:text-school-navy transition-colors flex items-center gap-2"
                 >
                   <FileText size={14} />
                   Open in New Tab
                 </a>
              </div>
            </div>
          )}

          <div className="mt-20 p-12 glass-surface rounded-[40px] flex flex-col md:flex-row items-center gap-12 border border-school-ink/5 bg-white/50 backdrop-blur-xl">
            <div className="w-20 h-20 rounded-3xl bg-school-gold text-school-navy flex items-center justify-center shrink-0 shadow-xl">
              <CreditCard size={32} />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h4 className="text-2xl font-serif font-black text-school-ink mb-3 group-hover:text-school-gold transition-colors">Digital Fee Portal</h4>
              <p className="text-school-ink/50 text-sm leading-relaxed max-w-2xl">Securely manage payments through our synchronized digital infrastructure. We support all major transaction protocols.</p>
            </div>
            <div className="flex gap-4">
              <button className="px-10 py-5 bg-school-navy text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl active:scale-95">
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>

        <PdfViewer 
          url={activePdf || ''} 
          isOpen={!!activePdf} 
          onClose={() => setActivePdf(null)}
          title="Official Fee Structure Document"
        />
      </section>
    </Layout>
  );
};

export default FeesPage;
