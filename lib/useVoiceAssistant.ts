// hooks/useVoiceAssistant.ts
/* eslint-disable react-hooks/exhaustive-deps */
import Voice from '@react-native-voice/voice';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { franc } from 'franc-min';
import { useEffect, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';

type UseVoiceAssistantOptions = {
  onResult: (text: string) => void;
};

export default function useVoiceAssistant({
  onResult,
}: UseVoiceAssistantOptions) {
  const [listening, setListening] = useState(false);

  const detectLang = (text: string): string => {
    const code = franc(text || 'hello');
    switch (code) {
      case 'hin':
        return 'hi-IN';
      case 'ben':
        return 'bn-IN';
      case 'guj':
        return 'gu-IN';
      case 'kan':
        return 'kn-IN';
      case 'tam':
        return 'ta-IN';
      case 'tel':
        return 'te-IN';
      default:
        return 'en-US';
    }
  };

  const requestAudioPermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') return true;

    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: 'DietCode Voice Permission',
        message: 'We need access to your microphone to use voice input.',
        buttonPositive: 'Allow',
      }
    );

    return result === PermissionsAndroid.RESULTS.GRANTED;
  };

  const playSound = async (file: any) => {
    try {
      const { sound } = await Audio.Sound.createAsync(file);
      await sound.playAsync();
    } catch (error) {
      console.error('Failed to play sound:', error);
    }
  };

  const startListening = async (promptText = 'hello') => {
    try {
      const hasPermission = await requestAudioPermission();
      if (!hasPermission) {
        console.warn('Microphone permission denied');
        return;
      }

      await playSound(require('../assets/sound/mic-on.mp3'));

      const lang = detectLang(promptText);
      Speech.speak("I'm listening...", { language: lang });

      setListening(true);
      await Voice.start(lang);
    } catch (error) {
      console.error('Start listening error:', error);
      setListening(false);
    }
  };

  const stopListening = async () => {
    try {
      setListening(false);
      await Voice.stop();
      await playSound(require('../assets/sound/mic-off.mp3'));
    } catch (error) {
      console.error('Stop listening error:', error);
    }
  };

  useEffect(() => {
    Voice.onSpeechResults = (event) => {
      const text = event.value?.[0];
      if (text) {
        onResult(text);
        stopListening();
      }
    };

    Voice.onSpeechError = (err) => {
      console.error('Voice error:', err);
      stopListening();
    };

    Voice.onSpeechEnd = stopListening;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  return {
    listening,
    startListening,
    stopListening,
  };
}
