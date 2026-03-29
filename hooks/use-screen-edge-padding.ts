import { useMemo } from 'react';
import { type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** Horizontal gutter from the screen / safe layout edge (Figma). */
export const SCREEN_EDGE_PADDING = 16;

/**
 * Left/right padding: 16px plus horizontal safe-area insets (notches, home indicator side, etc.).
 */
export function useScreenEdgePadding(): {
  paddingLeft: number;
  paddingRight: number;
  horizontalStyle: ViewStyle;
} {
  const insets = useSafeAreaInsets();

  return useMemo(
    () => ({
      paddingLeft: SCREEN_EDGE_PADDING + insets.left,
      paddingRight: SCREEN_EDGE_PADDING + insets.right,
      horizontalStyle: {
        paddingLeft: SCREEN_EDGE_PADDING + insets.left,
        paddingRight: SCREEN_EDGE_PADDING + insets.right,
      },
    }),
    [insets.left, insets.right]
  );
}
