import { router } from 'expo-router';
import { Formik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, TextInput, View } from 'react-native';

import { AnnouncementFooter } from '@/components/announcement/announcement-footer';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { InputLabel } from '@/components/ui/input/label';
import { useThemeValue } from '@/hooks/use-theme';
import { useAnnouncementForRentFormStore } from '@/store/announcementStore';
import { RentForApartmentsFormStep3 } from '@/types/announcement';
import * as Yup from 'yup';

type DescriptionFormValues = { description: RentForApartmentsFormStep3['description'] };

const DescriptionSchema = Yup.object().shape({
  description: Yup.string().required('Required'),
});
export default function PropertyInfoSecondScreen() {
  const { t } = useTranslation();
  const placeholderColor = useThemeValue('placeholder');
  const formData = useAnnouncementForRentFormStore((s) => s.formData);
  const updateFormData = useAnnouncementForRentFormStore((s) => s.updateFormData);
  const nextStep = useAnnouncementForRentFormStore((state) => state.nextStep);
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
      } catch {
        Alert.alert(t('common.error'), t('error.failed_to_send_form'));
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
      <Formik<DescriptionFormValues>
        initialValues={initialValues}
        validationSchema={DescriptionSchema}
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
              <View className="px-4 pt-[24px]">
                <ThemedText className="mb-2 text-[20px] font-bold text-foreground">
                  {t('announcement.rent.describe_property')}
                </ThemedText>
                <ThemedText className="mb-6 text-[14px] text-muted-foreground">
                  {t('announcement.rent.describe_property_helper')}
                </ThemedText>

                <View className="gap-1">
                  <InputLabel>{t('announcement.rent.property_description')}</InputLabel>
                  <TextInput
                    value={values.description}
                    onChangeText={handleChange('description')}
                    onBlur={handleBlur('description')}
                    placeholder={t('announcement.rent.description_placeholder')}
                    placeholderTextColor={placeholderColor}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    className="min-h-[120px] w-full rounded-[12px] border border-default bg-card px-3 py-3 text-[16px] text-foreground"
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
