import { AuthContext } from '@/components/auth/AuthContext';
import { Redirect } from 'expo-router';
import { useContext } from 'react';

export default function Entry() {
  const { isLoggedIn, loading } = useContext(AuthContext);

  if (loading) {
    return null; // Wait till loading is complete
  }

  return <Redirect href={isLoggedIn ? '/' : '/auth/login'} />;
}
