import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { router } from 'expo-router';

import { AnnouncementFooter } from '@/components/announcement/announcement-footer';
import { BrokerCard } from '@/components/announcement/broker-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { SearchInput } from '@/components/ui/search-input';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { useScreenEdgePadding } from '@/hooks/use-screen-edge-padding';

const EXAMPLE_BROKER = [
  {
    id: 1,
    avatar: require('@/assets/images/hero.png'),
    name: 'Matt Laricy',
    rating: 5.0,
    reviewCount: 1024,
    stats: [
      { value: '538', labelKey: 'announcement.rent.broker_list.sales_last_12_months' },
      { value: '5248', labelKey: 'announcement.rent.broker_list.sales_in_city' },
    ],
  },
  {
    id: 2,
    avatar: require('@/assets/images/hero.png'),
    name: 'Matt Laricy',
    rating: 5.0,
    reviewCount: 1024,
    stats: [
      { value: '538', labelKey: 'announcement.rent.broker_list.sales_last_12_months' },
      { value: '5248', labelKey: 'announcement.rent.broker_list.sales_in_city' },
    ],
  },
  {
    id: 3,
    avatar: require('@/assets/images/hero.png'),
    name: 'Matt Laricy',
    rating: 5.0,
    reviewCount: 1024,
    stats: [
      { value: '538', labelKey: 'announcement.rent.broker_list.sales_last_12_months' },
      { value: '5248', labelKey: 'announcement.rent.broker_list.sales_in_city' },
    ],
  },
];

const EXAMPLE_BROKER_COMPANY = [
  {
    id: 1,
    avatar: require('@/assets/images/hero.png'),
    name: 'Summit Properties',
    rating: 5.0,
    reviewCount: 1024,
    stats: [
      { value: '538', labelKey: 'announcement.rent.broker_list.sales_last_12_months' },
      { value: '5248', labelKey: 'announcement.rent.broker_list.sales_in_city' },
    ],
  },
  {
    id: 2,
    avatar: require('@/assets/images/hero.png'),
    name: 'The Bellcast Group',
    rating: 5.0,
    reviewCount: 1024,
    stats: [
      { value: '538', labelKey: 'announcement.rent.broker_list.sales_last_12_months' },
      { value: '5248', labelKey: 'announcement.rent.broker_list.sales_in_city' },
    ],
  },
  {
    id: 3,
    avatar: require('@/assets/images/hero.png'),
    name: 'Horizon Homes',
    rating: 5.0,
    reviewCount: 1024,
    stats: [
      { value: '538', labelKey: 'announcement.rent.broker_list.sales_last_12_months' },
      { value: '5248', labelKey: 'announcement.rent.broker_list.sales_in_city' },
    ],
  },
];

export default function BrokerListScreen() {
  const { t } = useTranslation();
  const { horizontalStyle } = useScreenEdgePadding();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const BROKER_SEGMENTS = [t('announcement.rent.broker_list.individual_broker'), t('announcement.rent.broker_list.broker_company')];

  const brokers = selectedIndex === 0 ? EXAMPLE_BROKER : EXAMPLE_BROKER_COMPANY;

  const handleNext = () => {};

  const handleSaveAndExit = () => {};

  return (
    <ThemedView className="flex-1">
      <View className="gap-4 pt-[24px]" style={horizontalStyle}>
        <ThemedText className="text-[16px] font-bold text-foreground">{t('announcement.rent.broker_list.heading')}</ThemedText>

        <SegmentedControl
          segments={BROKER_SEGMENTS}
          selectedIndex={selectedIndex}
          onSelect={setSelectedIndex}
          accessibilityLabel={t('announcement.rent.broker_list.broker_type')}
        />

        <SearchInput
          placeholder={t('announcement.rent.broker_list.search_placeholder')}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView
        className="flex-1 py-4"
        style={horizontalStyle}
        contentContainerStyle={{ paddingBottom: 31, gap: 16 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {brokers.map((broker) => (
          <BrokerCard
            key={broker.id}
            avatar={broker.avatar}
            name={broker.name}
            rating={broker.rating}
            reviewCount={broker.reviewCount}
            stats={broker.stats.map((s) => ({ ...s, label: t(s.labelKey) }))}
            onPress={() => router.push(`/announcement/rent/broker/${broker.id}`)}
          />
        ))}
      </ScrollView>

      <AnnouncementFooter
        firstButtonLabel={t('common.next')}
        secondButtonLabel={t('common.save_and_exit')}
        onNextPress={() => handleNext()}
        onSaveAndExitPress={() => handleSaveAndExit()}
      />
    </ThemedView>
  );
}
