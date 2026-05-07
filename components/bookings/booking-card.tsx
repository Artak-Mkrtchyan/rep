import { Image } from 'expo-image';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { initialsFrom } from '@/lib/utils/initials';
import { ServiceType, type BookingListItem } from '@/types/bookings';

import { BookingStatusBadge } from './booking-status-badge';
import { formatDateTime } from './format';

const CARD_SHADOW = {
  shadowColor: '#6E6E6E',
  shadowOffset: { width: 2, height: 3 },
  shadowOpacity: 0.15,
  shadowRadius: 33,
  elevation: 4,
};

interface Props {
  booking: BookingListItem;
  onPress?: () => void;
}

/**
 * Booking row card for the bookings list screen.
 *
 * Figma `12353:30220`. Top row shows the assignee (avatar/initials, name, phone)
 * plus a status chip; bottom row shows the service-provider type, public ID,
 * and the scheduled time.
 */
export const BookingCard: React.FC<Props> = ({ booking, onPress }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const assignee = booking.assignee;
  const avatarUri = assignee?.avatarInfo?.thumbnailUrl?.trim() || assignee?.avatarInfo?.url?.trim();
  const assigneeName = assignee?.fullName?.trim() ?? '';
  const assigneePhone = assignee?.phone?.trim() ?? '';

  const providerLabel =
    booking.type.code === ServiceType.PHOTO_SHOOT
      ? t('booking.service_provider.photographer')
      : t('booking.service_provider.assessment_expert');

  const Container = onPress ? Pressable : View;

  return (
    <Container
      {...(onPress ? { onPress, accessibilityRole: 'button' as const } : {})}
      className="rounded-2xl border border-neutral-50 bg-white p-4"
      style={CARD_SHADOW}>
      <View className="flex-row items-start justify-between gap-3">
        {assignee ? (
          <View className="min-w-0 flex-1 flex-row items-center gap-3">
            <View className="h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-neutral-100">
              {avatarUri ? (
                <Image
                  source={{ uri: avatarUri }}
                  style={{ width: 40, height: 40 }}
                  contentFit="cover"
                  accessibilityLabel={assigneeName}
                />
              ) : (
                <ThemedText className="text-[12px] font-bold text-neutral-600">
                  {initialsFrom(assigneeName || '?')}
                </ThemedText>
              )}
            </View>
            <View className="min-w-0 flex-1">
              <ThemedText
                className="text-[16px] font-bold leading-[19px] text-foreground"
                numberOfLines={1}>
                {assigneeName}
              </ThemedText>
              {assigneePhone ? (
                <ThemedText
                  className="text-[14px] leading-[17px] text-foreground"
                  numberOfLines={1}>
                  {assigneePhone}
                </ThemedText>
              ) : null}
            </View>
          </View>
        ) : (
          <View className="min-w-0 flex-1" />
        )}

        <BookingStatusBadge
          status={booking.status.code}
          fallback={booking.status.name}
        />
      </View>

      <View className="mt-3 flex-row items-end justify-between gap-3">
        <View className="min-w-0 flex-1">
          <ThemedText
            className="text-[14px] font-bold leading-[17px] text-foreground"
            numberOfLines={1}>
            {providerLabel}
          </ThemedText>
          <View className="mt-1 flex-row flex-wrap items-baseline gap-x-1">
            <ThemedText className="text-[12px] font-bold leading-[14px] text-primary">
              {t('booking.id_label')}:
            </ThemedText>
            <ThemedText
              className="text-[12px] leading-[14px] text-foreground"
              numberOfLines={1}>
              {booking.publicId}
            </ThemedText>
          </View>
        </View>

        <View className="items-end">
          <ThemedText className="text-[12px] leading-[14px] text-neutral-400">
            {t('booking.details.scheduled_time')}
          </ThemedText>
          <ThemedText className="text-[14px] leading-[17px] text-foreground" numberOfLines={1}>
            {formatDateTime(booking.minScheduledTime, lang)}
          </ThemedText>
        </View>
      </View>
    </Container>
  );
};
