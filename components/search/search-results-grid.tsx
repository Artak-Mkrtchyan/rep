import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';

import { AnnouncementListCard } from '@/components/announcement/announcement-list-card';
import { AnnouncementSmallCard } from '@/components/announcement/announcement-small-card';
import { ThemedText } from '@/components/themed-text';
import {
  getAddress,
  getCardAttributes,
  getImageSource,
  getPriceLabel,
} from '@/lib/utils/announcement-helpers';
import type { Announcement } from '@/types/api';

type ViewMode = 'grid' | 'list';

type SearchResultsGridProps = {
  announcements: Announcement[];
  totalElements: number;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  onRetry: () => void;
  onLoadMore: () => void;
  onCardPress?: (id: string) => void;
  onComparisonPress?: (id: string, isForComparison: boolean) => void;
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
  onCardPress,
  onComparisonPress,
}) => {
  const { t } = useTranslation();
  const [viewMode] = useState<ViewMode>('grid');

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
        <ThemedText className="mt-4 text-muted-foreground">{t('search.searching')}</ThemedText>
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
      <View className="flex-row items-center justify-between">
        <ThemedText className="text-[20px] font-bold leading-[24px] text-foreground">
          {t('search.results_title', { count: totalElements })}
        </ThemedText>
        {/* <View className="flex-row items-center gap-[4px]">
          <Pressable
            onPress={() => setViewMode('grid')}
            className="h-[32px] w-[32px] items-center justify-center rounded-[8px]"
            style={viewMode === 'grid' ? { backgroundColor: '#F1F1F1' } : undefined}>
            <Ionicons
              name="grid-outline"
              size={18}
              color={viewMode === 'grid' ? '#111111' : '#ABABAB'}
            />
          </Pressable>
          <Pressable
            onPress={() => setViewMode('list')}
            className="h-[32px] w-[32px] items-center justify-center rounded-[8px]"
            style={viewMode === 'list' ? { backgroundColor: '#F1F1F1' } : undefined}>
            <Ionicons
              name="list-outline"
              size={18}
              color={viewMode === 'list' ? '#111111' : '#ABABAB'}
            />
          </Pressable>
        </View> */}
      </View>

      {announcements.length === 0 ? (
        <View className="mt-16 items-center">
          <Ionicons name="search-outline" size={64} color="#ABABAB" />
          <ThemedText className="mt-4 text-center text-[16px] text-muted-foreground">
            {t('search.no_results')}
          </ThemedText>
        </View>
      ) : viewMode === 'grid' ? (
        <View className="mt-[16px] flex-row flex-wrap gap-x-[8px] gap-y-[16px]">
          {announcements.map((item) => (
            <AnnouncementSmallCard
              key={item.id}
              className="w-[175px]"
              imageSource={getImageSource(item)}
              title={item.title}
              address={getAddress(item)}
              attributes={getCardAttributes(item)}
              priceLabel={getPriceLabel(item)}
              isFavourite={item.favourite}
              isForComparison={item.forComparison}
              onPress={onCardPress ? () => onCardPress(item.id) : undefined}
              onComparisonPress={
                onComparisonPress ? () => onComparisonPress(item.id, item.forComparison) : undefined
              }
            />
          ))}
        </View>
      ) : (
        <View className="mt-[16px] gap-[12px]">
          {announcements.map((item) => (
            <AnnouncementListCard
              key={item.id}
              imageSource={getImageSource(item)}
              title={item.title}
              address={getAddress(item)}
              attributes={getCardAttributes(item)}
              priceLabel={getPriceLabel(item)}
              isFavourite={item.favourite}
              isForComparison={item.forComparison}
              onPress={onCardPress ? () => onCardPress(item.id) : undefined}
              onComparisonPress={
                onComparisonPress ? () => onComparisonPress(item.id, item.forComparison) : undefined
              }
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
