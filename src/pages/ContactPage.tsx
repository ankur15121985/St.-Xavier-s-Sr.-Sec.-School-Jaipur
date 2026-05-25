import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MapPin, Send, MessageSquare, ChevronDown, CheckCircle2, Loader2, Calendar, Clock, ArrowRight, AlertTriangle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import Layout from '../components/layout/Layout';
import { AppData, ContactMessage } from '../types';
import { supabaseService } from '../lib/supabaseService';

const ContactPage = ({ data }: { data: AppData }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [activeFaq, setActiveFaq] = useState<string | null>(data.faqs?.[0]?.id || null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    try {
      const newMessage: ContactMessage = {
        id: crypto.randomUUID(),
        ...formData,
        timestamp: new Date().toISOString(),
        status: 'new'
      };
      
      // Save to Supabase
      await supabaseService.saveItem('messages', newMessage);
      
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      console.error('Contact form error:', err);
      setStatus('error');
    }
  };

  const mapQuery = data.content.schoolAddressQuery || "St. Xavier's Senior Secondary School, Bhagwan Das Rd, C Scheme, Jaipur, Rajasthan 302001";
  const encodedQuery = encodeURIComponent(mapQuery);

  return (
    <Layout data={data}>
      <Helmet>
        <title>Contact Us | St. Xavier's Sr. Sec. School, Jaipur</title>
        <meta name="description" content="Get in touch with St. Xavier's Senior Secondary School, Jaipur. Address, phone numbers, and official email for inquiries." />
      </Helmet>
      {/* Hero Section */}
      <section className="relative pt-40 pb-32 overflow-hidden bg-[#0c061e] text-white rounded-b-[80px] md:rounded-b-[120px]">
        {/* Immersive Dark Gradient Background with Aurora Lights */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Base gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0c061e] via-school-navy to-[#180a3a]" />
          
          {/* Purple Glow */}
          <motion.div 
            animate={{
              x: [-100, 100, -100],
              y: [-50, 50, -50],
              scale: [1, 1.25, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -top-1/3 -left-1/4 w-[75%] h-[75%] rounded-full bg-school-accent/50 blur-[120px] mix-blend-screen"
          />

          {/* Golden Glow */}
          <motion.div 
            animate={{
              x: [100, -100, 100],
              y: [50, -50, 50],
              scale: [1.2, 0.9, 1.2],
              opacity: [0.25, 0.45, 0.25],
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -bottom-1/3 -right-1/4 w-[85%] h-[85%] rounded-full bg-school-gold/40 blur-[140px] mix-blend-screen"
          />

          {/* Deep Navy/Blue Glow */}
          <motion.div 
            animate={{
              x: [-50, 50, -50],
              y: [100, -100, 100],
              scale: [0.85, 1.15, 0.85],
              opacity: [0.15, 0.3, 0.15],
            }}
            transition={{
              duration: 26,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-1/4 left-1/4 w-[60%] h-[60%] rounded-full bg-school-navy blur-[100px] mix-blend-screen"
          />

          {/* Subtle Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] opacity-40" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block px-8 py-3 bg-school-gold/10 rounded-full border border-school-gold/20 shadow-2xl"
          >
            <span className="text-xs font-black uppercase tracking-[0.4em] text-school-gold">Institutional Correspondence</span>
          </motion.div>
          
          <div className="space-y-6">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl lg:text-[10rem] xl:text-[12rem] font-black tracking-tighter leading-[0.9] italic pb-12 overflow-visible"
            >
              Get in <span className="text-school-gold border-t-4 border-b-4 border-school-gold/30 px-6 inline-block">Touch.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-3xl text-white/40 font-light max-w-3xl mx-auto leading-relaxed"
            >
              Establishing bridges between the institution and our global community. Dedicated support for parents, students, and alumni.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-6 pt-8"
          >
            <div className="flex items-center gap-3 px-6 py-3 bg-white/5 rounded-2xl border border-white/10">
              <Clock size={18} className="text-school-gold" />
              <span className="text-sm font-bold uppercase tracking-widest text-white/60">{data.content.officeHoursShort || 'Office Hrs: 8AM - 2PM'}</span>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 bg-white/5 rounded-2xl border border-white/10">
              <Calendar size={18} className="text-school-gold" />
              <span className="text-sm font-bold uppercase tracking-widest text-white/60">{data.content.officeDaysShort || 'Mon - Sat Service'}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-32 md:py-64 relative overflow-hidden">
        {/* Background Decorative Cross */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-school-ink/5 hidden md:block" />
        <div className="absolute top-1/2 left-0 -translate-y-1/2 h-px w-full bg-school-ink/5 hidden md:block" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-32 lg:gap-48 items-start">
            
            {/* Contact Form Wall */}
            <motion.div 
               initial={{ opacity: 0, x: -50 }}
               whileInView={{ opacity: 1, x: 0 }}
               className="space-y-24"
            >
              <div className="space-y-10">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-school-gold block">Submission Portal</span>
                <h2 className="text-5xl md:text-8xl font-black text-school-ink tracking-tight leading-none">Drop a <br /><span className="italic">Message.</span></h2>
                <p className="text-xl text-school-ink/40 font-medium max-w-md">Our administrative team monitors this channel with institutional priority.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-12">
                <div className="grid md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-school-ink/40 ml-1">Identity (Full Name)</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g. John Doe"
                      className="w-full bg-white rounded-[32px] py-6 px-10 text-school-ink font-bold placeholder:text-school-ink/10 focus:ring-4 focus:ring-school-gold/10 transition-all outline-none border border-school-ink/5 shadow-xl shadow-school-ink/5"
                    />
                  </div>
                  <div className="space-y-6">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-school-ink/40 ml-1">Electronic Mail</label>
                    <input 
                      required
                      type="email" 
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      placeholder="email@example.com"
                      className="w-full bg-white rounded-[32px] py-6 px-10 text-school-ink font-bold placeholder:text-school-ink/10 focus:ring-4 focus:ring-school-gold/10 transition-all outline-none border border-school-ink/5 shadow-xl shadow-school-ink/5"
                    />
                  </div>
                </div>
                <div className="space-y-6">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-school-ink/40 ml-1">Inquiry Subject</label>
                  <input 
                    type="text" 
                    value={formData.subject}
                    onChange={e => setFormData({...formData, subject: e.target.value})}
                    placeholder="Briefly describe your inquiry"
                    className="w-full bg-white rounded-[32px] py-6 px-10 text-school-ink font-bold placeholder:text-school-ink/10 focus:ring-4 focus:ring-school-gold/10 transition-all outline-none border border-school-ink/5 shadow-xl shadow-school-ink/5"
                  />
                </div>
                <div className="space-y-6">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-school-ink/40 ml-1">Institutional Discourse (Message)</label>
                  <textarea 
                    required
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    placeholder="How can we help you today?"
                    className="w-full bg-white rounded-[40px] py-8 px-10 text-school-ink font-bold placeholder:text-school-ink/10 focus:ring-4 focus:ring-school-gold/10 transition-all outline-none h-64 resize-none border border-school-ink/5 shadow-xl shadow-school-ink/5"
                  />
                </div>

                <AnimatePresence>
                  {status === 'success' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      className="bg-emerald-50 text-emerald-600 p-8 rounded-[32px] flex items-center gap-6 text-sm font-bold border border-emerald-100 shadow-2xl"
                    >
                      <CheckCircle2 size={32} /> 
                      <div>
                        <p className="text-lg">Transmission Confirmed.</p>
                        <p className="text-emerald-600/60 font-medium">Our regency will process your message shortly.</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="pt-8">
                  <button 
                    disabled={status === 'submitting'}
                    className="group relative inline-flex items-center gap-6 px-16 py-8 bg-school-navy text-white rounded-full font-black uppercase tracking-[0.3em] shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:bg-school-gold hover:text-school-navy transition-all active:scale-95 disabled:bg-slate-300 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/10 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                    <span className="relative z-10 flex items-center gap-4">
                      {status === 'submitting' ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <>Dispatch Message <Send size={20} /></>
                      )}
                    </span>
                  </button>
                </div>
              </form>
            </motion.div>

            {/* Info and Accordion Wall */}
            <div className="space-y-40">
               {/* Contact Info Pills */}
               <div className="grid gap-12">
                  <div className="mb-8">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-school-gold block mb-8">Registry Contact Details</span>
                    <div className="h-1 w-20 bg-school-gold/30 rounded-full" />
                  </div>
                  {[
                    { icon: <Phone />, label: 'Senior School', value: data.content.seniorSchoolPhone || '0141-2372336', sub: 'Main Office' },
                    { icon: <Phone />, label: 'Junior School', value: data.content.juniorSchoolPhone || '0141-2367792, 2376569', sub: 'Information Desk' },
                    { icon: <Mail />, label: 'Official Email', value: data.content.schoolEmail || 'xavier41jaipur@gmail.com', sub: 'Correspondence' },
                    { icon: <ArrowRight />, label: 'Official Website', value: data.content.schoolWebsite || 'www.xaviersjaipur.edu.in', sub: 'Online Portal' },
                    { icon: <MapPin />, label: 'Visit Campus', value: data.content.schoolAddress || 'Bhagwan Das Road', sub: 'Jaipur, Rajasthan' }
                  ].map((info, i) => (
                    <motion.div 
                      key={info.label}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ x: 15 }}
                      className="flex items-center gap-10 p-10 bg-white rounded-[50px] shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-school-ink/5 transition-all group cursor-default"
                    >
                      <div className="w-20 h-20 bg-school-gold/5 rounded-[30px] flex items-center justify-center text-school-gold group-hover:bg-school-gold group-hover:text-school-navy transition-all duration-500">
                        {info.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-school-ink/20 mb-2">{info.label}</p>
                        <p className="text-2xl md:text-3xl font-black text-school-ink tracking-tight mb-1">{info.value}</p>
                        <p className="text-sm font-bold text-school-ink/30 italic">{info.sub}</p>
                      </div>
                    </motion.div>
                  ))}
               </div>

               {/* FAQ Accordion */}
               <div className="space-y-12 pt-20 border-t border-school-ink/5">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-school-gold rounded-full flex items-center justify-center text-school-navy">
                        <MessageSquare size={20} />
                      </div>
                      <h3 className="text-3xl font-black text-school-navy uppercase tracking-tighter">Common Inquiries</h3>
                    </div>
                    <p className="text-sm text-school-ink/40 font-medium">Frequently asked procedural questions for institutional clarity.</p>
                  </div>
                  
                  <div className="space-y-10">
                    {data.faqs.map((faq) => (
                      <div 
                        key={faq.id} 
                        className={`rounded-[40px] overflow-hidden border transition-all duration-500 ${activeFaq === faq.id ? 'bg-school-navy text-white border-school-navy shadow-3xl' : 'bg-white border-school-ink/5 hover:border-school-gold/50'}`}
                      >
                        <button 
                          onClick={() => setActiveFaq(activeFaq === faq.id ? null : faq.id)}
                          className="w-full flex items-center justify-between p-10 text-left"
                        >
                          <span className="text-xl font-black leading-tight pr-6">{faq.question}</span>
                          <div className={`p-4 rounded-full transition-all duration-500 ${activeFaq === faq.id ? 'bg-school-gold text-school-navy' : 'bg-school-ink/5 text-school-ink/40'}`}>
                            <ChevronDown className={`transition-transform duration-500 ${activeFaq === faq.id ? 'rotate-180' : ''}`} />
                          </div>
                        </button>
                        <AnimatePresence>
                          {activeFaq === faq.id && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="px-10 pb-10 pt-0"
                            >
                              <div className={`h-1 w-16 rounded-full mb-8 ${activeFaq === faq.id ? 'bg-school-gold' : 'bg-school-ink/20'}`} />
                              <p className={`text-xl font-medium leading-relaxed opacity-60`}>
                                {faq.answer}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-school-paper relative overflow-hidden text-school-ink">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-4 space-y-8">
            <h2 className="text-5xl font-black tracking-tighter leading-none italic">
               Institutional <br /><span className="text-school-gold">Terrain.</span>
            </h2>
            <p className="text-lg opacity-60 font-medium leading-relaxed">
              Located in the heart of C-Scheme, our campus is easily accessible from any part of the Pink City.
            </p>
            <div className="flex flex-col gap-4">
               <div className="flex items-center gap-4 font-bold">
                 <Clock className="text-school-gold" size={20} />
                 <span>{data.content.officeHoursLong || 'Office: 8:00 AM - 2:00 PM'}</span>
               </div>
               <div className="flex items-center gap-4 font-bold">
                 <Calendar className="text-school-gold" size={20} />
                 <span>{data.content.officeDaysLong || 'Monday — Saturday'}</span>
               </div>
            </div>
            <a 
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodedQuery}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-4 font-bold group hover:text-school-gold transition-colors"
            >
              Get Directions <ArrowRight className="group-hover:translate-x-2 transition-transform" strokeWidth={3} />
            </a>
          </div>
          <div className="lg:col-span-8">
            <div className="aspect-video w-full rounded-[40px] overflow-hidden bg-white shadow-2xl relative border-8 border-school-ink/5 group">
               {/* Embed Map Logic */}
               <iframe 
                 title="School Location Map"
                 src={`https://maps.google.com/maps?q=${encodedQuery}&t=&z=14&ie=UTF8&iwloc=B&output=embed`} 
                 width="100%" 
                 height="100%" 
                 style={{ border: 0 }} 
                 allowFullScreen={true} 
                 loading="lazy"
                 className="grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
               />
               
               <div className="absolute bottom-6 right-6 flex gap-3">
                 <div className="px-4 py-2 bg-white/90 backdrop-blur shadow-lg rounded-full text-[10px] font-black uppercase tracking-widest border border-school-ink/5">
                   Interactive Campus Map
                 </div>
               </div>
            </div>
            <p className="mt-4 text-[10px] text-center uppercase tracking-widest font-bold opacity-30">
              Note: If map doesn't load, ensure your Google Maps API Key has correct HTTP Referrer restrictions.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactPage;
