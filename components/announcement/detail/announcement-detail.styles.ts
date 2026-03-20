import { StyleSheet } from 'react-native';

export const detailStyles = StyleSheet.create({
  content: {
    gap: 24,
    paddingBottom: 40,
    marginTop: -24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#FFFFFF',
  },
  pillContainer: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 4,
  },
  pill: {
    width: 42,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#E2E2E2',
  },
  headerSection: {
    gap: 12,
    paddingHorizontal: 16,
  },
  statusIcon: {
    width: 16,
    height: 16,
  },
  chevronIcon: {
    width: 12,
    height: 12,
  },
  backButton: {
    marginTop: 16,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
