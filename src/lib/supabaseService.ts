import { AppData } from '../types';
import { supabase } from '../supabaseClient';

export const supabaseService = {
  async fetchAllData(): Promise<Partial<AppData>> {
    try {
      const collections: (keyof AppData)[] = [
        'notices', 'staff', 'gallery', 'fees', 'links', 
        'events', 'achievements', 'studentHonors', 'menu', 'carousel', 'popups', 'transfer_certificates', 'faqs', 'messages', 'marquee', 'admins', 'logs', 'former_leaders'
      ];

      const results: Partial<AppData> = {};
      
      const fetchTasks = [
        ...collections.map(async (colName) => {
          try {
            const { data, error } = await supabase.from(colName).select('*');
            if (error) {
              console.warn(`[Supabase] Table ${colName} missing or inaccessible:`, error.message);
              (results as any)[colName] = [];
            } else {
              (results as any)[colName] = data as any;
            }
          } catch (e) {
            console.error(`[Supabase] Fatal error fetching ${colName}:`, e);
            (results as any)[colName] = [];
          }
        }),
        // Settings (single row)
        (async () => {
           try {
             const { data, error } = await supabase.from('settings').select('*').limit(1).maybeSingle();
             if (error) console.warn('[Supabase] Settings table issue:', error.message);
             if (data) results.settings = data as any;
           } catch (e) { console.error('[Supabase] Settings fetch error:', e); }
        })(),
        // Content (key-value)
        (async () => {
           try {
             const { data, error } = await supabase.from('content').select('*');
             if (error) console.warn('[Supabase] Content table issue:', error.message);
             if (data) {
               const contentObj: Record<string, string> = {};
               data.forEach(row => contentObj[row.key] = row.value);
               results.content = contentObj as any;
             }
           } catch (e) { console.error('[Supabase] Content fetch error:', e); }
        })()
      ];

      // Concurrent fetch for all tasks
      try {
        await Promise.all(fetchTasks);
      } catch (err) {
        console.warn('[Supabase] Individual task error, continuing with partial results:', err);
      }

      // If we got some results, merge them. If it's completely empty, triggered catch fallback.
      if (Object.keys(results).length > 0) {
        console.log(`[Supabase] Successfully fetched ${Object.keys(results).length} tables`);
        return results;
      }
      
      throw new Error('No data received from Supabase');
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
    console.log(`[Sync] Saving item to ${section}:`, item.id || 'new');
    try {
      // Primary: Save to Supabase
      try {
        if (!supabase) throw new Error('Supabase client not initialized');
        
        if (section === 'content') {
          const contentUpserts = Object.entries(item)
            .filter(([k]) => k !== 'id')
            .map(([key, value]) => ({ id: 'global', key, value: String(value) }));
          if (contentUpserts.length > 0) {
            const { error } = await supabase.from('content').upsert(contentUpserts);
            if (error) throw error;
          }
        } else {
          // Convert types for Supabase
          const sanitized = { ...item };
          // Ensure booleans are correct for Postgres
          if (section === 'popups' && 'isActive' in sanitized) sanitized.isActive = !!sanitized.isActive;
          if (section === 'settings' && 'applyNowEnabled' in sanitized) sanitized.applyNowEnabled = !!sanitized.applyNowEnabled;
          if (section === 'settings' && 'popupEnabled' in sanitized) sanitized.popupEnabled = !!sanitized.popupEnabled;
          
          console.log(`[Supabase Upsert] Table: ${section}, ID: ${item.id}`);
          const { error } = await supabase.from(section).upsert(sanitized);
          if (error) {
            console.error(`[Supabase Sync Failure] Table: ${section}, Error: ${error.message}, Code: ${error.code}`);
            let userMessage = `Supabase Table '${section}' error: ${error.message}`;
            if (error.message.toLowerCase().includes('column') || error.message.toLowerCase().includes('schema cache') || error.message.toLowerCase().includes('relation')) {
              userMessage += ". Your Supabase schema is missing tables or columns. Please run 'supabase_setup.sql' in your Supabase SQL Editor to fix your database schema.";
            } else if (error.message.toLowerCase().includes('uuid')) {
              userMessage += ". Your IDs are incompatible with the database (UUID vs TEXT). Please run Section 3 of 'supabase_setup.sql' in your Supabase SQL Editor.";
            }
            throw new Error(userMessage);
          }
          console.log(`[Supabase Sync Success] ${section}/${item.id || 'new'}`);
        }
      } catch (err: any) {
        console.warn(`[Supabase Service Error] ${section}:`, err.message || err);
        throw err; // Re-throw to inform UI
      }

      // Secondary: Save to local server (fallback/legacy)
      try {
        const res = await fetch('/api/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ table: section, item })
        });
        if (res.ok) console.log(`[Local Sync Success] ${section}`);
      } catch (e) {
        // Only log if specifically needed
      }

    } catch (error) {
      console.error('Final Save Exception:', error);
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
