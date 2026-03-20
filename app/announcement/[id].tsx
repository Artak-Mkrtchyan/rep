import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DescriptionSection } from '@/components/announcement/description-section';
import { detailStyles } from '@/components/announcement/detail/announcement-detail.styles';
import { DetailHeaderSection } from '@/components/announcement/detail/detail-header-section';
import { LocationSection } from '@/components/announcement/detail/location-section';
import { NotableDistancesSection } from '@/components/announcement/detail/notable-distances-section';
import { ImageCarousel } from '@/components/announcement/image-carousel';
import { ObjectCharacteristics } from '@/components/announcement/object-characteristics';
import { PetsAllowed } from '@/components/announcement/pets-allowed';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAnnouncementDetails } from '@/hooks/api/use-announcement-details';
import { getPriceLabel } from '@/lib/utils/announcement-helpers';
import {
  hasLocationData,
  mapImages,
  mapLocation,
  mapPets,
  mapTypeLabel,
} from '@/lib/utils/announcement-mappers';

export default function AnnouncementDetailScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { announcement, isLoading, error, refetch } = useAnnouncementDetails(id!);

  const handleBack = useCallback(() => router.back(), [router]);

  const images = useMemo(() => (announcement ? mapImages(announcement) : []), [announcement]);
  const location = useMemo(
    () => (announcement ? mapLocation(announcement) : undefined),
    [announcement]
  );
  const typeLabel = useMemo(
    () => (announcement ? mapTypeLabel(announcement, t) : ''),
    [announcement, t]
  );
  const pets = useMemo(() => (announcement ? mapPets(announcement) : null), [announcement]);

  if (isLoading) {
    return (
      <ThemedView className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  if (error || !announcement) {
    return (
      <ThemedView className="flex-1 items-center justify-center px-4">
        <ThemedText className="mb-4 text-center text-foreground">
          {error || t('announcement.detail.not_found')}
        </ThemedText>
        <View className="flex-row gap-4">
          <Pressable onPress={handleBack} className="rounded-lg bg-muted px-6 py-3">
            <ThemedText className="font-semibold text-foreground">{t('common.go_back')}</ThemedText>
          </Pressable>
          <Pressable onPress={refetch} className="rounded-lg bg-main-500 px-6 py-3">
            <ThemedText className="font-semibold text-white">{t('common.retry')}</ThemedText>
          </Pressable>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView className="flex-1">
      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageCarousel images={images} />

        <View style={detailStyles.content}>
          <View style={detailStyles.pillContainer}>
            <View style={detailStyles.pill} />
          </View>

          <DetailHeaderSection
            title={announcement.title}
            publicId={announcement.publicId}
            typeLabel={typeLabel}
            price={getPriceLabel(announcement)}
          />

          {hasLocationData(location) && <LocationSection location={location!} />}

          <NotableDistancesSection />

          <DescriptionSection description={announcement.description} />

          <View className="px-[16px]">
            <ObjectCharacteristics
              propertyType={announcement.propertyType}
              propertyDetails={announcement.property}
              securityDeposit={announcement.rentDetails?.securityDeposit}
            />
          </View>

          {pets && (
            <View className="px-[16px]">
              <PetsAllowed pets={pets} />
            </View>
          )}
        </View>
      </ScrollView>

      <SafeAreaView className="absolute left-[16px] top-0 z-10" edges={['top']}>
        <Pressable
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel={t('common.go_back')}
          style={detailStyles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#111111" />
        </Pressable>
      </SafeAreaView>
    </ThemedView>
  );
}
