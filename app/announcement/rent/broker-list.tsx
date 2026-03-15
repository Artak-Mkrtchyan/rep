import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { AnnouncementFooter } from '@/components/announcement/announcement-footer';
import { BrokerCard } from '@/components/announcement/broker-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { SearchInput } from '@/components/ui/search-input';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { router } from 'expo-router';

const BROKER_SEGMENTS = ['Individual broker', 'Broker company'];

const EXAMPLE_BROKER = [
  {
    id: 1,
    avatar: require('@/assets/images/hero.png'),
    name: 'Matt Laricy',
    rating: 5.0,
    reviewCount: 1024,
    stats: [
      { value: '538', label: 'sales last 12 months' },
      { value: '5248', label: 'sales in Chicago' },
    ],
  },
  {
    id: 2,
    avatar: require('@/assets/images/hero.png'),
    name: 'Matt Laricy',
    rating: 5.0,
    reviewCount: 1024,
    stats: [
      { value: '538', label: 'sales last 12 months' },
      { value: '5248', label: 'sales in Chicago' },
    ],
  },
  {
    id: 3,
    avatar: require('@/assets/images/hero.png'),
    name: 'Matt Laricy',
    rating: 5.0,
    reviewCount: 1024,
    stats: [
      { value: '538', label: 'sales last 12 months' },
      { value: '5248', label: 'sales in Chicago' },
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
      { value: '538', label: 'sales last 12 months' },
      { value: '5248', label: 'sales in Chicago' },
    ],
  },
  {
    id: 2,
    avatar: require('@/assets/images/hero.png'),
    name: 'The Bellcast Group',
    rating: 5.0,
    reviewCount: 1024,
    stats: [
      { value: '538', label: 'sales last 12 months' },
      { value: '5248', label: 'sales in Chicago' },
    ],
  },
  {
    id: 3,
    avatar: require('@/assets/images/hero.png'),
    name: 'Horizon Homes',
    rating: 5.0,
    reviewCount: 1024,
    stats: [
      { value: '538', label: 'sales last 12 months' },
      { value: '5248', label: 'sales in Chicago' },
    ],
  },
];

export default function BrokerListScreen() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const brokers = selectedIndex === 0 ? EXAMPLE_BROKER : EXAMPLE_BROKER_COMPANY;

  const handleNext = () => {};

  const handleSaveAndExit = () => {};

  return (
    <ThemedView className="flex-1">
      <View className="gap-4 px-4 pt-[24px]">
        <ThemedText className="text-[16px] font-bold text-foreground">Basic info</ThemedText>

        <SegmentedControl
          segments={BROKER_SEGMENTS}
          selectedIndex={selectedIndex}
          onSelect={setSelectedIndex}
          accessibilityLabel="Broker type"
        />

        <SearchInput
          placeholder="Search your broker"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView
        className="flex-1 px-4 py-4"
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
            stats={broker.stats}
            onPress={() => router.push(`/announcement/rent/broker/${broker.id}`)}
          />
        ))}
      </ScrollView>

      <AnnouncementFooter
        firstButtonLabel="Next"
        secondButtonLabel="Save & exit"
        onNextPress={() => handleNext()}
        onSaveAndExitPress={() => handleSaveAndExit()}
      />
    </ThemedView>
  );
}
