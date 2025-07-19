import { ProfileContext } from '@/components/auth/ProfileContext';
import { PROFILE_PIC_MAP } from '@/constants/profilePicMap'; // ✅ Import map
import { useRouter } from 'expo-router';
import { LayoutGrid } from 'lucide-react-native';
import React, { useContext } from 'react';
import { Image, Pressable, View } from 'react-native';
import RoundIconButton from './RoundIconButton';

export default function TopIcons() {
  const router = useRouter();
  const { profile } = useContext(ProfileContext);

  const imageSource = profile?.profilePic
    ? PROFILE_PIC_MAP[profile.profilePic] ??
      require('@/assets/icons/profile 9-bw.png')
    : require('@/assets/icons/profile 9-bw.png');

  return (
    <View className="flex-row justify-between w-full px-4 z-10 items-center mt-2">
      {/* Profile Avatar */}
      <Pressable onPress={() => router.push('/profile')}>
        <Image
          source={imageSource}
          style={{
            width: 68,
            height: 68,
            borderRadius: 9999,
            backgroundColor: '#eee',
          }}
        />
      </Pressable>

      {/* Help Button */}
      <RoundIconButton
        Icon={LayoutGrid}
        onPress={() => router.push('/help' as any)}
        backgroundColor="#fff"
        iconColor="#333"
        size={34}
      />
    </View>
  );
}
