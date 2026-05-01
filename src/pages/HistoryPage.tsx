import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { AppData } from '../types';

const HistoryPage = ({ data }: { data: AppData }) => {
  return (
    <Layout data={data}>
      <div className="bg-transparent min-h-screen">
        {/* Banner Section */}
        <section className="relative h-[65vh] md:h-[60vh] overflow-hidden group">
          <img 
            src="https://lh3.googleusercontent.com/d/16oegUjYNuRhfo7b0CsRLQIZhuWH5cg9N" 
            className="w-full h-full object-cover grayscale brightness-50 group-hover:scale-105 transition-transform duration-[2s]"
            alt="School Heritage"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-school-navy via-school-navy/60 to-transparent"></div>
          <div className="absolute inset-0 flex items-center justify-center text-center px-6 pt-10">
            <motion.div 
              id="legacy"
              style={{ scrollMarginTop: '100px' }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="max-w-4xl relative"
            >
              <div className="w-16 md:w-24 h-1.5 md:h-2 bg-school-neon mx-auto mb-6 md:mb-8 rounded-full"></div>
              <h1 className="text-5xl sm:text-6xl md:text-8xl font-sans font-black text-white tracking-tighter mb-4 italic leading-tight">The Legacy <br /> <span className="text-school-neon tracking-tighter text-3xl sm:text-4xl md:text-5xl uppercase font-black not-italic opacity-90">Archive.</span></h1>
              
              {/* Added Scroll Indicator */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute -bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
                onClick={() => {
                  const element = document.getElementById('school');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                <div className="text-[10px] uppercase font-black tracking-[0.3em] text-school-neon opacity-70">Scroll to Explore</div>
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-1 h-12 bg-gradient-to-b from-school-neon to-transparent rounded-full"
                />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Content Section - Glass Theme */}
        <section className="py-20 md:py-40 bg-school-paper relative z-10 -mt-12 md:-mt-20 rounded-t-[40px] md:rounded-t-[100px] shadow-2xl border-t border-school-ink/10">
          <div className="max-w-4xl mx-auto px-6 lg:px-12">
            <div className="space-y-16 text-xl text-slate-800 leading-relaxed font-medium text-justify">
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl text-school-navy font-black leading-tight border-l-8 border-school-accent pl-10 py-6 text-justify"
              >
                St. Xavier's Jaipur is synonymous with world class education imparted in an exemplary and disciplined ambience. It has unrivaled contributions in shaping the intellectual facet of Jaipur.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-justify text-slate-800 font-medium"
              >
                <div id="school" className="scroll-mt-32">
                  <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                  >
                    The legendary institution in its 68 years of glorious existence has nurtured many- be it the younger ones of royals or the striving commoners. The sylvan 21 acres housing the stately three storied structure has showered love on generations and the Alumni of this prestigious institution stand as the bastions of the shimmering heritage and the historical Gold and Blue legacy.
                  </motion.p>
                </div>

                <motion.div 
                   initial={{ opacity: 0, scale: 0.95 }}
                   whileInView={{ opacity: 1, scale: 1 }}
                   viewport={{ once: true }}
                   transition={{ duration: 0.8 }}
                   className="bg-school-paper/50 p-12 rounded-[40px] border border-school-ink/10 italic font-serif text-xl relative backdrop-blur-md"
                >
                   <span className="absolute -top-6 -left-2 text-8xl text-school-gold opacity-20">"</span>
                   'ROME NE S'EST FAITE EN UN JOUR' the celebrated 11th century French Proverb is brought alive as we trace the journey of the institution, the untiring efforts of our revered luminaries and their never ending quest for excellence.
                   <p className="mt-6 text-sm font-sans font-black uppercase tracking-widest not-italic text-school-ink/40">— The Jesuit Foundation</p>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  Above all, the benediction of God Almighty and blessing of our founder St. Ignatius of Loyola and of our beloved patron St. Francis Xavier has guided St Xavier's Jaipur to accomplish so much so fast.
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  It all started in 1942 when Sir Mirza Ismail, the Dewan of Jaipur Darbar felt the compelling need to have a superior institution which can groom the upcoming generation of this historical Pink city with the best of education and values, It didn't take much of time to conceive that the city should have a Jesuit School.
                </motion.p>

                <motion.p 
                  id="rector" 
                  className="scroll-mt-32"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  He then met Fr. Frank Loesch, SJ, the Superior of Patna and invited him to Jaipur. On hearing that the Jesuits are coming to Jaipur, Bishop Le Floch offered them the school by the name of St. Mary's which was started by Fr. Arthur and Fr. Ignatius at the Catholic Church Premises outside Ghat gate in July 1941.
                </motion.p>

                <motion.p 
                  id="manager" 
                  className="scroll-mt-32"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  The school was facing challenges as Fr. Arthur had to leave for health reasons and within two years the location of St. Mary's was changed twice first to Purohit Dwarka Nathji's place of Ajmer Road and later to Wali Gardens on Moti Doongri Road. 
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  Two Jesuits - Fr. William Hussey SJ and Fr. Robert Ludwing SJ were sent with the responsibility to recover St Mary's and they finally took the reign in June 1943. Overwhelmed with the inception the Jaipur Darbar donated 12 acres of land in the then newly developed C-Scheme and the Jesuits purchased another 9 acres. The same year the school was rechristened as St. Xavier's School.
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  There was no looking back after that the school grew steadily setting up unparalleled standards in education. The humble building erected initially soon grew insufficient to accommodate the growing number of students. A new building was planned and its construction began in 1950 the year is also glorified as it presented the first batch of students for the prestigious Senior Cambridge Examination.
                </motion.p>

                <motion.p 
                  id="principal" 
                  className="scroll-mt-32"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  The new regal building was complete in 1952 and all the classes were shifted into it. The hostel, which already began in 1945, was also shifted there. Fr. Edward Sann SJ was head for this memorable period. In the year 1954 Fr. Albert Wilzbacher succeeded Fr. Sann.
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  The governance of the State went through an overhaul with Royalty taking the backseat and the democratic government taking control but the popularity of St. Xavier's kept soaring. Even at times when the school's operation was under the scanner, no blemish was ever reflected which led to Mr. Mohanlal Sukhadia the Chief Minister of the newly ordained government, declaring it as a role model.
                </motion.p>
              </motion.div>

              {/* Legacy CTA */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ amount: 0.1 }}
                className="pt-20"
              >
                <div className="bg-school-navy p-12 md:p-20 rounded-[60px] text-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-school-gold/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <h3 className="text-3xl md:text-5xl font-serif text-white italic mb-10">Honor the Pillars of our History.</h3>
                  <div className="flex flex-wrap justify-center gap-4">
                    {[
                      { label: 'Former Principals', href: '/former-principals' },
                      { label: 'Former Rectors', href: '/former-rectors' },
                      { label: 'Former Managers', href: '/former-managers' }
                    ].map((lnk) => (
                      <Link 
                        key={lnk.href}
                        to={lnk.href}
                        className="px-8 py-3 bg-white/10 hover:bg-school-gold text-white hover:text-school-navy border border-white/10 hover:border-school-gold rounded-full transition-all font-black uppercase text-[10px] tracking-widest backdrop-blur-sm"
                      >
                        {lnk.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default HistoryPage;
