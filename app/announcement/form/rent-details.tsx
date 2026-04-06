import { router } from 'expo-router';
import { Formik } from 'formik';
import React from 'react';
import { Alert, ScrollView, View } from 'react-native';
import * as Yup from 'yup';

import { AnnouncementFooter } from '@/components/announcement/announcement-footer';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Input } from '@/components/ui/input';
import { useScreenEdgePadding } from '@/hooks/use-screen-edge-padding';
import { useAnnouncementForRentFormStore } from '@/store/announcementStore';
import type { RentForApartmentsFormStep4 } from '@/types/announcement';
import { useTranslation } from 'react-i18next';

const MONTHLY_RENT_SUFFIX = '/month';
const CURRENCY_PREFIX = '$';
const SQUARE_METERS_SUFFIX = 'm²';

type RentDetailsFormValues = RentForApartmentsFormStep4;

/** When rentDetails is present, monthlyRent and securityDeposit are required. */
const RentDetailsSchema = Yup.object().shape({
  rentDetails: Yup.object()
    .optional()
    .nullable()
    .shape({
      monthlyRent: Yup.number().required('Required').typeError('Must be a number'),
    }),
});

export default function RentDetailsScreen() {
  const { t } = useTranslation();
  const { horizontalStyle } = useScreenEdgePadding();
  const formData = useAnnouncementForRentFormStore((s) => s.formData);
  const updateFormData = useAnnouncementForRentFormStore((s) => s.updateFormData);
  const nextStep = useAnnouncementForRentFormStore((state) => state.nextStep);
  const sendFormData = useAnnouncementForRentFormStore((state) => state.sendFormData);
  let isNext = true;

  const initialValues: RentDetailsFormValues = { rentDetails: formData.rentDetails };

  const saveRentDetails = async ({ rentDetails }: RentDetailsFormValues) => {
    if (rentDetails) {
      updateFormData({
        rentDetails: {
          monthlyRent: rentDetails.monthlyRent,
          securityDeposit: rentDetails.securityDeposit || 0,
        },
      });
    }

    if (isNext) {
      nextStep();
    } else {
      try {
        await sendFormData();
      } catch {
        Alert.alert('Error', 'Failed to send form data');
      } finally {
        router.back();
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
        validationSchema={RentDetailsSchema}
        validateOnMount={true}
        enableReinitialize
        onSubmit={saveRentDetails}>
        {({ setFieldValue, handleSubmit, values, errors, touched, isValid }) => (
          <>
            <ScrollView
              className="flex-1"
              contentContainerStyle={{ paddingBottom: 31 }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled">
              <View className="pt-6" style={horizontalStyle}>
                <ThemedText className="mb-2 text-[20px] font-bold text-foreground">
                  {t('announcement.rent.rent_details_title')}
                </ThemedText>
                <ThemedText className="mb-6 text-[14px] text-muted-foreground">
                  {t('announcement.rent.rent_details_subtitle')}
                </ThemedText>

                <View className="gap-4">
                  <Input
                    label={t('announcement.rent.monthly_rent')}
                    numericOnly
                    placeholder=""
                    value={`${values.rentDetails?.monthlyRent ?? ''}`}
                    onChangeText={(v) => setFieldValue('rentDetails.monthlyRent', Number(v))}
                    error={touched.rentDetails && errors.rentDetails ? 'Required' : undefined}
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
                    containerClassName="mb-1"
                    keyboardType="decimal-pad"
                    accessibilityLabel="Monthly rent"
                    accessibilityHint="Enter monthly rent amount in dollars"
                  />

                  <Input
                    label={t('announcement.rent.security_deposit')}
                    placeholder=""
                    numericOnly
                    value={`${values.rentDetails?.securityDeposit ?? ''}`}
                    onChangeText={(v) => setFieldValue('rentDetails.securityDeposit', Number(v))}
                    error={touched.rentDetails && errors.rentDetails ? 'Required' : undefined}
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
                    containerClassName="mb-1"
                    keyboardType="decimal-pad"
                    accessibilityLabel="Security deposit"
                    accessibilityHint="Optional. Enter security deposit amount in dollars"
                  />
                </View>
              </View>
            </ScrollView>

            <AnnouncementFooter
              firstButtonLabel="Next"
              firstButtonDisabled={!isValid}
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
