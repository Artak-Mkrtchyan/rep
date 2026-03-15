import { router } from 'expo-router';
import { Formik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, View } from 'react-native';

import { AnnouncementFooter } from '@/components/announcement/announcement-footer';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CheckboxRow } from '@/components/ui/checkbox';
import { ChipGroup } from '@/components/ui/chip-group';
import { Select } from '@/components/ui/select';
import {
  getBuildingTypeOptions,
  getConditionOptions,
  FLOORS_OPTIONS,
  getOwnershipTypeOptions,
  YEAR_BUILT_OPTIONS,
} from '@/constants/announcement';
import { useAnnouncementForRentFormStore } from '@/store/announcementStore';
import { Attributes, Property } from '@/types/announcement';

type CharacteristicsFormValues = Attributes;

export default function CharacteristicsScreen() {
  const { t } = useTranslation();
  const formData = useAnnouncementForRentFormStore((s) => s.formData);
  const updateFormData = useAnnouncementForRentFormStore((s) => s.updateFormData);
  const nextStep = useAnnouncementForRentFormStore((s) => s.nextStep);
  const sendFormData = useAnnouncementForRentFormStore((state) => state.sendFormData);
  let isNext = true;

  const initialValues: CharacteristicsFormValues = formData.property?.attributes || {
    type: formData.propertyType as Property,
  };

  const saveCharacteristics = async (values: CharacteristicsFormValues) => {
    if (formData.property) {
      updateFormData({
        property: {
          ...formData.property,
          attributes: values,
        },
      });
    }

    try {
      await sendFormData();

      if (isNext) {
        nextStep();
      } else {
        router.push('/(tabs)');
      }
    } catch {
      Alert.alert(t('common.error'), t('error.failed_to_send_form'));
      router.push('/(tabs)');
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
      <Formik<CharacteristicsFormValues>
        initialValues={initialValues}
        enableReinitialize
        onSubmit={saveCharacteristics}>
        {({ handleSubmit, setFieldValue, values }) => (
          <>
            <ScrollView
              className="flex-1"
              contentContainerStyle={{ paddingBottom: 31 }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled">
              <View className="px-4 pt-6">
                <ThemedText className="mb-2 text-[20px] font-bold text-foreground">
                  {t('announcement.rent.characteristics_title')}
                </ThemedText>
                <ThemedText className="mb-6 text-[14px] text-muted-foreground">
                  {t('announcement.rent.characteristics_subtitle')}
                </ThemedText>

                <View className="gap-6">
                  <Select
                    label={t('announcement.rent.number_of_floors')}
                    placeholder=""
                    value={`${values.building?.numberOfFloors || ''}`}
                    onChange={(v) => setFieldValue('building.numberOfFloors', Number(v))}
                    options={FLOORS_OPTIONS}
                    containerClassName="mb-1"
                  />

                  <Select
                    label={t('announcement.rent.floor_no')}
                    placeholder=""
                    value={`${values.building?.floorNo || ''}`}
                    onChange={(v) => setFieldValue('building.floorNo', Number(v))}
                    options={FLOORS_OPTIONS}
                    containerClassName="mb-1"
                  />

                  <View className="rounded-[12px] bg-muted p-4">
                    <ChipGroup
                      label={t('announcement.rent.parking')}
                      options={getBuildingTypeOptions(t)}
                      value={values.building?.buildingType || ''}
                      onChange={(v) => setFieldValue('building.buildingType', v)}
                    />
                  </View>

                  <View className="gap-1">
                    <CheckboxRow
                      label={t('announcement.rent.hvac')}
                      checked={values.amenities?.hvac ?? false}
                      onToggle={() => setFieldValue('amenities.hvac', !values.amenities?.hvac)}
                    />
                    <CheckboxRow
                      label={t('announcement.rent.balcony')}
                      checked={values.amenities?.balcony ?? false}
                      onToggle={() =>
                        setFieldValue('amenities.balcony', !values.amenities?.balcony)
                      }
                    />
                    <CheckboxRow
                      label={t('announcement.rent.off_street_parking')}
                      checked={values.amenities?.offStreetParking ?? false}
                      onToggle={() =>
                        setFieldValue(
                          'amenities.offStreetParking',
                          !values.amenities?.offStreetParking
                        )
                      }
                    />
                    <CheckboxRow
                      label={t('announcement.rent.attached_garage')}
                      checked={values.amenities?.attachedGarage ?? false}
                      onToggle={() =>
                        setFieldValue('amenities.attachedGarage', !values.amenities?.attachedGarage)
                      }
                    />
                  </View>

                  <View className="gap-1">
                    <CheckboxRow
                      label={t('announcement.rent.detached_garage')}
                      checked={values.amenities?.detachedGarage ?? false}
                      onToggle={() =>
                        setFieldValue('amenities.detachedGarage', !values.amenities?.detachedGarage)
                      }
                    />
                    <CheckboxRow
                      label={t('announcement.rent.washer_and_laundry')}
                      checked={values.amenities?.washerLaundry ?? false}
                      onToggle={() =>
                        setFieldValue('amenities.washerLaundry', !values.amenities?.washerLaundry)
                      }
                    />
                    <CheckboxRow
                      label={t('announcement.rent.elevator')}
                      checked={values.amenities?.elevator ?? false}
                      onToggle={() =>
                        setFieldValue('amenities.elevator', !values.amenities?.elevator)
                      }
                    />
                    <CheckboxRow
                      label={t('announcement.rent.disabled_access')}
                      checked={values.amenities?.disabledAccess ?? false}
                      onToggle={() =>
                        setFieldValue('amenities.disabledAccess', !values.amenities?.disabledAccess)
                      }
                    />
                  </View>

                  <View className="gap-1">
                    <CheckboxRow
                      label={t('announcement.rent.ev_charging_station')}
                      checked={values.amenities?.evChargingStation ?? false}
                      onToggle={() =>
                        setFieldValue(
                          'amenities.evChargingStation',
                          !values.amenities?.evChargingStation
                        )
                      }
                    />
                    <CheckboxRow
                      label={t('announcement.rent.bicycle_storage')}
                      checked={values.amenities?.bicycleStorage ?? false}
                      onToggle={() =>
                        setFieldValue('amenities.bicycleStorage', !values.amenities?.bicycleStorage)
                      }
                    />
                  </View>

                  <View className="rounded-[12px] bg-muted p-4">
                    <ChipGroup
                      label={t('announcement.rent.condition')}
                      options={getConditionOptions(t)}
                      value={values.ownershipAndCondition?.condition || ''}
                      onChange={(v) => setFieldValue('ownershipAndCondition.condition', v)}
                    />
                  </View>

                  <Select
                    label={t('announcement.rent.year_built')}
                    placeholder=""
                    value={`${values.building?.yearBuilt || ''}`}
                    onChange={(v) => setFieldValue('building.yearBuilt', Number(v))}
                    options={YEAR_BUILT_OPTIONS}
                    containerClassName="mb-1"
                  />

                  <View className="rounded-[12px] bg-muted p-4">
                    <ChipGroup
                      label={t('announcement.rent.ownership_type')}
                      options={getOwnershipTypeOptions(t)}
                      value={values.ownershipAndCondition?.ownershipType || ''}
                      onChange={(v) => setFieldValue('ownershipAndCondition.ownershipType', v)}
                    />
                  </View>

                  <View className="gap-1">
                    <ThemedText className="mb-2 text-[16px] font-semibold text-foreground">
                      {t('announcement.rent.condition')}
                    </ThemedText>
                    <CheckboxRow
                      label={t('announcement.rent.pet_cat')}
                      checked={values.pets?.cat ?? false}
                      onToggle={() => setFieldValue('pets.cat', !values.pets?.cat)}
                    />
                    <CheckboxRow
                      label={t('announcement.rent.pet_small_dogs')}
                      checked={values.pets?.smallDogs ?? false}
                      onToggle={() => setFieldValue('pets.smallDogs', !values.pets?.smallDogs)}
                    />
                    <CheckboxRow
                      label={t('announcement.rent.pet_large_dogs')}
                      checked={values.pets?.largeDogs ?? false}
                      onToggle={() => setFieldValue('pets.largeDogs', !values.pets?.largeDogs)}
                    />
                  </View>
                </View>
              </View>
            </ScrollView>

            <AnnouncementFooter
              firstButtonLabel={t('common.next')}
              secondButtonLabel={t('common.save_and_exit')}
              onNextPress={() => handleNext(handleSubmit)}
              onSaveAndExitPress={() => handleSaveAndExit(handleSubmit)}
            />
          </>
        )}
      </Formik>
    </ThemedView>
  );
}
