import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';

import { SaveSearchButton } from '@/components/search/map/save-search-button';
import { SearchModal } from '@/components/search/search-modal';
import { SearchResultsGrid } from '@/components/search/search-results-grid';
import { SearchResultsHeader } from '@/components/search/search-results-header';
import { SearchResultsSheet, type SharedValue } from '@/components/search/search-results-sheet';
import { ThemedView } from '@/components/themed-view';
import { getWebBaseUrl } from '@/constants/env';
import { useSearchAnnouncements } from '@/hooks/api/use-search-announcements';
import { announcementsService } from '@/lib/api/announcements';
import type { SearchFilters } from '@/types/search';

const DEFAULT_CENTER: [number, number] = [69.32375, 41.290231];
const DEFAULT_ZOOM = 14;

export default function SearchResultsScreen() {
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
    return { query: '', listingType: 'BUY', propertyTypes: [], priceMin: '', priceMax: '' };
  }, [params.filters]);

  const [currentFilters, setCurrentFilters] = useState<SearchFilters>(initialFilters);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [sheetTop, setSheetTop] = useState<SharedValue<number> | undefined>(undefined);

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
      hasCenteredRef.current = false;
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

  // Build embed URL
  const locale = i18n.language || 'ru';
  const embedUrl = `${getWebBaseUrl()}/${locale}/embed/map?ll=${DEFAULT_CENTER[0]},${DEFAULT_CENTER[1]}&zoom=${DEFAULT_ZOOM}`;

  const sendToWebView = useCallback((msg: Record<string, unknown>) => {
    webViewRef.current?.injectJavaScript(`
      window.dispatchEvent(new MessageEvent('message', {
        data: JSON.stringify(${JSON.stringify(msg)})
      }));
      true;
    `);
  }, []);

  const handleZoomIn = useCallback(() => {
    sendToWebView({ type: 'zoom', direction: 'in' });
  }, [sendToWebView]);

  const handleZoomOut = useCallback(() => {
    sendToWebView({ type: 'zoom', direction: 'out' });
  }, [sendToWebView]);

  // Track whether we've already centered on first result
  const hasCenteredRef = useRef(false);

  // Send markers to WebView whenever announcements change
  // If no initial center was provided, pan to the first announcement with coordinates
  useEffect(() => {
    if (!webViewRef.current || announcements.length === 0) return;

    const markers = announcements
      .filter((a) => a.geo?.latitude != null && a.geo?.longitude != null)
      .map((a) => ({
        id: a.id,
        publicId: a.publicId,
        coordinates: [a.geo.longitude!, a.geo.latitude!],
        status: a.status?.code ?? 'ACTIVE',
      }));

    // Center map on first announcement with coordinates (once)
    if (!hasCenteredRef.current && markers.length > 0) {
      hasCenteredRef.current = true;
      const [lng, lat] = markers[0].coordinates;
      webViewRef.current.injectJavaScript(`
        window.dispatchEvent(new MessageEvent('message', {
          data: JSON.stringify({ type: 'setCenter', center: [${lng}, ${lat}], zoom: ${DEFAULT_ZOOM} })
        }));
        true;
      `);
    }

    const js = `
      window.dispatchEvent(new MessageEvent('message', {
        data: JSON.stringify(${JSON.stringify({ type: 'setMarkers', markers })})
      }));
      true;
    `;
    webViewRef.current.injectJavaScript(js);
  }, [announcements]);

  const handleWebViewMessage = useCallback(
    (event: WebViewMessageEvent) => {
      let data: { type: string; bounds?: [[number, number], [number, number]] };
      try {
        data = JSON.parse(event.nativeEvent.data);
      } catch {
        return;
      }

      if (data.type === 'mapReady' || data.type === 'boundsChanged') {
        // Map reported new bounds - could use for geo-filtered search in future
      }
    },
    [],
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
    <ThemedView className="flex-1">
      {/* Map WebView — outside GestureHandlerRootView so pinch-to-zoom works */}
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
      </View>

      <SearchResultsHeader
        query={currentFilters.query}
        onBack={handleBack}
        onOpenFilters={() => setIsModalVisible(true)}
        onClearQuery={handleClearQuery}
        onHeightMeasured={setHeaderHeight}
      />

      <View style={[zoomStyles.container, { top: headerHeight + 20 }]}>
        <Pressable onPress={handleZoomIn} style={zoomStyles.button}>
          <Ionicons name="add" size={22} color="#333" />
        </Pressable>
        <Pressable onPress={handleZoomOut} style={zoomStyles.button}>
          <Ionicons name="remove" size={22} color="#333" />
        </Pressable>
      </View>

      {/* Bottom sheet needs GestureHandlerRootView for drag gestures */}
      <GestureHandlerRootView style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: 0, pointerEvents: 'box-none' }}>
        <SaveSearchButton onPress={() => {}} sheetTop={sheetTop} />
        <SearchResultsSheet expandedTop={headerHeight || undefined} onSheetPositionChange={setSheetTop}>
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

const zoomStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 16,
    gap: 8,
    zIndex: 5,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
});
