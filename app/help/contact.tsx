import { useRouter } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  Image,
  Linking,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function SupportCard() {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  const handleContact = () => {
    Linking.openURL('mailto:support@dietcode.app');
  };
  return (
    <View style={styles.overlay}>
      <StatusBar barStyle="dark-content" backgroundColor="#f2f3f3" />
      <View style={styles.shadowWrapper}>
        <View style={styles.card}>
          {/* Content */}
          <Image
            source={require('@/assets/icons/report.png')}
            style={styles.image}
          />
          <Text style={styles.title}>Need Help?</Text>
          <Text style={styles.message}>
            Our support team is here to help you with any issues or questions.
          </Text>
          <Pressable style={styles.primaryButton} onPress={handleContact}>
            <Text style={styles.primaryText}>Email Support</Text>
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
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 20,
    padding: 6,
    color: '#999',
  },
  image: {
    width: 220,
    height: 220,
    marginBottom: 12,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#111',
  },

  message: {
    fontSize: 16,
    textAlign: 'center',
    color: '#999',
    marginBottom: 16,
    paddingHorizontal: 20,
  },

  primaryButton: {
    backgroundColor: '#70c289',
    paddingVertical: 16,
    paddingHorizontal: '30%',
    borderRadius: 20,
    marginBottom: 10,
  },
  primaryText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  secondaryButton: {
    paddingVertical: 10,
  },
  secondaryText: {
    fontSize: 16,
    color: '#999',
  },
});
