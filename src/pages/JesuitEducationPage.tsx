import React from 'react';
import { motion } from 'motion/react';
import Layout from '../components/layout/Layout';
import { AppData } from '../types';
import { BookOpen, Award, ShieldAlert, GraduationCap, Users, Clock, CheckCircle2 } from 'lucide-react';

const JesuitEducationPage = ({ data }: { data: AppData }) => {
  return (
    <Layout data={data}>
      <div className="pt-32 bg-slate-50 min-h-screen">
        {/* Hero Section */}
        <section className="py-20 bg-school-navy relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
          </div>
          <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-5xl md:text-7xl font-serif font-black text-white tracking-tighter mb-6 italic">Objectives of <br /> <span className="text-school-gold not-italic uppercase text-3xl md:text-4xl tracking-[0.3em]">Jesuit Education</span></h1>
              <p className="text-white/50 text-xl font-light max-w-2xl mx-auto italic italic">Promoting the total development of the WHOLE PERSON — fully human, fully Indian, and truly modern.</p>
            </motion.div>
          </div>
        </section>

        {/* Vision & Objectives Section */}
        <section className="py-24 max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="inline-block px-4 py-1.5 bg-school-gold/10 rounded-full text-[10px] font-black uppercase tracking-widest text-school-gold mb-2">Our Vision</div>
              <h2 className="text-4xl font-serif font-black text-school-navy italic tracking-tight">Inspired by Divine Wisdom</h2>
              <div className="space-y-6 text-lg text-school-navy/70 font-light leading-relaxed">
                <p>
                  Jesuit Education is inspired by a vision drawn from the life and teachings of Jesus Christ and the principles of CHARACTER formation elaborated by <span className="font-bold text-school-navy">Ignatius Loyola</span>, the founder of the Society of Jesus.
                </p>
                <p>
                  This vision sets before our staff, students, and parents high ideals of humanism and service. We believe in a Christian Social Ethics whereby justice is an absolute requirement of faith in God and the acceptance of each other as brothers and sisters.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-school-navy rounded-[48px] p-10 md:p-12 text-white shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-12 -mt-12 blur-3xl"></div>
              <h3 className="text-2xl font-serif font-black italic text-school-gold mb-8">Integral Formation Aims:</h3>
              <ul className="space-y-6">
                {[
                  "Help students become mature, spiritually oriented men and women of character.",
                  "Encourage continual striving after excellence in every field.",
                  "Value and judiciously use their freedom.",
                  "Be clear and firm on principles and courageous in action.",
                  "Be unselfish in the service of their fellow human beings.",
                  "Become agents of needed social change in the country."
                ].map((item, i) => (
                  <li key={i} className="flex gap-4 items-start group">
                    <CheckCircle2 className="text-school-gold shrink-0 mt-1 transition-transform group-hover:scale-110" size={18} />
                    <p className="text-sm font-light text-white/80 leading-relaxed">{item}</p>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>

        {/* Academic Standards Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex flex-col md:flex-row gap-4 items-end justify-between mb-16">
              <div>
                <h2 className="text-4xl md:text-5xl font-serif font-black text-school-navy italic tracking-tight">Academic Regulations</h2>
                <p className="text-school-navy/40 text-sm font-black uppercase tracking-widest mt-2">Examinations & Promotion Criteria</p>
              </div>
              <div className="w-24 h-1 bg-school-gold rounded-full"></div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Examinations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass-surface p-10 rounded-[48px] border border-slate-100 shadow-xl"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-school-navy">
                    <BookOpen size={24} />
                  </div>
                  <h3 className="text-2xl font-serif font-black italic text-school-navy">Examinations</h3>
                </div>
                <div className="space-y-4 text-sm text-school-navy/70 leading-relaxed font-light">
                  <p>• Two Semesters per year with Internal Assessments in each.</p>
                  <p>• <span className="font-bold text-school-navy">40% Minimum marks</span> in each subject for every grade (1 to 12).</p>
                  <p>• <span className="font-bold text-school-navy">90% Attendance</span> is mandatory to appear for the final examination.</p>
                  <p>• No re-examinations for absence. Medical certificates required for illness-related absence from tests.</p>
                  <p className="italic bg-slate-50 p-4 rounded-xl border border-slate-100">"Sufficient reasons like unsatisfactory progress or serious misconduct may debar a pupil from examination."</p>
                </div>
              </motion.div>

              {/* Promotions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="glass-surface p-10 rounded-[48px] border border-slate-100 shadow-xl"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-school-gold/10 rounded-2xl flex items-center justify-center text-school-gold">
                    <Award size={24} />
                  </div>
                  <h3 className="text-2xl font-serif font-black italic text-school-navy">Promotions</h3>
                </div>
                <div className="space-y-4 text-sm text-school-navy/70 leading-relaxed font-light">
                  <p>• Decisions based on the <span className="font-bold text-school-navy uppercase">Whole Year’s Work</span> and steady performance.</p>
                  <p>• Failure in two or more subjects renders a pupil liable to repeat the class.</p>
                  <p>• Results declared at year-end are final; retests or reconsiderations are not possible.</p>
                  <p>• <span className="font-bold text-school-navy">Class XII Criteria:</span> Minimum 33% required per subject. Failure in any two subjects in Class XI results in overall failure.</p>
                  <p className="text-[10px] uppercase font-black tracking-widest text-school-navy/30">Note: Answer sheets of final exams are not shown to parents/guardians.</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Discipline Section */}
        <section className="py-24 max-w-7xl mx-auto px-6 lg:px-12">
          <div className="bg-white rounded-[64px] p-12 lg:p-20 shadow-2xl relative overflow-hidden border border-slate-100">
             <div className="flex flex-col lg:flex-row gap-16">
                <div className="lg:w-1/3">
                  <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mb-8">
                    <ShieldAlert size={32} />
                  </div>
                  <h2 className="text-4xl font-serif font-black text-school-navy italic leading-tight mb-6 uppercase">Rules of Discipline</h2>
                  <p className="text-school-navy/50 font-light italic leading-relaxed">Maintaining the high tone of the school through conduct, manners, and integrity.</p>
                  <div className="mt-12 p-6 bg-school-navy rounded-3xl text-white">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-school-gold mb-2">Prohibited Items</p>
                    <p className="text-xs font-light text-white/70 italic leading-relaxed">Mobiles, Cameras, CDs, I-Pods, Explosives, or any dangerous materials are strictly forbidden. Confiscated items will not be returned.</p>
                  </div>
                </div>

                <div className="lg:w-2/3 grid sm:grid-cols-2 gap-8">
                  {[
                    { icon: <Clock size={20} />, title: "Punctuality", desc: "Arrive at least five minutes before the first bell. Prompt assembly is mandatory." },
                    { icon: <Users size={20} />, title: "Uniform", desc: "Habitually clean and neat dress. Uniform is mandatory for all school functions." },
                    { icon: <BookOpen size={20} />, title: "Student Diary", desc: "The official school diary must be brought to school every single day." },
                    { icon: <GraduationCap size={20} />, title: "Conduct", desc: "Excel in manners and cleanliness. patronizing street vendors is forbidden for health." },
                    { icon: <ShieldAlert size={20} />, title: "Property", desc: "Damages must be made good. Personal vehicles require valid licences; 4-wheelers not allowed." },
                    { icon: <Zap size={20} /> as any, title: "Class Order", desc: "Monitors assume responsibility for order if a teacher is delayed." }
                  ].map((rule, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.05 }}
                      className="p-8 border border-slate-50 rounded-[32px] hover:bg-slate-50 transition-colors group"
                    >
                      <div className="text-school-gold mb-4 group-hover:scale-110 transition-transform">{rule.icon}</div>
                      <h4 className="text-lg font-serif font-black text-school-navy mb-2 italic uppercase">{rule.title}</h4>
                      <p className="text-sm text-school-navy/60 leading-relaxed font-light">{rule.desc}</p>
                    </motion.div>
                  ))}
                </div>
             </div>
          </div>
        </section>

        {/* Final Statement */}
        <section className="py-24 text-center max-w-4xl mx-auto px-6">
           <motion.div
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             viewport={{ once: true }}
             className="space-y-6"
           >
             <p className="text-2xl font-serif font-black text-school-navy italic leading-relaxed">
               "The Jesuit school aims at making its own contribution towards a radical transformation of present day social justice, equality of opportunity, and genuine freedom."
             </p>
             <div className="w-16 h-1 bg-school-gold mx-auto"></div>
             <p className="text-xs font-black uppercase tracking-[0.4em] text-school-navy/30">Jesuit Mission Statement</p>
           </motion.div>
        </section>
      </div>
    </Layout>
  );
};

// Helper for the Zap icon (optional since it wasn't imported initially)
const Zap = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
);

export default JesuitEducationPage;
