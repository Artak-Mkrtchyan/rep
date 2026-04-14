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
  FLOORS_OPTIONS,
  getBuildingTypeOptions,
  getConditionOptions,
  getOwnershipTypeOptions,
  YEAR_BUILT_OPTIONS,
} from '@/constants/announcement';
import { useScreenEdgePadding } from '@/hooks/use-screen-edge-padding';
import { useAnnouncementForRentFormStore } from '@/store/announcementStore';
import { Attributes, Property } from '@/types/announcement';

import { Conditional } from '@/components/conditional';
import { Input } from '@/components/ui/input';
import { useHandleNextPress } from '@/hooks/use-announcement';
import { getCharacteristicsSchemaForPropertyType, getPropertyTypeInfo } from '@/lib/announcement';
type CharacteristicsFormValues = Attributes;

export default function CharacteristicsScreen() {
  const { t } = useTranslation();
  const { horizontalStyle } = useScreenEdgePadding();
  const formData = useAnnouncementForRentFormStore((s) => s.formData);
  const updateFormData = useAnnouncementForRentFormStore((s) => s.updateFormData);
  const nextStep = useHandleNextPress();
  const sendFormData = useAnnouncementForRentFormStore((state) => state.sendFormData);
  let isNext = true;

  const initialValues: CharacteristicsFormValues = formData.property?.attributes || {
    type: formData.propertyType as Property,
  };

  const { isGarage, isApartment, isHouse, isCommercialSpace, isLand, isParkingSpace } =
    getPropertyTypeInfo(formData.propertyType);

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
        router.back();
      }
    } catch {
      Alert.alert(t('common.error'), t('error.failed_to_send_form'));
      router.back();
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
        validateOnMount={true}
        enableReinitialize
        validationSchema={getCharacteristicsSchemaForPropertyType(formData.propertyType)}
        onSubmit={saveCharacteristics}>
        {({ handleSubmit, setFieldValue, values, isValid, errors, touched }) => (
          <>
            <ScrollView
              className="flex-1"
              contentContainerStyle={{ paddingBottom: 31 }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled">
              <View className="pt-[16px]" style={horizontalStyle}>
                <ThemedText className="mb-2 text-[16px] font-bold text-foreground">
                  {t('announcement.rent.characteristics_title')}
                </ThemedText>
                <ThemedText className="font-regular mb-4 text-[12px] text-muted-foreground">
                  {t('announcement.rent.characteristics_subtitle')}
                </ThemedText>

                <View className="gap-4">
                  <Conditional condition={isGarage || isParkingSpace}>
                    <Input
                      label={'Max vehicle height'}
                      numericOnly
                      value={`${values.vehicleRestrictions?.maxVehicleHeightCm || ''}`}
                      onChangeText={(v) =>
                        setFieldValue('vehicleRestrictions.maxVehicleHeightCm', v)
                      }
                      right={
                        <ThemedText className="text-[16px] text-muted-foreground">cm</ThemedText>
                      }
                      keyboardType="number-pad"
                      error={
                        touched.vehicleRestrictions && errors.vehicleRestrictions
                          ? t('validation.required')
                          : undefined
                      }
                    />
                  </Conditional>

                  <Conditional condition={isGarage || isParkingSpace}>
                    <Input
                      label={t('Max vehicle length')}
                      numericOnly
                      value={`${values.vehicleRestrictions?.maxVehicleLengthCm || ''}`}
                      onChangeText={(v) =>
                        setFieldValue('vehicleRestrictions.maxVehicleLengthCm', v)
                      }
                      right={
                        <ThemedText className="text-[16px] text-muted-foreground">cm</ThemedText>
                      }
                      keyboardType="decimal-pad"
                      error={
                        touched.vehicleRestrictions && errors.vehicleRestrictions
                          ? 'Required'
                          : undefined
                      }
                    />
                  </Conditional>

                  <Conditional condition={isGarage}>
                    <Input
                      label={t('Ceiling height (m)')}
                      numericOnly
                      allowDecimal
                      value={`${values.ceilingHeightM || ''}`}
                      onChangeText={(v) => setFieldValue('ceilingHeightM', v)}
                      right={
                        <ThemedText className="text-[16px] text-muted-foreground">m</ThemedText>
                      }
                      keyboardType="number-pad"
                      error={
                        touched.vehicleRestrictions && errors.vehicleRestrictions
                          ? 'Required'
                          : undefined
                      }
                    />
                  </Conditional>

                  <Conditional condition={isApartment || isHouse || isCommercialSpace}>
                    <Select
                      label={t('announcement.rent.number_of_floors')}
                      placeholder=""
                      value={`${values.building?.numberOfFloors || ''}`}
                      onChange={(v) => setFieldValue('building.numberOfFloors', Number(v))}
                      options={FLOORS_OPTIONS}
                      containerClassName="mb-1"
                    />
                  </Conditional>

                  <Conditional condition={isApartment || isCommercialSpace}>
                    <Select
                      label={t('announcement.rent.floor_no')}
                      placeholder=""
                      value={`${values.building?.floorNo || ''}`}
                      onChange={(v) => setFieldValue('building.floorNo', Number(v))}
                      options={FLOORS_OPTIONS}
                      containerClassName="mb-1"
                    />
                  </Conditional>

                  <Conditional condition={isApartment || isCommercialSpace || isHouse}>
                    <View className="mb-[8px] rounded-[12px] bg-muted p-4">
                      <ChipGroup
                        label={t('announcement.rent.buildingType')}
                        options={getBuildingTypeOptions(t)}
                        value={values.building?.buildingType || ''}
                        onChange={(v) => setFieldValue('building.buildingType', v)}
                      />
                    </View>
                  </Conditional>

                  <View className="mb-[16px] gap-4">
                    <Conditional condition={isApartment || isHouse}>
                      <CheckboxRow
                        label={t('announcement.rent.hvac')}
                        checked={values.amenities?.hvac ?? false}
                        onToggle={() => setFieldValue('amenities.hvac', !values.amenities?.hvac)}
                        containerClassName="py-[0px]"
                      />
                    </Conditional>

                    <Conditional condition={isLand}>
                      <CheckboxRow
                        label={'Electricity available'}
                        checked={values.infrastructure?.electricityAvailable ?? false}
                        onToggle={() =>
                          setFieldValue(
                            'infrastructure.electricityAvailable',
                            !values.infrastructure?.electricityAvailable
                          )
                        }
                        containerClassName="py-[0px]"
                      />
                    </Conditional>

                    <Conditional condition={isParkingSpace}>
                      <CheckboxRow
                        label={'Electricity available'}
                        checked={values.electricityAvailable ?? false}
                        onToggle={() =>
                          setFieldValue('electricityAvailable', !values.electricityAvailable)
                        }
                        containerClassName="py-[0px]"
                      />
                    </Conditional>

                    <Conditional condition={isLand}>
                      <CheckboxRow
                        label={'Water supply'}
                        checked={values.infrastructure?.waterSupply ?? false}
                        onToggle={() =>
                          setFieldValue(
                            'infrastructure.waterSupply',
                            !values.infrastructure?.waterSupply
                          )
                        }
                        containerClassName="py-[0px]"
                      />
                    </Conditional>

                    <Conditional condition={isLand}>
                      <CheckboxRow
                        label={'Gas'}
                        checked={values.infrastructure?.gas ?? false}
                        onToggle={() =>
                          setFieldValue('infrastructure.gas', !values.infrastructure?.gas)
                        }
                        containerClassName="py-[0px]"
                      />
                    </Conditional>

                    <Conditional condition={isLand}>
                      <CheckboxRow
                        label={'Sewage'}
                        checked={values.infrastructure?.sewage ?? false}
                        onToggle={() =>
                          setFieldValue('infrastructure.sewage', !values.infrastructure?.sewage)
                        }
                        containerClassName="py-[0px]"
                      />
                    </Conditional>

                    <Conditional condition={isLand}>
                      <CheckboxRow
                        label={'Internet available'}
                        checked={values.infrastructure?.internetAvailable ?? false}
                        onToggle={() =>
                          setFieldValue(
                            'infrastructure.internetAvailable',
                            !values.infrastructure?.internetAvailable
                          )
                        }
                        containerClassName="py-[0px]"
                      />
                    </Conditional>

                    <Conditional condition={isLand}>
                      <CheckboxRow
                        label={'Road access'}
                        checked={values.roadAccess?.roadAccess ?? false}
                        onToggle={() =>
                          setFieldValue('roadAccess.roadAccess', !values.roadAccess?.roadAccess)
                        }
                        containerClassName="py-[0px]"
                      />
                    </Conditional>

                    <Conditional condition={isCommercialSpace}>
                      <CheckboxRow
                        label={t('announcement.rent.hvac')}
                        checked={values.facilities?.coolingHvac ?? false}
                        onToggle={() =>
                          setFieldValue('facilities.coolingHvac', !values.facilities?.coolingHvac)
                        }
                        containerClassName="py-[0px]"
                      />
                    </Conditional>

                    <Conditional condition={isApartment}>
                      <CheckboxRow
                        label={t('announcement.rent.balcony')}
                        checked={values.amenities?.balcony ?? false}
                        onToggle={() =>
                          setFieldValue('amenities.balcony', !values.amenities?.balcony)
                        }
                        containerClassName="py-[0px]"
                      />
                    </Conditional>

                    <Conditional condition={isApartment || isHouse}>
                      <CheckboxRow
                        label={t('announcement.rent.off_street_parking')}
                        checked={values.amenities?.offStreetParking ?? false}
                        onToggle={() =>
                          setFieldValue(
                            'amenities.offStreetParking',
                            !values.amenities?.offStreetParking
                          )
                        }
                        containerClassName="py-[0px]"
                      />
                    </Conditional>

                    <Conditional condition={isGarage}>
                      <CheckboxRow
                        label={t('announcement.rent.off_street_parking')}
                        checked={values.parking ?? false}
                        onToggle={() => setFieldValue('parking', !values.parking)}
                        containerClassName="py-[0px]"
                      />
                    </Conditional>

                    <Conditional condition={isHouse}>
                      <CheckboxRow
                        label={t('announcement.rent.attached_garage')}
                        checked={values.amenities?.attachedGarage ?? false}
                        onToggle={() =>
                          setFieldValue(
                            'amenities.attachedGarage',
                            !values.amenities?.attachedGarage
                          )
                        }
                        containerClassName="py-[0px]"
                      />
                    </Conditional>
                  </View>

                  <View className="mb-[16px] gap-4">
                    <Conditional condition={isHouse}>
                      <CheckboxRow
                        label={t('announcement.rent.detached_garage')}
                        checked={values.amenities?.detachedGarage ?? false}
                        onToggle={() =>
                          setFieldValue(
                            'amenities.detachedGarage',
                            !values.amenities?.detachedGarage
                          )
                        }
                        containerClassName="py-[0px]"
                      />
                    </Conditional>

                    <Conditional condition={isHouse || isApartment}>
                      <CheckboxRow
                        label={t('announcement.rent.washer_and_laundry')}
                        checked={values.amenities?.washerLaundry ?? false}
                        onToggle={() =>
                          setFieldValue('amenities.washerLaundry', !values.amenities?.washerLaundry)
                        }
                        containerClassName="py-[0px]"
                      />
                    </Conditional>

                    <Conditional condition={isApartment}>
                      <CheckboxRow
                        label={t('announcement.rent.elevator')}
                        checked={values.amenities?.elevator ?? false}
                        onToggle={() =>
                          setFieldValue('amenities.elevator', !values.amenities?.elevator)
                        }
                        containerClassName="py-[0px]"
                      />
                    </Conditional>

                    <Conditional condition={isCommercialSpace}>
                      <CheckboxRow
                        label={t('announcement.rent.elevator')}
                        checked={values.facilities?.elevator ?? false}
                        onToggle={() =>
                          setFieldValue('facilities.elevator', !values.facilities?.elevator)
                        }
                        containerClassName="py-[0px]"
                      />
                    </Conditional>

                    <Conditional condition={isApartment || isHouse}>
                      <CheckboxRow
                        label={t('announcement.rent.disabled_access')}
                        checked={values.amenities?.disabledAccess ?? false}
                        onToggle={() =>
                          setFieldValue(
                            'amenities.disabledAccess',
                            !values.amenities?.disabledAccess
                          )
                        }
                        containerClassName="py-[0px]"
                      />
                    </Conditional>

                    <Conditional condition={isCommercialSpace}>
                      <CheckboxRow
                        label={t('announcement.rent.disabled_access')}
                        checked={values.disabledAccess ?? false}
                        onToggle={() => setFieldValue('disabledAccess', !values.disabledAccess)}
                        containerClassName="py-[0px]"
                      />
                    </Conditional>

                    <Conditional condition={isGarage || isParkingSpace}>
                      <CheckboxRow
                        label={t('24/7 access')}
                        checked={values.securityAccess?.access247 ?? false}
                        onToggle={() =>
                          setFieldValue(
                            'securityAccess.access247',
                            !values.securityAccess?.access247
                          )
                        }
                        containerClassName="py-[0px]"
                      />
                    </Conditional>

                    <Conditional condition={isGarage || isParkingSpace}>
                      <CheckboxRow
                        label={t('Gated entry')}
                        checked={values.securityAccess?.gatedEntry ?? false}
                        onToggle={() =>
                          setFieldValue(
                            'securityAccess.gatedEntry',
                            !values.securityAccess?.gatedEntry
                          )
                        }
                        containerClassName="py-[0px]"
                      />
                    </Conditional>

                    <Conditional condition={isGarage || isParkingSpace}>
                      <CheckboxRow
                        label={t('Remote control access')}
                        checked={values.securityAccess?.remoteControlAccess ?? false}
                        onToggle={() =>
                          setFieldValue(
                            'securityAccess.remoteControlAccess',
                            !values.securityAccess?.remoteControlAccess
                          )
                        }
                        containerClassName="py-[0px]"
                      />
                    </Conditional>

                    <Conditional condition={isGarage || isParkingSpace}>
                      <CheckboxRow
                        label={t('Security guard')}
                        checked={values.securityAccess?.securityGuard ?? false}
                        onToggle={() =>
                          setFieldValue(
                            'securityAccess.securityGuard',
                            !values.securityAccess?.securityGuard
                          )
                        }
                        containerClassName="py-[0px]"
                      />
                    </Conditional>

                    <Conditional condition={isGarage || isParkingSpace}>
                      <CheckboxRow
                        label={t('Security / CCTV)')}
                        checked={values.securityAccess?.securityCctv ?? false}
                        onToggle={() =>
                          setFieldValue(
                            'securityAccess.securityCctv',
                            !values.securityAccess?.securityCctv
                          )
                        }
                        containerClassName="py-[0px]"
                      />
                    </Conditional>

                    <Conditional condition={isGarage}>
                      <CheckboxRow
                        label={t('Remote automatic door')}
                        checked={values.remoteAutomaticDoor ?? false}
                        onToggle={() =>
                          setFieldValue('remoteAutomaticDoor', !values.remoteAutomaticDoor)
                        }
                        containerClassName="py-[0px]"
                      />
                    </Conditional>

                    <Conditional condition={isGarage}>
                      <CheckboxRow
                        label={t('Motorcycle / Bicycle allowed')}
                        checked={values.motorcycleBicycleAllowed ?? false}
                        onToggle={() =>
                          setFieldValue(
                            'motorcycleBicycleAllowed',
                            !values.motorcycleBicycleAllowed
                          )
                        }
                        containerClassName="py-[0px]"
                      />
                    </Conditional>

                    <Conditional condition={isCommercialSpace}>
                      <CheckboxRow
                        label={t('Heating')}
                        checked={values.facilities?.heating ?? false}
                        onToggle={() =>
                          setFieldValue('facilities.heating', !values.facilities?.heating)
                        }
                        containerClassName="py-[0px]"
                      />
                    </Conditional>

                    <Conditional condition={isCommercialSpace}>
                      <CheckboxRow
                        label={t('Ventilation system')}
                        checked={values.facilities?.ventilationSystem ?? false}
                        onToggle={() =>
                          setFieldValue(
                            'facilities.ventilationSystem',
                            !values.facilities?.ventilationSystem
                          )
                        }
                        containerClassName="py-[0px]"
                      />
                    </Conditional>

                    <Conditional condition={isCommercialSpace}>
                      <CheckboxRow
                        label={t('Fire safety system')}
                        checked={values.facilities?.fireSafetySystem ?? false}
                        onToggle={() =>
                          setFieldValue(
                            'facilities.fireSafetySystem',
                            !values.facilities?.fireSafetySystem
                          )
                        }
                        containerClassName="py-[0px]"
                      />
                    </Conditional>

                    <Conditional condition={isCommercialSpace}>
                      <CheckboxRow
                        label={t('Sprinklers')}
                        checked={values.facilities?.sprinklers ?? false}
                        onToggle={() =>
                          setFieldValue('facilities.sprinklers', !values.facilities?.sprinklers)
                        }
                        containerClassName="py-[0px]"
                      />
                    </Conditional>

                    <Conditional condition={isCommercialSpace}>
                      <CheckboxRow
                        label={t('Reception/Concierge')}
                        checked={values.facilities?.receptionConcierge ?? false}
                        onToggle={() =>
                          setFieldValue(
                            'facilities.receptionConcierge',
                            !values.facilities?.receptionConcierge
                          )
                        }
                        containerClassName="py-[0px]"
                      />
                    </Conditional>

                    <Conditional condition={isCommercialSpace}>
                      <CheckboxRow
                        label={t('Internet connectivity')}
                        checked={values.facilities?.internetConnectivity ?? false}
                        onToggle={() =>
                          setFieldValue(
                            'facilities.internetConnectivity',
                            !values.facilities?.internetConnectivity
                          )
                        }
                        containerClassName="py-[0px]"
                      />
                    </Conditional>

                    <Conditional condition={isCommercialSpace}>
                      <CheckboxRow
                        label={t('Server room')}
                        checked={values.facilities?.serverRoom ?? false}
                        onToggle={() =>
                          setFieldValue('facilities.serverRoom', !values.facilities?.serverRoom)
                        }
                        containerClassName="py-[0px]"
                      />
                    </Conditional>

                    <Conditional condition={isCommercialSpace}>
                      <CheckboxRow
                        label={t('Kitchenette')}
                        checked={values.facilities?.kitchenette ?? false}
                        onToggle={() =>
                          setFieldValue('facilities.kitchenette', !values.facilities?.kitchenette)
                        }
                        containerClassName="py-[0px]"
                      />
                    </Conditional>

                    <Conditional condition={isHouse}>
                      <CheckboxRow
                        label={t('Terrace')}
                        checked={values.terrace ?? false}
                        onToggle={() => setFieldValue('terrace', !values.terrace)}
                        containerClassName="py-[0px]"
                      />
                    </Conditional>

                    <Conditional condition={isHouse}>
                      <CheckboxRow
                        label={t('Garden/Yard')}
                        checked={values.gardenYard ?? false}
                        onToggle={() => setFieldValue('gardenYard', !values.gardenYard)}
                        containerClassName="py-[0px]"
                      />
                    </Conditional>

                    <Conditional condition={isLand}>
                      <View className="mb-[8px] rounded-[12px] bg-muted p-4">
                        <ChipGroup
                          label={'Road type'}
                          options={[
                            { label: 'Asphalt', value: 'ASPHALT' },
                            { label: 'Gravel', value: 'GRAVEL' },
                            { label: 'Dirt road', value: 'DIRT_ROAD' },
                          ]}
                          value={values.roadAccess?.roadType || ''}
                          onChange={(v) => setFieldValue('roadAccess.roadType', v)}
                        />
                      </View>
                    </Conditional>
                  </View>

                  <View className="mb-[8px] gap-4">
                    <Conditional condition={isApartment || isHouse}>
                      <CheckboxRow
                        label={t('announcement.rent.ev_charging_station')}
                        checked={values.amenities?.evChargingStation ?? false}
                        onToggle={() =>
                          setFieldValue(
                            'amenities.evChargingStation',
                            !values.amenities?.evChargingStation
                          )
                        }
                        containerClassName="py-[0px]"
                      />
                    </Conditional>

                    <Conditional condition={isGarage || isParkingSpace}>
                      <CheckboxRow
                        label={t('announcement.rent.ev_charging_station')}
                        checked={values.evChargingStation ?? false}
                        onToggle={() =>
                          setFieldValue('evChargingStation', !values.evChargingStation)
                        }
                        containerClassName="py-[0px]"
                      />
                    </Conditional>

                    <Conditional condition={isApartment || isHouse}>
                      <CheckboxRow
                        label={t('announcement.rent.bicycle_storage')}
                        checked={values.amenities?.bicycleStorage ?? false}
                        onToggle={() =>
                          setFieldValue(
                            'amenities.bicycleStorage',
                            !values.amenities?.bicycleStorage
                          )
                        }
                        containerClassName="py-[0px]"
                      />
                    </Conditional>

                    <Conditional condition={isCommercialSpace}>
                      <Input
                        label={t('Restrooms count')}
                        numericOnly
                        value={`${values.facilities?.restroomsCount || ''}`}
                        onChangeText={(v) => setFieldValue('facilities.restroomsCount', Number(v))}
                        keyboardType="number-pad"
                      />
                    </Conditional>
                  </View>

                  <Conditional condition={isApartment || isHouse}>
                    <View className="mb-[8px] rounded-[12px] bg-muted p-4">
                      <ChipGroup
                        label={t('announcement.rent.condition')}
                        options={getConditionOptions(t)}
                        value={values.ownershipAndCondition?.condition || ''}
                        onChange={(v) => setFieldValue('ownershipAndCondition.condition', v)}
                      />
                    </View>
                  </Conditional>

                  <Conditional condition={isApartment || isHouse}>
                    <Select
                      label={t('announcement.rent.year_built')}
                      placeholder=""
                      value={`${values.building?.yearBuilt || ''}`}
                      onChange={(v) => setFieldValue('building.yearBuilt', Number(v))}
                      options={YEAR_BUILT_OPTIONS}
                      containerClassName="mb-1"
                    />
                  </Conditional>

                  <Conditional condition={isApartment || isHouse}>
                    <View className="my-[8px] rounded-[12px] bg-muted p-4">
                      <ChipGroup
                        label={t('announcement.rent.ownership_type')}
                        options={getOwnershipTypeOptions(t)}
                        value={values.ownershipAndCondition?.ownershipType || ''}
                        onChange={(v) => setFieldValue('ownershipAndCondition.ownershipType', v)}
                      />
                    </View>
                  </Conditional>

                  <Conditional condition={isApartment || isHouse}>
                    <View className="gap-4">
                      <ThemedText className="text-[14px] font-bold text-foreground">
                        {t('announcement.rent.pets_allowed')}
                      </ThemedText>

                      <CheckboxRow
                        label={t('announcement.rent.pet_cat')}
                        checked={values.pets?.cat ?? false}
                        onToggle={() => setFieldValue('pets.cat', !values.pets?.cat)}
                        containerClassName="py-[0px]"
                      />

                      <CheckboxRow
                        label={t('announcement.rent.pet_small_dogs')}
                        checked={values.pets?.smallDogs ?? false}
                        onToggle={() => setFieldValue('pets.smallDogs', !values.pets?.smallDogs)}
                        containerClassName="py-[0px]"
                      />

                      <CheckboxRow
                        label={t('announcement.rent.pet_large_dogs')}
                        checked={values.pets?.largeDogs ?? false}
                        onToggle={() => setFieldValue('pets.largeDogs', !values.pets?.largeDogs)}
                        containerClassName="py-[0px]"
                      />
                    </View>
                  </Conditional>
                </View>
              </View>
            </ScrollView>

            <AnnouncementFooter
              firstButtonLabel={t('common.next')}
              firstButtonDisabled={!isValid}
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
