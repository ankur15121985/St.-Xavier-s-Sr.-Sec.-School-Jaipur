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
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password: pass })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Login failed');
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
      console.error('[Auth] Login failed:', error);
      alert(`Login Error: ${error.message}`);
      throw error;
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
