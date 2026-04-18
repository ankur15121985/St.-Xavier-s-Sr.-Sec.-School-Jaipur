/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Link, 
  useNavigate,
  useLocation
} from 'react-router-dom';
import { 
  motion, 
  AnimatePresence, 
  useScroll, 
  useTransform, 
  useSpring,
  useMotionValue
} from 'motion/react';
import { 
  Menu, X, Phone, Mail, MapPin, 
  BookOpen, Trophy, Users, 
  School as SchoolIcon, GraduationCap, Clock, Award, Bell,
  Sparkles, ShieldCheck, ArrowRight, Settings, Plus, Trash2, ExternalLink, Globe, Heart, Target, Lightbulb, Navigation, Map as MapIcon, Key,
  Edit, Save, ChevronRight, LayoutDashboard, FileText, Image as ImageIcon, Users2, CreditCard, Link as LinkIcon, Calendar
} from 'lucide-react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';

// --- Styles ---
const mapStyles = `
  .map-pin {
    animation: bounce 2s infinite;
  }
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
`;

// --- Types ---

interface NavItem { name: string; href: string; }
interface Notice { id: string; title: string; date: string; category: string; link?: string; }
interface StaffMember { id: string; name: string; role: string; bio: string; image: string; type: 'Management' | 'Faculty' | 'Administration'; }
interface GalleryItem { id: string; url: string; caption: string; }
interface FeeStructure { id: string; grade: string; admissionFee: string; tuition_fees: string; quarterly: string; }
interface QuickLink { id: string; title: string; url: string; }
interface Event { id: string; title: string; date: string; time: string; location: string; }
interface Achievement { id: string; title: string; year: string; description: string; }

interface AppData {
  notices: Notice[];
  staff: StaffMember[];
  gallery: GalleryItem[];
  fees: FeeStructure[];
  links: QuickLink[];
  events: Event[];
  achievements: Achievement[];
}

const DEFAULT_DATA: AppData = {
  notices: [
    { id: '1', title: 'Summer Vacations Announcement 2026', date: 'April 15, 2026', category: 'Circular' },
    { id: '2', title: 'Pre-Primary Admission Intake 2026-27', date: 'March 25, 2026', category: 'Admissions' },
    { id: '3', title: 'Inter-House Creative Writing Winners', date: 'April 05, 2026', category: 'Activities' },
    { id: '4', title: 'Instruction for CBSE Practical Examinations', date: 'February 20, 2026', category: 'Examination' }
  ],
  staff: [
    { id: '1', name: 'Fr. S. Arulappan, SJ', role: 'Principal', bio: 'Committed to forming holistic leaders through Jesuit excellence.', image: 'https://picsum.photos/seed/p_arul/400/400', type: 'Management' },
    { id: '2', name: 'Fr. Glenn Menezes, SJ', role: 'Manager', bio: 'Overseeing the school’s spiritual and infrastructural evolution.', image: 'https://picsum.photos/seed/p_glenn/400/400', type: 'Management' },
    { id: '3', name: 'Ms. Sunita Sharma', role: 'Vice Principal', bio: 'Championing early childhood education and academic discipline.', image: 'https://picsum.photos/seed/p_sunita/400/400', type: 'Faculty' },
    { id: '4', name: 'Fr. Raymond Cherubin, SJ', role: 'Administrator', bio: 'Directing administrative operations and student welfare.', image: 'https://picsum.photos/seed/p_ray/400/400', type: 'Administration' }
  ],
  gallery: [
    { id: '1', url: 'https://picsum.photos/seed/x_facade/1200/800', caption: 'St. Xavier\'s Main Architecture' },
    { id: '2', url: 'https://picsum.photos/seed/x_prayer/1200/800', caption: 'The Morning Assembly Circle' },
    { id: '3', url: 'https://picsum.photos/seed/x_lab/1200/800', caption: 'Physics Research Wing' },
    { id: '4', url: 'https://picsum.photos/seed/x_sports/1200/800', caption: 'Inter-House Cricket Semi-Finals' },
    { id: '5', url: 'https://picsum.photos/seed/x_art/1200/800', caption: 'Fine Arts Exhibition' },
    { id: '6', url: 'https://picsum.photos/seed/x_lib/1200/800', caption: 'Students in the Central Library' }
  ],
  fees: [
    { id: '1', grade: 'LKG - Prep', admissionFee: '₹40,000', tuition_fees: '₹4,500', quarterly: '₹13,500' },
    { id: '2', grade: 'I - V', admissionFee: '₹40,000', tuition_fees: '₹5,200', quarterly: '₹15,600' },
    { id: '3', grade: 'VI - VIII', admissionFee: '₹45,000', tuition_fees: '₹5,800', quarterly: '₹17,400' },
    { id: '4', grade: 'IX - X', admissionFee: '₹50,000', tuition_fees: '₹6,400', quarterly: '₹19,200' },
    { id: '5', grade: 'XI - XII', admissionFee: '₹55,000', tuition_fees: '₹7,200', quarterly: '₹21,600' }
  ],
  links: [
    { id: '1', title: 'Student & Parent Portal', url: '#' },
    { id: '2', title: 'Academic Calendar 2025-26', url: '#' },
    { id: '3', title: 'XAOSA Alumni Registration', url: '#' },
    { id: '4', title: 'CBSE Affiliation Info', url: '#' }
  ],
  events: [
    { id: '1', title: 'Investiture Ceremony 2026', date: 'May 15, 2026', time: '09:00 AM', location: 'St. Ignatius Hall' },
    { id: '2', title: 'Summer Football Camp', date: 'June 01, 2026', time: '06:30 AM', location: 'Main School Grounds' },
    { id: '3', title: 'Alumni Homecoming Dinner', date: 'July 20, 2026', time: '07:30 PM', location: 'Open Quadrangle' }
  ],
  achievements: [
    { id: '1', title: 'National Science Fair Gold', year: '2026', description: 'Our senior robotics team secured the first position at the National Science Congress.' },
    { id: '2', title: 'Best School in Jaipur 2025', year: '2025', description: 'Ranked #1 for Holistic Development by Education World.' },
    { id: '3', title: 'State Cricket Champions', year: '2025', description: 'The U-19 team won the Rajasthan State Inter-School Tournament.' }
  ]
};

// --- 3D Components ---

function SchoolBuilding({ mouseX, mouseY }: { mouseX: any, mouseY: any }) {
  const meshRef = React.useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (!meshRef.current) return;
    const targetRotateY = (mouseX.get() / 50) + Math.PI / 4;
    const targetRotateX = (mouseY.get() / 50) - 0.2;
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotateY, 0.05);
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotateX, 0.05);
  });

  return (
    <group ref={meshRef}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[4, 5, 3]} />
        <meshStandardMaterial color="#002147" roughness={0.2} metalness={0.8} />
      </mesh>
      <mesh position={[-3.5, -0.5, 0]}>
        <boxGeometry args={[3, 4, 2]} />
        <meshStandardMaterial color="#002147" />
      </mesh>
      <mesh position={[3.5, -0.5, 0]}>
        <boxGeometry args={[3, 4, 2]} />
        <meshStandardMaterial color="#002147" />
      </mesh>
      <mesh position={[0, 3.5, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 2, 8]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.5} roughness={0.1} />
      </mesh>
      <mesh position={[0, -1.5, 1.6]}>
        <boxGeometry args={[2, 2, 0.2]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>
      {[...Array(12)].map((_, i) => (
        <mesh key={i} position={[((i % 4) - 1.5) * 0.8, (Math.floor(i / 4) - 1.5) * 1.2, 1.51]}>
          <planeGeometry args={[0.4, 0.6]} />
          <meshBasicMaterial color="#ffffff" opacity={0.8} transparent />
        </mesh>
      ))}
    </group>
  );
}

// --- Helper Components ---

const PerspectiveCard = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [8, -8]);
  const rotateY = useTransform(x, [-100, 100], [-8, 8]);
  const springX = useSpring(rotateX, { stiffness: 150, damping: 20 });
  const springY = useSpring(rotateY, { stiffness: 150, damping: 20 });

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8 }}
      viewport={{ once: true }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - (rect.left + rect.width / 2));
        y.set(e.clientY - (rect.top + rect.height / 2));
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ perspective: 1000, rotateX: springX, rotateY: springY }}
      className={`cursor-pointer ${className}`}
    >
      {children}
    </motion.div>
  );
};

// --- Home Page Component ---

const HomePage = ({ data }: { data: AppData }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });

  const textX = useTransform(springX, [ -50, 50 ], [ 15, -15 ]);
  const textY = useTransform(springY, [ -50, 50 ], [ 15, -15 ]);
  const textRotateX = useTransform(springY, [ -50, 50 ], [ 5, -5 ]);
  const textRotateY = useTransform(springX, [ -50, 50 ], [ -5, 5 ]);

  const handleHeroMouseMove = (e: React.MouseEvent) => {
    const x = e.clientX - window.innerWidth / 2;
    const y = e.clientY - window.innerHeight / 2;
    mouseX.set(x / 20);
    mouseY.set(y / 20);
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white selection:bg-school-gold selection:text-white overflow-x-hidden">
      {/* Dynamic Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${isScrolled ? 'glass-nav py-4' : 'bg-transparent py-8'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.1 }} className="w-14 h-14 flex items-center justify-center text-white font-serif font-black text-3xl shadow-2xl rounded-2xl bg-school-navy border-2 border-school-gold/20">X</motion.div>
            <div>
              <h1 className="font-serif text-2xl font-black text-school-navy leading-none tracking-tight">ST. XAVIER'S</h1>
              <p className="text-[10px] uppercase tracking-[0.4em] font-black text-school-navy/40">SR. SEC. SCHOOL • JAIPUR</p>
            </div>
          </div>
          
          <div className="hidden xl:flex items-center gap-8">
            {['About', 'Academics', 'Admission', 'Facilities', 'Staff', 'Alumni'].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} className="text-[11px] font-black uppercase tracking-widest text-school-navy hover:text-school-gold transition-colors relative group">
                {l}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-school-gold transition-all group-hover:w-full"></span>
              </a>
            ))}
            <Link to="/admin" className="flex items-center gap-2 px-4 py-2 rounded-xl glass-surface text-school-navy border border-school-navy/5 hover:border-school-gold transition-all shadow-sm group">
              <Key size={16} className="group-hover:text-school-gold transition-colors" />
              <span className="text-[10px] font-black uppercase tracking-widest hidden lg:block">Admin Portal</span>
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
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25 }} className="fixed inset-0 z-[60] bg-school-navy p-12 lg:hidden">
            <button onClick={() => setIsNavOpen(false)} className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"><X size={32} /></button>
            <div className="mt-20 flex flex-col gap-10">
              {['About', 'Academics', 'Admission', 'Facilities', 'Staff', 'Alumni'].map(l => (
                <a key={l} onClick={() => setIsNavOpen(false)} href={`#${l.toLowerCase()}`} className="text-4xl font-serif font-black text-white hover:text-school-gold transition-colors">{l}</a>
              ))}
              <Link to="/admin" className="text-4xl font-serif font-black text-white hover:text-school-gold transition-colors">Admin Portal</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="relative h-screen flex items-center justify-center overflow-hidden perspective-1000" onMouseMove={handleHeroMouseMove}>
        <div className="absolute inset-0 z-0 bg-slate-50">
          <Canvas dpr={[1, 2]} style={{ position: 'absolute' }}>
            <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={40} />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={2} />
            <spotLight position={[-10, 10, 5]} angle={0.3} penumbra={1} intensity={1} castShadow />
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}><SchoolBuilding mouseX={mouseX} mouseY={mouseY} /></Float>
            <ContactShadows resolution={1024} scale={20} blur={2} opacity={0.25} far={10} color="#002147" />
            <Environment preset="city" />
          </Canvas>
          <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-white to-transparent"></div>
        </div>
        <motion.div style={{ x: textX, y: textY, rotateX: textRotateX, rotateY: textRotateY, transformStyle: "preserve-3d" }} className="relative z-10 text-center px-6 pointer-events-none">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}>
            <div className="inline-block px-8 py-2.5 glass-surface rounded-full text-[11px] font-black uppercase tracking-[0.5em] text-school-navy mb-12 floating shadow-sm border border-school-navy/5 font-black">ESTABLISHED 1941 • JESUIT TRADITION</div>
            <h2 className="text-8xl md:text-[11rem] font-serif font-black text-school-navy leading-[0.8] mb-12 tracking-tighter glow-text pointer-events-auto">Transforming <br /> <span className="text-school-gold italic">Vision.</span></h2>
            <p className="text-2xl md:text-3xl text-school-navy/50 font-light mb-16 max-w-3xl mx-auto leading-relaxed pointer-events-auto">Empowering men and women for others with a commitment to academic excellence and moral fortitude in Jaipur.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-10 pointer-events-auto">
              <button className="px-16 py-6 glass-dark text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl">Digital Registration</button>
              <button className="px-16 py-6 glass-surface text-school-navy rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl">Virtual Tour</button>
            </div>
          </motion.div>
        </motion.div>

        {/* Floating Admin Portal Shortcut */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-10 right-10 z-20"
        >
          <Link 
            to="/admin" 
            className="flex items-center gap-4 px-8 py-5 rounded-2xl glass-dark text-white border border-white/10 hover:border-school-gold hover:scale-105 transition-all shadow-2xl group pointer-events-auto"
          >
            <div className="p-3 rounded-xl bg-school-gold text-school-navy shadow-inner group-hover:rotate-12 transition-all">
              <Settings size={20} className="animate-spin-slow" />
            </div>
            <div className="text-left">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50 leading-none mb-1">Authenticated Access</p>
              <h4 className="text-[11px] font-black uppercase tracking-widest">Admin Dashboard</h4>
            </div>
            <ArrowRight size={16} className="text-school-gold group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-30 pointer-events-none">
          <p className="text-[9px] font-black uppercase tracking-[0.5em] text-school-navy">Scroll for Heritage</p>
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="w-px h-12 bg-school-navy"></motion.div>
        </div>
      </section>

      {/* Campus Map Section */}
      <section id="map" className="py-40 bg-white relative overflow-hidden">
        <style dangerouslySetInnerHTML={{ __html: mapStyles }} />
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row gap-24 items-center">
            <div className="lg:w-1/2">
              <p className="text-school-gold font-black text-[10px] uppercase tracking-[0.5em] mb-6">Interactive Campus</p>
              <h2 className="text-6xl md:text-7xl font-serif font-black text-school-navy mb-10 tracking-tighter leading-none">Explore Our <span className="text-school-gold italic">Heritage Ground.</span></h2>
              <div className="space-y-6">
                {[{ n: 'Main Building', d: 'Iconic heritage structure housing administrative offices and senior wing.', id: 'm1' },
                  { n: 'Sports Complex', d: 'Basketball courts, cricket ground, and swimming pool.', id: 'm2' },
                  { n: 'Science Block', d: 'State-of-the-art physics, chemistry, and biology laboratories.', id: 'm3' },
                  { n: 'Auditorium', d: 'Central hub for cultural gatherings and performing arts.', id: 'm4' }].map((pt, i) => (
                  <motion.div key={pt.id} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="p-6 rounded-2xl glass-surface hover:bg-white transition-all border border-transparent hover:border-school-gold/20 cursor-pointer group">
                    <div className="flex items-center gap-4 mb-2">
                       <div className="w-8 h-8 rounded-lg bg-school-navy text-white flex items-center justify-center font-black text-xs">{i+1}</div>
                       <h4 className="text-xl font-serif font-black text-school-navy group-hover:text-school-gold transition-colors">{pt.n}</h4>
                    </div>
                    <p className="text-sm text-school-navy/50 font-light pl-12">{pt.d}</p>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 w-full aspect-square relative glass-surface rounded-[40px] p-8 border border-school-navy/5">
              <div className="w-full h-full bg-slate-100 rounded-3xl overflow-hidden relative shadow-inner p-10 flex items-center justify-center">
                <svg viewBox="0 0 500 500" className="w-full h-full opacity-20 absolute inset-0 pointer-events-none">
                  <path d="M50,50 L450,50 L450,450 L50,450 Z" stroke="#002147" strokeWidth="2" fill="none" />
                  <circle cx="250" cy="250" r="150" fill="#002147" opacity="0.1" />
                </svg>
                <div className="relative w-full h-full">
                  <div className="absolute top-[20%] left-[40%] map-pin cursor-pointer group"><div className="w-12 h-12 bg-school-navy text-white rounded-full flex items-center justify-center shadow-2xl border-2 border-white"><MapIcon size={20} /></div></div>
                  <div className="absolute top-[60%] left-[20%] map-pin cursor-pointer group"><div className="w-12 h-12 bg-school-gold text-school-navy rounded-full flex items-center justify-center shadow-2xl border-2 border-white"><Trophy size={20} /></div></div>
                  <div className="absolute top-[50%] right-[20%] map-pin cursor-pointer group"><div className="w-12 h-12 bg-school-navy/80 text-white rounded-full flex items-center justify-center shadow-2xl border-2 border-white"><SchoolIcon size={20} /></div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Notices & Events */}
      <section className="py-40 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-24">
          <div>
            <h2 className="text-6xl font-serif font-black text-school-navy mb-16">Lateest <span className="text-school-gold italic">Notices</span></h2>
            <div className="space-y-6">
              {data.notices.map((n, i) => (
                <div key={n.id} className="p-8 glass-surface rounded-2xl hover:bg-white transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-school-gold">{n.category}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-school-navy/30">{n.date}</span>
                  </div>
                  <h4 className="text-2xl font-serif font-black text-school-navy mb-6 leading-tight group-hover:text-school-gold transition-colors">{n.title}</h4>
                  <button className="flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                    <span className="text-[10px] font-black uppercase tracking-widest text-school-navy">Read Circular</span>
                    <ArrowRight size={14} className="text-school-gold" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-6xl font-serif font-black text-school-navy mb-16">Calendar <span className="text-school-gold italic">Events</span></h2>
             <div className="space-y-6">
              {data.events.map((e, i) => (
                <div key={e.id} className="p-8 glass-surface rounded-2xl hover:bg-white transition-all flex gap-8 items-center group">
                  <div className="w-20 h-20 rounded-2xl bg-school-navy text-white flex flex-col items-center justify-center font-black">
                     <span className="text-[10px] uppercase tracking-widest opacity-50">{e.date.split(' ')[0]}</span>
                     <span className="text-2xl">{e.date.split(' ')[1].replace(',', '')}</span>
                  </div>
                  <div>
                    <h4 className="text-2xl font-serif font-black text-school-navy mb-2 group-hover:text-school-gold transition-colors">{e.title}</h4>
                    <p className="text-sm text-school-navy/50 font-light">{e.time} • {e.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Staff */}
      <section id="staff" className="py-40 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center mb-24">
           <h2 className="text-7xl font-serif font-black text-school-navy">Executive <span className="text-school-gold italic">Leadership.</span></h2>
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {data.staff.map((s, i) => (
            <PerspectiveCard key={s.id} delay={i * 0.1}>
              <div className="glass-surface p-8 rounded-[32px] border border-slate-100 flex flex-col items-center text-center h-full">
                <div className="w-32 h-32 rounded-3xl mb-8 shadow-xl overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-200">
                  {s.image ? (
                    <img src={s.image} className="w-full h-full object-cover" alt={s.name} referrerPolicy="no-referrer" />
                  ) : (
                    <Users2 size={48} className="text-slate-300" />
                  )}
                </div>
                <h4 className="text-2xl font-serif font-black text-school-navy mb-2">{s.name}</h4>
                <p className="text-[10px] uppercase font-black tracking-widest text-school-gold mb-6">{s.role}</p>
                <p className="text-sm text-school-navy/50 font-light line-clamp-3">{s.bio}</p>
              </div>
            </PerspectiveCard>
          ))}
        </div>
      </section>

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
             <h4 className="text-school-gold font-black uppercase text-[10px] tracking-widest mb-10">Connect</h4>
             <p className="text-sm text-school-navy/50 font-light mb-6">Bhagwan Das Road, C-Scheme, Jaipur, Rajasthan 302001</p>
             <p className="text-sm text-school-navy font-black tracking-widest">+91 141 2367793</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// --- Admin Portal Component ---

const AdminPortal = ({ data, setData }: { data: AppData, setData: (d: AppData) => void }) => {
  const [activeSection, setActiveSection] = useState<keyof AppData>('notices');
  const [isUploading, setIsUploading] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRemove = async (id: string) => {
    try {
      const res = await fetch('/api/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table: activeSection, id })
      });
      if (res.ok) {
        setData({ ...data, [activeSection]: data[activeSection].filter((i: any) => i.id !== id) });
        setItemToDelete(null);
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleAdd = async () => {
    const newItem: any = { id: Date.now().toString() };
    if (activeSection === 'notices') {
      newItem.title = 'New Notice Title';
      newItem.date = new Date().toLocaleDateString();
      newItem.category = 'Circular';
    } else if (activeSection === 'events') {
      newItem.title = 'New Event';
      newItem.date = 'Selected Date';
      newItem.time = '10:00 AM';
      newItem.location = 'Campus Grounds';
    } else if (activeSection === 'staff') {
      newItem.name = 'New Staff Member';
      newItem.role = 'Role Description';
      newItem.bio = 'Staff biography goes here...';
      newItem.type = 'Faculty';
      newItem.image = 'https://picsum.photos/seed/new/400/400';
    } else if (activeSection === 'gallery') {
       newItem.url = 'https://picsum.photos/seed/new_gallery/1200/800';
       newItem.caption = 'New Gallery Image';
    } else if (activeSection === 'fees') {
       newItem.grade = 'New Grade Range';
       newItem.admissionFee = '₹0';
       newItem.tuition_fees = '₹0';
       newItem.quarterly = '₹0';
    } else if (activeSection === 'links') {
       newItem.title = 'New Quick Link';
       newItem.url = '#';
    } else if (activeSection === 'achievements') {
       newItem.title = 'Achievement Title';
       newItem.year = '2026';
       newItem.description = 'Success story detail...';
    }

    try {
      const res = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table: activeSection, item: newItem })
      });
      if (res.ok) {
        setData({ ...data, [activeSection]: [newItem, ...data[activeSection]] });
      }
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  const handleUpdate = async (id: string, field: string, value: string) => {
    const updatedItem = data[activeSection].find((i: any) => i.id === id);
    if (!updatedItem) return;
    
    const newItem = { ...updatedItem, [field]: value };
    
    try {
      const res = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table: activeSection, item: newItem })
      });
      if (res.ok) {
        setData({
          ...data,
          [activeSection]: data[activeSection].map((i: any) => i.id === id ? newItem : i)
        });
      }
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, itemId: string, field: string = 'url') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/gallery/upload', {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();
      if (result.url) {
        handleUpdate(itemId, field, result.url);
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const sections = [
    { id: 'notices', label: 'Notices', icon: <Bell size={18} /> },
    { id: 'events', label: 'Events', icon: <Calendar size={18} /> },
    { id: 'staff', label: 'Faculty', icon: <Users2 size={18} /> },
    { id: 'gallery', label: 'Gallery', icon: <ImageIcon size={18} /> },
    { id: 'fees', label: 'Fees', icon: <CreditCard size={18} /> },
    { id: 'links', label: 'Links', icon: <LinkIcon size={18} /> },
    { id: 'achievements', label: 'Success', icon: <Award size={18} /> }
  ];

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex font-sans">
      {/* Sidebar */}
      <aside className="w-80 bg-school-navy text-white flex flex-col fixed h-full z-10">
        <div className="p-8 pb-12">
          <Link to="/" className="flex items-center gap-3 mb-12 group">
            <div className="w-10 h-10 bg-school-gold rounded-lg flex items-center justify-center text-school-navy font-black text-xl group-hover:scale-110 transition-transform">X</div>
            <span className="font-serif text-lg font-black tracking-tight">Admin Console</span>
          </Link>
          <div className="space-y-4">
            {sections.map(s => (
              <button key={s.id} onClick={() => setActiveSection(s.id as keyof AppData)} className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all ${activeSection === s.id ? 'bg-school-gold text-school-navy font-black shadow-lg' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
                {s.icon} <span className="text-[11px] uppercase tracking-widest">{s.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="mt-auto p-8 border-t border-white/5">
           <button onClick={() => navigate('/')} className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white flex items-center gap-3 transition-colors"><ChevronRight size={14} className="rotate-180" /> Exit Portal</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-80 p-12">
        <header className="flex justify-between items-end mb-16">
          <div>
            <h1 className="text-5xl font-serif font-black text-school-navy mb-4 tracking-tight capitalize">Manage {activeSection}</h1>
            <p className="text-sm text-school-navy/40 font-light">Comprehensive CRUD control for {activeSection} on the main portal.</p>
          </div>
          <button onClick={handleAdd} className="flex items-center gap-3 px-8 py-4 bg-school-gold text-school-navy rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all outline-none">
            <Plus size={16} /> New {activeSection.slice(0, -1)}
          </button>
        </header>

        <div className="grid gap-6">
          {data[activeSection].map((item: any) => (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={item.id} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex items-start gap-8 group">
              <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-6">
                {Object.keys(item).filter(k => k !== 'id').map(field => (
                  <div key={field} className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-300">{field}</label>
                    {field === 'bio' || field === 'description' ? (
                       <textarea value={item[field]} onChange={(e) => handleUpdate(item.id, field, e.target.value)} className="w-full bg-slate-50 border-none rounded-xl p-3 text-xs text-school-navy font-medium h-24 focus:ring-1 focus:ring-school-gold transition-all resize-none" />
                    ) : field === 'url' && activeSection === 'gallery' ? (
                      <div className="space-y-4">
                        <input value={item[field]} onChange={(e) => handleUpdate(item.id, field, e.target.value)} className="w-full bg-slate-50 border-none rounded-xl p-3 text-xs text-school-navy font-medium focus:ring-1 focus:ring-school-gold transition-all" />
                        <div className="flex items-center gap-4">
                          <label className="flex-1 px-4 py-3 bg-school-navy/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-school-navy cursor-pointer hover:bg-school-navy/10 transition-all text-center">
                            {isUploading ? 'Uploading...' : 'Direct Upload'}
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, item.id, 'url')} disabled={isUploading} />
                          </label>
                          <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
                            {item.url ? (
                              <img src={item.url} className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon size={24} className="text-slate-300" />
                            )}
                          </div>
                        </div>
                      </div>
                    ) : field === 'image' && activeSection === 'staff' ? (
                      <div className="space-y-4">
                        <input value={item[field]} onChange={(e) => handleUpdate(item.id, field, e.target.value)} className="w-full bg-slate-50 border-none rounded-xl p-3 text-xs text-school-navy font-medium focus:ring-1 focus:ring-school-gold transition-all" />
                        <div className="flex items-center gap-4">
                          <label className="flex-1 px-4 py-3 bg-school-navy/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-school-navy cursor-pointer hover:bg-school-navy/10 transition-all text-center">
                            {isUploading ? 'Uploading Logo/Photo...' : 'Upload Faculty Image'}
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, item.id, 'image')} disabled={isUploading} />
                          </label>
                          <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
                            {item.image ? (
                              <img src={item.image} className="w-full h-full object-cover" />
                            ) : (
                              <Users2 size={24} className="text-slate-300" />
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                       <input value={item[field]} onChange={(e) => handleUpdate(item.id, field, e.target.value)} className="w-full bg-slate-50 border-none rounded-xl p-3 text-xs text-school-navy font-medium focus:ring-1 focus:ring-school-gold transition-all" />
                    )}
                  </div>
                ))}
              </div>
              <button onClick={() => setItemToDelete(item.id)} className="p-4 rounded-2xl bg-red-50 text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-100"><Trash2 size={20} /></button>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {itemToDelete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setItemToDelete(null)}
              className="absolute inset-0 bg-school-navy/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md glass-surface rounded-[32px] p-10 overflow-hidden"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                  <Trash2 size={32} />
                </div>
                <h3 className="text-3xl font-serif font-black text-school-navy mb-4 tracking-tight">Confirm Deletion</h3>
                <p className="text-sm text-school-navy/50 font-light mb-10 leading-relaxed">
                  Are you absolutely sure you want to remove this entry? This action is irreversible and will delete data from the SQL backend.
                </p>
                <div className="flex gap-4 w-full">
                  <button 
                    onClick={() => setItemToDelete(null)}
                    className="flex-1 py-4 glass-surface rounded-xl text-[10px] font-black uppercase tracking-widest text-school-navy hover:bg-slate-50 transition-all outline-none"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => handleRemove(itemToDelete)}
                    className="flex-1 py-4 bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-red-600 transition-all active:scale-95 outline-none"
                  >
                    Confirm Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- App Root ---

export default function App() {
  const [data, setData] = useState<AppData>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(fetchedData => {
        // Only use fetched data if tables aren't empty, otherwise keep DEFAULT_DATA
        const merged = { ...DEFAULT_DATA };
        let hasData = false;
        Object.keys(fetchedData).forEach(key => {
          if (fetchedData[key] && fetchedData[key].length > 0) {
            merged[key as keyof AppData] = fetchedData[key];
            hasData = true;
          }
        });
        
        if (hasData) {
          setData(merged);
        } else {
          // If fresh DB, seed it with DEFAULT_DATA
          Object.keys(DEFAULT_DATA).forEach(table => {
            DEFAULT_DATA[table as keyof AppData].forEach(async (item) => {
              await fetch('/api/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ table, item })
              });
            });
          });
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="h-screen w-screen flex items-center justify-center bg-school-navy text-white font-serif italic text-2xl">Initializing Jesuit Portal...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage data={data} />} />
        <Route path="/admin" element={<AdminPortal data={data} setData={setData} />} />
      </Routes>
    </Router>
  );
}
