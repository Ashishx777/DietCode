import { useRouter } from 'expo-router';
import React, { useContext, useEffect } from 'react';
import { FlatList, Image, Pressable, Text, View } from 'react-native';
import { fetchProductByBarcode } from '../lib/api';
import { Product, ProductContext } from './ProductContext';

export default function HistoryList({ data }: { data: Product[] }) {
  const router = useRouter();
  const { addProductToHistory } = useContext(ProductContext);

  useEffect(() => {
    const refetchMissingData = async () => {
      for (const item of data) {
        const needsRefetch =
          !item.image || !item.aiScore || !item.nutrients?.fat;

        if (needsRefetch) {
          const updated = await fetchProductByBarcode(item.id);
          if (updated) {
            const enriched = {
              ...updated,
              time: new Date().toISOString(),
            };
            addProductToHistory(enriched);
          }
        }
      }
    };

    if (data && data.length > 0) refetchMissingData();
  }, [addProductToHistory, data]);

  if (!data || data.length === 0) {
    return <Text className="text-center mt-20">No scanned history yet.</Text>;
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => (
        <Pressable
          className="mb-4 p-4 rounded-3xl bg-[#f5f5f5]"
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
              className="w-20 h-20 rounded-2xl"
              resizeMode="cover"
            />
            <View className="flex-1">
              <Text className="text-lg font-semibold" numberOfLines={1}>
                {item.name}
              </Text>
              <Text className="text-gray-500 text-sm" numberOfLines={1}>
                {item.description || 'No description'}
              </Text>
              <Text className="text-gray-600 text-xs mt-1">{item.time}</Text>
            </View>
          </View>
        </Pressable>
      )}
    />
  );
}
