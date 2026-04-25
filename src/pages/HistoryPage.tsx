import React from 'react';
import { motion } from 'motion/react';
import Layout from '../components/layout/Layout';
import { AppData } from '../types';

const HistoryPage = ({ data }: { data: AppData }) => {
  return (
    <Layout data={data}>
      <div className="bg-transparent min-h-screen">
        {/* Banner Section */}
        <section className="relative h-[65vh] md:h-[60vh] overflow-hidden group">
          <img 
            src="https://picsum.photos/seed/xavier_legacy/1920/1080" 
            className="w-full h-full object-cover grayscale brightness-50 group-hover:scale-105 transition-transform duration-[2s]"
            alt="School Heritage"
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
              <div className="w-16 md:w-24 h-1.5 md:h-2 bg-school-neon mx-auto mb-6 md:mb-8 rounded-full"></div>
              <h1 className="text-5xl sm:text-6xl md:text-8xl font-sans font-black text-white tracking-tighter mb-4 italic leading-tight">The Legacy <br /> <span className="text-school-neon tracking-tighter text-3xl sm:text-4xl md:text-5xl uppercase font-black not-italic opacity-90">Archive.</span></h1>
            </motion.div>
          </div>
        </section>

        {/* Content Section - Glass Theme */}
        <section className="py-20 md:py-40 bg-white/30 backdrop-blur-3xl relative z-10 -mt-12 md:-mt-20 rounded-t-[40px] md:rounded-t-[100px] shadow-2xl border-t border-white/40">
          <div className="max-w-4xl mx-auto px-6 lg:px-12">
            <div className="space-y-16 text-xl text-school-ink opacity-70 leading-relaxed font-medium text-justify">
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl text-school-ink font-black leading-tight border-l-8 border-school-accent pl-10 py-6 text-justify"
              >
                St. Xavier's Jaipur is synonymous with world class education imparted in an exemplary and disciplined ambience. It has unrivaled contributions in shaping the intellectual facet of Jaipur.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="prose prose-slate max-w-none space-y-8 text-justify"
              >
                <p>
                  The legendary institution in its 68 years of glorious existence has nurtured many- be it the younger ones of royals or the striving commoners. The sylvan 21 acres housing the stately three storied structure has showered love on generations and the Alumni of this prestigious institution stand as the bastions of the shimmering heritage and the historical Gold and Blue legacy.
                </p>

                <div className="bg-white/20 p-12 rounded-[40px] border border-white/30 italic font-serif text-xl relative backdrop-blur-md">
                   <span className="absolute -top-6 -left-2 text-8xl text-school-gold opacity-20">"</span>
                   'ROME NE S'EST FAITE EN UN JOUR' the celebrated 11th century French Proverb is brought alive as we trace the journey of the institution, the untiring efforts of our revered luminaries and their never ending quest for excellence.
                   <p className="mt-6 text-sm font-sans font-black uppercase tracking-widest not-italic text-school-navy/40">— The Jesuit Foundation</p>
                </div>

                <p>
                  Above all, the benediction of God Almighty and blessing of our founder St. Ignatius of Loyola and of our beloved patron St. Francis Xavier has guided St Xavier's Jaipur to accomplish so much so fast.
                </p>

                <p>
                  It all started in 1942 when Sir Mirza Ismail, the Dewan of Jaipur Darbar felt the compelling need to have a superior institution which can groom the upcoming generation of this historical Pink city with the best of education and values, It didn't take much of time to conceive that the city should have a Jesuit School.
                </p>

                <p>
                  He then met Fr. Frank Loesch, SJ, the Superior of Patna and invited him to Jaipur. On hearing that the Jesuits are coming to Jaipur, Bishop Le Floch offered them the school by the name of St. Mary's which was started by Fr. Arthur and Fr. Ignatius at the Catholic Church Premises outside Ghat gate in July 1941.
                </p>

                <p>
                  The school was facing challenges as Fr. Arthur had to leave for health reasons and within two years the location of St. Mary's was changed twice first to Purohit Dwarka Nathji's place of Ajmer Road and later to Wali Gardens on Moti Doongri Road. 
                </p>

                <p>
                  Two Jesuits - Fr. William Hussey SJ and Fr. Robert Ludwing SJ were sent with the responsibility to recover St Mary's and they finally took the reign in June 1943. Overwhelmed with the inception the Jaipur Darbar donated 12 acres of land in the then newly developed C-Scheme and the Jesuits purchased another 9 acres. The same year the school was rechristened as St. Xavier's School.
                </p>

                <p>
                  There was no looking back after that the school grew steadily setting up unparalleled standards in education. The humble building erected initially soon grew insufficient to accommodate the growing number of students. A new building was planned and its construction began in 1950 the year is also glorified as it presented the first batch of students for the prestigious Senior Cambridge Examination.
                </p>

                <p>
                  The new regal building was complete in 1952 and all the classes were shifted into it. The hostel, which already began in 1945, was also shifted there. Fr. Edward Sann SJ was head for this memorable period. In the year 1954 Fr. Albert Wilzbacher succeeded Fr. Sann.
                </p>

                <p>
                  The governance of the State went through an overhaul with Royalty taking the backseat and the democratic government taking control but the popularity of St. Xavier's kept soaring. Even at times when the school's operation was under the scanner, no blemish was ever reflected which led to Mr. Mohanlal Sukhadia the Chief Minister of the newly ordained government, declaring it as a role model.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default HistoryPage;
