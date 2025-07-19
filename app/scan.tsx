import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation, useRouter } from 'expo-router';
import { useContext, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Product } from '../types/Product';

import { ProductContext } from '@/components/ProductContext';
import ScannedProductCard from '../components/ScannedProductCard';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export default function Scan() {
  const router = useRouter();
  const navigation = useNavigation();
  const { addProductToHistory } = useContext(ProductContext);

  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, setCameraKey] = useState(0);
  const [product, setProduct] = useState<Product | null>(null);

  const cameraRef = useRef(null);
  const translateY = useSharedValue(300);
  const shake = useSharedValue(0);
  const scanningRef = useRef(false);

  useEffect(() => {
    if (permission?.granted) {
      const unsubscribe = navigation.addListener('focus', () => {
        setProduct(null);
        setCameraKey((prev) => prev + 1);
      });
      return unsubscribe;
    } else if (!permission) {
      requestPermission();
    }
  }, [permission, navigation, requestPermission]);

  const onCancel = () => router.back();

  const getAIScore = async (product: Product) => {
    try {
      const aiRes = await fetch(`${API_BASE_URL}/rate-product`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredients: product.ingredients,
          productName: product.name,
        }),
      });

      const aiData = await aiRes.json();
      product.aiScore = aiData?.score ?? 0;
      product.aiReason = aiData?.reason ?? 'No reason provided';
    } catch (err) {
      console.warn('AI rating failed:', err);
      product.aiScore = 0;
      product.aiReason = 'AI service unavailable';
    }
  };

  const fetchSupplementDetails = async (
    barcode: string
  ): Promise<Product | null> => {
    try {
      const res = await fetch(
        `https://dsld.nlm.nih.gov/dsld/api/label?identifier=${barcode}`
      );
      const data = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        const s = data[0];

        return {
          id: s.product_ndc || barcode,
          name: s.product_name || 'Unnamed Supplement',
          description: s.label_display || s.label_author || 'No description',
          image: '',
          ingredients:
            s.ingredients?.map((i: any) => i.ingredient_name).join(', ') ||
            'N/A',
          netWeight: s.package_size || 'N/A',
          price: '--',
          calories: 'N/A',
          nutrients: {},
          time: new Date().toLocaleString(),
          nutritionPreferences: undefined,
          nutritionAdvisor: undefined,
          nutritionPer100g: {
            energy: '',
            protein: '',
            saturatedFat: '',
            fat: '',
            carbs: '',
            sugar: '',
            fiber: '',
            sodium: '',
          },
        };
      }
    } catch (e) {
      console.error('Supplement fetch error:', e);
    }

    return null;
  };

  const fetchProductDetails = async (barcode: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
      );
      const data = await response.json();

      if (data.status === 1) {
        const p = data.product;

        let netWeight = 'N/A';
        if (p.product_quantity && p.quantity) {
          const quantity = p.product_quantity;
          const unit = p.quantity.replace(/[0-9.]/g, '').toLowerCase();
          if (unit.includes('oz'))
            netWeight = `${Math.round(quantity * 28.35)} g`;
          else if (unit.includes('kg'))
            netWeight = `${Math.round(quantity * 1000)} g`;
          else if (unit.includes('g')) netWeight = `${Math.round(quantity)} g`;
          else if (unit.includes('ml'))
            netWeight = `${Math.round(quantity)} ml`;
          else netWeight = `${Math.round(quantity)} ${unit}`;
        }

        let price = '--';
        const rawPrice = p.price;
        if (typeof rawPrice === 'number') price = rawPrice.toFixed(2);
        else if (typeof rawPrice === 'string') {
          const digits = rawPrice.replace(/[^\d]/g, '');
          if (digits) price = digits;
        }

        const nutritionPreferences = {
          vegan: p.labels_tags?.includes('vegan') ?? false,
          vegetarian: p.labels_tags?.includes('vegetarian') ?? false,
          glutenFree: p.labels_tags?.includes('gluten-free') ?? false,
          lactoseFree: p.labels_tags?.includes('lactose-free') ?? false,
        };

        const getLevel = (val: string) => val as 'low' | 'medium' | 'high';

        const nutritionAdvisor = {
          fat: getLevel(p.nutrient_levels?.fat ?? 'low'),
          saturatedFat: getLevel(p.nutrient_levels?.['saturated-fat'] ?? 'low'),
          sugar: getLevel(p.nutrient_levels?.sugars ?? 'low'),
          salt: getLevel(p.nutrient_levels?.salt ?? 'low'),
          protein: getLevel(p.nutrient_levels?.proteins ?? 'medium'),
        };

        const nutritionPer100g = {
          energy: `${p.nutriments?.['energy-kcal_100g'] ?? 'N/A'} kcal`,
          protein: `${p.nutriments?.proteins_100g ?? 'N/A'} g`,
          saturatedFat: `${p.nutriments?.['saturated-fat_100g'] ?? 'N/A'} g`,
          fat: `${p.nutriments?.fat_100g ?? 'N/A'} g`,
          carbs: `${p.nutriments?.carbohydrates_100g ?? 'N/A'} g`,
          sugar: `${p.nutriments?.sugars_100g ?? 'N/A'} g`,
          fiber: `${p.nutriments?.fiber_100g ?? 'N/A'} g`,
          sodium: `${p.nutriments?.sodium_100g ?? 'N/A'} g`,
        };

        const product: Product = {
          id: p.code,
          name: p.product_name?.trim() || 'Unnamed Product',
          calories: nutritionPer100g.energy,
          image:
            p.image_front_url ||
            p.image_url ||
            p.selected_images?.front?.display?.en ||
            '',
          description:
            p.generic_name || p.categories || p.brands_tags?.[0] || '',
          nutrients: {
            fat: p.nutriments?.fat_100g || 'N/A',
            carbs: p.nutriments?.carbohydrates_100g || 'N/A',
            protein: p.nutriments?.proteins_100g || 'N/A',
          },
          ingredients: p.ingredients_text?.trim() || 'No ingredients listed',
          netWeight,
          price,
          time: new Date().toLocaleString(),
          nutritionPreferences,
          nutritionAdvisor,
          nutritionPer100g,
        };

        await getAIScore(product);
        setProduct(product);
        addProductToHistory(product);
      } else {
        const supplement = await fetchSupplementDetails(barcode);

        if (supplement) {
          await getAIScore(supplement);
          setProduct(supplement);
          addProductToHistory(supplement);
        } else {
          setError('Product not found in food or supplement database.');
        }
      }

      translateY.value = withSpring(0, { damping: 10 });
      shake.value = withSequence(
        withTiming(-5, { duration: 40 }),
        withTiming(5, { duration: 40 }),
        withTiming(0, { duration: 40 })
      );
    } catch (e) {
      console.error(e);
      setError('Failed to fetch product data.');
    } finally {
      setLoading(false);
      setTimeout(() => {
        scanningRef.current = false;
      }, 1500);
    }
  };

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (!scanningRef.current) {
      scanningRef.current = true;
      fetchProductDetails(data.trim());
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>

      <View style={styles.scannerContainer}>
        <View style={styles.cameraBox}>
          <View style={styles.alignTextContainer}>
            <Text style={styles.alignText}>
              Align the barcode within the frame
            </Text>
          </View>

          {permission?.granted && (
            <CameraView
              ref={cameraRef}
              style={styles.camera}
              facing="back"
              onBarcodeScanned={handleBarcodeScanned}
            />
          )}

          <View style={styles.barcodeFrameContainer} pointerEvents="none">
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
        </View>

        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={{ color: '#fff', marginTop: 8 }}>
              Loading product...
            </Text>
          </View>
        )}

        {error && (
          <View style={styles.errorBox}>
            <Text style={{ color: 'red', fontWeight: 'bold' }}>{error}</Text>
            <Button
              title="Try again"
              onPress={() => (scanningRef.current = false)}
            />
          </View>
        )}

        {!!product && <ScannedProductCard product={product} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  cancelButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  cancelText: { fontSize: 24, fontWeight: 'bold', color: '#555' },
  scannerContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
    position: 'relative',
  },

  cameraBox: {
    height: '85%',
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    bottom: 20,
  },
  alignTextContainer: {
    position: 'absolute',
    top: 10,
    width: '100%',
    alignItems: 'center',
    zIndex: 10,
  },
  alignText: {
    color: '#fff',
    fontWeight: 'bold',
    marginHorizontal: 30,
    marginVertical: 20,
    fontSize: 30,
    textAlign: 'center',
  },
  camera: { flex: 1 },
  barcodeFrameContainer: {
    position: 'absolute',
    top: '55%',
    left: '50%',
    width: 250,
    height: 200,
    marginLeft: -125,
    marginTop: -125,
  },
  corner: { position: 'absolute', width: 30, height: 30, borderColor: 'white' },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 8,
    borderLeftWidth: 4,
    borderTopLeftRadius: 20,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 8,
    borderRightWidth: 4,
    borderTopRightRadius: 20,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 8,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 20,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 8,
    borderRightWidth: 4,
    borderBottomRightRadius: 20,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorBox: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    elevation: 5,
    alignItems: 'center',
  },
});
