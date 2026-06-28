import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, getIsSupabasePlaceholder, initializeSupabase } from '../supabaseClient';
import { User } from '@supabase/supabase-js';

interface SupabaseContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  login: () => Promise<void>;
  usernameLogin: (username: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export const SupabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [configLoaded, setConfigLoaded] = useState(false);

  // Fetch dynamic Supabase configuration from server on mount
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const res = await fetch('/api/supabase-config');
        if (res.ok) {
          const { url, key } = await res.json();
          if (url && key) {
            initializeSupabase(url, key);
          }
        }
      } catch (e) {
        console.warn('[Auth] Error fetching dynamic Supabase config:', e);
      } finally {
        setConfigLoaded(true);
      }
    };
    loadConfig();
  }, []);

  // Persistence for custom admin session
  useEffect(() => {
    const customAdmin = localStorage.getItem('school_admin_session');
    const token = localStorage.getItem('school_admin_token');
    
    if (customAdmin && token) {
      setIsAdmin(true);
      setUser({ 
        email: customAdmin, 
        id: 'custom-admin',
        user_metadata: { full_name: customAdmin }
      } as any);
    }
  }, []);

  const checkAdminStatus = (u: User | null) => {
    if (localStorage.getItem('school_admin_session')) {
      setIsAdmin(true);
      return;
    }

    if (!u) {
      setIsAdmin(false);
      return;
    }
    const bootstrapEmail = 'ankur15121985@gmail.com';
    const isSpecialAdmin = u.email === bootstrapEmail || u.app_metadata?.role === 'admin';
    setIsAdmin(isSpecialAdmin);
  };

  useEffect(() => {
    if (!configLoaded) return;

    console.log('[Auth] Setting up Supabase Auth listener...');
    
    const checkUser = async () => {
      try {
        const customAdmin = localStorage.getItem('school_admin_session');
        if (customAdmin) {
          setIsAdmin(true);
          setUser({ 
            email: customAdmin, 
            id: 'custom-admin',
            user_metadata: { full_name: customAdmin }
          } as any);
          setLoading(false);
          return;
        }

        const { data: { session } } = await supabase.auth.getSession();
        const u = session?.user ?? null;
        if (u) {
          setUser(u);
          checkAdminStatus(u);
        }
      } catch (err) {
        console.error('Supabase getSession error:', err);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const customAdmin = localStorage.getItem('school_admin_session');
      if (customAdmin) {
        setIsAdmin(true);
        setUser({ 
          email: customAdmin, 
          id: 'custom-admin',
          user_metadata: { full_name: customAdmin }
        } as any);
        setLoading(false);
        return;
      }

      const u = session?.user ?? null;
      if (u) {
        setUser(u);
        checkAdminStatus(u);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [configLoaded]);

  // Synchronize admin status with Supabase Postgres session for RLS
  useEffect(() => {
    if (isAdmin && configLoaded) {
      console.log('[Auth] Synchronizing admin status with Supabase RLS...');
      // Use the helper function to set the admin secret in the Postgres session
      supabase.rpc('set_config_admin', { 
        val: 'st-xaviers-admin-authenticated' 
      }).then(({ error }) => {
        if (error) {
          console.warn('[Auth] Failed to set RLS admin marker. Data visibility might be limited.', error);
        } else {
          console.log('[Auth] RLS admin marker active.');
        }
      });
    }
  }, [isAdmin, configLoaded]);

  const login = async () => {
    // Legacy OAuth support
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin }
      });
      if (error) throw error;
    } catch (error: any) {
      console.error('[Auth] Login failed:', error);
      alert(`Login Error: ${error.message}`);
    }
  };

  const usernameLogin = async (username: string, pass: string) => {
    console.log(`[Auth] Attempting login for: ${username}`);
    
    // Check if it looks like an email - if so, try proper Supabase Auth first
    if (username.includes('@')) {
      try {
        console.log('[Auth] Detected email, attempting Supabase Auth sign-in...');
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: username,
          password: pass
        });
        
        if (!authError && authData.user) {
          console.log('[Auth] Supabase Auth successful.');
          setUser(authData.user);
          setIsAdmin(true);
          return;
        }
        console.warn('[Auth] Supabase Auth failed, trying legacy methods:', authError?.message);
      } catch (err) {
        console.warn('[Auth] Supabase Auth exception:', err);
      }
    }

    try {
      let res;
      try {
        res = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password: pass })
        });
      } catch (fetchError) {
        // If fetch fails (e.g. network error, server down), trigger fallback
        console.warn('[Auth] Local API fetch failed, falling back to Supabase direct query:', fetchError);
        return await supabaseFallbackLogin(username, pass);
      }

      if (!res.ok) {
        const contentType = res.headers.get('content-type');
        const isNonJson = !contentType || !contentType.includes('application/json');

        // If it is a 404, 405, server 5xx or any non-JSON/corrupted page, 
        // fallback directly to client-side Supabase validation.
        if (res.status >= 500 || res.status === 404 || res.status === 405 || isNonJson) {
          console.warn(`[Auth] /api/login returned status ${res.status}. Falling back to Supabase.`);
          return await supabaseFallbackLogin(username, pass);
        }

        let errorMessage = 'Login failed';
        try {
          const errorData = await res.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          errorMessage = `Server Error (${res.status})`;
        }
        throw new Error(errorMessage);
      }

      // Check if response is JSON (Vercel will return HTML index.html on static rewrite routes)
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.warn('[Auth] Response is not JSON (static html). Assuming static hosting like Vercel. Falling back to Supabase.');
        return await supabaseFallbackLogin(username, pass);
      }

      const { token, user: userData } = await res.json();

      // Success! Set admin state manually
      setIsAdmin(true);
      setUser({ 
        email: userData.username, 
        id: userData.id,
        user_metadata: { full_name: userData.username }
      } as any);
      
      localStorage.setItem('school_admin_session', username);
      localStorage.setItem('school_admin_token', token);
      console.log('[Auth] Admin session and token established.');
      
    } catch (error: any) {
      console.error('[Auth] Login process error:', error);
      // Attempt immediate recovery via fallback login before giving up
      try {
        console.warn('[Auth] Catch block triggered during login, trying fallback recovery...');
        return await supabaseFallbackLogin(username, pass);
      } catch (fallbackErr: any) {
        alert(`Login Error: ${fallbackErr.message || error.message}`);
        throw fallbackErr;
      }
    }
  };

  /**
   * Fallback login method that queries Supabase directly.
   * Useful for deployments on Vercel where the Express/local database server might not be running or is read-only.
   */
  const supabaseFallbackLogin = async (username: string, pass: string) => {
    console.log(`[Auth] Executing Supabase fallback login for: ${username}`);
    try {
      // With hardened RLS, the anon browser client CANNOT query the admins table.
      // We now rely on the /api/login route which uses the Service Role Key.
      // If we are here, it means /api/login failed. 
      console.warn('[Auth] Browser-side admin query is restricted by RLS. Please ensure SUPABASE_SERVICE_ROLE_KEY is set in your environment secrets for server-side validation.');
      
      throw new Error('Username or password wrong');
      
    } catch (err: any) {
      console.error('[Auth] Supabase Fallback Login failed:', err);
      throw err;
    }
  };

  const logout = async () => {
    localStorage.removeItem('school_admin_session');
    localStorage.removeItem('school_admin_token');
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <SupabaseContext.Provider value={{ user, isAdmin, loading, login, usernameLogin, logout }}>
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};
