import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import type { AnnouncementPublicationResponse } from '@/lib/api/applications';
import { cn } from '@/lib/utils';

import type { ApplicationCardProps } from './application-card.types';

type StatusTone = 'approved' | 'neutral' | 'warning' | 'danger';

const CARD_SHADOW = {
  shadowColor: '#6E6E6E',
  shadowOffset: { width: 2, height: 3 },
  shadowOpacity: 0.15,
  shadowRadius: 33,
  elevation: 4,
};

const STATUS_BADGE: Record<StatusTone, { container: string; text: string }> = {
  approved: { container: 'bg-[#E3FEDE]', text: 'text-main-500' },
  neutral: { container: 'bg-neutral-100', text: 'text-neutral-800' },
  warning: { container: 'bg-amber-50', text: 'text-amber-700' },
  danger: { container: 'bg-red-50', text: 'text-red-600' },
};

const mapStatusCodeToTone = (code?: string): StatusTone => {
  const c = (code ?? '').toUpperCase();
  if (c === 'APPROVED' || c === 'PUBLISHED') {
    return 'approved';
  }
  if (c === 'REJECTED') {
    return 'danger';
  }
  if (c === 'RETURNED' || c === 'RETURNED_APPLICATION') {
    return 'warning';
  }
  return 'neutral';
};

const formatPriceLabel = (item: Partial<AnnouncementPublicationResponse>): string => {
  const rent = item.rentDetails?.monthlyRent;
  if (rent != null && !Number.isNaN(rent) && rent > 0) {
    return `$ ${rent.toLocaleString('en-US')} / mo`;
  }
  const sale = item.saleDetails?.price;
  if (sale != null && !Number.isNaN(sale) && sale > 0) {
    return `$ ${sale.toLocaleString('en-US')}`;
  }
  return '—';
};

const formatUpdatedLabel = (iso?: string): string => {
  if (!iso) {
    return '—';
  }
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return '—';
  }
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${dd}.${mm}.${yyyy} ${hh}:${min}`;
};

const getAddress = (item: Partial<AnnouncementPublicationResponse>): string => {
  const g = item.geo;
  if (g?.formattedAddress) {
    return g.formattedAddress;
  }
  const parts = [g?.street, g?.locality, g?.province].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : '—';
};

const getPrimaryImageUri = (item: Partial<AnnouncementPublicationResponse>): string | undefined => {
  const files = item.mediaFiles;
  if (!files?.length) {
    return undefined;
  }
  const first = files[0];
  return first?.url ?? first?.thumbnailUrl;
};

const getDisplayName = (value: string | undefined, fallback: string): string => {
  if (value && value.trim().length > 0) {
    return value.trim();
  }
  return fallback;
};

/** Broker / company id from API is often a long id — show a short readable form. */
const formatBrokerDisplay = (brokerId?: string, companyId?: string): string => {
  const raw = brokerId?.trim() || companyId?.trim();
  if (!raw) {
    return '—';
  }
  if (raw.includes('@')) {
    return raw;
  }
  if (raw.length > 22) {
    return `${raw.slice(0, 8)}…${raw.slice(-4)}`;
  }
  return raw;
};

const initialsFrom = (label: string): string => {
  const parts = label.split(/[\s@._-]+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]![0] ?? ''}${parts[1]![0] ?? ''}`.toUpperCase().slice(0, 2);
  }
  return label.slice(0, 2).toUpperCase() || '?';
};

type UserChipProps = {
  roleLabel: string;
  name: string;
  avatarUri?: string;
};

const ApplicationUserChip = ({ roleLabel, name, avatarUri }: UserChipProps) => (
  <View className="flex-row items-center gap-1">
    <View className="h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-neutral-100">
      {avatarUri ? (
        <Image
          source={{ uri: avatarUri }}
          className="h-6 w-6"
          contentFit="cover"
          accessibilityLabel={name}
        />
      ) : (
        <ThemedText className="text-[8px] font-bold text-neutral-600">{initialsFrom(name)}</ThemedText>
      )}
    </View>
    <View className="min-w-0 max-w-[120px] gap-0.5">
      <ThemedText className="text-[10px] font-medium leading-[10px] text-neutral-500">{roleLabel}</ThemedText>
      <ThemedText className="text-[12px] font-bold leading-[11px] text-foreground" numberOfLines={1}>
        {name}
      </ThemedText>
    </View>
  </View>
);

export const ApplicationCard = ({ item, onPress, onAddBrokerPress, className }: ApplicationCardProps) => {
  const { t } = useTranslation();

  const headerTitle = t('applications.announcement_application');
  const updatedCaption = t('applications.updated');
  const addBrokerA11y = t('applications.add_broker');

  const statusTone = useMemo(() => mapStatusCodeToTone(item.status?.code), [item.status?.code]);

  const statusLabel = useMemo(() => {
    if (item.status?.name && item.status.name.trim().length > 0) {
      return item.status.name;
    }
    const code = (item.status?.code ?? '').toUpperCase();
    const keyMap: Record<string, string> = {
      APPROVED: 'applications.status_approved',
      PUBLISHED: 'applications.status_approved',
      UNDER_REVIEW: 'applications.status_under_review',
      PENDING: 'applications.status_under_review',
      DRAFT: 'applications.status_draft',
      REJECTED: 'applications.status_rejected',
      RETURNED: 'applications.status_returned',
      RETURNED_APPLICATION: 'applications.status_returned',
    };
    const key = keyMap[code];
    return key ? t(key) : t('applications.status_draft');
  }, [item.status?.code, item.status?.name, t]);

  const brokerName = formatBrokerDisplay(item.assignedBrokerId, item.assignedBrokerCompanyId);
  const ownerName = getDisplayName(item.applicantEmail, '—');

  const categoryTitle = item.title ?? item.propertyType ?? '—';
  const address = getAddress(item);
  const listingId = t('applications.listing_id', { id: item.publicId ?? item.id ?? '—' });
  const priceLabel = formatPriceLabel(item);
  const updatedLabel = formatUpdatedLabel(item.initiallySubmittedAt ?? item.createdAt);

  const imageUri = getPrimaryImageUri(item);
  const imageSource = imageUri ? { uri: imageUri } : undefined;

  const badge = STATUS_BADGE[statusTone];
  const Container = onPress ? Pressable : View;

  return (
    <Container
      {...(onPress ? { onPress, accessibilityRole: 'button' as const } : {})}
      className={cn('w-full overflow-hidden rounded-[16px]', className)}
      style={CARD_SHADOW}
      accessibilityLabel={headerTitle}>
      <View className="relative overflow-hidden rounded-t-[16px] border border-b-0 border-neutral-100 bg-[#FFF8F0] px-4 pb-1 pt-2">
        <ThemedText className="text-center text-[12px] font-semibold text-foreground">{headerTitle}</ThemedText>
      </View>

      <View className="rounded-b-[16px] rounded-tr-[16px] bg-white">
        <View className="flex-row items-center gap-6 border-b border-neutral-50 px-4 py-2">
          <ApplicationUserChip roleLabel={t('applications.role_broker')} name={brokerName} />
          <View className="h-6 w-px bg-neutral-100" accessibilityElementsHidden />
          <ApplicationUserChip roleLabel={t('applications.role_owner')} name={ownerName} />
        </View>

        <View className="flex-row gap-3 px-4 py-3">
          <View className="relative h-[138px] w-[145px] shrink-0 overflow-hidden rounded-[12px] bg-neutral-50">
            {imageSource ? (
              <Image
                source={imageSource}
                className="h-full w-full"
                contentFit="cover"
                accessibilityLabel={categoryTitle}
              />
            ) : (
              <View className="h-full w-full items-center justify-center bg-neutral-100" />
            )}
            {imageSource ? (
              <View className="absolute inset-0 rounded-[12px] bg-black/20" pointerEvents="none" />
            ) : null}
          </View>

          <View className="min-w-0 flex-1 gap-2">
            <View className={cn('self-start rounded px-3 py-1.5', badge.container)}>
              <ThemedText className={cn('text-[12px] font-normal', badge.text)}>{statusLabel}</ThemedText>
            </View>

            <View className="gap-2">
              <View className="gap-1">
                <View className="flex-row items-center gap-1">
                  <Image
                    source={require('@/assets/images/announcement-icons/buildingType-icon.svg')}
                    style={{ width: 12, height: 12 }}
                    contentFit="contain"
                  />
                  <ThemedText
                    className="text-[10px] font-bold leading-[11px] text-neutral-800"
                    numberOfLines={1}>
                    {categoryTitle}
                  </ThemedText>
                </View>
                <ThemedText className="text-[8px] text-neutral-500" numberOfLines={2}>
                  {address}
                </ThemedText>
              </View>

              <View className="gap-1">
                <ThemedText className="text-[12px] font-medium leading-[11px] text-foreground">
                  {listingId}
                </ThemedText>
                <ThemedText className="text-[14px] font-bold leading-[17px] text-foreground">
                  {priceLabel}
                </ThemedText>
              </View>

              <View className="flex-row items-center justify-between">
                <View className="gap-0.5">
                  <ThemedText className="text-[10px] font-normal leading-[11px] text-neutral-400">
                    {updatedCaption}
                  </ThemedText>
                  <ThemedText className="text-[12px] font-medium leading-[11px] text-neutral-800">
                    {updatedLabel}
                  </ThemedText>
                </View>
                {onAddBrokerPress ? (
                  <Pressable
                    onPress={onAddBrokerPress}
                    className="h-8 w-8 items-center justify-center rounded-[20px] border border-main-500 bg-neutral-50"
                    accessibilityRole="button"
                    accessibilityLabel={addBrokerA11y}
                    hitSlop={8}>
                    <Ionicons name="person-add-outline" size={16} color="#087443" />
                  </Pressable>
                ) : null}
              </View>
            </View>
          </View>
        </View>
      </View>
    </Container>
  );
};
