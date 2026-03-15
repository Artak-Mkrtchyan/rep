import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { ListingType, PropertyTypeValue, SearchFilters } from '@/types/search';

import { ListingTypeToggle } from './listing-type-toggle';
import { PriceRangeFilter } from './price-range-filter';
import { PropertyTypeFilter } from './property-type-filter';

type SearchModalProps = {
  visible: boolean;
  onClose: () => void;
  onSearch: (filters: SearchFilters) => void;
};

export const SearchModal: React.FC<SearchModalProps> = ({ visible, onClose, onSearch }) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [listingType, setListingType] = useState<ListingType>('BUY');
  const [propertyTypes, setPropertyTypes] = useState<PropertyTypeValue[]>([]);
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');

  const handleTogglePropertyType = useCallback((type: PropertyTypeValue) => {
    setPropertyTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  }, []);

  const handleSearch = useCallback(() => {
    onSearch({ query, listingType, propertyTypes, priceMin, priceMax });
  }, [query, listingType, propertyTypes, priceMin, priceMax, onSearch]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <View className="flex-1 bg-background" style={{ paddingBottom: insets.bottom }}>
        <View className="flex-row items-center justify-between px-4 py-3">
          <Pressable
            onPress={onClose}
            className="h-10 w-10 items-center justify-center"
            accessibilityLabel={t('search.close')}
            accessibilityRole="button">
            <Ionicons name="close" size={24} color="#111111" />
          </Pressable>
          <ThemedText className="text-[18px] font-semibold">{t('search.title')}</ThemedText>
          <View className="h-10 w-10" />
        </View>

        <ScrollView
          className="flex-1 px-4"
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 24 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Input
            placeholder={t('search.title')}
            value={query}
            onChangeText={setQuery}
            left={<Ionicons name="search-outline" size={20} color="#ababab" />}
          />

          <View className="mt-5">
            <ListingTypeToggle value={listingType} onChange={setListingType} />
          </View>

          <View className="mt-5">
            <PropertyTypeFilter selectedTypes={propertyTypes} onToggle={handleTogglePropertyType} />
          </View>

          <View className="mt-6">
            <PriceRangeFilter
              priceMin={priceMin}
              priceMax={priceMax}
              onPriceMinChange={setPriceMin}
              onPriceMaxChange={setPriceMax}
            />
          </View>
        </ScrollView>

        <View className="px-4 pb-4">
          <Button onPress={handleSearch}>{t('search.title')}</Button>
        </View>
      </View>
    </Modal>
  );
};
