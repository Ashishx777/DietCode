import { ProfilePicKey } from '@/constants/profilePicMap';
import { STORAGE_KEYS } from '@/constants/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { AuthContext } from './AuthContext';

export type Profile = {
  name: string;
  username: string;
  email: string;
  country: string;
  countryCode?: string;
  dob: {
    month: string;
    day: number;
    year: number;
  };
  gender: 'male' | 'female' | '';
  profilePic: ProfilePicKey;
};

type ProfileContextType = {
  profile: Profile | null;
  updateProfile: (data: Profile) => Promise<void>;
  updateProfileField: <K extends keyof Profile>(
    field: K,
    value: Profile[K]
  ) => Promise<void>;
  clearProfile: () => Promise<void>;
};

export const ProfileContext = createContext<ProfileContextType>({
  profile: null,
  updateProfile: async () => {},
  updateProfileField: async () => {},
  clearProfile: async () => {},
});

const fallbackProfile: Profile = {
  name: '',
  username: '',
  email: '',
  country: '',
  countryCode: 'IN',
  gender: '',
  dob: { month: 'Jan', day: 1, year: 2000 },
  profilePic: 'pic9',
};

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const { setUserData } = useContext(AuthContext);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
        if (stored) {
          const parsed: Profile = JSON.parse(stored);
          const fullProfile = { ...fallbackProfile, ...parsed };
          setProfile(fullProfile);
          setUserData?.(fullProfile);
        } else {
          setProfile(fallbackProfile);
        }
      } catch (error) {
        console.warn('[ProfileContext] Failed to load profile:', error);
        setProfile(fallbackProfile);
      }
    };
    loadProfile();
  }, [setUserData]);

  const updateProfile = async (data: Profile): Promise<void> => {
    setProfile(data);
    await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(data));
    setUserData?.(data);
  };

  const updateProfileField = async <K extends keyof Profile>(
    field: K,
    value: Profile[K]
  ): Promise<void> => {
    if (!profile) return;
    const updatedProfile = { ...profile, [field]: value };
    setProfile(updatedProfile);
    await AsyncStorage.setItem(
      STORAGE_KEYS.USER_PROFILE,
      JSON.stringify(updatedProfile)
    );
    setUserData?.(updatedProfile);
  };

  const clearProfile = async (): Promise<void> => {
    setProfile(null);
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
    setUserData?.({});
  };

  return (
    <ProfileContext.Provider
      value={{ profile, updateProfile, updateProfileField, clearProfile }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
