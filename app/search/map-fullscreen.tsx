import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { SearchMapWebView } from '@/components/search/map/search-map-webview';
import { ZoomControls } from '@/components/search/map/zoom-controls';
import { SearchModal } from '@/components/search/search-modal';
import { SearchResultsHeader } from '@/components/search/search-results-header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useSearchMapWebView } from '@/hooks/use-search-map-webview';
import { announcementsService } from '@/lib/api/announcements';
import { buildSearchRequest } from '@/lib/utils/search-filters';
import type { Announcement } from '@/types/api';
import type { SearchFilters } from '@/types/search';

const DEFAULT_FILTERS: SearchFilters = {
  query: '',
  listingType: 'BUY',
  propertyTypes: [],
  priceMin: '',
  priceMax: '',
};

/** Large page so map pins cover the filtered result set in one request */
const MAP_RESULTS_PAGE_SIZE = 500;

export default function SearchMapFullscreenScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ filters?: string }>();

  const initialFilters = useMemo<SearchFilters>(() => {
    if (params.filters) {
      try {
        return JSON.parse(params.filters) as SearchFilters;
      } catch {
        /* fall through */
      }
    }
    return DEFAULT_FILTERS;
  }, [params.filters]);

  const [currentFilters, setCurrentFilters] = useState<SearchFilters>(initialFilters);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  const { webViewRef, embedUrl, zoomIn, zoomOut, handleMessage, resetCenter } = useSearchMapWebView(
    announcements,
    { fitBoundsToMarkers: true },
  );

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setIsLoading(true);
      setFetchError(null);
      resetCenter();
      setAnnouncements([]);
      try {
        const request = buildSearchRequest(currentFilters, 0, MAP_RESULTS_PAGE_SIZE);
        const response = await announcementsService.searchAnnouncements(request);
        if (!cancelled) {
          setAnnouncements(response.content);
        }
      } catch (err) {
        if (!cancelled) {
          setFetchError(err instanceof Error ? err.message : 'Search failed');
          setAnnouncements([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [currentFilters, resetCenter]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleSearch = useCallback(
    (filters: SearchFilters) => {
      setCurrentFilters(filters);
      setIsModalVisible(false);
      resetCenter();
      router.setParams({ filters: JSON.stringify(filters) });
    },
    [resetCenter, router],
  );

  const handleClearQuery = useCallback(
    () => handleSearch({ ...currentFilters, query: '' }),
    [currentFilters, handleSearch],
  );

  return (
    <ThemedView className="flex-1">
      <SearchMapWebView webViewRef={webViewRef} embedUrl={embedUrl} onMessage={handleMessage} />

      <SearchResultsHeader
        query={currentFilters.query}
        onBack={handleBack}
        onOpenFilters={() => setIsModalVisible(true)}
        onClearQuery={handleClearQuery}
        onHeightMeasured={setHeaderHeight}
      />

      <ZoomControls top={headerHeight + 20} onZoomIn={zoomIn} onZoomOut={zoomOut} />

      {isLoading ? (
        <View
          className="absolute bottom-[40px] left-0 right-0 items-center"
          pointerEvents="none">
          <ActivityIndicator size="small" />
        </View>
      ) : null}

      {fetchError ? (
        <View className="absolute bottom-[40px] left-4 right-4 rounded-md bg-white/95 px-3 py-2 shadow">
          <ThemedText className="text-center text-[14px] text-destructive">{fetchError}</ThemedText>
        </View>
      ) : null}

      <SearchModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSearch={handleSearch}
      />
    </ThemedView>
  );
}
