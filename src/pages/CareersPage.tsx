import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import Layout from '../components/layout/Layout';
import { AppData } from '../types';
import { supabase } from '../supabaseClient';
import { 
  Briefcase, 
  Send, 
  MapPin, 
  Calendar, 
  ArrowRight,
  Sparkles,
  FileText,
  Plus,
  Trash2,
  CheckCircle2,
  Loader2,
  GraduationCap,
  History,
  Trophy,
  User,
  BookOpen,
  Camera,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { 
  careerService, 
  CareerApplication, 
  EducationQualification, 
  TeachingExperience, 
  Achievement 
} from '../services/careerService';

const CareersPage = ({ data }: { data: AppData }) => {
  const jobs = data.careers || [];
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [formData, setFormData] = useState<Partial<CareerApplication>>({
    category: 'Teacher',
    full_name: '',
    parent_spouse_name: '',
    mobile_number: '',
    email: '',
    gender: 'Male',
    dob: '',
    aadhar_number: '',
    address: '',
    photo_url: '',
    user_ip: '',
    declaration_accepted: false,
    teacher_category: '',
    major_subject: '',
    minor_subject_1: '',
    minor_subject_2: '',
    salary_expected: '',
    tet_details: '',
    interests: '',
    responsibilities_handled: '',
    statement_of_purpose: '',
    other_experience: '',
    education_qualifications: [],
    teaching_experience: [],
    achievements: []
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // Fetch User IP with fallback and timeout
    const fetchIP = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      try {
        const response = await fetch('https://api64.ipify.org?format=json', { signal: controller.signal });
        const data = await response.json();
        setFormData(prev => ({ ...prev, user_ip: data.ip }));
      } catch (err) {
        // Silent fallback for production/iframe constraints
        try {
          const res = await fetch('https://icanhazip.com');
          const ip = await res.text();
          setFormData(prev => ({ ...prev, user_ip: ip.trim() }));
        } catch (err2) {
          setFormData(prev => ({ ...prev, user_ip: 'Remote-Network-Client' }));
        }
      } finally {
        clearTimeout(timeoutId);
      }
    };
    fetchIP();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    // File size validation (300KB)
    if (file.size > 300 * 1024) {
      setErrorMsg('File too large. Maximum size is 300KB.');
      return;
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `photos/${fileName}`;

    try {
      setUploading(true);
      setErrorMsg('');
      const { error: uploadError } = await supabase.storage
        .from('career_assets')
        .upload(filePath, file);

      if (uploadError) {
        if (uploadError.message.toLowerCase().includes('bucket not found')) {
          throw new Error('Supabase Storage: Bucket "career_assets" not found. Please run the SQL provided in the admin resources or project root to create the bucket.');
        }
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('career_assets')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, photo_url: publicUrl }));
    } catch (error: any) {
      console.error('Error uploading image:', error.message);
      setErrorMsg(error.message || 'Image upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const generateAppNo = () => {
    const year = new Date().getFullYear();
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `STXJ/${year}/${rand}`;
  };

  // Table Add/Remove Handlers
  const addEdu = () => {
    setFormData(prev => ({
      ...prev,
      education_qualifications: [
        ...(prev.education_qualifications || []),
        { examination: '', percentage: '', year: '', institution: '', subjects: '' }
      ]
    }));
  };

  const removeEdu = (index: number) => {
    setFormData(prev => ({
      ...prev,
      education_qualifications: prev.education_qualifications?.filter((_, i) => i !== index)
    }));
  };

  const addExp = () => {
    setFormData(prev => ({
      ...prev,
      teaching_experience: [
        ...(prev.teaching_experience || []),
        { fromYear: '', toYear: '', institution: '', subjects: '', classes: '' }
      ]
    }));
  };

  const removeExp = (index: number) => {
    setFormData(prev => ({
      ...prev,
      teaching_experience: prev.teaching_experience?.filter((_, i) => i !== index)
    }));
  };

  const addAchievement = () => {
    setFormData(prev => ({
      ...prev,
      achievements: [
        ...(prev.achievements || []),
        { year: '', field: '', description: '' }
      ]
    }));
  };

  const removeAchievement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements?.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.declaration_accepted) {
      setErrorMsg('Please accept the declaration to proceed.');
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      const finalData = {
        ...formData,
        application_no: generateAppNo()
      };
      await careerService.submitApplication(finalData as CareerApplication);
      setSubmitStatus('success');
      // Reset form
      setFormData({
        category: 'Teacher',
        full_name: '',
        parent_spouse_name: '',
        mobile_number: '',
        email: '',
        gender: 'Male',
        dob: '',
        aadhar_number: '',
        address: '',
        photo_url: '',
        declaration_accepted: false,
        major_subject: '',
        minor_subject_1: '',
        minor_subject_2: '',
        salary_expected: '',
        tet_details: '',
        interests: '',
        responsibilities_handled: '',
        statement_of_purpose: '',
        other_experience: '',
        education_qualifications: [],
        teaching_experience: [],
        achievements: []
      });
    } catch (err: any) {
      console.error(err);
      setSubmitStatus('error');
      setErrorMsg(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout data={data} navbarTheme="dark">
      <Helmet>
        <title>Careers | St. Xavier's Sr. Sec. School, Jaipur</title>
        <meta name="description" content="Apply for teaching and non-teaching positions at St. Xavier's School, Jaipur. Connect with our legacy institution." />
      </Helmet>

      <div className="bg-[#F8F9FA] min-h-screen pb-40">
        {/* Modern Hero Section */}
        <section className="relative pt-48 pb-32 overflow-hidden bg-school-navy rounded-b-[80px] md:rounded-b-[120px]">
          <div className="absolute inset-0 bg-school-gold/5 blur-[120px] rounded-full translate-x-1/4 -translate-y-1/2" />
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="max-w-4xl">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-block px-8 py-3 bg-school-gold/10 rounded-full border border-school-gold/20 mb-12 shadow-2xl"
              >
                <span className="text-xs font-black uppercase tracking-[0.4em] text-school-gold flex items-center gap-3">
                  <Sparkles size={14} /> Career Opportunities
                </span>
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-6xl md:text-9xl font-black text-white tracking-tighter leading-[0.8] mb-12 scale-y-110 origin-left"
              >
                JOIN THE <span className="text-school-gold italic">LEGACY.</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xl md:text-2xl text-white/40 font-light max-w-3xl leading-relaxed"
              >
                Become part of our institutional mission to enkindle minds and empower souls. We seek dedicated professionals who share our values of service and excellence.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Form Container */}
        <section className="py-24 -mt-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="bg-white rounded-[60px] shadow-[0_80px_160px_-40px_rgba(0,0,0,0.12)] border border-school-ink/5 overflow-hidden">
              <div className="grid lg:grid-cols-4 min-h-[800px]">
                
                {/* Sidebar Info */}
                <div className="lg:col-span-1 bg-school-navy p-12 text-white flex flex-col justify-between relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none">
                     <svg className="w-full h-full" viewBox="0 0 100 100">
                        <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
                        </pattern>
                        <rect width="100" height="100" fill="url(#grid)" />
                     </svg>
                   </div>
                   
                   <div className="relative z-10 space-y-12">
                     <div className="space-y-4">
                       <h3 className="text-3xl font-black italic tracking-tighter uppercase leading-none">Application <br /><span className="text-school-gold">Registry</span></h3>
                       <p className="text-sm text-white/40 font-medium">Please provide accurate information for institutional verification.</p>
                     </div>

                     <div className="space-y-8">
                       {[
                         { icon: <User size={20}/>, label: 'Identity', desc: 'Personal credentials' },
                         { icon: <GraduationCap size={20}/>, label: 'Academic', desc: 'Degrees & Certs' },
                         { icon: <History size={20}/>, label: 'Experience', desc: 'Service record' },
                         { icon: <Trophy size={20}/>, label: 'Special', desc: 'Feats & Goals' }
                       ].map((step, idx) => (
                         <div key={idx} className="flex gap-6 items-center group">
                           <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-school-gold group-hover:bg-school-gold group-hover:text-school-navy transition-all duration-500">
                             {step.icon}
                           </div>
                           <div className="opacity-60">
                             <p className="text-[10px] font-black uppercase tracking-widest">{step.label}</p>
                             <p className="text-xs font-medium text-white/30">{step.desc}</p>
                           </div>
                         </div>
                       ))}
                     </div>
                   </div>

                   <div className="relative z-10 pt-20 border-t border-white/10">
                     <p className="text-[10px] font-black uppercase tracking-[0.4em] text-school-gold mb-4">Official HR Hub</p>
                     <p className="text-sm font-bold text-white/60">careers@stxaviersjaipur.org</p>
                   </div>
                </div>

                {/* Form Content */}
                <div className="lg:col-span-3 p-12 md:p-20 bg-white">
                  {data.settings?.careerFormEnabled === false ? (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="h-full flex flex-col items-center justify-center text-center space-y-8 py-20"
                    >
                      <div className="w-32 h-32 bg-rose-50 rounded-full flex items-center justify-center text-rose-500">
                        <Briefcase size={64} className="opacity-20" />
                      </div>
                      <div>
                        <h2 className="text-5xl font-black text-school-ink tracking-tighter uppercase leading-none mb-4">Admissions <br /><span className="italic text-rose-500">Paused.</span></h2>
                        <p className="text-xl text-school-ink/40 font-medium max-w-sm mx-auto">The institutional talent registry is currently closed for new submissions. Please monitor this portal for future recruitment cycles.</p>
                      </div>
                    </motion.div>
                  ) : submitStatus === 'success' ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="h-full flex flex-col items-center justify-center text-center space-y-8"
                    >
                      <div className="w-32 h-32 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500">
                        <CheckCircle2 size={64} />
                      </div>
                      <div>
                        <h2 className="text-5xl font-black text-school-ink tracking-tighter uppercase leading-none mb-4">Submission <br /><span className="italic text-emerald-500">Confirmed.</span></h2>
                        <p className="text-xl text-school-ink/40 font-medium max-w-sm mx-auto">Your application has been logged into our institutional registry. We will contact you via electronic mail if shortlisted.</p>
                      </div>
                      <button 
                        onClick={() => setSubmitStatus('idle')}
                        className="px-12 py-6 bg-school-navy text-white rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-school-gold hover:text-school-navy transition-all"
                      >
                        Submit Another Application
                      </button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-24">
                      {/* Section 1: Basic Identity */}
                      <div className="space-y-12">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 bg-school-ink text-white rounded-full flex items-center justify-center text-xs font-black italic">01</div>
                          <h4 className="text-2xl font-black text-school-ink uppercase tracking-tighter italic">Basic Credentials</h4>
                        </div>

                        <div className="grid md:grid-cols-2 gap-12">
                          <div className="space-y-4">
                              <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/30 ml-2">Application Category</label>
                             <select 
                               required
                               className="w-full bg-[#F8F9FA] rounded-3xl py-6 px-10 text-school-ink font-bold border border-school-ink/5 focus:ring-4 focus:ring-school-gold/10 transition-all outline-none appearance-none"
                               value={formData.category}
                               onChange={e => setFormData({...formData, category: e.target.value})}
                             >
                               <option>Teacher</option>
                               <option>Administrative Staff</option>
                               <option>Supporting Staff</option>
                               <option>Sports Coach</option>
                               <option>Other</option>
                             </select>
                          </div>
                          {formData.category === 'Teacher' && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="space-y-4"
                            >
                              <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/30 ml-2">Teacher Category (Select Level)</label>
                              <select 
                                required
                                className="w-full bg-[#F8F9FA] rounded-3xl py-6 px-10 text-school-ink font-bold border border-school-ink/5 focus:ring-4 focus:ring-school-gold/10 transition-all outline-none appearance-none"
                                value={formData.teacher_category}
                                onChange={e => setFormData({...formData, teacher_category: e.target.value})}
                              >
                                <option value="">Select Level...</option>
                                <option>PGT</option>
                                <option>TGT</option>
                                <option>PRT</option>
                              </select>
                            </motion.div>
                          )}
                          <div className="space-y-4">
                             <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/30 ml-2">Full Legal Name</label>
                             <input 
                               required
                               placeholder="e.g. Rahul Sharma"
                               className="w-full bg-[#F8F9FA] rounded-3xl py-6 px-10 text-school-ink font-bold border border-school-ink/5 focus:ring-4 focus:ring-school-gold/10 transition-all outline-none"
                               value={formData.full_name}
                               onChange={e => setFormData({...formData, full_name: e.target.value})}
                             />
                          </div>
                          <div className="space-y-4">
                             <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/30 ml-2">Father / Mother / Spouse Name</label>
                             <input 
                               required
                               className="w-full bg-[#F8F9FA] rounded-3xl py-6 px-10 text-school-ink font-bold border border-school-ink/5 focus:ring-4 focus:ring-school-gold/10 transition-all outline-none"
                               value={formData.parent_spouse_name}
                               onChange={e => setFormData({...formData, parent_spouse_name: e.target.value})}
                             />
                          </div>
                          <div className="space-y-4">
                             <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/30 ml-2">Electronic Mail</label>
                             <input 
                               required
                               type="email"
                               className="w-full bg-[#F8F9FA] rounded-3xl py-6 px-10 text-school-ink font-bold border border-school-ink/5 focus:ring-4 focus:ring-school-gold/10 transition-all outline-none"
                               value={formData.email}
                               onChange={e => setFormData({...formData, email: e.target.value})}
                             />
                          </div>
                          <div className="space-y-4">
                             <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/30 ml-2">Mobile Contact Number</label>
                             <input 
                               required
                               className="w-full bg-[#F8F9FA] rounded-3xl py-6 px-10 text-school-ink font-bold border border-school-ink/5 focus:ring-4 focus:ring-school-gold/10 transition-all outline-none"
                               value={formData.mobile_number}
                               onChange={e => setFormData({...formData, mobile_number: e.target.value})}
                             />
                          </div>
                          <div className="space-y-4">
                             <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/30 ml-2">Gender Identification</label>
                             <div className="flex gap-4">
                               {['Male', 'Female', 'Other'].map(g => (
                                 <button 
                                   key={g}
                                   type="button"
                                   onClick={() => setFormData({...formData, gender: g})}
                                   className={`flex-1 py-6 rounded-3xl font-bold transition-all ${formData.gender === g ? 'bg-school-ink text-white shadow-xl translate-y-[-2px]' : 'bg-[#F8F9FA] text-school-ink/40'}`}
                                 >
                                   {g}
                                 </button>
                               ))}
                             </div>
                          </div>
                          <div className="space-y-4">
                             <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/30 ml-2">Date of Birth</label>
                             <input 
                               required
                               type="date"
                               className="w-full bg-[#F8F9FA] rounded-3xl py-6 px-10 text-school-ink font-bold border border-school-ink/5 focus:ring-4 focus:ring-school-gold/10 transition-all outline-none"
                               value={formData.dob}
                               onChange={e => setFormData({...formData, dob: e.target.value})}
                             />
                          </div>
                          <div className="space-y-4">
                             <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/30 ml-2">Aadhar Identification Number</label>
                             <input 
                               required
                               placeholder="12-digit number"
                               className="w-full bg-[#F8F9FA] rounded-3xl py-6 px-10 text-school-ink font-bold border border-school-ink/5 focus:ring-4 focus:ring-school-gold/10 transition-all outline-none"
                               value={formData.aadhar_number}
                               onChange={e => setFormData({...formData, aadhar_number: e.target.value})}
                             />
                          </div>
                          <div className="space-y-4 md:col-span-2">
                             <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/30 ml-2">Permanent Address</label>
                             <textarea 
                               required
                               placeholder="Full residential address with Pin Code"
                               className="w-full bg-[#F8F9FA] rounded-3xl py-6 px-10 text-school-ink font-bold border border-school-ink/5 focus:ring-4 focus:ring-school-gold/10 transition-all outline-none h-32 resize-none"
                               value={formData.address}
                               onChange={e => setFormData({...formData, address: e.target.value})}
                             />
                          </div>
                          <div className="space-y-4 md:col-span-2">
                             <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/30 ml-2">Photograph Upload</label>
                             <div className="flex items-center gap-8 bg-[#F8F9FA] p-8 rounded-[32px] border border-school-ink/5 relative group">
                                <div className="w-24 h-24 bg-white rounded-2xl border-2 border-dashed border-school-ink/10 flex items-center justify-center overflow-hidden">
                                   {formData.photo_url ? (
                                     <img src={formData.photo_url} alt="Profile" className="w-full h-full object-cover" />
                                   ) : (
                                     <Camera className="text-school-ink/20" size={32} />
                                   )}
                                </div>
                                <div className="flex-1">
                                   <p className="text-xs font-bold text-school-navy mb-1">{formData.photo_url ? 'Photograph Manifested' : 'Upload recent passport photo'}</p>
                                   <p className="text-[10px] text-school-ink/40 font-medium italic">Max 300KB. JPG, PNG formats only.</p>
                                   <input 
                                     type="file" 
                                     accept="image/*"
                                     className="absolute inset-0 opacity-0 cursor-pointer"
                                     onChange={handleFileUpload}
                                   />
                                </div>
                                {uploading && <Loader2 className="animate-spin text-school-accent" />}
                             </div>
                          </div>
                        </div>
                      </div>

                      {/* Section 2: Professional Disciplines */}
                      <div className="space-y-12">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 bg-school-ink text-white rounded-full flex items-center justify-center text-xs font-black italic">02</div>
                          <h4 className="text-2xl font-black text-school-ink uppercase tracking-tighter italic">Professional Disciplines</h4>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                           <div className="space-y-4">
                             <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/30 ml-2">Major Subject</label>
                             <input 
                               className="w-full bg-[#F8F9FA] rounded-3xl py-6 px-10 text-school-ink font-bold border border-school-ink/5 focus:ring-4 focus:ring-school-gold/10 transition-all outline-none"
                               value={formData.major_subject}
                               onChange={e => setFormData({...formData, major_subject: e.target.value})}
                             />
                           </div>
                           <div className="space-y-4">
                             <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/30 ml-2">Minor 1</label>
                             <input 
                               className="w-full bg-[#F8F9FA] rounded-3xl py-6 px-10 text-school-ink font-bold border border-school-ink/5 focus:ring-4 focus:ring-school-gold/10 transition-all outline-none"
                               value={formData.minor_subject_1}
                               onChange={e => setFormData({...formData, minor_subject_1: e.target.value})}
                             />
                           </div>
                           <div className="space-y-4">
                             <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/30 ml-2">Minor 2</label>
                             <input 
                               className="w-full bg-[#F8F9FA] rounded-3xl py-6 px-10 text-school-ink font-bold border border-school-ink/5 focus:ring-4 focus:ring-school-gold/10 transition-all outline-none"
                               value={formData.minor_subject_2}
                               onChange={e => setFormData({...formData, minor_subject_2: e.target.value})}
                             />
                           </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-12">
                          <div className="space-y-4">
                             <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/30 ml-2">Salary Expectation (Monthly)</label>
                             <input 
                               className="w-full bg-[#F8F9FA] rounded-3xl py-6 px-10 text-school-ink font-bold border border-school-ink/5 focus:ring-4 focus:ring-school-gold/10 transition-all outline-none"
                               value={formData.salary_expected}
                               onChange={e => setFormData({...formData, salary_expected: e.target.value})}
                             />
                          </div>
                          <div className="space-y-4">
                             <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/30 ml-2">TET/CTET Status & Details</label>
                             <input 
                               placeholder="Specify year and state if cleared"
                               className="w-full bg-[#F8F9FA] rounded-3xl py-6 px-10 text-school-ink font-bold border border-school-ink/5 focus:ring-4 focus:ring-school-gold/10 transition-all outline-none"
                               value={formData.tet_details}
                               onChange={e => setFormData({...formData, tet_details: e.target.value})}
                             />
                          </div>
                        </div>
                      </div>

                      {/* Section 3: Educational Qualifications Table */}
                      <div className="space-y-8">
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-8 h-8 bg-school-ink text-white rounded-full flex items-center justify-center text-xs font-black italic">03</div>
                              <h4 className="text-2xl font-black text-school-ink uppercase tracking-tighter italic">Academic Qualifications</h4>
                            </div>
                            <button 
                              type="button"
                              onClick={addEdu}
                              className="bg-school-gold text-school-navy p-3 rounded-full hover:scale-110 transition-all shadow-xl"
                            >
                              <Plus size={20} />
                            </button>
                         </div>

                         <div className="overflow-x-auto rounded-[40px] border border-school-ink/5 bg-[#F8F9FA] p-8">
                            <table className="w-full border-collapse">
                               <thead>
                                  <tr className="text-[10px] font-black uppercase tracking-widest text-school-ink/30 border-b border-school-ink/5 text-left italic">
                                     <th className="pb-6 pr-4">Exams Passed</th>
                                     <th className="pb-6 pr-4">%age</th>
                                     <th className="pb-6 pr-4">Year</th>
                                     <th className="pb-6 pr-4">Univ / School</th>
                                     <th className="pb-6 pr-4">Subjects</th>
                                     <th className="pb-6 text-right">Action</th>
                                  </tr>
                               </thead>
                               <tbody className="divide-y divide-school-ink/5">
                                  {formData.education_qualifications?.map((edu, i) => (
                                    <tr key={i} className="group">
                                      <td className="py-4 pr-4">
                                        <input 
                                          className="w-full bg-white rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-school-gold/20 outline-none border border-school-ink/5"
                                          value={edu.examination}
                                          onChange={e => {
                                            const newEdu = [...(formData.education_qualifications || [])];
                                            newEdu[i].examination = e.target.value;
                                            setFormData({...formData, education_qualifications: newEdu});
                                          }}
                                        />
                                      </td>
                                      <td className="py-4 pr-4">
                                        <input 
                                          className="w-20 bg-white rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-school-gold/20 outline-none border border-school-ink/5"
                                          value={edu.percentage}
                                          onChange={e => {
                                            const newEdu = [...(formData.education_qualifications || [])];
                                            newEdu[i].percentage = e.target.value;
                                            setFormData({...formData, education_qualifications: newEdu});
                                          }}
                                        />
                                      </td>
                                      <td className="py-4 pr-4">
                                        <input 
                                          className="w-24 bg-white rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-school-gold/20 outline-none border border-school-ink/5"
                                          value={edu.year}
                                          onChange={e => {
                                            const newEdu = [...(formData.education_qualifications || [])];
                                            newEdu[i].year = e.target.value;
                                            setFormData({...formData, education_qualifications: newEdu});
                                          }}
                                        />
                                      </td>
                                      <td className="py-4 pr-4">
                                        <input 
                                          className="w-full bg-white rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-school-gold/20 outline-none border border-school-ink/5"
                                          value={edu.institution}
                                          onChange={e => {
                                            const newEdu = [...(formData.education_qualifications || [])];
                                            newEdu[i].institution = e.target.value;
                                            setFormData({...formData, education_qualifications: newEdu});
                                          }}
                                        />
                                      </td>
                                      <td className="py-4 pr-4">
                                        <input 
                                          className="w-full bg-white rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-school-gold/20 outline-none border border-school-ink/5"
                                          value={edu.subjects}
                                          onChange={e => {
                                            const newEdu = [...(formData.education_qualifications || [])];
                                            newEdu[i].subjects = e.target.value;
                                            setFormData({...formData, education_qualifications: newEdu});
                                          }}
                                        />
                                      </td>
                                      <td className="py-4 text-right">
                                        <button 
                                          type="button"
                                          onClick={() => removeEdu(i)}
                                          className="p-3 text-school-ink/20 hover:text-red-500 transition-colors"
                                        >
                                          <Trash2 size={18} />
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                               </tbody>
                            </table>
                            {!formData.education_qualifications?.length && (
                              <div className="py-12 text-center">
                                <p className="text-sm font-bold text-school-ink/20 uppercase tracking-widest italic">No records added. Click '+' to start.</p>
                              </div>
                            )}
                         </div>
                      </div>

                      {/* Section 4: Teaching Experience Table */}
                      <div className="space-y-8">
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-8 h-8 bg-school-ink text-white rounded-full flex items-center justify-center text-xs font-black italic">04</div>
                              <h4 className="text-2xl font-black text-school-ink uppercase tracking-tighter italic">Teaching Experience (if any)</h4>
                            </div>
                            <button 
                              type="button"
                              onClick={addExp}
                              className="bg-school-gold text-school-navy p-3 rounded-full hover:scale-110 transition-all shadow-xl"
                            >
                              <Plus size={20} />
                            </button>
                         </div>

                         <div className="overflow-x-auto rounded-[40px] border border-school-ink/5 bg-[#F8F9FA] p-8">
                            <table className="w-full border-collapse">
                               <thead>
                                  <tr className="text-[10px] font-black uppercase tracking-widest text-school-ink/30 border-b border-school-ink/5 text-left italic">
                                     <th className="pb-6 pr-4">From (Year)</th>
                                     <th className="pb-6 pr-4">To (Year)</th>
                                     <th className="pb-6 pr-4">Institution Name</th>
                                     <th className="pb-6 pr-4">Subjects Taught</th>
                                     <th className="pb-6 pr-4">Classes</th>
                                     <th className="pb-6 text-right">Action</th>
                                  </tr>
                               </thead>
                               <tbody className="divide-y divide-school-ink/5">
                                  {formData.teaching_experience?.map((exp, i) => (
                                    <tr key={i} className="group">
                                      <td className="py-4 pr-4">
                                        <input 
                                          className="w-24 bg-white rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-school-gold/20 outline-none border border-school-ink/5"
                                          placeholder="e.g. 2018"
                                          value={exp.fromYear}
                                          onChange={e => {
                                            const newExp = [...(formData.teaching_experience || [])];
                                            newExp[i].fromYear = e.target.value;
                                            setFormData({...formData, teaching_experience: newExp});
                                          }}
                                        />
                                      </td>
                                      <td className="py-4 pr-4">
                                        <input 
                                          className="w-24 bg-white rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-school-gold/20 outline-none border border-school-ink/5"
                                          placeholder="e.g. 2022"
                                          value={exp.toYear}
                                          onChange={e => {
                                            const newExp = [...(formData.teaching_experience || [])];
                                            newExp[i].toYear = e.target.value;
                                            setFormData({...formData, teaching_experience: newExp});
                                          }}
                                        />
                                      </td>
                                      <td className="py-4 pr-4">
                                        <input 
                                          className="w-full bg-white rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-school-gold/20 outline-none border border-school-ink/5"
                                          value={exp.institution}
                                          onChange={e => {
                                            const newExp = [...(formData.teaching_experience || [])];
                                            newExp[i].institution = e.target.value;
                                            setFormData({...formData, teaching_experience: newExp});
                                          }}
                                        />
                                      </td>
                                      <td className="py-4 pr-4">
                                        <input 
                                          className="w-full bg-white rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-school-gold/20 outline-none border border-school-ink/5"
                                          value={exp.subjects}
                                          onChange={e => {
                                            const newExp = [...(formData.teaching_experience || [])];
                                            newExp[i].subjects = e.target.value;
                                            setFormData({...formData, teaching_experience: newExp});
                                          }}
                                        />
                                      </td>
                                      <td className="py-4 pr-4">
                                        <input 
                                          className="w-full bg-white rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-school-gold/20 outline-none border border-school-ink/5"
                                          value={exp.classes}
                                          onChange={e => {
                                            const newExp = [...(formData.teaching_experience || [])];
                                            newExp[i].classes = e.target.value;
                                            setFormData({...formData, teaching_experience: newExp});
                                          }}
                                        />
                                      </td>
                                      <td className="py-4 text-right">
                                        <button 
                                          type="button"
                                          onClick={() => removeExp(i)}
                                          className="p-3 text-school-ink/20 hover:text-red-500 transition-colors"
                                        >
                                          <Trash2 size={18} />
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                               </tbody>
                            </table>
                            {!formData.teaching_experience?.length && (
                              <div className="py-12 text-center">
                                <p className="text-sm font-bold text-school-ink/20 uppercase tracking-widest italic">No service record added.</p>
                              </div>
                            )}
                         </div>
                      </div>

                      {/* Section 5: Achievements Table */}
                      <div className="space-y-8">
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-8 h-8 bg-school-ink text-white rounded-full flex items-center justify-center text-xs font-black italic">05</div>
                              <h4 className="text-2xl font-black text-school-ink uppercase tracking-tighter italic">Honors & Achievements</h4>
                            </div>
                            <button 
                              type="button"
                              onClick={addAchievement}
                              className="bg-school-gold text-school-navy p-3 rounded-full hover:scale-110 transition-all shadow-xl"
                            >
                              <Plus size={20} />
                            </button>
                         </div>

                         <div className="overflow-x-auto rounded-[40px] border border-school-ink/5 bg-[#F8F9FA] p-8">
                            <table className="w-full border-collapse">
                               <thead>
                                  <tr className="text-[10px] font-black uppercase tracking-widest text-school-ink/30 border-b border-school-ink/5 text-left italic">
                                     <th className="pb-6 pr-4">Year</th>
                                     <th className="pb-6 pr-4">Field</th>
                                     <th className="pb-6 pr-4">Brief Description</th>
                                     <th className="pb-6 text-right">Action</th>
                                  </tr>
                               </thead>
                               <tbody className="divide-y divide-school-ink/5">
                                  {formData.achievements?.map((ach, i) => (
                                    <tr key={i} className="group">
                                      <td className="py-4 pr-4">
                                        <input 
                                          className="w-24 bg-white rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-school-gold/20 outline-none border border-school-ink/5"
                                          placeholder="Year"
                                          value={ach.year}
                                          onChange={e => {
                                            const newAch = [...(formData.achievements || [])];
                                            newAch[i].year = e.target.value;
                                            setFormData({...formData, achievements: newAch});
                                          }}
                                        />
                                      </td>
                                      <td className="py-4 pr-4">
                                        <input 
                                          className="w-full bg-white rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-school-gold/20 outline-none border border-school-ink/5"
                                          placeholder="e.g. Sports, Science"
                                          value={ach.field}
                                          onChange={e => {
                                            const newAch = [...(formData.achievements || [])];
                                            newAch[i].field = e.target.value;
                                            setFormData({...formData, achievements: newAch});
                                          }}
                                        />
                                      </td>
                                      <td className="py-4 pr-4">
                                        <input 
                                          className="w-full bg-white rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-school-gold/20 outline-none border border-school-ink/5"
                                          value={ach.description}
                                          onChange={e => {
                                            const newAch = [...(formData.achievements || [])];
                                            newAch[i].description = e.target.value;
                                            setFormData({...formData, achievements: newAch});
                                          }}
                                        />
                                      </td>
                                      <td className="py-4 text-right">
                                        <button 
                                          type="button"
                                          onClick={() => removeAchievement(i)}
                                          className="p-3 text-school-ink/20 hover:text-red-500 transition-colors"
                                        >
                                          <Trash2 size={18} />
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                               </tbody>
                            </table>
                            {!formData.achievements?.length && (
                              <div className="py-12 text-center">
                                <p className="text-sm font-bold text-school-ink/20 uppercase tracking-widest italic">No record added.</p>
                              </div>
                            )}
                         </div>
                      </div>

                      {/* Section 6: Subjective Info */}
                      <div className="space-y-12">
                         <div className="flex items-center gap-4">
                          <div className="w-8 h-8 bg-school-ink text-white rounded-full flex items-center justify-center text-xs font-black italic">06</div>
                          <h4 className="text-2xl font-black text-school-ink uppercase tracking-tighter italic">Professional Narratives</h4>
                        </div>

                        <div className="space-y-12">
                           <div className="space-y-4">
                              <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/30 ml-2">Interests / Hobbies</label>
                              <textarea 
                                className="w-full bg-[#F8F9FA] rounded-3xl py-6 px-10 text-school-ink font-bold border border-school-ink/5 focus:ring-4 focus:ring-school-gold/10 transition-all outline-none h-32 resize-none"
                                value={formData.interests}
                                onChange={e => setFormData({...formData, interests: e.target.value})}
                              />
                           </div>
                           <div className="space-y-4">
                              <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/30 ml-2">Key Responsibilities Handled</label>
                              <textarea 
                                className="w-full bg-[#F8F9FA] rounded-3xl py-6 px-10 text-school-ink font-bold border border-school-ink/5 focus:ring-4 focus:ring-school-gold/10 transition-all outline-none h-48 resize-none"
                                value={formData.responsibilities_handled}
                                onChange={e => setFormData({...formData, responsibilities_handled: e.target.value})}
                              />
                           </div>
                           <div className="space-y-4">
                              <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/30 ml-2">Statement of Purpose (SOP)</label>
                              <textarea 
                                className="w-full bg-[#F8F9FA] rounded-3xl py-6 px-10 text-school-ink font-bold border border-school-ink/5 focus:ring-4 focus:ring-school-gold/10 transition-all outline-none h-64 resize-none"
                                value={formData.statement_of_purpose}
                                onChange={e => setFormData({...formData, statement_of_purpose: e.target.value})}
                              />
                           </div>
                           <div className="space-y-4">
                              <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/30 ml-2">Work Experience Other Than Teaching</label>
                              <textarea 
                                className="w-full bg-[#F8F9FA] rounded-3xl py-6 px-10 text-school-ink font-bold border border-school-ink/5 focus:ring-4 focus:ring-school-gold/10 transition-all outline-none h-48 resize-none"
                                value={formData.other_experience}
                                onChange={e => setFormData({...formData, other_experience: e.target.value})}
                              />
                           </div>
                        </div>
                      </div>

                       {/* Section 7: Declaration */}
                       <div className="pt-12 border-t border-school-ink/5 space-y-8">
                          <div className="flex items-start gap-6 bg-school-paper p-10 rounded-[40px] border border-school-gold/20 shadow-xl shadow-school-gold/5">
                             <div className="shrink-0 mt-1">
                                <input 
                                  type="checkbox"
                                  required
                                  id="declaration"
                                  className="w-6 h-6 rounded-lg text-school-navy focus:ring-school-gold border-school-ink/10 cursor-pointer"
                                  checked={formData.declaration_accepted}
                                  onChange={e => setFormData({...formData, declaration_accepted: e.target.checked})}
                                />
                             </div>
                             <label htmlFor="declaration" className="cursor-pointer">
                                <h5 className="text-[10px] font-black uppercase tracking-widest text-school-navy mb-3 flex items-center gap-2">
                                   <ShieldCheck size={14} className="text-school-accent"/> Official Declaration
                                </h5>
                                <p className="text-xs text-school-ink/60 leading-relaxed italic">
                                   I hereby solemnly declare and affirm that all the information provided in this application is true, complete and correct to the best of my knowledge and belief. I understand that in the event of any information being found false or incorrect at any stage, my candidature/appointment shall be liable to summary cancellation/termination without any notice or compensation. 
                                </p>
                             </label>
                          </div>
                          
                          <div className="flex items-center gap-4 px-10 text-[10px] font-bold text-school-ink/30 italic">
                             <AlertCircle size={14} />
                             <span>Submission will automatically capture your machine's ID for security: {formData.user_ip || 'Fetching...'}</span>
                          </div>
                       </div>

                      {submitStatus === 'error' && (
                        <div className="bg-red-50 text-red-600 p-8 rounded-[40px] border border-red-100 flex items-center gap-6 shadow-2xl shadow-red-500/10">
                          <CheckCircle2 size={32} className="rotate-45" />
                          <div>
                            <p className="text-lg font-black uppercase tracking-tighter">Transmission Error</p>
                            <p className="text-sm opacity-60">{errorMsg}</p>
                          </div>
                        </div>
                      )}

                      <div className="pt-12 border-t border-school-ink/5 flex justify-end">
                        <button 
                          disabled={isSubmitting}
                          className="group relative inline-flex items-center gap-8 px-16 py-10 bg-school-navy text-white rounded-full font-black uppercase tracking-[0.3em] shadow-3xl hover:bg-school-gold hover:text-school-navy transition-all active:scale-95 disabled:bg-slate-300 disabled:cursor-not-allowed overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-white/10 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                          <span className="relative z-10 flex items-center gap-6">
                            {isSubmitting ? (
                              <>Syncing with Server <Loader2 className="animate-spin" /></>
                            ) : (
                              <>Submit Final Application <Send size={20} /></>
                            )}
                          </span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Current Vacancies Info Loop */}
        {jobs.length > 0 && (
          <section className="py-24 max-w-7xl mx-auto px-6">
             <div className="flex items-center justify-between mb-16">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-school-gold block mb-4">Active Rosters</span>
                  <h2 className="text-5xl font-black text-school-ink tracking-tighter uppercase leading-none italic">Current <span className="text-school-gold">Openings.</span></h2>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                {jobs.map((job) => (
                  <div key={job.id} className="p-8 rounded-[40px] bg-white border border-school-ink/5 hover:shadow-2xl transition-all duration-500 group">
                    <div className="flex items-center gap-6 mb-6">
                      <div className="w-14 h-14 bg-school-navy rounded-2xl flex items-center justify-center text-white group-hover:bg-school-gold group-hover:text-school-navy transition-all">
                        <Briefcase size={24} />
                      </div>
                      <h4 className="text-xl font-black text-school-ink uppercase tracking-tight italic">{job.title}</h4>
                    </div>
                    {job.attachmentUrl && (
                      <a 
                        href={job.attachmentUrl} 
                        target="_blank" 
                        className="text-[10px] font-black uppercase tracking-widest text-school-gold flex items-center gap-2 hover:underline"
                      >
                        Institutional PDF <ArrowRight size={12} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
          </section>
        )}
      </div>
    </Layout>
  );
};

export default CareersPage;

