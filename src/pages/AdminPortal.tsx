import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Bell, Calendar, Users2, ImageIcon, CreditCard, Link as LinkIcon, Award, Menu,
  Trash2, Plus, Check, X, ChevronRight, Settings, Key, UploadCloud, Loader2, ImagePlus,
  Search, LayoutGrid, AlertCircle, MessageSquare, Mail, FileText, Maximize2
} from 'lucide-react';
import { AppData } from '../types';
import { useFirebase } from '../components/FirebaseProvider';
import { firebaseService } from '../lib/firebaseService';
import { storageService } from '../lib/storageService';

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

const AdminPortal = ({ data, setData }: { data: AppData, setData: (d: AppData) => void }) => {
  const { user, isAdmin, loading: authLoading, login, logout } = useFirebase();
  const [activeSection, setActiveSection] = useState<keyof AppData>('notices');
  const [uploadingPath, setUploadingPath] = useState<string | null>(null);
  const isUploading = !!uploadingPath;
  const [pendingGalleryItems, setPendingGalleryItems] = useState<PendingGalleryItem[]>([]);
  const [itemToDelete, setItemToDelete] = useState<string | string[] | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [savePending, setSavePending] = useState(false);
  const [isBulkEditing, setIsBulkEditing] = useState(false);
  const [bulkEditField, setBulkEditField] = useState<string>('');
  const [bulkEditValue, setBulkEditValue] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLegacyAuthenticated, setIsLegacyAuthenticated] = useState(false);
  const [showLegacyForm, setShowLegacyForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // No longer fetching from local API, relying on Firebase/Global Data
  }, [activeSection, isLegacyAuthenticated]);

  const handleLegacyLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginUsername === 'ankur15121985' && loginPassword === '24121985') {
      setIsLegacyAuthenticated(true);
      setLoginError('');
      showToast('Welcome back, Admin', 'success');
    } else {
      setLoginError('Invalid credentials. Access Denied.');
    }
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
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

  const renderItemCard = (item: any, section: keyof AppData) => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={item.id} className={`bg-school-paper p-6 md:p-8 rounded-3xl shadow-sm border transition-all flex flex-col md:flex-row items-start gap-6 md:gap-8 group ${selectedIds.has(item.id) ? 'border-school-gold ring-1 ring-school-gold/20' : 'border-school-ink/10'}`}>
      <div className="flex items-center justify-between w-full md:w-auto">
        <button onClick={() => toggleSelect(item.id)} className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 ${selectedIds.has(item.id) ? 'bg-school-gold border-school-gold text-school-navy scale-110' : 'border-school-ink/10 group-hover:border-school-ink/20'}`}>
          {selectedIds.has(item.id) && <Check size={14} strokeWidth={4} />}
        </button>
        <button onClick={() => setItemToDelete(item.id)} className="md:hidden p-3 rounded-xl bg-red-50 text-red-400"><Trash2 size={18} /></button>
      </div>
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {Object.keys({
          ...item,
          ...( ['notices', 'fees', 'links', 'events', 'achievements', 'transfer_certificates'].includes(section) ? { attachmentUrl: item.attachmentUrl || '' } : {})
        }).filter(k => k !== 'id').map(field => (
          <div key={field} className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-school-ink/30">{field as string}</label>
            {field === 'bio' || field === 'description' || field === 'content' ? (
               <textarea value={item[field] ?? ''} onChange={(e) => handleUpdate(item.id, field as string, e.target.value, section)} className="w-full bg-school-ink/5 border-none rounded-xl p-3 text-xs text-school-ink font-medium h-24 focus:ring-1 focus:ring-school-gold transition-all resize-none" />
            ) : (field.toLowerCase().includes('url') || field.toLowerCase().includes('image') || field.toLowerCase().includes('link') || field.toLowerCase().includes('file') || field.toLowerCase().includes('pdf') || field.toLowerCase().includes('attachment') || field === 'href' || field === 'src') ? (
              <div className="space-y-4">
                <input value={item[field] ?? ''} onChange={(e) => handleUpdate(item.id, field as string, e.target.value, section)} className="w-full bg-school-ink/5 border-none rounded-xl p-3 text-xs text-school-ink font-medium focus:ring-1 focus:ring-school-gold transition-all" />
                <div className="flex items-center gap-4">
                  <label className="flex-1 px-4 py-3 bg-school-ink/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-school-ink cursor-pointer hover:bg-school-ink/10 transition-all text-center">
                    {uploadingPath === `${section}-${item.id}-${field}` ? 'Uploading...' : 'Browse & Upload'}
                    <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, item.id, field as string, section)} disabled={!!uploadingPath} />
                  </label>
                  {(field.toLowerCase().includes('url') || field.toLowerCase().includes('image')) && item[field] && !item[field].endsWith('.pdf') && (
                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-school-ink/10 bg-school-ink/5 flex items-center justify-center">
                      <img src={item[field]} className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
            ) : field === 'type' && (section === 'staff' || section === 'popups') ? (
              <select 
                value={item[field] ?? (section === 'staff' ? 'Faculty' : 'text')} 
                onChange={(e) => handleUpdate(item.id, field as string, e.target.value, section)} 
                className="w-full bg-school-ink/5 border-none rounded-xl p-3 text-xs text-school-ink font-medium focus:ring-1 focus:ring-school-gold transition-all outline-none"
              >
                {section === 'staff' ? (
                  <>
                    <option value="Management">Management</option>
                    <option value="Faculty">Faculty</option>
                    <option value="Administration">Administration</option>
                  </>
                ) : (
                  <>
                    <option value="text">Text Message</option>
                    <option value="image">Image Popup</option>
                    <option value="pdf">PDF Download/View</option>
                  </>
                )}
              </select>
            ) : field === 'isActive' ? (
              <button 
                onClick={() => handleUpdate(item.id, field as string, !item[field], section)}
                className={`w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${item[field] ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'}`}
              >
                {item[field] ? 'Active / Enabled' : 'Inactive / Disabled'}
              </button>
            ) : field === 'parent_id' && section === 'menu' ? (
              <select 
                value={item[field] || ''} 
                onChange={(e) => handleUpdate(item.id, field as string, e.target.value || '', section)} 
                className="w-full bg-school-ink/5 border-none rounded-xl p-3 text-xs text-school-ink font-medium focus:ring-1 focus:ring-school-gold transition-all outline-none"
              >
                <option value="">None (Top Level)</option>
                {data.menu.filter(m => !m.parent_id && m.id !== item.id).map(m => (
                  <option key={m.id} value={m.id}>{m.label}</option>
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
            ) : (
              <div className="space-y-2">
                <input value={item[field] ?? ''} onChange={(e) => handleUpdate(item.id, field as string, e.target.value, section)} className="w-full bg-school-ink/5 border-none rounded-xl p-3 text-xs text-school-ink font-medium focus:ring-1 focus:ring-school-gold transition-all" />
                {(field === 'href' || field === 'label' || field === 'title' || (section === 'fees' && field === 'particulars') || (section === 'notices' && field === 'title')) && (
                  <div className="flex flex-col gap-2">
                    <label className="block text-center px-4 py-2 bg-school-gold/10 text-school-gold rounded-lg text-[9px] font-black uppercase tracking-widest cursor-pointer hover:bg-school-gold/20 transition-all">
                       {uploadingPath === `${section}-${item.id}-attachmentUrl` ? 'Uploading...' : (section === 'fees' ? 'Upload Fee PDF' : section === 'notices' ? 'Upload Notice PDF/Image' : section === 'transfer_certificates' ? 'Upload TC PDF' : 'Upload Attachment')}
                       <input type="file" className="hidden" onChange={(e) => {
                         const targetField = (['notices', 'fees', 'events', 'achievements', 'links', 'transfer_certificates'].includes(section)) ? 'attachmentUrl' : 
                                             (section === 'menu' ? 'href' : field);
                         handleFileUpload(e, item.id, targetField, section);
                       }} disabled={!!uploadingPath} />
                    </label>
                    {item.attachmentUrl && ['notices', 'fees', 'events', 'achievements', 'links', 'transfer_certificates'].includes(section as string) && (
                      <button 
                        onClick={() => handleUpdate(item.id, 'attachmentUrl', '', section)}
                        className="block text-center px-4 py-2 bg-red-400/10 text-red-400 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-red-400/20 transition-all"
                      >
                        Remove PDF/Attachment
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      <button onClick={() => setItemToDelete(item.id)} className="p-4 rounded-2xl bg-red-400/10 text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-400/20">
        <Trash2 size={20} />
      </button>
    </motion.div>
  );

  const globalResults = getGlobalSearchResults();

  const handleUpdate = (id: string, field: string, value: any, section: keyof AppData) => {
    // Optimization: Create a copy of the entire data object to avoid staleness in debounced saves
    let currentData = { ...data };

    if (section === 'settings') {
      const updatedSettings = { ...data.settings, [field]: value };
      currentData.settings = updatedSettings;
      setData(currentData);
      
      const timerId = `save-settings`;
      if ((window as any)[timerId]) clearTimeout((window as any)[timerId]);
      (window as any)[timerId] = setTimeout(async () => {
        setSavePending(true);
        try {
          await firebaseService.saveItem('settings', updatedSettings);
          showToast(`Settings (${field}) updated in Firebase`);
        } catch (err: any) {
          showToast('Settings sync failed', 'error');
        } finally {
          setSavePending(false);
        }
      }, 1000);
      return;
    }

    if (section === 'content') {
      const updatedContent = { ...data.content, [field]: value };
      currentData.content = updatedContent;
      setData(currentData);
      
      const timerId = `save-content`;
      if ((window as any)[timerId]) clearTimeout((window as any)[timerId]);
      (window as any)[timerId] = setTimeout(async () => {
        setSavePending(true);
        try {
          await firebaseService.saveItem('content', updatedContent);
          showToast('Content narrative synced');
        } catch (err: any) {
          showToast('Content sync failed', 'error');
        } finally {
          setSavePending(false);
        }
      }, 1000);
      return;
    }

    const updated = data[section] as any[];
    const newItems = updated.map((item: any) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    setData({ ...data, [section]: newItems });
    
    // Auto-save logic with debounce
    const timerId = `save-${section as string}-${id}`;
    if ((window as any)[timerId]) clearTimeout((window as any)[timerId]);
    (window as any)[timerId] = setTimeout(async () => {
      const item = newItems.find((i: any) => i.id === id);
      if (item) {
        setSavePending(true);
        try {
          await firebaseService.saveItem(section, item);
          showToast(`Synced ${section} to Firebase`);
        } catch (err: any) {
          console.error('Sync failed:', err);
          const msg = err.message.startsWith('{') ? JSON.parse(err.message).error : err.message;
          showToast(`Sync failed: ${msg}`, 'error');
        } finally {
          setSavePending(false);
        }
      }
    }, 1000);
  };

  const handleBulkUpdate = async () => {
    if (!bulkEditField || selectedIds.size === 0) return;

    const current = data[activeSection];
    if (!Array.isArray(current)) return;
    
    const updatedSection = current.map((item: any) => 
      selectedIds.has(item.id) ? { ...item, [bulkEditField]: bulkEditValue } : item
    );

    setData({ ...data, [activeSection]: updatedSection });
    setSavePending(true);
    
    try {
      const itemsToUpdate = updatedSection.filter(item => selectedIds.has(item.id));
      for (const item of itemsToUpdate) {
        await firebaseService.saveItem(activeSection, item);
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
        await firebaseService.deleteItem(activeSection, id);
      }
      
      showToast(`Successfully deleted from ${activeSection as string}`);
      const current = data[activeSection];
      if (Array.isArray(current)) {
        setData({ 
          ...data, 
          [activeSection]: current.filter((i: any) => !idList.includes(i.id)) 
        });
      }
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

  const handleAdd = async () => {
    const newItem: any = { id: Date.now().toString() };
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
    } else if (tableStr === 'gallery' || tableStr === 'carousel') {
      newItem.url = tableStr === 'gallery' 
        ? 'https://picsum.photos/seed/new_gallery/1200/800' 
        : 'https://lh3.googleusercontent.com/d/1C-_jZCL-OpkhhOV_R6oTGRfNxkhBIkHN=w1600';
      newItem.caption = tableStr === 'gallery' ? 'Gallery Image Caption' : 'Carousel Slide Title';
      if (tableStr === 'gallery') {
        newItem.session = '2024-25';
      }
    } else if (tableStr === 'links') {
      newItem.title = 'New Link';
      newItem.url = '#';
      newItem.attachmentUrl = '';
    } else if (tableStr === 'events') {
      newItem.title = 'New School Event';
      newItem.date = new Date().toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' });
      newItem.time = '10:00 AM - 12:00 PM';
      newItem.location = 'St. Xavier\'s Jaipur Main Campus';
      newItem.attachmentUrl = '';
    } else if (tableStr === 'achievements') {
      newItem.title = 'Achievement Title';
      newItem.year = '2026';
      newItem.description = 'Success story detail...';
      newItem.attachmentUrl = '';
    } else if (tableStr === 'studentHonors') {
      newItem.name = 'New Honor Student';
      newItem.category = 'Category (e.g. JEE Mains)';
      newItem.result = '99%';
      newItem.subtext = 'Additional honors details...';
      newItem.image = 'https://picsum.photos/seed/honor/300/300';
      newItem.order_index = (data.studentHonors?.length || 0);
    } else if (tableStr === 'menu') {
      newItem.label = 'New Menu Item';
      newItem.href = '#';
      newItem.parent_id = null;
      newItem.order_index = (data.menu?.filter(m => !m.parent_id).length || 0);
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
      newItem.type = 'text';
      newItem.content = 'Enter announcement details here...';
      newItem.buttonText = '';
      newItem.buttonLink = '';
      newItem.isActive = true;
      newItem.order_index = (data.popups?.length || 0);
    } else if (tableStr === 'transfer_certificates') {
      newItem.admission_number = 'TC' + Date.now().toString().slice(-6);
      newItem.dob = new Date().toISOString().split('T')[0];
      newItem.student_name = 'Student Name';
      newItem.attachmentUrl = '';
    }

    setSavePending(true);
    try {
      await firebaseService.saveItem(activeSection, newItem);
      const current = data[activeSection];
      if (Array.isArray(current)) {
        setData({ ...data, [activeSection]: [newItem, ...current] });
      }
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
      await firebaseService.syncAll(data);
      showToast('Entire database synced successfully');
    } catch (err) {
      showToast('Critical sync failure', 'error');
    } finally {
      setUploadingPath(null);
      setSavePending(false);
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
    const folder = (['fees', 'notices', 'staff', 'gallery', 'carousel', 'events', 'achievements', 'links', 'settings', 'studentHonors', 'popups'].includes(section as string)) ? section : 'misc';

    try {
      // 1. Try Firebase Storage first
      try {
        console.log(`[Upload] Attempting Firebase Storage upload to ${folder}/${file.name}...`);
        const firebaseUrl = await storageService.uploadFile(file, folder);
        console.log(`[Upload] Firebase Success: ${firebaseUrl}`);
        handleUpdate(id, field, firebaseUrl, section);
        showToast('Media uploaded & synced to Cloud', 'success');
        setUploadingPath(null);
        return; // Success
      } catch (fbErr: any) {
        console.warn('[Upload] Firebase Storage upload skipped/failed:', fbErr.message || fbErr);
      }

      // 2. Fallback to local server
      console.log(`[Upload] Falling back to local server upload...`);
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      if (res.ok) {
        const result = await res.json();
        console.log(`[Upload] Local Success: ${result.url}`);
        handleUpdate(id, field, result.url, section);
        showToast('Media saved locally. Login with Google for Cloud Sync.', 'success');
      } else {
        const text = await res.text();
        let errorMsg = `Server error (${res.status})`;
        try {
          const errorData = JSON.parse(text);
          errorMsg = errorData.error || errorMsg;
        } catch (e) {}
        console.error(`[Upload] Local Failed: ${errorMsg}`);
        showToast(`Upload failed: ${errorMsg}`, 'error');
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
    
    try {
      // 1. Try Firebase Storage
      try {
        console.log(`[Staging] Uploading ${pendingItem.file.name} to Firebase Storage...`);
        const firebaseUrl = await storageService.uploadFile(pendingItem.file, 'gallery');
        setPendingGalleryItems(prev => prev.map(p => p.id === pendingItem.id ? { ...p, status: 'completed', progress: 100, url: firebaseUrl } : p));
        return;
      } catch (fbErr: any) {
        console.warn('[Staging] Firebase Storage failed, falling back to local:', fbErr);
      }

      // 2. Fallback to local
      const formData = new FormData();
      formData.append('file', pendingItem.file);
      
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!res.ok) {
        throw new Error(`Server Error: ${res.status}`);
      }

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

    setUploadingPath('finalize');
    try {
      const newEntries = finishedItems.map(p => ({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
        url: p.url!,
        caption: p.caption || 'Gallery Image',
        session: p.session || ''
      }));

      // Map over and save to DB
      for (const entry of newEntries) {
        await firebaseService.saveItem('gallery', entry);
      }

      setData({ ...data, gallery: [...newEntries, ...data.gallery] });
      setPendingGalleryItems(prev => prev.filter(p => !finishedItems.find(f => f.id === p.id)));
      showToast(`Successfully added ${newEntries.length} images to the gallery.`);
    } catch (err) {
      console.error('Finalize failed:', err);
      showToast('Error saving gallery items', 'error');
    } finally {
      setUploadingPath(null);
    }
  };

  const sections = [
    { id: 'notices', label: 'Notices', icon: <Bell size={18} /> },
    { id: 'popups', label: 'Popups', icon: <Maximize2 size={18} className="text-school-accent" /> },
    { id: 'events', label: 'Events', icon: <Calendar size={18} /> },
    { id: 'staff', label: 'Faculty', icon: <Users2 size={18} /> },
    { id: 'carousel', label: 'Carousel', icon: <ImagePlus size={18} className="text-school-accent" /> },
    { id: 'gallery', label: 'Gallery', icon: <ImageIcon size={18} /> },
    { id: 'fees', label: 'Fees', icon: <CreditCard size={18} /> },
    { id: 'links', label: 'Links', icon: <LinkIcon size={18} /> },
    { id: 'achievements', label: 'Success', icon: <Award size={18} /> },
    { id: 'studentHonors', label: 'Honors', icon: <Award size={18} className="text-school-gold" /> },
    { id: 'faqs', label: 'FAQs', icon: <MessageSquare size={18} className="text-school-gold" /> },
    { id: 'transfer_certificates', label: 'TC Records', icon: <FileText size={18} className="text-school-accent" /> },
    { id: 'messages', label: 'Inquiries', icon: <Mail size={18} className="text-school-accent" /> },
    { id: 'menu', label: 'Menu', icon: <Menu size={18} /> },
    { id: 'content', label: 'Site Content', icon: <LayoutGrid size={18} className="text-school-neon" /> },
    { id: 'settings', label: 'Global Settings', icon: <Settings size={18} className="text-school-gold" /> }
  ];

  if (authLoading) return (
    <div className="min-h-screen bg-school-navy flex items-center justify-center">
      <Loader2 className="text-school-gold animate-spin" size={48} />
    </div>
  );

  if (!isAdmin && !isLegacyAuthenticated) {
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

            <form onSubmit={handleLegacyLogin} className="space-y-6">
               <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/60 ml-1">Username</label>
                <input 
                  type="text" 
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="Enter admin ID"
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

              <button type="submit" className="w-full bg-school-gold text-school-navy py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl active:scale-[0.98]">
                Open Console
              </button>
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
      <AnimatePresence>
        {isLegacyAuthenticated && (
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed top-0 left-0 right-0 z-[100] bg-school-gold text-school-navy px-6 py-2.5 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest shadow-lg"
          >
            <Check size={14} />
            Authenticated Session Active
          </motion.div>
        )}
      </AnimatePresence>
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
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
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all ${activeSection === s.id ? 'bg-school-gold text-school-navy font-black shadow-lg' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
              >
                {s.icon} <span className="text-[11px] uppercase tracking-widest">{s.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="mt-auto p-8 border-t border-white/5 space-y-4">
           {(!user || !isAdmin) ? (
             <button 
               onClick={() => login()} 
               className="w-full py-4 px-6 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all border border-white/10"
             >
               <Key size={14} className="text-school-gold" />
               Log in with Google to Sync Cloud
             </button>
           ) : (
             <div className="px-6 py-4 bg-school-gold/10 border border-school-gold/20 rounded-xl flex items-center gap-3">
               <div className="w-2 h-2 bg-school-gold rounded-full animate-pulse" />
               <p className="text-[9px] font-black uppercase tracking-widest text-school-gold">Cloud Sync Active: {user.email}</p>
             </div>
           )}
           {savePending && (
              <div className="px-6 py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <p className="text-[9px] font-black uppercase tracking-widest text-emerald-500 mb-1">Unsaved Changes</p>
                <p className="text-[10px] text-emerald-500/60 font-light leading-relaxed">Changes made here are not permanent until saved.</p>
              </div>
           )}
           <button onClick={() => navigate('/')} className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white flex items-center gap-3 transition-colors"><ChevronRight size={14} className="rotate-180" /> Exit Portal</button>
        </div>
      </aside>

      <main className="flex-1 md:ml-80 p-6 md:p-12 min-w-0">
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

        <header className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-12 mb-16">
          <div className="flex-1 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
               <div className="flex items-center gap-4">
                 <h1 className="text-3xl md:text-5xl font-serif font-black text-school-navy tracking-tight capitalize">
                   {searchQuery ? 'Search Results' : `Manage ${activeSection}`}
                 </h1>
                 {!searchQuery && (
                   <span className="px-3 py-1 bg-school-ink/10 text-school-ink/40 rounded-lg text-[8px] font-black uppercase tracking-widest self-center md:self-end mb-2">
                     Firebase Collection: {activeSection}
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
        {!searchQuery && activeSection !== 'settings' && activeSection !== 'content' && (
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
            {activeSection === 'gallery' && (
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
            <button onClick={handleAdd} className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-school-gold text-school-navy rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all outline-none whitespace-nowrap">
              <Plus size={16} /> New Item
            </button>
          </div>
        )}
        </header>

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
                        <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-2 px-1">Caption Entry</p>
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
                        <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-2 px-1">Session / Year (e.g. 2024-25)</p>
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
          {activeSection === 'fees' && (
            <div className="mb-12 bg-school-navy p-10 rounded-[40px] shadow-2xl border border-white/5 space-y-8">
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
                <div className="aspect-[16/6] w-full bg-white rounded-3xl overflow-hidden shadow-inner border border-white/10 relative group bg-school-paper">
                  <iframe 
                    src={`${data.settings.feesPdfUrl}#toolbar=0`}
                    className="w-full h-full border-none"
                    title="Fee Documentation Preview"
                  />
                  <div className="absolute inset-0 bg-school-navy/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <div className="flex flex-col items-center gap-4">
                       <Maximize2 size={32} className="text-school-gold" />
                       <p className="text-[10px] font-black uppercase tracking-widest text-white">Live PDF Preview Mode</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {activeSection === 'settings' ? (
            <div className="bg-school-paper p-10 rounded-[40px] shadow-2xl border border-school-ink/10 space-y-12">
               <div>
                 <h2 className="text-3xl font-serif font-black text-school-navy italic tracking-tight mb-4">Global Site Settings</h2>
                 <p className="text-sm text-school-navy/60 leading-relaxed font-light">Site-wide configurations, contact information, and main branding assets.</p>
               </div>
               
               <div className="grid md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                     <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/40">Site Name</label>
                     <input 
                       value={data.settings.siteName}
                       onChange={(e) => handleUpdate('global', 'siteName', e.target.value, 'settings')}
                       className="w-full bg-school-ink/5 border-none rounded-2xl py-4 px-6 text-sm font-bold text-school-navy focus:ring-2 focus:ring-school-gold/20 outline-none transition-all"
                     />
                  </div>
                  <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/40">Site Logo URL</label>
                        <label className="px-6 py-2 bg-school-gold/10 text-school-gold rounded-full text-[9px] font-black uppercase tracking-widest cursor-pointer hover:bg-school-gold/20 transition-all">
                          {uploadingPath === 'settings-global-siteLogo' ? 'Uploading...' : 'Upload Logo'}
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'global', 'siteLogo', 'settings')} disabled={!!uploadingPath} />
                        </label>
                      </div>
                      <input 
                       value={data.settings.siteLogo}
                       onChange={(e) => handleUpdate('global', 'siteLogo', e.target.value, 'settings')}
                       className="w-full bg-school-ink/5 border-none rounded-2xl py-4 px-6 text-xs font-mono text-school-ink/60 focus:ring-2 focus:ring-school-gold/20 outline-none transition-all"
                     />
                  </div>
               </div>

               <div className="grid md:grid-cols-3 gap-12 pt-12 border-t border-school-ink/5">
                  <div className="space-y-6">
                     <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/40">Contact Email</label>
                     <input 
                       value={data.settings.contactEmail}
                       onChange={(e) => handleUpdate('global', 'contactEmail', e.target.value, 'settings')}
                       className="w-full bg-school-ink/5 border-none rounded-2xl py-4 px-6 text-sm font-bold text-school-navy focus:ring-2 focus:ring-school-gold/20 outline-none transition-all"
                     />
                  </div>
                  <div className="space-y-6">
                     <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/40">Contact Phone</label>
                     <input 
                       value={data.settings.contactPhone}
                       onChange={(e) => handleUpdate('global', 'contactPhone', e.target.value, 'settings')}
                       className="w-full bg-school-ink/5 border-none rounded-2xl py-4 px-6 text-sm font-bold text-school-navy focus:ring-2 focus:ring-school-gold/20 outline-none transition-all"
                     />
                  </div>
                  <div className="space-y-6">
                     <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/40">Contact Address</label>
                     <textarea 
                       value={data.settings.contactAddress}
                       onChange={(e) => handleUpdate('global', 'contactAddress', e.target.value, 'settings')}
                       className="w-full bg-school-ink/5 border-none rounded-2xl py-4 px-6 text-sm font-bold text-school-navy focus:ring-2 focus:ring-school-gold/20 outline-none transition-all h-24 resize-none"
                     />
                  </div>
               </div>

               <div className="pt-12 border-t border-school-ink/5">
                <div className="space-y-6 pt-12 border-t border-school-ink/5">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/40">Fees Structure PDF URL</label>
                      <label className="px-6 py-2 bg-school-gold/10 text-school-gold rounded-full text-[9px] font-black uppercase tracking-widest cursor-pointer hover:bg-school-gold/20 transition-all">
                        {uploadingPath === 'settings-global-feesPdfUrl' ? 'Uploading...' : 'Upload Fee PDF'}
                        <input type="file" className="hidden" accept=".pdf" onChange={(e) => handleFileUpload(e, 'global', 'feesPdfUrl', 'settings')} disabled={!!uploadingPath} />
                      </label>
                    </div>
                    <input 
                      value={data.settings.feesPdfUrl || ''}
                      onChange={(e) => handleUpdate('global', 'feesPdfUrl', e.target.value, 'settings')}
                      className="w-full bg-school-ink/5 border-none rounded-2xl py-4 px-6 text-xs font-mono text-school-ink/60 focus:ring-2 focus:ring-school-gold/20 outline-none transition-all"
                      placeholder="Public URL to the fee structure PDF"
                    />
                </div>

                 <h2 className="text-2xl font-serif font-black text-school-navy italic tracking-tight mb-8">Application Module</h2>
                 <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                       <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/40">Module Status</label>
                       <div className="flex items-center gap-4">
                          <button 
                            onClick={() => handleUpdate('global', 'applyNowEnabled', !data.settings.applyNowEnabled, 'settings')}
                            className={`w-20 h-10 rounded-full relative transition-all ${data.settings.applyNowEnabled ? 'bg-emerald-500' : 'bg-school-ink/10'}`}
                          >
                             <motion.div 
                               animate={{ x: data.settings.applyNowEnabled ? 44 : 4 }}
                               className="w-8 h-8 rounded-full bg-white shadow-lg absolute top-1 left-0"
                             />
                          </button>
                          <span className="text-xs font-black text-school-ink uppercase tracking-widest">
                            {data.settings.applyNowEnabled ? 'Enabled' : 'Disabled'}
                          </span>
                       </div>
                    </div>

                    <div className="space-y-6">
                       <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/40">Action Label</label>
                       <input 
                         value={data.settings.applyNowLabel}
                         onChange={(e) => handleUpdate('global', 'applyNowLabel', e.target.value, 'settings')}
                         className="w-full bg-school-ink/5 border-none rounded-2xl py-4 px-6 text-sm font-bold text-school-navy focus:ring-2 focus:ring-school-gold/20 outline-none transition-all"
                       />
                    </div>
                 </div>

                 <div className="space-y-6 mt-12">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/40">Document Link (PDF)</label>
                      <label className="px-6 py-2 bg-school-gold/10 text-school-gold rounded-full text-[9px] font-black uppercase tracking-widest cursor-pointer hover:bg-school-gold/20 transition-all">
                        {uploadingPath === 'settings-global-applyNowUrl' ? 'Uploading...' : 'Update PDF'}
                        <input type="file" className="hidden" accept=".pdf" onChange={(e) => handleFileUpload(e, 'global', 'applyNowUrl', 'settings')} disabled={!!uploadingPath} />
                      </label>
                    </div>
                    <input 
                      value={data.settings.applyNowUrl}
                      onChange={(e) => handleUpdate('global', 'applyNowUrl', e.target.value, 'settings')}
                      className="w-full bg-school-ink/5 border-none rounded-2xl py-4 px-6 text-xs font-mono text-school-ink/60 focus:ring-2 focus:ring-school-gold/20 outline-none transition-all"
                    />
                 </div>
                  <h2 className="text-2xl font-serif font-black text-school-navy italic tracking-tight mb-8 mt-16 pt-16 border-t border-school-ink/5">Institutional Popup Notice</h2>
                  <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                      <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/40">Popup Visibility</label>
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => handleUpdate('global', 'popupEnabled', !data.settings.popupEnabled, 'settings')}
                          className={`w-20 h-10 rounded-full relative transition-all ${data.settings.popupEnabled ? 'bg-school-accent' : 'bg-school-ink/10'}`}
                        >
                          <motion.div 
                            animate={{ x: data.settings.popupEnabled ? 44 : 4 }}
                            className="w-8 h-8 rounded-full bg-white shadow-lg absolute top-1 left-0"
                          />
                        </button>
                        <span className="text-xs font-black text-school-ink uppercase tracking-widest">
                          {data.settings.popupEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <label className="text-[10px] font-black uppercase tracking-widest text-school-ink/40">Message Content</label>
                      <textarea 
                        value={data.settings.popupMessage || ''}
                        onChange={(e) => handleUpdate('global', 'popupMessage', e.target.value, 'settings')}
                        placeholder="Enter the message that will pop up for all visitors..."
                        className="w-full bg-school-ink/5 border-none rounded-2xl py-4 px-6 text-sm font-bold text-school-navy focus:ring-2 focus:ring-school-gold/20 outline-none transition-all h-32 resize-none"
                      />
                    </div>
                  </div>
               </div>
            </div>
          ) : activeSection === 'content' ? (
            <div className="space-y-12">
              <div className="bg-school-navy p-10 rounded-[40px] shadow-2xl flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-serif font-black text-white italic tracking-tight mb-4">Site Narrative & Labels</h2>
                  <p className="text-sm text-white/40 leading-relaxed font-light max-w-xl">Modify all headings, descriptions, and labels used throughout the website sections.</p>
                </div>
                <button 
                  onClick={() => {
                    const key = prompt('Enter new content key (camelCase recommended):');
                    if (key) handleUpdate('global', key, 'New Content', 'content');
                  }}
                  className="px-8 py-4 bg-school-neon text-school-ink rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
                >
                  Add New Key
                </button>
              </div>
              <div className="grid gap-6">
                {Object.keys(data.content).sort().map((key) => (
                  <div key={key} className="bg-school-paper p-8 rounded-3xl border border-school-ink/10 shadow-sm group">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                       <div className="w-full md:w-64 space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-school-accent">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                            {/* Option to delete custom keys? Optional but good for flexibility */}
                            {['heroTitle1', 'heroTitle2', 'heroBadge'].indexOf(key) === -1 && (
                              <button 
                                onClick={() => {
                                  if (confirm(`Delete content key "${key}"?`)) {
                                    const newContent = { ...data.content };
                                    delete newContent[key];
                                    setData({ ...data, content: newContent });
                                    firebaseService.saveItem('content', { id: 'global', ...newContent }).catch(() => {});
                                  }
                                }}
                                className="text-red-500 opacity-0 group-hover:opacity-50 hover:opacity-100 transition-all text-[8px] font-black uppercase tracking-widest"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                          <p className="text-[9px] font-bold text-school-ink/30 uppercase tracking-widest">Key: {key}</p>
                       </div>
                       <div className="flex-1 w-full">
                          {data.content[key].length > 100 ? (
                            <textarea 
                              value={data.content[key]}
                              onChange={(e) => handleUpdate('global', key, e.target.value, 'content')}
                              className="w-full bg-school-ink/5 border-none rounded-2xl p-6 text-sm font-medium text-school-ink focus:ring-2 focus:ring-school-gold/20 outline-none transition-all h-32 resize-none"
                            />
                          ) : (
                            <input 
                              type="text"
                              value={data.content[key]}
                              onChange={(e) => handleUpdate('global', key, e.target.value, 'content')}
                              className="w-full bg-school-ink/5 border-none rounded-2xl p-6 text-sm font-black text-school-ink focus:ring-2 focus:ring-school-gold/20 outline-none transition-all"
                            />
                          )}
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : searchQuery ? (
            globalResults.length > 0 ? (
              globalResults.map(({ section, items }) => (
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
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-20 h-20 bg-school-ink/5 rounded-full flex items-center justify-center text-school-ink/20 mb-6">
                   <Search size={40} />
                </div>
                <h3 className="text-xl font-black text-school-ink mb-2 uppercase tracking-widest">No Results Found</h3>
                <p className="text-sm text-school-ink/30 max-w-xs mx-auto">We couldn't find any items matching "{searchQuery}" in any of your tables.</p>
              </div>
            )
          ) : (
            Array.isArray(data[activeSection]) && (data[activeSection] as any[]).map((item: any) => renderItemCard(item, activeSection))
          )}
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
