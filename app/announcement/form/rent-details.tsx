import { Formik } from 'formik';
import { TFunction } from 'i18next';
import React, { useMemo } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import * as Yup from 'yup';

import { AnnouncementFooter } from '@/components/announcement/announcement-footer';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Input } from '@/components/ui/input';
import { useExitAnnouncementFlow, useHandleNextPress } from '@/hooks/use-announcement';
import { useScreenEdgePadding } from '@/hooks/use-screen-edge-padding';
import { useAnnouncementForRentFormStore } from '@/store/announcementStore';
import type { RentForApartmentsFormStep4 } from '@/types/announcement';
import { useTranslation } from 'react-i18next';

const MONTHLY_RENT_SUFFIX = '/month';
const CURRENCY_PREFIX = '$';
const SQUARE_METERS_SUFFIX = 'm²';

type RentDetailsFormValues = RentForApartmentsFormStep4;

/** When rentDetails is present, monthlyRent is required. */
const makeRentDetailsSchema = (t: TFunction) =>
  Yup.object().shape({
    rentDetails: Yup.object()
      .optional()
      .nullable()
      .shape({
        monthlyRent: Yup.number()
          .required(t('add_application.validation.monthly_rent_required'))
          .typeError(t('add_application.validation.must_be_number')),
        securityDeposit: Yup.number()
          .optional()
          .nullable()
          .typeError(t('add_application.validation.must_be_number')),
      }),
  });

export default function RentDetailsScreen() {
  const { t } = useTranslation();
  const validationSchema = useMemo(() => makeRentDetailsSchema(t), [t]);
  const { horizontalStyle } = useScreenEdgePadding();
  const formData = useAnnouncementForRentFormStore((s) => s.formData);
  const updateFormData = useAnnouncementForRentFormStore((s) => s.updateFormData);
  const nextStep = useHandleNextPress();
  const exitFlow = useExitAnnouncementFlow();
  const sendFormData = useAnnouncementForRentFormStore((state) => state.sendFormData);
  let isNext = true;

  const initialValues: RentDetailsFormValues = { rentDetails: formData.rentDetails };

  const saveRentDetails = async ({ rentDetails }: RentDetailsFormValues) => {
    if (rentDetails) {
      updateFormData({
        rentDetails: {
          monthlyRent: Number(rentDetails.monthlyRent) || 0,
          securityDeposit: Number(rentDetails.securityDeposit) || 0,
        },
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
      <Formik<RentDetailsFormValues>
        initialValues={initialValues}
        validationSchema={validationSchema}
        validateOnMount={true}
        enableReinitialize
        onSubmit={saveRentDetails}>
        {({ setFieldValue, handleSubmit, values, errors, touched, isValid }) => (
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
                  {t('announcement.rent.rent_details_title')}
                </ThemedText>
                <ThemedText className="font-regular mb-4 text-[12px] text-muted-foreground">
                  {t('announcement.rent.rent_details_subtitle')}
                </ThemedText>

                <View className="gap-4">
                  <Input
                    label={t('announcement.rent.monthly_rent')}
                    numericOnly
                    placeholder=""
                    value={`${values.rentDetails?.monthlyRent ?? ''}`}
                    onChangeText={(v) => setFieldValue('rentDetails.monthlyRent', v)}
                    error={
                      touched.rentDetails && errors.rentDetails
                        ? t('add_application.validation.monthly_rent_required')
                        : undefined
                    }
                    left={
                      <ThemedText className="text-[16px] text-muted-foreground">
                        {CURRENCY_PREFIX}
                      </ThemedText>
                    }
                    right={
                      <ThemedText className="text-[16px] text-muted-foreground">
                        {MONTHLY_RENT_SUFFIX}
                      </ThemedText>
                    }
                    keyboardType="number-pad"
                    accessibilityLabel="Monthly rent"
                    accessibilityHint="Enter monthly rent amount in dollars"
                  />

                  <Input
                    label={t('announcement.rent.security_deposit')}
                    placeholder=""
                    numericOnly
                    value={`${values.rentDetails?.securityDeposit ?? ''}`}
                    onChangeText={(v) => setFieldValue('rentDetails.securityDeposit', v)}
                    left={
                      <ThemedText className="text-[16px] text-muted-foreground">
                        {CURRENCY_PREFIX}
                      </ThemedText>
                    }
                    right={
                      <ThemedText className="text-[16px] text-muted-foreground">
                        {SQUARE_METERS_SUFFIX}
                      </ThemedText>
                    }
                    keyboardType="number-pad"
                    accessibilityLabel="Security deposit"
                    accessibilityHint="Optional. Enter security deposit amount in dollars"
                  />
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
