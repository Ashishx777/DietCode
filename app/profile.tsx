import BottomNav from '@/app/(Tabs)/BottomNav';
import { AuthContext } from '@/components/auth/AuthContext';
import { ProfileContext } from '@/components/auth/ProfileContext';
import { PROFILE_PIC_MAP } from '@/constants/profilePicMap';
import { useRouter } from 'expo-router';
import { ArrowLeft, LogOut, Pencil } from 'lucide-react-native';
import React, { useContext } from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function Profile() {
  const { profile } = useContext(ProfileContext);
  const router = useRouter();

  const profileImage = profile?.profilePic
    ? PROFILE_PIC_MAP[profile.profilePic] ??
      require('@/assets/icons/profile 9-bw.png')
    : require('@/assets/icons/profile 9-bw.png');

  const { signOut } = useContext(AuthContext);

  const handleLogout = async () => {
    await signOut();
    router.replace('/auth/login');
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={26} color="#333" />
        </Pressable>
        <Text style={styles.pageTitle}>My Profile</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Profile Picture and Greeting */}
        <View style={styles.profileSection}>
          <Image source={profileImage} style={styles.avatar} />
          <Text style={styles.greeting}>Hey, {profile?.name || 'User'}</Text>
          <Pressable
            style={styles.editButton}
            onPress={() => router.push('/ProfileEdit')}
          >
            <Pencil size={16} color="#fff" />
            <Text style={styles.editText}>Edit Profile</Text>
          </Pressable>
        </View>

        {/* Personal Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Info</Text>
          <InfoRow label="Username" value={profile?.username || '—'} />
          <InfoRow label="Gender" value={profile?.gender || '—'} />
          <InfoRow
            label="Date of Birth"
            value={
              typeof profile?.dob === 'object' && profile.dob
                ? `${profile.dob.month} ${profile.dob.day}, ${profile.dob.year}`
                : '—'
            }
          />
          <InfoRow label="Country" value={profile?.country || '—'} />
        </View>

        {/* Nutrition Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nutrition Preferences</Text>
          <View style={styles.badges}>
            {['Vegan', 'Vegetarian', 'Lactose-Free', 'Gluten-Free'].map(
              (tag) => (
                <Text key={tag} style={styles.badge}>
                  {tag}
                </Text>
              )
            )}
          </View>
        </View>

        {/* AI Summary Placeholder */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Insights</Text>
          <Text style={styles.insightText}>
            Avg. health score of scanned items:{' '}
            <Text style={{ fontWeight: 'bold' }}>7.8</Text>
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavWrapper}>
        <BottomNav />
        {/* Logout Button */}
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color="#fff" />
          <Text style={styles.logoutText}> Log out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111',
  },
  profileSection: {
    alignItems: 'center',

    marginBottom: 10,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 999,
    backgroundColor: '#eee',
    marginBottom: 10,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '600',
    color: '#222',
    marginBottom: 10,
  },
  editButton: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#333',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  editText: {
    color: '#fff',
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 30,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#444',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  infoLabel: {
    color: '#666',
  },
  infoValue: {
    fontWeight: '500',
    color: '#222',
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  badge: {
    backgroundColor: '#eee',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    color: '#333',
    fontWeight: '500',
  },
  insightText: {
    fontSize: 15,
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#222',
    paddingVertical: 21,
    paddingHorizontal: 24,
    borderRadius: 50,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  bottomNavWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    bottom: 23,
    paddingHorizontal: 14,
  },
});
