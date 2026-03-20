import { Image, type ImageSource } from 'expo-image';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import type { DistanceInfo } from '@/lib/utils/announcement-mappers';

type DistanceConfig = {
  type: string;
  labelKey: string;
  icon: ImageSource;
};

const DISTANCE_CONFIGS: DistanceConfig[] = [
  { type: 'METRO', labelKey: 'announcement.detail.metro', icon: require('@/assets/images/announcement-icons/metro-icon.svg') },
  { type: 'HOSPITAL', labelKey: 'announcement.detail.hospital', icon: require('@/assets/images/announcement-icons/hospital-icon.svg') },
  { type: 'SCHOOL', labelKey: 'announcement.detail.school', icon: require('@/assets/images/announcement-icons/school-icon.svg') },
  { type: 'SUPERMARKET', labelKey: 'announcement.detail.grocery_shop', icon: require('@/assets/images/announcement-icons/grocery-icon.svg') },
];

type NotableDistancesSectionProps = {
  distances: DistanceInfo[];
};

export const NotableDistancesSection: React.FC<NotableDistancesSectionProps> = ({ distances }) => {
  const { t } = useTranslation();

  return (
    <View className="px-[16px]">
      <View style={styles.card}>
        <ThemedText className="text-[14px] font-bold leading-[17px] text-foreground">
          {t('announcement.detail.notable_distances')}
        </ThemedText>

        {distances.length > 0 ? (
          <View style={styles.grid}>
            {distances.map((d) => {
              const config = DISTANCE_CONFIGS.find((c) => c.type === d.type);
              if (!config) return null;
              return (
                <View key={d.type} style={styles.item}>
                  <View style={styles.iconContainer}>
                    <Image source={config.icon} style={styles.icon} contentFit="contain" />
                  </View>
                  <View className="gap-[4px]">
                    <ThemedText className="text-[10px] text-[#303030]">
                      {t(config.labelKey)}
                    </ThemedText>
                    <View className="flex-row items-center gap-[4px]">
                      <ThemedText className="text-[12px] font-bold leading-[11px] text-foreground">
                        {d.distanceKm}km
                      </ThemedText>
                      <Image
                        source={require('@/assets/images/announcement-icons/walking-icon.svg')}
                        style={styles.walkingIcon}
                        contentFit="contain"
                      />
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <ThemedText className="text-[14px] text-muted-foreground">—</ThemedText>
        )}

        <Pressable style={styles.viewOnMapButton}>
          <ThemedText className="text-[16px] font-medium leading-[21px] text-[#0E9457]">
            {t('announcement.detail.view_on_map')}
          </ThemedText>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    gap: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F1F1',
    backgroundColor: '#FFFFFF',
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 16,
    shadowColor: '#6E6E6E',
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 33,
    elevation: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    width: '33%',
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 66,
    backgroundColor: '#F1F1F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 20,
    height: 20,
  },
  walkingIcon: {
    width: 14,
    height: 14,
  },
  viewOnMapButton: {
    height: 49,
    borderRadius: 12,
    backgroundColor: '#F1F1F1',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
});
