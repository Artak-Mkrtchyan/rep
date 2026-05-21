import { Formik } from 'formik';
import { TFunction } from 'i18next';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, TextInput, View } from 'react-native';

import { AnnouncementFooter } from '@/components/announcement/announcement-footer';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { InputError } from '@/components/ui/input/error';
import { InputLabel } from '@/components/ui/input/label';
import { useExitAnnouncementFlow, useHandleNextPress } from '@/hooks/use-announcement';
import { useScreenEdgePadding } from '@/hooks/use-screen-edge-padding';
import { useThemeValue } from '@/hooks/use-theme';
import { useAnnouncementForRentFormStore } from '@/store/announcementStore';
import { RentForApartmentsFormStep2 } from '@/types/announcement';
import * as Yup from 'yup';

const makeAnnouncementTitleSchema = (t: TFunction) =>
  Yup.object().shape({
    title: Yup.string()
      .required(t('add_application.validation.title_required'))
      .max(255, t('add_application.validation.title_max_length')),
  });

export default function AnnouncementTitleScreen() {
  const { t } = useTranslation();
  const validationSchema = useMemo(() => makeAnnouncementTitleSchema(t), [t]);
  const { horizontalStyle } = useScreenEdgePadding();
  const placeholderColor = useThemeValue('placeholder');
  const formData = useAnnouncementForRentFormStore((s) => s.formData);
  const isAnnouncementEdit = useAnnouncementForRentFormStore(
    (state) => state.metaData?.isAnnouncementEdit
  );
  const update = useAnnouncementForRentFormStore((s) => s.update);
  const nextStep = useHandleNextPress();
  const exitFlow = useExitAnnouncementFlow();
  const sendFormData = useAnnouncementForRentFormStore((state) => state.sendFormData);
  let isNext = true;

  const initialValues: RentForApartmentsFormStep2 = {
    title: formData.title,
  };

  const saveTitle = async (values: RentForApartmentsFormStep2) => {
    if (values.title) {
      const isChangeFields = values.title !== formData.title;

      update({
        formData: { title: values.title },
        metaData: isChangeFields ? { isChangeFields } : {},
      });
    }

    if (isNext) {
      nextStep();
    } else {
      try {
        await sendFormData();
        exitFlow();
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
      <Formik<RentForApartmentsFormStep2>
        initialValues={initialValues}
        enableReinitialize
        validationSchema={validationSchema}
        validateOnMount={true}
        onSubmit={saveTitle}>
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid }) => (
          <>
            <ScrollView
              className="flex-1"
              contentContainerStyle={{ paddingBottom: 31 }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              automaticallyAdjustKeyboardInsets>
              <View className="pt-[24px]" style={horizontalStyle}>
                <ThemedText className="mb-2 text-[16px] font-bold text-foreground">
                  {t('announcement.rent.title_heading')}
                </ThemedText>
                <ThemedText className="font-regular mb-4 text-[12px] text-muted-foreground">
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
                    numberOfLines={8}
                    textAlignVertical="top"
                    className={`font-regular min-h-[86px] w-full rounded-[12px] border bg-card px-3 py-3 text-[14px] text-foreground ${(touched.title || (values.title?.length ?? 0) > 255) && errors.title ? 'border-destructive' : 'border-default'}`}
                    style={{ paddingTop: 12 }}
                    accessibilityLabel={t('announcement.rent.title_heading')}
                    accessibilityHint={t('announcement.rent.title_hint')}
                  />
                  {(touched.title || (values.title?.length ?? 0) > 255) && errors.title ? (
                    <InputError>{errors.title}</InputError>
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
              hideSecondButton={isAnnouncementEdit}
            />
          </>
        )}
      </Formik>
    </ThemedView>
  );
}
