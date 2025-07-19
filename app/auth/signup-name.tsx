import { AuthContext } from '@/components/auth/AuthContext';
import AuthInput from '@/components/auth/AuthInput';
import { useRouter } from 'expo-router';
import { ArrowLeft, User } from 'lucide-react-native';
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

const icons = {
  Google: require('@/assets/images/google-icon.png'),
  Facebook: require('@/assets/images/facebook-icon.png'),
  Apple: require('@/assets/images/apple-icon.png'),
};

type SocialButtonProps = {
  provider: 'Google' | 'Facebook' | 'Apple';
  onPress?: () => void;
};

function SocialButton({ provider, onPress }: SocialButtonProps) {
  return (
    <Pressable
      style={styles.button}
      onPress={onPress}
      accessibilityLabel={`Continue with ${provider}`}
    >
      <Image source={icons[provider]} style={styles.icon} />
      <Text style={styles.text}>Continue with {provider}</Text>
    </Pressable>
  );
}

export default function SignUpNameScreen() {
  const router = useRouter();
  const { setUserData } = useContext(AuthContext);

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');

  const handleContinue = () => {
    if (!fullName.trim() || !username.trim()) return;

    setUserData((prev) => ({
      ...prev,
      name: fullName.trim(),
      username: username.trim(),
    }));

    router.push('/auth/signup-dob');
  };

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

      <View style={styles.heroWrapper}>
        <Image
          source={require('@/assets/images/auth-hero-3.png')}
          style={styles.heroImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.heading}>What’s your name?</Text>

        <AuthInput
          placeholder="Full Name"
          Icon={User}
          value={fullName}
          onChangeText={setFullName}
        />
        <AuthInput
          placeholder="Username"
          Icon={User}
          value={username}
          onChangeText={setUsername}
        />

        <Pressable
          onPress={handleContinue}
          style={[
            styles.continueButton,
            (!fullName.trim() || !username.trim()) && styles.buttonDisabled,
          ]}
          disabled={!fullName.trim() || !username.trim()}
        >
          <Text style={styles.continueText}>Continue</Text>
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
    position: 'relative',
  },
  heroWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: height * 0.22,
  },
  heroImage: {
    position: 'absolute',
    width: '100%',
    top: 20,
    height: height * 0.22,
    zIndex: -1,
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
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipButton: {
    padding: 8,
  },
  skipText: {
    fontSize: 16,
    color: '#888',
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 34,
    gap: 15,
  },
  heading: {
    fontSize: 34,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#111',
    marginBottom: 10,
    marginTop: 10,
  },
  continueButton: {
    backgroundColor: '#222',
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
    gap: 0,
  },
  icon: {
    width: 24,
    height: 24,
    borderRadius: 14,
    marginRight: 12,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 24,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#e6e8eb',
  },
});
