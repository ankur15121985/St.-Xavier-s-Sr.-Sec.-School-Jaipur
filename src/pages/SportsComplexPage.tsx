import React from 'react';
import { motion } from 'motion/react';
import Layout from '../components/layout/Layout';
import { AppData } from '../types';
import { Trophy, Waves, ShieldCheck, CreditCard, AlertCircle, Sparkles, HeartPulse, HardHat, Clock } from 'lucide-react';

const SportsComplexPage = ({ data }: { data: AppData }) => {
  const complexRules = [
    { icon: <CreditCard size={20} />, text: "Every applicant will be given an identity card. Must be brought daily for entry. Duplicate card required if lost/damaged." },
    { icon: <ShieldCheck size={20} />, text: "Proper DISCIPLINE kit must be worn by all members." },
    { icon: <HeartPulse size={20} />, text: "Heart patients and patients suffering from any infectious disease are strictly prohibited." },
    { icon: <AlertCircle size={20} />, text: "Fees once deposited are non-refundable under any circumstances." },
    { icon: <Sparkles size={20} />, text: "Valuables should not be brought to the complex; administration is not responsible for any loss." },
    { icon: <Clock size={20} />, text: "Activities only during allotted time slots. Shift timings and rules are subject to change." }
  ];

  const poolRules = [
    { icon: <CreditCard size={20} />, text: "Identity card mandatory for entry. Duplicate card cost: Rs. 50/-" },
    { icon: <HardHat size={20} />, text: "Proper swim costumes and caps are mandatory." },
    { icon: <AlertCircle size={20} />, text: "No bracelets or jewelry while swimming to prevent harm to others." },
    { icon: <HeartPulse size={20} />, text: "Prohibited for heart patients and those with infectious diseases." },
    { icon: <ShieldCheck size={20} />, text: "Indiscipline of any form will result in immediate consequences." }
  ];

  return (
    <Layout data={data}>
      <div className="pt-32 bg-slate-50 min-h-screen">
        {/* Hero Section */}
        <section className="py-20 bg-school-navy relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
          </div>
          <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-5xl md:text-7xl font-serif font-black text-white tracking-tighter mb-6 italic">Fr. Batson <br /> <span className="text-school-gold not-italic uppercase text-3xl md:text-4xl tracking-[0.3em]">Sports Complex</span></h1>
              <p className="text-white/50 text-xl font-light max-w-2xl mx-auto italic italic">Excellence in athletics, discipline in spirit, and health in body.</p>
            </motion.div>
          </div>
        </section>

        {/* Complex Overview & Rules */}
        <section className="py-24 max-w-7xl mx-auto px-6 lg:px-12 relative z-10 -mt-12">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* General Rules */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="glass-surface bg-white p-12 md:p-16 rounded-[64px] border border-white shadow-2xl space-y-12"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-school-gold/10 rounded-3xl flex items-center justify-center text-school-gold shadow-lg">
                  <Trophy size={32} />
                </div>
                <div>
                  <h2 className="text-3xl font-serif font-black text-school-navy italic uppercase tracking-tight">Complex Regulations</h2>
                  <p className="text-[10px] uppercase font-black tracking-widest text-school-navy/30">Standard Operating Procedures</p>
                </div>
              </div>

              <div className="grid gap-6">
                {complexRules.map((rule, idx) => (
                  <div key={idx} className="flex gap-4 group">
                    <div className="mt-1 text-school-navy/40 group-hover:text-school-gold transition-colors">{rule.icon}</div>
                    <p className="text-sm text-school-navy/70 leading-relaxed font-light">{rule.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Swimming Pool Section */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-school-navy rounded-[64px] p-12 md:p-16 text-white shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-school-gold/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
              
              <div className="relative z-10 space-y-12">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center text-school-gold backdrop-blur-md border border-white/5 shadow-xl">
                    <Waves size={32} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-serif font-black italic uppercase tracking-tight text-white">Swimming Pool</h2>
                    <p className="text-[10px] uppercase font-black tracking-widest text-school-gold/50">Safety & Conduct Protocols</p>
                  </div>
                </div>

                <div className="grid gap-8">
                  {poolRules.map((rule, idx) => (
                    <div key={idx} className="flex gap-4 group">
                      <div className="mt-1 text-school-gold/40 group-hover:text-school-gold transition-colors">{rule.icon}</div>
                      <p className="text-sm text-white/70 leading-relaxed font-light">{rule.text}</p>
                    </div>
                  ))}
                  
                  <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-3xl mt-4">
                    <div className="flex gap-4 items-center mb-2">
                       <AlertCircle className="text-red-400" size={18} />
                       <p className="text-xs font-black uppercase tracking-widest text-red-400">Emergency Protocol</p>
                    </div>
                    <p className="text-sm text-red-200/80 font-light italic leading-relaxed">
                      "In case of accident, call for help immediately. Safety is our collective responsibility."
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Behavioral Standards */}
        <section className="py-24 max-w-4xl mx-auto px-6 text-center">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="space-y-8"
           >
             <div className="w-20 h-20 bg-school-navy rounded-full flex items-center justify-center text-school-gold mx-auto shadow-2xl">
                <ShieldCheck size={40} />
             </div>
             <blockquote className="text-2xl md:text-3xl font-serif font-black text-school-navy italic leading-tight">
               "All are expected to behave in a responsible manner. Indiscipline of any form will not be tolerated."
             </blockquote>
             <div className="w-24 h-1 bg-school-gold mx-auto"></div>
             <p className="text-xs font-black uppercase tracking-[0.4em] text-school-navy/30">Sports Complex Administration</p>
           </motion.div>
        </section>

        {/* Image Grid Placeholder */}
        <section className="py-24 bg-white border-t border-slate-100">
           <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="aspect-square bg-slate-100 rounded-[32px] overflow-hidden group">
                 <img src="https://picsum.photos/seed/sports1/600/600" alt="Sports Action" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 hover:scale-110" referrerPolicy="no-referrer" />
              </div>
              <div className="aspect-square bg-slate-100 rounded-[32px] overflow-hidden group md:mt-12">
                 <img src="https://picsum.photos/seed/sports2/600/600" alt="Swimming Pool" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 hover:scale-110" referrerPolicy="no-referrer" />
              </div>
              <div className="aspect-square bg-slate-100 rounded-[32px] overflow-hidden group">
                 <img src="https://picsum.photos/seed/sports3/600/600" alt="Track" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 hover:scale-110" referrerPolicy="no-referrer" />
              </div>
              <div className="aspect-square bg-slate-100 rounded-[32px] overflow-hidden group md:mt-12">
                 <img src="https://picsum.photos/seed/sports4/600/600" alt="Indoor Courts" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 hover:scale-110" referrerPolicy="no-referrer" />
              </div>
           </div>
        </section>
      </div>
    </Layout>
  );
};

export default SportsComplexPage;
