import { AuthContext } from '@/components/auth/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { height } = Dimensions.get('window');
const ITEM_HEIGHT = 52;
const VISIBLE_ROWS = 5;

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 150 }, (_, i) => CURRENT_YEAR - i);

type WheelPickerProps = {
  items: (string | number)[];
  onIndexChange: (index: number) => void;
};

const WheelPicker: React.FC<WheelPickerProps> = ({ items, onIndexChange }) => {
  const scrollRef = useRef<ScrollView>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const yOffset = event.nativeEvent.contentOffset.y;
    const index = Math.round(yOffset / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(index, items.length - 1));

    scrollRef.current?.scrollTo({
      y: clampedIndex * ITEM_HEIGHT,
      animated: true,
    });

    setSelectedIndex(clampedIndex);
    onIndexChange(clampedIndex);
  };

  return (
    <View style={styles.wheelContainer}>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        onMomentumScrollEnd={onScrollEnd}
        contentContainerStyle={{
          paddingBottom: ITEM_HEIGHT * (VISIBLE_ROWS - 1),
        }}
      >
        {items.map((item, index) => (
          <View key={index} style={styles.wheelItemContainer}>
            <Text
              style={[
                styles.wheelItemText,
                {
                  color: selectedIndex === index ? '#111' : '#9ca3af',
                  fontWeight: selectedIndex === index ? '600' : '400',
                },
              ]}
            >
              {item}
            </Text>
          </View>
        ))}
      </ScrollView>

      <LinearGradient
        colors={['transparent', '#fff']}
        style={styles.fadeBottom}
        pointerEvents="none"
      />
    </View>
  );
};

export default function SignUpDOBScreen() {
  const router = useRouter();
  const { setUserData } = useContext(AuthContext);

  const [monthIndex, setMonthIndex] = useState(0);
  const [dayIndex, setDayIndex] = useState(0);
  const [yearIndex, setYearIndex] = useState(18);

  const days = useMemo(() => {
    const year = YEARS[yearIndex];
    const month = monthIndex;
    const totalDays = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: totalDays }, (_, i) => i + 1);
  }, [monthIndex, yearIndex]);

  useEffect(() => {
    if (dayIndex >= days.length) {
      setDayIndex(days.length - 1);
    }
  }, [dayIndex, days]);

  const [isNavigating, setIsNavigating] = useState(false);

  const isDOBValid = useMemo(() => {
    return MONTHS[monthIndex] && days[dayIndex] && YEARS[yearIndex];
  }, [monthIndex, dayIndex, yearIndex, days]);

  const handleNext = async () => {
    if (!isDOBValid || isNavigating) return;
    setIsNavigating(true);

    const selectedDOB = {
      month: MONTHS[monthIndex],
      day: days[dayIndex],
      year: YEARS[yearIndex],
    };

    setUserData((prev: any) => {
      const updated = { ...(prev || {}), dob: selectedDOB };

      AsyncStorage.setItem('userData', JSON.stringify(updated)).catch((e) =>
        console.error('Failed to save userData', e)
      );

      return updated;
    });

    router.push('/auth/signup-gender');
  };

  const SkipForward = () => {
    router.replace('/auth/welcome');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={26} color="#333" />
        </Pressable>
        <Pressable onPress={SkipForward} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip Here</Text>
        </Pressable>
      </View>

      <View style={styles.wrapper}>
        <Image
          source={require('@/assets/images/auth-hero-4.png')}
          style={styles.heroImage}
          resizeMode="contain"
        />

        <View style={styles.card}>
          <Text style={styles.heading}>When is your birthday?</Text>
          <Text style={styles.subheading}>
            Knowing your birthday helps us personalize your nutrition advice.
          </Text>

          <View style={styles.pickerRow}>
            <WheelPicker items={MONTHS} onIndexChange={setMonthIndex} />
            <WheelPicker items={days} onIndexChange={setDayIndex} />
            <WheelPicker items={YEARS} onIndexChange={setYearIndex} />
          </View>

          <View style={styles.buttonWrapper}>
            <Pressable
              style={[styles.nextButton, !isDOBValid && styles.buttonDisabled]}
              onPress={handleNext}
              disabled={!isDOBValid}
            >
              <Text style={styles.nextText}>Next</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  heroImage: {
    width: '100%',
    height: height * 0.35,
    marginTop: -10,
  },
  header: {
    position: 'absolute',
    top: 30,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  skipButton: { padding: 8 },
  skipText: { fontSize: 16, color: '#888' },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  card: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    paddingBottom: ITEM_HEIGHT * 2,
    gap: 15,
    marginTop: 5,
  },
  heading: {
    fontSize: 40,
    fontWeight: '700',
    color: '#111',
    marginLeft: 10,
  },
  subheading: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 18,
    marginLeft: 14,
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    height: ITEM_HEIGHT * VISIBLE_ROWS,
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: 20,
    left: 24,
    right: 24,
  },
  nextButton: {
    backgroundColor: '#111827',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#aaa',
  },
  nextText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  wheelContainer: {
    width: 100,
    height: ITEM_HEIGHT * VISIBLE_ROWS,
    overflow: 'hidden',
    marginRight: 10,
  },
  wheelItemContainer: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wheelItemText: {
    fontSize: 28,
  },
  fadeBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT * 4,
    zIndex: 2,
  },
});
