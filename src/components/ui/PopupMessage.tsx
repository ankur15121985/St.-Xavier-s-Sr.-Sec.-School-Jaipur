import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Bell } from 'lucide-react';
import { AppSettings } from '../../types';

interface PopupMessageProps {
  settings: AppSettings;
}

const PopupMessage = ({ settings }: PopupMessageProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (settings?.popupEnabled && settings?.popupMessage) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [settings?.popupEnabled, settings?.popupMessage]);

  if (!settings?.popupEnabled || !settings?.popupMessage) return null;

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl overflow-hidden border border-black/5 dark:border-white/10"
          >
            <div className="p-8 pb-4 flex justify-between items-start">
              <div className="w-12 h-12 bg-school-accent/10 rounded-2xl flex items-center justify-center text-school-accent">
                <Bell size={24} />
              </div>
              <button 
                onClick={() => setShow(false)}
                className="w-10 h-10 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="px-8 pb-10 space-y-4">
              <h3 className="text-2xl font-bold text-school-navy dark:text-white tracking-tight">Institutional Announcement</h3>
              <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-2xl border border-black/5">
                <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                  {settings.popupMessage}
                </p>
              </div>
              <button 
                onClick={() => setShow(false)}
                className="w-full py-4 bg-school-navy text-white rounded-2xl font-bold hover:bg-school-accent transition-all shadow-lg active:scale-95"
              >
                Acknowledge
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PopupMessage;
