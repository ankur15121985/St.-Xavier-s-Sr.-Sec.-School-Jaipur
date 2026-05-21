import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const ScrollButtons = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="fixed bottom-40 left-4 md:bottom-48 md:left-10 z-[100] flex flex-col gap-2"
        >
          <button 
            onClick={scrollToTop}
            className="w-12 h-12 bg-school-navy text-white rounded-full shadow-lg flex items-center justify-center hover:bg-school-accent transition-all active:scale-90"
            title="Scroll to Top"
          >
            <ChevronUp size={24} />
          </button>
          <button 
            onClick={scrollToBottom}
            className="w-12 h-12 bg-white text-school-navy border border-black/5 rounded-full shadow-lg flex items-center justify-center hover:bg-slate-50 transition-all active:scale-90"
            title="Scroll to Bottom"
          >
            <ChevronDown size={24} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScrollButtons;
