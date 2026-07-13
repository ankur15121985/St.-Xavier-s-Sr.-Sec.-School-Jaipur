import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, FileText, Download, AlertCircle, Loader2, Calendar, Hash } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { AppData, TransferCertificate } from '../types';

const TransferCertificatePage = ({ data }: { data: AppData }) => {
  const [admissionNumber, setAdmissionNumber] = useState('');
  const [dob, setDob] = useState('');
  const [searchResult, setSearchResult] = useState<TransferCertificate | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!admissionNumber || !dob) {
      setError('Please provide both Admission Number and Date of Birth.');
      return;
    }

    setLoading(true);
    setError(null);
    setSearchResult(null);

    // Simulate network delay for UX
    await new Promise(resolve => setTimeout(resolve, 800));

    const tcs = data.transfer_certificates || [];
    
    // Normalize user input for robust matching
    const searchAdm = admissionNumber.trim().toLowerCase();
    const searchDob = dob.trim(); // Expecting YYYY-MM-DD from input[type="date"]

    const found = tcs.find(tc => {
      const tcAdm = String(tc.admission_number || '').trim().toLowerCase();
      // Only take the date part from DB (YYYY-MM-DD or DD/MM/YYYY)
      const tcDobRaw = String(tc.dob || '').trim().split('T')[0];
      
      // Normalize user input
      const searchAdm = admissionNumber.trim().toLowerCase();
      const searchDob = dob.trim(); // YYYY-MM-DD from input[type="date"]

      // Basic match
      if (tcAdm === searchAdm && tcDobRaw === searchDob) return true;
      
      // Flexible date matching
      if (tcAdm === searchAdm) {
        // Try to normalize tcDobRaw to YYYY-MM-DD
        let normalizedTcDob = tcDobRaw;
        
        // Handle DD/MM/YYYY or DD-MM-YYYY
        const separator = tcDobRaw.includes('/') ? '/' : (tcDobRaw.includes('-') && tcDobRaw.split('-')[0].length < 4 ? '-' : null);
        if (separator) {
          const parts = tcDobRaw.split(separator);
          if (parts.length === 3) {
            if (parts[2].length === 4) { // DD/MM/YYYY
              normalizedTcDob = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
            } else if (parts[0].length === 4) { // YYYY/MM/DD
              normalizedTcDob = `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
            }
          }
        }
        
        if (normalizedTcDob === searchDob) return true;
      }
      
      return false;
    });

    if (found) {
      setSearchResult(found);
    } else {
      setError('No record found in the institutional registry.');
    }
    setLoading(false);
  };

  return (
    <Layout data={data}>
      <div className="pt-40 pb-32 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 px-6 py-2 bg-school-gold/10 text-school-gold rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-8"
            >
              <FileText size={14} />
              Digital Records
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-7xl font-serif font-black text-school-navy italic tracking-tight"
            >
              Transfer <span className="text-school-gold">Certificate</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-school-ink/50 font-medium text-lg max-w-2xl mx-auto italic"
            >
              Verify and download your official institutional exit documentation through our synchronized registry.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Search Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-[40px] p-10 shadow-2xl border border-school-ink/5 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-school-gold/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              
              <form onSubmit={handleSearch} className="relative z-10 space-y-8">
                <div className="space-y-6">
                  <div>
                    <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-school-navy mb-3 ml-4">
                      <Hash size={12} className="text-school-gold" />
                      Admission Number
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. 2024/001"
                      value={admissionNumber}
                      onChange={(e) => setAdmissionNumber(e.target.value)}
                      className="w-full bg-school-ink/5 border-none rounded-2xl p-5 text-school-navy font-bold placeholder:text-school-ink/20 focus:ring-2 focus:ring-school-gold transition-all outline-none"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-school-navy mb-3 ml-4">
                      <Calendar size={12} className="text-school-gold" />
                      Date of Birth
                    </label>
                    <input 
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full bg-school-ink/5 border-none rounded-2xl p-5 text-school-navy font-bold focus:ring-2 focus:ring-school-gold transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="px-6 py-3 bg-school-gold/10 rounded-2xl border border-school-gold/20">
                  <p className="text-[9px] font-black uppercase tracking-widest text-school-navy/60 text-center">
                    Test Record: <span className="text-school-gold">TC01</span> & <span className="text-school-gold">2026-04-27</span>
                  </p>
                </div>

                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl text-[10px] font-bold uppercase tracking-wider"
                    >
                      <AlertCircle size={16} />
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 bg-school-navy text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-school-gold hover:text-school-navy transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                  Search Records
                </button>
              </form>
            </motion.div>

            {/* Result Display */}
            <div className="space-y-8">
              <AnimatePresence mode="wait">
                {searchResult ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-school-navy text-white rounded-[40px] p-10 shadow-2xl relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-full h-full bg-school-gold/10 opacity-50 pointer-events-none"></div>
                    <div className="relative z-10">
                      <div className="w-16 h-16 bg-school-gold rounded-2xl flex items-center justify-center mb-8 shadow-xl">
                        <CheckIcon size={32} className="text-school-navy" />
                      </div>
                      
                      <h3 className="text-2xl font-serif font-black italic mb-2">Record Located</h3>
                      <p className="text-school-gold/60 text-sm font-medium mb-8">Official TC was found in our synchronized registry.</p>
                      
                      <div className="space-y-4 mb-10">
                        <div className="flex justify-between border-b border-white/10 pb-3">
                          <span className="text-[10px] uppercase tracking-widest text-white/40">Student Name</span>
                          <span className="text-sm font-bold">{searchResult.student_name}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-3">
                          <span className="text-[10px] uppercase tracking-widest text-white/40">Admission No.</span>
                          <span className="text-sm font-bold">{searchResult.admission_number}</span>
                        </div>
                      </div>

                      {!data.settings?.hideAttachedImages ? (
                        <a 
                          href={searchResult.attachmentUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-full py-5 bg-school-gold text-school-navy rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl"
                        >
                          <Download size={18} />
                          Download Certificate
                        </a>
                      ) : (
                        <div className="p-6 bg-white/5 rounded-2xl border border-white/10 text-center">
                           <p className="text-[10px] font-black uppercase tracking-widest text-school-gold opacity-60">Digital Copy Restricted</p>
                           <p className="text-[9px] text-white/40 mt-1">Please visit the school office to collect your physical certificate.</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full border-2 border-dashed border-school-ink/10 rounded-[40px] flex flex-col items-center justify-center p-12 text-center"
                  >
                    <div className="w-20 h-20 bg-school-ink/5 rounded-full flex items-center justify-center mb-6">
                      <Search size={32} className="text-school-ink/20" />
                    </div>
                    <h3 className="text-xl font-serif font-black text-school-navy/30 italic">Registry Status</h3>
                    <p className="text-school-ink/25 text-sm font-medium mt-2">Enter your credentials to initiate a secure database inquiry.</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Informational Footer */}
              <div className="p-8 bg-blue-50 rounded-3xl border border-blue-100">
                <div className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                    <AlertCircle size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-blue-900 mb-1">Administrative Note</h4>
                    <p className="text-blue-900/60 text-[11px] leading-relaxed font-medium">
                      Certificates are typically synchronized within 48 hours of institutional exit. If your record is not yet visible, please contact the Registrar's Office.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const CheckIcon = ({ size, className }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default TransferCertificatePage;
