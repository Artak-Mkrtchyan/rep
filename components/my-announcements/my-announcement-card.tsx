import { Image } from 'expo-image';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { cn } from '@/lib/utils';
import { initialsFrom } from '@/lib/utils/initials';
import { AnnouncementStatus, ClosureReason, type AnnouncementListItem } from '@/types/my-announcements';

export type MyAnnouncementCardProps = {
  item: AnnouncementListItem;
  onPress?: () => void;
  className?: string;
};

const CARD_SHADOW = {
  shadowColor: '#6E6E6E',
  shadowOffset: { width: 2, height: 3 },
  shadowOpacity: 0.15,
  shadowRadius: 33,
  elevation: 4,
};

type StatusTone = 'active' | 'given_for_rent' | 'sold_out' | 'withdrawn' | 'violation';

const STATUS_BADGE: Record<StatusTone, { container: string; text: string }> = {
  active: { container: 'bg-green-50', text: 'text-green-500' },
  given_for_rent: { container: 'bg-orange-50', text: 'text-orange-500' },
  sold_out: { container: 'bg-red-50', text: 'text-red-500' },
  withdrawn: { container: 'bg-yellow-50', text: 'text-yellow-600' },
  violation: { container: 'bg-red-50', text: 'text-red-500' },
};

const getStatusTone = (item: AnnouncementListItem): StatusTone => {
  if (item.status.code === AnnouncementStatus.ACTIVE) return 'active';
  const reason = item.closureReason?.code;
  if (reason === ClosureReason.GIVEN_FOR_RENT) return 'given_for_rent';
  if (reason === ClosureReason.SOLD_OUT) return 'sold_out';
  if (reason === ClosureReason.WITHDRAWN_FOR_OTHER_REASONS) return 'withdrawn';
  if (reason === ClosureReason.VIOLATION) return 'violation';
  return 'sold_out';
};

const getStatusLabel = (item: AnnouncementListItem): string => {
  if (item.status.code === AnnouncementStatus.ACTIVE) return item.status.name || 'Active';
  return item.closureReason?.name || item.status.name || 'Closed';
};

const formatDate = (iso?: string): string => {
  if (!iso) return '—';
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

const getAddress = (item: AnnouncementListItem): string => {
  const g = item.geo;
  if (!g) return '';
  if (g.formattedAddress?.trim()) return g.formattedAddress.trim();
  const parts = [g.street, g.locality, g.province].filter((v) => v?.trim());
  return parts.join(', ');
};

const formatPrice = (item: AnnouncementListItem): string => {
  const rent = item.rentDetails?.monthlyRent;
  if (rent != null && !Number.isNaN(rent) && rent > 0) {
    return `$ ${rent.toLocaleString('en-US')}`;
  }
  const sale = item.saleDetails?.price;
  if (sale != null && !Number.isNaN(sale) && sale > 0) {
    return `$ ${sale.toLocaleString('en-US')}`;
  }
  return '';
};

const isRentListing = (item: AnnouncementListItem): boolean => {
  if (item.listingType === 'FOR_RENT') return true;
  const rent = item.rentDetails?.monthlyRent;
  return rent != null && !Number.isNaN(rent) && rent > 0;
};

const getBrokerName = (item: AnnouncementListItem): string => {
  const broker = item.assignedBroker?.fullName?.trim();
  if (broker) return broker;
  const company = item.assignedBrokerCompany?.name?.trim();
  if (company) return company;
  return '';
};

export const MyAnnouncementCard = ({ item, onPress, className }: MyAnnouncementCardProps) => {
  const { t } = useTranslation();

  const statusTone = useMemo(() => getStatusTone(item), [item]);
  const statusLabel = useMemo(() => getStatusLabel(item), [item]);
  const brokerName = useMemo(() => getBrokerName(item), [item]);
  const address = useMemo(() => getAddress(item), [item]);
  const priceLabel = useMemo(() => formatPrice(item), [item]);
  const rentListing = isRentListing(item);
  const listingTypeLabel = rentListing
    ? t('property_details.for_rent')
    : t('property_details.for_sale');
  const thumbnailUri = item.firstMediaFile?.thumbnailUrl?.trim();
  const badge = STATUS_BADGE[statusTone];

  const Container = onPress ? Pressable : View;

  return (
    <Container
      {...(onPress ? { onPress, accessibilityRole: 'button' as const } : {})}
      className={cn('w-full rounded-[16px] bg-white', className)}
      style={CARD_SHADOW}>
      <View className="px-4 py-4">
        {/* Image with status badge */}
        <View className="relative h-[160px] w-full overflow-hidden rounded-[12px] bg-[#F9F9F9]">
          {thumbnailUri ? (
            <Image
              source={{ uri: thumbnailUri }}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
              accessibilityLabel={item.title}
            />
          ) : (
            <View className="h-full w-full items-center justify-center">
              <Image
                source={require('@/assets/images/gallery-two-icon.svg')}
                style={{ width: 92, height: 92 }}
                contentFit="contain"
              />
            </View>
          )}
          <View className="absolute right-3 top-3 z-10">
            <View className={cn('rounded px-3 py-1.5', badge.container)}>
              <ThemedText className={cn('text-[12px] font-normal', badge.text)}>
                {statusLabel}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Broker info */}
        {brokerName ? (
          <View className="mt-3 flex-row items-center gap-1 border-b border-neutral-50 pb-3">
            <View className="h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-neutral-100">
              <ThemedText className="text-[8px] font-bold text-neutral-600">
                {initialsFrom(brokerName)}
              </ThemedText>
            </View>
            <View className="min-w-0 gap-0.5">
              <ThemedText className="text-[10px] font-medium leading-[10px] text-neutral-500">
                {t('announcement.my.broker')}
              </ThemedText>
              <ThemedText
                className="text-[12px] font-bold leading-[11px] text-foreground"
                numberOfLines={1}>
                {brokerName}
              </ThemedText>
            </View>
          </View>
        ) : null}

        {/* Content */}
        <View className="mt-2 gap-2">
          {/* Title + listing type */}
          <View className="flex-row items-start justify-between gap-3">
            <ThemedText
              className="min-w-0 flex-1 text-[16px] font-bold leading-tight text-foreground"
              numberOfLines={2}>
              {item.title}
            </ThemedText>
            <View className="shrink-0 flex-row items-center gap-1">
              <View
                className={cn(
                  'h-[16px] w-[16px] rounded-full',
                  rentListing ? 'bg-green-500' : 'bg-red-500'
                )}
              />
              <ThemedText className="text-[14px] font-bold leading-[17px] text-neutral-800">
                {listingTypeLabel}
              </ThemedText>
            </View>
          </View>

          {/* Address */}
          {address ? (
            <ThemedText className="text-[12px] font-normal leading-normal text-neutral-500">
              {address}
            </ThemedText>
          ) : null}

          {/* ID + Price */}
          <View className="gap-1">
            <ThemedText className="text-[12px] font-medium leading-[11px] text-foreground">
              ID: {item.publicId}
            </ThemedText>
            {priceLabel ? (
              <ThemedText className="text-[14px] font-bold leading-[17px] text-foreground">
                {priceLabel}
              </ThemedText>
            ) : null}
          </View>

          {/* Dates row */}
          <View className="flex-row items-center justify-between">
            <View className="gap-0.5">
              <ThemedText className="text-[10px] font-medium text-neutral-400">
                {t('announcement.my.posted')}
              </ThemedText>
              <ThemedText className="text-[11px] font-medium text-neutral-600">
                {formatDate(item.createdAt)}
              </ThemedText>
            </View>
            <View className="items-end gap-0.5">
              <ThemedText className="text-[10px] font-medium text-neutral-400">
                {t('announcement.my.updated')}
              </ThemedText>
              <ThemedText className="text-[11px] font-medium text-neutral-600">
                {formatDate(item.updatedAt || item.createdAt)}
              </ThemedText>
            </View>
          </View>
        </View>
      </View>
    </Container>
  );
};
