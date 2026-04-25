import React from 'react';
import { motion } from 'motion/react';
import Layout from '../components/layout/Layout';
import { AppData } from '../types';

const FounderPatronPage = ({ data }: { data: AppData }) => {
  return (
    <Layout data={data}>
      <div className="bg-slate-50 min-h-screen">
        {/* Banner Section */}
        <section className="relative h-[65vh] md:h-[50vh] overflow-hidden group">
          <img 
            src="https://picsum.photos/seed/xavier_patron_banner/1920/1080?blur=5" 
            className="w-full h-full object-cover brightness-50"
            alt="Spiritual Heritage"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-school-navy via-school-navy/60 to-transparent"></div>
          <div className="absolute inset-0 flex items-center justify-center text-center px-6 pt-10">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="max-w-4xl"
            >
              <div className="w-12 md:w-20 h-1 bg-school-gold mx-auto mb-6 md:mb-8 rounded-full"></div>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-black text-white tracking-tighter mb-4 italic leading-tight">Our Founder & <br className="sm:hidden" /> Patron</h1>
              <p className="text-school-gold/90 text-sm sm:text-lg md:text-xl font-black tracking-[0.15em] md:tracking-[0.2em] uppercase leading-relaxed max-w-[280px] sm:max-w-none mx-auto">The Pillars of the Society of Jesus</p>
            </motion.div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 md:py-24 bg-white relative z-10 -mt-12 md:-mt-20 rounded-t-[40px] md:rounded-t-[64px] shadow-2xl">
          <div className="max-w-6xl mx-auto px-6 lg:px-12">
            
            {/* Saint Francis Xavier Section (Our Patron) */}
            <div className="grid lg:grid-cols-12 gap-16 items-start mb-32">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-5 relative"
              >
                <div className="aspect-[3/4] rounded-[40px] overflow-hidden shadow-2xl border-8 border-white group">
                   <img 
                      src="https://picsum.photos/seed/st_francis_xavier/600/800" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                      alt="Saint Francis Xavier"
                      referrerPolicy="no-referrer"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-school-navy/80 to-transparent flex items-bottom p-10">
                      <p className="text-white text-2xl font-serif font-black italic mt-auto">Saint Francis Xavier</p>
                   </div>
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-school-gold rounded-3xl -z-10 shadow-xl flex items-center justify-center text-school-navy font-serif font-black text-4xl italic">X</div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-7 space-y-8"
              >
                <div className="space-y-4">
                  <h2 className="text-school-gold font-black uppercase text-sm tracking-[0.3em]">Our Patron</h2>
                  <h3 className="text-5xl font-serif font-black text-school-navy tracking-tight">The Apostle of the Indies</h3>
                </div>

                <div className="bg-slate-50 p-10 rounded-[32px] border border-slate-100 italic font-medium text-xl text-school-navy leading-relaxed relative text-justify">
                   <span className="absolute -top-6 -left-2 text-7xl text-school-gold opacity-30">"</span>
                   Jesus asked, "What profit would there be for one to gain the whole world and forfeit his soul?" (Matthew 16:26a).
                   <p className="mt-4 text-[10px] font-sans font-black uppercase tracking-widest not-italic text-school-navy/40 text-left">— Reflection of Francis Xavier</p>
                </div>

                <div className="space-y-6 text-lg text-school-navy/70 leading-relaxed font-light text-justify">
                   <p>
                    These words were repeated to a young teacher of philosophy who had a highly promising career in academics, with success and a life of prestige and honor before him. Francis Xavier, 24 at the time, and living and teaching in Paris, did not heed these words at once. They came from a good friend, Ignatius of Loyola (July 31), whose tireless persuasion finally won the young man to Christ. 
                  </p>
                  <p>
                    Francis then made the spiritual exercises under the direction of Ignatius, and in 1534 joined his little community (the infant Society of Jesus). Together at Montmartre they vowed poverty, chastity and apostolic service according to the directions of the Pope.
                  </p>
                  <p>
                    From Venice, where he was ordained a priest in 1537, Francis Xavier went on to Lisbon and from there sailed to the East Indies, landing at Goa, on the west coast of India in 1542. For the next 10 years he labored to bring the faith to such widely scattered peoples as the Hindus, the Malays and the Japanese. He spent much of that time in India, and served as provincial of the newly established Jesuit province of India.
                  </p>
                  <p>
                    Wherever he went, he lived with the poorest people, sharing their food and rough accommodations. He spent countless hours ministering to the sick and the poor, particularly to lepers. Very often he had no time to sleep or even to say his breviary but, as we know from his letters, he was filled always with joy.
                  </p>
                  <p>
                    Francis went through the islands of Malaysia, then up to Japan. He learned enough Japanese to preach to simple folk, to instruct and to baptize, and to establish missions for those who were to follow him. Before reaching the mainland he died. His remains are enshrined in the Church of Good Jesus in Goa. He and St. Therese of Lisieux were declared co-patrons of the missions in 1925.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Saint Ignatius of Loyola Section (Our Founder) */}
            <div className="pt-24 border-t border-slate-100 flex flex-col items-center">
               <motion.div 
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 className="text-center max-w-3xl mb-16"
               >
                  <h4 className="text-school-gold font-black uppercase text-sm tracking-[0.3em] mb-4">Our Founder</h4>
                  <h3 className="text-6xl font-serif font-black text-school-navy tracking-tight mb-8">Saint Ignatius of Loyola</h3>
                  <p className="text-xl text-school-navy/60 font-light leading-relaxed">
                    The visionary who transformed a soldier's ambition into a worldwide mission for the "Greater Glory of God" (Ad Maiorem Dei Gloriam).
                  </p>
               </motion.div>

               <div className="grid md:grid-cols-3 gap-12 text-center">
                  {[
                    { title: 'The Vision', desc: 'A nobleman and soldier who, after being wounded in battle, dedicated his life to spiritual transformation.' },
                    { title: 'The Society', desc: 'Established the Society of Jesus in 1540 with a focus on education, mission, and the Spiritual Exercises.' },
                    { title: 'Legacy', desc: 'His educational philosophy continues to shape world-class leaders across the Jesuit global network.' }
                  ].map((feat, i) => (
                    <motion.div 
                      key={feat.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="p-10 glass-surface rounded-[40px] border border-slate-100 shadow-sm"
                    >
                      <h5 className="text-xl font-serif font-black text-school-navy mb-4">{feat.title}</h5>
                      <p className="text-sm text-school-navy/50 leading-relaxed font-light">{feat.desc}</p>
                    </motion.div>
                  ))}
               </div>
            </div>

          </div>
        </section>
      </div>
    </Layout>
  );
};

export default FounderPatronPage;
