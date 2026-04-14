import { router } from 'expo-router';
import { Formik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnnouncementFooter } from '@/components/announcement/announcement-footer';
import { Conditional } from '@/components/conditional';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import {
  BATHROOMS_OPTIONS,
  BEDROOMS_OPTIONS,
  getBuildingTypeOptionsCommercial,
  getGarageTypeOptions,
  getLandTypeOptions,
  getPermittedUseOptions,
  getSpaceSizeGarageOptions,
  getSpaceSizeParkingOptions,
} from '@/constants/announcement';
import { useHandleNextPress } from '@/hooks/use-announcement';
import { useScreenEdgePadding } from '@/hooks/use-screen-edge-padding';
import { getPropertyTypeInfo, getSchemaForPropertyType } from '@/lib/announcement';
import { useAnnouncementForRentFormStore } from '@/store/announcementStore';
import type { RentForApartmentsFormStep3 } from '@/types/announcement';

const SQUARE_FOOTAGE_PLACEHOLDER = '1200';
const FOOTER_APPROX_HEIGHT = 152;

type PropertyInfoFormValues = RentForApartmentsFormStep3;

export default function PropertyInfoFirstScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { horizontalStyle } = useScreenEdgePadding();
  const formData = useAnnouncementForRentFormStore((s) => s.formData);
  const sendFormData = useAnnouncementForRentFormStore((state) => state.sendFormData);
  const updateFormData = useAnnouncementForRentFormStore((state) => state.updateFormData);
  const nextStep = useHandleNextPress();

  const { isGarage, isApartment, isHouse, isCommercialSpace, isLand, isParkingSpace } =
    getPropertyTypeInfo(formData.propertyType);

  const footerPaddingBottom = insets.bottom > 0 ? insets.bottom : 24;
  const scrollPaddingBottom = FOOTER_APPROX_HEIGHT + footerPaddingBottom + 24;

  let isNext = true;

  const initialValues: PropertyInfoFormValues = { property: formData.property };

  const savePropertyInfo = async ({ property }: PropertyInfoFormValues) => {
    if (property && formData.propertyType) {
      const areaM2 = Number(property.areaM2) || 0;
      const usableAreaM2 = Number(property.attributes?.usableAreaM2) || undefined;
      const landAreaM2 = Number(property.attributes?.landAreaM2) || undefined;
      const houseAreaM2 = Number(property.attributes?.houseAreaM2) || undefined;

      updateFormData({
        property: {
          areaM2,
          attributes: {
            ...formData.property?.attributes,
            ...property.attributes,
            usableAreaM2,
            landAreaM2,
            houseAreaM2,
            type: formData.propertyType,
          },
          propertyType: formData.propertyType,
        },
      });
    }

    if (isNext) {
      nextStep();
    } else {
      try {
        await sendFormData();
      } catch {
        Alert.alert(t('common.error'), t('error.failed_to_send_form'));
      } finally {
        router.back();
      }
    }
  };

  const handleNext = (handleSubmit: () => void) => {
    isNext = true;
    handleSubmit();
  };

  const handleSaveAndExit = (handleSubmit: () => void) => {
    isNext = false;
    handleSubmit();
  };

  return (
    <ThemedView className="flex-1">
      <Formik<PropertyInfoFormValues>
        initialValues={initialValues}
        validationSchema={getSchemaForPropertyType(formData.propertyType)}
        validateOnMount={true}
        enableReinitialize
        onSubmit={savePropertyInfo}>
        {({ handleSubmit, setFieldValue, values, errors, touched, isValid }) => (
          <>
            <ScrollView
              className="flex-1"
              contentContainerStyle={{ paddingBottom: scrollPaddingBottom }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled">
              <View className="pt-[24px]" style={horizontalStyle}>
                <ThemedText className="mb-2 text-[16px] font-bold text-foreground">
                  {t('announcement.rent.property_info_first_title')}
                </ThemedText>
                <ThemedText className="font-regular mb-4 text-[12px] text-muted-foreground">
                  {t('announcement.rent.property_info_first_subtitle')}
                </ThemedText>

                <View className="gap-4">
                  <Input
                    label={t('announcement.rent.square_footage')}
                    numericOnly
                    allowDecimal
                    placeholder={SQUARE_FOOTAGE_PLACEHOLDER}
                    value={`${values.property?.areaM2 || ''}`}
                    onChangeText={(v) => setFieldValue('property.areaM2', v)}
                    right={
                      <ThemedText className="text-[16px] text-muted-foreground">
                        {t('announcement.rent.square_meters_unit')}
                      </ThemedText>
                    }
                    keyboardType="decimal-pad"
                    accessibilityLabel="Square footage"
                    accessibilityHint="Enter property area in square meters"
                    error={touched.property && errors.property ? 'Required' : undefined}
                  />

                  <Conditional condition={isCommercialSpace}>
                    <Input
                      label={t('announcement.rent.usable_area')}
                      numericOnly
                      placeholder={SQUARE_FOOTAGE_PLACEHOLDER}
                      value={`${values.property?.attributes?.usableAreaM2 || ''}`}
                      onChangeText={(v) => setFieldValue('property.attributes.usableAreaM2', v)}
                      right={
                        <ThemedText className="text-[16px] text-muted-foreground">
                          {t('announcement.rent.square_meters_unit')}
                        </ThemedText>
                      }
                      keyboardType="number-pad"
                      accessibilityLabel="Usable area"
                      accessibilityHint="Enter usable area in square meters"
                      error={touched.property && errors.property ? 'Required' : undefined}
                    />
                  </Conditional>

                  <Conditional condition={isApartment || isHouse}>
                    <Select
                      label={t('announcement.rent.total_bedrooms')}
                      placeholder={t('common.select')}
                      value={`${values.property?.attributes?.bedroomCount}`}
                      onChange={(v) => setFieldValue('property.attributes.bedroomCount', Number(v))}
                      options={BEDROOMS_OPTIONS}
                    />
                  </Conditional>

                  <Conditional condition={isApartment || isHouse}>
                    <Select
                      label={t('announcement.rent.total_bathrooms')}
                      placeholder={t('common.select')}
                      value={`${values.property?.attributes?.bathroomCount}`}
                      onChange={(v) =>
                        setFieldValue('property.attributes.bathroomCount', Number(v))
                      }
                      options={BATHROOMS_OPTIONS}
                    />
                  </Conditional>

                  <Conditional condition={isCommercialSpace}>
                    <Select
                      label={t('announcement.rent.building_type')}
                      placeholder={t('common.select')}
                      value={`${values.property?.attributes?.buildingType}`}
                      onChange={(v) => setFieldValue('property.attributes.buildingType', v)}
                      options={getBuildingTypeOptionsCommercial(t)}
                    />
                  </Conditional>

                  <Conditional condition={isHouse || isLand}>
                    <Input
                      label={t('announcement.rent.land_area')}
                      numericOnly
                      placeholder={SQUARE_FOOTAGE_PLACEHOLDER}
                      value={`${values.property?.attributes?.landAreaM2 || ''}`}
                      onChangeText={(v) => setFieldValue('property.attributes.landAreaM2', v)}
                      right={
                        <ThemedText className="text-[16px] text-muted-foreground">
                          {t('announcement.rent.square_meters_unit')}
                        </ThemedText>
                      }
                      keyboardType="number-pad"
                      accessibilityLabel="Land area"
                      accessibilityHint="Enter land area in square meters"
                      error={touched.property && errors.property ? 'Required' : undefined}
                    />
                  </Conditional>

                  <Conditional condition={isHouse}>
                    <Input
                      label={t('announcement.rent.house_area')}
                      numericOnly
                      placeholder={SQUARE_FOOTAGE_PLACEHOLDER}
                      value={`${values.property?.attributes?.houseAreaM2 || ''}`}
                      onChangeText={(v) => setFieldValue('property.attributes.houseAreaM2', v)}
                      right={
                        <ThemedText className="text-[16px] text-muted-foreground">
                          {t('announcement.rent.square_meters_unit')}
                        </ThemedText>
                      }
                      keyboardType="number-pad"
                      accessibilityLabel="House area"
                      accessibilityHint="Enter house area in square meters"
                      error={touched.property && errors.property ? 'Required' : undefined}
                    />
                  </Conditional>

                  <Conditional condition={isGarage}>
                    <Select
                      label={t('announcement.rent.garage_type')}
                      placeholder={t('common.select')}
                      value={`${values.property?.attributes?.garageType}`}
                      onChange={(v) => setFieldValue('property.attributes.garageType', v)}
                      options={getGarageTypeOptions(t)}
                    />
                  </Conditional>

                  <Conditional condition={isGarage || isParkingSpace}>
                    <Select
                      label={t('announcement.rent.space_size')}
                      placeholder={t('common.select')}
                      value={`${values.property?.attributes?.spaceSize}`}
                      onChange={(v) => setFieldValue('property.attributes.spaceSize', v)}
                      options={
                        isGarage ? getSpaceSizeGarageOptions(t) : getSpaceSizeParkingOptions(t)
                      }
                    />
                  </Conditional>

                  <Conditional condition={isLand}>
                    <Select
                      label={t('announcement.rent.land_type')}
                      placeholder={t('common.select')}
                      value={`${values.property?.attributes?.landType}`}
                      onChange={(v) => setFieldValue('property.attributes.landType', v)}
                      options={getLandTypeOptions(t)}
                    />
                  </Conditional>

                  <Conditional condition={isLand}>
                    <Select
                      label={t('announcement.rent.permitted_use')}
                      placeholder={t('common.select')}
                      value={`${values.property?.attributes?.permittedUse}`}
                      onChange={(v) => setFieldValue('property.attributes.permittedUse', v)}
                      options={getPermittedUseOptions(t)}
                    />
                  </Conditional>
                </View>
              </View>
            </ScrollView>

            <AnnouncementFooter
              firstButtonLabel={t('common.next')}
              secondButtonLabel={t('common.save_and_exit')}
              firstButtonDisabled={!isValid}
              onNextPress={() => handleNext(handleSubmit)}
              onSaveAndExitPress={() => handleSaveAndExit(handleSubmit)}
            />
          </>
        )}
      </Formik>
    </ThemedView>
  );
}
