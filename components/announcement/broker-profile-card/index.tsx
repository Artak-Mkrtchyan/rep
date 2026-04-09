import { Image } from 'expo-image';
import React from 'react';
import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { cn } from '@/lib/utils';

import type { BrokerProfileCardProps } from './types';

const CARD_SHADOW = {
  shadowColor: '#6E6E6E',
  shadowOffset: { width: 2, height: 3 },
  shadowOpacity: 0.15,
  shadowRadius: 33,
  elevation: 4,
};

const initialsFrom = (fullName: string): string => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]![0] ?? ''}${parts[1]![0] ?? ''}`.toUpperCase().slice(0, 2);
  }
  return fullName.slice(0, 2).toUpperCase() || '?';
};

export const BrokerProfileCard: React.FC<BrokerProfileCardProps> = ({
  avatar,
  name,
  phone,
  email,
  rating,
  reviewCount,
  className,
}) => (
  <View className={cn('w-full rounded-[16px] bg-white', className)} style={CARD_SHADOW}>
    <View className="relative w-full items-center overflow-hidden rounded-[16px] py-[32px]">
      {/* Decorative green ellipse at top */}
      <View
        className="absolute rounded-full bg-primary"
        style={{
          width: 398,
          height: 398,
          left: -20,
          top: -267,
        }}
        pointerEvents="none"
      />

      <View className="w-[233px] items-center gap-4">
        <View className="h-[125px] w-[125px] items-center justify-center rounded-full bg-muted">
          {avatar ? (
            <Image
              source={avatar}
              className="h-[125px] w-[125px] rounded-full bg-muted"
              contentFit="cover"
              accessibilityLabel={`Avatar of ${name}`}
            />
          ) : (
            <ThemedText className="text-[40px] font-bold text-neutral-600">
              {initialsFrom(name)}
            </ThemedText>
          )}
        </View>

        <View className="items-center gap-3">
          <ThemedText
            className="text-center text-[20px] font-bold leading-6 text-foreground"
            numberOfLines={1}>
            {name}
          </ThemedText>

          <View className="items-center gap-3 opacity-80">
            <View className="flex-row items-center gap-1">
              <Image
                source={require('@/assets/images/phone-icon.svg')}
                style={{ width: 16, height: 16 }}
                contentFit="contain"
              />
              <ThemedText className="text-[14px] leading-5 text-foreground">{phone}</ThemedText>
            </View>
            <View className="flex-row items-center gap-1">
              <Image
                source={require('@/assets/images/mail-icon.svg')}
                style={{ width: 16, height: 16 }}
                contentFit="contain"
              />
              <ThemedText className="text-[14px] leading-5 text-foreground">{email}</ThemedText>
            </View>
          </View>
        </View>

        <View className="flex-row items-center gap-1">
          <ThemedText className="text-[14px] font-semibold leading-[17px] text-foreground">
            {rating.toFixed(1)}
          </ThemedText>
          <Image
            source={require('@/assets/images/rating-star-icon.svg')}
            style={{ width: 18, height: 18 }}
            contentFit="contain"
          />
          <ThemedText className="text-[10px] leading-normal text-foreground">
            ({reviewCount})
          </ThemedText>
        </View>
      </View>
    </View>
  </View>
);

export type { BrokerProfileCardProps } from './types';
