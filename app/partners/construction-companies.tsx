import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, View } from 'react-native';

import { BrokerCard } from '@/components/announcement/broker-card';
import { mapBrokerCompanyToCardProps } from '@/components/partners/broker-utils';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { SearchInput } from '@/components/ui/search-input';
import { useSearchBrokerCompaniesInfinite } from '@/hooks/api/use-applications';
import { useScreenEdgePadding } from '@/hooks/use-screen-edge-padding';
import type { BrokerCompany } from '@/types/applications';

const SEARCH_DEBOUNCE_MS = 500;
const MIN_SEARCH_LENGTH = 3;
const PAGE_SIZE = 12;
const ON_END_REACHED_THRESHOLD = 0.35;
const FLAT_LIST_CONTENT_STYLE = { paddingBottom: 31, gap: 16 };

export default function ConstructionCompaniesListScreen() {
  const { t } = useTranslation();
  const { horizontalStyle } = useScreenEdgePadding();
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const trimmed = searchInput.trim();
    const timer = setTimeout(
      () => setDebouncedSearch(trimmed.length >= MIN_SEARCH_LENGTH ? trimmed : ''),
      SEARCH_DEBOUNCE_MS
    );
    return () => clearTimeout(timer);
  }, [searchInput]);

  const companiesQuery = useSearchBrokerCompaniesInfinite(debouncedSearch, PAGE_SIZE, true);

  const companiesList = useMemo(
    () => companiesQuery.data?.pages.flatMap((p) => p.content) ?? [],
    [companiesQuery.data]
  );

  const handleLoadMore = useCallback(() => {
    if (companiesQuery.hasNextPage && !companiesQuery.isFetchingNextPage) {
      void companiesQuery.fetchNextPage();
    }
  }, [companiesQuery]);

  const renderFooter = useCallback(
    () =>
      companiesQuery.isFetchingNextPage ? (
        <View className="py-4">
          <ActivityIndicator accessibilityLabel="Loading more" />
        </View>
      ) : null,
    [companiesQuery.isFetchingNextPage]
  );

  const renderEmptyList = useCallback(() => {
    if (companiesQuery.isLoading) {
      return (
        <View className="flex-1 items-center justify-center pt-20">
          <ActivityIndicator size="large" />
        </View>
      );
    }
    return (
      <View className="flex-1 items-center justify-center pt-20">
        <ThemedText className="text-[14px] text-neutral-400">
          {t('partners.no_results')}
        </ThemedText>
      </View>
    );
  }, [companiesQuery.isLoading, t]);

  const renderItem = useCallback(
    ({ item }: { item: BrokerCompany }) => (
      <BrokerCard {...mapBrokerCompanyToCardProps(item)} />
    ),
    []
  );

  return (
    <ThemedView className="flex-1">
      <View className="gap-4 pt-[16px]" style={horizontalStyle}>
        <SearchInput
          placeholder={t('partners.search_placeholder')}
          value={searchInput}
          onChangeText={setSearchInput}
        />
      </View>

      <FlatList
        className="flex-1 px-4 py-4"
        style={horizontalStyle}
        contentContainerStyle={FLAT_LIST_CONTENT_STYLE}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onEndReached={handleLoadMore}
        onEndReachedThreshold={ON_END_REACHED_THRESHOLD}
        data={companiesList}
        keyExtractor={(item) => item.id}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmptyList}
        refreshing={companiesQuery.isRefetching}
        onRefresh={() => companiesQuery.refetch()}
        renderItem={renderItem}
      />
    </ThemedView>
  );
}
