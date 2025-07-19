// app/product/[id].tsx
import { useLocalSearchParams } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { ProductContext } from '@/components/ProductContext';

import ProductDetailsUI from '@/components/ProductDetailsUI';
import { fetchProductByBarcode } from '@/lib/api';
import { Product } from '@/types/Product';

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { getProductById, addProductToHistory } = useContext(ProductContext);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    if (typeof id !== 'string') return;
    setRefreshing(true);
    try {
      const fetched = await fetchProductByBarcode(id);
      if (!fetched) throw new Error('Product not found');

      const enriched: Product = {
        id: fetched.id,
        name: fetched.name || 'Unnamed Product',
        image: fetched.image || '',
        calories: fetched.calories ?? 'N/A',
        time: new Date().toISOString(),
        description: fetched.description || '',
        ingredients: fetched.ingredients || '',
        netWeight: fetched.netWeight || '100g',
        price: fetched.price || '0',
        aiScore: fetched.aiScore ?? 0,
        aiReason: fetched.aiReason || '',
        nutrients: fetched.nutrients || {},
        nutritionPreferences: fetched.preferences || {},
        nutritionAdvisor: fetched.advisor || {},
        nutritionPer100g: fetched.nutritionPer100g || {
          energy: 'N/A',
          protein: 'N/A',
          saturatedFat: 'N/A',
          fat: 'N/A',
          carbs: 'N/A',
          sugar: 'N/A',
          fiber: 'N/A',
          sodium: 'N/A',
        },
      };

      setProduct(enriched);
      addProductToHistory(enriched);
      setError(null);
    } catch (err: any) {
      console.error('Refresh failed:', err);
      setError(err.message || 'Refresh failed');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const loadProduct = async () => {
      if (typeof id !== 'string') return;
      if (product?.id === id) return;

      const local = getProductById(id);

      const isComplete =
        local &&
        local.name &&
        local.ingredients &&
        local.aiScore !== undefined &&
        local.image &&
        Object.keys(local.nutritionPer100g || {}).length > 0;

      if (isComplete) {
        setProduct(local);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const fetched = await fetchProductByBarcode(id);
        if (!fetched) throw new Error('Product not found');

        const enriched: Product = {
          id: fetched.id,
          name: fetched.name || 'Unnamed Product',
          image: fetched.image || '',
          calories: fetched.calories ?? 'N/A',
          time: new Date().toISOString(),
          description: fetched.description || '',
          ingredients: fetched.ingredients || '',
          netWeight: fetched.netWeight || '100g',
          price: fetched.price || '0',
          aiScore: fetched.aiScore ?? 0,
          aiReason: fetched.aiReason || '',
          nutrients: fetched.nutrients || {},
          nutritionPreferences: fetched.preferences || {},
          nutritionAdvisor: fetched.advisor || {},
          nutritionPer100g: fetched.nutritionPer100g || {
            energy: 'N/A',
            protein: 'N/A',
            saturatedFat: 'N/A',
            fat: 'N/A',
            carbs: 'N/A',
            sugar: 'N/A',
            fiber: 'N/A',
            sodium: 'N/A',
          },
        };

        setProduct(enriched);
        addProductToHistory(enriched);
      } catch (err: any) {
        console.error('Load product failed:', err);
        setError(err.message || 'Unknown error');
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [addProductToHistory, getProductById, id, product?.id]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  if (!product || error) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}
      >
        <Text style={{ fontSize: 16, color: 'red', textAlign: 'center' }}>
          {error || 'Product not found.'}
        </Text>
      </View>
    );
  }

  return (
    <ProductDetailsUI
      product={product}
      onRefresh={onRefresh}
      refreshing={refreshing}
      key={product.id + product.aiScore}
    />
  );
}
