import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UploadCloud, Check, X, Image as ImageIcon, Loader2, Trash2, Calendar, LayoutGrid, Plus } from 'lucide-react';
import { storageService } from '../../lib/storageService';
import { supabaseService } from '../../lib/supabaseService';
import { GalleryItem, AppData } from '../../types';

interface GalleryBulkUploadProps {
  onComplete: (newItems: GalleryItem[]) => void;
  onCancel: () => void;
  currentSession: string;
}

const GalleryBulkUpload: React.FC<GalleryBulkUploadProps> = ({ onComplete, onCancel, currentSession }) => {
  const [session, setSession] = useState(currentSession || '2024-25');
  const [eventName, setEventName] = useState('');
  const [files, setFiles] = useState<{ id: string, file: File, preview: string, progress: number, status: 'pending' | 'uploading' | 'completed' | 'error' }[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file),
        progress: 0,
        status: 'pending' as const
      }));
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => {
      const filtered = prev.filter(f => f.id !== id);
      // Clean up object URL to prevent memory leaks
      const removed = prev.find(f => f.id === id);
      if (removed) URL.revokeObjectURL(removed.preview);
      return filtered;
    });
  };

  const startUpload = async () => {
    if (files.length === 0 || !eventName) return;
    setIsUploading(true);

    const uploadedItems: GalleryItem[] = [];

    for (let i = 0; i < files.length; i++) {
        const fileObj = files[i];
        if (fileObj.status === 'completed') continue;

        setFiles(prev => prev.map(f => f.id === fileObj.id ? { ...f, status: 'uploading' } : f));

        try {
            const folder = `gallery/${session}/${eventName.replace(/\s+/g, '_').toLowerCase()}`;
            const publicUrl = await storageService.uploadFile(fileObj.file, folder);

            const newItem: GalleryItem = {
                id: crypto.randomUUID(),
                url: publicUrl,
                caption: eventName,
                session: session,
                is_enabled: true
            };

            await supabaseService.saveItem('gallery', newItem);
            uploadedItems.push(newItem);

            setFiles(prev => prev.map(f => f.id === fileObj.id ? { ...f, status: 'completed', progress: 100 } : f));
        } catch (error) {
            console.error('Upload failed for file:', fileObj.file.name, error);
            setFiles(prev => prev.map(f => f.id === fileObj.id ? { ...f, status: 'error' } : f));
        }
    }

    setIsUploading(false);
    if (uploadedItems.length > 0) {
        onComplete(uploadedItems);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[40px] shadow-2xl border border-school-ink/5 overflow-hidden"
    >
      <div className="p-8 md:p-12 border-b border-school-ink/5 bg-school-paper">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-2">
                <h3 className="text-3xl font-serif font-black text-school-navy italic">Bulk Gallery Sync</h3>
                <p className="text-xs font-black uppercase tracking-widest text-school-ink/30">Automated multi-image provisioning</p>
            </div>
            <div className="flex items-center gap-4">
                <button 
                  onClick={onCancel}
                  className="px-8 py-4 bg-school-ink/5 text-school-ink rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-school-ink/10 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={startUpload}
                  disabled={isUploading || files.length === 0 || !eventName}
                  className="px-8 py-4 bg-school-gold text-school-navy rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-school-gold/90 transition-all shadow-lg shadow-school-gold/20 disabled:opacity-50 disabled:cursor-not-allowed group flex items-center gap-2"
                >
                  {isUploading ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
                  {isUploading ? 'Synchronizing...' : `Deploy ${files.length} Assets`}
                </button>
            </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-school-gold">Target Academic Session</label>
                <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-school-gold" size={16} />
                    <select 
                      value={session}
                      onChange={(e) => setSession(e.target.value)}
                      className="w-full bg-white border-2 border-school-ink/5 rounded-2xl p-4 pl-12 text-sm font-bold text-school-navy outline-none focus:border-school-gold transition-all"
                    >
                        <option value="2024-25">2024-25</option>
                        <option value="2023-24">2023-24</option>
                        <option value="2022-23">2022-23</option>
                        <option value="2021-22">2021-22</option>
                        <option value="Institutional Archives">Institutional Archives</option>
                    </select>
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-school-gold">Event Designation / Caption</label>
                <div className="relative">
                    <LayoutGrid className="absolute left-4 top-1/2 -translate-y-1/2 text-school-gold" size={16} />
                    <input 
                      type="text"
                      placeholder="e.g. Annual Sports Meet 2024"
                      value={eventName}
                      onChange={(e) => setEventName(e.target.value)}
                      className="w-full bg-white border-2 border-school-ink/5 rounded-2xl p-4 pl-12 text-sm font-bold text-school-navy outline-none focus:border-school-gold transition-all"
                    />
                </div>
            </div>
        </div>
      </div>

      <div className="p-8 md:p-12">
        {files.length === 0 ? (
            <label className="block w-full border-4 border-dashed border-school-ink/5 rounded-[40px] p-20 text-center cursor-pointer hover:border-school-gold/30 hover:bg-school-gold/[0.02] transition-all group">
                <input type="file" multiple accept="image/*" onChange={onFileChange} className="hidden" />
                <div className="flex flex-col items-center gap-6">
                    <div className="w-20 h-20 bg-school-gold/10 rounded-3xl flex items-center justify-center text-school-gold group-hover:scale-110 transition-transform">
                        <UploadCloud size={40} />
                    </div>
                    <div>
                        <p className="text-xl font-serif font-black text-school-navy italic">Drop Assets for Selection</p>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-school-ink/30 mt-2">Maximum 5MB per image • JPG, PNG, WEBP</p>
                    </div>
                    <span className="px-8 py-3 bg-school-navy text-white rounded-xl text-[9px] font-black uppercase tracking-widest">Select Files from Computer</span>
                </div>
            </label>
        ) : (
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black uppercase tracking-widest text-school-ink/40">{files.length} Assets Staged for Provisioning</p>
                    <button onClick={() => setFiles([])} className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:underline">Clear Selection</button>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                    <AnimatePresence>
                        {files.map((f) => (
                            <motion.div 
                              key={f.id}
                              layout
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              className="aspect-square bg-school-ink/5 rounded-2xl overflow-hidden relative group border border-school-ink/5"
                            >
                                <img src={f.preview} className="w-full h-full object-cover" />
                                
                                {f.status === 'uploading' && (
                                    <div className="absolute inset-0 bg-school-navy/60 backdrop-blur-sm flex items-center justify-center">
                                        <Loader2 className="text-school-gold animate-spin" size={24} />
                                    </div>
                                )}
                                
                                {f.status === 'completed' && (
                                    <div className="absolute inset-0 bg-emerald-500/60 backdrop-blur-sm flex items-center justify-center">
                                        <Check className="text-white" size={24} />
                                    </div>
                                )}

                                {f.status === 'error' && (
                                    <div className="absolute inset-0 bg-red-500/60 backdrop-blur-sm flex items-center justify-center">
                                        <X className="text-white" size={24} />
                                    </div>
                                )}

                                {f.status === 'pending' && !isUploading && (
                                    <button 
                                      onClick={() => removeFile(f.id)}
                                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {!isUploading && (
                         <label className="aspect-square border-2 border-dashed border-school-ink/10 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-school-gold hover:bg-school-gold/5 transition-all text-school-ink/30 hover:text-school-gold group">
                            <input type="file" multiple accept="image/*" onChange={onFileChange} className="hidden" />
                            <Plus size={24} className="group-hover:rotate-90 transition-transform" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Add More</span>
                         </label>
                    )}
                </div>
            </div>
        )}
      </div>

      {isUploading && (
        <div className="bg-school-navy p-4 flex items-center justify-center gap-4">
            <Loader2 className="text-school-gold animate-spin" size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Cloud Provisioning in Progress... Do not close the window.</span>
        </div>
      )}
    </motion.div>
  );
};

export default GalleryBulkUpload;
