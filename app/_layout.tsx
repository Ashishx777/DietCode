// app/_layout.tsx

import { AuthProvider } from '@/components/auth/AuthContext';
import { ProfileProvider } from '@/components/auth/ProfileContext';
import { Slot } from 'expo-router';

export default function AppLayout() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <Slot />
      </ProfileProvider>
    </AuthProvider>
  );
}
