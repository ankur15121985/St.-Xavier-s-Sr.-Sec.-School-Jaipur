import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Phone, Mail, MapPin, Key, Settings, ArrowRight, ChevronRight, Users2, ImageIcon, ExternalLink, Facebook, Instagram, Youtube, ArrowUp, ArrowDown } from 'lucide-react';
import { AppData, QuickLink } from '../../types';

interface LayoutProps {
  children: React.ReactNode;
  data: AppData;
}

interface NavLink {
  label: string;
  href: string;
  subLinks?: { label: string; href: string; }[];
}

const Layout = ({ children, data }: LayoutProps) => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <div className="min-h-screen bg-white selection:bg-school-gold selection:text-white overflow-x-hidden">
      {/* Dynamic Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-700 ${isScrolled ? 'glass-nav py-3' : 'bg-sky-50/80 backdrop-blur-2xl border-b border-sky-100 py-6'}`}>
        <div className="w-full px-6 lg:px-12 flex items-center relative h-16 md:h-20">
          
          {/* Logo Section (Left) */}
          <div className="flex-1 flex justify-start z-20">
            <Link to="/" className="flex items-center gap-3 group whitespace-nowrap">
              <motion.div whileHover={{ scale: 1.1 }} className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-white font-serif font-black text-xl md:text-2xl shadow-xl rounded-xl bg-school-navy border-2 border-school-gold/20 group-hover:bg-school-accent transition-colors shrink-0">X</motion.div>
              <div className="flex flex-col">
                <h1 className={`font-serif text-lg md:text-xl font-black transition-colors leading-none tracking-tight ${isScrolled ? 'text-white' : 'text-school-navy'}`}>ST. XAVIER'S</h1>
                <p className={`text-[8px] md:text-[9px] uppercase tracking-[0.2em] md:tracking-[0.4em] font-black transition-colors hidden sm:block mt-1 ${isScrolled ? 'text-white/40' : 'text-school-navy/40'}`}>SR. SEC. SCHOOL • JAIPUR</p>
              </div>
            </Link>
          </div>

          {/* Centered Navigation Items (Desktop) */}
          <div className="hidden xl:flex absolute left-1/2 -translate-x-1/2 h-full items-center gap-6 z-30">
            {navLinks.map(l => (
              <div key={l.label} className="relative group h-full flex items-center shrink-0">
                {l.subLinks ? (
                  <>
                    <button 
                      onMouseEnter={() => setActiveDropdown(l.label)}
                      className={`text-[12px] font-black uppercase tracking-widest hover:text-school-gold transition-colors flex items-center gap-1.5 whitespace-nowrap ${location.pathname.startsWith(l.href) && l.href !== '#' ? 'text-school-gold' : isScrolled ? 'text-white' : 'text-school-navy'}`}
                    >
                      {l.label} <ChevronRight size={10} className="rotate-90 group-hover:rotate-[270deg] transition-transform" />
                    </button>
                    {/* Desktop Dropdown */}
                    <div className="absolute top-[80%] left-1/2 -translate-x-1/2 pt-4 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300">
                      <div className="bg-school-navy rounded-2xl shadow-2xl p-4 min-w-[240px] border border-white/10 glass-dark">
                        {l.subLinks.map(sl => (
                          <Link key={sl.label} to={sl.href} className="block px-6 py-3 text-[11px] font-black uppercase tracking-widest text-white/60 hover:text-school-gold hover:bg-white/5 rounded-xl transition-all whitespace-nowrap">
                            {sl.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link to={l.href} className={`text-[12px] font-black uppercase tracking-widest hover:text-school-gold transition-colors relative group whitespace-nowrap ${location.pathname === l.href ? 'text-school-gold' : isScrolled ? 'text-white' : 'text-school-navy'}`}>
                    {l.label}
                    <span className={`absolute -bottom-1 left-0 h-0.5 bg-school-gold transition-all group-hover:w-full ${location.pathname === l.href ? 'w-full' : 'w-0'}`}></span>
                  </Link>
                )}
              </div>
            ))}
          </div>
          
          {/* Action Buttons (Right) */}
          <div className="flex-1 hidden xl:flex justify-end items-center gap-4 z-20">
            <Link to="/admin" className={`flex items-center gap-2 px-3 py-1.5 rounded-xl glass-surface border border-school-navy/5 hover:border-school-gold transition-all shadow-sm group shrink-0 ${isScrolled ? 'bg-white/10 text-white border-white/10' : 'text-school-navy'}`}>
              <Key size={14} className="group-hover:text-school-gold transition-colors" />
              <span className="text-[11px] font-black uppercase tracking-widest hidden 2xl:block">Admin</span>
            </Link>
            <button className="px-6 py-2.5 bg-school-navy text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-school-accent transition-all shadow-lg active:scale-95 shrink-0 whitespace-nowrap">
              Apply Now
            </button>
          </div>
          
          <div className="xl:hidden flex-1 flex justify-end">
            <button onClick={() => setIsNavOpen(true)} className="text-school-navy glass-surface p-2.5 rounded-xl block z-20"><Menu size={24} /></button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isNavOpen && (
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25 }} className="fixed inset-0 z-[60] bg-school-navy p-12 lg:hidden overflow-y-auto">
            <button onClick={() => setIsNavOpen(false)} className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"><X size={32} /></button>
            <div className="mt-20 flex flex-col gap-8">
              {navLinks.map(l => (
                <div key={l.label}>
                  {l.subLinks ? (
                    <div className="space-y-6">
                      <p className="text-sm font-black uppercase tracking-[0.3em] text-school-gold/50 mb-4">{l.label}</p>
                      {l.subLinks.map(sl => (
                        <Link 
                          key={sl.label} 
                          onClick={() => setIsNavOpen(false)} 
                          to={sl.href} 
                          className={`block text-3xl font-serif font-black hover:text-school-gold transition-colors ${location.pathname === sl.href ? 'text-school-gold' : 'text-white'}`}
                        >
                          {sl.label}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Link onClick={() => setIsNavOpen(false)} to={l.href} className={`text-4xl font-serif font-black hover:text-school-gold transition-colors ${location.pathname === l.href ? 'text-school-gold' : 'text-white'}`}>{l.label}</Link>
                  )}
                </div>
              ))}
              <Link to="/admin" onClick={() => setIsNavOpen(false)} className="text-4xl font-serif font-black text-white hover:text-school-gold transition-colors pt-8 border-t border-white/10">Admin Portal</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-24 md:pt-32">
        {children}
      </main>

      <footer className="relative bg-school-navy overflow-hidden">
        {/* Aesthetic Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/school_grounds/1920/1080?blur=2" 
            className="w-full h-full object-cover opacity-30 grayscale-[0.2]" 
            alt="School Grounds"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-school-navy/90 via-school-navy/70 to-school-navy"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-24 pb-12">
          <div className="grid lg:grid-cols-12 gap-16 items-start">
            
            {/* Branding and Contact (Left) */}
            <div className="lg:col-span-4 space-y-10">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-school-gold font-serif font-black text-3xl border border-white/20 shadow-2xl">X</div>
                  <div>
                    <h3 className="text-2xl font-serif font-black text-white leading-none tracking-tight">ST. XAVIER'S</h3>
                    <p className="text-[10px] uppercase tracking-[0.3em] font-black text-school-gold/60 mt-1">JAIPUR • SR. SEC. SCHOOL</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 pt-4">
                  {[
                    { icon: <Facebook size={18} />, label: 'Facebook' },
                    { icon: <Instagram size={18} />, label: 'Instagram' },
                    { icon: <Youtube size={18} />, label: 'YouTube' }
                  ].map((social) => (
                    <a key={social.label} href="#" className="w-11 h-11 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl flex items-center justify-center text-white hover:text-school-gold hover:bg-school-gold/10 transition-all duration-300">
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <a href="tel:01412372336" className="flex items-center gap-3 text-white/80 hover:text-school-gold transition-colors group">
                  <Phone size={18} className="text-school-gold" />
                  <span className="text-sm font-black tracking-wider group-hover:translate-x-1 transition-transform">0141-2372336, 2367792</span>
                </a>
                <a href="mailto:xavier41jaipur@gmail.com" className="flex items-center gap-3 text-white/80 hover:text-school-gold transition-colors group">
                  <Mail size={18} className="text-school-gold" />
                  <span className="text-sm font-black tracking-wider group-hover:translate-x-1 transition-transform">xavier41jaipur@gmail.com</span>
                </a>
              </div>

              {/* Total Views Counter */}
              <div className="pt-6">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-school-gold mb-3">Total Portal Views</p>
                <div className="flex gap-1.5 items-center">
                  {[4, 6, 9, 5, 5, 2].map((num, i) => (
                    <div key={i} className="w-8 h-10 bg-school-navy/80 border border-white/10 rounded-lg flex items-center justify-center text-xl font-black text-white shadow-inner">
                      {num}
                    </div>
                  ))}
                </div>
                <p className="text-[9px] text-white/40 mt-3 font-medium italic">Since 10 April, 2024</p>
              </div>
            </div>

            {/* Quick Links (Middle) */}
            <div className="lg:col-span-3">
              <h4 className="text-school-gold font-black uppercase text-[12px] md:text-[13px] tracking-[0.3em] mb-10 pb-4 border-b border-white/5">Quick Links</h4>
              <ul className="space-y-5 font-black uppercase text-[11px] md:text-[12px] tracking-widest">
                {data.links.map((item) => (
                  <li key={item.id}>
                    <Link to={item.url} className="text-white/60 hover:text-school-gold transition-all flex items-center gap-3 group">
                      <div className="w-2 h-2 rounded-full bg-school-gold scale-0 group-hover:scale-100 transition-transform"></div>
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* More From Us (Right) */}
            <div className="lg:col-span-3">
              <h4 className="text-school-gold font-black uppercase text-[12px] md:text-[13px] tracking-[0.3em] mb-10 pb-4 border-b border-white/5">More From Us</h4>
              <ul className="space-y-5 font-black uppercase text-[11px] md:text-[12px] tracking-widest">
                {['Media Gallery', 'For Parents', 'Fee Structure', 'Xavier\'s Alumni', 'Contact Us', 'Transfer Certificate'].map((item) => (
                  <li key={item}>
                    <Link to="/" className="text-white/60 hover:text-school-gold transition-all flex items-center gap-3 group">
                      <div className="w-2 h-2 rounded-full bg-school-gold scale-0 group-hover:scale-100 transition-transform"></div>
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="lg:col-span-2">
              <h4 className="text-school-gold font-black uppercase text-[12px] md:text-[13px] tracking-[0.3em] mb-10 pb-4 border-b border-white/5">Address</h4>
              <p className="text-[11px] md:text-[12px] text-white/70 leading-relaxed font-black uppercase tracking-widest">
                Bhagwan Das Road, <br />
                C-Scheme, Jaipur, <br />
                Rajasthan 302001
              </p>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[11px] md:text-[12px] font-black uppercase tracking-widest text-white/40">
              © 2024 St. Xavier's Sr. Sec. School | All Rights Reserved.
            </p>
            <p className="text-[11px] md:text-[12px] font-black uppercase tracking-widest text-white/20">
              Developed & Hosted by <span className="text-white/50">ABHISHEK MATHUR</span>.
            </p>
          </div>
        </div>
      </footer>

      {/* Floating Navigation Controls */}
      <div className="fixed bottom-8 left-8 z-[100] flex flex-col gap-3">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-12 h-12 bg-school-navy text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-school-accent hover:scale-110 active:scale-95 transition-all duration-300 group"
          title="Back to Top"
        >
          <ArrowUp size={20} className="group-hover:-translate-y-1 transition-transform" />
        </button>
        <button 
          onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
          className="w-12 h-12 bg-school-gold text-school-navy rounded-full flex items-center justify-center shadow-2xl hover:brightness-110 hover:scale-110 active:scale-95 transition-all duration-300 group"
          title="Scroll to Bottom"
        >
          <ArrowDown size={20} className="group-hover:translate-y-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default Layout;
