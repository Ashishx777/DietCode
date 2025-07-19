import { LucideIcon } from 'lucide-react-native';
import React from 'react';
import { Pressable, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  Icon: LucideIcon;
  onPress?: () => void;
  backgroundColor?: string;
  iconColor?: string;
  size?: number;
  style?: ViewStyle;
  children?: React.ReactNode;
};

export default function RoundIconButton({
  Icon,
  onPress,
  backgroundColor = '#fff',
  iconColor = '#4c4c4d',
  size = 28,
  style,
  children,
}: Props) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.95, {
      duration: 150,
      easing: Easing.out(Easing.ease),
    });
    opacity.value = withTiming(0.75, {
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
      style={[
        {
          backgroundColor,
          borderRadius: 999,
          padding: 12,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      <Animated.View style={animatedStyle}>
        <Icon size={size} color={iconColor} />
        {children}
      </Animated.View>
    </Pressable>
  );
}
