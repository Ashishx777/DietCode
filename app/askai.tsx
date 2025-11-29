import { askAI } from '@/lib/askAI';
import useVoiceAssistant from '@/lib/useVoiceAssistant';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, BotIcon, Mic, MicOff } from 'lucide-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import ParsedText from 'react-native-parsed-text';

const QUICK_PROMPTS = [
  {
    title: 'Answer all your questions.',
    subtitle: ' (Just ask me anything you like!)',
  },
  {
    title: 'Generate all the text you want.',
    subtitle: '(Essays, articles, reports, stories, & more)',
  },
  {
    title: 'Conversational AI.',
    subtitle: '(I can talk to you like a natural human)',
  },
];

const DYNAMIC_PROMPTS = [
  'Is this good for weight loss?',
  'How much sugar is too much?',
  'Is it suitable for diabetics?',
  'Suggest a healthier alternative',
];

export default function AskAI() {
  const router = useRouter();
  const { context } = useLocalSearchParams();
  const product = context ? JSON.parse(context as string) : null;
  const [showSuggestions, setShowSuggestions] = useState(true);

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<
    { from: 'user' | 'ai'; text: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [animatedText, setAnimatedText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages, animatedText]);

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, []);

  // Memoized animation function that batches word updates
  const animateText = useCallback(
    (fullText: string): Promise<void> => {
      return new Promise((resolve) => {
        const words = fullText.split(' ');
        let wordIndex = 0;
        const WORDS_PER_BATCH = 3;
        const BATCH_INTERVAL = 50;

        animationRef.current = setInterval(() => {
          const endIndex = Math.min(wordIndex + WORDS_PER_BATCH, words.length);
          const currentText = words.slice(0, endIndex).join(' ') + ' ';
          setAnimatedText(currentText);
          wordIndex = endIndex;

          if (wordIndex >= words.length) {
            if (animationRef.current) {
              clearInterval(animationRef.current);
              animationRef.current = null;
            }
            resolve();
          }
        }, BATCH_INTERVAL);
      });
    },
    []
  );

  const handleSend = useCallback(
    async (text: string) => {
    console.log('Sending message:', text);
    const message = text.trim();
    if (!message) return;
    setShowSuggestions(false);

    setMessages((prev) => [...prev, { from: 'user', text: message }]);
    setInput('');
    setLoading(true);
    setAnimatedText('');

    try {
      const systemPrompt = `
You are "DietCode", an expert AI nutritionist with the tone and style of ChatGPT.
Your replies should feel natural, smart, and human — never robotic. Speak like a helpful friend who really knows nutrition.

✅ Keep answers short and conversational by default.
✅ Use simple, clear language. Explain like you're talking to a beginner.
✅ Give helpful, supportive replies. Avoid sounding cold or clinical.
✅ When asked "why", "how", or "what", teach clearly and kindly.
✅ Feel free to suggest healthy food swaps where relevant.
✅ Use emoji.

❌ Never repeat the user’s question.
❌ Never mention you're an AI or language model.
❌ Don’t give long lectures unless user asks.

Style guide:
- Tone: Friendly, clear, warm — like ChatGPT.
- Length: Short and helpful unless detail is requested.
- Avoid jargon. Use plain everyday language.
`;
      let dynamicPrompt = '';

      if (message.toLowerCase().includes('weight loss')) {
        dynamicPrompt = `Answer as a weight loss nutritionist. Focus on calories, fat, and sugar. Suggest healthier options if needed.`;
      } else if (message.toLowerCase().includes('diabetes')) {
        dynamicPrompt = `Respond with blood sugar safety in mind. Highlight sugar and carb levels.`;
      }

      const fullSystemPrompt = dynamicPrompt
        ? `${systemPrompt}\n\nAdditional context: ${dynamicPrompt}`
        : systemPrompt;

      const aiReply = await askAI([
        { role: 'system', content: fullSystemPrompt },
        { role: 'user', content: message },
      ]);
      const formattedReply = aiReply.replace(/(\d+)\.\s/g, '\n\n$1. ');

      await animateText(formattedReply);
      setMessages((prev) => [...prev, { from: 'ai', text: formattedReply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { from: 'ai', text: '❌ Failed to get a response.' },
      ]);
    } finally {
      setAnimatedText('');
      setLoading(false);
    }
    },
    [animateText]
  );

  useEffect(() => {
    if (product) {
      const intro = `Can you tell me if this product is healthy?\n\nName: ${product.name}\nAI Score: ${product.aiScore}\nIngredients: ${product.ingredients}`;
      handleSend(intro);
    }
  }, [product, handleSend]);

  const { listening, startListening, stopListening } = useVoiceAssistant({
    onResult: (text) => {
      setInput(text);
      handleSend(text);
    },
  });

  const resetChat = () => {
    setMessages([]);
    setAnimatedText('');
    setInput('');
  };

  const TypingIndicator = () => {
    const [dots, setDots] = useState('');

    useEffect(() => {
      const interval = setInterval(() => {
        setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
      }, 400);
      return () => clearInterval(interval);
    }, []);

    return <Text style={styles.bubbleText}>{dots}</Text>;
  };

  function handleLinkPress(text: string, index: number): void {
    if (text.toLowerCase().includes('almond milk')) {
      router.push({
        pathname: '/search' as const,
        params: { query: 'almond milk' },
      });
    } else {
      alert(`You tapped: ${text}`);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <View style={styles.innerContainer}>
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={26} color="#333" />
            </Pressable>
            <View style={styles.titleWrapper}>
              <Text style={styles.headerTitle}>Ask AI</Text>
            </View>
            <Pressable onPress={resetChat} style={styles.newButton}>
              <Text style={{ color: '#888', fontSize: 14 }}>New Chat</Text>
            </Pressable>
          </View>

          {messages.length === 0 ? (
            <View style={styles.staticIntroContainer}>
              <View style={styles.logoContainer}>
                <BotIcon size={78} color="#bdbdbf" style={styles.logo} />
                <Text style={styles.sectionTitle}>Capabilities</Text>
              </View>
              {QUICK_PROMPTS.map((item, idx) => (
                <Pressable
                  key={idx}
                  onPress={() => handleSend(item.title)}
                  style={styles.promptCard}
                >
                  <Text style={styles.promptTitle}>{item.title}</Text>
                  <Text style={styles.promptSubtitle}>{item.subtitle}</Text>
                </Pressable>
              ))}
              <Text style={styles.examplesNote}>
                These are just a few examples of what I can do.
              </Text>
            </View>
          ) : (
            <ScrollView
              ref={scrollViewRef}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {messages.map((msg, index) => (
                <View
                  key={index}
                  style={[
                    styles.chatBubble,
                    msg.from === 'user' ? styles.userBubble : styles.aiBubble,
                  ]}
                >
                  <ParsedText
                    style={styles.bubbleText}
                    parse={[
                      {
                        type: 'url',
                        style: {
                          color: '#1e90ff',
                          textDecorationLine: 'underline',
                        },
                        onPress: handleLinkPress,
                      },
                      {
                        pattern: /\*\*(.*?)\*\*/,
                        style: { fontWeight: 'bold' },
                        renderText: (matchingString, matches) =>
                          matches?.[1] ?? matchingString,
                      },
                      {
                        pattern: /:\w+:/,
                        style: { fontSize: 18 },
                      },
                    ]}
                    childrenProps={{ allowFontScaling: false }}
                  >
                    {msg.text}
                  </ParsedText>
                </View>
              ))}
              {loading && (
                <View style={[styles.chatBubble, styles.aiBubble]}>
                  <Text style={styles.bubbleText}>
                    {animatedText || <TypingIndicator />}
                  </Text>
                </View>
              )}
              {showSuggestions && !loading && (
                <View style={styles.dynamicPromptsContainer}>
                  {DYNAMIC_PROMPTS.map((prompt, idx) => (
                    <Pressable
                      key={idx}
                      onPress={() => handleSend(prompt)}
                      style={styles.dynamicPromptBtn}
                    >
                      <Text style={styles.dynamicPromptText}>{prompt}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </ScrollView>
          )}

          <View style={styles.inputContainer}>
            <Pressable
              onPress={listening ? stopListening : () => startListening(input)}
              style={styles.voiceIcon}
            >
              {listening ? (
                <MicOff size={22} color="#d33" />
              ) : (
                <Mic size={22} color="#666" />
              )}
            </Pressable>

            <TextInput
              placeholder="Ask me anything..."
              value={input}
              onChangeText={setInput}
              style={styles.textInput}
              placeholderTextColor="#999"
              onSubmitEditing={() => handleSend(input)}
              returnKeyType="send"
              multiline
            />

            <Pressable
              onPress={() => handleSend(input)}
              style={styles.sendButton}
            >
              <Image
                source={require('../assets/images/sendarrow.png')}
                style={styles.sendIcon}
                resizeMode="contain"
              />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffefe',
    paddingTop: 40,
  },
  flex: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#fff',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newButton: {
    width: 60,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: '600',
    color: '#1a1a1a',
    marginTop: 2,
    marginLeft: 20,
  },
  scrollContent: {
    paddingVertical: 20,
    paddingBottom: 140,
  },
  staticIntroContainer: {
    paddingTop: 50,
    paddingBottom: 85,
    paddingHorizontal: 5,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    marginBottom: 12,
    alignSelf: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    color: '#bebfbe',
    marginBottom: 6,
  },
  promptCard: {
    backgroundColor: '#f6f6f6',
    paddingVertical: 28,
    paddingHorizontal: 18,
    borderRadius: 20,
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  promptTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#bebfbe',
    textAlign: 'center',
  },
  promptSubtitle: {
    fontSize: 14,
    color: '#bebfbe',
    marginTop: 4,
    textAlign: 'center',
  },
  examplesNote: {
    marginTop: 15,
    color: '#bebfbe',
    textAlign: 'center',
  },
  chatBubble: {
    padding: 14,
    marginVertical: 6,
    maxWidth: '80%',
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: '#f7f3ef',
    alignSelf: 'flex-end',
  },
  aiBubble: {},
  bubbleText: {
    fontSize: 17,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 40,
    backgroundColor: '#fff',
    gap: 6,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#F2F2F2',
    color: '#333',
    minHeight: 48,
    maxHeight: 120,
  },
  sendButton: {
    height: 48,
    width: 48,
    backgroundColor: '#282928',
    borderRadius: 999,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIcon: {
    transform: [{ rotate: '-45deg' }],
    height: 48,
    width: 48,
    tintColor: 'white',
  },
  voiceIcon: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dynamicPromptsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 8,
    marginTop: 10,
    paddingHorizontal: 10,
  },

  dynamicPromptBtn: {
    backgroundColor: '#f2f2f2',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },

  dynamicPromptText: {
    fontSize: 14,
    color: '#333',
  },
});
