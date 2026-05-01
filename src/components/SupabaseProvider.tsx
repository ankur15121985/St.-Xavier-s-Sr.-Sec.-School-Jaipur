import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
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
    if (!u) {
      // Don't reset if we have a custom session
      if (!localStorage.getItem('school_admin_session')) {
        setIsAdmin(false);
      }
      return;
    }
    const bootstrapEmail = 'ankur15121985@gmail.com';
    const isSpecialAdmin = u.email === bootstrapEmail || u.app_metadata?.role === 'admin';
    setIsAdmin(isSpecialAdmin);
  };

  useEffect(() => {
    console.log('[Auth] Setting up Supabase Auth listener...');
    
    const checkUser = async () => {
      try {
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
      const u = session?.user ?? null;
      if (u) {
        setUser(u);
        checkAdminStatus(u);
      } else if (!localStorage.getItem('school_admin_session')) {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

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
        // If it's a 404, it's likely that the API server is not running (e.g. Vercel)
        if (res.status === 404) {
          console.warn('[Auth] /api/login returned 404. Falling back to Supabase.');
          return await supabaseFallbackLogin(username, pass);
        }

        let errorMessage = 'Login failed';
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await res.json();
          errorMessage = errorData.error || errorMessage;
        } else {
          const text = await res.text();
          console.error('[Auth] Non-JSON error response:', text);
          errorMessage = `Server Error (${res.status})`;
        }
        throw new Error(errorMessage);
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
      alert(`Login Error: ${error.message}`);
      throw error;
    }
  };

  /**
   * Fallback login method that queries Supabase directly.
   * Useful for deployments on Vercel where the Express server might not be running.
   */
  const supabaseFallbackLogin = async (username: string, pass: string) => {
    console.log(`[Auth] Executing Supabase fallback login for: ${username}`);
    try {
      // Query the custom credentials table (admins)
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('username', username)
        .maybeSingle();

      if (error) {
        console.error('[Auth] Supabase fallback database error:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      if (!data) {
        throw new Error('Invalid username or password.');
      }

      // Check password (Note: Fallback mode expects plain text or matches direct string)
      // If it's hashed in Supabase but we are on client, we can't easily verify bcrypt here without extra libs.
      // But we'll try a simple match first.
      const isValid = data.password === pass;

      if (!isValid) {
        throw new Error('Invalid username or password.');
      }

      // Record success log
      try {
        await supabase.from('logs').insert({
          id: crypto.randomUUID(),
          user: username,
          action: 'LOGIN_SUCCESS_FALLBACK',
          details: `Session started via Supabase fallback for ${username}`,
          timestamp: new Date().toISOString()
        });
      } catch (e) {
        console.warn('Logging failed:', e);
      }

      // Success! Set admin state
      setIsAdmin(true);
      setUser({ 
        email: data.username, 
        id: data.id,
        user_metadata: { full_name: data.username }
      } as any);
      
      localStorage.setItem('school_admin_session', username);
      // We don't have a JWT token in fallback mode, we just use session
      console.log('[Auth] Supabase fallback login successful.');
      
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
