import { Image, type ImageSource } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useRef, useState } from 'react';
import { Animated, Easing, LayoutChangeEvent, Pressable, View } from 'react-native';

import { ComparisonIcon } from '@/components/icons/comparison-icon';
import { HeartIcon } from '@/components/icons/heart-icon';
import { ThemedText } from '@/components/themed-text';
import { HOME_DESIGN } from '@/components/home/home-design-tokens';
import type { CardAttribute } from '@/lib/utils/announcement-helpers';

import { featuredPropertyCardStyles as styles } from './featured-property-card.styles';

export type FeaturedPropertyCardProps = {
  title: string;
  address: string;
  attributes: CardAttribute[];
  priceLabel: string;
  statusLabel: string;
  imageSources: ImageSource[];
  isFavourite: boolean;
  isForComparison: boolean;
  cardWidth?: number;
  imageHeight?: number;
  onPress?: () => void;
  onFavouritePress?: () => void;
  onComparisonPress?: () => void;
};

const SLIDE_DURATION_MS = 280;

export const FeaturedPropertyCard: React.FC<FeaturedPropertyCardProps> = ({
  title,
  address,
  attributes,
  priceLabel,
  statusLabel,
  imageSources,
  isFavourite,
  isForComparison,
  onPress,
  onFavouritePress,
  onComparisonPress,
  cardWidth = HOME_DESIGN.featuredCardWidth,
  imageHeight = HOME_DESIGN.featuredImageHeight,
}) => {
  const [imageIndex, setImageIndex] = useState(0);
  const [trackWidth, setTrackWidth] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;
  const isAnimatingRef = useRef(false);

  const count = Math.max(imageSources.length, 1);

  const handleImageWrapLayout = useCallback((e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    setTrackWidth(w);
    translateX.setValue(-imageIndex * w);
  }, [imageIndex, translateX]);

  const slideTo = useCallback(
    (nextIndex: number) => {
      if (trackWidth === 0 || isAnimatingRef.current) return;
      isAnimatingRef.current = true;
      setImageIndex(nextIndex);
      Animated.timing(translateX, {
        toValue: -nextIndex * trackWidth,
        duration: SLIDE_DURATION_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start(() => {
        isAnimatingRef.current = false;
      });
    },
    [trackWidth, translateX]
  );

  const goPrev = useCallback(() => {
    slideTo((imageIndex - 1 + count) % count);
  }, [slideTo, imageIndex, count]);

  const goNext = useCallback(() => {
    slideTo((imageIndex + 1) % count);
  }, [slideTo, imageIndex, count]);

  const Container = onPress ? Pressable : View;

  return (
    <Container
      {...(onPress ? { onPress } : {})}
      style={[styles.card, { width: cardWidth }]}
      accessibilityRole={onPress ? 'button' : undefined}>
      <View
        style={[styles.imageWrap, { height: imageHeight }]}
        onLayout={handleImageWrapLayout}>
        {trackWidth > 0 ? (
          <Animated.View
            style={{
              flexDirection: 'row',
              width: trackWidth * count,
              height: imageHeight,
              transform: [{ translateX }],
            }}>
            {imageSources.map((source, i) => (
              <Image
                key={i}
                source={source}
                style={{ width: trackWidth, height: imageHeight }}
                contentFit="cover"
              />
            ))}
          </Animated.View>
        ) : null}

        <View style={styles.imageDim} pointerEvents="none" />

        <View className="absolute inset-0 px-2 pt-4" pointerEvents="box-none">
          <View className="flex-row items-start justify-between">
            <View style={styles.statusPill}>
              <ThemedText
                className="text-[12px] font-normal"
                style={{ color: HOME_DESIGN.green500 }}>
                {statusLabel}
              </ThemedText>
            </View>
            <View className="flex-row items-center gap-2">
              <Pressable
                onPress={onComparisonPress}
                style={styles.actionPill}
                accessibilityRole="button"
                accessibilityLabel="Comparison">
                <ComparisonIcon
                  width={18}
                  height={18}
                  stroke={isForComparison ? HOME_DESIGN.green500 : HOME_DESIGN.white}
                  fill={isForComparison ? HOME_DESIGN.green500 : HOME_DESIGN.white}
                />
              </Pressable>
              <Pressable
                onPress={onFavouritePress}
                style={styles.actionPill}
                accessibilityRole="button"
                accessibilityLabel="Favourite">
                <HeartIcon
                  width={18}
                  height={18}
                  stroke={isFavourite ? HOME_DESIGN.green500 : HOME_DESIGN.white}
                  fill={isFavourite ? HOME_DESIGN.green500 : 'none'}
                />
              </Pressable>
            </View>
          </View>
        </View>

        {count > 1 ? (
          <View
            className="absolute bottom-3 left-0 right-0 flex-row items-center justify-between px-3"
            pointerEvents="box-none">
            <Pressable onPress={goPrev} style={styles.arrowBtn} accessibilityRole="button">
              <Ionicons name="chevron-back" size={16} color={HOME_DESIGN.neutral950} />
            </Pressable>
            <Pressable onPress={goNext} style={styles.arrowBtn} accessibilityRole="button">
              <Ionicons name="chevron-forward" size={16} color={HOME_DESIGN.neutral950} />
            </Pressable>
          </View>
        ) : null}
      </View>

      <View className="gap-3">
        <View className="gap-2">
          <ThemedText
            className="text-[16px] font-bold leading-tight text-foreground"
            numberOfLines={2}>
            {title}
          </ThemedText>
          <ThemedText
            className="text-[10px] leading-tight"
            style={{ color: HOME_DESIGN.neutral500 }}
            numberOfLines={2}>
            {address}
          </ThemedText>
          <View className="flex-row flex-wrap items-center gap-3">
            {attributes
              .filter((a) => a.label !== '')
              .map((attr, index) => (
                <View key={`${attr.label}-${index}`} className="flex-row items-center gap-2">
                  <Image source={attr.icon} style={styles.attrIcon} contentFit="contain" />
                  <ThemedText className="text-[14px] leading-5 text-foreground">
                    {attr.label}
                  </ThemedText>
                </View>
              ))}
          </View>
        </View>
        <ThemedText className="text-[16px] font-bold text-foreground">{priceLabel}</ThemedText>
      </View>
    </Container>
  );
};
