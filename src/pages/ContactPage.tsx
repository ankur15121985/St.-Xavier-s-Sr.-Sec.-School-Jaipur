import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MapPin, Send, MessageSquare, ChevronDown, CheckCircle2, Loader2, Calendar, Clock, ArrowRight } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { AppData, ContactMessage } from '../types';
import { firebaseService } from '../lib/firebaseService';

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
        id: Date.now().toString(),
        ...formData,
        timestamp: new Date().toISOString(),
        status: 'new'
      };
      
      // Save to Firebase (via firebaseService which we'll update or use directly if it supports it)
      await firebaseService.saveItem('messages', newMessage);
      
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      console.error('Contact form error:', err);
      setStatus('error');
    }
  };

  return (
    <Layout data={data}>
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
                <h2 className="text-4xl md:text-6xl font-black text-school-navy tracking-tight">Drop a Message.</h2>
                <p className="text-lg text-slate-500 font-medium leading-relaxed">Our administrative team usually responds within 24-48 business hours.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Your Name</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g. John Doe"
                      className="w-full bg-slate-100 border-none rounded-2xl py-5 px-8 text-school-navy font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-school-gold/20 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                    <input 
                      required
                      type="email" 
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      placeholder="email@example.com"
                      className="w-full bg-slate-100 border-none rounded-2xl py-5 px-8 text-school-navy font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-school-gold/20 transition-all outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Subject</label>
                  <input 
                    type="text" 
                    value={formData.subject}
                    onChange={e => setFormData({...formData, subject: e.target.value})}
                    placeholder="Briefly describe your inquiry"
                    className="w-full bg-slate-100 border-none rounded-2xl py-5 px-8 text-school-navy font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-school-gold/20 transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Your Message</label>
                  <textarea 
                    required
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    placeholder="How can we help you today?"
                    className="w-full bg-slate-100 border-none rounded-2xl py-5 px-8 text-school-navy font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-school-gold/20 transition-all outline-none h-48 resize-none"
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
                    { icon: <Phone />, label: 'Admissions Office', value: '0141-2372336', sub: 'Ext: 201' },
                    { icon: <Mail />, label: 'Support Email', value: 'office@xaviersjaipur.edu.in', sub: 'Primary Contact' },
                    { icon: <MapPin />, label: 'Visit Campus', value: 'Bhagwan Das Road', sub: 'Jaipur, Rajasthan' }
                  ].map((info, i) => (
                    <motion.div 
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center gap-8 p-8 bg-white rounded-[40px] shadow-sm border border-slate-50 transition-all"
                    >
                      <div className="w-16 h-16 bg-school-gold/10 rounded-[24px] flex items-center justify-center text-school-gold">
                        {info.icon}
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 mb-1">{info.label}</p>
                        <p className="text-xl md:text-2xl font-black text-school-navy">{info.value}</p>
                        <p className="text-sm font-medium text-slate-400 mt-1">{info.sub}</p>
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
                        className={`rounded-[32px] overflow-hidden border transition-all ${activeFaq === faq.id ? 'bg-school-navy text-white border-school-navy shadow-xl' : 'bg-slate-50 border-transparent hover:bg-slate-100'}`}
                      >
                        <button 
                          onClick={() => setActiveFaq(activeFaq === faq.id ? null : faq.id)}
                          className="w-full flex items-center justify-between p-8 text-left"
                        >
                          <span className="text-lg font-black leading-tight pr-6">{faq.question}</span>
                          <ChevronDown className={`shrink-0 transition-transform duration-300 ${activeFaq === faq.id ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                          {activeFaq === faq.id && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="px-8 pb-8 pt-0"
                            >
                              <div className={`h-1 w-12 rounded-full mb-6 ${activeFaq === faq.id ? 'bg-school-gold' : 'bg-slate-200'}`} />
                              <p className={`text-lg font-medium leading-relaxed ${activeFaq === faq.id ? 'text-white/60' : 'text-slate-500'}`}>
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
      <section className="py-20 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-4 space-y-8">
            <h2 className="text-5xl font-black text-school-navy tracking-tighter leading-none italic">
              Institutional <br /><span className="text-school-accent">Terrain.</span>
            </h2>
            <p className="text-lg text-slate-500 font-medium leading-relaxed">
              Located in the heart of C-Scheme, our campus is easily accessible from any part of the Pink City.
            </p>
            <div className="flex flex-col gap-4">
               <div className="flex items-center gap-4 text-school-navy font-bold">
                 <Clock className="text-school-gold" size={20} />
                 <span>Office: 8:00 AM - 2:00 PM</span>
               </div>
               <div className="flex items-center gap-4 text-school-navy font-bold">
                 <Calendar className="text-school-gold" size={20} />
                 <span>Monday — Saturday</span>
               </div>
            </div>
            <a 
              href="https://maps.google.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-4 text-school-navy font-bold group"
            >
              Get Directions <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </a>
          </div>
          <div className="lg:col-span-8">
            <div className="aspect-video w-full rounded-[40px] overflow-hidden bg-slate-200 shadow-2xl relative border-8 border-white">
               <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3557.88602237072!2d75.8049591761884!3d26.90793746033878!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db421f148e6c7%3A0x6e76cf0e353279c1!2sSt.%20Xavier&#39;s%20School!5e0!3m2!1sen!2sin!4v1713968265432!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactPage;
