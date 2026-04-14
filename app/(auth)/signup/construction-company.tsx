import { Formik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import * as Yup from 'yup';

import { AuthHeader } from '@/components/auth/auth-header';
import { AuthLayout } from '@/components/auth/auth-layout';
import { SignInFooter } from '@/components/auth/sign-in-footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AUTH_ROUTES, IMAGE_DIMENSIONS } from '@/constants/auth';
import { useSignUpContext } from '@/context/SignUpContext';
import { ERROR_MESSAGES, showErrorAlert } from '@/lib/error-handler';
import i18n from '@/lib/i18n/i18n';

import { DatePicker } from '@/components/ui/date-picker';
import { FileUpload } from '@/components/ui/file-upload';
import { NumberPicker } from '@/components/ui/number-picker';
import { PhoneInput } from '@/components/ui/phone-input';
import {
  applicationsService,
  ConstructionCompanyRegistrationRequest,
} from '@/lib/api/applications';
import { FULL_NAME_MAX_LENGTH, yupSchemas } from '@/lib/auth-validation';
import { router } from 'expo-router';

const ConstructionCompanySchema = Yup.object().shape({
  attachments: Yup.array()
    .min(1, () => i18n.t('validation.at_least_one_file'))
    .required(() => i18n.t('validation.required')),
  companyInfo: Yup.object().shape({
    certifiedOn: yupSchemas.certifiedOn,
    certifiedBy: Yup.string()
      .optional()
      .max(255, () => i18n.t('validation.max_length_255')),
    email: yupSchemas.email,
    name: Yup.string()
      .required(() => i18n.t('validation.required'))
      .max(255, () => i18n.t('validation.max_length_255')),
    phoneNumber: yupSchemas.phone,
    yearsOfActivity: Yup.number().required(() => i18n.t('validation.required')),
  }),
  managerInfo: Yup.object().shape({
    email: yupSchemas.email,
    fullName: yupSchemas.fullName,
    phoneNumber: yupSchemas.phoneOptional,
  }),
});

export default function ConstructionCompanySignUpScreen() {
  const { t } = useTranslation();
  const { data, resetData } = useSignUpContext();

  const handleContinue = async (
    values: ConstructionCompanyRegistrationRequest & {
      attachments: { id: string; uri: string; type?: string; name?: string }[];
    },
    { setSubmitting }: any
  ) => {
    try {
      const attachmentIds = values.attachments.map((attachment) => attachment.id);

      await applicationsService.constructionCompanyRegistration({
        attachmentIds,
        companyInfo: values.companyInfo,
        managerInfo: values.managerInfo,
      });

      resetData();

      router.push(AUTH_ROUTES.APPLICATION_SUBMITTED);
    } catch (error) {
      showErrorAlert(error, { fallback: ERROR_MESSAGES.SUBMIT_FAILED });
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoToLogin = () => {
    router.replace(AUTH_ROUTES.LOGIN);
  };


  return (
    <AuthLayout scrollable>
      <Formik
        initialValues={{
          attachments: [],
          attachmentIds: [],
          companyInfo: {
            certifiedBy: '',
            certifiedOn: '',
            email: '',
            name: '',
            phoneNumber: '',
            yearsOfActivity: 0,
          },
          managerInfo: {
            email: data.email || '',
            fullName: '',
            phoneNumber: '',
          },
        }}
        enableReinitialize
        validationSchema={ConstructionCompanySchema}
        onSubmit={handleContinue}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          setFieldTouched,
          values,
          errors,
          touched,
          isSubmitting,
        }) => (
          <View className="mb-10 mt-10 w-full">
            <AuthHeader
              title={t('signup.title')}
              imageSource={require('@/assets/images/icon-broker-illustration.svg')}
              imageWidth={IMAGE_DIMENSIONS.CONSTRUCTION_ILLUSTRATION.width}
              imageHeight={IMAGE_DIMENSIONS.CONSTRUCTION_ILLUSTRATION.height}
            />

            <View className="mt-10 w-full gap-5">
              <Input
                label={t('signup.construction_company.manager_email')}
                required
                value={values.managerInfo.email}
                helper={t('signup.construction_company.manager_email_helper')}
                disabled
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                error={
                  touched.managerInfo?.email && errors.managerInfo?.email
                    ? errors.managerInfo?.email
                    : undefined
                }
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />

              <Input
                label={t('signup.construction_company.manager_name')}
                required
                value={values.managerInfo.fullName}
                onChangeText={handleChange('managerInfo.fullName')}
                onBlur={handleBlur('managerInfo.fullName')}
                error={
                  touched.managerInfo?.fullName && errors.managerInfo?.fullName
                    ? errors.managerInfo.fullName
                    : undefined
                }
                placeholder=""
                maxLength={FULL_NAME_MAX_LENGTH}
              />

              <PhoneInput
                label={t('signup.construction_company.manager_mobile_number')}
                value={values.managerInfo.phoneNumber}
                onChangeText={(text) => setFieldValue('managerInfo.phoneNumber', text)}
                onBlur={handleBlur('managerInfo.phoneNumber')}
                error={
                  touched.managerInfo?.phoneNumber && errors.managerInfo?.phoneNumber
                    ? errors.managerInfo.phoneNumber
                    : undefined
                }
              />

              <Input
                label={t('signup.construction_company.company_email')}
                required
                value={values.companyInfo.email}
                onChangeText={handleChange('companyInfo.email')}
                onBlur={handleBlur('companyInfo.email')}
                error={
                  touched.companyInfo?.email && errors.companyInfo?.email
                    ? errors.companyInfo.email
                    : undefined
                }
                keyboardType="email-address"
                autoCapitalize="none"
                helper={t('signup.construction_company.company_email_helper')}
                autoCorrect={false}
              />

              <Input
                label={t('signup.construction_company.company_name')}
                required
                value={values.companyInfo.name}
                onChangeText={handleChange('companyInfo.name')}
                onBlur={handleBlur('companyInfo.name')}
                error={
                  touched.companyInfo?.name && errors.companyInfo?.name
                    ? errors.companyInfo.name
                    : undefined
                }
                placeholder=""
              />

              <PhoneInput
                label={t('signup.construction_company.mobile_number')}
                required
                value={values.companyInfo.phoneNumber}
                onChangeText={(text) => setFieldValue('companyInfo.phoneNumber', text)}
                onBlur={handleBlur('companyInfo.phoneNumber')}
                error={
                  touched.companyInfo?.phoneNumber && errors.companyInfo?.phoneNumber
                    ? errors.companyInfo.phoneNumber
                    : undefined
                }
              />

              <DatePicker
                label={t('signup.construction_company.certification_date')}
                required
                value={values.companyInfo.certifiedOn}
                onChange={(date) => setFieldValue('companyInfo.certifiedOn', date)}
                onBlur={() => setFieldTouched('companyInfo.certifiedOn', true, false)}
                maximumDate={new Date()}
                error={
                  touched.companyInfo?.certifiedOn && errors.companyInfo?.certifiedOn
                    ? errors.companyInfo.certifiedOn
                    : undefined
                }
              />

              <Input
                label={t('signup.construction_company.certified_by')}
                value={values.companyInfo.certifiedBy}
                onChangeText={handleChange('companyInfo.certifiedBy')}
                onBlur={handleBlur('companyInfo.certifiedBy')}
                error={
                  touched.companyInfo?.certifiedBy && errors.companyInfo?.certifiedBy
                    ? errors.companyInfo.certifiedBy
                    : undefined
                }
                placeholder=""
                maxLength={255}
              />

              <NumberPicker
                label={t('signup.construction_company.years_of_activity')}
                value={values.companyInfo.yearsOfActivity}
                onChange={(value) => setFieldValue('companyInfo.yearsOfActivity', value)}
                min={0}
                max={50}
                step={1}
                required
                error={
                  touched.companyInfo?.yearsOfActivity && errors.companyInfo?.yearsOfActivity
                    ? String(errors.companyInfo.yearsOfActivity)
                    : undefined
                }
              />

              <FileUpload
                label={t('signup.construction_company.files_upload')}
                hint={t('ui.upload_your_photo')}
                value={values.attachments}
                onChange={(attachments) => setFieldValue('attachments', attachments)}
                required
                error={
                  touched.attachments && errors.attachments ? String(errors.attachments) : undefined
                }
              />

              <Button
                disabled={Object.keys(errors).length !== 0 || isSubmitting}
                onPress={() => handleSubmit()}
                accessibilityLabel={t('common.continue')}>
                {isSubmitting ? t('common.submitting') : t('common.continue')}
              </Button>

              <SignInFooter
                onSignInPress={handleGoToLogin}
                showSignInLink
              />
            </View>
          </View>
        )}
      </Formik>
    </AuthLayout>
  );
}
