import { router } from 'expo-router';
import { Formik } from 'formik';
import React from 'react';
import { Alert, ScrollView, View } from 'react-native';
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

const isFilled = (v: unknown) => v !== undefined && v !== null && v !== '';

const PropertyInfoSchema = Yup.object().shape({
  property: Yup.object().shape({
    areaM2: Yup.number().when(
      ['attributes.bedroomCount', 'attributes.bathroomCount'],
      (values: unknown[], schema: Yup.NumberSchema) => {
        const [bedroomCount, bathroomCount] = values;
        return isFilled(bedroomCount) || isFilled(bathroomCount)
          ? schema.required('Required').typeError('Must be a number')
          : schema;
      }
    ),
  }),
});

export default function PropertyInfoFirstScreen() {
  const insets = useSafeAreaInsets();
  const formData = useAnnouncementForRentFormStore((s) => s.formData);
  const sendFormData = useAnnouncementForRentFormStore((state) => state.sendFormData);
  const updateFormData = useAnnouncementForRentFormStore((state) => state.updateFormData);

  const footerPaddingBottom = insets.bottom > 0 ? insets.bottom : 24;
  const scrollPaddingBottom = FOOTER_APPROX_HEIGHT + footerPaddingBottom + 24;

  let isNext = true;

  const initialValues: PropertyInfoFormValues = { property: formData.property };

  const savePropertyInfo = async ({ property }: PropertyInfoFormValues) => {
    if (property && formData.propertyType) {
      updateFormData({
        property: {
          areaM2: property.areaM2 || 0,
          attributes: {
            ...property.attributes,
            type: formData.propertyType,
          },
          propertyType: formData.propertyType,
        },
      });
    }

    if (isNext) {
      router.replace(ANNOUNCEMENT_ROUTES.RENT_PROPERTY_INFO_SECOND.path);
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
      <Formik<PropertyInfoFormValues>
        initialValues={initialValues}
        validationSchema={PropertyInfoSchema}
        enableReinitialize
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
                    numericOnly
                    placeholder={SQUARE_FOOTAGE_PLACEHOLDER}
                    value={`${values.property?.areaM2 || ''}`}
                    onChangeText={(v) => setFieldValue('property.areaM2', Number(v))}
                    right={
                      <ThemedText className="text-[16px] text-muted-foreground">
                        {SQUARE_FOOTAGE_UNIT}
                      </ThemedText>
                    }
                    containerClassName="mb-1"
                    keyboardType="numeric"
                    accessibilityLabel="Square footage"
                    accessibilityHint="Enter property area in square meters"
                    error={touched.property && errors.property ? 'Required' : undefined}
                  />

                  <Select
                    label="Total bedrooms"
                    placeholder="Select"
                    value={`${values.property?.attributes?.bedroomCount}`}
                    onChange={(v) => setFieldValue('property.attributes.bedroomCount', Number(v))}
                    options={BEDROOMS_OPTIONS}
                    containerClassName="mb-1"
                  />

                  <Select
                    label="Total bathrooms"
                    placeholder="Select"
                    value={`${values.property?.attributes?.bathroomCount}`}
                    onChange={(v) => setFieldValue('property.attributes.bathroomCount', Number(v))}
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
