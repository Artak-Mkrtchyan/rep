import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, ScrollView, Share, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AttachedFiles } from '@/components/announcement/attached-files';
import { ContactInfoModal } from '@/components/announcement/contact-info-modal';
import { DescriptionSection } from '@/components/announcement/description-section';
import { detailStyles } from '@/components/announcement/detail/announcement-detail.styles';
import { ClosingReasonBanner } from '@/components/announcement/detail/closing-reason-banner';
import { DetailHeaderSection } from '@/components/announcement/detail/detail-header-section';
import { LocationSection } from '@/components/announcement/detail/location-section';
import { NotableDistancesSection } from '@/components/announcement/detail/notable-distances-section';
import { ImageCarousel } from '@/components/announcement/image-carousel';
import { ObjectCharacteristics } from '@/components/announcement/object-characteristics';
import { PetsAllowed } from '@/components/announcement/pets-allowed';
import { PhotoGallery } from '@/components/announcement/photo-gallery';
import { PriceHistory } from '@/components/announcement/price-history';
import { ChangeStatusBottomSheet } from '@/components/my-announcements';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/AuthContext';
import { useAnnouncementDetails } from '@/hooks/api/use-announcement-details';
import { useScreenEdgePadding } from '@/hooks/use-screen-edge-padding';
import { getPriceLabel } from '@/lib/utils/announcement-helpers';
import {
  hasLocationData,
  mapDistances,
  mapImages,
  mapLocation,
  mapPets,
  mapTypeLabel,
} from '@/lib/utils/announcement-mappers';

export default function AnnouncementDetailScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const { announcement, isLoading, error, refetch, toggleFavourite, toggleComparison } =
    useAnnouncementDetails(id!);
  const { horizontalStyle } = useScreenEdgePadding();

  const handleBack = useCallback(() => router.back(), [router]);

  const handleShare = useCallback(async () => {
    if (!announcement) return;
    try {
      await Share.share({
        title: announcement.title,
        message: `${announcement.title}\n${getPriceLabel(announcement)}`,
      });
    } catch {
      // user cancelled or share failed
    }
  }, [announcement]);

  const handleEdit = useCallback(() => {
    if (!id) return;

    router.push({
      pathname: '/announcement/form/[id]',
      params: { id, isAnnouncement: 'true' },
    });
  }, [id, router]);

  const [galleryVisible, setGalleryVisible] = useState(false);
  const [galleryInitialIndex, setGalleryInitialIndex] = useState(0);
  const [statusSheetVisible, setStatusSheetVisible] = useState(false);
  const [contactInfoVisible, setContactInfoVisible] = useState(false);

  const handleImagePress = useCallback((index: number) => {
    setGalleryInitialIndex(index);
    setGalleryVisible(true);
  }, []);

  const handleStatusChanged = useCallback(() => {
    setStatusSheetVisible(false);
    refetch();
  }, [refetch]);

  const images = useMemo(() => (announcement ? mapImages(announcement) : []), [announcement]);
  const location = useMemo(
    () => (announcement ? mapLocation(announcement) : undefined),
    [announcement]
  );
  const typeLabel = useMemo(
    () => (announcement ? mapTypeLabel(announcement, t) : ''),
    [announcement, t]
  );
  const distances = useMemo(() => (announcement ? mapDistances(announcement) : []), [announcement]);
  const pets = useMemo(() => (announcement ? mapPets(announcement) : null), [announcement]);

  const isActive = announcement?.status?.code === 'ACTIVE';
  const closureReason = announcement?.closureReason;

  if (isLoading) {
    return (
      <ThemedView className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  if (error || !announcement) {
    return (
      <ThemedView className="flex-1 items-center justify-center" style={horizontalStyle}>
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
        <ImageCarousel images={images} onImagePress={handleImagePress} />

        <View style={detailStyles.content}>
          <View style={detailStyles.pillContainer}>
            <View style={detailStyles.pill} />
          </View>

          {/* Closing reason banner */}
          {closureReason ? (
            <View className="mb-3">
              <ClosingReasonBanner reason={closureReason.name || closureReason.code} />
            </View>
          ) : null}

          <DetailHeaderSection
            title={announcement.title}
            publicId={announcement.publicId}
            typeLabel={typeLabel}
            price={getPriceLabel(announcement)}
            statusLabel={announcement.status?.name}
            statusCode={announcement.status?.code}
            postedDate={announcement.createdAt}
            updatedDate={announcement.updatedAt}
            onStatusPress={isActive ? () => setStatusSheetVisible(true) : undefined}
          />

          {hasLocationData(location) && <LocationSection location={location!} />}

          <NotableDistancesSection
            distances={distances}
            lat={announcement.geo?.latitude}
            lng={announcement.geo?.longitude}
            mapLabel={
              [location?.street, location?.house].filter(Boolean).join(' ') || announcement.title
            }
          />

          <DescriptionSection description={announcement.description} />

          <View style={horizontalStyle}>
            <ObjectCharacteristics
              propertyType={announcement.propertyType}
              propertyDetails={announcement.property}
              securityDeposit={announcement.rentDetails?.securityDeposit}
            />
          </View>

          {pets && (
            <View style={horizontalStyle}>
              <PetsAllowed pets={pets} />
            </View>
          )}

          <View style={horizontalStyle}>
            <PriceHistory announcementId={id!} />
          </View>

          {announcement.documents && announcement.documents.length > 0 && (
            <View style={horizontalStyle}>
              <AttachedFiles documents={announcement.documents} />
            </View>
          )}
        </View>
      </ScrollView>

      {/* Top action bar */}
      <SafeAreaView
        className="absolute left-0 right-0 top-0 z-10"
        style={horizontalStyle}
        edges={['top']}>
        <View className="flex-row items-center justify-between" style={{ marginTop: 16 }}>
          <Pressable
            onPress={handleBack}
            accessibilityRole="button"
            accessibilityLabel={t('common.go_back')}
            style={detailStyles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </Pressable>
          <View style={detailStyles.actionButtonsGroup}>
            {isAuthenticated ? (
              <Pressable onPress={toggleFavourite} accessibilityLabel="Favourite">
                <Ionicons
                  name={announcement.favourite ? 'heart' : 'heart-outline'}
                  size={24}
                  color={announcement.favourite ? '#FF3636' : '#FFFFFF'}
                />
              </Pressable>
            ) : null}
            {isAuthenticated ? (
              <Pressable onPress={toggleComparison} accessibilityLabel="Compare">
                <Image
                  source={require('@/assets/images/menu-icon.svg')}
                  style={{ width: 24, height: 24 }}
                  contentFit="contain"
                  tintColor={announcement.forComparison ? '#13B86D' : '#FFFFFF'}
                />
              </Pressable>
            ) : null}
            <Pressable onPress={handleShare} accessibilityLabel="Share">
              <Ionicons name="share-social-outline" size={24} color="#FFFFFF" />
            </Pressable>
            {isAuthenticated && isActive ? (
              <Pressable onPress={handleEdit} accessibilityLabel="Edit">
                <Ionicons name="create-outline" size={24} color="#FFFFFF" />
              </Pressable>
            ) : null}
          </View>
        </View>
      </SafeAreaView>

      {/* Bottom action bar (only when active) */}
      {isActive ? (
        <SafeAreaView
          className="bottom-0 left-0 right-0 bg-white"
          style={detailStyles.bottomBarShadow}
          edges={['bottom']}>
          <View style={detailStyles.bottomBar}>
            <Pressable style={detailStyles.primaryButton}>
              <ThemedText className="text-[16px] font-medium leading-[21px] text-white">
                {t('announcement.detail.request_tour')}
              </ThemedText>
            </Pressable>
            <Pressable
              style={detailStyles.secondaryButton}
              onPress={() => setContactInfoVisible(true)}>
              <ThemedText className="text-[16px] font-medium leading-[21px] text-[#0E9457]">
                {t('announcement.detail.contact_info')}
              </ThemedText>
            </Pressable>
          </View>
        </SafeAreaView>
      ) : null}

      {/* Change status bottom sheet */}
      <ChangeStatusBottomSheet
        visible={statusSheetVisible}
        currentStatus={announcement.status?.code || 'ACTIVE'}
        announcementId={id!}
        onClose={() => setStatusSheetVisible(false)}
        onStatusChanged={handleStatusChanged}
      />

      <PhotoGallery
        visible={galleryVisible}
        images={images}
        initialIndex={galleryInitialIndex}
        isFavourite={announcement.favourite}
        onClose={() => setGalleryVisible(false)}
        onToggleFavourite={toggleFavourite}
      />

      {contactInfoVisible ? (
        <ContactInfoModal
          visible={contactInfoVisible}
          announcementId={id!}
          brokerId={announcement.assignedBrokerId}
          onClose={() => setContactInfoVisible(false)}
        />
      ) : null}
    </ThemedView>
  );
}
