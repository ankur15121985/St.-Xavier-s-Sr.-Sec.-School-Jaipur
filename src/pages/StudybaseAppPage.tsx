import React from 'react';
import { motion } from 'motion/react';
import Layout from '../components/layout/Layout';
import { AppData } from '../types';
import { Smartphone, Download, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

const StudybaseAppPage = ({ data }: { data: AppData }) => {
  const activationSteps = [
    "Download the App using the link given above",
    "Open the App",
    "Click on \"Reset Password/Activate\" option",
    "Enter your mobile number (This is the number registered for the student in school)",
    "Click on \"Next\"",
    "You will now receive a Studybase OTP code as text message",
    "Enter the code and set your unique password for the App",
    "Access the App"
  ];

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
              <h1 className="text-5xl md:text-7xl font-serif font-black text-white tracking-tighter mb-6 italic">Studybase <br /> <span className="text-school-gold not-italic uppercase text-3xl md:text-4xl tracking-[0.3em]">Mobile Application</span></h1>
              <p className="text-white/50 text-xl font-light max-w-2xl mx-auto italic italic">Your school updates, notifications, and progress - all in one place.</p>
            </motion.div>
          </div>
        </section>

        {/* Introduction Section */}
        <section className="py-24 max-w-5xl mx-auto px-6 lg:px-12 relative z-10 -mt-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-surface bg-white p-12 md:p-20 rounded-[64px] border border-white shadow-2xl"
          >
            <div className="flex flex-col lg:flex-row gap-16 items-center">
              <div className="lg:w-1/2 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-school-gold/10 rounded-2xl flex items-center justify-center text-school-gold">
                    <Smartphone size={24} />
                  </div>
                  <h2 className="text-3xl font-serif font-black text-school-navy tracking-tight uppercase italic">Stay Connected</h2>
                </div>
                <div className="space-y-6 text-xl text-school-navy/80 font-light leading-relaxed">
                  <p>
                    We are happy to introduce <span className="font-bold text-school-navy uppercase">STUDYBASE MOBILE APPLICATION</span> to track your progress, school notifications, tuition fee and so much more.
                  </p>
                  <p>
                    All school updates available at just a click! School has implemented Studybase for your benefits. Please download the app for <span className="text-school-gold font-bold uppercase">FREE</span> from the links given below.
                  </p>
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-start gap-4">
                    <ShieldCheck className="text-school-navy shrink-0 mt-1" size={20} />
                    <p className="text-sm font-medium text-school-navy italic">
                      This is mandatory for all students to ensure timely communication and access to academic resources.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-8">
                   <a href="#" className="flex items-center gap-3 px-8 py-4 bg-black text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl">
                     <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-8" referrerPolicy="no-referrer" />
                   </a>
                   <a href="#" className="flex items-center gap-3 px-8 py-4 bg-black text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl">
                     <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className="h-8" referrerPolicy="no-referrer" />
                   </a>
                </div>
              </div>

              <div className="lg:w-1/2 relative group">
                <div className="absolute -inset-4 bg-school-gold/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full"></div>
                <div className="relative glass-surface bg-slate-900 rounded-[48px] p-4 shadow-2xl border border-white/20">
                    <img 
                      src="https://picsum.photos/seed/mobile_app/600/1200" 
                      alt="Studybase App Preview" 
                      className="rounded-[36px] w-full shadow-inner"
                      referrerPolicy="no-referrer"
                    />
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Activation Steps */}
        <section className="py-24 max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-20">
             <h2 className="text-4xl md:text-5xl font-serif font-black text-school-navy italic tracking-tight mb-4 uppercase">Steps to activate the Studybase App</h2>
             <div className="w-24 h-1 bg-school-gold mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {activationSteps.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative group p-10 bg-white border border-slate-100 rounded-[40px] hover:shadow-2xl transition-all"
              >
                <div className="absolute -top-6 -left-6 w-14 h-14 bg-school-navy text-school-gold rounded-2xl flex items-center justify-center font-black text-xl shadow-xl group-hover:scale-110 transition-transform">
                  {idx + 1}
                </div>
                <div className="mt-4 space-y-4">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-school-gold">
                    <Zap size={20} />
                  </div>
                  <p className="text-school-navy font-bold text-sm tracking-tight leading-relaxed">
                    {step}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Help Section */}
        <section className="py-32 bg-school-navy text-white relative overflow-hidden">
           <div className="absolute inset-0 opacity-5">
              <div className="grid grid-cols-10 gap-1 w-full h-full">
                {Array.from({ length: 100 }).map((_, i) => (
                  <div key={i} className="aspect-square border border-white"></div>
                ))}
              </div>
           </div>
           
           <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="space-y-12"
              >
                <div className="w-24 h-24 bg-school-gold/20 rounded-full flex items-center justify-center mx-auto text-school-gold">
                  <CheckCircle2 size={48} />
                </div>
                <h2 className="text-4xl md:text-6xl font-serif font-black italic">Need assistance with the app?</h2>
                <p className="text-white/60 text-xl font-light italic">Visit the school IT office or contact your class coordinator for help with activation and technical support.</p>
                <button className="px-12 py-5 bg-school-gold text-school-navy rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-school-navy transition-all shadow-2xl">
                  Contact Support
                </button>
              </motion.div>
           </div>
        </section>
      </div>
    </Layout>
  );
};

export default StudybaseAppPage;
