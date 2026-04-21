import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Phone, Mail, MapPin, Key, Settings, ArrowRight, ChevronRight, Users2, ImageIcon, ExternalLink } from 'lucide-react';
import { QuickLink } from '../../types';

interface LayoutProps {
  children: React.ReactNode;
  links: QuickLink[];
}

const Layout = ({ children, links }: LayoutProps) => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/' },
    { 
      label: 'About Us', 
      href: '#',
      subLinks: [
        { label: 'Our Founder & Patron', href: '/founder-patron' },
        { label: 'Governing Members', href: '/governing-members' },
        { label: 'School Anthem', href: '/anthem' },
        { label: 'History', href: '/history' },
      ]
    },
    {
      label: 'Admission',
      href: '#',
      subLinks: [
        { label: 'Admission Policy', href: '/admission-policy' },
        { label: 'Scholarship & Concessions', href: '/scholarships' },
        { label: 'Fees Structure', href: '/fees' },
        { label: 'Studybase Mobile App', href: '/studybase-app' },
      ]
    },
    {
      label: 'Academics',
      href: '#',
      subLinks: [
        { label: 'Jesuit Education Objectives', href: '/jesuit-education-objectives' },
        { label: 'Staff Directory', href: '/staff' },
        { label: 'Achievements', href: '/achievements' },
      ]
    },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Notices', href: '/notices' },
    { label: 'Events', href: '/events' },
  ];

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-white selection:bg-school-gold selection:text-white overflow-x-hidden">
      {/* Dynamic Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${isScrolled ? 'glass-nav py-4' : 'bg-transparent py-8'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.1 }} className="w-14 h-14 flex items-center justify-center text-white font-serif font-black text-3xl shadow-2xl rounded-2xl bg-school-navy border-2 border-school-gold/20">X</motion.div>
            <div>
              <h1 className="font-serif text-2xl font-black text-school-navy leading-none tracking-tight">ST. XAVIER'S</h1>
              <p className="text-[10px] uppercase tracking-[0.4em] font-black text-school-navy/40">SR. SEC. SCHOOL • JAIPUR</p>
            </div>
          </Link>
          
          <div className="hidden xl:flex items-center gap-8">
            {navLinks.map(l => (
              <div key={l.label} className="relative group">
                {l.subLinks ? (
                  <>
                    <button 
                      onMouseEnter={() => setActiveDropdown(l.label)}
                      className={`text-[11px] font-black uppercase tracking-widest hover:text-school-gold transition-colors flex items-center gap-1.5 ${location.pathname.startsWith(l.href) ? 'text-school-gold' : 'text-school-navy'}`}
                    >
                      {l.label} <ChevronRight size={10} className="rotate-90 group-hover:rotate-[270deg] transition-transform" />
                    </button>
                    {/* Desktop Dropdown */}
                    <div className="absolute top-full left-0 pt-6 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300">
                      <div className="bg-school-navy rounded-2xl shadow-2xl p-4 min-w-[200px] border border-white/10">
                        {l.subLinks.map(sl => (
                          <Link key={sl.label} to={sl.href} className="block px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-school-gold hover:bg-white/5 rounded-xl transition-all">
                            {sl.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link to={l.href} className={`text-[11px] font-black uppercase tracking-widest hover:text-school-gold transition-colors relative group ${location.pathname === l.href ? 'text-school-gold' : 'text-school-navy'}`}>
                    {l.label}
                    <span className={`absolute -bottom-1 left-0 h-0.5 bg-school-gold transition-all group-hover:w-full ${location.pathname === l.href ? 'w-full' : 'w-0'}`}></span>
                  </Link>
                )}
              </div>
            ))}
            <Link to="/admin" className="flex items-center gap-2 px-4 py-2 rounded-xl glass-surface text-school-navy border border-school-navy/5 hover:border-school-gold transition-all shadow-sm group">
              <Key size={16} className="group-hover:text-school-gold transition-colors" />
              <span className="text-[10px] font-black uppercase tracking-widest hidden lg:block">Admin</span>
            </Link>
            <button className="px-8 py-3 bg-school-navy text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-school-accent transition-all shadow-lg active:scale-95">
              Apply Now
            </button>
          </div>
          <button onClick={() => setIsNavOpen(true)} className="xl:hidden text-school-navy glass-surface p-2.5 rounded-xl block"><Menu size={24} /></button>
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

      <main>
        {children}
      </main>

      <footer className="py-24 bg-white border-t border-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-4 gap-20">
          <div className="lg:col-span-2">
             <div className="flex items-center gap-4 mb-8">
               <div className="w-12 h-12 bg-school-navy rounded-xl flex items-center justify-center text-white font-serif font-black text-2xl">X</div>
               <h3 className="text-2xl font-serif font-black text-school-navy">ST. XAVIER'S</h3>
             </div>
             <p className="text-lg text-school-navy/50 font-light max-w-sm mb-12 italic">"Luceat Lux Vestra - Let your light shine abroad with excellence."</p>
             <div className="flex gap-4">
                {['FB', 'IG', 'LI'].map(s => <div key={s} className="w-10 h-10 glass-surface border border-slate-200 rounded-xl flex items-center justify-center text-[10px] font-black text-school-navy hover:bg-school-navy hover:text-white transition-all cursor-pointer">{s}</div>)}
             </div>
          </div>
          <div>
            <h4 className="text-school-gold font-black uppercase text-[10px] tracking-widest mb-10">Institutional</h4>
            <ul className="space-y-4 text-xs font-black uppercase tracking-widest text-school-navy/50">
              <li><Link to="/admin" className="hover:text-school-gold transition-colors">Admin Portal</Link></li>
              <li><a href="#" className="hover:text-school-gold transition-colors">Digital Portal</a></li>
              <li><a href="#" className="hover:text-school-gold transition-colors">Academic Map</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-school-gold font-black uppercase text-[10px] tracking-widest mb-10">Quick Links</h4>
            <ul className="space-y-4 text-xs font-black uppercase tracking-widest">
              {links.map((link) => (
                <li key={link.id}>
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2 text-school-navy/50 hover:text-school-gold transition-colors group"
                  >
                    {link.title}
                    <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-school-gold font-black uppercase text-[10px] tracking-widest mb-10">Connect</h4>
             <p className="text-sm text-school-navy/50 font-light mb-6">Bhagwan Das Road, C-Scheme, Jaipur, Rajasthan 302001</p>
             <p className="text-sm text-school-navy font-black tracking-widest">+91 141 2367793</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
