import { LucideIcon } from 'lucide-react-native';
import React from 'react';
import { Pressable, Text, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  title: string;
  Icon: LucideIcon;
  backgroundColor: string;
  onPress?: () => void;
  style?: ViewStyle;
};

export default function GridButton({
  title,
  Icon,
  backgroundColor,
  onPress,
  style,
}: Props) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.94, {
      duration: 150,
      easing: Easing.out(Easing.ease),
    });
    opacity.value = withTiming(0.7, {
      duration: 150,
      easing: Easing.inOut(Easing.ease),
    });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, {
      duration: 200,
      easing: Easing.out(Easing.ease),
    });
    opacity.value = withTiming(1, {
      duration: 200,
      easing: Easing.inOut(Easing.ease),
    });
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      className="w-[48%] h-38 px-6 py-10 m-1 justify-center items-center"
      style={[{ backgroundColor, borderRadius: 30 }, style]}
    >
      <Animated.View
        style={[
          animatedStyle,
          {
            backgroundColor: 'white',
            padding: 12,
            borderRadius: 9999,
            marginBottom: 8,
          },
        ]}
      >
        <Icon size={28} color="#4c4c4d" />
      </Animated.View>

      <Animated.View style={animatedStyle}>
        <Text className="text-gray-800 text-3xl font-semibold text-center">
          {title}
        </Text>
      </Animated.View>
    </Pressable>
  );
}
