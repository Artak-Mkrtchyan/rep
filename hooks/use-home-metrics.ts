import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HOME_DESIGN } from '@/components/home/home-design-tokens';

/** Figma home frame width used for proportional scaling */
const FIGMA_FRAME_WIDTH = 390;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

/**
 * Responsive metrics for home screen carousels and cards.
 * Updates on rotation, split-screen, and different phone widths.
 */
export function useHomeMetrics() {
  const { width: windowWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  return useMemo(() => {
    const usableWidth = windowWidth - insets.left - insets.right;
    const horizontalPad = HOME_DESIGN.layout.affordabilityPaddingH;
    const contentWidth = usableWidth - horizontalPad * 2;
    const gap = HOME_DESIGN.layout.carouselCardGap;

    // Featured: scale from Figma (249 @ 390), clamp so narrow phones / tablets stay usable
    const featuredCardWidth = Math.round(
      clamp(
        (usableWidth * HOME_DESIGN.featuredCardWidth) / FIGMA_FRAME_WIDTH,
        HOME_DESIGN.responsive.featuredCardWidthMin,
        HOME_DESIGN.responsive.featuredCardWidthMax
      )
    );
    const featuredImageHeight = Math.round(
      featuredCardWidth * (HOME_DESIGN.featuredImageHeight / HOME_DESIGN.featuredCardWidth)
    );
    const featuredCardStride = featuredCardWidth + gap;

    // Gray-strip carousels: width as fraction of padded content, clamped
    const agentCardWidth = Math.round(
      clamp(
        contentWidth * HOME_DESIGN.responsive.agentCardWidthRatio,
        HOME_DESIGN.responsive.agentCardWidthMin,
        HOME_DESIGN.responsive.agentCardWidthMax
      )
    );
    const companyCardWidth = Math.round(
      clamp(
        contentWidth * HOME_DESIGN.responsive.companyCardWidthRatio,
        HOME_DESIGN.responsive.companyCardWidthMin,
        HOME_DESIGN.responsive.companyCardWidthMax
      )
    );

    return {
      usableWidth,
      contentWidth,
      horizontalPad,
      gap,
      featuredCardWidth,
      featuredImageHeight,
      featuredCardStride,
      agentCardWidth,
      companyCardWidth,
      agentStride: agentCardWidth + gap,
      companyStride: companyCardWidth + gap,
    };
  }, [windowWidth, insets.left, insets.right]);
}
