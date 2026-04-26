import React, { useState } from 'react';
import { AppData } from '../types';
import Layout from '../components/layout/Layout';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, MapPin, Clock, List, LayoutGrid } from 'lucide-react';
import SchoolCalendar from '../components/calendar/SchoolCalendar';

const EventsPage = ({ data }: { data: AppData }) => {
  const [view, setView] = useState<'calendar' | 'list'>('calendar');

  return (
    <Layout data={data}>
      <section className="pt-48 pb-40 bg-school-paper min-h-screen">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-16 flex flex-col md:flex-row justify-between items-end gap-8">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-school-gold mb-4 block">Institutional Diary</span>
            <h2 className="text-7xl font-serif font-black text-school-ink leading-tight">Academic <span className="text-school-gold italic">Calendar.</span></h2>
            <p className="text-xl text-school-ink/40 font-light max-w-2xl mt-4">Mark your dates for the vibrant life at St. Xavier's Jaipur.</p>
          </div>

          <div className="flex bg-school-paper p-1.5 rounded-full shadow-xl border border-school-ink/10">
            <button 
              onClick={() => setView('calendar')}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${view === 'calendar' ? 'bg-school-navy text-white shadow-lg' : 'text-school-ink/40 hover:text-school-ink'}`}
            >
              <LayoutGrid size={14} />
              Calendar
            </button>
            <button 
              onClick={() => setView('list')}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${view === 'list' ? 'bg-school-navy text-white shadow-lg' : 'text-school-ink/40 hover:text-school-ink'}`}
            >
              <List size={14} />
              List View
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {view === 'calendar' ? (
            <motion.div
              key="calendar-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <SchoolCalendar events={data.events} />
            </motion.div>
          ) : (
            <motion.div 
              key="list-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-7xl mx-auto px-6 lg:px-12 grid md:grid-cols-2 gap-8"
            >
              {data.events.map((e, i) => (
                <motion.div 
                  key={e.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-12 glass-surface rounded-[48px] hover:bg-school-paper/80 transition-all flex flex-col md:flex-row gap-12 items-start md:items-center group shadow-sm hover:shadow-2xl border border-school-ink/10"
                >
                  <div className="w-32 h-32 rounded-3xl bg-school-navy text-white flex flex-col items-center justify-center font-black shrink-0 shadow-xl group-hover:rotate-6 transition-transform">
                    <span className="text-xs uppercase tracking-widest opacity-50 mb-1">{e.date.split(' ')[0]}</span>
                    <span className="text-4xl">{e.date.split(' ')[1].replace(',', '')}</span>
                    <span className="text-[10px] uppercase tracking-widest opacity-50 mt-1">{e.date.split(' ')[2]}</span>
                  </div>
                  <div className="flex-1 w-full">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
                      <h4 className="text-3xl font-serif font-black text-school-ink group-hover:text-school-gold transition-colors leading-tight">{e.title}</h4>
                      <button 
                        onClick={(e_event) => {
                          e_event.stopPropagation();
                          const title = encodeURIComponent(e.title);
                          const details = encodeURIComponent(`School Event at ${e.location}`);
                          const location = encodeURIComponent(e.location);
                          const dateObj = new Date(e.date);
                          const dateStr = !isNaN(dateObj.getTime()) ? dateObj.toISOString().split('T')[0].replace(/-/g, '') : '';
                          const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}${dateStr ? `&dates=${dateStr}/${dateStr}` : ''}`;
                          window.open(googleCalendarUrl, '_blank');
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-school-ink/5 hover:bg-school-gold hover:text-white rounded-full text-[9px] font-black uppercase tracking-widest transition-all shrink-0"
                      >
                        <Calendar size={12} />
                        Add to Calendar
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-school-ink/50 text-sm">
                        <Clock size={16} className="text-school-gold" />
                        <span>{e.time}</span>
                      </div>
                      <div className="flex items-center gap-3 text-school-ink/50 text-sm">
                        <MapPin size={16} className="text-school-gold" />
                        <span>{e.location}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </Layout>
  );
};

export default EventsPage;
