import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  View,
} from 'react-native';

import { AnnouncementSmallCard } from '@/components/announcement/announcement-small-card';
import { ThemedText } from '@/components/themed-text';
import { PaginationIndicator } from '@/components/ui/pagination-indicator';
import { useFeaturedAnnouncements } from '@/hooks/api/use-announcements';
import { announcementsService } from '@/lib/api/announcements';
import {
  getAddress,
  getBathsLabel,
  getBedsLabel,
  getImageSource,
  getPriceLabel,
  getSizeLabel,
} from '@/lib/utils/announcement-helpers';

const CARD_WIDTH = 175;
const CARD_GAP = 8;

export const FeaturedProperties: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { announcements, isLoading, error, refetch } = useFeaturedAnnouncements(5);

  const toggle = useCallback(
    async (id: string, isFavourite: boolean) => {
      try {
        if (isFavourite) {
          await announcementsService.removeFromFavourites(id);
        } else {
          await announcementsService.addToFavourites(id);
        }
        await refetch();
      } catch (err) {
        console.error('Failed to toggle favourite:', err);
      }
    },
    [refetch]
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / (CARD_WIDTH + CARD_GAP));
    setActiveIndex(index);
  }, []);

  if (isLoading) {
    return (
      <View className="py-8">
        <ActivityIndicator size="small" />
      </View>
    );
  }

  if (error || announcements.length === 0) {
    return null;
  }

  return (
    <View className="mt-6">
      <View className="flex-row items-center justify-between px-4">
        <ThemedText className="text-[20px] font-bold text-foreground">{t('home.featured_property')}</ThemedText>
        <Pressable>
          <ThemedText className="text-[14px] text-foreground">{t('home.see_more')}</ThemedText>
        </Pressable>
      </View>

      <ScrollView
        ref={scrollViewRef}
        className="mt-4 overflow-visible pl-4"
        contentContainerStyle={{ gap: CARD_GAP, paddingRight: 16 }}
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        horizontal>
        {announcements.map((item) => (
          <AnnouncementSmallCard
            key={item.id}
            className="w-[175px]"
            imageSource={getImageSource(item)}
            title={item.title}
            address={getAddress(item)}
            bedsLabel={getBedsLabel(item)}
            bathsLabel={getBathsLabel(item)}
            sizeLabel={getSizeLabel(item)}
            priceLabel={getPriceLabel(item)}
            isFavourite={item.favourite}
            onPress={() => router.push(`/announcement/${item.id}` as any)}
            onFavouritePress={() => toggle(item.id, item.favourite)}
          />
        ))}
      </ScrollView>

      <PaginationIndicator
        count={announcements.length}
        activeIndex={activeIndex}
        variant="inline"
      />
    </View>
  );
};
