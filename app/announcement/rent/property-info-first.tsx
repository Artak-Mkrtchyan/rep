import { router } from 'expo-router';
import { Formik } from 'formik';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Yup from 'yup';

import { AnnouncementFooter } from '@/components/announcement/announcement-footer';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { ANNOUNCEMENT_ROUTES, BATHROOMS_OPTIONS, BEDROOMS_OPTIONS } from '@/constants/announcement';
import { useAnnouncementForRentFormStore } from '@/store/announcementStore';
import type { RentForApartmentsFormStep3 } from '@/types/announcement';

const SCREEN_TITLE = "Let's start creating your listing";
const SCREEN_SUBTITLE = "Add or review details about your property's size.";
const SQUARE_FOOTAGE_PLACEHOLDER = '1200';
const SQUARE_FOOTAGE_UNIT = 'm²';
const FOOTER_APPROX_HEIGHT = 152;

type PropertyInfoFormValues = RentForApartmentsFormStep3;

const PropertyInfoSchema = Yup.object().shape({
  //   area: Yup.string().required('Square footage is required'),
  //   bedrooms: Yup.string().required('Total bedrooms is required'),
  //   bathrooms: Yup.string().required('Total bathrooms is required'),
});

export default function PropertyInfoFirstScreen() {
  const insets = useSafeAreaInsets();
  const formData = useAnnouncementForRentFormStore((s) => s.formData);
  const { updateFormData } = useAnnouncementForRentFormStore();

  const footerPaddingBottom = insets.bottom > 0 ? insets.bottom : 24;
  const scrollPaddingBottom = FOOTER_APPROX_HEIGHT + footerPaddingBottom + 24;

  const initialValues: PropertyInfoFormValues = {
    area: formData.area,
    bedrooms: formData.bedrooms,
    bathrooms: formData.bathrooms,
    description: formData.description,
  };

  const savePropertyInfo = (values: PropertyInfoFormValues) => {
    updateFormData({
      area: values.area,
      bedrooms: values.bedrooms,
      bathrooms: values.bathrooms,
    });
  };

  const handleNext = (handleSubmit: () => void) => {
    handleSubmit();
    router.push(ANNOUNCEMENT_ROUTES.RENT_PROPERTY_INFO_SECOND.path);
  };

  const handleSaveAndExit = (handleSubmit: () => void) => {
    handleSubmit();
    router.push('/(tabs)');
  };

  return (
    <ThemedView className="flex-1">
      <Formik<PropertyInfoFormValues>
        initialValues={initialValues}
        enableReinitialize
        validationSchema={PropertyInfoSchema}
        onSubmit={savePropertyInfo}>
        {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => (
          <>
            <ScrollView
              className="flex-1"
              contentContainerStyle={{ paddingBottom: scrollPaddingBottom }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled">
              <View className="px-4 pt-6">
                <ThemedText className="mb-2 text-[20px] font-bold text-foreground">
                  {SCREEN_TITLE}
                </ThemedText>
                <ThemedText className="mb-6 text-[14px] text-muted-foreground">
                  {SCREEN_SUBTITLE}
                </ThemedText>

                <View className="gap-4">
                  <Input
                    label="Square footage"
                    placeholder={SQUARE_FOOTAGE_PLACEHOLDER}
                    value={values.area}
                    onChangeText={handleChange('area')}
                    onBlur={handleBlur('area')}
                    error={touched.area && errors.area ? errors.area : undefined}
                    right={
                      <ThemedText className="text-[16px] text-muted-foreground">
                        {SQUARE_FOOTAGE_UNIT}
                      </ThemedText>
                    }
                    containerClassName="mb-1"
                    keyboardType="numeric"
                    accessibilityLabel="Square footage"
                    accessibilityHint="Enter property area in square meters"
                  />

                  <Select
                    label="Total bedrooms"
                    placeholder="Select"
                    value={values.bedrooms}
                    onChange={(v) => setFieldValue('bedrooms', v)}
                    options={BEDROOMS_OPTIONS}
                    containerClassName="mb-1"
                  />

                  <Select
                    label="Total bathrooms"
                    placeholder="Select"
                    value={values.bathrooms}
                    onChange={(v) => setFieldValue('bathrooms', v)}
                    options={BATHROOMS_OPTIONS}
                    containerClassName="mb-1"
                  />
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
