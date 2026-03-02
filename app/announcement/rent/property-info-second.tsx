import { router } from 'expo-router';
import { Formik } from 'formik';
import React from 'react';
import { ScrollView, TextInput, View } from 'react-native';

import { AnnouncementFooter } from '@/components/announcement/announcement-footer';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { InputLabel } from '@/components/ui/input/label';
import { useThemeValue } from '@/hooks/use-theme';
import { useAnnouncementForRentFormStore } from '@/store/announcementStore';
import { RentForApartmentsFormStep3 } from '@/types/announcement';

const TITLE_PLACEHOLDER = 'Type your message here';
const HELPER_TEXT =
  'Write several sentences describing the upgrades and desirable features that will attract renters to your property.';

type DescriptionFormValues = { description: RentForApartmentsFormStep3['description'] };

export default function PropertyInfoSecondScreen() {
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
      await sendFormData();

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
      <Formik<DescriptionFormValues>
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
                  Describe the property
                </ThemedText>
                <ThemedText className="mb-6 text-[14px] text-muted-foreground">
                  {HELPER_TEXT}
                </ThemedText>

                <View className="gap-1">
                  <InputLabel>Property description</InputLabel>
                  <TextInput
                    value={values.description}
                    onChangeText={handleChange('description')}
                    onBlur={handleBlur('description')}
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
                  {touched.description && errors.description ? (
                    <ThemedText className="mt-1 text-[12px] text-destructive">
                      {errors.description}
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
