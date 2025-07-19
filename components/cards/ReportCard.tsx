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

type Props = {
  onPress: () => void;
};

export default function ReportIssueCard({ onPress }: Props) {
  return (
    <View style={styles.overlay}>
      <View style={styles.shadowWrapper}>
        <View style={styles.card}>
          <Image
            source={require('@/assets/images/bug-report.png')} // replace with bug image
            style={styles.image}
          />
          <Text style={styles.title}>Bug Report Sent</Text>
          <Text style={styles.message}>
            Thanks! Our team will look into the issue as soon as possible.
          </Text>
          <Pressable style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>Got It</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ...StyleSheet.create({
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
      width: 200,
      height: 200,
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
    button: {
      backgroundColor: '#ff7979',
      paddingVertical: 18,
      paddingHorizontal: '30%',
      borderRadius: 20,
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 20,
    },
  }),
});
