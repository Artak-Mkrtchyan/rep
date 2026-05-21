import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    shadowColor: '#6E6E6E',
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 33,
    elevation: 4,
  },
  /** Keeps the image in the original 151:97 ratio (card width 175 − px-12 × 2 = 151, image height 97). */
  heroContainer: {
    aspectRatio: 151 / 97,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  menuIcon: {
    width: 16,
    height: 16,
    tintColor: 'white',
  },
  detailIcon: {
    width: 12,
    height: 12,
  },
  arrowIcon: {
    width: 16,
    height: 16,
  },
});
