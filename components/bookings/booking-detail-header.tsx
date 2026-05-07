import { Image } from 'expo-image';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { initialsFrom } from '@/lib/utils/initials';
import { type BookingDetails, ServiceType } from '@/types/bookings';

import { BookingStatusBadge } from './booking-status-badge';
import { formatDateTimeRange } from './format';

interface Props {
  booking: BookingDetails;
}

const InfoRow: React.FC<{ value: string; href: string; ariaLabel: string }> = ({
  value,
  href,
  ariaLabel,
}) => (
  <Pressable onPress={() => Linking.openURL(href)} accessibilityRole="link" accessibilityLabel={ariaLabel}>
    <ThemedText className="text-[14px] leading-[17px] text-foreground" numberOfLines={1}>
      {value}
    </ThemedText>
  </Pressable>
);

/**
 * Top section of the booking detail screen — assignee chip + scheduled time
 * + status pill, plus an alert for unassigned bookings.
 *
 * Figma `6736:116390` (with assignee) and `12196:115677` (no assignee).
 */
export const BookingDetailHeader: React.FC<Props> = ({ booking }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const assignee = booking.assignee;
  const avatarUri = assignee?.avatarInfo?.thumbnailUrl?.trim() || assignee?.avatarInfo?.url?.trim();
  const providerLabel =
    booking.type === ServiceType.PHOTO_SHOOT
      ? t('booking.service_provider.photographer')
      : t('booking.service_provider.assessment_expert');

  return (
    <View className="gap-4">
      {!assignee ? (
        <View className="rounded-[12px] border border-orange-500 bg-[#FFFAF1] p-3">
          <View className="flex-row gap-2">
            <ThemedText className="text-[16px]">⓵</ThemedText>
            <View className="min-w-0 flex-1">
              <ThemedText className="text-[14px] font-semibold text-foreground">
                {t('booking.details.no_assigned_provider')}
              </ThemedText>
              <ThemedText className="mt-1 text-[12px] leading-[16px] text-neutral-700">
                {t('booking.details.provider_assignment_note')}
              </ThemedText>
            </View>
          </View>
        </View>
      ) : null}

      <View className="flex-row items-start gap-3">
        {assignee ? (
          <View className="flex-row items-center gap-3">
            <View className="h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-neutral-100">
              {avatarUri ? (
                <Image
                  source={{ uri: avatarUri }}
                  style={{ width: 48, height: 48 }}
                  contentFit="cover"
                  accessibilityLabel={assignee.fullName}
                />
              ) : (
                <ThemedText className="text-[14px] font-bold text-neutral-600">
                  {initialsFrom(assignee.fullName || '?')}
                </ThemedText>
              )}
            </View>
            <View className="min-w-0 flex-1 gap-0.5">
              <ThemedText
                className="text-[16px] font-bold leading-[19px] text-foreground"
                numberOfLines={1}>
                {assignee.fullName}
              </ThemedText>
              {assignee.phone ? (
                <InfoRow
                  value={assignee.phone}
                  href={`tel:${assignee.phone}`}
                  ariaLabel={t('common.call')}
                />
              ) : null}
              {assignee.email ? (
                <InfoRow
                  value={assignee.email}
                  href={`mailto:${assignee.email}`}
                  ariaLabel={t('common.email')}
                />
              ) : null}
            </View>
          </View>
        ) : null}
        <View className="ml-auto">
          <BookingStatusBadge status={booking.status.code} fallback={booking.status.name} />
        </View>
      </View>

      <View className="flex-row gap-6">
        <View>
          <ThemedText className="text-[14px] font-bold text-foreground">{providerLabel}</ThemedText>
          <View className="mt-1 flex-row flex-wrap items-baseline gap-x-1">
            <ThemedText className="text-[12px] font-bold text-primary">
              {t('booking.id_label')}:
            </ThemedText>
            <ThemedText className="text-[12px] text-foreground" numberOfLines={1}>
              {booking.publicId}
            </ThemedText>
          </View>
        </View>
        <View className="min-w-0 flex-1">
          <ThemedText className="text-[14px] font-bold text-foreground">
            {t('booking.details.scheduled_time')}
          </ThemedText>
          <ThemedText className="mt-1 text-[12px] text-foreground" numberOfLines={2}>
            {formatDateTimeRange(booking.minScheduledTime, booking.maxScheduledTime, lang)}
          </ThemedText>
        </View>
      </View>
    </View>
  );
};
