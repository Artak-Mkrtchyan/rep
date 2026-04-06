import { Formik } from 'formik';
import React from 'react';
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
  ANNOUNCEMENT_ROUTES,
  getListingTypeOptions,
  getProcessOptions,
  getPropertyTypeOptions,
} from '@/constants/announcement';
import { useScreenEdgePadding } from '@/hooks/use-screen-edge-padding';
import { Language } from '@/lib/i18n/i18n';
import { useAnnouncementForRentFormStore } from '@/store/announcementStore';
import type { RentForApartmentsFormStep1 } from '@/types/announcement';
import { router } from 'expo-router';

type BasicInfoFormValues = RentForApartmentsFormStep1;

/** LangFormDTO: хотя бы одна локаль заполнена непустой строкой */
const langFormAtLeastOne = (message = 'Required') =>
  Yup.object({
    ru: Yup.string(),
    en: Yup.string(),
    uz: Yup.string(),
  }).test('lang-form-at-least-one', message, (value) => {
    if (!value) return false;
    return [value.ru, value.en, value.uz].some((s) => typeof s === 'string' && s.trim().length > 0);
  });

const geoSchema = Yup.object({
  formattedAddress: langFormAtLeastOne(),
  country: langFormAtLeastOne(),
  province: langFormAtLeastOne(),
  locality: langFormAtLeastOne(),
  street: langFormAtLeastOne(),
  latitude: Yup.number().required('Required'),
  longitude: Yup.number().required('Required'),
});

const BasicInfoSchema = Yup.object().shape({
  geo: geoSchema.required('Required'),
  listingType: Yup.string().required('Required'),
  propertyType: Yup.string().required('Required'),
  processType: Yup.string().required('Required'),
});

export default function BasicInfoScreen() {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language as Language;

  const { horizontalStyle } = useScreenEdgePadding();
  const formData = useAnnouncementForRentFormStore((state) => state.formData);
  const updateFormData = useAnnouncementForRentFormStore((state) => state.updateFormData);
  const nextStep = useAnnouncementForRentFormStore((state) => state.nextStep);
  let isNext = true;

  const processType = formData.brokerAssignmentNeeded ? 'AS_BROKER' : 'AS_INDIVIDUAL';

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
      router.push('/(tabs)');
      return;
    }

    if (values.processType === 'AS_BROKER') {
      router.replace(ANNOUNCEMENT_ROUTES.RENT_BROKER_LIST.path);
    } else {
      nextStep();
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
      <Formik
        initialValues={initialValues}
        enableReinitialize
        onSubmit={saveBasicInfo}
        validateOnMount={true}
        validationSchema={BasicInfoSchema}>
        {({ handleChange, handleSubmit, setFieldValue, values, errors, touched, isValid }) => (
          <>
            <ScrollView
              className="flex-1"
              contentContainerStyle={{ paddingBottom: 31 }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled">
              <View className="pt-[24px]" style={horizontalStyle}>
                <ThemedText className="mb-6 text-[20px] font-bold text-foreground">
                  {t('announcement.rent.basic_info')}
                </ThemedText>

                <View className="gap-4">
                  <Select
                    label={t('announcement.rent.listing_type')}
                    placeholder={t('announcement.rent.for_rent_placeholder')}
                    value={values.listingType}
                    onChange={(v) => setFieldValue('listingType', v)}
                    options={getListingTypeOptions(t)}
                    containerClassName="mb-1"
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
                    error={touched.geo && errors.geo ? t('validation.address_required') : undefined}
                    containerClassName="mb-1"
                    lang={currentLanguage}
                  />

                  <Select
                    label={t('announcement.rent.property_type')}
                    placeholder={t('announcement.rent.apartments_placeholder')}
                    value={values.propertyType}
                    onChange={(v) => setFieldValue('propertyType', v)}
                    options={getPropertyTypeOptions(t)}
                    containerClassName="mb-1"
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
                    containerClassName="mb-1"
                    error={
                      touched.processType && errors.processType ? errors.processType : undefined
                    }
                  />

                  <View className="mt-1">
                    <CheckboxRow
                      label={t('announcement.rent.need_photographer')}
                      checked={values.needPhotographer ?? false}
                      onToggle={() => setFieldValue('needPhotographer', !values.needPhotographer)}
                    />
                    <CheckboxRow
                      label={t('announcement.rent.need_assessment_expert')}
                      checked={values.needAssessmentExpert ?? false}
                      onToggle={() =>
                        setFieldValue('needAssessmentExpert', !values.needAssessmentExpert)
                      }
                    />
                  </View>
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
