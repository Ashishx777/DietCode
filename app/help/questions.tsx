import { router } from 'expo-router';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  LayoutAnimation,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';

// Enable LayoutAnimation for Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const faqData = [
  {
    category: 'Ask AI & Nutrition Advice',
    questions: [
      {
        q: 'How does the “Ask AI” feature work?',
        a: 'Our Ask AI feature lets you chat with a smart nutrition assistant that can answer health-related questions. It uses advanced AI models to understand and respond in natural language.',
      },
      {
        q: 'Can I ask questions in my native language?',
        a: 'Yes! The voice assistant automatically detects your language and responds accordingly (e.g., Hindi, Bengali, English, etc.).',
      },
      {
        q: 'Is the AI a certified nutritionist?',
        a: 'No, it’s not a doctor or certified nutritionist. However, it’s trained on reliable data and gives general dietary guidance. For medical concerns, consult a professional.',
      },
      {
        q: 'What kind of questions can I ask?',
        a: 'You can ask about food benefits, health scores, diet plans, supplements, and more. Example: “Is paneer good for weight loss?”',
      },
    ],
  },
  {
    category: 'Product Health Score & Data Source:',
    questions: [
      {
        q: 'How is the product health score calculated?',
        a: 'DietCode uses AI to analyze nutrition labels and ingredient lists. It assigns a health score based on calories, fat, sugar, additives, and portion size.',
      },
      {
        q: 'What does the “AI Advisor” section show?',
        a: 'This section gives smart tips based on your preferences, like whether a food is diabetic-friendly, gluten-free, or high in protein.',
      },
      {
        q: 'Where does the product information come from?',
        a: 'Product data comes from trusted APIs like OpenFoodFacts and supplement databases. Scanned barcodes are matched with real-time info.',
      },
      {
        q: 'What if a product doesn’t show up after scanning?',
        a: 'Some local or new products might not be in the global database. You can manually search or report missing items in the Support section.',
      },
    ],
  },
  {
    category: 'Support related questions:',
    questions: [
      {
        q: 'How do I report a bug or issue in the app?',
        a: 'Go to Help > Report an Issue, fill out the form, and submit. You can include screenshots or steps to reproduce the problem.',
      },
      {
        q: 'How can I give feedback or request a feature?',
        a: 'Use the Feedback option in the Help menu. We welcome ideas and use them to improve your experience!',
      },
      {
        q: 'How do I contact support directly?',
        a: 'Tap Contact Support in the Help section to message our team. We usually respond within 24 hours.',
      },
      {
        q: 'What version of DietCode am I using?',
        a: 'You’ll find the app version in Help > Version Info. This helps support troubleshoot your issues faster.',
      },
    ],
  },
];

export default function FAQScreen() {
  const [expandedCategory, setExpandedCategory] = useState(0); // First category open by default
  const [expandedQuestion, setExpandedQuestion] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleCategory = (index: number) => {
    LayoutAnimation.easeInEaseOut();
    setExpandedCategory(index === expandedCategory ? -1 : index);
  };

  const toggleQuestion = (key: string) => {
    LayoutAnimation.easeInEaseOut();
    setExpandedQuestion((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSubmitPress = () => {
    Linking.openURL('mailto:support@dietcode.app?subject=Submit a Question');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <ArrowLeft size={28} color="#333" />
      </TouchableOpacity>

      {/* Scrollable Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>Frequently Asked Questions:</Text>

        {faqData.map((section, idx) => (
          <View key={idx}>
            {/* Category Button */}
            <TouchableOpacity
              onPress={() => toggleCategory(idx)}
              style={styles.categoryButton}
            >
              <Text style={styles.categoryText}>{section.category}</Text>
              {expandedCategory === idx ? (
                <ChevronUp size={20} color="#555" />
              ) : (
                <ChevronDown size={20} color="#555" />
              )}
            </TouchableOpacity>

            {/* Questions under the category */}
            {expandedCategory === idx &&
              section.questions.map((item, qIdx) => {
                const key = `${idx}-${qIdx}`;
                const isExpanded = expandedQuestion[key];

                return (
                  <TouchableOpacity
                    key={key}
                    onPress={() => toggleQuestion(key)}
                    style={[
                      styles.questionBox,
                      isExpanded && styles.expandedQuestion,
                    ]}
                  >
                    <View style={styles.questionHeader}>
                      <Text style={styles.questionText}>{item.q}</Text>
                      {item.a &&
                        (isExpanded ? (
                          <ChevronUp size={18} color="#666" />
                        ) : (
                          <ChevronDown size={18} color="#666" />
                        ))}
                    </View>

                    {isExpanded && (
                      <View style={styles.answerBox}>
                        <Text style={styles.answerText}>{item.a}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
          </View>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sticky Footer Button */}
      <Pressable style={styles.submitButton} onPress={handleSubmitPress}>
        <Text style={styles.submitText}>Submit your Question</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
  },
  backButton: {
    marginTop: 40,
    marginLeft: 20,
    marginBottom: 10,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 140,
  },
  heading: {
    fontSize: 44,
    fontWeight: '900',
    color: '#111',
    marginBottom: 24,
  },
  categoryButton: {
    backgroundColor: '#f2f3f3',
    padding: 18,
    borderRadius: 16,
    marginBottom: 4,
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#444',
  },
  questionBox: {
    backgroundColor: '#fbfafb',
    padding: 16,
    borderRadius: 14,
    marginVertical: 4,
    marginLeft: 20,
    marginRight: 8,
  },
  expandedQuestion: {
    backgroundColor: '#f7f7f7',
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    paddingRight: 8,
  },
  answerBox: {
    marginTop: 10,
  },
  answerText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  submitButton: {
    position: 'absolute',
    bottom: 35,
    left: 24,
    right: 24,
    backgroundColor: '#70c289',
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
  },
  submitText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
