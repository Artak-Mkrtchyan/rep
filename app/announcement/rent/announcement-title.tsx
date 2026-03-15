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
import { RentForApartmentsFormStep2 } from '@/types/announcement';

export default function AnnouncementTitleScreen() {
  const { t } = useTranslation();
  const placeholderColor = useThemeValue('placeholder');
  const formData = useAnnouncementForRentFormStore((s) => s.formData);
  const updateFormData = useAnnouncementForRentFormStore((s) => s.updateFormData);
  const nextStep = useAnnouncementForRentFormStore((state) => state.nextStep);
  const sendFormData = useAnnouncementForRentFormStore((state) => state.sendFormData);
  let isNext = true;

  const initialValues: RentForApartmentsFormStep2 = {
    title: formData.title,
  };

  const saveTitle = async (values: RentForApartmentsFormStep2) => {
    if (values.title) {
      updateFormData({ title: values.title });
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
      <Formik<RentForApartmentsFormStep2>
        initialValues={initialValues}
        enableReinitialize
        onSubmit={saveTitle}>
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <>
            <ScrollView
              className="flex-1"
              contentContainerStyle={{ paddingBottom: 31 }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled">
              <View className="px-4 pt-[24px]">
                <ThemedText className="mb-2 text-[20px] font-bold text-foreground">
                  {t('announcement.rent.title_heading')}
                </ThemedText>
                <ThemedText className="mb-6 text-[14px] text-muted-foreground">
                  {t('announcement.rent.title_helper')}
                </ThemedText>

                <View className="gap-1">
                  <InputLabel>{t('announcement.rent.title_label')}</InputLabel>
                  <TextInput
                    value={values.title}
                    onChangeText={handleChange('title')}
                    onBlur={handleBlur('title')}
                    placeholder={t('announcement.rent.title_placeholder')}
                    placeholderTextColor={placeholderColor}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    className="min-h-[120px] w-full rounded-[12px] border border-default bg-card px-3 py-3 text-[16px] text-foreground"
                    style={{ paddingTop: 12 }}
                    accessibilityLabel={t('announcement.rent.title_heading')}
                    accessibilityHint={t('announcement.rent.title_hint')}
                  />
                  {touched.title && errors.title ? (
                    <ThemedText className="mt-1 text-[12px] text-destructive">
                      {errors.title}
                    </ThemedText>
                  ) : null}
                </View>
              </View>
            </ScrollView>

            <AnnouncementFooter
              firstButtonLabel={t('common.next')}
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
