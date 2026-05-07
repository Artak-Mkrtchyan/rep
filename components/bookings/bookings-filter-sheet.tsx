import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { SearchInput } from '@/components/ui/search-input';
import { cn } from '@/lib/utils';
import {
  BookingStatus,
  ServiceType,
  type BookingsFilterValues,
  type DateFilter,
} from '@/types/bookings';

const SERVICE_PROVIDERS: { value: ServiceType; labelKey: string }[] = [
  { value: ServiceType.PHOTO_SHOOT, labelKey: 'booking.service_provider.photographer' },
  { value: ServiceType.ASSESSMENT, labelKey: 'booking.service_provider.assessment_expert' },
];

const STATUSES: { value: BookingStatus; labelKey: string }[] = [
  { value: BookingStatus.COMPLETED, labelKey: 'booking.status.completed' },
  {
    value: BookingStatus.PENDING_FOR_CONFIRMATION,
    labelKey: 'booking.status.pending_for_confirmation',
  },
  { value: BookingStatus.DECLINED, labelKey: 'booking.status.declined' },
  { value: BookingStatus.CONFIRMED, labelKey: 'booking.status.confirmed' },
  { value: BookingStatus.CANCELLED, labelKey: 'booking.status.cancelled' },
];

const DATE_PRESETS: { value: DateFilter; labelKey: string }[] = [
  { value: 'next_7_days', labelKey: 'booking.filter.date.next_7_days' },
  { value: 'this_week', labelKey: 'booking.filter.date.this_week' },
  { value: 'this_month', labelKey: 'booking.filter.date.this_month' },
];

const FOOTER_SHADOW = {
  shadowColor: '#6E6E6E',
  shadowOffset: { width: 0, height: -3 },
  shadowOpacity: 0.1,
  shadowRadius: 12,
  elevation: 4,
};

interface Chip<T> {
  value: T;
  label: string;
}

interface ToggleChipProps<T> {
  chip: Chip<T>;
  selected: boolean;
  onPress: () => void;
}

function ToggleChip<T>({ chip, selected, onPress }: ToggleChipProps<T>) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      className={cn(
        'rounded-full border px-4 py-2',
        selected ? 'border-primary bg-primary/10' : 'border-default bg-white'
      )}>
      <ThemedText
        className={cn(
          'text-[14px] leading-[17px]',
          selected ? 'font-semibold text-primary' : 'text-foreground'
        )}>
        {chip.label}
      </ThemedText>
    </Pressable>
  );
}

const endOfDay = (d: Date): Date => {
  const next = new Date(d);
  next.setHours(23, 59, 59, 999);
  return next;
};

const computeDateRange = (
  preset: DateFilter
): { min?: string; max?: string } | undefined => {
  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  if (preset === 'next_7_days') {
    const end = new Date(now);
    end.setDate(end.getDate() + 7);
    return { min: startOfToday.toISOString(), max: endOfDay(end).toISOString() };
  }
  if (preset === 'this_week') {
    // Treat week as Mon→Sun. Sunday's day-of-week is 0; shift to make Mon = 0.
    const day = (now.getDay() + 6) % 7;
    const end = new Date(now);
    end.setDate(end.getDate() + (6 - day));
    return { min: startOfToday.toISOString(), max: endOfDay(end).toISOString() };
  }
  if (preset === 'this_month') {
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { min: startOfToday.toISOString(), max: endOfDay(end).toISOString() };
  }
  return undefined;
};

interface Props {
  visible: boolean;
  initial: BookingsFilterValues;
  onApply: (values: BookingsFilterValues) => void;
  onClose: () => void;
}

/**
 * Filters sheet for the Bookings list screen (Figma `12196:114201`).
 *
 * Multi-select chips for "Service provider" and "Status"; a single-select
 * scheduled-date row with quick presets (next 7 days / this week / this month)
 * and a manual date picker for the "custom" case.
 */
export const BookingsFilterSheet: React.FC<Props> = ({ visible, initial, onApply, onClose }) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [values, setValues] = useState<BookingsFilterValues>(initial);

  useEffect(() => {
    if (visible) {
      setValues(initial);
    }
  }, [visible, initial]);

  const set = useCallback(
    <K extends keyof BookingsFilterValues>(key: K, value: BookingsFilterValues[K]) =>
      setValues((prev) => ({ ...prev, [key]: value })),
    []
  );

  const toggleProvider = useCallback((provider: ServiceType) => {
    setValues((prev) => {
      const list = prev.serviceProviders ?? [];
      const isSelected = list.includes(provider);
      const next = isSelected ? list.filter((p) => p !== provider) : [...list, provider];
      return { ...prev, serviceProviders: next.length ? next : undefined };
    });
  }, []);

  const toggleStatus = useCallback((status: BookingStatus) => {
    setValues((prev) => {
      const list = prev.status ?? [];
      const isSelected = list.includes(status);
      const next = isSelected ? list.filter((s) => s !== status) : [...list, status];
      return { ...prev, status: next.length ? next : undefined };
    });
  }, []);

  const handleDatePreset = useCallback(
    (preset: DateFilter) => {
      if (values.dateFilter === preset) {
        set('dateFilter', '');
        set('scheduledAt', undefined);
        return;
      }
      const range = computeDateRange(preset);
      set('dateFilter', preset);
      set('scheduledAt', range);
    },
    [set, values.dateFilter]
  );

  const handleCustomDate = useCallback(
    (input: string | { nativeEvent: { text: string } }) => {
      const dateString = typeof input === 'string' ? input : input?.nativeEvent?.text ?? '';
      if (!dateString) {
        set('dateFilter', '');
        set('scheduledAt', undefined);
        return;
      }
      const parsed = new Date(dateString);
      if (Number.isNaN(parsed.getTime())) return;
      const min = new Date(parsed);
      min.setHours(0, 0, 0, 0);
      const max = new Date(parsed);
      max.setHours(23, 59, 59, 999);
      set('dateFilter', 'custom');
      set('scheduledAt', { min: min.toISOString(), max: max.toISOString() });
    },
    [set]
  );

  const handleReset = useCallback(() => {
    setValues({});
  }, []);

  const handleApply = useCallback(() => {
    onApply(values);
  }, [onApply, values]);

  const customDateValue =
    values.dateFilter === 'custom' && values.scheduledAt?.min
      ? values.scheduledAt.min.slice(0, 10)
      : '';

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
      statusBarTranslucent>
      <View className="flex-1 justify-end bg-black/40">
        <Pressable
          className="absolute inset-0"
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel={t('common.close')}
        />
        <View
          className="max-h-[92%] rounded-t-[24px] bg-white"
          style={{ paddingTop: insets.top * 0.4 }}>
          <View className="flex-row items-center justify-between px-4 pb-3 pt-3">
            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              hitSlop={8}
              className="h-10 w-10 items-center justify-center">
              <Ionicons name="chevron-back" size={24} color="#111111" />
            </Pressable>
            <ThemedText className="text-[20px] font-semibold text-foreground">
              {t('booking.filter.title')}
            </ThemedText>
            <Pressable onPress={handleReset} accessibilityRole="button" hitSlop={8}>
              <ThemedText className="text-[14px] font-semibold text-primary">
                {t('booking.filter.reset')}
              </ThemedText>
            </Pressable>
          </View>

          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
            keyboardShouldPersistTaps="handled">
            {/* Search */}
            <View className="mt-2">
              <SearchInput
                placeholder={t('booking.filter.search_placeholder')}
                value={values.bookingId ?? ''}
                onChangeText={(text) => set('bookingId', text)}
              />
            </View>

            {/* Service provider */}
            <View className="mt-6">
              <ThemedText className="mb-3 text-[16px] font-semibold text-foreground">
                {t('booking.filter.service_provider')}
              </ThemedText>
              <View className="flex-row flex-wrap gap-2">
                {SERVICE_PROVIDERS.map((sp) => (
                  <ToggleChip
                    key={sp.value}
                    chip={{ value: sp.value, label: t(sp.labelKey) }}
                    selected={!!values.serviceProviders?.includes(sp.value)}
                    onPress={() => toggleProvider(sp.value)}
                  />
                ))}
              </View>
            </View>

            {/* Scheduled date */}
            <View className="mt-6">
              <ThemedText className="mb-3 text-[16px] font-semibold text-foreground">
                {t('booking.filter.scheduled_date')}
              </ThemedText>
              <DatePicker value={customDateValue} onChange={handleCustomDate} />
              <View className="mt-3 flex-row flex-wrap gap-2">
                {DATE_PRESETS.map((p) => (
                  <ToggleChip
                    key={p.value}
                    chip={{ value: p.value, label: t(p.labelKey) }}
                    selected={values.dateFilter === p.value}
                    onPress={() => handleDatePreset(p.value)}
                  />
                ))}
              </View>
            </View>

            {/* Status */}
            <View className="mt-6">
              <ThemedText className="mb-3 text-[16px] font-semibold text-foreground">
                {t('booking.filter.status')}
              </ThemedText>
              <View className="flex-row flex-wrap gap-2">
                {STATUSES.map((s) => (
                  <ToggleChip
                    key={s.value}
                    chip={{ value: s.value, label: t(s.labelKey) }}
                    selected={!!values.status?.includes(s.value)}
                    onPress={() => toggleStatus(s.value)}
                  />
                ))}
              </View>
            </View>
          </ScrollView>

          <View
            className="border-t border-neutral-50 bg-white px-4 pt-3"
            style={[FOOTER_SHADOW, { paddingBottom: insets.bottom + 12 }]}>
            <Button onPress={handleApply}>{t('booking.filter.apply')}</Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};
