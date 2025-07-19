import { AuthContext } from '@/components/auth/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import React, { useContext, useState } from 'react';
import {
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function GenderSelectScreen() {
  const [selectedGender, setSelectedGender] = useState<
    'male' | 'female' | null
  >(null);
  const router = useRouter();
  const { setUserData } = useContext(AuthContext);

  const handleNext = async () => {
    if (!selectedGender) return;

    setUserData((prev: any) => {
      const updated = { ...(prev || {}), gender: selectedGender };

      AsyncStorage.setItem('userData', JSON.stringify(updated)).catch((e) =>
        console.error('Failed to save userData', e)
      );

      return updated;
    });

    router.push('/auth/signup-email');
  };

  const SkipForward = () => {
    router.replace('/auth/welcome');
  };

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={26} color="#333" />
        </Pressable>
        <Pressable onPress={SkipForward} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip Here</Text>
        </Pressable>
      </View>
      <Text style={styles.titleShort}>Select Your</Text>
      <Text style={styles.title}>Gender</Text>

      <View style={styles.genderColumn}>
        {[
          {
            gender: 'male',
            colorImage: require('@/assets/icons/profile 9.png'),
            grayImage: require('@/assets/icons/profile 9-bw2.png'),
          },
          {
            gender: 'female',
            colorImage: require('@/assets/icons/profile 6.png'),
            grayImage: require('@/assets/icons/profile 6-bw2.png'),
          },
        ].map(({ gender, colorImage, grayImage }) => {
          const isSelected = selectedGender === gender;

          return (
            <Pressable
              key={gender}
              style={styles.genderOption}
              onPress={() => setSelectedGender(gender as 'male' | 'female')}
            >
              <View style={styles.imageWrapper}>
                <Image
                  source={isSelected ? colorImage : grayImage}
                  style={styles.image}
                />
              </View>
              <Text style={[styles.label, isSelected && styles.labelSelected]}>
                {gender.charAt(0).toUpperCase() + gender.slice(1)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        onPress={handleNext}
        style={[styles.nextButton, !selectedGender && styles.buttonDisabled]}
        disabled={!selectedGender}
      >
        <Text style={styles.nextText}>Next</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 28,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  titleShort: {
    fontSize: 38,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 60,
  },
  title: {
    fontSize: 38,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 30,
  },
  genderColumn: {
    alignItems: 'center',
    gap: 40,
    marginBottom: 50,
  },
  genderOption: {
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    top: 30,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  skipButton: {
    alignItems: 'center',
    padding: 20,
    marginBottom: 20,
  },
  skipText: {
    fontSize: 16,
    color: '#888',
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
    width: 180,
    height: 180,
    borderRadius: 99999,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#111',
    marginBottom: 12,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  label: {
    fontSize: 18,
    color: '#666',
  },
  labelSelected: {
    fontWeight: '600',
    color: '#000',
  },
  nextButton: {
    backgroundColor: '#222',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 40,
  },
  nextText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
});
