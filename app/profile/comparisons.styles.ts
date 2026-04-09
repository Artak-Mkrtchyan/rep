import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  headerSpacer: {
    width: 24,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: '45%',
  },
  emptyStateInner: {
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 280,
    width: '100%',
  },
  emptyIllustration: {
    width: 250,
    height: 154,
  },
  list: {
    gap: 12,
    paddingBottom: 100,
    backgroundColor: '#FFFFFF',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingTop: 16,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F1F1',
  },
  compareButton: {
    backgroundColor: '#087443',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compareButtonDisabled: {
    opacity: 0.5,
    backgroundColor: '#F1F1F1',
  },
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayDim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  popup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 24,
    marginHorizontal: 16,
    width: 358,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#6E6E6E',
        shadowOffset: { width: 2, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 33,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  popupTextBlock: {
    alignItems: 'center',
    width: '100%',
  },
  popupLower: {
    marginTop: 24,
    width: '100%',
    alignItems: 'center',
    gap: 32,
  },
  tooManyIllustration: {
    width: 214,
    height: 143,
  },
  closeButton: {
    backgroundColor: '#0E9457',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    width: '100%',
    alignItems: 'center',
  },
});
