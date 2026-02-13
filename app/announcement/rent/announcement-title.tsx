import { router } from 'expo-router';
import { Formik } from 'formik';
import React from 'react';
import { ScrollView, TextInput, View } from 'react-native';

import { AnnouncementFooter } from '@/components/announcement/announcement-footer';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { InputLabel } from '@/components/ui/input/label';
import { ANNOUNCEMENT_ROUTES } from '@/constants/announcement';
import { useThemeValue } from '@/hooks/use-theme';
import { useAnnouncementForRentFormStore } from '@/store/announcementStore';
import { RentForApartmentsFormStep2 } from '@/types/announcement';

const TITLE_PLACEHOLDER = 'Type your message here';
const HELPER_TEXT =
  "Write a clear and attractive title for your property listing, e.g., 'Bright 2-Bedroom Apartment with Balcony in City Center'";

export default function AnnouncementTitleScreen() {
  const placeholderColor = useThemeValue('placeholder');
  const formData = useAnnouncementForRentFormStore((s) => s.formData);
  const { updateFormData } = useAnnouncementForRentFormStore();

  const initialValues: RentForApartmentsFormStep2 = {
    title: formData.title,
  };

  const saveTitle = (values: RentForApartmentsFormStep2) => {
    updateFormData({ title: values.title });
  };

  const handleNext = (handleSubmit: () => void) => {
    handleSubmit();
    router.push(ANNOUNCEMENT_ROUTES.RENT_PROPERTY_INFO_FIRST.path);
  };

  const handleSaveAndExit = (handleSubmit: () => void) => {
    handleSubmit();
    router.push('/(tabs)');
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
                  Announcement title
                </ThemedText>
                <ThemedText className="mb-6 text-[14px] text-muted-foreground">
                  {HELPER_TEXT}
                </ThemedText>

                <View className="gap-1">
                  <InputLabel>Title</InputLabel>
                  <TextInput
                    value={values.title}
                    onChangeText={handleChange('title')}
                    onBlur={handleBlur('title')}
                    placeholder={TITLE_PLACEHOLDER}
                    placeholderTextColor={placeholderColor}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    className="min-h-[120px] w-full rounded-[12px] border border-default bg-card px-3 py-3 text-[16px] text-foreground"
                    style={{ paddingTop: 12 }}
                    accessibilityLabel="Announcement title"
                    accessibilityHint="Enter the title for your property listing"
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
