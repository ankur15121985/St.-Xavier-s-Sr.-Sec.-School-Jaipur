import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

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
    console.log('[Auth] Setting up onAuthStateChanged listener...');
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('[Auth] State changed. User:', user?.email || 'Logged out');
      setUser(user);
      try {
        if (user) {
          // Check if user is admin
          const adminDoc = await getDoc(doc(db, 'admins', user.uid));
          if (adminDoc.exists()) {
            setIsAdmin(true);
          } else {
            // Check for bootstrap admin email
            const bootstrapEmail = 'ankur15121985@gmail.com';
            if (user.email === bootstrapEmail) {
              try {
                await setDoc(doc(db, 'admins', user.uid), { email: user.email });
                setIsAdmin(true);
              } catch (writeErr) {
                console.error("Bootstrap admin write failed:", writeErr);
                // Still mark as admin in state if rules permit email-based access
                setIsAdmin(true); 
              }
            } else {
              setIsAdmin(false);
            }
          }
        } else {
          setIsAdmin(false);
        }
      } catch (err) {
        console.error("Auth state check error:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    console.log('[Auth] Attempting login with Google...');
    try {
      const provider = new GoogleAuthProvider();
      // Set custom parameters if needed
      provider.setCustomParameters({ prompt: 'select_account' });
      
      const result = await signInWithPopup(auth, provider);
      console.log('[Auth] Login successful:', result.user.email);
    } catch (error: any) {
      console.error('[Auth] Login failed:', error);
      // In some iframe environments, popups can be blocked or have issues.
      if (error.code === 'auth/popup-blocked') {
        console.warn('[Auth] Popup was blocked by the browser.');
        alert('Please allow popups for this site to sign in with Google.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        console.warn('[Auth] Multiple popup requests or cancelled.');
      } else {
        alert(`Login Error: ${error.message}`);
      }
    }
  };

  const logout = async () => {
    await signOut(auth);
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
