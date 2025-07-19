// screens/profile/DOBChangeScreen.tsx
import { ProfileContext } from '@/components/auth/ProfileContext';
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
  selectedIndex: number;
  onIndexChange: (index: number) => void;
};

const WheelPicker: React.FC<WheelPickerProps> = ({
  items,
  selectedIndex,
  onIndexChange,
}) => {
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      y: selectedIndex * ITEM_HEIGHT,
      animated: false,
    });
  }, [selectedIndex]);

  const onScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const yOffset = event.nativeEvent.contentOffset.y;
    const index = Math.round(yOffset / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(index, items.length - 1));
    scrollRef.current?.scrollTo({
      y: clampedIndex * ITEM_HEIGHT,
      animated: true,
    });
    onIndexChange(clampedIndex);
  };

  return (
    <View style={styles.wheelContainer}>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        snapToAlignment="start"
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
              {item.toString()}
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

export default function DOBChangeScreen() {
  const router = useRouter();
  const { profile, updateProfile } = useContext(ProfileContext);

  const initialDOB = profile?.dob || {
    month: 'Jan',
    day: 1,
    year: CURRENT_YEAR - 18,
  };

  const initialMonthIndex = MONTHS.indexOf(initialDOB.month);
  const initialDayIndex = initialDOB.day - 1;
  const initialYearIndex = YEARS.indexOf(initialDOB.year);

  const [monthIndex, setMonthIndex] = useState(
    initialMonthIndex >= 0 ? initialMonthIndex : 0
  );
  const [dayIndex, setDayIndex] = useState(
    initialDayIndex >= 0 ? initialDayIndex : 0
  );
  const [yearIndex, setYearIndex] = useState(
    initialYearIndex >= 0 ? initialYearIndex : 18
  );

  const days = useMemo(() => {
    const year = YEARS[yearIndex];
    const month = monthIndex;
    const totalDays = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: totalDays }, (_, i) => i + 1);
  }, [monthIndex, yearIndex]);

  const handleUpdate = () => {
    if (!profile) return;

    const updatedProfile = {
      ...profile,
      dob: {
        month: MONTHS[monthIndex],
        day: days[dayIndex],
        year: YEARS[yearIndex],
      },
    };

    updateProfile(updatedProfile);
    router.back();
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
      </View>
      <View style={styles.wrapper}>
        <Image
          source={require('@/assets/images/auth-hero-4.png')}
          style={styles.heroImage}
          resizeMode="contain"
        />
        <View style={styles.card}>
          <Text style={styles.heading}>Edit Birthday</Text>
          <Text style={styles.subheading}>
            Updating your birth date helps us fine-tune your daily nutrition
            goals.
          </Text>

          <View style={styles.pickerRow}>
            <WheelPicker
              items={MONTHS}
              selectedIndex={monthIndex}
              onIndexChange={setMonthIndex}
            />
            <WheelPicker
              items={days}
              selectedIndex={dayIndex}
              onIndexChange={setDayIndex}
            />
            <WheelPicker
              items={YEARS}
              selectedIndex={yearIndex}
              onIndexChange={setYearIndex}
            />
          </View>

          <View style={styles.buttonWrapper}>
            <Pressable style={styles.nextButton} onPress={handleUpdate}>
              <Text style={styles.nextText}>Update</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

// ---- STYLES ----
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  heroImage: {
    width: '100%',
    height: height * 0.35,
    marginTop: -10,
  },
  card: {
    flex: 1,
    width: '100%',
    paddingBottom: ITEM_HEIGHT * 2,
    gap: 15,
    paddingHorizontal: 30,
    marginTop: 5,
  },

  heading: {
    fontSize: 48,
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
    flexDirection: 'row',
    backgroundColor: '#111',
    paddingVertical: 20,
    paddingHorizontal: '30%',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 24,
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
