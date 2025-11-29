import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { Product } from '../types/Product';

interface HistoryContextType {
  history: Product[];
  favorites: Product[];
  addProductToHistory: (product: Product) => void;
  toggleFavorite: (product: Product) => void;
  isFavorite: (id: string) => boolean;
  clearHistory: () => void;
  getProductById: (id: string) => Product | undefined;
}

export const ProductContext = createContext<HistoryContextType>({
  history: [],
  favorites: [],
  addProductToHistory: () => {},
  toggleFavorite: () => {},
  isFavorite: () => false,
  clearHistory: () => {},
  getProductById: function (id: string): Product | undefined {
    throw new Error('Function not implemented.');
  },
});

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [history, setHistory] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<Product[]>([]);

  // Load data from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      try {
        const savedHistory = await AsyncStorage.getItem('history');
        if (savedHistory) setHistory(JSON.parse(savedHistory));

        const savedFavorites = await AsyncStorage.getItem('favorites');
        if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
      } catch (e) {
        console.warn('Failed to load data from storage', e);
      }
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('history', JSON.stringify(history)).catch((e) =>
      console.warn('Failed to save history', e)
    );
  }, [history]);

  useEffect(() => {
    AsyncStorage.setItem('favorites', JSON.stringify(favorites)).catch((e) =>
      console.warn('Failed to save favorites', e)
    );
  }, [favorites]);

  // Create a Set for O(1) favorite lookups
  const favoriteIds = useMemo(
    () => new Set(favorites.map((p) => p.id)),
    [favorites]
  );

  const addProductToHistory = useCallback((product: Product) => {
    setHistory((prev) => {
      const index = prev.findIndex((p) => p.id === product.id);
      if (index !== -1) {
        const updated = [...prev];
        updated[index] = { ...product, time: new Date().toLocaleString() };
        return updated;
      }
      return [{ ...product, time: new Date().toLocaleString() }, ...prev];
    });
  }, []);

  const toggleFavorite = useCallback((product: Product) => {
    setFavorites((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      return [{ ...product, time: new Date().toLocaleString() }, ...prev];
    });
  }, []);

  const isFavorite = useCallback(
    (id: string) => {
      return favoriteIds.has(id);
    },
    [favoriteIds]
  );

  const clearHistory = useCallback(() => setHistory([]), []);

  const getProductById = useCallback(
    (id: string): Product | undefined => {
      return (
        history.find((p) => p.id === id) || favorites.find((p) => p.id === id)
      );
    },
    [history, favorites]
  );

  const contextValue = useMemo(
    () => ({
      history,
      favorites,
      addProductToHistory,
      toggleFavorite,
      isFavorite,
      clearHistory,
      getProductById,
    }),
    [
      history,
      favorites,
      addProductToHistory,
      toggleFavorite,
      isFavorite,
      clearHistory,
      getProductById,
    ]
  );

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
};
export { Product };
