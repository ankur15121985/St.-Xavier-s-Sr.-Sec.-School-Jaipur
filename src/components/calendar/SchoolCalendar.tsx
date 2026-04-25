import React, { useState, useMemo } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  parse,
  isWithinInterval,
  startOfDay
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, Download, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Event } from '../../types';

interface SchoolCalendarProps {
  events: Event[];
}

const SchoolCalendar = ({ events }: SchoolCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Parse events dates
  const parsedEvents = useMemo(() => {
    return events.map(event => ({
      ...event,
      parsedDate: parse(event.date, 'MMMM dd, yyyy', new Date())
    }));
  }, [events]);

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between px-8 py-6 bg-school-navy text-white rounded-t-[40px]">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
            <CalendarIcon className="text-school-gold" size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-serif font-bold italic tracking-wide">
              {format(currentMonth, 'MMMM yyyy')}
            </h3>
            <p className="text-[10px] uppercase tracking-[0.2em] text-school-gold/70 font-black">Interactive Academic Calendar</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-3 hover:bg-white/10 rounded-xl transition-all border border-white/5"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-3 hover:bg-white/10 rounded-xl transition-all border border-white/5"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="grid grid-cols-7 border-b border-school-navy/5 bg-slate-50/50">
        {days.map((day, idx) => (
          <div key={idx} className="py-4 text-center text-[10px] font-black uppercase tracking-widest text-school-navy/40">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, 'd');
        const cloneDay = day;
        const dayEvents = parsedEvents.filter(e => isSameDay(e.parsedDate, cloneDay));
        const hasEvents = dayEvents.length > 0;
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isSelected = selectedDate && isSameDay(day, selectedDate);
        const isToday = isSameDay(day, new Date());

        days.push(
          <div
            key={day.toString()}
            className={`relative h-24 md:h-32 border-r border-b border-school-navy/5 group cursor-pointer transition-all duration-500 overflow-hidden
              ${!isCurrentMonth ? 'bg-slate-50/20 opacity-30 cursor-default grayscale' : 'bg-white hover:bg-slate-50'}
              ${isSelected ? 'z-10 ring-2 ring-school-gold ring-inset shadow-xl' : ''}
            `}
            onClick={() => isCurrentMonth && setSelectedDate(cloneDay)}
          >
            <div className={`absolute top-4 left-4 text-sm font-black transition-all duration-500 
              ${isSelected ? 'text-school-gold scale-125' : isToday ? 'text-school-navy flex items-center gap-2' : 'text-school-navy/30 group-hover:text-school-navy'}
            `}>
              {formattedDate}
              {isToday && <span className="w-1.5 h-1.5 rounded-full bg-school-gold animate-pulse"></span>}
            </div>

            {hasEvents && isCurrentMonth && (
              <div className="absolute top-4 right-4 flex gap-1">
                {dayEvents.map((_, idx) => (
                  <div key={idx} className="w-1.5 h-1.5 rounded-full bg-school-gold shadow-[0_0_8px_rgba(226,180,80,0.6)]"></div>
                ))}
              </div>
            )}

            {hasEvents && isCurrentMonth && (
              <div className="mt-12 px-4 space-y-1">
                {dayEvents.slice(0, 2).map((e, idx) => (
                  <div key={e.id} className="text-[9px] font-bold text-school-navy truncate bg-slate-100 p-1 rounded border-l-2 border-school-gold">
                    {e.title}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-[8px] font-black text-school-gold uppercase tracking-tighter text-right">
                    +{dayEvents.length - 2} more
                  </div>
                )}
              </div>
            )}
            
            {/* Background pattern on hover */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(226,180,80,0.03)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }

    return <div className="bg-white">{rows}</div>;
  };

  const selectedDayEvents = useMemo(() => {
    if (!selectedDate) return [];
    return parsedEvents.filter(e => isSameDay(e.parsedDate, selectedDate));
  }, [selectedDate, parsedEvents]);

  const addToCalendar = (event: Event) => {
    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(`School Event at ${event.location}`);
    const location = encodeURIComponent(event.location);
    
    // Simple Google Calendar link
    const dateStr = format(parse(event.date, 'MMMM dd, yyyy', new Date()), 'yyyyMMdd');
    const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dateStr}/${dateStr}`;
    
    window.open(googleCalendarUrl, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12">
      <div className="bg-white rounded-[40px] shadow-2xl border border-school-navy/5 overflow-hidden">
        {renderHeader()}
        {renderDays()}
        {renderCells()}
      </div>

      <AnimatePresence>
        {selectedDate && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-12 p-8 md:p-12 glass-surface rounded-[48px] border border-white/50 shadow-2xl"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-school-gold mb-2 block">Events for</span>
                <h3 className="text-4xl md:text-5xl font-serif font-black text-school-navy italic">
                  {format(selectedDate, 'do MMMM, yyyy')}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedDate(null)}
                className="text-xs font-black uppercase tracking-widest text-school-navy/40 hover:text-school-gold transition-colors"
              >
                Close Details
              </button>
            </div>

            {selectedDayEvents.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-8">
                {selectedDayEvents.map((event, idx) => (
                  <motion.div 
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-8 bg-white/80 rounded-[32px] border border-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
                  >
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-school-navy flex items-center justify-center shrink-0 group-hover:rotate-12 transition-transform">
                        <Clock className="text-school-gold" size={24} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-2xl font-serif font-black text-school-navy mb-4 group-hover:text-school-gold transition-colors">
                          {event.title}
                        </h4>
                        <div className="space-y-3 mb-8">
                          <div className="flex items-center gap-3 text-school-navy/60 text-sm font-medium">
                            <Clock size={16} className="text-school-gold" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-3 text-school-navy/60 text-sm font-medium">
                            <MapPin size={16} className="text-school-gold" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => addToCalendar(event)}
                          className="flex items-center gap-3 px-6 py-3 bg-school-navy text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-school-gold transition-all shadow-lg hover:shadow-school-gold/20"
                        >
                          <Download size={14} />
                          Add to Calendar
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-50 border border-school-navy/5 mb-6">
                  <CalendarIcon className="text-school-navy/20" size={32} />
                </div>
                <h4 className="text-xl font-serif font-bold text-school-navy/40">No events scheduled for this day.</h4>
                <p className="text-sm text-school-navy/20 mt-2">Check other dates or return to the main calendar.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SchoolCalendar;
