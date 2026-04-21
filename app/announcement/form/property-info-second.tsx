import { router } from 'expo-router';
import { Formik } from 'formik';
import { TFunction } from 'i18next';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, TextInput, View } from 'react-native';

import { AnnouncementFooter } from '@/components/announcement/announcement-footer';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { InputLabel } from '@/components/ui/input/label';
import { useHandleNextPress } from '@/hooks/use-announcement';
import { useScreenEdgePadding } from '@/hooks/use-screen-edge-padding';
import { useThemeValue } from '@/hooks/use-theme';
import { useAnnouncementForRentFormStore } from '@/store/announcementStore';
import { RentForApartmentsFormStep3 } from '@/types/announcement';
import * as Yup from 'yup';

type DescriptionFormValues = { description: RentForApartmentsFormStep3['description'] };

const PROPERTY_TYPES_WITH_OPTIONAL_DESCRIPTION = ['GARAGE', 'COMMERCIAL_SPACE'] as const;

const makeDescriptionSchema = (t: TFunction, isDescriptionRequired: boolean) =>
  Yup.object().shape({
    description: isDescriptionRequired
      ? Yup.string()
          .required(t('add_application.validation.description_required'))
          .max(4000, t('add_application.validation.description_max_length'))
      : Yup.string().max(4000, t('add_application.validation.description_max_length')),
  });

export default function PropertyInfoSecondScreen() {
  const { t } = useTranslation();
  const propertyType = useAnnouncementForRentFormStore((s) => s.formData.propertyType);
  const isDescriptionRequired = !PROPERTY_TYPES_WITH_OPTIONAL_DESCRIPTION.includes(
    propertyType as (typeof PROPERTY_TYPES_WITH_OPTIONAL_DESCRIPTION)[number]
  );
  const validationSchema = useMemo(
    () => makeDescriptionSchema(t, isDescriptionRequired),
    [t, isDescriptionRequired]
  );
  const { horizontalStyle } = useScreenEdgePadding();
  const placeholderColor = useThemeValue('placeholder');
  const formData = useAnnouncementForRentFormStore((s) => s.formData);
  const updateFormData = useAnnouncementForRentFormStore((s) => s.updateFormData);
  const nextStep = useHandleNextPress();
  const sendFormData = useAnnouncementForRentFormStore((state) => state.sendFormData);
  let isNext = true;

  const initialValues: DescriptionFormValues = {
    description: formData.description,
  };

  const saveTitle = async (values: DescriptionFormValues) => {
    if (values.description) {
      updateFormData({ description: values.description });
    }

    if (isNext) {
      nextStep();
    } else {
      try {
        await sendFormData();
        router.back();
      } catch {
        Alert.alert(t('common.error'), t('error.failed_to_send_form'));
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
      <Formik<DescriptionFormValues>
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        validateOnMount={true}
        onSubmit={saveTitle}>
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid }) => (
          <>
            <ScrollView
              className="flex-1"
              contentContainerStyle={{ paddingBottom: 31 }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled">
              <View className="pt-[24px]" style={horizontalStyle}>
                <ThemedText className="mb-2 text-[16px] font-bold text-foreground">
                  {t('announcement.rent.describe_property')}
                </ThemedText>
                <ThemedText className="font-regular mb-4 text-[12px] text-muted-foreground">
                  {t('announcement.rent.describe_property_helper')}
                </ThemedText>

                <View className="gap-1">
                  <InputLabel required={isDescriptionRequired}>
                    {t('announcement.rent.property_description')}
                  </InputLabel>
                  <TextInput
                    value={values.description}
                    onChangeText={handleChange('description')}
                    onBlur={handleBlur('description')}
                    placeholder={t('announcement.rent.description_placeholder')}
                    placeholderTextColor={placeholderColor}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    className="font-regular min-h-[86px] w-full rounded-[12px] border border-default bg-card px-3 py-3 text-[14px] text-foreground"
                    style={{ paddingTop: 12 }}
                    accessibilityLabel="Announcement title"
                    accessibilityHint="Enter the title for your property listing"
                  />
                  {touched.description && errors.description ? (
                    <ThemedText className="mt-1 text-[12px] text-destructive">
                      {errors.description}
                    </ThemedText>
                  ) : null}
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
