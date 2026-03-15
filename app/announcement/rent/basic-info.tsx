import { Formik } from 'formik';
import React from 'react';
import { Alert, ScrollView, View } from 'react-native';
import * as Yup from 'yup';

import { AnnouncementFooter } from '@/components/announcement/announcement-footer';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AddressInput } from '@/components/ui/address-input';
import { CheckboxRow } from '@/components/ui/checkbox';
import { Select } from '@/components/ui/select';
import {
  LISTING_TYPE_OPTIONS,
  PROCESS_OPTIONS,
  PROPERTY_TYPE_OPTIONS,
} from '@/constants/announcement';
import { useAnnouncementForRentFormStore } from '@/store/announcementStore';
import type { RentForApartmentsFormStep1 } from '@/types/announcement';
import { router } from 'expo-router';

type BasicInfoFormValues = RentForApartmentsFormStep1;

const BasicInfoSchema = Yup.object().shape({
  geo: Yup.object()
    .shape({
      formattedAddress: Yup.string().required('Required'),
      country: Yup.string().required('Required'),
      province: Yup.string().required('Required'),
      locality: Yup.string().required('Required'),
      street: Yup.string().required('Required'),
    })
    .required('Required'),
  listingType: Yup.string().required('Required'),
  propertyType: Yup.string().required('Required'),
  processType: Yup.string().required('Required'),
});

export default function BasicInfoScreen() {
  const formData = useAnnouncementForRentFormStore((state) => state.formData);
  const updateFormData = useAnnouncementForRentFormStore((state) => state.updateFormData);
  const sendFormData = useAnnouncementForRentFormStore((state) => state.sendFormData);
  const nextStep = useAnnouncementForRentFormStore((state) => state.nextStep);
  let isNext = true;

  const initialValues: BasicInfoFormValues = {
    listingType: formData.listingType,
    geo: formData.geo,
    propertyType: formData.propertyType,
    processType: formData.processType,
    needPhotographer: formData.needPhotographer,
    needAssessmentExpert: formData.needAssessmentExpert,
  };

  const saveBasicInfo = async (values: BasicInfoFormValues) => {
    updateFormData({
      listingType: values.listingType,
      geo: values.geo,
      processType: values.processType,
      propertyType: values.propertyType,
      needPhotographer: values.needPhotographer,
      needAssessmentExpert: values.needAssessmentExpert,
    });

    if (isNext) {
      nextStep();
    } else {
      try {
        await sendFormData();
      } catch {
        Alert.alert('Error', 'Failed to send form data');
      } finally {
        router.push('/(tabs)');
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
      <Formik
        initialValues={initialValues}
        enableReinitialize
        onSubmit={saveBasicInfo}
        validationSchema={BasicInfoSchema}>
        {({ handleChange, handleSubmit, setFieldValue, values, errors, touched }) => (
          <>
            <ScrollView
              className="flex-1"
              contentContainerStyle={{ paddingBottom: 31 }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled">
              <View className="px-4 pt-[24px]">
                <ThemedText className="mb-6 text-[20px] font-bold text-foreground">
                  Basic info
                </ThemedText>

                <View className="gap-4">
                  <Select
                    label="Listing type"
                    placeholder="For rent"
                    value={values.listingType}
                    onChange={(v) => setFieldValue('listingType', v)}
                    options={LISTING_TYPE_OPTIONS}
                    containerClassName="mb-1"
                    error={
                      touched.listingType && errors.listingType ? errors.listingType : undefined
                    }
                  />

                  <AddressInput
                    label="Address"
                    placeholder="Enter address"
                    value={values.geo.formattedAddress}
                    onChangeText={handleChange('geo.formattedAddress')}
                    onSelectAddress={(geo) => setFieldValue('geo', geo)}
                    error={touched.geo && errors.geo ? 'Address is required' : undefined}
                    containerClassName="mb-1"
                  />

                  <Select
                    label="Property type"
                    placeholder="Apartments"
                    value={values.propertyType}
                    onChange={(v) => setFieldValue('propertyType', v)}
                    options={PROPERTY_TYPE_OPTIONS}
                    containerClassName="mb-1"
                    error={
                      touched.propertyType && errors.propertyType ? errors.propertyType : undefined
                    }
                  />

                  <Select
                    label="Process announcement"
                    placeholder="As individual"
                    value={values.processType}
                    onChange={(v) => setFieldValue('processType', v)}
                    options={PROCESS_OPTIONS}
                    containerClassName="mb-1"
                    error={
                      touched.processType && errors.processType ? errors.processType : undefined
                    }
                  />

                  <View className="mt-1">
                    <CheckboxRow
                      label="Do you need photographer services?"
                      checked={values.needPhotographer ?? false}
                      onToggle={() => setFieldValue('needPhotographer', !values.needPhotographer)}
                    />
                    <CheckboxRow
                      label="Do you need assessment expert services?"
                      checked={values.needAssessmentExpert ?? false}
                      onToggle={() =>
                        setFieldValue('needAssessmentExpert', !values.needAssessmentExpert)
                      }
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
