import { router } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
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
  getObjectCharacteristics,
  getPetItemsConfig,
} from '@/constants/announcement';
import { useScreenEdgePadding } from '@/hooks/use-screen-edge-padding';
import { Language } from '@/lib/i18n/i18n';
import { formatNumericString } from '@/lib/utils';
import { useAnnouncementForRentFormStore } from '@/store/announcementStore';
import { Image } from 'expo-image';

export default function FinalScreen() {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language as Language;

  const { horizontalStyle } = useScreenEdgePadding();
  const formData = useAnnouncementForRentFormStore((s) => s.formData);
  const metaData = useAnnouncementForRentFormStore((s) => s.metaData);
  const publishFormData = useAnnouncementForRentFormStore((s) => s.publishFormData);
  const resetForm = useAnnouncementForRentFormStore((s) => s.resetForm);
  const sendFormData = useAnnouncementForRentFormStore((s) => s.sendFormData);

  const handlePublish = async () => {
    try {
      await sendFormData();
      await publishFormData();
      resetForm();
      router.back();
    } catch {
      Alert.alert(t('common.error'), t('error.failed_to_publish'));
    }
  };

  const handleSaveAndExit = async () => {
    try {
      await sendFormData();
      router.back();
    } catch {
      Alert.alert(t('common.error'), t('error.failed_to_send_form'));
    }
  };

  const handleViewOnMap = () => {
    // Placeholder: open map with address
  };

  const allowedPets = getPetItemsConfig(t).filter((c) => c.getAllowed(formData));

  const conditionRaw = formData.property?.attributes?.ownershipAndCondition?.condition;
  const conditionLabel =
    conditionRaw === 'EXCELLENT'
      ? t('condition_options.excellent')
      : conditionRaw === 'RENOVATED'
        ? t('condition_options.renovated')
        : conditionRaw === 'NEEDS_RENOVATION'
          ? t('condition_options.needs_renovation')
          : conditionRaw === 'UNDER_CONSTRUCTION'
            ? t('condition_options.under_construction')
            : '—';

  const buildingTypeRaw = formData.property?.attributes?.building?.buildingType;
  const buildingTypeLabel = buildingTypeRaw
    ? buildingTypeRaw.charAt(0).toUpperCase() + buildingTypeRaw.slice(1)
    : '—';

  const ownershipRaw = formData.property?.attributes?.ownershipAndCondition?.ownershipType;
  const ownershipLabel =
    ownershipRaw === 'full' || ownershipRaw === 'FULL'
      ? t('ownership_type_options.full')
      : ownershipRaw === 'shared' || ownershipRaw === 'SHARED'
        ? t('ownership_type_options.shared')
        : ownershipRaw === 'joint' || ownershipRaw === 'JOINT'
          ? t('ownership_type_options.joint')
          : '—';

  const formatYesNo = (v: boolean | undefined) => (v ? t('common.yes') : t('common.no'));

  const typeLabel =
    formData.listingType === 'FOR_RENT'
      ? t('announcement.rent.final.apartment_for_rent')
      : t('announcement.rent.final.apartment_for_sale');

  const imageSources: { uri: string }[] =
    metaData?.tempMediaFiles?.map((file) => ({ uri: file.uri })) || [];

  const price = formData.rentDetails?.monthlyRent
    ? `${formData.rentDetails.monthlyRent} / month`
    : formData.saleDetails?.price
      ? `${formData.saleDetails.price} $`
      : '';

  const securityDeposit = formData.rentDetails?.securityDeposit?.toString();

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
        <View className="pt-[24px]" style={horizontalStyle}>
          <View className="mb-4">
            <ImageSlider
              images={imageSources}
              accessibilityLabel={t('announcement.rent.final.property_images')}
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
            id={metaData?.response?.publicId}
            typeLabel={typeLabel}
            listingType={formData.listingType as 'FOR_RENT' | 'FOR_SALE'}
            price={formatNumericString(price)}
            location={{
              country: formData.geo.country[currentLanguage],
              city: formData.geo.locality[currentLanguage],
              district: formData.geo.province[currentLanguage],
              address: `${formData.geo.street[currentLanguage]} ${formData.geo.house?.[currentLanguage] || ''}`,
            }}
            distances={formData.infrastructureObjects}
            placedBy={{
              name: metaData?.response?.applicantEmail || '',
            }}
            postedDate={''}
            updatedDate=""
            onViewMap={handleViewOnMap}
          />

          {/* Description */}
          <View className="my-4">
            <ThemedText className="mb-3 text-[20px] font-semibold text-neutral-950">
              {t('announcement.rent.final.description')}
            </ThemedText>
            <ThemedText className="text-neutaral-800 text-[14px] leading-5">
              {formData.description || '-'}
            </ThemedText>
          </View>

          {/* Object characteristics + Security deposit */}
          <AnnouncementCard
            title={t('announcement.rent.final.object_characteristics')}
            className="mb-4 gap-[24px]">
            <View className="flex-row flex-wrap gap-y-4">
              {getObjectCharacteristics(t).map((config) => (
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
            {securityDeposit ? (
              <View className="mt-4 h-[56px] flex-row items-center justify-center gap-[12px] rounded-[12px] bg-muted">
                <ThemedText className="text-[16px] font-semibold text-neutral-950">
                  {t('announcement.rent.final.security_deposit')}
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
                    {formatNumericString(securityDeposit)} $
                  </ThemedText>
                </View>
              </View>
            ) : (
              <></>
            )}
          </AnnouncementCard>

          {/* Pets allowed */}
          {allowedPets.length > 0 ? (
            <AnnouncementCard
              title={t('announcement.rent.final.pets_allowed')}
              className="gap-[12px]">
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
        firstButtonLabel={t('common.publish')}
        secondButtonLabel={t('common.save_and_exit')}
        onNextPress={handlePublish}
        onSaveAndExitPress={handleSaveAndExit}
      />
    </ThemedView>
  );
}
