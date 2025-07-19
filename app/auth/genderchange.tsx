import { Profile, ProfileContext } from '@/components/auth/ProfileContext';
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

type GenderType = 'male' | 'female' | '';

export default function GenderChangeScreen() {
  const { profile, updateProfile } = useContext(ProfileContext);
  const router = useRouter();

  const initialGender =
    profile?.gender === 'male' || profile?.gender === 'female'
      ? profile.gender
      : '';
  const [selectedGender, setSelectedGender] =
    useState<GenderType>(initialGender);

  const handleSave = () => {
    if (!selectedGender || !profile) return;

    const updatedProfile: Profile = {
      ...profile,
      gender: selectedGender,
      profilePic:
        profile.profilePic ?? require('@/assets/icons/profile 9-bw.png'),
    };

    updateProfile(updatedProfile);
    router.back();
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
              onPress={() => setSelectedGender(gender as GenderType)}
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
        onPress={handleSave}
        style={[styles.nextButton, !selectedGender && styles.buttonDisabled]}
        disabled={!selectedGender}
      >
        <Text style={styles.nextText}>Update</Text>
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
    marginTop: 30,
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
    flexDirection: 'row',
    backgroundColor: '#111',
    paddingVertical: 20,
    paddingHorizontal: '30%',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 24,
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
