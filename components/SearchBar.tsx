import { AudioLines, Search } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.95, {
      duration: 100,
      easing: Easing.out(Easing.ease),
    });
    opacity.value = withTiming(0.6, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, {
      duration: 150,
      easing: Easing.out(Easing.ease),
    });
    opacity.value = withTiming(1, { duration: 150 });
  };

  const handleSearchPress = () => {
    // Add your custom search logic here if needed
    console.log('🔍 Search Query:', query);
  };

  return (
    <View style={styles.container}>
      <Search color={styles.icon.color} size={24} />
      <TextInput
        style={styles.input}
        placeholder="Ask or search for anything"
        placeholderTextColor={styles.placeholder.color}
        value={query}
        onChangeText={setQuery}
        returnKeyType="search"
      />
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handleSearchPress}
      >
        <Animated.View style={[animatedStyle, styles.voiceButton]}>
          <AudioLines color={styles.icon.color} size={24} />
        </Animated.View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 999,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
  } as ViewStyle,
  input: {
    marginLeft: 12,
    flex: 1,
    fontSize: 16,
    color: '#000000',
  } as TextStyle,
  placeholder: {
    color: '#9d9d9d',
  } as TextStyle,
  icon: {
    color: '#4c4c4d',
  } as TextStyle,
  voiceButton: {
    marginLeft: 12,
  } as ViewStyle,
});

export default SearchBar;
/*import { requestMicPermission } from '@/constants/requestMicPermission';
import Voice, {
  SpeechErrorEvent as VoiceSpeechErrorEvent,
  SpeechResultsEvent as VoiceSpeechResultsEvent,
} from '@react-native-voice/voice';
import Constants from 'expo-constants';
import { AudioLines, Search } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

// Type definitions matching the Voice module's types
interface SpeechResultsEvent extends VoiceSpeechResultsEvent {
  value?: string[];
}

interface SpeechErrorEvent extends VoiceSpeechErrorEvent {
  error?: {
    message?: string;
  };
}

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const [isListening, setIsListening] = useState(false);
  const [isExpoGo, setIsExpoGo] = useState(false);
  const [voiceModuleAvailable, setVoiceModuleAvailable] = useState(false);

  useEffect(() => {
    // Updated to use non-deprecated property
    setIsExpoGo(
      Platform.OS !== 'web' && Constants.executionEnvironment === 'storeClient'
    );
    requestMicPermission();
    setVoiceModuleAvailable(!isExpoGo && Boolean(Voice));
  }, [isExpoGo]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.95, {
      duration: 100,
      easing: Easing.out(Easing.ease),
    });
    opacity.value = withTiming(0.6, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, {
      duration: 150,
      easing: Easing.out(Easing.ease),
    });
    opacity.value = withTiming(1, { duration: 150 });
  };

  const handleVoiceSearch = async () => {
    if (!voiceModuleAvailable) {
      Alert.alert(
        'Voice Search Unavailable',
        'Voice search requires a development build. Please build the app to test this feature.'
      );
      return;
    }

    try {
      if (isListening) {
        await Voice.stop();
        setIsListening(false);
        return;
      }

      console.log('🎙️ Starting voice recognition...');
      setQuery('');
      setIsListening(true);
      await Voice.start('en-US');
    } catch (err) {
      console.error('Voice recognition error:', err);
      setIsListening(false);
      Alert.alert('Error', 'Failed to start voice recognition');
    }
  };

  useEffect(() => {
    if (!voiceModuleAvailable) return;

    const onSpeechResults = (e: SpeechResultsEvent) => {
      if (e.value && e.value.length > 0) {
        setQuery(e.value[0]);
      }
    };

    const onSpeechEnd = () => {
      setIsListening(false);
    };

    const onSpeechError = (e: SpeechErrorEvent) => {
      console.error('Speech error:', e.error?.message || 'Unknown error');
      setIsListening(false);
    };

    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;

    return () => {
      Voice.removeAllListeners?.();
      Voice.destroy?.().catch(() => {});
    };
  }, [voiceModuleAvailable]);

  return (
    <View style={styles.container}>
      <Search color={styles.icon.color} size={24} />
      <TextInput
        style={styles.input}
        placeholder="Ask or search for anything"
        placeholderTextColor={styles.placeholder.color}
        value={query}
        onChangeText={setQuery}
        returnKeyType="search"
        editable={!isListening}
      />
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handleVoiceSearch}
        disabled={!voiceModuleAvailable}
      >
        <Animated.View style={[animatedStyle, styles.voiceButton]}>
          <AudioLines
            color={
              !voiceModuleAvailable
                ? styles.disabledIcon.color
                : isListening
                ? styles.activeIcon.color
                : styles.icon.color
            }
            size={24}
          />
        </Animated.View>
      </Pressable>
    </View>
  );
};

// Styles with TypeScript types
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 999,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  } as ViewStyle,
  input: {
    marginLeft: 12,
    flex: 1,
    fontSize: 16,
    color: '#000000',
  } as TextStyle,
  placeholder: {
    color: '#9d9d9d',
  } as TextStyle,
  icon: {
    color: '#4c4c4d',
  } as TextStyle,
  activeIcon: {
    color: '#70c289',
  } as TextStyle,
  disabledIcon: {
    color: '#cccccc',
  } as TextStyle,
  voiceButton: {
    marginLeft: 12,
  } as ViewStyle,
});

export default SearchBar;
*/
