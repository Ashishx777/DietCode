// components/ScannedProductCard.tsx
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Image, Pressable, Text, Vibration, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { Product } from '../types/Product';

export default function ScannedProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const translateY = useSharedValue(300);
  const shake = useSharedValue(0);

  useEffect(() => {
    translateY.value = withSpring(0, { damping: 12 });
    shake.value = withTiming(
      1,
      { duration: 300, easing: Easing.elastic(1.5) },
      () => {
        shake.value = withTiming(0);
      }
    );
    Vibration.vibrate(50);
  }, [shake, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: shake.value * 4 },
    ],
  }));

  const score = parseInt(String(product.aiScore ?? 0));
  const scoreLabel =
    score >= 80 ? 'Healthy Choice' : score >= 50 ? 'Moderate' : 'Too Processed';
  const scoreColor =
    score >= 80
      ? 'text-green-500'
      : score >= 50
      ? 'text-yellow-500'
      : 'text-red-500';

  const imageUri =
    product.image?.startsWith('http') || product.image?.startsWith('data:')
      ? product.image
      : 'https://via.placeholder.com/64';

  const displayPrice =
    typeof product.price === 'string'
      ? product.price.includes('₹')
        ? product.price
        : `₹${product.price}`
      : product.price
      ? `₹${product.price}`
      : '₹--';

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          position: 'absolute',
          bottom: 24,
          left: 16,
          right: 16,
          zIndex: 999,
          elevation: 10,
        },
      ]}
      className="bg-[#121212] rounded-3xl p-4 flex-row items-center shadow-lg shadow-black"
    >
      <Image
        source={{ uri: imageUri }}
        className="w-14 h-14 rounded-full bg-white border border-gray-200"
        resizeMode="cover"
      />

      <View className="flex-1 ml-4">
        <Text className="text-white font-bold text-lg" numberOfLines={1}>
          {product.name || 'Unnamed Product'}
        </Text>

        <Text className="text-neutral-400 text-sm">
          {product.netWeight || '100g'} • {displayPrice}
        </Text>

        {product.aiScore !== undefined && (
          <Text className={`mt-1 font-medium text-sm ${scoreColor}`}>
            {score}/100 – {scoreLabel}
          </Text>
        )}
      </View>

      <Pressable
        onPress={() =>
          router.push({
            pathname: '/product/[id]',
            params: { id: product.id },
          })
        }
        className="ml-2 bg-white px-3 py-2 rounded-xl"
      >
        <Text className="text-black font-semibold text-sm">View</Text>
      </Pressable>
    </Animated.View>
  );
}
