import { router } from 'expo-router';
import { Formik } from 'formik';
import { TFunction } from 'i18next';
import React, { useMemo } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import * as Yup from 'yup';

import { AnnouncementFooter } from '@/components/announcement/announcement-footer';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Input } from '@/components/ui/input';
import { useHandleNextPress } from '@/hooks/use-announcement';
import { useScreenEdgePadding } from '@/hooks/use-screen-edge-padding';
import { useAnnouncementForRentFormStore } from '@/store/announcementStore';
import type { RentForApartmentsFormStep4 } from '@/types/announcement';
import { useTranslation } from 'react-i18next';

const CURRENCY_PREFIX = '$';

type SaleDetailsFormValues = RentForApartmentsFormStep4;

const makeSaleDetailsSchema = (t: TFunction) =>
  Yup.object().shape({
    saleDetails: Yup.object()
      .shape({
        price: Yup.number()
          .required(t('add_application.validation.price_required'))
          .typeError(t('add_application.validation.must_be_number')),
      })
      .required(t('add_application.validation.price_required')),
  });

export default function SaleDetailsScreen() {
  const { t } = useTranslation();
  const validationSchema = useMemo(() => makeSaleDetailsSchema(t), [t]);
  const { horizontalStyle } = useScreenEdgePadding();
  const formData = useAnnouncementForRentFormStore((s) => s.formData);
  const updateFormData = useAnnouncementForRentFormStore((s) => s.updateFormData);
  const nextStep = useHandleNextPress();
  const sendFormData = useAnnouncementForRentFormStore((state) => state.sendFormData);
  let isNext = true;

  const initialValues: SaleDetailsFormValues = {
    saleDetails: formData.saleDetails ?? { price: undefined as unknown as number },
  };

  const saveSaleDetails = async ({ saleDetails }: SaleDetailsFormValues) => {
    if (saleDetails?.price != null) {
      updateFormData({
        saleDetails: { price: Number(saleDetails.price) },
      });
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
      <Formik<SaleDetailsFormValues>
        initialValues={initialValues}
        validationSchema={validationSchema}
        validateOnMount={true}
        enableReinitialize
        onSubmit={saveSaleDetails}>
        {({ setFieldValue, handleSubmit, values, errors, touched, isValid }) => (
          <>
            <ScrollView
              className="flex-1"
              contentContainerStyle={{ paddingBottom: 31 }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled">
              <View className="pt-[24px]" style={horizontalStyle}>
                <ThemedText className="mb-2 text-[16px] font-bold text-foreground">
                  {t('announcement.rent.sale_details_title')}
                </ThemedText>
                <ThemedText className="font-regular mb-4 text-[12px] text-muted-foreground">
                  {t('announcement.rent.sale_details_subtitle')}
                </ThemedText>

                <View className="gap-4">
                  <Input
                    label={t('announcement.rent.price')}
                    numericOnly
                    placeholder=""
                    value={`${values.saleDetails?.price ?? ''}`}
                    onChangeText={(v) =>
                      setFieldValue('saleDetails.price', v === '' ? undefined : Number(v))
                    }
                    error={
                      touched.saleDetails && (errors.saleDetails as { price?: string })?.price
                        ? (errors.saleDetails as { price?: string }).price
                        : undefined
                    }
                    left={
                      <ThemedText className="text-[16px] text-muted-foreground">
                        {CURRENCY_PREFIX}
                      </ThemedText>
                    }
                    keyboardType="number-pad"
                    accessibilityLabel="Sale price"
                    accessibilityHint="Enter sale price amount in dollars"
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
