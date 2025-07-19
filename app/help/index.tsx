import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  HeartHandshake,
  Info,
  LifeBuoy,
  MailQuestion,
  MessageCircleQuestion,
} from 'lucide-react-native';
import React from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const { height } = Dimensions.get('window');

const helpOptions = [
  {
    icon: MessageCircleQuestion,
    label: 'FAQs & Tutorials',
    bgColor: '#e6f4ff',
    route: '/help/questions',
  },
  {
    icon: HeartHandshake,
    label: 'Feedback & Suggestions',
    bgColor: '#e6ffef',
    route: '/help/feedback',
  },
  {
    icon: MailQuestion,
    label: 'Contact Support',
    bgColor: '#fff5e6',
    route: '/help/contact',
  },
  {
    icon: LifeBuoy,
    label: 'Report a Bug',
    bgColor: '#ffe6ee',
    route: '/help/report',
  },
  {
    icon: Info,
    label: 'App Version: v1.0.0',
    bgColor: '#f4f4f4',
    route: '/help/version',
  },
];

export default function HelpScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={26} color="#333" />
        </Pressable>
      </View>

      {/* Hero Image */}
      <View style={styles.heroWrapper}>
        <Image
          source={require('@/assets/images/auth-hero-2.png')}
          style={styles.heroImage}
          resizeMode="contain"
        />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.heading}>Help & Feedback</Text>
        <Text style={styles.subheading}>
          Let us help you make the most of DietCode.
        </Text>

        <View style={styles.optionList}>
          {helpOptions.map(({ icon: Icon, label, bgColor, route }, index) => (
            <Pressable
              key={index}
              style={[styles.optionCard, { backgroundColor: bgColor }]}
              onPress={() => router.push(route as any)}
            >
              <View style={styles.iconCircle}>
                <Icon size={26} color="#333" />
              </View>
              <Text style={styles.optionLabel}>{label}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    position: 'absolute',
    top: 32,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroImage: {
    position: 'absolute',
    width: '100%',
    top: 30,
    left: 0,
    right: 0,
    height: height * 0.22,
  },
  heroWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: height * 0.25,
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 28,
    gap: 20,
  },
  heading: {
    fontSize: 42,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#111',
  },
  subheading: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: -8,
    marginBottom: -8,
    paddingHorizontal: 30,
  },
  optionList: {
    gap: 14,
    marginTop: 10,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});
