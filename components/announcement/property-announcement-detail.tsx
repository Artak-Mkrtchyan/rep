import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

import { AnnouncementCard } from '@/components/announcement/announcement-card';
import { PlacedByItem } from '@/components/announcement/placed-by-item';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { INFRASTRUCTURE_ICONS } from '@/constants/announcement';
import { InfrastructureObject, InfrastructureObjectType } from '@/lib/api/infrastructure';
import { cn } from '@/lib/utils';
import { Image } from 'expo-image';

const CARD_CLASS = 'rounded-[12px] bg-card gap-[12px]';

const CONTAINER_SHADOW = {
  shadowColor: '#6E6E6E',
  shadowOffset: { width: 2, height: 3 },
  shadowOpacity: 0.15,
  shadowRadius: 33,
  elevation: 4,
};

export type PropertyAnnouncementDetailLocation = {
  country?: string;
  city?: string;
  district?: string;
  address?: string;
};

export type PropertyAnnouncementDetailDistances = {
  metro?: string;
  hospital?: string;
  school?: string;
  grocery?: string;
};

export type PropertyAnnouncementDetailProps = {
  /** Top image section (e.g. carousel or single image) */
  status?: string;
  onStatusPress?: () => void;
  onFavoritePress?: () => void;
  onMenuPress?: () => void;
  onSharePress?: () => void;
  id?: string;
  typeLabel?: string;
  title: string;
  price: string;
  placedBy?: { name: string; avatarUri?: string };
  postedDate?: string;
  updatedDate?: string;
  location?: PropertyAnnouncementDetailLocation;
  distances?: InfrastructureObject[];
  onViewMap?: () => void;
  containerClassName?: string;
};

const formatDistance = (meters: number) => {
  if (!Number.isFinite(meters)) return '—';
  if (meters < 1000) return `${meters}m`;
  return `${(meters / 1000).toFixed(1)}km`;
};

const getDistanceMeta = (type: InfrastructureObjectType) => ({
  label: `announcement.detail.${type.toLowerCase()}`,
  icon: INFRASTRUCTURE_ICONS[type.toLowerCase()],
});

export const PropertyAnnouncementDetail: React.FC<PropertyAnnouncementDetailProps> = ({
  status,
  onStatusPress,
  onFavoritePress,
  onMenuPress,
  onSharePress,
  id = '',
  typeLabel,
  title,
  price,
  placedBy,
  postedDate,
  updatedDate,
  location,
  distances,
  onViewMap,

  containerClassName,
}) => {
  const { t } = useTranslation();
  const resolvedStatus = status ?? t('announcement.detail.status_active');
  const hasDistances = Array.isArray(distances) && distances.length > 0;

  return (
    <View
      className={cn('gap-4 rounded-[16px] bg-white px-[8px] py-[16px]', containerClassName)}
      style={CONTAINER_SHADOW}>
      {/* Main property card */}
      <View className={CARD_CLASS}>
        <View className="mb-2 flex-row items-center justify-between">
          <Pressable
            onPress={onStatusPress}
            className="flex-row items-center gap-2 rounded-[4px] bg-[#E3FEDE] px-3 py-2"
            accessibilityRole="button"
            accessibilityLabel={`Status: ${resolvedStatus}`}>
            <Image
              source={require('@/assets/images/success-icon.svg')}
              style={{
                width: 16,
                height: 16,
              }}
              contentFit="contain"
            />
            <ThemedText className="text-[12px] text-primary">{resolvedStatus}</ThemedText>
            <Image
              source={require('@/assets/images/chevron-down-icon.svg')}
              style={{
                width: 12,
                height: 12,
              }}
              contentFit="contain"
            />
          </Pressable>
          <View className="flex-row items-center gap-2">
            <Pressable
              onPress={onFavoritePress}
              className="h-[36px] w-[36px] items-center justify-center rounded-[31px] bg-muted">
              <Image
                source={require('@/assets/images/heart-icon.svg')}
                style={{
                  width: 24,
                  height: 24,
                }}
                contentFit="contain"
              />
            </Pressable>
            <Pressable
              onPress={onMenuPress}
              className="h-[36px] w-[36px] items-center justify-center rounded-[31px] bg-muted">
              <Image
                source={require('@/assets/images/menu-icon.svg')}
                style={{
                  width: 24,
                  height: 24,
                }}
                contentFit="contain"
              />
            </Pressable>
            <Pressable
              onPress={onSharePress}
              className="h-[36px] w-[36px] items-center justify-center rounded-[31px] bg-muted">
              <Image
                source={require('@/assets/images/share-icon.svg')}
                style={{
                  width: 24,
                  height: 24,
                }}
                contentFit="contain"
              />
            </Pressable>
          </View>
        </View>
        <View className="mb-2 flex-row flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <ThemedText className="text-[14px] font-semibold  text-foreground">ID: {id}</ThemedText>

          {typeLabel ? (
            <View className="flex-row items-center gap-1.5">
              <View className="h-[16px] w-[16px] rounded-full bg-destructive" />
              <ThemedText className="text-[14px] text-foreground">{typeLabel}</ThemedText>
            </View>
          ) : null}
        </View>
        <ThemedText className="mb-2 text-[20px] font-bold text-foreground">{title}</ThemedText>
        <ThemedText className="text-[20px] font-bold text-main-500">{price}</ThemedText>
      </View>

      {/* Announcement information */}
      <AnnouncementCard
        className="gap-[16px] rounded-[8px] px-[16px] py-[12px]"
        title={t('announcement.detail.announcement_info')}>
        <View className="flex-row flex-wrap items-start gap-x-8 gap-y-4">
          {placedBy ? (
            <PlacedByItem
              name={placedBy.name}
              label={t('announcement.detail.placed_by')}
              nameClassName="text-main-500"
              icon={
                placedBy.avatarUri ? (
                  <Image
                    source={{ uri: placedBy.avatarUri }}
                    className="h-8 w-8 rounded-full bg-muted"
                  />
                ) : (
                  <View className="h-8 w-8 items-center justify-center rounded-full bg-muted">
                    <Ionicons name="person" size={16} color="#6B7280" />
                  </View>
                )
              }
            />
          ) : null}
          {postedDate != null ? (
            <PlacedByItem
              name={`(${postedDate})`}
              label={t('announcement.detail.posted')}
              nameClassName="text-foreground"
            />
          ) : null}
          {updatedDate != null ? (
            <PlacedByItem
              name={`(${updatedDate})`}
              label={t('announcement.detail.updated')}
              nameClassName="text-foreground"
            />
          ) : null}
        </View>
      </AnnouncementCard>

      {/* Location */}
      {location && (location.country || location.city || location.district || location.address) ? (
        <AnnouncementCard
          className="gap-[16px] rounded-[8px] px-[16px] py-[12px]"
          title={t('announcement.detail.location')}>
          <View className="flex-row flex-wrap gap-x-8 gap-y-4">
            {location.country ? (
              <PlacedByItem
                name={location.country}
                label={t('announcement.detail.country')}
                nameClassName="text-foreground"
              />
            ) : null}
            {location.city ? (
              <PlacedByItem
                name={location.city}
                label={t('announcement.detail.city')}
                nameClassName="text-foreground"
              />
            ) : null}
            {location.district ? (
              <PlacedByItem
                name={location.district}
                label={t('announcement.detail.district')}
                nameClassName="text-foreground"
              />
            ) : null}
            {location.address ? (
              <PlacedByItem
                name={location.address}
                label={t('announcement.detail.address')}
                nameClassName="text-foreground"
              />
            ) : null}
          </View>
        </AnnouncementCard>
      ) : null}

      {/* Notable distances */}
      <AnnouncementCard
        className="gap-[16px] rounded-[8px] px-[16px] py-[12px]"
        title={t('announcement.detail.notable_distances')}>
        {hasDistances ? (
          <>
            <View className="flex-row flex-wrap gap-x-6 gap-y-6">
              {distances?.map((item, index) => {
                const meta = getDistanceMeta(item.type);
                return (
                  <PlacedByItem
                    key={`${item.type}-${index}`}
                    icon={
                      <View className="h-[28px] w-[28px] items-center justify-center rounded-full bg-muted">
                        {meta.icon ? (
                          <Image
                            source={meta.icon}
                            style={{
                              width: 20,
                              height: 20,
                            }}
                            contentFit="contain"
                          />
                        ) : (
                          <Ionicons name="information-circle-outline" size={20} color="black" />
                        )}
                      </View>
                    }
                    name={
                      <View className="flex-row items-center gap-1">
                        <ThemedText className="text-[14px] font-semibold text-foreground">
                          {formatDistance(item.distanceInMeters)}
                        </ThemedText>
                        <Image
                          source={require('@/assets/images/announcement-icons/walking-icon.svg')}
                          style={{ width: 14, height: 14 }}
                          contentFit="contain"
                        />
                      </View>
                    }
                    label={t(meta.label)}
                    nameClassName="text-foreground"
                  />
                );
              })}
            </View>
            {onViewMap ? (
              <Button
                variant="secondary"
                onPress={onViewMap}
                accessibilityLabel={t('announcement.detail.view_on_map')}
                style={{
                  marginTop: 20,
                  borderWidth: 0,
                  backgroundColor: '#F1F1F1',
                  alignSelf: 'center',
                }}>
                <ThemedText className="text-[16px] font-medium text-primary">
                  {t('announcement.detail.view_on_map')}
                </ThemedText>
              </Button>
            ) : null}
          </>
        ) : (
          <ThemedText className="text-[14px] text-muted-foreground">—</ThemedText>
        )}
      </AnnouncementCard>
    </View>
  );
};
