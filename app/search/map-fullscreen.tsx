import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { MapAnnouncementPinCard } from '@/components/search/map/map-announcement-pin-card';
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
  const [mapPinAnnouncement, setMapPinAnnouncement] = useState<Announcement | null>(null);

  const handleMapMarkerPress = useCallback((publicId: string) => {
    const match = announcements.find((a) => a.publicId === publicId || a.id === publicId);
    if (!match) return;
    setMapPinAnnouncement((prev) => (prev?.id === match.id ? null : match));
  }, [announcements]);

  const { webViewRef, embedUrl, zoomIn, zoomOut, handleMessage, resetCenter } = useSearchMapWebView(
    announcements,
    { fitBoundsToMarkers: true, onMarkerPress: handleMapMarkerPress },
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

  useEffect(() => {
    setMapPinAnnouncement((prev) => {
      if (!prev) return prev;
      return announcements.find((a) => a.id === prev.id) ?? null;
    });
  }, [announcements]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleSearch = useCallback(
    (filters: SearchFilters) => {
      setCurrentFilters(filters);
      setIsModalVisible(false);
      setMapPinAnnouncement(null);
      resetCenter();
      router.setParams({ filters: JSON.stringify(filters) });
    },
    [resetCenter, router],
  );

  const handleClearQuery = useCallback(
    () => handleSearch({ ...currentFilters, query: '' }),
    [currentFilters, handleSearch],
  );

  const handleMapPinOpenDetails = useCallback(
    (id: string) => {
      setMapPinAnnouncement(null);
      router.push(`/announcement/${id}` as any);
    },
    [router],
  );

  const handleMapPinComparison = useCallback(
    async (id: string, isForComparison: boolean) => {
      try {
        if (isForComparison) {
          await announcementsService.removeFromComparison(id);
        } else {
          await announcementsService.addToComparison(id);
        }
        const request = buildSearchRequest(currentFilters, 0, MAP_RESULTS_PAGE_SIZE);
        const response = await announcementsService.searchAnnouncements(request);
        setAnnouncements(response.content);
      } catch (err) {
        console.error('Failed to toggle comparison:', err);
      }
    },
    [currentFilters],
  );

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
        onComparisonPress={handleMapPinComparison}
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
