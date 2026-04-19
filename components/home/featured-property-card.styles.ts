import { StyleSheet } from 'react-native';

import { HOME_DESIGN } from '@/components/home/home-design-tokens';

export const featuredPropertyCardStyles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: HOME_DESIGN.neutral50,
    backgroundColor: HOME_DESIGN.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    ...HOME_DESIGN.cardShadow,
  },
  imageWrap: {
    borderRadius: 16,
    overflow: 'hidden',
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageDim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: HOME_DESIGN.imageOverlay,
  },
  arrowBtn: {
    width: 24,
    height: 24,
    borderRadius: 96,
    backgroundColor: 'rgba(241,241,241,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    ...HOME_DESIGN.cardShadow,
  },
  statusPill: {
    backgroundColor: HOME_DESIGN.green50,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  actionPill: {
    width: 32,
    height: 32,
    borderRadius: 36,
    backgroundColor: HOME_DESIGN.overlayDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attrIcon: {
    width: 16,
    height: 16,
  },
});
