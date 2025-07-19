// app/auth/signin.tsx
import AuthInput from '@/components/auth/AuthInput';
import SocialButton from '@/components/auth/SocialButton';
import { useRouter } from 'expo-router';
import { ArrowLeft, Lock, Mail } from 'lucide-react-native';
import React, { useContext, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthContext } from '@/components/auth/AuthContext';

const { height } = Dimensions.get('window');

const DEV_EMAIL = 'prince20032017@gmail.com';
const DEV_PASSWORD = 'Ren@Yuki143';

export default function SignInScreen() {
  const router = useRouter();
  const { signIn, setUserData, setLoggedIn } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    console.log('[SignIn] Pressed with:', email, password);

    if (!email.trim() || !password.trim()) return;

    const isDev = email.trim() === DEV_EMAIL && password === DEV_PASSWORD;

    if (isDev) {
      const devUser = {
        email: DEV_EMAIL,
        name: 'Dev User',
        username: 'dev_user',
        country: '',
        countryCode: 'IN',
        dob: { month: 'Jan', day: 1, year: 1990 },
        gender: 'male' as 'male',
        profilePic: 'pic9' as
          | 'pic1'
          | 'pic2'
          | 'pic3'
          | 'pic4'
          | 'pic5'
          | 'pic6'
          | 'pic7'
          | 'pic8'
          | 'pic9'
          | 'pic10'
          | 'pic11'
          | 'pic12',
      };

      console.log(
        '[SignIn] Using DEV login. Setting userData and redirecting...'
      );
      setUserData(devUser);
      setLoggedIn(true);
      router.replace('/');
      return;
    }

    try {
      console.log('[SignIn] Calling signIn function...');
      const success = await signIn(email.trim(), password);

      if (success) {
        console.log('[SignIn] Login success. Navigating to /');
        router.replace('/');
      } else {
        console.warn('[SignIn] Login failed: incorrect email or password.');
        Alert.alert('Login Failed', 'Incorrect email or password.');
      }
    } catch (err) {
      console.error('[SignInScreen] Error during sign-in:', err);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={26} color="#333" />
        </Pressable>
      </View>

      <View style={styles.heroWrapper}>
        <Image
          source={require('@/assets/images/auth-hero-3.png')}
          style={styles.heroImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.card}>
        <View style={styles.head}>
          <Text style={styles.heading}>Welcome Back</Text>
          <Text style={styles.subheading}>Sign in to your account</Text>
        </View>

        <AuthInput
          placeholder="Email"
          Icon={Mail}
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            console.log('[SignIn] Email updated:', text);
          }}
        />
        <AuthInput
          placeholder="Password"
          Icon={Lock}
          secureTextEntry
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            console.log('[SignIn] Password updated');
          }}
        />

        <Pressable
          onPress={handleSignIn}
          style={[
            styles.continueButton,
            (!email.trim() || !password.trim()) && styles.buttonDisabled,
          ]}
          disabled={!email.trim() || !password.trim()}
        >
          <Text style={styles.continueText}>Sign In</Text>
        </Pressable>

        <View style={styles.orRow}>
          <View style={styles.line} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.socialWrapper}>
          <SocialButton provider="Google" />
          <SocialButton provider="Facebook" />
          <SocialButton provider="Apple" />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  heroImage: {
    position: 'absolute',
    width: '100%',
    top: 20,
    left: 0,
    right: 0,
    height: height * 0.2,
  },
  heroWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: height * 0.26,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 38,
    marginTop: -20,
    gap: 15,
  },
  header: {
    position: 'absolute',
    top: 30,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  head: {
    marginBottom: 18,
    alignItems: 'center',
    marginTop: -20,
  },
  heading: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#111',
  },
  subheading: {
    fontSize: 16,
    color: '#666',
    marginTop: 2,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButton: {
    backgroundColor: '#70c289',
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  continueText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  orText: {
    marginHorizontal: 10,
    color: '#888',
  },
  socialWrapper: {
    gap: 12,
  },
});
