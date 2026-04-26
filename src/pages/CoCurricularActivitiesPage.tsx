import React from 'react';
import { motion } from 'motion/react';
import Layout from '../components/layout/Layout';
import { AppData } from '../types';
import { 
  Users, 
  ShieldCheck, 
  Trophy, 
  Music, 
  Palette, 
  Globe, 
  Camera, 
  Microscope,
  Award,
  Heart
} from 'lucide-react';

const CoCurricularActivitiesPage = ({ data }: { data: AppData }) => {
  const sportsActivities = [
    "Hand Ball", "Basketball", "Volleyball", "Football", "Baseball", 
    "Tennis", "Table Tennis", "Swimming", "Cricket", "Squash", 
    "Shooting", "Badminton"
  ];

  const culturalActivities = [
    "Debate", "Elocution", "Music Contest", "Dance Festival", 
    "Dramatics", "Painting", "Snooker", "Aerobics"
  ];

  const clubsAndSocieties = [
    "Xavier Literature Club",
    "Xavier Philatelic Club",
    "Xavier Interact Club",
    "Xavier Inquisitive Club (Senior)",
    "Xavier Inquisitive Club (Junior)",
    "Xavier Orchestra",
    "Xavier Dance Club",
    "Xavier Creative Artist’s Club",
    "Xavier Science Club",
    "Xavier Debating Society",
    "Xavier Photography Club",
    "Taru Mitra"
  ];

  const serviceAndPrograms = [
    "Program for the spread of literacy",
    "Social Service Program",
    "N.C.C.",
    "Scout",
    "L.T.S.",
    "The School Magazine",
    "Exhibition",
    "The Annual Sports Meet",
    "The Xavier Fair"
  ];

  return (
    <Layout data={data}>
      <div className="pt-32 bg-school-paper min-h-screen">
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
              <h1 className="text-5xl md:text-7xl font-serif font-black text-white tracking-tighter mb-6 italic">Co-Curricular <br /> <span className="text-school-gold not-italic uppercase text-3xl md:text-4xl tracking-[0.3em]">Activities</span></h1>
              <p className="text-white/50 text-xl font-light max-w-3xl mx-auto italic">Developing sound principles of conduct and action through steady supervision and guidance.</p>
            </motion.div>
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="py-24 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <p className="text-2xl md:text-3xl font-serif font-black text-school-ink italic leading-tight">
              "Honesty, trust, cooperation, self-reliance, and hard work are inculcated through various school activities. In these, the student learns to do things for themselves under guidance."
            </p>
            <div className="w-24 h-1 bg-school-gold mx-auto"></div>
          </motion.div>
        </section>

        {/* Systems Section */}
        <section className="py-16 max-w-7xl mx-auto px-6 lg:px-12 grid md:grid-cols-2 gap-12">
          {/* House System */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-surface bg-school-paper/50 p-12 rounded-[48px] border border-school-ink/10 shadow-xl space-y-8"
          >
            <div className="w-16 h-16 bg-school-gold/10 rounded-2xl flex items-center justify-center text-school-gold">
              <Users size={32} />
            </div>
            <h2 className="text-3xl font-serif font-black text-school-ink italic uppercase">House System</h2>
            <div className="space-y-4">
              <div className="flex gap-2">
                {['Blues', 'Golds', 'Greens', 'Reds'].map(h => (
                  <span key={h} className="px-4 py-1 bg-school-paper/50 border border-school-ink/5 rounded-full text-[10px] uppercase font-black tracking-widest text-school-ink">{h}</span>
                ))}
              </div>
              <p className="text-school-ink/70 leading-relaxed font-light">
                Activities like dramatics, elocution, sports and games are conducted under the guidance of the Vice-Principals and House Moderators assisted by Captains and Cultural Secretaries.
              </p>
            </div>
          </motion.div>

          {/* Prefect System */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-surface bg-school-navy p-12 rounded-[48px] shadow-xl text-white space-y-8"
          >
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-school-gold">
              <ShieldCheck size={32} />
            </div>
            <h2 className="text-3xl font-serif font-black italic uppercase text-school-gold">Prefect System</h2>
            <p className="text-white/70 leading-relaxed font-light">
              It is a body of students appointed by the Principal, functioning under the guidance of the Vice-Principals to maintain the high standards of discipline and order within the school.
            </p>
          </motion.div>
        </section>

        {/* Office Bearers Section */}
        <section className="py-24 max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-16 text-center">
            <h2 className="text-4xl md:text-5xl font-serif font-black text-school-ink italic tracking-tight uppercase">School Office Bearers</h2>
            <div className="w-24 h-1 bg-school-gold mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                category: "Sports", 
                roles: ["General Captain", "Asst. General Captain", "House Captains"],
                icon: <Trophy size={20} className="text-school-gold" />
              },
              { 
                category: "Cultural", 
                roles: ["Gen. Cultural Secretary", "Asst. Gen. Cultural Secretary", "House Cult. Secretary"],
                icon: <Music size={20} className="text-school-gold" />
              },
              { 
                category: "Discipline", 
                roles: ["Head Prefects (Boy & Girl)", "Prefects"],
                icon: <ShieldCheck size={20} className="text-school-gold" />
              }
            ].map((dept, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-10 border border-school-ink/5 bg-school-paper/50 rounded-[40px] shadow-lg hover:shadow-2xl transition-all"
              >
                <div className="flex items-center gap-4 mb-8">
                   {dept.icon}
                   <h3 className="text-xl font-serif font-black text-school-ink italic uppercase">{dept.category}</h3>
                </div>
                <ul className="space-y-4 text-sm text-school-ink/60 font-light italic">
                  {dept.roles.map(r => <li key={r} className="border-b border-school-ink/5 pb-2 last:border-0">{r}</li>)}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Comprehensive Activities Grid */}
        <section className="py-24 bg-school-paper border-y border-school-ink/5">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="grid lg:grid-cols-4 gap-16">
              
              {/* Sports Column */}
              <div className="space-y-8">
                <div className="flex items-center gap-3">
                  <Trophy size={20} className="text-school-ink" />
                  <h4 className="text-lg font-serif font-black text-school-ink italic uppercase">Athletics</h4>
                </div>
                <div className="grid gap-3">
                  {sportsActivities.map(a => (
                    <div key={a} className="text-xs font-black uppercase tracking-widest text-school-ink/50">{a}</div>
                  ))}
                </div>
              </div>

              {/* Cultural Column */}
              <div className="space-y-8">
                <div className="flex items-center gap-3">
                  <Palette size={20} className="text-school-ink" />
                  <h4 className="text-lg font-serif font-black text-school-ink italic uppercase">Arts & Culture</h4>
                </div>
                <div className="grid gap-3">
                  {culturalActivities.map(a => (
                    <div key={a} className="text-xs font-black uppercase tracking-widest text-school-ink/50">{a}</div>
                  ))}
                </div>
              </div>

              {/* Clubs Column */}
              <div className="space-y-8">
                <div className="flex items-center gap-3">
                  <Microscope size={20} className="text-school-ink" />
                  <h4 className="text-lg font-serif font-black text-school-ink italic uppercase">Societies</h4>
                </div>
                <div className="grid gap-3">
                  {clubsAndSocieties.map(a => (
                    <div key={a} className="text-xs font-black uppercase tracking-widest text-school-ink/50">{a}</div>
                  ))}
                </div>
              </div>

              {/* Programs Column */}
              <div className="space-y-8">
                <div className="flex items-center gap-3">
                  <Heart size={20} className="text-school-ink" />
                  <h4 className="text-lg font-serif font-black text-school-ink italic uppercase">Service</h4>
                </div>
                <div className="grid gap-3">
                  {serviceAndPrograms.map(a => (
                    <div key={a} className="text-xs font-black uppercase tracking-widest text-school-ink/50">{a}</div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Closing Image Grid */}
        <section className="py-24">
           <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="aspect-video bg-school-ink/5 rounded-[32px] overflow-hidden group">
                 <img src="https://picsum.photos/seed/debate/800/600" alt="Debate" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 hover:scale-110" referrerPolicy="no-referrer" />
              </div>
              <div className="aspect-video bg-school-ink/5 rounded-[32px] overflow-hidden group md:mt-12">
                 <img src="https://picsum.photos/seed/music/800/600" alt="Music" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 hover:scale-110" referrerPolicy="no-referrer" />
              </div>
              <div className="aspect-video bg-school-ink/5 rounded-[32px] overflow-hidden group">
                 <img src="https://picsum.photos/seed/science/800/600" alt="Science" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 hover:scale-110" referrerPolicy="no-referrer" />
              </div>
              <div className="aspect-video bg-school-ink/5 rounded-[32px] overflow-hidden group md:mt-12">
                 <img src="https://picsum.photos/seed/social/800/600" alt="Social Service" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 hover:scale-110" referrerPolicy="no-referrer" />
              </div>
           </div>
        </section>
      </div>
    </Layout>
  );
};

export default CoCurricularActivitiesPage;
