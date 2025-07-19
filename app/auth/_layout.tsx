// auth/_layout.tsx

import { AuthContext } from '@/components/auth/AuthContext';
import { Redirect, Slot } from 'expo-router';
import React, { useContext } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function AuthLayout() {
  const { isLoggedIn, loading } = useContext(AuthContext);

  // If auth state is still loading (checking AsyncStorage), show a spinner
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // If user is already logged in, redirect to main app
  if (isLoggedIn) {
    return <Redirect href="/" />;
  }

  // Otherwise, allow access to auth stack (sign in / sign up)
  return <Slot />;
}
