import { Formik } from 'formik';
import { TFunction } from 'i18next';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import * as Yup from 'yup';

import { AnnouncementFooter } from '@/components/announcement/announcement-footer';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AddressInput } from '@/components/ui/address-input';
import { CheckboxRow } from '@/components/ui/checkbox';
import { Select } from '@/components/ui/select';
import {
  getListingTypeOptions,
  getProcessOptions,
  getPropertyTypeOptions,
} from '@/constants/announcement';
import { useExitAnnouncementFlow, useHandleNextPress } from '@/hooks/use-announcement';
import { useScreenEdgePadding } from '@/hooks/use-screen-edge-padding';
import { Language } from '@/lib/i18n/i18n';
import { useAnnouncementForRentFormStore } from '@/store/announcementStore';
import type { RentForApartmentsFormStep1 } from '@/types/announcement';

type BasicInfoFormValues = RentForApartmentsFormStep1;

/** LangFormDTO: at least one locale is filled with a non-empty string */
const langFormAtLeastOne = (message: string) =>
  Yup.object({
    ru: Yup.string(),
    en: Yup.string(),
    uz: Yup.string(),
  }).test('lang-form-at-least-one', message, (value) => {
    if (!value) return false;
    return [value.ru, value.en, value.uz].some((s) => typeof s === 'string' && s.trim().length > 0);
  });

const makeBasicInfoSchema = (t: TFunction) => {
  const addressRequired = t('add_application.validation.address_required');

  const geoSchema = Yup.object({
    formattedAddress: langFormAtLeastOne(addressRequired),
    country: langFormAtLeastOne(addressRequired),
    province: langFormAtLeastOne(addressRequired),
    locality: langFormAtLeastOne(addressRequired),
    street: langFormAtLeastOne(addressRequired),
    latitude: Yup.number().required(addressRequired),
    longitude: Yup.number().required(addressRequired),
  });

  return Yup.object().shape({
    geo: geoSchema.required(addressRequired),
    listingType: Yup.string().required(t('add_application.validation.listing_type_required')),
    propertyType: Yup.string().required(t('add_application.validation.property_type_required')),
    processType: Yup.string().required(t('add_application.validation.process_type_required')),
  });
};

export default function BasicInfoScreen() {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language as Language;
  const validationSchema = useMemo(() => makeBasicInfoSchema(t), [t]);

  const { horizontalStyle } = useScreenEdgePadding();
  const formData = useAnnouncementForRentFormStore((state) => state.formData);
  const updateFormData = useAnnouncementForRentFormStore((state) => state.updateFormData);
  const nextStep = useHandleNextPress();
  const exitFlow = useExitAnnouncementFlow();
  let isNext = true;

  const processType =
    formData.brokerAssignmentNeeded !== undefined
      ? formData.brokerAssignmentNeeded
        ? 'AS_BROKER'
        : 'AS_INDIVIDUAL'
      : '';

  const initialValues: BasicInfoFormValues = {
    listingType: formData.listingType,
    brokerAssignmentNeeded: formData.brokerAssignmentNeeded,
    geo: formData.geo,
    propertyType: formData.propertyType,
    processType,
    needPhotographer: formData.needPhotographer,
    needAssessmentExpert: formData.needAssessmentExpert,
    infrastructureObjects: formData.infrastructureObjects,
  };

  const saveBasicInfo = async (values: BasicInfoFormValues) => {
    updateFormData({
      listingType: values.listingType,
      geo: values.geo,
      processType: values.processType,
      propertyType: values.propertyType,
      needPhotographer: values.needPhotographer,
      needAssessmentExpert: values.needAssessmentExpert,
      infrastructureObjects: values.infrastructureObjects,
      brokerAssignmentNeeded: values.processType === 'AS_BROKER',
    });

    if (!isNext) {
      exitFlow();
      return;
    }

    nextStep(values.processType === 'AS_BROKER');
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
      <Formik
        initialValues={initialValues}
        enableReinitialize
        onSubmit={saveBasicInfo}
        validateOnMount={true}
        validationSchema={validationSchema}>
        {({ handleChange, handleSubmit, setFieldValue, values, errors, touched, isValid }) => (
          <>
            <ScrollView
              className="flex-1"
              contentContainerStyle={{ paddingBottom: 31 }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              automaticallyAdjustKeyboardInsets>
              <View className="pt-[24px]" style={horizontalStyle}>
                <View className="gap-4">
                  <ThemedText className="text-[16px] font-bold text-foreground">
                    {t('announcement.rent.basic_info')}
                  </ThemedText>

                  <Select
                    label={t('announcement.rent.listing_type')}
                    placeholder={t('announcement.rent.for_rent_placeholder')}
                    value={values.listingType}
                    onChange={(v) => setFieldValue('listingType', v)}
                    options={getListingTypeOptions(t)}
                    error={
                      touched.listingType && errors.listingType ? errors.listingType : undefined
                    }
                  />

                  <AddressInput
                    label={t('announcement.rent.address')}
                    placeholder={t('announcement.rent.enter_address')}
                    value={values.geo.formattedAddress[currentLanguage] || ''}
                    onChangeText={handleChange(`geo.formattedAddress.${currentLanguage}`)}
                    onSelectAddress={(geo) => {
                      setFieldValue('geo', geo.address);
                      setFieldValue('infrastructureObjects', geo.infrastructureObjects);
                    }}
                    error={
                      touched.geo && errors.geo
                        ? t('add_application.validation.address_required')
                        : undefined
                    }
                    lang={currentLanguage}
                  />

                  <Select
                    label={t('announcement.rent.property_type')}
                    placeholder={t('announcement.rent.apartments_placeholder')}
                    value={values.propertyType}
                    onChange={(v) => setFieldValue('propertyType', v)}
                    options={getPropertyTypeOptions(t)}
                    error={
                      touched.propertyType && errors.propertyType ? errors.propertyType : undefined
                    }
                  />

                  <Select
                    label={t('announcement.rent.process_announcement')}
                    placeholder={t('announcement.rent.as_individual_placeholder')}
                    value={values.processType}
                    onChange={(v) => setFieldValue('processType', v)}
                    options={getProcessOptions(t)}
                    error={
                      touched.processType && errors.processType ? errors.processType : undefined
                    }
                  />

                  <CheckboxRow
                    label={t('announcement.rent.need_photographer')}
                    checked={values.needPhotographer ?? false}
                    onToggle={() => setFieldValue('needPhotographer', !values.needPhotographer)}
                    containerClassName="py-[0px]"
                  />

                  <CheckboxRow
                    label={t('announcement.rent.need_assessment_expert')}
                    checked={values.needAssessmentExpert ?? false}
                    containerClassName="py-[0px]"
                    onToggle={() =>
                      setFieldValue('needAssessmentExpert', !values.needAssessmentExpert)
                    }
                  />
                </View>
              </View>
            </ScrollView>

            <AnnouncementFooter
              firstButtonLabel={t('common.next')}
              secondButtonLabel={t('common.save_and_exit')}
              firstButtonDisabled={!isValid}
              onNextPress={() => handleNext(handleSubmit)}
              onSaveAndExitPress={() => handleSaveAndExit(handleSubmit)}
            />
          </>
        )}
      </Formik>
    </ThemedView>
  );
}
