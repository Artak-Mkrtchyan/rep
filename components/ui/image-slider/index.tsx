import { Image } from 'expo-image';
import React, { useCallback, useRef, useState } from 'react';
import {
  Dimensions,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { cn } from '@/lib/utils';

import type { ImageSliderProps } from './types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DOT_SIZE = 8;
const DOT_ACTIVE_WIDTH = 24;

export const ImageSlider: React.FC<ImageSliderProps> = ({
  images,
  className,
  accessibilityLabel = 'Image gallery',
}) => {
  const [containerWidth, setContainerWidth] = useState(SCREEN_WIDTH);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const slides = images.length > 0 ? images : [null];
  const isPlaceholder = images.length === 0;

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    const { width } = e.nativeEvent.layout;
    setContainerWidth(width);
  }, []);

  const handleMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = e.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / containerWidth);
      setActiveIndex(Math.min(index, slides.length - 1));
    },
    [containerWidth, slides.length]
  );

  return (
    <View
      onLayout={handleLayout}
      className={cn('w-full items-center  overflow-hidden rounded-[24px]', className)}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="image">
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        decelerationRate="fast"
        bounces={false}
        contentContainerStyle={{ width: containerWidth * slides.length }}>
        {slides.map((source, index) => (
          <View
            key={index}
            style={{
              width: containerWidth,
            }}
            className="items-center justify-center bg-muted">
            {isPlaceholder ? (
              <ThemedText className="text-[14px] text-muted-foreground">No image</ThemedText>
            ) : source ? (
              <Image
                source={source}
                style={{ width: containerWidth }}
                contentFit="cover"
                className="w-full"
              />
            ) : null}
          </View>
        ))}
      </ScrollView>

      {/* Pagination dots */}
      <View className="absolute bottom-3 flex-row items-center justify-center gap-1.5 rounded-[29px] bg-neutral-200 p-[8px]">
        {slides.map((_, index) => (
          <View
            key={index}
            className={cn(
              'h-2 rounded-full',
              index === activeIndex ? 'bg-white/90' : 'bg-white/50'
            )}
            style={{
              width: index === activeIndex ? DOT_ACTIVE_WIDTH : DOT_SIZE,
            }}
            accessibilityRole="none"
          />
        ))}
      </View>
    </View>
  );
};

export type { ImageSliderImage, ImageSliderProps } from './types';
