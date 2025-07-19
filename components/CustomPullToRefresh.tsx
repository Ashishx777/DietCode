import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export default function CustomPullToRefresh({
  children,
  onRefresh,
  refreshing,
}: {
  children: React.ReactNode;
  refreshing: boolean;
  onRefresh: () => void;
}) {
  const pullDistance = useSharedValue(0);

  const animatedTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(pullDistance.value, [0, 80], [0, 1]);
    const translateY = interpolate(pullDistance.value, [0, 80], [20, 0]);

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    pullDistance.value = -offsetY;
  };

  const handleEndDrag = () => {
    if (pullDistance.value > 80) {
      onRefresh();
    }
    pullDistance.value = withTiming(0, { duration: 200 });
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: 30,
              alignSelf: 'center',
            },
            animatedTextStyle,
          ]}
        >
          <Text style={{ fontSize: 16, color: '#555' }}>Swipe to Refresh</Text>
        </Animated.View>

        <ScrollView
          onScroll={handleScroll}
          scrollEventThrottle={16}
          onScrollEndDrag={handleEndDrag}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 100, paddingBottom: 50 }}
        >
          {children}
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
}
