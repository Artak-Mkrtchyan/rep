import { Href, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';

import { HeroSection } from '@/components/home/hero-section';
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

  const handleSearch = useCallback((filters: SearchFilters) => {
    setIsSearchVisible(false);
    // TODO: Navigate to search results with filters
  }, []);

  return (
    <ThemedView className="flex-1">
      <HeroSection onMenuPress={handleMenuPress} onSearchPress={handleSearchPress} />

      <SearchModal
        visible={isSearchVisible}
        onClose={handleSearchClose}
        onSearch={handleSearch}
      />
    </ThemedView>
  );
}
