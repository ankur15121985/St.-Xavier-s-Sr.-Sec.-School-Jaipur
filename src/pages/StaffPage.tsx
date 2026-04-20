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
          {['Management', 'Faculty', 'Administration'].map((type) => (
            <div key={type} className="mb-32 last:mb-0">
              <div className="flex items-center gap-6 mb-16">
                <h3 className="text-4xl font-serif font-black text-school-navy capitalize">{type}</h3>
                <div className="flex-1 h-px bg-slate-100"></div>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
                {data.staff.filter(s => s.type === type).map((s, i) => (
                  <PerspectiveCard key={s.id} delay={i * 0.1}>
                    <div className="glass-card p-8 rounded-[32px] flex flex-col items-center text-center h-full group">
                      <div className="w-32 h-32 rounded-3xl mb-8 shadow-xl overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-200 group-hover:scale-105 transition-transform duration-500">
                        {s.image ? (
                          <img src={s.image} className="w-full h-full object-cover" alt={s.name} referrerPolicy="no-referrer" />
                        ) : (
                          <Users2 size={48} className="text-slate-300" />
                        )}
                      </div>
                      <h4 className="text-2xl font-serif font-black text-school-navy mb-2">{s.name}</h4>
                      <p className="text-[10px] uppercase font-black tracking-widest text-school-gold mb-6">{s.role}</p>
                      <p className="text-sm text-school-navy/50 font-light line-clamp-3 leading-relaxed">{s.bio}</p>
                    </div>
                  </PerspectiveCard>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default StaffPage;
