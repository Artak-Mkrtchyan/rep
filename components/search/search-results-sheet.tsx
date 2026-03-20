import React, { useEffect } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { COLLAPSED_RATIO, styles } from './search-results-sheet.styles';

const SPRING_CONFIG = { damping: 20, stiffness: 200, mass: 0.5 };
const VELOCITY_THRESHOLD = 500;
const DEFAULT_EXPANDED_TOP = 140;

type SearchResultsSheetProps = {
  children: React.ReactNode;
  expandedTop?: number;
};

export const SearchResultsSheet: React.FC<SearchResultsSheetProps> = ({
  children,
  expandedTop = DEFAULT_EXPANDED_TOP,
}) => {
  const { height: screenHeight } = useWindowDimensions();
  const collapsedTop = screenHeight * COLLAPSED_RATIO;

  const translateY = useSharedValue(collapsedTop);
  const startY = useSharedValue(0);
  const expandedTopSV = useSharedValue(expandedTop);
  const collapsedTopSV = useSharedValue(collapsedTop);

  useEffect(() => {
    expandedTopSV.value = expandedTop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expandedTop]);

  useEffect(() => {
    collapsedTopSV.value = collapsedTop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collapsedTop]);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      startY.value = translateY.value;
    })
    .onUpdate((event) => {
      const next = startY.value + event.translationY;
      translateY.value = Math.max(expandedTopSV.value, Math.min(next, collapsedTopSV.value));
    })
    .onEnd((event) => {
      const midpoint = (collapsedTopSV.value + expandedTopSV.value) / 2;
      if (event.velocityY < -VELOCITY_THRESHOLD) {
        translateY.value = withSpring(expandedTopSV.value, SPRING_CONFIG);
      } else if (event.velocityY > VELOCITY_THRESHOLD) {
        translateY.value = withSpring(collapsedTopSV.value, SPRING_CONFIG);
      } else {
        const target = translateY.value < midpoint ? expandedTopSV.value : collapsedTopSV.value;
        translateY.value = withSpring(target, SPRING_CONFIG);
      }
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
