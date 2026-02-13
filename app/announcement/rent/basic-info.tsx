import { router } from 'expo-router';
import { Formik } from 'formik';
import React from 'react';
import { ScrollView, View } from 'react-native';

import { AnnouncementFooter } from '@/components/announcement/announcement-footer';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CheckboxRow } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import {
  ANNOUNCEMENT_ROUTES,
  BATHROOMS_OPTIONS,
  LISTING_TYPE_OPTIONS,
  PROCESS_OPTIONS,
} from '@/constants/announcement';
import { useAnnouncementForRentFormStore } from '@/store/announcementStore';
import type { RentForApartmentsFormStep1 } from '@/types/announcement';

type BasicInfoFormValues = RentForApartmentsFormStep1 & { totalBathrooms: string };

export default function BasicInfoScreen() {
  const formData = useAnnouncementForRentFormStore((s) => s.formData);
  const { updateFormData } = useAnnouncementForRentFormStore();

  const initialValues: BasicInfoFormValues = {
    listingType: formData.listingType,
    address: formData.address,
    propertyType: formData.propertyType,
    processAnnouncement: formData.processAnnouncement,
    totalBathrooms: formData.bathrooms,
    needPhotographer: formData.needPhotographer,
    needAssessmentExpert: formData.needAssessmentExpert,
  };

  const saveBasicInfo = (values: BasicInfoFormValues) => {
    updateFormData({
      listingType: values.listingType,
      address: values.address,
      processAnnouncement: values.processAnnouncement,
      needPhotographer: values.needPhotographer,
      needAssessmentExpert: values.needAssessmentExpert,
      bathrooms: values.totalBathrooms,
    });
  };

  const handleNext = (handleSubmit: () => void) => {
    handleSubmit();
    router.push(ANNOUNCEMENT_ROUTES.RENT_ANNOUNCEMENT_TITLE.path);
  };

  const handleSaveAndExit = (handleSubmit: () => void) => {
    handleSubmit();
    router.push('/(tabs)');
  };

  return (
    <ThemedView className="flex-1">
      <Formik initialValues={initialValues} enableReinitialize onSubmit={saveBasicInfo}>
        {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => (
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
                  />

                  <Input
                    label="Address"
                    placeholder="Enter address"
                    value={values.address}
                    onChangeText={handleChange('address')}
                    onBlur={handleBlur('address')}
                    error={touched.address && errors.address ? errors.address : undefined}
                    containerClassName="mb-1"
                  />

                  <Select
                    label="Total bathrooms"
                    placeholder="Select"
                    value={values.totalBathrooms}
                    onChange={(v) => setFieldValue('totalBathrooms', v)}
                    options={BATHROOMS_OPTIONS}
                    containerClassName="mb-1"
                  />

                  <Select
                    label="Process announcement"
                    placeholder="As individual"
                    value={values.processAnnouncement}
                    onChange={(v) => setFieldValue('processAnnouncement', v)}
                    options={PROCESS_OPTIONS}
                    containerClassName="mb-1"
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
