import { router } from 'expo-router';
import { Formik } from 'formik';
import React from 'react';
import { ScrollView, View } from 'react-native';

import { AnnouncementFooter } from '@/components/announcement/announcement-footer';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CheckboxRow } from '@/components/ui/checkbox';
import { ChipGroup } from '@/components/ui/chip-group';
import { Select } from '@/components/ui/select';
import {
  ANNOUNCEMENT_ROUTES,
  BUILDING_TYPE_OPTIONS,
  CONDITION_OPTIONS,
  FLOORS_OPTIONS,
  OWNERSHIP_TYPE_OPTIONS,
  YEAR_BUILT_OPTIONS,
} from '@/constants/announcement';
import { useAnnouncementForRentFormStore } from '@/store/announcementStore';
import type { RentForApartmentsFormStep6 } from '@/types/announcement';

const SCREEN_TITLE = 'Now tell us more about your property';
const SCREEN_SUBTITLE = 'Sharing more will help renters see themselves in your home.';

type CharacteristicsFormValues = RentForApartmentsFormStep6;

export default function CharacteristicsScreen() {
  const formData = useAnnouncementForRentFormStore((s) => s.formData);
  const { updateFormData } = useAnnouncementForRentFormStore();

  const initialValues: CharacteristicsFormValues = {
    numberOfFloors: formData.numberOfFloors,
    floorNo: formData.floorNo,
    buildingType: formData.buildingType,
    condition: formData.condition,
    yearBuilt: formData.yearBuilt,
    ownershipType: formData.ownershipType,
    hvac: formData.hvac,
    balcony: formData.balcony,
    elevator: formData.elevator,
    offStreetParking: formData.offStreetParking,
    attachedGarage: formData.attachedGarage,
    detachedGarage: formData.detachedGarage,
    washerAndLaundry: formData.washerAndLaundry,
    disabledAccess: formData.disabledAccess,
    evChargingStation: formData.evChargingStation,
    bicycleStorage: formData.bicycleStorage,
    catsAllowed: formData.catsAllowed,
    smallDogsAllowed: formData.smallDogsAllowed,
    largeDogsAllowed: formData.largeDogsAllowed,
  };

  const saveCharacteristics = (values: CharacteristicsFormValues) => {
    updateFormData({
      numberOfFloors: values.numberOfFloors,
      floorNo: values.floorNo,
      buildingType: values.buildingType,
      condition: values.condition,
      yearBuilt: values.yearBuilt,
      ownershipType: values.ownershipType,
      hvac: values.hvac,
      balcony: values.balcony,
      elevator: values.elevator,
      offStreetParking: values.offStreetParking,
      attachedGarage: values.attachedGarage,
      detachedGarage: values.detachedGarage,
      washerAndLaundry: values.washerAndLaundry,
      disabledAccess: values.disabledAccess,
      evChargingStation: values.evChargingStation,
      bicycleStorage: values.bicycleStorage,
      catsAllowed: values.catsAllowed,
      smallDogsAllowed: values.smallDogsAllowed,
      largeDogsAllowed: values.largeDogsAllowed,
    });
  };

  const handleNext = (handleSubmit: () => void) => {
    handleSubmit();
    router.push(ANNOUNCEMENT_ROUTES.RENT_FINAL.path);
  };

  const handleSaveAndExit = (handleSubmit: () => void) => {
    handleSubmit();
    router.push('/(tabs)');
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
                  {SCREEN_TITLE}
                </ThemedText>
                <ThemedText className="mb-6 text-[14px] text-muted-foreground">
                  {SCREEN_SUBTITLE}
                </ThemedText>

                <View className="gap-6">
                  <Select
                    label="Number of floors"
                    placeholder=""
                    value={values.numberOfFloors}
                    onChange={(v) => setFieldValue('numberOfFloors', v)}
                    options={FLOORS_OPTIONS}
                    containerClassName="mb-1"
                  />

                  <Select
                    label="Floor no:"
                    placeholder=""
                    value={values.floorNo}
                    onChange={(v) => setFieldValue('floorNo', v)}
                    options={FLOORS_OPTIONS}
                    containerClassName="mb-1"
                  />

                  <View className="rounded-[12px] bg-muted p-4">
                    <ChipGroup
                      label="Parking"
                      options={BUILDING_TYPE_OPTIONS}
                      value={values.buildingType}
                      onChange={(v) => setFieldValue('buildingType', v)}
                    />
                  </View>

                  <View className="gap-1">
                    <CheckboxRow
                      label="HVAC"
                      checked={values.hvac ?? false}
                      onToggle={() => setFieldValue('hvac', !values.hvac)}
                    />
                    <CheckboxRow
                      label="Balcony"
                      checked={values.balcony ?? false}
                      onToggle={() => setFieldValue('balcony', !values.balcony)}
                    />
                    <CheckboxRow
                      label="Off-street parking"
                      checked={values.offStreetParking ?? false}
                      onToggle={() => setFieldValue('offStreetParking', !values.offStreetParking)}
                    />
                    <CheckboxRow
                      label="Attached garage"
                      checked={values.attachedGarage ?? false}
                      onToggle={() => setFieldValue('attachedGarage', !values.attachedGarage)}
                    />
                  </View>

                  <View className="gap-1">
                    <CheckboxRow
                      label="Detached garage"
                      checked={values.detachedGarage ?? false}
                      onToggle={() => setFieldValue('detachedGarage', !values.detachedGarage)}
                    />
                    <CheckboxRow
                      label="Washer and laundry"
                      checked={values.washerAndLaundry ?? false}
                      onToggle={() => setFieldValue('washerAndLaundry', !values.washerAndLaundry)}
                    />
                    <CheckboxRow
                      label="Elevator"
                      checked={values.elevator ?? false}
                      onToggle={() => setFieldValue('elevator', !values.elevator)}
                    />
                    <CheckboxRow
                      label="Disabled access"
                      checked={values.disabledAccess ?? false}
                      onToggle={() => setFieldValue('disabledAccess', !values.disabledAccess)}
                    />
                  </View>

                  <View className="gap-1">
                    <CheckboxRow
                      label="EV charging station"
                      checked={values.evChargingStation ?? false}
                      onToggle={() => setFieldValue('evChargingStation', !values.evChargingStation)}
                    />
                    <CheckboxRow
                      label="Bicycle storage"
                      checked={values.bicycleStorage ?? false}
                      onToggle={() => setFieldValue('bicycleStorage', !values.bicycleStorage)}
                    />
                  </View>

                  <View className="rounded-[12px] bg-muted p-4">
                    <ChipGroup
                      label="Condition"
                      options={CONDITION_OPTIONS}
                      value={values.condition}
                      onChange={(v) => setFieldValue('condition', v)}
                    />
                  </View>

                  <Select
                    label="Year build"
                    placeholder=""
                    value={values.yearBuilt}
                    onChange={(v) => setFieldValue('yearBuilt', v)}
                    options={YEAR_BUILT_OPTIONS}
                    containerClassName="mb-1"
                  />

                  <View className="rounded-[12px] bg-muted p-4">
                    <ChipGroup
                      label="Ownership type"
                      options={OWNERSHIP_TYPE_OPTIONS}
                      value={values.ownershipType}
                      onChange={(v) => setFieldValue('ownershipType', v)}
                    />
                  </View>

                  <View className="gap-1">
                    <ThemedText className="mb-2 text-[16px] font-semibold text-foreground">
                      Condition
                    </ThemedText>
                    <CheckboxRow
                      label="Cat"
                      checked={values.catsAllowed ?? false}
                      onToggle={() => setFieldValue('catsAllowed', !values.catsAllowed)}
                    />
                    <CheckboxRow
                      label="Small dogs (under 40 kg)"
                      checked={values.smallDogsAllowed ?? false}
                      onToggle={() => setFieldValue('smallDogsAllowed', !values.smallDogsAllowed)}
                    />
                    <CheckboxRow
                      label="Large dogs (over 40 kg)"
                      checked={values.largeDogsAllowed ?? false}
                      onToggle={() => setFieldValue('largeDogsAllowed', !values.largeDogsAllowed)}
                    />
                  </View>
                </View>
              </View>
            </ScrollView>

            <AnnouncementFooter
              firstButtonLabel="Next"
              secondButtonLabel="Save & exit"
              onNextPress={() => handleNext(handleSubmit)}
              onSaveAndExitPress={() => handleSaveAndExit(handleSubmit)}
            />
          </>
        )}
      </Formik>
    </ThemedView>
  );
}
