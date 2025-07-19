import { router } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

type Props = {
  onPress: () => void;
};

export default function SupportCard({ onPress }: Props) {
  const handleClose = () => {
    router.back();
  };
  return (
    <View style={styles.overlay}>
      <StatusBar barStyle="dark-content" backgroundColor="#f2f3f3" />
      <View style={styles.shadowWrapper}></View>
      <View style={styles.shadowWrapper}>
        <View style={styles.card}>
          <Image
            source={require('@/assets/icons/report.png')}
            style={styles.image}
          />
          <Text style={styles.title}>Found a Bug?</Text>
          <Text style={styles.message}>
            Having issues? Tap to report a bug or crash. Our team will look into
            it!
          </Text>
          <Pressable style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>Report Now</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={handleClose}>
            <Text style={styles.secondaryText}>Maybe Later</Text>
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

  shadowWrapper: {
    borderRadius: 58,
    backgroundColor: '#fff',
    shadowColor: '#ccc',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 10,
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

  image: {
    width: 220,
    height: 220,
    marginBottom: 12,
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#111',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 20,
    padding: 6,
    color: '#999',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: '#444',
    marginBottom: 16,
  },

  button: {
    backgroundColor: '#70c289',
    paddingVertical: 18,
    paddingHorizontal: '30%',
    borderRadius: 20,
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  secondaryButton: {
    paddingVertical: 10,
    marginTop: 10,
  },
  secondaryText: {
    fontSize: 16,
    color: '#999',
  },
});
