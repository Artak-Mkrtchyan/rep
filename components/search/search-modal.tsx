import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import type { ListingType, PropertyTypeValue, SearchFilters } from '@/types/search';

import { AddressAutocomplete } from './address-autocomplete';
import { ListingTypeToggle } from './listing-type-toggle';
import { PriceRangeFilter } from './price-range-filter';
import { PropertyTypeFilter } from './property-type-filter';

type SearchModalProps = {
  visible: boolean;
  onClose: () => void;
  onSearch: (filters: SearchFilters) => void;
  initialFilters?: SearchFilters;
};

export const SearchModal: React.FC<SearchModalProps> = ({
  visible,
  onClose,
  onSearch,
  initialFilters,
}) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [address, setAddress] = useState(initialFilters?.address ?? '');
  const [listingType, setListingType] = useState<ListingType | null>(
    initialFilters?.listingType ?? null
  );
  const [propertyTypes, setPropertyTypes] = useState<PropertyTypeValue[]>(
    initialFilters?.propertyTypes ?? []
  );
  const [priceMin, setPriceMin] = useState(initialFilters?.priceMin ?? '');
  const [priceMax, setPriceMax] = useState(initialFilters?.priceMax ?? '');

  useEffect(() => {
    if (visible && initialFilters) {
      setAddress(initialFilters.address ?? '');
      setListingType(initialFilters.listingType);
      setPropertyTypes(initialFilters.propertyTypes);
      setPriceMin(initialFilters.priceMin);
      setPriceMax(initialFilters.priceMax);
    }
  }, [visible, initialFilters]);

  const handleTogglePropertyType = useCallback((type: PropertyTypeValue) => {
    setPropertyTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  }, []);

  const handleSearch = useCallback(() => {
    onSearch({
      query: '',
      address,
      listingType,
      propertyTypes,
      priceMin,
      priceMax,
      sortOption: initialFilters?.sortOption ?? 'NEWEST_FIRST',
    });
  }, [
    address,
    listingType,
    propertyTypes,
    priceMin,
    priceMax,
    onSearch,
    initialFilters?.sortOption,
  ]);

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
          <AddressAutocomplete
            value={address}
            onChange={setAddress}
            placeholder={t('search.address_placeholder')}
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
