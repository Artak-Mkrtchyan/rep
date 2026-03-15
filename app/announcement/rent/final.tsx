import { router } from 'expo-router';
import React from 'react';
import { Alert, Pressable, ScrollView, View } from 'react-native';

import { AnnouncementCard } from '@/components/announcement/announcement-card';
import { AnnouncementFooter } from '@/components/announcement/announcement-footer';
import { PlacedByItem } from '@/components/announcement/placed-by-item';
import { PropertyAnnouncementDetail } from '@/components/announcement/property-announcement-detail';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ImageSlider } from '@/components/ui/image-slider';
import {
  CHARACTERISTIC_ICONS,
  OBJECT_CHARACTERISTICS,
  PET_ITEMS_CONFIG,
} from '@/constants/announcement';
import { useAnnouncementForRentFormStore } from '@/store/announcementStore';
import { Image } from 'expo-image';

export default function FinalScreen() {
  const formData = useAnnouncementForRentFormStore((s) => s.formData);
  const publicId = useAnnouncementForRentFormStore((s) => s.publicId);
  const publishFormData = useAnnouncementForRentFormStore((s) => s.publishFormData);
  const resetForm = useAnnouncementForRentFormStore((s) => s.resetForm);

  const handlePublish = async () => {
    try {
      await publishFormData();
      resetForm();
    } catch {
      Alert.alert('Error', 'Failed to publish');
    } finally {
      router.replace('/(tabs)');
    }
  };

  const handleSaveAndExit = () => {
    router.push('/(tabs)');
  };

  const handleViewOnMap = () => {
    // Placeholder: open map with address
  };

  const allowedPets = PET_ITEMS_CONFIG.filter((c) => c.getAllowed(formData));

  const conditionRaw = formData.property?.attributes?.ownershipAndCondition?.condition;
  const conditionLabel =
    conditionRaw === 'EXCELLENT'
      ? 'Excellent'
      : conditionRaw === 'RENOVATED'
        ? 'Renovated'
        : conditionRaw === 'NEEDS_RENOVATION'
          ? 'Needs renovation'
          : conditionRaw === 'UNDER_CONSTRUCTION'
            ? 'Under construction'
            : '—';

  const buildingTypeRaw = formData.property?.attributes?.building?.buildingType;
  const buildingTypeLabel = buildingTypeRaw
    ? buildingTypeRaw.charAt(0).toUpperCase() + buildingTypeRaw.slice(1)
    : '—';

  const ownershipRaw = formData.property?.attributes?.ownershipAndCondition?.ownershipType;
  const ownershipLabel =
    ownershipRaw === 'FULL'
      ? 'Full'
      : ownershipRaw === 'SHARED'
        ? 'Shared'
        : ownershipRaw === 'JOINT'
          ? 'Joint'
          : '—';

  const formatYesNo = (v: boolean | undefined) => (v ? 'Yes' : 'No');

  const typeLabel =
    formData.listingType === 'FOR_RENT' ? 'Apartment for rent' : 'Apartment for sale';

  const imageSources: { uri: string }[] = [];

  const characteristicHelpers = {
    conditionLabel,
    buildingTypeLabel,
    ownershipLabel,
    formatYesNo,
  };

  return (
    <ThemedView className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 31 }}
        showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-6">
          <View className="mb-4">
            <ImageSlider
              images={imageSources}
              accessibilityLabel="Property images"
              className="h-[345px]"
            />
            <View className="absolute right-[16px] top-[16px]  flex-row items-center gap-[8px]">
              <Pressable className="h-[44px] w-[44px] items-center justify-center rounded-[31px] bg-[#1111114d]">
                <Image
                  source={require('@/assets/images/heart-icon.svg')}
                  style={{
                    width: 24,
                    height: 24,
                    tintColor: 'white',
                  }}
                  contentFit="contain"
                />
              </Pressable>
              <Pressable className="h-[44px] w-[44px] items-center justify-center rounded-[31px] bg-[#1111114d]">
                <Image
                  source={require('@/assets/images/menu-icon.svg')}
                  style={{
                    width: 24,
                    height: 24,
                    tintColor: 'white',
                  }}
                  contentFit="contain"
                />
              </Pressable>
            </View>
          </View>

          <PropertyAnnouncementDetail
            title={formData.title || ''}
            id={publicId}
            typeLabel={typeLabel}
            price="-"
            location={{
              country: formData.geo.country,
              city: formData.geo.locality,
              district: formData.geo.province,
              address: `${formData.geo.street} ${formData.geo.house || ''}`,
            }}
            distances={{
              metro: '-',
              hospital: '-',
              school: '-',
              grocery: '-',
            }}
            placedBy={{
              name: '-',
            }}
            postedDate="-"
            updatedDate="-"
            onViewMap={handleViewOnMap}
          />

          {/* Description */}
          <View className="my-4">
            <ThemedText className="mb-3 text-[20px] font-semibold text-neutral-950">
              Description
            </ThemedText>
            <ThemedText className="text-neutaral-800 text-[14px] leading-5">
              {formData.description || '-'}
            </ThemedText>
          </View>

          {/* Object characteristics + Security deposit */}
          <AnnouncementCard title="Object characteristics" className="mb-4 gap-[24px]">
            <View className="flex-row flex-wrap gap-y-4">
              {OBJECT_CHARACTERISTICS.map((config) => (
                <View key={config.iconKey} className="w-1/2 pr-2">
                  <PlacedByItem
                    icon={
                      <View className="h-[32px] w-[32px] items-center justify-center rounded-full bg-muted">
                        <Image
                          source={CHARACTERISTIC_ICONS[config.iconKey]}
                          style={{
                            width: 20,
                            height: 20,
                          }}
                          contentFit="contain"
                        />
                      </View>
                    }
                    name={config.getValue(formData, characteristicHelpers)}
                    label={config.label}
                    nameClassName="text-foreground"
                  />
                </View>
              ))}
            </View>
            {formData.rentDetails?.securityDeposit ? (
              <View className="mt-4 h-[56px] flex-row items-center justify-center gap-[12px] rounded-[12px] bg-muted">
                <ThemedText className="text-[16px] font-semibold text-neutral-950">
                  Security deposit
                </ThemedText>
                <View className="flex-row items-center gap-2">
                  <Image
                    source={require('@/assets/images/announcement-icons/hand-icon.svg')}
                    style={{
                      width: 32,
                      height: 32,
                    }}
                    contentFit="contain"
                  />
                  <ThemedText className="text-[20px] font-semibold text-main-500">
                    {formData.rentDetails?.securityDeposit} $
                  </ThemedText>
                </View>
              </View>
            ) : (
              <></>
            )}
          </AnnouncementCard>

          {/* Pets allowed */}
          {allowedPets.length > 0 ? (
            <AnnouncementCard title="Pets allowed" className="gap-[12px]">
              <View className="flex-row gap-2">
                {allowedPets.map((config) => (
                  <View
                    key={config.key}
                    className="flex-1 items-center justify-center gap-2 rounded-[8px] bg-muted px-3 py-4">
                    <Image
                      source={config.icon}
                      style={{
                        width: 24,
                        height: 24,
                      }}
                      contentFit="contain"
                    />
                    <ThemedText className="text-center text-[14px] text-foreground">
                      {config.label}
                    </ThemedText>
                  </View>
                ))}
              </View>
            </AnnouncementCard>
          ) : (
            <></>
          )}
        </View>
      </ScrollView>

      <AnnouncementFooter
        firstButtonLabel="Publish"
        secondButtonLabel="Save & exit"
        onNextPress={handlePublish}
        onSaveAndExitPress={handleSaveAndExit}
      />
    </ThemedView>
  );
}
