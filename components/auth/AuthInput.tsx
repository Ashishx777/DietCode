import * as Haptics from 'expo-haptics';
import { Eye, EyeOff } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, Text, TextInput, TextInputProps, View } from 'react-native';

interface AuthInputProps extends TextInputProps {
  Icon: React.ElementType;
  error?: string;
}

export default function AuthInput({
  Icon,
  secureTextEntry,
  error,
  ...props
}: AuthInputProps) {
  const [hidden, setHidden] = useState(secureTextEntry ?? false);

  const togglePasswordVisibility = () => {
    setHidden(!hidden);
    Haptics.selectionAsync();
  };

  return (
    <View className="space-y-1">
      <View className="flex-row items-center px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl">
        <Icon size={20} color="#888" />
        <TextInput
          {...props}
          className="flex-1 ml-3 text-base text-gray-800"
          secureTextEntry={hidden}
          placeholderTextColor="#999"
        />
        {secureTextEntry && (
          <Pressable
            onPress={togglePasswordVisibility}
            accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
            accessibilityRole="button"
            hitSlop={10}
          >
            {hidden ? (
              <EyeOff size={20} color="#888" />
            ) : (
              <Eye size={20} color="#888" />
            )}
          </Pressable>
        )}
      </View>
      {error && <Text className="text-sm text-red-500 ml-1">{error}</Text>}
    </View>
  );
}
