import React from 'react';
import { motion } from 'motion/react';
import Layout from '../components/layout/Layout';
import { AppData } from '../types';
import { GraduationCap, Heart, Clock, AlertCircle } from 'lucide-react';

const ScholarshipPage = ({ data }: { data: AppData }) => {
  const hardcodedScholarships = [
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
    "Scholarship by Nabhi Bax & co.",
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

  const dynamicScholarships = (data.scholarships || []).filter(s => s.is_enabled !== false).sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
  
  // Logic to render different display types
  const renderScholarshipContent = () => {
    if (dynamicScholarships.length === 0) {
      return (
        <div className="text-center py-32 border-2 border-dashed border-school-ink/10 rounded-[64px]">
          <div className="w-16 h-16 bg-school-ink/5 rounded-3xl flex items-center justify-center text-school-ink/20 mx-auto mb-6">
            <AlertCircle size={32} />
          </div>
          <h3 className="text-xl font-serif font-black italic text-school-ink/40">No scholarships available at the moment.</h3>
          <p className="text-sm text-school-ink/30 mt-2">Please check back later for updates.</p>
        </div>
      );
    }

    const items = [];
    let currentTileGroup = [];

    const flushTiles = (group: any[]) => {
      if (group.length === 0) return null;
      const result = (
        <div key={`group-${group[0].id}`} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {group.map((s, idx) => (
            <motion.div 
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-[32px] p-10 border border-school-ink/5 shadow-xl hover:shadow-2xl transition-all group flex flex-col justify-between h-full"
            >
              <div>
                <h3 className="text-2xl font-serif font-black text-school-navy italic mb-2 leading-tight">{s.title}</h3>
                {s.heading && <p className="text-[10px] font-black uppercase tracking-widest text-school-gold mb-6">{s.heading}</p>}
                
                <div 
                  className="prose prose-sm prose-school text-school-ink/70 leading-relaxed font-light line-clamp-6 mb-8 group-hover:text-school-ink transition-colors" 
                  dangerouslySetInnerHTML={{ __html: s.content }} 
                />
              </div>

              {(s.attachmentUrl || s.image_url) && (
                <div className="pt-6 border-t border-school-ink/5 flex items-center justify-between mt-auto">
                  {s.attachmentUrl && (
                    <a 
                      href={s.attachmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-school-navy hover:text-school-gold transition-all"
                    >
                      View Details
                    </a>
                  )}
                  
                  <div className="w-8 h-8 bg-school-gold/10 rounded-lg flex items-center justify-center text-school-gold group-hover:scale-110 transition-transform">
                    <Award size={18} />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      );
      currentTileGroup = [];
      return result;
    };

    for (const s of dynamicScholarships) {
      if (s.display_type === 'heading') {
        const tiled = flushTiles(currentTileGroup);
        if (tiled) items.push(tiled);
        
        items.push(
          <motion.div 
            key={s.id} 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 mt-8"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-black text-school-navy italic tracking-tight mb-4">{s.title}</h2>
            {s.heading && <p className="text-[10px] font-black uppercase tracking-[0.4em] text-school-gold mb-4">{s.heading}</p>}
            <div className="w-24 h-1 bg-school-gold rounded-full"></div>
            {s.content && <div className="mt-8 prose prose-lg prose-school text-school-ink/60 font-light" dangerouslySetInnerHTML={{ __html: s.content }} />}
          </motion.div>
        );
      } else if (s.display_type === 'text') {
        const tiled = flushTiles(currentTileGroup);
        if (tiled) items.push(tiled);

        items.push(
          <motion.div 
            key={s.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-[40px] p-12 md:p-16 border border-school-ink/5 shadow-lg mb-16"
          >
            <h3 className="text-3xl font-serif font-black text-school-navy italic mb-6">{s.title}</h3>
            {s.heading && <p className="text-[10px] font-black uppercase tracking-widest text-school-gold mb-8">{s.heading}</p>}
            <div className="prose prose-lg prose-school max-w-none text-school-ink/70 leading-relaxed font-light" dangerouslySetInnerHTML={{ __html: s.content }} />
            
            {s.attachmentUrl && (
              <div className="mt-12 pt-8 border-t border-school-ink/5">
                <a 
                  href={s.attachmentUrl}
                  target="_blank"
                  className="inline-flex items-center gap-4 px-8 py-4 bg-school-navy text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-school-gold hover:text-school-navy transition-all"
                >
                  Download Supporting Document
                </a>
              </div>
            )}
          </motion.div>
        );
      } else {
        // Default to tile
        currentTileGroup.push(s);
      }
    }

    const tiled = flushTiles(currentTileGroup);
    if (tiled) items.push(tiled);

    return items;
  };

  return (
    <Layout data={data}>
      <div className="min-h-screen bg-school-paper font-sans selection:bg-school-gold/30 pb-24">
        {/* Header Section */}
        <section className="relative pt-40 pb-24 overflow-hidden border-b border-school-ink/5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(196,161,85,0.05),transparent_50%)]"></div>
          <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-school-gold mb-6 block">Support System</span>
              <h1 className="text-6xl md:text-8xl font-serif font-black text-school-navy italic leading-[0.9] tracking-tighter mb-8 lowercase">
                Scholarship <br/>& <span className="text-school-ink/20">Concessions</span>
              </h1>
              <p className="text-xl text-school-ink/60 font-light leading-relaxed">
                St. Xavier's Jaipur provides various scholarships and fee concessions to support meritorious and deserving students in their educational journey.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Dynamic Content Rendering */}
        <section className="py-24 max-w-7xl mx-auto px-6 lg:px-12">
          {renderScholarshipContent()}
        </section>

        {/* Management Note */}
        <section className="py-24 bg-school-navy text-white mt-12">
          <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
            <h2 className="text-3xl font-serif font-black italic mb-8">General Note</h2>
            <p className="text-xl text-white/50 font-light leading-relaxed italic">
              "The award of all fee concessions and instituted scholarships is at the sole discretion of the Management and is not a matter of right. Applications should be made at the beginning of the academic year."
            </p>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default ScholarshipPage;
