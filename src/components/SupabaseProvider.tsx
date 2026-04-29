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
    if (customAdmin) {
      setIsAdmin(true);
      setUser({ email: customAdmin, id: 'custom-admin' } as any);
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
    console.log(`[Auth] Attempting custom username login for: ${username}`);
    try {
      // MASTER CREDENTIALS CHECK (Priority/Bypass)
      // The user requested these specific credentials to be the primary admin login.
      if (username === 'ankur15121985' && pass === '24121985') {
        console.log('[Auth] Master credentials detected. Granting access.');
        setIsAdmin(true);
        setUser({ 
          email: 'admin@stxaviers.edu', 
          id: 'custom-admin',
          user_metadata: { full_name: 'Super Admin' }
        } as any);
        localStorage.setItem('school_admin_session', username);
        return;
      }

      // Query the custom credentials table (Fallback for extra staff accounts if any)
      const { data, error } = await supabase
        .from('admin_credentials')
        .select('*')
        .eq('username', username)
        .eq('password', pass)
        .single();

      if (error || !data) {
        throw new Error('Invalid username or password.');
      }

      // Success! Set admin state manually
      setIsAdmin(true);
      setUser({ email: username, id: 'custom-admin' } as any);
      localStorage.setItem('school_admin_session', username);
      console.log('[Auth] Custom admin session established.');
      
    } catch (error: any) {
      console.error('[Auth] Username Login failed:', error);
      alert(`Login Error: ${error.message}`);
      throw error;
    }
  };

  const logout = async () => {
    localStorage.removeItem('school_admin_session');
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
