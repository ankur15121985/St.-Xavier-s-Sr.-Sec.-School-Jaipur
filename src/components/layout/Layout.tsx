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
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center transition-transform shrink-0"
              >
                <img 
                  src="https://xaviersjaipur.edu.in/wp-content/uploads/2023/12/SchoolLogoTest.png" 
                  alt="St. Xavier's Logo" 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
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
        {/* Aesthetic Background Image - No Effects Applied */}
        <div className="absolute inset-0 z-0">
          <img 
            src={location.pathname === '/' ? "https://xaviersjaipur.edu.in/wp-content/uploads/2023/03/school3-1.png" : "https://picsum.photos/seed/school_grounds/1920/1080?blur=2"} 
            className={`w-full h-full object-cover opacity-100 ${location.pathname === '/' ? 'object-bottom' : 'object-center'}`} 
            alt="School Grounds"
            referrerPolicy="no-referrer"
          />
          
          {/* Enhanced Color-Changing Liquid Overlay Layer */}
          <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
            {/* Liquid Blob 1 - Navy to Sky to Navy */}
            <motion.div 
              animate={{
                x: [0, 150, -100, 0],
                y: [0, -100, 80, 0],
                scale: [1, 1.4, 0.8, 1],
                backgroundColor: ["#00214733", "#38bdf822", "#00214733"], // Navy to Sky
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute -top-[20%] -left-[10%] w-[70%] h-[90%] blur-[100px] rounded-full"
            />
            {/* Liquid Blob 2 - Gold to Navy to Gold */}
            <motion.div 
              animate={{
                x: [0, -180, 100, 0],
                y: [0, 120, -100, 0],
                scale: [1, 0.7, 1.2, 1],
                backgroundColor: ["#FFD70022", "#00214733", "#FFD70022"], // Gold to Navy
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute -bottom-[30%] -right-[15%] w-[80%] h-[100%] blur-[120px] rounded-full"
            />
            {/* Liquid Blob 3 - Pulser */}
            <motion.div 
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.2, 0.4, 0.2],
                backgroundColor: ["#38bdf811", "#FFD70011", "#38bdf811"], // Sky to Gold
              }}
              transition={{
                duration: 18,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-1/2 left-1/4 w-[60%] h-[60%] blur-[140px] rounded-full"
            />
          </div>

          {/* Transparent Color Wash for Contrast - No Blur */}
          <div className="absolute inset-0 bg-school-navy/30 z-[5]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-school-navy/80 via-transparent to-transparent z-[8]"></div>
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-12 pt-32 pb-24">
          <div className="grid lg:grid-cols-12 gap-16 items-start">
            
            {/* Branding and Contact (Left) */}
            <div className="lg:col-span-4 space-y-12">
              <div className="space-y-8">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center shrink-0 drop-shadow-2xl brightness-110">
                    <img 
                      src="https://xaviersjaipur.edu.in/wp-content/uploads/2023/12/SchoolLogoTest.png" 
                      alt="St. Xavier's Logo" 
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]">
                    <h3 className="text-3xl md:text-4xl font-serif font-black text-white leading-none tracking-tight">ST. XAVIER'S</h3>
                    <p className="text-[12px] md:text-[14px] uppercase tracking-[0.3em] font-black text-white mt-2">SR. SEC. SCHOOL • JAIPUR</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-5">
                  {[
                    { icon: <Facebook size={20} />, label: 'Facebook' },
                    { icon: <Instagram size={20} />, label: 'Instagram' },
                    { icon: <Youtube size={20} />, label: 'YouTube' }
                  ].map((social) => (
                    <a key={social.label} href="#" className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl flex items-center justify-center hover:bg-school-gold hover:text-school-navy transition-all duration-300 shadow-xl">
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>

              <div className="space-y-6 pt-4">
                <a href="tel:01412372336" className="flex items-center gap-4 text-white/90 font-black hover:text-school-gold transition-colors group">
                  <Phone size={22} className="text-school-gold" />
                  <span className="text-[15px] md:text-[16px] tracking-widest group-hover:translate-x-1 transition-transform">0141-2372336, 2367792</span>
                </a>
                <a href="mailto:xavier41jaipur@gmail.com" className="flex items-center gap-4 text-white/90 font-black hover:text-school-gold transition-colors group">
                  <Mail size={22} className="text-school-gold" />
                  <span className="text-[15px] md:text-[16px] tracking-widest group-hover:translate-x-1 transition-transform lowercase">xavier41jaipur@gmail.com</span>
                </a>
              </div>

              {/* Total Views Counter */}
              <div className="pt-8 border-t border-white/10">
                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/60 mb-4">Portal Views</p>
                <div className="flex gap-2 items-center">
                  {[4, 6, 9, 5, 5, 2].map((num, i) => (
                    <div key={i} className="w-10 h-12 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl flex items-center justify-center text-2xl font-black shadow-lg">
                      {num}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Links (Middle) */}
            <div className="lg:col-span-3 lg:pl-10">
              <h4 className="text-school-gold font-black uppercase text-[15px] md:text-[16px] tracking-[0.4em] mb-10 pb-5 border-b-2 border-white/10">Quick Links</h4>
              <ul className="space-y-6 font-black uppercase text-[13px] md:text-[14px] tracking-widest">
                {data.links.map((item) => (
                  <li key={item.id}>
                    <Link to={item.url} className="text-white/80 hover:text-school-gold transition-all flex items-center gap-4 group">
                      <div className="w-2.5 h-2.5 rounded-full bg-school-gold scale-0 group-hover:scale-100 transition-transform"></div>
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* More From Us (Right) */}
            <div className="lg:col-span-3">
              <h4 className="text-school-gold font-black uppercase text-[15px] md:text-[16px] tracking-[0.4em] mb-10 pb-5 border-b-2 border-white/10">More From Us</h4>
              <ul className="space-y-6 font-black uppercase text-[13px] md:text-[14px] tracking-widest">
                {['Media Gallery', 'For Parents', 'Fee Structure', 'Xavier\'s Alumni', 'Contact Us', 'Transfer Certificate'].map((item) => (
                  <li key={item}>
                    <Link to="/" className="text-white/80 hover:text-school-gold transition-all flex items-center gap-4 group">
                      <div className="w-2.5 h-2.5 rounded-full bg-school-gold scale-0 group-hover:scale-100 transition-transform"></div>
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="lg:col-span-2">
              <h4 className="text-school-gold font-black uppercase text-[15px] md:text-[16px] tracking-[0.4em] mb-10 pb-5 border-b-2 border-white/10">Address</h4>
              <p className="text-[13px] md:text-[14px] text-white/90 font-black uppercase tracking-widest leading-loose">
                Bhagwan Das Road, <br />
                C-Scheme, Jaipur, <br />
                Rajasthan 302001
              </p>
            </div>
          </div>

          {/* Bottom Footer Credits */}
          <div className="mt-20 pt-10 border-t-2 border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[13px] md:text-[14px] font-black uppercase tracking-widest text-white/60">
              © 2024 St. Xavier's Sr. Sec. School | All Rights Reserved.
            </p>
            <p className="text-[13px] md:text-[14px] font-black uppercase tracking-widest text-white">
              Developed & Hosted by <span className="border-b-2 border-school-gold/40">ABHISHEK MATHUR</span>
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
