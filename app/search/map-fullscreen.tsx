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
import { useSearchAnnouncements } from '@/hooks/api/use-search-announcements';
import { useSearchMapWebView } from '@/hooks/use-search-map-webview';
import { announcementsService } from '@/lib/api/announcements';
import type { Announcement } from '@/types/api';
import type { SearchFilters } from '@/types/search';

const DEFAULT_FILTERS: SearchFilters = {
  query: '',
  address: '',
  listingType: null,
  propertyTypes: [],
  priceMin: '',
  priceMax: '',
  sortOption: 'NEWEST_FIRST',
};

export default function SearchMapFullscreenScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ filters?: string; center?: string }>();

  const initialFilters = useMemo<SearchFilters>(() => {
    if (params.filters) {
      try {
        return { ...DEFAULT_FILTERS, ...JSON.parse(params.filters) };
      } catch {
        /* fall through */
      }
    }
    return DEFAULT_FILTERS;
  }, [params.filters]);

  const [currentFilters, setCurrentFilters] = useState<SearchFilters>(initialFilters);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [mapPinAnnouncement, setMapPinAnnouncement] = useState<Announcement | null>(null);

  const initialCenter = useMemo<[number, number] | null>(() => {
    if (params.center) {
      const [lng, lat] = params.center.split(',').map(Number);
      if (!isNaN(lng) && !isNaN(lat)) return [lng, lat];
    }
    return null;
  }, [params.center]);

  const { announcements, isLoading, error, search } = useSearchAnnouncements();

  const handleMapMarkerPress = useCallback(
    (publicId: string) => {
      const match = announcements.find((a) => a.publicId === publicId || a.id === publicId);
      if (!match) return;
      setMapPinAnnouncement((prev) => (prev?.id === match.id ? null : match));
    },
    [announcements],
  );

  const { webViewRef, embedUrl, zoomIn, zoomOut, handleMessage, resetCenter } =
    useSearchMapWebView(announcements, {
      fitBoundsToMarkers: false,
      onMarkerPress: handleMapMarkerPress,
      initialCenter: initialCenter ?? undefined,
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

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleSearch = useCallback(
    (filters: SearchFilters) => {
      setCurrentFilters(filters);
      setIsModalVisible(false);
      setMapPinAnnouncement(null);
      resetCenter();
      search(filters);
      router.setParams({ filters: JSON.stringify(filters) });
    },
    [resetCenter, search, router],
  );

  const handleClearQuery = useCallback(
    () => handleSearch({ ...currentFilters, query: '', address: '' }),
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
        search(currentFilters);
      } catch (err) {
        console.error('Failed to toggle comparison:', err);
      }
    },
    [currentFilters, search],
  );

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

      {error ? (
        <View className="absolute bottom-[40px] left-4 right-4 rounded-md bg-white/95 px-3 py-2 shadow">
          <ThemedText className="text-center text-[14px] text-destructive">{error}</ThemedText>
        </View>
      ) : null}

      <SearchModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSearch={handleSearch}
        initialFilters={currentFilters}
      />
    </ThemedView>
  );
}
