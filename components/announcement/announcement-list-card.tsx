import { Image } from 'expo-image';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ComparisonIcon } from '@/components/icons/comparison-icon';
import { HeartIcon } from '@/components/icons/heart-icon';
import { ThemedText } from '@/components/themed-text';
import { cn } from '@/lib/utils';
import type { CardAttribute } from '@/lib/utils/announcement-helpers';

export type AnnouncementListCardProps = {
  imageSource: any;
  title: string;
  address: string;
  attributes?: CardAttribute[];
  priceLabel: string;
  className?: string;
  isFavourite?: boolean;
  isForComparison?: boolean;
  onPress?: () => void;
  onFavouritePress?: () => void;
  onComparisonPress?: () => void;
};

export const AnnouncementListCard: React.FC<AnnouncementListCardProps> = ({
  imageSource,
  title,
  address,
  attributes,
  priceLabel,
  className,
  isFavourite = false,
  isForComparison = false,
  onPress,
  onFavouritePress,
  onComparisonPress,
}) => {
  const Container = onPress ? Pressable : View;

  return (
    <Container
      {...(onPress ? { onPress } : {})}
      className={cn('flex-row rounded-[16px] bg-card p-[8px]', className)}
      style={listStyles.container}>
      <View style={listStyles.imageContainer}>
        <Image source={imageSource} style={listStyles.image} contentFit="cover" />
        <View className="absolute right-[6px] top-[6px] flex-row items-center gap-[4px]">
          <Pressable
            onPress={onComparisonPress}
            className={cn(
              'h-[24px] w-[24px] items-center justify-center rounded-[36px]',
              isForComparison ? 'bg-[#11111199]' : 'bg-[#1111114d]'
            )}>
            <ComparisonIcon
              width={16}
              height={16}
              stroke={isForComparison ? '#13B86D' : 'white'}
              fill={isForComparison ? '#13B86D' : 'white'}
            />
          </Pressable>
          <Pressable
            onPress={onFavouritePress}
            className={cn(
              'h-[24px] w-[24px] items-center justify-center rounded-[36px]',
              isFavourite ? 'bg-[#11111199]' : 'bg-[#1111114d]'
            )}>
            <HeartIcon
              width={14}
              height={14}
              stroke={isFavourite ? '#13B86D' : 'white'}
              fill={isFavourite ? '#13B86D' : 'none'}
            />
          </Pressable>
        </View>
      </View>

      <View style={listStyles.info}>
        <View className="gap-[4px]">
          <ThemedText
            className="text-[14px] font-bold leading-[17px] text-foreground"
            numberOfLines={2}>
            {title}
          </ThemedText>
          <ThemedText className="text-[10px] text-muted-foreground" numberOfLines={1}>
            {address}
          </ThemedText>
        </View>

        <View className="flex-row flex-wrap items-center gap-[8px]">
          {attributes
            ?.filter((attr) => attr.label !== '')
            .map((attr, index) => (
              <View key={index} className="flex-row items-center gap-[4px]">
                <Image source={attr.icon} style={listStyles.icon} contentFit="contain" />
                <ThemedText className="text-[10px] text-foreground">{attr.label}</ThemedText>
              </View>
            ))}
        </View>

        <View className="flex-row items-center justify-between">
          <ThemedText
            className="text-[14px] font-bold leading-[17px] text-foreground"
            numberOfLines={1}>
            {priceLabel}
          </ThemedText>
          <View className="h-[18px] w-[18px] items-center justify-center rounded-full bg-main-500">
            <Image
              source={require('@/assets/images/arrow-up-right-icon.svg')}
              style={listStyles.arrowIcon}
              contentFit="contain"
            />
          </View>
        </View>
      </View>
    </Container>
  );
};

const listStyles = StyleSheet.create({
  container: {
    shadowColor: '#6E6E6E',
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 33,
    elevation: 4,
  },
  imageContainer: {
    width: 126,
    height: 101,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F1F1F1',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  info: {
    flex: 1,
    gap: 8,
    paddingLeft: 12,
    justifyContent: 'center',
  },
  icon: {
    width: 12,
    height: 12,
  },
  arrowIcon: {
    width: 12,
    height: 12,
  },
});
