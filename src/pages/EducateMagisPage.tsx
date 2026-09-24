import React from 'react';
import { AppData } from '../types';
import Layout from '../components/layout/Layout';
import { motion } from 'motion/react';
import Image from 'next/image';
import { Globe, Users, Target, BookOpen, Heart, Rocket, Compass, Users2, Languages, GraduationCap, ShieldCheck, Handshake, Globe2 } from 'lucide-react';

const EducateMagisPage = ({ data }: { data: AppData }) => {
  return (
    <Layout data={data}>
      <div className="pt-32 pb-20 overflow-hidden">
        {/* Hero Section */}
        <div className="relative bg-school-navy py-24 mb-16">
          <div className="absolute inset-0 overflow-hidden opacity-20">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-school-accent rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-school-navy rounded-full blur-3xl animate-pulse" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-10">
               <Globe className="w-full h-full text-white/10" strokeWidth={0.5} />
            </div>
          </div>
          
          <div className="container mx-auto px-6 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-6">
                <Globe className="w-4 h-4 text-school-accent" />
                <span className="text-xs font-bold text-white uppercase tracking-widest">Global Network of Jesuit Schools</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-tight">
                Educate Magis: Connecting St. Xavier <br className="hidden md:block" /> Senior Secondary School to the World
              </h1>
              
              <p className="text-xl text-white/80 max-w-3xl mx-auto font-light leading-relaxed">
                Transforming learning into a truly global experience through the Ignatian tradition of excellence and service.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto space-y-16">
            
            {/* Introduction */}
            <motion.section 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="prose prose-lg max-w-none dark:prose-invert"
            >
              <div className="flex flex-col md:flex-row gap-12 items-center">
                <div className="flex-1">
                  <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed first-letter:text-5xl first-letter:font-bold first-letter:text-school-navy first-letter:mr-3 first-letter:float-left">
                    At St. Xavier Senior Secondary School, Jaipur, education extends far beyond the boundaries of the classroom. As a Jesuit institution, we are committed to forming young people who are intellectually competent, morally responsible, spiritually grounded, and globally aware. We believe in nurturing compassionate leaders who are prepared to serve society with integrity, empathy, and a commitment to the common good.
                  </p>
                  <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mt-4">
                    One of the most enriching ways in which we live this mission is through our active participation in <strong>Educate Magis</strong>, the global online community of the Jesuit Global Network of Schools (JGNS). Through this remarkable initiative, our students and teachers collaborate with peers across continents, transforming learning into a truly global experience.
                  </p>
                </div>
                <div className="w-full md:w-1/3 shrink-0">
                   <div className="relative h-64 w-full rounded-2xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                      <Image 
                        src="/WhatsApp Image 2026-08-06 at 8.18.3AM.jpeg" 
                        alt="St. Xavier's Students participating in Educate Magis" 
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                   </div>
                </div>
              </div>
            </motion.section>

            {/* What is Educate Magis? */}
            <motion.section 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-8 md:p-12 border border-slate-200 dark:border-white/5"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-school-navy rounded-xl flex items-center justify-center">
                  <Compass className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-display font-bold text-school-navy dark:text-white">What is Educate Magis?</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                    Educate Magis is the official global platform of the Jesuit Global Network of Schools. It brings together Jesuit educators and students from more than 70 countries, creating opportunities to collaborate, share innovative educational practices, and build meaningful international relationships rooted in the Ignatian tradition.
                  </p>
                </div>
                <div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    The word <strong>Magis</strong>, derived from Latin, means “the more” or “the greater good.” It reflects the Jesuit commitment to continually strive for excellence—not merely in academic achievement, but in service, compassion, leadership, and personal growth. Educate Magis enables schools around the world to learn from one another while remaining united by the shared values of Jesuit education.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Vision and Objectives */}
            <motion.section 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-display font-bold text-school-navy dark:text-white mb-4">Vision and Objectives</h2>
                <p className="text-slate-600 dark:text-slate-400">Building a more just, compassionate, and peaceful world together.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { icon: <Globe2 className="w-5 h-5" />, title: "Global Citizenship", desc: "Promoting global citizenship among the youth." },
                  { icon: <Languages className="w-5 h-5" />, title: "Intercultural Dialogue", desc: "Encouraging intercultural dialogue and understanding." },
                  { icon: <Handshake className="w-5 h-5" />, title: "International Partnerships", desc: "Building partnerships among Jesuit schools worldwide." },
                  { icon: <GraduationCap className="w-5 h-5" />, title: "Innovative Practices", desc: "Sharing innovative educational practices across borders." },
                  { icon: <Users2 className="w-5 h-5" />, title: "Leadership & Empathy", desc: "Developing leadership, empathy, and collaboration." },
                  { icon: <ShieldCheck className="w-5 h-5" />, title: "Apostolic Preferences", desc: "Supporting the Universal Apostolic Preferences of the Society of Jesus." }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 bg-slate-100 dark:bg-white/10 rounded-lg flex items-center justify-center text-school-navy dark:text-school-accent mb-4">
                      {item.icon}
                    </div>
                    <h3 className="font-bold text-school-navy dark:text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Image Grid 1 */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="relative h-80 rounded-3xl overflow-hidden shadow-lg">
                <Image src="/WhatsApp Image 2026-08-01 AM.jpeg" alt="Global Classroom" fill className="object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="relative h-80 rounded-3xl overflow-hidden shadow-lg">
                <Image src="/WhatsApp Image 2026-08-06 at 8.18.58 AM.jpeg" alt="Students Collaborating" fill className="object-cover" referrerPolicy="no-referrer" />
              </div>
            </div>

            {/* Connected Classrooms */}
            <motion.section 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-3xl font-display font-bold text-school-navy dark:text-white">Connected Classrooms: Learning Without Borders</h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                One of Educate Magis’ most inspiring initiatives is the Connected Classroom Programme, which brings together students from different countries through virtual learning experiences.
              </p>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                These are not merely online meetings; they are authentic opportunities for students to collaborate on projects, exchange ideas, celebrate cultural diversity, discuss global challenges, and learn directly from one another. Through these interactions, students develop communication skills, digital literacy, teamwork, critical thinking, intercultural competence, and a broader understanding of the world.
              </p>
              <div className="p-6 border-l-4 border-school-accent bg-school-accent/5 rounded-r-2xl italic text-slate-700 dark:text-slate-200">
                "Connected Classrooms demonstrate that education has no borders and that meaningful friendships and learning can flourish across continents."
              </div>
            </motion.section>

            {/* Active Global Partner */}
            <motion.section 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row gap-12 items-center"
            >
              <div className="flex-1 space-y-6">
                <h2 className="text-3xl font-display font-bold text-school-navy dark:text-white">St. Xavier Senior Secondary School: An Active Global Partner</h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  St. Xavier Senior Secondary School has proudly emerged as one of the most active Indian schools participating in the Educate Magis Connected Classroom initiatives.
                </p>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Throughout the academic year, our students enthusiastically engage in international virtual collaborations with partner schools in <strong>Italy, Spain, Chile, Australia, and Ireland</strong>. These interactions provide unique opportunities for students to share their culture, traditions, languages, values, and ideas while learning from their peers across the globe.
                </p>
              </div>
              <div className="w-full md:w-2/5 relative h-96 rounded-3xl overflow-hidden shadow-2xl">
                 <Image src="/WhatsApp Image 2026-08-06 at 829 AM.jpeg" alt="Global Partnership" fill className="object-cover" referrerPolicy="no-referrer" />
              </div>
            </motion.section>

            {/* Ignatian Paradigm */}
            <motion.section 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-school-navy text-white rounded-[3rem] p-8 md:p-16 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-school-accent/20 blur-[100px] -mr-32 -mt-32" />
              <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-4">
                   <BookOpen className="w-8 h-8 text-school-accent" />
                   <h2 className="text-3xl font-display font-bold">Rooted in the Ignatian Pedagogical Paradigm</h2>
                </div>
                
                <p className="text-white/80 text-lg leading-relaxed">
                  At the heart of every learning experience at St. Xavier Senior Secondary School lies the Ignatian Pedagogical Paradigm (IPP), the educational philosophy of the Society of Jesus. More than a teaching methodology, it is a holistic approach that seeks to educate the whole person—mind, heart, and spirit.
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                   {['Context', 'Experience', 'Reflection', 'Action', 'Evaluation'].map((step, i) => (
                     <div key={i} className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center font-display font-bold text-school-accent">
                          {i+1}
                        </div>
                        <span className="text-xs uppercase tracking-widest font-bold">{step}</span>
                     </div>
                   ))}
                </div>

                <p className="text-white/80 text-lg leading-relaxed">
                  Our participation in Educate Magis Connected Classrooms beautifully reflects this Ignatian philosophy. Through meaningful dialogue with students from across the globe, our learners encounter diverse perspectives, appreciate different cultures, reflect on shared human experiences, and become inspired to act with compassion and responsibility.
                </p>
              </div>
            </motion.section>

            {/* Image Grid 2 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="relative h-64 rounded-2xl overflow-hidden">
                <Image src="/WhatsApp Image 2026-40 AM.jpeg" alt="Global Session" fill className="object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="relative h-64 rounded-2xl overflow-hidden">
                <Image src="/WhatsApp Image 2026-56 at 8.19.00 AM.jpeg" alt="Collaborative Learning" fill className="object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="relative h-64 rounded-2xl overflow-hidden">
                <Image src="/WhatsApp Image 202406 at 8.18.59 AM.jpeg" alt="International Friends" fill className="object-cover" referrerPolicy="no-referrer" />
              </div>
            </div>

            {/* Living the Mission */}
            <motion.section 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="prose prose-lg max-w-none dark:prose-invert border-t border-slate-100 dark:border-white/5 pt-16"
            >
              <h2 className="text-3xl font-display font-bold text-school-navy dark:text-white">Living the Jesuit Mission</h2>
              <p>
                Every Connected Classroom reflects our commitment to the Jesuit mission of faith, justice, reconciliation, and service. Our students learn that diversity is a gift, dialogue builds understanding, and collaboration creates positive change.
              </p>
              <p>
                By engaging with students across cultures, they develop empathy, respect, leadership, and a genuine commitment to building a more peaceful, just, and sustainable world. They learn to become “Men and Women for and with Others,” carrying the Ignatian spirit of service into every aspect of their lives.
              </p>
            </motion.section>

            {/* Future Vision */}
            <motion.section 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-center py-16 px-8 rounded-[4rem] bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5"
            >
              <div className="w-16 h-16 bg-school-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
                 <Rocket className="w-8 h-8 text-school-navy dark:text-school-accent" />
              </div>
              <h2 className="text-3xl font-display font-bold text-school-navy dark:text-white mb-6">Looking Towards the Future</h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto mb-10">
                Together with Educate Magis, St. Xavier Senior Secondary School is preparing a new generation of compassionate global citizens—young people who think critically, act ethically, embrace diversity, serve generously, and strive tirelessly for the Magis—the greater good.
              </p>
              <div className="font-display text-2xl font-bold text-school-navy dark:text-white italic">
                "Our classrooms truly have no borders."
              </div>
            </motion.section>

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EducateMagisPage;
