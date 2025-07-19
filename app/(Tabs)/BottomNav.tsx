import { usePathname, useRouter } from 'expo-router';
import { HomeIcon, UserIcon } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';
import IconButton from './IconButton';

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const goTo = (path: '/' | '/profile') => {
    if (pathname !== path) {
      router.push(path);
    }
  };

  const activeButton = pathname === '/profile' ? 'profile' : 'home';

  return (
    <View className="flex-row bg-black rounded-full px-2 py-2 items-center">
      <IconButton
        onPress={() => goTo('/')}
        active={activeButton === 'home'}
        Icon={HomeIcon}
        className="mr-1"
      />
      <IconButton
        onPress={() => goTo('/profile')}
        active={activeButton === 'profile'}
        Icon={UserIcon}
      />
    </View>
  );
}
