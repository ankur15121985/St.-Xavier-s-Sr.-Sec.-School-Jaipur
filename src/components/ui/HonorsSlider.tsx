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
    <div className="py-12 md:py-24 bg-transparent overflow-hidden relative">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center mb-10 md:mb-20 space-y-4 md:space-y-6">
          <span className="text-school-accent font-black uppercase tracking-widest text-[10px] md:text-[12px]">Distinguished Alumni</span>
          <h2 className="text-5xl md:text-[9rem] font-black text-school-ink leading-[0.8] tracking-tight">
            Laurel & <br />
            <span className="text-school-accent italic">Distinction</span>
          </h2>
        </div>

        <div className="relative group">
          <div className="flex flex-col md:flex-row gap-12 justify-center items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ type: 'spring', damping: 25, stiffness: 100 }}
                className="grid md:grid-cols-2 gap-8 w-full"
              >
                {[0, 1].map((offset) => {
                  const index = (currentIndex + offset) % honors.length;
                  const item = honors[index];
                  return (
                    <motion.div 
                      key={item.id} 
                      className="bg-school-paper/80 dark:bg-school-paper/40 backdrop-blur-3xl p-8 md:p-14 rounded-[40px] md:rounded-[60px] flex flex-col md:flex-row items-center gap-8 md:gap-10 relative overflow-hidden group/card hover:bg-school-paper/100 dark:hover:bg-school-paper/60 transition-all border border-school-ink/10 shadow-xl"
                    >
                      <div className="w-32 h-32 md:w-48 md:h-48 rounded-[32px] md:rounded-[40px] overflow-hidden shrink-0 shadow-2xl relative">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                        />
                      </div>
                      <div className="flex-1 space-y-3 md:space-y-4 text-center md:text-left">
                        <p className="text-[10px] md:text-[12px] font-black uppercase tracking-widest text-school-accent">{item.category}</p>
                        <h4 className="text-2xl md:text-4xl font-black text-school-ink leading-tight tracking-tight">{item.name}</h4>
                        <p className="text-base md:text-lg font-medium text-school-ink/60 leading-relaxed">
                          {item.subtext}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-center gap-4 md:gap-6 mt-8 md:mt-12">
            <button 
              onClick={prevSlide}
              className="w-12 h-12 md:w-16 md:h-16 bg-school-ink text-school-paper rounded-full flex items-center justify-center hover:bg-school-accent hover:text-white hover:scale-110 transition-all shadow-xl active:scale-95 group/btn"
            >
              <ChevronLeft size={20} className="md:size-6 group-hover/btn:-translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={nextSlide}
              className="w-12 h-12 md:w-16 md:h-16 bg-school-ink text-school-paper rounded-full flex items-center justify-center hover:bg-school-accent hover:text-white hover:scale-110 transition-all shadow-xl active:scale-95 group/btn"
            >
              <ChevronRight size={20} className="md:size-6 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
