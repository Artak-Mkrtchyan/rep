import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { AnnouncementCard } from '@/components/announcement/announcement-card';
import { PlacedByItem } from '@/components/announcement/placed-by-item';
import type { LocationInfo } from '@/lib/utils/announcement-mappers';

type LocationSectionProps = {
  location: LocationInfo;
};

export const LocationSection: React.FC<LocationSectionProps> = ({ location }) => {
  const { t } = useTranslation();

  return (
    <View className="px-[16px]">
      <AnnouncementCard
        className="gap-[16px] rounded-[8px] px-[16px] py-[12px]"
        title={t('announcement.detail.location')}>
        <View className="flex-row flex-wrap gap-x-[16px] gap-y-[8px]">
          {location.country ? (
            <PlacedByItem
              name={location.country}
              label={t('announcement.detail.country')}
              labelClassName="text-[10px]"
              nameClassName="text-[12px] font-bold text-foreground"
            />
          ) : null}
          {location.city ? (
            <PlacedByItem
              name={location.city}
              label={t('announcement.detail.city')}
              labelClassName="text-[10px]"
              nameClassName="text-[12px] font-bold text-foreground"
            />
          ) : null}
          {location.province ? (
            <PlacedByItem
              name={location.province}
              label={t('announcement.detail.province')}
              labelClassName="text-[10px]"
              nameClassName="text-[12px] font-bold text-foreground"
            />
          ) : null}
          {location.district ? (
            <PlacedByItem
              name={location.district}
              label={t('announcement.detail.district')}
              labelClassName="text-[10px]"
              nameClassName="text-[12px] font-bold text-foreground"
            />
          ) : null}
          {location.street ? (
            <PlacedByItem
              name={location.street}
              label={t('announcement.detail.street')}
              labelClassName="text-[10px]"
              nameClassName="text-[12px] font-bold text-foreground"
            />
          ) : null}
          {location.house ? (
            <PlacedByItem
              name={location.house}
              label={t('announcement.detail.house')}
              labelClassName="text-[10px]"
              nameClassName="text-[12px] font-bold text-foreground"
            />
          ) : null}
        </View>
      </AnnouncementCard>
    </View>
  );
};
