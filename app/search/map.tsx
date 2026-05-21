import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';

import { MapAnnouncementPinCard } from '@/components/search/map/map-announcement-pin-card';
import { SearchMapHeader } from '@/components/search/map/search-map-header';
import { SaveSearchButton } from '@/components/search/map/save-search-button';
import { SearchModal } from '@/components/search/search-modal';
import { SearchResultsGrid } from '@/components/search/search-results-grid';
import { SearchResultsSheet } from '@/components/search/search-results-sheet';
import { ThemedView } from '@/components/themed-view';
import { getWebBaseUrl } from '@/constants/env';
import { useMapSearchAnnouncements } from '@/hooks/api/use-map-search-announcements';
import { useSearchAnnouncements } from '@/hooks/api/use-search-announcements';
import { boundsToGeoRectangle } from '@/lib/utils/map-helpers';
import { announcementsService } from '@/lib/api/announcements';
import type { Announcement } from '@/types/api';
import type { SearchFilters } from '@/types/search';

const DEFAULT_CENTER: [number, number] = [69.32375, 41.290231];
const DEFAULT_ZOOM = 14;

type WebViewOutgoing =
  | {
      type: 'mapReady';
      bounds: [[number, number], [number, number]];
      center: [number, number];
      zoom: number;
    }
  | {
      type: 'boundsChanged';
      bounds: [[number, number], [number, number]];
      center: [number, number];
      zoom: number;
    }
  | { type: 'markerClick'; id: string }
  | { type: 'markerClose' };

export default function SearchMapScreen() {
  const router = useRouter();
  const { i18n } = useTranslation();
  const params = useLocalSearchParams<{ filters?: string }>();
  const webViewRef = useRef<WebView>(null);

  const initialFilters = useMemo<SearchFilters>(() => {
    if (params.filters) {
      try {
        return JSON.parse(params.filters);
      } catch {
        /* fall through */
      }
    }
    return {
      query: '',
      address: '',
      listingType: null,
      propertyTypes: [],
      priceMin: '',
      priceMax: '',
      sortOption: 'NEWEST_FIRST' as const,
    };
  }, [params.filters]);

  const [currentFilters, setCurrentFilters] = useState<SearchFilters>(initialFilters);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [locationText, setLocationText] = useState(
    initialFilters.address || initialFilters.query || '',
  );
  const [mapPinAnnouncement, setMapPinAnnouncement] = useState<Announcement | null>(null);

  // Map pins: fetched by visible bounds
  const { announcements: mapAnnouncements, searchWithBounds, resetAndRefetch } =
    useMapSearchAnnouncements();

  // Results list: all matching results (no geo constraint), like web
  const {
    announcements: listAnnouncements,
    isLoading,
    isLoadingMore,
    error,
    totalElements,
    hasMore,
    search: searchList,
    loadMore,
  } = useSearchAnnouncements();

  const filtersRef = useRef(currentFilters);
  filtersRef.current = currentFilters;

  // Initial list fetch
  useEffect(() => {
    searchList(currentFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Send markers to WebView whenever map announcements change
  useEffect(() => {
    if (!webViewRef.current || mapAnnouncements.length === 0) return;

    const markers = mapAnnouncements
      .filter((a: Announcement) => a.geo?.latitude != null && a.geo?.longitude != null)
      .map((a: Announcement) => ({
        id: a.id,
        publicId: a.publicId,
        coordinates: [a.geo.longitude!, a.geo.latitude!],
        status: a.status?.code ?? 'ACTIVE',
      }));

    const js = `
      window.dispatchEvent(new MessageEvent('message', {
        data: JSON.stringify(${JSON.stringify({ type: 'setMarkers', markers })})
      }));
      true;
    `;
    webViewRef.current.injectJavaScript(js);
  }, [mapAnnouncements]);

  useEffect(() => {
    setMapPinAnnouncement((prev) => {
      if (!prev) return prev;
      return mapAnnouncements.find((a: Announcement) => a.id === prev.id) ?? null;
    });
  }, [mapAnnouncements]);

  const handleWebViewMessage = useCallback(
    (event: WebViewMessageEvent) => {
      let data: WebViewOutgoing;
      try {
        data = JSON.parse(event.nativeEvent.data);
      } catch {
        return;
      }

      switch (data.type) {
        case 'mapReady':
        case 'boundsChanged': {
          const geoRect = boundsToGeoRectangle(data.bounds);
          searchWithBounds(filtersRef.current, geoRect);
          break;
        }
        case 'markerClick': {
          const markerId = data.id;
          const match = mapAnnouncements.find(
            (a: Announcement) => a.publicId === markerId || a.id === markerId,
          );
          if (!match) break;
          setMapPinAnnouncement((prev) => (prev?.id === match.id ? null : match));
          break;
        }
        case 'markerClose':
          setMapPinAnnouncement(null);
          break;
      }
    },
    [searchWithBounds, mapAnnouncements],
  );

  const handleBack = useCallback(() => router.back(), [router]);

  const handleSearch = useCallback(
    (filters: SearchFilters) => {
      setCurrentFilters(filters);
      setIsModalVisible(false);
      setLocationText(filters.address || filters.query || '');
      setMapPinAnnouncement(null);
      // Re-fetch map pins with new filters using current viewport
      resetAndRefetch(filters);
      // Re-fetch results list with new filters (no geo constraint)
      searchList(filters);
    },
    [resetAndRefetch, searchList],
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

  const handleComparisonPress = useCallback(async (id: string, isForComparison: boolean) => {
    try {
      if (isForComparison) {
        await announcementsService.removeFromComparison(id);
      } else {
        await announcementsService.addToComparison(id);
      }
    } catch (err) {
      console.error('Failed to toggle comparison:', err);
    }
  }, []);

  const handleSaveSearch = useCallback(() => {
    // TODO: Implement save search functionality
  }, []);

  const locale = i18n.language || 'ru';
  const embedUrl = `${getWebBaseUrl()}/${locale}/embed/map?ll=${DEFAULT_CENTER[0]},${DEFAULT_CENTER[1]}&zoom=${DEFAULT_ZOOM}`;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemedView className="flex-1">
        <View className="flex-1">
          <WebView
            ref={webViewRef}
            source={{ uri: embedUrl }}
            onMessage={handleWebViewMessage}
            javaScriptEnabled
            domStorageEnabled
            startInLoadingState
            bounces={false}
            overScrollMode="never"
            style={{ flex: 1 }}
          />
          <SaveSearchButton onPress={handleSaveSearch} variant="saveSearch" />
        </View>

        <SearchMapHeader
          locationText={locationText}
          onBack={handleBack}
          onOpenFilters={() => {
            setMapPinAnnouncement(null);
            setIsModalVisible(true);
          }}
          onClearQuery={() => setLocationText('')}
          onHeightMeasured={setHeaderHeight}
        />

        <MapAnnouncementPinCard
          announcement={mapPinAnnouncement}
          headerOffset={headerHeight}
          onClose={() => setMapPinAnnouncement(null)}
          onOpenDetails={handleMapPinOpenDetails}
          onComparisonPress={handleComparisonPress}
        />

        <SearchResultsSheet expandedTop={headerHeight || undefined} collapsedRatio={0.55}>
          <SearchResultsGrid
            announcements={listAnnouncements}
            totalElements={totalElements}
            isLoading={isLoading}
            isLoadingMore={isLoadingMore}
            error={error}
            hasMore={hasMore}
            onRetry={() => searchList(currentFilters)}
            onLoadMore={loadMore}
            onCardPress={handleCardPress}
            onComparisonPress={handleComparisonPress}
          />
        </SearchResultsSheet>

        <SearchModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onSearch={handleSearch}
          initialFilters={currentFilters}
        />
      </ThemedView>
    </GestureHandlerRootView>
  );
}
