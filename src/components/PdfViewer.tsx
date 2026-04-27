import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, Printer, Maximize2, FileText } from 'lucide-react';

interface PdfViewerProps {
  url: string;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ url, isOpen, onClose, title = 'Document Viewer' }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-school-navy/95 backdrop-blur-xl p-4 md:p-12"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="w-full h-full max-w-6xl bg-[#2b2b2b] rounded-[32px] overflow-hidden shadow-2xl flex flex-col border border-white/10"
        >
          {/* Custom Toolbar - Inspired by the user image */}
          <div className="h-16 bg-[#2b2b2b] px-8 flex items-center justify-between border-b border-white/5 select-none">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-school-gold/20 rounded-lg flex items-center justify-center text-school-gold">
                <FileText size={18} />
              </div>
              <h3 className="text-white text-sm font-black uppercase tracking-widest truncate max-w-[200px] md:max-w-md">
                {title}
              </h3>
            </div>

            <div className="flex items-center gap-2 md:gap-6">
              <a 
                href={url} 
                download 
                className="p-2 text-white/60 hover:text-white transition-colors flex items-center gap-2"
                title="Download"
              >
                <Download size={18} />
                <span className="hidden md:inline text-[9px] font-black uppercase tracking-widest">Download</span>
              </a>
              <button 
                onClick={() => window.print()} 
                className="p-2 text-white/60 hover:text-white transition-colors flex items-center gap-2"
                title="Print"
              >
                <Printer size={18} />
                <span className="hidden md:inline text-[9px] font-black uppercase tracking-widest">Print</span>
              </button>
              <div className="w-px h-6 bg-white/10 mx-2 hidden md:block" />
              <button 
                onClick={onClose}
                className="w-10 h-10 bg-white/5 hover:bg-white/10 text-white rounded-xl flex items-center justify-center transition-all group"
              >
                <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>
          </div>

          {/* PDF Frame */}
          <div className="flex-1 bg-[#2b2b2b] relative group">
            {/* Using embed or iframe with #toolbar=0 to minimize native controls if possible, but standard browser viewer is good */}
            <iframe
              src={`${url}#toolbar=0&navpanes=0&scrollbar=1`}
              className="w-full h-full border-none bg-white"
              title="PDF Viewer"
              // Adding some transparency to the background of the iframe if supported by browser/PDF
            />
            
            {/* Loading state / Overlay for interaction hint */}
            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/20 to-transparent flex items-end p-8">
               <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Scroll to navigate pages</p>
            </div>
          </div>

          {/* Footer - Breadcrumb/Info */}
          <div className="h-10 bg-black/20 px-8 flex items-center">
            <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.3em] text-white/30">
              <span>St. Xavier's Portal</span>
              <span>/</span>
              <span className="text-school-gold">Cloud Document</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PdfViewer;
