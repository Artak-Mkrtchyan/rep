import { StyleSheet } from 'react-native';

import { HOME_DESIGN } from '@/components/home/home-design-tokens';

export const affordabilityStyles = StyleSheet.create({
  section: {
    backgroundColor: HOME_DESIGN.beigeSection,
    marginTop: HOME_DESIGN.layout.sectionGap,
    paddingHorizontal: HOME_DESIGN.layout.affordabilityPaddingH,
    paddingTop: HOME_DESIGN.layout.affordabilityPaddingV,
    paddingBottom: HOME_DESIGN.layout.affordabilityPaddingV,
    gap: HOME_DESIGN.layout.affordabilityBlockGap,
  },
  formCard: {
    borderRadius: 24,
    backgroundColor: HOME_DESIGN.white,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  illustrationFrame: {
    width: '100%',
    aspectRatio: 558 / 445,
    borderRadius: 12,
    backgroundColor: HOME_DESIGN.affordabilityIllustrationBg,
    overflow: 'hidden',
  },
  illustration: {
    width: '100%',
    height: '100%',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: HOME_DESIGN.neutral100,
    backgroundColor: HOME_DESIGN.white,
    gap: 8,
  },
  cta: {
    marginTop: 16,
    height: 49,
    borderRadius: 12,
    backgroundColor: HOME_DESIGN.main500,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
});
