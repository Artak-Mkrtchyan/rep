import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import type { BookingDetails } from '@/types/bookings';

import { formatAddress } from './format';

interface Props {
  booking: BookingDetails;
}

/**
 * Title / Application ID / address / listing-type / description block of the
 * booking detail screen (Figma `6736:116390`).
 */
export const BookingDetailInfo: React.FC<Props> = ({ booking }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const address = formatAddress(booking.geo, lang);
  const isForRent = booking.listingType === 'FOR_RENT';
  const listingDotColor = isForRent ? 'bg-green-500' : 'bg-red-500';

  return (
    <View className="gap-2">
      <ThemedText className="text-[20px] font-bold leading-[24px] text-foreground">
        {booking.title}
      </ThemedText>

      {booking.applicationPublicId ? (
        <View className="flex-row flex-wrap items-baseline gap-x-1">
          <ThemedText className="text-[14px] font-bold text-primary">
            {t('booking.application_id')}:
          </ThemedText>
          <ThemedText className="text-[14px] text-foreground">
            {booking.applicationPublicId}
          </ThemedText>
        </View>
      ) : null}

      {address ? (
        <ThemedText className="text-[14px] leading-[20px] text-neutral-700">{address}</ThemedText>
      ) : null}

      <View className="flex-row items-center gap-2">
        <View className={`h-2 w-2 rounded-full ${listingDotColor}`} accessibilityElementsHidden />
        <ThemedText className="text-[14px] font-medium text-foreground">
          {isForRent ? t('property_details.for_rent') : t('property_details.for_sale')}
        </ThemedText>
      </View>

      {booking.details ? (
        <ThemedText className="mt-1 text-[14px] leading-[22px] text-neutral-700">
          {booking.details}
        </ThemedText>
      ) : null}
    </View>
  );
};
