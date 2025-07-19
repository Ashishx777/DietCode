import axios from 'axios';

const NIH_API_KEY = 'LBwxLS6Cysapl4d2rW2wmBVz4BzHWh3cR8vAgkRQ';

// 🔧 Helper to safely get values with fallback
const getValue = (obj: any, keys: string[], fallback = 'N/A') => {
  for (const key of keys) {
    if (obj?.[key]) return obj[key];
  }
  return fallback;
};

// 🌐 Fetch from OpenFoodFacts (Main food source)
const fetchFromOpenFoodFacts = async (barcode: string) => {
  const res = await axios.get(
    `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
  );

  if (res.data.status !== 1) return null;
  const p = res.data.product;

  const preferences = {
    vegan: p.ingredients_analysis_tags?.includes('en:vegan') || false,
    vegetarian: p.ingredients_analysis_tags?.includes('en:vegetarian') || false,
    glutenFree: p.labels_tags?.includes('en:gluten-free') || false,
    lactoseFree: p.labels_tags?.includes('en:lactose-free') || false,
  };

  const advisor = {
    fat: p.nutrient_levels?.fat || 'unknown',
    saturatedFat: p.nutrient_levels?.['saturated-fat'] || 'unknown',
    sugar: p.nutrient_levels?.sugars || 'unknown',
    salt: p.nutrient_levels?.salt || 'unknown',
    protein: p.nutriments?.proteins_100g
      ? Number(p.nutriments.proteins_100g) > 10
        ? 'high'
        : Number(p.nutriments.proteins_100g) > 3
        ? 'medium'
        : 'low'
      : 'unknown',
  };

  const nutritionPer100g = {
    energy: getValue(p.nutriments, ['energy-kcal_100g', 'energy_100g']),
    protein: getValue(p.nutriments, ['proteins_100g']),
    saturatedFat: getValue(p.nutriments, ['saturated-fat_100g']),
    fat: getValue(p.nutriments, ['fat_100g']),
    carbs: getValue(p.nutriments, ['carbohydrates_100g']),
    sugar: getValue(p.nutriments, ['sugars_100g']),
    fiber: getValue(p.nutriments, ['fiber_100g']),
    sodium: getValue(p.nutriments, ['sodium_100g']),
  };

  return {
    source: 'food',
    id: p.code,
    name: p.product_name || 'Unnamed Product',
    image:
      p.image_front_url ||
      p.image_url ||
      p.selected_images?.front?.display?.en ||
      '',
    description: p.generic_name || p.categories || p.brands_tags?.[0] || '',
    calories: nutritionPer100g.energy || 'N/A',
    ingredients: p.ingredients_text || '',
    netWeight: p.product_quantity
      ? `${p.product_quantity}${p.quantity_unit || 'g'}`
      : '100g',
    price: '0',
    aiScore: p.nutriscore_score ?? 0,
    aiReason: `NutriScore: ${p.nutriscore_grade ?? 'N/A'}`,
    nutrients: {
      fat: p.nutriments?.fat_100g || 'N/A',
      carbs: p.nutriments?.carbohydrates_100g || 'N/A',
      protein: p.nutriments?.proteins_100g || 'N/A',
    },
    preferences,
    advisor,
    nutritionPer100g,
  };
};

// 💊 Fallback: NIH DSLD (Supplements)
const fetchFromDSLD = async (barcode: string) => {
  const res = await axios.get('https://api.dsld.nlm.nih.gov/api/search', {
    params: {
      term: barcode,
      api_key: NIH_API_KEY,
    },
  });

  const results = res.data?.Results;
  if (!results || results.length === 0) return null;

  const prod = results[0];

  const labelRes = await axios.get('https://api.dsld.nlm.nih.gov/api/label', {
    params: {
      id: prod.ProductID,
      api_key: NIH_API_KEY,
    },
  });

  let nutrients: Record<string, string> = {};
  if (labelRes.data?.NutrientLevels) {
    for (const item of labelRes.data.NutrientLevels) {
      nutrients[
        item.NutrientName
      ] = `${item.NutrientAmount} ${item.NutrientUnit}`;
    }
  }

  return {
    source: 'supplement',
    id: barcode,
    name: prod.BrandName || 'Unnamed Supplement',
    image: '', // DSLD doesn't provide images
    description: prod.ProductType || 'Supplement',
    calories: 'N/A',
    ingredients: prod.IngredientList || 'No ingredient data',
    netWeight: 'N/A',
    price: '0',
    aiScore: 50,
    aiReason: 'Estimated average for supplement',
    nutrients,
    preferences: {},
    advisor: {},
    nutritionPer100g: {
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
};

// 🚀 Final Exported Method: unified fetch
export const fetchProductByBarcode = async (barcode: string) => {
  try {
    const food = await fetchFromOpenFoodFacts(barcode);
    if (food) return food;

    const supplement = await fetchFromDSLD(barcode);
    if (supplement) return supplement;

    throw new Error('Product not found in either database.');
  } catch (err) {
    if (err instanceof Error) {
      console.error('Lookup failed:', err.message);
    } else {
      console.error('Unknown error:', err);
    }
    return null;
  }
};
