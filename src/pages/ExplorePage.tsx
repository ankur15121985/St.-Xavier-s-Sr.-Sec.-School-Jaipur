import React from 'react';
import { AppData, CustomContent } from '../types';
import Layout from '../components/layout/Layout';
import { motion } from 'motion/react';
import SidebarLinks from '../components/layout/SidebarLinks';
import { FileText, ArrowRight } from 'lucide-react';
import Markdown from 'react-markdown';

interface ExplorePageProps {
  data: AppData;
}

const ExplorePage: React.FC<ExplorePageProps> = ({ data }) => {
  const content = data.custom_content || [];

  return (
    <Layout data={data}>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-school-navy">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_transparent_0%,_#002147_100%),_url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-school-gold">Institutional Insights</p>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif font-bold text-white mb-6"
          >
            Explore <span className="text-school-gold italic">Resources.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white/60 max-w-2xl mx-auto font-medium"
          >
            A dedicated space for specialized information and institutional archives.
          </motion.p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 bg-school-paper relative">
        <div className="max-w-5xl mx-auto px-6">
          {content.length > 0 ? (
            <div className="space-y-32">
              {content.sort((a, b) => a.order_index - b.order_index).map((item, index) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="flex flex-col md:flex-row gap-12 items-start">
                    <div className="shrink-0 pt-2">
                       <span className="text-6xl font-serif italic text-school-navy/5 font-black">0{index + 1}</span>
                    </div>
                    <div className="flex-1 space-y-8">
                       <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-school-accent mb-4">{item.title}</p>
                          <h2 className="text-4xl md:text-5xl font-serif font-bold text-school-navy leading-tight">{item.heading}</h2>
                       </div>
                       
                       <div className="prose prose-lg max-w-none prose-slate mt-8 markdown-body dark:prose-invert">
                          <Markdown>{item.content}</Markdown>
                       </div>

                       {item.attachmentUrl && (
                         <motion.a 
                           href={item.attachmentUrl}
                           target="_blank"
                           rel="noopener noreferrer"
                           whileHover={{ scale: 1.02 }}
                           whileTap={{ scale: 0.98 }}
                           className="inline-flex items-center gap-4 p-5 bg-white rounded-3xl border border-school-navy/5 shadow-sm hover:shadow-xl hover:border-school-navy/10 transition-all group mt-8"
                         >
                           <div className="w-12 h-12 rounded-2xl bg-school-navy text-white flex items-center justify-center group-hover:bg-school-gold transition-colors">
                              <FileText size={24} />
                           </div>
                           <div>
                              <p className="text-xs font-black uppercase tracking-widest text-school-navy">Download Attachment</p>
                              <div className="flex items-center gap-2 text-school-navy/40 text-[10px] font-bold mt-1 uppercase">
                                 <span>Official Document</span>
                                 <ArrowRight size={10} />
                              </div>
                           </div>
                         </motion.a>
                       )}
                    </div>
                  </div>
                  
                  {index !== content.length - 1 && (
                    <div className="absolute -bottom-16 left-0 w-full h-[1px] bg-school-navy/5" />
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-32 opacity-20">
               <FileText size={64} className="mx-auto mb-6" />
               <h3 className="text-2xl font-serif italic">No content found yet.</h3>
               <p className="text-sm font-black uppercase tracking-widest mt-2">Check back later for updates</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default ExplorePage;
