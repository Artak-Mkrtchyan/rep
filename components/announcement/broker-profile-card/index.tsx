import { Image as ExpoImage } from 'expo-image';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { cn } from '@/lib/utils';
import { initialsFrom } from '@/lib/utils/initials';

import type { BrokerProfileCardProps } from './types';

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

export const BrokerProfileCard: React.FC<BrokerProfileCardProps> = ({
  avatar,
  name,
  phone,
  email,
  certifiedOn,
  certifiedBy,
  yearsOfActivity,
  rating,
  reviewCount,
  className,
}) => {
  const { t } = useTranslation();
  const [avatarFailed, setAvatarFailed] = useState(false);
  const avatarSource = typeof avatar === 'string' ? { uri: avatar } : avatar;
  const showAvatar = !!avatarSource && !avatarFailed;
  const hasRating = typeof rating === 'number';

  return (
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
            {showAvatar ? (
              <Image
                source={avatarSource}
                style={{ width: 125, height: 125, borderRadius: 62.5, backgroundColor: '#E5E5E5' }}
                resizeMode="cover"
                onError={() => setAvatarFailed(true)}
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
                <ExpoImage
                  source={require('@/assets/images/phone-icon.svg')}
                  style={{ width: 16, height: 16 }}
                  contentFit="contain"
                />
                <ThemedText className="text-[14px] leading-5 text-foreground">{phone}</ThemedText>
              </View>
              <View className="flex-row items-center gap-1">
                <ExpoImage
                  source={require('@/assets/images/mail-icon.svg')}
                  style={{ width: 16, height: 16 }}
                  contentFit="contain"
                />
                <ThemedText className="text-[14px] leading-5 text-foreground">{email}</ThemedText>
              </View>
            </View>

            {(certifiedOn || certifiedBy || yearsOfActivity !== undefined) && (
              <View className="mt-2 items-center gap-1.5 border-t border-neutral-100 pt-2 w-full">
                {certifiedOn ? (
                  <ThemedText className="text-[13px] text-neutral-500">
                    {t('profile.certified_on')}:{' '}
                    <ThemedText className="font-semibold text-foreground">{formatDate(certifiedOn)}</ThemedText>
                  </ThemedText>
                ) : null}
                {certifiedBy ? (
                  <ThemedText className="text-[13px] text-neutral-500">
                    {t('profile.certified_by')}:{' '}
                    <ThemedText className="font-semibold text-foreground">{certifiedBy}</ThemedText>
                  </ThemedText>
                ) : null}
                {yearsOfActivity !== undefined ? (
                  <ThemedText className="text-[13px] text-neutral-500">
                    {t('profile.years_of_activity')}:{' '}
                    <ThemedText className="font-semibold text-foreground">{yearsOfActivity}</ThemedText>
                  </ThemedText>
                ) : null}
              </View>
            )}
          </View>

          {hasRating && (
            <View className="flex-row items-center gap-1">
              <ThemedText className="text-[14px] font-semibold leading-[17px] text-foreground">
                {rating.toFixed(1)}
              </ThemedText>
              <ExpoImage
                source={require('@/assets/images/rating-star-icon.svg')}
                style={{ width: 18, height: 18 }}
                contentFit="contain"
              />
              {typeof reviewCount === 'number' && (
                <ThemedText className="text-[10px] leading-normal text-foreground">
                  ({reviewCount})
                </ThemedText>
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export type { BrokerProfileCardProps } from './types';
