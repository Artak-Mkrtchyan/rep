import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';

type PaginationIndicatorProps = {
  count: number;
  activeIndex: number;
  /** "overlay" renders on top of content (absolute positioned). "inline" renders in normal flow. */
  variant?: 'overlay' | 'inline';
  /** Max dots before switching to counter badge. Defaults to 9. */
  maxDots?: number;
  /** Bottom offset for overlay positioning. Defaults to 16. */
  bottom?: number;
  /** Merged into the root container (e.g. override inline marginTop). */
  style?: StyleProp<ViewStyle>;
  /** Top margin when variant is inline (default 16). */
  inlineMarginTop?: number;
};

export const PaginationIndicator: React.FC<PaginationIndicatorProps> = ({
  count,
  activeIndex,
  variant = 'overlay',
  maxDots = 9,
  bottom,
  style,
  inlineMarginTop,
}) => {
  if (count <= 1) return null;

  const showDots = count <= maxDots;
  const isOverlay = variant === 'overlay';

  const bottomOverride = isOverlay && bottom != null ? { bottom } : undefined;
  const inlineTop = !isOverlay ? { marginTop: inlineMarginTop ?? 16 } : undefined;

  if (showDots) {
    return (
      <View
        style={[
          styles.dotsContainer,
          isOverlay ? styles.overlayDots : [styles.inlineDots, inlineTop],
          bottomOverride,
          style,
        ]}>
        {Array.from({ length: count }, (_, i) => (
          <View
            key={i}
            style={[
              styles.dotBase,
              i === activeIndex
                ? isOverlay
                  ? styles.dotActiveOverlay
                  : styles.dotActiveInline
                : isOverlay
                  ? styles.dotInactiveOverlay
                  : styles.dotInactiveInline,
            ]}
          />
        ))}
      </View>
    );
  }

  return (
    <View
      style={[
        styles.counter,
        isOverlay ? styles.overlayCounter : [styles.inlineCounter, inlineTop],
        bottomOverride,
        style,
      ]}>
      <ThemedText style={styles.counterText}>
        {activeIndex + 1}/{count}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  overlayDots: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    left: 0,
    right: 0,
    justifyContent: 'center',
  },
  inlineDots: {
    justifyContent: 'center',
    alignSelf: 'center',
  },
  dotBase: {
    borderRadius: 3,
  },
  dotActiveOverlay: {
    width: 24,
    height: 6,
    backgroundColor: '#FFFFFF',
  },
  dotInactiveOverlay: {
    width: 6,
    height: 6,
    backgroundColor: 'rgba(27,27,27,0.6)',
  },
  dotActiveInline: {
    width: 24,
    height: 6,
    backgroundColor: '#111111',
  },
  dotInactiveInline: {
    width: 6,
    height: 6,
    backgroundColor: '#E2E2E2',
  },
  counter: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  overlayCounter: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(17,17,17,0.6)',
  },
  inlineCounter: {
    alignSelf: 'center',
    backgroundColor: '#E2E2E2',
  },
  counterText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
});
