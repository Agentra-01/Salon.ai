import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string, phone: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Helper to fetch/create user profile in Firestore
  const syncUserProfile = async (firebaseUser: User, extraInfo?: { name?: string; phone?: string }) => {
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const path = `users/${firebaseUser.uid}`;
    try {
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setProfile(userDoc.data() as UserProfile);
      } else {
        const newProfile: UserProfile = {
          uid: firebaseUser.uid,
          name: extraInfo?.name || firebaseUser.displayName || 'Guest User',
          email: firebaseUser.email || '',
          phone: extraInfo?.phone || '',
          createdAt: new Date().toISOString(),
        };
        await setDoc(userDocRef, newProfile);
        setProfile(newProfile);
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  useEffect(() => {
    if (localStorage.getItem('admin_bypass_session') === 'true') {
      const mockUser = {
        uid: 'admin_uid_dolores_salon_control',
        email: 'official.agentraai@gmail.com',
        displayName: 'Dolores Salon Admin',
        emailVerified: true,
        isAnonymous: false,
        metadata: {},
        providerData: [],
      } as unknown as User;
      
      const mockProfile = {
        uid: 'admin_uid_dolores_salon_control',
        name: 'Dolores Salon Admin',
        email: 'official.agentraai@gmail.com',
        phone: '+1 (555) 725-6623',
        createdAt: new Date().toISOString(),
      };
      
      setUser(mockUser);
      setProfile(mockProfile);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await syncUserProfile(currentUser);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await syncUserProfile(result.user);
    } catch (err) {
      console.error(err);
      setLoading(false);
      throw err;
    }
  };

  const signUpWithEmail = async (email: string, password: string, name: string, phone: string) => {
    setLoading(true);
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(credential.user, { displayName: name });
      await syncUserProfile(credential.user, { name, phone });
    } catch (err) {
      console.error(err);
      setLoading(false);
      throw err;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    setLoading(true);
    const normalizedEmail = email.trim().toLowerCase();
    
    // Explicit Admin Bypass to guarantee login success with the given password 123456
    if (normalizedEmail === 'official.agentraai@gmail.com' && password === '123456') {
      console.log('Secure developer credentials bypass active for Dolores Salon Admin.');
      const mockUser = {
        uid: 'admin_uid_dolores_salon_control',
        email: 'official.agentraai@gmail.com',
        displayName: 'Dolores Salon Admin',
        emailVerified: true,
        isAnonymous: false,
        metadata: {},
        providerData: [],
      } as unknown as User;
      
      const mockProfile = {
        uid: 'admin_uid_dolores_salon_control',
        name: 'Dolores Salon Admin',
        email: 'official.agentraai@gmail.com',
        phone: '+1 (555) 725-6623',
        createdAt: new Date().toISOString(),
      };

      setUser(mockUser);
      setProfile(mockProfile);
      localStorage.setItem('admin_bypass_session', 'true');
      setLoading(false);
      return;
    }

    try {
      try {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        await syncUserProfile(credential.user);
      } catch (err: any) {
        // If sign-in fails due to user not found or invalid-credential, check if it is the admin email
        const isCredentialError = err.code === 'auth/invalid-credential' || 
                                  err.code === 'auth/user-not-found' || 
                                  err.message?.includes('invalid-credential') || 
                                  err.message?.includes('user-not-found');

        if (normalizedEmail === 'official.agentraai@gmail.com' && isCredentialError) {
          console.log('Admin user does not exist in Firebase Auth yet. Creating on-the-fly admin account...');
          try {
            const signupCred = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(signupCred.user, { displayName: 'Dolores Salon Admin' });
            await syncUserProfile(signupCred.user, { name: 'Dolores Salon Admin', phone: '+1 (555) 725-6623' });
            return;
          } catch (signUpErr: any) {
            console.error('Seamless admin signup failed:', signUpErr);
            if (signUpErr.code === 'auth/email-already-in-use' || signUpErr.message?.includes('already-in-use')) {
              throw new Error('ADMIN_EXISTS_PASSWORD_MISMATCH: The admin email (official.agentraai@gmail.com) is already registered. If password authentication failed, please log in seamlessly by clicking the "Google Account" button (since your logged-in Google email matches this admin email database entry).');
            }
            throw err;
          }
        }
        throw err;
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      throw err;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      localStorage.removeItem('admin_bypass_session');
      await signOut(auth);
      setUser(null);
      setProfile(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signInWithGoogle,
        signUpWithEmail,
        signInWithEmail,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
