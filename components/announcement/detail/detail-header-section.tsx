import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

import { AnnouncementCard } from '@/components/announcement/announcement-card';
import { PlacedByItem } from '@/components/announcement/placed-by-item';
import { ThemedText } from '@/components/themed-text';

import { detailStyles } from './announcement-detail.styles';

type DetailHeaderSectionProps = {
  title: string;
  publicId: string;
  typeLabel: string;
  price: string;
  statusLabel?: string;
  statusCode?: string;
  postedDate?: string;
  updatedDate?: string;
  placedByName?: string;
  onStatusPress?: () => void;
};

function formatDate(iso?: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

export const DetailHeaderSection: React.FC<DetailHeaderSectionProps> = ({
  title,
  publicId,
  typeLabel,
  price,
  statusLabel,
  statusCode,
  postedDate,
  updatedDate,
  placedByName,
  onStatusPress,
}) => {
  const { t } = useTranslation();
  const isActive = !statusCode || statusCode === 'ACTIVE';
  const displayStatus = statusLabel || t('announcement.detail.status_active');

  const badgeBg = isActive
    ? 'bg-[#E3FEDE]'
    : 'border border-red-400 bg-white';
  const badgeTextColor = isActive ? 'text-[#5EBC39]' : 'text-red-500';

  return (
    <View style={detailStyles.headerSection}>
      {/* Row 1: Title (left) + Status badge (right) */}
      <View className="flex-row items-center justify-between">
        <ThemedText
          className="flex-1 text-[20px] font-bold leading-[24px] text-foreground"
          numberOfLines={2}>
          {title}
        </ThemedText>
        <Pressable
          onPress={onStatusPress}
          disabled={!onStatusPress}
          className={`ml-2 flex-row items-center gap-[4px] rounded-[4px] px-[12px] py-[6px] ${badgeBg}`}
          accessibilityRole="button"
          accessibilityLabel={`Status: ${displayStatus}`}>
          {isActive ? (
            <Image
              source={require('@/assets/images/success-icon.svg')}
              style={detailStyles.statusIcon}
              contentFit="contain"
            />
          ) : null}
          <ThemedText className={`text-[12px] ${badgeTextColor}`}>{displayStatus}</ThemedText>
          {isActive && onStatusPress ? (
            <Image
              source={require('@/assets/images/chevron-down-icon.svg')}
              style={detailStyles.chevronIcon}
              contentFit="contain"
            />
          ) : null}
        </Pressable>
      </View>

      {/* Row 2: ID (left) + Type label (right) */}
      <View className="flex-row items-center justify-between">
        <ThemedText
          className="shrink text-[14px] font-medium leading-[20px] text-foreground"
          numberOfLines={1}>
          ID: {publicId}
        </ThemedText>
        {typeLabel ? (
          <View className="shrink-0 flex-row items-center gap-[8px]">
            <View className="h-[16px] w-[16px] rounded-full bg-destructive" />
            <ThemedText className="text-[14px] leading-[20px] text-[#303030]" numberOfLines={1}>
              {typeLabel}
            </ThemedText>
          </View>
        ) : null}
      </View>

      {/* Row 3: Price */}
      <ThemedText className="text-[20px] font-bold leading-[24px] text-main-500">
        {price}
      </ThemedText>

      {/* Announcement information card */}
      <AnnouncementCard
        className="gap-[16px] rounded-[16px] px-[16px] py-[12px]"
        title={t('announcement.detail.announcement_info')}>
        <View className="flex-row flex-wrap items-center gap-x-[16px] gap-y-[8px]">
          <PlacedByItem
            name={placedByName || '—'}
            label={t('announcement.detail.placed_by')}
            labelClassName="text-[10px]"
            nameClassName="text-[12px] font-bold text-main-500"
            icon={
              <View className="h-[32px] w-[32px] items-center justify-center rounded-full bg-muted">
                <Ionicons name="person" size={16} color="#6B7280" />
              </View>
            }
          />
          <PlacedByItem
            name={formatDate(postedDate)}
            label={t('announcement.detail.posted')}
            labelClassName="text-[10px]"
            nameClassName="text-[12px] font-bold text-foreground"
          />
          <PlacedByItem
            name={formatDate(updatedDate)}
            label={t('announcement.detail.updated')}
            labelClassName="text-[10px]"
            nameClassName="text-[12px] font-bold text-foreground"
          />
        </View>
      </AnnouncementCard>
    </View>
  );
};
