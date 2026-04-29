import { AppData } from '../types';
import { supabase } from '../supabaseClient';

export const firebaseService = {
  async fetchAllData(): Promise<Partial<AppData>> {
    try {
      const collections: (keyof AppData)[] = [
        'notices', 'staff', 'gallery', 'fees', 'links', 
        'events', 'achievements', 'studentHonors', 'menu', 'carousel', 'popups', 'transfer_certificates', 'faqs', 'messages'
      ];

      const results: Partial<AppData> = {};
      
      await Promise.all([
        ...collections.map(async (colName) => {
          const { data, error } = await supabase.from(colName).select('*');
          if (error) {
            console.warn(`Error fetching ${colName}:`, error.message);
            results[colName] = [];
            return;
          }
          results[colName] = data as any;
        }),
        // Settings (single row)
        (async () => {
           const { data, error } = await supabase.from('settings').select('*').limit(1).maybeSingle();
           if (error) console.warn('Error fetching settings:', error.message);
           if (data) results.settings = data as any;
        })(),
        // Content (key-value)
        (async () => {
           const { data, error } = await supabase.from('content').select('*');
           if (error) console.warn('Error fetching content:', error.message);
           if (data) {
             const contentObj: Record<string, string> = {};
             data.forEach(row => contentObj[row.key] = row.value);
             results.content = contentObj;
           }
        })()
      ]);

      return results;
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local server:', err);
      try {
        const res = await fetch('/api/data');
        if (!res.ok) throw new Error('Failed to fetch from local server');
        return await res.json();
      } catch (localError) {
        console.error('All data sources failed:', localError);
        return {};
      }
    }
  },

  async saveItem(section: keyof AppData, item: any): Promise<void> {
    try {
      // Primary: Save to Supabase
      try {
        if (section === 'content') {
          const contentUpserts = Object.entries(item)
            .map(([key, value]) => ({ id: 'global', key, value: String(value) }));
          await supabase.from('content').upsert(contentUpserts);
        } else {
          // Convert types for Supabase
          const sanitized = { ...item };
          if (section === 'popups' && 'isActive' in sanitized) sanitized.isActive = !!sanitized.isActive;
          if (section === 'settings' && 'applyNowEnabled' in sanitized) sanitized.applyNowEnabled = !!sanitized.applyNowEnabled;
          
          const { error } = await supabase.from(section).upsert(sanitized);
          if (error) throw error;
        }
        console.log(`[Supabase Sync] ${section} item synced`);
      } catch (err: any) {
        console.warn('[Supabase Sync Warning] Failed to update Supabase:', err.message);
      }

      // Secondary: Save to local server (fallback/legacy)
      await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table: section, item })
      }).catch(e => console.warn('Local save failed:', e));

    } catch (error) {
      console.error('Save failed:', error);
      throw error;
    }
  },

  async deleteItem(section: keyof AppData, id: string): Promise<void> {
    try {
      // 1. Delete from Supabase
      try {
        const { error } = await supabase.from(section).delete().eq('id', id);
        if (error) throw error;
        console.log(`[Supabase Sync] ${section} item deleted`);
      } catch (err: any) {
        console.warn('[Supabase Sync Warning] Failed to delete from Supabase:', err.message);
      }

      // 2. Delete from local server
      await fetch('/api/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table: section, id })
      }).catch(e => console.warn('Local delete failed:', e));

    } catch (error) {
       console.error('Delete failed:', error);
       throw error;
    }
  },

  async syncAll(data: AppData): Promise<void> {
    const collections = Object.keys(data) as (keyof AppData)[];
    for (const section of collections) {
      const value = data[section];
      if (Array.isArray(value)) {
        for (const item of value) {
          await this.saveItem(section, item);
        }
      } else if (value && typeof value === 'object') {
        await this.saveItem(section, value);
      }
    }
  },

  async checkAdmin(uid: string): Promise<boolean> {
    return true; 
  },

  async migrateToSupabase(url: string, key: string) {
    const res = await fetch('/api/migrate-to-supabase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, key })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Migration failed');
    }
    return await res.json();
  }
};
