import React from 'react';
import { Image, Pressable, StyleSheet, Text } from 'react-native';

interface SocialButtonProps {
  provider: 'Google' | 'Facebook' | 'Apple';
}

const socialIcons: Record<SocialButtonProps['provider'], any> = {
  Google: require('../../assets/images/google-icon.png'),
  Facebook: require('../../assets/images/facebook-icon.png'),
  Apple: require('../../assets/images/apple-icon.png'),
};

export default function SocialButton({ provider }: SocialButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Continue with ${provider} button`}
      style={styles.button}
    >
      <Image
        source={socialIcons[provider]}
        style={styles.icon}
        resizeMode="contain"
      />
      <Text style={styles.text}>Continue with {provider}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
});
