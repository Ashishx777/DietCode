// types/Product.ts
export interface Product {
  id: string;
  name: string;
  image: string;
  calories?: number | string;
  time: string;
  description?: string;
  ingredients?: string;
  netWeight: string;
  price: string;
  aiScore?: number;
  aiReason?: string;
  nutrients?: {
    fat?: string;
    carbs?: string;
    protein?: string;
  };
  nutritionPreferences?: {
    vegan?: boolean;
    vegetarian?: boolean;
    glutenFree?: boolean;
    lactoseFree?: boolean;
  };
  nutritionAdvisor?: {
    fat?: 'low' | 'medium' | 'high';
    saturatedFat?: 'low' | 'medium' | 'high';
    sugar?: 'low' | 'medium' | 'high';
    salt?: 'low' | 'medium' | 'high';
    protein?: 'low' | 'medium' | 'high';
  };
  nutritionPer100g?: {
    energy: string;
    protein: string;
    saturatedFat: string;
    fat: string;
    carbs: string;
    sugar: string;
    fiber: string;
    sodium: string;
  };
  [key: string]: any;
}
