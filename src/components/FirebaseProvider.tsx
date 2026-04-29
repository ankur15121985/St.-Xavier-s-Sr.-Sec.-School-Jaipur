import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { User } from '@supabase/supabase-js';

interface FirebaseContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('[Auth] Setting up Supabase Auth listener...');
    
    // Get initial session
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user ?? null;
        setUser(user);
        
        if (user) {
          // Hardcoded bootstrap admin for now or check a table in Supabase
          const bootstrapEmail = 'ankur15121985@gmail.com';
          if (user.email === bootstrapEmail) {
            setIsAdmin(true);
          } else {
            // Optional: check a 'profiles' or 'admins' table in Supabase
            setIsAdmin(false);
          }
        }
      } catch (err) {
        console.error('Supabase getSession error:', err);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const user = session?.user ?? null;
      setUser(user);
      if (user) {
        const bootstrapEmail = 'ankur15121985@gmail.com';
        setIsAdmin(user.email === bootstrapEmail);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async () => {
    console.log('[Auth] Attempting login with Supabase Google OAuth...');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (error: any) {
      console.error('[Auth] Login failed:', error);
      alert(`Login Error: ${error.message}`);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <FirebaseContext.Provider value={{ user, isAdmin, loading, login, logout }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};
