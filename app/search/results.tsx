import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { MapAnnouncementPinCard } from '@/components/search/map/map-announcement-pin-card';
import { SaveSearchButton } from '@/components/search/map/save-search-button';
import { SearchMapWebView } from '@/components/search/map/search-map-webview';
import { SearchModal } from '@/components/search/search-modal';
import { SearchResultsGrid } from '@/components/search/search-results-grid';
import { SearchResultsHeader } from '@/components/search/search-results-header';
import { SearchResultsSheet, type SharedValue } from '@/components/search/search-results-sheet';
import { SortOrderModal, SORT_OPTIONS } from '@/components/search/sort-order-modal';
import { ThemedView } from '@/components/themed-view';
import { useSearchAnnouncements } from '@/hooks/api/use-search-announcements';
import { useSearchMapWebView } from '@/hooks/use-search-map-webview';
import { announcementsService } from '@/lib/api/announcements';
import type { Announcement } from '@/types/api';
import type { SearchFilters, SortOption } from '@/types/search';

const DEFAULT_FILTERS: SearchFilters = {
  query: '',
  address: '',
  listingType: null,
  propertyTypes: [],
  priceMin: '',
  priceMax: '',
  sortOption: 'NEWEST_FIRST',
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
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ filters?: string }>();

  const initialFilters = useMemo<SearchFilters>(() => {
    if (params.filters) {
      try {
        const parsed = JSON.parse(params.filters);
        return { ...DEFAULT_FILTERS, ...parsed };
      } catch {
        /* fall through */
      }
    }
    return DEFAULT_FILTERS;
  }, [params.filters]);

  const [currentFilters, setCurrentFilters] = useState<SearchFilters>(initialFilters);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSortModalVisible, setIsSortModalVisible] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [sheetTop, setSheetTop] = useState<SharedValue<number> | undefined>(undefined);
  const [showMapButton, setShowMapButton] = useState(true);
  const [mapPinAnnouncement, setMapPinAnnouncement] = useState<Announcement | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);

  const handleSheetFullyExpandedChange = useCallback((fullyExpanded: boolean) => {
    setShowMapButton((prev) => {
      const next = !fullyExpanded;
      return prev === next ? prev : next;
    });
  }, []);

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

  const handleMapMarkerPress = useCallback(
    (publicId: string) => {
      const match = announcements.find((a) => a.publicId === publicId || a.id === publicId);
      if (!match) return;
      setMapPinAnnouncement((prev) => (prev?.id === match.id ? null : match));
    },
    [announcements]
  );

  const { webViewRef, embedUrl, handleMessage, resetCenter, setCenter } = useSearchMapWebView(
    announcements,
    { onMarkerPress: handleMapMarkerPress, initialCenter: mapCenter ?? undefined }
  );

  // Resolve address to map center and run initial search
  useEffect(() => {
    (async () => {
      if (currentFilters.address) {
        try {
          const geoResult = await announcementsService.searchAnnouncements({
            filter: { formattedAddressStartsWith: currentFilters.address },
            pagination: { pageNumber: 0, pageSize: 1 },
            sorts: [{ sort: 'UPDATED_AT', direction: 'DESC' }],
          });
          const first = geoResult.content?.[0];
          if (first?.geo?.longitude != null && first?.geo?.latitude != null) {
            const center: [number, number] = [first.geo.longitude, first.geo.latitude];
            setMapCenter(center);
            setCenter(center[0], center[1]);
          }
        } catch {
          // Geocoding failed
        }
      }
      search(currentFilters);
    })();
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
    async (filters: SearchFilters) => {
      setCurrentFilters(filters);
      setIsModalVisible(false);
      setMapPinAnnouncement(null);
      resetCenter();

      // If address is set, find a nearby announcement to center the map
      if (filters.address) {
        try {
          const geoResult = await announcementsService.searchAnnouncements({
            filter: { formattedAddressStartsWith: filters.address },
            pagination: { pageNumber: 0, pageSize: 1 },
            sorts: [{ sort: 'UPDATED_AT', direction: 'DESC' }],
          });
          const first = geoResult.content?.[0];
          if (first?.geo?.longitude != null && first?.geo?.latitude != null) {
            const center: [number, number] = [first.geo.longitude, first.geo.latitude];
            setMapCenter(center);
            setCenter(center[0], center[1]);
          }
        } catch {
          // Geocoding failed — map stays where it is
        }
      } else {
        setMapCenter(null);
      }

      await search(filters);
    },
    [search, resetCenter, setCenter]
  );

  const handleClearQuery = useCallback(
    () => handleSearch({ ...currentFilters, query: '', address: '' }),
    [currentFilters, handleSearch]
  );

  const handleSortSelect = useCallback(
    (sortOption: SortOption) => {
      const updated = { ...currentFilters, sortOption };
      setCurrentFilters(updated);
      search(updated);
    },
    [currentFilters, search]
  );

  const sortLabel = useMemo(() => {
    const option = SORT_OPTIONS.find((o) => o.value === currentFilters.sortOption);
    return option ? t(option.labelKey) : '';
  }, [currentFilters.sortOption, t]);

  const handleCardPress = useCallback(
    (id: string) => router.push(`/announcement/${id}` as any),
    [router]
  );

  const handleMapPinOpenDetails = useCallback(
    (id: string) => {
      setMapPinAnnouncement(null);
      router.push(`/announcement/${id}` as any);
    },
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

  const handleShowOnMap = useCallback(() => {
    router.push({
      pathname: '/search/map-fullscreen' as any,
      params: {
        filters: JSON.stringify(currentFilters),
        ...(mapCenter ? { center: `${mapCenter[0]},${mapCenter[1]}` } : {}),
      },
    });
  }, [router, currentFilters, mapCenter]);

  return (
    <ThemedView className="flex-1">
      <SearchMapWebView webViewRef={webViewRef} embedUrl={embedUrl} onMessage={handleMessage} />

      <SearchResultsHeader
        query={currentFilters.query}
        address={currentFilters.address}
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
          onFullyExpandedChange={handleSheetFullyExpandedChange}>
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
            sortOption={currentFilters.sortOption}
            sortLabel={sortLabel}
            onSortPress={() => setIsSortModalVisible(true)}
          />
        </SearchResultsSheet>
      </GestureHandlerRootView>

      <SearchModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSearch={handleSearch}
        initialFilters={currentFilters}
      />

      <SortOrderModal
        visible={isSortModalVisible}
        value={currentFilters.sortOption}
        onSelect={handleSortSelect}
        onClose={() => setIsSortModalVisible(false)}
      />
    </ThemedView>
  );
}
