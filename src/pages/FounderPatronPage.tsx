import React from 'react';
import { motion } from 'motion/react';
import Layout from '../components/layout/Layout';
import { AppData } from '../types';

const FounderPatronPage = ({ data }: { data: AppData }) => {
  return (
    <Layout data={data}>
      <div className="bg-school-paper min-h-screen">
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
        <section className="py-16 md:py-32 bg-school-paper relative z-10 -mt-12 md:-mt-20 rounded-t-[40px] md:rounded-t-[80px] shadow-2xl">
          <div className="max-w-6xl mx-auto px-6 lg:px-12">
            
            {/* Saint Ignatius of Loyola Section (Our Founder) - TOP SECTION per historical precedence and user request */}
            <div id="founder" className="grid lg:grid-cols-12 gap-16 items-start mb-40">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="lg:col-span-5 relative"
              >
                <div className="aspect-[3/4] rounded-[40px] overflow-hidden shadow-2xl border-8 border-white group">
                   <img 
                      src="https://lh3.googleusercontent.com/d/1_fVSqtrpLiaw29uhOj6qdzp_1CZNBPaL" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                      alt="Saint Ignatius of Loyola"
                      referrerPolicy="no-referrer"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-school-navy/90 via-transparent to-transparent flex items-end p-10">
                      <p className="text-white text-2xl font-serif font-black italic">St. Ignatius of Loyola</p>
                   </div>
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-school-accent rounded-3xl -z-10 shadow-xl opacity-20"></div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="lg:col-span-7 space-y-8"
              >
                <div className="space-y-4">
                  <h2 className="text-school-accent font-black uppercase text-sm tracking-[0.3em]">Our Founder</h2>
                  <h3 className="text-5xl md:text-7xl font-serif font-black text-school-navy tracking-tight">The Visionary.</h3>
                </div>

                <div className="space-y-6 text-[17px] text-slate-600 leading-relaxed font-medium text-justify">
                   <p>
                    St. Ignatius grew up in Spain and lived a rather plush life. He frequented the court and developed a taste for that life style, especially the ladies. Ignatius was involved with gambling and was a very confrontational man. After some legal issues in his youth he found himself at age 30 in the Spanish army defending the Spanish town of Pamplona against the French. During this battle, his commander wanted to retreat because they were outnumbered, but Ignatius convinced the commander to stay out of honor. During this battle a cannon ball struck Ignatius' legs. The French soldiers, impressed with his courage, carried him back to his home rather than into prison. In the hospital, Ignatius needed to have his leg re-broke without anesthesia. Due to an infection the doctors told him to prepare for death. On the feast day of Saints Peter and Paul, Ignatius miraculously got better. The leg healed in such a way as to cause a big bump which prevented him from wearing the long fitted boots that Spanish soldiers wore. So he told the doctors to fix it, all without anesthesia. In the end, the operation didn't fully work since Ignatius always walked with a limp.
                  </p>
                  <p>
                    During the long recovery Ignatius asked for some romance novels to pass the time. All the hospital had were books on the life of Christ and the saints. Desperate from boredom, Ignatius began to read them. As he read the saints he saw their lives more and more worth imitating. However, he continued his daydreams of fame, wealth and the fantasies of winning the love of a certain noble lady of the court. However, Ignatius discovered an insight that would mark his life and the history of Christianity. When he would read and imagine Christ's life and the saints' lives he felt a deep peace, joy and an increase of love and confidence in God. When he would think about the fantasy life with women and riches and honors he was filled with uncertainty, doubt, fear and no real awareness of God. From here he began to develop what is called "The Rules for the Discernment of Spirits." He ended up writing down basic rules to help a person sift through the different moods and movements within one's heart to see which ones were from God and to embrace these thoughts and these desires and to discern which thoughts and desires were from the enemy and to reject those. These rules came from Ignatius paying attention to his own heart's movements during his time in the hospital. Eventually, Ignatius gave up his old pursuits and left the hospital a new man. He decided to travel to Jerusalem to walk in the same places of our Lord. Although Ignatius now wanted to serve the Lord, he was not yet a saint. During his trip he met a foreign man. They were both riding on mules and they began discussing the truths of the faith. The man told Ignatius that he didn't believe in Mary's perpetual virginity. Ignatius was enraged, and as the man rode off down one path Ignatius wanted to kill this man to honor our Lady. Ignatius decided at the fork in the road, he would let his mule decide. If it went down the same path as the man he would kill him, if not he would go on peacefully. The mule went down the other path and Ignatius went on with his journey. As the years went on, Ignatius got ordained, began a religious order known as Society of Jesus (Jesuits) and worked diligently in Rome for the sake of his order throughout the world. He died due to stomach complications, most likely because of his extreme fasts. His order continues and runs several universities throughout North America.
                  </p>
                  <p>
                    St. Ignatius is a model of passion for us. So many world religions involve the removal of desires or emotions and the ignoring of personal experience. It's easy to fall into this trap by thinking that spirituality is about getting rid of the bodily dimension of our existence. But for St. Ignatius and the Catholic tradition God took on human nature in Jesus and by doing so affirmed all that is authentically human. In fact, throughout the gospels Jesus invites us to tell him our desires: "What are you seeking?" (Jn 1:38), "What do you want me to do for you?" (Mk 10:51), "Do you want to be well?" (Jn 5:6). So with the help of St. Ignatius, let us tell God what we desire for Him to do for us. It doesn't need to be "religious" just honest.
                  </p>
                  <p className="font-bold italic text-school-navy text-xl border-t border-slate-100 pt-6">St. Ignatius, pray for us.</p>
                </div>
              </motion.div>
            </div>

            {/* Saint Francis Xavier Section (Our Patron) */}
            <div id="patron" className="grid lg:grid-cols-12 gap-16 items-start pt-32 border-t border-slate-100">
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="lg:order-2 lg:col-span-5 relative"
              >
                <div className="aspect-[3/4] rounded-[40px] overflow-hidden shadow-2xl border-8 border-white group">
                   <img 
                      src="https://lh3.googleusercontent.com/d/1QJu1tiy6y9B4qPETLffI6X_FjvcnjQo_" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                      alt="Saint Francis Xavier"
                      referrerPolicy="no-referrer"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-school-navy/90 via-transparent to-transparent flex items-end p-10">
                      <p className="text-white text-2xl font-serif font-black italic">Saint Francis Xavier</p>
                   </div>
                </div>
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-school-gold rounded-3xl -z-10 shadow-xl opacity-20"></div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="lg:order-1 lg:col-span-7 space-y-8"
              >
                <div className="space-y-4">
                  <h2 className="text-school-gold font-black uppercase text-sm tracking-[0.3em]">Our Patron</h2>
                  <h3 className="text-5xl md:text-7xl font-serif font-black text-school-navy tracking-tight">Our Patron.</h3>
                </div>

                <div className="bg-slate-50 p-10 rounded-[40px] border border-slate-100 italic font-medium text-xl text-school-navy leading-relaxed relative text-justify shadow-inner">
                   <span className="absolute -top-6 -left-2 text-7xl text-school-gold opacity-30">"</span>
                   Jesus asked, "What profit would there be for one to gain the whole world and forfeit his soul?" (Matthew 16:26a).
                   <p className="mt-4 text-[10px] font-sans font-black uppercase tracking-widest not-italic text-slate-400 text-left">— The call to Francis Xavier</p>
                </div>

                <div className="space-y-6 text-[17px] text-slate-600 leading-relaxed font-medium text-justify">
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

          </div>
        </section>
      </div>
    </Layout>
  );
};

export default FounderPatronPage;
