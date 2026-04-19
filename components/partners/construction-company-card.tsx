import { Image } from 'expo-image';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { cn } from '@/lib/utils';
import { initialsFrom } from '@/lib/utils/initials';
import { formatDateDisplay } from '@/lib/profile/personal-information-helpers';
import type { AvatarInfo } from '@/types/applications';

interface ConstructionCompanyCardProps {
  name: string;
  email: string;
  phoneNumber: string;
  certifiedOn?: string;
  yearsOfActivity?: number;
  avatarInfo?: AvatarInfo;
  onPress?: () => void;
}

const CARD_SHADOW = {
  shadowColor: '#6E6E6E',
  shadowOffset: { width: 2, height: 3 },
  shadowOpacity: 0.15,
  shadowRadius: 33,
  elevation: 4,
};

const AvatarWithFallback = ({ uri, name }: { uri?: string; name: string }) => {
  const [failed, setFailed] = useState(false);
  const showImage = !!uri && uri.length > 0 && !failed;

  if (showImage) {
    return (
      <Image
        source={{ uri }}
        style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: '#E5E5E5' }}
        contentFit="cover"
        onError={() => setFailed(true)}
        accessibilityLabel={`Avatar of ${name}`}
      />
    );
  }

  return (
    <View className="h-[42px] w-[42px] items-center justify-center rounded-full bg-muted">
      <ThemedText className="text-[16px] font-bold text-neutral-600">
        {initialsFrom(name)}
      </ThemedText>
    </View>
  );
};

export const ConstructionCompanyCard: React.FC<ConstructionCompanyCardProps> = ({
  name,
  email,
  phoneNumber,
  certifiedOn,
  yearsOfActivity,
  avatarInfo,
  onPress,
}) => {
  const { t } = useTranslation();

  const content = (
    <>
      <View className="flex-row items-start gap-3">
        <AvatarWithFallback uri={avatarInfo?.thumbnailUrl} name={name} />

        <View className="min-w-0 flex-1">
          <ThemedText
            className="text-[16px] font-bold leading-tight text-foreground"
            numberOfLines={1}>
            {name}
          </ThemedText>
          <ThemedText className="text-[14px] text-neutral-500" numberOfLines={1}>
            {email}
          </ThemedText>
          <ThemedText className="text-[14px] font-medium text-foreground">
            {phoneNumber}
          </ThemedText>
        </View>
      </View>

      {(yearsOfActivity !== undefined || certifiedOn) && (
        <View className="flex-row flex-wrap items-center gap-x-4">
          {yearsOfActivity !== undefined && (
            <ThemedText className="text-[12px] text-neutral-500">
              {t('partners.years_of_activity', { count: yearsOfActivity })}
            </ThemedText>
          )}
          {certifiedOn && (
            <ThemedText className="text-[12px] text-neutral-500">
              {t('partners.certified_on', { date: formatDateDisplay(certifiedOn) })}
            </ThemedText>
          )}
        </View>
      )}
    </>
  );

  const cardClassName = cn('w-full flex-col gap-3 rounded-[16px] bg-card p-[16px]');

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        className={cardClassName}
        style={CARD_SHADOW}
        accessibilityRole="button"
        accessibilityLabel={`${name}, ${email}`}>
        {content}
      </Pressable>
    );
  }

  return (
    <View className={cardClassName} style={CARD_SHADOW}>
      {content}
    </View>
  );
};
