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
import { router } from 'expo-router';

const SEARCH_DEBOUNCE_MS = 500;
const PAGE_SIZE = 12;
const ON_END_REACHED_THRESHOLD = 0.35;

export default function BrokersListScreen() {
  const { t } = useTranslation();
  const { horizontalStyle } = useScreenEdgePadding();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(searchInput.trim()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [searchInput]);

  const isIndividualBroker = selectedIndex === 0;

  const individualQuery = useSearchIndividualBrokersInfinite(
    debouncedSearch,
    PAGE_SIZE,
    isIndividualBroker
  );

  const companiesQuery = useSearchBrokerCompaniesInfinite(
    debouncedSearch,
    PAGE_SIZE,
    !isIndividualBroker
  );

  const individualList = useMemo(
    () => individualQuery.data?.pages.flatMap((p) => p.content) ?? [],
    [individualQuery.data]
  );

  const companiesList = useMemo(
    () => companiesQuery.data?.pages.flatMap((p) => p.content) ?? [],
    [companiesQuery.data]
  );

  const handleLoadMoreIndividuals = useCallback(() => {
    if (individualQuery.hasNextPage && !individualQuery.isFetchingNextPage) {
      void individualQuery.fetchNextPage();
    }
  }, [individualQuery]);

  const handleLoadMoreCompanies = useCallback(() => {
    if (companiesQuery.hasNextPage && !companiesQuery.isFetchingNextPage) {
      void companiesQuery.fetchNextPage();
    }
  }, [companiesQuery]);

  const BROKER_SEGMENTS = [t('partners.individual_broker'), t('partners.broker_company')];

  const renderIndividualFooter = () =>
    individualQuery.isFetchingNextPage ? (
      <View className="py-4">
        <ActivityIndicator accessibilityLabel="Loading more" />
      </View>
    ) : null;

  const renderCompaniesFooter = () =>
    companiesQuery.isFetchingNextPage ? (
      <View className="py-4">
        <ActivityIndicator accessibilityLabel="Loading more" />
      </View>
    ) : null;

  const renderEmptyList = () => {
    const query = isIndividualBroker ? individualQuery : companiesQuery;
    if (query.isLoading) {
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
  };

  return (
    <ThemedView className="flex-1">
      <View className="gap-4 pt-[16px]" style={horizontalStyle}>
        <SearchInput
          placeholder={t('partners.search_placeholder')}
          value={searchInput}
          onChangeText={setSearchInput}
        />

        <SegmentedControl
          segments={BROKER_SEGMENTS}
          selectedIndex={selectedIndex}
          onSelect={setSelectedIndex}
          accessibilityLabel={t('partners.individual_broker')}
        />
      </View>

      {isIndividualBroker ? (
        <FlatList
          className="flex-1 px-4 py-4"
          style={horizontalStyle}
          contentContainerStyle={{ paddingBottom: 31, gap: 16 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onEndReached={handleLoadMoreIndividuals}
          onEndReachedThreshold={ON_END_REACHED_THRESHOLD}
          data={individualList}
          keyExtractor={(item) => item.id}
          ListFooterComponent={renderIndividualFooter}
          ListEmptyComponent={renderEmptyList}
          refreshing={individualQuery.isRefetching}
          onRefresh={() => individualQuery.refetch()}
          renderItem={({ item }) => {
            const props = mapIndividualBrokerToCardProps(item);
            return (
              <BrokerCard
                {...props}
                onPress={() =>
                  router.push({
                    pathname: '/partners/broker/[id]',
                    params: { id: item.id, type: 'individual' },
                  })
                }
              />
            );
          }}
        />
      ) : (
        <FlatList
          className="flex-1 px-4 py-4"
          style={horizontalStyle}
          contentContainerStyle={{ paddingBottom: 31, gap: 16 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onEndReached={handleLoadMoreCompanies}
          onEndReachedThreshold={ON_END_REACHED_THRESHOLD}
          data={companiesList}
          keyExtractor={(item) => item.id}
          ListFooterComponent={renderCompaniesFooter}
          ListEmptyComponent={renderEmptyList}
          refreshing={companiesQuery.isRefetching}
          onRefresh={() => companiesQuery.refetch()}
          renderItem={({ item }) => {
            const props = mapBrokerCompanyToCardProps(item);
            return (
              <BrokerCard
                {...props}
                onPress={() =>
                  router.push({
                    pathname: '/partners/broker/[id]',
                    params: { id: item.id, type: 'company' },
                  })
                }
              />
            );
          }}
        />
      )}
    </ThemedView>
  );
}
