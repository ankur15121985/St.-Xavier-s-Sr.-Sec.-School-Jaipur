import { AppData } from '../types';
import { supabase, getIsSupabasePlaceholder } from '../supabaseClient';

export const supabaseService = {
  async fetchAllData(forceFresh: boolean = false): Promise<Partial<AppData>> {
    // Clear fallback/state cache values from localStorage to guarantee fresh database loads
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        Object.keys(window.localStorage).forEach(key => {
          if (key.startsWith('fallback_school_')) {
            window.localStorage.removeItem(key);
          }
        });
      } catch (cacheErr) {
        console.warn('[Cache Clear] Failed to clear key caches:', cacheErr);
      }
    }

    // --- HIGH-PERFORMANCE STATIC-AND-DYNAMIC OPTIMIZATION ---
    // Fetch consolidated data from Server API FIRST. Since Server API has cache TTL of 30 minutes, 
    // this avoids doing 43 database queries over and over for every student/visitor on page load.
    try {
      const url = forceFresh ? `/api/data?t=${Date.now()}` : '/api/data';
      const res = await fetch(url);
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const resJson = await res.json();

        // Harmonize SQLite tables with client naming conventions
        if (resJson.menu && !resJson.navigation_menu) {
          resJson.navigation_menu = resJson.menu;
        }

        // Harmonize content structured schema (column-row to key-value record object)
        if (Array.isArray(resJson.content)) {
          const contentObj: Record<string, string> = {};
          if (resJson.content.length > 0) {
            const firstRow = resJson.content[0];
            Object.keys(firstRow).forEach(key => {
              if (key !== 'id') {
                contentObj[key] = String(firstRow[key] ?? '');
              }
            });
          }
          resJson.content = contentObj;
        } else if (resJson.content && typeof resJson.content === 'object') {
          const contentObj: Record<string, string> = {};
          Object.keys(resJson.content).forEach(key => {
            if (key !== 'id') {
              contentObj[key] = String(resJson.content[key] ?? '');
            }
          });
          resJson.content = contentObj;
        }

        // Harmonize settings booleans
        if (resJson.settings && typeof resJson.settings === 'object' && !Array.isArray(resJson.settings)) {
          const mappedSettings = { ...resJson.settings };
          Object.keys(mappedSettings).forEach(key => {
            if (key.startsWith('show') || key.endsWith('Enabled')) {
              mappedSettings[key] = Boolean(mappedSettings[key]);
            }
          });
          resJson.settings = mappedSettings;
        }

        return resJson;
      }
    } catch (e) {
      console.warn('[Supabase Service] Server API dynamic API fetch failed, trying direct browser query fallback...', e);
    }

    // --- CONCURRENT FALLBACK DIRECT FETCH (ONLY IF WEB SERVER API FAILS) ---
    try {
      if (getIsSupabasePlaceholder()) {
        console.warn('[Supabase Service] Placeholder client detected. Bypassing client-side fetch and utilizing local SQLite database server directly.');
        throw new Error('Supabase client is unconfigured');
      }

      const collections: (keyof AppData)[] = [
        'notices', 'staff', 'gallery', 'fees', 'links', 
        'events', 'achievements', 'studentHonors', 'navigation_menu', 'carousel', 'popups', 'transfer_certificates', 'faqs', 'messages', 'marquee', 'admins', 'logs', 'former_leaders',
        'former_principals', 'former_rectors', 'former_managers', 'former_student_leaders', 'streamwise_toppers', 'xavierite_of_the_year', 'useful_links', 'custom_content', 'lead_grace', 'school_history',
        'activities', 'co_curricular_activities', 'alumni', 'school_info', 'parent_obligations', 'careers', 'mandatory_disclosures', 'contact_content', 'jesuit_page_content', 'scholarships', 'fire_safety', 'site_stats', 'career_applications'
      ];

      const results: Partial<AppData> = {};
      let successCount = 0;
      let networkErrorOccurred = false;

      const flagNetworkError = (msg: string) => {
        const lower = String(msg || '').toLowerCase();
        if (lower.includes('failed to fetch') || lower.includes('fetch failed')) {
          networkErrorOccurred = true;
        }
      };
      
      const fetchTasks = [
        ...collections.map(async (colName) => {
          try {
            let { data, error } = await supabase.from(colName).select('*');
            
            // Fallback for transfer_certificates if it's named 'tc' in Supabase
            if (colName === 'transfer_certificates' && (error || !data || data.length === 0)) {
              const tcFallback = await supabase.from('tc').select('*');
              if (!tcFallback.error && tcFallback.data && tcFallback.data.length > 0) {
                data = tcFallback.data;
                error = null;
                console.log('[Supabase] Found data in "tc" table, mapping to "transfer_certificates"');
              }
            }

            // Normalize transfer_certificates data to match local schema
            if (colName === 'transfer_certificates' && data && Array.isArray(data)) {
              data = data.map((item: any) => ({
                id: item.id || `tc-${Math.random().toString(36).substr(2, 9)}`,
                student_name: String(item.student_name || item.studentname || item.name || item.studentName || ''),
                admission_number: String(item.admission_number || item.admissionnumber || item.admissionno || item.admission_no || item.admno || item.adm_no || item.admissionNumber || ''),
                dob: String(item.dob || item.date_of_birth || item.birthdate || item.dateofbirth || item.dateOfBirth || '').split('T')[0],
                attachmentUrl: String(item.attachmentUrl || item.attachmenturl || item.url || item.file_url || item.attachment_url || '')
              }));
            }

            if (error) {
              console.warn(`[Supabase] Table ${colName} missing or inaccessible:`, error.message);
              flagNetworkError(error.message);
              if (!networkErrorOccurred) {
                (results as any)[colName] = [];
              }
            } else {
              (results as any)[colName] = data as any;
              successCount++;
            }
          } catch (e: any) {
            console.error(`[Supabase] Fatal error fetching ${colName}:`, e);
            flagNetworkError(e.message);
            if (!networkErrorOccurred) {
              (results as any)[colName] = [];
            }
          }
        }),
        // Settings (single row)
        (async () => {
           try {
             let { data, error } = await supabase.from('site_settings').select('*').limit(1).maybeSingle();
             const errMsg = error?.message?.toLowerCase() || '';
             const isTableMissing = error && (
               error.code === 'PGRST125' || 
               error.code === 'PGRST204' || 
               String(error.code) === '404' || 
               errMsg.includes('site_settings') || 
               errMsg.includes('invalid path') || 
               errMsg.includes('relation "public.site_settings" does not exist')
             );
             if (isTableMissing) {
                console.warn('[Supabase] site_settings table missing, trying settings table fallback...');
                const fallback = await supabase.from('settings').select('*').limit(1).maybeSingle();
                data = fallback.data;
                error = fallback.error;
             }
             if (error) {
                console.warn('[Supabase] Settings table issue:', error.message);
                flagNetworkError(error.message);
             }
             if (data) {
                results.settings = data as any;
                successCount++;
             }
           } catch (e: any) { 
             console.error('[Supabase] Settings fetch error:', e); 
             flagNetworkError(e.message);
           }
        })(),
        // Digital Campus (single row)
        (async () => {
           try {
             const { data, error } = await supabase.from('digital_campus').select('*').limit(1).maybeSingle();
             if (error) {
                console.warn('[Supabase] Digital Campus table issue:', error.message);
                flagNetworkError(error.message);
             }
             if (data) {
                results.digital_campus = data as any;
                successCount++;
             } else {
                results.digital_campus = { id: 'current', title: 'Legacy in Motion', is_enabled: true };
             }
           } catch (e: any) { 
             console.error('[Supabase] Digital Campus fetch error:', e); 
             flagNetworkError(e.message);
           }
        })(),
        // Content (key-value)
        (async () => {
           try {
             const { data, error } = await supabase.from('content').select('*');
             if (error) {
                console.warn('[Supabase] Content table issue:', error.message);
                flagNetworkError(error.message);
             }
             if (data) {
               const contentObj: Record<string, string> = {};
               data.forEach(row => contentObj[row.key] = row.value);
               results.content = contentObj as any;
               successCount++;
             }
           } catch (e: any) { 
             console.error('[Supabase] Content fetch error:', e); 
             flagNetworkError(e.message);
           }
        })()
      ];

      try {
        await Promise.all(fetchTasks);
      } catch (err: any) {
        console.warn('[Supabase] Individual task error:', err);
        flagNetworkError(err.message);
      }

      if (networkErrorOccurred || successCount === 0) {
        throw new Error('Supabase project is unreachable or offline.');
      }

      if (Object.keys(results).length > 0) {
        console.log(`[Supabase] Successfully fetched ${Object.keys(results).length} tables`);
        
        collections.forEach(colName => {
          if (colName === 'settings') {
            const cache = localStorage.getItem('fallback_school_settings');
            if (cache) {
              try { results.settings = { ...results.settings, ...JSON.parse(cache) }; } catch {}
            }
          } else if (colName === 'content') {
            const cache = localStorage.getItem('fallback_school_content');
            if (cache) {
              try { results.content = { ...results.content, ...JSON.parse(cache) }; } catch {}
            }
          } else {
            const cache = localStorage.getItem(`fallback_school_data_${colName}`);
            if (cache) {
              try {
                const list = JSON.parse(cache);
                if (Array.isArray(list)) {
                  const existingList = (results as any)[colName] || [];
                  const merged = [...existingList];
                  list.forEach(cachedItem => {
                    const idx = merged.findIndex((i: any) => i.id === cachedItem.id);
                    if (idx !== -1) {
                      merged[idx] = cachedItem;
                    } else {
                      merged.push(cachedItem);
                    }
                  });
                  (results as any)[colName] = merged;
                }
              } catch {}
            }
          }
        });

        return results;
      }
      
      throw new Error('No data received from Supabase');
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local fallback:', err);
      
      const cachedResults: Partial<AppData> = {};
      const collections: (keyof AppData)[] = [
        'notices', 'staff', 'gallery', 'fees', 'links', 
        'events', 'achievements', 'studentHonors', 'navigation_menu', 'carousel', 'popups', 'transfer_certificates', 'faqs', 'messages', 'marquee', 'admins', 'logs', 'former_leaders',
        'former_principals', 'former_rectors', 'former_managers', 'former_student_leaders', 'streamwise_toppers', 'xavierite_of_the_year', 'useful_links', 'custom_content', 'lead_grace', 'digital_campus',
        'activities', 'co_curricular_activities', 'alumni', 'school_info', 'parent_obligations', 'careers', 'mandatory_disclosures', 'contact_content', 'jesuit_page_content', 'scholarships', 'fire_safety', 'site_stats', 'career_applications'
      ];
      
      collections.forEach(colName => {
        if (colName === 'settings') {
          const cache = localStorage.getItem('fallback_school_settings');
          if (cache) {
            try { cachedResults.settings = JSON.parse(cache); } catch {}
          }
        } else if (colName === 'content') {
          const cache = localStorage.getItem('fallback_school_content');
          if (cache) {
            try { cachedResults.content = JSON.parse(cache); } catch {}
          }
        } else {
          const cache = localStorage.getItem(`fallback_school_data_${colName}`);
          if (cache) {
            try {
              const list = JSON.parse(cache);
              if (Array.isArray(list)) {
                (cachedResults as any)[colName] = list;
              }
            } catch {}
          }
        }
      });
      
      return cachedResults;
    }
  },

  /**
   * Updates the global timestamp in Supabase to signal that data has changed.
   * This ensures the server-side cache manager (db.ts) knows to invalidate its cache.
   */
  async updateRemoteTimestamp(): Promise<void> {
    try {
      const now = new Date().toISOString();
      await supabase.from('content').upsert({ key: 'content_updated_at', value: now }, { onConflict: 'key' });
      console.log(`[Supabase Sync] Remote timestamp updated to ${now}`);
    } catch (e) {
      console.warn('[Supabase Sync Warning] Failed to update remote timestamp:', e);
    }
  },

  async saveItem(section: keyof AppData, item: any): Promise<void> {
    console.log(`[Sync] Saving item to ${section}:`, item.id || 'new');
    
    // 1. Primary: Save to local server (SQLite) since it's the core local server database
    let localSaveSucceeded = false;
    let localErrorMsg = '';
    let isStaticHosting = false;
    try {
      const token = localStorage.getItem('school_admin_token');
      const res = await fetch('/api/save', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ table: section, item })
      });
      
      const contentType = res.headers.get('content-type');
      const isNonJson = !contentType || !contentType.includes('application/json');
      
      if (res.status === 404 || res.status === 405 || isNonJson) {
        console.warn(`[Sync] /api/save returned status ${res.status} (or non-JSON). Detecting static hosting (Vercel). Utilizing browser storage cache fallback.`);
        isStaticHosting = true;
      }

      if (res.ok && !isStaticHosting) {
        console.log(`[Local Sync Success] ${section}`);
        localSaveSucceeded = true;
      } else if (!isStaticHosting) {
        const errData = await res.json().catch(() => ({}));
        localErrorMsg = errData.error || `Server status code ${res.status}`;
        console.error(`[Local Sync Error] ${section}:`, localErrorMsg);
      }
    } catch (e: any) {
      localErrorMsg = e.message || String(e);
      console.error(`[Local Sync Exception] ${section}:`, localErrorMsg);
      isStaticHosting = true;
    }

    if (isStaticHosting) {
      // Offline/Static fallback: Save directly in localStorage!
      try {
        const fallbackStorageKey = `fallback_school_data_${section}`;
        if (section === 'settings') {
          localStorage.setItem('fallback_school_settings', JSON.stringify(item));
        } else if (section === 'content') {
          localStorage.setItem('fallback_school_content', JSON.stringify(item));
        } else {
          const existingRaw = localStorage.getItem(fallbackStorageKey);
          let list: any[] = [];
          if (existingRaw) {
            try { list = JSON.parse(existingRaw); } catch {}
          }
          if (!Array.isArray(list)) list = [];
          
          if (item.id) {
            const index = list.findIndex(i => i.id === item.id);
            if (index !== -1) {
              list[index] = item;
            } else {
              list.push(item);
            }
          } else {
            list.push(item);
          }
          localStorage.setItem(fallbackStorageKey, JSON.stringify(list));
        }
        console.log(`[Local Fallback Storage Success] Persisted ${section}`);
        localSaveSucceeded = true;
      } catch (storageErr) {
        console.error('[Local Fallback Storage Error] Failed to persist:', storageErr);
      }
    }

    // 2. Secondary: Sync to Supabase
    let cloudSaveSucceeded = false;
    try {
      if (!supabase) {
        console.warn('[Supabase Sync] Supabase client not initialized');
        return;
      }
      
      const targetTable = section === 'settings' ? 'site_settings' : section as string;

      if (section === 'settings') {
        item.id = 'global'; // Force singleton ID for all setting objects
        Object.keys(item).forEach(key => {
          if (key.startsWith('show') || key.endsWith('Enabled') || key === 'isActive' || key === 'is_enabled' || key === 'flagEnabled') {
            item[key] = !!item[key];
          }
        });
      }

      if (section === 'content') {
        const contentUpserts = Object.entries(item)
          .filter(([k]) => k !== 'id')
          .map(([key, value]) => ({ key, value: String(value) }));
        
        if (contentUpserts.length > 0) {
          console.log(`[Supabase Content Upsert] Keys: ${contentUpserts.map(c => c.key).join(', ')}`);
          const { error } = await supabase.from('content').upsert(contentUpserts, { onConflict: 'key' });
          if (error) {
            console.warn(`[Supabase Content Failure Warning] Code: ${error.code}, Message: ${error.message}`);
          } else {
            cloudSaveSucceeded = true;
          }
        } else {
          cloudSaveSucceeded = true;
        }
      } else {
        const sanitized = { ...item };
        delete (sanitized as any).isVital;
        delete (sanitized as any).is_vital;

        if (section === 'popups' && 'isActive' in sanitized) sanitized.isActive = !!sanitized.isActive;
        if (section === 'digital_campus' && 'is_enabled' in sanitized) sanitized.is_enabled = !!sanitized.is_enabled;
        
        if (section === 'navigation_menu' && (sanitized.parent_id === '' || sanitized.parent_id === undefined)) {
          sanitized.parent_id = null;
        }
        
        if (section === 'settings') {
          Object.keys(sanitized).forEach(key => {
            if (key.startsWith('show') || key.endsWith('Enabled')) {
              sanitized[key] = !!sanitized[key];
            }
          });
        }
        
        console.log(`[Supabase Upsert] Table: ${targetTable}, ID: ${item.id}`);
        
        try {
          JSON.stringify(sanitized);
        } catch (circError: any) {
          console.error(`[Supabase Sync Blocked] Circular dependency detected in ${targetTable}/${item.id}:`, circError);
          return;
        }

        let { error } = await supabase.from(targetTable).upsert(sanitized);
        
        if (error && section === 'transfer_certificates' && targetTable === 'transfer_certificates') {
          const errMsg = error.message?.toLowerCase() || '';
          if (error.code === 'PGRST204' || errMsg.includes('transfer_certificates') || errMsg.includes('relation "public.transfer_certificates" does not exist')) {
            console.warn(`[Supabase Sync] 'transfer_certificates' table not found on remote. Trying fallback to 'tc' table with normalized keys...`);
            const tcSanitized = {
              id: sanitized.id,
              studentname: sanitized.student_name,
              admissionno: sanitized.admission_number,
              date_of_birth: sanitized.dob,
              attachmenturl: sanitized.attachmentUrl
            };
            const fallbackResult = await supabase.from('tc').upsert(tcSanitized);
            error = fallbackResult.error;
          }
        }
        
        if (error && section === 'settings' && targetTable === 'site_settings') {
          const errMsg = error.message?.toLowerCase() || '';
          const isTableMissing = error.code === 'PGRST125' || 
                                 error.code === 'PGRST204' || 
                                 String(error.code) === '404' || 
                                 errMsg.includes('site_settings') || 
                                 errMsg.includes('invalid path') || 
                                 errMsg.includes('relation "public.site_settings" does not exist');
          if (isTableMissing) {
            console.warn(`[Supabase Sync] 'site_settings' table not found on remote. Trying fallback to 'settings' table...`);
            const fallbackResult = await supabase.from('settings').upsert(sanitized);
            error = fallbackResult.error;
          }
        }
        
        if (error && (error.code === 'PGRST204' || error.code === 'PGRST205' || error.code === '42703')) {
          console.warn(`[Supabase Sync] Schema issue in ${targetTable} (Code: ${error.code}), attempting recovery...`);
          
          if (error.code === 'PGRST204' || error.message.includes('relation "public.')) {
             const tableMatch = error.message.match(/relation "public\.(.+?)"/i);
             const tableName = tableMatch ? tableMatch[1] : targetTable;
             
             console.log(`[Supabase Sync] Probing table '${tableName}'...`);
             const { error: probeError } = await supabase.from(tableName).select('count').limit(0);
             
             if (probeError && (probeError.code === 'PGRST204' || probeError.message.includes('relation "public.'))) {
                console.warn(`[Supabase Sync Warning] Table '${tableName}' is missing. Cloud sync skipped.`);
                return;
             } else if (!probeError) {
                console.log(`[Supabase Sync] Table '${tableName}' exists in probe. Retrying original upsert...`);
                const { error: retryError } = await supabase.from(targetTable).upsert(sanitized);
                error = retryError;
             }
          }

          if (error) {
            let currentSanitized = { ...sanitized };
            let currentError = error;
            let retryCount = 0;
            const MAX_RETRIES = 5;

            if (error.code === 'PGRST205') {
              await new Promise(resolve => setTimeout(resolve, 1000));
              const { error: retryError } = await supabase.from(targetTable).upsert(sanitized);
              currentError = retryError;
            }

            while (currentError && (currentError.code === 'PGRST204' || currentError.code === '42703') && retryCount < MAX_RETRIES) {
              const match = currentError.message.match(/column ['"](.+?)['"]/i) || currentError.message.match(/find the ['"](.+?)['"] column/i);
              const missingField = match ? match[1] : null;
              
              if (missingField && currentSanitized[missingField] !== undefined) {
                console.log(`[Supabase Sync Recovery] Stripping missing field '${missingField}' and retrying...`);
                const { [missingField]: _, ...nextSanitized } = currentSanitized;
                currentSanitized = nextSanitized;
                const { error: retryError } = await supabase.from(targetTable).upsert(currentSanitized);
                currentError = retryError;
                retryCount++;
              } else {
                break;
              }
            }
            error = currentError;
          }
        }

        if (error) {
          console.warn(`[Supabase Sync Warning] Table: ${targetTable}, Error: ${error.message}, Code: ${error.code}`);
        } else {
          console.log(`[Supabase Sync Success] ${section}/${item.id || 'new'}`);
          cloudSaveSucceeded = true;
        }
      }
      
      if (cloudSaveSucceeded) {
        await this.updateRemoteTimestamp();
      }
    } catch (err: any) {
      console.warn(`[Supabase Service Soft Exception] ${section}:`, err.message || err);
    }

    if (!localSaveSucceeded && !cloudSaveSucceeded) {
      throw new Error(localErrorMsg || `Failed to save item locally or to cloud database.`);
    } else if (!localSaveSucceeded) {
      console.info(`[Save Success Status] Cloud sync saved successfully, but server fallback is inactive.`);
    }
  },

  async deleteItem(section: keyof AppData, id: string): Promise<void> {
    try {
      // 1. Delete from Supabase
      const targetTable = section === 'settings' ? 'site_settings' : section as string;
      const matchField = section === 'content' ? 'key' : 'id';
      let { error } = await supabase.from(targetTable).delete().eq(matchField, id);
      
      if (error && section === 'transfer_certificates' && targetTable === 'transfer_certificates') {
        const errMsg = error.message?.toLowerCase() || '';
        if (error.code === 'PGRST204' || errMsg.includes('transfer_certificates') || errMsg.includes('relation "public.transfer_certificates" does not exist')) {
          console.warn(`[Supabase Sync] 'transfer_certificates' table not found on delete. Trying fallback to 'tc' table...`);
          const fallbackResult = await supabase.from('tc').delete().eq(matchField, id);
          error = fallbackResult.error;
        }
      }
      
      if (error && section === 'settings' && targetTable === 'site_settings') {
        const errMsg = error.message?.toLowerCase() || '';
        const isTableMissing = error.code === 'PGRST125' || 
                               error.code === 'PGRST204' || 
                               String(error.code) === '404' || 
                               errMsg.includes('site_settings') || 
                               errMsg.includes('invalid path') || 
                               errMsg.includes('relation "public.site_settings" does not exist');
        if (isTableMissing) {
          console.warn(`[Supabase Sync] 'site_settings' table not found on delete. Trying fallback to 'settings' table...`);
          const fallbackResult = await supabase.from('settings').delete().eq(matchField, id);
          error = fallbackResult.error;
        }
      }
      
      if (error) throw error;
      console.log(`[Supabase Sync] ${targetTable} item deleted`);
      await this.updateRemoteTimestamp();

      // 2. Delete from local server or localStorage fallback
      let isStaticHosting = false;
      try {
        const token = localStorage.getItem('school_admin_token');
        const res = await fetch('/api/delete', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ table: section, id })
        });
        
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Server delete failed with status ${res.status}`);
        }
        
        const contentType = res.headers.get('content-type');
        const isNonJson = !contentType || !contentType.includes('application/json');
        
        if (res.status === 404 || res.status === 405 || isNonJson) {
          isStaticHosting = true;
        }
      } catch (e) {
        isStaticHosting = true;
      }

      if (isStaticHosting) {
        try {
          const fallbackStorageKey = `fallback_school_data_${section}`;
          if (section === 'settings') {
            localStorage.removeItem('fallback_school_settings');
          } else if (section === 'content') {
            localStorage.removeItem('fallback_school_content');
          } else {
            const existingRaw = localStorage.getItem(fallbackStorageKey);
            if (existingRaw) {
              try {
                let list = JSON.parse(existingRaw);
                if (Array.isArray(list)) {
                  list = list.filter((i: any) => i.id !== id);
                  localStorage.setItem(fallbackStorageKey, JSON.stringify(list));
                }
              } catch {}
            }
          }
          console.log(`[Local Fallback Storage Delete] Success for ${section}/${id}`);
        } catch (storageErr) {
          console.error('[Local Fallback Storage Delete Error] Failed:', storageErr);
        }
      }

    } catch (error) {
       console.error('Delete failed:', error);
       throw error;
    }
  },

  async syncAll(data: AppData): Promise<void> {
    const collections = Object.keys(data) as (keyof AppData)[];
    for (const section of collections) {
      const value = data[section];
      
      // Skip non-persistent or large system tables that shouldn't be bulk-synced
      if (['logs', 'messages', 'admins'].includes(section)) continue;

      if (Array.isArray(value)) {
        if (value.length === 0) continue;
        
        // Batch upsert for performance (limit to 50 at a time to avoid request size limits)
        const CHUNK_SIZE = 50;
        for (let i = 0; i < value.length; i += CHUNK_SIZE) {
          const chunk = value.slice(i, i + CHUNK_SIZE);
          const sanitizedChunk = chunk.map(item => {
            const { isVital, is_vital, ...rest } = item as any;
            return rest;
          });
          
          try {
            const { error } = await supabase.from(section).upsert(sanitizedChunk);
            if (error) {
              console.warn(`[SyncAll Warning] Skipping table '${section}' since it's not setup yet on Supabase:`, error.message);
            }
          } catch (e: any) {
            console.warn(`[SyncAll Exception] Error uploading chunk to '${section}':`, e.message || e);
          }
        }
      } else if (value && typeof value === 'object' && section !== 'content' && section !== 'digital_campus') {
        // Handle single object tables (settings, etc) - safe and silent on failure
        try {
          if (section === 'settings') (value as any).id = 'global';
          await this.saveItem(section, value);
        } catch (e: any) {
          console.warn(`[SyncAll settings warning] Could not save item: ${e.message}`);
        }
      } else if (section === 'digital_campus' && value && typeof value === 'object') {
        try {
          await supabase.from('digital_campus').upsert(value);
        } catch (e: any) {
          console.warn('[SyncAll digital_campus warning] Could not sync digital_campus:', e.message || e);
        }
      } else if (section === 'content' && value && typeof value === 'object') {
        // Handle the Key-Value content store safely
        const contentEntries = Object.entries(value as Record<string, string>);
        for (const [key, val] of contentEntries) {
          try {
            await supabase.from('content').upsert({ key, value: val });
          } catch (e: any) {
            console.warn(`[SyncAll content warning] Could not sync content key '${key}':`, e.message || e);
            break; // Stop syncing additional keys to keep it brief if table missing
          }
        }
      }
    }

    // CRITICAL: Update the master content version timestamp in Supabase
    // This ensures the server-side cache manager (db.ts) knows to invalidate its cache
    await this.updateRemoteTimestamp();
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
