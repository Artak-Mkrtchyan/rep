import React, { useEffect } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  type SharedValue,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { COLLAPSED_RATIO, styles } from './search-results-sheet.styles';

const SPRING_CONFIG = { damping: 20, stiffness: 200, mass: 0.5 };
const VELOCITY_THRESHOLD = 500;
const DEFAULT_EXPANDED_TOP = 140;
/** Sheet top Y within this distance of expanded snap counts as "full height" */
const FULL_EXPAND_EPS = 14;

export type { SharedValue };

type SearchResultsSheetProps = {
  children: React.ReactNode;
  expandedTop?: number;
  collapsedRatio?: number;
  onSheetPositionChange?: (sheetTop: SharedValue<number>) => void;
  /** Fires when sheet snaps to full height (expanded) vs not — for toggling chrome over the map */
  onFullyExpandedChange?: (fullyExpanded: boolean) => void;
};

export const SearchResultsSheet: React.FC<SearchResultsSheetProps> = ({
  children,
  expandedTop = DEFAULT_EXPANDED_TOP,
  collapsedRatio = COLLAPSED_RATIO,
  onSheetPositionChange,
  onFullyExpandedChange,
}) => {
  const { height: screenHeight } = useWindowDimensions();
  const collapsedTop = screenHeight * collapsedRatio;
  /** Lowest snap = half screen (max map visible while sheet still open); was a ~280px peek */
  const minimizedTop = screenHeight * collapsedRatio;

  const translateY = useSharedValue(collapsedTop);
  const startY = useSharedValue(0);
  const expandedTopSV = useSharedValue(expandedTop);
  const collapsedTopSV = useSharedValue(collapsedTop);
  const minimizedTopSV = useSharedValue(minimizedTop);

  useEffect(() => {
    onSheetPositionChange?.(translateY);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    expandedTopSV.value = expandedTop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expandedTop]);

  useEffect(() => {
    collapsedTopSV.value = collapsedTop;
    minimizedTopSV.value = minimizedTop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collapsedTop, minimizedTop]);

  useAnimatedReaction(
    () => translateY.value,
    (y, prev) => {
      if (!onFullyExpandedChange) return;
      const exp = expandedTopSV.value;
      const fullyExpanded = Math.abs(y - exp) < FULL_EXPAND_EPS;
      if (prev != null) {
        const wasFull = Math.abs(prev - exp) < FULL_EXPAND_EPS;
        if (fullyExpanded === wasFull) return;
      }
      runOnJS(onFullyExpandedChange)(fullyExpanded);
    },
    [onFullyExpandedChange],
  );

  const panGesture = Gesture.Pan()
    .onStart(() => {
      startY.value = translateY.value;
    })
    .onUpdate((event) => {
      const next = startY.value + event.translationY;
      translateY.value = Math.max(expandedTopSV.value, Math.min(next, minimizedTopSV.value));
    })
    .onEnd((event) => {
      'worklet';
      const expanded = expandedTopSV.value;
      const collapsed = collapsedTopSV.value;
      const minimized = minimizedTopSV.value;
      const pos = translateY.value;

      // Fast swipe
      if (event.velocityY < -VELOCITY_THRESHOLD) {
        // Swipe up: go to next higher snap
        const target = pos > collapsed ? collapsed : expanded;
        translateY.value = withSpring(target, SPRING_CONFIG);
        return;
      }
      if (event.velocityY > VELOCITY_THRESHOLD) {
        // Swipe down: go to next lower snap
        const target = pos < collapsed ? collapsed : minimized;
        translateY.value = withSpring(target, SPRING_CONFIG);
        return;
      }

      // Slow drag: snap to nearest
      const snaps = [expanded, collapsed, minimized];
      let nearest = expanded;
      let minDist = Math.abs(pos - expanded);
      for (let i = 1; i < snaps.length; i++) {
        const dist = Math.abs(pos - snaps[i]);
        if (dist < minDist) {
          minDist = dist;
          nearest = snaps[i];
        }
      }
      translateY.value = withSpring(nearest, SPRING_CONFIG);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    top: translateY.value,
  }));

  return (
    <Animated.View style={[styles.sheet, animatedStyle]}>
      <GestureDetector gesture={panGesture}>
        <View style={styles.handleArea}>
          <View style={styles.pill} />
        </View>
      </GestureDetector>
      <View style={styles.content}>{children}</View>
    </Animated.View>
  );
};
