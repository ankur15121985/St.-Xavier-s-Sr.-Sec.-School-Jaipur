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

    // Normalize user input for robust matching
    const searchAdm = admissionNumber.trim().toLowerCase();
    const searchDob = dob.trim(); // Expecting YYYY-MM-DD from input[type="date"]
    
    console.log(`[TC Search] Initiating search for Adm: ${searchAdm}, DOB: ${searchDob}`);

    // 1. Try local search first
    const tcs = data.transfer_certificates || [];
    console.log(`[TC Search] Checking ${tcs.length} local records...`);
    
    let found = tcs.find(tc => {
      const tcAdm = String(tc.admission_number || '').trim().toLowerCase();
      const tcDobRaw = String(tc.dob || '').trim().split('T')[0];
      
      // Basic match
      if (tcAdm === searchAdm && tcDobRaw === searchDob) return true;
      
      // Flexible date matching
      if (tcAdm === searchAdm) {
        let normalizedTcDob = tcDobRaw;
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

    // 2. Fallback: If not found locally, try direct fetch from Supabase
    if (!found) {
      console.log('[TC Search] Not found in local cache. Trying direct database query...');
      try {
        const { supabase } = await import('../supabaseClient');
        const { data: remoteData, error: remoteError } = await supabase
          .from('transfer_certificates')
          .select('*')
          .ilike('admission_number', searchAdm);
        
        if (!remoteError && remoteData && remoteData.length > 0) {
          console.log(`[TC Search] Found ${remoteData.length} potential remote matches.`);
          const match = remoteData.find(item => {
            const tcDobRaw = String(item.dob || item.date_of_birth || '').trim().split('T')[0];
            let normalizedTcDob = tcDobRaw;
            const separator = tcDobRaw.includes('/') ? '/' : (tcDobRaw.includes('-') && tcDobRaw.split('-')[0].length < 4 ? '-' : null);
            if (separator) {
              const parts = tcDobRaw.split(separator);
              if (parts.length === 3) {
                if (parts[2].length === 4) normalizedTcDob = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
                else if (parts[0].length === 4) normalizedTcDob = `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
              }
            }
            return normalizedTcDob === searchDob;
          });
          
          if (match) {
             found = {
               id: match.id,
               student_name: match.student_name || match.name || 'Student',
               admission_number: match.admission_number,
               dob: match.dob,
               attachmentUrl: match.attachmentUrl || match.url || ''
             };
          }
        }
      } catch (err) {
        console.warn('[TC Search] Direct fallback failed:', err);
      }
    }

    if (found) {
      setSearchResult(found);
    } else {
      setError('No record found in the institutional registry. Please verify your Admission Number and Date of Birth.');
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
              className="mt-6 text-school-navy/60 font-serif italic text-lg max-w-xl mx-auto"
            >
              Access and download official transfer certificates from our digital registry.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Search Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-[32px] p-8 md:p-12 shadow-2xl shadow-school-navy/10 border border-school-ink/5"
            >
              <form onSubmit={handleSearch} className="space-y-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-school-navy/40 ml-2">
                      <Hash size={12} />
                      Admission Number
                    </label>
                    <input 
                      type="text"
                      placeholder=""
                      value={admissionNumber}
                      onChange={(e) => setAdmissionNumber(e.target.value)}
                      className="w-full bg-school-ink/5 border-none rounded-2xl p-5 text-school-navy font-bold focus:ring-2 focus:ring-school-gold transition-all outline-none placeholder:text-school-navy/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-school-navy/40 ml-2">
                      <Calendar size={12} />
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
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="relative min-h-[400px]"
            >
              <AnimatePresence mode="wait">
                {searchResult ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-school-navy rounded-[32px] p-8 md:p-12 text-white relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-school-gold/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                    
                    <div className="relative z-10 space-y-8">
                      <div className="flex items-center gap-4 mb-12">
                        <div className="w-16 h-16 bg-school-gold rounded-2xl flex items-center justify-center">
                          <FileText size={32} className="text-school-navy" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-school-gold">Certificate Found</p>
                          <h3 className="text-2xl font-serif italic font-black uppercase tracking-tight">{searchResult.student_name}</h3>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-8 py-8 border-y border-white/10">
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-2">Admission No.</p>
                          <p className="font-bold text-lg">{searchResult.admission_number}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-2">Status</p>
                          <p className="font-bold text-lg text-green-400">Verified</p>
                        </div>
                      </div>

                      <div className="pt-4">
                        {searchResult.attachmentUrl ? (
                          <a 
                            href={searchResult.attachmentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-3 w-full py-5 bg-school-gold text-school-navy rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:brightness-110 transition-all shadow-2xl"
                          >
                            <Download size={18} />
                            Download Document
                          </a>
                        ) : (
                          <div className="p-4 bg-white/5 rounded-2xl text-center">
                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Digital Copy Pending Upload</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col items-center justify-center text-center p-12 border-4 border-dashed border-school-navy/5 rounded-[40px]"
                  >
                    <div className="w-24 h-24 bg-school-ink/5 rounded-full flex items-center justify-center mb-8">
                      <Search size={40} className="text-school-navy/20" />
                    </div>
                    <h3 className="text-xl font-serif italic text-school-navy/40 font-bold">Awaiting Credentials</h3>
                    <p className="text-sm text-school-navy/30 mt-4 leading-relaxed">
                      Enter the student's admission number and date of birth exactly as recorded in the school registry.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TransferCertificatePage;
