// app/help/common.ts
import { Dimensions, StyleSheet } from 'react-native';

const { height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
  },
  heroImage: {
    position: 'absolute',
    width: '100%',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.5,
    zIndex: -1,
  },
  cardWrapper: {
    paddingHorizontal: 10,
    width: '100%',
    height: '100%',
  },
  card: {
    flex: 1,
    marginTop: height * 0.2,
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    zIndex: 1,
    gap: 16,
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111',
    textAlign: 'center',
  },
  subheading: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  backBtn: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
});
