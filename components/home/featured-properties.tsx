import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { FeaturedPropertyCard } from '@/components/home/featured-property-card';
import { HOME_DESIGN } from '@/components/home/home-design-tokens';
import { SectionHeaderRow } from '@/components/home/section-header-row';
import { ThemedView } from '@/components/themed-view';
import { PaginationIndicator } from '@/components/ui/pagination-indicator';
import { useAuth } from '@/context/AuthContext';
import { useFeaturedAnnouncements } from '@/hooks/api/use-announcements';
import { useHomeMetrics } from '@/hooks/use-home-metrics';
import { MOCK_FEATURED_LISTINGS, isMockHomeListingId } from '@/lib/mocks/home-mock-data';
import { announcementsService } from '@/lib/api/announcements';
import {
  announcementToFeaturedVm,
  mockListingToFeaturedVm,
  type FeaturedListingViewModel,
} from '@/lib/utils/home-featured-helpers';

const featuredLayout = StyleSheet.create({
  root: {
    marginTop: HOME_DESIGN.layout.sectionGap,
  },
  headerAndCarousel: {
    paddingHorizontal: HOME_DESIGN.layout.affordabilityPaddingH,
    gap: HOME_DESIGN.layout.headerToCarousel,
  },
});

type FeaturedPropertiesProps = {
  onSeeMorePress?: () => void;
};

export const FeaturedProperties: React.FC<FeaturedPropertiesProps> = ({ onSeeMorePress }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAuth();
  const metrics = useHomeMetrics();
  const { announcements, isLoading, error, refetch } = useFeaturedAnnouncements(5);

  const [mockFavourite, setMockFavourite] = useState<Record<string, boolean>>({});
  const [mockComparison, setMockComparison] = useState<Record<string, boolean>>({});

  const useMockData = !isLoading && (error != null || announcements.length === 0);

  const baseListings: FeaturedListingViewModel[] = useMemo(() => {
    if (!useMockData) {
      return announcements.map(announcementToFeaturedVm);
    }
    return MOCK_FEATURED_LISTINGS.map(mockListingToFeaturedVm);
  }, [announcements, useMockData]);

  const listings: FeaturedListingViewModel[] = useMemo(() => {
    if (!useMockData) {
      return baseListings;
    }
    return baseListings.map((vm) => ({
      ...vm,
      isFavourite: mockFavourite[vm.id] ?? vm.isFavourite,
      isForComparison: mockComparison[vm.id] ?? vm.isForComparison,
    }));
  }, [baseListings, mockComparison, mockFavourite, useMockData]);

  const toggleFavourite = useCallback(
    async (id: string, isFavourite: boolean) => {
      if (!user) {
        router.push('/(auth)' as any);
        return;
      }
      if (useMockData) {
        setMockFavourite((prev) => ({ ...prev, [id]: !isFavourite }));
        return;
      }
      try {
        if (isFavourite) {
          await announcementsService.removeFromFavourites(id);
        } else {
          await announcementsService.addToFavourites(id);
        }
        await refetch();
      } catch (err) {
        console.error('Failed to toggle favourite:', err);
      }
    },
    [refetch, useMockData, user, router]
  );

  const toggleComparison = useCallback(
    async (id: string, isForComparison: boolean) => {
      if (!user) {
        router.push('/(auth)' as any);
        return;
      }
      if (useMockData) {
        setMockComparison((prev) => ({ ...prev, [id]: !isForComparison }));
        return;
      }
      try {
        if (isForComparison) {
          await announcementsService.removeFromComparison(id);
        } else {
          await announcementsService.addToComparison(id);
        }
        await refetch();
      } catch (err) {
        console.error('Failed to toggle comparison:', err);
      }
    },
    [refetch, useMockData, user, router]
  );

  const [activeIndex, setActiveIndex] = useState(0);

  useFocusEffect(
    useCallback(() => {
      if (!useMockData) {
        refetch();
      }
    }, [refetch, useMockData])
  );

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / metrics.featuredCardStride);
      setActiveIndex(Math.min(Math.max(index, 0), listings.length - 1));
    },
    [listings.length, metrics.featuredCardStride]
  );

  if (isLoading) {
    return (
      <ThemedView className="py-8">
        <ActivityIndicator size="small" />
      </ThemedView>
    );
  }

  if (listings.length === 0) {
    return null;
  }

  return (
    <View style={featuredLayout.root}>
      <View style={featuredLayout.headerAndCarousel}>
        <SectionHeaderRow
          title={t('home.featured_property')}
          actionLabel={t('home.see_more')}
          onActionPress={onSeeMorePress}
        />

        <ScrollView
          className="overflow-visible"
          contentContainerStyle={{ gap: metrics.gap, paddingRight: metrics.horizontalPad }}
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          horizontal>
          {listings.map((item) => (
            <FeaturedPropertyCard
              key={item.id}
              cardWidth={metrics.featuredCardWidth}
              imageHeight={metrics.featuredImageHeight}
              title={item.title}
              address={item.address}
              attributes={item.attributes}
              priceLabel={item.priceLabel}
              statusLabel={item.statusLabel}
              imageSources={item.imageSources}
              isFavourite={item.isFavourite}
              isForComparison={item.isForComparison}
              onPress={
                isMockHomeListingId(item.id)
                  ? undefined
                  : () => router.push(`/announcement/${item.id}` as any)
              }
              onFavouritePress={() => toggleFavourite(item.id, item.isFavourite)}
              onComparisonPress={() => toggleComparison(item.id, item.isForComparison)}
            />
          ))}
        </ScrollView>
      </View>

      <PaginationIndicator
        count={listings.length}
        activeIndex={activeIndex}
        variant="inline"
        inlineMarginTop={HOME_DESIGN.layout.carouselToDots}
      />
    </View>
  );
};
