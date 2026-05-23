import { Image as ExpoImage } from 'expo-image';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Pressable, View } from 'react-native';

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

function formatDate(dateStr?: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

export const BrokerCard: React.FC<BrokerCardProps> = ({
  isSelected = false,
  avatar,
  name,
  phone,
  email,
  certifiedOn,
  certifiedBy,
  yearsOfActivity,
  rating,
  reviewCount,
  stats,
  className,
  onPress,
}) => {
  const { t } = useTranslation();
  const [avatarFailed, setAvatarFailed] = useState(false);
  const avatarSource = typeof avatar === 'string' ? { uri: avatar } : avatar;
  const showAvatar = !!avatarSource && !avatarFailed;
  const hasRating = typeof rating === 'number';
  const hasStats = stats && stats.length > 0;

  const content = (
    <View className="flex-col gap-3">
      <View className="flex-row items-start gap-3">
        <View className="h-[48px] w-[48px] items-center justify-center rounded-full bg-muted">
          {showAvatar ? (
            <Image
              source={avatarSource}
              style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#E5E5E5' }}
              resizeMode="cover"
              onError={() => setAvatarFailed(true)}
              accessibilityLabel={`Avatar of ${name}`}
            />
          ) : (
            <ThemedText className="text-[18px] font-bold text-neutral-600">
              {initialsFrom(name)}
            </ThemedText>
          )}
        </View>

        <View className="min-w-0 flex-1 flex-col gap-1">
          <View className="flex-row items-center justify-between gap-2">
            <ThemedText
              className="flex-1 text-[16px] font-bold leading-tight text-foreground"
              numberOfLines={1}>
              {name}
            </ThemedText>
            {hasRating && (
              <View className="flex-row items-center gap-1">
                <ThemedText className="text-[14px] font-medium leading-5 text-foreground">
                  {rating.toFixed(1)}
                </ThemedText>
                <ExpoImage
                  source={require('@/assets/images/rating-star-icon.svg')}
                  style={{ width: 16, height: 16 }}
                  contentFit="contain"
                />
                {typeof reviewCount === 'number' && (
                  <ThemedText className="text-[14px] leading-6 text-foreground">
                    ({reviewCount})
                  </ThemedText>
                )}
              </View>
            )}
          </View>
          {email ? (
            <ThemedText className="text-[13px] text-neutral-500" numberOfLines={1}>
              {email}
            </ThemedText>
          ) : null}
          {phone ? (
            <ThemedText className="text-[13px] text-neutral-500">
              {phone}
            </ThemedText>
          ) : null}
        </View>
      </View>

      {(yearsOfActivity !== undefined || certifiedOn) && (
        <View className="flex-row flex-wrap items-center justify-between gap-2 pt-1">
          {yearsOfActivity !== undefined ? (
            <ThemedText className="text-[12px] text-neutral-500">
              {t('partners.years_of_activity', { count: yearsOfActivity })}
            </ThemedText>
          ) : (
            <View />
          )}
          {certifiedOn ? (
            <ThemedText className="text-[12px] text-neutral-500">
              {certifiedBy
                ? `${t('partners.certified_on', { date: formatDate(certifiedOn) })} от ${certifiedBy}`
                : t('partners.certified_on', { date: formatDate(certifiedOn) })}
            </ThemedText>
          ) : null}
        </View>
      )}

      {hasStats && (
        <View className="flex-col gap-2 pt-2">
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
      )}
    </View>
  );

  const cardClassName = cn('w-full flex-col gap-4 rounded-[16px] bg-card p-[16px]', className);

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        className={cn(cardClassName, isSelected && 'border-2 border-primary')}
        style={CARD_SHADOW}
        accessibilityRole="button"
        accessibilityLabel={hasRating ? `Broker ${name}, rating ${rating}` : `Broker ${name}`}>
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
