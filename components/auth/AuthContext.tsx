import { STORAGE_KEYS } from '@/constants/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useEffect, useState } from 'react';
import type { Profile } from './ProfileContext';

export type AuthContextType = {
  isLoggedIn: boolean;
  setLoggedIn: (value: boolean) => void;
  userData: Partial<Profile>;
  setUserData: React.Dispatch<React.SetStateAction<Partial<Profile>>>;
  signUp: (
    email: string,
    password: string,
    profile: Partial<Profile>
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState<Partial<Profile>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const email = await AsyncStorage.getItem(STORAGE_KEYS.LOGGED_IN_EMAIL);
        const storedData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
        if (email && storedData) {
          setUserData(JSON.parse(storedData));
          setLoggedIn(true);
        }
      } catch (e) {
        console.error('[AuthContext] Failed to load auth data', e);
      } finally {
        setLoading(false);
      }
    };

    loadStoredData();
  }, []);

  const signUp = async (
    email: string,
    password: string,
    profile: Partial<Profile>
  ) => {
    await AsyncStorage.setItem(`auth-${email}`, password);
    await AsyncStorage.setItem(`profile-${email}`, JSON.stringify(profile));
    await AsyncStorage.setItem(STORAGE_KEYS.LOGGED_IN_EMAIL, email);
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(profile));
    setUserData(profile);
    setLoggedIn(true);
  };

  const signIn = async (email: string, password: string) => {
    const savedPassword = await AsyncStorage.getItem(`auth-${email}`);
    if (savedPassword !== password) throw new Error('Invalid credentials');

    const savedProfile = await AsyncStorage.getItem(`profile-${email}`);
    if (savedProfile) {
      setUserData(JSON.parse(savedProfile));
      await AsyncStorage.setItem(STORAGE_KEYS.LOGGED_IN_EMAIL, email);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, savedProfile);
    }
    setLoggedIn(true);
  };

  const signOut = async () => {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.LOGGED_IN_EMAIL,
      STORAGE_KEYS.USER_DATA,
    ]);
    setLoggedIn(false);
    setUserData({});
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setLoggedIn,
        userData,
        setUserData,
        signUp,
        signIn,
        signOut,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
