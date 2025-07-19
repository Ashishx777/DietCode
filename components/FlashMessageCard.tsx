import React from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

interface Props {
  type: 'success' | 'error';
  onPress: () => void;
}

export default function FlashMessageCard({ type, onPress }: Props) {
  const isSuccess = type === 'success';
  return (
    <View style={styles.overlay}>
      <View style={styles.shadowWrapper}>
        <View style={[styles.card, isSuccess ? styles.success : styles.error]}>
          <Image
            source={
              isSuccess
                ? require('@/assets/icons/congratulations.png')
                : require('@/assets/icons/whoops.png')
            }
            style={styles.image}
          />
          <Text style={styles.title}>
            {isSuccess ? 'Congratulations!' : 'Whoops!'}
          </Text>
          <Text style={styles.message}>
            {isSuccess
              ? 'Your account has been created successfully.'
              : 'Something went wrong. Please try again.'}
          </Text>
          <Pressable
            style={[
              styles.button,
              isSuccess ? styles.successButton : styles.errorButton,
            ]}
            onPress={onPress}
          >
            <Text style={styles.buttonText}>
              {isSuccess ? 'Continue' : 'Try Again'}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    height: '100%',
    width,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },

  card: {
    backgroundColor: '#fff',
    width: width * 0.85,
    borderRadius: 38,
    padding: 24,
    alignItems: 'center',
    overflow: 'hidden',
    paddingBottom: 40,
    paddingTop: 25,
  },

  success: {},
  error: {},
  image: {
    width: 250,
    height: 250,
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#111',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: '#444',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#111',
    paddingVertical: 18,
    paddingHorizontal: '35%',
    borderRadius: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  shadowWrapper: {
    borderRadius: 58,
    backgroundColor: '#fff',
    shadowColor: '#ccc',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 10,
  },
  successButton: {
    backgroundColor: '#70c289',
  },
  errorButton: {
    backgroundColor: '#ea4b4f',
  },
});
