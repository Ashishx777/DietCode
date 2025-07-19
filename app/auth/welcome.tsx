import { AuthContext } from '@/components/auth/AuthContext';
import { ProfileContext } from '@/components/auth/ProfileContext';
import { STORAGE_KEYS } from '@/constants/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import React, { useContext, useEffect } from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const { height } = Dimensions.get('window');

function isProfileComplete(userData: any): boolean {
  return (
    !!userData?.name &&
    !!userData?.username &&
    !!userData?.email &&
    !!userData?.dob &&
    !!userData?.countryCode &&
    (userData?.gender === 'male' || userData?.gender === 'female')
  );
}

export default function WelcomeScreen() {
  const router = useRouter();
  const { userData, setLoggedIn } = useContext(AuthContext);
  const { updateProfile } = useContext(ProfileContext);

  useEffect(() => {
    console.log('[WelcomeScreen] Final userData:', userData);

    if (!isProfileComplete(userData)) {
      console.warn('[WelcomeScreen] Incomplete profile. Redirecting...');
      router.replace('/auth/signup-email');
    }
  }, [router, userData]);

  const handleStart = async () => {
    console.log('[WelcomeScreen] Start button pressed');

    if (!isProfileComplete(userData)) {
      console.warn('[WelcomeScreen] Cannot start: profile incomplete.');
      return;
    }

    const profile = {
      name: userData.name ?? '',
      username: userData.username ?? '',
      email: userData.email ?? '',
      country: userData.country ?? '',
      countryCode: userData.countryCode ?? 'IN',
      dob: userData.dob ?? { month: 'Jan', day: 1, year: 2000 },
      gender: (userData.gender === 'male' || userData.gender === 'female'
        ? userData.gender
        : '') as 'male' | 'female' | '',
      profilePic:
        userData.profilePic &&
        [
          'pic1',
          'pic2',
          'pic3',
          'pic4',
          'pic5',
          'pic6',
          'pic7',
          'pic8',
          'pic9',
          'pic10',
          'pic11',
          'pic12',
        ].includes(userData.profilePic)
          ? userData.profilePic
          : 'pic9',
    };

    try {
      await Promise.all([
        AsyncStorage.setItem(`auth-${profile.email}`, 'dummyPassword'),
        AsyncStorage.setItem(
          `profile-${profile.email}`,
          JSON.stringify(profile)
        ),
        AsyncStorage.setItem(STORAGE_KEYS.LOGGED_IN_EMAIL, profile.email),
        AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData)),
      ]);

      updateProfile(profile);
      setLoggedIn(true);
      router.replace('/');
    } catch (err: any) {
      console.error(
        '[WelcomeScreen] Background save failed:',
        err?.message || err
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.imageContainer}>
        <Image
          source={require('@/assets/images/auth-hero-6.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>And now</Text>
        <Text style={styles.subtitle}>you’re ready</Text>
        <View style={styles.divider} />
        <Text style={styles.description}>
          Tap this button to start{'\n'}normalizing your daily nutrition
        </Text>
      </View>

      <Pressable style={styles.button} onPress={handleStart}>
        <Text style={styles.buttonText}>Let’s start</Text>
        <ArrowRight color="#fff" size={18} />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 40,
    paddingTop: 40,
  },
  imageContainer: {
    height: height * 0.5,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: height * 0.5,
    marginTop: -20,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: -20,
  },
  title: {
    fontSize: 32,
    fontWeight: '500',
    color: '#444',
    marginTop: -60,
  },
  subtitle: {
    fontSize: 48,
    fontWeight: '900',
    color: '#222',
  },
  divider: {
    width: 180,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#999',
    marginVertical: 30,
  },
  description: {
    fontSize: 20,
    color: '#666',
    textAlign: 'center',
    lineHeight: 25,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#111',
    paddingVertical: 24,
    paddingHorizontal: '30%',
    borderRadius: 28,
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
