import BottomNav from '@/app/(Tabs)/BottomNav';
import ActionGrid from '@/components/ActionGrid';
import { AuthContext } from '@/components/auth/AuthContext';
import { ProfileContext } from '@/components/auth/ProfileContext';
import Floatingmenu from '@/components/Floatingmenu';
import Greetings from '@/components/Greetings';
import SearchBar from '@/components/SearchBar';
import TopIcons from '@/components/TopIcons';
import { Redirect } from 'expo-router';
import React, { useContext } from 'react';
import { SafeAreaView, StatusBar, View } from 'react-native';
import './globals.css';

export default function Index() {
  const { isLoggedIn, loading } = useContext(AuthContext);
  const { profile } = useContext(ProfileContext);

  if (loading) {
    return null;
  }

  if (!isLoggedIn) {
    return <Redirect href="/auth/login" />;
  }

  return (
    <SafeAreaView className="relative flex-1 bg-white px-2 pt-12 ">
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      {/* Top Icons */}
      <View className="mb-4 h-28 pt-1 ">
        <TopIcons />
      </View>

      {/* Greeting */}
      <View className="mb-2 ">
        <Greetings username={profile?.name || 'Friend'} />
      </View>

      {/* Action Grid */}
      <View className="mb-4">
        <ActionGrid />
      </View>

      {/* Search Bar */}
      <View className="mb-4 px-2">
        <SearchBar />
      </View>

      {/* Bottom Navigation */}
      <View className="absolute bottom-6 pl-4 pb-5 flex-row">
        <BottomNav />
      </View>

      {/* Floating Menu */}
      <View className="absolute bottom-6 flex-row">
        <Floatingmenu />
      </View>
    </SafeAreaView>
  );
}
