import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnnouncementSmallCard } from '@/components/announcement/announcement-small-card';
import { SearchModal } from '@/components/search/search-modal';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useSearchAnnouncements } from '@/hooks/api/use-search-announcements';
import {
  getAddress,
  getBathsLabel,
  getBedsLabel,
  getImageSource,
  getPriceLabel,
  getSizeLabel,
} from '@/lib/utils/announcement-helpers';
import type { SearchFilters } from '@/types/search';

export default function SearchResultsScreen() {
  const { t } = useTranslation();
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

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleOpenFilters = useCallback(() => {
    setIsModalVisible(true);
  }, []);

  const handleCloseFilters = useCallback(() => {
    setIsModalVisible(false);
  }, []);

  const handleSearch = useCallback(
    (filters: SearchFilters) => {
      setCurrentFilters(filters);
      setIsModalVisible(false);
      search(filters);
    },
    [search]
  );

  const handleScrollEnd = useCallback(() => {
    if (hasMore && !isLoadingMore) {
      loadMore();
    }
  }, [hasMore, isLoadingMore, loadMore]);

  const isCloseToBottom = useCallback(
    ({ layoutMeasurement, contentOffset, contentSize }: any) => {
      return layoutMeasurement.height + contentOffset.y >= contentSize.height - 200;
    },
    []
  );

  return (
    <ThemedView className="flex-1">
      {/* Map placeholder (empty background) */}
      <View className="h-[50%] bg-[#F1F1F1]" />

      {/* Floating header over map */}
      <SafeAreaView
        className="absolute left-0 right-0 top-0 z-10"
        edges={['top']}>
        <View className="flex-row items-center gap-[8px] px-[16px] pt-[16px]">
          <Pressable
            onPress={handleBack}
            accessibilityRole="button"
            accessibilityLabel={t('common.go_back')}
            className="h-[46px] w-[46px] items-center justify-center rounded-full bg-white"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}>
            <Ionicons name="chevron-back" size={24} color="#111111" />
          </Pressable>

          <Pressable
            onPress={handleOpenFilters}
            className="h-[46px] flex-1 flex-row items-center gap-[8px] rounded-full bg-white px-[16px]"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}>
            <Ionicons name="search-outline" size={20} color="#ABABAB" />
            <ThemedText
              className="flex-1 text-[17px] text-foreground"
              numberOfLines={1}>
              {currentFilters.query || t('search.title')}
            </ThemedText>
            {currentFilters.query ? (
              <Pressable
                onPress={() => handleSearch({ ...currentFilters, query: '' })}
                className="h-[24px] w-[24px] items-center justify-center rounded-full bg-[#E2E2E2]">
                <Ionicons name="close" size={14} color="#777777" />
              </Pressable>
            ) : null}
          </Pressable>

          <Pressable
            onPress={handleOpenFilters}
            accessibilityRole="button"
            accessibilityLabel={t('search.title')}
            className="h-[46px] w-[46px] items-center justify-center rounded-full bg-white"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}>
            <Ionicons name="options-outline" size={20} color="#111111" />
          </Pressable>
        </View>
      </SafeAreaView>

      {/* Bottom sheet with results */}
      <View
        className="-mt-[35px] flex-1 rounded-t-[24px] bg-white"
        style={{
          shadowColor: '#2B2B2B',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 8,
        }}>
        {/* Drag pill indicator */}
        <View className="items-center pt-[5px]">
          <View className="h-[5px] w-[42px] rounded-full bg-[#E2E2E2]" />
        </View>

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" />
            <ThemedText className="mt-4 text-muted-foreground">
              {t('search.searching')}
            </ThemedText>
          </View>
        ) : error ? (
          <View className="flex-1 items-center justify-center px-4">
            <ThemedText className="mb-4 text-center text-foreground">{error}</ThemedText>
            <Pressable
              onPress={() => search(currentFilters)}
              className="rounded-lg bg-main-500 px-6 py-3">
              <ThemedText className="font-semibold text-white">
                {t('common.retry')}
              </ThemedText>
            </Pressable>
          </View>
        ) : (
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 27, paddingBottom: 34 }}
            onScroll={({ nativeEvent }) => {
              if (isCloseToBottom(nativeEvent)) {
                handleScrollEnd();
              }
            }}
            scrollEventThrottle={400}>
            <ThemedText className="text-[20px] font-bold leading-[24px] text-foreground">
              {t('search.results_title', { count: totalElements })}
            </ThemedText>

            {announcements.length === 0 ? (
              <View className="mt-16 items-center">
                <Ionicons name="search-outline" size={64} color="#ABABAB" />
                <ThemedText className="mt-4 text-center text-[16px] text-muted-foreground">
                  {t('search.no_results')}
                </ThemedText>
              </View>
            ) : (
              <View className="mt-[16px] flex-row flex-wrap gap-x-[8px] gap-y-[16px]">
                {announcements.map((item) => (
                  <AnnouncementSmallCard
                    key={item.id}
                    className="w-[175px]"
                    imageSource={getImageSource(item)}
                    title={item.title}
                    address={getAddress(item)}
                    bedsLabel={getBedsLabel(item)}
                    bathsLabel={getBathsLabel(item)}
                    sizeLabel={getSizeLabel(item)}
                    priceLabel={getPriceLabel(item)}
                    isFavourite={item.favourite}
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
        )}
      </View>

      <SearchModal
        visible={isModalVisible}
        onClose={handleCloseFilters}
        onSearch={handleSearch}
      />
    </ThemedView>
  );
}
