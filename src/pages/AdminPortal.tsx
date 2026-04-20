import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Bell, Calendar, Users2, ImageIcon, CreditCard, Link as LinkIcon, Award, 
  Trash2, Plus, Check, X, ChevronRight, Settings, Key
} from 'lucide-react';
import { AppData } from '../types';

const AdminPortal = ({ data, setData }: { data: AppData, setData: (d: AppData) => void }) => {
  const [activeSection, setActiveSection] = useState<keyof AppData>('notices');
  const [isUploading, setIsUploading] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | string[] | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [savePending, setSavePending] = useState(false);
  const navigate = useNavigate();

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleRemove = async (ids: string | string[]) => {
    const isBulk = Array.isArray(ids);
    const idList = isBulk ? ids : [ids];

    // Cleanup any pending save timers for these IDs
    idList.forEach(id => {
      const timerId = `save-${activeSection as string}-${id}`;
      if ((window as any)[timerId]) {
        clearTimeout((window as any)[timerId]);
        delete (window as any)[timerId];
      }
    });

    try {
      const res = await fetch('/api/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          table: activeSection as string, 
          id: !isBulk ? ids : undefined,
          ids: isBulk ? ids : undefined 
        })
      });
      if (res.ok) {
        showToast(`Successfully deleted from ${activeSection as string}`);
        setData({ 
          ...data, 
          [activeSection]: data[activeSection].filter((i: any) => !idList.includes(i.id)) 
        });
        setItemToDelete(null);
        setSelectedIds(new Set());
      } else {
        const err = await res.json();
        showToast(`Delete failed: ${err.error}`, 'error');
      }
    } catch (err) {
      console.error('Delete failed:', err);
      showToast('Network error during deletion', 'error');
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === data[activeSection].length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(data[activeSection].map((i: any) => i.id)));
    }
  };

  const handleAdd = () => {
    const newItem: any = { id: Date.now().toString() };
    const tableStr = activeSection as string;
    if (tableStr === 'notices') {
      newItem.title = 'New Notice Title';
      newItem.date = new Date().toLocaleDateString();
      newItem.category = 'Circular';
    } else if (tableStr === 'events') {
      newItem.title = 'New Event';
      newItem.date = 'Selected Date';
      newItem.time = '10:00 AM';
      newItem.location = 'Campus Grounds';
    } else if (tableStr === 'staff') {
      newItem.name = 'New Staff Member';
      newItem.role = 'Role Description';
      newItem.bio = 'Staff biography goes here...';
      newItem.type = 'Faculty';
      newItem.image = 'https://picsum.photos/seed/new/400/400';
    } else if (tableStr === 'gallery') {
       newItem.url = 'https://picsum.photos/seed/new_gallery/1200/800';
       newItem.caption = 'Gallery Image Caption';
    } else if (tableStr === 'fees') {
       newItem.grade = 'New Grade';
       newItem.admissionFee = '₹0';
       newItem.tuition_fees = '₹0';
       newItem.quarterly = '₹0';
    } else if (tableStr === 'links') {
       newItem.title = 'New Link';
       newItem.url = '#';
    } else if (tableStr === 'achievements') {
       newItem.title = 'Achievement Title';
       newItem.year = '2026';
       newItem.description = 'Success story detail...';
    }

    setData({ ...data, [activeSection]: [newItem, ...data[activeSection]] });
    setSavePending(true);
    showToast('New item added locally. Don\'t forget to save changes!', 'success');
  };

  const handleSaveAll = async () => {
    setIsUploading(true);
    try {
      const items = data[activeSection];
      let successCount = 0;
      
      for (const item of items) {
        const res = await fetch('/api/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ table: activeSection as string, item })
        });
        if (res.ok) successCount++;
      }

      if (successCount === items.length) {
        showToast(`Successfully saved all ${items.length} items to ${activeSection as string}`);
        setSavePending(false);
      } else {
        showToast(`Saved ${successCount}/${items.length} items. Some failed.`, 'error');
      }
    } catch (err) {
      console.error('Save all failed:', err);
      showToast('Network error while saving', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdate = (id: string, field: string, value: string) => {
    const updatedSection = data[activeSection].map((i: any) => 
      i.id === id ? { ...i, [field]: value } : i
    );
    setData({ ...data, [activeSection]: updatedSection });
    setSavePending(true);
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

  const handleBatchUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    try {
      const res = await fetch('/api/gallery/upload-multiple', {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();
      
      if (result.urls && Array.isArray(result.urls)) {
        const newItems = result.urls.map((url: string) => ({
          id: (Date.now() + Math.random()).toString(),
          url,
          caption: 'Batch Uploaded Image'
        }));

        for (const item of newItems) {
          await fetch('/api/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ table: 'gallery', item })
          });
        }

        setData({ ...data, gallery: [...newItems, ...data.gallery] });
      }
    } catch (err) {
      console.error('Batch upload failed:', err);
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
        <div className="mt-auto p-8 border-t border-white/5 space-y-4">
           {savePending && (
              <div className="px-6 py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <p className="text-[9px] font-black uppercase tracking-widest text-emerald-500 mb-1">Unsaved Changes</p>
                <p className="text-[10px] text-emerald-500/60 font-light leading-relaxed">Changes made here are not permanent until saved.</p>
              </div>
           )}
           <button onClick={() => navigate('/')} className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white flex items-center gap-3 transition-colors"><ChevronRight size={14} className="rotate-180" /> Exit Portal</button>
        </div>
      </aside>

      <main className="flex-1 ml-80 p-12">
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

        <header className="flex justify-between items-end mb-16">
          <div>
            <h1 className="text-5xl font-serif font-black text-school-navy mb-4 tracking-tight capitalize">Manage {activeSection}</h1>
            <p className="text-sm text-school-navy/40 font-light">Comprehensive CRUD control for {activeSection} on the main portal.</p>
          </div>
          <div className="flex gap-4">
            {savePending && (
              <motion.button initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} onClick={handleSaveAll} className="flex items-center gap-3 px-8 py-4 bg-emerald-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all outline-none">
                <Check size={16} /> Save Changes
              </motion.button>
            )}
            {selectedIds.size > 0 && (
              <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} onClick={() => setItemToDelete(Array.from(selectedIds))} className="flex items-center gap-3 px-8 py-4 bg-red-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-red-600 transition-all outline-none">
                <Trash2 size={16} /> Delete Selected ({selectedIds.size})
              </motion.button>
            )}
            {activeSection === 'gallery' && (
              <label className="flex items-center gap-3 px-8 py-4 glass-dark text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all outline-none cursor-pointer">
                <ImageIcon size={16} /> {isUploading ? 'Uploading...' : 'Bulk Upload'}
                <input type="file" multiple className="hidden" accept="image/*" onChange={handleBatchUpload} disabled={isUploading} />
              </label>
            )}
            <button onClick={handleAdd} className="flex items-center gap-3 px-8 py-4 bg-school-gold text-school-navy rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all outline-none">
              <Plus size={16} /> New {
                activeSection === 'fees' ? 'Fee Class' : activeSection === 'staff' ? 'Faculty Member' : activeSection === 'gallery' ? 'Gallery Item' : activeSection === 'achievements' ? 'Achievement' : activeSection === 'links' ? 'Quick Link' : activeSection === 'events' ? 'Event' : 'Notice'
              }
            </button>
          </div>
        </header>

        {data[activeSection].length > 0 && (
          <div className="mb-6 flex items-center gap-4 px-4">
            <button onClick={toggleSelectAll} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-school-navy/40 hover:text-school-navy transition-colors">
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${selectedIds.size === data[activeSection].length ? 'bg-school-gold border-school-gold text-school-navy' : 'border-slate-300'}`}>
                {selectedIds.size === data[activeSection].length && <Check size={12} strokeWidth={4} />}
              </div>
              {selectedIds.size === data[activeSection].length ? 'Deselect All' : 'Select All'}
            </button>
          </div>
        )}

        <div className="grid gap-6">
          {data[activeSection].map((item: any) => (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={item.id} className={`bg-white p-8 rounded-3xl shadow-sm border transition-all flex items-start gap-8 group ${selectedIds.has(item.id) ? 'border-school-gold ring-1 ring-school-gold/20' : 'border-slate-200'}`}>
              <button onClick={() => toggleSelect(item.id)} className={`mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 ${selectedIds.has(item.id) ? 'bg-school-gold border-school-gold text-school-navy scale-110' : 'border-slate-200 group-hover:border-slate-300'}`}>
                {selectedIds.has(item.id) && <Check size={14} strokeWidth={4} />}
              </button>
              <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-6">
                {Object.keys(item).filter(k => k !== 'id').map(field => (
                  <div key={field} className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-300">{field as string}</label>
                    {field === 'bio' || field === 'description' ? (
                       <textarea value={item[field]} onChange={(e) => handleUpdate(item.id, field as string, e.target.value)} className="w-full bg-slate-50 border-none rounded-xl p-3 text-xs text-school-navy font-medium h-24 focus:ring-1 focus:ring-school-gold transition-all resize-none" />
                    ) : (field === 'url' || field === 'image') && (activeSection === 'gallery' || activeSection === 'staff') ? (
                      <div className="space-y-4">
                        <input value={item[field]} onChange={(e) => handleUpdate(item.id, field as string, e.target.value)} className="w-full bg-slate-50 border-none rounded-xl p-3 text-xs text-school-navy font-medium focus:ring-1 focus:ring-school-gold transition-all" />
                        <div className="flex items-center gap-4">
                          <label className="flex-1 px-4 py-3 bg-school-navy/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-school-navy cursor-pointer hover:bg-school-navy/10 transition-all text-center">
                            {isUploading ? 'Uploading...' : activeSection === 'staff' ? 'Upload Image' : 'Direct Upload'}
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, item.id, field as string)} disabled={isUploading} />
                          </label>
                          <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
                            {item[field] && <img src={item[field]} className="w-full h-full object-cover" />}
                          </div>
                        </div>
                      </div>
                    ) : field === 'type' && activeSection === 'staff' ? (
                      <select 
                        value={item[field]} 
                        onChange={(e) => handleUpdate(item.id, field as string, e.target.value)} 
                        className="w-full bg-slate-50 border-none rounded-xl p-3 text-xs text-school-navy font-medium focus:ring-1 focus:ring-school-gold transition-all outline-none"
                      >
                        <option value="Management">Management</option>
                        <option value="Faculty">Faculty</option>
                        <option value="Administration">Administration</option>
                      </select>
                    ) : (
                       <input value={item[field]} onChange={(e) => handleUpdate(item.id, field as string, e.target.value)} className="w-full bg-slate-50 border-none rounded-xl p-3 text-xs text-school-navy font-medium focus:ring-1 focus:ring-school-gold transition-all" />
                    )}
                  </div>
                ))}
              </div>
              <button onClick={() => setItemToDelete(item.id)} className="p-4 rounded-2xl bg-red-50 text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-100"><Trash2 size={20} /></button>
            </motion.div>
          ))}
        </div>
      </main>

      <AnimatePresence>
        {itemToDelete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setItemToDelete(null)} className="absolute inset-0 bg-school-navy/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-md glass-surface rounded-[32px] p-10 overflow-hidden">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6"><Trash2 size={32} /></div>
                <h3 className="text-3xl font-serif font-black text-school-navy mb-4">Confirm Deletion</h3>
                <p className="text-sm text-school-navy/50 font-light mb-10 leading-relaxed">Are you absolutely sure? This action is irreversible.</p>
                <div className="flex gap-4 w-full">
                  <button onClick={() => setItemToDelete(null)} className="flex-1 py-4 glass-surface rounded-xl text-[10px] font-black uppercase tracking-widest text-school-navy">Cancel</button>
                  <button onClick={() => handleRemove(itemToDelete)} className="flex-1 py-4 bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">Confirm Delete</button>
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
