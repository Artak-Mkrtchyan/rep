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
  postedDate?: string;
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
  postedDate,
}) => {
  const { t } = useTranslation();
  const displayStatus = statusLabel || t('announcement.detail.status_active');

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
          className="ml-2 flex-row items-center gap-[4px] rounded-[4px] bg-[#E3FEDE] px-[12px] py-[6px]"
          accessibilityRole="button"
          accessibilityLabel={`Status: ${displayStatus}`}>
          <Image
            source={require('@/assets/images/success-icon.svg')}
            style={detailStyles.statusIcon}
            contentFit="contain"
          />
          <ThemedText className="text-[12px] text-[#5EBC39]">
            {displayStatus}
          </ThemedText>
          <Image
            source={require('@/assets/images/chevron-down-icon.svg')}
            style={detailStyles.chevronIcon}
            contentFit="contain"
          />
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
            name="—"
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
            name="—"
            label={t('announcement.detail.updated')}
            labelClassName="text-[10px]"
            nameClassName="text-[12px] font-bold text-foreground"
          />
        </View>
      </AnnouncementCard>
    </View>
  );
};
