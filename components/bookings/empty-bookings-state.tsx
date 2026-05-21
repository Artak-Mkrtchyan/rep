import { Image } from 'expo-image';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

/**
 * Empty state shown when the user has no bookings.
 * Figma `12521:120892` — "You don't have any bookings".
 */
export const EmptyBookingsState: React.FC = () => {
  const { t } = useTranslation();
  return (
    <View className="flex-1 items-center justify-center px-6">
      <Image
        source={require('@/assets/images/no-application-illustration.svg')}
        style={{ width: 252, height: 168 }}
        contentFit="contain"
        accessibilityLabel={t('booking.empty.title')}
      />
      <ThemedText className="mt-6 text-center text-[18px] font-semibold leading-[22px] text-foreground">
        {t('booking.empty.title')}
      </ThemedText>
    </View>
  );
};
