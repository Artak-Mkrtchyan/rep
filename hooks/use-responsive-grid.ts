import { useCallback, useMemo, useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';

type UseResponsiveGridOptions = {
  /** Minimum card width the design still looks good at — used to pick column count. */
  minCardWidth?: number;
  /** Horizontal gap between cards (px). */
  gap?: number;
  /** Minimum column count (defaults to 2). */
  minColumns?: number;
  /** Fallback card width used before `onLayout` fires. */
  fallbackCardWidth?: number;
};

type UseResponsiveGridResult = {
  /** Computed card width — fills remaining space so there's no right gutter. */
  cardWidth: number;
  /** Number of columns that fit given the measured container width. */
  columns: number;
  /** Horizontal gap between cards (same as the `gap` option). */
  gap: number;
  /** Attach to the grid container's `onLayout` to receive width measurements. */
  onLayout: (event: LayoutChangeEvent) => void;
};

/**
 * Computes a responsive card width that fills the full container width for a
 * flex-wrap grid, avoiding empty gutter on the right. Pair with a container
 * that uses `flexDirection: 'row'`, `flexWrap: 'wrap'` and `columnGap: gap`.
 */
export function useResponsiveGrid({
  minCardWidth = 160,
  gap = 8,
  minColumns = 2,
  fallbackCardWidth = 175,
}: UseResponsiveGridOptions = {}): UseResponsiveGridResult {
  const [containerWidth, setContainerWidth] = useState(0);

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    setContainerWidth((prev) => (Math.abs(prev - width) > 0.5 ? width : prev));
  }, []);

  const { cardWidth, columns } = useMemo(() => {
    if (containerWidth <= 0) {
      return { cardWidth: fallbackCardWidth, columns: minColumns };
    }
    const cols = Math.max(minColumns, Math.floor((containerWidth + gap) / (minCardWidth + gap)));
    const width = (containerWidth - gap * (cols - 1)) / cols;
    return { cardWidth: width, columns: cols };
  }, [containerWidth, fallbackCardWidth, gap, minColumns, minCardWidth]);

  return { cardWidth, columns, gap, onLayout };
}
