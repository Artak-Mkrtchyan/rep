import { Image, type ImageSource } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import { Pressable, View } from 'react-native';

import { ComparisonIcon } from '@/components/icons/comparison-icon';
import { HeartIcon } from '@/components/icons/heart-icon';
import { ThemedText } from '@/components/themed-text';
import { HOME_DESIGN } from '@/components/home/home-design-tokens';
import type { CardAttribute } from '@/lib/utils/announcement-helpers';

import { featuredPropertyFigmaCardStyles as styles } from './featured-property-figma-card.styles';

export type FeaturedPropertyFigmaCardProps = {
  title: string;
  address: string;
  attributes: CardAttribute[];
  priceLabel: string;
  statusLabel: string;
  imageSources: ImageSource[];
  isFavourite: boolean;
  isForComparison: boolean;
  onPress?: () => void;
  onFavouritePress?: () => void;
  onComparisonPress?: () => void;
};

export const FeaturedPropertyFigmaCard: React.FC<FeaturedPropertyFigmaCardProps> = ({
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
}) => {
  const [imageIndex, setImageIndex] = useState(0);
  const count = Math.max(imageSources.length, 1);
  const currentSource = imageSources[imageIndex] ?? imageSources[0];

  const goPrev = useCallback(() => {
    setImageIndex((i) => (i - 1 + count) % count);
  }, [count]);

  const goNext = useCallback(() => {
    setImageIndex((i) => (i + 1) % count);
  }, [count]);

  const Container = onPress ? Pressable : View;

  return (
    <Container
      {...(onPress ? { onPress } : {})}
      style={styles.card}
      accessibilityRole={onPress ? 'button' : undefined}>
      <View style={styles.imageWrap}>
        <Image source={currentSource} style={styles.image} contentFit="cover" />
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
                  stroke={isForComparison ? '#5EBC39' : '#FFFFFF'}
                  fill={isForComparison ? '#5EBC39' : '#FFFFFF'}
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
                  stroke={isFavourite ? '#5EBC39' : '#FFFFFF'}
                  fill={isFavourite ? '#5EBC39' : 'none'}
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
            numberOfLines={1}>
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
