import React from 'react';
import {
  Dimensions,
  Image,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

type Props = {
  onClose: () => void;
};

export default function ContactSupportCard({ onClose }: Props) {
  const handleContact = () => {
    Linking.openURL('mailto:support@dietcode.app');
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.shadowWrapper}>
        <View style={styles.card}>
          <Image
            source={require('@/assets/icons/congratulations.png')}
            style={styles.image}
          />
          <Text style={styles.title}>Need Help?</Text>
          <Text style={styles.message}>
            Our support team is ready to help you. Contact us anytime.
          </Text>

          <Pressable style={styles.primaryButton} onPress={handleContact}>
            <Text style={styles.primaryText}>Email Support</Text>
          </Pressable>

          <Pressable style={styles.secondaryButton} onPress={onClose}>
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
    fontWeight: '900',
    marginBottom: 6,
    color: '#111',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: '#444',
    marginBottom: 18,
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
