import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselProps {
  images: string[];
  autoPlayInterval?: number;
}

const ImageWithFallback = ({ src, alt, className }: { src: string; alt: string; className: string }) => {
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  return (
    <div className="relative w-full h-full bg-slate-900 flex items-center justify-center">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-school-navy/10 animate-pulse">
          <div className="w-12 h-12 border-4 border-school-gold border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={error ? `https://picsum.photos/seed/${alt}/1920/1080` : src}
        className={`${className} ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-700`}
        alt={alt}
        onLoad={() => setLoading(false)}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
        referrerPolicy="no-referrer"
      />
    </div>
  );
};

export const Carousel = ({ images, autoPlayInterval = 5000 }: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      nextStep();
    }, autoPlayInterval);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const nextStep = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevStep = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 1.1,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.9,
    }),
  };

  return (
    <div className="relative w-full h-[60vh] md:h-[85vh] overflow-hidden group rounded-[60px]">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.3 },
            scale: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
          }}
          className="absolute inset-0"
        >
          <ImageWithFallback
            src={images[currentIndex]}
            className="w-full h-full object-cover"
            alt={`Carousel slide ${currentIndex + 1}`}
          />
          {/* Subtle Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-school-navy/30 to-transparent pointer-events-none"></div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 flex justify-between z-10 pointer-events-none">
        <button
          onClick={prevStep}
          className="w-14 h-14 bg-white/80 backdrop-blur-xl text-school-navy rounded-2xl flex items-center justify-center hover:bg-white hover:scale-110 transition-all active:scale-95 pointer-events-auto shadow-2xl"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextStep}
          className="w-14 h-14 bg-white/80 backdrop-blur-xl text-school-navy rounded-2xl flex items-center justify-center hover:bg-white hover:scale-110 transition-all active:scale-95 pointer-events-auto shadow-2xl"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-10 left-10 flex gap-3 z-10">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setDirection(idx > currentIndex ? 1 : -1);
              setCurrentIndex(idx);
            }}
            className={`transition-all duration-500 rounded-full h-2 ${
              idx === currentIndex 
                ? "w-8 bg-school-accent" 
                : "w-2 bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
