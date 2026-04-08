import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { MapAnnouncementPinCard } from '@/components/search/map/map-announcement-pin-card';
import { SaveSearchButton } from '@/components/search/map/save-search-button';
import { SearchMapWebView } from '@/components/search/map/search-map-webview';
import { SearchModal } from '@/components/search/search-modal';
import { SearchResultsGrid } from '@/components/search/search-results-grid';
import { SearchResultsHeader } from '@/components/search/search-results-header';
import { SearchResultsSheet, type SharedValue } from '@/components/search/search-results-sheet';
import { ThemedView } from '@/components/themed-view';
import { useSearchAnnouncements } from '@/hooks/api/use-search-announcements';
import { useSearchMapWebView } from '@/hooks/use-search-map-webview';
import { announcementsService } from '@/lib/api/announcements';
import type { Announcement } from '@/types/api';
import type { SearchFilters } from '@/types/search';

const DEFAULT_FILTERS: SearchFilters = {
  query: '',
  listingType: 'BUY',
  propertyTypes: [],
  priceMin: '',
  priceMax: '',
};

const GESTURE_OVERLAY_STYLE = {
  position: 'absolute' as const,
  left: 0,
  right: 0,
  bottom: 0,
  top: 0,
  pointerEvents: 'box-none' as const,
};

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
    return DEFAULT_FILTERS;
  }, [params.filters]);

  const [currentFilters, setCurrentFilters] = useState<SearchFilters>(initialFilters);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [sheetTop, setSheetTop] = useState<SharedValue<number> | undefined>(undefined);
  const [showMapButton, setShowMapButton] = useState(true);
  const [mapPinAnnouncement, setMapPinAnnouncement] = useState<Announcement | null>(null);

  const handleSheetFullyExpandedChange = useCallback((fullyExpanded: boolean) => {
    setShowMapButton((prev) => {
      const next = !fullyExpanded;
      return prev === next ? prev : next;
    });
  }, []);

  const { announcements, isLoading, isLoadingMore, error, totalElements, hasMore, search, loadMore } =
    useSearchAnnouncements();

  const handleMapMarkerPress = useCallback((publicId: string) => {
    const match = announcements.find((a) => a.publicId === publicId || a.id === publicId);
    if (!match) return;
    setMapPinAnnouncement((prev) => (prev?.id === match.id ? null : match));
  }, [announcements]);

  const { webViewRef, embedUrl, handleMessage, resetCenter } = useSearchMapWebView(announcements, {
    onMarkerPress: handleMapMarkerPress,
  });

  useEffect(() => {
    search(currentFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setMapPinAnnouncement((prev) => {
      if (!prev) return prev;
      return announcements.find((a) => a.id === prev.id) ?? null;
    });
  }, [announcements]);

  const handleBack = useCallback(() => router.back(), [router]);

  const handleSearch = useCallback(
    (filters: SearchFilters) => {
      setCurrentFilters(filters);
      setIsModalVisible(false);
      setMapPinAnnouncement(null);
      resetCenter();
      search(filters);
    },
    [search, resetCenter],
  );

  const handleClearQuery = useCallback(
    () => handleSearch({ ...currentFilters, query: '' }),
    [currentFilters, handleSearch],
  );

  const handleCardPress = useCallback(
    (id: string) => router.push(`/announcement/${id}` as any),
    [router],
  );

  const handleMapPinOpenDetails = useCallback(
    (id: string) => {
      setMapPinAnnouncement(null);
      router.push(`/announcement/${id}` as any);
    },
    [router],
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
    [search, currentFilters],
  );

  const handleShowOnMap = useCallback(() => {
    router.push({
      pathname: '/search/map-fullscreen' as any,
      params: { filters: JSON.stringify(currentFilters) },
    });
  }, [router, currentFilters]);

  return (
    <ThemedView className="flex-1">
      <SearchMapWebView webViewRef={webViewRef} embedUrl={embedUrl} onMessage={handleMessage} />

      <SearchResultsHeader
        query={currentFilters.query}
        onBack={handleBack}
        onOpenFilters={() => {
          setMapPinAnnouncement(null);
          setIsModalVisible(true);
        }}
        onClearQuery={handleClearQuery}
        onHeightMeasured={setHeaderHeight}
      />

      <MapAnnouncementPinCard
        announcement={mapPinAnnouncement}
        headerOffset={headerHeight}
        onClose={() => setMapPinAnnouncement(null)}
        onOpenDetails={handleMapPinOpenDetails}
        onComparisonPress={handleComparisonPress}
      />

      <GestureHandlerRootView style={GESTURE_OVERLAY_STYLE}>
        {showMapButton ? (
          <SaveSearchButton onPress={handleShowOnMap} sheetTop={sheetTop} variant="showOnMap" />
        ) : null}
        <SearchResultsSheet
          expandedTop={headerHeight || undefined}
          onSheetPositionChange={setSheetTop}
          onFullyExpandedChange={handleSheetFullyExpandedChange}
        >
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
      </GestureHandlerRootView>

      <SearchModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSearch={handleSearch}
      />
    </ThemedView>
  );
}
