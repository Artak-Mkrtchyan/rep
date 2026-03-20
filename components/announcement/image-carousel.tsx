import { Image } from 'expo-image';
import React, { useCallback, useRef, useState } from 'react';
import {
  FlatList,
  type ListRenderItemInfo,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  useWindowDimensions,
  View,
} from 'react-native';

import { PaginationIndicator } from '@/components/ui/pagination-indicator';

import { styles } from './image-carousel.styles';

const MAX_DOTS = 9;

type ImageCarouselProps = {
  images: string[];
};

export const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const { width } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList<string>>(null);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(event.nativeEvent.contentOffset.x / width);
      setActiveIndex(index);
    },
    [width]
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<string>) => (
      <View style={[styles.container, { width }]}>
        <Image source={{ uri: item }} style={styles.image} contentFit="cover" />
      </View>
    ),
    [width]
  );

  const keyExtractor = useCallback((_: string, index: number) => `img-${index}`, []);

  if (images.length === 0) {
    return (
      <View style={styles.container}>
        <Image
          source={require('@/assets/images/hero.png')}
          style={styles.image}
          contentFit="cover"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={images}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />
      {images.length > 1 && (
        <>
          {images.length <= MAX_DOTS && (
            <PaginationIndicator
              count={images.length}
              activeIndex={activeIndex}
              variant="overlay"
              maxDots={MAX_DOTS}
              bottom={40}
            />
          )}
          <PaginationIndicator
            count={images.length}
            activeIndex={activeIndex}
            variant="overlay"
            maxDots={0}
            bottom={40}
          />
        </>
      )}
    </View>
  );
};
