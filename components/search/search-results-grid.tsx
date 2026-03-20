import { Ionicons } from '@expo/vector-icons';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';

import { AnnouncementSmallCard } from '@/components/announcement/announcement-small-card';
import { ThemedText } from '@/components/themed-text';
import {
  getAddress,
  getBathsLabel,
  getBedsLabel,
  getImageSource,
  getPriceLabel,
  getSizeLabel,
} from '@/lib/utils/announcement-helpers';
import type { Announcement } from '@/types/api';

type SearchResultsGridProps = {
  announcements: Announcement[];
  totalElements: number;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  onRetry: () => void;
  onLoadMore: () => void;
};

export const SearchResultsGrid: React.FC<SearchResultsGridProps> = ({
  announcements,
  totalElements,
  isLoading,
  isLoadingMore,
  error,
  hasMore,
  onRetry,
  onLoadMore,
}) => {
  const { t } = useTranslation();

  const isCloseToBottom = useCallback(
    ({ layoutMeasurement, contentOffset, contentSize }: any) =>
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 200,
    []
  );

  const handleScroll = useCallback(
    ({ nativeEvent }: any) => {
      if (isCloseToBottom(nativeEvent) && hasMore && !isLoadingMore) {
        onLoadMore();
      }
    },
    [isCloseToBottom, hasMore, isLoadingMore, onLoadMore]
  );

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
        <ThemedText className="mt-4 text-muted-foreground">
          {t('search.searching')}
        </ThemedText>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center px-4">
        <ThemedText className="mb-4 text-center text-foreground">{error}</ThemedText>
        <Pressable onPress={onRetry} className="rounded-lg bg-main-500 px-6 py-3">
          <ThemedText className="font-semibold text-white">{t('common.retry')}</ThemedText>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 27, paddingBottom: 34 }}
      onScroll={handleScroll}
      scrollEventThrottle={400}>
      <ThemedText className="text-[20px] font-bold leading-[24px] text-foreground">
        {t('search.results_title', { count: totalElements })}
      </ThemedText>

      {announcements.length === 0 ? (
        <View className="mt-16 items-center">
          <Ionicons name="search-outline" size={64} color="#ABABAB" />
          <ThemedText className="mt-4 text-center text-[16px] text-muted-foreground">
            {t('search.no_results')}
          </ThemedText>
        </View>
      ) : (
        <View className="mt-[16px] flex-row flex-wrap gap-x-[8px] gap-y-[16px]">
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
            />
          ))}
        </View>
      )}

      {isLoadingMore && (
        <View className="items-center py-6">
          <ActivityIndicator size="small" />
        </View>
      )}
    </ScrollView>
  );
};
