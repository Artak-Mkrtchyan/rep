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
  BUILDING_TYPE_OPTIONS,
  CONDITION_OPTIONS,
  FLOORS_OPTIONS,
  OWNERSHIP_TYPE_OPTIONS,
  YEAR_BUILT_OPTIONS,
} from '@/constants/announcement';
import { useAnnouncementForRentFormStore } from '@/store/announcementStore';
import { Attributes, Property } from '@/types/announcement';

const SCREEN_TITLE = 'Now tell us more about your property';
const SCREEN_SUBTITLE = 'Sharing more will help renters see themselves in your home.';

type CharacteristicsFormValues = Attributes;

export default function CharacteristicsScreen() {
  const formData = useAnnouncementForRentFormStore((s) => s.formData);
  const updateFormData = useAnnouncementForRentFormStore((s) => s.updateFormData);
  const nextStep = useAnnouncementForRentFormStore((s) => s.nextStep);
  let isNext = true;

  const initialValues: CharacteristicsFormValues = formData.property?.attributes || {
    type: formData.propertyType as Property,
  };

  const saveCharacteristics = (values: CharacteristicsFormValues) => {
    if (formData.property) {
      updateFormData({
        property: {
          ...formData.property,
          attributes: values,
        },
      });
    }

    if (isNext) {
      nextStep();
    } else {
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
                  {SCREEN_TITLE}
                </ThemedText>
                <ThemedText className="mb-6 text-[14px] text-muted-foreground">
                  {SCREEN_SUBTITLE}
                </ThemedText>

                <View className="gap-6">
                  <Select
                    label="Number of floors"
                    placeholder=""
                    value={`${values.building?.numberOfFloors || ''}`}
                    onChange={(v) => setFieldValue('building.numberOfFloors', Number(v))}
                    options={FLOORS_OPTIONS}
                    containerClassName="mb-1"
                  />

                  <Select
                    label="Floor no:"
                    placeholder=""
                    value={`${values.building?.floorNo || ''}`}
                    onChange={(v) => setFieldValue('building.floorNo', Number(v))}
                    options={FLOORS_OPTIONS}
                    containerClassName="mb-1"
                  />

                  <View className="rounded-[12px] bg-muted p-4">
                    <ChipGroup
                      label="Parking"
                      options={BUILDING_TYPE_OPTIONS}
                      value={values.building?.buildingType || ''}
                      onChange={(v) => setFieldValue('building.buildingType', v)}
                    />
                  </View>

                  <View className="gap-1">
                    <CheckboxRow
                      label="HVAC"
                      checked={values.amenities?.hvac ?? false}
                      onToggle={() => setFieldValue('amenities.hvac', !values.amenities?.hvac)}
                    />
                    <CheckboxRow
                      label="Balcony"
                      checked={values.amenities?.balcony ?? false}
                      onToggle={() =>
                        setFieldValue('amenities.balcony', !values.amenities?.balcony)
                      }
                    />
                    <CheckboxRow
                      label="Off-street parking"
                      checked={values.amenities?.offStreetParking ?? false}
                      onToggle={() =>
                        setFieldValue(
                          'amenities.offStreetParking',
                          !values.amenities?.offStreetParking
                        )
                      }
                    />
                    <CheckboxRow
                      label="Attached garage"
                      checked={values.amenities?.attachedGarage ?? false}
                      onToggle={() =>
                        setFieldValue('amenities.attachedGarage', !values.amenities?.attachedGarage)
                      }
                    />
                  </View>

                  <View className="gap-1">
                    <CheckboxRow
                      label="Detached garage"
                      checked={values.amenities?.detachedGarage ?? false}
                      onToggle={() =>
                        setFieldValue('amenities.detachedGarage', !values.amenities?.detachedGarage)
                      }
                    />
                    <CheckboxRow
                      label="Washer and laundry"
                      checked={values.amenities?.washerLaundry ?? false}
                      onToggle={() =>
                        setFieldValue('amenities.washerLaundry', !values.amenities?.washerLaundry)
                      }
                    />
                    <CheckboxRow
                      label="Elevator"
                      checked={values.amenities?.elevator ?? false}
                      onToggle={() =>
                        setFieldValue('amenities.elevator', !values.amenities?.elevator)
                      }
                    />
                    <CheckboxRow
                      label="Disabled access"
                      checked={values.amenities?.disabledAccess ?? false}
                      onToggle={() =>
                        setFieldValue('amenities.disabledAccess', !values.amenities?.disabledAccess)
                      }
                    />
                  </View>

                  <View className="gap-1">
                    <CheckboxRow
                      label="EV charging station"
                      checked={values.amenities?.evChargingStation ?? false}
                      onToggle={() =>
                        setFieldValue(
                          'amenities.evChargingStation',
                          !values.amenities?.evChargingStation
                        )
                      }
                    />
                    <CheckboxRow
                      label="Bicycle storage"
                      checked={values.amenities?.bicycleStorage ?? false}
                      onToggle={() =>
                        setFieldValue('amenities.bicycleStorage', !values.amenities?.bicycleStorage)
                      }
                    />
                  </View>

                  <View className="rounded-[12px] bg-muted p-4">
                    <ChipGroup
                      label="Condition"
                      options={CONDITION_OPTIONS}
                      value={values.ownershipAndCondition?.condition || ''}
                      onChange={(v) => setFieldValue('ownershipAndCondition.condition', v)}
                    />
                  </View>

                  <Select
                    label="Year build"
                    placeholder=""
                    value={`${values.building?.yearBuilt || ''}`}
                    onChange={(v) => setFieldValue('building.yearBuilt', Number(v))}
                    options={YEAR_BUILT_OPTIONS}
                    containerClassName="mb-1"
                  />

                  <View className="rounded-[12px] bg-muted p-4">
                    <ChipGroup
                      label="Ownership type"
                      options={OWNERSHIP_TYPE_OPTIONS}
                      value={values.ownershipAndCondition?.ownershipType || ''}
                      onChange={(v) => setFieldValue('ownershipAndCondition.ownershipType', v)}
                    />
                  </View>

                  <View className="gap-1">
                    <ThemedText className="mb-2 text-[16px] font-semibold text-foreground">
                      Condition
                    </ThemedText>
                    <CheckboxRow
                      label="Cat"
                      checked={values.pets?.cat ?? false}
                      onToggle={() => setFieldValue('pets.cat', !values.pets?.cat)}
                    />
                    <CheckboxRow
                      label="Small dogs (under 40 kg)"
                      checked={values.pets?.smallDogs ?? false}
                      onToggle={() => setFieldValue('pets.smallDogs', !values.pets?.smallDogs)}
                    />
                    <CheckboxRow
                      label="Large dogs (over 40 kg)"
                      checked={values.pets?.largeDogs ?? false}
                      onToggle={() => setFieldValue('pets.largeDogs', !values.pets?.largeDogs)}
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
