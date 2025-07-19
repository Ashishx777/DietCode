import { useRouter } from 'expo-router';
import { Footprints, Goal, Plus, Utensils } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const FloatingMenu = () => {
  const firstValue = useSharedValue(30);
  const secondValue = useSharedValue(30);
  const thirdValue = useSharedValue(30);
  const isOpen = useSharedValue(false);
  const rotation = useSharedValue(0);
  const router = useRouter();

  const handlePress = () => {
    const config = {
      easing: Easing.bezier(0.68, -0.6, 0.32, 1.6),
      duration: 400,
    };

    if (isOpen.value) {
      // Close
      rotation.value = withTiming(0, config);
      firstValue.value = withTiming(30, config);
      secondValue.value = withDelay(50, withTiming(30, config));
      thirdValue.value = withDelay(100, withTiming(30, config));
    } else {
      // Open
      rotation.value = withTiming(1, config);
      firstValue.value = withDelay(150, withSpring(90));
      secondValue.value = withDelay(50, withSpring(160));
      thirdValue.value = withSpring(230);
    }
    isOpen.value = !isOpen.value;
  };

  const firstIcon = useAnimatedStyle(() => {
    const scale = interpolate(firstValue.value, [30, 90], [0, 1]);
    return {
      bottom: firstValue.value,
      transform: [{ scale }],
      opacity: scale,
    };
  });

  const secondIcon = useAnimatedStyle(() => {
    const scale = interpolate(secondValue.value, [30, 160], [0, 1]);
    return {
      bottom: secondValue.value,
      transform: [{ scale }],
      opacity: scale,
    };
  });

  const thirdIcon = useAnimatedStyle(() => {
    const scale = interpolate(thirdValue.value, [30, 230], [0, 1]);
    return {
      bottom: thirdValue.value,
      transform: [{ scale }],
      opacity: scale,
    };
  });

  const rotatePlus = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${rotation.value * 45}deg`,
        },
      ],
    };
  });

  return (
    <View style={styles.container}>
      {/* Progress tracker Button */}
      <Animated.View style={[styles.contentContainer, thirdIcon]}>
        <Pressable onPress={() => router.push('/ProgressTracker' as any)}>
          <View style={styles.iconContainer}>
            <Footprints color="#4c4c4d" size={28} />
          </View>
        </Pressable>
      </Animated.View>

      {/* Goals Button */}
      <Animated.View style={[styles.contentContainer, secondIcon]}>
        <Pressable onPress={() => router.push('/goals' as any)}>
          <View style={styles.iconContainer}>
            <Goal color="#4c4c4d" size={28} />
          </View>
        </Pressable>
      </Animated.View>

      {/* Meal Plan Button */}
      <Animated.View style={[styles.contentContainer, firstIcon]}>
        <Pressable onPress={() => router.push('/mealplan' as any)}>
          <View style={styles.iconContainer}>
            <Utensils color="#4c4c4d" size={28} />
          </View>
        </Pressable>
      </Animated.View>

      <Pressable style={styles.PlusContainer} onPress={handlePress}>
        <Animated.View style={[styles.plusiconContainer, rotatePlus]}>
          <Plus color="white" size={28} />
        </Animated.View>
      </Pressable>
    </View>
  );
};

export default FloatingMenu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 18,
    right: 6,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  PlusContainer: {
    backgroundColor: '#000',
    position: 'absolute',
    bottom: 18,
    right: 5,
    borderRadius: 50,
  },
  iconContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusiconContainer: {
    width: 65,
    height: 65,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
