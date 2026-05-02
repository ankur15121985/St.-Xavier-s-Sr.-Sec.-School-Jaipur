import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Link as LinkIcon, FileText, Image as ImageIcon, ExternalLink, X } from 'lucide-react';
import { QuickLink } from '../../types';

interface SidebarLinksProps {
  links: QuickLink[];
}

const SidebarLinks: React.FC<SidebarLinksProps> = ({ links }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getIcon = (type?: string) => {
    switch (type?.toLowerCase()) {
      case 'pdf':
      case 'document':
        return <FileText size={18} />;
      case 'image':
      case 'photo':
        return <ImageIcon size={18} />;
      default:
        return <LinkIcon size={18} />;
    }
  };

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-[100] flex items-center">
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-16 bg-school-navy text-school-gold rounded-l-2xl flex items-center justify-center shadow-[-4px_0_15px_rgba(0,0,0,0.1)] hover:bg-school-gold hover:text-school-navy transition-all group border-y border-l border-white/10"
        whileHover={{ x: -4 }}
      >
        {isOpen ? <ChevronRight size={24} /> : <div className="flex flex-col items-center gap-1">
          <ChevronLeft size={20} className="animate-pulse" />
          <span className="[writing-mode:vertical-lr] text-[8px] font-black uppercase tracking-widest">Links</span>
        </div>}
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-72 h-[60vh] bg-school-paper rounded-l-[32px] shadow-[-10px_0_30px_rgba(0,0,0,0.15)] border-l border-school-ink/10 flex flex-col overflow-hidden"
          >
            <div className="p-6 bg-school-navy text-white flex items-center justify-between">
              <div>
                <h4 className="text-lg font-serif font-bold italic tracking-wide">Quick Links</h4>
                <p className="text-[9px] uppercase tracking-widest text-school-gold/70 font-black">Useful Resources</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {links && links.length > 0 ? (
                links.map((link) => (
                  <a 
                    key={link.id}
                    href={link.attachmentUrl || link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-school-ink/5 hover:border-school-gold hover:shadow-md transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-school-ink/5 text-school-ink/40 flex items-center justify-center group-hover:bg-school-gold group-hover:text-school-navy transition-all">
                      {getIcon(link.icon || (link.attachmentUrl?.endsWith('.pdf') ? 'pdf' : 'link'))}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black uppercase tracking-tight text-school-ink group-hover:text-school-gold transition-colors truncate">
                        {link.title}
                      </p>
                      <span className="text-[10px] text-school-ink/40 font-medium flex items-center gap-1">
                        {link.attachmentUrl ? 'Document' : 'Website'} <ExternalLink size={8} />
                      </span>
                    </div>
                  </a>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-20">
                  <LinkIcon size={32} className="mb-4" />
                  <p className="text-xs font-black uppercase tracking-widest">No links found</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-school-ink/5 border-t border-school-ink/10">
              <p className="text-[8px] text-center text-school-ink/40 font-bold uppercase tracking-[0.2em]">
                St. Xavier's Jaipur · Digital Gateway
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SidebarLinks;
