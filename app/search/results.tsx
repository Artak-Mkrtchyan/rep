import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { SearchModal } from '@/components/search/search-modal';
import { SearchResultsGrid } from '@/components/search/search-results-grid';
import { SearchResultsHeader } from '@/components/search/search-results-header';
import { SearchResultsSheet } from '@/components/search/search-results-sheet';
import { ThemedView } from '@/components/themed-view';
import { useSearchAnnouncements } from '@/hooks/api/use-search-announcements';
import { announcementsService } from '@/lib/api/announcements';
import type { SearchFilters } from '@/types/search';

export default function SearchResultsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ filters?: string }>();

  const initialFilters = useMemo<SearchFilters>(() => {
    if (params.filters) {
      try {
        return JSON.parse(params.filters);
      } catch {
        /* fall through */
      }
    }
    return { query: '', listingType: 'BUY', propertyTypes: [], priceMin: '', priceMax: '' };
  }, [params.filters]);

  const [currentFilters, setCurrentFilters] = useState<SearchFilters>(initialFilters);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);

  const {
    announcements,
    isLoading,
    isLoadingMore,
    error,
    totalElements,
    hasMore,
    search,
    loadMore,
  } = useSearchAnnouncements();

  useEffect(() => {
    search(currentFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBack = useCallback(() => router.back(), [router]);

  const handleSearch = useCallback(
    (filters: SearchFilters) => {
      setCurrentFilters(filters);
      setIsModalVisible(false);
      search(filters);
    },
    [search]
  );

  const handleClearQuery = useCallback(
    () => handleSearch({ ...currentFilters, query: '' }),
    [currentFilters, handleSearch]
  );

  const handleCardPress = useCallback(
    (id: string) => router.push(`/announcement/${id}` as any),
    [router]
  );

  const handleComparisonPress = useCallback(
    async (id: string, isForComparison: boolean) => {
      try {
        if (isForComparison) {
          await announcementsService.removeFromComparison(id);
        } else {
          await announcementsService.addToComparison(id);
        }
        search(currentFilters);
      } catch (err) {
        console.error('Failed to toggle comparison:', err);
      }
    },
    [search, currentFilters]
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemedView className="flex-1">
        <View className="flex-1 bg-[#F1F1F1]" />

        <SearchResultsHeader
          query={currentFilters.query}
          onBack={handleBack}
          onOpenFilters={() => setIsModalVisible(true)}
          onClearQuery={handleClearQuery}
          onHeightMeasured={setHeaderHeight}
        />

        <SearchResultsSheet expandedTop={headerHeight || undefined}>
          <SearchResultsGrid
            announcements={announcements}
            totalElements={totalElements}
            isLoading={isLoading}
            isLoadingMore={isLoadingMore}
            error={error}
            hasMore={hasMore}
            onRetry={() => search(currentFilters)}
            onLoadMore={loadMore}
            onCardPress={handleCardPress}
            onComparisonPress={handleComparisonPress}
          />
        </SearchResultsSheet>

        <SearchModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onSearch={handleSearch}
        />
      </ThemedView>
    </GestureHandlerRootView>
  );
}
