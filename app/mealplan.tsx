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
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <View style={styles.shadowWrapper}>
        <View style={styles.card}>
          <Image
            source={require('@/assets/images/version.png')}
            style={styles.image}
          />
          <Text style={styles.title}>Meal plan feature coming soon!</Text>
          <Text style={styles.message}>
            • Weekly meal calendar{'\n'}• Nutritional breakdown{'\n'}• Grocery
            list generation
          </Text>
          <Pressable style={styles.button} onPress={handleClose}>
            <Text style={styles.buttonText}>Close</Text>
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
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#111',
    textAlign: 'center',
    paddingHorizontal: 30,
  },

  message: {
    fontSize: 16,
    textAlign: 'center',
    color: '#444',
    marginBottom: 18,
    paddingHorizontal: 20,
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
    fontSize: 20,
  },
});
