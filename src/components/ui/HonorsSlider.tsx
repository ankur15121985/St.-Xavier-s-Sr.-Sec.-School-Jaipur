import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { StudentHonor } from '../../types';

interface HonorsSliderProps {
  honors: StudentHonor[];
  autoPlayInterval?: number;
}

export const HonorsSlider = ({ honors, autoPlayInterval = 5000 }: HonorsSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % honors.length);
  }, [honors.length]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + honors.length) % honors.length);
  }, [honors.length]);

  useEffect(() => {
    if (!autoPlayInterval) return;
    const interval = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(interval);
  }, [nextSlide, autoPlayInterval]);

  if (!honors || honors.length === 0) return null;

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95
    })
  };

  return (
    <div className="py-24 bg-white dark:bg-slate-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Quote size={20} className="text-school-accent" />
              <span className="text-school-accent font-black uppercase tracking-[0.3em] text-[10px]">Academic Achievements</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-school-navy dark:text-white tracking-tighter leading-[0.9]">
              Laurel & <span className="text-school-accent italic font-serif font-light">Distinction.</span>
            </h2>
          </motion.div>

          <div className="flex gap-4">
            <button 
              onClick={prevSlide}
              className="w-14 h-14 bg-school-navy text-white rounded-2xl flex items-center justify-center hover:bg-school-accent transition-all shadow-xl active:scale-90 group"
            >
              <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={nextSlide}
              className="w-14 h-14 bg-school-navy text-white rounded-2xl flex items-center justify-center hover:bg-school-accent transition-all shadow-xl active:scale-90 group"
            >
              <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="grid md:grid-cols-2 gap-8">
            <AnimatePresence initial={false} mode="popLayout" custom={direction}>
              {[
                honors[currentIndex],
                honors[(currentIndex + 1) % honors.length]
              ].map((item, idx) => (
                <motion.div 
                  key={`${item.id}-${idx}`}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ 
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.4 }
                  }}
                  className="bg-slate-50 dark:bg-slate-900/50 p-10 md:p-12 rounded-[40px] flex flex-col md:flex-row items-center gap-8 border border-black/5 dark:border-white/5 relative group"
                >
                  {/* Subtle Background Pattern */}
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none rounded-[40px] overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                  </div>

                  <div className="w-48 h-48 md:w-36 md:h-36 rounded-3xl overflow-hidden shrink-0 shadow-2xl relative z-10 border-4 border-white dark:border-slate-800">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=random&color=fff&size=128`;
                      }}
                    />
                  </div>
                  <div className="flex-1 text-center md:text-left relative z-10">
                    <div className="inline-block px-3 py-1 bg-school-accent/10 rounded-full mb-4">
                      <p className="text-[9px] font-black uppercase tracking-widest text-school-accent">{item.category}</p>
                    </div>
                    <h4 className="text-3xl font-black text-school-navy dark:text-white leading-tight tracking-tight uppercase italic mb-3">{item.name}</h4>
                    <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                      {item.subtext}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-12">
            {honors.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDirection(idx > currentIndex ? 1 : -1);
                  setCurrentIndex(idx);
                }}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  idx === currentIndex 
                    ? 'w-8 bg-school-accent' 
                    : 'w-1.5 bg-slate-200 dark:bg-white/10 hover:bg-slate-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
