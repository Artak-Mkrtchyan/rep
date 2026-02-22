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
import type { RentForApartmentsForm } from '@/types/announcement';

const SCREEN_TITLE = 'Now tell us more about your property';
const SCREEN_SUBTITLE = 'Sharing more will help renters see themselves in your home.';

/** Flat form state for UI; saved into store as formData.property.attributes (nested). */
type CharacteristicsFormValues = {
  numberOfFloors: string;
  floorNo: string;
  buildingType: string;
  condition: string;
  yearBuilt: string;
  ownershipType: string;
  hvac: boolean;
  balcony: boolean;
  elevator: boolean;
  offStreetParking: boolean;
  attachedGarage: boolean;
  detachedGarage: boolean;
  washerAndLaundry: boolean;
  disabledAccess: boolean;
  evChargingStation: boolean;
  bicycleStorage: boolean;
  catsAllowed: boolean;
  smallDogsAllowed: boolean;
  largeDogsAllowed: boolean;
};

const conditionToStore = (
  v: string
): 'EXCELLENT' | 'RENOVATED' | 'NEEDS_RENOVATION' | 'UNDER_CONSTRUCTION' | undefined => {
  const map: Record<string, 'EXCELLENT' | 'RENOVATED' | 'NEEDS_RENOVATION' | 'UNDER_CONSTRUCTION'> =
    {
      excellent: 'EXCELLENT',
      renovated: 'RENOVATED',
      needs_renovation: 'NEEDS_RENOVATION',
      under_construction: 'UNDER_CONSTRUCTION',
    };
  return v ? map[v] : undefined;
};

const ownershipToStore = (v: string): 'FULL' | 'SHARED' | 'JOINT' | undefined => {
  const map: Record<string, 'FULL' | 'SHARED' | 'JOINT'> = {
    full: 'FULL',
    shared: 'SHARED',
    joint: 'JOINT',
  };
  return v ? map[v] : undefined;
};

const flattenFromStore = (formData: RentForApartmentsForm): CharacteristicsFormValues => {
  const building = formData.property?.attributes?.building;
  const amenities = formData.property?.attributes?.amenities;
  const ownershipAndCondition = formData.property?.attributes?.ownershipAndCondition;
  const pets = formData.property?.attributes?.pets;
  const condition = ownershipAndCondition?.condition?.toLowerCase() as string | undefined;
  const ownershipType = ownershipAndCondition?.ownershipType?.toLowerCase() as string | undefined;
  return {
    numberOfFloors: building?.numberOfFloors != null ? String(building.numberOfFloors) : '',
    floorNo: building?.floorNo ?? '',
    buildingType: building?.buildingType ?? '',
    condition: condition ?? '',
    yearBuilt: building?.yearBuilt != null ? String(building.yearBuilt) : '',
    ownershipType: ownershipType ?? '',
    hvac: amenities?.hvac ?? false,
    balcony: amenities?.balcony ?? false,
    elevator: amenities?.elevator ?? false,
    offStreetParking: amenities?.offStreetParking ?? false,
    attachedGarage: amenities?.attachedGarage ?? false,
    detachedGarage: amenities?.detachedGarage ?? false,
    washerAndLaundry: amenities?.washerLaundry ?? false,
    disabledAccess: amenities?.disabledAccess ?? false,
    evChargingStation: amenities?.evChargingStation ?? false,
    bicycleStorage: amenities?.bicycleStorage ?? false,
    catsAllowed: pets?.cat ?? false,
    smallDogsAllowed: pets?.smallDogs ?? false,
    largeDogsAllowed: pets?.largeDogs ?? false,
  };
};

export default function CharacteristicsScreen() {
  const formData = useAnnouncementForRentFormStore((s) => s.formData);
  const updateFormData = useAnnouncementForRentFormStore((s) => s.updateFormData);
  const nextStep = useAnnouncementForRentFormStore((state) => state.nextStep);
  let isNext = true;

  const initialValues: CharacteristicsFormValues = flattenFromStore(formData);

  const saveCharacteristics = (values: CharacteristicsFormValues) => {
    const numFloors = values.numberOfFloors ? Number(values.numberOfFloors) : undefined;
    const year = values.yearBuilt ? Number(values.yearBuilt) : undefined;
    updateFormData({
      property: {
        ...formData.property,
        areaM2: formData.property?.areaM2 ?? 0,
        propertyType: formData.property?.propertyType ?? formData.propertyType,
        description: formData.property?.description,
        attributes: {
          ...formData.property?.attributes,
          type: formData.property?.attributes?.type ?? formData.propertyType,
          building: {
            ...formData.property?.attributes?.building,
            numberOfFloors: numFloors,
            floorNo: values.floorNo || undefined,
            buildingType: values.buildingType || undefined,
            yearBuilt: year,
          },
          amenities: {
            ...formData.property?.attributes?.amenities,
            hvac: values.hvac,
            balcony: values.balcony,
            elevator: values.elevator,
            offStreetParking: values.offStreetParking,
            attachedGarage: values.attachedGarage,
            detachedGarage: values.detachedGarage,
            washerLaundry: values.washerAndLaundry,
            disabledAccess: values.disabledAccess,
            evChargingStation: values.evChargingStation,
            bicycleStorage: values.bicycleStorage,
          },
          ownershipAndCondition: {
            ...formData.property?.attributes?.ownershipAndCondition,
            condition: conditionToStore(values.condition),
            ownershipType: ownershipToStore(values.ownershipType),
          },
          pets: {
            ...formData.property?.attributes?.pets,
            cat: values.catsAllowed,
            smallDogs: values.smallDogsAllowed,
            largeDogs: values.largeDogsAllowed,
          },
        },
      },
    });

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
                    value={`${values.numberOfFloors}`}
                    onChange={(v) => setFieldValue('numberOfFloors', Number(v))}
                    options={FLOORS_OPTIONS}
                    containerClassName="mb-1"
                  />

                  <Select
                    label="Floor no:"
                    placeholder=""
                    value={`${values.floorNo}`}
                    onChange={(v) => setFieldValue('floorNo', Number(v))}
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
                    value={`${values.yearBuilt}`}
                    onChange={(v) => setFieldValue('yearBuilt', Number(v))}
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
