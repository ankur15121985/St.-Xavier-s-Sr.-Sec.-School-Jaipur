import React from 'react';
import { motion } from 'motion/react';
import Layout from '../components/layout/Layout';
import { AppData } from '../types';
import { GraduationCap, Heart, Clock, AlertCircle } from 'lucide-react';

const ScholarshipPage = ({ data }: { data: AppData }) => {
  const scholarships = [
    "Piyush Kasliwal Memorial Scholarship for a needy student of grade III in memory of Piyush who passed away in 1977, while he was in grade II. This has been instituted by his parents.",
    "Rev. Fr. Joe Willmes Scholarship instituted by the ex-hostelers of St. Xavier’s Jaipur.",
    "Rakesh Pande Memorial Scholarship instituted by his father.",
    "Rev. Fr. Rosenfelder Scholarship instituted by the Jubilee Batch of 74 (XA)",
    "Kanishka Dhadda Memorial Scholarship instituted by Mr. Bimal Dhadda in memory of his son, (grade III D- 2002)",
    "Scholarship by Ledochowski Family from Austria.",
    "Scholarship by Xavier’s Jaipur Scholarship Fund initiated by Dr. Anurag Govil, Nikhil Pandit, Pankaj Jain, Suneet Bagai and supported by Dr. A.Q. Khan (Late Iqbal Fatima Khan), Ashish Singhvi, Ankit Bagai, Gobindram Sajandas Bijlani, Hemanshu Sehgal, Poppy Dandiya, Pradeep Sen, Rajeev Tatiwala, Vivek Jain, Nazma Bano, Dr. Sanjeev Hooja, Sudhir Paliwal, Batch 1979, 1982 & 1986",
    "Scholarship through Xavier’s Jaipur Scholarship Fund by Golden Jubilee Batch of 1961.",
    "Scholarship through Xavier’s Jaipur Scholarship fund Consul family – Dr. B.N. Consul.",
    "Scholarship through Xaviers’s Jaipur Scholarship fund Bhagat Dugar, Late Sohan Lalji Dugar.",
    "Scholarship through Xavier’s Jaipur Scholarship Fund Singhal Foundation - 2 Scholarship.",
    "Salil Capoor Memorial scholarship for two students.",
    "Scholarship by Mr. Vinod Singhal.",
    "Scholarship by Mrs. Dolly Sogani.",
    "Scholarship to female child by Mr. Dinesh Arora.",
    "Scholarship by Prempujariji Trust by Anil Salecha (1984 Alumni)",
    "Scholarship by St. Xavier’s Parish, Jaipur.",
    "Scholarship by Xavier’s 1996 batch: Sharad Jain, Rahul Sharma, Ashish Garg, Anurag Jain & Ankur Shandilya.",
    "Scholarship by Mr. Jitendra Pilani in Memory of Smt. & Shri O.P. Pilani.",
    "Scholarship in memory of Mr. Nizabat Ali Khan.",
    "Scholarship by Inderlal Ram Kishore Derewala Charitable Trust.",
    "Scholarship in memory of “Lt Col. Dr. Dwarka Prasad Puri”",
    "Scholarship by Jaidev Totlani.",
    "Merit Scholarship in memory of Dr. Leela Sen to the topper of Std. XII.",
    "Scholarship by Mrs. Kailash Devi Ajmera in memory of Late Sukumar Ajmera.",
    "Scholarship by Nabhi Bax & Co.",
    "Scholarship by Nitin Ahuja (1995 batch)",
    "Scholarship by Rajeev Bafna.",
    "Scholarship by Krishna Kumari Gupta Scholarship.",
    "Scholarship by Mayaram Foundation of Class XI & XII.",
    "Scholarship by Mayaram Foundation to Student for Higher Education.",
    "Scholarship by Amit Kr. Makharia.",
    "Scholarship by Sameer Jain & family.",
    "Scholarship by Girish Mehta & family.",
    "Scholarship by Devender Joshi.",
    "Scholarship by K. Jai Singh Ajairajpura in memory of his father Late Th. Major Ram Singh ji Ajairajpura for a needy boy of class VI till XII.",
    "Scholarship by K. Jai Singh Ajairajpura in memory of his mother Late Smt. Sobhagwati Ram Singh ji Sahiba for a needy girl of Class VI till XII.",
    "Scholarship by Vijay Saraswat (1977 Alumini) in memory of Dr. Rukmini Saraswat.",
    "Scholarship by Dr. Patricia Vickers.",
    "Scholarship instituted by Alok Singhvi Memorial trust.",
    "Scholarship in memory of Lt. Col. V.S. Lather."
  ];

  return (
    <Layout data={data}>
      <div className="pt-32 bg-school-paper min-h-screen">
        {/* Banner Section */}
        <section className="py-20 bg-school-navy relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
          </div>
          <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-5xl md:text-7xl font-serif font-black text-white tracking-tighter mb-6 italic">Scholarship <br /> <span className="text-school-gold not-italic uppercase text-3xl md:text-4xl tracking-[0.3em]">& Fee Concessions</span></h1>
              <p className="text-white/50 text-xl font-light max-w-2xl mx-auto italic">Empowering excellence and supporting those in need.</p>
            </motion.div>
          </div>
        </section>

        {/* Policy Section */}
        <section className="py-16 max-w-5xl mx-auto px-6 lg:px-12 relative z-10 -mt-12">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-surface bg-school-paper p-10 rounded-[48px] border border-school-ink/10 shadow-xl flex flex-col gap-6"
            >
              <div className="w-12 h-12 bg-school-gold/10 rounded-2xl flex items-center justify-center text-school-gold">
                <GraduationCap size={24} />
              </div>
              <h2 className="text-2xl font-serif font-black text-school-ink italic">General Provisions</h2>
              <div className="space-y-4 text-school-ink/70 font-light leading-relaxed">
                <p>
                  The School provides scholarships to the socially and economically disadvantaged students selected from the Balwadi run by the school.
                </p>
                <p>
                  Concession in fees is awarded in very deserving cases, the amount depending on individual circumstances. Parents may apply to the Principal in case of financial stringency.
                </p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-surface bg-school-paper p-10 rounded-[48px] border border-school-ink/10 shadow-xl flex flex-col gap-6"
            >
              <div className="w-12 h-12 bg-blue-50/10 rounded-2xl flex items-center justify-center text-school-ink">
                <Clock size={24} />
              </div>
              <h2 className="text-2xl font-serif font-black text-school-ink italic">Terms and Deadlines</h2>
              <div className="space-y-4 text-school-ink/70 font-light leading-relaxed">
                <p>
                  All concessions and scholarships cease at the end of each academic year. Grant or renewal is subject to satisfactory progress and good conduct.
                </p>
                <div className="bg-red-50/10 p-4 rounded-2xl flex items-start gap-4 text-red-600 border border-red-100/10">
                  <AlertCircle size={20} className="shrink-0 mt-1" />
                  <p className="text-sm font-medium italic">
                    A student who does not secure at least 50 per cent marks or fails in a term, forfeits his/her concession/scholarship.
                  </p>
                </div>
                <p className="font-bold text-school-ink">
                  Deadline: All applications (including renewals) must be made before 15 April.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Scholarships List */}
        <section className="py-16 max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-12">
            <h2 className="text-4xl font-serif font-black text-school-ink italic tracking-tight mb-4">Instituted Scholarships</h2>
            <p className="text-school-ink/50 font-light italic">By our generous parents and well-wishers</p>
            <div className="w-24 h-1 bg-school-gold mt-6 rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scholarships.map((s, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (idx % 10) * 0.05 }}
                className="p-8 bg-school-paper border border-school-ink/5 rounded-[32px] hover:shadow-lg transition-all group"
              >
                <p className="text-sm text-school-ink/70 leading-relaxed font-light group-hover:text-school-ink transition-colors">
                  {s}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-24 max-w-5xl mx-auto px-6 lg:px-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-school-navy rounded-[64px] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl"
          >
            <div className="absolute inset-0 bg-school-gold/5 blur-3xl rounded-full"></div>
            <div className="relative z-10 space-y-8">
              <div className="w-16 h-16 bg-school-gold rounded-full flex items-center justify-center text-school-navy mx-auto mb-6">
                <Heart size={32} />
              </div>
              <h2 className="text-3xl md:text-5xl font-serif font-black text-white italic">Invitation to Support</h2>
              <div className="max-w-2xl mx-auto space-y-6 text-white/70 text-lg font-light leading-relaxed italic">
                <p>
                  Parents are invited to establish Memorial scholarships, thus perpetuating the memory of a cherished one as well as helping in the education of someone who otherwise would not have had the chance.
                </p>
                <p>
                  You are also invited to aid the school in the education of poor children. Contributions can be made quarterly with your child's fees.
                </p>
              </div>
              <div className="pt-8">
                <button className="px-10 py-5 bg-school-gold text-school-navy rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-xl">
                  Obtain Commitment Form
                </button>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </Layout>
  );
};

export default ScholarshipPage;
