import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppData } from '../types';
import { useSupabase } from '../components/SupabaseProvider';
import { supabaseService } from '../lib/supabaseService';
import { DEFAULT_DATA } from '../lib/defaultData';
import { motion, AnimatePresence } from 'motion/react';

interface AppDataContextProps {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
  loading: boolean;
  setLoading: (l: boolean) => void;
}

const AppDataContext = createContext<AppDataContextProps | undefined>(undefined);

export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin, loading: authLoading } = useSupabase();
  const [data, setData] = useState<AppData>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Suppress MetaMask specific connection errors that might be coming from browser extensions
    // or external scripts in the sandbox environment.
    const originalError = console.error;
    const originalWarn = console.warn;
    
    const isMetaMaskError = (msg: string) => {
      const lower = msg.toLowerCase();
      return lower.includes('metamask') || lower.includes('ethereum') || lower.includes('web3');
    };

    console.error = (...args) => {
      const msg = typeof args[0] === 'string' ? args[0] : (args[0]?.message || '');
      if (isMetaMaskError(msg)) return;
      originalError.apply(console, args);
    };
    
    console.warn = (...args) => {
      const msg = typeof args[0] === 'string' ? args[0] : (args[0]?.message || '');
      if (isMetaMaskError(msg)) return;
      originalWarn.apply(console, args);
    };

    const handleMetaMaskError = (event: any) => {
      const msg = event.message || (event.reason && event.reason.message) || '';
      if (isMetaMaskError(msg)) {
        if (event.preventDefault) event.preventDefault();
        if (event.stopImmediatePropagation) event.stopImmediatePropagation();
        return true;
      }
    };

    window.addEventListener('error', handleMetaMaskError, true);
    window.addEventListener('unhandledrejection', handleMetaMaskError, true);

    // Global click handler to suppress certain Web3-related events if needed
    const handleMessage = (e: MessageEvent) => {
      const msg = e.data?.msg || e.data?.type || '';
      if (typeof msg === 'string' && isMetaMaskError(msg)) {
        e.stopImmediatePropagation();
      }
    };
    window.addEventListener('message', handleMessage, true);
    
    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('error', handleMetaMaskError);
      window.removeEventListener('unhandledrejection', handleMetaMaskError);
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  // Disable right click on the entire website
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  useEffect(() => {
    if (data.settings?.faviconUrl) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = data.settings.faviconUrl;
    }
  }, [data.settings?.faviconUrl]);

  useEffect(() => {
    if (authLoading) return;

    const fetchDataAndSeed = async () => {
      try {
        const fetchedData = await supabaseService.fetchAllData();
        
        let hasData = false;
        if (fetchedData) {
          Object.values(fetchedData).forEach(arr => {
            if (Array.isArray(arr) && arr.length > 0) hasData = true;
          });
        }
        
        if (hasData && fetchedData) {
          const merged = { ...DEFAULT_DATA };
          Object.keys(fetchedData).forEach(key => {
            const k = key as keyof AppData;
            const val = fetchedData[k];
            
            if (val) {
              if (Array.isArray(val)) {
                const isContentTable = ['staff', 'notices', 'gallery', 'fees', 'links', 'events', 'achievements', 'studentHonors', 'navigation_menu', 'carousel', 'marquee', 'popups', 'school_info', 'academics', 'activities', 'alumni', 'parent_obligations', 'careers', 'mandatory_disclosures', 'contact_content', 'career_applications', 'school_history'].includes(k);
                
                if (val.length > 0 || !isContentTable) {
                  merged[k] = val as any;
                }
              } else {
                if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
                  merged[k] = { ...merged[k], ...val } as any;
                } else {
                  merged[k] = val as any;
                }
              }
            }
          });
          
          setData(merged);
        } else if (isAdmin) {
          console.log('Fresh Supabase detected and user is admin. Starting seeding in background...');
          supabaseService.syncAll(DEFAULT_DATA).then(async () => {
             console.log('[Seeding] Initial seed completed');
             const finalData = await supabaseService.fetchAllData();
             if (finalData) {
               setData(prev => {
                 const updated = { ...prev };
                 Object.keys(finalData).forEach(key => {
                   const k = key as keyof AppData;
                   const val = finalData[k];
                   if (Array.isArray(val) && val.length > 0) {
                     updated[k] = val as any;
                   } else if (val && typeof val === 'object' && !Array.isArray(val)) {
                     updated[k] = { ...updated[k], ...val } as any;
                   }
                 });
                 return updated;
               });
             }
          }).catch(e => console.error('[Seeding] Error:', e));
          
          setData(DEFAULT_DATA);
        } else {
          console.log('DB is empty. Log in as admin to sync/seed data.');
          setData(DEFAULT_DATA);
        }
      } catch (err) {
        console.error('Data sync error:', err);
        setData(DEFAULT_DATA);
      } finally {
        setLoading(false);
      }
    };

    fetchDataAndSeed();
  }, [isAdmin, authLoading]);

  return (
    <AppDataContext.Provider value={{ data, setData, loading, setLoading }}>
      <AnimatePresence mode="wait">
        {(loading || authLoading) ? (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-school-navy overflow-hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="relative flex flex-col items-center"
            >
              <div className="absolute inset-0 bg-school-gold/10 rounded-full blur-[100px] animate-pulse"></div>
              <img 
                src="https://xaviersjaipur.edu.in/wp-content/uploads/2023/12/SchoolLogoTest.png" 
                alt="Legacy Loading" 
                className="w-40 h-40 relative z-10 brightness-110 drop-shadow-[0_0_30px_rgba(226,180,80,0.3)]"
              />
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="mt-10 text-center"
              >
                <h3 className="text-school-paper font-display text-2xl font-black tracking-[0.3em] uppercase">St. Xavier's</h3>
                <p className="text-school-gold font-serif italic text-sm mt-2 tracking-widest opacity-60">Established 1941 • Jaipur</p>
              </motion.div>
            </motion.div>
          </div>
        ) : (
          children
        )}
      </AnimatePresence>
    </AppDataContext.Provider>
  );
};

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (context === undefined) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
};
