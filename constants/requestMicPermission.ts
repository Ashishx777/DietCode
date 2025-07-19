import { PermissionsAndroid, Platform } from 'react-native';

export async function requestMicPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') return true;

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: 'Microphone Permission',
        message: 'This app needs access to your microphone for voice search.',
        buttonPositive: 'Allow',
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn('Mic permission error', err);
    return false;
  }
}
