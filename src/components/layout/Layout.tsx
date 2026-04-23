import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Phone, Mail, MapPin, Key, Settings, ArrowRight, ChevronRight, Users2, ImageIcon, ExternalLink, Facebook, Instagram, Youtube, ArrowUp, ArrowDown } from 'lucide-react';
import { AppData, QuickLink } from '../../types';

interface LayoutProps {
  children: React.ReactNode;
  data: AppData;
  navbarTheme?: 'light' | 'dark';
}

interface NavLink {
  label: string;
  href: string;
  subLinks?: { label: string; href: string; }[];
}

const Layout = ({ children, data, navbarTheme = 'light' }: LayoutProps) => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine navbar text color based on scroll and theme
  const isLightNav = isScrolled || navbarTheme === 'light';
  const navTextColor = isLightNav ? 'text-school-navy' : 'text-white';
  const navSubTextColor = isLightNav ? 'text-school-navy/40' : 'text-white/40';
  const navLinkColor = isLightNav ? 'text-school-navy/70' : 'text-white/70';
  const logoInvert = isLightNav ? '' : 'invert';

  // Transform flat menu data into hierarchical structure
  const navLinks = React.useMemo<NavLink[]>(() => {
    if (!data.menu) return [];
    
    return data.menu
      .filter(m => !m.parent_id)
      .sort((a, b) => a.order_index - b.order_index)
      .map(m => {
        const subLinks = data.menu
          .filter(s => s.parent_id === m.id)
          .sort((a, b) => a.order_index - b.order_index)
          .map(s => ({ label: s.label, href: s.href }));
          
        return {
          label: m.label,
          href: m.href,
          subLinks: subLinks.length > 0 ? subLinks : undefined
        };
      });
  }, [data.menu]);

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-transparent selection:bg-school-accent selection:text-white overflow-x-hidden">
      {/* Multi-Level Header Section */}
      <header className="w-full relative z-[60]">
        {/* Top Utility Bar (Semi-transparent accent) */}
        <div className="bg-school-accent/80 backdrop-blur-md py-3">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex gap-4">
                <a href="#" className="text-white/60 hover:text-white transition-colors"><Facebook size={14} fill="currentColor" /></a>
                <a href="#" className="text-white/60 hover:text-white transition-colors"><Instagram size={14} /></a>
                <a href="#" className="text-white/60 hover:text-white transition-colors"><Youtube size={14} fill="currentColor" /></a>
              </div>
              <div className="hidden md:flex items-center gap-2 text-white text-[12px] font-bold">
                <Phone size={14} className="text-school-neon" />
                <span>0141-2372336, 2367792</span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <a href="/studybase-app" className="bg-school-neon text-school-ink px-4 py-1.5 rounded-full text-[11px] font-black flex items-center gap-2 hover:scale-105 transition-all shadow-md">
                <ArrowDown size={14} className="animate-bounce" />
                Studybase App
              </a>
              <div className="flex gap-6 text-white text-[12px] font-bold uppercase tracking-wider">
                <Link to="/admin" className="hover:text-school-neon transition-colors">Login</Link>
                <Link to="/contact" className="hover:text-school-neon transition-colors">Contact Us</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Branding Section - Blended White */}
        <div className="bg-white/40 backdrop-blur-xl py-8 border-b border-white/20">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link to="/" className="w-20 h-20 md:w-24 md:h-24 shrink-0 transition-transform hover:scale-110">
                <img 
                  src="https://xaviersjaipur.edu.in/wp-content/uploads/2023/12/SchoolLogoTest.png" 
                  alt="St. Xavier's Logo" 
                  className="w-full h-full object-contain"
                />
              </Link>
              <div className="flex flex-col">
                <h1 className="text-3xl md:text-5xl font-black text-school-ink tracking-tighter leading-none">St. Xavier's Sr. Sec. School</h1>
                <div className="flex items-center gap-3 mt-3">
                  <span className="w-1.5 h-1.5 bg-school-gold rounded-full" />
                  <p className="text-slate-500 text-[11px] md:text-sm font-medium">Bhagwan Das Road, C-Scheme, Jaipur - 302001</p>
                </div>
                <p className="text-slate-400 text-[10px] md:text-[12px] font-black uppercase tracking-[0.4em] mt-2">CBSE Affiliation No.: 1730003</p>
              </div>
            </div>

            <button className="hidden md:flex p-5 bg-school-bronze text-school-ink rounded-full hover:bg-school-neon transition-all hover:scale-110">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Menu Bar (Sticky) - Glass Theme */}
      <nav className={`w-full z-50 transition-all duration-500 ${isScrolled ? 'fixed top-0 bg-white/60 backdrop-blur-3xl shadow-2xl border-b border-white/20' : 'relative bg-white/20 backdrop-blur-sm border-b border-white/10'}`}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex items-center justify-between h-20 md:h-24">
          {/* Main Navigation (Desktop) */}
          <div className="hidden xl:flex items-center gap-12">
            {navLinks.map(l => (
              <div key={l.label} className="relative group flex items-center h-full">
                {l.subLinks ? (
                  <>
                    <button 
                      onMouseEnter={() => setActiveDropdown(l.label)}
                      className={`text-[13px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${activeDropdown === l.label ? 'text-school-accent scale-105' : 'text-school-ink/60 hover:text-school-ink'}`}
                    >
                      {l.label}
                      <ArrowDown size={14} className={`transition-transform duration-300 ${activeDropdown === l.label ? 'rotate-180 text-school-accent' : 'opacity-20 group-hover:opacity-100'}`} />
                    </button>
                    
                    <AnimatePresence>
                      {activeDropdown === l.label && (
                        <motion.div 
                          initial={{ opacity: 0, y: 30, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 20, scale: 0.9 }}
                          onMouseLeave={() => setActiveDropdown(null)}
                          className="absolute top-full -left-12 pt-4 w-[320px]"
                        >
                          <div className="bg-white rounded-[40px] shadow-[0_60px_120px_-20px_rgba(0,0,0,0.2)] border border-gray-100 p-6">
                            <div className="grid gap-2">
                              {l.subLinks.map(sl => (
                                <Link 
                                  key={sl.label} 
                                  to={sl.href} 
                                  onClick={() => setActiveDropdown(null)}
                                  className="flex items-center justify-between px-6 py-4 rounded-[24px] hover:bg-school-neon group/item transition-all"
                                >
                                  <span className="text-[15px] font-black text-school-ink group-hover/item:text-school-accent">{sl.label}</span>
                                  <ArrowRight size={18} className="text-school-accent opacity-0 group-hover/item:opacity-100 transition-all -translate-x-4 group-hover/item:translate-x-0" />
                                </Link>
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
                    className={`text-[13px] font-black uppercase tracking-widest transition-all hover:scale-105 ${location.pathname === l.href ? 'text-school-accent' : 'text-school-ink/60 hover:text-school-ink'}`}
                  >
                    {l.label}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Action Area */}
          <div className="flex items-center gap-8">
            <button className="hidden lg:flex items-center gap-3 text-school-ink font-black text-xs uppercase tracking-widest bg-school-neon px-10 py-4 rounded-full hover:bg-school-accent hover:text-white transition-all shadow-xl active:scale-95">
              Secure Fees
              <ArrowRight size={16} />
            </button>
            <button onClick={() => setIsNavOpen(true)} className="xl:hidden p-4 bg-school-bronze text-school-ink rounded-[24px] hover:bg-school-neon transition-colors"><Menu size={28} /></button>
          </div>
        </div>
      </nav>

      {/* Magical Mobile Nav */}
      <AnimatePresence>
        {isNavOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="fixed inset-0 z-[60] bg-white p-6 lg:hidden"
          >
            <div className="flex justify-between items-center mb-12">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-school-navy p-2 rounded-xl">
                  <img src="https://xaviersjaipur.edu.in/wp-content/uploads/2023/12/SchoolLogoTest.png" alt="Logo" className="w-full h-full object-contain invert" />
                </div>
                <span className="font-black text-school-navy">ST. XAVIER'S</span>
              </div>
              <button onClick={() => setIsNavOpen(false)} className="p-3 bg-school-bronze rounded-full"><X size={24} /></button>
            </div>
            <div className="flex flex-col gap-4">
              {navLinks.map(l => (
                <div key={l.label} className="border-b border-gray-50 pb-4">
                  <p className="text-[10px] font-black uppercase text-gray-400 mb-4">{l.label}</p>
                  <div className="grid gap-4">
                    {l.subLinks ? l.subLinks.map(sl => (
                      <Link 
                        key={sl.label} 
                        to={sl.href} 
                        onClick={() => setIsNavOpen(false)} 
                        className="text-2xl font-black text-school-navy"
                      >
                        {sl.label}
                      </Link>
                    )) : (
                      <Link 
                        to={l.href} 
                        onClick={() => setIsNavOpen(false)} 
                        className="text-2xl font-black text-school-navy"
                      >
                        {l.label}
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {children}
      </main>

      <footer className="bg-school-ink/90 backdrop-blur-3xl text-white pt-40 pb-20 relative overflow-hidden mt-20 rounded-t-[100px]">
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
                     <img src="https://xaviersjaipur.edu.in/wp-content/uploads/2023/12/SchoolLogoTest.png" alt="Xavier's Logo" className="w-full h-full object-contain" />
                   </div>
                   <h3 className="text-4xl font-black tracking-tighter leading-none italic">ST. XAVIER'S <br /><span className="text-school-neon not-italic">JAIPUR.</span></h3>
                </div>
                <p className="text-2xl text-white/50 font-medium leading-relaxed max-w-md">
                  Pioneering Jesuit excellence since 1941. Shaping the leaders of tomorrow with soul, heart, and mind.
                </p>
              </div>
              
              <div className="flex gap-4">
                {[Facebook, Instagram, Youtube].map((Icon, i) => (
                  <a key={i} href="#" className="w-16 h-16 bg-white/5 rounded-[24px] flex items-center justify-center hover:bg-school-accent transition-all hover:scale-110">
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
                    Bhagwan Das Road, C-Scheme, Jaipur, Rajasthan 302001
                  </p>
                  <p className="flex items-center gap-4 text-xl font-medium text-white/50">
                    <Phone size={24} className="text-school-neon shrink-0" />
                    0141-2372336
                  </p>
                  <Link to="/contact" className="inline-flex items-center gap-4 px-10 py-4 bg-white/5 hover:bg-white/10 rounded-full text-sm font-black uppercase tracking-widest transition-all">
                    Get in touch <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-16 flex flex-col md:flex-row justify-between items-center gap-8 text-white/20 text-sm font-black tracking-widest uppercase">
            <p>© 2026 St. Xavier's School Jaipur. All rights reserved.</p>
            <div className="flex gap-12">
              <span className="hover:text-white transition-colors cursor-pointer">Privacy</span>
              <span className="hover:text-white transition-colors cursor-pointer">Terms</span>
              <span className="hover:text-white transition-colors cursor-pointer">CBSE Disclosure</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating CTA - Ultra Modern & Responsive */}
      <motion.button 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        whileHover={{ scale: 1.05 }}
        className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[100] bg-school-gold text-white px-6 py-4 md:px-10 md:py-5 rounded-full font-black shadow-[0_20px_50px_rgba(255,0,146,0.3)] flex items-center gap-3 md:gap-4 group overflow-hidden text-xs md:text-base border border-white/20"
      >
        <span className="relative z-10">Apply 2026-27</span>
        <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform relative z-10">
          <ArrowUp className="rotate-45" size={18} />
        </div>
        <div className="absolute inset-0 bg-school-accent translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
      </motion.button>
    </div>
  );
};

export default Layout;
