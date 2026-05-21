import { Image } from 'expo-image';
import React from 'react';
import { Pressable, View } from 'react-native';

import { ComparisonIcon } from '@/components/icons/comparison-icon';
import { HeartIcon } from '@/components/icons/heart-icon';
import { ThemedText } from '@/components/themed-text';
import { cn } from '@/lib/utils';
import type { CardAttribute } from '@/lib/utils/announcement-helpers';

import { styles } from './announcement-small-card.styles';

export type AnnouncementSmallCardProps = {
  imageSource: any;
  title: string;
  address: string;
  /** @deprecated Use `attributes` instead */
  bedsLabel?: string;
  /** @deprecated Use `attributes` instead */
  bathsLabel?: string;
  /** @deprecated Use `attributes` instead */
  sizeLabel?: string;
  attributes?: CardAttribute[];
  priceLabel: string;
  className?: string;
  isArrowUpRight?: boolean;
  isFavourite?: boolean;
  isForComparison?: boolean;
  onPress?: () => void;
  onFavouritePress?: () => void;
  onComparisonPress?: () => void;
};

export const AnnouncementSmallCard: React.FC<AnnouncementSmallCardProps> = ({
  imageSource,
  title,
  address,
  bedsLabel,
  bathsLabel,
  sizeLabel,
  attributes,
  priceLabel,
  className,
  isArrowUpRight = true,
  isForComparison = false,
  isFavourite = false,
  onPress,
  onFavouritePress,
  onComparisonPress,
}) => {
  const bgHeartIcon = isFavourite ? 'bg-[#11111199]' : 'bg-[#1111114d]';
  const Container = onPress ? Pressable : View;

  // Fallback to legacy props if attributes not provided
  const displayAttributes: CardAttribute[] = attributes ?? [
    { icon: require('@/assets/images/announcement-icons/bed-icon.svg'), label: bedsLabel ?? '' },
    { icon: require('@/assets/images/announcement-icons/bath-icon.svg'), label: bathsLabel ?? '' },
    { icon: require('@/assets/images/announcement-icons/size-icon.svg'), label: sizeLabel ?? '' },
  ];

  return (
    <Container
      {...(onPress ? { onPress } : {})}
      className={cn('w-full rounded-[16px] bg-card px-[12px] py-[8px]', className)}
      style={styles.container}>
      <View
        className="mb-2 w-full overflow-hidden rounded-[8px] bg-muted"
        style={styles.heroContainer}>
        <Image source={imageSource} style={styles.heroImage} contentFit="cover" />
        <View className="absolute right-[8px] top-[8px]  flex-row items-center gap-[8px]">
          <Pressable
            onPress={onComparisonPress}
            className={cn(
              'h-[24px] w-[24px] items-center justify-center rounded-[36px]',
              isForComparison ? 'bg-[#11111199]' : 'bg-[#1111114d]'
            )}>
            <ComparisonIcon
              width={20}
              height={20}
              stroke={isForComparison ? '#13B86D' : 'white'}
              fill={isForComparison ? '#13B86D' : 'white'}
            />
          </Pressable>
          <Pressable
            onPress={onFavouritePress}
            className={cn(
              'h-[24px] w-[24px] items-center justify-center rounded-[36px]',
              bgHeartIcon
            )}>
            <HeartIcon
              width={16}
              height={16}
              stroke={isFavourite ? '#13B86D' : 'white'}
              fill={isFavourite ? '#13B86D' : 'none'}
            />
          </Pressable>
        </View>
      </View>

      <View className="gap-2">
        <View className="gap-1">
          <ThemedText
            className="text-[14px] font-bold leading-[17px] text-foreground"
            numberOfLines={2}
          >
            {title}
          </ThemedText>
          <ThemedText className="text-[8px] text-muted-foreground" numberOfLines={1}>
            {address}
          </ThemedText>
        </View>

        <View className="flex-row flex-wrap items-center gap-2">
          {displayAttributes
            .filter((attr) => attr.label !== '')
            .map((attr, index) => (
              <View key={index} className="flex-row items-center gap-1">
                <Image source={attr.icon} style={styles.detailIcon} contentFit="contain" />
                <ThemedText className="text-[10px] text-foreground">{attr.label}</ThemedText>
              </View>
            ))}
        </View>

        <View className="flex-row items-center justify-between">
          <ThemedText
            className="flex-1 text-[14px] font-bold leading-[17px] text-foreground"
            numberOfLines={1}
          >
            {priceLabel}
          </ThemedText>
          {isArrowUpRight && (
            <View className="h-[18px] w-[18px] items-center justify-center rounded-full bg-main-500">
              <Image
                source={require('@/assets/images/arrow-up-right-icon.svg')}
                style={styles.arrowIcon}
                contentFit="contain"
              />
            </View>
          )}
        </View>
      </View>
    </Container>
  );
};
