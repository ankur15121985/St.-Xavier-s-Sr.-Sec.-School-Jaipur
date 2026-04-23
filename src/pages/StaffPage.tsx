import React from 'react';
import { AppData } from '../types';
import { PerspectiveCard } from '../components/ui/PerspectiveCard';
import { Users2 } from 'lucide-react';
import Layout from '../components/layout/Layout';

const StaffPage = ({ data }: { data: AppData }) => {
  const renderTable = (members: any[], title: string) => (
    <div className="mb-24 last:mb-0">
      <div className="flex items-center gap-6 mb-12">
        <h4 className="text-3xl font-sans font-black text-school-ink capitalize italic">{title}</h4>
        <div className="flex-1 h-px bg-white/20"></div>
      </div>
      <div className="overflow-x-auto rounded-[32px] border border-white/40 shadow-2xl backdrop-blur-3xl bg-white/20">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-school-accent/80 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[0.2em]">
              <th className="p-8 border-b border-white/10 w-16">S.No</th>
              <th className="p-8 border-b border-white/10">Employee Name</th>
              <th className="p-8 border-b border-white/10">Designation</th>
              <th className="p-8 border-b border-white/10">Appointment Details</th>
            </tr>
          </thead>
          <tbody className="text-school-ink text-sm">
            {members.map((s, i) => (
              <tr key={s.id} className="hover:bg-white/30 transition-colors border-b border-white/10 last:border-none group">
                <td className="p-8 font-black text-school-accent text-xs">{i + 1}</td>
                <td className="p-8">
                  <div className="flex items-center gap-4">
                    {s.image ? (
                      <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-white/40 shadow-sm">
                        <img src={s.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center shrink-0">
                        <Users2 size={16} className="text-school-ink/30" />
                      </div>
                    )}
                    <span className="font-black tracking-tight">{s.name}</span>
                  </div>
                </td>
                <td className="p-8">
                  <span className="text-[10px] font-black uppercase tracking-widest text-school-accent bg-white/40 px-3 py-1 rounded-full border border-white/20">
                    {s.role}
                  </span>
                </td>
                <td className="p-8">
                  <p className="text-xs text-school-ink/60 leading-relaxed font-medium italic">{s.bio}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <Layout data={data}>
      <section className="pt-24 pb-40 bg-transparent">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center mb-32">
           <h2 className="text-[12vw] md:text-9xl font-sans font-black text-school-ink tracking-tighter leading-none mb-8">Modern <br /><span className="text-school-accent italic">Leadership.</span></h2>
           <p className="text-2xl text-school-ink/50 font-medium max-w-2xl mx-auto">Mentorship and excellence driven by a dedicated team of educators and administrators committed to holistic development.</p>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* Management (Cards) */}
          <div className="mb-32">
            <div className="flex items-center gap-6 mb-16">
              <h3 className="text-5xl font-sans font-black text-school-ink tracking-tighter capitalize italic">Archive. <span className="not-italic text-school-accent">Management</span></h3>
              <div className="flex-1 h-2 bg-white/20 rounded-full"></div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
              {data.staff.filter(s => s.type === 'Management').map((s, i) => (
                <PerspectiveCard key={s.id} delay={i * 0.1}>
                  <div className="bg-white/40 backdrop-blur-3xl p-10 rounded-[40px] flex flex-col h-full group border border-white/60 shadow-xl hover:shadow-2xl transition-all duration-500">
                    <div className="w-full h-64 rounded-[32px] mb-8 shadow-xl overflow-hidden bg-white/30 relative group-hover:-translate-y-2 transition-transform duration-500">
                      <img src={s.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={s.name} referrerPolicy="no-referrer" />
                      <div className="absolute top-6 right-6 px-4 py-2 bg-school-accent text-white rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-sm">
                        Management
                      </div>
                    </div>
                    <h4 className="text-2xl font-sans font-black text-school-ink mb-3 group-hover:text-school-accent transition-colors">{s.name}</h4>
                    <p className="text-[10px] uppercase font-black tracking-[0.2em] text-school-accent mb-6 border-b border-school-accent/20 pb-4">{s.role}</p>
                    <p className="text-sm text-school-ink/60 font-medium leading-relaxed italic">{s.bio}</p>
                  </div>
                </PerspectiveCard>
              ))}
            </div>
          </div>

          {/* Administration (Coordinators as Cards, others as Table) */}
          <div className="mb-32">
            <div className="flex items-center gap-6 mb-16">
              <h3 className="text-4xl font-sans font-black text-school-ink tracking-tighter capitalize italic">Administration</h3>
              <div className="flex-1 h-px bg-white/20"></div>
            </div>
            
            {/* Senior Administration / Coordinators */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 mb-24">
              {data.staff.filter(s => s.type === 'Administration' && s.role.includes('COORDINATOR')).map((s, i) => (
                <PerspectiveCard key={s.id} delay={i * 0.1}>
                  <div className="bg-white/40 backdrop-blur-3xl p-10 rounded-[40px] flex flex-col h-full group border border-white/60 shadow-xl hover:shadow-2xl transition-all duration-500">
                    <div className="w-full h-64 rounded-[32px] mb-8 shadow-xl overflow-hidden bg-white/30 relative group-hover:-translate-y-2 transition-transform duration-500">
                      <img src={s.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={s.name} referrerPolicy="no-referrer" />
                    </div>
                    <h4 className="text-2xl font-sans font-black text-school-ink mb-3 group-hover:text-school-accent transition-colors">{s.name}</h4>
                    <p className="text-[10px] uppercase font-black tracking-[0.2em] text-school-accent mb-6 border-b border-school-accent/20 pb-4">{s.role}</p>
                    <p className="text-sm text-school-ink/60 font-medium leading-relaxed italic">{s.bio}</p>
                  </div>
                </PerspectiveCard>
              ))}
            </div>

            {/* Support Administration Staff */}
            {renderTable(data.staff.filter(s => s.type === 'Administration' && !s.role.includes('COORDINATOR')), 'Office Administrative Staff')}
          </div>

          {/* Faculty Groups (Tables) */}
          <div className="mb-32">
            <div className="flex items-center gap-6 mb-16">
              <h3 className="text-4xl font-sans font-black text-school-ink tracking-tighter capitalize italic">Teaching Faculty</h3>
              <div className="flex-1 h-px bg-white/20"></div>
            </div>
            
            {renderTable(data.staff.filter(s => s.type === 'Faculty' && s.role === 'PGT'), 'Post Graduate Teachers (PGT)')}
            {renderTable(data.staff.filter(s => s.type === 'Faculty' && s.role === 'TGT'), 'Trained Graduate Teachers (TGT)')}
            {renderTable(data.staff.filter(s => s.type === 'Faculty' && s.role === 'PRT'), 'Primary Teachers (PRT)')}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default StaffPage;
