import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import React, { useContext, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import FavoritesList from '../components/FavoritesList';
import HistoryList from '../components/HistoryList';
import { ProductContext } from '../components/ProductContext';

function TabButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.tabButton, active && styles.tabButtonActive]}
    >
      <Text style={styles.tabText}>{label}</Text>
    </Pressable>
  );
}

export default function List() {
  const router = useRouter();
  const scale = useSharedValue(1);
  const fade = useSharedValue(1);
  const [activeTab, setActiveTab] = useState<'history' | 'favorites'>(
    'history'
  );

  const { history, favorites } = useContext(ProductContext);

  const animatedBackStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedContentStyle = useAnimatedStyle(() => ({
    opacity: fade.value,
  }));

  const handleTabPress = (tab: 'history' | 'favorites') => {
    if (tab === activeTab) return;
    fade.value = withTiming(0, { duration: 150 }, (finished) => {
      if (finished) {
        runOnJS(setActiveTab)(tab);
        fade.value = withTiming(1, { duration: 150 });
      }
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <View style={styles.headerRow}>
        <Pressable
          onPress={() => router.back()}
          onPressIn={() => (scale.value = withTiming(0.95))}
          onPressOut={() => (scale.value = withTiming(1))}
          style={styles.backButton}
        >
          <Animated.View style={animatedBackStyle}>
            <ArrowLeft size={28} color="#111" />
          </Animated.View>
        </Pressable>

        <View style={styles.tabRow}>
          <View style={styles.tabContainer}>
            <TabButton
              label="History"
              active={activeTab === 'history'}
              onPress={() => handleTabPress('history')}
            />
          </View>
          <View style={styles.tabContainer}>
            <TabButton
              label="Favorites"
              active={activeTab === 'favorites'}
              onPress={() => handleTabPress('favorites')}
            />
          </View>
        </View>
      </View>

      <Animated.View style={[styles.animatedContent, animatedContentStyle]}>
        {activeTab === 'history' ? (
          <HistoryList data={history} />
        ) : (
          <FavoritesList data={favorites} />
        )}
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 8,
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabRow: {
    flexDirection: 'row',
    marginLeft: 8,
    flex: 1,
    paddingRight: 40,
    gap: 12,
  },
  tabContainer: {
    flex: 1,
  },
  tabButton: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
    backgroundColor: '#fff',
  },
  tabButtonActive: {
    backgroundColor: '#f8f9f8',
  },
  tabText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  animatedContent: {
    flex: 1,
  },
});
