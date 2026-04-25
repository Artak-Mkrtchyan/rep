import { Href, useRouter } from 'expo-router';
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
import {
  useFeaturedAnnouncements,
  useToggleComparison,
  useToggleFavourite,
} from '@/hooks/api/use-announcements';
import { useHomeMetrics } from '@/hooks/use-home-metrics';
import {
  announcementToFeaturedVm,
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

type FeaturedPropertiesProps = Record<string, never>;

export const FeaturedProperties: React.FC<FeaturedPropertiesProps> = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAuth();
  const metrics = useHomeMetrics();
  const { announcements, isLoading } = useFeaturedAnnouncements();
  const toggleFavourite = useToggleFavourite();
  const toggleComparison = useToggleComparison();

  const listings: FeaturedListingViewModel[] = useMemo(
    () => announcements.map(announcementToFeaturedVm),
    [announcements]
  );

  const handleSeeMore = useCallback(() => {
    router.push({
      pathname: '/search/results' as Href,
      params: {
        filters: JSON.stringify({
          query: '',
          address: '',
          listingType: null,
          propertyTypes: [],
          priceMin: '',
          priceMax: '',
          sortOption: 'NEWEST_FIRST',
        }),
      },
    });
  }, [router]);

  const requireAuth = useCallback(() => {
    if (!user) {
      router.push('/(auth)' as any);
      return false;
    }
    return true;
  }, [user, router]);

  const handleFavouritePress = useCallback(
    (id: string, isFavourite: boolean) => {
      if (requireAuth()) toggleFavourite.mutate({ id, isFavourite });
    },
    [requireAuth, toggleFavourite]
  );

  const handleComparisonPress = useCallback(
    (id: string, isForComparison: boolean) => {
      if (requireAuth()) toggleComparison.mutate({ id, isForComparison });
    },
    [requireAuth, toggleComparison]
  );

  const [activeIndex, setActiveIndex] = useState(0);

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
          onActionPress={handleSeeMore}
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
              onPress={() => router.push(`/announcement/${item.id}` as any)}
              onFavouritePress={() => handleFavouritePress(item.id, item.isFavourite)}
              onComparisonPress={() => handleComparisonPress(item.id, item.isForComparison)}
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
