import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

import { AnnouncementSmallCard } from '@/components/announcement/announcement-small-card';
import { ThemedText } from '@/components/themed-text';

type ListingFilter = 'for_sale' | 'for_rent' | 'sold';

type FilterChipProps = {
  label: string;
  count: number;
  color: string;
  isSelected: boolean;
  onPress: () => void;
};

const FilterChip: React.FC<FilterChipProps> = ({ label, count, color, isSelected, onPress }) => (
  <Pressable
    onPress={onPress}
    className="flex-row items-center gap-1.5 px-2 py-1"
    accessibilityRole="button"
    accessibilityState={{ selected: isSelected }}>
    <View className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
    <ThemedText
      className={`text-[12px] ${isSelected ? 'font-semibold text-foreground' : 'text-neutral-500'}`}>
      {label} ({count})
    </ThemedText>
  </Pressable>
);

const PLACEHOLDER_LISTING = {
  title: 'White house villa',
  address: '974 Valencia St San Francisco, CA94110 San Francisco, CA94110',
  bedsLabel: 'Bed 4',
  bathsLabel: 'Bath 3',
  sizeLabel: '1,442',
  priceLabel: '$ 820,420',
} as const;

type BrokerListingsSectionProps = {
  className?: string;
};

export const BrokerListingsSection: React.FC<BrokerListingsSectionProps> = ({ className }) => {
  const { t } = useTranslation();
  const [selectedFilter, setSelectedFilter] = useState<ListingFilter>('for_sale');

  const filters: { key: ListingFilter; label: string; count: number; color: string }[] = [
    { key: 'for_sale', label: t('partners.for_sale'), count: 74, color: '#EF4444' },
    { key: 'for_rent', label: t('partners.for_rent'), count: 9, color: '#22C55E' },
    { key: 'sold', label: t('partners.sold'), count: 9, color: '#EAB308' },
  ];

  return (
    <View className={className}>
      <ThemedText className="mb-3 text-[16px] font-bold text-foreground">
        {t('partners.listings_and_deals', { count: 174 })}
      </ThemedText>

      <View className="mb-3 flex-row items-center gap-2">
        {filters.map((filter) => (
          <FilterChip
            key={filter.key}
            label={filter.label}
            count={filter.count}
            color={filter.color}
            isSelected={selectedFilter === filter.key}
            onPress={() => setSelectedFilter(filter.key)}
          />
        ))}
      </View>

      {/* Map placeholder */}
      <View className="mb-4 h-[180px] w-full overflow-hidden rounded-[12px] bg-neutral-100">
        <View className="flex-1 items-center justify-center">
          <ThemedText className="text-[14px] text-neutral-400">Map</ThemedText>
        </View>
      </View>

      {/* Listing sections */}
      {filters.map((filter) => (
        <View key={filter.key} className="mb-4">
          <View className="mb-2 flex-row items-center justify-between">
            <ThemedText className="text-[16px] font-bold text-foreground">
              {filter.label} ({filter.count})
            </ThemedText>
            <Pressable>
              <ThemedText className="text-[14px] font-semibold text-primary">
                {t('partners.see_all')}
              </ThemedText>
            </Pressable>
          </View>

          <AnnouncementSmallCard
            imageSource={require('@/assets/images/hero.png')}
            title={PLACEHOLDER_LISTING.title}
            address={PLACEHOLDER_LISTING.address}
            bedsLabel={PLACEHOLDER_LISTING.bedsLabel}
            bathsLabel={PLACEHOLDER_LISTING.bathsLabel}
            sizeLabel={PLACEHOLDER_LISTING.sizeLabel}
            priceLabel={PLACEHOLDER_LISTING.priceLabel}
          />
        </View>
      ))}
    </View>
  );
};
