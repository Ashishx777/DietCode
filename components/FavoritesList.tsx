import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Image, Pressable, Text, View } from 'react-native';
import { Product } from './ProductContext';

interface FavoritesListProps {
  data: Product[];
}

export default function FavoritesList({ data }: FavoritesListProps) {
  const router = useRouter();

  if (!data || data.length === 0) {
    return <Text className="text-center mt-20">No favorites yet.</Text>;
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => (
        <Pressable
          className="mb-4 p-4 rounded-xl bg-[#f5f5f5]"
          onPress={() =>
            router.push({
              pathname: '/product/[id]',
              params: { id: item.id },
            })
          }
        >
          <View className="flex-row items-center gap-3">
            <Image
              source={{ uri: item.image }}
              className="w-20 h-20 rounded-md"
            />
            <View className="flex-1">
              <Text className="text-lg font-semibold">{item.name}</Text>
              <Text className="text-gray-500 text-sm">{item.description}</Text>
              <Text className="text-gray-600 text-xs mt-1">{item.time}</Text>
            </View>
          </View>
        </Pressable>
      )}
    />
  );
}
