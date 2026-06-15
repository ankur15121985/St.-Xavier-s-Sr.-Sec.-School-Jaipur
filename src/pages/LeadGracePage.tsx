import React from 'react';
import { motion } from 'motion/react';
import Layout from '../components/layout/Layout';
import { AppData } from '../types';

interface LeadGracePageProps {
  data: AppData;
}

const LeadGracePage: React.FC<LeadGracePageProps> = ({ data }) => {
  const content = data.lead_grace?.[0] || {
    heading: 'Lead with Grace',
    content: 'We cultivate individuals of character, resilient in spirit and enlightened in soul. Education is the journey of becoming.',
    image_url: '/api/img?url=https%3A%2F%2Fbfqyrnvyhivflapjwllk.supabase.co%2Fstorage%2Fv1%2Fobject%2Fpublic%2Fuploads%2FGlobal_Settings%2Fcropped-Favicon-300x300.png'
  };

  return (
    <Layout data={data}>
      <div className="bg-school-navy min-h-[60vh] flex flex-col items-center justify-center relative overflow-hidden px-6 pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(226,180,80,0.15),transparent_70%)]"></div>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#e2b450 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center max-w-4xl"
        >
          <div className="w-20 h-1.5 bg-school-neon mx-auto mb-8 rounded-full"></div>
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-6 italic leading-tight">
            {content.heading.split(' ').map((word, i) => (
              <span key={i} className={i === 1 ? 'text-school-neon' : ''}>{word}{' '}</span>
            ))}
          </h1>
          <p className="text-school-paper/60 text-xl md:text-2xl font-medium tracking-widest uppercase">The Leadership Vision</p>
        </motion.div>
      </div>

      <section className="py-24 bg-school-paper relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-school-gold/10 rounded-[40px] blur-2xl"></div>
              <div className="relative aspect-[4/5] rounded-[40px] overflow-hidden border-8 border-white shadow-2xl">
                <img 
                  src={content.image_url || '/api/img?url=https%3A%2F%2Fbfqyrnvyhivflapjwllk.supabase.co%2Fstorage%2Fv1%2Fobject%2Fpublic%2Fuploads%2FGlobal_Settings%2Fcropped-Favicon-300x300.png'} 
                  alt="Lead Grace" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="inline-block px-4 py-1 bg-school-ink/5 rounded-full text-[10px] font-black uppercase tracking-widest text-school-navy border border-school-ink/10">
                Institutional Philosophy
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-school-navy tracking-tight leading-tight">
                Nurturing Excellence <br /> with Compassion.
              </h2>
              <div className="w-16 h-1 bg-school-gold rounded-full"></div>
              <div 
                className="text-xl text-school-ink/80 leading-relaxed font-medium whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: content.content }}
              />
              
              <div className="pt-8 flex items-center gap-6">
                <div className="h-12 w-12 rounded-full bg-school-navy flex items-center justify-center text-school-gold font-black italic border-2 border-school-gold">
                  SX
                </div>
                <div>
                  <p className="text-school-navy font-black text-lg">St. Xavier's, C-Scheme</p>
                  <p className="text-school-ink/40 text-sm font-bold uppercase tracking-wider">Jaipur, Rajasthan</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default LeadGracePage;
