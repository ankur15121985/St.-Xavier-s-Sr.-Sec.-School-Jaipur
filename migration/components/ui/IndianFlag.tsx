import React from 'react';
import { motion } from 'motion/react';

const IndianFlag: React.FC<{ className?: string, src?: string }> = ({ className, src }) => {
  if (src && src.trim() !== '') {
    return (
      <motion.div 
        className={`relative inline-block cursor-grab active:cursor-grabbing select-none hover:z-[100] ${className}`}
        drag
        dragMomentum={false}
        dragElastic={0}
        dragConstraints={{ left: -2000, right: 2000, top: -2000, bottom: 2000 }}
        whileHover={{ scale: 1.1 }}
        whileDrag={{ 
          scale: 1.3, 
          zIndex: 1000,
          boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
          cursor: 'grabbing'
        }}
        dragTransition={{ power: 0 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <img 
          src={src} 
          alt="Custom Flag" 
          className="w-full h-auto drop-shadow-2xl rounded-sm"
          referrerPolicy="no-referrer"
        />
      </motion.div>
    );
  }

  return (
    <motion.div 
      className={`relative inline-block cursor-grab active:cursor-grabbing select-none hover:z-[100] ${className}`}
      drag
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={{ left: -2000, right: 2000, top: -2000, bottom: 2000 }}
      whileHover={{ scale: 1.1 }}
      whileDrag={{ 
        scale: 1.3, 
        zIndex: 1000,
        boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
        cursor: 'grabbing'
      }}
      dragTransition={{ power: 0 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <svg 
        viewBox="0 0 900 600" 
        className="w-full h-full drop-shadow-2xl overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(0,0,0,0.15)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.15)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.15)" />
          </linearGradient>
          
          <mask id="flag-mask">
            <motion.path
              d="M0,0 Q150,50 300,0 T600,0 T900,0 V600 Q750,550 600,600 T300,600 T0,600 Z"
              animate={{
                d: [
                  "M0,0 Q150,50 300,0 T600,0 T900,0 V600 Q750,550 600,600 T300,600 T0,600 Z",
                  "M0,0 Q150,-50 300,0 T600,0 T900,0 V600 Q750,650 600,600 T300,600 T0,600 Z",
                  "M0,0 Q150,50 300,0 T600,0 T900,0 V600 Q750,550 600,600 T300,600 T0,600 Z"
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              fill="white"
            />
          </mask>
        </defs>

        <g mask="url(#flag-mask)">
          {/* Saffron */}
          <rect width="900" height="200" fill="#FF9933" />
          {/* White */}
          <rect y="200" width="900" height="200" fill="#FFFFFF" />
          {/* Green */}
          <rect y="400" width="900" height="200" fill="#138808" />
          
          {/* Ashoka Chakra */}
          <g transform="translate(450, 300)">
            <circle r="80" stroke="#000080" strokeWidth="8" fill="none" />
            <circle r="12" fill="#000080" />
            <motion.g
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              {[...Array(24)].map((_, i) => (
                <line
                  key={i}
                  x1="0" y1="0"
                  x2="0" y2="80"
                  stroke="#000080"
                  strokeWidth="3"
                  transform={`rotate(${i * 15})`}
                />
              ))}
            </motion.g>
          </g>

          {/* Shading/Wave Overlay */}
          <motion.rect
            width="1800"
            height="600"
            fill="url(#wave-gradient)"
            animate={{ x: [-900, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </g>
        
        {/* Flag Pole */}
        <rect x="-15" y="-50" width="15" height="1100" fill="url(#pole-grad)" rx="2" />
        <defs>
          <linearGradient id="pole-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#444" />
            <stop offset="50%" stopColor="#888" />
            <stop offset="100%" stopColor="#444" />
          </linearGradient>
        </defs>
        <circle cx="-7.5" cy="-50" r="10" fill="#DAA520" stroke="#B8860B" strokeWidth="2" />
      </svg>
    </motion.div>
  );
};

export default IndianFlag;
