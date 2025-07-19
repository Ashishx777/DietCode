import { ProfileContext } from '@/components/auth/ProfileContext';
import { PROFILE_PIC_MAP, ProfilePicKey } from '@/constants/profilePicMap';
import React, { useContext } from 'react';
import { Image, Pressable, ScrollView, StyleSheet } from 'react-native';

export default function ProfileIconPicker() {
  const { profile, updateProfile } = useContext(ProfileContext);

  const handleSelect = (key: ProfilePicKey) => {
    if (!profile) return;

    updateProfile({
      ...profile,
      profilePic: key,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {Object.keys(PROFILE_PIC_MAP).map((key) => (
        <Pressable key={key} onPress={() => handleSelect(key as ProfilePicKey)}>
          <Image
            source={PROFILE_PIC_MAP[key as ProfilePicKey]}
            style={styles.icon}
          />
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
    padding: 20,
  },
  icon: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
});
