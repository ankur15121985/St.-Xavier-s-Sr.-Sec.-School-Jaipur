import React from 'react';
import { motion } from 'motion/react';
import Layout from '../components/layout/Layout';
import { AppData } from '../types';

interface GoverningMember {
  name: string;
  role: string;
  designation: string;
  organization: string;
  type: 'Management' | 'Representative';
}

const GoverningMembersPage = ({ data }: { data: AppData }) => {
  const members: GoverningMember[] = [
    // Management Row
    { name: 'Sr. Sonia Saritha Moras, SCJM', role: 'Management', designation: 'Member', organization: 'St. Xavier\'s Sr. Sec. School, C-Scheme', type: 'Management' },
    { name: 'Fr. Arokya Swamy, S.J.', role: 'Management', designation: 'Member', organization: 'St. Xavier\'s College, Nevta', type: 'Management' },
    { name: 'Fr. S. Xavier, S.J.', role: 'Management', designation: 'Member', organization: 'St. Xavier\'s College, Nevta', type: 'Management' },
    { name: 'Fr. Madalaimuthu Anthoniappan, S.J. (Fr. Britto)', role: 'Management', designation: 'Member', organization: 'St. Xavier\'s School, C-Scheme, Jaipur', type: 'Management' },
    
    // Representatives
    { name: 'Sr. Cynthia', role: 'Educationist', designation: 'Educationist', organization: 'Sophia School Jaipur', type: 'Representative' },
    { name: 'Mr. Dinesh Yadav', role: 'Legal Advisor', designation: 'Legal Advisor', organization: 'Jaipur', type: 'Representative' },
    { name: 'Mr. Luv Shekhawat', role: 'Alumni Representative', designation: 'Alumni Representative', organization: 'Jaipur', type: 'Representative' },
    { name: 'Mr. M.P. Biju', role: 'Staff Representative', designation: 'Staff Representative', organization: 'St. Xavier\'s School, C-Scheme, Jaipur', type: 'Representative' },
    { name: 'Mrs. Kshama Sharma', role: 'Staff Representative', designation: 'Staff Representative', organization: 'St. Xavier\'s School, C-Scheme, Jaipur', type: 'Representative' },
    { name: 'Mr. Sumit Agarwal', role: 'Parent Representative', designation: 'Parent Representative', organization: 'Jaipur', type: 'Representative' },
    { name: 'Dr. Dheeraj Gupta', role: 'Parent Representative', designation: 'Parent Representative', organization: 'Jaipur', type: 'Representative' },
    { name: 'Mr. Rajiv Jain', role: 'Parent Representative', designation: 'Parent Representative', organization: 'Jaipur', type: 'Representative' },
  ];

  return (
    <Layout data={data}>
      <div className="pt-32 bg-slate-50 min-h-screen">
        {/* Header Section */}
        <section className="py-20 bg-school-navy relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
          </div>
          <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-5xl md:text-7xl font-serif font-black text-white tracking-tighter mb-6 italic">School Governing <br /> <span className="text-school-gold not-italic uppercase text-3xl md:text-4xl tracking-[0.3em]">Members</span></h1>
              <p className="text-white/50 text-xl font-light max-w-2xl mx-auto italic">Guiding the institutional journey with wisdom, integrity, and a commitment to excellence.</p>
            </motion.div>
          </div>
        </section>

        {/* Members Grid */}
        <section className="py-24 max-w-7xl mx-auto px-6 lg:px-12">
          
          {/* Management Collective */}
          <div className="mb-24">
            <div className="flex items-center gap-6 mb-12">
              <h2 className="text-3xl font-serif font-black text-school-navy underline decoration-school-gold decoration-4 underline-offset-8">Institutional Management</h2>
              <div className="flex-1 h-px bg-school-navy/10"></div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {members.filter(m => m.type === 'Management').map((member, idx) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass-surface p-8 rounded-[40px] border border-white shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group"
                >
                  <div className="w-16 h-16 bg-school-navy rounded-2xl flex items-center justify-center text-school-gold mb-8 group-hover:scale-110 transition-transform">
                    <span className="font-serif font-black text-2xl italic">M</span>
                  </div>
                  <h3 className="text-lg font-serif font-black text-school-navy mb-2 line-clamp-2 leading-tight h-12 uppercase">{member.name}</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-school-gold mb-4">{member.role}</p>
                  <div className="pt-4 border-t border-slate-100">
                    <p className="text-xs text-school-navy/50 font-medium leading-relaxed">{member.organization}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Representatives Council */}
          <div>
            <div className="flex items-center gap-6 mb-12">
              <h2 className="text-3xl font-serif font-black text-school-navy underline decoration-school-gold decoration-4 underline-offset-8">Strategic Representatives</h2>
              <div className="flex-1 h-px bg-school-navy/10"></div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {members.filter(m => m.type === 'Representative').map((member, idx) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group"
                >
                  <div className="inline-block px-4 py-1.5 bg-school-gold/10 rounded-full text-[9px] font-black uppercase tracking-widest text-school-gold mb-6">{member.role}</div>
                  <h3 className="text-lg font-serif font-black text-school-navy mb-4 group-hover:text-school-gold transition-colors">{member.name}</h3>
                  <div className="pt-4 border-t border-slate-100">
                    <p className="text-[10px] font-black uppercase tracking-widest text-school-navy/30 mb-1">Affiliation</p>
                    <p className="text-xs text-school-navy/60 font-light italic">{member.organization}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </section>
      </div>
    </Layout>
  );
};

export default GoverningMembersPage;
