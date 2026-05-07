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

  const mapQuery = "St. Xavier's Senior Secondary School, Bhagwan Das Rd, C Scheme, Jaipur, Rajasthan 302001";
  const encodedQuery = encodeURIComponent(mapQuery);

  return (
    <Layout data={data}>
      <Helmet>
        <title>Contact Us | St. Xavier's Sr. Sec. School, Jaipur</title>
        <meta name="description" content="Get in touch with St. Xavier's Senior Secondary School, Jaipur. Address, phone numbers, and official email for inquiries." />
      </Helmet>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-school-navy text-white rounded-b-[60px] md:rounded-b-[100px]">
        <div className="absolute inset-0 bg-school-gold/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block px-6 py-2 bg-school-gold/10 rounded-full border border-school-gold/20"
          >
            <span className="text-sm font-black uppercase tracking-[0.3em] text-school-gold">Connect With Us</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-9xl font-black tracking-tighter leading-none italic"
          >
            Let's <span className="text-school-gold">Dialogue.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-white/40 font-light max-w-2xl mx-auto leading-relaxed"
          >
            We are here to listen, answer, and guide. Whether you're an aspiring student, a parent, or an alumnus.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 md:py-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-start">
            
            {/* Contact Form Wall */}
            <motion.div 
               initial={{ opacity: 0, x: -50 }}
               whileInView={{ opacity: 1, x: 0 }}
               className="space-y-12"
            >
              <div className="space-y-4">
                <h2 className="text-4xl md:text-6xl font-black text-school-ink tracking-tight">Drop a Message.</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/40 ml-1">Your Name</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g. John Doe"
                      className="w-full bg-school-paper rounded-2xl py-5 px-8 text-school-ink font-bold placeholder:text-school-ink/20 focus:ring-2 focus:ring-school-gold/20 transition-all outline-none border border-school-ink/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/40 ml-1">Email Address</label>
                    <input 
                      required
                      type="email" 
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      placeholder="email@example.com"
                      className="w-full bg-school-paper rounded-2xl py-5 px-8 text-school-ink font-bold placeholder:text-school-ink/20 focus:ring-2 focus:ring-school-gold/20 transition-all outline-none border border-school-ink/10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/40 ml-1">Subject</label>
                  <input 
                    type="text" 
                    value={formData.subject}
                    onChange={e => setFormData({...formData, subject: e.target.value})}
                    placeholder="Briefly describe your inquiry"
                    className="w-full bg-school-paper rounded-2xl py-5 px-8 text-school-ink font-bold placeholder:text-school-ink/20 focus:ring-2 focus:ring-school-gold/20 transition-all outline-none border border-school-ink/10"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/40 ml-1">Your Message</label>
                  <textarea 
                    required
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    placeholder="How can we help you today?"
                    className="w-full bg-school-paper rounded-2xl py-5 px-8 text-school-ink font-bold placeholder:text-school-ink/20 focus:ring-2 focus:ring-school-gold/20 transition-all outline-none h-48 resize-none border border-school-ink/10"
                  />
                </div>

                <AnimatePresence>
                  {status === 'success' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: 'auto' }} 
                      className="bg-emerald-50 text-emerald-600 p-6 rounded-2xl flex items-center gap-4 text-sm font-bold border border-emerald-100"
                    >
                      <CheckCircle2 /> Your message has been sent successfully. We will get back to you soon.
                    </motion.div>
                  )}
                </AnimatePresence>

                <button 
                  disabled={status === 'submitting'}
                  className="w-full md:w-auto px-12 py-6 bg-school-navy text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-school-gold hover:text-school-navy transition-all active:scale-95 flex items-center justify-center gap-4 disabled:bg-slate-300"
                >
                  {status === 'submitting' ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>Send Transmission <Send size={18} /></>
                  )}
                </button>
              </form>
            </motion.div>

            {/* Info and Accordion Wall */}
            <div className="space-y-20">
               {/* Contact Info Pills */}
               <div className="grid gap-6">
                  {[
                    { icon: <Phone />, label: 'Senior School', value: data.content.seniorSchoolPhone || '0141-2372336', sub: 'Main Office' },
                    { icon: <Phone />, label: 'Junior School', value: data.content.juniorSchoolPhone || '0141-2367792, 2376569', sub: 'Information Desk' },
                    { icon: <Mail />, label: 'Official Email', value: data.content.schoolEmail || 'xavier41jaipur@gmail.com', sub: 'Correspondence' },
                    { icon: <ArrowRight />, label: 'Official Website', value: data.content.schoolWebsite || 'www.xaviersjaipur.edu.in', sub: 'Online Portal' },
                    { icon: <MapPin />, label: 'Visit Campus', value: data.content.schoolAddress || 'Bhagwan Das Road', sub: 'Jaipur, Rajasthan' }
                  ].map((info, i) => (
                    <motion.div 
                      key={info.label}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center gap-8 p-8 bg-school-paper rounded-[40px] shadow-sm border border-school-ink/10 transition-all"
                    >
                      <div className="w-16 h-16 bg-school-gold/10 rounded-[24px] flex items-center justify-center text-school-gold">
                        {info.icon}
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-school-ink/30 mb-1">{info.label}</p>
                        <p className="text-xl md:text-2xl font-black text-school-ink">{info.value}</p>
                        <p className="text-sm font-medium text-school-ink/40 mt-1">{info.sub}</p>
                      </div>
                    </motion.div>
                  ))}
               </div>

               {/* FAQ Accordion */}
               <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <MessageSquare className="text-school-gold" />
                    <h3 className="text-2xl font-black text-school-navy">Common Inquiries</h3>
                  </div>
                  <div className="space-y-4">
                    {data.faqs.map((faq) => (
                      <div 
                        key={faq.id} 
                        className={`rounded-[32px] overflow-hidden border transition-all ${activeFaq === faq.id ? 'bg-school-ink text-school-paper border-school-ink shadow-xl' : 'bg-school-paper/50 border-school-ink/5 hover:bg-school-paper'}`}
                      >
                        <button 
                          onClick={() => setActiveFaq(activeFaq === faq.id ? null : faq.id)}
                          className="w-full flex items-center justify-between p-8 text-left"
                        >
                          <span className="text-lg font-black leading-tight pr-6">{faq.question}</span>
                        </button>
                        <AnimatePresence>
                          {activeFaq === faq.id && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="px-8 pb-8 pt-0"
                            >
                              <div className={`h-1 w-12 rounded-full mb-6 ${activeFaq === faq.id ? 'bg-school-gold' : 'bg-school-ink/20'}`} />
                              <p className={`text-lg font-medium leading-relaxed ${activeFaq === faq.id ? 'text-school-paper/60' : 'text-school-ink/60'}`}>
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
                 <span>Office: 8:00 AM - 2:00 PM</span>
               </div>
               <div className="flex items-center gap-4 font-bold">
                 <Calendar className="text-school-gold" size={20} />
                 <span>Monday — Saturday</span>
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
