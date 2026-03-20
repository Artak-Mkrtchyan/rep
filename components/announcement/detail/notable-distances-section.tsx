import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { AnnouncementCard } from '@/components/announcement/announcement-card';
import { ThemedText } from '@/components/themed-text';

export const NotableDistancesSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <View className="px-[16px]">
      <AnnouncementCard
        className="gap-[16px] rounded-[8px] px-[16px] py-[12px]"
        title={t('announcement.detail.notable_distances')}>
        <ThemedText className="text-[14px] text-muted-foreground">—</ThemedText>
      </AnnouncementCard>
    </View>
  );
};
