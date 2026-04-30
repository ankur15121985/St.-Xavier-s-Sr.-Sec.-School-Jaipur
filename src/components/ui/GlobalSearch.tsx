import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search as SearchIcon, X, ArrowRight, FileText, Calendar, Users, Trophy, ImageIcon, Link as LinkIcon, History, MapPin, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppData } from '../../types';

interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  type: 'Page' | 'Notice' | 'Event' | 'Staff' | 'Achievement' | 'Gallery' | 'Contact';
  url: string;
  icon: React.ReactNode;
}

interface GlobalSearchProps {
  data: AppData;
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearch = ({ data, isOpen, onClose }: GlobalSearchProps) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  // Reset query when closed
  useEffect(() => {
    if (!isOpen) setQuery('');
  }, [isOpen]);

  // Prevent background scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const results = useMemo(() => {
    if (!query || query.length < 2) return [];

    const searchStr = query.toLowerCase();
    const found: SearchResult[] = [];

    // Search Pages (from Menu)
    data.menu.forEach(item => {
      if (item.label.toLowerCase().includes(searchStr)) {
        found.push({
          id: `page-${item.id}`,
          title: item.label,
          type: 'Page',
          url: item.href,
          icon: <LinkIcon className="text-blue-500" size={18} />
        });
      }
    });

    // Search Notices
    data.notices.forEach(notice => {
      if (notice.title.toLowerCase().includes(searchStr) || notice.content?.toLowerCase().includes(searchStr)) {
        found.push({
          id: `notice-${notice.id}`,
          title: notice.title,
          subtitle: notice.date,
          type: 'Notice',
          url: '/notice-board',
          icon: <FileText className="text-amber-500" size={18} />
        });
      }
    });

    // Search Events
    data.events.forEach(event => {
      if (event.title.toLowerCase().includes(searchStr) || event.location.toLowerCase().includes(searchStr)) {
        found.push({
          id: `event-${event.id}`,
          title: event.title,
          subtitle: `${event.date} • ${event.location}`,
          type: 'Event',
          url: '/events',
          icon: <Calendar className="text-green-500" size={18} />
        });
      }
    });

    // Search Staff
    data.staff.forEach(staff => {
      if (staff.name.toLowerCase().includes(searchStr) || staff.role.toLowerCase().includes(searchStr) || staff.bio?.toLowerCase().includes(searchStr)) {
        found.push({
          id: `staff-${staff.id}`,
          title: staff.name,
          subtitle: staff.role,
          type: 'Staff',
          url: '/staff',
          icon: <Users className="text-purple-500" size={18} />
        });
      }
    });

    // Search Achievements
    data.achievements.forEach(ach => {
      if (ach.title.toLowerCase().includes(searchStr) || ach.description.toLowerCase().includes(searchStr)) {
        found.push({
          id: `ach-${ach.id}`,
          title: ach.title,
          subtitle: ach.year,
          type: 'Achievement',
          url: '/achievements',
          icon: <Trophy className="text-yellow-500" size={18} />
        });
      }
    });

    // Search Gallery
    data.gallery.forEach(img => {
      if (img.caption?.toLowerCase().includes(searchStr)) {
        found.push({
          id: `gal-${img.id}`,
          title: img.caption,
          subtitle: 'Gallery Image',
          type: 'Gallery',
          url: '/gallery',
          icon: <ImageIcon className="text-pink-500" size={18} />
        });
      }
    });

    // Static Contact Info
    if (data.settings?.contactAddress?.toLowerCase().includes(searchStr)) {
        found.push({
          id: 'contact-address',
          title: 'Campus Address',
          subtitle: data.settings.contactAddress,
          type: 'Contact',
          url: '/contact',
          icon: <MapPin className="text-red-500" size={18} />
        });
    }

    if (data.settings?.contactPhone?.toLowerCase().includes(searchStr)) {
        found.push({
            id: 'contact-phone',
            title: 'School Contact',
            subtitle: data.settings.contactPhone,
            type: 'Contact',
            url: '/contact',
            icon: <Phone className="text-green-600" size={18} />
          });
    }

    return found.slice(0, 10);
  }, [query, data]);

  const handleSelect = (url: string) => {
    navigate(url);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-24 px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-school-navy/40 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl overflow-hidden border border-white/20"
          >
            {/* Search Input Area */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4">
              <SearchIcon className="text-slate-400 shrink-0" size={24} />
              <input
                autoFocus
                type="text"
                placeholder="Search anything from St. Xavier's..."
                className="flex-1 bg-transparent border-none outline-none text-xl font-medium text-school-navy dark:text-white placeholder:text-slate-400"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') onClose();
                }}
              />
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400"
              >
                <X size={20} />
              </button>
            </div>

            {/* Results Area */}
            <div className="max-h-[60vh] overflow-y-auto pb-6">
              {query.length >= 2 ? (
                results.length > 0 ? (
                  <div className="p-2">
                    <p className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Results ({results.length})
                    </p>
                    <div className="grid gap-1">
                      {results.map((result) => (
                        <button
                          key={result.id}
                          onClick={() => handleSelect(result.url)}
                          className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all rounded-2xl group text-left"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-800 group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors">
                              {result.icon}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-school-navy dark:text-white text-base truncate">
                                {result.title}
                              </h4>
                              {result.subtitle && (
                                <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                                  {result.subtitle}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                             <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest group-hover:text-school-accent transition-colors">
                               {result.type}
                             </span>
                             <ArrowRight className="text-school-accent opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" size={16} />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="py-20 text-center space-y-4">
                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto">
                      <SearchIcon className="text-slate-300" size={32} />
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-school-navy dark:text-white text-lg">No results found for "{query}"</p>
                      <p className="text-slate-500 font-medium text-sm px-10">Try adjusting your search or looking in specific categories.</p>
                    </div>
                  </div>
                )
              ) : (
                <div className="p-8 space-y-8">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { icon: <FileText size={18} />, label: 'Notices', url: '/notice-board' },
                      { icon: <Calendar size={18} />, label: 'Events', url: '/events' },
                      { icon: <Users size={18} />, label: 'Staff', url: '/staff' },
                      { icon: <Trophy size={18} />, label: 'Honors', url: '/achievements' },
                      { icon: <ImageIcon size={18} />, label: 'Gallery', url: '/gallery' },
                      { icon: <History size={18} />, label: 'History', url: '/history' },
                    ].map((item, i) => (
                      <button
                        key={i}
                        onClick={() => handleSelect(item.url)}
                        className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-school-accent/30 transition-all group"
                      >
                         <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center text-slate-400 group-hover:text-school-accent transition-colors shadow-sm mb-3">
                            {item.icon}
                         </div>
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-school-navy dark:group-hover:text-white transition-colors">
                           {item.label}
                         </span>
                      </button>
                    ))}
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Helpful Suggestions</p>
                    <div className="flex flex-wrap gap-2">
                       {['Fee Structure', 'Admission Policy', 'Principal Message', 'Sports Complex', 'Scholarships'].map((text, i) => (
                         <button 
                          key={i}
                          onClick={() => setQuery(text)}
                          className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 rounded-full hover:bg-school-accent hover:text-white transition-all border border-black/5"
                         >
                           {text}
                         </button>
                       ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 text-center">
               <p className="text-[9px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-widest">
                  Press ESC to close • Search St. Xavier's Academic Repository
               </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
