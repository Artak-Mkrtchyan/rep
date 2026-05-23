import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, View } from 'react-native';

import { AnnouncementCard } from '@/components/announcement/announcement-card';
import { AnnouncementFooter } from '@/components/announcement/announcement-footer';
import { PlacedByItem } from '@/components/announcement/placed-by-item';
import { PropertyAnnouncementDetail } from '@/components/announcement/property-announcement-detail';
import { ReIcon } from '@/components/announcement/re-icon';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ImageSlider } from '@/components/ui/image-slider';
import { getPetItemsConfig } from '@/constants/announcement';
import { useAuth } from '@/context/AuthContext';
import { useBrokerCompanyProfile } from '@/hooks/api/use-profile';
import { useExitAnnouncementFlow } from '@/hooks/use-announcement';
import { useScreenEdgePadding } from '@/hooks/use-screen-edge-padding';
import { getObjectCharacteristics } from '@/lib/announcement';
import { AuthScope } from '@/lib/api/auth';
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
  const updateAnnouncement = useAnnouncementForRentFormStore((s) => s.updateAnnouncement);
  const createAnnouncementModificationApplication = useAnnouncementForRentFormStore(
    (s) => s.createAnnouncementModificationApplication
  );
  const publishAnnouncementModificationApplication = useAnnouncementForRentFormStore(
    (s) => s.publishAnnouncementModificationApplication
  );
  const exitFlow = useExitAnnouncementFlow();

  const statusCode = metaData?.response?.status?.code;
  const isAnnouncementEdit = metaData?.isAnnouncementEdit;
  const isChangeFields = metaData?.isChangeFields;

  const { userInfo } = useAuth();
  
  const createdById = typeof metaData?.response?.createdBy === 'object'
    ? (metaData.response.createdBy as any)?.id
    : metaData?.response?.createdBy;

  const isAnnouncementOwner =
    !createdById ||
    createdById === userInfo?.id;

  const isAssignedBroker =
    !!metaData?.brokerId &&
    metaData.brokerId === userInfo?.id;

  const isManager = userInfo?.roles?.includes('broker-company-manager');

  const isUserAllowedToEdit = isAnnouncementOwner || isAssignedBroker || isManager;

  const isReadOnly =
    (!!statusCode && statusCode !== 'DRAFT' && statusCode !== 'RETURNED_TO_APPLICANT') ||
    !isUserAllowedToEdit;

  const isBrokerCompany = userInfo?.scope === AuthScope.BROKER_COMPANY;
  const { data: brokerCompanyProfile } = useBrokerCompanyProfile(
    isBrokerCompany ? userInfo?.id : undefined
  );
  const name = isBrokerCompany
    ? brokerCompanyProfile?.name || userInfo?.fullName || ''
    : userInfo?.fullName || '';

  const handlePublish = async () => {
    try {
      if (isAnnouncementEdit) {
        if (isChangeFields) {
          const id = await createAnnouncementModificationApplication();

          await updateAnnouncement();
          await publishAnnouncementModificationApplication(id || '');
        } else {
          await updateAnnouncement();
        }
      } else {
        await sendFormData();
        await publishFormData();
      }

      resetForm();
      exitFlow();
    } catch (error) {
      console.error('Error publishing announcement:', error);
      Alert.alert(t('common.error'), t('error.failed_to_publish'));
    }
  };

  const handleSaveAndExit = async () => {
    try {
      await sendFormData();
      exitFlow();
    } catch (error) {
      console.error('Error saving and exiting announcement:', error);
      Alert.alert(t('common.error'), t('error.failed_to_send_form'));
    }
  };

  const mapAddress = `${formData.geo?.street?.[currentLanguage] || ''} ${
    formData.geo?.house?.[currentLanguage] || ''
  }`.trim();
  const mapLabel = mapAddress || formData.title || '';

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
    ? t(`building_options.${buildingTypeRaw.toLowerCase()}`)
    : '—';

  const ownershipRaw = formData.property?.attributes?.ownershipAndCondition?.ownershipType;
  const ownershipKey = ownershipRaw?.toLowerCase();
  const ownershipLabel =
    ownershipKey === 'full' || ownershipKey === 'shared' || ownershipKey === 'joint'
      ? t(`ownership_type_options.${ownershipKey}`)
      : '—';

  const formatYesNo = (v: boolean | undefined) => {
    if (v === undefined) {
      return '—';
    }

    return v ? t('common.yes') : t('common.no');
  };

  const typeLabel =
    formData.listingType === 'FOR_RENT'
      ? t('announcement.rent.final.for_rent')
      : t('announcement.rent.final.for_sale');

  const imageSources: { uri: string }[] =
    metaData?.tempMediaFiles?.map((file) => ({ uri: file.uri })) || [];

  const price = formData.rentDetails?.monthlyRent
    ? `${formData.rentDetails.monthlyRent} $ / month`
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

  const visibleCharacteristics = getObjectCharacteristics(t)
    .map((config) => ({
      config,
      value: config.getValue(formData, characteristicHelpers),
    }))
    .filter(({ value }) => value !== '—');

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
              name,
            }}
            mapLat={formData.geo?.latitude}
            mapLng={formData.geo?.longitude}
            mapLabel={mapLabel}
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
              {visibleCharacteristics.map(({ config, value }) => (
                <View key={`${config.iconKey}-${config.label}`} className="w-1/2 pr-2">
                  <PlacedByItem
                    icon={
                      <View className="h-[32px] w-[32px] items-center justify-center rounded-full bg-muted">
                        <ReIcon name={config.iconKey} size={20} color="#737373" />
                      </View>
                    }
                    name={value}
                    label={config.label}
                    nameClassName="text-foreground"
                    truncate
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

      {!isReadOnly || isAnnouncementEdit ? (
        <AnnouncementFooter
          firstButtonLabel={t('common.publish')}
          secondButtonLabel={t('common.save_and_exit')}
          onNextPress={handlePublish}
          onSaveAndExitPress={handleSaveAndExit}
          hideSecondButton={isAnnouncementEdit}
        />
      ) : null}
    </ThemedView>
  );
}
