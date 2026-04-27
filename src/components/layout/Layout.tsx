import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Phone, Mail, MapPin, Key, Settings, ArrowRight, ChevronRight, Users2, ImageIcon, ExternalLink, Facebook, Instagram, Youtube, ArrowUp, ArrowDown, MessageSquare, Sun, Moon } from 'lucide-react';
import { AppData, QuickLink } from '../../types';

interface LayoutProps {
  children: React.ReactNode;
  data: AppData;
  navbarTheme?: 'light' | 'dark';
}

interface NavLink {
  label: string;
  href: string;
  subLinks?: NavLink[];
}

const Layout = ({ children, data, navbarTheme = 'light' }: LayoutProps) => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
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

  // Determine navbar text color based on scroll and theme
  const isLightNav = true; // Always use light nav (black text) as requested
  const navTextColor = 'text-school-navy';
  const navSubTextColor = 'text-school-navy/40';
  const navLinkColor = 'text-school-navy/70';
  const logoInvert = '';

  // Transform flat menu data into hierarchical structure
  const navLinks = React.useMemo<NavLink[]>(() => {
    if (!data.menu) return [];
    
    const buildTree = (parentId: string | null = null): NavLink[] => {
      return data.menu
        .filter(m => m.parent_id === parentId)
        .sort((a, b) => a.order_index - b.order_index)
        .map(m => {
          const subLinks = buildTree(m.id);
          return {
            label: m.label,
            href: m.href,
            subLinks: subLinks.length > 0 ? subLinks : undefined
          };
        });
    };

    return buildTree();
  }, [data.menu]);

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-transparent selection:bg-school-accent selection:text-white overflow-x-hidden dark:text-slate-200">
      {/* Multi-Level Header Section */}
      <header className="w-full relative z-[60] bg-white shadow-sm border-b border-school-ink/5">
        {/* Top Utility Bar */}
        <div className="py-1 border-b border-school-ink/10">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex items-center justify-between">
            <div className="flex items-center gap-4 md:gap-6">
              <div className="hidden sm:flex gap-4">
                <a href="https://www.facebook.com/stxaviersjaipur/" target="_blank" rel="noopener noreferrer" className="text-school-navy/60 hover:text-school-accent transition-colors"><Facebook size={12} fill="currentColor" /></a>
                <a href="https://www.instagram.com/xaviers_jaipur/" target="_blank" rel="noopener noreferrer" className="text-school-navy/60 hover:text-school-accent transition-colors"><Instagram size={12} /></a>
                <a href="https://www.youtube.com/@st.xaviersc-schemejaipur2421" target="_blank" rel="noopener noreferrer" className="text-school-navy/60 hover:text-school-accent transition-colors"><Youtube size={12} fill="currentColor" /></a>
              </div>
              <div className="hidden lg:flex items-center gap-2 text-school-navy text-[12px] font-bold">
                <Phone size={14} className="text-school-accent" />
                <span>{data.settings?.contactPhone || '0141-2372336'}</span>
              </div>
            </div>
            <div className="flex items-center gap-4 md:gap-6">
              <button 
                onClick={() => setIsDark(!isDark)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-school-navy/60 hover:text-school-accent hover:bg-school-accent/5 transition-all active:scale-95"
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDark ? <Sun size={14} /> : <Moon size={14} />}
              </button>
              <div className="flex gap-4 md:gap-6 text-school-navy text-[10px] md:text-[12px] font-bold uppercase tracking-wider">
                <Link to="/admin" className="hover:text-school-accent transition-colors">Login</Link>
                <Link to="/contact" className="hover:text-school-accent transition-colors hidden sm:block">Contact</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Priority Links Ticker */}
        <div className="py-1 overflow-hidden relative border-b border-school-ink/5 bg-school-paper/50">
          <div className="flex whitespace-nowrap animate-marquee py-1">
             {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-12 px-6">
                  {data.links?.filter(l => l.isPriority).map(link => (
                    <a 
                      key={link.id} 
                      href={link.url} 
                      className="flex items-center gap-3 group"
                    >
                      <span className="w-1.5 h-1.5 bg-school-accent rounded-full animate-pulse group-hover:scale-150 transition-transform" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-school-navy group-hover:text-school-accent transition-colors">
                        {link.title}
                      </span>
                    </a>
                  ))}
                </div>
             ))}
          </div>
        </div>

        {/* Main Branding Section - White Background */}
        <div className={`py-1 transition-all duration-300 ${isScrolled ? 'fixed lg:relative top-0 inset-x-0 !py-1 bg-white group border-b border-school-ink/10 shadow-xl' : 'relative'}`}>
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex items-center justify-between">
            <div className="flex items-center gap-4 md:gap-6">
              <Link to="/" className="w-10 h-10 md:w-14 md:h-14 shrink-0 transition-transform hover:scale-110">
                <img 
                  src={data.settings?.siteLogo || "https://xaviersjaipur.edu.in/wp-content/uploads/2023/12/SchoolLogoTest.png"} 
                  alt={data.settings?.siteName || "St. Xavier's Logo"} 
                  className="w-full h-full object-contain"
                />
              </Link>
              <div className="flex flex-col">
                <h1 className="text-xl md:text-2xl font-black text-school-navy drop-shadow-sm tracking-tighter leading-none">
                  {data.settings?.siteName?.split(',')[0]?.split('Sec.')[0] || "St. Xavier's"} <br className="md:hidden" />
                  <span className="text-school-accent italic">
                    {data.settings?.siteName?.includes('Jaipur') ? 'Jaipur' : ''}
                  </span>
                </h1>
                <div className="hidden md:flex items-center gap-3 mt-2">
                  <span className="w-1.5 h-1.5 bg-school-accent rounded-full animate-pulse" />
                  <p className="text-school-navy/60 text-[11px] md:text-xs font-medium tracking-wide">
                    {data.settings?.contactAddress || 'Bhagwan Das Road, C-Scheme, Jaipur - 302001'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 md:gap-6">
              <button 
                onClick={() => setIsNavOpen(true)}
                className="lg:hidden w-12 h-12 bg-school-accent rounded-full flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform"
              >
                <Menu size={24} />
              </button>

              <button className="hidden xl:flex p-4 bg-school-ink/5 text-school-navy rounded-full hover:bg-school-accent hover:text-white transition-all hover:scale-110 border border-school-ink/10">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Menu Bar (Sticky) - White/Light - Desktop Only */}
      <nav className={`w-full z-50 hidden lg:block transition-all duration-500 ${isScrolled ? 'fixed top-0 bg-white shadow-[0_15px_60px_-15px_rgba(0,0,0,0.1)] border-b border-school-ink/5' : 'relative bg-white border-b border-school-ink/5'}`}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex items-center justify-between h-12 md:h-14">
          <div className="flex items-center gap-12">
            {/* Small Logo for Scrolled State */}
            <AnimatePresence>
              {isScrolled && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center gap-4"
                >
                  <Link to="/" className="w-10 h-10">
                    <img 
                      src={data.settings?.siteLogo || "https://xaviersjaipur.edu.in/wp-content/uploads/2023/12/SchoolLogoTest.png"} 
                      alt="Logo" 
                      className="w-full h-full object-contain"
                    />
                  </Link>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-school-navy dark:text-white leading-none">
                      {data.settings?.siteName?.split(',')[0]?.split('Sec.')[0]?.toUpperCase() || "ST. XAVIER'S"}
                    </span>
                    <span className="text-[8px] text-school-accent italic font-serif">
                      {data.settings?.siteName?.includes('Jaipur') ? 'Jaipur' : ''}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Navigation (Desktop) */}
            <div className="hidden xl:flex items-center gap-10">
            {navLinks.map(l => (
              <div key={l.label} className="relative group flex items-center h-full">
                {l.subLinks ? (
                  <>
                    <button 
                      onMouseEnter={() => setActiveDropdown(l.label)}
                      className={`text-[12px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${activeDropdown === l.label ? 'text-school-accent scale-105' : 'text-school-navy/60 hover:text-school-navy'}`}
                    >
                      {l.label}
                      <ArrowDown size={12} className={`transition-transform duration-300 ${activeDropdown === l.label ? 'rotate-180 opacity-100' : 'opacity-20 group-hover:opacity-100'}`} />
                    </button>
                    
                    <AnimatePresence>
                      {activeDropdown === l.label && (
                        <motion.div 
                          initial={{ opacity: 0, y: 20, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          onMouseLeave={() => setActiveDropdown(null)}
                          className="absolute top-full -left-12 pt-4 w-[320px]"
                        >
                          <div className="bg-white rounded-[32px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.2)] border border-school-ink/5 dark:border-school-paper/10 p-5">
                            <div className="grid gap-1">
                              {l.subLinks.map(sl => (
                                <DesktopSubNavLink 
                                  key={sl.label} 
                                  link={sl} 
                                  onClose={() => setActiveDropdown(null)} 
                                />
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
                    className={`text-[12px] font-black uppercase tracking-widest transition-all hover:scale-105 ${location.pathname === l.href ? 'text-school-accent' : 'text-school-navy/60 hover:text-school-navy'}`}
                  >
                    {l.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

          {/* Action Area */}
          <div className="flex items-center gap-6">
            {/* Secure Fees button removed as requested */}
          </div>
        </div>
      </nav>

      {/* Magical Mobile Nav */}
      <AnimatePresence>
        {isNavOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] bg-school-paper flex flex-col lg:hidden"
          >
            <div className="flex justify-between items-center p-6 border-b border-school-ink/5 dark:border-school-paper/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-school-ink dark:bg-school-paper/10 p-2 rounded-xl">
                  <img src={data.settings?.siteLogo || "https://xaviersjaipur.edu.in/wp-content/uploads/2023/12/SchoolLogoTest.png"} alt="Logo" className="w-full h-full object-contain invert" />
                </div>
                <span className="font-black text-school-ink dark:text-white tracking-tight">
                  {data.settings?.siteName?.split(',')[0]?.split('Sec.')[0]?.toUpperCase() || "ST. XAVIER'S"}
                </span>
              </div>
              <button onClick={() => setIsNavOpen(false)} className="p-3 bg-school-bronze dark:bg-school-paper/10 rounded-full hover:bg-school-accent hover:text-white transition-colors dark:text-white"><X size={24} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 pb-20">
              <div className="grid gap-8">
                {navLinks.map(l => (
                  <MobileNavLink key={l.label} link={l} onClose={() => setIsNavOpen(false)} isDark={isDark} />
                ))}
                
                {/* Mobile Bottom Links */}
                <div className="pt-8 border-t border-school-ink/5 dark:border-school-paper/10 grid gap-4">
                   <Link to="/admin" onClick={() => setIsNavOpen(false)} className="text-lg font-bold text-school-ink/60 hover:text-school-ink italic underline decoration-school-accent underline-offset-4">Staff Login</Link>
                   <Link to="/contact" onClick={() => setIsNavOpen(false)} className="text-lg font-bold text-school-ink/60 hover:text-school-ink italic underline decoration-school-accent underline-offset-4">Connect With Us</Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {children}
      </main>

      <footer className="bg-slate-950/90 dark:bg-[#010414] backdrop-blur-3xl text-white pt-40 pb-20 relative overflow-hidden mt-20 rounded-t-[100px]">
        {/* Dynamic Abstract Shapes in Footer - Multi tone */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-school-accent/40 blur-[150px] rounded-full -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-school-gold/40 blur-[150px] rounded-full translate-y-1/2" />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-school-neon/10 blur-[200px] rounded-full -translate-x-1/2 -translate-y-1/2" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-12 gap-24 border-b border-white/10 pb-24">
            <div className="lg:col-span-5 space-y-12">
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                   <div className="w-20 h-20 bg-white p-4 rounded-[32px] hover:rotate-6 transition-transform">
                     <img src={data.settings?.siteLogo || "https://xaviersjaipur.edu.in/wp-content/uploads/2023/12/SchoolLogoTest.png"} alt="Xavier's Logo" className="w-full h-full object-contain" />
                   </div>
                   <h3 className="text-4xl font-black tracking-tighter leading-none italic">
                     {data.settings?.siteName?.split(',')[0]?.split('Sec.')[0]?.toUpperCase() || "ST. XAVIER'S"} <br />
                     <span className="text-school-neon not-italic">
                       {data.settings?.siteName?.includes('Jaipur') ? 'JAIPUR.' : ''}
                     </span>
                   </h3>
                </div>
                <p className="text-2xl text-white/50 font-medium leading-relaxed max-w-md">
                  {data.content?.footerDescription || 'Pioneering Jesuit excellence since 1941. Shaping the leaders of tomorrow with soul, heart, and mind.'}
                </p>
              </div>
              
              <div className="flex gap-4">
                {[
                  { Icon: Facebook, href: 'https://www.facebook.com/stxaviersjaipur/' },
                  { Icon: Instagram, href: 'https://www.instagram.com/xaviers_jaipur/' },
                  { Icon: Youtube, href: 'https://www.youtube.com/@st.xaviersc-schemejaipur2421' }
                ].map(({ Icon, href }, i) => (
                  <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="w-16 h-16 bg-white/5 rounded-[24px] flex items-center justify-center hover:bg-school-accent transition-all hover:scale-110">
                    <Icon size={24} />
                  </a>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-16">
              <div className="space-y-10">
                <h4 className="text-lg font-black text-school-neon uppercase tracking-widest">Navigation</h4>
                <ul className="grid gap-6">
                  {navLinks.map(l => (
                    <li key={l.label} className="text-xl font-bold text-white/40 hover:text-white transition-colors">
                      <Link to={l.href}>{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-10">
                <h4 className="text-lg font-black text-school-neon uppercase tracking-widest">Contact</h4>
                <div className="space-y-8">
                  <p className="flex items-start gap-4 text-xl font-medium text-white/50 leading-snug">
                    <MapPin size={24} className="text-school-neon shrink-0 mt-1" />
                    {data.settings?.contactAddress || 'Bhagwan Das Road, C-Scheme, Jaipur, Rajasthan 302001'}
                  </p>
                  <p className="flex items-center gap-4 text-xl font-medium text-white/50">
                    <Phone size={24} className="text-school-neon shrink-0" />
                    {data.settings?.contactPhone || '0141-2372336'}
                  </p>
                  <Link to="/contact" className="inline-flex items-center gap-4 px-10 py-4 bg-white/5 hover:bg-white/10 rounded-full text-sm font-black uppercase tracking-widest transition-all">
                    Get in touch <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-16 flex flex-col md:flex-row justify-between items-center gap-8 text-white/20 text-sm font-black tracking-widest uppercase">
            <p>© 2026 {data.settings?.siteName || "St. Xavier's School Jaipur"}. All rights reserved.</p>
            <div className="flex gap-12">
              <span className="hover:text-white transition-colors cursor-pointer">Privacy</span>
              <span className="hover:text-white transition-colors cursor-pointer">Terms</span>
              <span className="hover:text-white transition-colors cursor-pointer">CBSE Disclosure</span>
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
                   <span className="text-xs font-black uppercase text-school-navy dark:text-white group-hover:text-school-navy">Ask a Question</span>
                   <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/notice-board" onClick={() => setIsOpen(false)} className="flex items-center justify-between p-4 bg-school-ink/5 dark:bg-school-paper/5 rounded-2xl hover:bg-school-neon dark:hover:bg-school-neon dark:hover:text-school-ink transition-all group">
                   <span className="text-xs font-black uppercase text-school-navy dark:text-white group-hover:text-school-navy">Recent Notices</span>
                   <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            <div className="p-6 bg-school-ink/5 dark:bg-school-paper/5 text-center">
               <button onClick={() => setIsOpen(false)} className="text-[10px] font-black uppercase tracking-widest text-school-ink/20 dark:text-school-paper/20 hover:text-school-accent transition-colors">Close Assistant</button>
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

const DesktopSubNavLink = ({ link, onClose }: { link: NavLink; onClose: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (link.subLinks) {
    return (
      <div className="relative group/sub" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
        <button className={`w-full flex items-center justify-between px-6 py-4 rounded-[24px] transition-all ${isOpen ? 'bg-school-neon text-school-accent' : 'hover:bg-school-ink/5 dark:hover:bg-school-paper/5 text-school-ink dark:text-white'}`}>
          <span className="text-[15px] font-black text-left leading-tight">{link.label}</span>
          <ChevronRight size={16} className={`transition-transform ${isOpen ? 'rotate-90' : ''}`} />
        </button>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="absolute left-full top-0 ml-1 w-[320px] z-[100]"
            >
              <div className="bg-school-paper dark:bg-school-navy rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-school-ink/5 dark:border-school-paper/10 p-4">
                <div className="grid gap-1">
                  {link.subLinks.map(sl => (
                    <Link 
                      key={sl.label} 
                      to={sl.href} 
                      onClick={onClose}
                      className="flex items-center justify-between px-5 py-3 rounded-2xl hover:bg-school-ink/5 dark:hover:bg-school-paper/5 text-school-ink dark:text-white font-bold text-sm transition-all"
                    >
                      {sl.label}
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <Link 
      to={link.href} 
      onClick={onClose}
      className="flex items-center justify-between px-6 py-4 rounded-[24px] hover:bg-school-neon group/item dark:hover:text-school-ink transition-all"
    >
      <span className="text-[15px] font-black text-school-ink dark:text-white group-hover/item:text-school-accent leading-tight">{link.label}</span>
      <ArrowRight size={18} className="text-school-accent opacity-0 group-hover/item:opacity-100 transition-all -translate-x-4 group-hover/item:translate-x-0" />
    </Link>
  );
};

const MobileNavLink = ({ link, onClose, depth = 0, isDark }: { link: NavLink; onClose: () => void; depth?: number; isDark?: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (link.subLinks) {
    return (
      <div className="space-y-4">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center justify-between w-full group ${depth === 0 ? 'text-[11px] font-black uppercase text-school-accent tracking-[0.2em]' : 'text-xl font-bold text-school-ink dark:text-white'}`}
        >
          {link.label}
          {link.subLinks && (depth === 0 ? (isOpen ? <ArrowDown size={14} /> : <ChevronRight size={14} />) : (isOpen ? <ArrowDown size={18} /> : <ChevronRight size={18} />))}
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className={`flex flex-col gap-4 overflow-hidden ${depth === 0 ? 'pl-4 border-l-2 border-school-ink/5 dark:border-school-paper/10' : 'pl-6 border-l border-school-ink/5 dark:border-school-paper/10'}`}
            >
              {link.subLinks.map(sl => (
                <MobileNavLink key={sl.label} link={sl} onClose={onClose} depth={depth + 1} isDark={isDark} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return depth === 0 ? (
    <Link 
      to={link.href} 
      onClick={onClose} 
      className="text-2xl font-black text-school-ink dark:text-white hover:text-school-accent transition-colors"
    >
      {link.label}
    </Link>
  ) : (
                <Link 
                  key={link.label} 
                  to={link.href} 
                  onClick={onClose} 
                  className="text-xl font-bold text-school-ink hover:text-school-accent transition-colors flex items-center justify-between group"
                >
      {link.label}
      <ArrowRight size={20} className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all text-school-accent" />
    </Link>
  );
};

export default Layout;
