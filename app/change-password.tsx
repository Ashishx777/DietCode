import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const { height } = Dimensions.get('window');

export default function ChangePassword() {
  const router = useRouter();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleChange = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    console.log('Password changed!');
    setError('');
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {/* Hero Image */}
      <View style={styles.heroWrapper}>
        <Image
          source={require('@/assets/images/password.png')}
          style={styles.heroImage}
          resizeMode="contain"
        />
      </View>
      {/* Card Content */}
      <View style={styles.card}>
        <Text style={styles.heading}>Change Your Password</Text>
        <Text style={styles.subheading}>
          For your account safety, use a strong and unique password.
        </Text>

        <TextInput
          placeholder="Current password"
          placeholderTextColor="#888"
          secureTextEntry
          value={oldPassword}
          onChangeText={setOldPassword}
          style={styles.input}
        />
        <TextInput
          placeholder="New password"
          placeholderTextColor="#888"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
          style={styles.input}
        />
        <TextInput
          placeholder="Confirm new password"
          placeholderTextColor="#888"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          style={styles.input}
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Pressable style={styles.button} onPress={handleChange}>
          <Text style={styles.buttonText}>Update Password</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={handleCancel}>
          <Text style={styles.secondaryText}>Cancel</Text>
        </Pressable>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
  },
  heroImage: {
    position: 'absolute',
    width: '100%',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.45,
  },
  heroWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: height * 0.38,
  },

  card: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 34,
    width: '100%',
    flex: 1,
    alignItems: 'center',
  },
  heading: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 14,
    marginTop: -20,
    textAlign: 'center',
  },
  subheading: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 26,
    paddingHorizontal: 20,
  },
  input: {
    width: '100%',
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    padding: 20,
    fontSize: 16,
    color: '#000',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#70c289',
    paddingVertical: 16,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 10,
    marginTop: 10,
  },
  secondaryText: {
    fontSize: 16,
    color: '#999',
  },
  errorText: {
    color: '#fc3c3c',
    marginBottom: 8,
    fontSize: 14,
    textAlign: 'center',
  },
});
