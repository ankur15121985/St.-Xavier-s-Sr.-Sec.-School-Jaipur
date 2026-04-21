import React from 'react';
import { AppData } from '../types';
import { PerspectiveCard } from '../components/ui/PerspectiveCard';
import { Users2 } from 'lucide-react';
import Layout from '../components/layout/Layout';

const StaffPage = ({ data }: { data: AppData }) => {
  const renderTable = (members: any[], title: string) => (
    <div className="mb-24 last:mb-0">
      <div className="flex items-center gap-6 mb-12">
        <h4 className="text-2xl font-serif font-black text-school-navy capitalize">{title}</h4>
        <div className="flex-1 h-px bg-slate-100"></div>
      </div>
      <div className="overflow-x-auto rounded-[32px] border border-slate-100 shadow-xl">
        <table className="w-full text-left border-collapse bg-white">
          <thead>
            <tr className="bg-school-navy text-white text-[10px] font-black uppercase tracking-[0.2em]">
              <th className="p-8 border-b border-white/10 w-16">S.No</th>
              <th className="p-8 border-b border-white/10">Employee Name</th>
              <th className="p-8 border-b border-white/10">Designation</th>
              <th className="p-8 border-b border-white/10">Appointment Details</th>
            </tr>
          </thead>
          <tbody className="text-school-navy text-sm">
            {members.map((s, i) => (
              <tr key={s.id} className="hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-none group">
                <td className="p-8 font-black text-school-gold text-xs">{i + 1}</td>
                <td className="p-8">
                  <div className="flex items-center gap-4">
                    {s.image ? (
                      <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-slate-200">
                        <img src={s.image} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                        <Users2 size={16} className="text-slate-400" />
                      </div>
                    )}
                    <span className="font-black tracking-tight">{s.name}</span>
                  </div>
                </td>
                <td className="p-8">
                  <span className="text-[10px] font-black uppercase tracking-widest text-school-navy/40 bg-slate-100 px-3 py-1 rounded-full">
                    {s.role}
                  </span>
                </td>
                <td className="p-8">
                  <p className="text-xs text-school-navy/60 leading-relaxed font-light italic">{s.bio}</p>
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
      <section className="pt-48 pb-40 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center mb-24">
           <h2 className="text-7xl font-serif font-black text-school-navy mb-8">Institutional <span className="text-school-gold italic">Leadership.</span></h2>
           <p className="text-xl text-school-navy/50 font-light max-w-2xl mx-auto">Mentorship and excellence driven by a dedicated team of educators and administrators committed to holistic development.</p>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* Management (Cards) */}
          <div className="mb-32">
            <div className="flex items-center gap-6 mb-16">
              <h3 className="text-4xl font-serif font-black text-school-navy capitalize">Management</h3>
              <div className="flex-1 h-px bg-slate-100"></div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
              {data.staff.filter(s => s.type === 'Management').map((s, i) => (
                <PerspectiveCard key={s.id} delay={i * 0.1}>
                  <div className="glass-card p-10 rounded-[40px] flex flex-col h-full group border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500">
                    <div className="w-full h-64 rounded-[32px] mb-8 shadow-xl overflow-hidden bg-slate-100 relative group-hover:-translate-y-2 transition-transform duration-500">
                      <img src={s.image} className="w-full h-full object-cover" alt={s.name} referrerPolicy="no-referrer" />
                      <div className="absolute top-6 right-6 px-4 py-2 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-school-navy shadow-sm">
                        Management
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

          {/* Administration (Coordinators as Cards, others as Table) */}
          <div className="mb-32">
            <div className="flex items-center gap-6 mb-16">
              <h3 className="text-4xl font-serif font-black text-school-navy capitalize">Administration</h3>
              <div className="flex-1 h-px bg-slate-100"></div>
            </div>
            
            {/* Senior Administration / Coordinators */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 mb-24">
              {data.staff.filter(s => s.type === 'Administration' && s.role.includes('COORDINATOR')).map((s, i) => (
                <PerspectiveCard key={s.id} delay={i * 0.1}>
                  <div className="glass-card p-10 rounded-[40px] flex flex-col h-full group border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500">
                    <div className="w-full h-64 rounded-[32px] mb-8 shadow-xl overflow-hidden bg-slate-100 relative group-hover:-translate-y-2 transition-transform duration-500">
                      <img src={s.image} className="w-full h-full object-cover" alt={s.name} referrerPolicy="no-referrer" />
                    </div>
                    <h4 className="text-2xl font-serif font-black text-school-navy mb-3 group-hover:text-school-gold transition-colors">{s.name}</h4>
                    <p className="text-[10px] uppercase font-black tracking-[0.2em] text-school-gold mb-6 border-b border-school-gold/20 pb-4">{s.role}</p>
                    <p className="text-sm text-school-navy/60 font-light leading-relaxed italic">{s.bio}</p>
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
              <h3 className="text-4xl font-serif font-black text-school-navy capitalize">Teaching Faculty</h3>
              <div className="flex-1 h-px bg-slate-100"></div>
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
