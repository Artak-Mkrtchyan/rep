import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useDeferredValue, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  BookingCard,
  BookingFormSheet,
  BookingsFilterSheet,
  EmptyBookingsState,
} from '@/components/bookings';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/ui/header';
import { SearchInput } from '@/components/ui/search-input';
import { useMyBookingsInfinite } from '@/hooks/api/use-bookings';
import type { BookingsFilterValues } from '@/types/bookings';

const FOOTER_SHADOW = {
  shadowColor: '#6E6E6E',
  shadowOffset: { width: 0, height: -3 },
  shadowOpacity: 0.1,
  shadowRadius: 12,
  elevation: 4,
};

const ON_END_THRESHOLD = 0.4;

const countActiveFilters = (filter: BookingsFilterValues): number => {
  let count = 0;
  if (filter.serviceProviders && filter.serviceProviders.length > 0) count += 1;
  if (filter.status && filter.status.length > 0) count += 1;
  if (filter.dateFilter) count += 1;
  return count;
};

export default function BookingsScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const searchRef = React.useRef<TextInput>(null);

  const [filter, setFilter] = useState<BookingsFilterValues>({});
  const [searchText, setSearchText] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const deferredSearch = useDeferredValue(searchText);

  const effectiveFilter = useMemo<BookingsFilterValues>(
    () => ({ ...filter, bookingId: deferredSearch.trim() || undefined }),
    [filter, deferredSearch]
  );

  const query = useMyBookingsInfinite(effectiveFilter);

  const items = useMemo(() => query.data?.pages.flatMap((p) => p.content) ?? [], [query.data]);

  const handleLoadMore = useCallback(() => {
    if (query.hasNextPage && !query.isFetchingNextPage) {
      void query.fetchNextPage();
    }
  }, [query]);

  const handleApplyFilter = useCallback((next: BookingsFilterValues) => {
    setFilter(next);
    setFiltersOpen(false);
  }, []);

  const handlePress = useCallback((id: string) => {
    router.push(`/bookings/${id}` as never);
  }, []);

  const activeFilterCount = countActiveFilters(filter);

  const isInitialLoading = query.isLoading && items.length === 0;
  const isInitialLoadingButHasFilter =
    isInitialLoading && (activeFilterCount > 0 || !!deferredSearch);

  const showEmptyState = !query.isLoading && items.length === 0 && activeFilterCount === 0 && !deferredSearch;
  const showNoResultsState = !query.isLoading && items.length === 0 && (activeFilterCount > 0 || !!deferredSearch);

  return (
    <ThemedView className="flex-1">
      <Header
        headerTitle={t('booking.title')}
        isStepProgressVisible={false}
        rightComponent={
          <Pressable
            className="h-10 w-10 items-center justify-center"
            accessibilityRole="button"
            accessibilityLabel={t('booking.filter.title')}
            onPress={() => setFiltersOpen(true)}
            hitSlop={8}>
            <Ionicons name="options-outline" size={24} color="#111111" />
            {activeFilterCount > 0 ? (
              <View
                className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary"
                accessibilityElementsHidden
              />
            ) : null}
          </Pressable>
        }
      />

      <View className="px-4 pb-2 pt-2">
        <SearchInput
          ref={searchRef}
          placeholder={t('booking.filter.search_placeholder')}
          value={searchText}
          onChangeText={setSearchText}
          returnKeyType="search"
        />
      </View>

      {isInitialLoading && !isInitialLoadingButHasFilter ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      ) : showEmptyState ? (
        <View className="flex-1">
          <EmptyBookingsState />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(b) => b.id}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 8,
            paddingBottom: 120,
            flexGrow: 1,
          }}
          ItemSeparatorComponent={() => <View className="h-3" />}
          renderItem={({ item }) => (
            <BookingCard booking={item} onPress={() => handlePress(item.id)} />
          )}
          ListEmptyComponent={
            showNoResultsState ? (
              <View className="flex-1 items-center justify-center px-6 py-20">
                <ThemedText className="text-center text-[16px] font-semibold text-foreground">
                  {t('booking.empty.no_results_title')}
                </ThemedText>
                <ThemedText className="mt-1 text-center text-[14px] text-neutral-500">
                  {t('booking.empty.no_results_subtitle')}
                </ThemedText>
              </View>
            ) : null
          }
          ListFooterComponent={
            query.isFetchingNextPage ? (
              <View className="py-4">
                <ActivityIndicator />
              </View>
            ) : null
          }
          refreshControl={
            <RefreshControl
              refreshing={!!query.isRefetching && !query.isFetchingNextPage}
              onRefresh={() => query.refetch()}
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={ON_END_THRESHOLD}
          showsVerticalScrollIndicator={false}
        />
      )}

      <View
        className="border-t border-neutral-50 bg-white px-4 pt-3"
        style={[FOOTER_SHADOW, { paddingBottom: insets.bottom + 12 }]}>
        <Button onPress={() => setCreateOpen(true)} accessibilityLabel={t('booking.book_service')}>
          {t('booking.book_service')}
        </Button>
      </View>

      <BookingsFilterSheet
        visible={filtersOpen}
        initial={filter}
        onApply={handleApplyFilter}
        onClose={() => setFiltersOpen(false)}
      />

      <BookingFormSheet
        visible={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={() => query.refetch()}
      />
    </ThemedView>
  );
}
