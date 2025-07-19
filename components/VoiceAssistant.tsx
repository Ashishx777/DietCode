// components/VoiceAssistant.tsx

import Voice from '@react-native-voice/voice';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  onResult: (text: string) => void;
};

export default function VoiceAssistant({ onResult }: Props) {
  const [listening, setListening] = useState(false);
  const [speakingText, setSpeakingText] = useState('');

  // ✅ Language detection fallback
  const detectLang = (text: string): string => {
    if (/[অ-ঔ]/.test(text)) return 'bn-IN'; // Bengali
    if (/[अ-औ]/.test(text)) return 'hi-IN'; // Hindi
    return 'en-US';
  };

  // ✅ Effect to clean up listeners when component unmounts
  useEffect(() => {
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startVoiceAssistant = async () => {
    try {
      setListening(true);

      // ✅ Play "ding" sound
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/sounds/ding.mp3')
      );
      await sound.playAsync();

      const lang = detectLang(speakingText || 'hello');

      // ✅ Voice feedback
      Speech.speak("I'm listening...", { language: lang });

      // ✅ Set event handlers
      Voice.onSpeechResults = (event) => {
        const spoken = event.value?.[0];
        if (spoken) {
          setSpeakingText(spoken);
          setListening(false);
          onResult(spoken);
          Voice.stop();
        }
      };

      Voice.onSpeechEnd = () => {
        setListening(false);
        Voice.stop();
      };

      Voice.onSpeechError = (e) => {
        console.error('Speech error', e);
        setListening(false);
        Voice.cancel();
      };

      // ✅ Start listening
      await Voice.start(lang);
    } catch (err) {
      console.error('Start error:', err);
      setListening(false);
    }
  };

  const stopVoiceAssistant = async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.warn('Stop error:', e);
    }
    setListening(false);
  };

  return (
    <View style={styles.voiceContainer}>
      <Pressable
        onPress={listening ? stopVoiceAssistant : startVoiceAssistant}
        style={[styles.micButton, listening && { backgroundColor: '#FF9F9F' }]}
      >
        <Image
          source={
            listening
              ? require('../assets/icons/stop.png')
              : require('../assets/icons/mic.png')
          }
          style={styles.icon}
        />
      </Pressable>
      {speakingText !== '' && (
        <Text style={styles.speakingText}>{speakingText}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  voiceContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  micButton: {
    backgroundColor: '#CDB4FF',
    padding: 24,
    borderRadius: 50,
    shadowColor: '#aaa',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  icon: {
    width: 28,
    height: 28,
    tintColor: '#fff',
  },
  speakingText: {
    fontSize: 16,
    color: '#333',
    marginTop: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
