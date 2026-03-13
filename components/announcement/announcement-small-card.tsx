import { Image } from 'expo-image';
import React from 'react';
import { Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { cn } from '@/lib/utils';

export type AnnouncementSmallCardProps = {
  imageSource: any;
  title: string;
  address: string;
  bedsLabel: string;
  bathsLabel: string;
  sizeLabel: string;
  priceLabel: string;
  className?: string;
};

export const AnnouncementSmallCard: React.FC<AnnouncementSmallCardProps> = ({
  imageSource,
  title,
  address,
  bedsLabel,
  bathsLabel,
  sizeLabel,
  priceLabel,
  className,
}) => {
  return (
    <View
      className={cn('w-full rounded-[16px] bg-card px-[12px] py-[8px]', className)}
      style={{
        shadowColor: '#6E6E6E',
        shadowOffset: { width: 2, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 33,
        elevation: 4,
      }}>
      <View className="mb-2 h-[97px] w-full overflow-hidden rounded-[8px] bg-muted">
        <Image source={imageSource} className="h-full w-full" contentFit="cover" />
        <View className="absolute right-[8px] top-[8px]  flex-row items-center gap-[8px]">
          <Pressable className="h-[20px] w-[20px] items-center justify-center rounded-[36px] bg-[#1111114d]">
            <Image
              source={require('@/assets/images/menu-icon.svg')}
              style={{
                width: 16,
                height: 16,
                tintColor: 'white',
              }}
              contentFit="contain"
            />
          </Pressable>
          <Pressable className="h-[20px] w-[20px] items-center justify-center rounded-[36px] bg-[#1111114d]">
            <Image
              source={require('@/assets/images/heart-icon.svg')}
              style={{
                width: 16,
                height: 16,
                tintColor: 'white',
              }}
              contentFit="contain"
            />
          </Pressable>
        </View>
      </View>

      <View className="gap-2">
        <View className="gap-1">
          <ThemedText className="text-[14px] font-bold leading-[17px] text-foreground">
            {title}
          </ThemedText>
          <ThemedText className="text-[8px] text-muted-foreground">{address}</ThemedText>
        </View>

        <View className="flex-row flex-wrap items-center justify-between gap-2">
          <View className="flex-row items-center gap-1">
            <Image
              source={require('@/assets/images/announcement-icons/bed-icon.svg')}
              style={{ width: 12, height: 12 }}
              contentFit="contain"
            />
            <ThemedText className="text-[10px] text-foreground">{bedsLabel}</ThemedText>
          </View>
          <View className="flex-row items-center gap-1">
            <Image
              source={require('@/assets/images/announcement-icons/bath-icon.svg')}
              style={{ width: 12, height: 12 }}
              contentFit="contain"
            />
            <ThemedText className="text-[10px] text-foreground">{bathsLabel}</ThemedText>
          </View>
          <View className="flex-row items-center gap-1">
            <Image
              source={require('@/assets/images/announcement-icons/size-icon.svg')}
              style={{ width: 12, height: 12 }}
              contentFit="contain"
            />
            <ThemedText className="text-[10px] text-foreground">{sizeLabel}</ThemedText>
          </View>
        </View>

        <View className="mt-1 flex-row items-center justify-between">
          <ThemedText className="text-[14px] font-bold leading-[17px] text-foreground">
            {priceLabel}
          </ThemedText>
          <View className="h-[18px] w-[18px] items-center justify-center rounded-full bg-main-500">
            <Image
              source={require('@/assets/images/arrow-up-right-icon.svg')}
              style={{ width: 16, height: 16 }}
              contentFit="contain"
            />
          </View>
        </View>
      </View>
    </View>
  );
};
