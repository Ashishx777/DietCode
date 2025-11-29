import { ProductContext } from '@/components/ProductContext';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRouter } from 'expo-router';
import { useContext, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSharedValue, withSpring } from 'react-native-reanimated';
import ScannedProductCard from '../components/ScannedProductCard';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export default function FoodCapture() {
  const router = useRouter();
  const navigation = useNavigation();
  const { addProductToHistory } = useContext(ProductContext);

  const [permission, requestPermission] = useCameraPermissions();
  const [galleryPermission, requestGalleryPermission] =
    ImagePicker.useMediaLibraryPermissions();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [product, setProduct] = useState<any>(null);

  const cameraRef = useRef<CameraView>(null);
  const translateY = useSharedValue(300);

  useEffect(() => {
    if (permission?.granted) {
      const unsubscribe = navigation.addListener('focus', () => {
        setCapturedImage(null);
        setProduct(null);
      });
      return unsubscribe;
    } else if (!permission) {
      requestPermission();
    }
  }, [permission, navigation, requestPermission]);

  const onCancel = () => router.back();

  const toggleFlash = () => {
    setFlash(flash === 'off' ? 'on' : 'off');
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        setLoading(true);
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: true,
        });
        setCapturedImage(photo.uri);
        await identifyFood(photo.base64!);
      } catch (e) {
        console.error(e);
        setError('Failed to capture image');
        setLoading(false);
      }
    }
  };

  const pickImage = async () => {
    if (!galleryPermission?.granted) {
      await requestGalleryPermission();
    }

    try {
      setLoading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0].base64) {
        setCapturedImage(result.assets[0].uri);
        await identifyFood(result.assets[0].base64);
      } else {
        setLoading(false);
      }
    } catch (e) {
      console.error(e);
      setError('Failed to pick image');
      setLoading(false);
    }
  };

  const identifyFood = async (base64Image: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/identify-food`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const identifiedProduct = {
          id: Date.now().toString(),
          name: data.foodName || 'Unidentified Food',
          description: data.description || 'No description available',
          image: capturedImage || '',
          ingredients: data.ingredients?.join(', ') || 'N/A',
          netWeight: data.estimatedWeight || 'N/A',
          price: '--',
          calories: data.calories?.toString() || 'N/A',
          nutrients: data.nutrients || {},
          time: new Date().toLocaleString(),
          aiScore: data.score,
          aiReason: data.reason,
        };

        setProduct(identifiedProduct);
        addProductToHistory(identifiedProduct);
        translateY.value = withSpring(0, { damping: 10 });
      } else {
        setError(data.message || 'Failed to identify food');
      }
    } catch (e) {
      console.error(e);
      setError('Failed to connect to identification service');
    } finally {
      setLoading(false);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setProduct(null);
    setError(null);
  };

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>

      <View style={styles.scannerContainer}>
        {!capturedImage ? (
          <>
            <View style={styles.cameraBox}>
              <View style={styles.alignTextContainer}>
                <Text style={styles.alignText}>
                  Position the food in the frame
                </Text>
              </View>

              {permission?.granted && (
                <CameraView
                  ref={cameraRef}
                  style={styles.camera}
                  facing="back"
                />
              )}

              <View style={styles.foodFrameContainer} pointerEvents="none">
                <View style={styles.foodFrame} />
              </View>
            </View>

            <View style={styles.controlsContainer}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={toggleFlash}
              >
                <Text style={styles.controlText}>
                  {flash === 'on' ? 'Flash On' : 'Flash Off'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.captureButton}
                onPress={takePicture}
                disabled={loading}
              >
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.controlButton}
                onPress={pickImage}
                disabled={loading}
              >
                <Text style={styles.controlText}>Gallery</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.previewContainer}>
            <Image
              source={{ uri: capturedImage }}
              style={styles.previewImage}
              resizeMode="contain"
            />
            <View style={styles.previewControls}>
              <TouchableOpacity
                style={styles.previewButton}
                onPress={retakePhoto}
              >
                <Text style={styles.previewButtonText}>Retake</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.previewButton}
                onPress={pickImage}
              >
                <Text style={styles.previewButtonText}>Choose Another</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={{ color: '#fff', marginTop: 8 }}>
              Identifying food...
            </Text>
          </View>
        )}

        {error && (
          <View style={styles.errorBox}>
            <Text style={{ color: 'red', fontWeight: 'bold' }}>{error}</Text>
            <Button title="Try again" onPress={retakePhoto} />
          </View>
        )}

        {!!product && <ScannedProductCard product={product} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  cancelButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  cancelText: { fontSize: 24, fontWeight: 'bold', color: '#555' },
  scannerContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
    position: 'relative',
  },
  cameraBox: {
    flex: 1,
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  alignTextContainer: {
    position: 'absolute',
    top: 10,
    width: '100%',
    alignItems: 'center',
    zIndex: 10,
  },
  alignText: {
    color: '#fff',
    fontWeight: 'bold',
    marginHorizontal: 30,
    marginVertical: 20,
    fontSize: 24,
    textAlign: 'center',
  },
  camera: { flex: 1 },
  foodFrameContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  foodFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  controlButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 15,
    borderRadius: 30,
  },
  controlText: {
    color: 'white',
    fontSize: 16,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  previewContainer: {
    flex: 1,
    backgroundColor: 'black',
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  previewImage: {
    flex: 1,
    width: '100%',
  },
  previewControls: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  previewButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 30,
  },
  previewButtonText: {
    color: 'white',
    fontSize: 16,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorBox: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    elevation: 5,
    alignItems: 'center',
  },
});
