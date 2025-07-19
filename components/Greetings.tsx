import React from 'react';
import { Text, View } from 'react-native';

type Props = {
  username: string;
};

export default function Greetings({ username }: Props) {
  const firstName = username.split(' ')[0]; // Get only the first name

  return (
    <View className="bg-white px-6">
      <Text className="text-5xl font-bold tracking-tighter text-[#808081]">
        Hi {firstName},{'\n'}
        <Text className="text-gray-800">
          How can I help{'\n'}you today?{'\n'}
        </Text>
      </Text>
    </View>
  );
}
