import { AuthContext } from '@/components/auth/AuthContext';
import AuthInput from '@/components/auth/AuthInput';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { ArrowLeft, Lock, Mail } from 'lucide-react-native';
import React, { useContext, useState } from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { height } = Dimensions.get('window');

export default function SignUpEmailScreen() {
  const router = useRouter();
  const { setUserData } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [error, setError] = useState('');

  const lengthOK = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  const matches = password === rePassword;
  const isEmailValid = /\S+@\S+\.\S+/.test(email);

  const isValid =
    isEmailValid &&
    lengthOK &&
    hasUpper &&
    hasLower &&
    hasNumber &&
    hasSymbol &&
    matches;

  const handleContinue = async () => {
    if (!isValid) {
      setError('Please ensure all fields are valid.');
      return;
    }

    const updated = {
      email,
      password,
    };
    setUserData((prev: any) => ({ ...prev, ...updated }));

    try {
      await AsyncStorage.setItem('userData', JSON.stringify(updated));
      console.log('[EmailScreen] Saved userData:', updated);
    } catch (e) {
      console.error('Failed to save userData', e);
    }

    router.push('/auth/welcome');
  };

  const getColor = (condition: boolean) =>
    condition ? styles.reqTextSuccess : styles.reqTextDefault;

  const SkipForward = () => {
    router.replace('/auth/welcome');
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
        <Pressable onPress={SkipForward} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip Here</Text>
        </Pressable>
      </View>
      {/* Top Hero Image */}
      <View style={styles.heroWrapper}>
        <Image
          source={require('@/assets/images/auth-hero.png')}
          style={styles.heroImage}
          resizeMode="contain"
        />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address</Text>
          <AuthInput
            placeholder="Enter your email"
            Icon={Mail}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setError('');
            }}
            keyboardType="email-address"
          />
        </View>

        {/* Password Section */}
        <Text style={styles.sectionTitle}>Create a password</Text>

        <AuthInput
          placeholder="Create a new password"
          Icon={Lock}
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setError('');
          }}
          secureTextEntry
        />

        <AuthInput
          placeholder="Re-enter your password"
          Icon={Lock}
          value={rePassword}
          onChangeText={(text) => {
            setRePassword(text);
            setError('');
          }}
          secureTextEntry
        />

        {/* Password Requirements */}
        <View style={styles.requirements}>
          <Text style={getColor(lengthOK)}>• At least 8 characters</Text>
          <Text style={getColor(hasUpper)}>• One uppercase letter (A–Z)</Text>
          <Text style={getColor(hasLower)}>• One lowercase letter (a–z)</Text>
          <Text style={getColor(hasNumber)}>• One number (0–9)</Text>
          <Text style={getColor(hasSymbol)}>
            • One special character (!@#...)
          </Text>
          <Text style={getColor(matches)}>• Passwords match</Text>
        </View>

        {/* Error */}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* Continue Button */}
        <Pressable
          disabled={!isValid}
          onPress={handleContinue}
          style={[styles.continueButton, !isValid && styles.buttonDisabled]}
        >
          <Text style={styles.continueText}>Finish Setup</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
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
  skipButton: {
    padding: 8,
  },
  skipText: {
    fontSize: 16,
    color: '#888',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroImage: {
    position: 'absolute',
    width: '100%',
    top: -5,
    left: 0,
    right: 0,
    height: height * 0.3,
  },
  heroWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: height * 0.27,
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 10,
    paddingHorizontal: 40,
    gap: 15,
  },
  inputGroup: {
    marginBottom: 6,
  },
  label: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 18,
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111',
    marginTop: 6,
  },
  requirements: {
    marginTop: 8,
    marginBottom: 8,
    gap: 4,
    paddingHorizontal: 4,
  },
  reqTextDefault: {
    fontSize: 14,
    color: '#888',
  },
  reqTextSuccess: {
    fontSize: 14,
    color: '#12a4a4',
  },
  errorText: {
    textAlign: 'center',
    color: '#fc0251',
    fontSize: 14,
    marginTop: 4,
  },
  continueButton: {
    backgroundColor: '#13a4a4',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#d4d4d4',
  },
  continueText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
