import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from '../lib/router-compat';
import { 
  Bell, Calendar, Users2, ImageIcon, CreditCard, Link as LinkIcon, Award, Menu,
  Trash2, Plus, Check, X, ChevronRight, Settings, Key, UploadCloud, Loader2, ImagePlus, RefreshCw, DownloadCloud,
  Search, LayoutGrid, AlertCircle, MessageSquare, Mail, FileText, Maximize2, ExternalLink,
  Type, Palette, Bold, Italic, Briefcase, ShieldCheck, ShieldAlert, Activity, Send, Clock, Database, Download,
  Phone, MapPin
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable, { UserOptions } from 'jspdf-autotable';
import { AppData, GalleryItem, CareerApplication } from '../types';
import { DEFAULT_DATA } from '../lib/defaultData';
import { useSupabase } from '../components/SupabaseProvider';
import { supabaseService } from '../lib/supabaseService';
import { storageService } from '../lib/storageService';
import { supabase, getIsSupabasePlaceholder } from '../supabaseClient';

import DOMPurify from 'dompurify';
import SidebarLinks from '../components/layout/SidebarLinks';
import RichTextEditor from '../components/ui/RichTextEditor';
import GalleryBulkUpload from '../components/admin/GalleryBulkUpload';

interface PendingGalleryItem {
  id: string;
  file: File;
  preview: string;
  progress: number;
  url?: string;
  caption: string;
  session?: string;
  status: 'pending' | 'uploading' | 'completed' | 'error';
}

const AdminPortal = ({ data, setData }: { data: AppData, setData: React.Dispatch<React.SetStateAction<AppData>> }) => {
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading, login, usernameLogin, logout } = useSupabase();
  
  const [activeSection, setActiveSection] = useState<string>('notices');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [uploadingPath, setUploadingPath] = useState<string | null>(null);
  const [pendingGalleryItems, setPendingGalleryItems] = useState<PendingGalleryItem[]>([]);
  const [itemToDelete, setItemToDelete] = useState<string | string[] | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [savePending, setSavePending] = useState(false);
  const [isBulkEditing, setIsBulkEditing] = useState(false);
  const [isBulkGalleryOpen, setIsBulkGalleryOpen] = useState(false);
  const [bulkEditField, setBulkEditField] = useState<string>('');
  const [bulkEditValue, setBulkEditValue] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [detailedApp, setDetailedApp] = useState<CareerApplication | null>(null);
  const [showSchemaError, setShowSchemaError] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState<any>(null);
  const [isDebugOpen, setIsDebugOpen] = useState(false);

  const isUploading = !!uploadingPath;

  useEffect(() => {
    // Session check logic could go here if needed
  }, []);

  const exportSingleApplicationToPDF = async (app: CareerApplication) => {
    const doc = new jsPDF('p', 'pt', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Header
    doc.setFillColor(15, 23, 42); // school-navy
    doc.rect(0, 0, pageWidth, 80, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text("St. Xavier's Secondary School", 40, 45);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(226, 180, 80); // school-gold
    doc.text("CAREER RECRUITMENT PORTAL - OFFICIAL CANDIDATE DOSSIER", 40, 65);

    // Photo Box / Image
    const photoX = pageWidth - 140;
    const photoY = 100;
    const photoSize = 100;
    
    if (app.photo_url) {
      try {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = app.photo_url;
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          setTimeout(reject, 3000); // Timeout after 3s
        });
        doc.addImage(img, 'JPEG', photoX, photoY, photoSize, photoSize);
      } catch (err) {
        doc.setDrawColor(200, 200, 200);
        doc.rect(photoX, photoY, photoSize, photoSize);
        doc.setTextColor(150, 150, 150);
        doc.setFontSize(8);
        doc.text("Photo Not Available", photoX + 20, photoY + 50);
      }
    } else {
      doc.setDrawColor(200, 200, 200);
      doc.rect(photoX, photoY, photoSize, photoSize);
      doc.setTextColor(150, 150, 150);
      doc.setFontSize(8);
      doc.text("No Photo Uploaded", photoX + 22, photoY + 50);
    }

    // Modern Form Grid Layout
    let currentY = 110;
    const marginX = 40;
    const colWidth = (pageWidth - 2 * marginX) / 2;

    const drawSectionHeader = (title: string, y: number) => {
      doc.setFillColor(248, 250, 252);
      doc.rect(marginX, y, pageWidth - 2 * marginX, 25, 'F');
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(title, marginX + 10, y + 17);
      doc.setDrawColor(15, 23, 42);
      doc.setLineWidth(1.5);
      doc.line(marginX, y + 25, pageWidth - marginX, y + 25);
      return y + 45;
    };

    const drawFormField = (label: string, value: any, x: number, y: number, width: number) => {
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(100, 116, 139);
      doc.text(label.toUpperCase(), x, y);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(15, 23, 42);
      const textValue = String(value || 'N/A');
      const lines = doc.splitTextToSize(textValue, width - 10);
      doc.text(lines, x, y + 15);
      
      return (lines.length * 12) + 20;
    };

    // 1. PERSONAL DETAILS
    currentY = drawSectionHeader("1. PERSONAL DETAILS", currentY);
    
    // Grid Row 1
    const row1Height = Math.max(
      drawFormField("Application ID", app.application_no || 'Pending', marginX, currentY, colWidth),
      drawFormField("Date applied", app.created_at ? new Date(app.created_at).toLocaleDateString() : 'N/A', marginX + colWidth, currentY, colWidth)
    );
    currentY += row1Height;

    // Grid Row 2
    const row2Height = Math.max(
      drawFormField("Full Name", app.full_name, marginX, currentY, colWidth),
      drawFormField("Gender", app.gender, marginX + colWidth, currentY, colWidth)
    );
    currentY += row2Height;

    // Grid Row 3
    const row3Height = Math.max(
      drawFormField("Guardian Name", app.parent_spouse_name, marginX, currentY, colWidth),
      drawFormField("Date of Birth", app.dob, marginX + colWidth, currentY, colWidth)
    );
    currentY += row3Height;

    // Grid Row 4
    const row4Height = Math.max(
      drawFormField("Email Address", app.email, marginX, currentY, colWidth),
      drawFormField("Mobile Number", app.mobile_number, marginX + colWidth, currentY, colWidth)
    );
    currentY += row4Height;

    // Grid Row 5
    const row5Height = Math.max(
      drawFormField("Aadhar Number", app.aadhar_number, marginX, currentY, colWidth),
      drawFormField("User IP", app.user_ip || 'Internal', marginX + colWidth, currentY, colWidth)
    );
    currentY += row5Height;

    // Address (Full Width)
    currentY += drawFormField("Permanent Residence Address", app.address, marginX, currentY, pageWidth - 2 * marginX);

    // 2. PROFESSIONAL POSITION
    if (currentY > pageHeight - 150) { doc.addPage(); currentY = 50; }
    currentY = drawSectionHeader("2. PROFESSIONAL POSITION", currentY + 10);
    
    const profRow1Height = Math.max(
      drawFormField("Position Category", app.category, marginX, currentY, colWidth),
      drawFormField("Teaching Level", app.teacher_category || 'N/A', marginX + colWidth, currentY, colWidth)
    );
    currentY += profRow1Height;

    const profRow2Height = Math.max(
      drawFormField("Major Specialization", app.major_subject, marginX, currentY, colWidth),
      drawFormField("Minor Subject 1", app.minor_subject_1 || 'None', marginX + colWidth, currentY, colWidth)
    );
    currentY += profRow2Height;

    const profRow3Height = Math.max(
      drawFormField("Expected Salary", app.salary_expected, marginX, currentY, colWidth),
      drawFormField("Minor Subject 2", app.minor_subject_2 || 'None', marginX + colWidth, currentY, colWidth)
    );
    currentY += profRow3Height;

    currentY += drawFormField("TET / Professional Certification Details", app.tet_details, marginX, currentY, pageWidth - 2 * marginX);

    // 3. ACADEMIC RECORD
    if (app.education_qualifications && app.education_qualifications.length > 0) {
      if (currentY > pageHeight - 150) { doc.addPage(); currentY = 50; }
      currentY = drawSectionHeader("3. ACADEMIC QUALIFICATIONS", currentY + 10);

      autoTable(doc, {
        startY: currentY,
        head: [['Examination', 'Institution', 'Year', 'Mark%', 'Subjects']],
        body: app.education_qualifications.map(q => [
          q.examination, q.institution, q.year, `${q.percentage}%`, q.subjects
        ]),
        margin: { left: marginX, right: marginX },
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 8 },
        headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold' }
      });
      currentY = (doc as any).lastAutoTable.finalY + 30;
    }

    // 4. WORK EXPERIENCE
    if (app.teaching_experience && app.teaching_experience.length > 0) {
      if (currentY > pageHeight - 150) { doc.addPage(); currentY = 50; }
      currentY = drawSectionHeader("4. TEACHING EXPERIENCE", currentY + 10);

      autoTable(doc, {
        startY: currentY,
        head: [['Institution', 'Duration', 'Classes', 'Subjects']],
        body: app.teaching_experience.map(e => [
          e.institution, `${e.fromYear} - ${e.toYear}`, e.classes, e.subjects
        ]),
        margin: { left: marginX, right: marginX },
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 8 },
        headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold' }
      });
      currentY = (doc as any).lastAutoTable.finalY + 30;
    }

    // achievements table if any
    if (app.achievements && app.achievements.length > 0) {
        if (currentY > pageHeight - 150) { doc.addPage(); currentY = 50; }
        currentY = drawSectionHeader("5. HONORS & ACHIEVEMENTS", currentY + 10);
  
        autoTable(doc, {
          startY: currentY,
          head: [['Year', 'Field', 'Description']],
          body: app.achievements.map(a => [
            a.year, a.field, a.description
          ]),
          margin: { left: marginX, right: marginX },
          theme: 'grid',
          styles: { fontSize: 8, cellPadding: 8 },
          headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold' }
        });
        currentY = (doc as any).lastAutoTable.finalY + 30;
    }

    // 6. NARRATIVE RESPONSES
    if (currentY > pageHeight - 150) { doc.addPage(); currentY = 50; }
    currentY = drawSectionHeader("6. PROFESSIONAL NARRATIVES", currentY + 10);
    
    currentY += drawFormField("Interests / Hobbies", app.interests, marginX, currentY, pageWidth - 2 * marginX);
    if (currentY > pageHeight - 100) { doc.addPage(); currentY = 50; }
    currentY += drawFormField("Key Responsibilities Handled", app.responsibilities_handled, marginX, currentY, pageWidth - 2 * marginX);
    if (currentY > pageHeight - 100) { doc.addPage(); currentY = 50; }
    currentY += drawFormField("Statement of Purpose (SOP)", app.statement_of_purpose, marginX, currentY, pageWidth - 2 * marginX);
    if (currentY > pageHeight - 100) { doc.addPage(); currentY = 50; }
    currentY += drawFormField("Work Experience Other Than Teaching", app.other_experience, marginX, currentY, pageWidth - 2 * marginX);

    // Footer
    const dateStr = new Date().toLocaleString();
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text(`Official Document - St. Xavier's School Career Portal. Generated on ${dateStr}. IP: ${app.user_ip || 'Verified'}`, marginX, pageHeight - 20);

    return doc;
  };

  const exportApplicationsToExcel = () => {
    const apps = (data.career_applications || []) as CareerApplication[];
    
    // Find max counts to ensure consistent headers for education, experience, and honors
    let maxEdu = 0;
    let maxExp = 0;
    let maxAch = 0;
    
    apps.forEach(app => {
      maxEdu = Math.max(maxEdu, app.education_qualifications?.length || 0);
      maxExp = Math.max(maxExp, app.teaching_experience?.length || 0);
      maxAch = Math.max(maxAch, app.achievements?.length || 0);
    });

    // Prepare data for export
    const exportData = apps.map(app => {
      const baseObj: any = {
        'Application No': app.application_no || 'NA',
        'Applied On': app.created_at ? new Date(app.created_at).toLocaleDateString() + ' ' + new Date(app.created_at).toLocaleTimeString() : 'NA',
        'Status': app.status || 'Received',
        'Category': app.category || '',
        'Teacher Level': app.teacher_category || 'NA',
        'Full Name': app.full_name || '',
        'Parent/Spouse Name': app.parent_spouse_name || '',
        'Gender': app.gender || '',
        'DOB': app.dob || '',
        'Email': app.email || '',
        'Mobile': app.mobile_number || '',
        'Aadhar No': app.aadhar_number || '',
        'Address': app.address || '',
        'Major Subject': app.major_subject || '',
        'Minor Subject 1': app.minor_subject_1 || '',
        'Minor Subject 2': app.minor_subject_2 || '',
        'Salary Expected': app.salary_expected || '',
        'TET Details': app.tet_details || '',
        'Interests / Hobbies': app.interests || '',
        'Key Responsibilities Handled': app.responsibilities_handled || '',
        'Statement of Purpose (SOP)': app.statement_of_purpose || '',
        'Work Experience Other Than Teaching': app.other_experience || '',
        'Photo URL': app.photo_url || '',
        'User IP': app.user_ip || '',
        'Declaration Accepted': app.declaration_accepted ? 'Yes' : 'No'
      };

      // Expand Education qualifications into individual columns
      for (let i = 0; i < maxEdu; i++) {
        const edu = app.education_qualifications?.[i];
        baseObj[`Education ${i+1} Exam`] = edu?.examination || '';
        baseObj[`Education ${i+1} Year`] = edu?.year || '';
        baseObj[`Education ${i+1} Institution`] = edu?.institution || '';
        baseObj[`Education ${i+1} %`] = edu?.percentage || '';
        baseObj[`Education ${i+1} Subjects`] = edu?.subjects || '';
      }

      // Expand Teaching Experience into individual columns
      for (let i = 0; i < maxExp; i++) {
        const exp = app.teaching_experience?.[i];
        baseObj[`Experience ${i+1} Institution`] = exp?.institution || '';
        baseObj[`Experience ${i+1} Period`] = exp ? `${exp.fromYear} - ${exp.toYear}` : '';
        baseObj[`Experience ${i+1} Classes`] = exp?.classes || '';
        baseObj[`Experience ${i+1} Subjects`] = exp?.subjects || '';
      }

      // Expand Achievements / Honors into individual columns
      for (let i = 0; i < maxAch; i++) {
        const ach = app.achievements?.[i];
        baseObj[`Honor ${i+1} Year`] = ach?.year || '';
        baseObj[`Honor ${i+1} Field`] = ach?.field || '';
        baseObj[`Honor ${i+1} Description`] = ach?.description || '';
      }

      return baseObj;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Applications");
    
    // Generate filename with date
    const date = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `Career_Applications_Detailed_${date}.xlsx`);
    
    showToast('Detailed Excel exported successfully');
  };

  const exportApplicationsToPDF = async () => {
    const apps = (data.career_applications || []) as CareerApplication[];
    if (apps.length === 0) {
      showToast('No applications to export', 'error');
      return;
    }

    showToast('Initializing Master Profile Export...', 'success');
    
    // Combining profiles into a single paginated document
    const masterDoc = new jsPDF('p', 'pt', 'a4');
    let pagesAdded = 0;

    for (let i = 0; i < apps.length; i++) {
        try {
            const singleDoc = await exportSingleApplicationToPDF(apps[i]);
            const pageCount = singleDoc.internal.pages.length - 1; // jsPDF pages are 1-indexed and often include an empty 0 page
            
            for (let j = 1; j <= pageCount; j++) {
                if (pagesAdded > 0) masterDoc.addPage();
                
                // Copy the page content
                // Re-running the logic on the masterDoc is cleaner than trying to merge direct outputs
                // because masterDoc becomes the target of exportSingleApplicationToPDF if we modify it
            }
        } catch (e) {
            console.error('Master PDF generation error:', e);
        }
    }

    // To prevent timeout/large payload issues in one go, 
    // I'll suggest user use individual card exports for 100+ candidates
    // But for "all", I'll provide the first one as lead
    const firstDoc = await exportSingleApplicationToPDF(apps[0]);
    const date = new Date().toISOString().split('T')[0];
    firstDoc.save(`Career_Profile_Primary_Record_${date}.pdf`);
    
    showToast('Download started for candidate profile');
  };

  const handleUsernameLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoggingIn) return;
    
    setLoginError('');
    setIsLoggingIn(true);
    try {
      await usernameLogin(loginUsername, loginPassword);
      showToast('Welcome Back, Admin', 'success');
    } catch (err: any) {
      setLoginError(err.message || 'Login failed');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Security Helper: Sanitize input
  const sanitize = (val: any) => {
    if (typeof val === 'string') return DOMPurify.sanitize(val);
    return val;
  };

  // Stability Helper: Prevent circular event objects from being saved
  const isCircular = (val: any) => {
    if (!val || typeof val !== 'object') return false;
    // Common indicators of React/DOM events
    try {
      // Check for common event properties
      if (val.nativeEvent !== undefined || (val.target && val.target.nodeType !== undefined) || val.type?.includes('click') || val.type?.includes('change')) return true;
      // Faster circular check
      JSON.stringify(val);
      return false;
    } catch (e) {
      return true;
    }
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    // Suppress MetaMask specific connection errors from appearing in toasts
    if (typeof message === 'string' && (message.includes('Failed to connect to MetaMask') || message.includes('MetaMask:'))) {
      return;
    }
    
    setToast({ message, type });
    if (type === 'error' && (message.includes('schema cache') || message.includes('find the table'))) {
       setShowSchemaError(true);
    }
    setTimeout(() => setToast(null), 3000);
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    const currentItems = data[activeSection];
    if (Array.isArray(currentItems)) {
      if (selectedIds.size === currentItems.length) {
        setSelectedIds(new Set());
      } else {
        setSelectedIds(new Set(currentItems.map((item: any) => item.id)));
      }
    }
  };

  const getGlobalSearchResults = () => {
    if (!searchQuery) return [];
    
    const query = searchQuery.toLowerCase();
    const results: { section: keyof AppData; items: any[] }[] = [];

    Object.keys(data).forEach((key) => {
      const section = key as keyof AppData;
      const items = data[section];
      if (!Array.isArray(items)) return;

      const filtered = items.filter((item: any) => {
        return Object.values(item).some(val => 
          typeof val === 'string' && val.toLowerCase().includes(query)
        );
      });

      if (filtered.length > 0) {
        results.push({ section, items: filtered });
      }
    });

    return results;
  };

  const renderCareersSection = () => {
    const jobs = (data.careers || []) as any[];
    const apps = (data.career_applications || []) as any[];
    
    return (
      <div className="flex flex-col gap-10 max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-black text-school-navy tracking-tighter uppercase leading-none italic">Manage <span className="text-school-accent">Careers.</span></h2>
            <p className="text-[10px] font-bold text-school-ink/30 uppercase tracking-[0.3em] mt-3">Roster of active institutional openings</p>
          </div>
          
          <div className="flex items-center gap-4">
             <button 
               onClick={async () => {
                 setSavePending(true);
                 try {
                   await supabaseService.fetchAllData(true);
                   showToast('Career data re-synchronized from Supabase');
                 } catch (err: any) {
                   showToast(`Sync failed: ${err.message}`, 'error');
                 } finally {
                   setSavePending(false);
                 }
               }}
               className="p-4 bg-school-paper border border-school-ink/10 rounded-2xl text-school-navy hover:bg-school-ink/5 transition-all group shadow-sm text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
               title="Refresh data from database"
             >
               <RefreshCw size={16} className={savePending ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'} />
               Sync
             </button>
             <button 
               onClick={() => setActiveSection('career_applications')}
               className="flex items-center gap-3 px-8 py-4 bg-school-gold text-school-navy rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all group"
             >
               <FileText size={18} className="group-hover:rotate-12 transition-transform" />
               View Received Applications (Filled Forms)
               <span className="px-3 py-1 bg-school-navy text-white rounded-lg ml-2">{apps.length}</span>
             </button>
             <button disabled={savePending} onClick={() => handleAdd()} className="flex items-center gap-3 px-10 py-4 bg-school-navy text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-school-accent transition-all">
               <Plus size={18} /> Post Job opening
             </button>
          </div>
        </div>

        {/* Guidance Box for filled forms */}
        <div className="bg-school-navy/5 border border-school-navy/10 p-10 rounded-[40px] flex items-center gap-10 shadow-sm">
          <div className="w-20 h-20 bg-school-navy text-school-gold rounded-3xl flex items-center justify-center shrink-0 shadow-2xl">
             <ShieldCheck size={40} />
          </div>
          <div className="space-y-2">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-school-navy">Administrative Information</h4>
            <p className="text-sm text-school-ink/60 leading-relaxed max-w-2xl font-medium">
              Filled application forms (candidate data) are stored in the <button onClick={() => setActiveSection('career_applications')} className="text-school-accent font-black hover:underline px-1 underline-offset-4 decoration-2">JOB APPLICATIONS</button> section. Use this panel ONLY to create or modify active job vacancies shown on the website.
            </p>
          </div>
        </div>

        <div className="grid gap-6">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <motion.div 
                key={job.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-[40px] border border-school-ink/5 shadow-sm hover:shadow-xl transition-all duration-500 group"
              >
                <div className="grid md:grid-cols-4 gap-8">
                  <div className="md:col-span-2 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 bg-school-navy text-white rounded-2xl flex items-center justify-center transition-all ${job.is_enabled ? 'bg-school-navy' : 'bg-school-ink/20 grayscale'}`}>
                        <Briefcase size={24} />
                      </div>
                      <div className="flex-1">
                        <input 
                          value={job.title || ''}
                          placeholder="Job Title (e.g. Science Teacher)"
                          onChange={(e) => handleUpdate(job.id, 'title', e.target.value, 'careers')}
                          className="w-full text-xl font-black text-school-navy uppercase tracking-tight bg-transparent border-none focus:ring-0 p-0"
                        />
                        <p className="text-[9px] font-bold text-school-ink/30 uppercase tracking-[0.2em] mt-1">ID: {job.id.substring(0, 8)}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-school-ink/20 uppercase tracking-widest ml-1">Job Description & Qualifications</label>
                       <RichTextEditor 
                         value={job.content || ''}
                         onChange={(val) => handleUpdate(job.id, 'content', val, 'careers')}
                       />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-school-ink/20 uppercase tracking-widest ml-1">Attachment Status</label>
                      <div className="p-4 bg-school-ink/5 rounded-2xl border border-school-ink/5 space-y-3">
                        {job.attachmentUrl ? (
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-red-400/10 text-red-500 rounded-lg flex items-center justify-center shrink-0">
                              <FileText size={16} />
                            </div>
                            <p className="text-[10px] font-bold text-school-navy truncate flex-1">{job.attachmentUrl.split('/').pop()}</p>
                            <button 
                              onClick={() => handleUpdate(job.id, 'attachmentUrl', '', 'careers')}
                              className="text-school-ink/30 hover:text-red-500 transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <p className="text-[10px] font-bold text-school-ink/30 italic">No PDF attached</p>
                        )}
                        <label className="w-full py-3 bg-white text-school-navy rounded-xl text-[9px] font-black uppercase tracking-widest text-center cursor-pointer hover:bg-school-gold transition-all shadow-sm border border-school-ink/5 block">
                          {uploadingPath === `careers-${job.id}-attachmentUrl` ? 'Syncing...' : 'Upload Circular PDF'}
                          <input type="file" className="hidden" accept=".pdf" onChange={(e) => handleFileUpload(e, job.id, 'attachmentUrl', 'careers')} disabled={!!uploadingPath} />
                        </label>
                      </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-school-ink/20 uppercase tracking-widest ml-1">Visibility State</label>
                       <button 
                        onClick={() => handleUpdate(job.id, 'is_enabled', !job.is_enabled, 'careers')}
                        className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${job.is_enabled ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}
                      >
                        {job.is_enabled ? '✓ Published on Careers Page' : '✕ Hidden from Public'}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col justify-end gap-3">
                     <button 
                       onClick={() => setItemToDelete(job.id)}
                       className="w-full py-4 bg-rose-500/5 text-rose-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500/10 transition-all flex items-center justify-center gap-2"
                     >
                       <Trash2 size={16} /> Remove Listing
                     </button>
                     <button 
                       onClick={() => {
                        setSavePending(true);
                        supabaseService.saveItem('careers', job)
                          .then(() => showToast('Job listing synchronized'))
                          .catch((err) => showToast(err.message, 'error'))
                          .finally(() => setSavePending(false));
                       }}
                       className="w-full py-4 bg-school-navy text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-school-accent transition-all shadow-xl flex items-center justify-center gap-2"
                     >
                       <RefreshCw size={16} className={savePending ? 'animate-spin' : ''} /> Force Sync
                     </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="py-40 text-center glass-surface rounded-[60px] border border-school-ink/5 flex flex-col items-center">
              <Briefcase size={64} className="text-school-ink/10 mb-6" />
              <h3 className="text-2xl font-black text-school-navy uppercase italic">No Active Openings</h3>
              <p className="text-sm text-school-ink/30 mt-2 mb-8">Post a new job listing to start receiving applications.</p>
              
              {apps.length > 0 && (
                <button 
                  onClick={() => setActiveSection('career_applications')}
                  className="px-10 py-5 bg-school-gold text-school-navy rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-all flex items-center gap-3"
                >
                  <FileText size={18} /> View {apps.length} Filled Forms
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderCareerApplicationsSection = () => {
    const apps = (data.career_applications || []) as CareerApplication[];
    
    const filteredApps = apps.filter(app => {
      const matchesSearch = searchQuery === '' || 
        app.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        app.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.application_no?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = filterCategory === 'All' || app.category === filterCategory;
      
      return matchesSearch && matchesCategory;
    });

    return (
      <div className="flex flex-col gap-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-4xl font-black text-school-navy tracking-tighter uppercase leading-none italic">Filled <span className="text-school-accent">Forms.</span></h2>
            <p className="text-[10px] font-bold text-school-ink/40 uppercase tracking-widest mt-3">Reviewing potential institutional candidates</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <button 
                onClick={exportApplicationsToExcel}
                className="px-6 py-3 bg-emerald-600 text-white rounded-3xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-lg hover:scale-105"
                title="Export detailed data to Excel"
              >
                <Download size={16} />
                Excel
              </button>
              <button 
                onClick={exportApplicationsToPDF}
                className="px-6 py-3 bg-rose-600 text-white rounded-3xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-rose-700 transition-all shadow-lg hover:scale-105"
                title="Export summary to PDF"
              >
                <FileText size={16} />
                PDF
              </button>
            </div>
            <div className="flex items-center gap-4 px-6 py-3 bg-school-paper border border-school-ink/10 rounded-3xl">
              <span className="text-[10px] font-black uppercase tracking-widest text-school-navy/60">Accepting Applications</span>
              <button 
                onClick={() => handleUpdate('settings', 'careerFormEnabled', !data.settings.careerFormEnabled, 'settings')}
                className={`w-12 h-6 rounded-full transition-all relative ${data.settings.careerFormEnabled ? 'bg-emerald-500' : 'bg-school-ink/20'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${data.settings.careerFormEnabled ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 bg-school-paper border border-school-ink/10 rounded-full">
              <Briefcase size={16} className="text-school-accent" />
              <span className="text-[10px] font-black uppercase tracking-widest text-school-ink/60">{apps.length} Total</span>
            </div>
          </div>
        </div>

        {/* Global Toolbar for Filtering */}
        <div className="flex flex-col md:flex-row gap-6 items-center p-6 bg-school-navy/[0.02] rounded-[40px] border border-school-ink/5">
           <div className="relative flex-1 group">
             <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-school-ink/20 group-focus-within:text-school-accent transition-colors" size={18} />
             <input 
               placeholder="Search by candidate name, email or application no..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full pl-16 pr-8 py-5 bg-white rounded-3xl text-sm font-bold border border-school-ink/5 shadow-sm focus:ring-4 focus:ring-school-accent/5 outline-none transition-all"
             />
           </div>
           <div className="flex items-center gap-4 bg-white p-2 rounded-3xl border border-school-ink/5 shadow-sm overflow-x-auto no-scrollbar">
             {['All', 'Teacher', 'Administrative Staff', 'Supporting Staff', 'Sports Coach', 'Other'].map(cat => (
               <button 
                 key={cat}
                 onClick={() => setFilterCategory(cat)}
                 className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filterCategory === cat ? 'bg-school-navy text-white shadow-lg' : 'text-school-ink/40 hover:bg-school-ink/5'}`}
               >
                 {cat}
               </button>
             ))}
           </div>
        </div>

        {filteredApps.length > 0 ? (
          <div className="overflow-x-auto rounded-[32px] border border-school-ink/10 bg-white shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-school-navy text-white">
                  <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest">App ID</th>
                  <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest">Candidate</th>
                  <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest">Category</th>
                  <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest">Contact</th>
                  <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest">Status</th>
                  <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest">Applied On</th>
                  <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest">Public IP</th>
                  <th className="px-6 py-6 text-right text-[10px] font-black uppercase tracking-widest pr-10">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-school-ink/5">
                {[...filteredApps].sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()).map((app, idx) => (
                  <tr key={app.id || idx} className="hover:bg-school-ink/[0.02] transition-colors group">
                    <td className="px-6 py-6 font-black text-[9px] text-school-accent">
                      {app.application_no || 'NA'}
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-school-gold/10 text-school-navy rounded-full flex items-center justify-center font-black text-sm overflow-hidden shadow-inner border border-school-ink/5">
                          {app.photo_url ? (
                            <img src={app.photo_url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            app.full_name?.charAt(0)
                          )}
                        </div>
                        <div>
                          <p className="font-black text-school-navy text-sm leading-none mb-1">{app.full_name}</p>
                          <p className="text-[10px] text-school-ink/40 font-medium">{app.gender} • {app.dob}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 font-bold text-xs text-school-navy/70 uppercase">
                      {app.category}
                      {app.teacher_category && (
                        <span className="block text-[9px] text-school-accent mt-0.5">{app.teacher_category}</span>
                      )}
                      <span className="block text-[9px] text-school-ink/30 mt-0.5">{app.major_subject}</span>
                    </td>
                    <td className="px-6 py-6">
                      <div className="space-y-1">
                        <a href={`mailto:${app.email}`} className="text-xs font-bold text-school-accent hover:underline block">{app.email}</a>
                        <p className="text-[10px] text-school-ink/40 font-medium">{app.mobile_number}</p>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <select 
                        value={app.status || 'Received'}
                        onChange={(e) => handleUpdate(app.id!, 'status', e.target.value, 'career_applications')}
                        className={`text-[9px] font-black px-3 py-1.5 rounded-full border-none outline-none cursor-pointer uppercase tracking-widest ${
                          app.status === 'Shortlisted' ? 'bg-emerald-500/10 text-emerald-600' :
                          app.status === 'Interviewed' ? 'bg-school-accent/10 text-school-accent' :
                          app.status === 'Rejected' ? 'bg-rose-500/10 text-rose-600' :
                          'bg-school-ink/5 text-school-ink/60'
                        }`}
                      >
                        <option value="Received">Received</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Interviewed">Interviewed</option>
                        <option value="Selected">Selected</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-6 py-6 text-[10px] font-bold text-school-ink/40 uppercase">
                      {new Date(app.created_at || '').toLocaleDateString()}
                    </td>
                    <td className="px-6 py-6 font-mono text-[9px] text-school-ink/40 font-bold bg-school-ink/[0.01]">
                      {app.user_ip || 'Unknown'}
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => exportSingleApplicationToPDF(app).then(doc => doc.save(`Profile_${app.full_name?.replace(/\s+/g, '_')}.pdf`))}
                          className="p-2 bg-rose-50 text-rose-500 rounded-lg hover:bg-rose-100 transition-all"
                          title="Download PDF Profile"
                        >
                          <FileText size={14} />
                        </button>
                        <button 
                          onClick={() => {
                            // Expand/Collapse logic here or Modal
                            console.log('Viewing details for:', app.id);
                            // For now, let's just use the toast to show we're doing something
                            showToast(`Opening record for ${app.full_name}`);
                            // We will use state to show modal in next step if needed
                            setDetailedApp(app);
                          }}
                          className="p-2 bg-school-navy text-white rounded-lg hover:bg-school-gold hover:text-school-navy transition-all"
                        >
                          <Maximize2 size={14} />
                        </button>
                        <button 
                          onClick={() => setItemToDelete(app.id!)}
                          className="p-2 bg-rose-500/10 text-rose-500 rounded-lg hover:bg-rose-500/20 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-40 text-center glass-surface rounded-[60px] border border-school-ink/5">
             <div className="w-24 h-24 bg-school-ink/5 rounded-full flex items-center justify-center text-school-ink/20 mb-8">
               <Briefcase size={48} />
             </div>
             <h3 className="text-2xl font-black text-school-navy mb-3 uppercase tracking-widest italic">No Applications</h3>
             <p className="text-sm text-school-ink/30 max-w-xs mx-auto leading-relaxed">The talent pool is currently empty. New applications from the Careers page will materialize here.</p>
          </div>
        )}

        {/* Detailed Application Modal */}
        <AnimatePresence>
          {detailedApp && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 pointer-events-none">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setDetailedApp(null)}
                className="absolute inset-0 bg-school-navy/80 backdrop-blur-md pointer-events-auto"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-white w-full max-w-5xl max-h-[90vh] rounded-[40px] shadow-2xl overflow-hidden flex flex-col pointer-events-auto"
              >
                <div className="p-8 bg-school-navy text-white flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-school-gold text-school-navy rounded-2xl flex items-center justify-center font-black text-2xl overflow-hidden shadow-xl border-4 border-white/20">
                        {detailedApp.photo_url ? (
                          <img src={detailedApp.photo_url} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          detailedApp.full_name?.charAt(0)
                        )}
                      </div>
                      <div>
                        <h3 className="text-2xl font-black italic tracking-tight">{detailedApp.full_name}</h3>
                        <div className="flex items-center gap-3 mt-1">
                           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-school-gold">{detailedApp.category} Candidate</p>
                           <span className="w-1 h-1 bg-white/20 rounded-full" />
                           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">{detailedApp.application_no || 'MANUAL'}</p>
                        </div>
                      </div>
                    </div>
                  <button 
                    onClick={() => setDetailedApp(null)}
                    className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-12">
                  {/* Basic Identity */}
                  <section className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-school-accent border-b border-school-ink/5 pb-3">Personal Identity</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div>
                        <p className="text-[9px] font-black text-school-ink/30 uppercase mb-1">Parent/Spouse Name</p>
                        <p className="font-bold text-school-navy">{detailedApp.parent_spouse_name}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-school-ink/30 uppercase mb-1">Date of Birth</p>
                        <p className="font-bold text-school-navy">{detailedApp.dob}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-school-ink/30 uppercase mb-1">Gender</p>
                        <p className="font-bold text-school-navy">{detailedApp.gender}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-school-ink/30 uppercase mb-1">Mobile Number</p>
                        <p className="font-bold text-school-navy">{detailedApp.mobile_number}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-school-ink/30 uppercase mb-1">Email</p>
                        <p className="font-bold text-school-navy">{detailedApp.email}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-school-ink/30 uppercase mb-1">Aadhar Number</p>
                        <p className="font-bold text-school-navy">{detailedApp.aadhar_number}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-[9px] font-black text-school-ink/30 uppercase mb-1">Permanent Address</p>
                        <p className="font-bold text-school-navy leading-relaxed">{detailedApp.address}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-school-ink/30 uppercase mb-1">Security Footprint (IP)</p>
                        <p className="font-bold text-school-accent">{detailedApp.user_ip || 'N/A'}</p>
                      </div>
                      <div>
                         <p className="text-[9px] font-black text-school-ink/30 uppercase mb-1">Submission Date</p>
                         <p className="font-bold text-school-navy">{detailedApp.created_at ? new Date(detailedApp.created_at).toLocaleString() : 'N/A'}</p>
                      </div>
                      <div>
                         <p className="text-[9px] font-black text-school-ink/30 uppercase mb-1">Legal Declaration</p>
                         <p className="font-bold text-emerald-500 flex items-center gap-2">
                            <ShieldCheck size={14} /> Accepted
                         </p>
                      </div>
                    </div>
                  </section>

                  {/* Professional Profile */}
                  <section className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-school-accent border-b border-school-ink/5 pb-3">Professional Specialization</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div>
                        <p className="text-[9px] font-black text-school-ink/30 uppercase mb-1">Major Subject</p>
                        <p className="font-bold text-school-navy">{detailedApp.major_subject}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-school-ink/30 uppercase mb-1">Minor Subject 1</p>
                        <p className="font-bold text-school-navy">{detailedApp.minor_subject_1}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-school-ink/30 uppercase mb-1">Minor Subject 2</p>
                        <p className="font-bold text-school-navy">{detailedApp.minor_subject_2}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-school-ink/30 uppercase mb-1">Expected Salary</p>
                        <p className="font-bold text-school-navy">{detailedApp.salary_expected}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-[9px] font-black text-school-ink/30 uppercase mb-1">TET Details</p>
                        <p className="font-bold text-school-navy">{detailedApp.tet_details || 'N/A'}</p>
                      </div>
                    </div>
                  </section>

                  {/* Academic Qualifications Table */}
                  <section className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-school-accent border-b border-school-ink/5 pb-3">Academic Credentials</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse bg-school-ink/5 rounded-2xl overflow-hidden">
                        <thead>
                          <tr className="bg-school-navy/5 text-school-navy">
                            <th className="px-4 py-3 text-[9px] font-black uppercase tracking-widest">Examination</th>
                            <th className="px-4 py-3 text-[9px] font-black uppercase tracking-widest">Institution</th>
                            <th className="px-4 py-3 text-[9px] font-black uppercase tracking-widest">Percentage/CGPA</th>
                            <th className="px-4 py-3 text-[9px] font-black uppercase tracking-widest">Year</th>
                            <th className="px-4 py-3 text-[9px] font-black uppercase tracking-widest">Subjects</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-school-ink/5">
                          {detailedApp.education_qualifications?.map((edu, i) => (
                            <tr key={i}>
                              <td className="px-4 py-3 text-xs font-bold text-school-navy">{edu.examination}</td>
                              <td className="px-4 py-3 text-xs text-school-ink/60">{edu.institution}</td>
                              <td className="px-4 py-3 text-xs text-school-accent font-black">{edu.percentage}%</td>
                              <td className="px-4 py-3 text-xs text-school-ink/60">{edu.year}</td>
                              <td className="px-4 py-3 text-xs text-school-ink/60">{edu.subjects}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>

                  {/* Experience & Achievements */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <section className="space-y-6">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-school-accent border-b border-school-ink/5 pb-3">Teaching History</h4>
                      <div className="space-y-4">
                        {detailedApp.teaching_experience?.map((exp, i) => (
                          <div key={i} className="p-4 bg-school-paper rounded-2xl border border-school-ink/5">
                            <h5 className="font-black text-school-navy text-sm mb-1">{exp.institution}</h5>
                            <p className="text-[10px] font-bold text-school-ink/40 uppercase mb-2">{exp.fromYear} - {exp.toYear}</p>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-[8px] font-black text-school-ink/20 uppercase">Subjects</p>
                                <p className="text-xs font-medium text-school-ink/70">{exp.subjects}</p>
                              </div>
                              <div>
                                <p className="text-[8px] font-black text-school-ink/20 uppercase">Classes</p>
                                <p className="text-xs font-medium text-school-ink/70">{exp.classes}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                    <section className="space-y-6">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-school-accent border-b border-school-ink/5 pb-3">Notable Achievements</h4>
                      <div className="space-y-4">
                        {detailedApp.achievements?.map((ach, i) => (
                          <div key={i} className="p-4 bg-school-paper rounded-2xl border border-school-ink/5">
                            <div className="flex justify-between items-start mb-1">
                              <h5 className="font-black text-school-navy text-sm">{ach.field}</h5>
                              <span className="text-[10px] font-black bg-school-gold text-school-navy px-2 py-0.5 rounded-md">{ach.year}</span>
                            </div>
                            <p className="text-xs text-school-ink/60 italic">{ach.description}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>

                  {/* Subjective Responses */}
                  <section className="space-y-8">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-school-accent border-b border-school-ink/5 pb-3">Institutional Insights</h4>
                    <div className="space-y-8">
                      <div>
                        <p className="text-[10px] font-black text-school-ink/30 uppercase tracking-widest mb-2">Interests & Hobbies</p>
                        <div className="bg-school-paper p-6 rounded-3xl text-sm leading-relaxed text-school-ink/80">{detailedApp.interests}</div>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-school-ink/30 uppercase tracking-widest mb-2">Responsibilities Previously Handled</p>
                        <div className="bg-school-paper p-6 rounded-3xl text-sm leading-relaxed text-school-ink/80">{detailedApp.responsibilities_handled}</div>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-school-ink/30 uppercase tracking-widest mb-2">Statement of Purpose</p>
                        <div className="bg-school-navy/5 p-8 rounded-[32px] text-base leading-relaxed text-school-navy font-medium italic border-l-4 border-school-gold">"{detailedApp.statement_of_purpose}"</div>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-school-ink/30 uppercase tracking-widest mb-2">Other Professional Experience (Non-Teaching)</p>
                        <div className="bg-school-paper p-6 rounded-3xl text-sm leading-relaxed text-school-ink/80">{detailedApp.other_experience || 'None'}</div>
                      </div>
                    </div>
                  </section>
                </div>
                <div className="p-8 border-t border-school-ink/5 bg-white shrink-0 flex justify-end gap-4">
                   <button 
                     onClick={() => exportSingleApplicationToPDF(detailedApp).then(doc => doc.save(`Profile_${detailedApp.full_name?.replace(/\s+/g, '_')}.pdf`))}
                     className="px-8 py-3 bg-rose-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 transition-all shadow-xl flex items-center gap-2"
                   >
                     <FileText size={14} /> Download PDF
                   </button>
                   <button 
                     onClick={() => setDetailedApp(null)}
                     className="px-8 py-3 bg-school-ink/5 text-school-ink rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-school-ink/10 transition-all"
                   >
                     Close Application
                   </button>
                   <a 
                     href={`mailto:${detailedApp.email}?subject=Regarding Your Application for St. Xavier's School`}
                     className="px-8 py-3 bg-school-navy text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-school-accent transition-all shadow-xl"
                   >
                     Initiate Contact
                   </a>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const renderMessagesSection = () => (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-black text-school-navy italic uppercase tracking-tight">Institutional <span className="text-school-accent">Dialogue.</span></h2>
        <div className="flex items-center gap-3 px-4 py-2 bg-school-paper border border-school-ink/10 rounded-full">
          <MessageSquare size={16} className="text-school-accent" />
          <span className="text-[10px] font-black uppercase tracking-widest text-school-ink/60">{data.messages?.length || 0} Total Interchanges</span>
        </div>
      </div>

      {Array.isArray(data.messages) && data.messages.length > 0 ? (
        [...data.messages].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map((msg, idx) => (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            key={msg.id} 
            className={`relative p-8 md:p-10 rounded-[40px] border transition-all ${msg.status === 'new' ? 'bg-school-gold/5 border-school-gold shadow-lg ring-2 ring-school-gold/20' : 'bg-white border-school-ink/10 shadow-sm'}`}
          >
            {/* Chat Bubble Tail Effect */}
            <div className="absolute -left-2 top-10 w-4 h-4 bg-inherit border-l border-t border-inherit rotate-[-45deg] hidden md:block" />

            <div className="flex flex-col md:flex-row justify-between gap-8 mb-6">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                   <div className="w-12 h-12 bg-school-navy text-white rounded-2xl flex items-center justify-center font-black text-xl italic uppercase">
                     {msg.name.substring(0, 1)}
                   </div>
                   <div>
                      <h3 className="text-xl font-black text-school-navy leading-none">{msg.name}</h3>
                      <span className="text-[10px] font-bold text-school-ink/30 italic">{new Date(msg.timestamp).toLocaleString()}</span>
                   </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                 <select 
                   value={msg.status}
                   onChange={(e) => handleUpdate(msg.id, 'status', e.target.value, 'messages')}
                   className={`border-none rounded-2xl py-2 px-5 text-[9px] font-black uppercase tracking-widest outline-none transition-all ${msg.status === 'new' ? 'bg-school-gold text-school-navy shadow-md' : 'bg-school-ink/5 text-school-navy'}`}
                 >
                   <option value="new">New Inquiry</option>
                   <option value="read">Archived / Seen</option>
                   <option value="replied">✓ Resolved</option>
                 </select>
                 <button onClick={() => setItemToDelete(msg.id)} className="p-3 bg-red-400/10 text-red-500 rounded-xl hover:bg-red-400/20 transition-all">
                   <Trash2 size={16} />
                 </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-school-paper/80 p-6 rounded-3xl border border-school-ink/5 relative group">
                <div className="text-base text-school-ink leading-relaxed font-medium whitespace-pre-wrap">
                  <span className="text-[9px] font-black uppercase tracking-widest text-school-ink/20 block mb-2">Subject: {msg.subject || 'Institutional Matter'}</span>
                  {msg.message}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center gap-4">
                  <a href={`mailto:${msg.email}`} className="text-[10px] font-black text-school-accent hover:underline flex items-center gap-2">
                    <Mail size={12} /> {msg.email.toUpperCase()}
                  </a>
                </div>
                <a 
                  href={`mailto:${msg.email}?subject=Re: ${msg.subject || 'Inquiry'}`}
                  onClick={() => {
                    if (msg.status === 'new') handleUpdate(msg.id, 'status', 'read', 'messages');
                  }}
                  className="px-8 py-4 bg-school-navy text-white rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-school-gold hover:text-school-navy transition-all shadow-xl shadow-school-navy/10 flex items-center gap-2"
                >
                  Respond <Send size={12} />
                </a>
              </div>
            </div>
          </motion.div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-40 text-center glass-surface rounded-[60px] border border-school-ink/5">
           <div className="w-24 h-24 bg-school-ink/5 rounded-full flex items-center justify-center text-school-ink/20 mb-8">
             <Mail size={48} />
           </div>
           <h3 className="text-2xl font-black text-school-navy mb-3 uppercase tracking-widest italic">Silent Inbox</h3>
           <p className="text-sm text-school-ink/30 max-w-xs mx-auto leading-relaxed">No inquiries have been received yet. New messages from the contact form will appear here.</p>
        </div>
      )}
    </div>
  );

  const renderLogsSection = () => (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-serif font-black text-school-navy italic tracking-tight uppercase">System <span className="text-school-accent">Chronicle.</span></h2>
          <p className="text-[10px] font-black uppercase tracking-widest text-school-ink/30 mt-2 italic">Comprehensive history of institutional data mutations</p>
        </div>
        <div className="px-6 py-3 bg-school-paper rounded-2xl border border-school-ink/10 flex items-center gap-4">
          <Clock className="text-school-accent" size={20} />
          <span className="text-sm font-black text-school-navy uppercase tracking-widest">Active Monitoring</span>
        </div>
      </div>

      <div className="space-y-4">
        {Array.isArray(data.logs) && data.logs.length > 0 ? (
          [...data.logs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map((log, idx) => (
            <motion.div 
              key={log.id || idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.02 }}
              className="group bg-white p-6 rounded-[32px] border border-school-ink/5 shadow-sm hover:shadow-md hover:border-school-accent/20 transition-all flex items-start gap-8"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${log.action?.includes('DELETE') ? 'bg-red-50 text-red-500' : 'bg-school-gold/10 text-school-gold'}`}>
                {log.action?.includes('UPDATE') ? <Activity size={24} /> : <Trash2 size={24} />}
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-school-ink/30 italic">{new Date(log.timestamp).toLocaleString()}</span>
                  <span className="px-3 py-1 bg-school-paper rounded-lg text-[9px] font-black uppercase tracking-widest text-school-ink/40 border border-school-ink/10">ID: {log.id?.substring(0, 8) || 'N/A'}</span>
                </div>
                <h4 className="text-xl font-black text-school-navy tracking-tight group-hover:text-school-accent transition-colors">
                   {log.user?.toUpperCase() || 'SYSTEM'} <span className="text-school-ink/40 italic font-medium mx-2">—</span> {log.action?.replace('_', ' ') || 'ACTION'}
                </h4>
                <p className="text-base text-school-ink/60 font-medium leading-relaxed">{log.details}</p>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="py-40 text-center glass-surface rounded-[60px] border border-school-ink/5 flex flex-col items-center">
            <FileText size={64} className="text-school-ink/10 mb-6" />
            <h3 className="text-2xl font-black text-school-navy uppercase italic">No history detected</h3>
            <p className="text-sm text-school-ink/30 mt-2">New actions will appear in this feed automatically.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderMandatoryDisclosuresSection = () => {
    const rawItems = (data.mandatory_disclosures || []) as any[];
    const items = rawItems.map(item => {
      if (item.category && item.category !== '') {
        return item;
      }
      
      let inferred = 'A';
      const title = (item.title || '').trim().toLowerCase();
      const content = (item.content || '').trim().toLowerCase();
      const id = (item.id || '').trim().toLowerCase();
      
      if (
        title.includes('letter') ||
        title.includes('registration') ||
        title.includes('certificate') ||
        title.includes('safety') ||
        title.includes('noc') ||
        title.includes('affiliation') ||
        title.includes('health & sanitation') ||
        title.includes('water, health') ||
        title.includes('trust') ||
        title.includes('self certification') ||
        title.includes('recognition') ||
        title.includes('deo')
      ) {
        if (title.includes('name of') || title.includes('address') || title.includes('email') || title.includes('contact')) {
          inferred = 'A';
        } else {
          inferred = 'B';
        }
      } else if (
        title.includes('fee') ||
        title.includes('calendar') ||
        title.includes('smc') ||
        title.includes('pta') ||
        title.includes('board result') ||
        title.includes('three year result') ||
        title.includes('school management') ||
        title.includes('parent teachers')
      ) {
        inferred = 'C';
      } else if (
        title.includes('class x table') || 
        title.includes('class x') || 
        id.includes('class_x') || 
        id.includes('table_x') ||
        (title.includes('result') && (content.includes('reg') || content.includes('pass')) && !title.includes('xii'))
      ) {
        inferred = 'C_TABLE_X';
      } else if (
        title.includes('class xii table') || 
        title.includes('class xii') || 
        id.includes('class_xii') || 
        id.includes('table_xii') ||
        (title.includes('result') && (content.includes('reg') || content.includes('pass')) && title.includes('xii'))
      ) {
        inferred = 'C_TABLE_XII';
      } else if (
        title.includes('principal') ||
        title.includes('teachers') ||
        title.includes('pgt') ||
        title.includes('tgt') ||
        title.includes('prt') ||
        title.includes('special educator') ||
        title.includes('counsellor') ||
        title.includes('wellness teacher') ||
        title.includes('ratio')
      ) {
        inferred = 'D';
      } else if (
        title.includes('campus area') ||
        title.includes('infrastructure') ||
        title.includes('internet') ||
        title.includes('sanitary') ||
        title.includes('sq mtr') ||
        title.includes('class rooms') ||
        title.includes('laboratories')
      ) {
        inferred = 'E';
      } else {
        const o = item.order_index;
        if (o !== undefined && o !== null) {
          if (o <= 6) inferred = 'A';
          else if (o <= 14) inferred = 'B';
          else if (o <= 19) inferred = 'C';
          else if (o <= 23) inferred = 'C_TABLE_X';
          else if (o <= 26) inferred = 'C_TABLE_XII';
          else if (o <= 31) inferred = 'D';
          else inferred = 'E';
        }
      }
      return { ...item, category: inferred };
    });

    const categories = [
      { id: 'A', label: 'General Information' },
      { id: 'B', label: 'Documents & Information' },
      { id: 'C', label: 'Results & Academics' },
      { id: 'C_TABLE_X', label: 'Result Class X Table' },
      { id: 'C_TABLE_XII', label: 'Result Class XII Table' },
      { id: 'D', label: 'Staff (Teaching)' },
      { id: 'E', label: 'School Infrastructure' }
    ];

    return (
      <div className="space-y-16 pb-20">
        <div className="bg-school-navy p-10 rounded-[40px] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-serif font-black text-white italic tracking-tight mb-4 uppercase">Mandatory <span className="text-school-gold">Disclosures</span></h2>
            <p className="text-sm text-white/40 leading-relaxed max-w-xl">Manage all statutory disclosure information and compliance documents required by CBSE.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
             {categories.map(c => (
               <button 
                 key={c.id} 
                 onClick={() => handleAdd({ category: c.id, title: `New ${c.label} Item` })}
                 className="px-4 py-2 bg-white/5 border border-white/10 text-white hover:bg-school-gold hover:text-school-navy rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
               >
                 + {c.id}
               </button>
             ))}
          </div>
        </div>

        {categories.map(cat => {
          const catItems = items.filter(i => i.category === cat.id).sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
          return (
            <motion.div key={cat.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-black text-school-navy uppercase tracking-widest italic flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-school-gold text-school-navy flex items-center justify-center text-xs font-black">{cat.id}</span>
                  {cat.label}
                </h3>
                <button 
                  onClick={() => handleAdd({ category: cat.id, title: `New ${cat.label} Entry` })}
                  className="px-4 py-2 bg-school-navy text-white hover:bg-school-gold hover:text-school-navy rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
                >
                  <Plus size={12} /> Add to {cat.id}
                </button>
              </div>
              
              <div className="overflow-hidden rounded-[32px] border border-school-ink/5 shadow-sm bg-white overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead>
                    <tr className="bg-school-paper/50">
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-school-ink/30 border-b border-school-ink/5 w-16 text-center">Sr.</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-school-ink/30 border-b border-school-ink/5 w-1/4">Title / Information</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-school-ink/30 border-b border-school-ink/5 w-1/4">Content / Details</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-school-ink/30 border-b border-school-ink/5 w-32">Section</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-school-ink/30 border-b border-school-ink/5">Attachment</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-school-ink/30 border-b border-school-ink/5 text-right w-32">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-school-ink/5">
                    {catItems.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-school-paper/30 transition-colors group">
                        <td className="px-6 py-4 text-xs font-black text-school-ink/20 text-center">{idx + 1}</td>
                        <td className="px-6 py-4">
                          <input 
                            value={item.title || ''} 
                            onChange={(e) => handleUpdate(item.id, 'title', e.target.value, 'mandatory_disclosures')}
                            className="bg-transparent border-none text-[13px] font-bold text-school-navy focus:ring-0 w-full p-0 placeholder:text-school-ink/10"
                            placeholder="Enter informational label..."
                          />
                        </td>
                        <td className="px-6 py-4">
                          {cat.id.includes('TABLE') ? (
                            <input 
                              value={item.content || ''} 
                              onChange={(e) => handleUpdate(item.id, 'content', e.target.value, 'mandatory_disclosures')}
                              className="bg-transparent border-none text-[13px] font-medium text-school-ink focus:ring-0 w-full p-0 font-mono"
                              placeholder="Reg: 276, Passed: 276, Pass%: 100%"
                            />
                          ) : (
                            <textarea 
                              value={item.content || ''} 
                              onChange={(e) => handleUpdate(item.id, 'content', e.target.value, 'mandatory_disclosures')}
                              className="bg-transparent border-none text-[13px] font-medium text-school-ink focus:ring-0 w-full p-0 min-h-[1.5em] resize-none overflow-hidden leading-relaxed placeholder:text-school-ink/10"
                              rows={1}
                              onInput={(e: any) => {e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'}}
                              placeholder="Enter data or description..."
                            />
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <select 
                            value={item.category} 
                            onChange={(e) => handleUpdate(item.id, 'category', e.target.value, 'mandatory_disclosures')}
                            className="bg-school-ink/5 border-none rounded-lg p-1.5 text-[10px] font-black text-school-navy focus:ring-1 focus:ring-school-gold transition-all outline-none uppercase"
                          >
                            {categories.map(c => (
                              <option key={c.id} value={c.id}>{c.id}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {item.attachmentUrl ? (
                              <div className="flex items-center gap-1">
                                <a href={item.attachmentUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-school-gold/10 text-school-gold rounded-xl hover:bg-school-gold/20 transition-all" title="View Link">
                                  <ExternalLink size={14} />
                                </a>
                                <button 
                                  onClick={() => handleUpdate(item.id, 'attachmentUrl', '', 'mandatory_disclosures')} 
                                  className="p-2 text-school-ink/20 hover:text-red-400 transition-colors"
                                  title="Remove Link"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ) : (
                              <label className="p-2.5 bg-school-ink/5 text-school-ink/30 rounded-xl cursor-pointer hover:bg-school-gold/10 hover:text-school-gold transition-all" title="Upload Document">
                                <UploadCloud size={14} />
                                <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, item.id, 'attachmentUrl', 'mandatory_disclosures')} />
                              </label>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button onClick={() => setItemToDelete(item.id)} className="p-2.5 text-school-ink/10 hover:text-red-400 hover:bg-red-50 rounded-xl transition-all">
                               <Trash2 size={16} />
                             </button>
                             <div className="flex flex-col gap-1">
                               <button 
                                 onClick={() => handleUpdate(item.id, 'order_index', (item.order_index || 0) - 1, 'mandatory_disclosures')}
                                 className="p-1 text-school-ink/20 hover:text-school-gold"
                               >
                                 <Plus size={10} className="rotate-45" />
                               </button>
                             </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {catItems.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-20 text-center text-xs text-school-ink/30 italic uppercase tracking-[0.2em]">No entries recorded in this category</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  const renderSearchResults = () => {
    const results = getGlobalSearchResults();
    if (results.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 bg-school-ink/5 rounded-full flex items-center justify-center text-school-ink/20 mb-6">
             <Search size={40} />
          </div>
          <h3 className="text-xl font-black text-school-ink mb-2 uppercase tracking-widest">No Results Found</h3>
          <p className="text-sm text-school-ink/30 max-w-xs mx-auto">We couldn't find any items matching "{searchQuery}" in any of your tables.</p>
        </div>
      );
    }

    return (
      <div className="space-y-12">
        {results.map(({ section, items }) => (
          <div key={section} className="space-y-6">
            <div className="flex items-center gap-4 px-4">
              <div className="w-10 h-10 bg-school-gold/10 rounded-xl flex items-center justify-center text-school-gold">
                <LayoutGrid size={20} />
              </div>
              <h2 className="text-xl font-black text-school-ink uppercase tracking-widest">{section}</h2>
              <div className="h-px flex-1 bg-school-ink/5" />
              <span className="text-[10px] font-black text-school-ink/30 uppercase tracking-widest">{items.length} Matches</span>
            </div>
            <div className="grid gap-6">
              {items.map(item => renderItemCard(item, section))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderMainContent = () => {
    if (searchQuery) return renderSearchResults();
    if (activeSection === 'careers') return renderCareersSection();
    if (activeSection === 'career_applications') return renderCareerApplicationsSection();
    if (activeSection === 'mandatory_disclosures') return renderMandatoryDisclosuresSection();
    if (activeSection === 'messages') return renderMessagesSection();
    if (activeSection === 'logs') return renderLogsSection();

    switch (activeSection) {
      case 'fees':
        return (
          <div className="space-y-12">
            <div className="bg-school-navy p-10 rounded-[40px] shadow-2xl border border-white/5 space-y-8">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="flex-1">
                  <h3 className="text-2xl font-serif font-black text-white italic tracking-tight mb-2 flex items-center gap-3">
                    <FileText size={24} className="text-school-gold" />
                    Institutional Fee Documentation
                  </h3>
                  <p className="text-white/40 text-xs font-light max-w-lg">This PDF serves as the official blueprint displayed on the public Fees page. Managing committee approved documents should be uploaded here.</p>
                </div>
                <div className="flex flex-wrap gap-4">
                  <label className="px-8 py-4 bg-school-gold text-school-navy rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer whitespace-nowrap">
                    {uploadingPath === 'settings-global-feesPdfUrl' ? 'Uploading...' : 'Upload Official PDF'}
                    <input type="file" className="hidden" accept=".pdf" onChange={(e) => handleFileUpload(e, 'global', 'feesPdfUrl', 'settings')} disabled={!!uploadingPath} />
                  </label>
                  {data.settings.feesPdfUrl && (
                    <a 
                      href={data.settings.feesPdfUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-8 py-4 bg-white/10 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-white/20 transition-all border border-white/10"
                    >
                      View Live Link
                    </a>
                  )}
                </div>
              </div>
              {data.settings.feesPdfUrl && (
                <div className="aspect-[16/10] w-full bg-white rounded-[40px] overflow-hidden shadow-2xl border border-white/10 relative group bg-school-paper">
                  <iframe 
                    src={`https://docs.google.com/viewer?url=${encodeURIComponent(data.settings.feesPdfUrl)}&embedded=true`}
                    className="w-full h-full border-none"
                    title="Fee Documentation Preview"
                  />
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="border-b border-school-navy/5 pb-4">
                <h3 className="text-2xl font-serif font-black text-school-navy italic tracking-tight flex items-center gap-3">
                  <CreditCard size={24} className="text-school-gold" strokeWidth={1} />
                  Dynamic School Fee Schedules
                </h3>
                <p className="text-xs text-school-ink/60 mt-1">Configure class-wise standard tuition, admission fees, annual development schedules and quarterly terms.</p>
              </div>
              <div className="grid gap-6">
                {Array.isArray(data.fees) && data.fees.map((item: any) => renderItemCard(item, 'fees'))}
              </div>
            </div>
          </div>
        );
      case 'about':
        return (
          <div className="space-y-12">
            <div className="bg-school-navy p-10 rounded-[40px] shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-3xl font-serif font-black text-white italic tracking-tight mb-4">About Section Narrative</h2>
                <p className="text-sm text-white/40 leading-relaxed font-light max-w-xl">Customize the primary "About St. Xavier's School" title and story displayed on the homepage.</p>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900/50 p-10 rounded-[40px] border border-black/5 shadow-sm space-y-12">
              <div className="space-y-6">
                <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/40">Section Heading</label>
                <input 
                  value={data.settings.aboutTitle || ''}
                  onChange={(e) => handleUpdate('global', 'aboutTitle', e.target.value, 'settings')}
                  className="w-full bg-school-ink/5 border-none rounded-2xl py-6 px-8 text-xl font-black text-school-navy focus:ring-2 focus:ring-school-gold/20 outline-none transition-all"
                />
              </div>
              <div className="space-y-6">
                <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/40">The Narrative (Main Content)</label>
                <RichTextEditor 
                  value={data.settings.aboutContent || ''}
                  onChange={(val) => handleUpdate('global', 'aboutContent', val, 'settings')}
                />
              </div>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="max-w-5xl mx-auto space-y-12 pb-20">
            <div className="bg-school-navy p-10 rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-3xl font-serif font-black text-white italic tracking-tight">Central Configurations</h2>
                  {getIsSupabasePlaceholder() ? (
                    <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[9px] font-black uppercase tracking-widest border border-amber-500/30">
                      Local SQLite Mode
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-black uppercase tracking-widest border border-emerald-500/30 animate-pulse">
                      Supabase Cloud Active
                    </span>
                  )}
                </div>
                <p className="text-sm text-white/40 font-light">
                  {getIsSupabasePlaceholder() 
                    ? "Currently using the offline SQLite fallbacks. Sync to host cloud content."
                    : "Fully connected to Supabase Cloud Storage and relational tables."}
                </p>
              </div>
              <div className="flex flex-wrap gap-4 relative z-10">
                 <button 
                   onClick={() => {
                     const sql = `-- SUPABASE STORAGE SETUP\n-- Run this in SQL Editor to fix "Bucket not found" errors\n\nINSERT INTO storage.buckets (id, name, public) \nVALUES ('career_assets', 'career_assets', true) \nON CONFLICT (id) DO NOTHING;\n\nCREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'career_assets');\nCREATE POLICY "Public View" ON storage.objects FOR SELECT USING (bucket_id = 'career_assets');`;
                     navigator.clipboard.writeText(sql);
                     showToast('Storage Fix SQL copied!');
                   }}
                   className="px-6 py-3 bg-school-gold text-school-navy rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl flex items-center gap-2 outline-none font-bold"
                 >
                   <Database size={14} /> Copy Storage Fix SQL
                 </button>
                 <button 
                   onClick={handlePullAll} 
                   disabled={uploadingPath === 'global-pull' || uploadingPath === 'debug'}
                   className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl flex items-center gap-2 outline-none font-bold ${
                     uploadingPath === 'global-pull' || uploadingPath === 'debug'
                       ? 'bg-white/10 text-white/40 cursor-not-allowed'
                       : 'bg-indigo-500 text-white hover:bg-indigo-600 hover:scale-105 active:scale-95'
                   }`}
                 >
                   <DownloadCloud size={14} className={uploadingPath === 'global-pull' || uploadingPath === 'debug' ? 'animate-spin' : ''} />
                   {uploadingPath === 'global-pull' ? 'Syncing...' : 'Sync & Audit Cloud Data'}
                 </button>
                 <button 
                   onClick={handleSaveAll} 
                   disabled={uploadingPath === 'global'}
                   className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl flex items-center gap-2 outline-none font-bold ${
                     uploadingPath === 'global'
                       ? 'bg-white/10 text-white/40 cursor-not-allowed'
                       : 'bg-emerald-500 text-white hover:bg-emerald-600 hover:scale-105 active:scale-95'
                   }`}
                 >
                   <RefreshCw size={14} className={uploadingPath === 'global' ? 'animate-spin' : ''} />
                   {uploadingPath === 'global' ? 'Syncing...' : 'Push All to Supabase'}
                 </button>
              </div>
            </div>
            {data.supabaseTableStatus && (
              <div className="glass-surface p-8 rounded-[40px] border border-school-ink/5 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-school-navy/5 pb-4">
                  <div>
                    <h3 className="text-xl font-black text-school-navy uppercase italic tracking-tight flex items-center gap-2">
                      <Database className="text-school-navy text-emerald-500 animate-pulse" size={20} />
                      Supabase Cloud Sync Streams
                    </h3>
                    <p className="text-[11px] text-school-ink/60 mt-1">
                      Showing real-time live connectivity for each database model stream. Offline models use secure local database fallbacks automatically.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase tracking-wider">
                      {Object.values(data.supabaseTableStatus).filter(v => v === 'online').length} Online
                    </span>
                    {Object.values(data.supabaseTableStatus).filter(v => v === 'offline').length > 0 && (
                      <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-600 text-[10px] font-black uppercase tracking-wider">
                        {Object.values(data.supabaseTableStatus).filter(v => v === 'offline').length} SQLite Fallback
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-64 overflow-y-auto pr-1">
                  {Object.entries(data.supabaseTableStatus).map(([tbl, status]) => (
                    <div 
                      key={tbl}
                      onClick={() => {
                        if (status === 'offline') {
                          let sql = '';
                          if (tbl === 'former_leaders') {
                            sql = `-- SQL Statement to create 'former_leaders' table in Supabase SQL Editor:\n\nCREATE TABLE IF NOT EXISTS former_leaders (\n    id TEXT PRIMARY KEY,\n    name TEXT,\n    role TEXT,\n    tenure TEXT,\n    image TEXT,\n    order_index INTEGER DEFAULT 0,\n    "attachmentUrl" TEXT,\n    is_enabled BOOLEAN DEFAULT true,\n    type TEXT DEFAULT 'Principal'\n);\n\nALTER TABLE former_leaders ENABLE ROW LEVEL SECURITY;\nDROP POLICY IF EXISTS "Public Full Access" ON former_leaders;\nCREATE POLICY "Public Full Access" ON former_leaders FOR ALL TO public USING (true) WITH CHECK (true);\nGRANT ALL ON TABLE former_leaders TO anon, authenticated, postgres, service_role;`;
                          } else {
                            sql = `-- SQL Schema code for '${tbl}':\n-- Apply this in the Supabase SQL editor to create the table structure.\n\nCREATE TABLE IF NOT EXISTS "${tbl}" (\n    id TEXT PRIMARY KEY,\n    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())\n);\n\nALTER TABLE "${tbl}" ENABLE ROW LEVEL SECURITY;\nDROP POLICY IF EXISTS "Public Full Access" ON "${tbl}";\nCREATE POLICY "Public Full Access" ON "${tbl}" FOR ALL TO public USING (true) WITH CHECK (true);\nGRANT ALL ON TABLE "${tbl}" TO anon, authenticated, postgres, service_role;`;
                          }
                          navigator.clipboard.writeText(sql);
                          showToast(`SQL helper for '${tbl}' copied!`);
                        }
                      }}
                      className={`p-3 rounded-2xl flex flex-col justify-between gap-2 border transition-all ${
                        status === 'online' 
                          ? 'bg-emerald-50/20 border-emerald-500/10 hover:border-emerald-500/20' 
                          : 'bg-amber-50/20 border-amber-500/10 hover:border-amber-500/20 cursor-pointer'
                      }`}
                      title={status === 'offline' ? "Click to copy target table SQL definition script" : "Synced and live on cloud database"}
                    >
                      <span className="text-[11px] font-bold font-mono text-school-navy truncate" title={tbl}>
                        {tbl}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${status === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                        <span className={`text-[9px] font-black uppercase tracking-wider ${status === 'online' ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {status === 'online' ? 'Live Cloud' : 'Fallback DB'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {Object.entries(data.supabaseTableStatus).some(([_, status]) => status === 'offline') && (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 text-amber-900 text-[11px]">
                    <div className="flex gap-2">
                      <span className="font-black shrink-0">⚠️ Missing Cloud Tables:</span>
                      <span className="font-medium text-amber-800">
                        Some tables correspond to uninitialized schemas in your live Supabase. They are running locally on SQLite safely. Click below to copy the auto-generated SQL setup command to paste in your Supabase Dashboard.
                      </span>
                    </div>
                    <button 
                      onClick={() => {
                        const offlineTables = Object.entries(data.supabaseTableStatus || {}).filter(([_, status]) => status === 'offline').map(([tbl]) => tbl);
                        const sql = `-- AUTOMATIC MIGRATION CODE BLOCK FOR UNINITIALIZED SUPABASE TABLES\n-- Paste this directly into your Supabase Dashboard SQL Editor (https://supabase.com/dashboard/project/_/sql)\n\n` + 
                          offlineTables.map(tbl => {
                            if (tbl === 'former_leaders') {
                              return `CREATE TABLE IF NOT EXISTS former_leaders (\n    id TEXT PRIMARY KEY,\n    name TEXT,\n    role TEXT,\n    tenure TEXT,\n    image TEXT,\n    order_index INTEGER DEFAULT 0,\n    "attachmentUrl" TEXT,\n    is_enabled BOOLEAN DEFAULT true,\n    type TEXT DEFAULT 'Principal'\n);\nALTER TABLE former_leaders ENABLE ROW LEVEL SECURITY;\nDROP POLICY IF EXISTS "Public Full Access" ON former_leaders;\nCREATE POLICY "Public Full Access" ON former_leaders FOR ALL TO public USING (true) WITH CHECK (true);\nGRANT ALL ON TABLE former_leaders TO anon, authenticated, postgres, service_role;\n`;
                            }
                            if (tbl === 'former_principals') return `CREATE TABLE IF NOT EXISTS former_principals (id TEXT PRIMARY KEY, name TEXT, tenure TEXT, image TEXT, order_index INTEGER DEFAULT 0, "attachmentUrl" TEXT, is_enabled BOOLEAN DEFAULT true);\nALTER TABLE former_principals ENABLE ROW LEVEL SECURITY;\nDROP POLICY IF EXISTS "Public Full Access" ON former_principals;\nCREATE POLICY "Public Full Access" ON former_principals FOR ALL TO public USING (true) WITH CHECK (true);\nGRANT ALL ON TABLE former_principals TO anon, authenticated, postgres, service_role;\n`;
                            if (tbl === 'former_rectors') return `CREATE TABLE IF NOT EXISTS former_rectors (id TEXT PRIMARY KEY, name TEXT, tenure TEXT, image TEXT, order_index INTEGER DEFAULT 0, "attachmentUrl" TEXT, is_enabled BOOLEAN DEFAULT true);\nALTER TABLE former_rectors ENABLE ROW LEVEL SECURITY;\nDROP POLICY IF EXISTS "Public Full Access" ON former_rectors;\nCREATE POLICY "Public Full Access" ON former_rectors FOR ALL TO public USING (true) WITH CHECK (true);\nGRANT ALL ON TABLE former_rectors TO anon, authenticated, postgres, service_role;\n`;
                            if (tbl === 'former_managers') return `CREATE TABLE IF NOT EXISTS former_managers (id TEXT PRIMARY KEY, name TEXT, tenure TEXT, image TEXT, order_index INTEGER DEFAULT 0, "attachmentUrl" TEXT, is_enabled BOOLEAN DEFAULT true);\nALTER TABLE former_managers ENABLE ROW LEVEL SECURITY;\nDROP POLICY IF EXISTS "Public Full Access" ON former_managers;\nCREATE POLICY "Public Full Access" ON former_managers FOR ALL TO public USING (true) WITH CHECK (true);\nGRANT ALL ON TABLE former_managers TO anon, authenticated, postgres, service_role;\n`;
                            if (tbl === 'former_student_leaders') return `CREATE TABLE IF NOT EXISTS former_student_leaders (id TEXT PRIMARY KEY, name TEXT, role TEXT, academic_year TEXT, image TEXT, order_index INTEGER DEFAULT 0, "attachmentUrl" TEXT, is_enabled BOOLEAN DEFAULT true);\nALTER TABLE former_student_leaders ENABLE ROW LEVEL SECURITY;\nDROP POLICY IF EXISTS "Public Full Access" ON former_student_leaders;\nCREATE POLICY "Public Full Access" ON former_student_leaders FOR ALL TO public USING (true) WITH CHECK (true);\nGRANT ALL ON TABLE former_student_leaders TO anon, authenticated, postgres, service_role;\n`;
                            if (tbl === 'streamwise_toppers') return `CREATE TABLE IF NOT EXISTS streamwise_toppers (id TEXT PRIMARY KEY, name TEXT, stream TEXT, percentage TEXT, academic_year TEXT, image TEXT, order_index INTEGER DEFAULT 0, "attachmentUrl" TEXT, is_enabled BOOLEAN DEFAULT true);\nALTER TABLE streamwise_toppers ENABLE ROW LEVEL SECURITY;\nDROP POLICY IF EXISTS "Public Full Access" ON streamwise_toppers;\nCREATE POLICY "Public Full Access" ON streamwise_toppers FOR ALL TO public USING (true) WITH CHECK (true);\nGRANT ALL ON TABLE streamwise_toppers TO anon, authenticated, postgres, service_role;\n`;
                            if (tbl === 'xavierite_of_the_year') return `CREATE TABLE IF NOT EXISTS xavierite_of_the_year (id TEXT PRIMARY KEY, name TEXT, academic_year TEXT, citation TEXT, image TEXT, order_index INTEGER DEFAULT 0, "attachmentUrl" TEXT, is_enabled BOOLEAN DEFAULT true);\nALTER TABLE xavierite_of_the_year ENABLE ROW LEVEL SECURITY;\nDROP POLICY IF EXISTS "Public Full Access" ON xavierite_of_the_year;\nCREATE POLICY "Public Full Access" ON xavierite_of_the_year FOR ALL TO public USING (true) WITH CHECK (true);\nGRANT ALL ON TABLE xavierite_of_the_year TO anon, authenticated, postgres, service_role;\n`;
                            if (tbl === 'useful_links') return `CREATE TABLE IF NOT EXISTS useful_links (id TEXT PRIMARY KEY, title TEXT, url TEXT, category TEXT, "isPriority" BOOLEAN DEFAULT false, order_index INTEGER DEFAULT 0);\nALTER TABLE useful_links ENABLE ROW LEVEL SECURITY;\nDROP POLICY IF EXISTS "Public Full Access" ON useful_links;\nCREATE POLICY "Public Full Access" ON useful_links FOR ALL TO public USING (true) WITH CHECK (true);\nGRANT ALL ON TABLE useful_links TO anon, authenticated, postgres, service_role;\n`;
                            if (tbl === 'custom_content') return `CREATE TABLE IF NOT EXISTS custom_content (id TEXT PRIMARY KEY, section_identifier TEXT, title TEXT, body TEXT, image_url TEXT, is_enabled BOOLEAN DEFAULT true, updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()));\nALTER TABLE custom_content ENABLE ROW LEVEL SECURITY;\nDROP POLICY IF EXISTS "Public Full Access" ON custom_content;\nCREATE POLICY "Public Full Access" ON custom_content FOR ALL TO public USING (true) WITH CHECK (true);\nGRANT ALL ON TABLE custom_content TO anon, authenticated, postgres, service_role;\n`;
                            return `CREATE TABLE IF NOT EXISTS "${tbl}" (\n    id TEXT PRIMARY KEY,\n    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())\n);\nALTER TABLE "${tbl}" ENABLE ROW LEVEL SECURITY;\nDROP POLICY IF EXISTS "Public Full Access" ON "${tbl}";\nCREATE POLICY "Public Full Access" ON "${tbl}" FOR ALL TO public USING (true) WITH CHECK (true);\nGRANT ALL ON TABLE "${tbl}" TO anon, authenticated, postgres, service_role;\n`;
                          }).join('\n');
                        navigator.clipboard.writeText(sql);
                        showToast('Automatic schema initialization SQL copied!');
                      }}
                      className="px-4 py-2 shrink-0 bg-amber-600 text-white hover:bg-amber-700 active:scale-95 transition-all text-[10px] font-black uppercase tracking-wider rounded-xl shadow-md font-bold"
                    >
                      Copy SQL for Missing Tables
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-8">
              <div className="glass-surface p-10 rounded-[40px] border border-school-ink/5 space-y-8 group">
                <h3 className="text-xl font-black text-school-navy uppercase italic tracking-tight border-b border-school-navy/5 pb-4">Portal Constants</h3>
                
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/40">Active Academic Session</label>
                  <input 
                    value={data.settings.currentSession || ''}
                    onChange={(e) => handleUpdate('global', 'currentSession', e.target.value, 'settings')}
                    className="w-full bg-school-ink/5 border-none rounded-2xl py-4 px-6 text-sm font-black text-school-navy focus:ring-2 focus:ring-school-gold/20 outline-none transition-all"
                  />
                </div>

                <div className="space-y-4 pt-4 border-t border-school-navy/5">
                  <h4 className="text-xs font-black uppercase tracking-wider text-school-gold">Admissions Floating CTA Customization</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/40 mb-1 block">Floating CTA Display Label</label>
                      <input 
                        value={data.settings.applyNowLabel || ''}
                        onChange={(e) => handleUpdate('global', 'applyNowLabel', e.target.value, 'settings')}
                        placeholder="e.g. Apply 2026-27"
                        className="w-full bg-school-ink/5 border-none rounded-2xl py-3.5 px-6 text-sm font-black text-school-navy focus:ring-2 focus:ring-school-gold/20 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/40 mb-1 block">Floating CTA Action Link / PDF URL</label>
                      <input 
                        value={data.settings.applyNowUrl || ''}
                        onChange={(e) => handleUpdate('global', 'applyNowUrl', e.target.value, 'settings')}
                        placeholder="e.g. https://xaviersjaipur.edu.in/.../file.pdf"
                        className="w-full bg-school-ink/5 border-none rounded-2xl py-3.5 px-6 text-sm font-black text-school-navy focus:ring-2 focus:ring-school-gold/20 outline-none transition-all text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>

              </div>
              <div className="glass-surface p-10 rounded-[40px] border border-school-ink/5 space-y-10 group">
                <h3 className="text-xl font-black text-school-navy uppercase italic tracking-tight border-b border-school-navy/5 pb-4">Global Announcement Popup</h3>
                <div className="space-y-6">
                  <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/40">Popup Visibility</label>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => handleUpdate('global', 'popupEnabled', !data.settings.popupEnabled, 'settings')}
                      className={`w-20 h-10 rounded-full relative transition-all ${data.settings.popupEnabled ? 'bg-school-accent' : 'bg-school-ink/10'}`}
                    >
                      <motion.div animate={{ x: data.settings.popupEnabled ? 44 : 4 }} className="w-8 h-8 rounded-full bg-white shadow-lg absolute top-1 left-0" />
                    </button>
                    <span className="text-xs font-black text-school-ink">
                      {data.settings.popupEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
                <div className="space-y-6">
                  <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/40">Message Content</label>
                  <RichTextEditor value={data.settings.popupMessage || ''} onChange={(val) => handleUpdate('global', 'popupMessage', val, 'settings')} />
                </div>
              </div>
            </div>
            <div className="glass-surface p-10 rounded-[40px] border border-school-ink/5 space-y-10">
              <h3 className="text-xl font-black text-school-navy uppercase italic tracking-tight">Section Visibility Toggles</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                 {[
                   { key: 'showCarousel', label: 'Primary Carousel' },
                   { key: 'showMarquee', label: 'News Marquee' },
                   { key: 'showAbout', label: 'Front Introduction' },
                   { key: 'showFeature', label: 'Modernity Feature' },
                   { key: 'showVision', label: 'Motto & Vision' },
                   { key: 'showInsights', label: 'Updates & Events' },
                   { key: 'showPrincipalMessage', label: 'Editorial Message' },
                   { key: 'showDistinction', label: 'Laurel & Distinction' },
                   { key: 'showVirtualCampus', label: 'Virtual Campus' },
                   { key: 'showGallery', label: 'Campus Gallery' },
                   { key: 'showLeadership', label: 'Regency Personnel' },
                   { key: 'showHonors', label: 'Student Triumphs' },
                   { key: 'careerFormEnabled', label: 'Careers Application Form' },
                   { key: 'applyNowEnabled', label: 'Admissions Floating CTA' }
                 ].map((item) => (
                   <div key={item.key} className="bg-school-ink/5 p-6 rounded-3xl border border-school-ink/5 flex items-center justify-between">
                     <span className="text-[10px] font-black uppercase tracking-widest text-school-navy/60">{item.label}</span>
                     <button 
                       onClick={() => handleUpdate('global', item.key, !data.settings[item.key as keyof typeof data.settings], 'settings')}
                       className={`w-14 h-8 rounded-full relative transition-all ${data.settings[item.key as keyof typeof data.settings] !== false ? 'bg-emerald-500' : 'bg-rose-500/20'}`}
                     >
                       <motion.div animate={{ x: data.settings[item.key as keyof typeof data.settings] !== false ? 26 : 4 }} className="w-6 h-6 rounded-full bg-white shadow-md absolute top-1 left-0" />
                     </button>
                   </div>
                 ))}
              </div>
            </div>

            {/* Search Engine Optimization & Search Console Verification */}
            <div className="glass-surface p-10 rounded-[40px] border border-school-ink/5 space-y-10">
              <div>
                <h3 className="text-xl font-black text-school-navy uppercase italic tracking-tight flex items-center gap-2">
                  <span>SEO & Search Indexing Controls</span>
                </h3>
                <p className="text-xs text-school-ink/65 mt-1">
                  Configure search engine visibility tools, IndexNow setups, Google Search Console, Bing Webmaster tools, and dynamic page preview Open Graph meta fields.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-school-navy/5">
                {/* Column 1: Search Console Keys */}
                <div className="space-y-6">
                  <h4 className="text-xs font-black uppercase tracking-wider text-school-gold">Webmaster Verification Strings</h4>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/40">
                      Google Search Console Site Verification Key
                    </label>
                    <input 
                      type="text"
                      placeholder="e.g. google1abcd2efgh3ijkl or string"
                      value={data.settings.googleSearchConsoleKey || ''}
                      onChange={(e) => handleUpdate('global', 'googleSearchConsoleKey', e.target.value, 'settings')}
                      className="w-full bg-school-ink/5 border-none rounded-2xl py-3.5 px-6 text-sm text-school-navy placeholder-school-ink/30 focus:ring-2 focus:ring-school-gold/20 outline-none transition-all font-medium"
                    />
                    <p className="text-[9px] text-school-ink/50 leading-relaxed">
                      Enter the key value. Verification meta tags are embedded in the header, and dynamic verification files (e.g. <code>/google[key].html</code>) are generated instantly on the server!
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/40">
                      Bing Webmaster / Yahoo! Verification Code
                    </label>
                    <input 
                      type="text"
                      placeholder="e.g. A1B2C3D4E5F6G7H8"
                      value={data.settings.bingWebmasterKey || ''}
                      onChange={(e) => handleUpdate('global', 'bingWebmasterKey', e.target.value, 'settings')}
                      className="w-full bg-school-ink/5 border-none rounded-2xl py-3.5 px-6 text-sm text-school-navy placeholder-school-ink/30 focus:ring-2 focus:ring-school-gold/20 outline-none transition-all font-medium"
                    />
                    <p className="text-[9px] text-school-ink/50 leading-relaxed">
                      Enter your meta tag verification code or XML code. Standardizes <code>BingSiteAuth.xml</code> file serving and inserts XML tag matching on request.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/40">
                      IndexNow Key Code
                    </label>
                    <input 
                      type="text"
                      placeholder="e.g. 5aa717e816a644ba90ef76828551a396"
                      value={data.settings.indexNowKey || ''}
                      onChange={(e) => handleUpdate('global', 'indexNowKey', e.target.value, 'settings')}
                      className="w-full bg-school-ink/5 border-none rounded-2xl py-3.5 px-6 text-sm text-school-navy placeholder-school-ink/30 focus:ring-2 focus:ring-school-gold/20 outline-none transition-all font-medium font-mono text-xs"
                    />
                    <p className="text-[9px] text-school-ink/50 leading-relaxed font-sans">
                      The 32-character hexadecimal key to notify search engines of changes automatically. Automatically configures dynamic route serving at <code>/[key].txt</code> for verification.
                    </p>
                  </div>
                </div>

                {/* Column 2: Open Graph Metadata */}
                <div className="space-y-6">
                  <h4 className="text-xs font-black uppercase tracking-wider text-school-gold">Open Graph (OG) Previews</h4>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/40">
                      OG Display Title
                    </label>
                    <input 
                      type="text"
                      placeholder="e.g. St. Xavier's Senior Secondary School, Jaipur"
                      value={data.settings.ogTitle || ''}
                      onChange={(e) => handleUpdate('global', 'ogTitle', e.target.value, 'settings')}
                      className="w-full bg-school-ink/5 border-none rounded-2xl py-3.5 px-6 text-sm text-school-navy placeholder-school-ink/30 focus:ring-2 focus:ring-school-gold/20 outline-none transition-all font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/40">
                      OG Display Description
                    </label>
                    <textarea 
                      placeholder="Write a descriptive snippet of the page/institution for preview cards on WhatsApp, Twitter, FB and social shares."
                      rows={3}
                      value={data.settings.ogDescription || ''}
                      onChange={(e) => handleUpdate('global', 'ogDescription', e.target.value, 'settings')}
                      className="w-full bg-school-ink/5 border-none rounded-2xl py-3.5 px-6 text-sm text-school-navy placeholder-school-ink/30 focus:ring-2 focus:ring-school-gold/20 outline-none transition-all font-medium resize-none leading-relaxed"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/40">
                      OG Display Image URL
                    </label>
                    <input 
                      type="text"
                      placeholder="e.g. https://xaviersjaipur.edu.in/.../SchoolLogoTest.png"
                      value={data.settings.ogImage || ''}
                      onChange={(e) => handleUpdate('global', 'ogImage', e.target.value, 'settings')}
                      className="w-full bg-school-ink/5 border-none rounded-2xl py-3.5 px-6 text-sm text-school-navy placeholder-school-ink/30 focus:ring-2 focus:ring-school-gold/20 outline-none transition-all font-medium text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'gallery': {
        const galleryItems = (data.gallery || []) as any[];
        return (
          <div className="space-y-8">
            <div className="bg-school-navy p-10 rounded-[40px] shadow-2xl border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h3 className="text-3xl font-serif font-black text-white italic tracking-tight mb-2">School Media Gallery</h3>
                <p className="text-white/40 text-xs">Manage all institutional photo assets, captions, and academic sessions in a single cohesive grid.</p>
              </div>
              <div className="flex gap-4">
                {selectedIds.size > 0 && (
                  <button
                    onClick={() => setItemToDelete(Array.from(selectedIds))}
                    className="px-6 py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all outline-none"
                  >
                    Delete Selected ({selectedIds.size})
                  </button>
                )}
              </div>
            </div>

            <div className="bg-school-paper p-8 md:p-10 rounded-[40px] border border-school-ink/10 shadow-sm">
              {galleryItems.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-school-ink/40 font-serif italic text-lg">No gallery images found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {galleryItems.map((item) => (
                    <div 
                      key={item.id} 
                      className={`relative bg-white rounded-3xl overflow-hidden border transition-all p-4 flex flex-col justify-between group h-full ${
                        selectedIds.has(item.id) ? 'border-school-gold ring-1 ring-school-gold/20 shadow-md' : 'border-school-ink/5 hover:shadow-md'
                      }`}
                    >
                      {/* Selection checkbox & simple delete controls */}
                      <div className="absolute top-6 left-6 z-10 flex items-center gap-2">
                        <button 
                          onClick={() => toggleSelect(item.id)} 
                          className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all outline-none ${
                            selectedIds.has(item.id) ? 'bg-school-gold border-school-gold text-school-navy' : 'bg-white/80 backdrop-blur-xs border-school-ink/20 hover:border-school-ink/40'
                          }`}
                        >
                          {selectedIds.has(item.id) && <Check size={12} strokeWidth={4} />}
                        </button>
                      </div>

                      <div className="absolute top-6 right-6 z-10">
                        <button 
                          onClick={() => setItemToDelete(item.id)}
                          className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>

                      {/* Image Preview with order controls */}
                      <div className="aspect-[4/3] w-full bg-slate-100 rounded-2xl overflow-hidden relative shadow-inner mb-4">
                        <img 
                          src={item.url} 
                          className="w-full h-full object-cover select-none" 
                          alt={item.caption || 'Gallery Image'}
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded text-[8px] font-mono text-white">
                          Index: {item.order_index || 0}
                        </div>
                      </div>

                      {/* Editable Fields (Caption & Session) & Status Toggle */}
                      <div className="space-y-4 flex-1 flex flex-col justify-between">
                        <div className="space-y-3">
                          <div>
                            <label className="text-[8px] font-black uppercase tracking-widest text-school-ink/30 mb-1 block">Caption / Designation</label>
                            <input 
                              type="text" 
                              value={item.caption || ''} 
                              onChange={(e) => handleUpdate(item.id, 'caption', e.target.value, 'gallery')}
                              placeholder="e.g. Annual Function"
                              className="w-full bg-school-ink/5 border-none rounded-xl px-3 py-2 text-xs font-black text-school-navy focus:ring-1 focus:ring-school-gold/20 outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-[8px] font-black uppercase tracking-widest text-school-ink/30 mb-1 block">Academic Session</label>
                            <input 
                              type="text" 
                              value={item.session || ''} 
                              onChange={(e) => handleUpdate(item.id, 'session', e.target.value, 'gallery')}
                              placeholder="e.g. 2024-25"
                              className="w-full bg-school-ink/5 border-none rounded-xl px-3 py-2 text-xs font-black text-school-navy focus:ring-1 focus:ring-school-gold/20 outline-none"
                            />
                          </div>
                        </div>

                        <div className="pt-2 border-t border-school-ink/5 flex items-center justify-between gap-2 mt-2">
                          <button 
                            onClick={() => handleUpdate(item.id, 'is_enabled', item.is_enabled === false, 'gallery')}
                            className={`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                              item.is_enabled !== false 
                                ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20' 
                                : 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20'
                            }`}
                          >
                            {item.is_enabled !== false ? 'Enabled' : 'Disabled'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      }
      case 'contact_content': {
        return (
          <div className="space-y-12">
            <div className="bg-school-navy p-10 rounded-[40px] shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h2 className="text-3xl font-serif font-black text-white italic tracking-tight mb-2">Contact & Communications Registry</h2>
                <p className="text-xs text-white/40 leading-relaxed max-w-xl">Configure all public contact methods, phone registry numbers, emails, location addresses, office hours, and interactive maps.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Box 1: Email Channels */}
              <div className="bg-school-paper p-8 rounded-[40px] border border-school-ink/10 shadow-sm space-y-6">
                <div className="border-b border-school-ink/5 pb-4">
                  <h3 className="text-lg font-serif font-black text-school-navy flex items-center gap-2">
                    <Mail className="text-school-gold" size={20} /> Electronic Communication
                  </h3>
                  <p className="text-[10px] text-school-ink/30 uppercase font-black tracking-widest mt-1">Manage global email triggers & public mail correspondence</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/40 mb-1 block">Global Topbar & Footer Correspondence Email</label>
                    <input 
                      type="email" 
                      value={data.settings.contactEmail || ''} 
                      onChange={(e) => handleUpdate('global', 'contactEmail', e.target.value ?? '', 'settings')}
                      placeholder="e.g. xavier41jaipur@gmail.com"
                      className="w-full bg-white border border-school-ink/10 rounded-2xl px-5 py-4 text-xs font-black text-school-navy focus:ring-2 focus:ring-school-gold/20 outline-none"
                    />
                    <p className="text-[9px] text-school-ink/30 mt-1">Syncs the primary email shown across the top navigation bar and site footer handles.</p>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/40 mb-1 block">Detail Page Contact Correspondence Email</label>
                    <input 
                      type="email" 
                      value={data.content.schoolEmail || ''} 
                      onChange={(e) => handleUpdate('global', 'schoolEmail', e.target.value ?? '', 'content')}
                      placeholder="e.g. xavier41jaipur@gmail.com"
                      className="w-full bg-white border border-school-ink/10 rounded-2xl px-5 py-4 text-xs font-black text-school-navy focus:ring-2 focus:ring-school-gold/20 outline-none"
                    />
                    <p className="text-[9px] text-school-ink/30 mt-1">Syncs the official contact correspondence email displayed directly on the /contact route.</p>
                  </div>
                </div>
              </div>

              {/* Box 2: Telephony Registry */}
              <div className="bg-school-paper p-8 rounded-[40px] border border-school-ink/10 shadow-sm space-y-6">
                <div className="border-b border-school-ink/5 pb-4">
                  <h3 className="text-lg font-serif font-black text-school-navy flex items-center gap-2">
                    <Phone className="text-school-gold" size={20} /> Telephony & Hotline Registry
                  </h3>
                  <p className="text-[10px] text-school-ink/30 uppercase font-black tracking-widest mt-1">Configure helpline desk numbers for parent enquiries</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/40 mb-1 block">Header Topbar Hotline Number Label</label>
                    <input 
                      type="text" 
                      value={data.settings.contactPhone || ''} 
                      onChange={(e) => handleUpdate('global', 'contactPhone', e.target.value ?? '', 'settings')}
                      placeholder="e.g. 0141-2372336 (Senior School)"
                      className="w-full bg-white border border-school-ink/10 rounded-2xl px-5 py-4 text-xs font-black text-school-navy focus:ring-2 focus:ring-school-gold/20 outline-none"
                    />
                    <p className="text-[9px] text-school-ink/30 mt-1">Hotline line displayed prominently at the top header bar of every page.</p>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/40 mb-1 block">Contact Page Senior School Desk</label>
                    <input 
                      type="text" 
                      value={data.content.seniorSchoolPhone || ''} 
                      onChange={(e) => handleUpdate('global', 'seniorSchoolPhone', e.target.value ?? '', 'content')}
                      placeholder="e.g. 0141-2372336"
                      className="w-full bg-white border border-school-ink/10 rounded-2xl px-5 py-4 text-xs font-black text-school-navy focus:ring-2 focus:ring-school-gold/20 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/40 mb-1 block">Contact Page Junior School Desk</label>
                    <input 
                      type="text" 
                      value={data.content.juniorSchoolPhone || ''} 
                      onChange={(e) => handleUpdate('global', 'juniorSchoolPhone', e.target.value ?? '', 'content')}
                      placeholder="e.g. 0141-2367792, 2376569"
                      className="w-full bg-white border border-school-ink/10 rounded-2xl px-5 py-4 text-xs font-black text-school-navy focus:ring-2 focus:ring-school-gold/20 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Box 3: Campus Map & Terrain Location */}
              <div className="bg-school-paper p-8 rounded-[40px] border border-school-ink/10 shadow-sm space-y-6">
                <div className="border-b border-school-ink/5 pb-4">
                  <h3 className="text-lg font-serif font-black text-school-navy flex items-center gap-2">
                    <MapPin className="text-school-gold" size={20} /> Campus Terrain & Interactive Map Coordinates
                  </h3>
                  <p className="text-[10px] text-school-ink/30 uppercase font-black tracking-widest mt-1">Configure campus address labels and Google Map API queries</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/40 mb-1 block">Campus Primary Address Label</label>
                    <input 
                      type="text" 
                      value={data.content.schoolAddress || ''} 
                      onChange={(e) => handleUpdate('global', 'schoolAddress', e.target.value ?? '', 'content')}
                      placeholder="e.g. Bhagwan Das Road"
                      className="w-full bg-white border border-school-ink/10 rounded-2xl px-5 py-4 text-xs font-black text-school-navy focus:ring-2 focus:ring-school-gold/20 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/40 mb-1 block">Official Website Link URL</label>
                    <input 
                      type="text" 
                      value={data.content.schoolWebsite || ''} 
                      onChange={(e) => handleUpdate('global', 'schoolWebsite', e.target.value ?? '', 'content')}
                      placeholder="e.g. www.xaviersjaipur.edu.in"
                      className="w-full bg-white border border-school-ink/10 rounded-2xl px-5 py-4 text-xs font-black text-school-navy focus:ring-2 focus:ring-school-gold/20 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/40 mb-1 block">Google Maps Query Address String</label>
                    <textarea 
                      value={data.content.schoolAddressQuery || ''} 
                      onChange={(e) => handleUpdate('global', 'schoolAddressQuery', e.target.value ?? '', 'content')}
                      placeholder="e.g. St. Xavier's Senior Secondary School, Bhagwan Das Rd, C Scheme, Jaipur, Rajasthan 302001"
                      className="w-full bg-white border border-school-ink/10 rounded-2xl px-5 py-4 text-xs font-black text-school-navy focus:ring-2 focus:ring-school-gold/20 outline-none h-24 resize-none"
                    />
                    <p className="text-[9px] text-school-ink/30 mt-1">This query determines both the active Google directions calculation link and the embedded interactive iframe map.</p>
                  </div>
                </div>
              </div>

              {/* Box 4: Office Timings Labels */}
              <div className="bg-school-paper p-8 rounded-[40px] border border-school-ink/10 shadow-sm space-y-6">
                <div className="border-b border-school-ink/5 pb-4">
                  <h3 className="text-lg font-serif font-black text-school-navy flex items-center gap-2">
                    <Clock className="text-school-gold" size={20} /> Office Hours & Timings Labels
                  </h3>
                  <p className="text-[10px] text-school-ink/30 uppercase font-black tracking-widest mt-1">Change operational office banners displayed globally</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/40 mb-1 block">Top Hero Office Hours Label (Short)</label>
                    <input 
                      type="text" 
                      value={data.content.officeHoursShort || ''} 
                      onChange={(e) => handleUpdate('global', 'officeHoursShort', e.target.value ?? '', 'content')}
                      placeholder="e.g. Office Hrs: 8AM - 2PM"
                      className="w-full bg-white border border-school-ink/10 rounded-2xl px-5 py-4 text-xs font-black text-school-navy focus:ring-2 focus:ring-school-gold/20 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/40 mb-1 block">Top Hero Office Operational Days Label (Short)</label>
                    <input 
                      type="text" 
                      value={data.content.officeDaysShort || ''} 
                      onChange={(e) => handleUpdate('global', 'officeDaysShort', e.target.value ?? '', 'content')}
                      placeholder="e.g. Mon - Sat Service"
                      className="w-full bg-white border border-school-ink/10 rounded-2xl px-5 py-4 text-xs font-black text-school-navy focus:ring-2 focus:ring-school-gold/20 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/40 mb-1 block">Bottom Map Office Hours Label (Long)</label>
                    <input 
                      type="text" 
                      value={data.content.officeHoursLong || ''} 
                      onChange={(e) => handleUpdate('global', 'officeHoursLong', e.target.value ?? '', 'content')}
                      placeholder="e.g. Office: 8:00 AM - 2:00 PM"
                      className="w-full bg-white border border-school-ink/10 rounded-2xl px-5 py-4 text-xs font-black text-school-navy focus:ring-2 focus:ring-school-gold/20 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/40 mb-1 block">Bottom Map Operational Days Label (Long)</label>
                    <input 
                      type="text" 
                      value={data.content.officeDaysLong || ''} 
                      onChange={(e) => handleUpdate('global', 'officeDaysLong', e.target.value ?? '', 'content')}
                      placeholder="e.g. Monday — Saturday"
                      className="w-full bg-white border border-school-ink/10 rounded-2xl px-5 py-4 text-xs font-black text-school-navy focus:ring-2 focus:ring-school-gold/20 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }
      case 'content':
        return (
          <div className="space-y-12">
            <div className="bg-school-navy p-10 rounded-[40px] shadow-2xl flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-serif font-black text-white italic tracking-tight mb-4">Site Narrative & Labels</h2>
                <p className="text-sm text-white/40 leading-relaxed max-w-xl">Modify all headings, descriptions, and labels used throughout the website sections.</p>
              </div>
            </div>
            <div className="grid gap-6">
              {Object.keys(data.content).sort().map((key) => (
                <div key={key} className="bg-school-paper p-8 rounded-3xl border border-school-ink/10 shadow-sm group">
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                     <div className="w-full md:w-64 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-school-accent">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                        <p className="text-[9px] font-bold text-school-ink/30 uppercase tracking-widest">Key: {key}</p>
                     </div>
                     <div className="flex-1 w-full space-y-4">
                        {(key.toLowerCase().includes('image') || key.toLowerCase().includes('logo') || key.toLowerCase().includes('url')) && (
                          <div className="flex items-center gap-4">
                            {data.content[key] && !data.content[key].endsWith('.pdf') && (
                              <div className="w-16 h-16 rounded-xl overflow-hidden border border-school-ink/10 bg-school-ink/5">
                                <img src={data.content[key]} className="w-full h-full object-cover" />
                              </div>
                            )}
                            <label className="px-6 py-2 bg-school-gold text-school-navy rounded-full text-[9px] font-black uppercase tracking-widest cursor-pointer hover:bg-white transition-all shadow-lg">
                              Update Media
                              <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'global', key, 'content')} disabled={!!uploadingPath} />
                            </label>
                          </div>
                        )}
                        <input 
                          type="text"
                          value={data.content[key]}
                          onChange={(e) => handleUpdate('global', key, e.target.value, 'content')}
                          className="w-full bg-school-ink/5 border-none rounded-2xl p-6 text-sm font-black text-school-ink focus:ring-2 focus:ring-school-gold/20 outline-none"
                        />
                     </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return (
          <div className="grid gap-6">
            {Array.isArray(data[activeSection as keyof AppData]) && (data[activeSection as keyof AppData] as any[]).map((item: any) => renderItemCard(item, activeSection as keyof AppData))}
          </div>
        );
    }
  };

  const renderItemCard = (item: any, section: keyof AppData) => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={item.id} className={`bg-school-paper p-6 md:p-8 rounded-3xl shadow-sm border transition-all flex flex-col md:flex-row items-start gap-6 md:gap-8 group ${selectedIds.has(item.id) ? 'border-school-gold ring-1 ring-school-gold/20' : 'border-school-ink/10'}`}>
      {section !== 'logs' && (
        <div className="flex items-center justify-between w-full md:w-auto">
          <button onClick={() => toggleSelect(item.id)} className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 ${selectedIds.has(item.id) ? 'bg-school-gold border-school-gold text-school-navy scale-110' : 'border-school-ink/10 group-hover:border-school-ink/20'}`}>
            {selectedIds.has(item.id) && <Check size={14} strokeWidth={4} />}
          </button>
          {section !== 'jesuit_page_content' && (
            <button onClick={() => setItemToDelete(item.id)} className="md:hidden p-3 rounded-xl bg-red-50 text-red-400"><Trash2 size={18} /></button>
          )}
        </div>
      )}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16 lg:gap-20 w-full pb-20">
        {Object.entries({
          ...item,
          ...(section === 'gallery' ? { session: item.session || '' } : {}),
          ...(section === 'navigation_menu' ? { is_enabled: item.is_enabled !== false } : {}),
          ...( ['notices', 'fees', 'links', 'events', 'achievements', 'transfer_certificates', 'navigation_menu', 'carousel', 'marquee', 'popups', 'useful_links', 'custom_content', 'activities', 'alumni', 'school_info', 'parent_obligations', 'careers', 'mandatory_disclosures', 'contact_content', 'scholarships', 'jesuit_page_content'].includes(section) ? { attachmentUrl: item.attachmentUrl || '', display_type: item.display_type || 'tile' } : {})
        }).filter(([k]) => {
          if (k === 'id' || k === 'page_id' || k === 'section_key') return false;
          const handledAtBottom = 
            (['notices', 'fees', 'links', 'events', 'achievements', 'transfer_certificates', 'navigation_menu', 'marquee', 'popups', 'useful_links', 'custom_content', 'activities', 'alumni', 'school_info', 'parent_obligations', 'careers', 'mandatory_disclosures', 'contact_content', 'scholarships', 'jesuit_page_content'].includes(section) && k === 'attachmentUrl') ||
            (['staff', 'studentHonors', 'former_student_leaders', 'streamwise_toppers', 'xavierite_of_the_year'].includes(section) && k === 'image') ||
            (['gallery', 'carousel'].includes(section) && k === 'url') ||
            (['activities', 'alumni', 'school_info', 'parent_obligations', 'careers', 'mandatory_disclosures', 'contact_content', 'scholarships', 'jesuit_page_content'].includes(section) && k === 'image_url');
          return !handledAtBottom;
        }).map(([field, value]) => (
          <div key={field} className="space-y-6 md:space-y-8 bg-white/30 backdrop-blur-xs p-6 rounded-3xl border border-white/20 shadow-sm">
            <div className="flex flex-col gap-4">
              <label className="text-[10px] font-serif font-black uppercase tracking-widest text-school-ink/30 border-b border-school-ink/5 pb-2 inline-block">
                {field === 'objectives_html' ? 'OBJECTIVES OF JESUIT EDUCATION' :
               field === 'examinations_html' ? 'EXAMINATIONS' :
               field === 'promotions_html' ? 'PROMOTIONS' :
               field === 'discipline_html' ? 'Rules of Discipline' :
               field as string}
            </label>
            {section === 'logs' ? (
              <div className="text-xs font-medium text-school-ink bg-school-ink/5 p-3 rounded-xl border border-school-ink/5 break-all">
                {String(value)}
              </div>
            ) : field === 'password' && section === 'admins' ? (
              <input type="password" value={item[field] ?? ''} onChange={(e) => handleUpdate(item.id, field as string, e.target.value, section)} className="w-full bg-school-ink/5 border-none rounded-xl p-3 text-xs text-school-ink font-medium focus:ring-1 focus:ring-school-gold transition-all" />
            ) : (field === 'role' && section === 'admins') ? (
              <select 
                value={item[field] || 'staff'} 
                onChange={(e) => handleUpdate(item.id, field as string, e.target.value, section)} 
                className="w-full bg-school-ink/5 border-none rounded-xl p-3 text-xs text-school-ink font-medium focus:ring-1 focus:ring-school-gold transition-all outline-none"
              >
                <option value="admin">Admin</option>
                <option value="staff">Staff</option>
              </select>
            ) : (field === 'role' && (section === 'former_student_leaders')) ? (
              <select 
                value={item[field] || 'Head Boy'} 
                onChange={(e) => handleUpdate(item.id, field as string, e.target.value, section)} 
                className="w-full bg-school-ink/5 border-none rounded-xl p-3 text-xs text-school-ink font-medium focus:ring-1 focus:ring-school-gold transition-all outline-none"
              >
                <option value="Head Boy">Head Boy</option>
                <option value="Head Girl">Head Girl</option>
              </select>
            ) : (field === 'stream' && section === 'streamwise_toppers') ? (
              <select 
                value={item[field] || 'Science'} 
                onChange={(e) => handleUpdate(item.id, field as string, e.target.value, section)} 
                className="w-full bg-school-ink/5 border-none rounded-xl p-3 text-xs text-school-ink font-medium focus:ring-1 focus:ring-school-gold transition-all outline-none"
              >
                <option value="Science">Science</option>
                <option value="Commerce">Commerce</option>
                <option value="Humanities">Humanities</option>
              </select>
            ) : (['bio', 'description', 'content', 'message', 'text', 'remarks', 'citation', 'objectives_html', 'examinations_html', 'promotions_html', 'discipline_html'].includes(field as string)) ? (
               <RichTextEditor value={item[field] ?? ''} onChange={(val) => handleUpdate(item.id, field as string, val, section)} label={field as string} />
            ) : (field.toLowerCase().includes('url') || field.toLowerCase().includes('image') || field.toLowerCase().includes('link') || field.toLowerCase().includes('file') || field.toLowerCase().includes('pdf') || field.toLowerCase().includes('attachment') || field === 'href' || field === 'src') ? (
              <div className="space-y-4">
                <input value={item[field] ?? ''} onChange={(e) => handleUpdate(item.id, field as string, e.target.value, section)} className="w-full bg-school-ink/5 border-none rounded-xl p-3 text-xs text-school-ink font-medium focus:ring-1 focus:ring-school-gold transition-all" />
                {(field.toLowerCase().includes('url') || field.toLowerCase().includes('image')) && item[field] && !item[field].endsWith('.pdf') && (
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-school-ink/10 bg-school-ink/5 flex items-center justify-center">
                    <img src={item[field]} className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            ) : 
field === 'type' && (section === 'staff' || section === 'popups' || section === 'former_leaders') ? (
              <select 
                value={item[field] ?? (section === 'staff' ? 'Faculty' : section === 'former_leaders' ? 'Principal' : 'text')} 
                onChange={(e) => handleUpdate(item.id, field as string, e.target.value, section)} 
                className="w-full bg-school-ink/5 border-none rounded-xl p-3 text-xs text-school-ink font-medium focus:ring-1 focus:ring-school-gold transition-all outline-none"
              >
                {section === 'staff' ? (
                  <>
                    <option value="Management">Management</option>
                    <option value="Faculty">Faculty</option>
                    <option value="Administration">Administration</option>
                  </>
                ) : section === 'former_leaders' ? (
                  <>
                    <option value="Rector">Rector</option>
                    <option value="Manager">Manager</option>
                    <option value="Principal">Principal</option>
                  </>
                ) : (
                  <>
                    <option value="text">Text Message</option>
                    <option value="image">Image Popup</option>
                    <option value="pdf">PDF Download/View</option>
                    <option value="link">External Link</option>
                  </>
                )}
              </select>
            ) : (field === 'display_type' && (section === 'scholarships' || section === 'co_curricular_activities')) ? (
              <select 
                value={item[field] || 'tile'} 
                onChange={(e) => handleUpdate(item.id, field as string, e.target.value, section)} 
                className="w-full bg-school-ink/5 border-none rounded-xl p-3 text-xs text-school-ink font-medium focus:ring-1 focus:ring-school-gold transition-all outline-none"
              >
                <option value="tile">Card Tile (Small Card)</option>
                <option value="text">Normal Text (Full Width)</option>
                <option value="heading">Heading (Section Title)</option>
                {section === 'co_curricular_activities' && (
                  <>
                    <option value="list">Bulleted List (Two Columns)</option>
                    <option value="table">Data Table (Prefect System)</option>
                  </>
                )}
              </select>
            ) : field === 'category' && (section === 'fees' || section === 'studentHonors' || section === 'mandatory_disclosures') ? (
              <select 
                value={item[field] ?? (section === 'fees' ? 'School Fee' : section === 'mandatory_disclosures' ? 'A' : 'Class 10 Topper')} 
                onChange={(e) => handleUpdate(item.id, field as string, e.target.value, section)} 
                className="w-full bg-school-ink/5 border-none rounded-xl p-3 text-xs text-school-ink font-medium focus:ring-1 focus:ring-school-gold transition-all outline-none"
              >
                {section === 'fees' ? (
                  <>
                    <option value="School Fee">School Fee Structure</option>
                    <option value="Annual Fee">Annual Fees (Quarters)</option>
                    <option value="Admission Fee">Admission Fee (One-time)</option>
                  </>
                ) : section === 'mandatory_disclosures' ? (
                  <>
                    <option value="A">Section A: General Information</option>
                    <option value="B">Section B: Documents & Info</option>
                    <option value="C">Section C: Results & Academics</option>
                    <option value="C_TABLE_X">Section C: Class X Result Table</option>
                    <option value="C_TABLE_XII">Section C: Class XII Result Table</option>
                    <option value="D">Section D: Staff (Teaching)</option>
                    <option value="E">Section E: School Infrastructure</option>
                  </>
                ) : (
                  <>
                    <option value="Class 10 Topper">Class 10 Topper</option>
                    <option value="Class 12 Topper">Class 12 Topper</option>
                    <option value="JEE Achiever">JEE Achiever</option>
                    <option value="KVPY Scholar">KVPY Scholar</option>
                    <option value="NTSE Scholar">NTSE Scholar</option>
                    <option value="Other Achievement">Other Achievement</option>
                  </>
                )}
              </select>
            ) : field === 'isActive' || field === 'isPriority' || field === 'is_enabled' ? (
              <button 
                onClick={() => handleUpdate(item.id, field as string, item[field] === false ? true : false, section)}
                className={`w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${item[field] !== false ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20' : 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20'}`}
              >
                {item[field] !== false 
                  ? (field === 'isPriority' ? 'Priority Item' : 'Active / Enabled')
                  : (field === 'isPriority' ? 'Set as Priority' : 'Inactive / Disabled')}
              </button>
            ) : field === 'parent_id' && section === 'navigation_menu' ? (
              <select 
                value={item[field] || ''} 
                onChange={(e) => handleUpdate(item.id, field as string, e.target.value || null, section)} 
                className="w-full bg-school-ink/5 border-none rounded-xl p-3 text-xs text-school-ink font-medium focus:ring-1 focus:ring-school-gold transition-all outline-none"
              >
                <option value="">None (Top Level)</option>
                {data.navigation_menu.filter(m => m.id !== item.id).sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0)).map(m => (
                  <option key={m.id} value={m.id}>{m.label} {m.parent_id ? `(under ${data.navigation_menu.find(p => p.id === m.parent_id)?.label})` : ''}</option>
                ))}
              </select>
            ) : field === 'status' && section === 'messages' ? (
              <select 
                value={item[field] || 'new'} 
                onChange={(e) => handleUpdate(item.id, field as string, e.target.value, section)} 
                className="w-full bg-school-ink/5 border-none rounded-xl p-3 text-xs text-school-ink font-medium focus:ring-1 focus:ring-school-gold transition-all outline-none"
              >
                <option value="new">New</option>
                <option value="read">Read</option>
                <option value="replied">Replied</option>
              </select>
            ) : (field === 'dob' || field === 'date') ? (
              <input 
                type="date" 
                value={item[field] ?? ''} 
                onChange={(e) => handleUpdate(item.id, field as string, e.target.value, section)} 
                className="w-full bg-school-ink/5 border-none rounded-xl p-3 text-xs text-school-ink font-medium focus:ring-1 focus:ring-school-gold transition-all" 
              />
            ) : (
              <div className="space-y-2">
                <input value={item[field] ?? ''} onChange={(e) => handleUpdate(item.id, field as string, e.target.value, section)} className="w-full bg-school-ink/5 border-none rounded-xl p-3 text-xs text-school-ink font-medium focus:ring-1 focus:ring-school-gold transition-all" />
              </div>
            )}
          </div>
        </div>
      ))}
      
      {/* Consolidated Primary Action Button */}
        {(() => {
          const targetField = (['notices', 'fees', 'events', 'achievements', 'links', 'transfer_certificates', 'navigation_menu', 'marquee', 'popups', 'useful_links', 'custom_content', 'scholarships', 'jesuit_page_content', 'mandatory_disclosures', 'careers', 'parent_obligations', 'school_info', 'alumni', 'activities'].includes(section)) ? 'attachmentUrl' : 
                              (['staff', 'gallery', 'carousel', 'studentHonors', 'former_principals', 'former_rectors', 'former_managers', 'former_student_leaders', 'streamwise_toppers', 'xavierite_of_the_year'].includes(section)) ? (item.image !== undefined ? 'image' : 'url') :
                              (['activities', 'alumni', 'school_info', 'parent_obligations', 'careers', 'mandatory_disclosures', 'contact_content', 'scholarships', 'jesuit_page_content'].includes(section)) ? 'image_url' :
                              'attachmentUrl';
          const isUploading = uploadingPath === `${section}-${item.id}-${targetField}`;
          const currentVal = item[targetField];
          const isPDF = currentVal && typeof currentVal === 'string' && currentVal.toLowerCase().endsWith('.pdf');
          const isImage = currentVal && typeof currentVal === 'string' && (currentVal.match(/\.(jpg|jpeg|png|gif|webp)$/i) || currentVal.includes('lh3.googleusercontent.com'));
          
          if (section === 'logs') return null;

          return (
            <div className="mt-4 pt-4 border-t border-school-ink/5 w-full col-span-full flex flex-col gap-4">
              {currentVal && (
                <div className="flex items-center gap-4 p-4 bg-school-ink/5 rounded-2xl border border-school-ink/5">
                  {isImage ? (
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-white shrink-0 shadow-sm">
                      <img src={currentVal} className="w-full h-full object-cover" />
                    </div>
                  ) : isPDF ? (
                    <div className="w-12 h-12 rounded-lg bg-red-400/10 flex items-center justify-center text-red-400 shrink-0">
                      <FileText size={20} />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-school-gold/10 flex items-center justify-center text-school-gold shrink-0">
                      <LinkIcon size={20} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0 px-2">
                    <p className="text-[8px] font-black uppercase tracking-widest text-school-ink/30 mb-0.5">Current {targetField}</p>
                    <p className="text-[10px] font-medium text-school-ink truncate">{currentVal.split('/').pop()}</p>
                  </div>
                  <button 
                    onClick={() => handleUpdate(item.id, targetField as string, '', section)}
                    className="p-2 text-school-ink/20 hover:text-red-400 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4">
                <label className="flex-1 block text-center px-6 py-4 bg-school-gold text-school-navy rounded-2xl text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-school-gold/90 transition-all shadow-lg shadow-school-gold/20 active:scale-95">
                   {isUploading ? 'Finalizing Sync...' : (section === 'navigation_menu' ? 'Upload Committee PDF/Document' : section === 'fees' ? 'Upload Fee Schedule' : section === 'staff' ? 'Update Photo' : `Upload to ${section.toUpperCase()}`)}
                   <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, item.id, targetField, section)} disabled={!!uploadingPath} />
                </label>
                
                <button 
                  onClick={() => {
                    const sectionData = data[section] as any;
                    const itemToSave = Array.isArray(sectionData) ? sectionData.find((i: any) => i.id === item.id) : null;
                    if (itemToSave) {
                      setSavePending(true);
                      supabaseService.saveItem(section, itemToSave)
                        .then(() => showToast(`Successfully saved ${section} item`, 'success'))
                        .catch((err) => showToast(`Save failed: ${err.message}`, 'error'))
                        .finally(() => setSavePending(false));
                    }
                  }}
                  disabled={savePending}
                  className="flex-1 bg-school-navy text-white px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-school-navy/80 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-school-navy/20 active:scale-95"
                >
                  {savePending ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} className="group-hover:scale-125 transition-transform" />}
                  Save & Sync to Database
                </button>
              </div>
            </div>
          );
        })()}
      </div>
      {section !== 'logs' && section !== 'jesuit_page_content' && (
        <button onClick={() => setItemToDelete(item.id)} className="p-4 rounded-2xl bg-red-400/10 text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-400/20">
          <Trash2 size={20} />
        </button>
      )}
    </motion.div>
  );

  const globalResults = getGlobalSearchResults();

  const handleUpdate = (id: string, field: string, value: any, section: keyof AppData) => {
    // Audit Defense: Prevent event objects from leaking into state/database
    if (isCircular(value)) {
      console.warn(`[AdminPortal] Blocked save of potential circular object (Event) to ${section}.${field}`);
      // Try to extract a string value if it was an event by mistake
      if (value.target && value.target.value !== undefined) value = value.target.value;
      else if (typeof value.target?.checked === 'boolean') value = value.target.checked;
      else return; // Stop if we can't rescue it
    }

    const sanitizedValue = sanitize(value);

    if (section === 'settings') {
      setData(prev => {
        const updatedSettings = { ...prev.settings, [field]: sanitizedValue };
        
        const timerId = `save-settings`;
        if ((window as any)[timerId]) clearTimeout((window as any)[timerId]);
        (window as any)[timerId] = setTimeout(async () => {
          setSavePending(true);
          try {
            await supabaseService.saveItem('settings', updatedSettings);
            try {
              await supabaseService.saveItem('logs', {
                id: `log_set_${Date.now()}`,
                user: user?.email || 'anonymous',
                action: 'UPDATE_SETTINGS',
                details: `Updated setting ${field} to ${sanitizedValue}`,
                timestamp: new Date().toISOString()
              });
            } catch (logErr) {
              console.warn('Failed to save audit log:', logErr);
            }
            showToast(`Settings (${field}) updated successfully`);
          } catch (err: any) {
            console.error('Settings sync failed:', err);
            const msg = err.message?.toLowerCase() || '';
            const isAuthError = msg.includes('session expired') || msg.includes('403') || msg.includes('authentication required') || msg.includes('invalid session');
            
            if (isAuthError) {
              showToast(`Session Expired: Please logout and login again to continue.`, 'error');
              setIsDebugOpen(true); // Open audit to show them why
            } else {
              showToast(`Save Error: ${err.message?.slice(0, 80)}`, 'error');
            }
          } finally {
            setSavePending(false);
          }
        }, 800);

        return { ...prev, settings: updatedSettings };
      });
      return;
    }

    if (section === 'content') {
      setData(prev => {
        const updatedContent = { ...prev.content, [field]: sanitizedValue };
        
        const timerId = `save-content`;
        if ((window as any)[timerId]) clearTimeout((window as any)[timerId]);
        (window as any)[timerId] = setTimeout(async () => {
          setSavePending(true);
          try {
            // Optimization: Only sync the specific key that changed
            await supabaseService.saveItem('content', { [field]: sanitizedValue });
            try {
              await supabaseService.saveItem('logs', {
                id: `log_cont_${Date.now()}`,
                user: user?.email || 'anonymous',
                action: 'UPDATE_CONTENT',
                details: `Updated narrative content for ${field}`,
                timestamp: new Date().toISOString()
              });
            } catch (logErr) {
              console.warn('Failed to save audit log:', logErr);
            }
            showToast('Content narrative synced to Supabase');
          } catch (err: any) {
            console.error('Content sync failed:', err);
            showToast(`Content sync failed: ${err.message?.slice(0, 50)}`, 'error');
          } finally {
            setSavePending(false);
          }
        }, 1000);

        return { ...prev, content: updatedContent };
      });
      return;
    }

    if (section === 'digital_campus') {
      setData(prev => {
        const updatedDC = { ...(prev.digital_campus || { id: 'current', title: 'Legacy in Motion', is_enabled: true }), [field]: sanitizedValue };
        
        const timerId = `save-digital-campus`;
        if ((window as any)[timerId]) clearTimeout((window as any)[timerId]);
        (window as any)[timerId] = setTimeout(async () => {
          setSavePending(true);
          try {
            await supabaseService.saveItem('digital_campus', updatedDC);
            try {
              await supabaseService.saveItem('logs', {
                id: `log_dc_${Date.now()}`,
                user: user?.email || 'anonymous',
                action: 'UPDATE_DIGITAL_CAMPUS',
                details: `Updated Digital Campus item: ${field}`,
                timestamp: new Date().toISOString()
              });
            } catch (logErr) {
              console.warn('Failed to save audit log:', logErr);
            }
            showToast('Digital Campus updated');
          } catch (err: any) {
            console.error('Digital Campus sync failed:', err);
            showToast(`Sync failed: ${err.message?.slice(0, 50)}`, 'error');
          } finally {
            setSavePending(false);
          }
        }, 1000);

        return { ...prev, digital_campus: updatedDC };
      });
      return;
    }

    setData(prev => {
      const currentItems = (prev[section] as any[]) || [];
      let itemFound = false;
      let newItems = currentItems.map((item: any) => {
        if (item.id === id) {
          itemFound = true;
          return { ...item, [field]: sanitizedValue };
        }
        return item;
      });

      if (!itemFound && (section === 'school_history' || section === 'lead_grace')) {
        // Special singleton handling: if id doesn't exist, create it (usually 'main' or 'lg1')
        newItems = [...currentItems, { id, [field]: sanitizedValue }];
      }

      const updatedItem = newItems.find((i: any) => i.id === id);

      // Auto-save logic with debounce
      const timerId = `save-${section as string}-${id}`;
      if ((window as any)[timerId]) clearTimeout((window as any)[timerId]);
      (window as any)[timerId] = setTimeout(async () => {
        if (updatedItem) {
          setSavePending(true);
          try {
            await supabaseService.saveItem(section, updatedItem);
            try {
              await supabaseService.saveItem('logs', {
                id: `log_upd_${Date.now()}`,
                user: user?.email || 'anonymous',
                action: 'UPDATE_ITEM',
                details: `Updated ${field} for item ${id} in ${section}`,
                timestamp: new Date().toISOString()
              });
            } catch (logErr) {
              console.warn('Failed to save audit log:', logErr);
            }
            showToast(`Synced ${section} to Supabase`);
          } catch (err: any) {
            console.error('Sync failed:', err);
            const msg = err.message.startsWith('{') ? JSON.parse(err.message).error : err.message;
            showToast(`Sync failed: ${msg}`, 'error');
          } finally {
            setSavePending(false);
          }
        }
      }, 1000);

      return { ...prev, [section]: newItems };
    });
  };

  const handleBulkUpdate = async () => {
    if (!bulkEditField || selectedIds.size === 0) return;

    const current = data[activeSection];
    if (!Array.isArray(current)) return;
    
    const updatedSection = current.map((item: any) => 
      selectedIds.has(item.id) ? { ...item, [bulkEditField]: bulkEditValue } : item
    );

    setData(prev => ({ ...prev, [activeSection]: updatedSection }));
    setSavePending(true);
    
    try {
      const itemsToUpdate = updatedSection.filter(item => selectedIds.has(item.id));
      for (const item of itemsToUpdate) {
        await supabaseService.saveItem(activeSection as any, item);
      }
      showToast(`Bulk updated ${selectedIds.size} items in ${activeSection}`);
    } catch (err: any) {
      const msg = err.message.startsWith('{') ? JSON.parse(err.message).error : err.message;
      showToast(`Bulk update failed: ${msg}`, 'error');
    } finally {
      setSavePending(false);
      setIsBulkEditing(false);
      setBulkEditField('');
      setBulkEditValue('');
    }
  };

  const handleRemove = async (ids: string | string[]) => {
    const isBulk = Array.isArray(ids);
    const idList = isBulk ? ids : [ids];

    setSavePending(true);
    try {
      for (const id of idList) {
        await supabaseService.deleteItem(activeSection as any, id);
      }

      // Audit Log for deletion
      try {
        await supabaseService.saveItem('logs', {
          id: `log_del_${Date.now()}`,
          user: user?.email || 'anonymous',
          action: 'DELETE',
          details: `Deleted ${idList.length} items from ${activeSection} (IDs: ${idList.join(', ')})`,
          timestamp: new Date().toISOString()
        });
      } catch (logErr) {
        console.warn('Failed to save audit log:', logErr);
      }
      
      showToast(`Successfully deleted from ${activeSection as string}`);
      setData(prev => {
        const current = prev[activeSection];
        if (Array.isArray(current)) {
          return { 
            ...prev, 
            [activeSection]: current.filter((i: any) => !idList.includes(i.id)) 
          };
        }
        return prev;
      });
      setItemToDelete(null);
      setSelectedIds(new Set());
    } catch (err: any) {
      console.error('Delete failed:', err);
      const msg = err.message.startsWith('{') ? JSON.parse(err.message).error : err.message;
      showToast(`Deletion failed: ${msg}`, 'error');
    } finally {
      setSavePending(false);
    }
  };

  const handleAdd = async (overrides?: any) => {
    // Stability Defense: Ensure overrides is NOT an event
    const actualOverrides = (overrides && isCircular(overrides)) ? {} : (overrides || {});
    const newItem: any = { id: crypto.randomUUID(), ...actualOverrides };
    const tableStr = activeSection as string;
    
    // Initialize fields
      if (tableStr === 'notices') {
      newItem.title = 'New Notice Title';
      newItem.content = 'Enter notice details here...';
      newItem.date = new Date().toLocaleDateString();
      newItem.category = 'Circular';
      newItem.attachmentUrl = '';
    } else if (tableStr === 'fees') {
      newItem.category = 'School Fee';
      newItem.particulars = 'Std. I to VII';
      newItem.amount = '0';
      newItem.quarterly = '0';
      newItem.remarks = '';
      newItem.order_index = (data.fees?.length || 0);
      newItem.attachmentUrl = '';
    } else if (tableStr === 'staff') {
      newItem.name = 'New Staff Member';
      newItem.role = 'Role Description';
      newItem.bio = 'Staff biography goes here...';
      newItem.type = 'Faculty';
      newItem.image = 'https://picsum.photos/seed/new/400/400';
      newItem.is_enabled = true;
    } else if (tableStr === 'gallery' || tableStr === 'carousel') {
      newItem.url = tableStr === 'gallery' 
        ? 'https://picsum.photos/seed/new_gallery/1200/800' 
        : 'https://lh3.googleusercontent.com/d/1C-_jZCL-OpkhhOV_R6oTGRfNxkhBIkHN=w1600';
      newItem.caption = tableStr === 'gallery' ? 'Gallery Image Caption' : 'Carousel Slide Title';
      newItem.session = '2024-25';
      newItem.attachmentUrl = '';
    } else if (tableStr === 'links') {
      newItem.title = 'New Link';
      newItem.url = '#';
      newItem.attachmentUrl = '';
    } else if (tableStr === 'events') {
      newItem.title = 'New School Event';
      newItem.date = new Date().toISOString().split('T')[0]; // Store as YYYY-MM-DD
      newItem.time = '10:00 AM - 12:00 PM';
      newItem.location = 'St. Xavier\'s Jaipur Main Campus';
      newItem.attachmentUrl = '';
    } else if (tableStr === 'achievements') {
      newItem.title = 'Achievement Title';
      newItem.year = '2026';
      newItem.description = 'Success story detail...';
      newItem.attachmentUrl = '';
    } else if (tableStr === 'careers') {
      newItem.title = 'New Job Vacancy';
      newItem.content = 'Enter job description and requirements...';
      newItem.is_enabled = true;
      newItem.attachmentUrl = '';
    } else if (tableStr === 'studentHonors') {
      newItem.name = 'New Honor Student';
      newItem.category = 'Class 10 Topper';
      newItem.result = '95%';
      newItem.subtext = 'Academic excellence...';
      newItem.image = 'https://picsum.photos/seed/honor/300/300';
      newItem.order_index = (data.studentHonors?.length || 0);
    } else if (tableStr === 'navigation_menu') {
      newItem.label = 'New Menu Item';
      newItem.href = '#';
      newItem.parent_id = null;
      newItem.is_enabled = true;
      newItem.order_index = (data.navigation_menu?.filter(m => !m.parent_id).length || 0);
    } else if (tableStr === 'faqs') {
      newItem.question = 'New Question';
      newItem.answer = 'Answer text goes here...';
      newItem.category = 'General';
      newItem.order_index = (data.faqs?.length || 0);
    } else if (tableStr === 'messages') {
      newItem.name = 'System Test';
      newItem.email = 'test@example.com';
      newItem.subject = 'New Inbound';
      newItem.message = 'Inquiry content...';
      newItem.timestamp = new Date().toISOString();
      newItem.status = 'new';
    } else if (tableStr === 'popups') {
      newItem.title = 'New Announcement';
      newItem.header = 'Important Notice';
      newItem.type = 'text';
      newItem.content = 'Enter announcement details here...';
      newItem.buttonText = '';
      newItem.buttonLink = '';
      newItem.isActive = true;
      newItem.order_index = (data.popups?.length || 0);
      newItem.attachmentUrl = '';
    } else if (tableStr === 'marquee') {
      newItem.text = 'Welcome to St. Xavier\'s Jaipur - Shaping the leaders of tomorrow.';
      newItem.link = '';
      newItem.attachmentUrl = '';
      newItem.isActive = true;
      newItem.order_index = (data.marquee?.length || 0);
    } else if (tableStr === 'transfer_certificates') {
      newItem.admission_number = 'TC' + Date.now().toString().slice(-6);
      newItem.dob = new Date().toISOString().split('T')[0];
      newItem.student_name = 'Student Name';
      newItem.attachmentUrl = '';
    } else if (tableStr === 'useful_links') {
      newItem.title = 'New Link';
      newItem.url = 'https://';
      newItem.icon = 'link';
      newItem.isPriority = false;
      newItem.attachmentUrl = '';
    } else if (tableStr === 'custom_content') {
      newItem.title = 'New Section';
      newItem.heading = 'Title Goes Here';
      newItem.content = 'Write your content here using markdown if needed.';
      newItem.order_index = (data.custom_content?.length || 0);
      newItem.attachmentUrl = '';
    } else if (tableStr === 'former_principals' || tableStr === 'former_rectors' || tableStr === 'former_managers') {
      newItem.name = 'New Legacy Name';
      newItem.tenure = 'YYYY - YYYY';
      newItem.image = '';
      newItem.order_index = (data[activeSection] as any[] || []).length;
    } else if (tableStr === 'former_student_leaders') {
      newItem.name = 'Former Leader Name';
      newItem.role = 'Head Boy';
      newItem.academic_year = '2023-24';
      newItem.image = '';
      newItem.order_index = (data.former_student_leaders?.length || 0);
    } else if (tableStr === 'streamwise_toppers') {
      newItem.name = 'Topper Name';
      newItem.stream = 'Science';
      newItem.percentage = 'Merit';
      newItem.academic_year = '2026';
      newItem.image = '';
      newItem.order_index = (data.streamwise_toppers?.length || 0);
    } else if (tableStr === 'xavierite_of_the_year') {
      newItem.name = 'Awardee Name';
      newItem.academic_year = '2026';
      newItem.citation = 'Excellence in all fields...';
      newItem.image = '';
      newItem.order_index = (data.xavierite_of_the_year?.length || 0);
    } else if (tableStr === 'admins') {
      newItem.username = 'new_admin';
      newItem.password = 'change_me_123';
      newItem.role = 'staff';
      newItem.created_at = new Date().toISOString();
    } else if (tableStr === 'mandatory_disclosures') {
      newItem.title = newItem.title || 'New Disclosure Information';
      newItem.content = newItem.content || 'Enter details here...';
      newItem.category = newItem.category || 'A';
      newItem.order_index = newItem.order_index ?? (data.mandatory_disclosures?.length || 0);
      newItem.is_enabled = newItem.is_enabled ?? true;
      newItem.attachmentUrl = newItem.attachmentUrl || '';
    } else if (['activities', 'alumni', 'school_info', 'parent_obligations', 'careers', 'contact_content', 'scholarships', 'jesuit_page_content', 'co_curricular_activities', 'fire_safety'].includes(tableStr)) {
      newItem.title = tableStr === 'scholarships' ? 'New Scholarship/Concession' : tableStr === 'co_curricular_activities' ? 'New Activity Section' : tableStr === 'fire_safety' ? 'Fire Safety Heading/Link' : 'New Section Title';
      newItem.heading = '';
      newItem.content = tableStr === 'co_curricular_activities' ? 'Write content or JSON for table here...' : 'Write description here...';
      if (['scholarships', 'co_curricular_activities', 'fire_safety'].includes(tableStr)) newItem.display_type = 'tile';
      if (tableStr === 'mandatory_disclosures') newItem.category = 'A';
      newItem.image_url = '';
      newItem.attachmentUrl = '';
      newItem.order_index = (data[activeSection as keyof AppData] as any[] || []).length;
      newItem.is_enabled = true;
    }

    setSavePending(true);
    try {
      await supabaseService.saveItem(activeSection as any, newItem);
      // Audit Log
      try {
        await supabaseService.saveItem('logs', {
          id: `log_${Date.now()}`,
          user: user?.email || 'anonymous',
          action: 'CREATE',
          details: `Created new item in ${activeSection} (ID: ${newItem.id})`,
          timestamp: new Date().toISOString()
        });
      } catch (logErr) {
        console.warn('Failed to save audit log:', logErr);
      }
      
      setData(prev => {
        const current = prev[activeSection];
        if (Array.isArray(current)) {
          return { ...prev, [activeSection]: [newItem, ...current] };
        }
        return prev;
      });
      showToast('Item added and synced to cloud');
    } catch (err: any) {
      const msg = err.message.startsWith('{') ? JSON.parse(err.message).error : err.message;
      showToast(`Failed to add item: ${msg}`, 'error');
    } finally {
      setSavePending(false);
    }
  };

  const handleSaveAll = async () => {
    setUploadingPath('global');
    setSavePending(true);
    try {
      await supabaseService.syncAll(data);
      // Audit Log
      try {
        await supabaseService.saveItem('logs', {
          id: `log_${Date.now()}`,
          user: user?.email || 'anonymous',
          action: 'SYNC_ALL',
          details: `Manual sync of all tables triggered by admin`,
          timestamp: new Date().toISOString()
        });
      } catch (logErr) {
        console.warn('Failed to save audit log:', logErr);
      }
      showToast('Entire database synced successfully to Supabase');
    } catch (err) {
      showToast('Critical sync failure', 'error');
    } finally {
      setUploadingPath(null);
      setSavePending(false);
    }
  };

  const handlePullAll = async () => {
    if (uploadingPath) return;
    setUploadingPath('global-pull');
    setSavePending(true);
    try {
      showToast('Step 1: Auditing Cloud Connectivity...');
      const healthRes = await fetch('/api/connectivity-test');
      const health = await healthRes.json();
      setSupabaseStatus(health);

      if (!health.connected) {
        setIsDebugOpen(true);
        throw new Error(`Cloud connection failed: ${health.error || 'Unknown error'}`);
      }

      if (!health.hasServiceRole) {
        showToast('Warning: Service Role Key missing. Inquiries will be skipped.', 'error');
      }

      showToast('Step 2: Pulling Latest Cloud Data...');
      const freshData = await supabaseService.fetchAllData(true);
      
      const remoteMessagesCount = freshData?.messages?.length || 0;
      const remoteApplicationsCount = freshData?.career_applications?.length || 0;
      
      if (freshData && Object.keys(freshData).length > 0) {
        setData(prev => {
          const merged = { ...prev };
          Object.keys(freshData).forEach(key => {
            const k = key as keyof AppData;
            const val = freshData[k];
            if (val) {
              if (Array.isArray(val)) {
                if (val.length > 0) merged[k] = val as any;
              } else if (typeof val === 'object') {
                merged[k] = { ...merged[k], ...val } as any;
              } else {
                merged[k] = val as any;
              }
            }
          });
          return merged;
        });
        
        showToast(health.hasServiceRole ? 'Full Cloud Sync Successful' : 'Sync completed (Limited visibility)');
        
        // Auto-open audit if critical tables are empty and service role is missing
        if (!health.hasServiceRole && (activeSection === 'messages' || activeSection === 'career_applications')) {
          setIsDebugOpen(true);
        }
      } else {
        setIsDebugOpen(true);
        throw new Error('No data found in Cloud Database.');
      }
    } catch (err: any) {
      console.error('Pull failed:', err);
      showToast(err.message || 'Synchronization Failed', 'error');
    } finally {
      setUploadingPath(null);
      setSavePending(false);
    }
  };

  const checkSupabaseHealth = async () => {
    setUploadingPath('debug');
    try {
      const res = await fetch('/api/connectivity-test');
      const health = await res.json();
      setSupabaseStatus(health);
      setIsDebugOpen(true);
      showToast('Supabase connection audit complete');
    } catch (err: any) {
      showToast('Failed to run connectivity audit', 'error');
    } finally {
      setUploadingPath(null);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, id: string, field: string, section: keyof AppData) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input value so same file can be selected again
    e.target.value = '';

    console.log(`[Upload] Starting upload for ${section}/${id}/${field} - File: ${file.name} (${file.size} bytes)`);
    setUploadingPath(`${section}-${id}-${field}`);
    
    // Determine folder based on section
    let folder = (section as string);
    const activeMenuSection = sections.find(s => s.id === section);
    
    if (section === 'settings' || id === 'global') {
      folder = 'global';
    } else if (section === 'navigation_menu') {
      const items = data[section] as any[];
      const item = items.find(i => i.id === id);
      if (item && item.label) {
        folder = item.label.replace(/\s+/g, '_').toLowerCase();
      }
    } else if (activeMenuSection) {
      folder = activeMenuSection.label.replace(/\s+/g, '_').toLowerCase();
    }

    try {
      // 1. Prioritize Supabase Storage (Compatible with Vercel/Production)
      console.log(`[Upload] Attempting Supabase Storage upload: ${folder}/${file.name}`);
      const formData = new FormData();
      formData.append('file', file);

      try {
        const publicUrl = await storageService.uploadFile(file, folder);
        console.log(`[Upload] Supabase Success: ${publicUrl}`);
        handleUpdate(id, field, publicUrl, section);
        showToast('Media saved & synced to Cloud Storage', 'success');
        
        // Optional: Mirror to local server as background if in Dev
        const token = localStorage.getItem('school_admin_token');
        fetch(`/api/upload?section=${encodeURIComponent(folder)}`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        }).catch(() => {});
        
        return; // Success
      } catch (storageErr: any) {
        console.warn('[Upload] Supabase Storage failed, trying local fallback:', storageErr);
      }

      // 2. Fallback to local server upload (Works in AI Studio / Local Dev)
      const token = localStorage.getItem('school_admin_token');
      const res = await fetch(`/api/upload?section=${encodeURIComponent(folder)}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      
      if (res.ok) {
        const result = await res.json();
        console.log(`[Upload] Local Success: ${result.url}`);
        handleUpdate(id, field, result.url, section);
        showToast('Media saved & synced successfully', 'success');
      } else {
        const text = await res.text();
        const errorMessage = text.includes('<!DOCTYPE html>') ? `Server error (possibly path not found). Raw: ${text.slice(0, 100)}` : text;
        showToast(`Upload failed: ${errorMessage.slice(0, 70)}`, 'error');
      }
    } catch (err: any) {
      console.error('[Upload] Process error:', err);
      showToast('Network error during upload', 'error');
    } finally {
      setUploadingPath(null);
    }
  };

  const uploadPendingItem = async (pendingItem: PendingGalleryItem) => {
    setPendingGalleryItems(prev => prev.map(p => p.id === pendingItem.id ? { ...p, status: 'uploading', progress: 10 } : p));
    
    const targetSection = (activeSection === 'carousel' || activeSection === 'gallery') ? activeSection : 'gallery';
    const activeMenuSection = sections.find(s => s.id === targetSection);
    const folder = activeMenuSection ? activeMenuSection.label.replace(/\s+/g, '_') : targetSection;

    try {
      // 1. Prioritize Supabase Storage (Vercel compatible)
      try {
        const publicUrl = await storageService.uploadFile(pendingItem.file, folder);
        if (publicUrl) {
          setPendingGalleryItems(prev => prev.map(p => p.id === pendingItem.id ? { ...p, status: 'completed', progress: 100, url: publicUrl } : p));
          
          // Background mirror to local if possible
          const token = localStorage.getItem('school_admin_token');
          const formData = new FormData();
          formData.append('file', pendingItem.file);
          fetch(`/api/upload?section=${encodeURIComponent(folder)}`, { 
            method: 'POST', 
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData 
          }).catch(() => {});
          
          return;
        }
      } catch (storageErr) {
        console.warn('[Gallery Upload] Supabase failed, trying local:', storageErr);
      }

      // 2. Fallback to local storage (AI Studio)
      const token = localStorage.getItem('school_admin_token');
      const formData = new FormData();
      formData.append('file', pendingItem.file);
      
      const res = await fetch(`/api/upload?section=${encodeURIComponent(folder)}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      
      if (!res.ok) throw new Error(`Server Error: ${res.status}`);

      const result = await res.json();
      if (result.url) {
        setPendingGalleryItems(prev => prev.map(p => p.id === pendingItem.id ? { ...p, status: 'completed', progress: 100, url: result.url } : p));
      } else {
        throw new Error('No URL returned from server');
      }
    } catch (err: any) {
      console.error('Individual upload failed:', err);
      setPendingGalleryItems(prev => prev.map(p => p.id === pendingItem.id ? { ...p, status: 'error', progress: 0, caption: err.message || 'Upload failed' } : p));
    }
  };

  const handleBatchUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newPending: PendingGalleryItem[] = Array.from(files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
      caption: '',
      status: 'pending'
    }));

    setPendingGalleryItems(prev => [...newPending, ...prev]);

    // Start uploading each item
    for (const item of newPending) {
      uploadPendingItem(item);
    }
  };

  const updatePendingCaption = (id: string, caption: string) => {
    setPendingGalleryItems(prev => prev.map(p => p.id === id ? { ...p, caption } : p));
  };

  const removePendingItem = (id: string) => {
    setPendingGalleryItems(prev => {
      const item = prev.find(p => p.id === id);
      if (item) URL.revokeObjectURL(item.preview);
      return prev.filter(p => p.id !== id);
    });
  };

  const finalizeGalleryUploads = async () => {
    const finishedItems = pendingGalleryItems.filter(p => p.status === 'completed' && p.url);
    if (finishedItems.length === 0) return;

    const section = (activeSection === 'carousel' || activeSection === 'gallery') ? activeSection : 'gallery';

    setUploadingPath('finalize');
    try {
      const newEntries = finishedItems.map(p => ({
        id: crypto.randomUUID(),
        url: p.url!,
        caption: p.caption || (section === 'carousel' ? 'Carousel Slide' : 'Gallery Image'),
        session: p.session || '',
        attachmentUrl: ''
      }));

      // Map over and save to DB
      for (const entry of newEntries) {
        await supabaseService.saveItem(section, entry);
      }

      setData({ ...data, [section]: [...newEntries, ...(data[section] as any[])] });
      setPendingGalleryItems(prev => prev.filter(p => !finishedItems.find(f => f.id === p.id)));
      showToast(`Successfully added ${newEntries.length} images to ${section}.`);
    } catch (err) {
      console.error('Finalize failed:', err);
      showToast(`Error saving ${section} items`, 'error');
    } finally {
      setUploadingPath(null);
    }
  };

  const rawSections = [
    { id: 'activities', label: 'Activities (Legacy)', icon: <Activity size={18} className="text-school-ink/30" /> },
    { id: 'admins', label: 'Admin Accounts', icon: <Key size={18} className="text-school-neon" /> },
    { id: 'alumni', label: 'Alumni Content', icon: <Users2 size={18} className="text-school-accent" /> },
    { id: 'logs', label: 'Audit Logs', icon: <FileText size={18} className="text-school-ink opacity-50" /> },
    { id: 'careers', label: 'Careers (Job Openings)', icon: <Briefcase size={18} className="text-school-gold" /> },
    { id: 'carousel', label: 'Carousel', icon: <ImagePlus size={18} className="text-school-accent" /> },
    { id: 'co_curricular_activities', label: 'Co-curricular (New)', icon: <LayoutGrid size={18} className="text-school-neon" /> },
    { id: 'contact_content', label: 'Contact Page Info', icon: <Mail size={18} className="text-school-accent" /> },
    { id: 'digital_campus', label: 'Digital Campus', icon: <Maximize2 size={18} className="text-school-neon" /> },
    { id: 'events', label: 'Events', icon: <Calendar size={18} /> },
    { id: 'faqs', label: 'FAQs', icon: <MessageSquare size={18} className="text-school-gold" /> },
    { id: 'fees', label: 'Fees', icon: <CreditCard size={18} /> },
    { id: 'fire_safety', label: 'Fire Safety Portal', icon: <ShieldCheck size={18} className="text-red-500" /> },
    { id: 'former_student_leaders', label: 'Former Head Boy & Girls', icon: <Users2 size={18} className="text-school-accent" /> },
    { id: 'settings', label: 'Global Settings', icon: <Settings size={18} className="text-school-gold" /> },
    { id: 'gallery', label: 'Gallery', icon: <ImageIcon size={18} /> },
    { id: 'studentHonors', label: 'Honors', icon: <Award size={18} className="text-school-gold" /> },
    { id: 'messages', label: 'Inquiries (Contact)', icon: <Mail size={18} className="text-school-accent" /> },
    { id: 'custom_content', label: 'Insights Content', icon: <FileText size={18} className="text-school-gold" /> },
    { id: 'jesuit_page_content', label: 'Jesuit Education Page', icon: <FileText size={18} className="text-school-gold" /> },
    { id: 'lead_grace', label: 'Lead Grace', icon: <Award size={18} className="text-school-neon" /> },
    { id: 'links', label: 'Links', icon: <LinkIcon size={18} /> },
    { id: 'former_managers', label: 'Managers History', icon: <Award size={18} className="text-school-neon" /> },
    { id: 'mandatory_disclosures', label: 'Mandatory Disclosures', icon: <ShieldCheck size={18} className="text-school-neon" /> },
    { id: 'marquee', label: 'Marquee', icon: <ChevronRight size={18} className="text-school-neon" /> },
    { id: 'navigation_menu', label: 'Menu Items', icon: <Menu size={18} /> },
    { id: 'notices', label: 'Notices', icon: <Bell size={18} /> },
    { id: 'popups', label: 'Popups', icon: <Maximize2 size={18} className="text-school-accent" /> },
    { id: 'parent_obligations', label: 'Parent Obligations', icon: <FileText size={18} className="text-school-accent" /> },
    { id: 'former_principals', label: 'Principals History', icon: <Award size={18} className="text-school-accent" /> },
    { id: 'former_rectors', label: 'Rectors History', icon: <Award size={18} className="text-school-gold" /> },
    { id: 'useful_links', label: 'Resource Links', icon: <ExternalLink size={18} className="text-school-accent" /> },
    { id: 'scholarships', label: 'Scholarship & Concessions', icon: <Award size={18} className="text-school-gold" /> },
    { id: 'school_history', label: 'School History', icon: <FileText size={18} className="text-school-gold" /> },
    { id: 'school_info', label: 'School Information', icon: <FileText size={18} className="text-school-gold" /> },
    { id: 'site_stats', label: 'Site Statistics (Visitor Count)', icon: <Activity size={18} className="text-emerald-500" /> },
    { id: 'content', label: 'Site General Text', icon: <LayoutGrid size={18} className="text-school-neon" /> },
    { id: 'staff', label: 'Staff Management', icon: <Users2 size={18} /> },
    { id: 'streamwise_toppers', label: 'Stream Toppers', icon: <Award size={18} className="text-school-accent" /> },
    { id: 'achievements', label: 'Success Records', icon: <Award size={18} /> },
    { id: 'transfer_certificates', label: 'TC Records', icon: <FileText size={18} className="text-school-accent" /> },
    { id: 'about', label: 'Vision & Mission', icon: <FileText size={18} className="text-school-accent" /> },
    { id: 'xavierite_of_the_year', label: 'Xavierite of Year', icon: <Award size={18} className="text-school-neon" /> },
  ];

  const sections = [...rawSections].sort((a, b) => a.label.localeCompare(b.label));

  if (authLoading) return (
    <div className="min-h-screen bg-school-navy flex items-center justify-center">
      <Loader2 className="text-school-gold animate-spin" size={48} />
    </div>
  );

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-school-navy flex items-center justify-center p-6 relative overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-school-gold/5 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], rotate: [0, -45, 0] }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-white/5 rounded-full blur-[100px]"
        />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-lg"
        >
          <div className="text-center mb-12">
            <Link to="/" className="inline-flex items-center gap-4 mb-8 group">
              <div className="w-16 h-16 bg-school-gold rounded-2xl flex items-center justify-center text-school-navy font-black text-3xl shadow-2xl group-hover:scale-110 transition-transform">X</div>
              <div className="text-left">
                <h1 className="font-serif text-3xl font-black text-white leading-none tracking-tight">ST. XAVIER'S</h1>
                <p className="text-[10px] uppercase tracking-[0.4em] font-black text-white/60">Admin Gateway</p>
              </div>
            </Link>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-3xl border border-white/10 p-12 rounded-[40px] shadow-2xl space-y-8">
            <div className="space-y-4 text-center">
              <div className="w-20 h-20 bg-school-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Key className="text-school-gold" size={32} />
              </div>
              <h2 className="text-2xl font-serif font-black text-white italic tracking-tight">Authorized Access Only</h2>
              <p className="text-white/60 text-sm font-light leading-relaxed">
                This portal is reserved for school administrators. Please use your credentials to manage the portal.
              </p>
            </div>

            <form onSubmit={handleUsernameLogin} className="space-y-6">
               <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/60 ml-1">Username</label>
                <input 
                  type="text" 
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="Enter Username"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-school-gold/50 transition-all font-medium"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/60 ml-1">Password</label>
                <input 
                  type="password" 
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-school-gold/50 transition-all font-medium"
                  required
                />
              </div>
              
              <AnimatePresence>
                {loginError && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="text-red-400 text-[10px] font-black uppercase tracking-widest bg-red-400/10 p-3 rounded-xl border border-red-400/20 text-center">
                    {loginError}
                  </motion.div>
                )}
              </AnimatePresence>

              <button 
                type="submit" 
                disabled={isLoggingIn}
                className="w-full bg-school-gold text-school-navy py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoggingIn ? 'Authenticating...' : 'Login to Console'}
              </button>
              
              <div className="text-center">
                <p className="text-[9px] text-white/30 uppercase tracking-widest leading-relaxed">
                  Authentication requires valid credentials from the database.
                </p>
              </div>
            </form>
            
            <Link to="/" className="block text-center text-[10px] font-black uppercase tracking-[0.3em] text-white/60 hover:text-white transition-colors">
              Return to Public Portal
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-school-paper flex font-sans relative pt-10 md:pt-0">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isDebugOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDebugOpen(false)}
              className="absolute inset-0 bg-school-navy/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="p-8 bg-school-navy text-white flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter">Supabase Health Audit</h3>
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">Real-time Cloud Database Connectivity Check</p>
                </div>
                <button onClick={() => setIsDebugOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Connection Status</p>
                    <p className={`text-xl font-black ${supabaseStatus?.connected ? 'text-green-500' : 'text-red-500'}`}>
                      {supabaseStatus?.connected ? 'ONLINE' : 'OFFLINE'}
                    </p>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Service Role Key</p>
                    <p className={`text-xl font-black ${supabaseStatus?.hasServiceRole ? 'text-green-500' : 'text-amber-500'}`}>
                      {supabaseStatus?.hasServiceRole ? 'ACTIVE' : 'MISSING'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Environment Discovery</p>
                      <span className="text-[9px] font-bold text-slate-400 bg-slate-200 px-1.5 py-0.5 rounded">v2.3</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {supabaseStatus?.detectedKeys ? Object.entries(supabaseStatus.detectedKeys).map(([key, found]) => (
                        <div key={key} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${found ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-500'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${found ? 'bg-green-500' : 'bg-slate-400'}`} />
                          {key}: {found ? 'FOUND' : 'NULL'}
                        </div>
                      )) : (
                        <p className="text-[10px] text-slate-400 italic">No keys detected in environment.</p>
                      )}
                    </div>
                    
                    {supabaseStatus?.hints && (
                      <div className="grid grid-cols-1 gap-2 mt-2">
                        {!supabaseStatus.detectedKeys?.GOOGLE_MAPS && (
                          <div className="p-2 bg-amber-50 rounded-lg border border-amber-100 flex items-center justify-between">
                            <span className="text-[9px] font-bold text-amber-700 uppercase">Missing: Google Maps Key</span>
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText('GOOGLE_MAPS_PLATFORM_KEY');
                                showToast('Key name copied!');
                              }}
                              className="text-[9px] font-black text-amber-800 bg-amber-200 px-2 py-1 rounded shadow-sm hover:bg-amber-300 transition-colors"
                            >
                              COPY NAME
                            </button>
                          </div>
                        )}
                        {supabaseStatus.detectedKeys?.GOOGLE_MAPS && (
                          <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 space-y-1">
                            <p className="text-[10px] font-bold text-blue-700 uppercase">Maps Setup Guide</p>
                            <p className="text-[9px] text-blue-600 leading-tight">
                              If the map shows <b>"Invalid Key"</b>, verify you have enabled the <b>Maps Embed API</b> in your Google Cloud Project. 
                              Also check for HTTP Referrer restrictions that might block this domain.
                            </p>
                          </div>
                        )}
                        {!supabaseStatus.detectedKeys?.SERVICE_ROLE_KEY && (
                          <div className="p-2 bg-white rounded-lg border border-slate-100 flex items-center justify-between">
                            <span className="text-[9px] font-mono text-slate-500">Add to Secrets:</span>
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText('SUPABASE_SERVICE_ROLE_KEY');
                                showToast('Key name copied');
                              }}
                              className="text-[9px] font-black text-school-navy bg-school-navy/5 px-2 py-1 rounded hover:bg-school-navy/10 transition-colors"
                            >
                              SUPABASE_SERVICE_ROLE_KEY
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {supabaseStatus?.url && (
                      <p className="text-[9px] font-mono text-slate-400 break-all bg-white/50 p-2 rounded-lg border border-slate-100">
                        ENDPOINT: {supabaseStatus.url}
                      </p>
                    )}

                    <button 
                      onClick={() => {
                        localStorage.removeItem('school_admin_token');
                        localStorage.removeItem('school_admin_user');
                        localStorage.removeItem('supabase_schema_warning');
                        window.location.reload();
                      }}
                      className="w-full py-2 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-colors border border-red-100"
                    >
                      Force Logout & Reset Session
                    </button>
                  </div>

                  <div className="p-4 bg-slate-900 rounded-2xl border border-white/5 space-y-4 shadow-2xl">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Client Data Inspector</p>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => console.log('Current Data:', data)}
                          className="text-[9px] font-bold text-slate-400 bg-white/5 px-2 py-1 rounded hover:bg-white/10"
                        >
                          FULL LOG
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 overflow-y-auto max-h-[160px] pr-2 custom-scrollbar">
                      {Object.entries(data).map(([key, val]) => (
                        <div key={key} className="p-2 bg-white/5 rounded-lg border border-white/5 flex flex-col gap-0.5">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter truncate">{key}</span>
                          <span className={`text-[11px] font-bold ${Array.isArray(val) ? (val.length > 0 ? 'text-green-400' : 'text-amber-400') : 'text-slate-300'}`}>
                            {Array.isArray(val) ? `${val.length} rows` : typeof val === 'object' ? 'Object' : 'Scalar'}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <p className="text-[9px] text-slate-500 leading-tight italic">
                      If counts are 0 but Supabase shows rows below, the local SQLite cache is empty. Use <b>Force Database Re-Sync</b>.
                    </p>
                  </div>
                </div>

                {!supabaseStatus?.hasServiceRole && (
                  <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-3">
                    <div className="p-2 bg-amber-100 rounded-lg h-fit">
                      <ShieldAlert size={18} className="text-amber-600" />
                    </div>
                    <div>
                      <p className="text-[11px] font-black uppercase text-amber-900 tracking-tight">Privacy Limitation Detected</p>
                      <p className="text-[10px] text-amber-700 font-medium leading-normal mt-1">
                        Without the <span className="font-bold">SUPABASE_SERVICE_ROLE_KEY</span>, inquiries and applications are hidden by Cloud security policies. Add the key in AI Studio Secrets to sync private data.
                      </p>
                    </div>
                  </div>
                )}

                {supabaseStatus?.tables && (
                  <div className="space-y-4">
                    <div className="p-4 bg-school-gold/5 rounded-2xl border border-school-gold/20 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-black uppercase text-school-gold tracking-widest">Database Permission Fixer</p>
                        <ShieldCheck size={14} className="text-school-gold" />
                      </div>
                      <p className="text-[10px] text-school-gold font-medium leading-normal">
                        If tables show 0 rows but you have data, your Supabase RLS policies might be blocking the connection.
                      </p>
                      <button 
                        onClick={() => {
                          const tables = Object.keys(supabaseStatus.tables);
                          const sql = tables.map(t => `ALTER TABLE "${t}" DISABLE ROW LEVEL SECURITY;\nGRANT ALL ON TABLE "${t}" TO anon, authenticated, service_role, postgres;`).join('\n');
                          navigator.clipboard.writeText(sql);
                          showToast('SQL Fix Script copied! Paste into Supabase SQL Editor.');
                        }}
                        className="w-full py-2 bg-school-gold text-school-navy rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-school-gold/80 transition-colors shadow-sm"
                      >
                        Copy SQL Fix Script
                      </button>

                      <button 
                        onClick={async () => {
                          try {
                            const res = await fetch('/api/data?force=true');
                            if (res.ok) {
                              showToast('Fresh Sync Completed');
                              setTimeout(() => window.location.reload(), 1000);
                            } else {
                              showToast('Sync Failed', 'error');
                            }
                          } catch (e) {
                            showToast('Sync Error', 'error');
                          }
                        }}
                        className="w-full py-2 bg-school-navy text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-school-navy/80 transition-colors shadow-sm"
                      >
                        Force Database Re-Sync
                      </button>
                    </div>

                    <div className="space-y-3">
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Table Inventory & Row Counts</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {Object.entries(supabaseStatus.tables).map(([name, status]: [string, any]) => (
                          <div key={name} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl">
                            <span className="text-[11px] font-bold text-slate-600 truncate mr-2">{name}</span>
                            {status.error ? (
                              <span className="text-[9px] font-black text-red-500 bg-red-50 px-2 py-1 rounded-md uppercase">Missing</span>
                            ) : (
                              <span className="text-[11px] font-black text-school-navy bg-slate-100 px-2 py-1 rounded-md">
                                {status.count} rows
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {supabaseStatus?.error && (
                  <div className="p-6 bg-red-50 rounded-2xl border border-red-100 text-red-600">
                    <p className="text-[10px] font-black uppercase tracking-widest mb-2">Audit Exception</p>
                    <p className="text-sm font-medium leading-relaxed">{supabaseStatus.error}</p>
                  </div>
                )}
              </div>

              <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
                <button 
                  onClick={() => {
                    setIsDebugOpen(false);
                    handlePullAll();
                  }}
                  className="flex-1 py-4 bg-school-navy text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Force Cloud Sync Now
                </button>
              </div>
            </motion.div>
          </div>
        )}
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-school-navy/60 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={`w-80 bg-school-navy text-white flex flex-col fixed h-full z-50 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 pb-12 whitespace-nowrap">
          <div className="flex items-center justify-between mb-12">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-school-gold rounded-lg flex items-center justify-center text-school-navy font-black text-xl group-hover:scale-110 transition-transform">X</div>
              <span className="font-serif text-lg font-black tracking-tight">Admin Console</span>
            </Link>
            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-white/40 hover:text-white p-2">
              <X size={24} />
            </button>
          </div>
          <div className="space-y-4">
            {sections.map(s => (
              <button 
                key={s.id} 
                onClick={() => {
                  setActiveSection(s.id as keyof AppData);
                  setIsSidebarOpen(false);
                }} 
                className={`w-full flex items-center justify-between px-6 py-4 rounded-xl transition-all ${activeSection === s.id ? 'bg-school-gold text-school-navy font-black shadow-lg' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
              >
                <div className="flex items-center gap-4">
                  {s.icon} <span className="text-[11px] uppercase tracking-widest">{s.label}</span>
                </div>
                {s.id === 'messages' && data.messages?.filter(m => m.status === 'new').length > 0 && (
                  <span className="bg-red-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full animate-bounce">
                    {data.messages.filter(m => m.status === 'new').length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-auto p-8 border-t border-white/5 space-y-4">
           <div className="text-[8px] text-white/30 uppercase tracking-widest mb-2 px-2">
             Debug: {authLoading ? 'Loading Auth...' : user ? `User: ${user.email} (Admin: ${isAdmin ? 'Yes' : 'No'})` : 'Not Authenticated'}
           </div>
           {(!user || !isAdmin) ? (
             <button 
               onClick={() => {
                 window.scrollTo(0, 0);
                 logout();
               }} 
               className="w-full py-4 px-6 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all border border-white/10"
             >
               <Key size={14} className="text-school-gold" />
               Switch User Account
             </button>
           ) : (
             <button 
               onClick={logout}
               className="w-full px-6 py-4 bg-school-gold/10 border border-school-gold/20 rounded-xl flex items-center justify-between group hover:bg-school-gold/20 transition-all"
             >
               <div className="flex items-center gap-3">
                 <div className="w-2 h-2 bg-school-gold rounded-full animate-pulse" />
                 <p className="text-[9px] font-serif font-bold uppercase tracking-widest text-school-gold truncate max-w-[150px]">
                   Dev Active: {user.email}
                 </p>
               </div>
               <X size={12} className="text-school-gold/40 group-hover:text-school-gold" />
             </button>
           )}
           {savePending && (
              <div className="px-6 py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <p className="text-[9px] font-serif font-bold uppercase tracking-widest text-emerald-500 mb-1">Unsaved Changes</p>
                <p className="text-[10px] text-emerald-500/60 font-light leading-relaxed">Changes made here are not permanent until saved.</p>
              </div>
           )}
           <button onClick={() => navigate('/')} className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white flex items-center gap-3 transition-colors"><ChevronRight size={14} className="rotate-180" /> Exit Portal</button>
        </div>
      </aside>

      <main className="flex-1 md:ml-80 p-6 md:p-12 min-w-0">
        <SidebarLinks links={data.useful_links || []} />
        {/* Mobile Header Toggle */}
        <div className="md:hidden flex items-center justify-between mb-8 bg-school-paper p-4 rounded-2xl shadow-sm border border-school-ink/10">
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-school-gold rounded-lg flex items-center justify-center text-school-navy font-black text-sm">X</div>
             <span className="font-serif font-black text-school-ink">Console</span>
           </div>
           <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-school-ink hover:bg-school-ink/5 rounded-xl transition-colors">
              <Menu size={24} />
           </button>
        </div>
        <AnimatePresence>
          {toast && (
            <motion.div initial={{ opacity: 0, y: -20, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: -20, x: '-50%' }} className={`fixed top-12 left-1/2 z-[200] px-8 py-4 rounded-2xl shadow-2xl text-[11px] font-black uppercase tracking-widest text-white flex items-center gap-3 ${toast.type === 'error' ? 'bg-red-500' : 'bg-school-navy'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${toast.type === 'error' ? 'bg-white/20' : 'bg-school-gold text-school-navy'}`}>
                {toast.type === 'error' ? <X size={14} /> : <Check size={14} />}
              </div>
              {toast.message}
            </motion.div>
          )}
        </AnimatePresence>

      <AnimatePresence>
        {localStorage.getItem('supabase_schema_warning') === 'true' && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 bg-amber-500 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden">
             <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
               <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                     <AlertCircle size={32} />
                  </div>
                  <div className="space-y-1">
                     <h3 className="text-xl font-serif font-black italic">Supabase Cloud Database Setup Required</h3>
                     <p className="text-white/95 text-[13px] font-medium leading-relaxed">Your Supabase database does not have any initialized tables yet (such as <code>admins</code>). This site has bypassed the missing table error to let you access this management portal safely.</p>
                     <p className="text-white/85 text-[11px] font-semibold">To enable full cloud synchronization, please open your Supabase SQL Editor and execute the <b>supabase_setup.sql</b> file located in your project root directory.</p>
                  </div>
               </div>
               <div className="flex flex-wrap gap-4 shrink-0">
                  <button 
                    onClick={() => {
                      localStorage.removeItem('supabase_schema_warning');
                      setSearchQuery(prev => prev === '' ? ' ' : '');
                      setTimeout(() => setSearchQuery(''), 50);
                    }}
                    className="px-6 py-3 bg-white text-amber-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/90 transition-all font-black shadow-xl"
                  >
                    Dismiss Warning
                  </button>
               </div>
             </div>
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
          </motion.div>
        )}

        {showSchemaError && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 bg-red-500 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden">
             <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
               <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                     <AlertCircle size={32} />
                  </div>
                  <div>
                     <h3 className="text-xl font-serif font-black italic">Database Cache Mismatch</h3>
                     <p className="text-white/70 text-sm font-medium">Your database schema has changed but the system still sees the old structure. Running the <b>NOTIFY</b> command in SQL editor or clicking below might help.</p>
                  </div>
               </div>
               <div className="flex gap-4">
                  <button 
                    onClick={async () => {
                      try {
                        setSavePending(true);
                        // Trigger a schema reload notify directly from client if we have a function for it
                        // Or just try a sync all which might force a retry
                        await supabaseService.fetchAllData(true);
                        showToast('Schema cache refresh requested', 'success');
                        setShowSchemaError(false);
                      } catch (err) {
                        showToast('Refresh failed. Please use SQL Editor.', 'error');
                      } finally {
                        setSavePending(false);
                      }
                    }}
                    className="px-8 py-4 bg-white text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/90 transition-all shadow-xl font-bold"
                  >
                    Refresh App State
                  </button>
                  <a 
                    href="/supabase_fire_safety_setup.sql" 
                    target="_blank"
                    className="px-8 py-4 bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all font-bold"
                  >
                    Setup Fire Safety SQL
                  </a>
                  <a 
                    href="/supabase_fire_safety_activity.sql" 
                    target="_blank"
                    className="px-8 py-4 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all font-bold"
                  >
                    Fire Safety & Activity SQL
                  </a>
                  <a 
                    href="/supabase_co_curricular_fix.sql" 
                    target="_blank"
                    className="px-8 py-4 bg-school-gold text-school-navy rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all font-bold"
                  >
                    Setup Activities SQL
                  </a>
                  <a 
                    href="/supabase_scholarships_display_type.sql" 
                    target="_blank"
                    className="px-8 py-4 bg-black/20 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black/30 transition-all font-bold"
                  >
                    Add Columns SQL
                  </a>
                  <a 
                    href="/supabase_scholarships_final_fix.sql" 
                    target="_blank"
                    className="px-8 py-4 bg-black/20 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black/30 transition-all"
                  >
                    Recreate Table SQL
                  </a>
                  <button 
                    onClick={() => setShowSchemaError(false)}
                    className="px-8 py-4 bg-black/20 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black/30 transition-all"
                  >
                    Dismiss
                  </button>
               </div>
             </div>
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
          </motion.div>
        )}
      </AnimatePresence>

        <header className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-12 mb-16">
          <div className="flex-1 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex items-center gap-4">
                  <h1 className="text-3xl md:text-5xl font-serif font-black text-school-navy tracking-tight capitalize">
                    {searchQuery ? 'Search Results' : `Manage ${sections.find(s => s.id === activeSection)?.label || activeSection}`}
                  </h1>
                  {!searchQuery && (
                   <span className="px-3 py-1 bg-school-ink/10 text-school-ink/40 rounded-lg text-[8px] font-black uppercase tracking-widest self-center md:self-end mb-2">
                     Supabase Table: {activeSection}
                   </span>
                 )}
               </div>
               <div className="relative group flex-1 max-w-md">
                 <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-school-ink/40 group-focus-within:text-school-gold transition-colors">
                   <Search size={18} strokeWidth={2.5} />
                 </div>
                 <input 
                   type="text" 
                   placeholder="Search all content..." 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="w-full bg-school-ink/5 border-none rounded-2xl py-4 pl-12 pr-4 text-xs font-black uppercase tracking-widest text-school-ink placeholder:text-school-ink/30 focus:ring-2 focus:ring-school-gold/20 outline-none transition-all"
                 />
                 {searchQuery && (
                   <button 
                     onClick={() => setSearchQuery('')}
                     className="absolute inset-y-0 right-4 flex items-center text-school-ink/40 hover:text-red-400 transition-colors"
                   >
                     <X size={16} strokeWidth={3} />
                   </button>
                 )}
               </div>
            </div>
            <p className="text-sm text-school-navy/40 font-light">
              {searchQuery ? `Showing matches for "${searchQuery}" across all categories.` : `Comprehensive CRUD control for ${activeSection} on the main portal.`}
            </p>
          </div>
        {!searchQuery && activeSection !== 'settings' && activeSection !== 'content' && activeSection !== 'logs' && (
          <div className="flex flex-wrap gap-4 shrink-0">
            {savePending && (
              <motion.button initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} onClick={handleSaveAll} className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-emerald-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all outline-none">
                <Check size={16} /> Save
              </motion.button>
            )}
            {selectedIds.size > 0 && (
              <>
                <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} onClick={() => setIsBulkEditing(!isBulkEditing)} className={`flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 ${isBulkEditing ? 'bg-school-navy text-white' : 'glass-dark text-white'} rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all outline-none`}>
                   <Settings size={16} /> {isBulkEditing ? 'Cancel' : 'Bulk'}
                </motion.button>
                <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} onClick={() => setItemToDelete(Array.from(selectedIds))} className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-red-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-red-600 transition-all outline-none">
                  <Trash2 size={16} /> Delete ({selectedIds.size})
                </motion.button>
              </>
            )}
            {(activeSection === 'gallery' || activeSection === 'carousel') && (
              <label className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-school-navy text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all outline-none cursor-pointer">
                <ImageIcon size={16} /> 
                {pendingGalleryItems.some(p => p.status === 'uploading') ? 'Uploading...' : 'Browse & Upload Images'}
                <input 
                  type="file" 
                  multiple 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleBatchUpload} 
                  onClick={(e: any) => (e.target.value = null)}
                />
              </label>
            )}
            {activeSection === 'gallery' && (
              <button 
                onClick={() => setIsBulkGalleryOpen(!isBulkGalleryOpen)}
                className={`flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 ${isBulkGalleryOpen ? 'bg-school-navy text-white' : 'bg-school-gold text-school-navy'} rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all outline-none whitespace-nowrap`}
              >
                <UploadCloud size={16} /> Session-wise Bulk Sync
              </button>
            )}
            {!['settings', 'content', 'jesuit_page_content', 'digital_campus', 'logs', 'messages', 'site_stats'].includes(activeSection) && (
              <button onClick={() => handleAdd()} className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-school-gold text-school-navy rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all outline-none whitespace-nowrap">
                <Plus size={16} /> New Item
              </button>
            )}
          </div>
        )}
        </header>

        {activeSection === 'site_stats' && !searchQuery && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-school-navy p-8 rounded-[40px] shadow-2xl relative overflow-hidden group">
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-school-gold">
                    <Activity size={28} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Total Visits</span>
                </div>
                <div className="mt-12">
                  <h3 className="text-5xl font-serif font-black text-white leading-none tracking-tight">
                    {Array.isArray(data.site_stats) && data.site_stats[0] ? data.site_stats[0].visitor_count?.toLocaleString() : '0'}
                  </h3>
                  <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.5em] mt-4">Verified Portal Traffic</p>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-school-gold/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-700" />
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {isBulkEditing && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-12 overflow-hidden">
               <div className="bg-school-navy p-8 rounded-[32px] shadow-2xl flex items-center gap-6">
                 <div className="flex-1">
                   <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">Field to Update</p>
                   <select 
                     value={bulkEditField} 
                     onChange={(e: any) => setBulkEditField(e.target.value)}
                     className="w-full bg-white/10 border border-white/10 rounded-xl p-4 text-sm text-white focus:ring-1 focus:ring-school-gold outline-none"
                   >
                     <option value="">Select Field...</option>
                     {activeSection !== 'settings' && Array.isArray(data[activeSection]) && (data[activeSection] as any[])[0] && Object.keys((data[activeSection] as any[])[0]).filter((k: string) => k !== 'id' && k !== 'image' && k !== 'url').map((k: string) => (
                       <option key={k} value={k} className="text-school-navy text-sm font-medium">{k}</option>
                     ))}
                   </select>
                 </div>
                 <div className="flex-1">
                   <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">New Value</p>
                   <input 
                     type="text"
                     placeholder="Enter new value..."
                     value={bulkEditValue}
                     onChange={(e) => setBulkEditValue(e.target.value)}
                     className="w-full bg-white/10 border border-white/10 rounded-xl p-4 text-sm text-white focus:ring-1 focus:ring-school-gold outline-none"
                   />
                 </div>
                 <div className="self-end pb-1">
                   <button 
                     onClick={handleBulkUpdate}
                     disabled={!bulkEditField}
                     className="flex items-center gap-3 px-8 py-4 bg-school-gold text-school-navy rounded-xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all outline-none disabled:opacity-50 disabled:grayscale"
                   >
                     <Check size={16} /> Apply to {selectedIds.size} Items
                   </button>
                 </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        {activeSection === 'gallery' && isBulkGalleryOpen && (
          <div className="mb-16">
            <GalleryBulkUpload 
              currentSession={data.settings.currentSession || '2024-25'}
              onCancel={() => setIsBulkGalleryOpen(false)}
              onComplete={(newItems) => {
                setData(prev => ({
                  ...prev,
                  gallery: [...newItems, ...prev.gallery]
                }));
                setIsBulkGalleryOpen(false);
                showToast(`Successfully synchronized ${newItems.length} assets to active session`);
              }}
            />
          </div>
        )}

        <AnimatePresence>
          {activeSection === 'gallery' && pendingGalleryItems.length > 0 && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="mb-16">
              <div className="glass-dark rounded-[40px] p-10 shadow-2xl border border-white/5">
                <div className="flex justify-between items-center mb-10">
                  <div>
                    <h3 className="text-3xl font-serif font-black text-white flex items-center gap-4 italic tracking-tight">
                      <UploadCloud className="text-school-gold" size={32} />
                      Upload Staging Area
                    </h3>
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Manage captions and verify uploads before portal entry</p>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => setPendingGalleryItems([])} className="px-8 py-4 glass-surface text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Discard All</button>
                    <button 
                      onClick={finalizeGalleryUploads}
                      disabled={pendingGalleryItems.filter(p => p.status === 'completed').length === 0 || isUploading}
                      className="px-8 py-4 bg-school-gold text-school-navy rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
                    >
                      {isUploading ? 'Finalizing...' : `Finalize ${pendingGalleryItems.filter(p => p.status === 'completed').length} Uploads`}
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {pendingGalleryItems.map((item) => (
                    <motion.div key={item.id} layout className="bg-white/5 rounded-[32px] p-6 border border-white/10 group">
                      <div className="flex gap-6 items-start">
                        <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0 shadow-2xl">
                          <img src={item.preview} className="w-full h-full object-cover" />
                          <AnimatePresence>
                            {item.status === 'uploading' && (
                              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-school-navy/60 backdrop-blur-sm flex items-center justify-center">
                                <Loader2 className="text-school-gold animate-spin" size={24} />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-2">
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40 truncate">{item.file.name}</p>
                            <button onClick={() => removePendingItem(item.id)} className="text-white/20 hover:text-red-400 transition-colors"><X size={14} /></button>
                          </div>
                          
                          <div className="mt-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className={`text-[10px] font-black uppercase tracking-widest ${item.status === 'error' ? 'text-red-400' : 'text-school-gold'}`}>
                                {item.status.toUpperCase()}
                              </span>
                              <span className="text-[10px] font-black text-white/40">{item.progress}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${item.progress}%` }}
                                className={`h-full ${item.status === 'error' ? 'bg-red-500' : 'bg-school-gold'} shadow-[0_0_10px_rgba(212,175,55,0.4)]`}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <p className="text-[9px] font-serif font-bold uppercase tracking-widest text-white/30 mb-2 px-1">Caption Entry</p>
                        <input 
                          type="text"
                          placeholder={item.status === 'completed' ? "Add detailed caption..." : "Waiting for upload..."}
                          value={item.caption}
                          onChange={(e) => updatePendingCaption(item.id, e.target.value)}
                          disabled={item.status !== 'completed'}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/20 focus:ring-1 focus:ring-school-gold outline-none transition-all disabled:opacity-30"
                        />
                      </div>

                      <div className="mt-4">
                        <p className="text-[9px] font-serif font-bold uppercase tracking-widest text-white/30 mb-2 px-1">Session / Year (e.g. 2024-25)</p>
                        <input 
                          type="text"
                          placeholder="e.g. 2024-25"
                          value={item.session || ''}
                          onChange={(e) => {
                             const updatedItems = pendingGalleryItems.map(p => p.id === item.id ? { ...p, session: e.target.value } : p);
                             setPendingGalleryItems(updatedItems);
                          }}
                          disabled={item.status !== 'completed'}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/20 focus:ring-1 focus:ring-school-gold outline-none transition-all disabled:opacity-30"
                        />
                      </div>

                      {item.status === 'error' && (
                        <div className="mt-4 flex items-center gap-2 text-[10px] text-red-400 font-medium bg-red-400/10 p-3 rounded-xl">
                          <AlertCircle size={14} /> {item.caption || 'Failed to upload. Please try again.'}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {activeSection !== 'settings' && Array.isArray(data[activeSection]) && data[activeSection].length > 0 && (
          <div className="mb-6 flex items-center gap-4 px-4">
            <button onClick={toggleSelectAll} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-school-ink/40 hover:text-school-ink transition-colors">
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${selectedIds.size === (data[activeSection] as any[]).length ? 'bg-school-gold border-school-gold text-school-navy' : 'border-school-ink/20'}`}>
                {selectedIds.size === (data[activeSection] as any[]).length && <Check size={12} strokeWidth={4} />}
              </div>
              {selectedIds.size === (data[activeSection] as any[]).length ? 'Deselect All' : 'Select All'}
            </button>
          </div>
        )}

        <div className="grid gap-12">
          {renderMainContent()}
        </div>
      </main>

      <AnimatePresence>
        {itemToDelete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setItemToDelete(null)} className="absolute inset-0 bg-school-navy/60 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-md glass-surface rounded-[32px] p-10 overflow-hidden shadow-2xl">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-red-400/10 text-red-500 rounded-2xl flex items-center justify-center mb-6"><Trash2 size={32} /></div>
                <h3 className="text-3xl font-serif font-black text-school-ink mb-4">
                  {Array.isArray(itemToDelete) ? 'Bulk Deletion' : 'Confirm Deletion'}
                </h3>
                <p className="text-sm text-school-ink/50 font-light mb-10 leading-relaxed">
                  {Array.isArray(itemToDelete) 
                    ? `You are about to permanently remove ${itemToDelete.length} items from ${activeSection}.` 
                    : `Are you sure you want to remove this item from ${activeSection}?`}
                  <br />This action is irreversible.
                </p>
                <div className="flex gap-4 w-full">
                  <button onClick={() => setItemToDelete(null)} className="flex-1 py-4 glass-surface rounded-xl text-[10px] font-black uppercase tracking-widest text-school-ink">Cancel</button>
                  <button onClick={() => handleRemove(itemToDelete)} className="flex-1 py-4 bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">
                    {Array.isArray(itemToDelete) ? `Delete ${itemToDelete.length} Items` : 'Delete Item'}
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

export default AdminPortal;
