import { Href, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ScrollView } from 'react-native';

import { AffordabilityCalculatorSection } from '@/components/home/affordability-calculator-section';
import { ConstructionCompaniesSection } from '@/components/home/construction-companies-section';
import { FeaturedProperties } from '@/components/home/featured-properties';
import { HeroSection } from '@/components/home/hero-section';
import { RealEstateAgentsSection } from '@/components/home/real-estate-agents-section';
import { SearchModal } from '@/components/search/search-modal';
import { ThemedView } from '@/components/themed-view';
import type { SearchFilters } from '@/types/search';

export default function HomeScreen() {
  const router = useRouter();
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const handleMenuPress = useCallback(() => {
    router.push('/menu' as Href);
  }, [router]);

  const handleSearchPress = useCallback(() => {
    setIsSearchVisible(true);
  }, []);

  const handleSearchClose = useCallback(() => {
    setIsSearchVisible(false);
  }, []);

  const handleSearch = useCallback(
    (filters: SearchFilters) => {
      setIsSearchVisible(false);
      router.push({
        pathname: '/search/results' as any,
        params: { filters: JSON.stringify(filters) },
      });
    },
    [router]
  );

  return (
    <ThemedView className="flex-1">
      <ScrollView showsVerticalScrollIndicator={false}>
        <HeroSection onMenuPress={handleMenuPress} onSearchPress={handleSearchPress} />
        <FeaturedProperties onSeeMorePress={handleSearchPress} />
        <AffordabilityCalculatorSection onSubmit={handleSearchPress} />
        <RealEstateAgentsSection onSeeMorePress={handleSearchPress} />
        <ConstructionCompaniesSection onSeeMorePress={handleSearchPress} />
      </ScrollView>

      <SearchModal
        visible={isSearchVisible}
        onClose={handleSearchClose}
        onSearch={handleSearch}
      />
    </ThemedView>
  );
}
