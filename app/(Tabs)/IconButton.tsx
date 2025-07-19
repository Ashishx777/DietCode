import * as Haptics from 'expo-haptics';
import { LucideIcon } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { Pressable, View, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  label?: string;
  onPress: () => void;
  active?: boolean;
  Icon: LucideIcon;
  className?: string;
  activeColor?: string;
  inactiveColor?: string;
  style?: ViewStyle;
};

export default function IconButton({
  onPress,
  active = false,
  Icon,
  className = '',
  activeColor = 'black',
  inactiveColor = 'white',
  style,
}: Props) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const fade = useSharedValue(active ? 1 : 0);
  const hasMounted = React.useRef(false);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));
  const handlePress = async () => {
    await Haptics.selectionAsync();
    onPress();
  };

  useEffect(() => {
    if (hasMounted.current) {
      fade.value = withTiming(active ? 1 : 0, {
        duration: 250,
        easing: Easing.inOut(Easing.ease),
      });
    } else {
      fade.value = active ? 1 : 0;
      hasMounted.current = true;
    }
  }, [active, fade]);

  const handlePressIn = () => {
    scale.value = withTiming(0.93, {
      duration: 180,
      easing: Easing.out(Easing.ease),
    });
    opacity.value = withTiming(0.6, {
      duration: 180,
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
  const fadeBgStyle = useAnimatedStyle(() => ({
    opacity: fade.value,
  }));

  const staticShadowStyle: ViewStyle = {
    backgroundColor: 'white',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 9999,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  };

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      className={`p-4 rounded-full ${
        active ? 'bg-white' : 'bg-[#282928]'
      } ${className}`}
    >
      <Animated.View style={[staticShadowStyle, fadeBgStyle]} />

      <Animated.View style={[animatedStyle, style]}>
        <View>
          <Icon size={24} color={active ? activeColor : inactiveColor} />
        </View>
      </Animated.View>
    </Pressable>
  );
}
