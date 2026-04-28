import { 
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  deleteDoc, 
  writeBatch,
  query,
  orderBy
} from 'firebase/firestore';
import { db, handleFirestoreError } from './firebase';
import { AppData, Notice, StaffMember, GalleryItem, FeeStructure, QuickLink, Event, Achievement, StudentHonor, MenuItem } from '../types';

export const firebaseService = {
  async fetchAllData(): Promise<Partial<AppData>> {
    const collections: (keyof AppData)[] = [
      'notices', 'staff', 'gallery', 'fees', 'links', 
      'events', 'achievements', 'studentHonors', 'menu', 'carousel', 'settings', 'content', 'popups', 'transfer_certificates', 'messages'
    ];

    try {
      // 1. Try Firebase first
      const results: Partial<AppData> = {};
      
      await Promise.all(collections.map(async (colName) => {
        const q = query(collection(db, colName));
        const snapshot = await getDocs(q);
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        if (colName === 'settings' || colName === 'content') {
          if (docs.length > 0) {
            results[colName] = docs[0] as any;
          }
        } else {
          results[colName] = docs as any;
        }
      }));
      
      // If we got NO data from Firebase (completely empty), we might want to check local
      const hasAnyData = Object.values(results).some(val => 
        (Array.isArray(val) && val.length > 0) || (val && typeof val === 'object' && Object.keys(val).length > 0)
      );

      if (!hasAnyData) {
        throw new Error('Firebase returned no data, falling back to local');
      }

      return results;
    } catch (fbError) {
      console.warn('Firebase fetch failed or empty, trying local server:', fbError);
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
      // 1. Save to local server
      const res = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table: section, item })
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Local server save failed with status ${res.status}`);
      }

      // 2. Try to sync to Firebase
      const { id, ...data } = item;
      try {
        await setDoc(doc(db, section, id), data);
        console.log(`[Cloud Sync] Item ${id} synced to ${section}`);
      } catch (fbErr: any) {
        console.warn('[Cloud Sync Warning] Failed to update Firebase. Changes are local only.', fbErr.message);
        // We don't throw here to allow local operation, but we could notify the user
      }
    } catch (error) {
      console.error('Save failed:', error);
      throw error;
    }
  },

  async deleteItem(section: keyof AppData, id: string): Promise<void> {
    try {
      // 1. Delete from local server
      const res = await fetch('/api/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table: section, id })
      });
      if (!res.ok) throw new Error('Local server delete failed');

      // 2. Try to delete from Firebase in background
      deleteDoc(doc(db, section, id)).catch(err => {
        console.warn('Cloud delete (Firebase) failed in background:', err.message);
      });
    } catch (error) {
       console.error('Delete failed:', error);
       throw error;
    }
  },

  async syncAll(data: AppData): Promise<void> {
    try {
      const collections = Object.keys(data) as (keyof AppData)[];
      for (const section of collections) {
        const value = data[section];
        if (Array.isArray(value)) {
          for (const item of value) {
            await this.saveItem(section, item);
          }
        } else if (value && typeof value === 'object') {
          // Handle single objects like 'settings'
          await this.saveItem(section, value);
        }
      }
    } catch (error) {
      console.error('Sync all failed:', error);
      throw error;
    }
  },

  async checkAdmin(uid: string): Promise<boolean> {
    try {
      const adminDoc = await getDocs(query(collection(db, 'admins')));
      return adminDoc.docs.some(doc => doc.id === uid);
    } catch (error) {
      return false;
    }
  }
};
