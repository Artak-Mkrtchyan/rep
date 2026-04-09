import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, View } from 'react-native';

import { BrokerCard } from '@/components/announcement/broker-card';
import {
  mapBrokerCompanyToCardProps,
  mapIndividualBrokerToCardProps,
} from '@/components/partners/broker-utils';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { SearchInput } from '@/components/ui/search-input';
import { SegmentedControl } from '@/components/ui/segmented-control';
import {
  useSearchBrokerCompaniesInfinite,
  useSearchIndividualBrokersInfinite,
} from '@/hooks/api/use-applications';
import { useScreenEdgePadding } from '@/hooks/use-screen-edge-padding';
import type { BrokerCompany, IndividualBroker } from '@/types/applications';
import { router } from 'expo-router';

const SEARCH_DEBOUNCE_MS = 500;
const MIN_SEARCH_LENGTH = 3;
const PAGE_SIZE = 12;
const ON_END_REACHED_THRESHOLD = 0.35;

const FLAT_LIST_CONTENT_STYLE = { paddingBottom: 31, gap: 16 };

type BrokerType = 'individual' | 'company';

function navigateToBrokerDetails(id: string, type: BrokerType) {
  router.push({ pathname: '/partners/broker/[id]', params: { id, type } });
}

export default function BrokersListScreen() {
  const { t } = useTranslation();
  const { horizontalStyle } = useScreenEdgePadding();
  const [selectedIndex, setSelectedIndex] = useState(0);
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

  const isIndividualTab = selectedIndex === 0;

  const individualQuery = useSearchIndividualBrokersInfinite(
    debouncedSearch,
    PAGE_SIZE,
    isIndividualTab
  );

  const companiesQuery = useSearchBrokerCompaniesInfinite(
    debouncedSearch,
    PAGE_SIZE,
    !isIndividualTab
  );

  const individualList = useMemo(
    () => individualQuery.data?.pages.flatMap((p) => p.content) ?? [],
    [individualQuery.data]
  );

  const companiesList = useMemo(
    () => companiesQuery.data?.pages.flatMap((p) => p.content) ?? [],
    [companiesQuery.data]
  );

  const activeQuery = isIndividualTab ? individualQuery : companiesQuery;

  const handleLoadMore = useCallback(() => {
    if (activeQuery.hasNextPage && !activeQuery.isFetchingNextPage) {
      void activeQuery.fetchNextPage();
    }
  }, [activeQuery]);

  const segments = useMemo(
    () => [t('partners.individual_broker'), t('partners.broker_company')],
    [t]
  );

  const renderFooter = useCallback(
    () =>
      activeQuery.isFetchingNextPage ? (
        <View className="py-4">
          <ActivityIndicator accessibilityLabel="Loading more" />
        </View>
      ) : null,
    [activeQuery.isFetchingNextPage]
  );

  const renderEmptyList = useCallback(() => {
    if (activeQuery.isLoading) {
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
  }, [activeQuery.isLoading, t]);

  const renderIndividualItem = useCallback(
    ({ item }: { item: IndividualBroker }) => (
      <BrokerCard
        {...mapIndividualBrokerToCardProps(item)}
        onPress={() => navigateToBrokerDetails(item.id, 'individual')}
      />
    ),
    []
  );

  const renderCompanyItem = useCallback(
    ({ item }: { item: BrokerCompany }) => (
      <BrokerCard
        {...mapBrokerCompanyToCardProps(item)}
        onPress={() => navigateToBrokerDetails(item.id, 'company')}
      />
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

        <SegmentedControl
          segments={segments}
          selectedIndex={selectedIndex}
          onSelect={setSelectedIndex}
          accessibilityLabel={t('partners.individual_broker')}
        />
      </View>

      {isIndividualTab ? (
        <FlatList
          className="flex-1 px-4 py-4"
          style={horizontalStyle}
          contentContainerStyle={FLAT_LIST_CONTENT_STYLE}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onEndReached={handleLoadMore}
          onEndReachedThreshold={ON_END_REACHED_THRESHOLD}
          data={individualList}
          keyExtractor={extractId}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmptyList}
          refreshing={individualQuery.isRefetching}
          onRefresh={() => individualQuery.refetch()}
          renderItem={renderIndividualItem}
        />
      ) : (
        <FlatList
          className="flex-1 px-4 py-4"
          style={horizontalStyle}
          contentContainerStyle={FLAT_LIST_CONTENT_STYLE}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onEndReached={handleLoadMore}
          onEndReachedThreshold={ON_END_REACHED_THRESHOLD}
          data={companiesList}
          keyExtractor={extractId}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmptyList}
          refreshing={companiesQuery.isRefetching}
          onRefresh={() => companiesQuery.refetch()}
          renderItem={renderCompanyItem}
        />
      )}
    </ThemedView>
  );
}

const extractId = (item: { id: string }) => item.id;
