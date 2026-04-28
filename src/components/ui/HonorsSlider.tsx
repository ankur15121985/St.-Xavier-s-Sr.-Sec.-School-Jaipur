import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { StudentHonor } from '../../types';

interface HonorsSliderProps {
  honors: StudentHonor[];
}

export const HonorsSlider = ({ honors }: HonorsSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % honors.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + honors.length) % honors.length);
  };

  if (!honors || honors.length === 0) return null;

  return (
    <div className="py-32 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-20">
          <h2 className="text-4xl md:text-6xl font-bold text-school-navy dark:text-white tracking-tight">
            Laurel & <span className="text-school-accent">Distinction.</span>
          </h2>
        </div>

        <div className="relative group">
          <div className="grid md:grid-cols-2 gap-8">
            <AnimatePresence mode="wait">
              {honors.slice(currentIndex, currentIndex + 2).map((item) => (
                <motion.div 
                  key={item.id} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-slate-50 dark:bg-slate-900 p-10 rounded-3xl flex flex-col md:flex-row items-center gap-8 border border-black/5 dark:border-white/5"
                >
                  <div className="w-32 h-32 md:w-32 md:h-32 rounded-2xl overflow-hidden shrink-0 shadow-sm">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-school-accent mb-2">{item.category}</p>
                    <h4 className="text-2xl font-bold text-school-navy dark:text-white leading-tight">{item.name}</h4>
                    <p className="text-sm text-slate-500 mt-2">
                      {item.subtext}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-center gap-4 md:gap-6 mt-8 md:mt-12">
            <button 
              onClick={prevSlide}
              className="w-12 h-12 bg-school-navy text-white rounded-full flex items-center justify-center hover:bg-school-accent transition-all shadow-sm active:scale-95"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={nextSlide}
              className="w-12 h-12 bg-school-navy text-white rounded-full flex items-center justify-center hover:bg-school-accent transition-all shadow-sm active:scale-95"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
