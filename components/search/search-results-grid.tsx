import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, LayoutChangeEvent, Pressable, ScrollView, View } from 'react-native';

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
import type { SortOption } from '@/types/search';

type ViewMode = 'grid' | 'list';

const GRID_GAP = 8;
/** Min card width the design still looks good at — used to pick column count. */
const MIN_CARD_WIDTH = 160;
/** Fallback width until `onLayout` fires (one frame). */
const FALLBACK_CARD_WIDTH = 175;

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
  sortOption?: SortOption;
  sortLabel?: string;
  onSortPress?: () => void;
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
  sortLabel,
  onSortPress,
}) => {
  const { t } = useTranslation();
  const [viewMode] = useState<ViewMode>('grid');
  const [gridWidth, setGridWidth] = useState(0);

  const handleGridLayout = useCallback((event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    setGridWidth((prev) => (Math.abs(prev - width) > 0.5 ? width : prev));
  }, []);

  /**
   * Columns = how many `MIN_CARD_WIDTH` cards fit side-by-side accounting for gaps.
   * Card width fills all remaining space so there's no empty gutter on the right.
   */
  const { cardWidth, columns } = useMemo(() => {
    if (gridWidth <= 0) {
      return { cardWidth: FALLBACK_CARD_WIDTH, columns: 2 };
    }
    const cols = Math.max(2, Math.floor((gridWidth + GRID_GAP) / (MIN_CARD_WIDTH + GRID_GAP)));
    const width = (gridWidth - GRID_GAP * (cols - 1)) / cols;
    return { cardWidth: width, columns: cols };
  }, [gridWidth]);

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
        {onSortPress && sortLabel ? (
          <Pressable onPress={onSortPress} className="flex-row items-center gap-1">
            <ThemedText className="text-[16px] font-medium text-primary">
              {t('search.sort.label')}:
            </ThemedText>
            <ThemedText className="text-[16px] font-medium text-primary">{sortLabel}</ThemedText>
          </Pressable>
        ) : null}
      </View>

      {announcements.length === 0 ? (
        <View className="mt-16 items-center">
          <Ionicons name="search-outline" size={64} color="#ABABAB" />
          <ThemedText className="mt-4 text-center text-[16px] text-muted-foreground">
            {t('search.no_results')}
          </ThemedText>
        </View>
      ) : viewMode === 'grid' ? (
        <View
          onLayout={handleGridLayout}
          className="mt-[16px] flex-row flex-wrap gap-y-[16px]"
          style={{ columnGap: GRID_GAP }}
          accessibilityLabel={`${columns}-column results grid`}>
          {announcements.map((item) => (
            <View key={item.id} style={{ width: cardWidth }}>
              <AnnouncementSmallCard
                imageSource={getImageSource(item)}
                title={item.title}
                address={getAddress(item)}
                attributes={getCardAttributes(item)}
                priceLabel={getPriceLabel(item)}
                isFavourite={item.favourite}
                isForComparison={item.forComparison}
                onPress={onCardPress ? () => onCardPress(item.id) : undefined}
                onComparisonPress={
                  onComparisonPress
                    ? () => onComparisonPress(item.id, item.forComparison)
                    : undefined
                }
              />
            </View>
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
