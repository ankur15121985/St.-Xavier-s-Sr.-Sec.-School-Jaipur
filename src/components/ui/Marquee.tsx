import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink, FileText } from 'lucide-react';
import { MarqueeItem } from '../../types';

interface MarqueeProps {
  items: MarqueeItem[];
}

export const Marquee = ({ items }: MarqueeProps) => {
  const activeItems = items.filter(item => item.isActive).sort((a, b) => a.order_index - b.order_index);

  if (activeItems.length === 0) return null;

  // Duplicate items to ensure smooth infinite loop
  const displayItems = [...activeItems, ...activeItems, ...activeItems];

  return (
    <div className="w-full bg-[#1a365d] py-3 overflow-hidden whitespace-nowrap relative border-y border-white/10">
      <motion.div
        animate={{
          x: [0, -1000],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
        className="inline-flex items-center gap-12 px-6"
      >
        {displayItems.map((item, idx) => (
          <div key={`${item.id}-${idx}`} className="flex items-center gap-3">
            <span className="text-white text-sm font-bold tracking-wide flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-school-gold rounded-full" />
              {item.text}
            </span>
            
            {(item.link || item.attachmentUrl) && (
              <a 
                href={item.attachmentUrl || item.link}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-full transition-all border border-white/5"
              >
                {item.attachmentUrl?.toLowerCase().endsWith('.pdf') ? (
                  <FileText size={12} className="text-school-neon" />
                ) : (
                  <ExternalLink size={12} className="text-school-neon" />
                )}
                <span className="text-[10px] text-white/80 font-black uppercase tracking-tight">View Details</span>
              </a>
            )}
          </div>
        ))}
      </motion.div>
      
      {/* Edge Fades */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#1a365d] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#1a365d] to-transparent z-10 pointer-events-none" />
    </div>
  );
};
