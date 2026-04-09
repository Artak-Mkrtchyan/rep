import { Image } from 'expo-image';
import React from 'react';
import { Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { cn } from '@/lib/utils';
import { initialsFrom } from '@/lib/utils/initials';

import type { BrokerCardProps } from './types';

const CARD_SHADOW = {
  shadowColor: '#6E6E6E',
  shadowOffset: { width: 2, height: 3 },
  shadowOpacity: 0.15,
  shadowRadius: 33,
  elevation: 4,
};

export const BrokerCard: React.FC<BrokerCardProps> = ({
  isSelected = false,
  avatar,
  name,
  rating,
  reviewCount,
  stats,
  className,
  onPress,
}) => {
  const content = (
    <>
      <View className="flex-row items-center gap-2">
        <View className="h-[42px] w-[42px] items-center justify-center rounded-full bg-muted">
          {avatar ? (
            <Image
              source={avatar}
              className="h-[42px] w-[42px] rounded-full bg-muted"
              contentFit="cover"
              accessibilityLabel={`Avatar of ${name}`}
            />
          ) : (
            <ThemedText className="text-[16px] font-bold text-neutral-600">
              {initialsFrom(name)}
            </ThemedText>
          )}
        </View>

        <View className="min-w-0 flex-1 flex-row items-start justify-between gap-3">
          <ThemedText
            className="w-[50%] text-[16px] font-bold leading-tight text-foreground"
            numberOfLines={1}>
            {name}
          </ThemedText>
          <View className="flex-row items-center gap-2">
            <ThemedText className="text-[14px] font-medium leading-5 text-foreground">
              {rating.toFixed(1)}
            </ThemedText>
            <Image
              source={require('@/assets/images/rating-star-icon.svg')}
              style={{ width: 18, height: 18 }}
              contentFit="contain"
            />
            <ThemedText className="text-[14px] leading-6 text-foreground">
              ({reviewCount})
            </ThemedText>
          </View>
        </View>
      </View>

      <View className="flex-col gap-2">
        <View className="flex-row flex-wrap items-center gap-4">
          {stats.map((stat, index) => (
            <View key={index} className="flex-row items-center">
              <ThemedText className="text-[12px] font-bold leading-[11px] text-foreground">
                {stat.value}{' '}
                <ThemedText className="font-regular text-[12px] leading-normal text-neutral-400">
                  {stat.label}
                </ThemedText>
              </ThemedText>
            </View>
          ))}
        </View>
      </View>
    </>
  );

  const cardClassName = cn('w-full flex-col gap-4 rounded-[16px] bg-card p-[16px]', className);

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        className={cn(cardClassName, isSelected && 'border-2 border-primary')}
        style={CARD_SHADOW}
        accessibilityRole="button"
        accessibilityLabel={`Broker ${name}, rating ${rating}`}>
        {content}
      </Pressable>
    );
  }

  return (
    <View
      className={cn(cardClassName, isSelected && 'border-2 border-primary')}
      style={CARD_SHADOW}>
      {content}
    </View>
  );
};

export type { BrokerCardProps, BrokerCardStat } from './types';
