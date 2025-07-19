import { AuthContext } from '@/components/auth/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as NavigationBar from 'expo-navigation-bar';
import { Link } from 'expo-router';
import { ChevronDown, Search } from 'lucide-react-native';
import React, { useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Modal,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  Country,
  FlagType,
  getAllCountries,
} from 'react-native-country-picker-modal';
import { SafeAreaView } from 'react-native-safe-area-context';

const { height } = Dimensions.get('window');
const DEFAULT_COUNTRY_CODE = 'US';

export default function AuthStartScreen() {
  const { userData, setUserData } = useContext(AuthContext);

  const [countryPickerVisible, setCountryPickerVisible] = useState(false);
  const [country, setCountry] = useState<Country | null>(null);
  const [allCountries, setAllCountries] = useState<Country[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync('#ffffff');
    NavigationBar.setButtonStyleAsync('dark');
  }, []);

  useEffect(() => {
    const loadCountries = async () => {
      const countries = await getAllCountries(FlagType.EMOJI);
      setAllCountries(countries);
      setFilteredCountries(countries);

      if (userData?.countryCode) {
        const restored = countries.find((c) => c.cca2 === userData.countryCode);
        if (restored) {
          setCountry(restored);
          return;
        }
      }

      const saved = await AsyncStorage.getItem('userCountry');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const restored = countries.find((c) => c.cca2 === parsed.code);
          if (restored) {
            setCountry(restored);
            return;
          }
        } catch (e) {
          console.error('Failed to parse saved country', e);
        }
      }

      const defaultC = countries.find((c) => c.cca2 === DEFAULT_COUNTRY_CODE);
      if (defaultC) setCountry(defaultC);
    };
    loadCountries();
  }, [userData]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCountries(allCountries);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredCountries(
        allCountries.filter((c) => {
          const name =
            typeof c.name === 'string' ? c.name : c.name?.common ?? '';
          return name.toLowerCase().includes(q);
        })
      );
    }
  }, [searchQuery, allCountries]);

  const flagUri = (code?: string) => {
    return code ? `https://flagcdn.com/w320/${code.toLowerCase()}.png` : '';
  };

  const onSelectCountry = async (item: Country) => {
    const countryName =
      typeof item.name === 'string' ? item.name : item.name?.common ?? '';
    setCountry(item);
    setCountryPickerVisible(false);
    setUserData({
      ...userData,
      country: countryName,
      countryCode: item.cca2,
    });
    await AsyncStorage.setItem(
      'userCountry',
      JSON.stringify({
        name: countryName,
        code: item.cca2,
      })
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <View style={styles.heroContainer}>
        <Image
          source={require('@/assets/images/auth-hero-5.png')}
          style={styles.heroImage}
          resizeMode="contain"
        />
      </View>

      <SafeAreaView style={styles.container}>
        <View style={styles.contentWrapper}>
          <View>
            <Text style={styles.heading}>Your Pocket Nutrition Coach</Text>
            <Text style={styles.subheading}>Scan, learn, and eat smarter.</Text>

            <Pressable
              style={styles.countrySelector}
              onPress={() => setCountryPickerVisible(true)}
              disabled={!country}
            >
              {!country ? (
                <ActivityIndicator size="small" color="#ff853c" />
              ) : (
                <View style={styles.countryInfo}>
                  <Image
                    source={{ uri: flagUri(country.cca2) }}
                    style={styles.flagImage}
                  />
                  <View style={styles.countryTextContainer}>
                    <Text style={styles.countryLabel}>I live in:</Text>
                    <Text style={styles.countryName}>
                      {typeof country.name === 'string'
                        ? country.name
                        : country.name?.common ?? ''}
                    </Text>
                  </View>
                </View>
              )}
              <ChevronDown
                size={20}
                color="#6b7280"
                style={styles.chevronIcon}
              />
            </Pressable>
          </View>

          <View style={styles.buttonRow}>
            <Link href="/auth/signin" asChild>
              <Pressable style={styles.signInButton}>
                <Text style={styles.signInText}>Sign In</Text>
              </Pressable>
            </Link>
            {country ? (
              <Link href="/auth/signup-name" asChild>
                <Pressable style={styles.continueButton}>
                  <View style={styles.continueContent}>
                    <Text style={styles.continueText}>Continue</Text>
                    <Text style={styles.arrow}>➔</Text>
                  </View>
                </Pressable>
              </Link>
            ) : (
              <Pressable
                style={[styles.continueButton, { backgroundColor: '#bbb' }]}
                disabled
              >
                <View style={styles.continueContent}>
                  <Text style={styles.continueText}>Continue</Text>
                  <Text style={styles.arrow}>➔</Text>
                </View>
              </Pressable>
            )}
          </View>
        </View>

        <Modal
          animationType="slide"
          visible={countryPickerVisible}
          onRequestClose={() => setCountryPickerVisible(false)}
          transparent={true}
        >
          <View style={styles.modalOverlay}>
            <SafeAreaView style={styles.pickerContainer}>
              <View style={styles.pickerHeader}>
                <View style={styles.pickerTitleGroup}>
                  <Text style={styles.pickerTitleTop}>Please Select</Text>
                  <Text style={styles.pickerTitleBottom}>your country</Text>
                </View>
                <Pressable onPress={() => setCountryPickerVisible(false)}>
                  <Text style={styles.pickerCloseText}>✕</Text>
                </Pressable>
              </View>

              <View style={styles.searchBarContainer}>
                <Search size={18} color="#888" style={{ marginRight: 8 }} />
                <TextInput
                  placeholder="Search country..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  style={styles.searchInput}
                />
              </View>

              <FlatList
                data={filteredCountries}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.cca2}
                renderItem={({ item }) => (
                  <Pressable
                    style={styles.countryItem}
                    onPress={() => onSelectCountry(item)}
                  >
                    <View style={styles.countryItemLeft}>
                      <Image
                        source={{ uri: flagUri(item.cca2) }}
                        style={styles.flagImage}
                      />
                      <Text style={styles.countryItemText}>
                        {typeof item.name === 'string'
                          ? item.name
                          : item.name?.common ?? ''}
                      </Text>
                    </View>
                  </Pressable>
                )}
              />
            </SafeAreaView>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: 28,
    paddingBottom: 30,
    justifyContent: 'space-between',
  },
  heading: {
    fontSize: 42,
    fontWeight: '500',
    color: '#111',
    marginBottom: 8,
    textAlign: 'center',
    marginTop: -20,
  },
  subheading: {
    fontSize: 20,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  heroContainer: {
    width: '100%',
    height: height * 0.55,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  countrySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f3f4f6',
    borderRadius: 24,
    padding: 12,
    alignItems: 'center',
    minHeight: 80,
  },
  countryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  flagImage: {
    width: 44,
    height: 44,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: 'white',
    overflow: 'hidden',
  },
  countryTextContainer: {
    marginLeft: 12,
  },
  countryLabel: {
    fontSize: 15,
    color: '#6b7280',
  },
  countryName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  chevronIcon: {
    marginTop: 2,
    paddingHorizontal: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
  },
  signInButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  signInText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  continueButton: {
    backgroundColor: '#222',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 28,
    alignItems: 'center',
  },
  continueText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  continueContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  arrow: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    marginHorizontal: 10,
    paddingHorizontal: 38,
    paddingTop: 34,
    paddingBottom: 15,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  pickerTitleGroup: {
    marginBottom: 2,
    marginLeft: 8,
  },
  pickerTitleTop: {
    fontSize: 30,
    fontWeight: '600',
    color: '#333',
    marginBottom: -6,
  },
  pickerTitleBottom: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#333',
  },

  pickerCloseText: {
    fontSize: 28,
    color: '#888',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f3f3',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginVertical: 12,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 10,
  },
  countryItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryItemText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  shortLine: {
    height: 1,
    backgroundColor: '#ccc',
    width: 50,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
});
