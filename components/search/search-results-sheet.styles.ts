import { StyleSheet } from 'react-native';

export const COLLAPSED_RATIO = 0.5;
export const HANDLE_HEIGHT = 32;

export const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#2B2B2B',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  handleArea: {
    height: HANDLE_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pill: {
    width: 42,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#E2E2E2',
  },
  content: {
    flex: 1,
    overflow: 'hidden',
  },
});
