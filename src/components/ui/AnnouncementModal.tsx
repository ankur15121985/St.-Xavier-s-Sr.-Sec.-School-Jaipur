import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, FileText, ImageIcon, MessageSquare } from 'lucide-react';
import { AnnouncementPopup } from '../../types';

interface AnnouncementModalProps {
  popups: AnnouncementPopup[];
}

export const AnnouncementModal = ({ popups }: AnnouncementModalProps) => {
  const activePopups = popups.filter(p => p.isActive).sort((a, b) => a.order_index - b.order_index);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (activePopups.length > 0) {
      // Check if we've already shown a popup in this session
      const lastShown = sessionStorage.getItem('announcement-shown');
      if (!lastShown) {
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 1500); // Wait 1.5s after load
        return () => clearTimeout(timer);
      }
    }
  }, [activePopups]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('announcement-shown', 'true');
  };

  if (activePopups.length === 0 || !isOpen) return null;

  const currentPopup = activePopups[currentIndex];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-school-navy/80 backdrop-blur-md"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[32px] md:rounded-[48px] overflow-hidden shadow-2xl border border-white/10"
        >
          {/* Progress indicators if multiple */}
          {activePopups.length > 1 && (
            <div className="absolute top-8 left-10 right-10 flex gap-2 z-20">
              {activePopups.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1 flex-1 rounded-full transition-all ${i === currentIndex ? 'bg-school-accent' : 'bg-black/10 dark:bg-white/10'}`} 
                />
              ))}
            </div>
          )}

          <button 
            onClick={handleClose}
            className="absolute top-6 right-6 md:top-8 md:right-8 z-30 p-3 rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 transition-all text-school-navy dark:text-white"
          >
            <X size={20} />
          </button>

          <div className="flex flex-col md:flex-row h-full">
            {/* Visual Part */}
            {(currentPopup.type === 'image' || currentPopup.type === 'pdf') && (
              <div className={`w-full md:w-1/2 aspect-square md:aspect-auto bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden`}>
                {currentPopup.type === 'image' ? (
                  <img 
                    src={currentPopup.attachmentUrl || currentPopup.content} 
                    alt={currentPopup.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-4 text-slate-300">
                    <FileText size={80} strokeWidth={1} />
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Document Preview</span>
                  </div>
                )}
              </div>
            )}

            {/* Content Part */}
            <div className={`p-8 md:p-12 flex flex-col justify-center ${(currentPopup.type === 'image' || currentPopup.type === 'pdf') ? 'md:w-1/2' : 'w-full text-center'}`}>
              <div className="space-y-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${ (currentPopup.type === 'image' || currentPopup.type === 'pdf') ? 'hidden' : 'mx-auto'} bg-school-accent/10 text-school-accent`}>
                  {currentPopup.type === 'pdf' ? <FileText size={24} /> : 
                   currentPopup.type === 'image' ? <ImageIcon size={24} /> : 
                   currentPopup.type === 'link' ? <ExternalLink size={24} /> :
                   <MessageSquare size={24} />}
                </div>

                <div className="space-y-4">
                  {currentPopup.header && (
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-school-accent mb-2">
                      {currentPopup.header}
                    </p>
                  )}
                  
                  <h3 className="text-2xl md:text-3xl font-bold text-school-navy dark:text-white leading-tight">
                    {currentPopup.title}
                  </h3>
                  
                  {(currentPopup.type === 'text' || currentPopup.type === 'link' || currentPopup.type === 'image' || currentPopup.type === 'pdf') && currentPopup.content && (
                    <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                      {currentPopup.content}
                    </p>
                  )}

                  {currentPopup.type === 'pdf' && currentPopup.attachmentUrl && (
                    <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 flex items-center gap-4 text-left">
                      <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
                        <FileText size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">PDF Document</p>
                        <p className="text-xs font-bold text-school-navy dark:text-white truncate">{currentPopup.title}.pdf</p>
                      </div>
                      <a 
                        href={currentPopup.attachmentUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-2 rounded-lg bg-school-navy text-white hover:bg-school-accent transition-colors"
                      >
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  )}

                  {currentPopup.type === 'link' && currentPopup.buttonLink && (
                    <div className="p-4 rounded-2xl bg-school-accent/5 border border-school-accent/10 flex items-center gap-4 text-left">
                      <div className="w-10 h-10 rounded-xl bg-school-accent/10 text-school-accent flex items-center justify-center shrink-0">
                        <ExternalLink size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-black uppercase tracking-widest text-school-accent/60">Important Link</p>
                        <p className="text-xs font-bold text-school-navy dark:text-white truncate">{currentPopup.buttonLink}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 flex flex-col sm:flex-row gap-3 items-center justify-center">
                  {(currentPopup.buttonLink || currentPopup.attachmentUrl) && (
                    <a 
                      href={currentPopup.buttonLink || currentPopup.attachmentUrl}
                      onClick={handleClose}
                      target={currentPopup.type === 'pdf' || currentPopup.type === 'link' ? "_blank" : "_self"}
                      rel={currentPopup.type === 'pdf' || currentPopup.type === 'link' ? "noreferrer" : ""}
                      className="w-full sm:w-auto px-8 py-3.5 bg-school-navy text-white rounded-full font-bold shadow-xl hover:bg-school-accent transition-all flex items-center justify-center gap-2"
                    >
                      {currentPopup.buttonText || (currentPopup.type === 'pdf' ? 'Open Document' : 'Learn More')}
                      <ArrowUpRight size={18} />
                    </a>
                  )}
                  
                  {activePopups.length > 1 && (
                    <button 
                      onClick={() => setCurrentIndex((currentIndex + 1) % activePopups.length)}
                      className="w-full sm:w-auto px-8 py-3.5 bg-black/5 dark:bg-white/5 text-school-navy dark:text-white rounded-full font-bold hover:bg-black/10 dark:hover:bg-white/10 transition-all"
                    >
                      Next Announcement
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const ArrowUpRight = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 17L17 7M17 7H7M17 7V17" />
  </svg>
);
