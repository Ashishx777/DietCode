import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Animated, Pressable, Text, View } from 'react-native';
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
export default function Notification() {
  const router = useRouter();

  // Animation logic
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View className="flex-1 bg-white px-6 pt-6">
      {/* Animated Back Button */}
      <Pressable
        onPress={() => router.back()}
        onPressIn={() => (scale.value = withTiming(0.95, { duration: 100 }))}
        onPressOut={() => (scale.value = withTiming(1, { duration: 100 }))}
        className="w-10 h-10 justify-center items-center mb-4"
      >
        <Animated.View style={animatedStyle}>
          <ArrowLeft size={28} color="#333" />
        </Animated.View>
      </Pressable>

      {/* Screen Content Here */}
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-2xl font-bold">Notifications & Updates</Text>
      </View>
    </View>
  );
}
