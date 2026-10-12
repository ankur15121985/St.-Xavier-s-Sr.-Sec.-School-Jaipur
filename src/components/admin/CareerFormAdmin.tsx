import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Trash2, 
  Sparkles, 
  User, 
  GraduationCap, 
  Briefcase, 
  Trophy, 
  Download,
  RotateCcw,
  Check,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { CareerApplication } from '../../types';
import { generateCareerApplicationPDF } from '../../services/careerPdfService';
import { supabaseService } from '../../lib/supabaseService';
import { careerService } from '../../services/careerService';

interface CareerFormAdminProps {
  onApplicationCreated?: (newApp: CareerApplication) => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const CareerFormAdmin: React.FC<CareerFormAdminProps> = ({ 
  onApplicationCreated, 
  showToast 
}) => {
  const initialFormState: CareerApplication = {
    category: 'Teacher',
    teacher_category: 'PGT (English)',
    full_name: '',
    parent_spouse_name: '',
    mobile_number: '',
    email: '',
    gender: 'Male',
    dob: '',
    aadhar_number: '',
    address: '',
    photo_url: '',
    declaration_accepted: true,
    major_subject: '',
    minor_subject_1: '',
    minor_subject_2: '',
    salary_expected: '',
    tet_details: '',
    interests: '',
    responsibilities_handled: '',
    statement_of_purpose: '',
    other_experience: '',
    education_qualifications: [
      { examination: 'Post Graduation (M.A./M.Sc)', percentage: '', year: '', institution: '', subjects: '' },
      { examination: 'Graduation (B.A./B.Sc/B.Ed)', percentage: '', year: '', institution: '', subjects: '' }
    ],
    teaching_experience: [
      { fromYear: '2021', toYear: '2025', institution: '', subjects: '', classes: '' }
    ],
    achievements: [
      { year: '2024', field: 'Excellence in Academics', description: '' }
    ]
  };

  const [formData, setFormData] = useState<CareerApplication>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [photoError, setPhotoError] = useState('');

  // Handle Photo Upload: Reads file as clean Data URL and uploads to server
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setPhotoError('');

    if (file.size > 2 * 1024 * 1024) {
      setPhotoError('Photo size exceeds 2MB limit. Please choose a smaller image.');
      showToast('Image size exceeds 2MB limit', 'error');
      return;
    }

    try {
      setIsUploadingPhoto(true);

      // 1. Read locally as Base64 Data URL first for instant preview and fail-safe embedding
      const reader = new FileReader();
      const dataUrlPromise = new Promise<string>((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const localDataUrl = await dataUrlPromise;

      // 2. Also try uploading via server API /api/upload for persistent URL
      let finalPhotoUrl = localDataUrl;
      try {
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);
        const token = localStorage.getItem('school_admin_token');
        const res = await fetch('/api/upload?section=career_photos', {
          method: 'POST',
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
          body: uploadFormData
        });
        if (res.ok) {
          const resData = await res.json();
          if (resData.url) {
            finalPhotoUrl = resData.url;
          }
        }
      } catch (uploadErr) {
        console.warn('[Admin Career Form] Server upload fallback to data URL:', uploadErr);
      }

      setFormData(prev => ({ ...prev, photo_url: finalPhotoUrl }));
      showToast('Applicant photo uploaded successfully', 'success');
    } catch (err: any) {
      console.error('Photo upload failed:', err);
      setPhotoError('Failed to read photo file. Please try another image.');
      showToast('Failed to process image file', 'error');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Education Helpers
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

  const updateEdu = (index: number, field: string, val: string) => {
    setFormData(prev => ({
      ...prev,
      education_qualifications: prev.education_qualifications?.map((item, i) => 
        i === index ? { ...item, [field]: val } : item
      )
    }));
  };

  // Experience Helpers
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

  const updateExp = (index: number, field: string, val: string) => {
    setFormData(prev => ({
      ...prev,
      teaching_experience: prev.teaching_experience?.map((item, i) => 
        i === index ? { ...item, [field]: val } : item
      )
    }));
  };

  // Achievements Helpers
  const addAch = () => {
    setFormData(prev => ({
      ...prev,
      achievements: [
        ...(prev.achievements || []),
        { year: new Date().getFullYear().toString(), field: '', description: '' }
      ]
    }));
  };

  const removeAch = (index: number) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements?.filter((_, i) => i !== index)
    }));
  };

  const updateAch = (index: number, field: string, val: string) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements?.map((item, i) => 
        i === index ? { ...item, [field]: val } : item
      )
    }));
  };

  // Generate Official Application Number
  const generateAppNo = () => {
    const year = new Date().getFullYear();
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `STXJ/${year}/${rand}`;
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name || !formData.email || !formData.mobile_number) {
      showToast('Please provide candidate name, email, and mobile number', 'error');
      return;
    }

    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      const appNo = formData.application_no || generateAppNo();
      const candidateId = `app-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const newApplication: CareerApplication = {
        ...formData,
        id: candidateId,
        application_no: appNo,
        created_at: new Date().toISOString(),
        status: 'Received',
        user_ip: 'Admin Portal (Internal Registration)'
      };

      // 1. Save to Supabase remote
      try {
        await careerService.submitApplication(newApplication);
      } catch (subErr) {
        console.warn('[Admin Career Form] Supabase submit warning:', subErr);
      }

      // 2. Save to SQLite backend via /api/save
      await supabaseService.saveItem('career_applications' as any, newApplication);

      setSubmitSuccess(true);
      showToast(`Candidate ${formData.full_name} registered successfully with App ID ${appNo}`, 'success');

      if (onApplicationCreated) {
        onApplicationCreated(newApplication);
      }

      // Automatically offer PDF download
      try {
        const doc = await generateCareerApplicationPDF(newApplication);
        doc.save(`Application_${appNo.replace(/\//g, '_')}_${formData.full_name.replace(/\s+/g, '_')}.pdf`);
      } catch (pdfErr) {
        console.warn('[Admin Career Form] Auto-download PDF error:', pdfErr);
      }

      // Reset form
      setFormData({
        ...initialFormState,
        application_no: generateAppNo()
      });
    } catch (err: any) {
      console.error('Error submitting career application in admin:', err);
      showToast(err.message || 'Failed to submit candidate application', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Preview & Download Application PDF
  const handleDownloadPDF = async () => {
    if (!formData.full_name) {
      showToast('Please enter candidate name to preview the PDF dossier', 'error');
      return;
    }

    setIsGeneratingPdf(true);
    try {
      const previewApp: CareerApplication = {
        ...formData,
        application_no: formData.application_no || generateAppNo(),
        created_at: new Date().toISOString(),
        status: 'Draft / Preview',
        user_ip: 'Admin Portal Verification'
      };

      const doc = await generateCareerApplicationPDF(previewApp);
      const filename = `Candidate_Dossier_${previewApp.full_name.replace(/\s+/g, '_')}.pdf`;
      doc.save(filename);
      showToast(`Dossier PDF downloaded for ${formData.full_name}`, 'success');
    } catch (err: any) {
      console.error('Failed to generate preview PDF:', err);
      showToast(err.message || 'PDF Generation failed', 'error');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="bg-white rounded-[32px] md:rounded-[48px] border border-school-ink/10 shadow-xl overflow-hidden">
      {/* Form Top Banner */}
      <div className="bg-school-navy p-8 md:p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-school-gold/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-school-gold/20 border border-school-gold/30 rounded-full text-school-gold text-[10px] font-black uppercase tracking-widest">
              <Sparkles size={12} /> Institutional Talent Registration
            </div>
            <h3 className="text-2xl md:text-4xl font-black italic tracking-tight text-white uppercase">
              Career Application <span className="text-school-gold">Form.</span>
            </h3>
            <p className="text-white/60 text-xs md:text-sm font-medium max-w-xl">
              Complete institutional registration form for candidates. Use this form to enter offline applicant profiles, review form structure, or generate verified PDF dossiers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={isGeneratingPdf}
              className="px-6 py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg transition-all hover:scale-105 disabled:opacity-50"
              title="Generate PDF with applicant photo and all details"
            >
              {isGeneratingPdf ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
              Preview Dossier (PDF)
            </button>
            <button
              type="button"
              onClick={() => setFormData(initialFormState)}
              className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all"
            >
              <RotateCcw size={14} /> Clear Form
            </button>
          </div>
        </div>
      </div>

      {submitSuccess && (
        <div className="m-6 md:m-8 p-6 bg-emerald-50 border border-emerald-200 rounded-3xl flex items-center gap-4 text-emerald-800">
          <CheckCircle2 size={24} className="text-emerald-600 shrink-0" />
          <div className="flex-1">
            <h4 className="font-black text-sm uppercase tracking-wide">Candidate Registered Successfully!</h4>
            <p className="text-xs text-emerald-700 font-medium mt-0.5">The application was stored in the Talent Registry and official PDF dossier generated.</p>
          </div>
          <button 
            type="button"
            onClick={() => setSubmitSuccess(false)}
            className="text-xs font-black uppercase tracking-widest px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Interactive Form */}
      <form onSubmit={handleSubmit} className="p-6 md:p-12 space-y-12">
        {/* 1. Identity & Photograph Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-school-ink/10">
            <div className="w-8 h-8 bg-school-navy text-school-gold rounded-xl flex items-center justify-center font-black text-xs">01</div>
            <div>
              <h4 className="text-lg font-black text-school-navy uppercase tracking-tight">Identity & Applicant Photograph</h4>
              <p className="text-[10px] font-bold text-school-ink/40 uppercase tracking-widest">Candidate portrait & official credentials</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Photo Upload Box */}
            <div className="lg:col-span-1 bg-school-paper rounded-3xl p-6 border border-school-ink/5 flex flex-col items-center justify-center text-center space-y-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-school-navy/60">Applicant Photograph</span>
              
              <div className="relative w-40 h-52 bg-white rounded-2xl border-2 border-dashed border-school-ink/20 overflow-hidden flex items-center justify-center shadow-inner group">
                {formData.photo_url ? (
                  <>
                    <img 
                      src={formData.photo_url} 
                      alt="Candidate Portrait" 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-school-navy/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2 text-white">
                      <span className="text-[9px] font-black uppercase tracking-widest">Replace Photo</span>
                      <button 
                        type="button" 
                        onClick={() => setFormData(prev => ({ ...prev, photo_url: '' }))}
                        className="px-3 py-1 bg-rose-600 rounded-lg text-[9px] font-bold uppercase hover:bg-rose-700"
                      >
                        Remove
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center p-4 text-school-ink/30">
                    <User size={48} className="stroke-[1.5] mb-2" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-school-ink/40">Passport Photo</span>
                    <span className="text-[8px] text-school-ink/30 mt-1">3.5 x 4.5 cm</span>
                  </div>
                )}

                {isUploadingPhoto && (
                  <div className="absolute inset-0 bg-school-navy/80 flex flex-col items-center justify-center text-white text-xs gap-2">
                    <Loader2 size={24} className="animate-spin text-school-gold" />
                    <span>Processing photo...</span>
                  </div>
                )}
              </div>

              <div className="w-full space-y-2">
                <label className="w-full py-3 bg-school-navy hover:bg-school-accent text-white rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all shadow-md flex items-center justify-center gap-2">
                  <Upload size={14} />
                  {formData.photo_url ? 'Change Photograph' : 'Upload Candidate Photo'}
                  <input 
                    type="file" 
                    accept="image/png,image/jpeg,image/jpg,image/webp" 
                    onChange={handlePhotoUpload} 
                    className="hidden" 
                    disabled={isUploadingPhoto} 
                  />
                </label>
                {formData.photo_url && (
                  <p className="text-[9px] font-bold text-emerald-600 flex items-center justify-center gap-1">
                    <CheckCircle2 size={12} /> Image ready for PDF generation
                  </p>
                )}
                {photoError && (
                  <p className="text-[9px] font-bold text-rose-500">{photoError}</p>
                )}
              </div>
            </div>

            {/* Personal Details Fields */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/50">Application Category *</label>
                <select 
                  value={formData.category} 
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 bg-school-paper rounded-2xl border border-school-ink/10 text-sm font-bold text-school-navy outline-none focus:ring-2 focus:ring-school-accent/20"
                >
                  <option value="Teacher">Teacher</option>
                  <option value="Administrative Staff">Administrative Staff</option>
                  <option value="Supporting Staff">Supporting Staff</option>
                  <option value="Sports Coach">Sports Coach</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {formData.category === 'Teacher' && (
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/50">Teaching Level / Stream</label>
                  <select 
                    value={formData.teacher_category || ''} 
                    onChange={e => setFormData({ ...formData, teacher_category: e.target.value })}
                    className="w-full px-4 py-3 bg-school-paper rounded-2xl border border-school-ink/10 text-sm font-bold text-school-navy outline-none focus:ring-2 focus:ring-school-accent/20"
                  >
                    <option value="PGT (English)">PGT (English)</option>
                    <option value="PGT (Mathematics)">PGT (Mathematics)</option>
                    <option value="PGT (Physics)">PGT (Physics)</option>
                    <option value="PGT (Chemistry)">PGT (Chemistry)</option>
                    <option value="PGT (Biology)">PGT (Biology)</option>
                    <option value="PGT (Commerce / Accounts)">PGT (Commerce / Accounts)</option>
                    <option value="PGT (Economics)">PGT (Economics)</option>
                    <option value="PGT (Computer Science / IP)">PGT (Computer Science / IP)</option>
                    <option value="TGT (Hindi)">TGT (Hindi)</option>
                    <option value="TGT (English)">TGT (English)</option>
                    <option value="TGT (Mathematics)">TGT (Mathematics)</option>
                    <option value="TGT (Science)">TGT (Science)</option>
                    <option value="TGT (Social Studies)">TGT (Social Studies)</option>
                    <option value="TGT (Sanskrit)">TGT (Sanskrit)</option>
                    <option value="PRT">PRT (Primary Teacher)</option>
                    <option value="Pre-Primary / Nursery">Pre-Primary / Nursery</option>
                    <option value="Physical Education">Physical Education (PTI)</option>
                    <option value="Art & Craft">Art & Craft</option>
                    <option value="Music & Dance">Music & Dance</option>
                  </select>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/50">Full Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Dr. Rajesh Sharma" 
                  value={formData.full_name} 
                  onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-4 py-3 bg-school-paper rounded-2xl border border-school-ink/10 text-sm font-bold text-school-navy outline-none focus:ring-2 focus:ring-school-accent/20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/50">Parent / Spouse Name</label>
                <input 
                  type="text" 
                  placeholder="Guardian or Spouse Name" 
                  value={formData.parent_spouse_name} 
                  onChange={e => setFormData({ ...formData, parent_spouse_name: e.target.value })}
                  className="w-full px-4 py-3 bg-school-paper rounded-2xl border border-school-ink/10 text-sm font-bold text-school-navy outline-none focus:ring-2 focus:ring-school-accent/20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/50">Gender</label>
                <select 
                  value={formData.gender} 
                  onChange={e => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-4 py-3 bg-school-paper rounded-2xl border border-school-ink/10 text-sm font-bold text-school-navy outline-none focus:ring-2 focus:ring-school-accent/20"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/50">Date of Birth</label>
                <input 
                  type="date" 
                  value={formData.dob} 
                  onChange={e => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full px-4 py-3 bg-school-paper rounded-2xl border border-school-ink/10 text-sm font-bold text-school-navy outline-none focus:ring-2 focus:ring-school-accent/20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/50">Email Address *</label>
                <input 
                  type="email" 
                  required
                  placeholder="candidate@example.com" 
                  value={formData.email} 
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-school-paper rounded-2xl border border-school-ink/10 text-sm font-bold text-school-navy outline-none focus:ring-2 focus:ring-school-accent/20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/50">Mobile Number *</label>
                <input 
                  type="tel" 
                  required
                  placeholder="+91 98765 43210" 
                  value={formData.mobile_number} 
                  onChange={e => setFormData({ ...formData, mobile_number: e.target.value })}
                  className="w-full px-4 py-3 bg-school-paper rounded-2xl border border-school-ink/10 text-sm font-bold text-school-navy outline-none focus:ring-2 focus:ring-school-accent/20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/50">Aadhar Card Number</label>
                <input 
                  type="text" 
                  placeholder="12-digit UIDAI number" 
                  value={formData.aadhar_number} 
                  onChange={e => setFormData({ ...formData, aadhar_number: e.target.value })}
                  className="w-full px-4 py-3 bg-school-paper rounded-2xl border border-school-ink/10 text-sm font-bold text-school-navy outline-none focus:ring-2 focus:ring-school-accent/20"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/50">Permanent Address</label>
                <textarea 
                  rows={2}
                  placeholder="House / Street, Colony, City, State, PIN code" 
                  value={formData.address} 
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-3 bg-school-paper rounded-2xl border border-school-ink/10 text-sm font-bold text-school-navy outline-none focus:ring-2 focus:ring-school-accent/20"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Professional Credentials */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-school-ink/10">
            <div className="w-8 h-8 bg-school-navy text-school-gold rounded-xl flex items-center justify-center font-black text-xs">02</div>
            <div>
              <h4 className="text-lg font-black text-school-navy uppercase tracking-tight">Professional Specialization & Terms</h4>
              <p className="text-[10px] font-bold text-school-ink/40 uppercase tracking-widest">Subject knowledge and qualification eligibility</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/50">Major Subject / Specialization</label>
              <input 
                type="text" 
                placeholder="e.g. Mathematics / Physics" 
                value={formData.major_subject} 
                onChange={e => setFormData({ ...formData, major_subject: e.target.value })}
                className="w-full px-4 py-3 bg-school-paper rounded-2xl border border-school-ink/10 text-sm font-bold text-school-navy outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/50">Minor Subject 1</label>
              <input 
                type="text" 
                placeholder="e.g. Statistics" 
                value={formData.minor_subject_1} 
                onChange={e => setFormData({ ...formData, minor_subject_1: e.target.value })}
                className="w-full px-4 py-3 bg-school-paper rounded-2xl border border-school-ink/10 text-sm font-bold text-school-navy outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/50">Minor Subject 2</label>
              <input 
                type="text" 
                placeholder="e.g. Computer Science" 
                value={formData.minor_subject_2} 
                onChange={e => setFormData({ ...formData, minor_subject_2: e.target.value })}
                className="w-full px-4 py-3 bg-school-paper rounded-2xl border border-school-ink/10 text-sm font-bold text-school-navy outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/50">Expected Salary (Per Month / Annual)</label>
              <input 
                type="text" 
                placeholder="e.g. As per CBSE / 7th Pay Scales" 
                value={formData.salary_expected} 
                onChange={e => setFormData({ ...formData, salary_expected: e.target.value })}
                className="w-full px-4 py-3 bg-school-paper rounded-2xl border border-school-ink/10 text-sm font-bold text-school-navy outline-none"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/50">TET / CTET / State Eligibility Exam Details</label>
              <input 
                type="text" 
                placeholder="e.g. CTET Paper II Qualified (Roll No: 1234567, Score: 112/150)" 
                value={formData.tet_details} 
                onChange={e => setFormData({ ...formData, tet_details: e.target.value })}
                className="w-full px-4 py-3 bg-school-paper rounded-2xl border border-school-ink/10 text-sm font-bold text-school-navy outline-none"
              />
            </div>
          </div>
        </div>

        {/* 3. Academic Qualifications Table */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-school-ink/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-school-navy text-school-gold rounded-xl flex items-center justify-center font-black text-xs">03</div>
              <div>
                <h4 className="text-lg font-black text-school-navy uppercase tracking-tight">Academic Qualifications</h4>
                <p className="text-[10px] font-bold text-school-ink/40 uppercase tracking-widest">Degrees, certifications, and boards</p>
              </div>
            </div>
            <button 
              type="button" 
              onClick={addEdu} 
              className="px-4 py-2 bg-school-navy text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 hover:bg-school-accent transition-all"
            >
              <Plus size={14} /> Add Degree / Exam
            </button>
          </div>

          <div className="space-y-3">
            {formData.education_qualifications?.map((edu, idx) => (
              <div key={idx} className="p-4 bg-school-paper rounded-2xl border border-school-ink/5 grid grid-cols-1 md:grid-cols-6 gap-3 items-center">
                <div className="md:col-span-2">
                  <input 
                    placeholder="Examination / Degree" 
                    value={edu.examination} 
                    onChange={e => updateEdu(idx, 'examination', e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-school-ink/10 text-xs font-bold text-school-navy"
                  />
                </div>
                <div>
                  <input 
                    placeholder="Institution / Board" 
                    value={edu.institution} 
                    onChange={e => updateEdu(idx, 'institution', e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-school-ink/10 text-xs font-bold text-school-navy"
                  />
                </div>
                <div>
                  <input 
                    placeholder="Year" 
                    value={edu.year} 
                    onChange={e => updateEdu(idx, 'year', e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-school-ink/10 text-xs font-bold text-school-navy"
                  />
                </div>
                <div>
                  <input 
                    placeholder="Marks %" 
                    value={edu.percentage} 
                    onChange={e => updateEdu(idx, 'percentage', e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-school-ink/10 text-xs font-bold text-school-navy"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    placeholder="Subjects" 
                    value={edu.subjects} 
                    onChange={e => updateEdu(idx, 'subjects', e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-school-ink/10 text-xs font-bold text-school-navy"
                  />
                  <button 
                    type="button" 
                    onClick={() => removeEdu(idx)} 
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Teaching Experience Table */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-school-ink/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-school-navy text-school-gold rounded-xl flex items-center justify-center font-black text-xs">04</div>
              <div>
                <h4 className="text-lg font-black text-school-navy uppercase tracking-tight">Teaching Experience</h4>
                <p className="text-[10px] font-bold text-school-ink/40 uppercase tracking-widest">Previous schools, classes, and subjects</p>
              </div>
            </div>
            <button 
              type="button" 
              onClick={addExp} 
              className="px-4 py-2 bg-school-navy text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 hover:bg-school-accent transition-all"
            >
              <Plus size={14} /> Add School Experience
            </button>
          </div>

          <div className="space-y-3">
            {formData.teaching_experience?.map((exp, idx) => (
              <div key={idx} className="p-4 bg-school-paper rounded-2xl border border-school-ink/5 grid grid-cols-1 md:grid-cols-6 gap-3 items-center">
                <div className="md:col-span-2">
                  <input 
                    placeholder="Institution Name" 
                    value={exp.institution} 
                    onChange={e => updateExp(idx, 'institution', e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-school-ink/10 text-xs font-bold text-school-navy"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <input 
                    placeholder="From" 
                    value={exp.fromYear} 
                    onChange={e => updateExp(idx, 'fromYear', e.target.value)}
                    className="w-1/2 px-2 py-2 bg-white rounded-xl border border-school-ink/10 text-xs font-bold text-school-navy"
                  />
                  <input 
                    placeholder="To" 
                    value={exp.toYear} 
                    onChange={e => updateExp(idx, 'toYear', e.target.value)}
                    className="w-1/2 px-2 py-2 bg-white rounded-xl border border-school-ink/10 text-xs font-bold text-school-navy"
                  />
                </div>
                <div>
                  <input 
                    placeholder="Classes Taught" 
                    value={exp.classes} 
                    onChange={e => updateExp(idx, 'classes', e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-school-ink/10 text-xs font-bold text-school-navy"
                  />
                </div>
                <div className="md:col-span-2 flex items-center gap-2">
                  <input 
                    placeholder="Subjects Handled" 
                    value={exp.subjects} 
                    onChange={e => updateExp(idx, 'subjects', e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-school-ink/10 text-xs font-bold text-school-navy"
                  />
                  <button 
                    type="button" 
                    onClick={() => removeExp(idx)} 
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Honors & Special Achievements */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-school-ink/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-school-navy text-school-gold rounded-xl flex items-center justify-center font-black text-xs">05</div>
              <div>
                <h4 className="text-lg font-black text-school-navy uppercase tracking-tight">Honors & Special Feats</h4>
                <p className="text-[10px] font-bold text-school-ink/40 uppercase tracking-widest">Awards, state recognition, publications</p>
              </div>
            </div>
            <button 
              type="button" 
              onClick={addAch} 
              className="px-4 py-2 bg-school-navy text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 hover:bg-school-accent transition-all"
            >
              <Plus size={14} /> Add Achievement
            </button>
          </div>

          <div className="space-y-3">
            {formData.achievements?.map((ach, idx) => (
              <div key={idx} className="p-4 bg-school-paper rounded-2xl border border-school-ink/5 grid grid-cols-1 md:grid-cols-6 gap-3 items-center">
                <div>
                  <input 
                    placeholder="Year" 
                    value={ach.year} 
                    onChange={e => updateAch(idx, 'year', e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-school-ink/10 text-xs font-bold text-school-navy"
                  />
                </div>
                <div className="md:col-span-2">
                  <input 
                    placeholder="Field / Category" 
                    value={ach.field} 
                    onChange={e => updateAch(idx, 'field', e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-school-ink/10 text-xs font-bold text-school-navy"
                  />
                </div>
                <div className="md:col-span-3 flex items-center gap-2">
                  <input 
                    placeholder="Detailed Description" 
                    value={ach.description} 
                    onChange={e => updateAch(idx, 'description', e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-school-ink/10 text-xs font-bold text-school-navy"
                  />
                  <button 
                    type="button" 
                    onClick={() => removeAch(idx)} 
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Institutional Narratives & SOP */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-school-ink/10">
            <div className="w-8 h-8 bg-school-navy text-school-gold rounded-xl flex items-center justify-center font-black text-xs">06</div>
            <div>
              <h4 className="text-lg font-black text-school-navy uppercase tracking-tight">Institutional Narratives & SOP</h4>
              <p className="text-[10px] font-bold text-school-ink/40 uppercase tracking-widest">Candidate perspective & philosophy</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/50">Interests & Co-Curricular Contributions</label>
              <textarea 
                rows={3}
                placeholder="Debating, Robotics, Theatre, Athletics..." 
                value={formData.interests} 
                onChange={e => setFormData({ ...formData, interests: e.target.value })}
                className="w-full px-4 py-3 bg-school-paper rounded-2xl border border-school-ink/10 text-sm font-bold text-school-navy outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/50">Responsibilities Previously Handled</label>
              <textarea 
                rows={3}
                placeholder="House master, Examination in-charge, Timetable coordinator..." 
                value={formData.responsibilities_handled} 
                onChange={e => setFormData({ ...formData, responsibilities_handled: e.target.value })}
                className="w-full px-4 py-3 bg-school-paper rounded-2xl border border-school-ink/10 text-sm font-bold text-school-navy outline-none"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/50">Statement of Purpose (Why St. Xavier's Jaipur?)</label>
              <textarea 
                rows={3}
                placeholder="Candidate's educational philosophy and reasons for joining our institutional legacy..." 
                value={formData.statement_of_purpose} 
                onChange={e => setFormData({ ...formData, statement_of_purpose: e.target.value })}
                className="w-full px-4 py-3 bg-school-paper rounded-2xl border border-school-ink/10 text-sm font-bold text-school-navy outline-none"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/50">Other Work Experience (Non-Teaching)</label>
              <input 
                type="text" 
                placeholder="Corporate, research, or counseling experience (optional)" 
                value={formData.other_experience} 
                onChange={e => setFormData({ ...formData, other_experience: e.target.value })}
                className="w-full px-4 py-3 bg-school-paper rounded-2xl border border-school-ink/10 text-sm font-bold text-school-navy outline-none"
              />
            </div>
          </div>
        </div>

        {/* Declaration and Action Buttons */}
        <div className="pt-6 border-t border-school-ink/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={formData.declaration_accepted} 
              onChange={e => setFormData({ ...formData, declaration_accepted: e.target.checked })}
              className="w-5 h-5 rounded-lg text-school-navy focus:ring-school-accent"
            />
            <span className="text-xs font-bold text-school-navy/80">
              Candidate declaration & institutional verification accepted
            </span>
          </label>

          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button 
              type="button"
              onClick={handleDownloadPDF}
              disabled={isGeneratingPdf}
              className="px-6 py-4 bg-school-paper border border-school-ink/10 text-school-navy hover:bg-school-ink/5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all"
            >
              {isGeneratingPdf ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
              Generate PDF
            </button>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1 sm:flex-none px-10 py-4 bg-school-navy hover:bg-school-accent text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin text-school-gold" />
                  Saving to Database...
                </>
              ) : (
                <>
                  <Check size={18} />
                  Submit & Save to Registry
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
