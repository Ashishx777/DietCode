import { ProductContext } from '@/components/ProductContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ArrowLeft, MessageCircleWarning, Share2 } from 'lucide-react-native';
import { MotiView } from 'moti';
import { useContext, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Product } from '../types/Product';

const { width } = Dimensions.get('window');

export default function ProductDetailsUI({
  product,
  onRefresh,
  refreshing,
}: {
  product: Product;
  onRefresh?: () => void;
  refreshing?: boolean;
}) {
  const { toggleFavorite, isFavorite } = useContext(ProductContext);

  const scale = useSharedValue(1);
  const [bottomHeight, setBottomHeight] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [showIngredientsModal, setShowIngredientsModal] = useState(false);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const formatIngredients = (input?: string) => {
    if (!input) return 'No ingredients listed.';
    return input
      .split(/[,•·]/g)
      .map((item) => `• ${item.trim()}`)
      .join('\n');
  };

  const showTopFade = scrollY > 10;
  const showBottomFade = scrollY < contentHeight - containerHeight - 10;

  const scoreColor =
    (product?.aiScore ?? 0) >= 80
      ? '#16a34a'
      : (product?.aiScore ?? 0) >= 50
      ? '#ca8a04'
      : '#dc2626';

  const nutritionKeys = [
    'energy',
    'protein',
    'saturatedFat',
    'fat',
    'carbs',
    'sugar',
    'fiber',
    'sodium',
  ] as const;

  type NutritionKey = (typeof nutritionKeys)[number];

  const advisorItems = [
    { label: 'Fat', key: 'fat' },
    { label: 'Saturated Fat', key: 'saturatedFat' },
    { label: 'Sugar', key: 'sugar' },
    { label: 'Salt', key: 'salt' },
    { label: 'Protein', key: 'protein' },
  ] as const;

  type AdvisorKey = (typeof advisorItems)[number]['key'];

  const preferenceItems = [
    { label: 'Vegan', key: 'vegan' },
    { label: 'Vegetarian', key: 'vegetarian' },
    { label: 'Gluten-Free', key: 'glutenFree' },
    { label: 'Lactose Free', key: 'lactoseFree' },
  ] as const;

  type PreferenceKey = (typeof preferenceItems)[number]['key'];

  return (
    <SafeAreaView style={styles.safeArea}>
      {showIngredientsModal && (
        <View style={styles.floatingBackdrop}>
          <MotiView
            from={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: 'spring',
              damping: 10,
              stiffness: 150,
              mass: 0.8,
            }}
            style={styles.floatingCard}
          >
            <Text style={styles.floatingTitle}>Ingredients</Text>

            <View style={styles.scrollWrapper}>
              <ScrollView
                style={styles.floatingScroll}
                contentContainerStyle={{ paddingBottom: 20 }}
                onScroll={(e) => setScrollY(e.nativeEvent.contentOffset.y)}
                onContentSizeChange={(w, h) => setContentHeight(h)}
                onLayout={(e) =>
                  setContainerHeight(e.nativeEvent.layout.height)
                }
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
              >
                <Text style={styles.floatingText}>
                  {formatIngredients(product.ingredients)}
                </Text>
              </ScrollView>

              {showTopFade && (
                <LinearGradient
                  colors={['#059669', 'transparent']}
                  style={styles.fadeTop}
                  pointerEvents="none"
                />
              )}
              {showBottomFade && (
                <LinearGradient
                  colors={['transparent', '#059669']}
                  style={styles.fadeBottom}
                  pointerEvents="none"
                />
              )}
            </View>

            <TouchableOpacity
              onPress={() => setShowIngredientsModal(false)}
              style={styles.floatingCloseButton}
            >
              <Text style={styles.floatingCloseText}>Close</Text>
            </TouchableOpacity>
          </MotiView>
        </View>
      )}

      <View style={styles.headerRow}>
        <Pressable
          onPress={() => router.back()}
          onPressIn={() => (scale.value = withTiming(0.95, { duration: 100 }))}
          onPressOut={() => (scale.value = withTiming(1, { duration: 100 }))}
          className="w-10 h-10 justify-center items-center"
        >
          <Animated.View style={animatedStyle}>
            <ArrowLeft size={28} color="#333" />
          </Animated.View>
        </Pressable>

        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Share2 size={24} color="#0f172a" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => toggleFavorite(product)}
          >
            <Ionicons
              name={isFavorite(product.id) ? 'heart' : 'heart-outline'}
              size={24}
              color="#0f172a"
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={{
          flex: 1,
          marginBottom: 20,
          borderRadius: 18,
          marginHorizontal: 20,
        }}
        contentContainerStyle={{
          paddingBottom: bottomHeight + 300,
          flexGrow: 1,
          marginHorizontal: 0,
        }}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={!refreshing}
              onRefresh={onRefresh}
              colors={['#059669']}
              tintColor="#059669"
              title="Refreshing..."
            />
          ) : undefined
        }
        onScroll={(e) => setScrollY(e.nativeEvent.contentOffset.y)}
        onContentSizeChange={(w, h) => setContentHeight(h)}
        onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* Product Image */}
        <Image source={{ uri: product.image }} style={styles.image} />

        {/* Product Card */}
        <View style={styles.card}>
          <Text style={styles.productName}>{product.name}</Text>
          {product.description && (
            <Text style={styles.subText}>{product.description}</Text>
          )}
        </View>

        {/* Health Score + Weight + Price */}
        <View style={styles.healthContainer}>
          <View style={styles.scoreGroup}>
            <View style={[styles.scoreCircle, { backgroundColor: scoreColor }]}>
              <Text style={styles.scoreText}>{product.aiScore}</Text>
            </View>
            <View style={styles.scoreLabelGroup}>
              <Text style={styles.scoreLabel}>AI Health</Text>
              <Text style={styles.scoreLabel}>Score</Text>
            </View>
          </View>

          <View style={styles.verticalDivider} />

          <View style={styles.detailBox}>
            <Text style={styles.detailBig}>{product.netWeight}</Text>
            <Text style={styles.detailSmall}>Serving</Text>
          </View>

          <View style={styles.verticalDivider} />

          <View style={styles.detailBox}>
            <Text style={styles.detailBig}>₹{product.price || '--'}</Text>
            <Text style={styles.detailSmall}>Price</Text>
          </View>
        </View>

        {/* Ingredients */}
        <View style={styles.roundedWrapper}>
          <Pressable
            android_ripple={{ color: 'rgba(0,0,0,0.1)' }}
            onPress={() => setShowIngredientsModal(true)}
            style={styles.ingredientsBox}
          >
            <Text style={styles.bold}>Ingredients:</Text>
            <Text numberOfLines={5} style={styles.ingredientText}>
              {formatIngredients(product.ingredients)}
            </Text>
            <Text style={[styles.expandHint, { alignSelf: 'flex-end' }]}>
              Tap to view full list
            </Text>
          </Pressable>
        </View>

        {/* Nutrients */}
        <Text style={styles.sectionTitle}>Nutrient Breakdown</Text>
        <View style={styles.nutrientsRow}>
          <View style={[styles.nutrientCard, { backgroundColor: '#d1f4e3' }]}>
            <Text style={styles.nutrientValue}>
              {product.nutrients?.fat ?? 'N/A'} g
            </Text>
            <Text style={styles.nutrientLabel}>Fat</Text>
          </View>
          <View style={[styles.nutrientCard, { backgroundColor: '#dbeeff' }]}>
            <Text style={styles.nutrientValue}>
              {product.nutrients?.carbs ?? 'N/A'} g
            </Text>
            <Text style={styles.nutrientLabel}>Carbs</Text>
          </View>
          <View style={[styles.nutrientCard, { backgroundColor: '#fef3c7' }]}>
            <Text style={styles.nutrientValue}>
              {product.nutrients?.protein ?? 'N/A'} g
            </Text>
            <Text style={styles.nutrientLabel}>Protein</Text>
          </View>
        </View>
        {/* Preferences */}
        <Text style={styles.sectionTitle}>Nutrition Preferences</Text>
        <View style={styles.preferenceGrid}>
          {preferenceItems.map((item) => {
            const status =
              product.nutritionPreferences?.[item.key as PreferenceKey];
            const icon =
              status === true ? '✅' : status === false ? '❌' : '❓';
            const text =
              status === true ? 'Yes' : status === false ? 'No' : 'Uncertain';

            return (
              <View key={item.key} style={styles.preferenceItem}>
                <Text style={styles.preferenceLabel}>{item.label}</Text>
                <Text style={styles.preferenceStatus}>
                  {icon} {text}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Advisor */}
        <Text style={styles.sectionTitle}>Nutrition Advisor</Text>
        <View style={styles.advisorBox}>
          {advisorItems.map((item) => {
            const level = product.nutritionAdvisor?.[item.key as AdvisorKey];
            const color =
              level === 'high'
                ? '#dc2626'
                : level === 'medium'
                ? '#eab308'
                : '#16a34a';

            return (
              <View key={item.key} style={styles.advisorItem}>
                <Text style={styles.advisorLabel}>{item.label}</Text>
                <Text style={{ fontWeight: '600', color }}>
                  {level ? level[0].toUpperCase() + level.slice(1) : 'N/A'}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Nutrition Values */}
        <Text style={styles.sectionTitle}>Nutrition Value in 100g / 100ml</Text>

        <View style={styles.nutritionTable}>
          {nutritionKeys.map((key: NutritionKey) => (
            <View key={key} style={styles.nutritionRow}>
              <Text style={styles.nutritionKey}>
                {key.replace(/^./, (c) => c.toUpperCase())}{' '}
              </Text>
              <Text style={styles.nutritionValue}>
                {product.nutritionPer100g?.[key] ?? 'N/A'}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
      {/* Top Fade */}
      {showTopFade && (
        <LinearGradient
          colors={['#fff', 'transparent']}
          style={styles.fadeTop}
          pointerEvents="none"
        />
      )}

      {/* Bottom Fade */}
      {showBottomFade && (
        <LinearGradient
          colors={['transparent', '#fff']}
          style={styles.fadeBottom}
          pointerEvents="none"
        />
      )}

      {/* Fixed Action Buttons */}
      <View
        style={styles.fixedBottomRow}
        onLayout={(event) => {
          const { height } = event.nativeEvent.layout;
          setBottomHeight(height);
        }}
      >
        <TouchableOpacity style={styles.askButton}>
          <Ionicons name="chatbubbles-outline" size={24} color="#fff" />
          <Text style={styles.askButtonText}>Ask AI</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.reportbutton}
          onPress={() => {
            alert('Report submitted. Thank you!');
          }}
        >
          <MessageCircleWarning size={28} color="#0f172a" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  notFoundText: { color: '#aaa', fontSize: 16 },
  image: {
    width: width,
    height: '20%',
    resizeMode: 'contain',
    marginTop: 10,
  },
  floatingBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },

  floatingCard: {
    width: '90%',
    height: '73%',
    backgroundColor: '#059669',
    borderRadius: 30,
    padding: 24,
    justifyContent: 'flex-start',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  scrollWrapper: {
    flex: 1,
    width: '100%',
    position: 'relative',
  },
  floatingTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#f0fdf4',
    marginBottom: 20,
    textAlign: 'center',
  },

  floatingScroll: {
    width: '100%',
    flexGrow: 0,
  },
  floatingText: {
    fontSize: 18,
    color: '#f9fafb',
    lineHeight: 24,
    paddingBottom: 10,
    paddingLeft: 10,
  },

  floatingCloseButton: {
    backgroundColor: '#f0fdf4',
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 20,
    marginTop: 16,
  },

  floatingCloseText: {
    color: '#0f172a',
    fontWeight: 'bold',
    fontSize: 16,
  },

  card: {
    backgroundColor: 'transparent',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  productName: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 10,
  },
  subText: {
    color: '#64748b',
    fontSize: 14,
    marginTop: 2,
    textAlign: 'center',
  },

  healthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 22,
    borderRadius: 28,
    marginTop: 1,
    justifyContent: 'space-between',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#cbd5e1',
  },
  scoreGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 110,
    gap: 5,
    marginRight: 28,
  },
  scoreCircle: {
    width: 48,
    height: 48,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  preferenceGrid: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  preferenceItem: {
    width: '48%',
    backgroundColor: '#f3f4f6',
    padding: 14,
    borderRadius: 18,
  },
  preferenceLabel: {
    fontSize: 14,
    color: '#334155',
    marginBottom: 4,
    fontWeight: '500',
  },
  preferenceStatus: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },

  advisorBox: {
    marginTop: 10,
    backgroundColor: '#f8fafc',
    borderRadius: 18,
    padding: 16,
    gap: 12,
  },
  advisorItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  advisorLabel: {
    fontSize: 15,
    color: '#1e293b',
  },

  nutritionTable: {
    marginTop: 10,
    backgroundColor: '#f1f5f9',
    borderRadius: 18,
    padding: 16,
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#cbd5e1',
  },
  nutritionKey: {
    fontSize: 16,
    color: '#334155',
  },
  nutritionValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },

  scoreLabelGroup: {
    marginLeft: 10,
    marginRight: 10,
  },
  scoreLabel: {
    fontSize: 18,
    color: '#059669',
    lineHeight: 18,
    fontWeight: '600',
  },
  verticalDivider: {
    width: 1,
    height: 44,
    backgroundColor: '#cbd5e1',
    marginHorizontal: 6,
  },
  detailBox: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
  },
  detailBig: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  detailSmall: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },

  ingredientsBox: {
    backgroundColor: '#059669',
    borderRadius: 28,
    padding: 20,
  },

  roundedWrapper: {
    backgroundColor: '#059669',
    borderRadius: 28,
    overflow: 'hidden',
    marginTop: 20,
  },

  expandHint: {
    marginTop: 15,
    fontSize: 12,
    color: '#f0fdf4',
    fontStyle: 'italic',
    paddingRight: 10,
  },

  popupOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
    zIndex: 1000,
  },

  popupCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '70%',
  },
  popupTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1e293b',
    textAlign: 'center',
  },

  popupText: {
    fontSize: 16,
    color: '#111827',
    lineHeight: 24,
    paddingBottom: 20,
  },

  popupCloseButton: {
    marginTop: 20,
    alignSelf: 'center',
    backgroundColor: '#0f172a',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 30,
  },
  popupCloseText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  collapsedContainer: {
    position: 'relative',
    maxHeight: 100,
    overflow: 'hidden',
  },

  showMoreButton: {
    position: 'absolute',
    bottom: 6,
    right: 10,
  },
  showMoreText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  modalBackdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  modalCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    width: '90%',
    height: '70%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'center',
  },
  modalIngredients: {
    fontSize: 16,
    color: '#1e293b',
    lineHeight: 24,
  },
  modalClose: {
    marginTop: 12,
    backgroundColor: '#0f172a',
    paddingVertical: 10,
    borderRadius: 10,
  },
  modalCloseText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },

  bold: { fontSize: 20, marginBottom: 4, color: 'white' },
  ingredientText: { fontSize: 14, color: '#f9f9f9' },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginTop: 20,
    color: '#1e293b',
  },
  nutrientsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  nutrientCard: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  nutrientValue: { fontWeight: 'bold', fontSize: 18, color: '#1e293b' },
  nutrientLabel: { fontSize: 14, color: '#64748b', marginTop: 2 },

  fixedBottomRow: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 100,
    gap: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 5,
  },
  favButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#cbd5e1',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 30,
  },
  favButtonText: {
    marginLeft: 6,
    color: '#0f172a',
    fontWeight: '600',
  },
  askButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 95,
    borderRadius: 28,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  askButtonText: {
    marginLeft: 6,
    color: '#fff',
    fontWeight: '600',
    fontSize: 20,
  },
  reportbutton: {
    padding: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#cbd5e1',
    borderRadius: 28,
    backgroundColor: '#f3f3f3',
  },
  iconButton: {
    padding: 10,
  },
  fadeTop: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    height: 20,
    zIndex: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },

  fadeBottom: {
    position: 'absolute',
    bottom: 19,
    left: 0,
    right: 0,
    height: 30,
    zIndex: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
});
