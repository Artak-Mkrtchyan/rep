import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { AnnouncementSmallCard } from '@/components/announcement/announcement-small-card';
import {
  getAddress,
  getCardAttributes,
  getImageSource,
  getPriceLabel,
} from '@/lib/utils/announcement-helpers';
import type { Announcement } from '@/types/api';

type MapAnnouncementPinCardProps = {
  announcement: Announcement | null;
  /** Measured header height (safe area + toolbar) — card sits just below */
  headerOffset: number;
  onClose: () => void;
  onOpenDetails: (id: string) => void;
  onComparisonPress?: (id: string, isForComparison: boolean) => void;
};

/**
 * Floating listing card on the map (Figma: Card/Mobile ~175px over the map).
 * Tap outside the card to dismiss.
 */
export const MapAnnouncementPinCard: React.FC<MapAnnouncementPinCardProps> = ({
  announcement,
  headerOffset,
  onClose,
  onOpenDetails,
  onComparisonPress,
}) => {
  const { t } = useTranslation();

  if (!announcement) {
    return null;
  }

  const cardTop = Math.max(headerOffset + 8, 8);

  return (
    <View pointerEvents="box-none" style={[StyleSheet.absoluteFillObject, { zIndex: 8 }]}>
      <Pressable
        style={StyleSheet.absoluteFillObject}
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel={t('common.close')}
      />
      <View
        pointerEvents="box-none"
        className="absolute left-[16px] z-[1]"
        style={{ top: cardTop, width: 175 }}>
        <View pointerEvents="auto">
          <AnnouncementSmallCard
            className="w-[175px]"
            imageSource={getImageSource(announcement)}
            title={announcement.title}
            address={getAddress(announcement)}
            attributes={getCardAttributes(announcement)}
            priceLabel={getPriceLabel(announcement)}
            isFavourite={announcement.favourite}
            isForComparison={announcement.forComparison}
            onPress={() => onOpenDetails(announcement.id)}
            onComparisonPress={
              onComparisonPress
                ? () => onComparisonPress(announcement.id, announcement.forComparison)
                : undefined
            }
          />
        </View>
      </View>
    </View>
  );
};
