import React from 'react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import Layout from '../components/layout/Layout';
import { AppData } from '../types';
import { 
  Heart, 
  BookOpen, 
  Clock, 
  MessageCircle, 
  Users, 
  ShieldAlert, 
  CheckCircle2, 
  HandHeart,
  StickyNote,
  UserCheck2,
  Stethoscope,
  Info
} from 'lucide-react';

const ParentObligationsPage = ({ data }: { data: AppData }) => {
  const obligations = [
    {
      title: "Core Responsibilities",
      icon: <Heart className="text-school-gold" />,
      items: [
        "Familiarize with the School Diary and its rules.",
        "Check the Diary regularly and enforce discipline at home.",
        "Ensure lessons are prepared and assigned homework is completed.",
        "Countersign all remarks made in the Diary promptly.",
        "Notify the school immediately of any change in address."
      ]
    },
    {
      title: "Communication & Visits",
      icon: <MessageCircle className="text-school-gold" />,
      items: [
        "Appointments with teachers/Vice-Principals via the School Diary.",
        "Avoid visiting teachers or wards directly in classrooms.",
        "Contact the school office for urgent cases only.",
        "Avoid criticism of staff or the school in the presence of children.",
        "Direct legitimate complaints to the Principal personally."
      ]
    },
    {
      title: "Health & Safety",
      icon: <Stethoscope className="text-school-gold" />,
      items: [
        "Ill children should not be sent for classes or tests.",
        "Keep students home if suffering from contagious diseases (Chickenpox, etc.).",
        "A fitness certificate is mandatory for re-entry after illness.",
        "Ensure no sharp or dangerous articles are brought to school.",
        "Discourage bringing valuable articles; school lacks liability for loss."
      ]
    },
    {
      title: "Academic Engagement",
      icon: <Clock className="text-school-gold" />,
      items: [
        "Attend at least two Parent-Teacher Sessions annually (mandatory).",
        "Sign the register during PTMs to confirm active interest.",
        "Contact the Principal if progress is below expectations.",
        "Private tutoring requires prior permission from the Principal.",
        "No teacher is allowed to tutor children they teach in class."
      ]
    }
  ];

  const expectations = [
    {
      category: "School Expectations",
      items: [
        "Be available to discuss behavioral aspects when necessary.",
        "Sign progress reports and documents without delay.",
        "Ensure no absence on the first or last day of terms.",
        "Explain any leave taken duly in the school diary."
      ]
    },
    {
      category: "Staff Expectations",
      items: [
        "Contact teachers during free periods with prior permission.",
        "Be open to listening to teacher opinions, even if critical.",
        "Respect professional assessments of your child's progress."
      ]
    },
    {
      category: "Community Expectations",
      items: [
        "Exert discipline if behavior distracts other learners.",
        "Attach name tags to school blazers, jerseys, and pullovers.",
        "Foster respect for person, property, and environment."
      ]
    }
  ];

  return (
    <Layout data={data}>
      <Helmet>
        <title>Obligations of Parents | St. Xavier's Sr. Sec. School, Jaipur</title>
        <meta name="description" content="Guidelines and obligations for parents and guardians of St. Xavier's Jaipur. Fostering a partnership for student success." />
        <meta name="keywords" content="parents obligations, school guidelines jaipur, St. Xavier's parents, PTM jaipur, school diary rules" />
      </Helmet>

      <div className="pt-32 bg-school-paper min-h-screen">
        {/* Header Section */}
        <section className="py-24 bg-school-navy relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-school-gold rounded-full blur-[120px] -mr-48 -mt-48"></div>
          </div>
          <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-school-gold/20 rounded-2xl flex items-center justify-center mb-8">
                <HandHeart className="text-school-gold" size={32} />
              </div>
              <h1 className="text-4xl md:text-6xl font-serif font-black text-white tracking-tighter mb-6 italic uppercase">Obligations of <span className="text-school-gold">Parents</span></h1>
              <div className="w-24 h-1 bg-school-gold rounded-full mb-8"></div>
              <p className="text-white/60 text-lg md:text-xl font-light max-w-3xl mx-auto italic leading-relaxed">
                "The greater the co-operation between home and School, the more fruitful will the educational effort be and the faster and surer the child’s progress."
              </p>
            </motion.div>
          </div>
        </section>

        {/* Major Obligations Grid */}
        <section className="py-24 max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 gap-8">
            {obligations.map((group, idx) => (
              <motion.div
                key={group.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-school-paper rounded-[40px] border border-school-ink/10 shadow-sm p-10 hover:shadow-xl transition-all group"
              >
                <div className="flex items-center gap-5 mb-8">
                  <div className="w-14 h-14 bg-school-paper/50 rounded-2xl flex items-center justify-center group-hover:bg-school-navy group-hover:text-white transition-colors duration-500">
                    {group.icon}
                  </div>
                  <h3 className="text-2xl font-serif font-black text-school-navy italic uppercase tracking-tight">{group.title}</h3>
                </div>
                <ul className="space-y-4">
                  {group.items.map((item, i) => (
                    <li key={i} className="flex gap-4 text-school-ink/60 group/item">
                      <CheckCircle2 size={18} className="text-school-gold shrink-0 mt-1 opacity-40 group-hover/item:opacity-100 transition-opacity" />
                      <span className="text-sm font-medium leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Expectation Tables */}
        <section className="py-24 bg-school-paper border-y border-school-ink/10">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-serif font-black text-school-ink italic uppercase tracking-tight">Expectations & Standards</h2>
              <p className="text-school-ink/40 text-xs font-black uppercase tracking-[0.3em] mt-4">The Partnership Framework</p>
            </div>

            <div className="space-y-8">
              {expectations.map((table, idx) => (
                <div key={table.category} className="overflow-hidden rounded-[32px] border border-school-ink/10 shadow-sm">
                  <div className="bg-school-navy p-6 flex items-center justify-between">
                    <h3 className="text-white font-serif font-bold italic tracking-wide">{table.category}</h3>
                    <Users className="text-school-gold/50" size={20} />
                  </div>
                  <div className="p-8 bg-school-paper/50">
                    <div className="grid md:grid-cols-2 gap-6">
                      {table.items.map((text, i) => (
                        <div key={i} className="bg-school-paper p-6 rounded-2xl border border-school-ink/10 flex gap-4">
                          <span className="text-school-gold font-serif font-black italic">0{i+1}.</span>
                          <p className="text-sm text-school-ink/60 leading-relaxed font-medium">{text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Class XII Specific & Recommendations */}
        <section className="py-24 bg-school-paper">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Class XII Alert */}
              <div className="lg:col-span-1 bg-school-gold rounded-[40px] p-10 text-school-navy relative overflow-hidden group">
                <ShieldAlert className="absolute -top-10 -right-10 w-40 h-40 opacity-10 group-hover:rotate-12 transition-transform duration-700" />
                <h3 className="text-2xl font-serif font-black italic uppercase mb-6 flex items-center gap-3">
                  Class XII <span className="p-1 px-2 bg-school-navy text-white text-[10px] rounded flex items-center">Alert</span>
                </h3>
                <p className="font-bold text-sm leading-relaxed mb-6">
                  Parents must ensure their ward gives the Pre-Board examination and clears all subjects with a minimum of 33%.
                </p>
                <div className="pt-6 border-t border-school-navy/10 mt-auto">
                  <UserCheck2 className="mb-2" />
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Statutory Requirement</span>
                </div>
              </div>

              {/* General Recommendations */}
              <div className="lg:col-span-2 bg-school-paper rounded-[40px] p-12 border border-school-ink/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8">
                  <StickyNote className="text-school-ink/5 opacity-40 shrink-0" size={120} />
                </div>
                <h3 className="text-3xl font-serif font-black text-school-ink italic uppercase mb-10 relative z-10">Institutional Recommendations</h3>
                <div className="grid md:grid-cols-2 gap-x-12 gap-y-8 relative z-10 text-justify">
                  <div className="space-y-4">
                    <p className="text-sm font-bold text-school-ink underline decoration-school-gold decoration-2 underline-offset-4 mb-4 text-left">Academic Hygiene</p>
                    <p className="text-sm text-school-ink/60 leading-relaxed">Remain regularly in touch with day-to-day studies and keep contact with the school.</p>
                    <p className="text-sm text-school-ink/60 leading-relaxed italic">Private tuitions are strongly discouraged; foster independent working habits.</p>
                  </div>
                  <div className="space-y-4">
                    <p className="text-sm font-bold text-school-ink underline decoration-school-gold decoration-2 underline-offset-4 mb-4 text-left">Official Conduct</p>
                    <p className="text-sm text-school-ink/60 leading-relaxed">Always state full name, registration number, class, and roll number in official correspondence.</p>
                    <p className="text-sm text-school-ink/60 leading-relaxed">Ensure bags are packed according to the timetable every day to avoid over-loading.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Disclaimer/Footer Note */}
        <section className="py-24 text-center max-w-4xl mx-auto px-6">
          <div className="p-12 glass-surface rounded-[48px] border border-school-ink/10">
            <Info className="mx-auto text-school-gold mb-6" size={40} />
            <p className="text-xl font-serif font-bold text-school-ink italic leading-relaxed mb-4">
              "Respect for person, property and environment should be inculcated in children."
            </p>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-school-ink/30">St. Xavier's Secondary School, Jaipur</p>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default ParentObligationsPage;
