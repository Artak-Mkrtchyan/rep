import { Href, useRouter } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import { type NativeScrollEvent, type NativeSyntheticEvent, ScrollView, View } from 'react-native';

import { ActionCardsSection } from '@/components/home/action-cards-section';
import { AffordabilityCalculatorSection } from '@/components/home/affordability-calculator-section';
import { ConstructionCompaniesSection } from '@/components/home/construction-companies-section';
import { FeaturedProperties } from '@/components/home/featured-properties';
import { GetRecommendationsCTA } from '@/components/home/get-recommendations-cta';
import { HomeFooter } from '@/components/home/home-footer';
import { HeroSection } from '@/components/home/hero-section';
import { RealEstateAgentsSection } from '@/components/home/real-estate-agents-section';
import { SearchModal } from '@/components/search/search-modal';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/AuthContext';
import type { SearchFilters } from '@/types/search';

const COMPACT_HEADER_SCROLL_THRESHOLD = 120;

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const isAuthenticated = !!user;

  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isCompactHeaderVisible, setIsCompactHeaderVisible] = useState(false);
  const compactHeaderVisibleRef = useRef(false);

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

  const handleLoginPress = useCallback(() => {
    router.push('/(auth)' as Href);
  }, [router]);

  const handleSearchAction = useCallback(
    (filters: SearchFilters) => {
      router.push({
        pathname: '/search/results' as any,
        params: { filters: JSON.stringify(filters) },
      });
    },
    [router]
  );

  const handleAuthGatedAction = useCallback(
    (route: string) => {
      if (isAuthenticated) {
        router.push(route as Href);
      } else {
        router.push('/(auth)' as Href);
      }
    },
    [isAuthenticated, router]
  );

  const handleBrokersNavigate = useCallback(() => {
    router.push('/partners/brokers' as Href);
  }, [router]);

  const handleConstructionCompaniesNavigate = useCallback(() => {
    router.push('/partners/construction-companies' as Href);
  }, [router]);

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const nextIsVisible = event.nativeEvent.contentOffset.y > COMPACT_HEADER_SCROLL_THRESHOLD;

    if (compactHeaderVisibleRef.current === nextIsVisible) {
      return;
    }

    compactHeaderVisibleRef.current = nextIsVisible;
    setIsCompactHeaderVisible(nextIsVisible);
  }, []);

  return (
    <ThemedView className="flex-1">
      <ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        contentContainerClassName="pt-[320px]"
        onScroll={handleScroll}>
        <FeaturedProperties />
        <AffordabilityCalculatorSection />
        <RealEstateAgentsSection
          onSeeMorePress={handleBrokersNavigate}
          onCardPress={handleBrokersNavigate}
        />
        <ActionCardsSection
          onSearchAction={handleSearchAction}
          onAuthGatedAction={handleAuthGatedAction}
        />
        <ConstructionCompaniesSection
          onSeeMorePress={handleConstructionCompaniesNavigate}
          onCardPress={handleConstructionCompaniesNavigate}
        />
        {!isAuthenticated && <GetRecommendationsCTA onPress={handleLoginPress} />}
        <HomeFooter />
      </ScrollView>

      <View className="absolute left-0 right-0 top-0 z-10">
        <HeroSection
          onMenuPress={handleMenuPress}
          onSearchPress={handleSearchPress}
          isAuthenticated={isAuthenticated}
          onLoginPress={handleLoginPress}
          isCompactHeaderVisible={isCompactHeaderVisible}
        />
      </View>

      <SearchModal visible={isSearchVisible} onClose={handleSearchClose} onSearch={handleSearch} />
    </ThemedView>
  );
}
