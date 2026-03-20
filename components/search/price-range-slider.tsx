import React, { useCallback, useMemo, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';

const BAR_COUNT = 38;
const BAR_GAP = 2;
const MAX_BAR_HEIGHT = 78;
const THUMB_OUTER = 24;
const THUMB_INNER = 16;
const THUMB_HITSLOP = 16;

const GREEN_COLORS = ['#2DFE9B', '#1AD982', '#13B86D'];
const GRAY_COLOR = '#E2E2E2';

type PriceRangeSliderProps = {
  min: number;
  max: number;
  minValue: number;
  maxValue: number;
  onMinChange: (value: number) => void;
  onMaxChange: (value: number) => void;
};

function formatCompact(value: number): string {
  if (value >= 1_000_000) {
    const m = value / 1_000_000;
    return `$${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)}M`;
  }
  if (value >= 1_000) {
    const k = value / 1_000;
    return `$${k % 1 === 0 ? k.toFixed(0) : k.toFixed(0)}K`;
  }
  return `$${value}`;
}

function barColor(index: number, minIdx: number, maxIdx: number): string {
  if (index < minIdx || index > maxIdx) return GRAY_COLOR;
  const third = Math.floor(BAR_COUNT / 3);
  if (index < third) return GREEN_COLORS[0];
  if (index < third * 2) return GREEN_COLORS[1];
  return GREEN_COLORS[2];
}

function barHeight(index: number): number {
  return Math.round(4 + ((MAX_BAR_HEIGHT - 4) * (index + 1)) / BAR_COUNT);
}

export const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
  min,
  max,
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
}) => {
  const [trackWidth, setTrackWidth] = useState(0);
  const trackWidthShared = useSharedValue(0);

  const range = max - min;
  const minFraction = range > 0 ? (minValue - min) / range : 0;
  const maxFraction = range > 0 ? (maxValue - min) / range : 1;

  const minPos = useSharedValue(0);
  const maxPos = useSharedValue(0);
  const activeThumb = useSharedValue<'min' | 'max' | null>(null);

  const handleLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const w = e.nativeEvent.layout.width;
      setTrackWidth(w);
      trackWidthShared.value = w;
      minPos.value = minFraction * w;
      maxPos.value = maxFraction * w;
    },
    [minFraction, maxFraction, minPos, maxPos, trackWidthShared]
  );

  React.useEffect(() => {
    if (trackWidth > 0) {
      minPos.value = minFraction * trackWidth;
    }
  }, [minFraction, trackWidth, minPos]);

  React.useEffect(() => {
    if (trackWidth > 0) {
      maxPos.value = maxFraction * trackWidth;
    }
  }, [maxFraction, trackWidth, maxPos]);

  const posToValue = useCallback(
    (pos: number) => {
      if (trackWidth === 0) return min;
      const clamped = Math.max(0, Math.min(pos, trackWidth));
      const raw = min + (clamped / trackWidth) * range;
      const step = range > 1_000_000 ? 50_000 : range > 100_000 ? 10_000 : 1_000;
      return Math.round(raw / step) * step;
    },
    [min, range, trackWidth]
  );

  const emitMin = useCallback(
    (pos: number) => onMinChange(posToValue(pos)),
    [onMinChange, posToValue]
  );
  const emitMax = useCallback(
    (pos: number) => onMaxChange(posToValue(pos)),
    [onMaxChange, posToValue]
  );

  const minStartX = useSharedValue(0);
  const minGesture = Gesture.Pan()
    .hitSlop({
      top: THUMB_HITSLOP,
      bottom: THUMB_HITSLOP,
      left: THUMB_HITSLOP,
      right: THUMB_HITSLOP,
    })
    .onBegin(() => {
      minStartX.value = minPos.value;
      activeThumb.value = 'min';
    })
    .onUpdate((e) => {
      const next = Math.max(
        0,
        Math.min(minStartX.value + e.translationX, maxPos.value - THUMB_OUTER)
      );
      minPos.value = next;
      runOnJS(emitMin)(next);
    })
    .onEnd(() => {
      activeThumb.value = null;
    });

  const maxStartX = useSharedValue(0);
  const maxGesture = Gesture.Pan()
    .hitSlop({
      top: THUMB_HITSLOP,
      bottom: THUMB_HITSLOP,
      left: THUMB_HITSLOP,
      right: THUMB_HITSLOP,
    })
    .onBegin(() => {
      maxStartX.value = maxPos.value;
      activeThumb.value = 'max';
    })
    .onUpdate((e) => {
      const tw = trackWidthShared.value;
      const next = Math.min(
        tw,
        Math.max(maxStartX.value + e.translationX, minPos.value + THUMB_OUTER)
      );
      maxPos.value = next;
      runOnJS(emitMax)(next);
    })
    .onEnd(() => {
      activeThumb.value = null;
    });

  const minThumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: minPos.value - THUMB_OUTER / 2 }],
  }));

  const maxThumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: maxPos.value - THUMB_OUTER / 2 }],
  }));

  const minTooltipVisible = useDerivedValue(() => activeThumb.value === 'min');
  const maxTooltipVisible = useDerivedValue(() => activeThumb.value === 'max');

  const minTooltipStyle = useAnimatedStyle(() => ({
    opacity: minTooltipVisible.value ? 1 : 0,
    transform: [{ translateX: minPos.value - 30 }],
  }));
  const maxTooltipStyle = useAnimatedStyle(() => ({
    opacity: maxTooltipVisible.value ? 1 : 0,
    transform: [{ translateX: maxPos.value - 30 }],
  }));

  const minBarIdx = Math.round(minFraction * (BAR_COUNT - 1));
  const maxBarIdx = Math.round(maxFraction * (BAR_COUNT - 1));

  const barWidth = trackWidth > 0 ? (trackWidth - (BAR_COUNT - 1) * BAR_GAP) / BAR_COUNT : 6;

  const bars = useMemo(
    () =>
      Array.from({ length: BAR_COUNT }, (_, i) => {
        const h = barHeight(i);
        const color = barColor(i, minBarIdx, maxBarIdx);
        return (
          <View
            key={i}
            style={[
              styles.bar,
              {
                width: barWidth,
                height: h,
                backgroundColor: color,
                marginLeft: i > 0 ? BAR_GAP : 0,
              },
            ]}
          />
        );
      }),
    [minBarIdx, maxBarIdx, barWidth]
  );

  const trackLine = useAnimatedStyle(() => ({
    left: minPos.value,
    width: Math.max(0, maxPos.value - minPos.value),
  }));

  return (
    <GestureHandlerRootView style={styles.root}>
      <View style={styles.container} onLayout={handleLayout}>
        {trackWidth > 0 && (
          <>
            <Animated.View style={[styles.tooltip, minTooltipStyle]} pointerEvents="none">
              <Text style={styles.tooltipText}>{formatCompact(minValue)}</Text>
              <View style={styles.tooltipArrow} />
            </Animated.View>

            <Animated.View style={[styles.tooltip, maxTooltipStyle]} pointerEvents="none">
              <Text style={styles.tooltipText}>{formatCompact(maxValue)}</Text>
              <View style={styles.tooltipArrow} />
            </Animated.View>

            <View style={styles.barsContainer}>{bars}</View>

            <View style={styles.trackContainer}>
              <View style={styles.trackBg} />
              <Animated.View style={[styles.trackFill, trackLine]} />

              <GestureDetector gesture={minGesture}>
                <Animated.View style={[styles.thumbOuter, minThumbStyle]}>
                  <View style={styles.thumbInner} />
                </Animated.View>
              </GestureDetector>

              <GestureDetector gesture={maxGesture}>
                <Animated.View style={[styles.thumbOuter, maxThumbStyle]}>
                  <View style={styles.thumbInner} />
                </Animated.View>
              </GestureDetector>
            </View>

            <View style={styles.scaleRow}>
              <Text style={styles.scaleText}>$0</Text>
              <Text style={styles.scaleText}>$10M+</Text>
            </View>
          </>
        )}
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  root: {
    width: '100%',
  },
  container: {
    width: '100%',
    paddingTop: 40,
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: MAX_BAR_HEIGHT,
  },
  bar: {
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  trackContainer: {
    height: THUMB_OUTER + 4,
    justifyContent: 'center',
  },
  trackBg: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 6,
    borderRadius: 3,
    backgroundColor: GRAY_COLOR,
  },
  trackFill: {
    position: 'absolute',
    height: 6,
    borderRadius: 3,
    backgroundColor: '#087443',
  },
  thumbOuter: {
    position: 'absolute',
    width: THUMB_OUTER,
    height: THUMB_OUTER,
    borderRadius: THUMB_OUTER / 2,
    backgroundColor: GRAY_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
  },
  thumbInner: {
    width: THUMB_INNER,
    height: THUMB_INNER,
    borderRadius: THUMB_INNER / 2,
    backgroundColor: '#FFFFFF',
  },
  tooltip: {
    position: 'absolute',
    top: 0,
    width: 60,
    backgroundColor: '#F1F1F1',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignItems: 'center',
    zIndex: 10,
  },
  tooltipText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#111111',
    textAlign: 'center',
  },
  tooltipArrow: {
    position: 'absolute',
    bottom: -5,
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 5,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#F1F1F1',
  },
  scaleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  scaleText: {
    fontSize: 13,
    color: '#111111',
    textAlign: 'center',
  },
});
