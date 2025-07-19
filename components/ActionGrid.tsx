import { router } from 'expo-router';
import {
  Camera,
  Globe,
  LayoutList,
  ScanBarcodeIcon,
} from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';
import GridButton from './GridButton'; // Adjust path

type Props = {
  onScanPress?: () => void;
};

export default function ActionGrid({ onScanPress }: Props) {
  return (
    <View className="px-2 justify-center">
      <View className="flex-row flex-wrap mx-auto items-center justify-center">
        <GridButton
          title="Scan"
          Icon={ScanBarcodeIcon}
          backgroundColor="#D0F2FF"
          onPress={() => router.push('/scan')}
        />
        <GridButton
          title="Capture"
          Icon={Camera}
          backgroundColor="#f8f9f8"
          style={{ borderWidth: 1, borderColor: '#ccc' }}
          onPress={() => router.push('/capture')}
        />
        <GridButton
          title="List"
          Icon={LayoutList}
          backgroundColor="#DCFDD5"
          onPress={() => router.push('/list')}
        />
        <GridButton
          title="Ask AI"
          Icon={Globe}
          backgroundColor="#fff6cc"
          onPress={() => router.push('/askai')}
        />
      </View>
    </View>
  );
}
