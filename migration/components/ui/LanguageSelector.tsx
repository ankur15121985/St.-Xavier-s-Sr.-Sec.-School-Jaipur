import React, { useState, useEffect } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const languages = [
  { name: 'English', code: 'en' },
  { name: 'Hindi', code: 'hi' },
  { name: 'Sanskrit', code: 'sa' },
  { name: 'Spanish', code: 'es' },
  { name: 'French', code: 'fr' },
  { name: 'German', code: 'de' }
];

export const LanguageSelector = ({ isScrolled = false, align = 'right' }: { isScrolled?: boolean, align?: 'left' | 'right' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('English');

  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };

    const currentCookie = getCookie('googtrans');
    if (currentCookie) {
      const code = currentCookie.split('/').pop();
      const lang = languages.find(l => l.code === code);
      if (lang) setCurrentLang(lang.name);
    } else {
      setCurrentLang('English');
    }

    // Google Translate script initialization
    if (!(window as any).googleTranslateElementInit) {
      (window as any).googleTranslateElementInit = () => {
        new (window as any).google.translate.TranslateElement({
          pageLanguage: 'en',
          includedLanguages: 'en,hi,sa,es,fr,de',
          autoDisplay: false
        }, 'google_translate_element');
      };

      const script = document.createElement('script');
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleLangSelect = (lang: { name: string, code: string }) => {
    setIsOpen(false);
    setCurrentLang(lang.name);
    
    const domain = window.location.hostname;
    const cookieValue = `/en/${lang.code}`;
    const cookieString = `googtrans=${cookieValue}; path=/; SameSite=Lax;`;
    
    // Set cookie for current domain and root domain
    document.cookie = cookieString;
    if (domain.includes('.')) {
      const parts = domain.split('.');
      const rootDomain = parts.slice(-2).join('.');
      document.cookie = `${cookieString} domain=.${rootDomain};`;
    }
    
    // For English, we clear the cookie to revert to original
    if (lang.code === 'en') {
      const clearCookie = `googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax;`;
      document.cookie = clearCookie;
      if (domain.includes('.')) {
        const parts = domain.split('.');
        const rootDomain = parts.slice(-2).join('.');
        document.cookie = `${clearCookie} domain=.${rootDomain};`;
      }
    }

    // Seamless trigger: Find the hidden Google Translate combo box and fire a change event
    const triggerTranslation = () => {
      const googleCombo = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (googleCombo) {
        googleCombo.value = lang.code;
        googleCombo.dispatchEvent(new Event('change'));
        return true;
      }
      return false;
    };

    // If widget is ready, trigger it. Otherwise retry briefly.
    if (!triggerTranslation()) {
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (triggerTranslation() || attempts >= 15) {
          clearInterval(interval);
        }
      }, 300);
    }
  };

  return (
    <div className="relative flex items-center">
      {/* Hidden container for the official Google Translate widget - DO NOT REMOVE */}
      <div id="google_translate_element" className="absolute opacity-0 pointer-events-none -top-40" />
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 rounded-full transition-all bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-school-navy dark:text-white group relative shadow-inner ${isScrolled ? 'px-3 py-1.5' : 'px-4 py-2.5'}`}
      >
        <Globe size={isScrolled ? 14 : 16} className="text-school-accent" />
        <span className={`font-black uppercase tracking-widest text-[9px] xl:text-[10px]`}>
          {currentLang}
        </span>
        <ChevronDown size={10} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className={`absolute top-full ${align === 'right' ? 'right-0' : 'left-0'} mt-3 w-56 bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl border border-black/5 dark:border-white/10 overflow-hidden z-[100]`}
          >
            <div className="p-2 space-y-1 max-h-[350px] overflow-y-auto scrollbar-hide">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLangSelect(lang)}
                  className={`w-full text-left px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    currentLang === lang.name 
                      ? 'bg-school-accent text-white shadow-lg' 
                      : 'hover:bg-slate-50 dark:hover:bg-white/5 text-school-navy dark:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{lang.name}</span>
                    {currentLang === lang.name && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                  </div>
                </button>
              ))}
            </div>
            
            {/* Google Attribution as required by TOS for free widget usage */}
            <div className="p-3 bg-slate-50 dark:bg-black/20 border-t border-black/5 dark:border-white/5 flex items-center justify-center gap-2">
               <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Powered by</span>
               <img 
                 src="https://www.gstatic.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" 
                 alt="Google" 
                 className="h-3 opacity-50 grayscale hover:grayscale-0 transition-all"
               />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        .goog-te-banner-frame, .goog-te-gadget-simple, .goog-te-menu-frame, .goog-te-gadget span, .goog-logo-link { display: none !important; }
        body { top: 0px !important; }
        .goog-te-gadget { font-size: 0 !important; }
      `}} />
    </div>
  );
};




