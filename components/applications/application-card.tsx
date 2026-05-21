import { Image } from 'expo-image';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import type { AnnouncementPublicationListResponse } from '@/lib/api/applications';
import { cn, formatNumericString } from '@/lib/utils';
import { initialsFrom } from '@/lib/utils/initials';

import { useAuth } from '@/context/AuthContext';
import { AuthScope } from '@/types/auth';
import type { ApplicationCardProps } from './application-card.types';

type StatusTone = 'approved' | 'neutral' | 'warning' | 'danger' | 'submitted';

const CARD_SHADOW = {
  shadowColor: '#6E6E6E',
  shadowOffset: { width: 2, height: 3 },
  shadowOpacity: 0.15,
  shadowRadius: 33,
  elevation: 4,
};

const STATUS_BADGE: Record<StatusTone, { container: string; text: string }> = {
  approved: { container: 'bg-green-50', text: 'text-green-500' },
  neutral: { container: 'bg-neutral-50', text: 'text-neutral-300' },
  warning: { container: 'bg-blue-50', text: 'text-blue-500' },
  submitted: { container: 'bg-purple-50', text: 'text-purple-500' },
  danger: { container: 'bg-red-50', text: 'text-red-500' },
};

const mapStatusCodeToTone = (code?: string): StatusTone => {
  const c = (code ?? '').toUpperCase();
  if (c === 'APPROVED' || c === 'COMPLETED') {
    return 'approved';
  }
  if (c === 'REJECTED') {
    return 'danger';
  }
  if (c === 'RETURNED_TO_APPLICANT') {
    return 'warning';
  }
  if (c === 'SUBMITTED') {
    return 'submitted';
  }
  return 'neutral';
};

const formatPriceLabel = (item: Partial<AnnouncementPublicationListResponse>): string => {
  const rent = item.rentDetails?.monthlyRent;
  if (rent != null && !Number.isNaN(rent) && rent > 0) {
    return `$ ${formatNumericString(rent.toString())} / mo`;
  }
  const sale = item.saleDetails?.price;
  if (sale != null && !Number.isNaN(sale) && sale > 0) {
    return `$ ${formatNumericString(sale.toString())}`;
  }
  return '';
};

const getAddress = (item: Partial<AnnouncementPublicationListResponse>): string => {
  const g = item.geo;
  if (g?.formattedAddress?.trim()) {
    return g.formattedAddress.trim();
  }
  const parts = [g?.street, g?.locality, g?.province].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : '';
};

type PersonRef = { fullName?: string; id?: string } | undefined;

/** Prefer fullName; otherwise shorten technical id. */
const displayPersonName = (person: PersonRef): string => {
  if (!person) {
    return '';
  }
  const name = person.fullName?.trim();
  if (name) {
    return name;
  }
  const id = person.id?.trim();
  if (!id) {
    return '';
  }
  if (id.length > 22) {
    return `${id.slice(0, 8)}…${id.slice(-4)}`;
  }
  return id;
};

const displayBrokerName = (item: Partial<AnnouncementPublicationListResponse>): string => {
  const broker = displayPersonName(item.assignedBroker);
  if (broker !== '') {
    return broker;
  }
  const company = item.assignedBrokerCompany?.name?.trim();
  if (company) {
    return company;
  }
  const companyId = item.assignedBrokerCompany?.id?.trim();
  if (companyId && companyId.length > 22) {
    return `${companyId.slice(0, 8)}…${companyId.slice(-4)}`;
  }
  if (companyId) {
    return companyId;
  }
  return '';
};

const isRentListing = (item: Partial<AnnouncementPublicationListResponse>): boolean => {
  if (item.listingType === 'FOR_RENT') {
    return true;
  }
  const rent = item.rentDetails?.monthlyRent;
  return rent != null && !Number.isNaN(rent) && rent > 0;
};

type UserChipProps = {
  roleLabel: string;
  name: string;
  avatarUri?: string;
  nameTone?: 'default' | 'owner';
};

const ApplicationUserChip = ({
  roleLabel,
  name,
  avatarUri,
  nameTone = 'default',
}: UserChipProps) =>
  name ? (
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
          <ThemedText className="text-[8px] font-bold text-neutral-600">
            {initialsFrom(name)}
          </ThemedText>
        )}
      </View>
      <View className="min-w-0 max-w-[112px] gap-0.5">
        <ThemedText className="text-[10px] font-medium leading-[10px] text-neutral-500">
          {roleLabel}
        </ThemedText>
        <ThemedText
          className={cn(
            'text-[12px] font-bold leading-[11px]',
            nameTone === 'owner' ? 'text-main-500' : 'text-foreground'
          )}
          numberOfLines={1}>
          {name}
        </ThemedText>
      </View>
    </View>
  ) : null;

export const ApplicationCard = ({
  item,
  onPress,
  onAddBrokerPress,
  className,
}: ApplicationCardProps) => {
  const { t } = useTranslation();
  const { userInfo } = useAuth();

  const headerTitle = t('applications.announcement_application');
  const addBrokerA11y = t('applications.add_broker');

  const statusTone = useMemo(() => mapStatusCodeToTone(item.status?.code), [item.status?.code]);

  const statusLabel = useMemo(() => {
    if (item.status?.name && item.status.name.trim().length > 0) {
      return item.status.name;
    }
    const code = (item.status?.code ?? '').toUpperCase();
    const keyMap: Record<string, string> = {
      APPROVED: 'applications.status_approved',
      UNDER_REVIEW: 'applications.status_under_review',
      DRAFT: 'applications.status_draft',
      REJECTED: 'applications.status_rejected',
      RETURNED_TO_APPLICANT: 'applications.status_returned',
      SUBMITTED: 'applications.status_submitted',
      COMPLETED: 'applications.status_completed',
    };
    const key = keyMap[code];
    return key ? t(key) : t('applications.status_draft');
  }, [item.status?.code, item.status?.name, t]);

  const brokerName = useMemo(() => displayBrokerName(item), [item]);
  const ownerName = useMemo(() => displayPersonName(item?.createdBy), [item]);

  const isOwner =
    item?.createdBy && (item?.createdBy.id !== userInfo?.id || userInfo?.scope !== AuthScope.USUAL);
  const isBroker =
    item?.assignedBroker && (userInfo?.scope !== AuthScope.BROKER || Boolean(userInfo?.companyId));
  const isBrokerCompany =
    item?.assignedBrokerCompany && item?.assignedBrokerCompany.id !== userInfo?.companyId;

  const hasPersonNames = isBroker || isOwner || isBrokerCompany;

  const propertyTitle = item.title?.trim() || '';
  const address = useMemo(() => getAddress(item), [item]);
  const listingId = t('applications.listing_id', { id: item.publicId ?? item.id ?? '' });
  const priceLabel = formatPriceLabel(item);
  const rentListing = isRentListing(item);
  const listingTypeLabel = rentListing
    ? t('property_details.for_rent')
    : t('property_details.for_sale');

  const thumbnailUri =
    item.firstMediaFile?.thumbnailUrl?.trim() || item.firstMediaFile?.url?.trim();

  const badge = STATUS_BADGE[statusTone];
  const Container = onPress ? Pressable : View;

  return (
    <Container
      {...(onPress ? { onPress, accessibilityRole: 'button' as const } : {})}
      className={cn('w-full rounded-[16px]', className)}
      style={CARD_SHADOW}
      accessibilityLabel={headerTitle}>
      <View className="w-[50%] rounded-t-[16px] border border-b-0 border-neutral-50 bg-[#FFF8F0] px-4 pb-1 pt-2">
        <ThemedText className="text-center text-[12px] font-semibold text-foreground">
          {headerTitle}
        </ThemedText>
      </View>

      <View className="rounded-b-[16px] rounded-tr-[16px] border border-neutral-50 bg-white">
        <View className="px-4 py-4">
          <View className="relative h-[160px] w-full overflow-hidden rounded-[12px] bg-[#F9F9F9]">
            {thumbnailUri ? (
              <Image
                source={{ uri: thumbnailUri }}
                style={{ width: '100%', height: '100%' }}
                contentFit="cover"
                accessibilityLabel={propertyTitle}
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

          {hasPersonNames ? (
            <View className="mt-4 flex-row flex-wrap items-center gap-4 border-b border-neutral-50 py-2">
              {isBroker || isBrokerCompany ? (
                <ApplicationUserChip roleLabel={t('applications.role_broker')} name={brokerName} />
              ) : null}

              {isOwner ? (
                <ApplicationUserChip
                  roleLabel={t('applications.role_owner')}
                  name={ownerName}
                  nameTone="owner"
                />
              ) : null}
            </View>
          ) : null}

          <View className="mt-2 gap-2">
            <View className="flex-row items-start justify-between gap-3">
              <ThemedText
                className="min-w-0 flex-1 text-[16px] font-bold leading-tight text-foreground"
                numberOfLines={2}>
                {propertyTitle}
              </ThemedText>
              <View className="shrink-0 flex-row items-center gap-1">
                <View
                  className={cn(
                    'h-[20px] w-[20px] rounded-full',
                    rentListing ? 'bg-green-500' : 'bg-red-500'
                  )}
                  accessibilityElementsHidden
                />
                <ThemedText className="text-[14px] font-bold leading-[17px] text-neutral-800">
                  {listingTypeLabel}
                </ThemedText>
              </View>
            </View>

            <ThemedText className="text-[12px] font-normal leading-normal text-neutral-500">
              {address}
            </ThemedText>

            <View className="gap-1">
              <ThemedText className="text-[12px] font-medium leading-[11px] text-foreground">
                {listingId}
              </ThemedText>
              <ThemedText className="text-[14px] font-bold leading-[17px] text-foreground">
                {priceLabel}
              </ThemedText>
            </View>

            {onAddBrokerPress && !brokerName ? (
              <View className="mt-1 flex-row justify-end">
                <Pressable
                  onPress={onAddBrokerPress}
                  className="h-8 w-8 items-center justify-center rounded-[20px] border border-main-500 bg-neutral-50"
                  accessibilityRole="button"
                  accessibilityLabel={addBrokerA11y}
                  hitSlop={8}>
                  <Image
                    source={require('@/assets/images/add-person-icon.svg')}
                    style={{ width: 18, height: 16 }}
                    contentFit="contain"
                  />
                </Pressable>
              </View>
            ) : null}
          </View>
        </View>
      </View>
    </Container>
  );
};
