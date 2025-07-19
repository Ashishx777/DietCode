import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Animated,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { askAI, Message } from '@/lib/askAI';

export default function AIChatScreen() {
  const router = useRouter();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!input.trim()) return;

    setLoading(true);

    const newMessages: Message[] = [
      ...messages,
      { role: 'user', content: input },
    ];

    try {
      const reply = await askAI(newMessages);
      setMessages([...newMessages, { role: 'assistant', content: reply }]);
    } catch (error) {
      setMessages([
        ...newMessages,
        { role: 'assistant', content: 'Failed to get response from AI.' },
      ]);
      console.error(error);
    } finally {
      setLoading(false);
    }

    setInput('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Pressable
          onPress={() => router.back()}
          onPressIn={() => (scale.value = withTiming(0.95, { duration: 100 }))}
          onPressOut={() => (scale.value = withTiming(1, { duration: 100 }))}
          style={styles.backButton}
        >
          <Animated.View style={animatedStyle}>
            <ArrowLeft size={28} color="#333" />
          </Animated.View>
        </Pressable>

        <Text style={styles.title}>Ask AI Nutritionist</Text>

        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Ask about a product, ingredient, or diet..."
          style={styles.input}
          multiline
        />

        <Pressable
          onPress={handleAsk}
          style={styles.askButton}
          disabled={loading}
        >
          <Text style={styles.askButtonText}>
            {loading ? 'Thinking...' : 'Ask'}
          </Text>
        </Pressable>

        <ScrollView style={styles.scrollArea}>
          {messages.map((msg, i) => (
            <Text
              key={i}
              style={[
                styles.messageText,
                msg.role === 'user' ? styles.userText : styles.assistantText,
              ]}
            >
              {msg.role === 'user' ? 'You: ' : 'AI: '}
              {msg.content}
            </Text>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#111827',
  },
  input: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 12,
  },
  askButton: {
    backgroundColor: '#111827',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  askButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollArea: {
    flex: 1,
  },
  messageText: {
    fontSize: 16,
    marginBottom: 12,
  },
  userText: {
    color: '#2563eb', // Tailwind blue-600
  },
  assistantText: {
    color: '#374151', // Tailwind gray-800
  },
});
