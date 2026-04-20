import React from 'react';
import { AppData } from '../types';
import { PerspectiveCard } from '../components/ui/PerspectiveCard';
import { Users2 } from 'lucide-react';
import Layout from '../components/layout/Layout';

const StaffPage = ({ data }: { data: AppData }) => {
  const types: ('Management' | 'Faculty' | 'Administration')[] = ['Management', 'Faculty', 'Administration'];
  
  return (
    <Layout links={data.links}>
      <section className="pt-48 pb-40 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center mb-24">
           <h2 className="text-7xl font-serif font-black text-school-navy mb-8">Institutional <span className="text-school-gold italic">Leadership.</span></h2>
           <p className="text-xl text-school-navy/50 font-light max-w-2xl mx-auto">Mentorship and excellence driven by a dedicated team of educators and administrators committed to holistic development.</p>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* Categories */}
          {['Management', 'Administration', 'Faculty'].map((type) => {
            const members = data.staff.filter(s => s.type === type);
            if (members.length === 0) return null;

            return (
              <div key={type} className="mb-32 last:mb-0">
                <div className="flex items-center gap-6 mb-16">
                  <h3 className="text-4xl font-serif font-black text-school-navy capitalize">{type}</h3>
                  <div className="flex-1 h-px bg-slate-100"></div>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                  {members.map((s, i) => (
                    <PerspectiveCard key={s.id} delay={i * 0.1}>
                      <div className="glass-card p-10 rounded-[40px] flex flex-col h-full group border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500">
                        <div className="w-full h-64 rounded-[32px] mb-8 shadow-xl overflow-hidden bg-slate-100 relative group-hover:-translate-y-2 transition-transform duration-500">
                          {s.image ? (
                            <img src={s.image} className="w-full h-full object-cover" alt={s.name} referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-school-navy/5">
                              <Users2 size={64} className="text-school-navy/10" />
                            </div>
                          )}
                          <div className="absolute top-6 right-6 px-4 py-2 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-school-navy shadow-sm">
                            {type}
                          </div>
                        </div>
                        <h4 className="text-2xl font-serif font-black text-school-navy mb-3 group-hover:text-school-gold transition-colors">{s.name}</h4>
                        <p className="text-[10px] uppercase font-black tracking-[0.2em] text-school-gold mb-6 border-b border-school-gold/20 pb-4">{s.role}</p>
                        <p className="text-sm text-school-navy/60 font-light leading-relaxed italic">{s.bio}</p>
                      </div>
                    </PerspectiveCard>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </Layout>
  );
};

export default StaffPage;
