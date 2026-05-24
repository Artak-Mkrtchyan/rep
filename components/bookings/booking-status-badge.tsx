import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { cn } from '@/lib/utils';
import { BookingStatus } from '@/types/bookings';

type BadgeStyle = { container: string; text: string };

const STATUS_STYLES: Record<BookingStatus, BadgeStyle> = {
  [BookingStatus.COMPLETED]: { container: 'bg-green-50', text: 'text-green-500' },
  [BookingStatus.CONFIRMED]: { container: 'bg-blue-50', text: 'text-blue-500' },
  [BookingStatus.IN_PROGRESS]: { container: 'bg-orange-50', text: 'text-orange-500' },
  [BookingStatus.PENDING_FOR_CONFIRMATION]: { container: 'bg-orange-50', text: 'text-orange-500' },
  [BookingStatus.CANCELLED]: { container: 'bg-yellow-50', text: 'text-yellow-500' },
  [BookingStatus.DECLINED]: { container: 'bg-red-50', text: 'text-red-500' },
  [BookingStatus.WORK_COMPLETED]: { container: 'bg-green-50', text: 'text-green-500' },
};

const STATUS_LABEL_KEY: Record<BookingStatus, string> = {
  [BookingStatus.COMPLETED]: 'booking.status.completed',
  [BookingStatus.CONFIRMED]: 'booking.status.confirmed',
  [BookingStatus.IN_PROGRESS]: 'booking.status.in_progress',
  [BookingStatus.PENDING_FOR_CONFIRMATION]: 'booking.status.pending_for_confirmation',
  [BookingStatus.CANCELLED]: 'booking.status.cancelled',
  [BookingStatus.DECLINED]: 'booking.status.declined',
  [BookingStatus.WORK_COMPLETED]: 'booking.status.work_completed',
};

interface Props {
  status: BookingStatus;
  fallback?: string;
  className?: string;
}

/**
 * Pill-shaped status chip used on `BookingCard` and the booking detail screen.
 * Figma frames `12353:30220` and `6736:116390` use these tones.
 */
export const BookingStatusBadge: React.FC<Props> = ({ status, fallback, className }) => {
  const { t } = useTranslation();
  const style = STATUS_STYLES[status] ?? STATUS_STYLES[BookingStatus.PENDING_FOR_CONFIRMATION];
  const label = t(STATUS_LABEL_KEY[status] ?? 'booking.status.pending_for_confirmation', {
    defaultValue: fallback,
  });

  return (
    <View className={cn('self-start rounded-[4px] px-3 py-1', style.container, className)}>
      <ThemedText className={cn('text-[12px] font-medium leading-[14px]', style.text)}>
        {label}
      </ThemedText>
    </View>
  );
};
