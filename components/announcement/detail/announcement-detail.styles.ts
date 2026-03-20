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
    width: 46,
    height: 46,
    borderRadius: 500,
    backgroundColor: 'rgba(17,17,17,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(17,17,17,0.3)',
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  actionIcon: {
    width: 24,
    height: 24,
  },
});
