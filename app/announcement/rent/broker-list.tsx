import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, View } from 'react-native';

import { AnnouncementFooter } from '@/components/announcement/announcement-footer';
import { BrokerCard } from '@/components/announcement/broker-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { SearchInput } from '@/components/ui/search-input';
import { SegmentedControl } from '@/components/ui/segmented-control';
import {
  useAssignBroker,
  useSearchBrokerCompaniesInfinite,
  useSearchIndividualBrokersInfinite,
} from '@/hooks/api/use-applications';
import { useScreenEdgePadding } from '@/hooks/use-screen-edge-padding';
import { useAnnouncementForRentFormStore } from '@/store/announcementStore';
import { router } from 'expo-router';

const SEARCH_DEBOUNCE_MS = 500;
const PAGE_SIZE = 12;
const ON_END_REACHED_THRESHOLD = 0.35;

export default function BrokerListScreen() {
  const { t } = useTranslation();
  const { horizontalStyle } = useScreenEdgePadding();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const brokerId = useAnnouncementForRentFormStore((s) => s.metaData?.brokerId);

  const sendFormData = useAnnouncementForRentFormStore((s) => s.sendFormData);
  const resetForm = useAnnouncementForRentFormStore((s) => s.resetForm);

  const { mutate: assignBroker } = useAssignBroker();
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

  const BROKER_SEGMENTS = [
    t('announcement.rent.broker_list.individual_broker'),
    t('announcement.rent.broker_list.broker_company'),
  ];

  const handleNext = async () => {
    try {
      const { id } = await sendFormData();

      assignBroker({ id, data: { brokerId } });

      resetForm();

      router.push('/(tabs)');
    } catch {
      console.error('Assign broker error');
    }
  };

  const handleSaveAndExit = () => {
    router.push('/(tabs)');
  };

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

  return (
    <ThemedView className="flex-1">
      <View className="gap-4 pt-[24px]" style={horizontalStyle}>
        <ThemedText className="text-[16px] font-bold text-foreground">
          {t('announcement.rent.broker_list.heading')}
        </ThemedText>

        <SegmentedControl
          segments={BROKER_SEGMENTS}
          selectedIndex={selectedIndex}
          onSelect={setSelectedIndex}
          accessibilityLabel={t('announcement.rent.broker_list.broker_type')}
        />

        <SearchInput
          placeholder={t('announcement.rent.broker_list.search_placeholder')}
          value={searchInput}
          onChangeText={setSearchInput}
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
          keyExtractor={(item) => item.id.toString()}
          ListFooterComponent={renderIndividualFooter}
          renderItem={({ item }) => (
            <BrokerCard
              isSelected={brokerId === item.id}
              avatar={require('@/assets/images/hero.png')}
              name={item.fullName}
              rating={5.0}
              reviewCount={1024}
              stats={[]}
              onPress={() =>
                router.push({
                  pathname: '/announcement/rent/broker/[id]',
                  params: { id: item.id, type: 'individual' },
                })
              }
            />
          )}
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
          keyExtractor={(item) => item.id.toString()}
          ListFooterComponent={renderCompaniesFooter}
          renderItem={({ item }) => (
            <BrokerCard
              isSelected={brokerId === item.id}
              avatar={require('@/assets/images/hero.png')}
              name={item.name}
              rating={5.0}
              reviewCount={1024}
              stats={[]}
              onPress={() =>
                router.push({
                  pathname: '/announcement/rent/broker/[id]',
                  params: { id: item.id, type: 'company' },
                })
              }
            />
          )}
        />
      )}

      <AnnouncementFooter
        firstButtonLabel={t('common.next')}
        secondButtonLabel={t('common.save_and_exit')}
        firstButtonDisabled={!brokerId}
        onNextPress={() => handleNext()}
        onSaveAndExitPress={() => handleSaveAndExit()}
      />
    </ThemedView>
  );
}
