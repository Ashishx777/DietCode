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

const { width, height } = Dimensions.get('window');

export default function FeedbackPage() {
  const router = useRouter();
  const [feedback, setFeedback] = useState('');

  const handleSubmit = () => {
    console.log('Feedback:', feedback);
    router.back();
  };
  const handleClose = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {/* Hero Image */}
      <Image
        source={require('@/assets/icons/congratulations.png')}
        style={styles.heroImage}
        resizeMode="contain"
      />
      {/* Card Content */}
      <View style={styles.card}>
        <Text style={styles.heading}>We Value Your Feedback</Text>
        <Text style={styles.subheading}>
          Share suggestions or report anything we can improve.
        </Text>

        <TextInput
          multiline
          placeholder="Type your feedback here..."
          placeholderTextColor="#888"
          value={feedback}
          onChangeText={setFeedback}
          style={styles.inputBox}
        />

        <Pressable style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Send Feedback</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={handleClose}>
          <Text style={styles.secondaryText}>Maybe Later</Text>
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
    alignItems: 'center',
  },
  heroImage: {
    width: width,
    height: height * 0.35,
    marginTop: 40,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 20,
    padding: 6,
    color: '#999',
  },
  card: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    width: '100%',
    flex: 1,
    alignItems: 'center',
  },
  heading: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 6,
    marginTop: -20,
    textAlign: 'center',
  },
  subheading: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
    marginTop: 5,
  },
  inputBox: {
    width: '100%',
    minHeight: 180,
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: '#000',
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#70c289',
    paddingVertical: 16,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 10,
    marginTop: 5,
  },
  secondaryText: {
    fontSize: 16,
    color: '#999',
  },
});
