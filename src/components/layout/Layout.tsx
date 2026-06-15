import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from '../../lib/router-compat';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Phone, Mail, MapPin, Key, Settings, ArrowRight, ChevronRight, Users2, ImageIcon, ExternalLink, Facebook, Instagram, Youtube, Twitter, ArrowUp, ArrowDown, MessageSquare, Sun, Moon, Search } from 'lucide-react';
import { AppData, QuickLink } from '../../types';

import { Helmet } from 'react-helmet-async';
import ScrollButtons from '../ui/ScrollButtons';
import PopupMessage from '../ui/PopupMessage';
import { GlobalSearch } from '../ui/GlobalSearch';
import { LanguageSelector } from '../ui/LanguageSelector';
import dynamic from 'next/dynamic';

const NavThreeBackground = dynamic(() => import('../ui/NavThreeBackground').then(m => m.NavThreeBackground), { ssr: false });
import IndianFlag from '../ui/IndianFlag';
import CanvasFooterEffect from '../ui/CanvasFooterEffect';
import SidebarLinks from './SidebarLinks';

interface LayoutProps {
  children: React.ReactNode;
  data: AppData;
  navbarTheme?: 'light' | 'dark';
}

interface NavLink {
  id: string;
  label: string;
  href: string;
  subLinks?: NavLink[];
}

const Layout = ({ children, data, navbarTheme = 'light' }: LayoutProps) => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [visitorCount, setVisitorCount] = useState<number | null>(() => {
    if (data.site_stats && data.site_stats.length > 0) {
      return data.site_stats[0].visitor_count;
    }
    return null;
  });
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log('[Layout] Fetching visitor count...');
        let visitorId = '';
        let isSessionTracked = 'false';
        if (typeof window !== 'undefined') {
          visitorId = localStorage.getItem('st_xaviers_visitor_id') || '';
          if (!visitorId) {
            visitorId = 'v_' + Date.now() + '_' + Math.random().toString(36).substring(2, 12);
            localStorage.setItem('st_xaviers_visitor_id', visitorId);
          }
          isSessionTracked = sessionStorage.getItem('st_xaviers_visited_session') || 'false';
          if (isSessionTracked === 'true') {
            console.log('[Layout] Session already tracked. Skipping visitor API call.');
            return;
          }
          sessionStorage.setItem('st_xaviers_visited_session', 'true');
        }
        const response = await fetch(`/api/visit?visitorId=${encodeURIComponent(visitorId)}&sessionTracked=false`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text();
          console.warn("[Layout] Visitor API returned non-JSON:", text.substring(0, 100));
          return;
        }
        const rData = await response.json();
        if (rData.success) {
          console.log('[Layout] Visitor count updated:', rData.count);
          setVisitorCount(rData.count);
        }
      } catch (err) {
        console.warn('[Layout] Failed to fetch visitor count:', err);
      }
    };
    fetchStats();
  }, []);

  // Determine navbar text color based on scroll and theme
  const isLightNav = true; // Always use light nav (black text) as requested
  const navTextColor = 'text-school-navy';
  const navSubTextColor = 'text-school-navy/40';
  const navLinkColor = 'text-school-navy/70';
  const logoInvert = '';

  // Transform flat menu data into hierarchical structure
  const navLinks = React.useMemo<NavLink[]>(() => {
    if (!data.navigation_menu) return [];
    
    const buildTree = (parentId: string | null = null): NavLink[] => {
      return data.navigation_menu
        .filter(m => {
          const mParent = (!m.parent_id || m.parent_id === 'null' || m.parent_id === '') ? null : m.parent_id;
          const targetParent = (!parentId || parentId === 'null' || parentId === '') ? null : parentId;
          return mParent === targetParent && m.is_enabled !== false;
        })
        .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
        .map(m => {
          const subLinks = buildTree(m.id);
          return {
            id: m.id,
            label: (m.label || '').toUpperCase(),
            href: m.attachmentUrl || m.href,
            subLinks: subLinks.length > 0 ? subLinks : undefined
          };
        });
    };

    return buildTree();
  }, [data.navigation_menu]);

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const isHome = location.pathname === '/';

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen selection:bg-school-accent selection:text-white overflow-x-hidden dark:text-slate-200" style={{ 
      backgroundColor: isDark ? '#020617' : '#fcfbf7', // Unified Refined off-white
      position: 'relative'
    }}>
      <Helmet>
        <title>{data.settings?.ogTitle || "St. Xavier's Sr. Sec. School, Jaipur | Excellence in Education Since 1941"}</title>
        <meta name="description" content={data.settings?.ogDescription || "St. Xavier's Senior Secondary School, Jaipur - A premier Jesuit institution dedicated to holistic development and educational excellence since 1941."} />
        <meta name="keywords" content="St. Xavier's Jaipur, Xaviers Jaipur, Best School in Jaipur, Jesuit School, St. Xavier's Sr. Sec. School Bhagwan Das Road" />
        
        {/* Dynamic Search Verification meta tags */}
        {data.settings?.googleSearchConsoleKey && (
          <meta name="google-site-verification" content={data.settings.googleSearchConsoleKey} />
        )}
        {data.settings?.bingWebmasterKey && (
          <meta name="msvalidate.01" content={data.settings.bingWebmasterKey} />
        )}
        {data.settings?.indexNowKey && (
          <meta name="indexnow-key" content={data.settings.indexNowKey} />
        )}

        {/* Open Graph Elements */}
        <meta property="og:title" content={data.settings?.ogTitle || data.settings?.siteName || "St. Xavier's Sr. Sec. School, Jaipur"} />
        <meta property="og:description" content={data.settings?.ogDescription || "St. Xavier's Senior Secondary School, Jaipur - A premier Jesuit institution dedicated to holistic development and educational excellence since 1941."} />
        <meta property="og:image" content={data.settings?.ogImage || data.settings?.siteLogo || "https://bfqyrnvyhivflapjwllk.supabase.co/storage/v1/object/public/uploads/Global_Settings/cropped-Favicon-300x300.png"} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ""} />

        {/* Twitter Card configuration */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={data.settings?.ogTitle || data.settings?.siteName || "St. Xavier's Sr. Sec. School, Jaipur"} />
        <meta name="twitter:description" content={data.settings?.ogDescription || "St. Xavier's Senior Secondary School, Jaipur - A premier Jesuit institution dedicated to holistic development and educational excellence since 1941."} />
        <meta name="twitter:image" content={data.settings?.ogImage || data.settings?.siteLogo || "https://bfqyrnvyhivflapjwllk.supabase.co/storage/v1/object/public/uploads/Global_Settings/cropped-Favicon-300x300.png"} />
      </Helmet>
      {/* Admin Institutional Popup - High level */}
      {data.settings && <PopupMessage settings={data.settings} />}

      {/* Persistent Resource Sidebar */}
      <SidebarLinks links={data.useful_links || []} />

      {/* Large Single Cross Watermark - Positioned on the left across whole page */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.06] dark:opacity-[0.1] flex justify-start pl-4 md:pl-16"
      >
        <div 
          className="h-full w-64 md:w-[800px] bg-no-repeat pt-32"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M46 2h8v96h-8z M10 25h80v6H10z' fill='${isDark ? '%23ffffff' : '%23002147'}'/%3E%3C/svg%3E")`,
            backgroundPosition: 'center 80px', 
            backgroundSize: '100% auto', 
          }}
        />
      </div>

      {!isHome ? (
        /* Subpage Header - Institutional Style */
        <div className="relative">
          {/* Top Info Bar */}
          <div className="hidden md:block bg-school-navy text-white py-2 relative z-[120]">
            <div className="max-w-[1440px] mx-auto px-4 lg:px-8 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
              <div className="flex items-center gap-6">
                <span className="flex items-center gap-2"><Phone size={12} /> {data.settings?.contactPhone}</span>
                <span className="flex items-center gap-2 max-md:hidden"><Mail size={12} /> {data.settings?.contactEmail}</span>
              </div>
              <div className="flex items-center gap-4">
                <Link to="/contact" className="hover:text-school-accent transition-colors">Career</Link>
                <div className="w-[1px] h-3 bg-white/20 mx-2" />
                <button onClick={() => setIsDark(!isDark)} className="flex items-center gap-1 hover:text-school-accent transition-colors">
                  {isDark ? <Sun size={12} /> : <Moon size={12} />} Mode
                </button>
              </div>
            </div>
          </div>

      {/* Unified Sticky Header for Subpages */}
          <header className={`z-[110] transition-all duration-500 bg-white dark:bg-slate-950 border-b border-black/5 ${isScrolled ? 'fixed top-0 inset-x-0 shadow-lg' : 'relative'}`}>
            {/* Row 1: Logo Section */}
            <div className={`transition-all duration-500 border-b border-black/5 ${isScrolled ? 'py-2' : 'py-6'}`}>
              <div className="max-w-[1440px] mx-auto px-4 lg:px-8 flex items-center justify-between">
                <div className="flex items-center gap-4 relative pr-12 lg:pr-0">
                  <Link to="/" className={`shrink-0 relative ${isScrolled ? 'w-10 h-10 md:w-12 md:h-12' : 'w-16 h-16 md:w-[100px] md:h-[100px]'}`}>
                    <img 
                      src="https://bfqyrnvyhivflapjwllk.supabase.co/storage/v1/object/public/uploads/Global_Settings/cropped-Favicon-300x300.png" 
                      alt="Logo" 
                      className="w-full h-full object-contain"
                    />
                  </Link>
                  <div className="flex flex-col justify-center min-w-0">
                    <Link to="/">
                      <h1 className={`font-serif font-bold text-[#1a1a1a] dark:text-white leading-[1.1] tracking-tight transition-all duration-500 uppercase ${isScrolled ? 'text-xs sm:text-base md:text-xl' : 'text-xs sm:text-xl md:text-[42px]'} whitespace-nowrap overflow-hidden text-ellipsis`}>
                        ST. XAVIER'S SR. SEC. SCHOOL
                      </h1>
                    </Link>
                    {!isScrolled && (
                      <p className="hidden md:block text-[13px] md:text-[17px] font-sans font-medium text-[#333] dark:text-slate-400 mt-1 leading-tight md:whitespace-nowrap">
                        Bhagwan Das Road, C-Scheme, Jaipur - 302001 &nbsp;|&nbsp; CBSE Affiliation No.: 1730003
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 md:gap-4 lg:gap-6">
                   <div className="hidden lg:flex items-center gap-6">
                      {data.settings?.flagEnabled && <IndianFlag src={data.settings?.flagImage} className={isScrolled ? 'w-8 h-5' : 'w-14 h-9'} />}
                      <div className="flex items-center gap-2">
                        <span className={`font-black uppercase tracking-widest text-[9px] hidden xl:block ${isScrolled ? 'text-school-navy/30' : 'text-school-navy/60'}`}>Language</span>
                        <LanguageSelector isScrolled={isScrolled} />
                      </div>
                      <button 
                        onClick={() => setIsSearchOpen(true)}
                        className="w-10 h-10 rounded-full flex items-center justify-center transition-all bg-slate-100 dark:bg-slate-800 hover:scale-110 active:scale-95 text-school-navy dark:text-white"
                      >
                        <Search size={isScrolled ? 16 : 20} />
                      </button>
                      {!isScrolled && (
                        <div className="text-right">
                           <p className="text-[10px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-widest leading-none">Established</p>
                           <p className="text-3xl font-black text-school-navy dark:text-school-accent italic opacity-20">1941</p>
                        </div>
                      )}
                      <Link to="/admin" className={`flex items-center gap-2 bg-school-navy text-white rounded-full uppercase tracking-widest font-black shadow-lg hover:scale-105 transition-all ${isScrolled ? 'px-4 py-2 text-[9px]' : 'px-6 py-2.5 text-[11px]'}`}>
                        <Key size={isScrolled ? 12 : 14} /> Admin Login
                      </Link>
                   </div>

                   {/* Mobile Menu Button - High Visibility */}
                   <div className="lg:hidden">
                      <button 
                        onClick={() => setIsNavOpen(true)} 
                        className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center bg-school-navy text-white shadow-xl hover:bg-school-accent transition-all active:scale-95"
                        aria-label="Open Menu"
                      >
                        <Menu size={24} />
                      </button>
                   </div>
                </div>
              </div>
            </div>

            {/* Row 2: Nav Bar */}
            <div className={`bg-white dark:bg-slate-900 transition-all duration-500 ${isScrolled ? 'py-0' : 'py-0'}`}>
              <div className="max-w-[1440px] mx-auto px-4 lg:px-8 flex items-center">
                <nav style={{ flexWrap: 'nowrap' }} className="flex-1 hidden lg:flex items-center justify-between w-full gap-x-0.5 min-[1150px]:gap-x-1 xl:gap-x-1.5 2xl:gap-x-2">
                  {navLinks.map(l => (
                    <div 
                      key={l.id} 
                      className="relative"
                      onMouseEnter={() => setActiveDropdown(l.label)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      {l.subLinks ? (
                        <>
                          <button 
                            className={`py-2.5 px-0.5 min-[1150px]:px-1 xl:px-1.5 2xl:px-2 text-[8px] min-[1150px]:text-[9px] min-[1250px]:text-[10px] xl:text-[11px] 2xl:text-xs font-bold uppercase tracking-wider flex items-center gap-0.5 transition-all border-b-2 border-transparent hover:text-school-accent whitespace-nowrap ${activeDropdown === l.label ? 'text-school-accent border-school-accent bg-slate-50 dark:bg-slate-800' : 'text-school-navy dark:text-white'}`}
                          >
                            {l.label.toUpperCase()}
                            <ArrowDown size={9} className={`transition-transform duration-300 ${activeDropdown === l.label ? 'rotate-180' : 'opacity-40'}`} />
                          </button>
                          <AnimatePresence>
                            {activeDropdown === l.label && (
                              <motion.div 
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 5 }}
                                className="absolute top-full left-0 w-64 pt-0 z-[120] shadow-2xl"
                              >
                                <div className="bg-white dark:bg-slate-900 border border-black/5 p-2 rounded-b-xl shadow-2xl">
                                  {l.subLinks.map(sl => (
                                    <DropdownItem key={sl.id} sl={sl} onSelect={() => setActiveDropdown(null)} />
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        <Link 
                          to={l.href}
                          className={`py-2.5 px-0.5 min-[1150px]:px-1 xl:px-1.5 2xl:px-2 text-[8px] min-[1150px]:text-[9px] min-[1250px]:text-[10px] xl:text-[11px] 2xl:text-xs font-bold uppercase tracking-wider transition-all border-b-2 border-transparent hover:text-school-accent whitespace-nowrap ${location.pathname === l.href ? 'text-school-accent border-school-accent' : 'text-school-navy dark:text-white'}`}
                        >
                          {l.label.toUpperCase()}
                        </Link>
                      )}
                    </div>
                  ))}
                </nav>

                <div className="ml-auto hidden md:flex lg:flex items-center gap-4">
                </div>
              </div>
            </div>
          </header>

          {/* Spacer if sticky */}
          {isScrolled && <div className="h-40" />} 
        </div>
      ) : (
        /* Original Home Header */
        <header className={`fixed top-0 inset-x-0 z-[100] transition-all duration-500 ${isScrolled ? 'bg-white shadow-lg' : 'bg-white shadow-sm'}`}>
          {/* Row 1: Brand & Actions */}
          <div className={`transition-all duration-500 border-b border-black/5 ${isScrolled ? 'py-1 md:py-1.5' : 'py-3 md:py-4'}`}>
            <div className="max-w-[1440px] mx-auto px-4 lg:px-8 flex items-center justify-between">
              {/* Brand Area - Left Defined */}
              <div className="flex items-center gap-4 relative pr-12 lg:pr-0">
                <Link to="/" className={`shrink-0 relative ${isScrolled ? 'w-10 h-10 md:w-12 md:h-12' : 'w-10 h-10 md:w-[70px] md:h-[70px]'}`}>
                  <img 
                    src="https://bfqyrnvyhivflapjwllk.supabase.co/storage/v1/object/public/uploads/Global_Settings/cropped-Favicon-300x300.png" 
                    alt="Logo" 
                    className="w-full h-full object-contain"
                  />
                </Link>
                <div className="flex flex-col min-w-0">
                  <Link to="/">
                    <span className={`font-serif font-bold text-[#1a1a1a] dark:text-white leading-tight transition-all duration-500 uppercase ${isScrolled ? 'text-sm sm:text-base md:text-xl' : 'text-sm sm:text-lg md:text-[32px]'} whitespace-nowrap overflow-hidden text-ellipsis`}>
                      ST. XAVIER'S SR. SEC. SCHOOL
                    </span>
                  </Link>
                  {!isScrolled && (
                    <span className="hidden md:block text-[10px] md:text-[14px] font-sans font-medium text-slate-500 dark:text-slate-400 leading-tight mt-1 md:whitespace-nowrap">
                      Bhagwan Das Road, C-Scheme, Jaipur &nbsp;|&nbsp; CBSE Affiliation No.: 1730003
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {/* Desktop/Wide Actions */}
                <div className="hidden lg:flex items-center gap-4">
                  {data.settings?.flagEnabled && <IndianFlag src={data.settings?.flagImage} className={isScrolled ? 'w-8 h-5' : 'w-12 h-8'} />}
                  <div className="flex items-center gap-2">
                    <span className={`font-black uppercase tracking-widest text-[8px] hidden xl:block ${isScrolled ? 'text-school-navy/30' : 'text-school-navy/60'}`}>Translate</span>
                    <LanguageSelector isScrolled={isScrolled} />
                  </div>
                  <button 
                    onClick={() => setIsSearchOpen(true)}
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all bg-slate-100 dark:bg-slate-800 hover:scale-110 active:scale-95 text-school-navy dark:text-white"
                  >
                    <Search size={18} />
                  </button>
                  <button 
                    onClick={() => setIsDark(!isDark)}
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all bg-slate-100 dark:bg-slate-800 hover:scale-110 active:scale-95 text-school-navy dark:text-white"
                  >
                    {isDark ? <Sun size={18} /> : <Moon size={18} />}
                  </button>
                  <Link 
                    to="/admin" 
                    className="flex items-center gap-2 px-6 py-2.5 bg-school-navy text-white rounded-full text-[11px] uppercase tracking-widest font-black shadow-lg hover:scale-105 active:scale-95 transition-all"
                  >
                    <Key size={14} /> Admin Login
                  </Link>
                </div>

                {/* Mobile/Tablet Actions */}
                <div className="lg:hidden flex items-center gap-2">
                  <button 
                    onClick={() => setIsNavOpen(true)}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center bg-school-navy text-white shadow-xl hover:bg-school-accent transition-all active:scale-95"
                    aria-label="Open Menu"
                  >
                    <Menu size={24} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Navigation Bar */}
          <div className={`bg-white dark:bg-slate-900/50 backdrop-blur-md transition-all duration-500 ${isScrolled ? 'py-0.5' : 'py-0'}`} style={{ WebkitBackdropFilter: 'blur(12px)' }}>
            <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
              <nav style={{ flexWrap: 'nowrap' }} className="hidden lg:flex items-center justify-between w-full gap-x-0.5 min-[1150px]:gap-x-1 xl:gap-x-1.5 2xl:gap-x-2">
                {navLinks.map(l => (
                  <div 
                    key={l.id} 
                    className="relative group"
                    onMouseEnter={() => setActiveDropdown(l.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    {l.subLinks ? (
                      <>
                        <button 
                          className={`py-2.5 px-0.5 min-[1150px]:px-1 xl:px-1.5 2xl:px-2 text-[8px] min-[1150px]:text-[9px] min-[1250px]:text-[10px] xl:text-[11px] 2xl:text-xs font-black uppercase tracking-wider flex items-center gap-0.5 transition-all text-school-navy hover:text-school-accent dark:text-white border-b-2 border-transparent hover:border-school-accent whitespace-nowrap ${activeDropdown === l.label ? 'text-school-accent border-school-accent' : ''}`}
                        >
                          {l.label.toUpperCase()}
                          <ArrowDown size={9} className={`transition-transform duration-300 ${activeDropdown === l.label ? 'rotate-180' : 'opacity-40'}`} />
                        </button>
                        <AnimatePresence>
                          {activeDropdown === l.label && (
                            <motion.div 
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 5 }}
                              className="absolute top-full left-0 pt-0 w-64 z-[110]"
                            >
                              <div className="bg-white dark:bg-slate-900 rounded-b-2xl shadow-2xl border border-black/5 p-2 mt-0">
                                <div className="grid gap-1">
                                  {l.subLinks.map(sl => (
                                    <DropdownItem key={sl.id} sl={sl} onSelect={() => setActiveDropdown(null)} />
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link 
                        to={l.href}
                        className={`py-2.5 px-0.5 min-[1150px]:px-1 xl:px-1.5 2xl:px-2 text-[8px] min-[1150px]:text-[9px] min-[1250px]:text-[10px] xl:text-[11px] 2xl:text-xs font-black uppercase tracking-wider transition-all text-school-navy hover:text-school-accent dark:text-white border-b-2 border-transparent hover:border-school-accent whitespace-nowrap ${location.pathname === l.href ? 'text-school-accent border-school-accent' : ''}`}
                      >
                        {l.label.toUpperCase()}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </div>
        </header>

      )}


      {/* Magical Mobile Nav */}
      <AnimatePresence>
        {isNavOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[600] bg-black/40 backdrop-blur-md lg:hidden"
            style={{ WebkitBackdropFilter: 'blur(12px)' }}
            onClick={() => setIsNavOpen(false)}
          >
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white dark:bg-slate-950 flex flex-col shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute inset-0 z-0">
                <NavThreeBackground />
              </div>

              <div className="flex justify-between items-center p-6 border-b border-black/5 dark:border-white/5 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md sticky top-0 z-10" style={{ position: '-webkit-sticky', WebkitBackdropFilter: 'blur(12px)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-white dark:bg-slate-800 p-2 rounded-2xl shadow-sm border border-black/5 dark:border-white/5">
                    <img src={data.settings?.siteLogo || "https://bfqyrnvyhivflapjwllk.supabase.co/storage/v1/object/public/uploads/Global_Settings/cropped-Favicon-300x300.png"} alt="Logo" className="w-full h-full object-contain" />
                  </div>
                </div>
                <button 
                  onClick={() => setIsNavOpen(false)} 
                  className="p-3 text-school-navy dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all bg-slate-50 shadow-sm"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto px-6 py-8 relative z-10">
                {/* Mobile Top Actions (Language, Theme, Search, Jobs) */}
                <div className="flex items-center justify-between gap-2 mb-8 p-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-3xl border border-black/5 dark:border-white/5 shadow-sm" style={{ WebkitBackdropFilter: 'blur(12px)' }}>
                   <LanguageSelector isScrolled={false} align="left" />
                   <div className="flex items-center gap-2">
                      <Link 
                        to="/careers" 
                        onClick={() => setIsNavOpen(false)}
                        className="w-10 h-10 rounded-full flex items-center justify-center transition-all bg-white dark:bg-slate-800 text-school-navy dark:text-white shadow-sm font-black text-[9px] uppercase"
                      >
                        Jobs
                      </Link>
                      <button 
                        onClick={() => setIsDark(!isDark)}
                        className="w-10 h-10 rounded-full flex items-center justify-center transition-all bg-white dark:bg-slate-800 text-school-navy dark:text-white shadow-sm"
                      >
                        {isDark ? <Sun size={18} /> : <Moon size={18} />}
                      </button>
                      <button 
                        onClick={() => {
                          setIsNavOpen(false);
                          setIsSearchOpen(true);
                        }}
                        className="w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-slate-800 text-school-navy dark:text-white shadow-sm"
                      >
                        <Search size={18} />
                      </button>
                   </div>
                </div>

                <motion.div 
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.05
                      }
                    }
                  }}
                  className="grid gap-2"
                >
                  {navLinks.map(l => (
                    <motion.div
                      key={l.id}
                      variants={{
                        hidden: { opacity: 0, x: 20 },
                        visible: { opacity: 1, x: 0 }
                      }}
                    >
                      <MobileNavLink link={l} onClose={() => setIsNavOpen(false)} isDark={isDark} />
                    </motion.div>
                  ))}
                  
                  {/* Mobile Bottom Links */}
                  <motion.div 
                    variants={{
                      hidden: { opacity: 0, x: 20 },
                      visible: { opacity: 1, x: 0 }
                    }}
                    className="mt-8 pt-8 border-t border-black/5 dark:border-white/5 space-y-4"
                  >
                     <button 
                        onClick={() => {
                          setIsDark(!isDark);
                          setIsNavOpen(false);
                        }} 
                        className="flex items-center gap-3 text-slate-600 dark:text-slate-400 font-bold hover:text-school-accent transition-colors"
                     >
                        {isDark ? <Sun size={18} /> : <Moon size={18} />} Switch to {isDark ? 'Light' : 'Dark'} Mode
                     </button>
                     <Link to="/admin" onClick={() => setIsNavOpen(false)} className="flex items-center gap-3 text-slate-600 dark:text-slate-400 font-bold hover:text-school-accent transition-colors">
                        <Key size={18} /> Admin Portal
                     </Link>
                     <Link to="/contact" onClick={() => setIsNavOpen(false)} className="flex items-center gap-3 text-slate-600 dark:text-slate-400 font-bold hover:text-school-accent transition-colors">
                        <MessageSquare size={18} /> Connect With Us
                     </Link>
                     <Link to="/careers" onClick={() => setIsNavOpen(false)} className="flex items-center gap-3 text-slate-600 dark:text-slate-400 font-bold hover:text-school-accent transition-colors">
                        <Users2 size={18} /> Join Our Faculty (Careers)
                     </Link>
                  </motion.div>
                </motion.div>
              </div>

              <div className="p-6 border-t border-black/5 dark:border-white/5 bg-slate-50 dark:bg-slate-900/50">
                 <div className="flex items-center gap-4 text-slate-400 dark:text-slate-500">
                    <Phone size={16} />
                    <span className="text-xs font-bold">{data.settings?.contactPhone}</span>
                 </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {children}
      </main>

      <footer className="bg-slate-950 text-white pt-32 pb-16 relative overflow-hidden mt-32">
        <CanvasFooterEffect />
        {/* Aesthetic Background Elements */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-school-accent/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-school-gold/5 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Institutional Signature Section - Refined for Prestige */}
          <div className="mb-24 relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-school-accent/20 via-school-gold/20 to-school-accent/20 rounded-[40px] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-[40px] flex flex-col md:flex-row items-center gap-8 md:gap-12" style={{ WebkitBackdropFilter: 'blur(24px)' }}>
              <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 bg-white p-4 rounded-3xl shadow-inner">
                 <img 
                   src="https://bfqyrnvyhivflapjwllk.supabase.co/storage/v1/object/public/uploads/Global_Settings/cropped-Favicon-300x300.png" 
                   alt="St. Xavier's Logo" 
                   className="w-full h-full object-contain"
                 />
              </div>
              <div className="flex flex-col text-center md:text-left space-y-4">
                 <h2 className="font-display font-medium text-3xl md:text-5xl lg:text-6xl text-white leading-none tracking-tight">
                   St. Xavier's <span className="text-school-accent italic">Sr. Sec. School</span>
                 </h2>
                 <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6 text-white/50 font-medium text-sm md:text-lg">
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-school-accent"></div>
                      <span>Bhagwan Das Road, C-Scheme, Jaipur</span>
                    </div>
                    <span className="hidden md:inline text-white/20">|</span>
                    <div className="flex items-center justify-center md:justify-start gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-school-gold"></div>
                       <span>CBSE Affiliation No.: 1730003</span>
                    </div>
                 </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 border-b border-white/5 pb-24">
            <div className="lg:col-span-4 space-y-12">
              <div className="space-y-6">
                <h4 className="font-serif italic text-2xl text-white/90">Our Mission</h4>
                <p className="text-xl text-white/40 font-medium leading-relaxed italic">
                  "{data.content?.footerDescription || 'Pioneering Jesuit excellence since 1941. Dedicated to producing men and women for others.'}"
                </p>
              </div>
              
              <div className="flex gap-4">
                {[
                  { Icon: Facebook, href: "https://www.facebook.com/stxaviersjaipur/" },
                  { Icon: Instagram, href: "https://www.instagram.com/xaviers_jaipur/" },
                  { Icon: Youtube, href: "https://www.youtube.com/@st.xaviersc-schemejaipur2421" }
                ].map((item, i) => (
                  <a 
                    key={i} 
                    href={item.href} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-slate-950 hover:border-white transition-all duration-500 group"
                  >
                    <item.Icon size={20} className="group-hover:scale-110 transition-transform" />
                  </a>
                ))}
              </div>
            </div>

            <div className="lg:col-span-8 flex flex-col gap-10" id="site-map">
              <div className="flex items-center gap-4">
                <span className="h-[1px] flex-1 bg-white/10" />
                <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em]">Site Map</h4>
                <span className="h-[1px] flex-1 bg-white/10" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
                <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-school-accent uppercase tracking-[0.3em]">Institutional</h4>
                  <ul className="space-y-3">
                    <li><Link to="/history" className="text-white/40 hover:text-white transition-all text-sm font-medium">History</Link></li>
                    <li><Link to="/jesuit-education-objectives" className="text-white/40 hover:text-white transition-all text-sm font-medium">Jesuit Education</Link></li>
                    <li><Link to="/founder-patron" className="text-white/40 hover:text-white transition-all text-sm font-medium">Founder Patron</Link></li>
                    <li><Link to="/governing-members" className="text-white/40 hover:text-white transition-all text-sm font-medium">Governing Body</Link></li>
                  </ul>
                </div>
                
                <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-school-gold uppercase tracking-[0.3em]">Academics</h4>
                  <ul className="space-y-3">
                    <li><Link to="/admission-policy" className="text-white/40 hover:text-white transition-all text-sm font-medium">Admissions</Link></li>
                    <li><Link to="/fees" className="text-white/40 hover:text-white transition-all text-sm font-medium">Fee Structure</Link></li>
                    <li><Link to="/scholarships" className="text-white/40 hover:text-white transition-all text-sm font-medium">Scholarships</Link></li>
                    <li><Link to="/staff" className="text-white/40 hover:text-white transition-all text-sm font-medium">Our Faculty</Link></li>
                    <li><Link to="/stream-toppers" className="text-white/40 hover:text-white transition-all text-sm font-medium">Merit Holders</Link></li>
                  </ul>
                </div>
  
                <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Life at Xavier's</h4>
                  <ul className="space-y-3">
                    <li><Link to="/events" className="text-white/40 hover:text-white transition-all text-sm font-medium">School Events</Link></li>
                    <li><Link to="/gallery" className="text-white/40 hover:text-white transition-all text-sm font-medium">Media Gallery</Link></li>
                    <li><Link to="/sports-complex" className="text-white/40 hover:text-white transition-all text-sm font-medium">Sports Center</Link></li>
                    <li><Link to="/achievements" className="text-white/40 hover:text-white transition-all text-sm font-medium">Student Pride</Link></li>
                    <li><Link to="/alumni" className="text-white/40 hover:text-white transition-all text-sm font-medium">Alumni Portal</Link></li>
                  </ul>
                </div>
  
                <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Contact & Info</h4>
                  <ul className="space-y-3">
                    <li><Link to="/contact" className="text-white/40 hover:text-white transition-all text-sm font-medium">Contact Us</Link></li>
                    <li><Link to="/mandatory-disclosures" className="text-white/40 hover:text-white transition-all text-sm font-medium">Mandatory Disclosure</Link></li>
                    <li><Link to="/careers" className="text-white/40 hover:text-white transition-all text-sm font-medium">Careers</Link></li>
                    <li><Link to="/transfer-certificate" className="text-white/40 hover:text-white transition-all text-sm font-medium">TC Search</Link></li>
                    <li><Link to="/notice-board" className="text-white/40 hover:text-white transition-all text-sm font-medium">Digital Notice Board</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-16 flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="flex items-center gap-6 text-white/40 text-[11px] font-bold uppercase tracking-widest leading-relaxed">
                <p>© 2026 St. Xavier’s Sr. Sec. School | All Rights Reserved.</p>
              </div>
              <p className="text-[10px] text-white/60 tracking-[0.3em] font-black uppercase">
                Designed with Precision by <span className="text-school-gold">ABHISHEK MATHUR</span>
              </p>
            </div>
            
            <div className="flex flex-col items-center md:items-end gap-6">
              <div className="flex items-center gap-12 text-[10px] font-black tracking-[0.3em] uppercase text-white/30">
                <span className="text-white/10">|</span>
                <Link 
                  to="/sitemap" 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Complete Sitemap
                </Link>
                <span className="text-white/10">|</span>
              </div>

              {visitorCount !== null && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="px-4 py-1.5 bg-white/5 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-3 group hover:border-school-accent transition-colors"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-school-accent animate-pulse" />
                  <span className="text-[9px] font-black text-white/40 tracking-[0.2em] uppercase group-hover:text-school-accent transition-colors">
                    Visitor Count: <span className="text-white font-mono">{visitorCount.toLocaleString()}</span>
                  </span>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </footer>


      {/* Floating CTA - Ultra Modern & Responsive */}
      <AnimatePresence>
        {data.settings?.applyNowEnabled && (
          <motion.a 
            href={data.settings.applyNowUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            className="fixed bottom-4 right-4 md:bottom-10 md:right-10 z-[100] bg-school-gold text-white px-3 py-2 md:px-10 md:py-5 rounded-full font-black shadow-[0_10px_20px_rgba(255,0,146,0.2)] flex items-center gap-1.5 md:gap-4 group overflow-hidden text-[9px] md:text-base border border-white/20"
          >
            <span className="relative z-10">{data.settings.applyNowLabel || 'Apply Now'}</span>
            <div className="w-5 h-5 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform relative z-10 shrink-0">
              <ArrowUp className="rotate-45 scale-75 md:scale-100" size={18} />
            </div>
            <div className="absolute inset-0 bg-school-accent translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </motion.a>
        )}
      </AnimatePresence>

      {/* Modern AI/Help Chat Bubble */}
      <ChatBubble />

      {/* Global Search Dialog */}
      <GlobalSearch data={data} isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Floating Scroll Controls */}
      <ScrollButtons />
    </div>
  );
};

const ChatBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="fixed bottom-4 left-4 md:bottom-10 md:left-10 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="absolute bottom-20 left-0 w-80 md:w-96 bg-school-paper rounded-[40px] shadow-2xl border border-school-ink/5 dark:border-school-paper/10 overflow-hidden text-school-ink"
          >
            <div className="bg-school-accent p-8 text-white">
              <h4 className="text-2xl font-black italic">Assistant.</h4>
              <p className="text-white/60 text-sm font-medium mt-2">How can we help you today?</p>
            </div>
            <div className="p-8 space-y-6">
              <p className="text-school-ink/50 dark:text-school-paper/50 text-sm font-medium leading-relaxed">
                Welcome to St. Xavier's digital portal. You can find notices, fee structures, and campus highlights here.
              </p>
              <div className="grid gap-3">
                <Link to="/contact" onClick={() => setIsOpen(false)} className="flex items-center justify-between p-4 bg-school-ink/5 dark:bg-school-paper/5 rounded-2xl hover:bg-school-neon dark:hover:bg-school-neon dark:hover:text-school-ink transition-all group">
                   <span className="text-xs font-black uppercase text-school-navy dark:text-white group-hover:text-school-navy">ASK A QUESTION</span>
                   <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/notice-board" onClick={() => setIsOpen(false)} className="flex items-center justify-between p-4 bg-school-ink/5 dark:bg-school-paper/5 rounded-2xl hover:bg-school-neon dark:hover:bg-school-neon dark:hover:text-school-ink transition-all group">
                   <span className="text-xs font-black uppercase text-school-navy dark:text-white group-hover:text-school-navy">RECENT NOTICES</span>
                   <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            <div className="p-6 bg-school-ink/5 dark:bg-school-paper/5 text-center">
               <button onClick={() => setIsOpen(false)} className="text-[10px] font-black uppercase tracking-widest text-school-ink/20 dark:text-school-paper/20 hover:text-school-accent transition-colors">CLOSE ASSISTANT</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 md:w-20 md:h-20 bg-school-paper rounded-full shadow-2xl flex items-center justify-center text-school-accent relative group border border-school-ink/10"
      >
        <MessageSquare size={isOpen ? 24 : 32} className="relative z-10 transition-transform group-hover:rotate-12" />
        <div className="absolute inset-2 bg-school-accent/5 rounded-full animate-ping" />
      </motion.button>
    </div>
  );
};
const MobileNavLink = ({ link, onClose, depth = 0, isDark }: { link: NavLink; onClose: () => void; depth?: number; isDark?: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);

  const hasSubLinks = link.subLinks && link.subLinks.length > 0;

  if (hasSubLinks) {
    return (
      <div className="py-1">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center justify-between w-full py-3 px-4 rounded-xl transition-all ${
            isOpen 
              ? 'bg-slate-100 dark:bg-slate-800 text-school-accent' 
              : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900'
          }`}
        >
          <span className={`${depth === 0 ? 'text-sm font-black tracking-widest' : 'text-sm font-bold opacity-80'}`}>
            {link.label.toUpperCase()}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ArrowDown size={14} className={isOpen ? 'text-school-accent' : 'opacity-40'} />
          </motion.div>
        </button>
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
              className="overflow-hidden"
            >
              <div className="pt-2 pb-2 pl-4 space-y-1">
                {link.subLinks?.map(sl => (
                  <MobileNavLink key={sl.id} link={sl} onClose={onClose} depth={depth + 1} isDark={isDark} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="py-1">
      <Link 
        to={link.href} 
        onClick={onClose} 
        className={`flex items-center justify-between w-full py-3 px-4 rounded-xl transition-all hover:bg-slate-50 dark:hover:bg-slate-900 group ${
          depth === 0 
            ? 'text-sm font-black tracking-widest text-slate-800 dark:text-white' 
            : 'text-sm font-medium text-slate-600 dark:text-slate-400'
        }`}
      >
        <span>{link.label.toUpperCase()}</span>
        <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-all text-school-accent" />
      </Link>
    </div>
  );
};

const DropdownItem = ({ sl, onSelect }: { sl: NavLink; onSelect: () => void }) => {
  const [isSubOpen, setIsSubOpen] = useState(false);
  
  if (sl.subLinks) {
    return (
      <div 
        className="relative group/subItem"
        onMouseEnter={() => setIsSubOpen(true)}
        onMouseLeave={() => setIsSubOpen(false)}
      >
        <div className="px-4 py-3 flex items-center justify-between group-hover/subItem:bg-slate-50 dark:group-hover/subItem:bg-slate-800 transition-colors rounded-lg cursor-default">
          {sl.href !== '#' ? (
            <Link 
              to={sl.href}
              onClick={onSelect}
              className="text-[10px] font-black text-school-accent uppercase tracking-widest block hover:opacity-70 transition-opacity"
            >
              {sl.label.toUpperCase()}
            </Link>
          ) : (
            <p className="text-[10px] font-black text-school-accent uppercase tracking-widest">{sl.label.toUpperCase()}</p>
          )}
          <ChevronRight size={10} className="text-school-accent opacity-40 group-hover/subItem:opacity-100 transition-all" />
        </div>
        
        <AnimatePresence>
          {isSubOpen && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="absolute top-0 left-full w-64 pl-1 z-[130]"
            >
              <div className="bg-white dark:bg-slate-900 border border-black/5 p-2 rounded-xl shadow-2xl">
                {sl.subLinks.map(nsl => (
                  <Link 
                    key={nsl.id}
                    to={nsl.href}
                    onClick={onSelect}
                    className="block px-3 py-2 text-xs font-bold text-slate-500 hover:text-school-navy hover:bg-slate-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 rounded-lg transition-all uppercase"
                  >
                    {nsl.label.toUpperCase()}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <Link 
      to={sl.href}
      onClick={onSelect}
      className="block px-4 py-3 text-xs font-bold text-slate-500 hover:text-school-navy hover:bg-slate-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 rounded-lg transition-all uppercase"
    >
      {sl.label.toUpperCase()}
    </Link>
  );
};

export default Layout;
