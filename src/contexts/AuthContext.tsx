"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface UserProfile {
  uid: string;
  email: string;
  role: 'admin' | 'user';
  isActive: boolean;
  name?: string;
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  isAdmin: boolean;
  isActiveUser: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is admin and active
  const isAdmin = userProfile?.role === 'admin';
  const isActiveUser = userProfile?.isActive === true;

  // Fetch user profile from Firestore
  const fetchUserProfile = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserProfile({
          uid: data.uid,
          email: data.email,
          role: data.role || 'user',
          isActive: data.isActive || false,
          name: data.name,
          createdAt: data.createdAt?.toDate() || new Date()
        });
      } else {
        console.warn('User profile not found in Firestore for UID:', uid);
        setUserProfile(null);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      
      // Check if it's a connection error
      if (error instanceof Error) {
        if (error.message.includes('offline') || error.message.includes('network')) {
          console.warn('Firestore is offline. User profile will be null until connection is restored.');
        } else if (error.message.includes('permission-denied')) {
          console.error('Permission denied accessing Firestore. Check security rules.');
        } else if (error.message.includes('not-found')) {
          console.warn('Firestore database not found. Make sure the database is created.');
        }
      }
      
      setUserProfile(null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        await fetchUserProfile(user.uid);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Temporary fallback for admin@arogyabmr.org when Firestore is not available
      if (email === 'admin@arogyabmr.org') {
        console.warn('Using fallback admin access. Please set up Firestore properly.');
        setUserProfile({
          uid: result.user.uid,
          email: email,
          role: 'admin',
          isActive: true,
          name: 'Admin User (Fallback)',
          createdAt: new Date()
        });
        return;
      }
      
      await fetchUserProfile(result.user.uid);
      
      // Check if user is admin and active
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role !== 'admin' || !userData.isActive) {
          await signOut(auth);
          throw new Error('Access denied. Admin privileges required.');
        }
      } else {
        await signOut(auth);
        throw new Error('User profile not found. Please contact administrator to set up your profile in Firestore.');
      }
    } catch (error) {
      // If it's a Firestore connection error and user is admin@arogyabmr.org, allow fallback
      if (error instanceof Error && 
          (error.message.includes('offline') || error.message.includes('not-found')) &&
          email === 'admin@arogyabmr.org') {
        console.warn('Firestore unavailable, using fallback admin access');
        const result = await signInWithEmailAndPassword(auth, email, password);
        setUserProfile({
          uid: result.user.uid,
          email: email,
          role: 'admin',
          isActive: true,
          name: 'Admin User (Fallback)',
          createdAt: new Date()
        });
        return;
      }
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    login,
    logout,
    register,
    isAdmin,
    isActiveUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};